/**
 * Tango vals trainer: the exercise catalogue.
 *
 * Same engine and pattern format as rhythmExercises.js, in 3/4. The grid is
 * two compases of three beats, one slot per beat: 6 slots, `1 2 3 1 2 3`.
 * A pattern is a 6-character string of 'x' (sounds) and '.' (silent).
 *
 * Every pattern below is one that vals teachers describe in print; nothing is
 * extrapolated from the tango trainer. Sources, all read directly:
 *   [A] Stu Johnstone, "Vals rhythms" and "Vals duplets", Toca Tango Auckland
 *       aucklandtango.co.nz/vals-rhythms-dance-choices/
 *       aucklandtango.co.nz/2026/10/09/dancing-to-vals-duplets/
 *   [E] Endre Szeghalmi, "Rhythm of tango vals explained very clearly"
 *       endretango.com/en/rhythm-of-tango-vals-explained-very-clearly/
 *   [R] Revolution Ballroom, "Vals Musicality (Argentine Waltz)"
 *       revolutionballroom.com/blog/vals-musicality
 *   [L] learntodancetango.com, "Intro to Vals Rhythms"
 *   [U] Ultimate Tango, "Learn Argentine Vals" (ultimatetango.com/vals-class)
 *
 * The names differ between schools ([R] calls 1-2 "double tempo" and 3-1
 * "double time"; [A] just says "ONE - TWO" and "THREE - ONE"), so the
 * exercises are named by the beats themselves.
 */

/** Slots per compás: one per beat. */
export const SLOTS_PER_COMPAS = 3;

/** Number of slots in the loop: two compases. */
export const SLOTS = SLOTS_PER_COMPAS * 2;

/** The exercise the page loads with, and the one "Reset" returns to. */
export const DEFAULT_EXERCISE = 'vals-1';

/**
 * Tempo slider, in quarter-note BPM like the tango trainer. [R] gives vals as
 * 150-240 BPM; a D'Agostino/Vargas vals tanda is tagged 65-69 (per compás,
 * i.e. 195-207 BPM) at tomaskohl.com. The default sits in that measured band.
 * The minimum is below the real range on purpose, for learning a pattern
 * slowly; it is a practice aid, not a claim about the music.
 */
export const tempo = { min: 120, max: 240, value: 200 };

/**
 * @typedef {{ id: string, name: string, spanish?: string, note: string, pattern: string }} Exercise
 * @type {Exercise[]}
 */
export const exercises = [
  {
    // [A] "The pulse of the vals is the continuous beat one"; [E] [R] [L] agree.
    id: 'vals-1',
    name: 'Beat 1 only',
    note: 'The base rhythm: one step per compás, on the accented first beat, with beats 2 and 3 left as a pause.',
    pattern: 'x..x..',
  },
  {
    // [R] "1 2 (3) | 1 (2) (3)"; [E] extra step on beat 2 of every second bar; [A] [L].
    id: 'vals-1-2',
    name: '1-2',
    note: 'Step on 1 and 2, pause on 3, then just the 1 of the next compás. Use it where the music puts a note on beat 2.',
    pattern: 'xx.x..',
  },
  {
    // [R] "1 (2) 3 | 1 (2) (3)"; [E] step on beat 3 of every second bar; [A] "THREE - ONE"; [L].
    id: 'vals-3-1',
    name: '3-1',
    note: 'Step on 1, pause on 2, step on 3, then the 1 of the next compás. The step on 3 leads into the next strong beat.',
    pattern: 'x.xx..',
  },
  {
    // [A] "rarely danced by social tango dancers"; [L] keep the steps small.
    id: 'vals-1-2-3',
    name: '1-2-3',
    note: 'All three beats. Rare on the dance floor: keep the steps small and save it for a run the music invites.',
    pattern: 'xxxxxx',
  },
  {
    id: 'blank',
    name: 'Blank',
    note: 'An empty grid. Tap the bars to build your own.',
    pattern: '......',
  },
];

/**
 * Metric weight of each slot: the accented beat opens each compás.
 * @param {number} i slot index, 0-5
 * @returns {'strong' | 'medium' | 'weak'}
 */
export function slotStrength(i) {
  return i % SLOTS_PER_COMPAS === 0 ? 'strong' : 'medium';
}

/**
 * Count label under each slot: "1".."3" for the beats of each compás.
 * @param {number} i slot index, 0-5
 */
export function slotLabel(i) {
  return String((i % SLOTS_PER_COMPAS) + 1);
}

/**
 * The vocabulary behind the exercises above.
 * @typedef {{ term: string, spanish?: string, definition: string }} GlossaryTerm
 * @type {GlossaryTerm[]}
 */
export const glossary = [
  {
    term: 'Compás',
    definition:
      'The measure. Vals is in 3/4: three beats, counted 1-2-3, with the first one accented. This grid is two compases long.',
  },
  {
    term: 'Base rhythm',
    spanish: 'Pulse',
    definition:
      'Stepping only on beat 1 of each compás and pausing through 2 and 3. Dancing a whole vals this way is always musical.',
  },
  {
    term: 'Double time',
    spanish: '1-2 and 3-1',
    definition:
      'Adding one extra step inside the compás, either on beat 2 or on beat 3.',
  },
];
