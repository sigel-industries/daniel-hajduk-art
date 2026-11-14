/**
 * Automatic curation, computed at build time from each work's photograph.
 *
 * For every work we measure:
 *  - intensity: how loud it is (average saturation x number of strong hues),
 *  - warmth:    balance of warm against cool hues (-1 cool … +1 warm),
 *  - tone:      a muted version of its dominant colour, shown while it loads.
 *
 * sequence() orders any set of works so that loud works are separated by calmer
 * ones and warm and cool alternate, without anyone placing works by hand.
 * Works marked `featured` in their file open the sequence and are spaced out.
 * Adding a work needs no other change: it is measured and placed automatically.
 */
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import type { Work } from './works';

export interface Profile { intensity: number; warmth: number; tone: string; wide: boolean }
const cache = new Map<string, Profile>();

async function coverFile(work: Work): Promise<string | null> {
  if (!work.filePath) return null;
  const file = path.resolve(work.filePath);
  const md = await readFile(file, 'utf8');
  const rel = md.match(/^cover:\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '');
  return rel ? path.resolve(path.dirname(file), rel) : null;
}

function rgbToHsv(r: number, g: number, b: number) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max / 255 };
}

export async function profile(work: Work): Promise<Profile> {
  if (cache.has(work.id)) return cache.get(work.id)!;
  const wide = work.data.cover.width > work.data.cover.height * 1.1;
  let result: Profile = { intensity: 0.4, warmth: 0, tone: '#d8d5cf', wide };
  try {
    const file = await coverFile(work);
    if (file) {
      const { data } = await sharp(file).resize(48, 48, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      let sat = 0, warm = 0, cool = 0, r = 0, g = 0, b = 0;
      const buckets = new Array(8).fill(0);
      const n = data.length / 3;
      for (let i = 0; i < data.length; i += 3) {
        const { h, s, v } = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        sat += s; r += data[i]; g += data[i + 1]; b += data[i + 2];
        if (s > 0.25 && v > 0.2) {
          buckets[Math.floor(h / 45) % 8] += s;
          if (h < 70 || h > 330) warm += s; else if (h > 150 && h < 290) cool += s;
        }
      }
      const total = buckets.reduce((a, c) => a + c, 0) || 1;
      const hues = buckets.filter((c) => c / total > 0.12).length;
      const intensity = Math.min(1, (sat / n) * (0.6 + hues * 0.2));
      const warmth = (warm - cool) / (warm + cool || 1);
      // tone: the average colour, softened towards the wall so it reads as a quiet placeholder
      const mix = (c: number, w: number) => Math.round(c / n * 0.45 + w * 0.55);
      const tone = '#' + [mix(r, 236), mix(g, 235), mix(b, 231)].map((v) => v.toString(16).padStart(2, '0')).join('');
      result = { intensity, warmth, tone, wide };
    }
  } catch { /* keep neutral profile */ }
  cache.set(work.id, result);
  return result;
}

/** Orders works so neighbours do not compete: loud next to calm, warm next to cool. */
export async function sequence(works: Work[]): Promise<Work[]> {
  if (works.length < 3) return works;
  const items = await Promise.all(works.map(async (w, i) => ({ w, i, p: await profile(w), featured: !!w.data.featured })));
  const left = [...items];
  const out: typeof items = [];
  // open with the first featured work, otherwise with the first in default order
  const first = left.find((x) => x.featured) ?? left[0];
  out.push(first); left.splice(left.indexOf(first), 1);
  while (left.length) {
    const a = out[out.length - 1].p, b = out.length > 1 ? out[out.length - 2].p : null;
    const sinceFeatured = out.length - 1 - out.map((x) => x.featured).lastIndexOf(true);
    let best = left[0], bestScore = Infinity;
    for (const x of left) {
      let score = a.intensity * x.p.intensity * 3;                 // two loud works side by side clash
      if (b) score += b.intensity * x.p.intensity;                  // and so do loud works one apart
      score += Math.max(0, 1 - Math.abs(a.warmth - x.p.warmth)) * 0.8; // prefer a change of temperature
      if (x.featured) score += sinceFeatured < 4 ? 2 : -1;          // space featured works out
      score += x.i * 0.015;                                         // stable: otherwise keep default order
      if (score < bestScore) { bestScore = score; best = x; }
    }
    out.push(best); left.splice(left.indexOf(best), 1);
  }
  return out.map((x) => x.w);
}
