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

  // 1. & 2. Headings
  const headingReplacer = (tag, newClasses) => {
    content = content.replace(new RegExp(`(<${tag}\\b[^>]*)(className=["'])([^"']*)(["'])`, 'gi'), (match, prefix, classAttr, classes, quote) => {
      // remove old text/font/leading/tracking classes
      let c = classes.replace(/\b(?:sm:|md:|lg:|xl:)?text-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?font-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?leading-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?tracking-[a-z0-9\[\]\-]+\b/g, '');
      // add new classes
      c = (c.trim() + ' ' + newClasses).trim().replace(/\s+/g, ' ');
      return `${prefix}${classAttr}${c}${quote}`;
    });

    // Also strip inline typography styles from these tags
    content = content.replace(new RegExp(`(<${tag}\\b[^>]*)style={{([^}]*)}}`, 'gi'), (match, prefix, styleContent) => {
      let s = styleContent;
      s = s.replace(/fontSize:\s*('[^']*'|"[^"]*"|`[^`]*`|\d+),?/g, '');
      s = s.replace(/fontWeight:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
      s = s.replace(/letterSpacing:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
      s = s.replace(/lineHeight:\s*('[^']*'|"[^"]*"|\d+(\.\d+)?),?/g, '');
      // clean up commas
      s = s.replace(/,\s*,/g, ',');
      s = s.replace(/{\s*,/g, '{');
      return `${prefix}style={{${s}}}`;
    });
  };

  headingReplacer('h1', 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.035em]');
  headingReplacer('h2', 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.035em]');
  headingReplacer('h3', 'text-xl sm:text-2xl font-bold tracking-tight');
  headingReplacer('h4', 'text-xl sm:text-2xl font-bold tracking-tight');

  // 3. Paragraphs
  content = content.replace(/(<p\b[^>]*className=["'])([^"']*)(["'])/gi, (match, prefix, classes, quote) => {
    let c = classes;
    if (c.includes('text-sm')) {
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?leading-[a-z0-9\[\]\-]+\b/g, '');
      c = (c.trim() + ' leading-relaxed').replace(/\s+/g, ' ');
    } else {
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?text-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?leading-[a-z0-9\[\]\-]+\b/g, '');
      c = (c.trim() + ' text-base leading-relaxed').replace(/\s+/g, ' ');
    }
    return `${prefix}${c}${quote}`;
  });

  // 4. Micro-labels & Eyebrows
  // We'll target spans/divs with uppercase and letterSpacing (or tracking) that are very small
  content = content.replace(/(<(?:span|div)\b[^>]*className=["'])([^"']*)(["'])([^>]*style={{([^}]*)}})?/gi, (match, prefix, classes, quote, styleBlock, styleContent) => {
    let c = classes;
    let s = styleContent || '';
    
    // Detect micro label
    const isMicro = (c.includes('uppercase') || s.includes('textTransform:')) && 
                    (c.includes('text-xs') || c.includes('text-[10px]') || c.includes('text-[11px]') || s.includes('fontSize: 9') || s.includes('fontSize: 10') || s.includes('fontSize: 11') || s.includes("fontSize: '10px'") || s.includes("fontSize: '11px'"));
                    
    if (isMicro) {
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?text-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?font-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?tracking-[a-z0-9\[\]\-]+\b/g, '');
      c = (c.trim() + ' text-[10px] font-bold uppercase tracking-widest').replace(/\s+/g, ' ');

      if (styleBlock) {
        s = s.replace(/fontSize:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
        s = s.replace(/fontWeight:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
        s = s.replace(/letterSpacing:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
        s = s.replace(/textTransform:\s*('[^']*'|"[^"]*"),?/g, '');
        return `${prefix}${c}${quote} style={{${s}}}`;
      }
    }
    return match;
  });

  // 5. CTAs and Inputs
  // Target anchor tags with 'btn' or 'cta' or buttons
  content = content.replace(/(<(?:button|a)\b[^>]*className=["'])([^"']*)(["'])([^>]*style={{([^}]*)}})?/gi, (match, prefix, classes, quote, styleBlock, styleContent) => {
    let c = classes;
    let s = styleContent || '';

    const isCTA = match.toLowerCase().includes('btn') || match.toLowerCase().includes('cta') || prefix.startsWith('<button');

    if (isCTA) {
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?text-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?font-[a-z0-9\[\]\-]+\b/g, '');
      c = c.replace(/\b(?:sm:|md:|lg:|xl:)?tracking-[a-z0-9\[\]\-]+\b/g, '');
      c = (c.trim() + ' text-sm font-bold uppercase tracking-widest').replace(/\s+/g, ' ');

      if (styleBlock) {
        s = s.replace(/fontSize:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
        s = s.replace(/fontWeight:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
        s = s.replace(/letterSpacing:\s*('[^']*'|"[^"]*"|\d+),?/g, '');
        return `${prefix}${c}${quote} style={{${s}}}`;
      }
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
