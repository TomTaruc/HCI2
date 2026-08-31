# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth & Onboarding (Tier 1) >> AUTH-01: Launch app fresh shows Splash then Welcome screen
- Location: tests\e2e\auth.spec.ts:12:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=DISCLAIMER: ACADEMIC PROTOTYPE ONLY')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=DISCLAIMER: ACADEMIC PROTOTYPE ONLY')

```

```yaml
- dialog "Research prototype disclaimer":
  - text: Important Notice
  - heading "Unofficial Research Prototype" [level=1]
  - paragraph:
    - strong: Unofficial Student Research Prototype.
    - text: This application is a non-commercial academic recreation built for a university human-computer interaction usability study. It is not affiliated with, endorsed by, or produced by the Department of Information and Communications Technology (DICT) or any Philippine government agency, and it is not the real eGovPH app. It uses only fictional, locally-stored sample data — no real personal information, government ID numbers, or transactions are collected, transmitted, or stored anywhere.
  - text: ✓
  - paragraph: For academic purposes only
  - paragraph: This prototype is used solely for HCI usability research at the university level.
  - text: ✓
  - paragraph: No real data collected
  - paragraph: All information entered is fictional and stored only in your browser's local storage.
  - text: ✓
  - paragraph: No real transactions processed
  - paragraph: All payments, ID verifications, and government interactions are simulated locally.
  - text: "!"
  - paragraph: For real government services
  - paragraph: Visit the official eGovPH app on the Google Play Store or Apple App Store.
  - button "I understand — Proceed"
