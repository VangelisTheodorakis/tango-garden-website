/**
 * Content + pricing structure for the class pages (`/pages/enter-the-garden`,
 * `/pages/beginner-course`, `/pages/garden-practica`, `/pages/private-classes`).
 *
 * These replace the old one-page-per-SKU product pages (general admission,
 * student/under-28, 1-class, 4-class, full-course...) with one page per class,
 * combining price, perks and "who it's for" into a single table.
 *
 * Prices are never re-typed here — every table row references a handle in
 * `products.js`, the single source of truth for Shopify-mirrored prices, and
 * `ClassPage.astro` reads the price from there at build time. The one
 * exception is private classes: they are arranged directly, not sold through
 * Shopify, so their rows carry a plain `price` instead of a handle. This file only
 * owns page copy, structure, and which handles belong together.
 *
 * `heroImage` is a file name in `src/assets/` (not a /public URL), so
 * ClassPage.astro can serve it as responsive, right-sized variants.
 */
export const classPages = [
  {
    slug: 'enter-the-garden',
    title: 'ESN Köln × Tango Garden: Free Argentine Tango Class',
    metaTitle: 'Free Tango Class with ESN Köln, 13 December',
    metaDescription:
      'Free beginner-friendly Argentine tango class in English for under 30s, with ESN Köln and Tango Garden at UniSport Köln, Sunday 13 December. Registration required.',
    eyebrow: 'ESN Köln × Tango Garden 🤍',
    heading: 'Free Argentine Tango Class',
    intro: 'Free admission · Under 30 · Registration required',
    feed: '/assets/data/enter-the-garden.json',
    feedLabel: 'Free class with ESN Köln',
    whatToExpect: [
      'In a world of algorithms, endless scrolling, and fleeting interactions, ESN Cologne and Tango Garden are creating space for something slower, more real, and more human: something we can share.',
      'ESN Cologne invites you to a free, beginner-friendly Argentine tango class in English, taught by Kristina and Vangelis from Tango Garden.',
      'No experience needed. No partner required. Just come as you are.',
      'Where: UniSport Köln, small gym',
      'When: Sunday, 13 December, 17:30–19:00',
      'Price: free',
      'Registration: required, spots are limited',
    ],
    whatsIncluded: [],
    nextStep: 'Registration is required and spots are limited. Sign up on Rausgegangen, or message us on WhatsApp with any questions.',
    // The event is shared with ESN Köln, who take the sign-ups on Rausgegangen.
    extraCta: {
      label: 'Register on Rausgegangen',
      href: 'https://rausgegangen.de/en/events/esn-koln-tango-garden-free-argentine-tango-class-0/?utm_source=tangogarden.de&utm_medium=website&utm_campaign=esn-koeln_2026-12-13',
    },
    waMessage: 'Hi! I saw the tango class with ESN Köln on 13 December on your website and have a question.',
    banner: '/images/esn-tango-garden-banner.webp',
    bannerAlt: 'ESN Köln × Tango Garden',
    gallery: [
      '/images/enter-the-garden-rheinpark-banner.webp',
      '/images/enter-the-garden-1.webp',
      '/images/enter-the-garden-2.webp',
      '/images/enter-the-garden-3.webp',
    ],
    galleryCaption: 'Photos from our last free open classes at Rheinpark - Summer 2026',
    showTeachers: true,
    table: {
      caption: 'Price',
      rows: [
        {
          label: 'ESN Köln × Tango Garden class',
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
        q: 'Who can join?',
        a: 'The class is for people under 30. Registration is required and spots are limited, so please sign up on Rausgegangen.',
      },
      {
        q: 'Do I need any dance experience to start?',
        a: 'Not at all. This class is designed for absolute beginners. We start from scratch: how to stand, how to be present, how to listen through touch.',
      },
      {
        q: 'Do I need to bring a partner?',
        a: 'No. Most people come alone. We rotate partners during the class so everyone gets to dance with different people.',
      },
      {
        q: 'What should I wear?',
        a: 'Comfortable clothes and shoes you can move in. We dance in a gym, so clean indoor shoes or socks work well.',
      },
      {
        q: 'Where exactly are you located in Cologne?',
        a: '<a href="https://maps.app.goo.gl/28yKvvXAWNpXnT9V8" target="_blank" rel="noopener">UniSport Köln</a>, small gym.',
        raw: true,
      },
    ],
    offerHandles: ['enter-the-garden-general-admission'],
    courseSchema: {
      name: 'ESN Köln × Tango Garden: Free Argentine Tango Class',
      description:
        'Free beginner-friendly Argentine tango class in English for under 30s at UniSport Köln, with ESN Köln and Tango Garden. No experience or partner needed.',
      duration: 'PT1H30M',
      location: {
        name: 'UniSport Köln, small gym',
        addressLocality: 'Köln',
        mapUrl: 'https://maps.app.goo.gl/28yKvvXAWNpXnT9V8',
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
    intro: 'A structured 12-week beginning for people who have never danced tango before.',
    feed: '/assets/data/regular-classes.json',
    feedLabel: 'Next Beginner Tango Course ⭐',
    whatToExpect: [
      "A weekly ritual, whether you're here for the best value per class or the flexibility to try it first.",
      "Each 75-minute class builds on the last: connection, weight shifts, the embrace, and musicality, taught in a fun and engaging way that builds confidence and momentum.",
      "No partner needed. We rotate partners throughout the course, and you choose which role you'd like to learn: Leader, Follower, or Double-Role.",
    ],
    whatsIncluded: [],
    registerUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfKxH4ndLnCj5Y-c73Ty-ubZOEFU_fNehXq2Uwj6-WJkHu4gg/viewform?utm_source=tangogarden.de&utm_medium=website&utm_campaign=sprouting-sessions-winter',
    bankTransfer: true,
    waMessage: "Hi! I have a question about the Beginners' Tango Course at Tango Garden!",
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
        q: 'When should I arrive?',
        a: 'Follow our "First 10 Minutes" rule: arrive 10 minutes early to change and settle in without the rush.',
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
      duration: 'PT1H15M',
      location: {
        name: 'Yoga Drop Studio',
        streetAddress: 'Thürmchenswall 21',
        postalCode: '50668',
        addressLocality: 'Köln',
      },
    },
  },
  {
    slug: 'growth-sessions',
    title: 'The Growth Sessions: 12-Week Improvers Tango Course',
    metaTitle: 'Improvers Tango Course in Cologne (Köln)',
    metaDescription:
      'A 12-week Argentine tango course in Cologne for dancers who know the basics, every Thursday. No partner needed. Multi-class passes include free beginner classes.',
    eyebrow: 'The Growth Sessions',
    heading: 'Grow Your Argentine Tango',
    intro:
      'The next step after the Sprouting Sessions: 12 weeks to turn your basics into confident, musical dancing at the milonga.',
    feed: '/assets/data/growth-sessions.json',
    feedOneLine: true,
    feedLabel: 'Next Improvers Course',
    whatToExpect: [
      'For dancers who already know the basics: change of weight, walking in parallel and cross system, ochos, giro, sandwichito, parada and pasada, calesita, plus the basic social rules and navigation of a milonga.',
      'Each 75-minute class builds on the last. We deepen connection, musicality and navigation on the dance floor, taught in a fun and engaging way.',
      "No partner needed. We rotate partners throughout the course, and you choose which role you'd like to deepen: Leader, Follower, or Double-Role.",
      'With the Full Course and the 4-Class Pass you also get free access to all beginner classes.',
    ],
    whatsIncluded: [],
    // The utm_ tags mark visits that came from this site. Google Forms itself
    // does not record them; the register_click GA4 event (ClassPage.astro) is
    // what counts the clicks. Prices below intentionally equal the Sprouting
    // Sessions prices; they are plain values so no Shopify product is needed.
    registerUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeg8Mn2gDfP0JUQ_-n_Zldr4n8JQ2CrAr9e9zL1o8VfBl41aA/viewform?utm_source=tangogarden.de&utm_medium=website&utm_campaign=growth-sessions-winter',
    bankTransfer: true,
    waMessage: "Hi! I have a question about the Improvers' Tango Course at Tango Garden!",
    perkColumn: 'Free access to all beginner classes',
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
          general: { price: '€160' },
          student: { price: '€120' },
          perClass: { general: '€13', student: '€10' },
          bestValue: true,
          makeupIncluded: true,
        },
        {
          label: '4-Class Pass',
          general: { price: '€60' },
          student: { price: '€45' },
          perClass: { general: '€15', student: '€11' },
          bestValue: false,
          makeupIncluded: true,
        },
        {
          label: '1-Class Pass',
          general: { price: '€18' },
          student: { price: '€15' },
          perClass: null,
          bestValue: false,
          makeupIncluded: false,
        },
      ],
    },
    cancellationNote: null,
    faq: [
      {
        q: 'Am I ready for the Growth Sessions?',
        a: 'If you know change of weight, walking in parallel and cross system, ochos, giro, sandwichito, parada and pasada, calesita and the basic social rules of a milonga, you are in the right place. Not sure? Message us on WhatsApp and we will find the right level together.',
      },
      {
        q: 'How do the free beginner classes work?',
        a: 'With the Full Course and the 4-Class Pass you can attend every Sprouting Sessions class for free, for example to refresh your basics or to support newcomers. The 1-Class Pass does not include this.',
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
        q: 'When should I arrive?',
        a: 'Follow our "First 10 Minutes" rule: arrive 10 minutes early to change and settle in without the rush.',
      },
      {
        q: 'Is the class taught in English?',
        a: 'Yes. All teaching is in English. Under request, we can also offer German, Russian and Greek.',
      },
      {
        q: 'Where exactly are you located in Cologne?',
        a: '<a href="https://www.google.com/maps/search/?api=1&query=Th%C3%BCrmchenswall+21%2C+50668+K%C3%B6ln" target="_blank" rel="noopener">Thürmchenswall 21, 50668 Köln</a> (Yoga Drop Studio), a 3-minute walk from Ebertplatz.',
        raw: true,
      },
    ],
    offerHandles: [],
    courseSchema: {
      name: 'The Growth Sessions: Improvers Argentine Tango Course Cologne',
      description:
        'Twelve-week Argentine tango course in Cologne for dancers who know the basics, every Thursday. No partner needed.',
      duration: 'PT1H15M',
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
    title: 'The Garden Practica: Open Practice Twice a Month',
    metaTitle: 'Tango Practica Cologne: The Garden Practica',
    metaDescription:
      'Drop-in Argentine Tango practica in Cologne. Open-level, no partner needed, 2-hour guided practice session on the 2nd and 4th Wednesday of the month.',
    heading: 'The Garden Practica',
    intro:
      'A relaxed, guided practica, open to everyone who has taken at least one tango class. A space to apply what you know, try new roles, and get inspired. Drop in whenever you like.',
    feed: '/assets/data/practicas.json',
    feedOneLine: true,
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
      duration: 'PT2H',
      location: {
        name: 'Yoga Drop Studio',
        streetAddress: 'Thürmchenswall 21',
        postalCode: '50668',
        addressLocality: 'Köln',
      },
    },
  },
  {
    slug: 'private-classes',
    title: 'Private Tango Classes with Vangelis or Kristina',
    metaTitle: 'Private Tango Classes in Cologne (Köln)',
    metaDescription:
      'Private Argentine tango classes in Cologne with Vangelis or Kristina: €60 per hour for one person or €80 for a couple, at your place, ours, or a studio.',
    heading: 'Private Tango Classes',
    intro:
      'Argentine tango one-to-one with Vangelis or Kristina, on your own or as a couple, built around what you want to work on.',
    whatToExpect: [
      'A class that follows you: your first steps, the embrace, musicality, or the one thing that keeps escaping you on the dance floor. We adapt to your level and your pace.',
      'Come on your own or as a couple. Every level is welcome, from complete beginners to experienced dancers.',
      'We meet where suits you: at your place, at ours, or in a studio in Cologne that we book for you.',
    ],
    whatsIncluded: [
      'A 60-minute class shaped around your goals and level',
      'On your own or as a couple',
      'At your place or ours at no extra cost, or in a studio we book for you (studio rent added)',
    ],
    showTeachers: true,
    table: {
      caption: 'Price',
      rows: [
        { label: 'One person', general: { price: '€60' }, student: null, perClass: null, bestValue: false },
        { label: 'Couple', general: { price: '€80' }, student: null, perClass: null, bestValue: false },
      ],
    },
    priceNote:
      'Prices are per hour (60 minutes). At your place or ours there is nothing extra to pay. Prefer a studio? We book one for you, and the studio rent is added to the class price.',
    cancellationNote: null,
    nextStep: 'Message us on WhatsApp with what you would like to work on and a few times that suit you.',
    faq: [
      {
        q: 'Who are private classes for?',
        a: 'Everyone, from complete beginners who want a head start to experienced dancers working on something specific. We shape each class around your level and goals.',
      },
      {
        q: 'Who teaches the class?',
        a: 'Either Vangelis or Kristina: one teacher per class. If you have a preference, tell us when you message us.',
      },
      {
        q: 'Do I need to bring a partner?',
        a: 'No. Come on your own and dance with your teacher, or bring a partner and book as a couple.',
      },
      {
        q: 'How much does a private class cost?',
        a: 'A class is one hour (60 minutes): €60 for one person, or €80 for a couple. At your place or ours there is no additional fee. If you prefer a studio, we book one for you and add the studio rent to the class price.',
      },
      {
        q: 'Where do the classes take place?',
        a: 'Wherever suits you best: at your place, at ours, or in a studio in Cologne that we book for you.',
      },
      {
        q: 'Is the class taught in English?',
        a: 'Yes. Under request, we can also teach in German, Russian and Greek.',
      },
      {
        q: 'How do I book?',
        a: 'Message us on WhatsApp with what you would like to work on and a few times that suit you, and we will find a slot together.',
      },
    ],
    offerHandles: [],
    courseSchema: {
      name: 'Private Argentine Tango Classes Cologne',
      description:
        'Private Argentine tango classes in Cologne with Vangelis or Kristina, for one person or a couple, at all levels.',
      location: {
        name: 'Cologne',
        addressLocality: 'Köln',
      },
    },
  },
];
