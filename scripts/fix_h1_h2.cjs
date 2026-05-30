const fs = require('fs');
const path = require('path');
function walk(d) {
  let res = [];
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) res = res.concat(walk(p));
    else if (p.endsWith('.jsx')) res.push(p);
  });
  return res;
}
const files = walk('src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = content.replace(/(<(?:h1|h2)\b[^>]*className=["'])([^"']*)(["'])/gi, (match, prefix, classes, quote) => {
    let cleaned = classes.replace(/\] font-bold \.1\] \.035em\] text-5xl text-4xl md:text-5xl/g, '');
    cleaned = cleaned.replace(/text-5xl md:text-6xl lg:text-\[4rem\] leading-\[1\.1\] tracking-\[-0\.035em\]/g, '');
    cleaned = cleaned.replace(/text-4xl md:text-5xl lg:text-\[4rem\] leading-\[1\.1\] tracking-\[-0\.035em\]/g, '');
    cleaned = cleaned.replace(/text-[4-6]xl/g, '');
    cleaned = cleaned.replace(/md:text-[4-6]xl/g, '');
    cleaned = cleaned.replace(/lg:text-\[[^\]]+\]/g, '');
    cleaned = cleaned.replace(/font-bold/g, '');
    cleaned = cleaned.replace(/leading-\[[^\]]+\]/g, '');
    cleaned = cleaned.replace(/tracking-\[[^\]]+\]/g, '');
    cleaned = cleaned.replace(/\]|\.1\]|\.035em\]/g, ''); // catch stray fragments
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    let finalClass = (cleaned + ' text-5xl md:text-6xl lg:text-[4rem] font-bold leading-[1.1] tracking-[-0.035em]').trim();
    return prefix + finalClass + quote;
  });
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed', f);
  }
});
