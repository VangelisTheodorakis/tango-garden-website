/**
 * German copy for the three class pages.
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
    metaTitle: 'Kostenlose Tango-Probestunde in Köln',
    metaDescription:
      'Tango Argentino kostenlos ausprobieren: eine Stunde open air im Rheinpark Köln. Ohne Partner, ohne Vorkenntnisse, ohne Druck.',
    eyebrow: 'Enter the Garden',
    heading: 'Kostenlose Tango-Probestunde im Rheinpark',
    intro:
      'Eine kostenlose Einführung in den Tango Argentino, open air im Rheinpark. Kein Partner, keine Erfahrung, kein Druck. Nur eine Stunde, um zu spüren, wie es sich anfühlt.',
    feedLabel: 'Nächste Probestunde',
    whatToExpect: [
      'Eine angeleitete Stunde rund um Verbindung, Gewichtsverlagerung und die Umarmung. Keine Performance, sondern ein Gespräch zwischen zwei Menschen.',
      'Wir wechseln während der Stunde die Partner, sodass alle mit allen tanzen. Komm allein oder zu zweit.',
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
        a: 'Überhaupt nicht. Jede Session ist für absolute Anfänger:innen gemacht. Wir fangen bei null an: wie du stehst, wie du präsent bist, wie du über Berührung zuhörst.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich einen Partner mitbringen?',
        a: 'Nein. Die meisten kommen allein. Wir wechseln während der Session die Partner, sodass du mit verschiedenen Leuten tanzt.',
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
  },
  'beginner-course': {
    metaTitle: 'Tango-Kurs für Anfänger in Köln (12 Wochen)',
    metaDescription:
      'Tango lernen in Köln: 12-wöchiger Anfängerkurs, ohne Partner und ohne Vorkenntnisse. Nahe Ebertplatz. Unterricht auf Englisch, Feedback auch auf Deutsch.',
    eyebrow: 'The Sprouting Sessions',
    heading: 'Tango lernen: dein Anfängerkurs in Köln',
    intro:
      'Ein sanfter, strukturierter Einstieg über 12 Wochen, für alle, die noch nie Tango getanzt haben.',
    feedLabel: 'Nächster Anfängerkurs · Gruppe schließt am 01.10.',
    whatToExpect: [
      'Ein sanftes wöchentliches Ritual, egal ob du den besten Preis pro Stunde willst oder erst einmal flexibel reinschnuppern möchtest.',
      'Jede 1,5-stündige Stunde baut auf der letzten auf: Verbindung, Gewichtsverlagerung, die Umarmung und Musikalität. Mit viel Spaß vermittelt, sodass Selbstvertrauen und Schwung mitwachsen.',
      'Kein Partner nötig. Wir wechseln im Kurs die Partner, und du entscheidest, welche Rolle du lernen möchtest: Leader, Follower oder Double-Role.',
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
        a: 'Überhaupt nicht. Jede Stunde ist für absolute Anfänger:innen gemacht. Wir fangen bei null an: wie du stehst, wie du präsent bist, wie du über Berührung zuhörst.',
      },
      {
        key: 'Do I need to bring a partner?',
        q: 'Muss ich einen Partner mitbringen?',
        a: 'Nein. Die meisten kommen allein. Wir wechseln in der Stunde die Partner, sodass du mit verschiedenen Leuten tanzt.',
      },
      {
        key: 'What should I wear?',
        q: 'Was soll ich anziehen?',
        a: 'Bequeme Kleidung, in der du dich gut bewegen kannst. Als Schuhe eignen sich saubere, gemütliche Socken oder ein zweites Paar Hallenschuhe. Vermeide dicke Gummisohlen, sie haften am Boden und machen Drehungen schwer.',
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
  'garden-practica': {
    metaTitle: 'Tango-Practica in Köln: jeden Mittwoch',
    metaDescription:
      'Geführte Tango-Practica in Köln: jeden Mittwoch 2,5 Stunden tanzen, üben und Feedback bekommen. Offen für alle Rollen, ohne Partner, nahe Ebertplatz.',
    eyebrow: 'The Garden Practica',
    heading: 'Deine Tango-Practica in Köln',
    intro:
      'Eine entspannte, geführte Practica, offen für alle, die schon mindestens eine Tango-Stunde hatten. Ein Raum, um Gelerntes anzuwenden, neue Rollen auszuprobieren und dich inspirieren zu lassen. Komm vorbei, wann immer du magst.',
    feedLabel: 'Nächste Practica',
    whatToExpect: [
      'Jede Practica beginnt mit 10 Minuten Warm-up, danach folgt eine 30-minütige geführte Practica mit eingeladenen Gästen. Anschließend gehört die Tanzfläche dir: Tanz, was du schon kannst, und nimm nebenbei Feedback mit.',
      'Offen für alle Level und Rollen: Komm als Leader, Follower oder Double-Role, ganz wie du diese Woche Lust hast.',
      'Eine Practica, keine Milonga: keine strengen Cabeceo-Regeln, dafür ein kleines Ritual. Tanz mit mindestens einer Person, mit der du noch nie getanzt hast.',
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
        q: 'Muss ich einen Partner mitbringen?',
        a: 'Nein. Wir wechseln während der Practica die Partner, du kannst also allein kommen und trotzdem mit allen tanzen.',
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
    faq: de.faq,
    courseSchema: { ...en.courseSchema, ...de.courseSchema },
  };
}
