import { expect, test } from '@playwright/test';

test.describe('mobile drawer', () => {
  test.skip(({ isMobile }) => !isMobile, 'drawer only exists below 750px');

  test('opens, moves focus in, and closes with focus restored', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('.nav-toggle');
    const drawer = page.locator('#nav-drawer');
    const close = page.locator('.nav-drawer-close');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('inert', '');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).not.toHaveAttribute('inert', '');
    await expect(close).toBeFocused();

    await close.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('inert', '');
    // Focus must come back to the toggle, or the next Tab restarts from the
    // top of the document.
    await expect(toggle).toBeFocused();
  });

  test('closes on Escape', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-toggle').click();
    await expect(page.locator('#nav-drawer')).toHaveClass(/is-open/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#nav-drawer')).not.toHaveClass(/is-open/);
  });

  test('keeps the page behind it out of the tab order', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-toggle').click();

    await expect(page.locator('#main-content')).toHaveAttribute('inert', '');
    await expect(page.locator('.site-footer')).toHaveAttribute('inert', '');

    await expect(page.locator('.nav-logo')).toHaveAttribute('inert', '');

    // Tabbing must never reach content hidden behind the overlay. The drawer,
    // the toggle and the skip link are all still legitimately reachable.
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return 'body';
        if (el.closest('#nav-drawer')) return 'drawer';
        if (el.classList.contains('nav-toggle')) return 'toggle';
        if (el.classList.contains('skip-link')) return 'skip-link';
        if (el.closest('#main-content')) return 'BEHIND: main';
        if (el.closest('.site-footer')) return 'BEHIND: footer';
        if (el.closest('.nav-container')) return 'BEHIND: header';
        return `BEHIND: ${el.tagName.toLowerCase()}`;
      });
      expect(where, `Tab #${i + 1} landed on obscured content`).not.toContain('BEHIND');
    }
  });

  test('links to every top-level destination', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-toggle').click();
    await expect(page.locator('#nav-drawer a')).toHaveCount(12);
  });
});

test.describe('skip link', () => {
  test('is the first thing focused and jumps to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });
});

test.describe('desktop nav', () => {
  test.skip(({ isMobile }) => isMobile, 'dropdowns are desktop-only');

  test('reveals the dropdown on keyboard focus', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('.nav-item-has-dropdown').first().locator('.nav-dropdown');

    await expect(dropdown).toBeHidden();
    await page.locator('.nav-link').first().focus();
    await expect(dropdown).toBeVisible();
  });

  test('marks the current page', async ({ page }) => {
    await page.goto('/pages/contact');
    await expect(page.locator('.nav-link[aria-current="page"]')).toHaveText(/Connect with us/);
  });
});
