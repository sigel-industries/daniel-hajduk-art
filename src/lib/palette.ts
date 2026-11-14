/**
 * Build-time colour extraction. Each work lends the site its colours:
 * the ambient field behind the pages is tinted with these.
 * Reads the work's cover file (path from the Markdown frontmatter) with sharp
 * and returns up to 5 dominant colours as hex, largest cluster first.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Work } from './works';

/** Neutral field used where no work is in view: warm graphite and bone. */
export const DEFAULT_PALETTE = ['#2b2723', '#4a433b', '#6d6458', '#1b1a18', '#8a7f70'];

const cache = new Map<string, string[]>();

export async function workPalette(work: Work): Promise<string[]> {
  if (cache.has(work.id)) return cache.get(work.id)!;
  let result = DEFAULT_PALETTE;
  try {
    const file = work.filePath ? path.resolve(work.filePath) : '';
    const md = await readFile(file, 'utf8');
    const rel = md.match(/^cover:\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '');
    if (rel) result = await dominant(path.resolve(path.dirname(file), rel));
  } catch {
    result = DEFAULT_PALETTE;
  }
  cache.set(work.id, result);
  return result;
}

async function dominant(file: string, k = 5): Promise<string[]> {
  const { data } = await sharp(file).resize(32, 32, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px: number[][] = [];
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]]);
  const lum = (p: number[]) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  const sorted = [...px].sort((a, b) => lum(a) - lum(b));
  let centres = Array.from({ length: k }, (_, i) => [...sorted[Math.floor(((i + 0.5) / k) * sorted.length)]]);
  let groups: number[][][] = [];
  for (let iter = 0; iter < 10; iter++) {
    groups = centres.map(() => []);
    for (const p of px) {
      let best = 0, bd = Infinity;
      centres.forEach((c, j) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < bd) { bd = d; best = j; } });
      groups[best].push(p);
    }
    centres = groups.map((g, j) => (g.length ? [0, 1, 2].map((c) => g.reduce((s, p) => s + p[c], 0) / g.length) : centres[j]));
  }
  const hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  return centres.map((c, j) => ({ c, n: groups[j].length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).map((x) => hex(x.c));
}
