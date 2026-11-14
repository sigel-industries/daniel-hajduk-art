import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_IDS } from './data/site';

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
      category: z.enum(CATEGORY_IDS),
      year: z.union([z.number(), z.string()]).optional(),
      technique: z.string().optional(),
      materials: z.string().optional(),
      dimensions: z.string().optional(),
      edition: z
        .object({
          size: z.number().int().positive(),
          available: z.array(z.string()).default([]),
        })
        .optional(),
      availability: z.enum(['available', 'sold', 'private-collection', 'on-request']),
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
      order: z.number().default(100),
      summary: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { works };
