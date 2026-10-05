import fs from 'fs';
import path from 'path';

const testDir = path.join(process.cwd(), 'tests', 'e2e');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.ts'));

for (const file of files) {
  const p = path.join(testDir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  // Replace 11 digit local numbers with 10 digits starting with 9 in tests
  content = content.replace(/09171234567/g, '9171234567');
  content = content.replace(/09189876543/g, '9189876543');
  content = content.replace(/09998887777/g, '9998887777'); // Any other common mock? Let's use regex
  
  // Generic replace for any 11-digit 09XX numbers typed in fill commands
  content = content.replace(/fill\(([^,]+),\s*['"]09(\d{9})['"]\)/g, "fill($1, '9$2')");
  
  fs.writeFileSync(p, content, 'utf-8');
}
console.log('Fixed phone numbers in tests');
