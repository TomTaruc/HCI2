import { navigateTo, getExpectedUrl } from './utils/nav';
import { test, expect } from '@playwright/test';

test.describe('Auth & Onboarding (Tier 1)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to start fresh
    await page.goto('/HCI2/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    // Reload to ensure state is clear
    await page.goto('/HCI2/');
  });

  test('AUTH-01: Launch app fresh shows Splash then Welcome screen', async ({ page }) => {
    // Clear disclaimer flag specifically for this test
    await page.evaluate(() => {
      localStorage.removeItem('egov_disclaimerShown');
    });
    await page.goto('/HCI2/');
    
    // Should see splash screen briefly
    await expect(page.locator('text=Your Government. One App.')).toBeVisible({ timeout: 10000 });
    // Then wait for navigation to Welcome
    await expect(page.locator('button:has-text("Log In")')).toBeVisible({ timeout: 15000 });
    // Disclaimer should be visible
    await expect(page.getByRole('heading', { name: 'Unofficial Research Prototype' })).toBeVisible();
    await page.locator('button:has-text("I understand — Proceed")').click({ force: true });
  });

  test('AUTH-02: Register with valid mobile number advances to OTP', async ({ page }) => {
    await navigateTo(page, '/welcome');
    await page.locator('button:has-text("Create Account")').click();
    await page.fill('input[type="tel"]', '9171112222');
    await page.locator('button:has-text("Send OTP")').click();
    await expect(page.locator('text=Enter OTP')).toBeVisible();
  });

  test('AUTH-03: Register with invalid mobile number shows error', async ({ page }) => {
    await navigateTo(page, '/welcome');
    await page.locator('button:has-text("Create Account")').click();
    await page.fill('input[type="tel"]', '0917');
    await page.locator('button:has-text("Send OTP")').click();
    await expect(page.locator('text=10-digit Philippine')).toBeVisible();
  });

  test('AUTH-04: Enter correct mock OTP advances to Create MPIN', async ({ page }) => {
    // Go to OTP
    await navigateTo(page, '/register/mobile');
    await page.fill('input[type="tel"]', '9171112222');
    await page.locator('button:has-text("Send OTP")').click();
    
    // Fill OTP
    await page.locator('input[type="text"]').first().focus();
    await page.keyboard.type('123456', { delay: 50 });
    
    await expect(page.locator('text=Create MPIN')).toBeVisible();
  });

  test('AUTH-05: Enter wrong OTP', async ({ page }) => {
    await navigateTo(page, '/register/mobile');
    await page.fill('input[type="tel"]', '9171112222');
    await page.locator('button:has-text("Send OTP")').click();
    
    await page.locator('input[type="text"]').first().focus();
    await page.keyboard.type('000000', { delay: 50 });
    
    await expect(page.locator('text=Verification failed')).toBeVisible();
    await expect(page.locator('text=Resend available in')).toBeVisible();
  });

  test('AUTH-06: Create MPIN with mismatch', async ({ page }) => {
    // Directly go to register flow
    await page.goto('/register/mpin', { state: { mobile: '09171112222' } } as any);
    // Well, direct navigation might fail if state is not passed. Playwright can't pass history state in goto.
    // Let's go through the flow.
    await navigateTo(page, '/register/mobile');
    await page.fill('input[type="tel"]', '9171112222');
    await page.locator('button:has-text("Send OTP")').click();
    await page.locator('input[type="text"]').first().focus();
    await page.keyboard.type('123456', { delay: 50 });
    
    // Create MPIN (valid: 135790)
    for (const d of ['1', '3', '5', '7', '9', '0']) await page.locator(`button[aria-label="${d}"]`).click();
    await page.locator('button:has-text("Continue")').click();

    // Confirm MPIN (mismatch: 246801)
    for (const d of ['2', '4', '6', '8', '0', '1']) await page.locator(`button[aria-label="${d}"]`).click();
    await page.locator('button:has-text("Confirm MPIN")').click();

    await expect(page.locator('text=MPINs do not match')).toBeVisible();
  });

  test('AUTH-07, 08: Create MPIN matching, complete profile, land on Home', async ({ page }) => {
    await navigateTo(page, '/register/mobile');
    await page.fill('input[type="tel"]', '9171112222');
    await page.locator('button:has-text("Send OTP")').click();
    await page.locator('input[type="text"]').first().focus();
    await page.keyboard.type('123456', { delay: 50 });
    
    // Create MPIN
    for (const d of ['1', '3', '5', '7', '9', '0']) await page.locator(`button[aria-label="${d}"]`).click();
    await page.locator('button:has-text("Continue")').click();
    
    // Confirm MPIN
    for (const d of ['1', '3', '5', '7', '9', '0']) await page.locator(`button[aria-label="${d}"]`).click();
    await page.locator('button:has-text("Confirm MPIN")').click();
    
    // Profile form
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await page.locator('input[name="firstName"]').fill('Juan');
    await page.locator('input[name="lastName"]').fill('Dela Cruz');
    await page.locator('input[name="email"]').fill('juan@example.com');
    await page.locator('input[type="date"]').fill('1990-01-01');
    await page.getByLabel('Male', { exact: true }).click();
    await page.locator('button:has-text("Create Account")').click();

    // Skip email verify for now by clicking "I\'ll do this later" if present, or just wait for redirect
    // The RegisterEmailVerifyScreen has "Skip for now"
    await expect(page.locator('text=Check your email')).toBeVisible();
    await page.locator('button:has-text("Skip for now")').click();

    // Lands on home
    await expect(page.locator('text=Verify account to unlock all services')).toBeVisible();
  });

  test('AUTH-09: Log out, log back in', async ({ page }) => {
    // Use seeded account
    await navigateTo(page, '/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '9171234567');
    await page.locator('button:has-text("Continue")').click();
    
    // Fill MPIN 111111
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    
    // Home
    await expect(page.locator('text=Mabuhay')).toBeVisible();
    
    // Log out
    await page.getByRole('link', { name: 'Account' }).click();
    await page.locator('button:has-text("Log Out")').click();
    
    // Welcome screen
    await expect(page.locator('text=Log In')).toBeVisible();
  });
  
  // And so on for the rest of AUTH...
});

