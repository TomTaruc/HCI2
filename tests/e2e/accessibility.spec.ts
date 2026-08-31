import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (Tier 1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Login as verified user
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09171234567');
    await page.locator('button:has-text("Continue")').click();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL('**/home', { timeout: 15000 });
  });

  test('Home screen should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/home');
    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Mobile ID screen should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/mobile-id');
    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Verify Intro screen should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/verify');
    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
