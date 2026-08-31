import { test, expect } from '@playwright/test';

test.describe('Tier 2 Features - BPESH & eTravel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    // Login
    await page.goto('/welcome');
    await page.locator('button:has-text("Log In")').click();
    await page.fill('input[type="tel"]', '09171234567');
    await page.locator('button:has-text("Continue")').click();
    await expect(page.locator('text=/Enter your 6-digit MPIN/')).toBeVisible();
    for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
    await page.waitForURL('**/home', { timeout: 15000 });
    await expect(page.locator('text=Mabuhay')).toBeVisible({ timeout: 15000 });
  });

  test('BPESH-01, 03, 04: NBI Clearance Appointment', async ({ page }) => {
    await page.goto('/bpesh/appointment');
    
    // Select Service
    await page.locator('button:has-text("NBI Clearance")').click();
    
    // Select Date/Time
    await expect(page.locator('text=Booking: NBI Clearance')).toBeVisible();
    await expect(page.locator('button:has-text("Review Appointment")')).toBeDisabled(); // empty required fields
    
    // Fill required
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateStr);
    await page.locator('button', { hasText: '10:00 AM' }).click();
    
    await page.locator('button:has-text("Review Appointment")').click();
    
    // Review
    await expect(page.locator('text=Review & Confirm')).toBeVisible();
    await page.locator('button:has-text("Confirm Appointment")').click();
    
    // Done
    await expect(page.locator('text=Appointment Booked!')).toBeVisible();
    await expect(page.locator('text=Reference Number')).toBeVisible();
  });

  test('ETRV-01: eTravel Form', async ({ page }) => {
    await page.goto('/etravel');
    
    // Type
    await page.locator('button:has-text("inbound Traveler")').click();
    
    // Personal
    await page.fill('input[placeholder="As on your passport"]', 'Maria'); // first match is First Name
    await page.locator('input[placeholder="As on your passport"]').nth(1).fill('Clara'); // Last Name
    await page.fill('input[placeholder="e.g., P1234567A"]', 'P1234567A');
    await page.locator('button:has-text("Continue")').click();
    
    // Travel
    await page.fill('input[placeholder="e.g., PR302"]', 'PR302');
    await page.locator('button:has-text("Continue")').click();
    
    // Health & Submit
    await page.locator('button:has-text("Submit Declaration")').click();
    
    // Done
    await expect(page.locator('text=Declaration Submitted!')).toBeVisible();
    await expect(page.locator('text=eTravel Reference Number')).toBeVisible();
  });

  test('ETRV-02: eTravel accessible logged out', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
    await page.reload();
    await page.goto('/etravel');
    await expect(page.locator('text=eTravel Declaration')).toBeVisible();
  });
});
