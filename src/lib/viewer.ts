import { getImage } from 'astro:assets';
import type { Work } from './works';
import { profile } from './curation';
import { CATEGORIES, AVAILABILITY_LABEL } from '../data/site';
import { formatPrice } from './url';

/** Data attributes that let a link open the work in the in-page viewer (see Viewer.astro). */
export async function viewerAttrs(w: Work): Promise<Record<string, string>> {
  const d = w.data;
  const full = await getImage({ src: d.cover, width: 2200, format: 'webp' });
  const p = await profile(w);
  const cat = CATEGORIES.find((c) => c.id === d.category)!;
  const status = d.availability === 'available'
    ? [AVAILABILITY_LABEL.available, d.price && `${formatPrice(d.price.amount, d.price.currency)}${d.price.note ? ` ${d.price.note}` : ''}`, d.edition?.available.length ? `copies ${d.edition.available.join(', ')}` : ''].filter(Boolean).join(', ')
    : d.availability ? AVAILABILITY_LABEL[d.availability] : '';
  return {
    'data-viewer-item': '',
    'data-id': w.id,
    'data-full': full.src,
    'data-alt': d.coverAlt,
    'data-title': d.title,
    'data-meta': [cat.singular, d.year, d.technique, d.dimensions, d.edition && `edition of ${d.edition.size}`].filter(Boolean).join(', '),
    'data-status': status,
    'data-tone': p.tone,
    'data-r': (d.cover.width / d.cover.height).toFixed(3),
  };
}
