import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** External posts (e.g. on the Netlify blog) link out instead of rendering locally. */
    externalUrl: z.string().url().optional(),
    /** Short label shown in the grid, e.g. "New · Curriculum" or "Netlify Blog ↗". */
    meta: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    org: z.string(),
    dek: z.string(),
    order: z.number(),
    theme: z.enum(["red", "ink", "paper"]),
    facts: z.array(z.string()).min(1),
  }),
});

export const collections = { writing, caseStudies };
