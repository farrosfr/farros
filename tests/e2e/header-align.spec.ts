import { expect, test } from '@playwright/test';

test.describe('Header Main Content Container Alignment', () => {
  test('header menu aligns perfectly with main content container on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const headerContainer = page.locator('[data-header-container]');
    const heroSection = page.locator('main section').first();

    await expect(headerContainer).toBeVisible();
    await expect(heroSection).toBeVisible();

    const headerBox = await headerContainer.boundingBox();
    const heroBox = await heroSection.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(heroBox).not.toBeNull();

    // Verify left and right alignment match the main content container
    console.log('Top state - Header left:', headerBox!.x, 'width:', headerBox!.width, 'right:', headerBox!.x + headerBox!.width);
    console.log('Top state - Hero left:', heroBox!.x, 'width:', heroBox!.width, 'right:', heroBox!.x + heroBox!.width);

    expect(Math.abs(headerBox!.x - heroBox!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(headerBox!.width - heroBox!.width)).toBeLessThanOrEqual(1);

    // Save proof screenshot at top
    await page.screenshot({
      path: 'C:/Users/LENOVO/.gemini/antigravity/brain/a94097ba-1ec7-49c7-ac8e-b946fe56e2fc/header-aligned-top.png',
    });

    // Scroll down 100px: header transitions to card, width must remain aligned with content
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForFunction(() => document.querySelector('[data-header-container]')?.getAttribute('data-scrolled') === 'true');

    const scrolledHeaderBox = await headerContainer.boundingBox();
    expect(scrolledHeaderBox).not.toBeNull();

    console.log('Scrolled state - Header left:', scrolledHeaderBox!.x, 'width:', scrolledHeaderBox!.width, 'right:', scrolledHeaderBox!.x + scrolledHeaderBox!.width);

    expect(Math.abs(scrolledHeaderBox!.x - heroBox!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(scrolledHeaderBox!.width - heroBox!.width)).toBeLessThanOrEqual(1);

    // Save proof screenshot when scrolled
    await page.screenshot({
      path: 'C:/Users/LENOVO/.gemini/antigravity/brain/a94097ba-1ec7-49c7-ac8e-b946fe56e2fc/header-aligned-scrolled.png',
    });

    // Scroll down to 500px: header auto-hides
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForFunction(() => document.querySelector('[data-header]')?.getAttribute('data-header-hidden') === 'true');

    // Scroll up to 350px: header reveals
    await page.evaluate(() => window.scrollTo(0, 350));
    await page.waitForFunction(() => document.querySelector('[data-header]')?.getAttribute('data-header-hidden') === 'false');
  });
});
