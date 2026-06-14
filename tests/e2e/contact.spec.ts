import { expect, test } from '@playwright/test';
import { profile } from '../../src/data/profile';

test.describe('contact page', () => {
  test('renders form, direct lines, and BaseLayout shell', async ({ page }) => {
    await page.goto('/contact/');

    // Hero + 2-col header (eyebrow is a <p>, H1 is the heading).
    await expect(
      page.locator('main p').filter({ hasText: /^Contact$/ }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Start a conversation/i })
    ).toBeVisible();

    // BaseLayout provides banner + contentinfo.
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    // All four form fields are wired.
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('select[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();

    // Submit button is enabled by default.
    const submit = page.locator('[data-submit-button]');
    await expect(submit).toBeEnabled();
    await expect(submit).toContainText(/send message/i);

    // Honeypot is hidden from real users.
    const honeypot = page.locator('input[name="company_website"]');
    await expect(honeypot).toBeHidden();

    // Direct lines include email + WhatsApp.
    await expect(page.getByRole('link', { name: /Email/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /WhatsApp/i }).first()).toBeVisible();

    // Email link points at the configured address.
    const emailLink = page.getByRole('link', { name: new RegExp(profile.email, 'i') }).first();
    await expect(emailLink).toBeVisible();
  });

  test('validates empty submission and shows inline error', async ({ page }) => {
    await page.goto('/contact/');
    await page.locator('[data-submit-button]').click();
    const status = page.locator('[data-form-status]');
    await expect(status).toBeVisible();
    await expect(status).toContainText(/fill in name, email, subject, and message/i);
    // Browser native required-blocker may also kick in; either path is fine.
  });

  test('honeypot submission silently succeeds', async ({ page }) => {
    await page.goto('/contact/');
    await page.locator('input[name="name"]').fill('Bot McSpammy');
    await page.locator('input[name="email"]').fill('bot@example.com');
    await page.locator('select[name="subject"]').selectOption('Other');
    await page.locator('textarea[name="message"]').fill('buy crypto now');
    // Fill the honeypot to simulate a bot.
    await page.locator('input[name="company_website"]').evaluate(
      (el: HTMLInputElement) => {
        el.value = 'http://spam.example';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    );
    await page.locator('[data-submit-button]').click();
    const status = page.locator('[data-form-status]');
    await expect(status).toBeVisible();
    await expect(status).toContainText(/message sent/i);
  });
});
