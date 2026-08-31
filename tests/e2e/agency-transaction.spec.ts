import { test, expect } from '@playwright/test';

test.describe('Agency / NGA Transaction (Tier 1 - Flow C)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Use seeded account 1 (verified)
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09189876543');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL('**/home', { timeout: 15000 });
    await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  });

  test('AGY-01: NGAs Directory and toggles', async ({ page }) => {
    // Navigate through Home -> Services Hub -> NGAs
    await page.locator('button', { hasText: 'NGAs' }).first().click();
    
    await expect(page.locator('text=By Category')).toBeVisible();
    await expect(page.locator('text=Social Security System')).toBeVisible();
    
    await page.locator('button:has-text("By Agency")').click();
    // Verify it changed to Agency view (alphabetical)
    await expect(page.locator('text=Social Security System')).toBeVisible();
  });

  test('AGY-02, 03: SSS Detail and Linking', async ({ page }) => {
    // Direct navigate to SSS detail
    await page.goto('/agencies/sss');
    
    await expect(page.locator('text=Social Security System')).toBeVisible();
    await expect(page.locator('text=Overview')).toBeVisible();
    
    // Check if linked or not linked. For the seeded account, it should be linked initially if we use DB? 
    // Wait, the seeded SSS agency is linked: true in db.ts.
    // Let's test unlinking or checking another agency that is unlinked. 
    // GSIS is unlinked in the seed data.
    await page.goto('/agencies/gsis');
    await expect(page.locator('text=Not linked').first()).toBeVisible({ timeout: 10000 });
    
    // Attempt to link
    await page.fill('input[type="text"]', '123456789');
    await page.locator('button:has-text("Link Account")').click();
    
    await expect(page.locator('text=Account linked successfully')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=✓ Linked').first()).toBeVisible();
  });

  test('AGY-04: SSS Records tab renders table', async ({ page }) => {
    await page.goto('/agencies/sss');
    await page.locator('button[role="tab"]:has-text("records")').click();
    
    await expect(page.locator('text=Contribution History')).toBeVisible();
    // Should see a mocked record
    await expect(page.locator('text=posted').first()).toBeVisible();
  });

  test('AGY-06: Unlinked agency records tab shows empty state', async ({ page }) => {
    await page.goto('/agencies/gsis'); // unlinked initially
    await page.locator('button[role="tab"]:has-text("records")').click();
    
    await expect(page.locator('text=No linked account')).toBeVisible();
    await expect(page.locator('text=Go to Overview')).toBeVisible();
  });

  test('AGY-08: LGU screen', async ({ page }) => {
    await page.goto('/lgu');
    await expect(page.locator('text=Your LGU')).toBeVisible();
    await expect(page.locator('text=Quezon City')).toBeVisible(); // QC is default
    
    await page.locator('button', { hasText: 'Makati City' }).click();
    await expect(page.locator('text=Mayor:').first()).toBeVisible();
  });
});
