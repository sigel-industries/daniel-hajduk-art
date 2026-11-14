/**
 * Each work is shown on its own ground (wall colour). The artist can set it in
 * the frontmatter (`ground`); otherwise it is taken from the photograph itself.
 * Ink (text colour) follows from the ground's lightness.
 */
import type { Work } from './works';
import { workPalette } from './palette';

export const DEFAULT_GROUND = { ground: '#ffffff', ink: '#141414' };

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const inkFor = (ground: string) => (lum(ground) > 0.28 ? '#1a1917' : '#f1ebe4');

export async function workGround(work: Work): Promise<{ ground: string; ink: string }> {
  let ground = work.data.ground;
  if (!ground) {
    // take the photograph's dominant colour and settle it into a calm mid-tone wall
    const [c] = await workPalette(work);
    const rgb = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const mid = rgb.map((v) => Math.round(v * 0.75 + 40));
    ground = '#' + mid.map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join('');
  }
  return { ground, ink: inkFor(ground) };
}
