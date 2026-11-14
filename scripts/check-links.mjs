// Post-build checks on ./dist (no dependencies).
// - every internal link and asset resolves to a file
// - every page has exactly one <h1>, a <title>, a meta description and Open Graph tags
// - every <img> has an alt attribute
// - sitemap and robots.txt exist
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = (process.env.BASE_PATH ?? '/daniel-hajduk-art').replace(/\/$/, '');
const errors = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}
async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}
async function resolveInternal(href) {
  let path = decodeURIComponent(href.split('#')[0].split('?')[0]);
  if (!path.startsWith(BASE + '/') && path !== BASE) return { ok: false, why: `missing base path ${BASE}` };
  path = path.slice(BASE.length) || '/';
  const target = join(DIST, path);
  if (path.endsWith('/')) return { ok: await exists(join(target, 'index.html')) };
  return { ok: (await exists(target)) || (await exists(join(target, 'index.html'))) };
}

const files = await walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
for (const file of pages) {
  const rel = relative(DIST, file);
  const html = await readFile(file, 'utf8');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${rel}: expected 1 <h1>, found ${h1}`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${rel}: missing meta description`);
  for (const og of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!html.includes(`property="${og}"`)) errors.push(`${rel}: missing ${og}`);
  }
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt=/.test(img)) errors.push(`${rel}: <img> without alt: ${img.slice(0, 80)}`);
  }
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g), ...html.matchAll(/\ssrcset="([^"]+)"/g)]
    .flatMap((m) => (m[0].includes('srcset') ? m[1].split(',').map((s) => s.trim().split(' ')[0]) : [m[1]]));
  for (const ref of refs) {
    if (!ref || /^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref)) continue;
    if (!ref.startsWith('/')) continue;
    const r = await resolveInternal(ref);
    if (!r.ok) errors.push(`${rel}: broken link ${ref}${r.why ? ` (${r.why})` : ''}`);
  }
}
for (const required of ['sitemap-index.xml', 'robots.txt', '404.html', 'favicon.svg']) {
  if (!(await exists(join(DIST, required)))) errors.push(`missing ${required}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${pages.length} pages checked: links, assets, headings, alt text, meta and Open Graph OK`);
