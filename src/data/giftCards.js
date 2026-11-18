/**
 * Gift cards: the single source for /pages/gift-cards (buying) and
 * /pages/you-ve-got-tango (the QR page printed on the card).
 *
 * Sold over WhatsApp and handed over in person (or posted), not through
 * Shopify, so there are no variant IDs here. Prices are the normal practica
 * and 4-Class Pass prices (a unit test keeps them in step with products.js).
 *
 * Rules the pages promise: up to 3 years to come for the first time; the
 * first visit starts the clock; cancelled dates extend it. Cards carry
 * From / To, so they're personal.
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
      subtitle: '4-Week Class Pass',
      name: '4-week class pass',
      tag: 'Most gifted',
      more: 'About the classes →',
      forWhom: 'For new dancers or improvers: four classes in a row, one a week, on Thursdays.',
      includes: [
        '4 classes in a row, one a week, on Thursdays',
        'Beginners 19:15–20:30, improvers 20:30–21:45',
        'No partner needed. Classes are in English.',
      ],
      buyMessage: "Hi! I'd like the 4-week class pass gift card. Pickup or by post?",
      startMessage: "Hi! I got the 4-week class pass as a gift and I'd like to start. When do the next classes begin?",
    },
    de: {
      title: 'Tango-Kurse',
      subtitle: '4-Wochen-Kurspass',
      name: '4-Wochen-Kurspass',
      tag: 'Am häufigsten verschenkt',
      more: 'Mehr zu den Kursen →',
      forWhom: 'Für Neueinsteiger:innen oder Fortgeschrittene: vier Stunden am Stück, eine pro Woche, donnerstags.',
      includes: [
        '4 Stunden am Stück, eine pro Woche, donnerstags',
        'Anfänger:innen 19:15–20:30, Fortgeschrittene 20:30–21:45',
        'Ohne Partner:in. Unterricht auf Englisch.',
      ],
      buyMessage: 'Hi! Ich hätte gern den 4-Wochen-Kurspass als Gutschein. Abholung oder per Post?',
      startMessage: 'Hi! Ich habe den 4-Wochen-Kurspass geschenkt bekommen und möchte anfangen. Wann starten die nächsten Kurse?',
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
      more: 'About the practica →',
      forWhom: 'For someone who already dances: two guided practice evenings.',
      includes: [
        '2 Garden Practicas, 2nd and 4th Wednesday of the month, 19:30–21:30',
        'Guided practice evenings: dance, ask, try things out',
        'Come alone or with a partner',
      ],
      buyMessage: "Hi! I'd like the 2-practica gift card. Pickup or by post?",
      startMessage: "Hi! I got a 2-practica pass as a gift and I'd like to come to the next practica.",
    },
    de: {
      title: 'Garden Practica',
      subtitle: '2-Practica-Pass',
      name: '2-Practica-Pass',
      more: 'Mehr zur Practica →',
      forWhom: 'Für alle, die schon tanzen: zwei begleitete Übungsabende.',
      includes: [
        '2 Garden Practicas, am 2. und 4. Mittwoch im Monat, 19:30–21:30',
        'Begleitete Übungsabende: tanzen, fragen, ausprobieren',
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
      more: 'About the practica →',
      forWhom: 'For someone who already dances: four practice evenings over a few months.',
      includes: [
        '4 Garden Practicas, 2nd and 4th Wednesday of the month, 19:30–21:30',
        'Guided practice evenings: dance, ask, try things out',
        'Come alone or with a partner',
      ],
      buyMessage: "Hi! I'd like the 4-practica gift card. Pickup or by post?",
      startMessage: "Hi! I got a 4-practica pass as a gift and I'd like to come to the next practica.",
    },
    de: {
      title: 'Garden Practica',
      subtitle: '4-Practica-Pass',
      name: '4-Practica-Pass',
      more: 'Mehr zur Practica →',
      forWhom: 'Für alle, die schon tanzen: vier Übungsabende über ein paar Monate.',
      includes: [
        '4 Garden Practicas, am 2. und 4. Mittwoch im Monat, 19:30–21:30',
        'Begleitete Übungsabende: tanzen, fragen, ausprobieren',
        'Komm allein oder zu zweit',
      ],
      buyMessage: 'Hi! Ich hätte gern den 4-Practica-Pass als Gutschein. Abholung oder per Post?',
      startMessage: 'Hi! Ich habe einen 4-Practica-Pass geschenkt bekommen und möchte zur nächsten Practica kommen.',
    },
  },
];

/** WhatsApp link with a prefilled message. */
export const waLink = (/** @type {string} */ message) => `${WHATSAPP}?text=${encodeURIComponent(message)}`;
