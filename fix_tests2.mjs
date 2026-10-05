import fs from 'fs';
import path from 'path';

const testDir = path.join(process.cwd(), 'tests', 'e2e');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.ts'));

for (const file of files) {
  const p = path.join(testDir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  content = content.replace(/page\.goto\(['"]\/['"]\)/g, "page.goto('/HCI2/')");
  
  fs.writeFileSync(p, content, 'utf-8');
}
console.log('Fixed root URLs in tests');
