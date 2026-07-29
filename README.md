# Multilingual Blog Template

A starter for blogs in English, Turkish, and Arabic (RTL). Built with **Astro 6**, **Tailwind CSS 4**, **Decap CMS** (GitHub OAuth), and **Cloudflare Pages**.

## Features

- **Static multilingual site** — `en` / `tr` / `ar` with RTL for Arabic  
- **Decap CMS** — edit Markdown in the browser; commits go to GitHub  
- **Search** — Pagefind (after `npm run build`)  
- **Contact form** — Cloudflare Email Service (`send_email` binding) via `/api/contact`  

- **Dark mode**, accessible nav, and privacy-friendly defaults  

## Quick start

```bash
npm install
npm run dev
```

Site: [http://localhost:4321](http://localhost:4321)

### Local CMS (no GitHub OAuth)

```bash
# terminal 1
npm run dev

# terminal 2
npm run cms-proxy
```

Open [http://localhost:4321/admin/](http://localhost:4321/admin/).  
`local_backend: true` in `public/admin/config.yml` writes to your local git tree.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.  
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → connect the repo.  
3. Build settings:

   | Setting | Value |
   |--------|--------|
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (repo root) |
   | Node version | `20` or newer (Environment variables → `NODE_VERSION=20`) |

4. Deploy. Note your `*.pages.dev` URL (and custom domain if you add one).

### Environment variables (Pages → Settings → Environment variables)

| Variable / binding | Required | Purpose |
|--------------------|----------|---------|
| `GITHUB_CLIENT_ID` | Production CMS | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | Production CMS | GitHub OAuth App secret |
| **`CONTACT_EMAIL` binding** | Contact email | Cloudflare `send_email` (see `wrangler.toml`) |
| `CONTACT_FROM_EMAIL` | With email binding | Verified sender, e.g. `contact@yourdomain.com` |
| `CONTACT_TO_EMAIL` | With email binding | Inbox for submissions |
| `FORM_WEBHOOK_URL` | Optional fallback | Zapier / Make / Discord webhook |
| `CONTACT_DEV_ACCEPT` | Optional | Set `1` to accept form posts without delivery (preview only) |
| `ALLOWED_ORIGINS` | Optional | Comma-separated origins for CORS on `/api/contact` |

Production build env for Astro (optional):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_CONTACT_ENDPOINT` | Override form URL (default `/api/contact`). Example Formspree: `https://formspree.io/f/xxxx` |

Also set **site URL** in `astro.config.mjs` (`site: 'https://your-domain.com'`) for correct sitemap/canonical/OG URLs.

### GitHub OAuth for Decap (production `/admin/`)

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.  
2. **Homepage URL:** `https://YOUR_DOMAIN`  
3. **Authorization callback URL:** `https://YOUR_DOMAIN/api/callback`  
4. Copy Client ID + secret into Cloudflare env vars above.  
5. Grant editors **write** access to `abdebek/multilingual-blog` (or change `repo` in `public/admin/config.yml`).  

OAuth routes (Pages Functions):

- `GET /api/auth` — start login  
- `GET /api/callback` — finish login and return token to Decap  

Local CMS does **not** need OAuth (`npm run cms-proxy`).

### Contact form (Cloudflare Email Service)

No third-party email API keys. Mail is sent with the **`send_email`** binding using Cloudflare’s structured Workers API  
([docs](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)).

1. Enable **Cloudflare Email Service** for your account/domain and **verify the sender domain**  
   (unverified domains return `E_SENDER_NOT_VERIFIED`).  
2. In this project, `wrangler.toml` declares:

   ```toml
   [[send_email]]
   name = "CONTACT_EMAIL"
   ```

   Or: **Pages → project → Settings → Bindings → Email Sending**, name `CONTACT_EMAIL`.  
3. Set env vars: `CONTACT_FROM_EMAIL` (on your verified domain), `CONTACT_TO_EMAIL`.  
4. Redeploy. Form POSTs JSON to `/api/contact`; visitor address is set as `replyTo`.

**Fallbacks**

- **Webhook:** `FORM_WEBHOOK_URL` — JSON `{ name, email, message, submittedAt }`  
- **Formspree:** `PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/your_form_id`  
- **Dev only:** `CONTACT_DEV_ACCEPT=1` (logs payload, no send)

## Project layout

```
public/admin/          Decap CMS UI + config.yml
functions/api/         Cloudflare Pages Functions (auth, callback, contact)
src/content/blog/      Markdown posts by language
src/pages/[lang]/      Routes
wrangler.toml          Pages project metadata
public/_redirects      Admin SPA rewrite for Pages
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Astro dev server |
| `npm run build` | Production build + Pagefind index |
| `npm run preview` | Preview `dist/` (static only; no Functions) |
| `npm run cms-proxy` | Local Decap backend (`decap-server`) |
| `npx wrangler pages dev dist` | Preview site **with** Functions (after build) |

## Removing the CMS

Delete `public/admin/`, and you can remove the GitHub OAuth env vars and `functions/api/auth.ts` + `callback.ts`.

## License

Use and adapt as you like for your own projects.
