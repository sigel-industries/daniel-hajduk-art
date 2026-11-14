/**
 * Hanging rules: where and how large a work sits on a wall measured in centimetres.
 * The wall is 200 cm from floor to ceiling. Works without a known size are hung
 * at a sensible default so the wall still reads; size can be added later.
 */
import type { Work } from './works';

export const WALL_CM = 200;
const EYE = 148;        // centre line for wall-hung works
const PLINTH = 92;      // plinth height for sculpture

export interface Hang { w: number; h: number; bottom: number; plinth?: { w: number; h: number } }

export function hang(work: Work): Hang {
  const d = work.data;
  const ratio = d.cover.width / d.cover.height;
  const known = d.size?.h;
  const subject = known ?? (d.category === 'sculptures' ? 50 : 70);
  let h = subject / d.coverSubject;
  let w = h * ratio;
  if (d.category === 'sculptures') {
    const room = WALL_CM - PLINTH - 12;
    if (h > room) { w *= room / h; h = room; }
    const bottom = PLINTH - h * (1 - d.coverSubject) * 0.35;
    return { w, h, bottom, plinth: { w: Math.max(30, w * 0.9), h: PLINTH } };
  }
  const max = WALL_CM - 24;
  if (h > max) { w *= max / h; h = max; }
  const bottom = Math.max(14, EYE - h / 2);
  return { w, h, bottom };
}
