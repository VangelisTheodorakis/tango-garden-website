# CLAUDE.md

This is the marketing website for **Tango Garden Cologne** — a small, community-driven
Argentine tango school in Cologne, Germany. The site is a **static Astro 5 site** that is
a near 1-1 replica of the school's former Shopify storefront, rebuilt to be fast,
self-hosted, and privacy-clean. Audience is a mix of internationals (often young, English-
speaking) and Germans. Tone of the brand is warm, sincere, "no partner needed, come as you
are." The site is live at **https://tangogarden.de** (served by a Cloudflare Worker); the
Shopify store still exists at `tangogarden.myshopify.com` and remains the commerce/checkout
backend.

## Non-negotiable project rules

These are the reasons this project exists the way it does. Breaking one is a real problem,
not a style nit.

1. **Zero third-party requests on page load (GDPR), with one accepted exception.** German
   visitors' IPs must never leak to third parties without consent. That means: **self-host
   everything** (fonts are local woff2 in the repo — never link Google Fonts or any CDN), no
   external scripts, no external stylesheets, no remote images, no analytics beacons. The
   sole exception, at the owner's explicit request (2026-08-08, overriding the prior
   click-to-load default): the Google Map on `/pages/contact` auto-embeds on page load,
   sending visitor IPs to Google without a consent step. Do not extend this exception to any
   other embed without asking first. Before adding *any other* `<script src>`,
   `<link href>`, `<img src>`, `@font-face`, or `fetch()` to an external host, stop and flag
   it. The live CSP is `default-src 'self'` (self-only) — keep it that way.
2. **Deploy = `git push` to `main`.** There is no separate deploy step. Cloudflare rebuilds
   from GitHub on every push to `main`. A local commit alone does **not** go live. Never
   deploy with `wrangler deploy` directly (a hook blocks it) — it would bypass CI and could
   ship uncommitted local state. Only push when the user asks.
3. **Products mirror the live Shopify store.** Product data (`src/data/products.js`) —
   titles, prices, and especially `cartVariantId`/`variants[].id` — must match the live
   Shopify variants, or checkout breaks. Purchase controls are currently **hidden** via the
   `showPurchaseControls` flag in `src/data/site.js`; the buy buttons open a Shopify cart
   permalink on `tangogarden.myshopify.com`. Don't invent variant IDs.
4. **Mobile-first.** Most visitors are on phones. Weigh mobile impact first in every layout
   change; verify at 320 / 375 px before desktop. Watch for the classic `minmax()` grid
   clip and `aspect-ratio` + min-height traps that have bitten this site before.
5. **No payment-provider branding** (Shopify/Stripe/Visa etc.) anywhere visible. German
   legal pages (Impressum aside) are covered by the English **privacy-policy** and
   **refund-and-cancellation-policy** — there is no Datenschutz/AGB/Widerruf page.

## Commands

```bash
npm run dev         # Astro dev server, http://localhost:3001 (NOT 4321)
npm run build       # Build to dist/
npm run preview     # Serve the built dist/ on :3001
npm run check       # astro check (type-check .astro/.ts)
npm test            # Vitest run — unit + build-output tests (tests/unit, tests/build)
npm run test:e2e    # Playwright — desktop + mobile projects (tests/e2e)
npm run lhci        # Lighthouse CI budget
npm run dead-css    # Report unused CSS (tools/find-dead-css.mjs)
```

- **Node 22+ is required** (`engines: >=22`). Wrangler 4 needs it; the Cloudflare build uses it.
- No Prettier/ESLint config — match the surrounding code style by hand.
- To preview in the browser, use the dev server on port **3001** (see `.claude/launch.json`).

## Architecture

Static Astro 5 (`output: 'static'`, `dist/`) — **no SSR, no client UI framework, no
islands.** Start by reading `astro.config.mjs`, `src/pages/index.astro`, and `src/data/`.

