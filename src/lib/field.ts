/**
 * Every work is shown in an exhibition field. The field follows the work's own
 * proportions within a moderate range (0.72 – 1.5): ordinary formats fill their
 * field exactly, extreme ones (a very narrow strip, a panorama) are shown whole
 * inside a field that stays within the range, so the row rhythm never breaks.
 */
import type { ImageMetadata } from 'astro';
export const FIELD_MIN = 0.72;
export const FIELD_MAX = 1.5;
export const fieldRatio = (img: ImageMetadata) => Math.min(FIELD_MAX, Math.max(FIELD_MIN, img.width / img.height)).toFixed(4);
