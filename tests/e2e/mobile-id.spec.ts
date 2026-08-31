import { test, expect } from '@playwright/test';

test.describe('Mobile ID / Digital ID Wallet (Tier 1 - Flow B)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Use seeded account 1 (verified)
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09189876543');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL('**/home', { timeout: 15000 });
    await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  });

  test('ID-01: Verified account sees wallet', async ({ page }) => {
    await page.locator('text=Mobile ID').click();
    await expect(page.locator('text=Digital ID Wallet')).toBeVisible();
    await expect(page.locator('text=Digital National ID')).toBeVisible();
    
    // Check that unavailable ID is rendered but locked
    const unavailableId = page.locator('button', { hasText: 'Professional License' });
    await expect(unavailableId).toBeVisible();
    await expect(unavailableId).toBeDisabled();
  });

  test('ID-02, 03, 04: Open ID, see detail, share QR', async ({ page }) => {
    await page.locator('text=Mobile ID').click();
    await page.locator('button', { hasText: 'Digital National ID' }).click();
    
    // Detail view
    await expect(page.locator('text=Republic of the Philippines')).toBeVisible();
    await expect(page.locator('text=Show QR')).toBeVisible();
    
    // Tap Show QR
    await page.locator('button:has-text("Show QR")').click();
    await expect(page.locator('text=Share my information with the verifier')).toBeVisible({ timeout: 10000 });
    
    // QR should not be visible until consent
    await expect(page.locator('text=Turn on consent to reveal your QR code')).toBeVisible();
    
    // Toggle consent
    await page.locator('button[role="switch"]').click();
    
    // QR should be visible
    await expect(page.locator('text=Digitally Signed')).toBeVisible();
    await expect(page.locator('text=Turn on consent')).not.toBeVisible();
  });

  test('ID-06: Unverified account reaches Mobile ID', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Login unverified
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09171234567');
    await page.locator('button:has-text("Continue")').click();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL('**/home', { timeout: 15000 });
    await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
    
    await page.locator('text=Mobile ID').click();
    await expect(page.locator('text=Verification Required')).toBeVisible();
    await expect(page.locator('text=Verify Account')).toBeVisible();
  });
});
