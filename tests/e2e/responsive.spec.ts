import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const viewports = [
    { width: 360, height: 740, name: 'Small Android' },
    { width: 390, height: 844, name: 'iPhone 14' },
    { width: 430, height: 932, name: 'iPhone 14 Pro Max' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1280, height: 800, name: 'Desktop' },
  ];

  for (const vp of viewports) {
    test(`Home renders without horizontal scroll at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/welcome');
      
      // Check horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });
  }
});