- button "EN" [pressed]
- button "FIL"
- img "eGovPH logo"
- text: eGOVPH Bagong Pilipinas
- paragraph: Your Government. One App.
- paragraph: Access over 1,000 government services from national agencies and local government units — all in one place.
- button "Log In"
- button "Create Account"
- button "Continue as Guest (eTravel only)"
- paragraph: By continuing, you agree to our Terms of Service and Privacy Policy.
- text: ⚠ Unofficial Research Prototype — Not the real eGovPH
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Auth & Onboarding (Tier 1)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Clear storage to start fresh
  6   |     await page.goto('/');
  7   |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  8   |     // Reload to ensure state is clear
  9   |     await page.goto('/');
  10  |   });
  11  | 
  12  |   test('AUTH-01: Launch app fresh shows Splash then Welcome screen', async ({ page }) => {
  13  |     // Clear disclaimer flag specifically for this test
  14  |     await page.evaluate(() => {
  15  |       localStorage.removeItem('egov_disclaimerShown');
  16  |     });
  17  |     await page.goto('/');
  18  |     
  19  |     // Should see splash screen briefly
  20  |     await expect(page.locator('text=Your Government. One App.')).toBeVisible({ timeout: 10000 });
  21  |     // Then wait for navigation to Welcome
  22  |     await expect(page.locator('button:has-text("Log In")')).toBeVisible({ timeout: 15000 });
  23  |     // Disclaimer should be visible
> 24  |     await expect(page.locator('text=DISCLAIMER: ACADEMIC PROTOTYPE ONLY')).toBeVisible();
      |                                                                            ^ Error: expect(locator).toBeVisible() failed
  25  |     await page.locator('button:has-text("I understand — Proceed")').click({ force: true });
  26  |   });
  27  | 
  28  |   test('AUTH-02: Register with valid mobile number advances to OTP', async ({ page }) => {
  29  |     await page.goto('/welcome');
  30  |     await page.locator('button:has-text("Create Account")').click();
  31  |     await page.fill('input[type="tel"]', '09171112222');
  32  |     await page.locator('button:has-text("Continue")').click();
  33  |     await expect(page.locator('text=Enter OTP')).toBeVisible();
  34  |   });
  35  | 
  36  |   test('AUTH-03: Register with invalid mobile number shows error', async ({ page }) => {
  37  |     await page.goto('/welcome');
  38  |     await page.locator('button:has-text("Create Account")').click();
  39  |     await page.fill('input[type="tel"]', '0917');
  40  |     await page.locator('button:has-text("Continue")').click();
  41  |     await expect(page.locator('text=Invalid mobile number')).toBeVisible();
  42  |   });
  43  | 
  44  |   test('AUTH-04: Enter correct mock OTP advances to Create MPIN', async ({ page }) => {
  45  |     // Go to OTP
  46  |     await page.goto('/register');
  47  |     await page.fill('input[type="tel"]', '09171112222');
  48  |     await page.locator('button:has-text("Continue")').click();
  49  |     
  50  |     // Fill OTP
  51  |     const inputs = page.locator('input[type="text"]');
  52  |     for (let i = 0; i < 6; i++) {
  53  |       await inputs.nth(i).fill('1'); // The mock OTP is 123456 but the code accepts anything in mock? Let's use 123456
  54  |     }
  55  |     // Let's actually fill '123456'
  56  |     await inputs.nth(0).fill('1');
  57  |     await inputs.nth(1).fill('2');
  58  |     await inputs.nth(2).fill('3');
  59  |     await inputs.nth(3).fill('4');
  60  |     await inputs.nth(4).fill('5');
  61  |     await inputs.nth(5).fill('6');
  62  |     
  63  |     await expect(page.locator('text=Create MPIN')).toBeVisible();
  64  |   });
  65  | 
  66  |   test('AUTH-05: Enter wrong OTP', async ({ page }) => {
  67  |     await page.goto('/register');
  68  |     await page.fill('input[type="tel"]', '09171112222');
  69  |     await page.locator('button:has-text("Continue")').click();
  70  |     
  71  |     const inputs = page.locator('input[type="text"]');
  72  |     for (let i = 0; i < 6; i++) {
  73  |       await inputs.nth(i).fill('0');
  74  |     }
  75  |     
  76  |     await expect(page.locator('text=Invalid OTP')).toBeVisible();
  77  |     await expect(page.locator('button:has-text("Resend Code")')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('AUTH-06: Create MPIN with mismatch', async ({ page }) => {
  81  |     // Directly go to register flow
  82  |     await page.goto('/register/mpin', { state: { mobile: '09171112222' } } as any);
  83  |     // Well, direct navigation might fail if state is not passed. Playwright can't pass history state in goto.
  84  |     // Let's go through the flow.
  85  |     await page.goto('/register');
  86  |     await page.fill('input[type="tel"]', '09171112222');
  87  |     await page.locator('button:has-text("Continue")').click();
  88  |     for (let i = 0; i < 6; i++) await page.locator('input[type="text"]').nth(i).fill((i+1).toString());
  89  |     
  90  |     // Create MPIN
  91  |     await page.locator('button:has-text("1")').click();
  92  |     await page.locator('button:has-text("1")').click();
  93  |     await page.locator('button:has-text("1")').click();
  94  |     await page.locator('button:has-text("1")').click();
  95  |     await page.locator('button:has-text("1")').click();
  96  |     await page.locator('button:has-text("1")').click();
  97  | 
  98  |     // Confirm MPIN (mismatch)
  99  |     await page.locator('button:has-text("2")').click();
  100 |     await page.locator('button:has-text("2")').click();
  101 |     await page.locator('button:has-text("2")').click();
  102 |     await page.locator('button:has-text("2")').click();
  103 |     await page.locator('button:has-text("2")').click();
  104 |     await page.locator('button:has-text("2")').click();
  105 | 
  106 |     await expect(page.locator('text=MPINs do not match')).toBeVisible();
  107 |   });
  108 | 
  109 |   test('AUTH-07, 08: Create MPIN matching, complete profile, land on Home', async ({ page }) => {
  110 |     await page.goto('/register');
  111 |     await page.fill('input[type="tel"]', '09171112222');
  112 |     await page.locator('button:has-text("Continue")').click();
  113 |     for (let i = 0; i < 6; i++) await page.locator('input[type="text"]').nth(i).fill((i+1).toString());
  114 |     
  115 |     // Create MPIN
  116 |     for (let i = 0; i < 12; i++) { // 6 for create, 6 for confirm
  117 |       await page.locator('button:has-text("1")').click();
  118 |     }
  119 |     
  120 |     // Profile form
  121 |     await expect(page.locator('text=Complete Profile')).toBeVisible();
  122 |     await page.fill('input[placeholder="First Name"]', 'Juan');
  123 |     await page.fill('input[placeholder="Last Name"]', 'Dela Cruz');
  124 |     await page.fill('input[type="date"]', '1990-01-01');
```