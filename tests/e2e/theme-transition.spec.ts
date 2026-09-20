import { test, expect } from '@playwright/test';

test.describe('Theme persistence across view transitions', () => {
  test('persists dark mode bidirectionally between Home and Web Porto', async ({ page, isMobile }) => {
    // 1. Visit homepage and set dark theme
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.themeMode = 'dark';
    });

    expect(await page.locator('html').evaluate((el) => el.classList.contains('dark'))).toBe(true);

    // 2. Navigate to Web Porto
    if (isMobile) {
      await page.getByRole('button', { name: /open navigation/i }).click();
    }
    await page.getByRole('link', { name: 'Web Porto' }).first().click();
    await page.waitForURL('**/web-porto/**');

    // 3. Verify dark mode is preserved on /web-porto/
    expect(await page.locator('html').evaluate((el) => el.classList.contains('dark'))).toBe(true);
    expect(await page.locator('html').evaluate((el) => el.dataset.themeMode)).toBe('dark');

    // 4. Navigate back to Home via logo link
    await page.locator('header a[href="/"]').first().click();
    await page.waitForURL('**/');

    // 5. Verify dark mode is still preserved on Home
    expect(await page.locator('html').evaluate((el) => el.classList.contains('dark'))).toBe(true);
    expect(await page.locator('html').evaluate((el) => el.dataset.themeMode)).toBe('dark');
  });

  test('persists light mode when navigating from Home to Web Porto', async ({ page, isMobile }) => {
    // 1. Visit homepage and set light theme
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.dataset.themeMode = 'light';
    });

    expect(await page.locator('html').evaluate((el) => el.classList.contains('dark'))).toBe(false);

    // 2. Navigate to Web Porto
    if (isMobile) {
      await page.getByRole('button', { name: /open navigation/i }).click();
    }
    await page.getByRole('link', { name: 'Web Porto' }).first().click();
    await page.waitForURL('**/web-porto/**');

    // 3. Verify light mode is preserved on /web-porto/
    expect(await page.locator('html').evaluate((el) => el.classList.contains('dark'))).toBe(false);
    expect(await page.locator('html').evaluate((el) => el.dataset.themeMode)).toBe('light');
  });
});
