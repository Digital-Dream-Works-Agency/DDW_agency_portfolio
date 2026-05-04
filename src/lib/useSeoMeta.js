// src/lib/useSeoMeta.js — Per-page SEO meta hook
import { useEffect } from 'react';

const SITE_URL = 'https://digitaldreamworksagency.com';

export const useSeoMeta = ({ title, description, canonical }) => {
    useEffect(() => {
        if (title) document.title = title;
        const descEl = document.querySelector('meta[name="description"]');
        if (descEl && description) descEl.setAttribute('content', description);
        let canonicalEl = document.querySelector('link[rel="canonical"]');
        if (!canonicalEl) {
            canonicalEl = document.createElement('link');
            canonicalEl.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalEl);
        }
        if (canonical) canonicalEl.setAttribute('href', canonical);
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) ogTitle.setAttribute('content', title);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && description) ogDesc.setAttribute('content', description);
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl && canonical) ogUrl.setAttribute('content', canonical);
    }, [title, description, canonical]);
};

export const SEO = {
    home: {
        title: 'Digital Dream Works | Software Systems & Marketing Infrastructure',
        description: 'Retainer-based software systems and marketing infrastructure for US and EU companies. Custom software, AI automation, cloud deployment, and SEO — maintained by the team that built them.',
        canonical: `${SITE_URL}/`,
    },
    services: {
        title: 'Services | Digital Dream Works — 7 Retainer Service Areas',
        description: 'Seven retainer services: Custom Software, Web Development, AI Automation, Cloud Deployment, Marketing Systems, Software Consultancy, and SEO. One team, no handoffs.',
        canonical: `${SITE_URL}/services`,
    },
    projects: {
        title: 'Projects | Digital Dream Works',
        description: 'Production-grade software and marketing systems built and maintained by Digital Dream Works on retainer.',
        canonical: `${SITE_URL}/projects`,
    },
    caseStudies: {
        title: 'Case Studies | Digital Dream Works',
        description: 'Real engagement outcomes from Digital Dream Works retainer clients across software, AI automation, cloud infrastructure, and marketing systems.',
        canonical: `${SITE_URL}/case-studies`,
    },
    about: {
        title: 'About | Digital Dream Works — Built By Engineers, Not Marketers',
        description: 'Digital Dream Works is a cross-functional team in Florida and Rome building and maintaining software systems and marketing infrastructure on retainer.',
        canonical: `${SITE_URL}/about`,
    },
    contact: {
        title: 'Contact | Digital Dream Works — Book a Discovery Call',
        description: 'Book a 20-minute discovery call. We map your stack, identify constraints, and tell you plainly if DDW is the right fit.',
        canonical: `${SITE_URL}/contact`,
    },
};
