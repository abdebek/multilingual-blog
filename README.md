# GalacticPages

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/abdebek/multilingual-blog)

An AI-powered, multi-theme publishing platform built with Astro 6 and Tailwind CSS 4. Write and manage content without touching code, deploy globally on Netlify, and give readers a cosmic browsing experience.

**Live Demo:** [galacticpages.netlify.app](https://galacticpages.netlify.app)

## Key Features

- **AI Chat Assistant**: Client-side RAG chat powered by Transformers.js. Answers questions using your published blog posts — zero API costs, fully private, no server required.
- **Multi-Theme System**: Four distinct visual themes (Modern, Midnight, Forest, Galactic) switchable instantly via semantic CSS tokens.
- **Composable Cosmic Backgrounds**: Pluggable background system with multiple variants (Starfield, Gradient, Particles, None). Configurable via `COSMIC_VARIANT` env variable. Galactic cursor auto-enables when a cosmic variant is active.
- **Multilingual & RTL**: Full support for English, Turkish, and Arabic (RTL) with proper typography, alignment, and Cairo font for Arabic text.
- **Client-Side Search**: Fast full-text search powered by Pagefind. Works out of the box after building.
- **Integrated CMS**: Pre-configured Decap CMS for writing posts and managing images through a professional UI — changes commit directly to your Git repository.
- **Knowledge Base**: Build-time embedding generation from all blog posts enables semantic search and AI context retrieval.
- **Responsive & Accessible**: Semantic HTML, skip links, translated aria-labels, and keyboard-navigable components.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro](https://astro.build/) 6.2.1 (Static output) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4.2.1 with semantic tokens |
| Search | [Pagefind](https://pagefind.app/) 1.5.2 |
| AI | [@xenova/transformers](https://github.com/xenova/transformers.js) (CDN) — all-MiniLM-L6-v2 + flan-t5-small |
| CMS | [Decap CMS](https://decapcms.org/) (Netlify Identity + Git Gateway) |
| Hosting | [Netlify](https://netlify.com/) (automated builds, forms, identity) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (includes KB generation + search indexing)
npm run build

# Preview production build locally
npm run preview
```

### CMS Local Access

Start the proxy server in a separate terminal:

```bash
npm run cms-proxy
```

Then visit `http://localhost:4321/admin/`.

## Project Structure

```
├── public/                  # Static assets, favicon, CMS config
│   ├── admin/              # Decap CMS admin panel
│   └── kb/                 # Generated knowledge base + embeddings
├── scripts/
│   └── build-kb.mjs        # Build-time embedding generator
├── src/
│   ├── components/         # Astro components (Header, Footer, Chat, cosmic/, etc.)
│   │   └── cosmic/          # Pluggable cosmic background variants
│   ├── content/blog/       # Blog posts organized by language
│   ├── i18n/               # Translation files (EN, TR, AR)
│   ├── layouts/            # Base Layout.astro
│   ├── pages/[lang]/       # Language-routed pages
│   ├── styles/             # global.css, themes.css, typography.css
│   └── utils/              # i18n helpers, date formatting
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Configuration

### Translations

UI text is managed in `src/i18n/ui.ts` and `src/i18n/locales/*.json`. Add new languages by extending the `languages` object and creating a corresponding locale file.

### Themes

Themes are defined in `src/styles/themes.css` using CSS custom properties. The active theme is applied via `data-theme` on the `<html>` element. Add a new theme by creating a new `[data-theme="name"]` block and registering it in `ThemeSelector.astro`.

### Cosmic Variants

Cosmic background variants are pluggable components in `src/components/cosmic/variants/`. Available variants:

| Variant | Description | File |
|---------|-------------|------|
| `none` | No background effect (zero overhead) | `None.astro` |
| `gradient` | CSS-only radial gradient | `Gradient.astro` |
| `particles` | CSS-only dot pattern | `Particles.astro` |
| `starfield` | Animated nebulae, stars, and shooting stars | `Starfield.astro` |

Set the default variant via `COSMIC_VARIANT` in `.env`. Override per-page via the `variant` prop on `<CosmicBackground />`. The galactic cursor automatically engages when a non-`none` variant is active.

### Knowledge Base & AI Chat

The chat widget uses a Retrieval-Augmented Generation (RAG) pipeline:

1. **Build time**: `scripts/build-kb.mjs` reads all blog posts, splits them into chunks, and generates vector embeddings using `all-MiniLM-L6-v2`.
2. **Runtime**: When a user asks a question, the chat embeds the query, finds the most relevant chunks via cosine similarity, and feeds them as context to `flan-t5-small` for answer generation.

Models are loaded lazily from CDN on first chat open (~100MB total). All processing happens in the browser.

### Search

Pagefind indexes content automatically during `npm run build`. To test search locally, run `npm run build` followed by `npm run preview`.

### CMS Removal

To remove the CMS, delete the `public/admin` folder, `src/pages/admin/index.astro`, and the Netlify Identity script block in `src/layouts/Layout.astro`.

## Deployment to Netlify

1. **Push your code** to a GitHub repository.
2. **Create a new site** on Netlify and connect it to your repository.
3. **Enable Identity**: Dashboard > Site configuration > Identity > Enable Identity. (We recommend setting registration to "Invite only").
4. **Enable Git Gateway**: Identity > Services > Git Gateway > Enable Git Gateway.
5. **Add Google Login** (Optional): Identity > External providers > Add provider > Google.

## Contact Form

The contact form uses **Netlify Forms**. Submissions are received automatically in your Netlify dashboard under the **Forms** tab.

## License

MIT
