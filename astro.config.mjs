import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://multilingual-blog.example.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    pagefind()
  ],
});