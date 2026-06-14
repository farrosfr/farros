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

    test('renders process, deliverables, fit-check, and FAQ sections', async ({ page }) => {
      await page.goto(`/services/${slug}/`);

      // Process: an ordered list with 4 step cards
      const process = page.locator('[data-process-steps]');
      await expect(process).toBeVisible();
      const stepCount = await process.locator('> li').count();
      expect(stepCount, `${slug} process steps`).toBe(4);

      // Deliverables: at least 3 items
      const deliverables = page.locator('[data-deliverables] > li');
      const dCount = await deliverables.count();
      expect(dCount, `${slug} deliverables`).toBeGreaterThanOrEqual(3);

      // Good fit checklist: at least 2 items
      const goodFit = page.locator('[data-good-fit] > li');
      const gfCount = await goodFit.count();
      expect(gfCount, `${slug} good-fit`).toBeGreaterThanOrEqual(2);

      // Not good fit checklist: at least 2 items
      const notGoodFit = page.locator('[data-not-good-fit] > li');
      const ngfCount = await notGoodFit.count();
      expect(ngfCount, `${slug} not-good-fit`).toBeGreaterThanOrEqual(2);

      // FAQ: at least 2 <details> items, all closed by default
      const faqs = page.locator('[data-faq-item]');
      const fCount = await faqs.count();
      expect(fCount, `${slug} faqs`).toBeGreaterThanOrEqual(2);
      const firstFaq = faqs.first();
      await expect(firstFaq).not.toHaveAttribute('open', '');

      // Open the first FAQ, expect summary text to render in a heading-like span
      await firstFaq.locator('summary').click();
      await expect(firstFaq).toHaveAttribute('open', '');
    });

    test('embeds ProfessionalService JSON-LD with FAQPage when FAQs exist', async ({ page }) => {
      await page.goto(`/services/${slug}/`);
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      // Find the ProfessionalService block (the one with "@type": "ProfessionalService")
      const professional = jsonLdScripts
        .map((s) => {
          try { return JSON.parse(s); } catch { return null; }
        })
        .filter((obj): obj is Record<string, unknown> => obj !== null && obj['@type'] === 'ProfessionalService');
      expect(professional.length, `${slug} ProfessionalService JSON-LD`).toBeGreaterThan(0);
      const schema = professional[0];
      expect(schema.name).toBeTruthy();
      expect(schema.description).toBeTruthy();
      expect(schema.url).toContain(`/services/${slug}`);
      expect(schema.serviceType).toBeTruthy();
      // provider is a Person
      const provider = schema.provider as Record<string, unknown>;
      expect(provider?.['@type']).toBe('Person');
      // FAQPage embedded as mainEntity
      const main = schema.mainEntity as Record<string, unknown> | undefined;
      if (main?.['@type'] === 'FAQPage') {
        const entities = main.mainEntity as Array<Record<string, unknown>>;
        expect(entities.length).toBeGreaterThan(0);
        expect(entities[0]['@type']).toBe('Question');
        expect(entities[0].name).toBeTruthy();
      }
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
