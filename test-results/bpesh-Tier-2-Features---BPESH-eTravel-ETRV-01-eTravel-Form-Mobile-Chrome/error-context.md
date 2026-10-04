# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bpesh.spec.ts >> Tier 2 Features - BPESH & eTravel >> ETRV-01: eTravel Form
- Location: tests\e2e\bpesh.spec.ts:46:3

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
  3  | test.describe('Tier 2 Features - BPESH & eTravel', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  7  |     await page.reload();
  8  |     // Login
  9  |     await page.goto('/welcome');
> 10 |     await page.locator('button:has-text("Log In")').click();
     |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  11 |     await page.fill('input[type="tel"]', '09171234567');
  12 |     await page.locator('button:has-text("Continue")').click();
  13 |     await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
  14 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  15 |     await page.waitForURL('**/home', { timeout: 15000 });
  16 |     await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  17 |   });
  18 | 
  19 |   test('BPESH-01, 03, 04: NBI Clearance Appointment', async ({ page }) => {
  20 |     await page.goto('/bpesh/appointment');
  21 |     
  22 |     // Select Service
  23 |     await page.locator('button:has-text("NBI Clearance")').click();
  24 |     
  25 |     // Select Date/Time
  26 |     await expect(page.locator('text=Booking: NBI Clearance')).toBeVisible();
  27 |     await expect(page.locator('button:has-text("Review Appointment")')).toBeDisabled(); // empty required fields
  28 |     
  29 |     // Fill required
  30 |     const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  31 |     const dateStr = tomorrow.toISOString().split('T')[0];
  32 |     await page.fill('input[type="date"]', dateStr);
  33 |     await page.locator('button', { hasText: '10:00 AM' }).click();
  34 |     
  35 |     await page.locator('button:has-text("Review Appointment")').click();
  36 |     
  37 |     // Review
  38 |     await expect(page.locator('text=Review & Confirm')).toBeVisible();
  39 |     await page.locator('button:has-text("Confirm Appointment")').click();
  40 |     
  41 |     // Done
  42 |     await expect(page.locator('text=Appointment Booked!')).toBeVisible();
  43 |     await expect(page.locator('text=Reference Number')).toBeVisible();
  44 |   });
  45 | 
  46 |   test('ETRV-01: eTravel Form', async ({ page }) => {
  47 |     await page.goto('/etravel');
  48 |     
  49 |     // Type
  50 |     await page.locator('button:has-text("inbound Traveler")').click();
  51 |     
  52 |     // Personal
  53 |     await page.fill('input[placeholder="As on your passport"]', 'Maria'); // first match is First Name
  54 |     await page.locator('input[placeholder="As on your passport"]').nth(1).fill('Clara'); // Last Name
  55 |     await page.fill('input[placeholder="e.g., P1234567A"]', 'P1234567A');
  56 |     await page.locator('button:has-text("Continue")').click();
  57 |     
  58 |     // Travel
  59 |     await page.fill('input[placeholder="e.g., PR302"]', 'PR302');
  60 |     await page.locator('button:has-text("Continue")').click();
  61 |     
  62 |     // Health & Submit
  63 |     await page.locator('button:has-text("Submit Declaration")').click();
  64 |     
  65 |     // Done
  66 |     await expect(page.locator('text=Declaration Submitted!')).toBeVisible();
  67 |     await expect(page.locator('text=eTravel Reference Number')).toBeVisible();
  68 |   });
  69 | 
  70 |   test('ETRV-02: eTravel accessible logged out', async ({ page }) => {
  71 |     await page.goto('/');
  72 |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  73 |     await page.reload();
  74 |     await page.goto('/etravel');
  75 |     await expect(page.locator('text=eTravel Declaration')).toBeVisible();
  76 |   });
  77 | });
  78 | 
```