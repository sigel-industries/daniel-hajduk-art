/** Build an internal URL that respects the configured base path (GitHub Pages). */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') || clean.includes('#') || /\.[a-z0-9]+$/i.test(clean) ? clean : `${clean}/`;
  return `${base}${withSlash}`;
}

export function workUrl(category: string, id: string): string {
  return url(`/works/${category}/${id}/`);
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
