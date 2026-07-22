import { expect, test } from '@playwright/test';

const MULTI_VARIANT = '/products/the-sprouting-sessions-beginners-level-4-classes-pass-general-admission';
const SINGLE_VARIANT = '/products/the-sprouting-sessions-beginner-level-full-course-pass-general-admission';

/** Captures the URL the buy buttons try to open, without leaving the page. */
async function captureCheckoutUrl(page, click) {
  await page.evaluate(() => {
    window.__opened = [];
    window.open = (url) => {
      window.__opened.push(url);
      return null;
    };
  });
  await click();
  return page.evaluate(() => window.__opened[0]);
}

test.describe('product checkout', () => {
  test('builds a Shopify permalink from the chosen variant and quantity', async ({ page }) => {
    await page.goto(MULTI_VARIANT);

    await page.selectOption('#pdp-var', { index: 2 });
    await page.locator('.pdp-qty-up').click();
    await page.locator('.pdp-qty-up').click();

    const variantId = await page.locator('#pdp-var').inputValue();
    const url = await captureCheckoutUrl(page, () => page.locator('.pdp-btn-buy').click());

    expect(url).toBe(`https://tangogarden.myshopify.com/cart/${variantId}:3`);
  });

  test('checks out against the Shopify domain, not this site', async ({ page }) => {
    // tangogarden.de now serves this static site, where /cart/... is a 404.
    await page.goto(SINGLE_VARIANT);
    const url = await captureCheckoutUrl(page, () => page.locator('.pdp-btn-add').click());

    expect(url).toContain('tangogarden.myshopify.com/cart/');
    expect(url).not.toContain('tangogarden.de/cart');
  });

  test('never sends a quantity below 1', async ({ page }) => {
    await page.goto(SINGLE_VARIANT);

    for (let i = 0; i < 5; i++) await page.locator('.pdp-qty-down').click();
    await expect(page.locator('#pdp-qty')).toHaveValue('1');

    const url = await captureCheckoutUrl(page, () => page.locator('.pdp-btn-buy').click());
    expect(url).toMatch(/:1$/);
  });

  test('renders the variant control the live store renders', async ({ page }) => {
    // The pages mirror the live Shopify product template, so a single-variant
    // product keeps its one-option select rather than hiding it.
    await page.goto(SINGLE_VARIANT);
    await expect(page.locator('select#pdp-var')).toHaveCount(1);
    await expect(page.locator('#pdp-var option')).toHaveCount(1);
  });

  test('lists every variant when there is a choice', async ({ page }) => {
    await page.goto(MULTI_VARIANT);
    const options = page.locator('#pdp-var option');
    await expect(options).toHaveCount(6);
    await expect(options.first()).toHaveText(/Pass #1/);
  });

  test('carries no back link or badge above the title', async ({ page }) => {
    await page.goto('/products/enter-the-garden-introductory-session-student-and-under-28-admission');
    await expect(page.locator('.back-link')).toHaveCount(0);
    await expect(page.locator('.product-badge')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
  });
});

test.describe('FAQ accordions', () => {
  test('contact page answers open and close', async ({ page }) => {
    // These were unreachable after the migration: the handler shared a <script>
    // tag with the nav drawer code and was dropped with it.
    await page.goto('/pages/contact');

    const first = page.locator('.faq-question').first();
    const answer = page.locator('.faq-item').first().locator('.faq-answer');

    await expect(answer).toBeHidden();
    await first.click();
    await expect(answer).toBeVisible();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await first.click();
    await expect(answer).toBeHidden();
  });

  test('contact page shows one answer at a time', async ({ page }) => {
    await page.goto('/pages/contact');
    await page.locator('.faq-question').nth(0).click();
    await page.locator('.faq-question').nth(1).click();
    await expect(page.locator('.faq-item.is-open')).toHaveCount(1);
  });

  test('start-here answers are not focusable while collapsed', async ({ page }) => {
    // max-height:0 hid them visually but left their links in the tab order.
    await page.goto('/pages/start-here');

    const collapsedLinks = page.locator('.start-here-faq-answer[hidden] a');
    const count = await collapsedLinks.count();
    for (let i = 0; i < count; i++) {
      await expect(collapsedLinks.nth(i)).toBeHidden();
    }

    const btn = page.locator('.start-here-faq-btn').first();
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.start-here-faq-answer').first()).toBeVisible();
  });
});
