/**
 * Tango vals trainer: the exercise catalogue.
 *
 * Same engine and pattern format as rhythmExercises.js, in 3/4. The grid is
 * two compases of three beats, subdivided into eighth notes: 12 equally-spaced
 * slots, `1 & 2 & 3 & 1 & 2 & 3 &`. A pattern is a 12-character string of
 * 'x' (sounds) and '.' (silent), one character per slot.
 *
 * Metric weight follows the vals itself: one strong beat per compás, two weak
 * ones, and the "&" offbeats lightest of all.
 *
 * DRAFT: the exercise list and the tempo range below are a first pass from
 * general vals musicality, not from the school's own teaching material. Both
 * want a teacher's review before this goes public.
 */

/** Eighth-note slots per compás (3 beats x 2). */
export const SLOTS_PER_COMPAS = 6;

/** Number of eighth-note slots in the loop: two compases. */
export const SLOTS = SLOTS_PER_COMPAS * 2;

/** The exercise the page loads with, and the one "Reset" returns to. */
export const DEFAULT_EXERCISE = 'vals-1';

/**
 * Tempo slider, in quarter-note BPM like the tango trainer. Dancers and
 * teachers usually quote vals in compases (bars) per minute, which is a third
 * of this: roughly 70-80 for most valses, i.e. 210-240 BPM. The slider runs
 * well below that so a pattern can be learned slowly.
 */
export const tempo = { min: 120, max: 260, value: 210 };

/**
 * @typedef {{ id: string, name: string, spanish?: string, note: string, pattern: string }} Exercise
 * @type {Exercise[]}
 */
export const exercises = [
  {
    id: 'vals-1',
    name: 'Vals in 1',
    spanish: 'Vals en uno',
    note: 'One step per compás, on the strong beat. The long, gliding step most of the dance is built on.',
    pattern: 'x.....x.....',
  },
  {
    id: 'vals-3',
    name: 'Vals in 3',
    spanish: 'Vals en tres',
    note: 'Every beat: the strong beat and both weak ones. Three times the steps of vals in 1, same music.',
    pattern: 'x.x.x.x.x.x.',
  },
  {
    id: 'vals-1-2',
    name: 'Beats 1 and 2',
    note: 'The strong beat, then a quick step on the first weak beat. Hold through beat 3.',
    pattern: 'x.x...x.x...',
  },
  {
    id: 'vals-1-3',
    name: 'Beats 1 and 3',
    note: 'The strong beat, a pause over beat 2, then a step on the second weak beat.',
    pattern: 'x...x.x...x.',
  },
  {
    id: 'vals-weak',
    name: 'Weak beats',
    spanish: 'Contratiempo',
    note: 'Only beats 2 and 3, with the strong beat left silent. Turn the pulse on to feel where the 1 is.',
    pattern: '..x.x...x.x.',
  },
  {
    id: 'vals-sincopa',
    name: 'Síncopa into the 1',
    spanish: 'Síncopa',
    note: 'Anticipate the next strong beat: step on the "&" of 3, then land on the 1.',
    pattern: 'x....xx....x',
  },
  {
    id: 'vals-hemiola',
    name: 'Two over three',
    spanish: 'Hemiola',
    note: 'Group the six beats of two compases in twos instead of threes: steps on beats 1, 3 and 5 of the six. The bar line seems to move.',
    pattern: 'x...x...x...',
  },
  {
    id: 'vals-all-eighths',
    name: 'All eighths',
    note: 'Every subdivision, beats and "&"s alike.',
    pattern: 'xxxxxxxxxxxx',
  },
  {
    id: 'blank',
    name: 'Blank',
    note: 'An empty grid. Tap the bars to build your own.',
    pattern: '............',
  },
];

/**
 * Metric weight of each slot: the strong beat opens each compás.
 * @param {number} i slot index, 0-11
 * @returns {'strong' | 'medium' | 'weak'}
 */
export function slotStrength(i) {
  if (i % 2 === 1) return 'weak';
  return i % SLOTS_PER_COMPAS === 0 ? 'strong' : 'medium';
}

/**
 * Count label under each slot: "1".."3" on the beats of each compás, "&" on
 * the offbeats.
 * @param {number} i slot index, 0-11
 */
export function slotLabel(i) {
  return i % 2 === 1 ? '&' : String((i % SLOTS_PER_COMPAS) / 2 + 1);
}

/**
 * The vocabulary behind the exercises above, one entry per family of pattern.
 * @typedef {{ term: string, spanish?: string, definition: string }} GlossaryTerm
 * @type {GlossaryTerm[]}
 */
export const glossary = [
  {
    term: 'Compás',
    definition:
      'The three-beat measure of the vals: one strong beat and two weak ones. This grid is two compases long.',
  },
  {
    term: 'Vals en uno / en tres',
    definition:
      'How many of the three beats you step on. En uno marks only the strong beat; en tres marks all three.',
  },
  {
    term: 'Contratiempo',
    spanish: 'Weak beats',
    definition: 'Stepping on the weak beats (2 and 3) and leaving the strong beat silent.',
  },
  {
    term: 'Síncopa',
    definition:
      'A syncopation: anticipating a beat by landing early, on the "&" just before it.',
  },
  {
    term: 'Hemiola',
    spanish: 'Sesquiáltera',
    definition:
      'Two against three: the six beats of two compases grouped in twos instead of threes, so the accents cross the bar line.',
  },
];
