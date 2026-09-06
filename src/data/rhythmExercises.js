/**
 * Rhythm trainer — the exercise catalogue.
 *
 * The grid is two compases of 4/4 counted 1–8, subdivided into eighth notes:
 * 16 equally-spaced slots, `1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 &`.
 *
 * A pattern is a 16-character string, one character per slot:
 *   'x' — the note sounds (dark in the printed layout)
 *   '.' — the note is silent (light grey)
 *
 * Slot metrics follow the printed layout's three bar heights:
 *   slots 0, 4, 8, 12  → beats 1, 3, 5, 7 — strong (tallest bar)
 *   slots 2, 6, 10, 14 → beats 2, 4, 6, 8 — medium
 *   odd slots          → the "&" offbeats — weak (shortest bar)
 */

/** Number of eighth-note slots in the loop. */
export const SLOTS = 16;

/**
 * @typedef {{ id: string, name: string, spanish?: string, note: string, pattern: string }} Exercise
 * @type {Exercise[]}
 */
export const exercises = [
  {
    id: 'marcato-1',
    name: 'Marcato in 1',
    spanish: 'Marcato en uno',
    note: 'One step per compás, on beat 1. The slowest, widest way to walk.',
    pattern: 'x.......x.......',
  },
  {
    id: 'marcato-2',
    name: 'Marcato in 2',
    spanish: 'Marcato en dos',
    note: 'The tango walk. Beats 1 and 3 — the strong beats of each compás.',
    pattern: 'x...x...x...x...',
  },
  {
    id: 'marcato-4',
    name: 'Marcato in 4',
    spanish: 'Marcato en cuatro',
    note: 'Every beat. Twice the steps of marcato in 2, same music.',
    pattern: 'x.x.x.x.x.x.x.x.',
  },
  {
    id: 'sincopa-1',
    name: 'Síncopa 1',
    spanish: 'Síncopa',
    note: 'The classic tango syncopation: arrive early, on the "&" after 1, then land on 3.',
    pattern: 'xx..x...xx..x...',
  },
  {
    id: 'sincopa-3',
    name: 'Síncopa 3',
    note: 'The mirror: hold through beat 2, anticipate 3 on the "&" of 2.',
    pattern: 'x..xx...x..xx...',
  },
  {
    id: 'sincopa-1-3',
    name: 'Síncopa 1 & 3',
    note: 'Both syncopations in one compás — 1, the "&" of 1, the "&" of 2, then 3.',
    pattern: 'xx.xx...xx.xx...',
  },
  {
    id: 'double-time-1',
    name: 'Double time 1',
    spanish: 'Doble tiempo',
    note: 'Walking in 2, then doubling across beats 1–2 of the first compás.',
    pattern: 'x.x.x...x...x...',
  },
  {
    id: 'double-time-3',
    name: 'Double time 3',
    note: 'The same doubling, moved to beats 3–4.',
    pattern: 'x...x.x.x...x...',
  },
  {
    id: 'opposite',
    name: 'Opposite',
    spanish: 'Contratiempo',
    note: 'Against the walk: beats 2, 4, 6 and 8. Turn the pulse on to feel it.',
    pattern: '..x...x...x...x.',
  },
  {
    id: 'opposite-with-1',
    name: 'Opposite with 1',
    note: 'Contratiempo that starts on the downbeat before crossing over.',
    pattern: 'x.x...x...x...x.',
  },
  {
    id: 'exercise-1',
    name: 'Exercise 1',
    note: 'Beats 2, 3, 6 and 8.',
    pattern: '..x.x.....x...x.',
  },
  {
    id: 'exercise-2',
    name: 'Exercise 2',
    note: 'Beats 1, 2, 6 and 7.',
    pattern: 'x.x.......x.x...',
  },
  {
    id: 'exercise-3',
    name: 'Exercise 3',
    spanish: '3-3-2',
    note: 'The tresillo — tango’s signature cell. Three eighths, three eighths, two eighths.',
    pattern: 'x..x..x.x..x..x.',
  },
  {
    id: 'four-one',
    name: '4-1',
    note: 'A bridging figure across the barline: land on beat 4, then beat 1 of the next compás.',
    pattern: '......x.x.......',
  },
  {
    id: 'all-eighths',
    name: 'All eighths',
    spanish: 'Doble tiempo continuo',
    note: 'Every subdivision, beats and "&"s alike.',
    pattern: 'xxxxxxxxxxxxxxxx',
  },
  {
    id: 'blank',
    name: 'Blank',
    note: 'An empty grid. Tap the bars to build your own.',
    pattern: '................',
  },
];

/**
 * Metric weight of each slot, from the three bar heights in the printed layout.
 * @param {number} i slot index, 0–15
 * @returns {'strong' | 'medium' | 'weak'}
 */
export function slotStrength(i) {
  if (i % 2 === 1) return 'weak';
  return i % 4 === 0 ? 'strong' : 'medium';
}

/**
 * Count label under each slot: "1".."8" on the beats, "&" on the offbeats.
 * @param {number} i slot index, 0–15
 */
export function slotLabel(i) {
  return i % 2 === 1 ? '&' : String(i / 2 + 1);
}
