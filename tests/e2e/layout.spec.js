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

/**
 * The hero has two layouts, switching at 750px to match the live storefront:
 * below it the image sits at its natural ratio with the green box stacked
 * underneath; above it the box overlays the image. All figures below were
 * measured off tangogarden.de.
 */
test('the hero overlays the image on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const hero = await page.locator('.hero').boundingBox();
  const img = await page.locator('.hero-bg').boundingBox();
  const box = await page.locator('.hero-box').boundingBox();

  expect(Math.round(hero.width)).toBe(1280);
  expect(hero.height / hero.width).toBeCloseTo(928 / 1800, 2);

  // Overlaid, not stacked, and anchored near the bottom of the image.
  expect(box.y).toBeLessThan(img.y + img.height);
  expect(Math.round(img.y + img.height - (box.y + box.height))).toBeCloseTo(160, -1);
});

test('the hero stacks below the image on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const img = await page.locator('.hero-bg').boundingBox();
  const box = await page.locator('.hero-box').boundingBox();

  // Full photo at its natural ratio — no cropping, no forced viewport height.
  expect(Math.round(img.width)).toBe(375);
  expect(Math.round(img.height)).toBe(193);

  // Green box full-bleed directly underneath, square-cornered.
  expect(Math.round(box.width)).toBe(375);
  expect(Math.round(box.y)).toBeGreaterThanOrEqual(Math.round(img.y + img.height) - 1);
  await expect(page.locator('.hero-box')).toHaveCSS('border-radius', '0px');
});

test('the hero box never gets clipped at any width', async ({ page }) => {
  // At 800px the box used to overflow the fixed-ratio hero and lose text.
  for (const width of [750, 769, 800, 850, 900, 1000, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const hero = await page.locator('.hero').boundingBox();
    const box = await page.locator('.hero-box').boundingBox();
    expect(
      box.y + box.height,
      `hero box clipped at ${width}px`
    ).toBeLessThanOrEqual(hero.y + hero.height + 1);
  }
});
