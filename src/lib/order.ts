import { ORDER } from '../data/exhibition';
import type { Work } from './works';

/** Sorts works into the curated order; unlisted works keep their order at the end. */
export function curated(works: Work[]): Work[] {
  const pos = (w: Work) => { const i = ORDER.indexOf(w.id); return i === -1 ? ORDER.length : i; };
  return works.map((w, i) => ({ w, i })).sort((a, b) => pos(a.w) - pos(b.w) || a.i - b.i).map((x) => x.w);
}
