import { test, expect } from '@playwright/test';

test.describe('Verification Flow (Tier 1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    
    // Login as unverified user (Juan, 09171234567, 111111)
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09171234567');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL('**/home', { timeout: 15000 });
    await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  });

  test('VER-ALL: Complete verification flow (Tier 1)', async ({ page }) => {
    // VER-01: Tap Verify Account shows intro
    await page.locator('text=National Government Services').click();
    await expect(page.locator('h1', { hasText: 'Unlock Full Access' })).toBeVisible();
    await page.locator('button:has-text("Start Verification")').click();
    await expect(page.locator('text=Personal Information')).toBeVisible();
    
    // VER-02, 03: Personal info form validation
    // Submit correct info directly
    await page.fill('input[placeholder="e.g., Maria Lourdes Reyes Santos"]', 'Juan Santos dela Cruz');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('h1', { hasText: 'PhilSys Card Number' })).toBeVisible();
    
    // VER-04: PCN entry
    await page.fill('input[type="text"]', '000000000001');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=Position your face in the frame')).toBeVisible();
    
    // VER-06, 09, 10: Complete verification flow
    // Liveness scan starts automatically
    await expect(page.locator('text=Verifying your identity…')).toBeVisible({ timeout: 15000 });
    
    // Auto resolves
    await expect(page.locator('text=Account Verified!')).toBeVisible({ timeout: 25000 });
    
    await page.locator('button:has-text("Continue to Dashboard")').click();
    
    // Dashboard should be unlocked
    await expect(page.locator('text=Verified')).toBeVisible();
  });
});
