import { navigateTo, getExpectedUrl } from './utils/nav';
import { test, expect } from '@playwright/test';

test.describe('Tier 2 Features - Others', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/HCI2/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Login
    await navigateTo(page, '/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '9171234567');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL(getExpectedUrl('/home'), { timeout: 15000 });
    await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  });

  test('CONS-01: Consultation Form', async ({ page }) => {
    await navigateTo(page, '/consultation');
    await page.selectOption('select', 'SSS');
    await page.fill('input[placeholder="Brief description of your concern"]', 'Test Subject');
    await page.fill('textarea', 'Test Message');
    await page.locator('button:has-text("Submit Concern")').click();
    await expect(page.locator('text=Concern Submitted!')).toBeVisible();
  });

  test('EREP-01: eReport Form', async ({ page }) => {
    await navigateTo(page, '/ereport');
    await page.locator('button:has-text("Broken Infrastructure")').click();
    await page.fill('input[placeholder="e.g., Barangay Bahay Toro, Quezon City"]', 'QC');
    await page.fill('textarea', 'Pothole on Main St.');
    await page.locator('button:has-text("Submit Report")').click();
    await expect(page.locator('text=Report Submitted!')).toBeVisible();
  });

  test('PAY-01: eGovPay Form', async ({ page }) => {
    await navigateTo(page, '/egovpay');
    await page.locator('button', { hasText: 'SSS Contribution' }).click();
    await page.locator('button:has-text("GCash")').click();
    await page.locator('button:has-text("Pay ₱")').click();
    await expect(page.locator('text=Payment Successful!')).toBeVisible();
  });

  test('EMP-01: Employment Listing', async ({ page }) => {
    await navigateTo(page, '/employment');
    await expect(page.locator('text=Government Jobs')).toBeVisible();
    
    // Open a job
    await page.locator('text=Administrative Aide VI').first().click();
    await expect(page.locator('button', { hasText: /^Apply Now \(Demo\)$/ })).toBeVisible();
  });

  test('AI-01: eGov AI Chatbot', async ({ page }) => {
    await navigateTo(page, '/egov-ai');
    await page.fill('input[type="text"]', 'NBI');
    await page.locator('button[aria-label="Send message"]').click();
    
    // Check reply
    await expect(page.locator('text=To get an **NBI Clearance**')).toBeVisible({ timeout: 10000 });
  });

  test('WEATH-01: Weather Data', async ({ page }) => {
    await navigateTo(page, '/weather');
    await expect(page.locator('text=Quezon City')).toBeVisible();
    await expect(page.locator('text=Hourly Forecast')).toBeVisible();
  });

  test('SPEED-01: Speed Test', async ({ page }) => {
    await navigateTo(page, '/speedtest');
    await page.locator('button:has-text("GO")').click();
    await expect(page.locator('text=Complete')).toBeVisible({ timeout: 15000 });
  });
});
