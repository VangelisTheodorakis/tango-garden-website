import { describe, it, expect } from 'vitest';
import { exercises, SLOTS, slotStrength, slotLabel } from '../../src/data/rhythmExercises.js';

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
