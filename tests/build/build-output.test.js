/**
 * Asserts invariants of the built site in dist/.
 *
 * Run `npm run build` first — these read the real shipped HTML rather than
 * component source, so they catch anything that only goes wrong at build time.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { beforeAll, describe, expect, it } from 'vitest';
import { products } from '../../src/data/products.js';

// fileURLToPath, not URL.pathname — the repo path contains spaces.
const DIST = fileURLToPath(new URL('../../dist/', import.meta.url));
const SITE = 'https://tangogarden.de';

/** Every built HTML file, as { route, file, html, document }. */
const pages = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.html')) {
      const html = readFileSync(full, 'utf8');
      const route =
        '/' +
        relative(DIST, full)
          .split(sep)
          .join('/')
          .replace(/index\.html$/, '')
          .replace(/\.html$/, '');
      pages.push({ route, file: relative(DIST, full), html, document: parseHTML(html).document });
    }
  }
}

beforeAll(() => {
  expect(
    existsSync(DIST),
    'dist/ not found — run `npm run build` before the build tests'
  ).toBe(true);
  walk(DIST);
  expect(pages.length).toBeGreaterThan(0);
});

const contentPages = () => pages.filter((p) => p.route !== '/404');

describe('pages', () => {
  it('builds every expected route', () => {
    // 1 home + 11 content/legal + 12 products + 2 collections + 404
    expect(pages).toHaveLength(27);
  });

  it('gives every page a non-empty title', () => {
    for (const p of pages) {
      expect(p.document.querySelector('title')?.textContent?.trim(), p.file).toBeTruthy();
    }
  });

  it('gives every indexable page a unique title', () => {
    const seen = new Map();
    for (const p of contentPages()) {
      if (p.document.querySelector('meta[name="robots"]')) continue;
      const title = p.document.querySelector('title').textContent.trim();
      // /collections and /collections/all intentionally share one, and say so
      // with a canonical.
      if (p.route.startsWith('/collections')) continue;
      expect(seen.has(title) ? `${seen.get(title)} + ${p.file}` : title, 'duplicate title').toBe(
        title
      );
      seen.set(title, p.file);
    }
  });

  it('gives every page a meta description of a usable length', () => {
    for (const p of pages) {
      const desc = p.document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
        ?.trim();
      expect(desc, p.file).toBeTruthy();
      // Only pages that can appear in a search result need a SERP-shaped one.
      const indexable = p.route !== '/404' && !p.document.querySelector('meta[name="robots"]');
      if (indexable) {
        expect(desc.length, `${p.file} description too short`).toBeGreaterThan(50);
        expect(desc.length, `${p.file} description will truncate in SERPs`).toBeLessThan(165);
      }
    }
  });

  it('gives every page a self-consistent absolute canonical', () => {
    for (const p of pages) {
      const canonical = p.document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      expect(canonical, p.file).toBeTruthy();
      expect(canonical, p.file).toMatch(new RegExp(`^${SITE}`));
    }
  });

  it('gives every page exactly one h1', () => {
    for (const p of pages) {
      expect(p.document.querySelectorAll('h1').length, p.file).toBe(1);
    }
  });

  it('declares a language and a viewport', () => {
    for (const p of pages) {
      expect(p.document.documentElement.getAttribute('lang'), p.file).toBeTruthy();
      expect(p.document.querySelector('meta[name="viewport"]'), p.file).toBeTruthy();
    }
  });

  it('renders the skip link first inside body', () => {
    for (const p of pages) {
      expect(p.document.querySelector('body > a')?.className, p.file).toBe('skip-link');
      expect(p.document.querySelector('#main-content'), p.file).toBeTruthy();
    }
  });
});

