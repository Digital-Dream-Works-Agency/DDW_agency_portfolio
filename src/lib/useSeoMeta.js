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
        title: 'Digital Dream Works | Meta, Google, Amazon, TikTok & AI — Florida LLC',
        description: '$683K+ monthly Meta spend managed. $2.7M Amazon sales. 600% Google ROAS. TikTok Shop, SEO, AI software — Florida LLC with offices in Florida and Rome. All retainer.',
        canonical: `${SITE_URL}/`,
    },
    services: {
        title: 'Services | Digital Dream Works — Meta, Google, Amazon, TikTok, SEO & AI',
        description: 'Seven retainer services: Meta Ads, Google Ads, Amazon Management, TikTok Shop, SEO, AI Development, and SaaS Products. One team. US and EU markets.',
        canonical: `${SITE_URL}/services`,
    },
    projects: {
        title: 'Projects | Digital Dream Works — Real Accounts, Real Numbers',
        description: '$683K Meta spend managed, $2.7M Amazon sales, 600% Google ROAS, $290K TikTok GMV, 54K monthly SEO visitors — all from live DDW client accounts. Dashboard screenshots available.',
        canonical: `${SITE_URL}/projects`,
    },
    caseStudies: {
        title: 'Case Studies | Digital Dream Works',
        description: 'Verified results from DDW retainer clients — Meta, Google Ads, Amazon, TikTok Shop, SEO, and AI software. No projections, no estimates.',
        canonical: `${SITE_URL}/case-studies`,
    },
    about: {
        title: 'About | Digital Dream Works — Florida LLC, Offices in Florida & Rome',
        description: 'Digital Dream Works is a Florida LLC with offices in Florida and Rome. We manage $683K+/month in Meta spend, $2.7M+ in Amazon sales, and ship live SaaS products on retainer.',
        canonical: `${SITE_URL}/about`,
    },
    contact: {
        title: 'Contact | Digital Dream Works — Book a Discovery Call',
        description: 'Book a 20-minute discovery call. We work with US and EU brands on Meta, Google, Amazon, TikTok, SEO, and AI software — all on retainer.',
        canonical: `${SITE_URL}/contact`,
    },
};
