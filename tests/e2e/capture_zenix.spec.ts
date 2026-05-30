import { test } from '@playwright/test';
import path from 'path';

test('capture zenix screenshot', async ({ page }) => {
  // Set viewport for a clean screenshot
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // Go to the site
  await page.goto('https://zenix.farros.co', { waitUntil: 'networkidle' });
  
  // Wait a bit for any animations
  await page.waitForTimeout(2000);
  
  // Capture screenshot
  const screenshotPath = path.join(process.cwd(), 'public/projects/zenix-farros-co.png');
  await page.screenshot({ path: screenshotPath });
  
  console.log('Screenshot saved to:', screenshotPath);
});
