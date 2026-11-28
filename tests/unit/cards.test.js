import { describe, expect, it, vi } from 'vitest';
import QRCode from 'qrcode';
import { cardMarkup, cardPage, validateCard } from '../../workers/gardeners-api/cards.js';
import { qrSvg } from '../../src/lib/qr-style.js';

// The cards API sits behind the same Access check as the dashboard; that check
// has its own tests (gardeners-report.test.js). Here: signed in unless a test
// sends the "x-test-anon" header.
vi.mock('../../workers/gardeners-api/access.js', () => ({
  verifyAccess: async (request) => (request.headers.get('x-test-anon') ? null : 'team@tangogarden.de'),
}));
const { default: worker } = await import('../../workers/gardeners-api/worker.js');

const jini = {
  slug: 'for-my-jini',
  kicker: 'Day 2',
  title: 'For my Jini',
  greeting: 'Dear Jini,',
  message: 'First paragraph.\n\nSecond paragraph.',
  ask: 'Will you dance with me?',
  signoff: 'Yours,',
  signature: 'Duc',
  footer: 'Wed 2 Dec · 19:30 · Tango Garden',
  font: 'mixed',
  detailsLabel: 'See your gift',
  detailsUrl: '/pages/you-ve-got-tango',
};

/** In-memory stand-in for the CARDS KV namespace. */
function fakeKv() {
  const store = new Map();
  return {
    store,
    async get(key, type) {
      const v = store.get(key);
      return v === undefined ? null : type === 'json' ? JSON.parse(v.value) : v.value;
    },
    async put(key, value, opts = {}) {
      store.set(key, { value, metadata: opts.metadata });
    },
    async delete(key) {
      store.delete(key);
    },
    async list({ prefix }) {
      const keys = [...store].filter(([k]) => k.startsWith(prefix)).map(([name, v]) => ({ name, metadata: v.metadata }));
      return { keys, list_complete: true };
    },
  };
}

