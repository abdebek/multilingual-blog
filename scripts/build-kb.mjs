import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline, env } from '@xenova/transformers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const OUTPUT_DIR = path.join(ROOT, 'public/kb');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'knowledge-base.json');

env.allowLocalModels = true;
env.allowRemoteModels = true;

function parseMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  // Normalize line endings
  const content = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const match = content.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) {
    console.warn(`  Could not parse frontmatter in ${filePath}`);
    return null;
  }

  const frontmatter = match[1];
  const body = match[2].trim();

  const meta = {};
  frontmatter.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      meta[key] = value;
    }
  });

  return { meta, body };
}

function chunkText(text, maxChars = 500) {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    const cleaned = para.replace(/#{1,6}\s+/g, '').trim();
    if (!cleaned) continue;

    if (current.length + cleaned.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = cleaned;
    } else {
      current += (current ? ' ' : '') + cleaned;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function buildKnowledgeBase() {
  console.log('Building knowledge base...');
  console.log(`Blog directory: ${BLOG_DIR}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory does not exist: ${BLOG_DIR}`);
    process.exit(1);
  }

  const documents = [];
  const langs = fs.readdirSync(BLOG_DIR);
  console.log(`Found languages: ${langs.join(', ')}`);

  for (const lang of langs) {
    const langDir = path.join(BLOG_DIR, lang);
    const stat = fs.statSync(langDir);
    if (!stat.isDirectory()) continue;

    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));
    console.log(`  ${lang}: ${files.length} files`);

    for (const file of files) {
      const filePath = path.join(langDir, file);
      const parsed = parseMarkdown(filePath);
      if (!parsed) continue;

      const slug = file.replace('.md', '');
      const url = `/${lang}/blog/${slug}`;
      const title = parsed.meta.title || '';
      const description = parsed.meta.description || '';

      const chunks = chunkText(parsed.body);
      if (description) chunks.unshift(description);

      for (const chunk of chunks) {
        documents.push({
          text: chunk,
          title,
          url,
          lang: parsed.meta.lang || lang,
        });
      }
    }
  }

  console.log(`Collected ${documents.length} chunks from blog posts`);

  if (documents.length === 0) {
    console.warn('No documents found. Writing empty knowledge base.');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([]));
    return;
  }

  console.log('Loading embedding model (this may take a minute on first run)...');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Generating embeddings...');
  const embeddings = [];
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const output = await embedder(doc.text, { pooling: 'mean', normalize: true });
    embeddings.push({
      ...doc,
      embedding: Array.from(output.data),
    });

    if ((i + 1) % 10 === 0 || i === documents.length - 1) {
      console.log(`  Processed ${i + 1}/${documents.length}`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(embeddings));
  console.log(`Knowledge base saved to ${OUTPUT_FILE} (${embeddings.length} entries)`);
}

buildKnowledgeBase().catch(err => {
  console.error('Failed to build knowledge base:', err);
  process.exit(1);
});
