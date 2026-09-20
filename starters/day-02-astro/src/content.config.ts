import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const wiki = defineCollection({
    //対象のディレクトリからmdをロード
    loader: glob({ pattern: "**/*.md", base: "./src/content/wiki" }),

    schema: z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        tags: z.array(z.string().min(1)).min(1),
        updatedAt: z.coerce.date(),
        draft: z.boolean().optional().default(false),
    }),
});


export const collections = { wiki };