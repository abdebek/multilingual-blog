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
- **Search**: To test search locally, run `npm run build` followed by `npm run preview`.
- **CMS**: Uses Decap CMS with Netlify Identity. To remove it, delete the `public/admin` folder, `src/pages/admin/index.astro`, and the script in `src/layouts/Layout.astro`.

## Deployment to Netlify (CMS & GitHub Integration)

This template uses a **Headless CMS** workflow. When you save a post in the admin panel, it is committed directly to your GitHub repository, which then triggers a new site build.

Follow these steps for a complete setup:

1. **Push to GitHub**: Push your code to your own GitHub repository.
2. **Connect to Netlify**: Create a new site from Git on Netlify and select your repo.
3. **Enable Authentication (Identity)**:
   - In the Netlify dashboard, go to **Site configuration** > **Identity**.
   - Click **Enable Identity**.
   - Under **Registration preferences**, change to **Invite only** to secure your admin panel.
   - (Optional) Under **External providers**, click **Add provider** and select **Google** to enable Gmail login.
4. **Enable GitHub Access (Git Gateway)**:
   - In the same Identity settings, scroll down to **Services** > **Git Gateway**.
   - Click **Enable Git Gateway**. This authorizes the CMS to commit changes to your GitHub repository on your behalf.
5. **Access the Admin Panel**:
   - Visit `your-site-url.com/admin/`.
   - Log in using your email (you may need to "Invite" yourself from the Identity tab first).

## Form Handling

The contact form uses **Netlify Forms**. Submissions will automatically appear in your Netlify dashboard under the **Forms** tab.
