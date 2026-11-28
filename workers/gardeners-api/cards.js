/**
 * Personal flip cards: /card/<slug>.
 *
 * One module for both sides: the Worker renders public card pages from it, and
 * the editor in /gardeners-area/cards imports it for a preview that is exactly
 * what goes live. Styles and the flip script are static files of the site
 * (/assets/card/card.css, /assets/card/card.js), because the CSP allows no
 * inline styles or scripts.
 *
 * Everything a person types is escaped here; nothing is ever inserted raw.
 */

export const SITE = 'https://tangogarden.de';
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const FONTS = ['mixed', 'caveat', 'inter'];
export const FONT_LABELS = {
  mixed: 'Handwritten + easy-read message',
  caveat: 'All handwritten',
  inter: 'All in the site font',
};

/** Field limits. The card scales its text, but only so far. */
const LIMITS = {
  kicker: 40,
  title: 60,
  greeting: 80,
  message: 1200,
  ask: 120,
  signoff: 60,
  signature: 60,
  footer: 80,
  detailsLabel: 40,
  detailsUrl: 300,
};

export const cardUrl = (slug) => `${SITE}/card/${slug}`;

export const EMPTY_CARD = {
  slug: '',
  kicker: '',
  title: '',
  greeting: '',
  message: '',
  ask: '',
  signoff: '',
  signature: '',
  footer: '',
  font: 'mixed',
  detailsLabel: 'See your gift',
  detailsUrl: '/pages/you-ve-got-tango',
};

/** @typedef {typeof EMPTY_CARD} Card */

const str = (v) => (typeof v === 'string' ? v : '').replace(/\r\n?/g, '\n').trim();

/**
 * Checks and tidies a card coming from the editor.
 * @returns {{ card: Card } | { error: string }}
 */
export function validateCard(input) {
  if (!input || typeof input !== 'object') return { error: 'No card data.' };
  const card = /** @type {Card} */ ({ ...EMPTY_CARD });
  card.slug = str(input.slug).toLowerCase();
  if (!SLUG_RE.test(card.slug) || card.slug.length > 60) {
    return { error: 'The address may only use a–z, 0–9 and single dashes (max 60), e.g. for-my-jini.' };
  }
  for (const [key, max] of Object.entries(LIMITS)) {
    card[key] = str(input[key]);
    if (card[key].length > max) return { error: `"${key}" is too long (max ${max} characters).` };
  }
  if (!card.title) return { error: 'The card needs a title for its front.' };
  if (!card.message) return { error: 'The card needs a message.' };
  card.font = FONTS.includes(input.font) ? input.font : 'mixed';
  // The details button may only lead to a page of this site.
  if (card.detailsUrl) {
    let u;
    try {
      u = new URL(card.detailsUrl, SITE);
    } catch {
      return { error: 'The details link is not a valid address.' };
    }
    if (u.origin !== SITE) return { error: 'The details link must be a page on tangogarden.de, e.g. /pages/you-ve-got-tango.' };
    card.detailsUrl = u.pathname + u.search + u.hash;
  }
  if (!card.detailsUrl) card.detailsLabel = '';
  return { card };
}

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Blank lines split paragraphs; single line breaks stay line breaks. */
function paragraphs(text) {
  return String(text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<span class="tgc-p tgc-body">${escapeHtml(p).replace(/\n/g, '<br />')}</span>`)
    .join('');
}

const line = (cls, text) => (text ? `<span class="tgc-p ${cls}">${escapeHtml(text)}</span>` : '');

/**
 * The card itself: a button with two faces, then the details link (hidden
 * until the card has been opened once). Wrap it in .tgc-stage.
 */
export function cardMarkup(card) {
  const c = { ...EMPTY_CARD, ...card };
  const font = FONTS.includes(c.font) ? c.font : 'mixed';
  const details =
    c.detailsUrl && c.detailsLabel
      ? `<p class="tgc-after" hidden><a class="tgc-details" href="${escapeHtml(c.detailsUrl)}">${escapeHtml(c.detailsLabel)}</a></p>`
      : '';
  return (
    `<button class="tgc-card tgc-font-${font}" type="button" aria-pressed="false" aria-label="Open the card">` +
    `<span class="tgc-inner">` +
    `<span class="tgc-face tgc-front">` +
    `<img class="tgc-logo" src="/assets/logo-icon.svg" alt="" width="80" height="80" />` +
    (c.kicker ? `<span class="tgc-kicker">${escapeHtml(c.kicker)}</span>` : '') +
    `<span class="tgc-title" aria-hidden="true">${escapeHtml(c.title)}</span>` +
    `<span class="tgc-hint">Tap to open</span>` +
    `</span>` +
    `<span class="tgc-face tgc-back" aria-hidden="true">` +
    line('tgc-greeting', c.greeting) +
    paragraphs(c.message) +
    line('tgc-ask', c.ask) +
    line('tgc-signoff', c.signoff) +
    line('tgc-signature', c.signature) +
    (c.footer ? `<span class="tgc-foot">${escapeHtml(c.footer)}</span>` : '') +
    `</span>` +
    `</span>` +
    `</button>` +
    details
  );
}

function page({ title, body, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>${escapeHtml(title)} | Tango Garden</title>
<link rel="icon" type="image/svg+xml" href="/assets/logo-icon.svg" />
<link rel="preload" href="/fonts/caveat-latin-400.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/assets/card/card.css" />
${extraHead}</head>
<body class="tgc-page">
<main class="tgc-main">
<a class="tgc-home" href="/"><img src="/assets/logo-icon.svg" alt="" width="36" height="36" /><span>Tango Garden</span></a>
${body}
</main>
</body>
</html>`;
}

/** The public page for one card. */
export function cardPage(card) {
  return page({
    title: card.title,
    extraHead: '<script src="/assets/card/card.js" defer></script>\n',
    body: `<h1 class="tgc-vh">${escapeHtml(card.title)}</h1>\n<div class="tgc-stage">${cardMarkup(card)}</div>`,
  });
}

/** What a removed (or never existing) card's link shows: printed QR codes outlive their cards. */
export function gonePage() {
  return page({
    title: 'This card has been opened',
    body: `<div class="tgc-gone">
<h1>This card has been opened</h1>
<p>This little card has done its job. See you on the dance floor.</p>
<p><a class="tgc-details" href="/">Visit Tango Garden</a></p>
</div>`,
  });
}

/** Security headers for card pages (the site's _headers file does not cover Worker responses). */
export const PAGE_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-cache',
  'x-robots-tag': 'noindex, nofollow',
  'content-security-policy':
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; " +
    "connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
};
