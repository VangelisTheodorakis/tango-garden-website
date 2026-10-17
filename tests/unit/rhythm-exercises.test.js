import { describe, it, expect } from 'vitest';
import {
  exercises,
  glossary,
  SLOTS,
  slotStrength,
  slotLabel,
} from '../../src/data/rhythmExercises.js';

describe('rhythm exercises', () => {
  it('gives every exercise a pattern of exactly SLOTS on/off characters', () => {
    for (const e of exercises) {
      expect(e.pattern, e.id).toHaveLength(SLOTS);
      expect(e.pattern, e.id).toMatch(/^[x.]+$/);
    }
  });

  it('has unique ids and names', () => {
    expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
    expect(new Set(exercises.map((e) => e.name)).size).toBe(exercises.length);
  });

  it('keeps the exercise the page loads first', () => {
    expect(exercises.some((e) => e.id === 'marcato-2')).toBe(true);
  });

  it('marks the strong beats 1, 3, 5 and 7, and the "&"s as weak', () => {
    expect([0, 4, 8, 12].map(slotStrength)).toEqual(['strong', 'strong', 'strong', 'strong']);
    expect([2, 6, 10, 14].map(slotStrength)).toEqual(['medium', 'medium', 'medium', 'medium']);
    expect([1, 3, 5, 7, 9, 11, 13, 15].every((i) => slotStrength(i) === 'weak')).toBe(true);
  });

  it('counts 1 & 2 & … 8 &', () => {
    expect(Array.from({ length: SLOTS }, (_, i) => slotLabel(i)).join(' ')).toBe(
      '1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 &'
    );
  });
});

describe('rhythm glossary', () => {
  it('gives every term a non-empty definition', () => {
    for (const g of glossary) {
      expect(g.term.trim(), JSON.stringify(g)).not.toBe('');
      expect(g.definition.trim(), g.term).not.toBe('');
    }
  });

  it('has unique terms', () => {
    expect(new Set(glossary.map((g) => g.term)).size).toBe(glossary.length);
  });
});

describe('vals exercises', () => {
  it('gives every exercise a pattern of exactly SLOTS on/off characters', async () => {
    const { exercises, SLOTS } = await import('../../src/data/rhythmExercises.vals.js');
    expect(SLOTS).toBe(6);
    for (const e of exercises) {
      expect(e.pattern, e.id).toHaveLength(SLOTS);
      expect(e.pattern, e.id).toMatch(/^[x.]+$/);
    }
  });

  it('has unique ids and names, and the default exercise exists', async () => {
    const { exercises, DEFAULT_EXERCISE } = await import('../../src/data/rhythmExercises.vals.js');
    expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
    expect(new Set(exercises.map((e) => e.name)).size).toBe(exercises.length);
    expect(exercises.some((e) => e.id === DEFAULT_EXERCISE)).toBe(true);
  });

  it('puts the strong beat on the 1 of each compás and counts 1 2 3 twice', async () => {
    const { slotStrength, slotLabel, SLOTS } = await import(
      '../../src/data/rhythmExercises.vals.js'
    );
    expect([0, 3].map(slotStrength)).toEqual(['strong', 'strong']);
    expect([1, 2, 4, 5].every((i) => slotStrength(i) === 'medium')).toBe(true);
    expect(Array.from({ length: SLOTS }, (_, i) => slotLabel(i)).join(' ')).toBe('1 2 3 1 2 3');
  });

  it('keeps the tempo slider range sane around its default', async () => {
    const { tempo } = await import('../../src/data/rhythmExercises.vals.js');
    expect(tempo.min).toBeLessThan(tempo.value);
    expect(tempo.value).toBeLessThan(tempo.max);
  });

  it('has a non-empty definition for every glossary term', async () => {
    const { glossary } = await import('../../src/data/rhythmExercises.vals.js');
    expect(new Set(glossary.map((g) => g.term)).size).toBe(glossary.length);
    for (const g of glossary) expect(g.definition.trim(), g.term).not.toBe('');
  });

  it('translates every exercise note and glossary definition into German', async () => {
    const { exercises, glossary } = await import('../../src/data/rhythmExercises.vals.js');
    const { exercisesValsDe, glossaryValsDe, localizeExercises, localizeGlossary } = await import(
      '../../src/data/rhythmExercises.de.js'
    );
    expect(Object.keys(exercisesValsDe).sort()).toEqual(exercises.map((e) => e.id).sort());
    expect(Object.keys(glossaryValsDe).sort()).toEqual(glossary.map((g) => g.term).sort());

    const de = localizeExercises(exercises, exercisesValsDe);
    de.forEach((e, i) => {
      expect(e.id).toBe(exercises[i].id);
      expect(e.pattern).toBe(exercises[i].pattern);
    });
    expect(new Set(de.map((e) => e.name)).size).toBe(de.length);
    expect(localizeGlossary(glossary, glossaryValsDe).map((g) => g.term)).toEqual(
      glossary.map((g) => g.term)
    );
  });
});

