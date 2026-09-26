/**
 * German names, notes and glossary text for the rhythm trainer.
 *
 * Patterns, ids and the Spanish tango terms stay in rhythmExercises.js; this
 * only swaps the words shown to the dancer. Keyed by exercise id / glossary
 * term so a new exercise can't silently pick up the wrong translation.
 */

/** @type {Record<string, { name?: string, note: string }>} */
export const exercisesDe = {
  'marcato-1': { note: 'Ein Schritt pro Compás, auf Schlag 1. Die langsamste, weiteste Art zu gehen.' },
  'marcato-2': { note: 'Der Tango-Walk. Schläge 1 und 3, die starken Schläge jedes Compás.' },
  'marcato-4': { note: 'Jeder Schlag. Doppelt so viele Schritte wie Marcato in 2, dieselbe Musik.' },
  'sincopa-1': {
    note: 'Die klassische Tango-Synkope: früh ankommen, auf dem „&“ nach der 1, dann auf der 3 landen.',
  },
  'sincopa-3': { note: 'Die Spiegelung: durch Schlag 2 halten, die 3 auf dem „&“ der 2 vorwegnehmen.' },
  'sincopa-aire': {
    note: 'Die gehaltene Variante: kein Akzent auf Schlag 1, nur die frühe Vorwegnahme, dann bis zur Landung auf der 3 halten.',
  },
  'sincopa-1-3': { note: 'Beide Synkopen in einem Compás: 1, das „&“ der 1, das „&“ der 2, dann 3.' },
  'double-time-1': {
    name: 'Doble tiempo 1',
    note: 'Gehen in 2, dann Verdopplung über die Schläge 1–2 des ersten Compás.',
  },
  'double-time-3': { name: 'Doble tiempo 3', note: 'Dieselbe Verdopplung, verschoben auf die Schläge 3–4.' },
  opposite: {
    name: 'Contratiempo',
    note: 'Gegen den Walk: Schläge 2, 4, 6 und 8. Schalte den Puls ein, um es zu spüren.',
  },
  'opposite-with-1': {
    name: 'Contratiempo mit 1',
    note: 'Contratiempo, das auf dem Downbeat beginnt, bevor es auf die Offbeats wechselt.',
  },
  'exercise-1': { name: 'Übung 1', note: 'Schläge 2, 3, 6 und 8.' },
  'exercise-2': { name: 'Übung 2', note: 'Schläge 1, 2, 6 und 7.' },
  'exercise-3': {
    note: 'Die typische rhythmische Zelle des Tango: drei Achtel, drei Achtel, zwei Achtel, oft gezählt als „pa-na-ma, pa-na-ma, cu-ba“.',
  },
  'four-one': {
    note: 'Eine Brückenfigur über den Taktstrich: auf Schlag 4 landen, dann auf Schlag 1 des nächsten Compás.',
  },
  'all-eighths': { name: 'Alle Achtel', note: 'Jede Unterteilung, Schläge und „&“ gleichermaßen.' },
  blank: { name: 'Leer', note: 'Ein leeres Raster. Tippe auf die Balken, um dein eigenes Muster zu bauen.' },
};

/** @type {Record<string, { spanish?: string | null, definition: string }>} */
export const glossaryDe = {
  Compás: { definition: 'Der Viererschlag-Takt, auf dem Tango aufbaut. Dieses Raster ist zwei Compases lang.' },
  Marcato: {
    definition:
      'Auf dem Schlag spielen oder gehen. „Marcato en X“ sagt, wie viele der vier Schläge du pro Compás markierst: zwei, vier oder nur einen.',
  },
  Síncopa: {
    definition: 'Eine Synkope: einen Schlag vorwegnehmen, indem du früh landest, auf dem „&“ direkt davor.',
  },
  Aire: {
    definition:
      'Eine gehaltene, schwebende Síncopa: kein Akzent auf dem Schlag selbst, nur die frühe Vorwegnahme, gehalten bis zur Landung.',
  },
  // The English file uses the English name as the alternate label here.
  Contratiempo: {
    spanish: 'Gegenschlag',
    definition: 'Auf den Offbeats gehen (2, 4, 6, 8) statt auf dem Gehpuls.',
  },
  Tresillo: {
    definition:
      'Die typische rhythmische Zelle des Tango: drei Achtel, drei Achtel, zwei Achtel, oft gezählt als „pa-na-ma, pa-na-ma, cu-ba“.',
  },
  'Doble tiempo': {
    spanish: 'Doppeltes Tempo',
    definition: 'Auf jedem Achtel gehen statt auf jedem Schlag, doppelt so dicht wie Marcato en dos.',
  },
  '4-1': { definition: 'Eine Brückenfigur, die auf Schlag 4 eines Compás und auf Schlag 1 des nächsten landet.' },
};

/**
 * @template {{ id: string, name: string, note: string }} T
 * @param {T[]} list
 * @returns {T[]}
 */
export const localizeExercises = (list) =>
  list.map((e) => ({ ...e, name: exercisesDe[e.id]?.name ?? e.name, note: exercisesDe[e.id]?.note ?? e.note }));

/**
 * @template {{ term: string, spanish?: string, definition: string }} T
 * @param {T[]} list
 * @returns {T[]}
 */
export const localizeGlossary = (list) =>
  list.map((g) => {
    const de = glossaryDe[g.term];
    if (!de) return g;
    return {
      ...g,
      definition: de.definition,
      spanish: de.spanish === undefined ? g.spanish : (de.spanish ?? undefined),
    };
  });
