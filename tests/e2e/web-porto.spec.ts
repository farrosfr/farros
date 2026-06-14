import { expect, test } from '@playwright/test';

test.describe('web portfolio page', () => {
  test('renders hero, full project list, and hashed webp images', async ({ page, request }) => {
    await page.goto('/web-porto/');

    // Hero copy — the eyebrow is a <p> inside <main>. The header nav
    // also contains a "Web Portfolio" link (hidden in mobile drawer),
    // so we scope to main to avoid the hidden drawer entry.
    await expect(
      page.locator('main p').filter({ hasText: /^Web portfolio$/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Production websites and public web systems/i })
    ).toBeVisible();

    // Project cards: should have at least 10 (we ship 13)
    const cards = page.locator('a[href^="https://"]').filter({ has: page.locator('img[alt*="screenshot"]') });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Every project image must have a srcset (astro:assets generates one)
    const firstImg = page.locator('img[alt*="screenshot"]').first();
    const src = await firstImg.getAttribute('src');
    const srcset = await firstImg.getAttribute('srcset');
    expect(src, 'project image src').toBeTruthy();
    expect(srcset, 'project image srcset').toBeTruthy();
    expect(srcset!).toContain('webp');

    // At least one card has the featured ring. The ring-* class lives
    // ON the <a> itself, so we match it via attribute selector rather
    // than :has() (which only looks at descendants).
    const featured = page.locator('a[href^="https://"][class*="ring"]');
    expect(await featured.count()).toBeGreaterThan(0);

    // The first image src must actually load (no 404 from hashed _astro/ path)
    const response = await request.get(src!);
    expect(response.status(), src!).toBe(200);
  });

  test('navigates back to home from web-porto', async ({ page }) => {
    await page.goto('/web-porto/');
    await page.getByRole('link', { name: /Farros logo/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: /Building fast web products/i })).toBeVisible();
  });
});
