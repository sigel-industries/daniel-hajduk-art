import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown file per artwork in src/content/works/.
 * Put the photos in a folder next to it (e.g. src/content/works/angel/)
 * and reference them with relative paths. See README "Adding a work".
 */
const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** id of an entry in src/content/categories/ (e.g. paintings) */
      category: z.string(),
      /** id of an entry in src/content/groups/: the body of work it belongs to */
      group: z.string().optional(),
      year: z.union([z.number(), z.string()]).optional(),
      technique: z.string().optional(),
      materials: z.string().optional(),
      dimensions: z.string().optional(),
      series: z.string().optional(),
      edition: z
        .object({
          size: z.number().int().positive(),
          available: z.array(z.string()).default([]),
        })
        .optional(),
      availability: z.enum(['available', 'sold', 'private-collection', 'on-request']).optional(),
      price: z
        .object({
          amount: z.number().positive(),
          currency: z.string().default('CZK'),
          note: z.string().optional(),
        })
        .optional(),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      cover: image(),
      coverAlt: z.string(),
      images: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      /** close crops of the work (brushwork, surface, fragments); used as floating fragments */
      details: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      selected: z.boolean().default(false),
      /** leads its body of work on the home page */
      featured: z.boolean().default(false),
      order: z.number().default(100),
      summary: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

/** Categories (disciplines). Add a JSON file to add a category; no code changes. */
const categories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categories' }),
  schema: z.object({ label: z.string(), singular: z.string(), intro: z.string().optional(), order: z.number().default(100) }),
});

/** Bodies of work (series, themes, periods). Shown as sections on the home page and as a filter. */
const groups = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/groups' }),
  schema: z.object({ title: z.string(), intro: z.string().optional(), order: z.number().default(100) }),
});

export const collections = { works, categories, groups };
