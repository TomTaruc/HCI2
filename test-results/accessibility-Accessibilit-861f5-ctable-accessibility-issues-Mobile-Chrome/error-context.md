# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility (Tier 1) >> Verify Intro screen should not have any automatically detectable accessibility issues
- Location: tests\e2e\accessibility.spec.ts:30:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 618

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
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "22.5pt (30px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 22.5pt (30px), font weight: bold). Expected contrast ratio of 3:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 22.5pt (30px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h1 class=\"text-h2 font-bold text-white\">Unlock Full Access</h1>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".p-5 > div > h1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-white/80 text-body-sm mt-1\">Verify your identity to access your Digital ID wallet, government agency portals, and all eGovPH services.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-white\\/80",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "16.9pt (22.5px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 16.9pt (22.5px), font weight: bold). Expected contrast ratio of 3:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 16.9pt (22.5px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h2 class=\"text-h2 font-semibold text-text-primary\">What you'll need</h2>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".gap-2.flex-col.flex:nth-child(2) > h2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-primary\">Your personal information (full legal name, date of birth, sex, address)</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".border.p-3.bg-white:nth-child(1) > .text-body-sm.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-primary\">Your PhilSys Card Number (the 12-digit number on your National ID)</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".border.p-3.bg-white:nth-child(2) > .text-body-sm.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-primary\">Good lighting for the liveness check</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".border.p-3.bg-white:nth-child(3) > .text-body-sm.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "16.9pt (22.5px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 16.9pt (22.5px), font weight: bold). Expected contrast ratio of 3:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 16.9pt (22.5px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h2 class=\"text-h2 font-semibold text-text-primary\">Verification steps</h2>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".gap-2.flex-col.flex:nth-child(3) > h2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body font-semibold text-text-primary\">Personal Information</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(2) > div:nth-child(2) > .text-body.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-secondary\">Enter your details exactly as they appear on your National ID.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(2) > div:nth-child(2) > .text-body-sm",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body font-semibold text-text-primary\">PhilSys Card Number</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(3) > div:nth-child(2) > .text-body.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-secondary\">Provide or scan the 12-digit number on your National ID card.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(3) > div:nth-child(2) > .text-body-sm",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body font-semibold text-text-primary\">Liveness Check</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(4) > div:nth-child(2) > .text-body.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-secondary\">A brief face verification to confirm your identity.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(4) > div:nth-child(2) > .text-body-sm",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body font-semibold text-text-primary\">Pending Verification</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(5) > div:nth-child(2) > .text-body.text-text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-text-secondary\">Your information is checked against PhilSys records.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".items-start.gap-3.flex:nth-child(5) > div:nth-child(2) > .text-body-sm",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.1,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e9ebf1",
+               "fontSize": "11.3pt (15px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
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
+   Element has insufficient color contrast of 1.1 (foreground color: #e9ebf1, background color: #f4f6fa, font size: 11.3pt (15px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-body-sm text-primary font-medium\">🔒 Your information is encrypted and used only to verify your identity against PhilSys records. It is never shared with third parties.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-primary",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f4f6fa",
+               "contrastRatio": 1.11,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e8eaee",
+               "fontSize": "10.0pt (13.3333px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.11 (foreground color: #e8eaee, background color: #f4f6fa, font size: 10.0pt (13.3333px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"inline-flex items-ce...\" tabindex=\"0\">",
+                 "target": Array [
+                   ".inline-flex",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.11 (foreground color: #e8eaee, background color: #f4f6fa, font size: 10.0pt (13.3333px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button class=\"inline-flex items-ce...\" tabindex=\"0\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".inline-flex",
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
      - button "Go back" [ref=f3e6]
      - heading "Verify Account" [level=1] [ref=f3e10]
    - main [ref=f3e11]:
      - generic [ref=f3e12]:
        - generic [ref=f3e17]:
          - heading "Unlock Full Access" [level=1] [ref=f3e18]
          - paragraph [ref=f3e19]: Verify your identity to access your Digital ID wallet, government agency portals, and all eGovPH services.
        - generic [ref=f3e20]:
          - heading "What you'll need" [level=2] [ref=f3e21]
          - generic [ref=f3e22]:
            - generic [ref=f3e23]:
              - generic [ref=f3e24]: 📋
              - paragraph [ref=f3e25]: Your personal information (full legal name, date of birth, sex, address)
            - generic [ref=f3e26]:
              - generic [ref=f3e27]: 🪪
              - paragraph [ref=f3e28]: Your PhilSys Card Number (the 12-digit number on your National ID)
            - generic [ref=f3e29]:
              - generic [ref=f3e30]: 📱
              - paragraph [ref=f3e31]: Good lighting for the liveness check
        - generic [ref=f3e32]:
          - heading "Verification steps" [level=2] [ref=f3e33]
          - generic [ref=f3e34]:
            - generic [ref=f3e35]: "1"
            - generic [ref=f3e37]:
              - paragraph [ref=f3e38]: Personal Information
              - paragraph [ref=f3e39]: Enter your details exactly as they appear on your National ID.
          - generic [ref=f3e40]:
            - generic [ref=f3e41]: "2"
            - generic [ref=f3e43]:
              - paragraph [ref=f3e44]: PhilSys Card Number
              - paragraph [ref=f3e45]: Provide or scan the 12-digit number on your National ID card.
          - generic [ref=f3e46]:
            - generic [ref=f3e47]: "3"
            - generic [ref=f3e49]:
              - paragraph [ref=f3e50]: Liveness Check
              - paragraph [ref=f3e51]: A brief face verification to confirm your identity.
          - generic [ref=f3e52]:
            - generic [ref=f3e53]: "4"
            - generic [ref=f3e55]:
              - paragraph [ref=f3e56]: Pending Verification
              - paragraph [ref=f3e57]: Your information is checked against PhilSys records.
        - paragraph [ref=f3e59]: 🔒 Your information is encrypted and used only to verify your identity against PhilSys records. It is never shared with third parties.
        - button "Start Verification" [ref=f3e60]
  - navigation "Main navigation" [ref=f3e61]:
    - generic [ref=f3e62]:
      - link "Home" [ref=f3e63] [cursor=pointer]:
        - /url: /home
      - link "News" [ref=f3e69] [cursor=pointer]:
        - /url: /news
      - link "Mobile ID" [ref=f3e75] [cursor=pointer]:
        - /url: /mobile-id
      - link "Scan QR" [ref=f3e82] [cursor=pointer]:
        - /url: /scan
      - link "Account" [ref=f3e90] [cursor=pointer]:
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
> 33 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  34 |   });
  35 | });
  36 | 
```