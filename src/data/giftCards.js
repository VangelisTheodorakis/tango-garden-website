/**
 * Gift cards: the single source for /pages/gift-cards (buying) and
 * /pages/you-ve-got-tango (the QR page printed on the card).
 *
 * Sold over WhatsApp and handed over in person (or posted), not through
 * Shopify, so there are no variant IDs here. Prices are the normal practica
 * and 4-Class Pass prices (a unit test keeps them in step with products.js).
 *
 * Rules the pages promise: up to 3 years to come for the first time; the
 * first visit starts the clock; cancelled dates extend it. The recipient's
 * name is written on the card, so it's personal.
 */

export const WHATSAPP = 'https://wa.me/491602368723';
export const POSTAGE = 2;
export const YEARS_TO_START = 3;

/** QR target printed on the card. */
export const QR_URL =
  'https://tangogarden.de/pages/you-ve-got-tango?utm_source=giftcard&utm_medium=qr&utm_campaign=gift_2026';

export const giftCards = [
  {
    slug: 'class-pass',
    kind: 'classes',
    moreHref: '/pages/classes',
    visits: 4,
    weeks: 4,
    price: 60,
    reduced: 45,
    en: {
      title: 'Tango Classes',
      subtitle: '4-Class Pass',
      name: '4-class pass',
      tag: 'Our favourite gift',
      more: '🌿 About the classes',
      tagline: 'Give someone a month of tango.',
      includes: [
        'Four Thursday classes in a row',
        'Choose Beginners (19:15–20:30) or Improvers (20:30–21:45)',
        'No partner needed · Classes are in English',
      ],
      buyMessage: "Hi! I'd like the 4-class pass gift card. Pickup or by post?",
      startMessage: "Hi! I got the 4-class pass as a gift and I'd like to start. When do the next classes begin?",
    },
    de: {
      title: 'Tango-Kurse',
      subtitle: '4er-Kurspass',
      name: '4er-Kurspass',
      tag: 'Unser Lieblingsgeschenk',
      more: '🌿 Mehr zu den Kursen',
      tagline: 'Schenk einen Monat Tango.',
      includes: [
        'Vier Donnerstagsstunden am Stück',
        'Wahlweise Anfänger:innen (19:15–20:30) oder Fortgeschrittene (20:30–21:45)',
        'Ohne Partner:in · Unterricht auf Englisch',
      ],
      buyMessage: 'Hi! Ich hätte gern den 4er-Kurspass als Gutschein. Abholung oder per Post?',
      startMessage: 'Hi! Ich habe den 4er-Kurspass geschenkt bekommen und möchte anfangen. Wann starten die nächsten Kurse?',
    },
  },
  {
    slug: 'practica-2',
    kind: 'practica',
    moreHref: '/pages/garden-practica',
    visits: 2,
    weeks: 8,
    price: 20,
    reduced: 16,
    en: {
      title: 'Garden Practica',
      subtitle: '2-Practica Pass',
      name: '2-practica pass',
      more: '🌳 About the practica',
      tagline: 'Give someone two evenings to dance, practise and explore.',
      includes: [
        'For dancers with some tango experience',
        '2 Garden Practicas · 2nd and 4th Wednesday of the month · 19:30–21:30',
        'Guided practice with space to dance, ask questions and try things out',
        'Come alone or with a partner',
      ],
      buyMessage: "Hi! I'd like the 2-practica gift card. Pickup or by post?",
      startMessage: "Hi! I got a 2-practica pass as a gift and I'd like to come to the next practica.",
    },
    de: {
      title: 'Garden Practica',
      subtitle: '2-Practica-Pass',
      name: '2-Practica-Pass',
      more: '🌳 Mehr zur Practica',
      tagline: 'Schenk zwei Abende zum Tanzen, Üben und Ausprobieren.',
      includes: [
        'Für Tänzer:innen mit etwas Tango-Erfahrung',
        '2 Garden Practicas · am 2. und 4. Mittwoch im Monat · 19:30–21:30',
        'Begleitetes Üben mit Raum zum Tanzen, Fragen und Ausprobieren',
        'Komm allein oder zu zweit',
      ],
      buyMessage: 'Hi! Ich hätte gern den 2-Practica-Pass als Gutschein. Abholung oder per Post?',
      startMessage: 'Hi! Ich habe einen 2-Practica-Pass geschenkt bekommen und möchte zur nächsten Practica kommen.',
    },
  },
  {
    slug: 'practica-4',
    kind: 'practica',
    moreHref: '/pages/garden-practica',
    visits: 4,
    weeks: 16,
    price: 40,
    reduced: 32,
    en: {
      title: 'Garden Practica',
      subtitle: '4-Practica Pass',
      name: '4-practica pass',
      more: '🌳 About the practica',
      tagline: 'Give someone four evenings to dance, practise and explore.',
      includes: [
        'For dancers with some tango experience',
        '4 Garden Practicas · 2nd and 4th Wednesday of the month · 19:30–21:30',
        'Guided practice with space to dance, ask questions and try things out',
        'Come alone or with a partner',
      ],
      buyMessage: "Hi! I'd like the 4-practica gift card. Pickup or by post?",
      startMessage: "Hi! I got a 4-practica pass as a gift and I'd like to come to the next practica.",
    },
    de: {
      title: 'Garden Practica',
      subtitle: '4-Practica-Pass',
      name: '4-Practica-Pass',
      more: '🌳 Mehr zur Practica',
      tagline: 'Schenk vier Abende zum Tanzen, Üben und Ausprobieren.',
      includes: [
        'Für Tänzer:innen mit etwas Tango-Erfahrung',
        '4 Garden Practicas · am 2. und 4. Mittwoch im Monat · 19:30–21:30',
        'Begleitetes Üben mit Raum zum Tanzen, Fragen und Ausprobieren',
        'Komm allein oder zu zweit',
      ],
      buyMessage: 'Hi! Ich hätte gern den 4-Practica-Pass als Gutschein. Abholung oder per Post?',
      startMessage: 'Hi! Ich habe einen 4-Practica-Pass geschenkt bekommen und möchte zur nächsten Practica kommen.',
    },
  },
];

/** WhatsApp link with a prefilled message. */
export const waLink = (/** @type {string} */ message) => `${WHATSAPP}?text=${encodeURIComponent(message)}`;
