import { expect, test } from '@playwright/test';

// Pages and their expected top-level breadcrumb chain. Last entry is
// the current page and must be marked aria-current="page".
const cases: Array<{ path: string; crumbs: string[] }> = [
  { path: '/contact', crumbs: ['Home', 'Contact'] },
  { path: '/cv', crumbs: ['Home', 'CV'] },
  { path: '/web-porto/', crumbs: ['Home', 'Web Portfolio'] },
  { path: '/writing', crumbs: ['Home', 'Writing'] },
];

for (const { path, crumbs } of cases) {
  test(`${path} renders a BreadcrumbList JSON-LD and visible breadcrumb`, async ({ page }) => {
    await page.goto(path);

    // Visible breadcrumb nav with the right structure
    const nav = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(nav).toBeVisible();

    const items = nav.locator('li');
    expect(await items.count()).toBe(crumbs.length);

    for (let i = 0; i < crumbs.length; i++) {
      const text = (await items.nth(i).innerText()).trim();
      expect(text, `crumb #${i + 1} text`).toContain(crumbs[i]);
    }

    // Last crumb has aria-current="page" and is not a link
    const last = items.nth(crumbs.length - 1);
    const lastSpan = last.locator('span[aria-current="page"]');
    await expect(lastSpan).toBeVisible();

    // First crumb links to "/"
    const firstLink = items.nth(0).locator('a');
    const href = await firstLink.getAttribute('href');
    expect(href, 'first crumb href').toBe('/');

    // BreadcrumbList JSON-LD present
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const breadcrumb = jsonLdScripts
      .map((s) => {
        try { return JSON.parse(s); } catch { return null; }
      })
      .filter((obj): obj is Record<string, unknown> => obj !== null && obj['@type'] === 'BreadcrumbList');
    expect(breadcrumb.length, `${path} BreadcrumbList JSON-LD`).toBeGreaterThan(0);

    const schema = breadcrumb[0];
    const list = schema.itemListElement as Array<Record<string, unknown>>;
    expect(list.length).toBe(crumbs.length);
    expect(list[0].position).toBe(1);
    expect(list[0].name).toBe(crumbs[0]);
    expect(list[crumbs.length - 1].name).toBe(crumbs[crumbs.length - 1]);
    // Each non-final entry has a full URL
    for (let i = 0; i < crumbs.length - 1; i++) {
      expect(list[i].item, `crumb #${i + 1} item url`).toMatch(/^https?:\/\//);
    }
    // The final crumb has no "item" field (current page)
    expect(list[crumbs.length - 1].item, 'last crumb has no item url').toBeUndefined();
  });
}

test('services/[slug] page renders breadcrumb with service title', async ({ page }) => {
  await page.goto('/services/web-architecture/');
  const nav = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(nav).toBeVisible();
  const items = nav.locator('li');
  expect(await items.count()).toBe(3);
  expect((await items.nth(0).innerText()).trim()).toContain('Home');
  expect((await items.nth(1).innerText()).trim()).toContain('Services');
  expect((await items.nth(2).innerText()).trim()).toContain('High-Performance Web Architecture');

  // JSON-LD
  const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const breadcrumb = jsonLdScripts
    .map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    })
    .filter((obj): obj is Record<string, unknown> => obj !== null && obj['@type'] === 'BreadcrumbList');
  expect(breadcrumb.length).toBeGreaterThan(0);
  const list = (breadcrumb[0].itemListElement) as Array<Record<string, unknown>>;
  expect(list[2].name).toBe('High-Performance Web Architecture');
});

test('essays/[slug] page renders breadcrumb with essay title', async ({ page }) => {
  await page.goto('/essays/building-for-the-long-term/');
  const nav = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(nav).toBeVisible();
  const items = nav.locator('li');
  expect(await items.count()).toBe(3);
  expect((await items.nth(1).innerText()).trim()).toContain('Writing');
  expect((await items.nth(2).innerText()).trim()).toContain('Building for the long term');

  // JSON-LD
  const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const breadcrumb = jsonLdScripts
    .map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    })
    .filter((obj): obj is Record<string, unknown> => obj !== null && obj['@type'] === 'BreadcrumbList');
  expect(breadcrumb.length).toBeGreaterThan(0);
  const list = (breadcrumb[0].itemListElement) as Array<Record<string, unknown>>;
  expect(list[2].name).toBe('Building for the long term when every dependency wants to break');
});

test('home page does NOT emit a breadcrumb', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(nav).toHaveCount(0);
});
