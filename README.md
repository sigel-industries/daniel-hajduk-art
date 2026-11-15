# Daniel Hajduk | Artist

Portfolio site of Daniel Hajduk: paintings, sculpture, photography and other work.
Static site built with [Astro](https://astro.build), hosted on GitHub Pages.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install          # once
npm run dev          # http://localhost:4321/daniel-hajduk-art/  (live reload)
npm run build        # production build into ./dist
npm run preview      # serve ./dist at http://localhost:4321/daniel-hajduk-art/
npm test             # build + checks (links, assets, headings, alt text, meta, Open Graph)
```

## Adding a work

1. Create a folder for the photos, e.g. `src/content/works/my-painting/`, and put the photos in it
   (JPG or PNG, the larger the better; the build creates AVIF/WebP in all needed sizes).
2. Create `src/content/works/my-painting.md`. The file name becomes the URL:
   `/works/<category>/my-painting/`.

```markdown
---
title: Title of the work
category: paintings          # paintings | sculptures | photography | other
year: 2024                   # optional
technique: Oil on canvas     # optional
materials: Oil, canvas       # optional
dimensions: 100 × 80 cm      # optional
availability: available      # available | sold | private-collection | on-request
price:                       # optional, shown only when available
  amount: 25000
  currency: CZK
  note: framed
links:                       # optional, e.g. a sale listing
  - label: Buy on Aukro
    url: https://aukro.cz/…
cover: ./my-painting/main.jpg
coverAlt: Short description of what is in the photo
images:                      # gallery on the detail page, in this order
  - src: ./my-painting/main.jpg
    alt: The painting, full view
  - src: ./my-painting/detail.jpg
    alt: Detail of the surface
selected: true               # part of the home page presentation (keep it to ~6–10 works)
featured: true               # optional: shown larger in the archive; spaced out automatically
series: Night meadows        # optional: enables the Series filter and "More from" on the work page
year: 2025                   # optional: enables the Period filter (by decade)
details: [...]               # optional: close-up photos, shown after the views
order: 2                     # default order (lower = newer/first) used as a tie-breaker
summary: One or two sentences shown in listings.
draft: false                 # true hides the work
---

Optional longer text about the work.
```

3. `npm test`, then commit and push. The site redeploys automatically.

Limited editions: add
```yaml
edition:
  size: 50
  available: ['03/50', '04/50']
```

## Site settings

`src/data/site.ts`: name, description, location, **contact e-mail**, social links and the category list.
Placeholders that still need the artist's confirmation are marked `TODO(confirm)` in code and shown
with a dashed bronze outline in `npm run dev` only; they are hidden in the production build.

## Languages

English is the default. Interface strings live in `src/i18n/ui.ts`. To add Czech: fill the `cs` block,
add `'cs'` to `locales` in `astro.config.mjs` and create pages under `src/pages/cs/`.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds, runs the checks and deploys on every push to `main`.
One-time setup in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The site URL is `https://<owner>.github.io/` when the repository is named `<owner>.github.io`, otherwise `https://<owner>.github.io/<repo>/`. The workflow sets `SITE_URL` and `BASE_PATH`
from the repository automatically. For a custom domain later, set `SITE_URL=https://example.com`
and `BASE_PATH=/` in the workflow and add the domain under Settings → Pages.

## Structure

```
src/
  content/works/        one .md file + one photo folder per work
  content.config.ts     schema of a work (fields above)
  data/site.ts          site settings, categories
  i18n/ui.ts            interface strings
  layouts/Base.astro    <head>, SEO/Open Graph, header, footer, motion
  components/           Room (work presentation), Gallery (lightbox), WorksIndex
  pages/                home, works, category, work detail, about, contact, 404, robots.txt
  styles/global.css     design tokens and all styles
scripts/check-links.mjs post-build checks
```

## Rules for content

- Only real photographs of the artist's own works. No AI-generated images, no other artists' work.
- Photos may be cropped or re-ordered; the work itself is never retouched or altered.
- No invented biography, exhibitions, awards or symbolism.

## Categories and bodies of work (CMS-ready)

Nothing about categories or groups is written into the layout.

- `src/content/categories/<id>.json` — a discipline: `{ "label", "singular", "intro", "order" }`.
  Add a file to add a category (e.g. drawings); it appears in filters, pages and captions.
- `src/content/groups/<id>.json` — a body of work (series, theme, period): `{ "title", "intro", "order" }`.
  Each group becomes a section on the home page and a filter in the archive.
- A work refers to them by id: `category: paintings`, `group: landscapes`. An unknown id stops
  the build with a message saying which file to add.

These are plain files with a fixed schema, so a Git-based CMS (Decap, TinaCMS, Pages CMS…) can
edit them directly: upload a photo, pick category and group, fill in the facts, save.

## How works are shown

Every work, everywhere, is shown whole on a neutral mount of fixed proportions (`Mount.astro`),
never cropped or stretched. The mounts form the grid, so any format, colour or medium fits.

## How works are arranged

Nobody has to place works by hand. At build time every cover photo is measured
(`src/lib/curation.ts`): how loud it is (saturation and number of strong hues) and
whether it is warm or cool. The archive and the home page use that to order works so
that loud paintings are separated by calmer ones and temperatures alternate.
`featured` works open the sequence and appear larger; `selected` decides what the home
page presents. Adding a work = adding one Markdown file and its photo.
