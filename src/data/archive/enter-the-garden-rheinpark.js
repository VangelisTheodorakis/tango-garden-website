/**
 * ARCHIVED: the free open-air "Enter the Garden" class at Rheinpark (summer 2026).
 *
 * Not imported anywhere, so it is not built, not in the sitemap and not in any
 * menu. /pages/enter-the-garden currently shows the ESN Köln x Tango Garden class
 * (see classPages.js). To bring the Rheinpark class back next season:
 *   1. Replace the 'enter-the-garden' entry in classPages.js with `entry` below
 *      (change `slug` back to 'enter-the-garden' and `feed` to
 *      '/assets/data/enter-the-garden.json').
 *   2. Replace the 'enter-the-garden' block in classPages.de.js with `de` below.
 *   3. Put `feed` into public/assets/data/enter-the-garden.json with new dates.
 *   4. Restore the Enter the Garden card text on the homepage (PathwayCards.astro)
 *      and the Classes overview (ProductGrid.astro): one-time 1-hour class,
 *      outdoors at Rheinpark.
 * The hero image 'enter-the-garden-hero.webp' stays in src/assets/.
 */

/** English page entry. */
export const entry = {
    slug: 'enter-the-garden-rheinpark',
    title: 'Enter the Garden: Introductory Session',
    metaTitle: 'Free Tango Intro Class in Cologne (Köln)',
    metaDescription:
      'A free, open-air introduction to Argentine Tango at Rheinpark in Cologne. One hour, no partner needed, no experience required.',
    heading: 'Enter the Garden',
    intro:
      "A free, open-air introduction to Argentine Tango at Rheinpark. No partner, no experience, no pressure. Just an hour to see how it feels.",
    feed: '/assets/data/enter-the-garden-rheinpark.json',
    feedLabel: 'Next introductory class',
    whatToExpect: [
      'A one-hour, guided introduction to connection, weight shifts, and the embrace, not performance, just conversation between two people.',
      "We rotate throughout the session so everyone dances with everyone. Come solo or with a partner.",
    ],
    whatsIncluded: [
      'One hour, guided, outdoors at Rheinpark',
      'Partner rotation, come solo or with a partner',
      'A Garden Ambassador greeting, so you never stand alone',
    ],
    heroImage: 'enter-the-garden-hero.webp',
    gallery: [
      '/images/enter-the-garden-1.webp',
      '/images/enter-the-garden-2.webp',
      '/images/enter-the-garden-3.webp',
    ],
    table: {
      caption: 'Price',
      rows: [
        {
          label: 'Enter the Garden',
          general: { handle: 'enter-the-garden-general-admission' },
          student: null,
          perClass: null,
          bestValue: false,
        },
      ],
    },
    cancellationNote: null,
    faq: [
      {
        q: 'Do I need any dance experience to start?',
        a: 'Not at all. Every session is designed for absolute beginners. We start from scratch: how to stand, how to be present, how to listen through touch.',
      },
      {
        q: 'Do I need to bring a partner?',
        a: 'No. Most people come alone. We rotate partners during the session so everyone gets to dance with different people.',
      },
      {
        q: 'What should I wear?',
        a: "Comfortable clothes and shoes you can move in. We're outdoors on grass at Rheinpark.",
      },
      {
        q: 'Where exactly are you located in Cologne?',
        a: '<a href="https://www.google.com/maps/search/?api=1&query=Tango+Garden+Tanzpavillon+vor+der+Claudius-Therme+K%C3%B6ln" target="_blank" rel="noopener">Rheinpark, Tanzpavillon vor der Claudius-Therme</a>, on the Rhine near the Rheinparkweg entrance.',
        raw: true,
      },
    ],
    offerHandles: ['enter-the-garden-general-admission'],
    courseSchema: {
      name: 'Enter the Garden: Introductory Tango Session Cologne',
      description:
        'Free one-hour open-air introductory Argentine tango session at Rheinpark in Cologne. No partner or experience needed.',
      duration: 'PT1H',
      location: {
        name: 'Rheinpark, Tanzpavillon vor der Claudius-Therme',
        streetAddress: 'Tanzpavillon vor der Claudius-Therme',
        addressLocality: 'Köln',
      },
    },
  };

