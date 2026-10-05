import fs from 'fs';
import path from 'path';

const testDir = path.join(process.cwd(), 'tests', 'e2e');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.ts'));

for (const file of files) {
  const p = path.join(testDir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  if (!content.includes('navigateTo')) {
    content = `import { navigateTo, getExpectedUrl } from './utils/nav';\n` + content;
  }
  
  // Replace page.goto('/path') -> navigateTo(page, '/path')
  // We have to be careful not to replace goto that already uses navigateTo
  // e.g. page.goto('/welcome') -> navigateTo(page, '/welcome')
  content = content.replace(/page\.goto\((['"]\/[^'"]+['"])\)/g, 'navigateTo(page, $1)');
  
  // replace wait for url: page.waitForURL('**/path'...) -> page.waitForURL(getExpectedUrl('/path')...)
  // Some wait for url are like '**/home' or '**/verify/pcn'
  content = content.replace(/page\.waitForURL\(['"]\*\*(\/[^'"]+)['"]/g, "page.waitForURL(getExpectedUrl('$1')");
  
  fs.writeFileSync(p, content, 'utf-8');
}
console.log('Fixed URLs in tests');
