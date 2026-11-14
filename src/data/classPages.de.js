/**
 * German copy for the class pages.
 *
 * Only words live here. Prices, handles, feeds, images, the register URL and
 * the table structure stay in classPages.js / products.js and are shared, so
 * the two languages can never disagree on a fact. `getClassPage` merges this
 * onto the English entry; row labels are matched by position so the English
 * labels keep working as lookup keys (see ProductGrid.astro).
 *
 * FAQ items carry `key`, the English question, so analytics reports both
 * languages under one faq_question value.
 */
import { classPages } from './classPages.js';

const EBERTPLATZ_LINK =
  '<a href="https://www.google.com/maps/search/?api=1&query=Th%C3%BCrmchenswall+21%2C+50668+K%C3%B6ln" target="_blank" rel="noopener">Thürmchenswall 21, 50668 Köln</a> (Yoga Drop Studio), 3 Minuten zu Fuß vom Ebertplatz.';

export const classPagesDe = {
  'enter-the-garden': {
    metaTitle: 'Kostenlose Tango-Stunde mit ESN Köln, 13. Dezember',
    metaDescription:
      'Kostenlose Tango-Argentino-Stunde für Anfänger:innen unter 30 im UniSport Köln, Sonntag 13. Dezember, mit ESN Köln und Tango Garden. Anmeldung erforderlich.',
    eyebrow: 'ESN Köln × Tango Garden 🤍',
    heading: 'Kostenlose Tango-Argentino-Stunde',
    intro: 'Kostenlos · Unter 30 · Anmeldung erforderlich',
    feedLabel: 'Kostenlose Stunde mit ESN Köln',
    whatToExpect: [
      'In einer Welt voller Algorithmen, endlosem Scrollen und flüchtiger Begegnungen schaffen ESN Köln und Tango Garden einen Raum für etwas Langsameres, Echteres und Menschlicheres: etwas, das wir teilen können.',
      'ESN Köln lädt dich zu einer kostenlosen, anfänger:innenfreundlichen Tango-Argentino-Stunde auf Englisch ein, geleitet von Kristina und Vangelis von Tango Garden.',
      'Keine Erfahrung nötig. Kein Partner nötig. Komm einfach, wie du bist.',
      'Wo: UniSport Köln, kleine Halle',
      'Wann: Sonntag, 13. Dezember, 17:30–19:00 Uhr',
      'Preis: kostenlos',
      'Anmeldung: erforderlich, die Plätze sind begrenzt',
    ],
    whatsIncluded: [],
    nextStep:
      'Die Anmeldung ist erforderlich und die Plätze sind begrenzt. Melde dich über Rausgegangen an oder schreib uns bei Fragen auf WhatsApp.',
    extraCta: { label: 'Auf Rausgegangen anmelden' },
    waMessage:
      'Hi! Ich habe die Tango-Stunde mit ESN Köln am 13. Dezember auf eurer Website gesehen und habe eine Frage.',
    galleryCaption: 'Fotos von unseren letzten kostenlosen offenen Stunden im Rheinpark, Sommer 2026',
    table: { caption: 'Preis', rowLabels: ['ESN Köln × Tango Garden Stunde'] },
    faq: [
      {
        key: 'Who can join?',
        q: 'Wer kann mitmachen?',
        a: 'Die Stunde ist für Menschen unter 30. Die Anmeldung ist erforderlich und die Plätze sind begrenzt, bitte melde dich über Rausgegangen an.',
      },
      {
        key: 'Do I need any dance experience to start?',
        q: 'Brauche ich Tanzerfahrung?',
        a: 'Überhaupt nicht. Diese Stunde ist für absolute Anfänger:innen gemacht. Wir fangen bei null an: Wie du stehst, wie du präsent bist, wie du über Berührung zuhörst.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich eine:n Partner:in mitbringen?',
        a: 'Nein. Die meisten kommen allein. Wir wechseln während der Stunde die Partner:innen, sodass du mit verschiedenen Leuten tanzt.',
      },
      {
        key: 'What should I wear?',
        q: 'Was soll ich anziehen?',
        a: 'Bequeme Kleidung und Schuhe, in denen du dich gut bewegen kannst. Wir tanzen in einer Halle, saubere Hallenschuhe oder Socken passen gut.',
      },
      {
        key: 'Where exactly are you located in Cologne?',
        q: 'Wo genau seid ihr in Köln?',
        a: '<a href="https://maps.app.goo.gl/28yKvvXAWNpXnT9V8" target="_blank" rel="noopener">UniSport Köln</a>, kleine Halle.',
        raw: true,
      },
    ],
    courseSchema: {
      name: 'ESN Köln × Tango Garden: Kostenlose Tango-Argentino-Stunde',
      description:
        'Kostenlose, anfänger:innenfreundliche Tango-Argentino-Stunde auf Englisch für Menschen unter 30 im UniSport Köln, mit ESN Köln und Tango Garden. Kein Partner und keine Erfahrung nötig.',
      location: { name: 'UniSport Köln, kleine Halle' },
    },
  },
  'beginner-course': {
    metaTitle: 'Tango-Kurs für Anfänger in Köln (12 Wochen)',
    metaDescription:
      'Tango lernen in Köln: 12-wöchiger Anfängerkurs, ohne Partner und ohne Vorkenntnisse. Nahe Ebertplatz. Unterricht auf Englisch, Feedback auch auf Deutsch.',
    eyebrow: 'The Sprouting Sessions',
    waMessage: 'Hi! Ich habe eine Frage zum Tango-Anfängerkurs bei Tango Garden!',
    heading: 'Tango lernen: Dein Anfängerkurs in Köln',
    intro:
      'Ein strukturierter Einstieg über 12 Wochen. Für alle, die noch nie Tango getanzt haben.',
    feedLabel: 'Nächster Tango-Anfängerkurs ⭐',
    whatToExpect: [
      'Ein wöchentliches Ritual, egal ob du den besten Preis pro Stunde willst oder erst einmal flexibel reinschnuppern möchtest.',
      'Jede 75-minütige Stunde baut auf der letzten auf: Verbindung, Gewichtsverlagerung, die Umarmung und Musikalität. Mit viel Spaß vermittelt, sodass Selbstvertrauen und Schwung mitwachsen.',
      'Kein Partner nötig. Wir wechseln im Kurs die Partner:innen, und du entscheidest, welche Rolle du lernen möchtest: Leader, Follower oder Double-Role.',
    ],
    whatsIncluded: [],
    table: {
      caption: 'Pässe',
      rowLabels: ['Ganzer Kurs (12 Stunden)', '4er-Pass', 'Einzelstunde'],
    },
    faq: [
      {
        key: 'Do I need any dance experience to start?',
        q: 'Brauche ich Tanzerfahrung?',
        a: 'Überhaupt nicht. Jede Stunde ist für absolute Anfänger:innen gemacht. Wir fangen bei null an: Wie du stehst, wie du präsent bist, wie du über Berührung zuhörst.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich eine:n Partner:in mitbringen?',
        a: 'Nein. Die meisten kommen allein. Wir wechseln in der Stunde die Partner:innen, sodass du mit verschiedenen Leuten tanzt.',
      },
      {
        key: 'What should I wear?',
        q: 'Was soll ich anziehen?',
        a: 'Bequeme Kleidung, in der du dich gut bewegen kannst. Als Schuhe eignen sich saubere, gemütliche Socken oder ein zweites Paar Hallenschuhe. Vermeide dicke Gummisohlen, sie haften am Boden und machen Drehungen schwer.',
      },
      {
        key: 'When should I arrive?',
        q: 'Wann sollte ich da sein?',
        a: 'Halte dich an unsere „Erste 10 Minuten“-Regel: Komm 10 Minuten früher, damit du dich in Ruhe umziehen und ankommen kannst.',
      },
      {
        key: 'Is the class taught in English?',
        q: 'Ist der Unterricht auf Englisch?',
        a: 'Ja, unterrichtet wird auf Englisch. Individuelles Feedback bekommst du auf Wunsch auch auf Deutsch, Griechisch oder Russisch.',
      },
      {
        key: 'What if I miss a class?',
        q: 'Was, wenn ich eine Stunde verpasse?',
        a: 'Kein Problem. Verpasste Stunden kannst du während der Gültigkeit deines Passes kostenlos in unserer Garden Practica nachholen.',
      },
      {
        key: 'Where exactly are you located in Cologne?',
        q: 'Wo genau seid ihr in Köln?',
        a: EBERTPLATZ_LINK,
        raw: true,
      },
    ],
    courseSchema: {
      name: 'The Sprouting Sessions: Tango-Argentino-Anfängerkurs in Köln',
      description:
        'Kompletter 12-wöchiger Tango-Argentino-Anfängerkurs in Köln. Von null bis zum sicheren Tanzen. Kein Partner und keine Erfahrung nötig.',
    },
  },
  'growth-sessions': {
    metaTitle: 'Tango-Kurs für Fortgeschrittene in Köln (12 Wochen)',
    metaDescription:
      'Tango weiterentwickeln in Köln: 12-wöchiger Kurs für alle mit Tango-Grundlagen, jeden Donnerstag. Nahe Ebertplatz. Unterricht auf Englisch.',
    eyebrow: 'The Growth Sessions',
    waMessage: 'Hi! Ich habe eine Frage zum Tango-Kurs für Fortgeschrittene bei Tango Garden!',
    heading: 'Tango weiterentwickeln: Dein Kurs nach dem Einstieg',
    intro:
      'Der nächste Schritt nach den Sprouting Sessions: 12 Wochen, in denen deine Grundlagen zu sicherem, musikalischem Tanzen im Salon wachsen.',
    feedLabel: 'Nächster Kurs für Fortgeschrittene',
    whatToExpect: [
      'Für alle, die die Grundlagen schon kennen: Gewichtsverlagerung, Gehen im Parallel- und Kreuzsystem, Ochos, Giro, Sandwichito, Parada und Pasada, Calesita sowie die wichtigsten Regeln und die Orientierung auf einer Milonga.',
      'Jede Stunde dauert 75 Minuten und baut auf der letzten auf. Wir vertiefen Verbindung, Musikalität und Navigation auf der Tanzfläche, mit viel Spaß vermittelt.',
      'Kein Partner nötig. Wir wechseln im Kurs die Partner:innen, und du entscheidest, welche Rolle du vertiefen möchtest: Leader, Follower oder Double-Role.',
      'Mit dem Ganzen Kurs und dem 4er-Pass kannst du außerdem kostenlos alle Anfängerstunden besuchen.',
    ],
    whatsIncluded: [],
    perkColumn: 'Kostenloser Zugang zu allen Anfängerstunden',
    table: {
      caption: 'Pässe',
      rowLabels: ['Ganzer Kurs (12 Stunden)', '4er-Pass', 'Einzelstunde'],
    },
    faq: [
      {
        key: 'Am I ready for the Growth Sessions?',
        q: 'Bin ich bereit für die Growth Sessions?',
        a: 'Wenn du Gewichtsverlagerung, Gehen im Parallel- und Kreuzsystem, Ochos, Giro, Sandwichito, Parada und Pasada sowie Calesita kennst und weißt, wie man sich auf einer Milonga bewegt, bist du richtig. Unsicher? Schreib uns auf WhatsApp, dann finden wir gemeinsam das passende Level.',
      },
      {
        key: 'How do the free beginner classes work?',
        q: 'Wie funktioniert der kostenlose Zugang zu den Anfängerstunden?',
        a: 'Mit dem Ganzen Kurs und dem 4er-Pass der Growth Sessions kannst du alle Stunden der Sprouting Sessions kostenlos besuchen, zum Beispiel zum Auffrischen der Grundlagen oder um Anfänger:innen zu begleiten. Die Einzelstunde enthält diesen Zugang nicht.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich eine:n Partner:in mitbringen?',
        a: 'Nein. Die meisten kommen allein. Wir wechseln in der Stunde die Partner:innen, sodass du mit verschiedenen Leuten tanzt.',
      },
      {
        key: 'What should I wear?',
        q: 'Was soll ich anziehen?',
        a: 'Bequeme Kleidung, in der du dich gut bewegen kannst. Als Schuhe eignen sich saubere, gemütliche Socken oder ein zweites Paar Hallenschuhe. Vermeide dicke Gummisohlen, sie haften am Boden und machen Drehungen schwer.',
      },
      {
        key: 'When should I arrive?',
        q: 'Wann sollte ich da sein?',
        a: 'Halte dich an unsere „Erste 10 Minuten“-Regel: Komm 10 Minuten früher, damit du dich in Ruhe umziehen und ankommen kannst.',
      },
      {
        key: 'Is the class taught in English?',
        q: 'Ist der Unterricht auf Englisch?',
        a: 'Ja, unterrichtet wird auf Englisch. Individuelles Feedback bekommst du auf Wunsch auch auf Deutsch, Griechisch oder Russisch.',
      },
      {
        key: 'Where exactly are you located in Cologne?',
        q: 'Wo genau seid ihr in Köln?',
        a: EBERTPLATZ_LINK,
        raw: true,
      },
    ],
    courseSchema: {
      name: 'The Growth Sessions: Tango-Argentino-Kurs für Fortgeschrittene in Köln',
      description:
        'Zwölfwöchiger Tango-Argentino-Kurs für Fortgeschrittene in Köln, jeden Donnerstag. Für alle, die die Grundlagen schon kennen.',
    },
  },
  'garden-practica': {
    metaTitle: 'Tango-Practica in Köln: Zweimal im Monat',
    metaDescription:
      'Geführte Tango-Practica in Köln: 2 Stunden tanzen, üben und Feedback bekommen, am 2. und 4. Mittwoch im Monat. Offen für alle Rollen, ohne Partner, nahe Ebertplatz.',
    eyebrow: 'The Garden Practica',
    heading: 'Deine Tango-Practica in Köln',
    intro:
      'Eine entspannte, geführte Practica, offen für alle, die schon mindestens eine Tango-Stunde hatten. Ein Raum, um Gelerntes anzuwenden, neue Rollen auszuprobieren und dich inspirieren zu lassen. Komm vorbei, wann immer du magst.',
    feedLabel: 'Nächste Practica',
    whatToExpect: [
      'Jede Practica beginnt mit 10 Minuten Warm-up, danach folgt eine 30-minütige geführte Practica mit eingeladenen Gästen. Anschließend gehört die Tanzfläche dir: Tanz, was du schon kannst, und nimm nebenbei Feedback mit.',
      'Offen für alle Level und Rollen: Komm als Leader, Follower oder Double-Role, ganz wie du diese Woche Lust hast.',
      'Eine Practica, keine Milonga: Keine strengen Cabeceo-Regeln, dafür ein kleines Ritual. Tanz mit mindestens einer Person, mit der du noch nie getanzt hast.',
    ],
    whatsIncluded: [
      '10 Minuten Warm-up',
      '30 Minuten geführte Practica mit eingeladenen Gästen',
      'Alle Level und Rollen willkommen, auch Double-Role',
      'Lehrer:innen und erfahrenere Tänzer:innen, die dir bei Fragen weiterhelfen',
    ],
    table: { caption: 'Preis', rowLabels: ['1-Practica-Pass'] },
    faq: [
      {
        key: 'Do I need any dance experience to start?',
        q: 'Brauche ich Tanzerfahrung?',
        a: 'Die Practica ist offen für alle, die schon mindestens eine Tango-Stunde hatten. Wenn du ganz neu bist, starte am besten mit Enter the Garden oder den Sprouting Sessions.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich eine:n Partner:in mitbringen?',
        a: 'Nein. Wir wechseln während der Practica die Partner:innen, du kannst also allein kommen und trotzdem mit allen tanzen.',
      },
      {
        key: 'Is the practica a milonga?',
        q: 'Ist die Practica eine Milonga?',
        a: 'Nein. Die Practica ist ein entspannter Übungsraum, deshalb gibt es keine strengen Milonga-Codes wie den Cabeceo: Du kannst einfach jemanden zum Tanzen auffordern. Unser einziges Ritual: Tanz mit mindestens einer Person, mit der du noch nie getanzt hast.',
      },
      {
        key: 'How do we move on the floor?',
        q: 'Wie bewegen wir uns auf der Tanzfläche?',
        a: 'Wir tanzen gegen den Uhrzeigersinn durch den Raum, wie in jeder Ronda. Wenn du stehen bleibst, um etwas zu besprechen, geh einen Schritt Richtung Mitte, damit die Ronda für alle anderen frei bleibt.',
      },
      {
        key: 'What if I get stuck or have a question?',
        q: 'Was, wenn ich nicht weiterkomme oder eine Frage habe?',
        a: 'Frag einfach. Wir sind immer für dich da, und du kannst auch gerne Tänzer:innen fragen, die schon etwas weiter sind.',
      },
      {
        key: 'What should I wear?',
        q: 'Was soll ich anziehen?',
        a: 'Bequeme Kleidung, in der du dich gut bewegen kannst. Als Schuhe eignen sich saubere, gemütliche Socken oder ein zweites Paar Hallenschuhe. Vermeide dicke Gummisohlen.',
      },
      {
        key: 'Where exactly are you located in Cologne?',
        q: 'Wo genau seid ihr in Köln?',
        a: EBERTPLATZ_LINK,
        raw: true,
      },
    ],
    courseSchema: {
      name: 'Tango-Practica in Köln: The Garden Practica',
      description:
        'Offene Tango-Argentino-Practica in Köln für alle Level. Kein Partner nötig.',
    },
  },
  'private-classes': {
    metaTitle: 'Tango-Privatunterricht in Köln',
    metaDescription:
      'Privatstunden in Tango Argentino in Köln mit Vangelis oder Kristina: 60 € pro Stunde für eine Person oder 80 € für ein Paar, bei dir, bei uns oder im Studio.',
    eyebrow: 'Private Classes',
    heading: 'Tango-Privatunterricht in Köln',
    intro:
      'Tango Argentino ganz persönlich mit Vangelis oder Kristina, allein oder als Paar, abgestimmt auf das, woran du arbeiten möchtest.',
    whatToExpect: [
      'Eine Stunde, die sich nach dir richtet: deine ersten Schritte, die Umarmung, Musikalität oder das eine Detail, das dir auf der Tanzfläche immer wieder entwischt. Wir passen uns deinem Level und deinem Tempo an.',
      'Komm allein oder als Paar. Alle Level sind willkommen, von absoluten Anfänger:innen bis zu erfahrenen Tänzer:innen.',
      'Wir treffen uns da, wo es für dich passt: bei dir, bei uns oder in einem Studio in Köln, das wir für dich buchen.',
    ],
    whatsIncluded: [
      '60 Minuten, abgestimmt auf deine Ziele und dein Level',
      'Allein oder als Paar',
      'Bei dir oder bei uns ohne Aufpreis, oder in einem Studio, das wir für dich buchen (zzgl. Studiomiete)',
    ],
    table: { caption: 'Preis', rowLabels: ['Eine Person', 'Paar'] },
    priceNote:
      'Die Preise gelten pro Stunde (60 Minuten). Bei dir oder bei uns kommt nichts dazu. Lieber in einem Studio? Wir buchen eins für dich, und die Studiomiete kommt zum Stundenpreis dazu.',
    nextStep: 'Schreib uns auf WhatsApp, woran du arbeiten möchtest und welche Zeiten dir passen.',
    faq: [
      {
        key: 'Who are private classes for?',
        q: 'Für wen ist Privatunterricht?',
        a: 'Für alle, von absoluten Anfänger:innen, die schneller reinkommen möchten, bis zu erfahrenen Tänzer:innen, die an etwas Bestimmtem arbeiten. Wir gestalten jede Stunde nach deinem Level und deinen Zielen.',
      },
      {
        key: 'Who teaches the class?',
        q: 'Wer unterrichtet?',
        a: 'Entweder Vangelis oder Kristina: eine Lehrperson pro Stunde. Wenn du jemanden bevorzugst, sag es uns einfach, wenn du uns schreibst.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich eine:n Partner:in mitbringen?',
        a: 'Nein. Komm allein und tanz mit deiner Lehrperson, oder bring eine:n Partner:in mit und bucht als Paar.',
      },
      {
        key: 'How much does a private class cost?',
        q: 'Was kostet eine Privatstunde?',
        a: 'Eine Stunde dauert 60 Minuten: 60 € für eine Person oder 80 € für ein Paar. Bei dir oder bei uns fallen keine zusätzlichen Kosten an. Wenn du lieber in einem Studio tanzen möchtest, buchen wir eins für dich, und die Studiomiete kommt zum Stundenpreis dazu.',
      },
      {
        key: 'Where do the classes take place?',
        q: 'Wo findet der Unterricht statt?',
        a: 'Da, wo es für dich am besten passt: bei dir, bei uns oder in einem Studio in Köln, das wir für dich buchen.',
      },
      {
        key: 'Is the class taught in English?',
        q: 'Wird auf Englisch unterrichtet?',
        a: 'Ja. Auf Wunsch unterrichten wir auch auf Deutsch, Russisch und Griechisch.',
      },
      {
        key: 'How do I book?',
        q: 'Wie buche ich?',
        a: 'Schreib uns auf WhatsApp, woran du arbeiten möchtest und welche Zeiten dir passen, dann finden wir gemeinsam einen Termin.',
      },
    ],
    courseSchema: {
      name: 'Tango-Privatunterricht in Köln',
      description:
        'Privatstunden in Tango Argentino in Köln mit Vangelis oder Kristina, für eine Person oder ein Paar, für alle Level.',
    },
  },
};

