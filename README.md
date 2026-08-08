# tango-garden-website

Website for **Tango Garden Cologne** ([tangogarden.de](https://tangogarden.de)) — a fast,
self-hosted, GDPR-clean rebuild of the school's former Shopify storefront, built with
[Astro 5](https://astro.build) and shipped as a fully static site. No SSR, no client
framework. Self-hosted fonts and images, no analytics, no third-party requests on page
load — with one explicit, documented exception: the Google Map on `/pages/contact`
auto-embeds (see `CLAUDE.md`, "Non-negotiable project rules").

Checkout still happens on Shopify: the buy buttons (currently hidden via
`showPurchaseControls` in `src/data/site.js`) open a Shopify cart permalink built from the
variant id in `src/data/products.js`.

For full project context (non-negotiable rules, architecture, deploy flow), read
**`CLAUDE.md`** first — this file is a shorter orientation on top of it.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3001
```

| Script             | What it does                                                          |
| ------------------ | ---------------------------------------------------------------------- |
| `npm run dev`      | Dev server on port 3001                                                |
| `npm run build`    | Static build into `dist/`                                              |
| `npm run preview`  | Serves the built `dist/`                                               |
| `npm run check`    | `astro check` — TypeScript / template diagnostics                      |
| `npm test`         | Vitest — unit + build-output assertions against `dist/`                |
| `npm run test:e2e` | Playwright — desktop + mobile browser tests                            |
| `npm run lhci`     | Lighthouse CI against `dist/` using the budget in `lighthouserc.json`  |
| `npm run dead-css` | Reports CSS selectors with no match in the built output                |

## Structure

```
src/
  layouts/BaseLayout.astro     html skeleton, skip link, meta, nav + footer
  components/                  Nav, Footer, MetaTags, StructuredData, Hero,
                                Philosophy, PathwayCards, WhyChoose, ProductGrid,
                                ClassPage (shared template for the 3 class pages)
  pages/
    index.astro                home
    collections/                classes & passes listing
    pages/                     content + legal pages, incl. the-garden, contact,
                                enter-the-garden, beginner-course, garden-practica
    products/[handle].astro    legacy per-SKU pages (hidden, kept for direct-URL +
                                price/variant data — see src/data/products.js)
    404.astro
  data/
    products.js                catalogue: prices, variants, Shopify variant ids
    classPages.js               content/pricing structure for the 3 class pages
    nav.js                     one definition for desktop menu + mobile drawer
    site.js                    site-wide flags (showPurchaseControls)
    noindex.js                 routes excluded from the sitemap
  styles/global.css            design tokens and shared styles
public/
  fonts/                       self-hosted Inter (no Google Fonts CDN — GDPR)
  images/                      self-hosted photos and logos
  assets/data/*.json           event dates, read at runtime by the pathway cards
  _headers                     security headers + CSP (Cloudflare)
  _redirects                   301s for retired Shopify/legacy paths (Cloudflare)
  robots.txt
workers/registration-email/    Cloudflare Worker that renders the beginner-course
                                registration confirmation email (called by an Apps
                                Script trigger, never sends mail itself — see the
                                file's own header comment for the full flow)
apps-script/                   Google Apps Script source for the registration form
docs/                          registration flow spec/setup notes
legacy/                        the pre-Astro Shopify HTML export, kept for reference
tools/                         find-dead-css.mjs (CI-adjacent) and
                                compare-live-products.mjs (manual Shopify-parity check)
```

## Event dates

The pathway cards on the homepage read their dates at runtime from
`public/assets/data/*.json`. Each file lists dated events; the card shows the next one on
or after today, or falls back to the file's `emptyMessage` when none are upcoming. Adding
a date is a JSON edit — no code change.

## Quality gates

`.github/workflows/ci.yml` builds every push and PR to `main` (`check` + `build` + `test`),
runs the Playwright suite, and runs Lighthouse CI against the budget in `lighthouserc.json`:
performance ≥ 90, accessibility ≥ 95, best practices ≥ 90, SEO = 100. It does not deploy —
see below.

## Node version

Pinned to 22 in `.node-version` and `engines`. Astro 5 would accept 18.20.8 or 20.3+, but
Wrangler 4 — which builds the deploy — requires 22 or newer, so 22 is the floor for the
whole project. CI uses the same version, so it cannot pass on a Node the deploy would reject.

## Deployment

Host is **Cloudflare Workers Static Assets** (`wrangler.jsonc`, no Worker script — Cloudflare
serves `dist/` directly). There is no deploy step in CI: Cloudflare's own GitHub integration
rebuilds and redeploys on every push to `main`. `_headers` and `_redirects` are Cloudflare
conventions and are read from the built assets directory. Never run `wrangler deploy`
directly — it would bypass CI and could ship uncommitted local state (a repo hook blocks it).
