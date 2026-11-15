/**
 * Categories and bodies of work come from content collections, so they can be
 * added and edited (by hand or later through a CMS) without touching layout code.
 * A work refers to them by id; unknown ids fail the build with a clear message.
 */
import { getCollection } from 'astro:content';
import type { Work } from './works';

export interface Category { id: string; label: string; singular: string; intro?: string; order: number }
export interface Group { id: string; title: string; intro?: string; order: number }

let cats: Category[] | null = null;
let grps: Group[] | null = null;

export async function getCategories(): Promise<Category[]> {
  cats ??= (await getCollection('categories')).map((e) => ({ id: e.id, ...e.data })).sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  return cats;
}
export async function getGroups(): Promise<Group[]> {
  grps ??= (await getCollection('groups')).map((e) => ({ id: e.id, ...e.data })).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return grps;
}
export async function categoryOf(w: Work): Promise<Category> {
  const c = (await getCategories()).find((x) => x.id === w.data.category);
  if (!c) throw new Error(`Work "${w.id}" uses unknown category "${w.data.category}". Add src/content/categories/${w.data.category}.json`);
  return c;
}
export async function groupOf(w: Work): Promise<Group | undefined> {
  if (!w.data.group) return undefined;
  const g = (await getGroups()).find((x) => x.id === w.data.group);
  if (!g) throw new Error(`Work "${w.id}" uses unknown group "${w.data.group}". Add src/content/groups/${w.data.group}.json`);
  return g;
}
/** One line of facts, as a gallery caption: discipline, year, technique, dimensions. */
export async function captionOf(w: Work, withTechnique = true): Promise<string> {
  const d = w.data;
  return [(await categoryOf(w)).singular, d.year, withTechnique && (d.technique ?? d.materials), d.dimensions].filter(Boolean).join(', ');
}
