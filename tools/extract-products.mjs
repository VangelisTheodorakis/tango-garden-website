// One-off migration helper: parses the legacy product HTML pages into the
// structured data file that src/pages/products/[handle].astro renders from.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'legacy/products';

const grab = (html, re, name, handle) => {
  const m = html.match(re);
  if (!m) throw new Error(`Could not find ${name} in ${handle}`);
  return m[1];
};

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const products = [];

for (const handle of readdirSync(ROOT)) {
  const html = readFileSync(join(ROOT, handle, 'index.html'), 'utf8');
  const isPdp = html.includes('class="pdp"');
  const hidden = /content="noindex/.test(html);

  const entry = {
    handle,
    title: decode(grab(html, /<title>([\s\S]*?)<\/title>/, 'title', handle)).replace(
      / — Tango Garden$/,
      ''
    ),
    description: decode(
      grab(html, /<meta name="description" content="([^"]*)"/, 'description', handle)
    ),
    hidden,
    template: isPdp ? 'pdp' : 'legacy',
  };

  if (isPdp) {
    entry.heading = decode(grab(html, /<main class="pdp">\s*<h1>([\s\S]*?)<\/h1>/, 'h1', handle));
    entry.price = decode(grab(html, /<div class="pdp-price">([^<]*)<\/div>/, 'price', handle));
    entry.stock = decode(grab(html, /<div class="pdp-stock">([^<]*)<\/div>/, 'stock', handle));
    // Two shapes exist in the legacy pages: a <select id="pdp-var"> whose option
    // values are Shopify variant ids, or a display-only <select> with the id
    // hardcoded into the button's onclick.
    entry.variantLabel = decode(
      grab(html, /<label for="[^"]*">([^<]*)<\/label>/, 'variant label', handle)
    );

    const select = grab(html, /<select[^>]*>([\s\S]*?)<\/select>/, 'variants', handle);
    entry.variants = [...select.matchAll(/<option(?: value="(\d+)")?>([^<]*)<\/option>/g)].map(
      (m) => ({ id: m[1] ?? null, label: decode(m[2]) })
    );

    // Fallback cart id for the display-only variant shape.
    const fixed = html.match(/cart\/(\d+):/);
    entry.cartVariantId = entry.variants[0]?.id ?? (fixed ? fixed[1] : null);
    if (!entry.cartVariantId) throw new Error(`No cart variant id for ${handle}`);

    entry.bodyHtml = grab(html, /<div class="pdp-desc">([\s\S]*?)<\/div>\s*<\/main>/, 'desc', handle);
  } else {
    // The off-live products keep their original bespoke page body verbatim.
    entry.bodyHtml = grab(
      html,
      /<div class="nav-overlay" id="nav-overlay"><\/div>\s*<\/nav>([\s\S]*?)<footer class="site-footer">/,
      'legacy body',
      handle
    ).trim();
  }

  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (schema) entry.schema = JSON.parse(schema[1]);

  products.push(entry);
}

products.sort((a, b) => a.handle.localeCompare(b.handle));

const header = `/**
 * Product catalogue for tangogarden.de.
 *
 * Checkout still runs through Shopify: the PDP buttons open a Shopify cart
 * permalink built from \`variants[].id\`, so those ids must match the live store.
 *
 * \`hidden: true\` marks products that are not live on tangogarden.de. They keep
 * their page (reachable by direct URL) but carry noindex and stay out of the
 * sitemap — see astro.config.mjs.
 *
 * Generated from the legacy HTML by tools/extract-products.mjs, then maintained
 * by hand.
 */
export const products = `;

writeFileSync(
  'src/data/products.js',
  header + JSON.stringify(products, null, 2).replace(/\n/g, '\n') + ';\n'
);

console.log(
  `Wrote ${products.length} products (${products.filter((p) => p.template === 'pdp').length} pdp, ${products.filter((p) => p.hidden).length} hidden)`
);
