import { expect, test } from '@playwright/test';

test.describe('web portfolio page', () => {
  test('renders hero, all 13 project cards, and optimized images', async ({ page, request }) => {
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

    // Filter bar
    await expect(page.getByRole('tablist', { name: /Filter projects by category/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /^All\b/ })).toHaveAttribute('aria-selected', 'true');

    // Project cards: we ship 13, with the filter chip count attesting.
    const cards = page.locator('[data-project-card]');
    expect(await cards.count()).toBe(13);
    const allChip = page.getByRole('tab', { name: /^All\b/ });
    await expect(allChip.locator('[data-filter-count-badge]')).toHaveText('13');

    // Every project image must have a srcset (astro:assets generates one)
    const firstImg = page.locator('img[alt*="screenshot"]').first();
    const src = await firstImg.getAttribute('src');
    const srcset = await firstImg.getAttribute('srcset');
    expect(src, 'project image src').toBeTruthy();
    expect(srcset, 'project image srcset').toBeTruthy();
    expect(srcset!).toContain('webp');

    // The first image src must actually load (no 404 from hashed _astro/ path)
    const response = await request.get(src!);
    expect(response.status(), src!).toBe(200);

    // Featured ring: at least one card has the ring-* class.
    const featuredCount = await page.locator('[data-project-card][class*="ring-1"]').count();
    expect(featuredCount).toBeGreaterThan(0);
  });

  test('filter chips narrow the visible cards and persist in URL hash', async ({ page }) => {
    await page.goto('/web-porto/');
    const cards = page.locator('[data-project-card]:not([hidden])');

    // Default: all 13 visible
    await expect(cards).toHaveCount(13);

    // Click "Education" — only education projects (3) should remain
    await page.getByRole('tab', { name: /^Education\b/ }).click();
    await expect(cards).toHaveCount(3);
    await expect(page.getByRole('tab', { name: /^Education\b/ })).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/#filter=education$/);

    // Click "Commerce" — 5 projects
    await page.getByRole('tab', { name: /^Commerce\b/ }).click();
    await expect(cards).toHaveCount(5);

    // Click "Energy" — 3 projects
    await page.getByRole('tab', { name: /^Energy\b/ }).click();
    await expect(cards).toHaveCount(3);

    // Click "Other" — 2 projects
    await page.getByRole('tab', { name: /^Other\b/ }).click();
    await expect(cards).toHaveCount(2);

    // Back to "All" — 13
    await page.getByRole('tab', { name: /^All\b/ }).click();
    await expect(cards).toHaveCount(13);
    await expect(page).toHaveURL(/^[^#]*$/);
  });

  test('filter survives a page reload via URL hash', async ({ page }) => {
    await page.goto('/web-porto/#filter=energy');
    const cards = page.locator('[data-project-card]:not([hidden])');
    await expect(cards).toHaveCount(3);
    await expect(page.getByRole('tab', { name: /^Energy\b/ })).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a card opens the lightbox with full details', async ({ page }) => {
    await page.goto('/web-porto/');
    const dialog = page.locator('#web-porto-lightbox');

    // Lightbox is closed initially
    await expect(dialog).not.toBeVisible();

    // Open the first card's details
    const firstCard = page.locator('[data-project-card]').first();
    const expectedName = await firstCard.getAttribute('data-project-name');
    await firstCard.click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: expectedName! })).toBeVisible();
    await expect(dialog.locator('[data-lightbox-visit]')).toHaveAttribute('target', '_blank');

    // The "Visit live site" link points to the project's external URL
    const expectedHref = await firstCard.getAttribute('data-project-href');
    await expect(dialog.locator('[data-lightbox-visit]')).toHaveAttribute('href', expectedHref!);

    // Stack pills (if any) are present
    const stackCount = await dialog.locator('[data-lightbox-stack] li').count();
    expect(stackCount).toBeGreaterThan(0);

    // Close via the close button
    await dialog.locator('[data-lightbox-close]').first().click();
    await expect(dialog).not.toBeVisible();
  });

  test('lightbox closes on ESC and on backdrop click', async ({ page }) => {
    await page.goto('/web-porto/');
    const dialog = page.locator('#web-porto-lightbox');

    await page.locator('[data-project-card]').first().click();
    await expect(dialog).toBeVisible();

    // ESC closes
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Re-open and click on the backdrop (the dialog element itself,
    // not its inner content)
    await page.locator('[data-project-card]').first().click();
    await expect(dialog).toBeVisible();
    // Click at the very top-left corner of the dialog, which is the
    // backdrop region (the inner content is centred, so corners are
    // the dialog padding/backdrop).
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click(box!.x + 5, box!.y + 5);
    await expect(dialog).not.toBeVisible();
  });

  test('lightbox is keyboard accessible: Enter on focused card opens it', async ({ page }) => {
    await page.goto('/web-porto/');
    const firstCard = page.locator('[data-project-card]').first();
    await firstCard.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#web-porto-lightbox')).toBeVisible();
  });

  test('navigates back to home from web-porto', async ({ page }) => {
    await page.goto('/web-porto/');
    await page.getByRole('link', { name: /Farros logo/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: /Building fast web products/i })).toBeVisible();
  });
});