describe('indexing', () => {
  const hidden = products.filter((p) => p.hidden).map((p) => p.handle);

  it('noindexes every off-live product', () => {
    for (const handle of hidden) {
      const page = pages.find((p) => p.route === `/products/${handle}/`);
      expect(page, handle).toBeTruthy();
      const robots = page.document.querySelector('meta[name="robots"]')?.getAttribute('content');
      expect(robots, handle).toContain('noindex');
    }
  });

  it('leaves every live product indexable', () => {
    for (const p of products.filter((x) => !x.hidden)) {
      const page = pages.find((x) => x.route === `/products/${p.handle}/`);
      expect(page.document.querySelector('meta[name="robots"]'), p.handle).toBeNull();
    }
  });

  it('keeps every off-live product out of the sitemap', () => {
    const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    for (const handle of hidden) {
      expect(sitemap, handle).not.toContain(handle);
    }
  });

  it('never lists a noindexed page in the sitemap', () => {
    // Listing a URL in the sitemap while telling robots to ignore it sends
    // Google two contradicting signals about the same page.
    const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    const contradictions = pages
      .filter((p) => p.document.querySelector('meta[name="robots"][content*="noindex"]'))
      .filter((p) => sitemap.includes(SITE + p.route))
      .map((p) => p.file);
    expect(contradictions).toEqual([]);
  });

  it('keeps the unfinished German legal placeholders unindexed', () => {
    // These pages say "wird hier ergänzt" — publishing an empty AGB or
    // Datenschutzerklärung is a legal risk for a German business.
    for (const slug of ['agb', 'datenschutz', 'widerruf']) {
      const page = pages.find((p) => p.route === `/pages/${slug}/`);
      expect(page, slug).toBeTruthy();
      expect(
        page.document.querySelector('meta[name="robots"]')?.getAttribute('content'),
        slug
      ).toContain('noindex');
    }
  });

  it('lists every indexable page in the sitemap, by its canonical URL', () => {
    const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    for (const p of contentPages()) {
      if (p.document.querySelector('meta[name="robots"]')) continue;
      if (p.route === '/collections/') continue; // canonicalised to /collections/all
      // The sitemap must list the same string the page declares as canonical,
      // or the two disagree about which URL is the real one.
      const canonical = p.document.querySelector('link[rel="canonical"]').getAttribute('href');
      expect(listed, `${p.file} canonical not in sitemap`).toContain(canonical);
    }
  });

  it('uses one trailing-slash convention across canonicals and the sitemap', () => {
    // These URLs are indexed without a trailing slash, and the host serves them
    // that way, so a canonical or sitemap entry with one would point at a
    // redirect. Root is the only exception.
    const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    const slashed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .filter((url) => url.endsWith('/') && url !== `${SITE}/`);
    expect(slashed, 'sitemap entries with a trailing slash').toEqual([]);

    const badCanonicals = pages
      .map((p) => [p.file, p.document.querySelector('link[rel="canonical"]')?.getAttribute('href')])
      .filter(([, href]) => href && href.endsWith('/') && href !== `${SITE}/`)
      .map(([file]) => file);
    expect(badCanonicals, 'canonicals with a trailing slash').toEqual([]);
  });

  it('does not Disallow anything that relies on a noindex tag', () => {
    // A Disallow stops the crawler fetching the page, so it can never read the
    // noindex — which is how a URL ends up indexed with no title or snippet.
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    const disallowed = robots
      .split('\n')
      .filter((line) => line.trim().toLowerCase().startsWith('disallow:'))
      .map((line) => line.split(':')[1].trim())
      .filter(Boolean);
    expect(disallowed).toEqual([]);
    expect(robots).toContain('Sitemap: https://tangogarden.de/sitemap-index.xml');
  });

  it('marks noindexed pages noindex without nofollow', () => {
    for (const p of pages) {
      const robots = p.document.querySelector('meta[name="robots"]')?.getAttribute('content');
      if (robots) expect(robots, p.file).not.toContain('nofollow');
    }
  });
});

describe('structured data', () => {
  it('parses as valid JSON everywhere it appears', () => {
    for (const p of pages) {
      for (const script of p.document.querySelectorAll('script[type="application/ld+json"]')) {
        expect(() => JSON.parse(script.textContent), p.file).not.toThrow();
        const data = JSON.parse(script.textContent);
        expect(data['@context'], p.file).toBe('https://schema.org');
        expect(data['@type'], p.file).toBeTruthy();
      }
    }
  });

  it('only advertises prices that are visible on the page', () => {
    // Google treats markup that claims a price the page does not show as a
    // structured-data violation, and the penalty strips rich results sitewide.
    for (const product of products.filter((p) => p.template === 'pdp')) {
      const page = pages.find((x) => x.route === `/products/${product.handle}/`);
      const visible = page.document.querySelector('.pdp-price').textContent;
      const asDecimal = visible.match(/([\d.]+),(\d{2})/).slice(1).join('.');

      for (const script of page.document.querySelectorAll('script[type="application/ld+json"]')) {
        const data = JSON.parse(script.textContent);
        if (!data.offers) continue;
        const offers = Array.isArray(data.offers) ? data.offers : [data.offers];
        for (const offer of offers) {
          expect(offer.price, `${product.handle} advertises ${offer.price}, page shows ${asDecimal}`)
            .toBe(asDecimal);
          // Required for the Course Info rich result.
          expect(offer.category, product.handle).toBeTruthy();
        }
      }
    }
  });

  it('expresses course duration as an ISO 8601 value', () => {
    for (const product of products.filter((p) => p.schema?.hasCourseInstance)) {
      const instance = product.schema.hasCourseInstance;
      expect(instance.courseWorkload, `${product.handle} still uses courseWorkload`).toBeUndefined();
      expect(instance.courseSchedule?.duration, product.handle).toMatch(/^PT\d+H(\d+M)?$/);
    }
  });

  it('describes the business on the home page', () => {
    const home = pages.find((p) => p.route === '/');
    const blocks = [...home.document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent)
    );
    const business = blocks.find((b) => String(b['@type']).includes('LocalBusiness'));
    expect(business).toBeTruthy();
    expect(business.address.postalCode).toBe('50668');
    expect(business.telephone).toBeTruthy();
  });
});

