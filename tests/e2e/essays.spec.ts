import { expect, test } from '@playwright/test';

// The 3 native essays live in src/content/writing. Keep this list in
// sync with the collection. Each slug corresponds to a markdown file
// at src/content/writing/<slug>.md.
const essaySlugs = [
  'building-for-the-long-term',
  'practical-red-team-notes',
  'data-engineering-without-a-team',
];

test.describe('essays (native content collection)', () => {
  test('/writing page shows the essays section and links to each essay', async ({ page }) => {
    await page.goto('/writing');

    // Long-form essays section is present
    const essaysSection = page.locator('[data-section="essays-featured"]');
    await expect(essaysSection).toBeVisible();

    // At least 1 essay card in the grid (we have 3 featured)
    const essayCards = page.locator('[data-essay-card]');
    expect(await essayCards.count()).toBeGreaterThanOrEqual(1);

    // Each essay card links to /essays/<slug>/
    for (const card of await essayCards.all()) {
      const href = await card.getAttribute('href');
      expect(href, 'essay card href').toMatch(/^\/essays\/[a-z0-9-]+\/$/);
    }

    // The RSS notes section is still there (Substack feed sync)
    const rssSection = page.locator('[data-section="rss-notes"]');
    await expect(rssSection).toBeVisible();
  });

  for (const slug of essaySlugs) {
    test(`essay page /essays/${slug}/ renders title, body, and Article JSON-LD`, async ({ page }) => {
      await page.goto(`/essays/${slug}/`);

      // H1 contains the essay title
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).not.toBeEmpty();

      // Body content present
      const body = page.locator('[data-essay-body]');
      await expect(body).toBeVisible();
      // At least one paragraph rendered
      const paragraphs = body.locator('p');
      expect(await paragraphs.count()).toBeGreaterThan(0);

      // Back link to /writing via the breadcrumb (Home → Writing → current)
      const writingCrumb = page.locator('nav[aria-label="Breadcrumb"] a[href="/writing"]');
      await expect(writingCrumb).toBeVisible();
      const crumbHref = await writingCrumb.getAttribute('href');
      expect(crumbHref).toBe('/writing');

      // Article JSON-LD present
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const article = jsonLdScripts
        .map((s) => {
          try { return JSON.parse(s); } catch { return null; }
        })
        .filter((obj): obj is Record<string, unknown> => obj !== null && obj['@type'] === 'Article');
      expect(article.length, `${slug} Article JSON-LD`).toBe(1);
      const schema = article[0];
      expect(schema.headline).toBeTruthy();
      expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
      const author = schema.author as Record<string, unknown>;
      expect(author?.['@type']).toBe('Person');

      // og:type=article (this BaseLayout prop was added in this PR)
      const ogType = await page.locator('meta[property="og:type"]').first().getAttribute('content');
      expect(ogType, `${slug} og:type`).toBe('article');
    });
  }

  test('clicking an essay card navigates to the essay page', async ({ page }) => {
    await page.goto('/writing');
    const firstCard = page.locator('[data-essay-card]').first();
    const href = await firstCard.getAttribute('href');
    expect(href, 'first essay card href').toBeTruthy();
    await firstCard.click();
    await page.waitForURL(/\/essays\/[a-z0-9-]+\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
