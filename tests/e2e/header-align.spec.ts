import { expect, test } from '@playwright/test';

test.describe('Header Responsive Multi-Stage Width and Scroll Transitions', () => {
  test('header matches footer menu width at first, contracts to main container on scroll, and auto-hides', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const headerContainer = page.locator('[data-header-container]');
    const footerContainer = page.locator('body > div.mx-auto.max-w-screen-xl');
    const heroSection = page.locator('main section').first();

    await expect(headerContainer).toBeVisible();
    await expect(footerContainer).toBeVisible();
    await expect(heroSection).toBeVisible();

    const topHeaderBox = await headerContainer.boundingBox();
    const footerBox = await footerContainer.boundingBox();
    const heroBox = await heroSection.boundingBox();

    expect(topHeaderBox).not.toBeNull();
    expect(footerBox).not.toBeNull();
    expect(heroBox).not.toBeNull();

    console.log('Top state:');
    console.log('  Header: left =', topHeaderBox!.x, 'width =', topHeaderBox!.width, 'right =', topHeaderBox!.x + topHeaderBox!.width);
    console.log('  Footer: left =', footerBox!.x, 'width =', footerBox!.width, 'right =', footerBox!.x + footerBox!.width);
    console.log('  Hero:   left =', heroBox!.x, 'width =', heroBox!.width, 'right =', heroBox!.x + heroBox!.width);

    // Initial state: Header width matches footer menu container (1280px)
    expect(Math.abs(topHeaderBox!.x - footerBox!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(topHeaderBox!.width - footerBox!.width)).toBeLessThanOrEqual(1);

    await page.screenshot({
      path: 'C:/Users/LENOVO/.gemini/antigravity/brain/a94097ba-1ec7-49c7-ac8e-b946fe56e2fc/header-aligned-top.png',
    });

    // Scroll down 100px: Header contracts smoothly to match main container bounds (1152px)
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForFunction(() => document.querySelector('[data-header-container]')?.getAttribute('data-scrolled') === 'true');
    // Wait for smooth width transition to settle
    await page.waitForTimeout(450);

    const scrolledHeaderBox = await headerContainer.boundingBox();
    expect(scrolledHeaderBox).not.toBeNull();

    console.log('Scrolled state:');
    console.log('  Header: left =', scrolledHeaderBox!.x, 'width =', scrolledHeaderBox!.width, 'right =', scrolledHeaderBox!.x + scrolledHeaderBox!.width);

    // Scrolled state: Header left, width, and right match the main container content bounds (1152px)
    expect(Math.abs(scrolledHeaderBox!.x - heroBox!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(scrolledHeaderBox!.width - heroBox!.width)).toBeLessThanOrEqual(1);

    await page.screenshot({
      path: 'C:/Users/LENOVO/.gemini/antigravity/brain/a94097ba-1ec7-49c7-ac8e-b946fe56e2fc/header-aligned-scrolled.png',
    });

    // Scroll down to 500px: Header auto-hides smoothly
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForFunction(() => document.querySelector('[data-header]')?.getAttribute('data-header-hidden') === 'true');

    // Scroll up to 350px: Header reveals smoothly
    await page.evaluate(() => window.scrollTo(0, 350));
    await page.waitForFunction(() => document.querySelector('[data-header]')?.getAttribute('data-header-hidden') === 'false');

    // Scroll all the way back to top: Header smoothly expands back to footer menu width
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector('[data-header-container]')?.getAttribute('data-scrolled') === 'false');
    await page.waitForTimeout(450);

    const backToTopHeaderBox = await headerContainer.boundingBox();
    expect(Math.abs(backToTopHeaderBox!.width - footerBox!.width)).toBeLessThanOrEqual(1);
  });
});
