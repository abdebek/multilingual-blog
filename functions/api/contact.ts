/**
 * Contact form API (Cloudflare Pages Function).
 *
 * Delivery:
 * - CONTACT_EMAIL binding (Cloudflare Email Service) + CONTACT_FROM_EMAIL + CONTACT_TO_EMAIL
 * - CONTACT_DEV_ACCEPT=1 — accept without delivery (preview/local only)
 *
 * Docs: https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
 */

interface EmailMessageBuilder {
  to: string | { email: string; name?: string } | (string | { email: string; name?: string })[];
  from: string | { email: string; name?: string };
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | { email: string; name?: string };
}

interface EmailSendResult {
  messageId: string;
}

interface SendEmailBinding {
  send(message: EmailMessageBuilder): Promise<EmailSendResult>;
}

interface Env {
  CONTACT_EMAIL?: SendEmailBinding;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_DEV_ACCEPT?: string;
  ALLOWED_ORIGINS?: string;
}

const corsHeaders = (origin: string | null, allowed: string[]): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (origin && (allowed.length === 0 || allowed.includes(origin))) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Vary'] = 'Origin';
  }
  return headers;
};

function json(status: number, body: unknown, headers: HeadersInit): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get('Origin');
  const allowed = (context.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, allowed),
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get('Origin');
  const allowed = (context.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const headers = corsHeaders(origin, allowed);

  if (origin && allowed.length > 0 && !allowed.includes(origin)) {
    return json(403, { error: 'Origin not allowed' }, headers);
  }

  let name = '';
  let email = '';
  let message = '';
  let botField = '';

  const contentType = context.request.headers.get('Content-Type') || '';

  try {
    if (contentType.includes('application/json')) {
      const body = (await context.request.json()) as Record<string, string>;
      name = String(body.name || '').trim();
      email = String(body.email || '').trim();
      message = String(body.message || '').trim();
      botField = String(body['bot-field'] || body._gotcha || '').trim();
    } else {
      const form = await context.request.formData();
      name = String(form.get('name') || '').trim();
      email = String(form.get('email') || '').trim();
      message = String(form.get('message') || '').trim();
      botField = String(form.get('bot-field') || '').trim();
    }
  } catch {
    return json(400, { error: 'Invalid body' }, headers);
  }

  if (botField) {
    return json(200, { ok: true }, headers);
  }

  if (!name || !email || !message) {
    return json(400, { error: 'Missing fields' }, headers);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Invalid email' }, headers);
  }

  if (name.length > 200 || email.length > 320 || message.length > 10000) {
    return json(400, { error: 'Field too long' }, headers);
  }

  if (context.env.CONTACT_EMAIL && context.env.CONTACT_FROM_EMAIL && context.env.CONTACT_TO_EMAIL) {
    try {
      const result = await context.env.CONTACT_EMAIL.send({
        from: { email: context.env.CONTACT_FROM_EMAIL, name: 'Contact Form' },
        to: context.env.CONTACT_TO_EMAIL,
        replyTo: { email, name },
        subject: `Contact form: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}\n`,
      });
      return json(200, { ok: true, messageId: result?.messageId }, headers);
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      console.error('Cloudflare email send failed', err?.code, err?.message || e);

      if (err?.code === 'E_SENDER_NOT_VERIFIED' || err?.code === 'E_SENDER_DOMAIN_NOT_AVAILABLE') {
        return json(
          502,
          { error: 'Sender domain not verified for Cloudflare Email Service', code: err.code },
          headers
        );
      }
      if (err?.code === 'E_RECIPIENT_NOT_ALLOWED') {
        return json(
          502,
          { error: 'Recipient not allowed by send_email binding', code: err.code },
          headers
        );
      }
      if (err?.code === 'E_RATE_LIMIT_EXCEEDED' || err?.code === 'E_DAILY_LIMIT_EXCEEDED') {
        return json(429, { error: 'Email rate limit exceeded', code: err.code }, headers);
      }

      return json(502, { error: 'Email delivery failed', code: err?.code }, headers);
    }
  }

  if (context.env.CONTACT_EMAIL) {
    return json(
      501,
      {
        error:
          'CONTACT_EMAIL binding is set but CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL env vars are required.',
      },
      headers
    );
  }

  if (context.env.CONTACT_DEV_ACCEPT === '1') {
    console.log('CONTACT_DEV_ACCEPT', { name, email, message });
    return json(200, { ok: true, dev: true }, headers);
  }

  return json(
    501,
    {
      error:
        'Form backend not configured. Add send_email binding CONTACT_EMAIL plus CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.',
    },
    headers
  );
};
