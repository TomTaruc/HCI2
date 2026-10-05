import { test, expect } from '@playwright/test';
import { navigateTo } from './utils/nav';

test.describe('Account Settings (End-to-End)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to start fresh
    await page.goto('/HCI2/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.goto('/HCI2/');
    
    // Login flow
    await navigateTo(page, '/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '9171234567'); // Default seeded user
    await page.fill('input[placeholder="Enter 6-digit MPIN"]', '111111');
    await page.locator('button:has-text("Login")').click();
    await expect(page.locator('text=Mabuhay')).toBeVisible();

    // Navigate to Account Settings
    await page.locator('nav').getByText('Account').click();
    await expect(page.locator('text=App Settings')).toBeVisible();
    await page.locator('button:has-text("Settings")').click();
  });

  test('Update Email Address', async ({ page }) => {
    await page.locator('button:has-text("Change Email Address")').click();
    await expect(page.locator('text=Enter your new email address')).toBeVisible();
    
    await page.fill('input[type="email"]', 'newemail@example.com');
    await page.locator('button:has-text("Send OTP")').click();
    
    await expect(page.locator('text=6-digit OTP')).toBeVisible();
    await page.fill('input[type="number"]', '123456'); // Demo OTP
    await page.locator('button:has-text("Verify OTP")').click();
    
    await expect(page.locator('text=Email Updated!')).toBeVisible();
    await page.locator('button:has-text("Done")').click();
    
    // Navigate back to profile and verify change without reload
    await navigateTo(page, '/account/profile');
    await expect(page.locator('text=newemail@example.com')).toBeVisible();
  });

  test('Update Mobile Number', async ({ page }) => {
    await page.locator('button:has-text("Update Mobile Number")').click();
    await expect(page.locator('text=Enter your new Philippine mobile number')).toBeVisible();
    
    await page.fill('input[type="tel"]', '9998887777');
    await page.locator('button:has-text("Send OTP")').click();
    
    await expect(page.locator('text=6-digit OTP')).toBeVisible();
    await page.fill('input[type="number"]', '123456'); // Demo OTP
    await page.locator('button:has-text("Verify OTP")').click();
    
    await expect(page.locator('text=Mobile Updated!')).toBeVisible();
    await page.locator('button:has-text("Done")').click();
    
    // Navigate back to profile and verify change without reload
    await navigateTo(page, '/account/profile');
    await expect(page.locator('text=+639998887777')).toBeVisible();
  });

  test('Change MPIN', async ({ page }) => {
    await page.locator('button:has-text("Change MPIN")').click();
    
    // Step 1: Verify current MPIN
    await expect(page.locator('text=Verify Current MPIN')).toBeVisible();
    await page.fill('input[type="password"]', '111111');
    await page.locator('button:has-text("Verify")').click();
    
    // Step 2: New MPIN
    await expect(page.locator('text=Create New MPIN')).toBeVisible();
    await page.fill('input[type="password"]', '123123');
    await page.locator('button:has-text("Continue")').click();
    
    // Step 3: Confirm new MPIN
    await expect(page.locator('text=Confirm New MPIN')).toBeVisible();
    await page.fill('input[type="password"]', '123123');
    await page.locator('button:has-text("Confirm Change")').click();
    
    await expect(page.locator('text=MPIN Updated!')).toBeVisible();
    await page.locator('button:has-text("Done")').click();
  });
});
