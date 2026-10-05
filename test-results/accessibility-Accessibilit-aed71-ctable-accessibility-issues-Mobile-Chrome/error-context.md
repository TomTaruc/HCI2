# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility (Tier 1) >> Home screen should not have any automatically detectable accessibility issues
- Location: tests\e2e\accessibility.spec.ts:19:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 233

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
+               "bgColor": "#0038a8",
+               "contrastRatio": 4.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99afdc",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.46 (foreground color: #99afdc, background color: #0038a8, font size: 8.3pt (11px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"bg-primary rounded-lg p-5 flex items-center gap-4 min-h-[110px] relative overflow-hidden\" style=\"opacity: 1; transform: none;\">",
+                 "target": Array [
+                   ".p-5",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.46 (foreground color: #99afdc, background color: #0038a8, font size: 8.3pt (11px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-xs font-bold text-white/60 uppercase tracking-wider mb-1\">Bagong Pilipinas</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".flex-1.z-10.relative > .text-white\\/60.uppercase.tracking-wider",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0038a8",
+               "contrastRatio": 4.46,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99afdc",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.46 (foreground color: #99afdc, background color: #0038a8, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"bg-primary rounded-lg p-4 text-left hover:bg-primary-dark transition-colors active:scale-[0.99] relative overflow-hidden\">",
+                 "target": Array [
+                   ".hover\\:bg-primary-dark",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.46 (foreground color: #99afdc, background color: #0038a8, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<div class=\"text-xs text-white/60 uppercase tracking-wider mb-1\">Powered by eNGA</div>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".hover\\:bg-primary-dark > .text-white\\/60.uppercase.tracking-wider",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 2.96,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#89909f",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<main class=\"flex-1 flex flex-col bg-bg overflow-y-auto  pb-24 gap-0 pb-28\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-xs font-semibold leading-tight text-center text-text-secondary opacity-70\">NGAs</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "button[aria-label=\"NGAs — requires verification\"] > .opacity-70.text-center.leading-tight",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 2.96,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#89909f",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<main class=\"flex-1 flex flex-col bg-bg overflow-y-auto  pb-24 gap-0 pb-28\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-xs font-semibold leading-tight text-center text-text-secondary opacity-70\">LGUs</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "button[aria-label=\"LGUs — requires verification\"] > .opacity-70.text-center.leading-tight",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 2.96,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#89909f",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<main class=\"flex-1 flex flex-col bg-bg overflow-y-auto  pb-24 gap-0 pb-28\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-xs font-semibold leading-tight text-center text-text-secondary opacity-70\">OFW</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "button[aria-label=\"OFW — requires verification\"] > .opacity-70.text-center.leading-tight",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 2.96,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#89909f",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<main class=\"flex-1 flex flex-col bg-bg overflow-y-auto  pb-24 gap-0 pb-28\">",
+                 "target": Array [
+                   "main",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.96 (foreground color: #89909f, background color: #f4f6fa, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"text-xs font-semibold leading-tight text-center text-text-secondary opacity-70\">Health</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "button[aria-label=\"Health — requires verification\"] > .opacity-70.text-center.leading-tight",
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
- generic [ref=f1e3]:
  - generic [ref=f1e4]:
    - banner [ref=f1e5]:
      - generic [ref=f1e16]:
        - generic [ref=f1e17]: eGOVPH
        - generic [ref=f1e18]: Beta
      - button "Notifications, 2 unread" [ref=f1e20]:
        - generic [ref=f1e24]: "2"
    - main [ref=f1e26]:
      - generic [ref=f1e27]:
        - generic [ref=f1e28]:
          - generic [ref=f1e29]:
            - paragraph [ref=f1e30]: Quezon City, Metro Manila
            - heading "Mabuhay, Juan!" [level=1] [ref=f1e34]
            - button "Verify account to unlock all services" [ref=f1e35]
          - generic [ref=f1e38]: J
        - button "Search government services" [ref=f1e40]:
          - generic [ref=f1e44]: Search Services like eTravel
      - generic [ref=f1e46]:
        - button "Travel" [ref=f1e47]
        - button "Health" [ref=f1e52]
        - button "Jobs" [ref=f1e58]
        - button "Report" [ref=f1e64]
        - button "Weather" [ref=f1e69]
        - button "eGov AI" [ref=f1e78]
      - generic [ref=f1e84]:
        - generic [ref=f1e87]:
          - generic [ref=f1e88]: Bagong Pilipinas
          - paragraph [ref=f1e89]: Bagong Pilipinas eGovPH Serbisyo Hub
          - button "Avail Services →" [ref=f1e90]
        - generic:
          - button "Slide 1"
          - button "Slide 2"
          - button "Slide 3"
      - generic [ref=f1e96]:
        - button "Quezon City 32°C Partly cloudy Weather and Alerts →" [ref=f1e97]:
          - generic [ref=f1e98]: Quezon City
          - generic [ref=f1e102]: 32°C
          - generic [ref=f1e103]: Partly cloudy
          - generic [ref=f1e104]: Weather and Alerts →
        - button "Signal Tester 9.2 Mbps Tap to test →" [ref=f1e108]:
          - generic [ref=f1e109]: Signal Tester
          - generic [ref=f1e114]: "9.2"
          - generic [ref=f1e115]: Mbps
          - generic [ref=f1e116]: Tap to test →
      - button [ref=f1e123]:
        - generic [ref=f1e127]:
          - paragraph [ref=f1e128]: eGov AI Assistant
          - paragraph [ref=f1e129]: Ask about government services, requirements, and local network status.
      - generic [ref=f1e132]:
        - heading "Featured eGov Services" [level=2] [ref=f1e134]
        - generic [ref=f1e135]:
          - button "Powered by eNGA National Government Services National Documents" [ref=f1e136]:
            - generic [ref=f1e137]: Powered by eNGA
            - paragraph [ref=f1e138]: National Government Services
            - paragraph [ref=f1e139]: National Documents
          - button "Powered by eLGU Local Government Services Local Documents" [ref=f1e149]:
            - generic [ref=f1e150]: Powered by eLGU
            - paragraph [ref=f1e151]: Local Government Services
            - paragraph [ref=f1e152]: Local Documents
      - generic [ref=f1e157]:
        - heading "All Services" [level=2] [ref=f1e159]
        - generic [ref=f1e160]:
          - button "NGAs — requires verification" [ref=f1e161]:
            - generic [ref=f1e170]: NGAs
          - button "LGUs — requires verification" [ref=f1e171]:
            - generic [ref=f1e178]: LGUs
          - button "Jobs" [ref=f1e179]:
            - generic [ref=f1e180]: New
          - button "Tourism" [ref=f1e186]
          - button "Travel" [ref=f1e194]
          - button "OFW — requires verification" [ref=f1e199]:
            - generic [ref=f1e209]: OFW
          - button "Health — requires verification" [ref=f1e210]:
            - generic [ref=f1e218]: Health
          - button "Report" [ref=f1e219]
        - button "Show More (4 more)" [ref=f1e224]
      - generic [ref=f1e225]:
        - generic [ref=f1e226]:
          - heading "Popular Destinations" [level=2] [ref=f1e227]
          - button "See all" [ref=f1e228]
        - generic [ref=f1e229]:
          - button "Coron destination" [ref=f1e230]:
            - generic [ref=f1e231]: Coron
          - button "Boracay destination" [ref=f1e238]:
            - generic [ref=f1e239]: Boracay
          - button "Siargao destination" [ref=f1e245]:
            - generic [ref=f1e246]: Siargao
          - button "Batanes destination" [ref=f1e252]:
            - generic [ref=f1e253]: Batanes
  - navigation "Main navigation" [ref=f1e259]:
    - generic [ref=f1e260]:
      - link "Home" [ref=f1e261] [cursor=pointer]:
        - /url: "#/home"
      - link "News" [ref=f1e268] [cursor=pointer]:
        - /url: "#/news"
      - link "Mobile ID" [ref=f1e274] [cursor=pointer]:
        - /url: "#/mobile-id"
      - link "Scan QR" [ref=f1e281] [cursor=pointer]:
        - /url: "#/scan"
      - link "Account" [ref=f1e289] [cursor=pointer]:
        - /url: "#/account"
```

# Test source

```ts
  1  | import { navigateTo, getExpectedUrl } from './utils/nav';
  2  | import { test, expect } from '@playwright/test';
  3  | import AxeBuilder from '@axe-core/playwright';
  4  | 
  5  | test.describe('Accessibility (Tier 1)', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto('/HCI2/');
  8  |     await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });
  9  |     await page.reload();
  10 |     // Login as verified user
  11 |     await navigateTo(page, '/welcome');
  12 |     await page.locator('button:has-text("Log In")').click();
  13 |     await page.fill('input[type="tel"]', '9171234567');
  14 |     await page.locator('button:has-text("Continue")').click();
  15 |     for (let i = 0; i < 6; i++) await page.locator('button:has-text("1")').first().click();
  16 |     await page.waitForURL(getExpectedUrl('/home'), { timeout: 15000 });
  17 |   });
  18 | 
  19 |   test('Home screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  20 |     await navigateTo(page, '/home');
  21 |     await page.waitForTimeout(500);
  22 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
> 23 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  24 |   });
  25 | 
  26 |   test('Mobile ID screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  27 |     await navigateTo(page, '/mobile-id');
  28 |     await page.waitForTimeout(500);
  29 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
  30 |     expect(accessibilityScanResults.violations).toEqual([]);
  31 |   });
  32 | 
  33 |   test('Verify Intro screen should not have any automatically detectable accessibility issues', async ({ page }) => {
  34 |     await navigateTo(page, '/verify');
  35 |     await page.waitForTimeout(500);
  36 |     const accessibilityScanResults = await new AxeBuilder({ page }).disableRules(['meta-viewport', 'scrollable-region-focusable']).analyze();
  37 |     expect(accessibilityScanResults.violations).toEqual([]);
  38 |   });
  39 | });
  40 | 
```