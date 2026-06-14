import { expect, test } from '@playwright/test';

test.describe('premium portfolio', () => {
  test('renders homepage, logo, sections, and assets', async ({ page, request }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Farros logo/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Building fast web products/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Production websites/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Full-stack builder/i })).toBeVisible();

    // Static assets that should always 200
    for (const asset of ['/logo.png', '/favicon.ico', '/favicon.png', '/CV_Farros_2026.pdf']) {
      const response = await request.get(asset);
      expect(response.status(), asset).toBe(200);
    }

    // At least one rendered project screenshot must load. astro:assets
    // emits hashed _astro/...webp paths at build time, so we scrape the
    // first one from the page and verify it returns 200.
    const projectSrc = await page.locator('img[alt*="screenshot"]').first().getAttribute('src');
    expect(projectSrc, 'project screenshot src').toBeTruthy();
    const projectResponse = await request.get(projectSrc!);
    expect(projectResponse.status(), projectSrc!).toBe(200);
  });

  test('defaults to system theme and supports light/dark override', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/');

    await expect.poll(() => page.locator('html').evaluate((node) => node.dataset.themeMode)).toBe('system');
    await expect.poll(() => page.locator('html').evaluate((node) => node.classList.contains('dark'))).toBe(true);

    const isMobile = page.viewportSize()?.width! < 768;
    if (isMobile) {
      await page.getByRole('button', { name: /open navigation/i }).click();
    }
    await page.getByRole('button', { name: /choose theme/i }).and(page.locator(':visible')).click();
    const lightButton = page.getByRole('button', { name: 'Light' }).and(page.locator(':visible'));
    await expect(lightButton).toBeVisible();
    await lightButton.click();
    await expect.poll(() => page.locator('html').evaluate((node) => node.dataset.themeMode)).toBe('light');
    await expect.poll(() => page.locator('html').evaluate((node) => node.classList.contains('dark'))).toBe(false);

    await page.getByRole('button', { name: /choose theme/i }).and(page.locator(':visible')).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'System' }).and(page.locator(':visible')).click();
    await expect.poll(() => page.locator('html').evaluate((node) => node.dataset.themeMode)).toBe('system');
    await expect.poll(() => page.locator('html').evaluate((node) => node.classList.contains('dark'))).toBe(true);

    await context.close();
  });

  test('opens search palette and finds projects and CV', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      await page.getByRole('button', { name: /open navigation/i }).click();
    }
    await page.getByRole('button', { name: /search/i }).first().click();
    const dialog = page.getByRole('dialog', { name: /search farros/i });
    await expect(dialog).toBeVisible();

    await page.locator('[data-search-input]').fill('Zenix');
    // Multiple search items reference Zenix (the Astro theme + the
    // custom project), so we assert at least one Zenix link is visible
    // rather than demanding a single match.
    await expect(
      dialog.getByRole('link', { name: /Zenix/i }).first()
    ).toBeVisible();

    await page.locator('[data-search-input]').fill('KIW');
    await expect(dialog.getByRole('link', { name: /KIW Commerce/i })).toBeVisible();

    await page.locator('[data-search-input]').fill('CV');
    await expect(dialog.getByRole('link', { name: /View CV/i })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('renders CV page', async ({ page }) => {
    await page.goto('/cv');

    await expect(page.getByRole('heading', { name: /Mochammad Farros/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Professional record/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Selected credentials/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Download PDF/i })).toBeVisible();
  });

  test('mobile navigation opens and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile navigation is only visible on the mobile project');

    await page.goto('/');
    const menuButton = page.getByRole('button', { name: /open navigation/i });

    await menuButton.click();
    // The first nav item is "Web Porto" (per navItems in profile.ts).
    // We assert the mobile drawer nav is now visible and contains at
    // least one of the known nav labels. All three labels match, so
    // we use .first() to avoid strict-mode violations.
    await expect(
      page.locator('[data-mobile-menu]').getByRole('link', { name: /Web Porto|Writing|CV/i }).first()
    ).toBeVisible();

    await page.locator('[data-mobile-menu]').getByRole('link', { name: 'Web Porto', exact: true }).click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile layout has no horizontal overflow', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only layout check');

    await page.goto('/cv');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
