import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'works'>;

export async function getWorks(): Promise<Work[]> {
  const all = await getCollection('works', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getSelectedWorks(): Promise<Work[]> {
  return (await getWorks()).filter((w) => w.data.selected);
}
