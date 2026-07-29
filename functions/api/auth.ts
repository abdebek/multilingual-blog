/**
 * Decap CMS GitHub OAuth — start login (Cloudflare Pages Function).
 * Opens GitHub authorize URL; callback is /api/callback.
 *
 * Secrets (Cloudflare Pages → Settings → Environment variables):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET  (used in callback)
 */

interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

function html(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const clientId = context.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return html(
      500,
      `<!doctype html><html><body style="font-family:system-ui;padding:2rem">
        <h1>GitHub OAuth not configured</h1>
        <p>Set <code>GITHUB_CLIENT_ID</code> (and <code>GITHUB_CLIENT_SECRET</code>) in Cloudflare Pages environment variables.</p>
      </body></html>`
    );
  }

  const url = new URL(context.request.url);
  const origin = url.origin;
  const redirectUri = `${origin}/api/callback`;
  const state = crypto.randomUUID();

  // Cookie holds state for CSRF check on callback (HttpOnly)
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', 'repo,user');
  authorize.searchParams.set('state', state);

  const headers = new Headers({ Location: authorize.toString() });
  headers.append(
    'Set-Cookie',
    `gh_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  return new Response(null, { status: 302, headers });
};
