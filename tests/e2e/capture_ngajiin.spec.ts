import { test } from '@playwright/test';
import path from 'path';

test('capture ngajiin screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('https://ngajiin.web.id', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const screenshotPath = path.join(process.cwd(), 'public/projects/ngajiin-web-id.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);
});
