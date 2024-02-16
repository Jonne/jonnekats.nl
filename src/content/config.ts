import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      date: z.date(),
      author: z.string(),
      image: image().optional(),
      tags: z.array(z.string()),
      description: z.string().optional(),
    })
 });

export const collections = {
  posts: postsCollection,
};