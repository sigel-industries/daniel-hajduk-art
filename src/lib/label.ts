/**
 * Wall-label helpers. Dimensions are entered once, in centimetres
 * ("100 × 80 cm", "40 x 30 x 12 cm"); the label adds inches the way galleries do.
 * Anything that does not follow that pattern is shown exactly as entered.
 */
export function inches(dimensions?: string): string | null {
  if (!dimensions) return null;
  const m = dimensions.trim().match(/^(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×]\s*(\d+(?:[.,]\d+)?))?\s*cm$/i);
  if (!m) return null;
  const toIn = (v: string) => {
    const n = Math.round((parseFloat(v.replace(',', '.')) / 2.54) * 10) / 10;
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  };
  return `${[m[1], m[2], m[3]].filter(Boolean).map((v) => toIn(v!)).join(' × ')} in`;
}
