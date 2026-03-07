# Multilingual Blog Template (Astro)

A high-performance, SEO-optimized, and feature-rich multilingual blog starter built with **Astro**, **Tailwind CSS**, and **Decap CMS**.

## Features

- **Multilingual Support**: English, Turkish, and Arabic (RTL) out of the box.
- **Search**: Fast, client-side multilingual search using **Pagefind**.
- **RSS & Sitemaps**: Localized RSS feeds and SEO-ready metadata.
- **Dark Mode**: Built-in theme toggling.
- **CMS**: Pre-configured **Decap CMS** for easy content editing.
- **Performance**: Zero-weight layout (Netlify Identity loads only when needed).

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the CMS locally**:
   In a separate terminal, run the proxy server:
   ```bash
   npm run cms-proxy
   ```
   Then visit `http://localhost:4321/admin/`.

## CMS Configuration

This template uses **Decap CMS** with **Netlify Identity**. 

- **To change languages**: Update `src/i18n/ui.ts` and `public/admin/config.yml`.
- **To remove the CMS**: Simply delete the `public/admin` folder and the CMS script block in `src/layouts/Layout.astro`.

## Deployment

This template is optimized for **Netlify**:
1. Connect your repo to Netlify.
2. Enable **Netlify Identity** in the Netlify dashboard.
3. Add the **Git Gateway** service in Identity settings.
