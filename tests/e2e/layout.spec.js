import { expect, test } from '@playwright/test';

/**
 * Horizontal-overflow guard.
 *
 * The hero used `aspect-ratio` with a `min-height`. On any screen narrow enough
 * for the min-height to win, the ratio ran backwards and derived the WIDTH from
 * the height — 60vh × 1800/928 ≈ 945px on a 375px phone. The page overflowed,
 * the browser zoomed out to fit, and every section below rendered in a narrow
 * column with dead space beside it.
 *
 * Nothing in the build output shows this; it only appears once a browser lays
 * the page out at a real viewport size.
 */

const PAGES = [
  '/',
  '/pages/the-garden',
  '/pages/start-here',
  '/pages/contact',
  '/collections/all',
  '/products/the-sprouting-sessions-beginner-level-full-course-pass-general-admission',
  '/products/enter-the-garden-general-admission',
  '/pages/impressum',
  '/404',
];

// Narrowest phone still worth supporting, through to a large desktop.
const WIDTHS = [320, 375, 414, 768, 1280, 1920];

for (const path of PAGES) {
  test(`${path} never scrolls sideways`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      const { viewport, scrollWidth, offenders } = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        return {
          viewport: vw,
          scrollWidth: document.documentElement.scrollWidth,
          offenders: [...document.querySelectorAll('body *')]
            .filter((el) => el.getBoundingClientRect().width > vw + 1)
            .slice(0, 5)
            .map((el) => {
              const cls = typeof el.className === 'string' ? el.className : '';
              return `${el.tagName.toLowerCase()}${cls ? '.' + cls.split(/\s+/)[0] : ''}`;
            }),
        };
      });

      expect(offenders, `${path} at ${width}px: elements wider than the viewport`).toEqual([]);
      expect(scrollWidth, `${path} at ${width}px scrolls sideways`).toBeLessThanOrEqual(viewport + 1);
    }
  });
}

test('the hero fills the width and keeps its ratio on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const hero = await page.locator('.hero').boundingBox();
  expect(Math.round(hero.width)).toBe(1280);
  // Wide enough that the image ratio, not the min-height, sets the height.
  expect(hero.height / hero.width).toBeCloseTo(928 / 1800, 2);
});

test('the hero stays full-bleed and readable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const hero = await page.locator('.hero').boundingBox();
  expect(Math.round(hero.width)).toBe(375);
  // min-height takes over here; the image crops rather than the box widening.
  expect(hero.height).toBeGreaterThanOrEqual(812 * 0.6 - 1);

  const box = await page.locator('.hero-box').boundingBox();
  expect(box.width).toBeLessThanOrEqual(375);
});