describe('milonga exercises', () => {
  it('gives every exercise a 16-slot pattern, unique ids and names, and a valid default', async () => {
    const { exercises, SLOTS, DEFAULT_EXERCISE } = await import(
      '../../src/data/rhythmExercises.milonga.js'
    );
    expect(SLOTS).toBe(16);
    for (const e of exercises) {
      expect(e.pattern, e.id).toHaveLength(SLOTS);
      expect(e.pattern, e.id).toMatch(/^[x.]+$/);
    }
    expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
    expect(new Set(exercises.map((e) => e.name)).size).toBe(exercises.length);
    expect(exercises.some((e) => e.id === DEFAULT_EXERCISE)).toBe(true);
  });

  it('puts the habanera on counts 1, 4, 5 and 7 of each compás', async () => {
    const { exercises } = await import('../../src/data/rhythmExercises.milonga.js');
    const habanera = exercises.find((e) => e.id === 'milonga-habanera');
    const counts = [...habanera.pattern.slice(0, 8)].flatMap((c, i) => (c === 'x' ? [i + 1] : []));
    expect(counts).toEqual([1, 4, 5, 7]);
    expect(habanera.pattern.slice(8)).toBe(habanera.pattern.slice(0, 8));
  });

  it('weights beat 1 over beat 2 and counts 1 · y · 2 · y · twice', async () => {
    const { slotStrength, slotLabel, SLOTS } = await import(
      '../../src/data/rhythmExercises.milonga.js'
    );
    expect([0, 8].map(slotStrength)).toEqual(['strong', 'strong']);
    expect([4, 12].map(slotStrength)).toEqual(['medium', 'medium']);
    expect([1, 2, 3, 5, 6, 7].every((i) => slotStrength(i) === 'weak')).toBe(true);
    expect(Array.from({ length: SLOTS }, (_, i) => slotLabel(i)).join(' ')).toBe(
      '1 · y · 2 · y · 1 · y · 2 · y ·'
    );
  });

  it('translates every exercise note and glossary definition into German', async () => {
    const { exercises, glossary, tempo } = await import('../../src/data/rhythmExercises.milonga.js');
    const { exercisesMilongaDe, glossaryMilongaDe, localizeExercises } = await import(
      '../../src/data/rhythmExercises.de.js'
    );
    expect(Object.keys(exercisesMilongaDe).sort()).toEqual(exercises.map((e) => e.id).sort());
    expect(Object.keys(glossaryMilongaDe).sort()).toEqual(glossary.map((g) => g.term).sort());
    const de = localizeExercises(exercises, exercisesMilongaDe);
    expect(new Set(de.map((e) => e.name)).size).toBe(de.length);
    expect(tempo.min).toBeLessThan(tempo.value);
    expect(tempo.value).toBeLessThan(tempo.max);
  });
});

describe('orchestra tempo buttons', () => {
  it('keeps every vals and milonga orchestra inside its slider range', async () => {
    for (const path of ['../../src/data/rhythmExercises.vals.js', '../../src/data/rhythmExercises.milonga.js']) {
      const { orchestraTempos, tempo } = await import(path);
      expect(orchestraTempos.length, path).toBeGreaterThan(0);
      expect(new Set(orchestraTempos.map((o) => o.name)).size).toBe(orchestraTempos.length);
      for (const o of orchestraTempos) {
        expect(o.bpm, o.name).toBeGreaterThanOrEqual(tempo.min);
        expect(o.bpm, o.name).toBeLessThanOrEqual(tempo.max);
      }
    }
  });
});

describe('German trainer text', () => {
  it('translates every exercise note and glossary definition', async () => {
    const { exercisesDe, glossaryDe, localizeExercises, localizeGlossary } = await import(
      '../../src/data/rhythmExercises.de.js'
    );
    const { exercises, glossary } = await import('../../src/data/rhythmExercises.js');
    expect(Object.keys(exercisesDe).sort()).toEqual(exercises.map((e) => e.id).sort());
    expect(Object.keys(glossaryDe).sort()).toEqual(glossary.map((g) => g.term).sort());

    const de = localizeExercises(exercises);
    // Patterns and ids never change with the language.
    de.forEach((e, i) => {
      expect(e.id).toBe(exercises[i].id);
      expect(e.pattern).toBe(exercises[i].pattern);
    });
    expect(new Set(de.map((e) => e.name)).size).toBe(de.length);
    expect(localizeGlossary(glossary).map((g) => g.term)).toEqual(glossary.map((g) => g.term));
  });
});
