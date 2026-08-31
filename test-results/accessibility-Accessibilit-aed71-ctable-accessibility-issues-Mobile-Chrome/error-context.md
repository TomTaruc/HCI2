# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility (Tier 1) >> Home screen should not have any automatically detectable accessibility issues
- Location: tests\e2e\accessibility.spec.ts:18:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 134

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.21,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#dee1e7",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.21 (foreground color: #dee1e7, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"phone-frame\">",
+                 "target": Array [
+                   ".phone-frame",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.21 (foreground color: #dee1e7, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-xs font-bold text-white/60 uppercase tracking-wider mb-1\">Bagong Pilipinas</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".flex-1 > .text-white\\/60.uppercase.tracking-wider",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.21,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#dee1e7",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.21 (foreground color: #dee1e7, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"phone-frame\">",
+                 "target": Array [
+                   ".phone-frame",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.21 (foreground color: #dee1e7, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-h2 font-bold text-white leading-tight\">Bagong Pilipinas eGovPH Serbisyo Hub</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".flex-1 > .text-h2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6f9",
+               "contrastRatio": 1.19,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e1e2e6",
+               "fontSize": "10.0pt (13.3333px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.19 (foreground color: #e1e2e6, background color: #f4f6f9, font size: 10.0pt (13.3333px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"text-body-sm font-semibold mt-1 text-white opacity-80 hover:opacity-100\">Avail Services →</button>",
+                 "target": Array [
+                   ".opacity-80",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"phone-frame\">",
+                 "target": Array [
+                   ".phone-frame",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.19 (foreground color: #e1e2e6, background color: #f4f6f9, font size: 10.0pt (13.3333px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button class=\"text-body-sm font-semibold mt-1 text-white opacity-80 hover:opacity-100\">Avail Services →</button>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".opacity-80",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=f3e3]:
  - generic [ref=f3e4]:
    - banner [ref=f3e5]:
      - generic [ref=f3e16]:
        - generic [ref=f3e17]: eGOVPH
        - generic [ref=f3e18]: Beta
      - button "Notifications, 3 unread" [ref=f3e20]:
        - generic [ref=f3e24]: "3"
    - main [ref=f3e26]:
      - generic [ref=f3e27]:
        - generic [ref=f3e28]:
          - generic [ref=f3e29]:
            - paragraph [ref=f3e30]: Quezon City, Metro Manila
            - heading "Mabuhay, Juan!" [level=1] [ref=f3e34]
            - button "⚠ Verify account to unlock all services" [ref=f3e35]
          - generic [ref=f3e36]: J
        - button "Search government services" [ref=f3e38]:
          - generic [ref=f3e42]: Search Services like eTravel
      - generic [ref=f3e44]:
        - button "✈️ Travel" [ref=f3e45]:
          - generic [ref=f3e46]: ✈️
          - generic [ref=f3e47]: Travel
        - button "❤️ Health" [ref=f3e48]:
          - generic [ref=f3e49]: ❤️
          - generic [ref=f3e50]: Health
        - button "💼 Jobs" [ref=f3e51]:
          - generic [ref=f3e52]: 💼
          - generic [ref=f3e53]: Jobs
        - button "📋 Report" [ref=f3e54]:
          - generic [ref=f3e55]: 📋
          - generic [ref=f3e56]: Report
        - button "☀️ Weather" [ref=f3e57]:
          - generic [ref=f3e58]: ☀️
          - generic [ref=f3e59]: Weather
        - button "💬 eGov AI" [ref=f3e60]:
          - generic [ref=f3e61]: 💬
          - generic [ref=f3e62]: eGov AI
      - generic [ref=f3e64]:
        - generic [ref=f3e66]:
          - generic [ref=f3e67]:
            - generic [ref=f3e68]: Bagong Pilipinas
            - paragraph [ref=f3e69]: Bagong Pilipinas eGovPH Serbisyo Hub
            - button "Avail Services →" [ref=f3e70]
          - generic [ref=f3e71]: 🏛️
        - generic [ref=f3e72]:
          - button "Slide 1" [ref=f3e73]
          - button "Slide 2" [ref=f3e74]
          - button "Slide 3" [ref=f3e75]
      - generic [ref=f3e76]:
        - button "Quezon City 32°C Partly Cloudy Weather and Alerts →" [ref=f3e77]:
          - generic [ref=f3e78]: Quezon City
          - generic [ref=f3e85]: 32°C
          - generic [ref=f3e86]: Partly Cloudy
          - generic [ref=f3e87]: Weather and Alerts →
        - button "Signal Tester -- Mbps Tap to test →" [ref=f3e88]:
          - generic [ref=f3e89]: Signal Tester
          - generic [ref=f3e94]: "--"
          - generic [ref=f3e95]: Mbps
          - generic [ref=f3e96]: Tap to test →
      - button [ref=f3e98]:
        - generic [ref=f3e102]:
          - paragraph [ref=f3e103]: eGov AI Assistant
          - paragraph [ref=f3e104]: Ask about government services, requirements, and how to use the app.
      - generic [ref=f3e107]:
        - heading "Featured eGov Services" [level=2] [ref=f3e109]
        - generic [ref=f3e110]:
          - button "Powered by eNGA National Government Services National Documents" [ref=f3e111]:
            - generic [ref=f3e112]: Powered by eNGA
            - paragraph [ref=f3e113]: National Government Services
            - paragraph [ref=f3e114]: National Documents
          - button "Powered by eLGU Local Government Services Local Documents" [ref=f3e118]:
            - generic [ref=f3e119]: Powered by eLGU
            - paragraph [ref=f3e120]: Local Government Services
            - paragraph [ref=f3e121]: Local Documents
      - generic [ref=f3e122]:
        - heading "All Services" [level=2] [ref=f3e124]
        - generic [ref=f3e125]:
          - button "NGAs — requires verification" [ref=f3e126]:
            - generic [ref=f3e127]: 🏛️
            - generic [ref=f3e132]: NGAs
          - button "LGUs — requires verification" [ref=f3e133]:
            - generic [ref=f3e134]: 🏙️
            - generic [ref=f3e139]: LGUs
          - button "Jobs" [ref=f3e140]:
            - generic [ref=f3e141]:
              - generic [ref=f3e142]: 💼
              - generic [ref=f3e143]: New
          - button "Tourism" [ref=f3e145]:
            - generic [ref=f3e146]: 🌴
          - button "Travel" [ref=f3e149]:
            - generic [ref=f3e150]: ✈️
          - button "OFW — requires verification" [ref=f3e153]:
            - generic [ref=f3e154]: 🌏
            - generic [ref=f3e159]: OFW
          - button "Health — requires verification" [ref=f3e160]:
            - generic [ref=f3e161]: ❤️
            - generic [ref=f3e166]: Health
          - button "Report" [ref=f3e167]:
            - generic [ref=f3e168]: 📋
        - button "Show More (4 more)" [ref=f3e171]
      - generic [ref=f3e172]:
        - generic [ref=f3e173]:
          - heading "Popular Destinations" [level=2] [ref=f3e174]
          - button "See all" [ref=f3e175]
        - generic [ref=f3e176]:
          - button "Coron destination" [ref=f3e177]:
            - generic [ref=f3e178]:
              - generic [ref=f3e179]: 🏝️
              - generic [ref=f3e180]: Coron
          - button "Boracay destination" [ref=f3e181]:
            - generic [ref=f3e182]:
              - generic [ref=f3e183]: 🌊
              - generic [ref=f3e184]: Boracay
          - button "Siargao destination" [ref=f3e185]:
            - generic [ref=f3e186]:
              - generic [ref=f3e187]: 🏄
              - generic [ref=f3e188]: Siargao
          - button "Batanes destination" [ref=f3e189]:
            - generic [ref=f3e190]:
              - generic [ref=f3e191]: 🌬️
              - generic [ref=f3e192]: Batanes
  - navigation "Main navigation" [ref=f3e193]:
    - generic [ref=f3e194]:
      - link "Home" [ref=f3e195] [cursor=pointer]:
        - /url: /home
      - link "News" [ref=f3e201] [cursor=pointer]:
        - /url: /news
      - link "Mobile ID" [ref=f3e207] [cursor=pointer]:
        - /url: /mobile-id
      - link "Scan QR" [ref=f3e214] [cursor=pointer]:
        - /url: /scan
      - link "Account" [ref=f3e222] [cursor=pointer]:
        - /url: /account
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
  11 |     await page.locator('button:has-text("Log In")').click();
  12 |     await page.fill('input[type="tel"]', '09171234567');
  13 |     await page.locator('button:has-text("Continue")').click();
  14 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  15 |     await page.waitForURL('**/home', { timeout: 15000 });
  16 |   });
  17 | 
  18 |   test('Home screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  19 |     await page.goto('/home');
  20 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
> 21 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
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