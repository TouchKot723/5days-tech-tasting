import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const wiki = defineCollection({
  loader: glob({ base: "./src/content/wiki", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
    updatedAt: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { wiki };