describe('links', () => {
  const internalTargets = () => {
    const routes = new Set();
    for (const p of pages) {
      routes.add(p.route);
      routes.add(p.route.replace(/\/$/, ''));
    }
    return routes;
  };

  it('resolves every internal link to a page that exists', () => {
    const routes = internalTargets();
    const broken = [];

    for (const p of pages) {
      for (const a of p.document.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href');
        if (!href.startsWith('/')) continue;
        const path = href.split('#')[0].split('?')[0];
        if (path === '') continue;
        if (routes.has(path) || routes.has(path.replace(/\/$/, ''))) continue;
        // Static assets are served straight from dist/.
        if (existsSync(join(DIST, path))) continue;
        broken.push(`${p.file} -> ${href}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it('resolves every in-page anchor target', () => {
    const missing = [];
    for (const p of pages) {
      for (const a of p.document.querySelectorAll('a[href^="#"]')) {
        const id = a.getAttribute('href').slice(1);
        if (!id) continue;
        if (!p.document.getElementById(id)) missing.push(`${p.file} -> #${id}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('resolves cross-page anchors that point at a section', () => {
    const missing = [];
    for (const p of pages) {
      for (const a of p.document.querySelectorAll('a[href*="#"]')) {
        const href = a.getAttribute('href');
        if (!href.startsWith('/') || !href.includes('#')) continue;
        const [path, id] = href.split('#');
        const target = pages.find(
          (x) => x.route === path || x.route.replace(/\/$/, '') === path.replace(/\/$/, '')
        );
        if (!target || !id) continue;
        if (!target.document.getElementById(id)) missing.push(`${p.file} -> ${href}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('adds rel="noopener" to every link that opens a new tab', () => {
    const unsafe = [];
    for (const p of pages) {
      for (const a of p.document.querySelectorAll('a[target="_blank"]')) {
        const rel = a.getAttribute('rel') ?? '';
        if (!rel.includes('noopener')) unsafe.push(`${p.file} -> ${a.getAttribute('href')}`);
      }
    }
    expect(unsafe).toEqual([]);
  });

  it('gives every image an alt attribute', () => {
    const missing = [];
    for (const p of pages) {
      for (const img of p.document.querySelectorAll('img')) {
        if (img.getAttribute('alt') === null) missing.push(`${p.file} -> ${img.getAttribute('src')}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('third-party independence', () => {
  it('loads no assets from the Shopify CDN', () => {
    const offenders = pages.filter((p) => p.html.includes('cdn.shopify.com')).map((p) => p.file);
    expect(offenders).toEqual([]);
  });

  it('loads no fonts from Google', () => {
    const offenders = pages
      .filter((p) => p.html.includes('fonts.googleapis.com') || p.html.includes('fonts.gstatic.com'))
      .map((p) => p.file);
    expect(offenders).toEqual([]);
  });

  it('self-hosts every stylesheet, script and font', () => {
    const external = [];
    const selector =
      'link[rel="stylesheet"], link[rel="preload"], link[rel="icon"], script[src]';
    for (const p of pages) {
      for (const el of p.document.querySelectorAll(selector)) {
        const url = el.getAttribute('href') ?? el.getAttribute('src');
        if (/^https?:\/\//.test(url)) external.push(`${p.file} -> ${url}`);
      }
    }
    expect(external).toEqual([]);
  });

  it('only frames Google Maps, and only on the contact page', () => {
    for (const p of pages) {
      for (const frame of p.document.querySelectorAll('iframe')) {
        expect(p.route, 'unexpected iframe').toBe('/pages/contact/');
        expect(frame.getAttribute('src')).toMatch(/^https:\/\/maps\.google\.com\//);
      }
    }
  });
});

describe('deploy artefacts', () => {
  it.each(['_headers', '_redirects', 'robots.txt', 'CNAME', '.nojekyll', 'sitemap-index.xml'])(
    'ships %s',
    (file) => {
      expect(existsSync(join(DIST, file)), file).toBe(true);
    }
  );

  it('serves the domain it is built for', () => {
    expect(readFileSync(join(DIST, 'CNAME'), 'utf8').trim()).toBe('tangogarden.de');
  });
});
