// One-off migration helper: converts the legacy content/legal HTML pages into
// .astro pages that use BaseLayout, keeping their body markup verbatim so the
// rendered output is unchanged.
//
// This was run once. The generated files under src/pages/ are the source of
// truth now and have been edited since — re-running this overwrites those edits.
//
// Per page it lifts:
//   - <title> / meta description / canonical  -> BaseLayout props
//   - the page-specific <style> block          -> <style is:global>
//   - everything between </nav> and <footer>   -> page body
//   - trailing <script> minus the nav drawer   -> bundled <script>
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PAGES = [
  ['legacy/pages/the-garden/index.html', 'src/pages/pages/the-garden.astro'],
  ['legacy/pages/start-here/index.html', 'src/pages/pages/start-here.astro'],
  ['legacy/pages/contact/index.html', 'src/pages/pages/contact.astro'],
  ['legacy/pages/impressum/index.html', 'src/pages/pages/impressum.astro'],
  ['legacy/pages/code-of-care/index.html', 'src/pages/pages/code-of-care.astro'],
  ['legacy/pages/privacy-policy/index.html', 'src/pages/pages/privacy-policy.astro'],
  ['legacy/pages/terms-of-service/index.html', 'src/pages/pages/terms-of-service.astro'],
  [
    'legacy/pages/refund-and-cancellation-policy/index.html',
    'src/pages/pages/refund-and-cancellation-policy.astro',
  ],
  ['legacy/pages/agb/index.html', 'src/pages/pages/agb.astro'],
  ['legacy/pages/datenschutz/index.html', 'src/pages/pages/datenschutz.astro'],
  ['legacy/pages/widerruf/index.html', 'src/pages/pages/widerruf.astro'],
  ['legacy/404.html', 'src/pages/404.astro'],
];

// Images that used to be served from the Shopify CDN are now self-hosted and
// optimised in public/images (see the img-src rule in public/_headers).
const SHOPIFY_CDN = 'https://cdn.shopify.com/s/files/1/0957/0969/2231/files/';
const IMAGE_MAP = {
  'Kristina_Profile_Photo.png?v=1770672544': 'kristina.webp',
  'Vangelis_Profile_Photo.png?v=1770672555': 'vangelis.webp',
  'miloga-de-archanes.jpg?v=1773173800': 'miloga-de-archanes.webp',
  'south.jpg?v=1773173820': 'south.webp',
  'venue.png?v=1770925805': 'venue.webp',
  '20240513-_SON6700-Poprawione-Szum_8c3f660e-faf8-42a8-9825-fe3805f1442d.png':
    'hero-dancers.webp',
};

const selfHost = (s) => {
  for (const [from, to] of Object.entries(IMAGE_MAP)) {
    s = s.split(SHOPIFY_CDN + from).join(`/images/${to}`);
  }
  return s;
};

const one = (html, re, what, src) => {
  const m = html.match(re);
  if (!m) throw new Error(`Missing ${what} in ${src}`);
  return m[1];
};

// Escape the sequences that would otherwise be parsed as JSX/expressions when
// the markup is embedded in an .astro template literal.
const forTemplate = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

for (const [src, dest] of PAGES) {
  const html = selfHost(readFileSync(src, 'utf8'));

  const title = one(html, /<title>([\s\S]*?)<\/title>/, 'title', src).trim();
  const description = one(html, /<meta name="description" content="([^"]*)"/, 'description', src);
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? null;
  const noindex = /content="noindex/.test(html);

  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1].trim());

  const body = one(
    html,
    /<div class="nav-overlay" id="nav-overlay"><\/div>\s*<\/nav>([\s\S]*?)<footer class="site-footer">/,
    'body',
    src
  ).trim();

  // Drop the nav drawer script — Nav.astro owns that behaviour now.
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1].trim())
    .filter((s) => !s.includes('.nav-toggle'))
    .filter(Boolean);

  const props = [
    `  title="${title.replace(/&amp;/g, '&').replace(/"/g, '&quot;')}"`,
    `  description="${description}"`,
    canonical ? `  canonical="${canonical}"` : null,
    noindex ? '  noindex' : null,
  ]
    .filter(Boolean)
    .join('\n');

  const depth = dest.split('/').length - 2; // src/pages/... -> ../ per level
  const layoutPath = '../'.repeat(depth) + 'layouts/BaseLayout.astro';

  const out = `---
import BaseLayout from '${layoutPath}';
---

<BaseLayout
${props}
>
  <Fragment set:html={\`
${forTemplate(body)}
\`} />
</BaseLayout>
${styles.map((s) => `\n<style is:global>\n${s}\n</style>\n`).join('')}${scripts
    // Not is:inline — letting Astro bundle these keeps the CSP in
    // public/_headers free of script-src 'unsafe-inline'.
    .map((s) => `\n<script>\n${s}\n</script>\n`)
    .join('')}`;

  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, out);
  console.log(`${src}  ->  ${dest}  (${body.length} chars body, ${styles.length} style, ${scripts.length} script)`);
}
