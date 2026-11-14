// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://<owner>.github.io/<repo>/
// Override with SITE_URL / BASE_PATH env vars (e.g. when a custom domain is added).
const SITE = process.env.SITE_URL ?? 'https://sigel-industries.github.io';
const BASE = process.env.BASE_PATH ?? '/daniel-hajduk-art';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    // Add 'cs' here (and translations in src/i18n/ui.ts) to enable Czech.
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
  image: {
    // Local images are optimised at build time with sharp (AVIF/WebP + srcset).
    responsiveStyles: false,
  },
});
