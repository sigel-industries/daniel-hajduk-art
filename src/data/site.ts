/**
 * Site-wide settings. Edit here; no other code changes needed.
 * Values set to null are not shown on the site.
 */
export const SITE = {
  name: 'Daniel Hajduk',
  role: 'Artist',
  title: 'Daniel Hajduk | Artist',
  description:
    'Daniel Hajduk is an artist working in painting, sculpture and other visual media. Portfolio of selected works and works available for acquisition.',
  location: 'Prague',
  // TODO(confirm): public contact e-mail for enquiries. Leave null to hide.
  email: null as string | null,
  // TODO(confirm): optional social profiles, e.g. { label: 'Instagram', url: 'https://instagram.com/…' }
  social: [] as { label: string; url: string }[],
};

export const AVAILABILITY_LABEL: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  'private-collection': 'Private collection',
  'on-request': 'On request',
};
