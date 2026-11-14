/**
 * The hang: the order and grouping in which the works are shown.
 *
 * Every entry is a "moment" the visitor meets on its own:
 *  - solo: one work with the whole width to itself (loud, colourful works),
 *  - pair: two works that belong together (shared tone, theme or format),
 *    shown side by side at the same height; `offset` lifts the second one.
 *
 * Curatorial reasoning for the current collection:
 *  loud, saturated landscapes and dense abstractions stand alone; between them
 *  quieter pairs give the eye a rest: two dark works (3, 19), two airy pale
 *  ones (1, 2), two interiors with a window (13, 15), two tall verticals (6, 12),
 *  two figures (4, 17), two blue-green works (10, 8). The sculpture closes the
 *  sequence as a change of medium and colour.
 *
 * Works not listed here are added at the end automatically (portraits in pairs,
 * wide works alone), so a new work appears even before it is placed by hand.
 * Ids are the file names in src/content/works/ without .md.
 */
export type Moment =
  | { kind: 'solo'; works: [string]; size?: 'xl' | 'l' | 'm'; align?: 'start' | 'center' | 'end' }
  | { kind: 'pair'; works: [string, string]; offset?: boolean };

export const HANG: Moment[] = [
  { kind: 'solo', works: ['painting-05'], size: 'xl', align: 'center' },
  { kind: 'pair', works: ['painting-03', 'painting-19'] },
  { kind: 'solo', works: ['painting-11'], size: 'l', align: 'end' },
  { kind: 'pair', works: ['painting-01', 'painting-02'], offset: true },
  { kind: 'solo', works: ['painting-14'], size: 'l', align: 'start' },
  { kind: 'solo', works: ['painting-09'], size: 'm', align: 'end' },
  { kind: 'pair', works: ['painting-13', 'painting-15'] },
  { kind: 'solo', works: ['painting-16'], size: 'l', align: 'center' },
  { kind: 'pair', works: ['painting-06', 'painting-12'], offset: true },
  { kind: 'solo', works: ['painting-18'], size: 'l', align: 'start' },
  { kind: 'pair', works: ['painting-04', 'painting-17'] },
  { kind: 'solo', works: ['painting-07'], size: 'l', align: 'end' },
  { kind: 'pair', works: ['painting-10', 'painting-08'], offset: true },
  { kind: 'solo', works: ['angel'], size: 'm', align: 'center' },
];
