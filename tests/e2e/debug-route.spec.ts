import { test, expect } from '@playwright/test';
test('Test route', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  await page.goto('http://localhost:5173/HCI2/');
  await page.evaluate(() => { 
    localStorage.clear(); 
    localStorage.setItem('egov_disclaimerShown', 'true'); 
  });
  await page.reload();
  await page.goto('http://localhost:5173/HCI2/#/welcome');
  await page.locator('button:has-text("Log In")').click();
  await page.fill('input[type="tel"]', '9189876543');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);
  for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  await page.waitForTimeout(2000);
  
  await page.goto('http://localhost:5173/HCI2/#/agencies/sss/services/contribution');
  await page.waitForTimeout(2000);
});
