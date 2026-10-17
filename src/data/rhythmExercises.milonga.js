/**
 * Milonga trainer: the exercise catalogue.
 *
 * Same engine and pattern format as rhythmExercises.js, but in 2/4 and one
 * level finer: the habanera's second note falls between the eighths, so each
 * slot is a sixteenth. Two compases of two beats = 16 slots, four per beat,
 * labelled `1 · y · 2 · y ·` per compás.
 *
 * DRAFT FOR REVIEW: this deliberately lists every reading found in print,
 * including three incompatible definitions of "traspié". Cut what the school
 * does not teach. Sources, all read directly:
 *   [D] Mariano Diaz Campos, "Milonga Lisa y Milonga Traspié"
 *       tangomasterclass.com/blog/milonga
 *   [Y] Yang Ningyuan, "How to Dance Milonga"
 *       yangningyuan.blogspot.com/2019/07/how-to-dance-milonga.html
 *   [U] Ultimate Tango, "Why Milonga Rhythm Is Not Just Fast Tango"
 *       ultimatetango.com/blog/why-milonga-rhythm-is-not-just-fast-tango
 *   [C] tangocherie, "Milonga Con Traspié"
 *       tangocherie.blogspot.com/2010/01/milonga-con-traspie.html
 *   [T] Adam Tully (tango guitarist), "Rhythms or 'Genres' in tango"
 *       adamtully.com/single-post/2017/05/01/rhythms-or-genres-in-tango
 *   [K] Tomas Kohl, "Milonga! Milonga! Milonga!" (tempo)
 *       tomaskohl.com/tango/milonga-milonga-milonga/
 */

/** Sixteenth-note slots per beat. */
export const SLOTS_PER_BEAT = 4;

/** Slots per compás (2 beats x 4). */
export const SLOTS_PER_COMPAS = SLOTS_PER_BEAT * 2;

/** Number of slots in the loop: two compases. */
export const SLOTS = SLOTS_PER_COMPAS * 2;

/** The exercise the page loads with, and the one "Reset" returns to. */
export const DEFAULT_EXERCISE = 'milonga-both-beats';

/**
 * Tempo slider in BPM of the walking beat. [K] puts danceable milongas at
 * 80-120 with 100 ideal, and tags six recordings at 108-115; he does not say
 * what the figure counts, so "walking beat" is an assumption. The floor is
 * below the real range on purpose, for learning a pattern slowly.
 */
export const tempo = { min: 60, max: 125, value: 100 };

/**
 * Typical milonga tempo per orchestra, in the slider's units (walking beats
 * per minute).
 *   Canaro: the median of the nine milongas Tango Voice measured
 *     (tangovoice.wordpress.com/category/tango/milonga/): 77, 80-86 and
 *     105-110, i.e. a slow and a fast group; the median is 86.
 *   The others: the speed band tangosparks.com tags on every studio
 *     recording in its discologies (tangosparks.com/preface; milonga bands:
 *     Very Slow up to 90, Slow 91-100, Fast 101-109, Very Fast 110+), taking
 *     the median recording's band and interpolating within it. Milongas
 *     counted: Di Sarli 15, Troilo 44, D'Arienzo 91. D'Arienzo's median falls
 *     in the open-ended Very Fast band (60 of his 91), so his figure is set
 *     just above its floor.
 * @type {{ name: string, bpm: number }[]}
 */
export const orchestraTempos = [
  { name: 'Canaro', bpm: 86 },
  { name: 'Di Sarli', bpm: 103 },
  { name: 'Troilo', bpm: 107 },
  { name: "D'Arienzo", bpm: 112 },
];

/**
 * @typedef {{ id: string, name: string, spanish?: string, note: string, pattern: string }} Exercise
 * @type {Exercise[]}
 */
