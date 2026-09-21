import { expect, test } from '@playwright/test';

test.describe('writing page', () => {
  test('renders heading, cards, and archive CTA', async ({ page }) => {
    await page.goto('/writing');

    await expect(
      page.getByRole('heading', { name: /Notes on security/i })
    ).toBeVisible();

    // The blog link appears in the lede
    await expect(
      page.getByRole('link', { name: /blog\.farrosfr\.com/i }).first()
    ).toBeVisible();

    // Archive CTA button
    await expect(
      page.getByRole('link', { name: /Open blog archive/i })
    ).toBeVisible();

    // Cards link to blog.farrosfr.com/p/<slug>
    const cards = page.locator('a[href*="blog.farrosfr.com/p/"]');
    await expect.poll(async () => await cards.count()).toBeGreaterThanOrEqual(24);
  });

  test('uses BaseLayout shell (header, footer, title)', async ({ page }) => {
    await page.goto('/writing');

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await expect(page).toHaveTitle(/Writing/i);

    await expect(
      page.locator('header a[href="/writing"], [data-mobile-menu] a[href="/writing"]')
    ).toHaveCount(2);
  });

  test('strips platform brand names and trigger words from post text', async ({ page }) => {
    await page.goto('/writing');

    const bodyText = (await page.locator('main').innerText()).toLowerCase();

    for (const banned of [
      'tryhackme', 'try hack me', 'htb', 'hackerrank', 'hacker rank',
      'cyber skyline', 'cyberskyline', 'security blue team', 'hackviser',
    ]) {
      expect(bodyText, `banned term "${banned}" appeared in page text`).not.toContain(banned);
    }

    for (const banned of ['write-up', 'writeup', 'walkthrough']) {
      expect(bodyText, `trigger word "${banned}" appeared in page text`).not.toContain(banned);
    }
  });

  test('topic filter chips, year pills, instant search, and load more work', async ({ page }) => {
    await page.goto('/writing');

    const visibleCards = page.locator('[data-blog-card]:visible');

    // Default batch size: 24 visible cards
    await expect(visibleCards).toHaveCount(24);

    // Click "Cybersecurity" topic tab
    await page.getByRole('tab', { name: /^Cybersecurity\b/ }).click();
    expect(await visibleCards.count()).toBeGreaterThan(0);
    expect(await visibleCards.count()).toBeLessThanOrEqual(24);

    // Click "All" tab to reset
    await page.getByRole('tab', { name: /^All\b/ }).click();
    await expect(visibleCards).toHaveCount(24);

    // Search for a keyword
    const searchInput = page.locator('[data-blog-search]');
    await searchInput.fill('Firefox');
    expect(await visibleCards.count()).toBeGreaterThanOrEqual(1);

    // Clear search
    await searchInput.fill('');
    await expect(visibleCards).toHaveCount(24);

    // Test Load More button
    const loadMore = page.locator('[data-load-more]');
    await expect(loadMore).toBeVisible();
    await loadMore.click();
    // After load more, count should now be 48
    await expect(visibleCards).toHaveCount(48);
  });
});
