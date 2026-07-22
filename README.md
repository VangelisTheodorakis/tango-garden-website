# tango-garden-website

Website for **Tango Garden Cologne** ([tangogarden.de](https://tangogarden.de)) — a 1:1 replica of
the live Shopify storefront, built with [Astro 5](https://astro.build) and shipped as a fully static
site. No SSR, no client framework, no third-party requests at runtime.

Checkout still happens on Shopify: the product pages open a Shopify cart permalink built from the
variant id in `src/data/products.js`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3001
```

| Script            | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Dev server on port 3001                                         |
| `npm run build`   | Static build into `dist/`                                       |
| `npm run preview` | Serves the built `dist/`                                        |
| `npm run check`   | `astro check` — TypeScript / template diagnostics               |
| `npm run lhci`    | Lighthouse CI against `dist/` using the budget in `lighthouserc.json` |

## Structure

```
src/
  layouts/BaseLayout.astro     html skeleton, skip link, meta, nav + footer
  components/                  Nav, Footer, MetaTags, StructuredData, Hero,
                               Philosophy, PathwayCards, WhyChoose, ProductGrid
  pages/
    index.astro                home
    collections/               classes & passes listing
    pages/                     content + legal pages (URLs unchanged)
    products/[handle].astro    all 12 product pages, from src/data/products.js
    404.astro
  data/
    products.js                catalogue: prices, variants, Shopify variant ids
    nav.js                     one definition for desktop menu + mobile drawer
  styles/global.css            design tokens and shared styles
  assets/hero-dancers.png      optimised at build time by astro:assets
public/
  fonts/                       self-hosted Inter (no Google Fonts CDN — GDPR)
  images/                      self-hosted photos and logos
  assets/data/*.json           event dates, read at runtime by the pathway cards
  _headers                     security headers + caching (Cloudflare Pages)
  _redirects                   301s for Shopify-only paths (Cloudflare Pages)
  robots.txt, CNAME, .nojekyll
legacy/                        the pre-Astro HTML site, kept for reference
tools/                         one-off migration + verification scripts
```

## Event dates

The three cards in "Three Ways to Enter the Garden" read their dates at runtime from
`public/assets/data/*.json`. Each file lists dated events; the card shows the next one on or after
today, or falls back to the file's `emptyMessage` when none are upcoming. Adding a date is a JSON
edit — no code change.

## Quality gates

`.github/workflows/ci.yml` builds every push and PR to `main`, then runs Lighthouse CI against the
budget in `lighthouserc.json`: performance ≥ 90, accessibility ≥ 95, best practices ≥ 90, SEO = 100.

## Deployment notes

`_headers` and `_redirects` are Cloudflare Pages conventions and are ignored by GitHub Pages. On
GitHub Pages the site still works, but the security headers and the Shopify path redirects are not
applied — see `docs/superpowers/plans/` for the Cloudflare Pages cutover plan.