const call = (env, path, init = {}) => worker.fetch(new Request(`https://tangogarden.de${path}`, init), env, {});
const put = (env, card, headers = {}) =>
  call(env, `/gardeners-area/api/cards/${card.slug}`, {
    method: 'PUT',
    headers: { origin: 'https://tangogarden.de', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(card),
  });

describe('validateCard', () => {
  it('accepts a full card and keeps its words', () => {
    const { card } = validateCard(jini);
    expect(card).toMatchObject(jini);
  });

  it('rejects addresses that are not simple slugs', () => {
    // Upper case is simply lowered; anything else that isn't a plain slug is refused.
    expect(validateCard({ ...jini, slug: 'For-My-Jini' }).card.slug).toBe('for-my-jini');
    for (const slug of ['', 'for--jini', '-jini', 'jini/../x', 'für-jini', 'jini_2']) {
      expect(validateCard({ ...jini, slug }), slug).toHaveProperty('error');
    }
  });

  it('needs a title and a message', () => {
    expect(validateCard({ ...jini, title: ' ' })).toHaveProperty('error');
    expect(validateCard({ ...jini, message: '' })).toHaveProperty('error');
  });

  it('only lets the details button lead to a page of this site', () => {
    expect(validateCard({ ...jini, detailsUrl: 'https://evil.example/x' })).toHaveProperty('error');
    expect(validateCard({ ...jini, detailsUrl: '//evil.example/x' })).toHaveProperty('error');
    expect(validateCard({ ...jini, detailsUrl: 'https://tangogarden.de/pages/classes#a' }).card.detailsUrl).toBe(
      '/pages/classes#a'
    );
  });

  it('falls back to the mixed font for anything unknown', () => {
    expect(validateCard({ ...jini, font: 'comic-sans' }).card.font).toBe('mixed');
  });
});

describe('card markup', () => {
  it('escapes everything a person typed', () => {
    const html = cardPage({ ...jini, title: '<script>alert(1)</script>', message: '<img src=x onerror=alert(1)>' });
    expect(html).not.toContain('<script>alert');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
  });

  it('turns blank lines into paragraphs', () => {
    expect(cardMarkup(jini).match(/tgc-body/g)).toHaveLength(2);
  });

  it('hides the details button until the card is opened, and drops it without a page', () => {
    expect(cardMarkup(jini)).toContain('<p class="tgc-after" hidden>');
    expect(cardMarkup({ ...jini, detailsUrl: '' })).not.toContain('tgc-after');
  });

  it('loads no inline script or style and nothing from another host', () => {
    const html = cardPage(jini);
    expect(html).not.toMatch(/<script>|<style|style="/);
    expect(html).not.toMatch(/(src|href)="(https?:)?\/\//);
  });
});

describe('cards Worker', () => {
  it('publishes, serves, lists and deletes a card', async () => {
    const env = { CARDS: fakeKv() };
    expect((await put(env, jini)).status).toBe(200);

    const page = await call(env, '/card/for-my-jini');
    expect(page.status).toBe(200);
    expect(page.headers.get('x-robots-tag')).toMatch(/noindex/);
    expect(page.headers.get('content-security-policy')).toMatch(/default-src 'self'/);
    const html = await page.text();
    expect(html).toContain('For my Jini');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');

    const list = await (await call(env, '/gardeners-area/api/cards')).json();
    expect(list.cards).toEqual([expect.objectContaining({ slug: 'for-my-jini', title: 'For my Jini' })]);

    const del = await call(env, '/gardeners-area/api/cards/for-my-jini', {
      method: 'DELETE',
      headers: { origin: 'https://tangogarden.de' },
    });
    expect(del.status).toBe(200);
    const gone = await call(env, '/card/for-my-jini');
    expect(gone.status).toBe(404);
    expect(await gone.text()).toContain('This card has been opened');
  });

  it('shows the friendly page for unknown and malformed addresses', async () => {
    const env = { CARDS: fakeKv() };
    for (const path of ['/card/nobody', '/card/Bad_Slug', '/card/']) {
      const res = await call(env, path);
      expect(res.status, path).toBe(404);
      expect(await res.text()).toContain('This card has been opened');
    }
  });

  it('keeps the API behind Access', async () => {
    const env = { CARDS: fakeKv() };
    expect((await call(env, '/gardeners-area/api/cards', { headers: { 'x-test-anon': '1' } })).status).toBe(401);
    expect((await put(env, jini, { 'x-test-anon': '1' })).status).toBe(401);
    expect(env.CARDS.store.size).toBe(0);
  });

  it('refuses writes from another site', async () => {
    const env = { CARDS: fakeKv() };
    expect((await put(env, jini, { origin: 'https://evil.example' })).status).toBe(403);
    expect(env.CARDS.store.size).toBe(0);
  });

  it('refuses invalid cards and a slug that does not match the address', async () => {
    const env = { CARDS: fakeKv() };
    expect((await put(env, { ...jini, message: '' })).status).toBe(400);
    const res = await call(env, '/gardeners-area/api/cards/someone-else', {
      method: 'PUT',
      headers: { origin: 'https://tangogarden.de' },
      body: JSON.stringify(jini),
    });
    expect(res.status).toBe(400);
  });

  it('says clearly when the KV namespace is not set up yet', async () => {
    expect((await call({}, '/gardeners-area/api/cards')).status).toBe(503);
    expect((await call({}, '/card/for-my-jini')).status).toBe(404);
  });
});

describe('qrSvg', () => {
  it('draws one dot per dark module outside the three eyes', () => {
    const url = 'https://tangogarden.de/card/for-my-jini';
    const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
    const n = qr.modules.size;
    let expected = 0;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        const eye = (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
        if (qr.modules.get(r, c) && !eye) expected++;
      }
    const svg = qrSvg(url);
    expect(svg.match(/rx="0\.14"/g)).toHaveLength(expected);
    expect(svg.match(/<circle /g)).toHaveLength(3);
    expect(svg).toContain('#576D1F');
  });
});
