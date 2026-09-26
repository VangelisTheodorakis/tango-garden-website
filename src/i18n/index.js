/**
 * English is the default and lives at the existing URLs. German mirrors a
 * translated English page at '/de' + the same path — no localized slugs, so
 * the switcher, hreflang and tests can all derive one URL from the other.
 *
 * @typedef {'en' | 'de'} Locale
 */

export const SITE = 'https://tangogarden.de';

/**
 * English paths that have a German counterpart. Only the hidden, noindexed
 * product pages stay English-only.
 */
export const translatedPaths = [
  '/',
  '/collections/all',
  '/pages/beginner-course',
  '/pages/code-of-care',
  '/pages/contact',
  '/pages/enter-the-garden',
  '/pages/garden-practica',
  '/pages/impressum',
  '/pages/privacy-policy',
  '/pages/refund-and-cancellation-policy',
  '/pages/tango-rhythm-trainer',
  '/pages/terms-of-service',
  '/pages/the-garden',
];

const trimSlash = (/** @type {string} */ p) => p.replace(/(.)\/$/, '$1');

/** @param {string} pathname @returns {Locale} */
export const getLocale = (pathname) => (/^\/de(\/|$)/.test(pathname) ? 'de' : 'en');

/** The English path a (possibly German) pathname corresponds to, without a trailing slash. */
export const basePath = (/** @type {string} */ pathname) =>
  trimSlash(pathname.replace(/^\/de(?=\/|$)/, '')) || '/';

export const isTranslated = (/** @type {string} */ path) =>
  translatedPaths.includes(basePath(path.split('#')[0]));

/**
 * Where an internal link should point for the given locale. Pages without a
 * German version stay on their English URL rather than 404ing under /de.
 * @param {string} path an English path, optionally with a #hash
 * @param {Locale} locale
 */
export const localizePath = (path, locale) => {
  if (locale === 'en' || !isTranslated(path)) return path;
  return path === '/' ? '/de' : path.startsWith('/#') ? `/de${path.slice(1)}` : `/de${path}`;
};

/**
 * Price labels as displayed: "€13" stays as-is in English, German puts the
 * symbol after the amount ("13 €") and translates "Free".
 * @param {string} label
 * @param {Locale} locale
 */
export const formatPrice = (label, locale) => {
  if (locale !== 'de') return label;
  if (label === 'Free') return 'Kostenlos';
  return label.replace(/^€(\d+)$/, '$1 €');
};

/** Absolute URL in the site's canonical shape (no trailing slash except the root). */
export const absoluteUrl = (/** @type {string} */ path) =>
  path === '/' ? `${SITE}/` : `${SITE}${trimSlash(path)}`;

/**
 * hreflang alternates for a page, or null when it has no translation.
 * @param {string} pathname
 */
export const alternatesFor = (pathname) => {
  const base = basePath(pathname);
  if (!translatedPaths.includes(base)) return null;
  return { en: absoluteUrl(base), de: absoluteUrl(localizePath(base, 'de')) };
};

/**
 * Target of the language switcher: the same page in the other language, or
 * that language's homepage when the page isn't translated.
 * @param {string} pathname
 * @param {Locale} target
 */
export const switchPath = (pathname, target) => {
  const base = basePath(pathname);
  if (!translatedPaths.includes(base)) return target === 'de' ? '/de' : '/';
  return localizePath(base, target);
};
