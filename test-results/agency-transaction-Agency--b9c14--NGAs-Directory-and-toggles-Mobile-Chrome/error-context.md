# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: agency-transaction.spec.ts >> Agency / NGA Transaction (Tier 1 - Flow C) >> AGY-01: NGAs Directory and toggles
- Location: tests\e2e\agency-transaction.spec.ts:19:3

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
  3  | test.describe('Agency / NGA Transaction (Tier 1 - Flow C)', () => {
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
  19 |   test('AGY-01: NGAs Directory and toggles', async ({ page }) => {
  20 |     // Navigate through Home -> Services Hub -> NGAs
  21 |     await page.locator('button', { hasText: 'NGAs' }).first().click();
  22 |     
  23 |     await expect(page.locator('text=By Category')).toBeVisible();
  24 |     await expect(page.locator('text=Social Security System')).toBeVisible();
  25 |     
  26 |     await page.locator('button:has-text("By Agency")').click();
  27 |     // Verify it changed to Agency view (alphabetical)
  28 |     await expect(page.locator('text=Social Security System')).toBeVisible();
  29 |   });
  30 | 
  31 |   test('AGY-02, 03: SSS Detail and Linking', async ({ page }) => {
  32 |     // Direct navigate to SSS detail
  33 |     await page.goto('/agencies/sss');
  34 |     
  35 |     await expect(page.locator('text=Social Security System')).toBeVisible();
  36 |     await expect(page.locator('text=Overview')).toBeVisible();
  37 |     
  38 |     // Check if linked or not linked. For the seeded account, it should be linked initially if we use DB? 
  39 |     // Wait, the seeded SSS agency is linked: true in db.ts.
  40 |     // Let's test unlinking or checking another agency that is unlinked. 
  41 |     // GSIS is unlinked in the seed data.
  42 |     await page.goto('/agencies/gsis');
  43 |     await expect(page.locator('text=Not linked').first()).toBeVisible({ timeout: 10000 });
  44 |     
  45 |     // Attempt to link
  46 |     await page.fill('input[type="text"]', '123456789');
  47 |     await page.locator('button:has-text("Link Account")').click();
  48 |     
  49 |     await expect(page.locator('text=Account linked successfully')).toBeVisible({ timeout: 10000 });
  50 |     await expect(page.locator('text=✓ Linked').first()).toBeVisible();
  51 |   });
  52 | 
  53 |   test('AGY-04: SSS Records tab renders table', async ({ page }) => {
  54 |     await page.goto('/agencies/sss');
  55 |     await page.locator('button[role="tab"]:has-text("records")').click();
  56 |     
  57 |     await expect(page.locator('text=Contribution History')).toBeVisible();
  58 |     // Should see a mocked record
  59 |     await expect(page.locator('text=posted').first()).toBeVisible();
  60 |   });
  61 | 
  62 |   test('AGY-06: Unlinked agency records tab shows empty state', async ({ page }) => {
  63 |     await page.goto('/agencies/gsis'); // unlinked initially
  64 |     await page.locator('button[role="tab"]:has-text("records")').click();
  65 |     
  66 |     await expect(page.locator('text=No linked account')).toBeVisible();
  67 |     await expect(page.locator('text=Go to Overview')).toBeVisible();
  68 |   });
  69 | 
  70 |   test('AGY-08: LGU screen', async ({ page }) => {
  71 |     await page.goto('/lgu');
  72 |     await expect(page.locator('text=Your LGU')).toBeVisible();
  73 |     await expect(page.locator('text=Quezon City')).toBeVisible(); // QC is default
  74 |     
  75 |     await page.locator('button', { hasText: 'Makati City' }).click();
  76 |     await expect(page.locator('text=Mayor:').first()).toBeVisible();
  77 |   });
  78 | });
  79 | 
```