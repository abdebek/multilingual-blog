import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;

let kb = null;
let embedder = null;
let generator = null;

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

self.onmessage = async function(e) {
  const { type, id, payload } = e.data;

  if (type === 'LOAD') {
    try {
      self.postMessage({ type: 'STATUS', id, status: 'kb' });
      const kbRes = await fetch('/kb/knowledge-base.json');
      kb = await kbRes.json();

      self.postMessage({ type: 'STATUS', id, status: 'embedder' });
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

      self.postMessage({ type: 'STATUS', id, status: 'generator' });
      generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small');

      self.postMessage({ type: 'READY', id });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: err.message });
    }
  }

  if (type === 'ASK') {
    try {
      const { question } = payload;
      self.postMessage({ type: 'STATUS', id, status: 'retrieving' });

      const qEmbed = await embedder(question, { pooling: 'mean', normalize: true });
      const qVec = Array.from(qEmbed.data);

      const scored = kb.map(doc => ({
        ...doc,
        score: cosineSimilarity(qVec, doc.embedding),
      }));
      scored.sort((a, b) => b.score - a.score);
      const context = scored.slice(0, 3);

      const ctx = context.map(c => c.text).join('\n\n');
      const prompt = `Answer based on context.\nContext:\n${ctx}\n\nQuestion: ${question}\nAnswer:`;

      self.postMessage({ type: 'STATUS', id, status: 'generating' });
      const result = await generator(prompt, { max_new_tokens: 128, do_sample: false });
      const answer = result[0].generated_text;

      self.postMessage({ type: 'ANSWER', id, payload: { answer, context } });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: err.message });
    }
  }
};
