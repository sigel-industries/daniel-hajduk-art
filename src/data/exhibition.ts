/**
 * The order in which the works are shown (home page and catalogue), and the
 * works that get a wall to themselves.
 *
 * ORDER is composed by colour and intensity: loud, saturated works are separated
 * by calmer ones, warm and cool alternate. FEATURED works are shown alone and
 * large, as accents between the calm rows; they are the strongest, most
 * colourful landscapes, spaced so that roughly every fifth work is an accent.
 * Ids are file names in src/content/works/ without .md.
 * Works not listed follow at the end in their default order.
 */
export const ORDER: string[] = [
  'painting-05',
  'painting-01', 'painting-03', 'painting-13', 'painting-02',
  'painting-11',
  'painting-09', 'painting-19', 'painting-06', 'painting-15',
  'painting-16',
  'painting-17', 'painting-12', 'painting-04', 'painting-10',
  'painting-18',
  'painting-07', 'painting-14', 'painting-08', 'angel',
];

export const FEATURED: string[] = ['painting-11', 'painting-16', 'painting-18'];
