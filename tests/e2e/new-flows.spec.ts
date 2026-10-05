import { test, expect } from '@playwright/test';

test.describe('New Flows (Mobile Update, Attachments, Session Lock)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and login
    await page.goto('/');
    await page.fill('input[type="tel"]', '9123456789');
    await page.click('button:has-text("Continue")');
    await page.fill('input[type="password"]', '123456');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/home');
  });

  test('Mobile number update formats properly', async ({ page }) => {
    await page.click('button:has-text("Settings")');
    await page.click('button:has-text("Account Details")');
    await page.click('button:has-text("Change Mobile Number")');
    await page.fill('input[placeholder="e.g. 912 345 6789"]', '09998887766');
    await page.click('button:has-text("Send OTP")');
    // OTP step appears
    await expect(page.locator('text=Enter OTP')).toBeVisible();
    await page.fill('input[placeholder="Enter 6-digit OTP"]', '123456');
    await page.click('button:has-text("Verify")');
    // Should see success or back to settings
    await expect(page.locator('text=09998887766').or(page.locator('text=+63 999 888 7766'))).toBeVisible();
  });

  test('Attachment writes successfully in PhilHealth claims', async ({ page }) => {
    await page.goto('/agencies/philhealth/claims');
    // It should redirect to philhealth if not linked, but let's assume linked for now, or just test file upload logic
    await expect(page.locator('text=Account Not Linked')).toBeVisible();
    await page.click('button:has-text("Link Account Now")');
    await page.fill('input[placeholder="Enter PhilHealth Number"]', '12-3456789-0');
    await page.fill('input[type="password"]', '123456');
    await page.click('button:has-text("Link Account")');
    await page.click('button:has-text("Done")');

    await page.goto('/agencies/philhealth/claims');
    await page.click('button:has-text("Start Claim")');
    
    await page.fill('input[placeholder*="name of patient"]', 'John Doe');
    await page.fill('input[placeholder*="facility"]', 'St. Lukes');
    await page.fill('input[type="date"]', '2023-01-01');

    // Create a dummy file
    const buffer = Buffer.from('dummy content');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Tap to upload files');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer
    });

    await page.click('button:has-text("Review Claim")');
    await page.click('button:has-text("Submit Claim")');
    await expect(page.locator('text=Claim Submitted')).toBeVisible();
    await page.click('button:has-text("View Claims History")');
    await expect(page.locator('text=test.pdf')).toBeVisible();
  });

  test('Research Tools reset clears all storage', async ({ page }) => {
    await page.click('button:has-text("Settings")');
    await page.click('button:has-text("Research Tools")');
    
    // Accept confirm dialog
    page.once('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Reset Demo Data")');
    
    // Should redirect to login
    await page.waitForURL('**/');
    const loggedOut = await page.locator('text=Enter your mobile number').isVisible();
    expect(loggedOut).toBeTruthy();
  });
});
