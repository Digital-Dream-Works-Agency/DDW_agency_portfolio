const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // 1. Cap massive clamp() font sizes
  content = content.replace(/fontSize:\s*(['"`]?)clamp\([^,]+,\s*[^,]+,\s*(\d+)px\)\1/g, (match, quote, maxPx) => {
    if (parseInt(maxPx) > 52) {
      return `fontSize: ${quote}clamp(32px, 4vw, 48px)${quote}`;
    }
    return match;
  });

  // 2. Headings capped
  // Force H1 and H2
  ['h1', 'h2'].forEach(tag => {
    content = content.replace(new RegExp(`(<${tag}\\b[^>]*className=["'])([^"']*)(["'])`, 'gi'), (match, prefix, classes, quote) => {
      let c = classes.replace(/\b(?:sm:|md:|lg:|xl:)?text-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?leading-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?tracking-[a-z0-9\[\]\-]+\b/g, '');
      c = (c.trim() + ' text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] tracking-[-0.035em]').trim().replace(/\s+/g, ' ');
      return `${prefix}${c}${quote}`;
    });
  });

  // 3. Force font-weight 700 globally on big numbers / in styles
  content = content.replace(/\bfont-black\b/g, 'font-bold');
  content = content.replace(/\bfont-extrabold\b/g, 'font-bold');
  content = content.replace(/fontWeight:\s*['"]?(?:800|900|black|extrabold)['"]?/g, 'fontWeight: 700');

  // For span/div with large texts, cap them.
  // We'll replace text-6xl, text-7xl, text-8xl, text-9xl with text-4xl md:text-5xl
  content = content.replace(/\b(?:sm:|md:|lg:|xl:)?text-[6-9]xl\b/g, 'text-4xl md:text-5xl');
  content = content.replace(/\b(?:sm:|md:|lg:|xl:)?text-\[[^\]]+vw\]\b/g, 'text-4xl md:text-5xl');

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
