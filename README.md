# Multilingual Blog Template

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/abdebek/multilingual-blog)

A starter for building blogs in multiple languages. Built with Astro 5 and Tailwind CSS 4.

## Features

- **Languages**: English, Turkish, and Arabic (RTL) support.
- **Search**: Client-side search using Pagefind. (Requires build to work).
- **RSS**: Localized feeds for each language.
- **CMS**: Decap CMS pre-configured for local and production use.
- **Design**: Clean interface using nature-themed placeholders instead of human photos.
- **Dark Mode**: Support for light and dark themes.

## Getting Started

1. **Install**:
   ```bash
   npm install
   ```

2. **Develop**:
   ```bash
   npm run dev
   ```

3. **Use the CMS locally**:
   Start the proxy server in a separate terminal:
   ```bash
   npm run cms-proxy
   ```
   Then visit `http://localhost:4321/admin/`.

## Configuration

- **Translations**: Manage all UI text in `src/i18n/ui.ts`.
- **Search**: To test search locally, run:
  ```bash
  npm run build
  ```
  Followed by:
  ```bash
  npm run preview
  ```
- **CMS**: Uses Decap CMS with Netlify Identity. To remove it, delete the `public/admin` folder, `src/pages/admin/index.astro`, and the script in `src/layouts/Layout.astro`.

## Deployment

1. Connect your repository to Netlify.
2. Enable Netlify Identity in your site settings.
3. Enable Git Gateway under Identity > Services.
