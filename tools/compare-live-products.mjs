// Compares each live product page on tangogarden.de against the built page in
// dist/, so drift in title, price, stock, variants or description shows up as a
// diff instead of something a human has to spot.
//
// Usage: node tools/compare-live-products.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { products } from '../src/data/products.js';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const text = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    // Numeric entities too: the ported markup keeps &#160; where the live JSON
    // carries the character itself. Both render identically.
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Shopify prices are integer cents: 1800 -> "€18,00 EUR" */
const money = (cents) => `€${(cents / 100).toFixed(2).replace('.', ',')} EUR`;

let mismatches = 0;

for (const product of products.filter((p) => !p.hidden)) {
  const url = `https://tangogarden.de/products/${product.handle}.js`;
  let live;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`SKIP ${product.handle} — live returned ${res.status}`);
      continue;
    }
    live = await res.json();
  } catch (err) {
    console.log(`SKIP ${product.handle} — ${err.message}`);
    continue;
  }

  const file = join(DIST, 'products', product.handle, 'index.html');
  if (!existsSync(file)) {
    console.log(`MISSING BUILD ${product.handle}`);
    mismatches++;
    continue;
  }
  const { document } = parseHTML(readFileSync(file, 'utf8'));

  const checks = [
    ['title', live.title, document.querySelector('.pdp h1')?.textContent?.trim()],
    ['price', money(live.price), document.querySelector('.pdp-price')?.textContent?.trim()],
    [
      'variants',
      live.variants.map((v) => v.title).join(' | '),
      [...document.querySelectorAll('#pdp-var option')].map((o) => o.textContent.trim()).join(' | ') ||
        document.querySelector('.pdp-variant-note')?.textContent?.split(':').slice(1).join(':').trim() ||
        '(no variant control)',
    ],
    [
      'description',
      text(live.description),
      text(document.querySelector('.pdp-desc')?.innerHTML ?? ''),
    ],
  ];

  const bad = checks.filter(([, a, b]) => a !== b);
  if (!bad.length) {
    console.log(`OK   ${product.handle}`);
    continue;
  }

  mismatches++;
  console.log(`\nDIFF ${product.handle}`);
  for (const [field, liveVal, ours] of bad) {
    console.log(`  ${field}`);
    console.log(`    live: ${String(liveVal).slice(0, 220)}`);
    console.log(`    ours: ${String(ours).slice(0, 220)}`);
  }
  console.log();
}

console.log(`\n${mismatches === 0 ? 'All live products match.' : `${mismatches} product(s) differ.`}`);
