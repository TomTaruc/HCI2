import os
import glob
import re

for file in glob.glob('tests/e2e/*.spec.ts'):
    if 'auth.spec.ts' in file: continue
    with open(file, 'r', encoding='utf-8') as f: content = f.read()
    
    content = re.sub(
        r"await page.evaluate\(\(\) => localStorage.clear\(\)\);\n\s*await page.reload\(\);\n\s*await page.locator\('button:has-text\(\"I understand — Proceed\"\)'\).click\(\{ force: true \}\);",
        "await page.evaluate(() => { localStorage.clear(); localStorage.setItem('egov_disclaimerShown', 'true'); });\n    await page.reload();",
        content
    )
    
    with open(file, 'w', encoding='utf-8') as f: f.write(content)