export const exercises = [
  {
    // [Y] milonga lisa: "steps only on the downbeat of each measure".
    id: 'milonga-downbeat',
    name: 'Downbeat only',
    spanish: 'Lisa',
    note: 'One step per compás, on beat 1.',
    pattern: 'x.......x.......',
  },
  {
    // [D] lisa: "step on each strong beat (A Tiempo)", "dancing to the 1 - 2".
    id: 'milonga-both-beats',
    name: 'Both beats',
    spanish: 'A tiempo',
    note: 'A step on beat 1 and on beat 2.',
    pattern: 'x...x...x...x...',
  },
  {
    // [D] "dancing to the 1 - y - 2 - y is called Contratiempo (double beat)".
    id: 'milonga-double',
    name: 'Double beat',
    spanish: 'Contratiempo',
    note: 'Every half beat: 1, y, 2, y. Twice the steps of dancing a tiempo.',
    pattern: 'x.x.x.x.x.x.x.x.',
  },
  {
    // [U] "Count it as 1 - - 4, 5 - 7"; [T] "two accented beats and a dotted
    // rhythm commonly called a habanera pattern".
    id: 'milonga-habanera',
    name: 'Habanera',
    note: 'The rhythm under the music itself: a long note, a short one, then two even ones. In sixteenths, counts 1, 4, 5 and 7 of 8.',
    pattern: 'x..xx.x.x..xx.x.',
  },
  {
    // [Y] rock traspié: weight shifts on 1 (quick), + (quick), 2 (slow).
    id: 'milonga-traspie-qqs',
    name: 'Traspié A: quick-quick-slow',
    note: 'Steps on 1, y and 2, then wait.',
    pattern: 'x.x.x...x.x.x...',
  },
  {
    // [C] "two steps for every one beat", counted "1-2-and-3-4-and" with the
    // bar counted in four.
    id: 'milonga-traspie-two-for-one',
    name: 'Traspié B: two for one',
    note: 'Every second count splits into two quick, equal steps.',
    pattern: 'x.xxx.xxx.xxx.xx',
  },
  {
    // [U] places traspié in the first half of the cycle, "from 1 through 4 to
    // 5", and calls it "a syncopated displacement", not double time.
    id: 'milonga-traspie-syncopated',
    name: 'Traspié C: 1-4-5',
    note: 'The first half of the habanera on its own: 1, the late short note, then beat 2. A syncopation rather than a doubling.',
    pattern: 'x..xx...x..xx...',
  },
  {
    // [T] bordoneos, "arpeggio pattern with a 3-3-2 grouping". A guitar
    // accompaniment figure; no dance source gives it as a step pattern.
    id: 'milonga-332',
    name: '3-3-2',
    note: 'Three, three and two sixteenths, the way the guitar often accompanies a milonga.',
    pattern: 'x..x..x.x..x..x.',
  },
  {
    id: 'blank',
    name: 'Blank',
    note: 'An empty grid. Tap the bars to build your own.',
    pattern: '................',
  },
];

/**
 * Metric weight of each slot: beat 1 is the strong one, beat 2 lighter.
 * @param {number} i slot index, 0-15
 * @returns {'strong' | 'medium' | 'weak'}
 */
export function slotStrength(i) {
  if (i % SLOTS_PER_COMPAS === 0) return 'strong';
  return i % SLOTS_PER_BEAT === 0 ? 'medium' : 'weak';
}

/**
 * Count label under each slot: "1" and "2" on the beats, "y" on the half
 * beats, and a dot on the sixteenths in between.
 * @param {number} i slot index, 0-15
 */
export function slotLabel(i) {
  const inCompas = i % SLOTS_PER_COMPAS;
  if (inCompas % SLOTS_PER_BEAT === 0) return String(inCompas / SLOTS_PER_BEAT + 1);
  return inCompas % 2 === 0 ? 'y' : '·';
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
      'The measure. Milonga is in 2/4: two beats, the first stronger. This grid is two compases long, with four slots to each beat.',
  },
  {
    term: 'Milonga lisa',
    spanish: 'A tiempo',
    definition:
      'Smooth milonga: stepping on the beat without doubling, on beat 1 only or on both beats.',
  },
  {
    term: 'Contratiempo',
    spanish: 'Double beat',
    definition: 'Stepping on the half beats as well: 1, y, 2, y.',
  },
  {
    term: 'Habanera',
    definition:
      'The dotted rhythm underneath milonga: two accented beats with a short note squeezed in just before the second.',
  },
  {
    term: 'Traspié',
    definition:
      'Quick extra steps inside the beat: quick-quick-slow, two steps for one, or a syncopated shift.',
  },
];
