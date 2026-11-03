import { expect, test } from '@playwright/test';

/**
 * Course pages send read_<section> once each part scrolls into view; the
 * Gardeners' Area turns them into "How far people read". GA4 never loads in
 * tests, so a stub gtag records the events instead.
 */
test('a course page reports each section once as it is read', async ({ page }) => {
  await page.addInitScript(() => {
    window.__events = [];
    window.gtag = (cmd, name, params) => {
      if (cmd === 'event') window.__events.push(`${name}:${params?.course}`);
    };
  });
  await page.goto('/de/pages/beginner-course');
  expect(await page.evaluate(() => window.__events)).toEqual([]);

  for (const key of ['expect', 'prices', 'faq', 'end']) {
    await page.locator(`[data-read="${key}"]`).scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => window.__events)).toContain(`read_${key}:beginner-course`);
  }

  // Scrolling back up and down again doesn't count twice.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('[data-read="end"]').scrollIntoViewIfNeeded();
  const events = await page.evaluate(() => window.__events.filter((e) => e.startsWith('read_')));
  expect(events.filter((e) => e === 'read_end:beginner-course')).toHaveLength(1);
});
