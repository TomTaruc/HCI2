import { test, expect } from '@playwright/test';

test.describe('Auth & Onboarding (Tier 1)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to start fresh
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    // Reload to ensure state is clear
    await page.goto('/');
  });

  test('AUTH-01: Launch app fresh shows Splash then Welcome screen', async ({ page }) => {
    // Clear disclaimer flag specifically for this test
    await page.evaluate(() => {
      localStorage.removeItem('egov_disclaimerShown');
    });
    await page.goto('/');
    
    // Should see splash screen briefly
    await expect(page.locator('text=Your Government. One App.')).toBeVisible({ timeout: 10000 });
    // Then wait for navigation to Welcome
    await expect(page.locator('button:has-text("Log In")')).toBeVisible({ timeout: 15000 });
    // Disclaimer should be visible
    await expect(page.locator('text=DISCLAIMER: ACADEMIC PROTOTYPE ONLY')).toBeVisible();
    await page.locator('button:has-text("I understand — Proceed")').click({ force: true });
  });

  test('AUTH-02: Register with valid mobile number advances to OTP', async ({ page }) => {
    await page.goto('/welcome');
    await page.locator('button:has-text("Create Account")').click();
    await page.fill('input[type="tel"]', '09171112222');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=Enter OTP')).toBeVisible();
  });

  test('AUTH-03: Register with invalid mobile number shows error', async ({ page }) => {
    await page.goto('/welcome');
    await page.locator('button:has-text("Create Account")').click();
    await page.fill('input[type="tel"]', '0917');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=Invalid mobile number')).toBeVisible();
  });

  test('AUTH-04: Enter correct mock OTP advances to Create MPIN', async ({ page }) => {
    // Go to OTP
    await page.goto('/register');
    await page.fill('input[type="tel"]', '09171112222');
    await page.locator('button:has-text("Continue")').click();
    
    // Fill OTP
    const inputs = page.locator('input[type="text"]');
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).fill('1'); // The mock OTP is 123456 but the code accepts anything in mock? Let's use 123456
    }
    // Let's actually fill '123456'
    await inputs.nth(0).fill('1');
    await inputs.nth(1).fill('2');
    await inputs.nth(2).fill('3');
    await inputs.nth(3).fill('4');
    await inputs.nth(4).fill('5');
    await inputs.nth(5).fill('6');
    
    await expect(page.locator('text=Create MPIN')).toBeVisible();
  });

  test('AUTH-05: Enter wrong OTP', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[type="tel"]', '09171112222');
    await page.locator('button:has-text("Continue")').click();
    
    const inputs = page.locator('input[type="text"]');
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).fill('0');
    }
    
    await expect(page.locator('text=Invalid OTP')).toBeVisible();
    await expect(page.locator('button:has-text("Resend Code")')).toBeVisible();
  });

  test('AUTH-06: Create MPIN with mismatch', async ({ page }) => {
    // Directly go to register flow
    await page.goto('/register/mpin', { state: { mobile: '09171112222' } } as any);
    // Well, direct navigation might fail if state is not passed. Playwright can't pass history state in goto.
    // Let's go through the flow.
    await page.goto('/register');
    await page.fill('input[type="tel"]', '09171112222');
    await page.locator('button:has-text("Continue")').click();
    for (let i = 0; i < 6; i++) await page.locator('input[type="text"]').nth(i).fill((i+1).toString());
    
    // Create MPIN
    await page.locator('button:has-text("1")').click();
    await page.locator('button:has-text("1")').click();
    await page.locator('button:has-text("1")').click();
    await page.locator('button:has-text("1")').click();
    await page.locator('button:has-text("1")').click();
    await page.locator('button:has-text("1")').click();

    // Confirm MPIN (mismatch)
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("2")').click();

    await expect(page.locator('text=MPINs do not match')).toBeVisible();
  });

  test('AUTH-07, 08: Create MPIN matching, complete profile, land on Home', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[type="tel"]', '09171112222');
    await page.locator('button:has-text("Continue")').click();
    for (let i = 0; i < 6; i++) await page.locator('input[type="text"]').nth(i).fill((i+1).toString());
    
    // Create MPIN
    for (let i = 0; i < 12; i++) { // 6 for create, 6 for confirm
      await page.locator('button:has-text("1")').click();
    }
    
    // Profile form
    await expect(page.locator('text=Complete Profile')).toBeVisible();
    await page.fill('input[placeholder="First Name"]', 'Juan');
    await page.fill('input[placeholder="Last Name"]', 'Dela Cruz');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.selectOption('select', 'Male');
    await page.locator('button:has-text("Continue")').click();

    // Skip email verify for now by clicking "I\'ll do this later" if present, or just wait for redirect
    // The RegisterEmailVerifyScreen has "Skip for now"
    await expect(page.locator('text=Verify your email')).toBeVisible();
    await page.locator('button:has-text("Skip for now")').click();

    // Lands on home
    await expect(page.locator('text=Verify your identity to unlock')).toBeVisible();
  });

  test('AUTH-09: Log out, log back in', async ({ page }) => {
    // Use seeded account
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09171234567');
    await page.locator('button:has-text("Continue")').click();
    
    // Fill MPIN 111111
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    
    // Home
    await expect(page.locator('text=Mabuhay')).toBeVisible();
    
    // Log out
    await page.locator('text=Account').click();
    await page.locator('button:has-text("Log Out")').click();
    
    // Welcome screen
    await expect(page.locator('text=Log In')).toBeVisible();
  });
  
  // And so on for the rest of AUTH...
});
