import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products.js';
import { giftCards, waLink } from '../../src/data/giftCards.js';

/** "€10,00 EUR" -> 10 */
const priceOf = (handle) => {
  const p = products.find((x) => x.handle === handle);
  return Number(p.price.match(/€(\d+)/)[1]);
};

const practica = {
  regular: priceOf('the-garden-practica-1-practica-pass-general-admission'),
  reduced: priceOf('the-garden-practica-1-practica-pass-door-only-student-and-under-28-admission'),
};
const classPass = {
  regular: priceOf('the-sprouting-sessions-beginners-level-4-classes-pass-general-admission'),
  reduced: priceOf('the-sprouting-sessions-beginner-level-4-classes-pass-student-and-under-28-admission'),
};

describe('gift cards', () => {
  it('uses unique, URL-safe slugs', () => {
    const slugs = giftCards.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it.each(giftCards.filter((g) => g.kind === 'practica'))('$slug costs the same as its practicas', (g) => {
    expect(g.price).toBe(g.visits * practica.regular);
    expect(g.reduced).toBe(g.visits * practica.reduced);
  });

  it('class pass costs the same as the 4-Class Pass', () => {
    const g = giftCards.find((x) => x.slug === 'class-pass');
    expect(g.price).toBe(classPass.regular);
    expect(g.reduced).toBe(classPass.reduced);
  });

  it.each(giftCards)('$slug has every word in both languages', (g) => {
    for (const lang of ['en', 'de']) {
      for (const key of ['title', 'subtitle', 'name', 'forWhom', 'buyMessage', 'startMessage']) {
        expect(g[lang][key], `${lang}.${key}`).toBeTruthy();
      }
      expect(g[lang].includes.length).toBeGreaterThan(0);
    }
  });

  it('builds WhatsApp links with an encoded message', () => {
    expect(waLink("Hi! I'd like it")).toBe("https://wa.me/491602368723?text=Hi!%20I'd%20like%20it");
  });
});
