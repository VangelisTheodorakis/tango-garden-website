/**
 * Card routes of the tango-garden-gardeners Worker.
 *
 *   GET    /card/<slug>                        public card page (or the "opened" page)
 *   GET    /gardeners-area/api/cards           list, for the editor
 *   GET    /gardeners-area/api/cards/<slug>    one card, to edit it
 *   PUT    /gardeners-area/api/cards/<slug>    publish (create or replace)
 *   DELETE /gardeners-area/api/cards/<slug>    remove; the link then shows the "opened" page
 *
 * Cards live in the KV namespace bound as CARDS, key `card:<slug>`, with the
 * title and date as metadata so the list needs no extra reads. The API needs
 * the same Access check as the dashboard; writes must also come from the site
 * itself (Origin), so another page can't post with the signed-in cookie.
 */
import { verifyAccess } from './access.js';
import { PAGE_HEADERS, SLUG_RE, cardPage, gonePage, validateCard } from './cards.js';

const API = '/gardeners-area/api/cards';
const key = (slug) => `card:${slug}`;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex',
    },
  });
}

const html = (body, status) => new Response(body, { status, headers: PAGE_HEADERS });

async function publicCard(request, env, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return html(gonePage(), 405);
  const slug = url.pathname.slice('/card/'.length).replace(/\/$/, '');
  const card = SLUG_RE.test(slug) && env.CARDS ? await env.CARDS.get(key(slug), 'json') : null;
  return card ? html(cardPage(card), 200) : html(gonePage(), 404);
}

export async function handleCards(request, env, url) {
  if (url.pathname.startsWith('/card/')) return publicCard(request, env, url);

  if (!(await verifyAccess(request, env))) return json({ error: 'unauthorized' }, 401);
  if (!env.CARDS) return json({ error: 'Card storage (KV namespace CARDS) is not set up yet.' }, 503);

  const rest = url.pathname.slice(API.length);
  if (rest === '' || rest === '/') {
    if (request.method !== 'GET') return json({ error: 'method not allowed' }, 405);
    const cards = [];
    let cursor;
    do {
      const page = await env.CARDS.list({ prefix: 'card:', cursor });
      for (const k of page.keys) cards.push({ slug: k.name.slice(5), ...(k.metadata ?? {}) });
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    cards.sort((a, b) => String(b.updated ?? '').localeCompare(String(a.updated ?? '')));
    return json({ cards });
  }

  const slug = rest.replace(/^\//, '').replace(/\/$/, '');
  if (!SLUG_RE.test(slug)) return json({ error: 'invalid address' }, 400);

  if (request.method === 'GET') {
    const card = await env.CARDS.get(key(slug), 'json');
    return card ? json({ card }) : json({ error: 'not found' }, 404);
  }

  if (request.method !== 'PUT' && request.method !== 'DELETE') return json({ error: 'method not allowed' }, 405);
  if (request.headers.get('origin') !== url.origin) return json({ error: 'forbidden' }, 403);

  if (request.method === 'DELETE') {
    await env.CARDS.delete(key(slug));
    return json({ deleted: slug });
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'The card data is not valid JSON.' }, 400);
  }
  const result = validateCard(input);
  if ('error' in result) return json({ error: result.error }, 400);
  if (result.card.slug !== slug) return json({ error: 'The address does not match the card.' }, 400);
  const card = { ...result.card, updated: new Date().toISOString() };
  await env.CARDS.put(key(slug), JSON.stringify(card), {
    metadata: { title: card.title, updated: card.updated },
  });
  return json({ card });
}
