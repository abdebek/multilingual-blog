# Multilingual Blog Template

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/abdebek/multilingual-blog)

A starter for building blogs in multiple languages. Manage your content without using a code editor. Built with Astro 5 and Tailwind CSS 4.

## Key Features

- **No Code Editor Required**: Write and publish posts using the integrated UI. Your content is automatically committed to your GitHub repository as Markdown.
- **Easy Setup and Hosting**: Connect your GitHub repository to Netlify for automated builds, free global hosting, and built-in form handling.
- **Integrated CMS**: Pre-configured Decap CMS provides a professional interface for writing posts and managing images.
- **Multilingual**: Support for English, Turkish, and Arabic (RTL) included. No hardcoded text in the UI.
- **Search**: Client-side search using Pagefind. (Works after the site is built).
- **Clean Design**: A professional interface using nature-themed placeholders instead of human photos.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Local development**:
   ```bash
   npm run dev
   ```

3. **Local CMS access**:
   Start the proxy server in a separate terminal:
   ```bash
   npm run cms-proxy
   ```
   Then visit `http://localhost:4321/admin/`.

## Configuration

- **Translations**: UI text is managed in `src/i18n/ui.ts`.
- **Search**: To test search on your machine, run `npm run build` followed by `npm run preview`.
- **CMS Removal**: To remove the CMS, delete the `public/admin` folder, `src/pages/admin/index.astro`, and the script in `src/layouts/Layout.astro`.

## Deployment to Netlify

This template uses a workflow where saving a post in the admin panel commits it to your GitHub repository, which triggers a new build of your site.

1. **Push your code** to a GitHub repository.
2. **Create a new site** on Netlify and connect it to your repository.
3. **Enable Identity**: Dashboard > Site configuration > Identity > Enable Identity. (We recommend setting registration to "Invite only").
4. **Enable Git Gateway**: Identity > Services > Git Gateway > Enable Git Gateway.
5. **Add Google Login** (Optional): Identity > External providers > Add provider > Google.

## Contact Form

The contact form uses **Netlify Forms**. Submissions are received automatically in your Netlify dashboard under the **Forms** tab.