- **Data-driven, not hard-coded.** The single sources of truth live in `src/data/`:
  `products.js` (catalogue), `nav.js` (menu + social links), `site.js` (`showPurchaseControls`),
  `noindex.js` (pages kept out of the sitemap/robots via a `noindex` meta). Event dates for the
  homepage pathway cards come from JSON feeds in `public/assets/data/*.json`, fetched
  client-side by `PathwayCards.astro` (with baked-in fallback text). Change data there, not in markup.
- **Routing / pages**: `src/pages/**` → routes. Products are one dynamic route
  (`src/pages/products/[handle].astro`) rendered from `products.js`. Legal/content pages live
  under `src/pages/pages/`.
- **Components & layout**: `src/layouts/BaseLayout.astro` (shell + `MetaTags`), `src/components/`
  (`Nav`, `Footer`, `PathwayCards`, `ProductGrid`, `MetaTags`, `StructuredData`, etc.).
- **Styling**: one global stylesheet, `src/styles/global.css`, using CSS custom properties
  (`--green` ≈ `#4E5D22`, cream tones, self-hosted Inter). CSP requires styles/scripts to be
  **external** files, so `astro.config.mjs` sets `build.inlineStylesheets: 'never'` and
  `vite.build.assetsInlineLimit: 0` — don't re-enable inlining.
- **SEO/infra files**: `public/_headers` (CSP, HSTS, security headers), `public/_redirects`
  (Shopify-path redirects — the exact-match `/collections/all → 200` must stay first to avoid a
  redirect loop), `public/robots.txt`, sitemap via `@astrojs/sitemap` filtered by `noindex.js` +
  hidden products. `wrangler.jsonc` configures the Cloudflare Worker (assets-only,
  `drop-trailing-slash`, `404-page`).

## Testing

- `npm test` (Vitest) covers `src/data` integrity (prices, variant IDs, hidden set, feed shape)
  and build-output assertions (page count, noindex, sitemap). Keep these green — the
  variant-ID and hidden-product tests are guarding real checkout/SEO correctness.
- `npm run test:e2e` (Playwright) covers nav, layout, commerce controls, FAQ.
- After a change that's observable in the browser, verify it (dev server / curl) before
  claiming it's done — don't ask the user to check manually.

## Production / Deploy

- Host: **Cloudflare Workers Static Assets**, Worker `tango-garden-website`, custom domains
  `tangogarden.de` + `www` (both proxied, HTTPS-forced). Fallback URL:
  `tango-garden-website.vangelis-theodorakis.workers.dev`.
- DNS is on **Cloudflare** (moved off Shopify); email is **Google Workspace** — the MX/SPF/DKIM/
  DMARC records in Cloudflare DNS are load-bearing, never touch them. See the hosting memory.
- Deploy flow: commit → `git push origin main` → Cloudflare auto-builds. Verify live after
  push (the site is edge-cached; allow ~1 min and expect brief propagation flux).

## How I Work (owner preferences — adjust freely)

- Direct, concise, no filler. Lead with the answer.
- **Review before going live for anything structural or design-facing**: implement on a
  branch, show the rendered result (screenshot / measured DOM), and push only on my go-ahead.
  Small copy/date tweaks can go straight to commit + push.
- When a decision is strategic (pricing, positioning, marketing), it's fine to consult the
  specialist subagents and synthesize — but surface the real trade-off and give a recommendation,
  don't just list options.
- Edit files directly; production-ready, not "a starting point."
- Flag GDPR / Shopify-parity / mobile impact proactively whenever a change touches them.

## Available tooling

- **Memory**: persistent auto-memory is active for this project (hosting/DNS, Shopify, mobile-first,
  and Cologne-landscape facts are already saved). Read it at session start; save durable,
  non-obvious project facts — not things derivable from the code.
- **Hooks** (`.claude/hooks/`, wired in `.claude/settings.json`): `block-deploy` (no direct
  `wrangler deploy` — push instead) and `protect-critical-files` (`.env`, `wrangler.jsonc`).
  Written in Node (no `jq` dependency). See `.claude/hooks/README.md`.
- **Agents**: the platform specialist roster is available via the Agent tool (used this project
  for pricing/brand/UX and the launch audits) — no project-local agent files needed.
