// scripts/inject-seo.mjs
// Post-processes prerendered HTML to inject correct per-page SEO meta.
// Runs automatically as part of `npm run build` via the postbuild hook.
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const DIST = resolve('dist');

const routes = {
  '/': {
    title: 'Digital Dream Works | Software Systems & Marketing Infrastructure',
    description: 'Retainer-based software systems and marketing infrastructure for US and EU companies. Custom software, AI automation, cloud deployment, and SEO — maintained by the team that built them.',
    canonical: 'https://digitaldreamworksagency.com/',
  },
  '/services': {
    title: 'Services | Digital Dream Works — 7 Retainer Service Areas',
    description: 'Seven retainer services: Custom Software, Web Development, AI Automation, Cloud Deployment, Marketing Systems, Software Consultancy, and SEO. One team, no handoffs.',
    canonical: 'https://digitaldreamworksagency.com/services',
  },
  '/projects': {
    title: 'Projects | Digital Dream Works',
    description: 'Production-grade software projects and marketing systems built and maintained by Digital Dream Works on retainer.',
    canonical: 'https://digitaldreamworksagency.com/projects',
  },
  '/case-studies': {
    title: 'Case Studies | Digital Dream Works',
    description: 'Real engagement outcomes from Digital Dream Works retainer clients across software, AI automation, cloud infrastructure, and marketing systems.',
    canonical: 'https://digitaldreamworksagency.com/case-studies',
  },
  '/about': {
    title: 'About | Digital Dream Works — Built By Engineers, Not Marketers',
    description: 'Digital Dream Works is a cross-functional team in Florida and Rome. We build and maintain software systems and marketing infrastructure on retainer for US and EU clients.',
    canonical: 'https://digitaldreamworksagency.com/about',
  },
  '/contact': {
    title: 'Contact | Digital Dream Works — Book a Discovery Call',
    description: 'Book a 20-minute discovery call with Digital Dream Works. We map your stack, identify constraints, and tell you plainly if we are the right fit.',
    canonical: 'https://digitaldreamworksagency.com/contact',
  },
};

const routeFiles = {
  '/': `${DIST}/index.html`,
  '/services': `${DIST}/services/index.html`,
  '/projects': `${DIST}/projects/index.html`,
  '/case-studies': `${DIST}/case-studies/index.html`,
  '/about': `${DIST}/about/index.html`,
  '/contact': `${DIST}/contact/index.html`,
};

for (const [route, meta] of Object.entries(routes)) {
  const filepath = routeFiles[route];
  try {
    let html = readFileSync(filepath, 'utf-8');

    // title
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);

    // meta description
    html = html.replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${meta.description}$2`
    );

    // canonical
    html = html.replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      `$1${meta.canonical}$2`
    );

    // og:title
    html = html.replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${meta.title}$2`
    );

    // og:description
    html = html.replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${meta.description}$2`
    );

    // og:url
    html = html.replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      `$1${meta.canonical}$2`
    );

    writeFileSync(filepath, html, 'utf-8');
    console.log(`[seo] ${route} -> ${meta.title.slice(0, 50)}...`);
  } catch {
    console.warn(`[seo] ${route}: file not found, skipping`);
  }
}
console.log('[seo] Done.');
