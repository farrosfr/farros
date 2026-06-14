import { expect, test } from '@playwright/test';
import { profile } from '../../src/data/profile';

const expectedStatus = profile.availability.status;
const expectedLabel = profile.availability.label;

test.describe('availability badge', () => {
  test('home page hero card shows the configured status + label', async ({ page }) => {
    await page.goto('/');
    // The hero card uses <AvailabilityBadge size="sm" /> — the badge is
    // the one in the hero card area (not the contact page).
    const badge = page
      .locator('[data-availability-badge][data-status]')
      .filter({ hasText: expectedLabel })
      .first();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute('data-status', expectedStatus);
  });

  test('contact page shows the larger badge with the next-slot line', async ({ page }) => {
    await page.goto('/contact/');
    // On the contact page, the badge is rendered at size="md" and
    // the parent heading wraps it inside <main>.
    const badge = page
      .locator('main [data-availability-badge][data-status]')
      .filter({ hasText: expectedLabel })
      .first();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute('data-status', expectedStatus);

    if (profile.availability.nextSlot) {
      // showNextSlot renders a <p> immediately after the badge.
      const nextSlot = badge.locator('xpath=following-sibling::p[1]');
      await expect(nextSlot).toContainText(profile.availability.nextSlot);
    }
  });

  test('badge color palette matches status (green / amber / red)', async ({ page }) => {
    await page.goto('/');
    const badge = page
      .locator('[data-availability-badge][data-status]')
      .filter({ hasText: expectedLabel })
      .first();
    await expect(badge).toBeVisible();

    // Tailwind class names we expect by status. We assert presence
    // of any one of the palette classes; full computed-style check
    // is overkill for a static badge.
    const classExpectations: Record<string, string> = {
      available: 'text-emerald-600',
      limited: 'text-amber-600',
      busy: 'text-rose-600',
    };
    const className = await badge.getAttribute('class');
    expect(className, 'badge should carry the palette class for its status').toContain(
      classExpectations[expectedStatus]
    );
  });
});
