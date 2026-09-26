/**
 * UI strings shared by the site chrome (layout, nav, footer, switcher).
 * Page and component copy stays next to its component; only strings used in
 * more than one place live here.
 */
export const ui = {
  en: {
    skipLink: 'Skip to content',
    homeAria: 'Tango Garden Home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    showSubmenu: (/** @type {string} */ label) => `Show ${label} submenu`,
    connectWithUs: 'Connect with us',
    switchLabel: 'EN',
    switchAria: 'English – EN',
    footer: {
      connect: 'Connect',
      classes: 'Classes',
      legal: 'Legal',
      theGarden: 'The Garden',
      contact: 'Contact',
      classesAndPasses: 'Classes & Passes',
      refund: 'Refund & Cancellation Policy',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      codeOfCare: 'Code of Care',
      credit: 'Made with love ♥ and AI ✨',
    },
  },
  de: {
    skipLink: 'Zum Inhalt springen',
    homeAria: 'Tango Garden Startseite',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    showSubmenu: (/** @type {string} */ label) => `Untermenü ${label} anzeigen`,
    connectWithUs: 'Schreib uns',
    switchLabel: 'DE',
    switchAria: 'Deutsch – DE',
    footer: {
      connect: 'Kontakt',
      classes: 'Kurse',
      legal: 'Rechtliches',
      theGarden: 'Über uns',
      contact: 'Kontakt',
      classesAndPasses: 'Kurse & Pässe',
      refund: 'Stornierung & Rückerstattung',
      terms: 'AGB',
      privacy: 'Datenschutz',
      codeOfCare: 'Code of Care',
      credit: 'Mit Liebe ♥ und KI gemacht ✨',
    },
  },
};

/** German nav labels, keyed by the English href in src/data/nav.js. */
export const navLabelsDe = {
  '/pages/the-garden': 'Über uns',
  '/pages/the-garden#our-story': 'Unsere Geschichte',
  '/pages/the-garden#our-gardeners': 'Unser Team',
  '/pages/the-garden#is-this-for-you': 'Ist das was für mich?',
  '/collections/all': 'Kurse',
  '/pages/enter-the-garden': 'Enter the Garden',
  '/pages/beginner-course': 'Sprouting Sessions',
  '/pages/garden-practica': 'Garden Practica',
  '/pages/tango-rhythm-trainer': 'Trainingsmaterial',
  '/pages/contact': 'Kontakt',
};

/** Child-link overrides where one href appears with two labels (parent vs. child). */
export const navChildLabelsDe = {
  '/pages/tango-rhythm-trainer': 'Tango-Rhythmustrainer',
};

/**
 * @param {'en' | 'de'} locale
 * @param {string} href
 * @param {string} fallback
 * @param {boolean} [child]
 */
export const navLabel = (locale, href, fallback, child = false) => {
  if (locale !== 'de') return fallback;
  return (child && navChildLabelsDe[href]) || navLabelsDe[href] || fallback;
};
