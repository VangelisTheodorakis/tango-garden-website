import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products.js';
import { navItems, social } from '../../src/data/nav.js';
import { classPages } from '../../src/data/classPages.js';

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

    it('are the eight Shopify SKUs behind the pricing tables', () => {
      // These no longer have their own live page (see src/data/classPages.js),
      // but their price/variant data still has to stay accurate for the day
      // showPurchaseControls goes back on.
      expect(pdp).toHaveLength(8);
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

  it('hides every product now that classes are presented on consolidated pages', () => {
    // Each class used to be N separate per-SKU pages; now it's one page with a
    // combined pricing table (src/data/classPages.js), so every product handle
    // is hidden — reachable by direct URL, noindexed, out of the sitemap — and
    // public/_redirects sends the old live handles to their new page.
    const hidden = products.filter((p) => p.hidden).map((p) => p.handle);
    expect(hidden.sort()).toEqual(
      products
        .map((p) => p.handle)
        .sort()
    );
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

  it('points the Classes menu at the consolidated class pages', () => {
    const classes = navItems.find((i) => i.label === 'Classes');
    const slugs = classPages.map((c) => c.slug);
    for (const child of classes.children) {
      expect(child.href, child.href).toMatch(/^\/pages\//);
      expect(slugs, child.href).toContain(child.href.replace('/pages/', ''));
    }
  });

  it('uses https for every social link', () => {
    for (const url of Object.values(social)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});

describe('classPages data', () => {
  it('uses unique, URL-safe slugs', () => {
    const slugs = classPages.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('references product handles that exist', () => {
    for (const page of classPages) {
      for (const row of page.table.rows) {
        expect(products.some((p) => p.handle === row.general.handle), row.label).toBe(true);
        if (row.student) {
          expect(products.some((p) => p.handle === row.student.handle), row.label).toBe(true);
        }
      }
    }
  });

  it('lists every table handle in offerHandles, so the Course schema stays complete', () => {
    for (const page of classPages) {
      const tableHandles = page.table.rows.flatMap((r) =>
        r.student ? [r.general.handle, r.student.handle] : [r.general.handle]
      );
      for (const handle of tableHandles) {
        expect(page.offerHandles, `${page.slug}: ${handle}`).toContain(handle);
      }
    }
  });

  it('only points offerHandles at products with structured-data offers', () => {
    for (const page of classPages) {
      for (const handle of page.offerHandles) {
        const product = products.find((p) => p.handle === handle);
        expect(product?.schema?.offers, `${page.slug}: ${handle}`).toBeTruthy();
      }
    }
  });

  it('points every class page nav/pathway link at a page that exists', () => {
    const slugs = new Set(classPages.map((c) => c.slug));
    const classes = navItems.find((i) => i.label === 'Classes');
    for (const child of classes.children) {
      expect(slugs.has(child.href.replace('/pages/', '')), child.href).toBe(true);
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
