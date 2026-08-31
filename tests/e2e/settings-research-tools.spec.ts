import { test, expect } from '@playwright/test';

test.describe('Settings & Research Tools', () => {
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
    await expect(page.locator('text=Juan!')).toBeVisible();
  });

  test('SET-01: Disclaimer is present in About screen', async ({ page }) => {
    await page.goto('/account');
    await page.locator('button', { hasText: 'About eGovPH' }).click();
    
    await expect(page.locator('text=DISCLAIMER: ACADEMIC PROTOTYPE ONLY')).toBeVisible();
    await expect(page.locator('text=It is NOT the official eGovPH app.')).toBeVisible();
  });

  test('SET-03: Reset Demo Data completely wipes state', async ({ page }) => {
    await page.goto('/account/research-tools');
    
    // Override window.confirm to always return true
    page.on('dialog', dialog => dialog.accept());
    
    await page.locator('button:has-text("Reset Demo Data")').click();
    
    // Should navigate to splash which overlays the Disclaimer Modal because it was cleared
    await expect(page.locator('text=Unofficial Research Prototype')).toBeVisible({ timeout: 5000 });
    
    // Check localStorage is clear of our user session
    const currentUser = await page.evaluate(() => localStorage.getItem('currentUser'));
    expect(currentUser).toBeNull();
  });

  test('SET-04: Instant Verify toggle works', async ({ page }) => {
    await page.goto('/account/research-tools');
    page.on('dialog', dialog => dialog.accept());
    await page.locator('button:has-text("Toggle Instant Verify")').click();
    
    const instantVerify = await page.evaluate(() => localStorage.getItem('instantVerify'));
    expect(instantVerify).toBe('true');
  });
});
