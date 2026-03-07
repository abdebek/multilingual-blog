import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://multilingual-blog.example.com',
  integrations: [
    tailwind(), 
    pagefind()
  ],
});