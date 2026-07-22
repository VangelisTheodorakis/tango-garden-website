import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products.js';
import { navItems, social } from '../../src/data/nav.js';

const feed = (name) =>
  JSON.parse(readFileSync(new URL(`../../public/assets/data/${name}.json`, import.meta.url), 'utf8'));

const FEEDS = ['enter-the-garden', 'regular-classes', 'practicas'];

describe('products data', () => {
  it('has every product', () => {
    expect(products).toHaveLength(12);
  });

  it('uses unique handles', () => {
    const handles = products.map((p) => p.handle);
    expect(new Set(handles).size).toBe(handles.length);
  });

  it('uses URL-safe handles', () => {
    for (const p of products) {
      expect(p.handle, p.handle).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it.each(products)('$handle has the fields every template needs', (p) => {
    expect(p.title).toBeTruthy();
    expect(p.description).toBeTruthy();
    expect(p.bodyHtml).toBeTruthy();
    expect(['pdp', 'legacy']).toContain(p.template);
    expect(typeof p.hidden).toBe('boolean');
  });

  describe('purchasable products', () => {
    const pdp = products.filter((p) => p.template === 'pdp');

    it('are the eight products live on the store', () => {
      expect(pdp).toHaveLength(8);
      expect(pdp.every((p) => !p.hidden)).toBe(true);
    });

    it.each(pdp)('$handle prices in euros', (p) => {
      expect(p.price, p.handle).toMatch(/^€\d+,\d{2} EUR$/);
    });

    it.each(pdp)('$handle can build a Shopify cart permalink', (p) => {
      // A wrong or missing id sends a real customer to a broken checkout.
      expect(p.cartVariantId, p.handle).toMatch(/^\d{10,}$/);
      expect(p.variants.length, p.handle).toBeGreaterThan(0);
      for (const v of p.variants) {
        expect(v.label, p.handle).toBeTruthy();
        if (v.id !== null) expect(v.id, p.handle).toMatch(/^\d{10,}$/);
      }
    });

    it('uses a distinct variant id per product', () => {
      const ids = pdp.map((p) => p.cartVariantId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('marks exactly the four off-live products hidden', () => {
    const hidden = products.filter((p) => p.hidden).map((p) => p.handle);
    expect(hidden.sort()).toEqual([
      'enter-the-garden-general-admission',
      'enter-the-garden-introductory-session-student-and-under-28-admission',
      'the-garden-practica-1-time-pass-evey',
      'the-sprouting-sessions-beginner-level-1-class-welcome-pass',
    ]);
  });

  it('carries valid structured data where present', () => {
    for (const p of products.filter((x) => x.schema)) {
      expect(p.schema['@context'], p.handle).toBe('https://schema.org');
      expect(p.schema['@type'], p.handle).toBeTruthy();
    }
  });
});

describe('navigation data', () => {
  it('links only to internal paths', () => {
    const walk = (items) => {
      for (const item of items) {
        expect(item.label, item.href).toBeTruthy();
        expect(item.href, item.label).toMatch(/^\//);
        if (item.children) walk(item.children);
      }
    };
    walk(navItems);
  });

  it('points the Classes menu at products that exist', () => {
    const classes = navItems.find((i) => i.label === 'Classes');
    for (const child of classes.children) {
      const handle = child.href.replace('/products/', '');
      expect(products.some((p) => p.handle === handle), child.href).toBe(true);
    }
  });

  // KNOWN ISSUE, awaiting a product decision — do not delete this test.
  // The "Enter the Garden" item in the Classes menu (and the first pathway card
  // on the home page) points at a product marked hidden: noindex, disallowed in
  // robots.txt, absent from the sitemap. So every page links to a page we tell
  // search engines to ignore, and the destination is an off-live page with an
  // older design and a WhatsApp booking flow instead of checkout.
  // Either the product goes live, or those links should point somewhere else.
  it.skip('does not feature hidden products in the menu', () => {
    const hidden = new Set(products.filter((p) => p.hidden).map((p) => p.handle));
    const classes = navItems.find((i) => i.label === 'Classes');
    for (const child of classes.children) {
      expect(hidden.has(child.href.replace('/products/', '')), child.href).toBe(false);
    }
  });

  it('uses https for every social link', () => {
    for (const url of Object.values(social)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});

describe('event feeds', () => {
  it.each(FEEDS)('%s.json is shaped the way the cards expect', (name) => {
    const data = feed(name);
    expect(typeof data.label).toBe('string');
    expect(data.label.length).toBeGreaterThan(0);
    expect(typeof data.emptyMessage).toBe('string');
    expect(Array.isArray(data.events)).toBe(true);
  });

  it.each(FEEDS)('%s.json uses ISO dates only', (name) => {
    for (const event of feed(name).events) {
      // The card silently drops anything it cannot parse, so a typo here would
      // fail quietly in production. Catch it at build time instead.
      expect(event.date, JSON.stringify(event)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${event.date}T00:00:00`).toString()).not.toBe('Invalid Date');
      if ('time' in event) expect(typeof event.time).toBe('string');
    }
  });

  it.each(FEEDS)('%s.json contains no duplicate dates', (name) => {
    const dates = feed(name).events.map((e) => e.date);
    expect(new Set(dates).size).toBe(dates.length);
  });
});
