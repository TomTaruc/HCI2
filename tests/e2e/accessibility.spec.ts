import { navigateTo, getExpectedUrl } from './utils/nav';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (Tier 1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/HCI2/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Login as verified user
    await navigateTo(page, '/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '9171234567');
    await page.locator('button:has-text("Continue")').click();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL(getExpectedUrl('/home'), { timeout: 15000 });
  });

  test('Home screen should not have any automatically detectable accessibility issues', async ({ page }) => {
    await navigateTo(page, '/home');
    await page.waitForTimeout(500);
    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Mobile ID screen should not have any automatically detectable accessibility issues', async ({ page }) => {
    await navigateTo(page, '/mobile-id');
    await page.waitForTimeout(500);
    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Verify Intro screen should not have any automatically detectable accessibility issues', async ({ page }) => {
    await navigateTo(page, '/verify');
    await page.waitForTimeout(500);
    const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
