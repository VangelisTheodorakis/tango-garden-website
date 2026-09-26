/**
 * Content + pricing structure for the three consolidated class pages
 * (`/pages/enter-the-garden`, `/pages/beginner-course`, `/pages/garden-practica`).
 *
 * These replace the old one-page-per-SKU product pages (general admission,
 * student/under-28, 1-class, 4-class, full-course...) with one page per class,
 * combining price, perks and "who it's for" into a single table.
 *
 * Prices are never re-typed here — every table row references a handle in
 * `products.js`, the single source of truth for Shopify-mirrored prices, and
 * `ClassPage.astro` reads the price from there at build time. This file only
 * owns page copy, structure, and which handles belong together.
 *
 * `heroImage` is a file name in `src/assets/` (not a /public URL), so
 * ClassPage.astro can serve it as responsive, right-sized variants.
 */
export const classPages = [
  {
    slug: 'enter-the-garden',
    title: 'Enter the Garden: Introductory Session',
    metaTitle: 'Free Tango Intro Class in Cologne (Köln)',
    metaDescription:
      'A free, open-air introduction to Argentine Tango at Rheinpark in Cologne. One hour, no partner needed, no experience required.',
    heading: 'Enter the Garden',
    intro:
      "A free, open-air introduction to Argentine Tango at Rheinpark. No partner, no experience, no pressure. Just an hour to see how it feels.",
    feed: '/assets/data/enter-the-garden.json',
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
  },
  {
    slug: 'beginner-course',
    title: 'The Sprouting Sessions: 12-Week Beginner Tango Course',
    metaTitle: 'Beginner Tango Course in Cologne (Köln)',
    metaDescription:
      'A 12-week Argentine tango beginner course in Cologne. No partner needed, weekly classes, free makeup sessions. Everything you need to start dancing with us.',
    eyebrow: 'The Sprouting Sessions',
    heading: 'Start Dancing Argentine Tango',
    intro: 'A gentle, structured 12-week beginning for people who have never danced tango before.',
    feed: '/assets/data/regular-classes.json',
    feedLabel: 'Next Beginner Course · Group closes 01/10',
    whatToExpect: [
      "A gentle weekly ritual, whether you're here for the best value per class or the flexibility to try it first.",
      "Each 1.5-hour class builds on the last: connection, weight shifts, the embrace, and musicality, taught in a fun and engaging way that builds confidence and momentum.",
      "No partner needed. We rotate partners throughout the course, and you choose which role you'd like to learn: Leader, Follower, or Double-Role.",
    ],
    whatsIncluded: [],
    registerUrl: 'https://forms.gle/mAqzDEYasFyCrdoz8',
    heroImage: 'hero-dancers.png',
    gallery: [
      '/images/beginner-course-2.webp',
      '/images/beginner-course-1.webp',
      '/images/beginner-course-3.webp',
    ],
    showTeachers: true,
    table: {
      caption: 'Passes',
      rows: [
        {
          label: 'Full Course (12 classes)',
          general: {
            handle: 'the-sprouting-sessions-beginner-level-full-course-pass-general-admission',
          },
          student: {
            handle: 'the-sprouting-sessions-beginner-level-full-course-pass-student-and-under28-admission',
          },
          perClass: { general: '€13', student: '€10' },
          bestValue: true,
          makeupIncluded: true,
        },
        {
          label: '4-Class Pass',
          general: {
            handle: 'the-sprouting-sessions-beginners-level-4-classes-pass-general-admission',
          },
          student: {
            handle: 'the-sprouting-sessions-beginner-level-4-classes-pass-student-and-under-28-admission',
          },
          perClass: { general: '€15', student: '€11' },
          bestValue: false,
          makeupIncluded: true,
        },
        {
          label: '1-Class Pass',
          general: { handle: 'the-sprouting-sessions-beginner-level-1-class-pass-general-admission' },
          student: {
            handle: 'the-sprouting-sessions-beginner-level-1-class-pass-student-and-under-28-admission',
          },
          perClass: null,
          bestValue: false,
          makeupIncluded: false,
        },
      ],
    },
    cancellationNote: null,
    faq: [
      {
        q: 'Do I need any dance experience to start?',
        a: 'Not at all. Every class is designed for absolute beginners. We start from scratch: how to stand, how to be present, how to listen through touch.',
      },
      {
        q: 'Do I need to bring a partner?',
        a: 'No. Most people come alone. We rotate partners during class so everyone gets to dance with different people.',
      },
      {
        q: 'What should I wear?',
        a: 'Comfortable clothes you can move in. For shoes, a clean pair of cozy socks or a second pair of indoor shoes works well. Avoid thick rubber soles, they grip the floor and make turning difficult.',
      },
      {
        q: 'Is the class taught in English?',
        a: 'Yes. All teaching is in English. Under request, we can also offer German, Russian and Greek.',
      },
      {
        q: 'What if I miss a class?',
        a: 'No worries. You can cover any missed class by attending our Garden Practica during your pass’ eligibility cycle, at no extra cost.',
      },
      {
        q: 'Where exactly are you located in Cologne?',
        a: '<a href="https://www.google.com/maps/search/?api=1&query=Th%C3%BCrmchenswall+21%2C+50668+K%C3%B6ln" target="_blank" rel="noopener">Thürmchenswall 21, 50668 Köln</a> (Yoga Drop Studio), a 3-minute walk from Ebertplatz.',
        raw: true,
      },
    ],
    offerHandles: [
      'the-sprouting-sessions-beginner-level-1-class-pass-general-admission',
      'the-sprouting-sessions-beginner-level-1-class-pass-student-and-under-28-admission',
      'the-sprouting-sessions-beginners-level-4-classes-pass-general-admission',
      'the-sprouting-sessions-beginner-level-4-classes-pass-student-and-under-28-admission',
      'the-sprouting-sessions-beginner-level-full-course-pass-general-admission',
      'the-sprouting-sessions-beginner-level-full-course-pass-student-and-under28-admission',
    ],
    courseSchema: {
      name: 'The Sprouting Sessions: Beginner Argentine Tango Course Cologne',
      description:
        'Complete 12-week beginner Argentine tango course in Cologne. From zero to dancing with confidence. No partner or experience needed.',
      duration: 'PT1H30M',
      location: {
        name: 'Yoga Drop Studio',
        streetAddress: 'Thürmchenswall 21',
        postalCode: '50668',
        addressLocality: 'Köln',
      },
    },
  },
  {
    slug: 'garden-practica',
    title: 'The Garden Practica: Weekly Open Practice',
    metaTitle: 'Tango Practica Cologne: The Garden Practica',
    metaDescription:
      'Drop-in Argentine Tango practica in Cologne. Open-level, no partner needed, 2.5-hour guided practice session every week.',
    heading: 'The Garden Practica',
    intro:
      'A relaxed, guided practica, open to everyone who has taken at least one tango class. A space to apply what you know, try new roles, and get inspired. Drop in whenever you like.',
    feed: '/assets/data/practicas.json',
    feedLabel: 'Next Practica',
    whatToExpect: [
      'Every practica starts with a 10-minute warm-up, followed by a 30-minute guided practica with invited guests. After that, the floor is yours: dance what you already know and pick up feedback along the way.',
      'Open-level and open-role: come as a Leader, Follower, or Double-Role, whatever you feel like that week.',
      'It’s a practica, not a milonga: no strict cabeceo rules, just one small ritual. Dance with at least one person you’ve never danced with before.',
    ],
    whatsIncluded: [
      'A 10-minute warm-up',
      'A 30-minute guided practica with invited guests',
      'All levels and roles welcome, including Double-Role',
      'Teachers and more experienced dancers on hand for your questions',
    ],
    heroImage: 'hero-dancers.png',
    table: {
      caption: 'Price',
      rows: [
        {
          label: '1-Practica Pass',
          general: { handle: 'the-garden-practica-1-practica-pass-general-admission' },
          student: {
            handle: 'the-garden-practica-1-practica-pass-door-only-student-and-under-28-admission',
          },
          perClass: null,
          bestValue: false,
        },
      ],
    },
    cancellationNote: null,
    faq: [
      {
        q: 'Do I need any dance experience to start?',
        a: 'The practica is open to everyone who has taken at least one tango class. If you’re completely new, we recommend starting with Enter the Garden or the Sprouting Sessions first.',
      },
      {
        q: 'Do I need to bring a partner?',
        a: 'No. We rotate throughout the practica, so you can come solo and still dance with everyone.',
      },
      {
        q: 'Is the practica a milonga?',
        a: 'No. It’s a relaxed practice space, so there are no strict milonga codes like the cabeceo: you can simply ask someone to dance. Our one ritual: dance with at least one person you’ve never danced with before.',
      },
      {
        q: 'How do we move on the floor?',
        a: 'We dance counter-clockwise around the room, like in any ronda. If you stop to talk something through, take one step closer to the centre, so the ronda stays free for everyone else.',
      },
      {
        q: 'What if I get stuck or have a question?',
        a: 'Just ask. We’re always there for you, and you’re welcome to ask dancers who are a little further along, too.',
      },
      {
        q: 'What should I wear?',
        a: 'Comfortable clothes you can move in. For shoes, a clean pair of cozy socks or a second pair of indoor shoes works well. Avoid thick rubber soles.',
      },
      {
        q: 'Where exactly are you located in Cologne?',
        a: '<a href="https://www.google.com/maps/search/?api=1&query=Th%C3%BCrmchenswall+21%2C+50668+K%C3%B6ln" target="_blank" rel="noopener">Thürmchenswall 21, 50668 Köln</a> (Yoga Drop Studio), a 3-minute walk from Ebertplatz.',
        raw: true,
      },
    ],
    offerHandles: [
      'the-garden-practica-1-practica-pass-general-admission',
      'the-garden-practica-1-practica-pass-door-only-student-and-under-28-admission',
    ],
    courseSchema: {
      name: 'Drop-In Practice: Tango Practica Cologne',
      description:
        'Open-level drop-in Argentine tango practica in Cologne. All levels welcome, no partner needed.',
      duration: 'PT2H30M',
      location: {
        name: 'Yoga Drop Studio',
        streetAddress: 'Thürmchenswall 21',
        postalCode: '50668',
        addressLocality: 'Köln',
      },
    },
  },
];
