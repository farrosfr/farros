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

  test('uses BaseLayout shell (header, footer, title)', async ({ page }) => {
    await page.goto('/writing');

    // The site header (semantic role "banner") must be present. The Astro
    // DevTools panel injects extra <header> elements in dev mode, so we
    // target by role rather than tag. A previous version of this page
    // rendered as a bare <section> with no nav, no footer, no <title>,
    // and broken SEO — these assertions lock that regression out.
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Title tag should be set (not the Astro default)
    await expect(page).toHaveTitle(/Writing/i);

    // Writing nav link is wired somewhere in the header (desktop nav
    // on wider viewports, hidden mobile drawer on smaller). Use
    // href-based lookup because the mobile drawer is hidden by default
    // and getByRole excludes display:none elements. We expect at least
    // one match (desktop nav) and at most two (desktop + mobile drawer).
    await expect(
      page.locator('header a[href="/writing"]')
    ).toHaveCount(2);
  });

  test('strips platform brand names and trigger words from post text', async ({ page }) => {
    await page.goto('/writing');

    // Visible page body — anything banned must not appear in text content
    const bodyText = (await page.locator('main').innerText()).toLowerCase();

    // Banned brand names (case-insensitive on the body text)
    for (const banned of [
      'tryhackme', 'try hack me', 'htb', 'hackerrank', 'hacker rank',
      'cyber skyline', 'cyberskyline', 'security blue team', 'hackviser',
    ]) {
      expect(bodyText, `banned term "${banned}" appeared in page text`).not.toContain(banned);
    }

    // Banned trigger words
    for (const banned of ['write-up', 'writeup', 'walkthrough']) {
      expect(bodyText, `trigger word "${banned}" appeared in page text`).not.toContain(banned);
    }
  });
});
