import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    lang: z.enum(['en', 'tr', 'ar']),
    image: image().optional(),
  })
});

export const collections = {
  blog: blogCollection,
};