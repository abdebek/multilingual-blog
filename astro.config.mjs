import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Set to your Cloudflare Pages / custom domain for correct sitemap & OG URLs
  site: 'https://multilingual-blog.pages.dev',
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss'
    }
  },
  image: {
    domains: ['picsum.photos', 'images.unsplash.com'],
  },
  integrations: [
    sitemap()
  ],
});
