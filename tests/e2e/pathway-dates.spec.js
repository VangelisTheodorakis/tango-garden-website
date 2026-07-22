import { expect, test } from '@playwright/test';

/**
 * The pathway cards read their dates from JSON at runtime and compare against
 * the browser clock, so the assertions below pin the clock and stub the feed
 * rather than depending on whatever is in public/assets/data today.
 */

const feed = (events, extra = {}) =>
  JSON.stringify({ label: 'Next Practica', emptyMessage: 'New dates coming soon (TBA)', events, ...extra });

async function stubFeeds(page, body) {
  await page.route('**/assets/data/*.json', (route) =>
    route.fulfill({ contentType: 'application/json', body })
  );
}

test('shows the soonest upcoming date and skips past ones', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-07-22T09:00:00'));
  await stubFeeds(
    page,
    feed([
      { date: '2026-07-08', time: '19:30 – 22:00' }, // already past
      { date: '2026-08-05', time: '19:30 – 22:00' },
      { date: '2026-07-29', time: '19:30 – 22:00' }, // soonest upcoming
    ])
  );

  await page.goto('/');
  await expect(page.locator('#prac-date')).toContainText('Wed, 29 Jul 2026');
  await expect(page.locator('#prac-date')).toContainText('19:30 – 22:00');
});

test('includes an event happening today', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-07-29T23:00:00'));
  await stubFeeds(page, feed([{ date: '2026-07-29', time: '19:30 – 22:00' }]));

  await page.goto('/');
  await expect(page.locator('#prac-date')).toContainText('Wed, 29 Jul 2026');
});

test('falls back to the coming-soon message once everything is past', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-01T09:00:00'));
  await stubFeeds(page, feed([{ date: '2026-07-29', time: '19:30 – 22:00' }]));

  await page.goto('/');
  await expect(page.locator('#prac-date')).toHaveText('New dates coming soon (TBA)');
});

test('applies the feed prefix and label', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-07-22T09:00:00'));
  await stubFeeds(
    page,
    feed([{ date: '2026-09-15', time: '19:00 – 20:30' }], {
      label: 'Next Class',
      prefix: 'Starts ',
    })
  );

  await page.goto('/');
  await expect(page.locator('#rc-label')).toHaveText('Next Class');
  await expect(page.locator('#rc-date')).toContainText('Starts Tue, 15 Sep 2026');
});

test('keeps the static fallback text when the feed is unreachable', async ({ page }) => {
  await page.route('**/assets/data/*.json', (route) => route.abort());

  await page.goto('/');
  // Whatever it says, the card must never render empty.
  await expect(page.locator('#etg-date')).not.toBeEmpty();
  await expect(page.locator('#prac-date')).not.toBeEmpty();
});

test('renders feed content as text, never as markup', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-07-22T09:00:00'));
  await stubFeeds(
    page,
    feed([], { emptyMessage: '<img src=x onerror="window.__xss=1">' })
  );

  await page.goto('/');
  await expect(page.locator('#prac-date')).toContainText('<img src=x');
  expect(await page.evaluate(() => '__xss' in window)).toBe(false);
  expect(await page.locator('#prac-date img').count()).toBe(0);
});
