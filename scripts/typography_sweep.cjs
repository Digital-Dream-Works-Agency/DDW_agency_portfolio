const fs = require('fs');
const path = require('path');

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

  // 1. Weight Cap
  content = content.replace(/font-black/g, 'font-bold');
  content = content.replace(/font-extrabold/g, 'font-bold');
  content = content.replace(/fontWeight:\s*900/g, 'fontWeight: 700');
  content = content.replace(/fontWeight:\s*800/g, 'fontWeight: 700');
  content = content.replace(/fontWeight:\s*'black'/g, "fontWeight: 'bold'");
  content = content.replace(/fontWeight:\s*"black"/g, 'fontWeight: "bold"');

  // 2. Minimum Size Baseline
  content = content.replace(/\btext-xs\b/g, 'text-sm');
  content = content.replace(/text-\[10px\]/g, 'text-sm');

  // 3. Body Text Consistency (<p>)
  // Replace text-lg inside <p ...> tags
  content = content.replace(/<p\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    
    // Replace text-lg with text-base
    if (/\btext-lg\b/.test(newAttrs)) {
      newAttrs = newAttrs.replace(/\btext-lg\b/g, 'text-base');
    }

    // Ensure leading-relaxed is present if it's a paragraph with class
    if (newAttrs.includes('className=')) {
      if (!/\bleading-/.test(newAttrs)) {
        newAttrs = newAttrs.replace(/(className=(["']))/, `$1leading-relaxed `);
      }
      if (!/\btext-/.test(newAttrs) && !newAttrs.includes('text-base')) {
        newAttrs = newAttrs.replace(/(className=(["']))/, `$1text-base `);
      }
    } else {
      // No className, add one
      newAttrs = ` className="text-base leading-relaxed"` + newAttrs;
    }
    
    // Cleanup double spaces inside className
    newAttrs = newAttrs.replace(/className=(["'])\s+/, 'className=$1');
    return `<p${newAttrs}>`;
  });

  // 4. Heading Proportions
  // Ensure strict tracking on h1, h2, h3
  content = content.replace(/<h([1-3])\b([^>]*)>/gi, (match, tag, attrs) => {
    let newAttrs = attrs;
    // check if it has letterSpacing or tracking
    if (!/letterSpacing|tracking-/.test(newAttrs)) {
      if (newAttrs.includes('className=')) {
        newAttrs = newAttrs.replace(/(className=(["']))/, `$1tracking-tight `);
      } else {
        newAttrs = ` className="tracking-tight"` + newAttrs;
      }
    }
    return `<h${tag}${newAttrs}>`;
  });

  // 5. Vertical Rhythm & Spacing
  // Replace py-X and md:py-Y with standard py-8 md:py-12 lg:py-16
  content = content.replace(/\bpy-(20|24|32|40|48|64)\b(?:\s+(sm|md|lg|xl|2xl):py-\d+)*/g, 'py-8 md:py-12 lg:py-16');

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