/**
 * The class page entry for a locale: English as-is, German as the English
 * entry with the German words laid over it.
 * @param {string} slug
 * @param {'en' | 'de'} [locale]
 */
export function getClassPage(slug, locale = 'en') {
  const en = classPages.find((c) => c.slug === slug);
  if (!en) throw new Error(`Unknown class page: ${slug}`);
  if (locale === 'en') return en;

  const de = classPagesDe[/** @type {keyof typeof classPagesDe} */ (slug)];
  return {
    ...en,
    metaTitle: de.metaTitle,
    metaDescription: de.metaDescription,
    eyebrow: de.eyebrow,
    heading: de.heading,
    intro: de.intro,
    feedLabel: de.feedLabel,
    whatToExpect: de.whatToExpect,
    whatsIncluded: de.whatsIncluded,
    table: {
      ...en.table,
      caption: de.table.caption,
      rows: en.table.rows.map((row, i) => ({ ...row, label: de.table.rowLabels[i] })),
    },
    ...(de.priceNote && { priceNote: de.priceNote }),
    ...(de.nextStep && { nextStep: de.nextStep }),
    ...(de.perkColumn && { perkColumn: de.perkColumn }),
    ...(de.extraCta && { extraCta: { ...en.extraCta, label: de.extraCta.label } }),
    ...(de.galleryCaption && { galleryCaption: de.galleryCaption }),
    // Never the English message on a German page; without one, the page builds its own.
    waMessage: 'waMessage' in de ? de.waMessage : undefined,
    faq: de.faq,
    courseSchema: { ...en.courseSchema, ...de.courseSchema },
  };
}
