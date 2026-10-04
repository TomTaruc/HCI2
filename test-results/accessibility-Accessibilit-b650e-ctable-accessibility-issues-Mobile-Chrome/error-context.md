# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility (Tier 1) >> Mobile ID screen should not have any automatically detectable accessibility issues
- Location: tests\e2e\accessibility.spec.ts:24:3

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
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('Accessibility (Tier 1)', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/');
  7  |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  8  |     await page.reload();
  9  |     // Login as verified user
  10 |     await page.goto('/welcome');
> 11 |     await page.locator('button:has-text("Log In")').click();
     |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  12 |     await page.fill('input[type="tel"]', '09171234567');
  13 |     await page.locator('button:has-text("Continue")').click();
  14 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  15 |     await page.waitForURL('**/home', { timeout: 15000 });
  16 |   });
  17 | 
  18 |   test('Home screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  19 |     await page.goto('/home');
  20 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
  21 |     expect(accessibilityScanResults.violations).toEqual([]);
  22 |   });
  23 | 
  24 |   test('Mobile ID screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  25 |     await page.goto('/mobile-id');
  26 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
  27 |     expect(accessibilityScanResults.violations).toEqual([]);
  28 |   });
  29 | 
  30 |   test('Verify Intro screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  31 |     await page.goto('/verify');
  32 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
  33 |     expect(accessibilityScanResults.violations).toEqual([]);
  34 |   });
  35 | });
  36 | 
```