import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      lang: z.enum(['en', 'tr', 'ar']),
      image: z.union([image(), z.string().url()]).optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
