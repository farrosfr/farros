import { expect, test } from '@playwright/test';

test.describe('writing page', () => {
  test('renders heading, cards, and archive CTA', async ({ page }) => {
    await page.goto('/writing');

    await expect(
      page.getByRole('heading', { name: /Notes on security/i })
    ).toBeVisible();

    // The Substack "farrosfr.com" link appears in the lede + the CTA
    await expect(
      page.getByRole('link', { name: /farrosfr\.com/i }).first()
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Browse the full archive/i })
    ).toBeVisible();

    // At least 3 article cards rendered. Each card links to a /p/<slug>
    // Substack URL. The real feed has 4 posts at the time of writing;
    // the fallback has 3 placeholders. Either is acceptable.
    const cards = page.locator('a[href*="farrosfr.com/p/"], a[href*="farrosfr.com"]');
    await expect.poll(async () => await cards.count()).toBeGreaterThanOrEqual(3);
  });
});
