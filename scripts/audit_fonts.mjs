import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) results = results.concat(walk(fp));
    else if (file.endsWith('.jsx') || file.endsWith('.tsx')) results.push(fp);
  });
  return results;
}

const files = walk('src');
const oversized = [];
const micro = [];

files.forEach(fp => {
  const lines = fs.readFileSync(fp, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!line.includes('fontSize')) return;
    const t = line.trim();
    const matches = t.match(/fontSize:\s*([^,}\n]+)/g);
    if (!matches) return;
    matches.forEach(match => {
      const raw = match.replace('fontSize:', '').trim().replace(/['"]/g, '').trim();
      const num = parseFloat(raw);
      if (!isNaN(num) && num <= 14) {
        micro.push({ file: fp, line: i + 1, val: raw });
      } else {
        oversized.push({ file: fp, line: i + 1, val: raw, content: t.substring(0, 120) });
      }
    });
  });
});

console.log('=== OVERSIZED (>14px or clamp/rem/vw) ===');
oversized.forEach(o => console.log(`${o.file}:${o.line} => ${o.val}`));
console.log(`\nTotal oversized: ${oversized.length}`);
console.log('\n=== MICRO UI CHROME (<=14px numeric) ===');
micro.forEach(o => console.log(`${o.file}:${o.line} => ${o.val}`));
console.log(`\nTotal micro: ${micro.length}`);