/** German overlay (words only). */
export const de = {
    metaTitle: 'Kostenlose Tango-Probestunde in Köln',
    metaDescription:
      'Tango Argentino kostenlos ausprobieren: Eine Stunde open air im Rheinpark Köln. Ohne Partner, ohne Vorkenntnisse, ohne Druck.',
    eyebrow: 'Enter the Garden',
    heading: 'Kostenlose Tango-Probestunde im Rheinpark',
    intro:
      'Eine kostenlose Einführung in den Tango Argentino, open air im Rheinpark. Kein Partner, keine Erfahrung, kein Druck. Nur eine Stunde, um zu spüren, wie es sich anfühlt.',
    feedLabel: 'Nächste Probestunde',
    whatToExpect: [
      'Eine angeleitete Stunde rund um Verbindung, Gewichtsverlagerung und die Umarmung. Keine Performance, sondern ein Gespräch zwischen zwei Menschen.',
      'Wir wechseln während der Stunde die Partner:innen, sodass alle mit allen tanzen. Komm allein oder zu zweit.',
    ],
    whatsIncluded: [
      'Eine Stunde, angeleitet, draußen im Rheinpark',
      'Partnerwechsel, komm allein oder zu zweit',
      'Ein Garden Ambassador begrüßt dich, damit du nie allein dastehst',
    ],
    table: { caption: 'Preis', rowLabels: ['Enter the Garden'] },
    faq: [
      {
        key: 'Do I need any dance experience to start?',
        q: 'Brauche ich Tanzerfahrung?',
        a: 'Überhaupt nicht. Jede Session ist für absolute Anfänger:innen gemacht. Wir fangen bei null an: Wie du stehst, wie du präsent bist, wie du über Berührung zuhörst.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich eine:n Partner:in mitbringen?',
        a: 'Nein. Die meisten kommen allein. Wir wechseln während der Session die Partner:innen, sodass du mit verschiedenen Leuten tanzt.',
      },
      {
        key: 'What should I wear?',
        q: 'Was soll ich anziehen?',
        a: 'Bequeme Kleidung und Schuhe, in denen du dich gut bewegen kannst. Wir sind draußen auf dem Rasen im Rheinpark.',
      },
      {
        key: 'Where exactly are you located in Cologne?',
        q: 'Wo genau seid ihr in Köln?',
        a: '<a href="https://www.google.com/maps/search/?api=1&query=Tango+Garden+Tanzpavillon+vor+der+Claudius-Therme+K%C3%B6ln" target="_blank" rel="noopener">Rheinpark, Tanzpavillon vor der Claudius-Therme</a>, direkt am Rhein nahe dem Eingang Rheinparkweg.',
        raw: true,
      },
    ],
    courseSchema: {
      name: 'Enter the Garden: Kostenlose Tango-Probestunde in Köln',
      description:
        'Kostenlose, einstündige Tango-Argentino-Probestunde open air im Rheinpark Köln. Kein Partner und keine Erfahrung nötig.',
    },
  };

/** Date feed with the summer 2026 dates. */
export const feed = {
  "label": "Next introductory class",
  "emptyMessage": "New dates coming soon (TBA)",
  "label_de": "Nächste Probestunde",
  "emptyMessage_de": "Neue Termine folgen bald",
  "events": [
    {
      "date": "2026-08-01",
      "time": "19:00 – 20:00"
    },
    {
      "date": "2026-08-08",
      "time": "19:00 – 20:00"
    },
    {
      "date": "2026-09-05",
      "time": "19:00 – 20:00"
    },
    {
      "date": "2026-09-19",
      "time": "19:00 – 20:00"
    }
  ]
};
