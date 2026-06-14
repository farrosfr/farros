import { expect, test } from '@playwright/test';
import { services } from '../../src/data/profile';

const slugs = services.map((s) => s.slug);

for (const slug of slugs) {
  test.describe(`service: ${slug}`, () => {
    test('renders hero, features, CTA, and SVG cover', async ({ page, request }) => {
      await page.goto(`/services/${slug}/`);

      // Back link is present
      await expect(page.getByRole('link', { name: /back to services/i })).toBeVisible();

      // H1 contains the service title
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).not.toBeEmpty();

      // The service cover image lives inside <main>. The header logo
      // is the first <img> on the page, so we scope to main + the
      // /services/ path. Same for the assertion.
      const cover = page.locator(`main img[src="/services/${slug}.svg"]`);
      await expect(cover).toBeVisible();
      const coverSrc = await cover.getAttribute('src');
      expect(coverSrc, 'service cover src').toBeTruthy();
      expect(coverSrc!, `${slug} cover must be self-hosted, not Unsplash`).not.toMatch(/unsplash\.com/);
      expect(coverSrc!, `${slug} cover should be the matching SVG`).toBe(`/services/${slug}.svg`);
      const coverRes = await request.get(coverSrc!);
      expect(coverRes.status(), coverSrc!).toBe(200);
      // SVG body should be a real <svg> document
      const contentType = coverRes.headers()['content-type'] ?? '';
      expect(contentType.toLowerCase()).toContain('svg');

      // At least one feature bullet rendered (an <li> with a check icon)
      const features = page.locator('li').filter({ has: page.locator('span[class*="i-lucide-check"]') });
      expect(await features.count()).toBeGreaterThan(0);

      // CTA link/button to mail
      const cta = page.getByRole('link', { name: /discuss|contact|email|reach out/i }).first();
      await expect(cta).toBeVisible();
      const href = await cta.getAttribute('href');
      expect(href, 'CTA must point to email or contact').toBeTruthy();
    });
  });
}

test('services list on homepage links to all 6 service pages', async ({ page }) => {
  await page.goto('/#services');
  for (const slug of slugs) {
    // Services.astro renders <a href={`/services/${service.slug}`}> with
    // no trailing slash, so the selector matches the real href.
    const link = page.locator(`a[href="/services/${slug}"]`).first();
    await expect(link, `homepage must link to /services/${slug}`).toBeAttached();
  }
});
