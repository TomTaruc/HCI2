# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-id.spec.ts >> Mobile ID / Digital ID Wallet (Tier 1 - Flow B) >> ID-01: Verified account sees wallet
- Location: tests\e2e\mobile-id.spec.ts:19:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Log In")')

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - text: The server is configured with a public base URL of /HCI2/ - did you mean to visit
  - link "/HCI2/welcome" [ref=f2e2] [cursor=pointer]:
    - /url: /HCI2/welcome
  - text: instead?
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Mobile ID / Digital ID Wallet (Tier 1 - Flow B)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  7  |     await page.reload();
  8  |     // Use seeded account 1 (verified)
  9  |     await page.goto('/welcome');
> 10 |     await page.locator('button:has-text("Log In")').click();
     |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  11 |     await page.fill('input[type="tel"]', '09189876543');
  12 |     await page.locator('button:has-text("Continue")').click();
  13 |     await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
  14 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  15 |     await page.waitForURL('**/home', { timeout: 15000 });
  16 |     await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  17 |   });
  18 | 
  19 |   test('ID-01: Verified account sees wallet', async ({ page }) => {
  20 |     await page.locator('text=Mobile ID').click();
  21 |     await expect(page.locator('text=Digital ID Wallet')).toBeVisible();
  22 |     await expect(page.locator('text=Digital National ID')).toBeVisible();
  23 |     
  24 |     // Check that unavailable ID is rendered but locked
  25 |     const unavailableId = page.locator('button', { hasText: 'Professional License' });
  26 |     await expect(unavailableId).toBeVisible();
  27 |     await expect(unavailableId).toBeDisabled();
  28 |   });
  29 | 
  30 |   test('ID-02, 03, 04: Open ID, see detail, share QR', async ({ page }) => {
  31 |     await page.locator('text=Mobile ID').click();
  32 |     await page.locator('button', { hasText: 'Digital National ID' }).click();
  33 |     
  34 |     // Detail view
  35 |     await expect(page.locator('text=Republic of the Philippines')).toBeVisible();
  36 |     await expect(page.locator('text=Show QR')).toBeVisible();
  37 |     
  38 |     // Tap Show QR
  39 |     await page.locator('button:has-text("Show QR")').click();
  40 |     await expect(page.locator('text=Share my information with the verifier')).toBeVisible({ timeout: 10000 });
  41 |     
  42 |     // QR should not be visible until consent
  43 |     await expect(page.locator('text=Turn on consent to reveal your QR code')).toBeVisible();
  44 |     
  45 |     // Toggle consent
  46 |     await page.locator('button[role="switch"]').click();
  47 |     
  48 |     // QR should be visible
  49 |     await expect(page.locator('text=Digitally Signed')).toBeVisible();
  50 |     await expect(page.locator('text=Turn on consent')).not.toBeVisible();
  51 |   });
  52 | 
  53 |   test('ID-06: Unverified account reaches Mobile ID', async ({ page }) => {
  54 |     await page.goto('/');
  55 |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  56 |     await page.reload();
  57 |     // Login unverified
  58 |     await page.goto('/welcome');
  59 |     await page.locator('button:has-text("Log In")').click();
  60 |     await page.fill('input[type="tel"]', '09171234567');
  61 |     await page.locator('button:has-text("Continue")').click();
  62 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  63 |     await page.waitForURL('**/home', { timeout: 15000 });
  64 |     await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  65 |     
  66 |     await page.locator('text=Mobile ID').click();
  67 |     await expect(page.locator('text=Verification Required')).toBeVisible();
  68 |     await expect(page.locator('text=Verify Account')).toBeVisible();
  69 |   });
  70 | });
  71 | 
```