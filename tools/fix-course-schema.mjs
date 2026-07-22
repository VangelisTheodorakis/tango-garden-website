// One-off: brings the Course JSON-LD in src/data/products.js in line with
// Google's structured-data policy.
//
//  1. `offers` must describe what is purchasable on THAT url. Seven of the eight
//     product pages listed both the general and the reduced price, several with
//     the wrong one first, so the markup advertised a price the page does not
//     show — a documented manual-action trigger.
//  2. `category` is required for the Course Info rich result.
//  3. `courseWorkload` must be an ISO 8601 duration. Values like
//     "PT1H30M weekly for 4 weeks" and "Drop-in" are invalid, so the whole
//     rich result was ineligible. Expressed as `courseSchedule` instead.
import { readFileSync, writeFileSync } from 'node:fs';
import { products } from '../src/data/products.js';

const SCHEDULES = {
  'PT1H30M weekly for 4 weeks': { duration: 'PT1H30M', repeatFrequency: 'Weekly', repeatCount: 4 },
  'PT1H30M weekly for 10 weeks': { duration: 'PT1H30M', repeatFrequency: 'Weekly', repeatCount: 10 },
  'Drop-in': { duration: 'PT2H30M', repeatFrequency: 'Weekly' },
  'Drop-in, no enrollment required': { duration: 'PT2H30M', repeatFrequency: 'Weekly' },
};

/** "€45,00 EUR" -> "45.00" */
const pagePrice = (s) => s.match(/([\d.]+),(\d{2})/)?.slice(1).join('.') ?? null;

let changed = 0;

for (const product of products) {
  const schema = product.schema;
  if (!schema) continue;

  const instance = schema.hasCourseInstance;
  if (instance) {
    const workload = instance.courseWorkload;
    const schedule = SCHEDULES[workload] ?? { duration: 'PT1H30M', repeatFrequency: 'Weekly' };
    delete instance.courseWorkload;
    instance.courseSchedule = { '@type': 'Schedule', ...schedule };
    changed++;
  }

  if (schema.offers) {
    const all = Array.isArray(schema.offers) ? schema.offers : [schema.offers];
    const price = product.price ? pagePrice(product.price) : null;

    // Keep only the offer this page actually sells.
    const match = price ? all.filter((o) => o.price === price) : all;
    const kept = (match.length ? match : all).slice(0, 1);

    for (const offer of kept) {
      offer.category ??= 'Paid';
      offer.url ??= `https://tangogarden.de/products/${product.handle}`;
    }
    schema.offers = kept.length === 1 ? kept[0] : kept;
  }

  // Give each Course a stable identity so the same name on sibling URLs is not
  // read as one duplicated entity.
  schema['@id'] ??= `https://tangogarden.de/products/${product.handle}#course`;
  schema.url ??= `https://tangogarden.de/products/${product.handle}`;
}

const src = readFileSync('src/data/products.js', 'utf8');
const header = src.slice(0, src.indexOf('export const products = '));
writeFileSync(
  'src/data/products.js',
  header + 'export const products = ' + JSON.stringify(products, null, 2) + ';\n'
);

console.log(`Rewrote schema for ${changed} course instances across ${products.length} products.`);
