import { expect, test } from '@playwright/test';

/**
 * Click-to-load map. Google Maps must not be contacted until the visitor opts
 * in — loading it on page render would send their IP to Google without consent
 * (a GDPR / Abmahnung risk in Germany), the reason the placeholder exists.
 */
test.describe('contact map', () => {
  test('makes no request to Google on page load', async ({ page }) => {
    const googleHits = [];
    page.on('request', (r) => {
      if (/google|gstatic/.test(new URL(r.url()).hostname)) googleHits.push(r.url());
    });

    await page.goto('/pages/contact');
    await page.waitForTimeout(800);

    expect(googleHits, 'contacted Google before consent').toEqual([]);
    await expect(page.locator('.contact-map-consent')).toBeVisible();
    await expect(page.locator('.contact-map iframe')).toHaveCount(0);
  });

  test('explains why the map is gated', async ({ page }) => {
    await page.goto('/pages/contact');
    // The copy must give the privacy reason, not just a bare "load" button.
    await expect(page.locator('.contact-map-consent')).toContainText(/privacy/i);
    await expect(page.locator('.contact-map-consent')).toContainText(/Google/);
  });

  test('loads the map only after the visitor clicks', async ({ page }) => {
    const googleHits = [];
    page.on('request', (r) => {
      if (/google/.test(new URL(r.url()).hostname)) googleHits.push(r.url());
    });

    await page.goto('/pages/contact');
    await page.locator('.contact-map-consent-btn').click();

    const iframe = page.locator('.contact-map iframe');
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute('src', /maps\.google\.com/);
    await expect(page.locator('.contact-map-consent')).toHaveCount(0);
    expect(googleHits.length, 'map did not load after consent').toBeGreaterThan(0);
  });
});
