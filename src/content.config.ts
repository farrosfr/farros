import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Native long-form essay collection. Lives in this repo so the writing
// is portable, indexed by search engines as first-party content, and
// does not depend on the Substack feed being reachable. The /writing
// page shows these alongside the RSS-derived notes.
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(280),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Estimated reading time, e.g. "6 min". Optional. */
    readingTime: z.string().optional(),
    /** Whether the essay is featured at the top of the /writing list. */
    featured: z.boolean().default(false),
  }),
});

export const collections = { writing };
