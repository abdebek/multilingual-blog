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

## Deployment to Netlify

This template is optimized for Netlify. Follow these steps for a complete setup:

1. **Push to GitHub**: Push your code to a GitHub repository.
2. **Create a Netlify Site**: Connect your repository to Netlify. The `netlify.toml` file will automatically configure the build settings.
3. **Enable Netlify Identity**:
   - Go to your site dashboard on Netlify.
   - Navigate to **Site configuration** > **Identity**.
   - Click **Enable Identity**.
   - Under **Registration preferences**, select **Invite only** (recommended for private blogs).
   - Under **Services** > **Git Gateway**, click **Enable Git Gateway**. This allows Decap CMS to save posts directly to your GitHub repo.
4. **Access the CMS**:
   - Once deployed, visit `your-site-url.com/admin/`.
   - You can now log in via the Netlify Identity widget and start writing!

## Form Handling

The contact form uses **Netlify Forms**. Submissions will automatically appear in your Netlify dashboard under the **Forms** tab.
