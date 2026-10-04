# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings-research-tools.spec.ts >> Settings & Research Tools >> SET-01: Disclaimer is present in About screen
- Location: tests\e2e\settings-research-tools.spec.ts:17:3

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
  3  | test.describe('Settings & Research Tools', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  7  |     await page.reload();
  8  |     // Login as verified user
  9  |     await page.goto('/welcome');
> 10 |     await page.locator('button:has-text("Log In")').click();
     |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  11 |     await page.fill('input[type="tel"]', '09171234567');
  12 |     await page.locator('button:has-text("Continue")').click();
  13 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  14 |     await expect(page.locator('text=Juan!')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('SET-01: Disclaimer is present in About screen', async ({ page }) => {
  18 |     await page.goto('/account');
  19 |     await page.locator('button', { hasText: 'About eGovPH' }).click();
  20 |     
  21 |     await expect(page.locator('text=DISCLAIMER: ACADEMIC PROTOTYPE ONLY')).toBeVisible();
  22 |     await expect(page.locator('text=It is NOT the official eGovPH app.')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('SET-03: Reset Demo Data completely wipes state', async ({ page }) => {
  26 |     await page.goto('/account/research-tools');
  27 |     
  28 |     // Override window.confirm to always return true
  29 |     page.on('dialog', dialog => dialog.accept());
  30 |     
  31 |     await page.locator('button:has-text("Reset Demo Data")').click();
  32 |     
  33 |     // Should navigate to splash which overlays the Disclaimer Modal because it was cleared
  34 |     await expect(page.locator('text=Unofficial Research Prototype')).toBeVisible({ timeout: 5000 });
  35 |     
  36 |     // Check localStorage is clear of our user session
  37 |     const currentUser = await page.evaluate(() => localStorage.getItem('currentUser'));
  38 |     expect(currentUser).toBeNull();
  39 |   });
  40 | 
  41 |   test('SET-04: Instant Verify toggle works', async ({ page }) => {
  42 |     await page.goto('/account/research-tools');
  43 |     page.on('dialog', dialog => dialog.accept());
  44 |     await page.locator('button:has-text("Toggle Instant Verify")').click();
  45 |     
  46 |     const instantVerify = await page.evaluate(() => localStorage.getItem('instantVerify'));
  47 |     expect(instantVerify).toBe('true');
  48 |   });
  49 | });
  50 | 
```