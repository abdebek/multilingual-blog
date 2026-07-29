/**
 * Decap CMS GitHub OAuth — callback (Cloudflare Pages Function).
 * Exchanges code for token and posts result to window.opener (Decap protocol).
 */

interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

function page(scriptBody: string): Response {
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8" /><title>Logging in…</title></head>
<body>
<script>
${scriptBody}
</script>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'gh_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

function postMessageScript(message: string, origin: string): string {
  // Decap listens for: authorization:github:{status}:{json}
  const safe = JSON.stringify(message);
  const safeOrigin = JSON.stringify(origin);
  return `
(function () {
  var msg = ${safe};
  var targetOrigin = ${safeOrigin};
  function receive() {
    if (window.opener) {
      window.opener.postMessage(msg, targetOrigin);
      window.close();
    } else {
      document.body.textContent = "Login complete. You can close this window.";
    }
  }
  receive();
})();
`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;
  const url = new URL(context.request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = context.request.headers.get('Cookie') || '';
  const cookieState = cookie.match(/(?:^|;\s*)gh_oauth_state=([^;]+)/)?.[1];

  if (!clientId || !clientSecret) {
    return page(
      postMessageScript(
        'authorization:github:error:{"message":"OAuth env vars missing"}',
        origin
      )
    );
  }

  if (!code || !state || !cookieState || state !== cookieState) {
    return page(
      postMessageScript(
        'authorization:github:error:{"message":"Invalid OAuth state"}',
        origin
      )
    );
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });

    const tokenJson = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenRes.ok || !tokenJson.access_token) {
      const err = tokenJson.error_description || tokenJson.error || 'token exchange failed';
      return page(
        postMessageScript(
          `authorization:github:error:${JSON.stringify({ message: err })}`,
          origin
        )
      );
    }

    const success = {
      token: tokenJson.access_token,
      provider: 'github',
    };

    return page(
      postMessageScript(`authorization:github:success:${JSON.stringify(success)}`, origin)
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'OAuth error';
    return page(
      postMessageScript(
        `authorization:github:error:${JSON.stringify({ message })}`,
        origin
      )
    );
  }
};
