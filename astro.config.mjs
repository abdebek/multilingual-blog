import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://multilingual-blog.example.com',
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['picsum.photos', 'images.unsplash.com'],
  },
  integrations: [
    pagefind(),
    sitemap()
  ],
});