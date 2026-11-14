/**
 * Interface strings. English is the default language.
 * To add Czech: fill in the `cs` block, add 'cs' to `locales` in astro.config.mjs,
 * and create pages under src/pages/cs/ that pass lang="cs" to the layout.
 */
export const ui = {
  en: {
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.skip': 'Skip to content',
    'works.all': 'All works',
    'works.selected': 'Selected works',
    'works.empty': 'Works in this section are being photographed and will be added soon.',
    'work.technique': 'Technique',
    'work.materials': 'Materials',
    'work.dimensions': 'Dimensions',
    'work.year': 'Year',
    'work.edition': 'Edition',
    'work.editionOf': 'Limited edition of',
    'work.availableCopies': 'Available copies',
    'work.status': 'Status',
    'work.price': 'Price',
    'work.back': 'Back to',
    'work.photos': 'Photographs',
    'work.enquire': 'Enquire about this work',
    'gallery.open': 'Open photograph',
    'gallery.close': 'Close',
    'gallery.prev': 'Previous photograph',
    'gallery.next': 'Next photograph',
    'footer.rights': 'All works and photographs',
  },
  cs: {},
} as const;

export type Lang = keyof typeof ui;
export const defaultLang: Lang = 'en';

export function t(key: keyof (typeof ui)['en'], lang: Lang = defaultLang): string {
  const dict = ui[lang] as Record<string, string>;
  return dict[key] ?? ui.en[key];
}
