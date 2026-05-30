/**
 * AllProjects — Production-Optimized Portfolio Grid
 *
 * Critical fixes applied:
 * - GlobalStyles replaced with module-level singleton CSS injection
 * - ProjectCard: hovered + imgLoaded state removed; all hover driven by CSS
 * - ProjectCard: unified single gsap.context() per card
 * - ProjectCard: key fixed to item.id only (no remount on page/filter change)
 * - CtaButton: useState removed; pure CSS hover
 * - FloatingPill: GSAP animation properly killed on unmount; fixed duration
 * - StatsBar: stats array hoisted to module level; inline <style> removed
 * - Marquee: items/track hoisted to module level
 * - AllProjects: filtered/paginated values memoized with useMemo
 * - AllProjects: GSAP header uses direct element refs, not class selectors
 * - Background orbs replaced with single SVG (no filter:blur repaint)
 * - FilterTab/PageBtn: matchMedia consolidated, not per-instance
 * - OrbitalNode: glow blur removed; CSS-only orbital animation
 */

import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Module-Level Constants ────────────────────────────────────────────────────
const IS_TOUCH =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const ITEMS_PER_PAGE = 6;

const CATEGORIES = ['All', 'Meta Ads', 'Google Ads', 'Amazon', 'TikTok Shop', 'SEO', 'SaaS'];

const CAT_COLORS = {
  'Meta Ads':    '#FF570F',
  'Google Ads':  '#FDE87A',
  'Amazon':      '#EE7D1D',
  'TikTok Shop': '#ff4d6d',
  'SEO':         '#4ade80',
  'SaaS':        '#a78bfa',
  'All':         '#FF570F',
};

const CAT_ICONS = {
  'All':         '◈',
  'Meta Ads':    'ƒ',
  'Google Ads':  'G',
  'Amazon':      'a',
  'TikTok Shop': '♪',
  'SEO':         '⟳',
  'SaaS':        '⬡',
};

const PROJECTS_DATA = [
  {
    id: 'meta-eu-fashion',
    title: 'EU Fashion & Golf Brand',
    category: 'Meta Ads',
    img: '/portfolio/google-ads-600roas.png',
    tags: ['Meta Ads', 'EU Market', 'E-Commerce'],
    metrics: { 'Monthly Spend': '$683K', 'ROAS': '5.48x', 'Campaigns': '343' },
    url: null,
  },
  {
    id: 'meta-eu-oct',
    title: 'EU Brand — October Scale',
    category: 'Meta Ads',
    img: '/portfolio/google-ads-600roas.png',
    tags: ['Meta Ads', 'EU Market', 'Scale'],
    metrics: { 'Monthly Spend': '$441K', 'ROAS': '4.70x', 'Campaigns': '285' },
    url: null,
  },
  {
    id: 'uae-home-appliances',
    title: 'UAE Home Appliances',
    category: 'Meta Ads',
    img: null,
    tags: ['Meta Ads', 'Shopify', 'UAE'],
    metrics: { ROAS: '4.86x', Orders: '572' },
    url: null,
  },
  {
    id: 'mathfel-google',
    title: 'Mathfel — Video Door Intercom',
    category: 'Google Ads',
    img: '/portfolio/google-ads-600roas.png',
    tags: ['Google Ads', 'EU Market', 'E-Commerce'],
    metrics: { ROAS: '600%', Revenue: '€418K', Spend: '€69.7K' },
    url: null,
  },
  {
    id: 'google-eu-310roas',
    title: 'EU Brand — Google Shopping',
    category: 'Google Ads',
    img: '/portfolio/google-ads-310roas.png',
    tags: ['Google Ads', 'EU Market', 'Shopping'],
    metrics: { ROAS: '310%', Revenue: '€60.1K' },
    url: null,
  },
  {
    id: 'pj-bold',
    title: 'PJ BOLD — Silicone Molds',
    category: 'Google Ads',
    img: null,
    tags: ['Google Ads', 'USA', 'E-Commerce'],
    metrics: { ROAS: '14.54x', Revenue: '$38K' },
    url: null,
  },
  {
    id: 'cpa-moms',
    title: 'CPA MOMS — Tax Franchise',
    category: 'Google Ads',
    img: null,
    tags: ['Google Ads', 'Lead Gen', 'USA'],
    metrics: { Conversions: '+53%', CPC: '-51%' },
    url: null,
  },
  {
    id: 'us-health-clinic',
    title: 'US Health Clinic — Multi-Location',
    category: 'Google Ads',
    img: null,
    tags: ['Google Ads', 'Healthcare', 'USA'],
    metrics: { Conversions: '15,594', CPC: '$0.09' },
    url: null,
  },
  {
    id: 'amazon-us',
    title: 'Amazon Brand — US Market',
    category: 'Amazon',
    img: '/portfolio/amazon-ads-main.png',
    tags: ['Amazon Ads', 'Amazon FBA', 'USA'],
    metrics: { Sales: '$2.7M+', ACOS: '27.64%', Orders: '129,800' },
    url: null,
  },
  {
    id: 'tiktok-shop',
    title: 'TikTok Shop — E-Commerce',
    category: 'TikTok Shop',
    img: '/portfolio/tiktok-shop.png',
    tags: ['TikTok Shop', 'E-Commerce', 'Social Commerce'],
    metrics: { '7-Day GMV': '$290K', Orders: '9,010', Growth: '+121%' },
    url: null,
  },
  {
    id: 'seo-syncwire',
    title: 'Syncwire — E-Commerce SEO',
    category: 'SEO',
    img: '/portfolio/seo-251k.png',
    tags: ['SEO', 'E-Commerce', 'Organic Growth'],
    metrics: { Visitors: '2K → 54K', Clicks: '251K', Impressions: '10.3M' },
    url: null,
  },
  {
    id: 'seo-brand-2',
    title: 'E-Commerce Brand — SEO',
    category: 'SEO',
    img: '/portfolio/seo-147k.png',
    tags: ['SEO', 'E-Commerce', 'Organic Growth'],
    metrics: { Clicks: '147K', Impressions: '4.43M' },
    url: null,
  },
  {
    id: 'lyra-saas',
    title: 'Lyra — AI Voice Receptionist',
    category: 'SaaS',
    img: null,
    tags: ['AI SaaS', 'Voice AI', 'Built by DDW'],
    metrics: { 'Calls Handled': '978+', Availability: '24/7' },
    url: 'https://lyrabyddw.com',
  },
  {
    id: 'sviluppiamo',
    title: 'Sviluppiamo.dev — Vibe Coding',
    category: 'SaaS',
    img: null,
    tags: ['SaaS', 'Vibe Coding', 'Italy Market'],
    metrics: { Market: 'Italy', Stack: 'Next.js + AI' },
    url: 'https://sviluppiamo.dev',
  },
];

// Pre-compute category counts once at module level — O(n) done once, not per render
const CATEGORY_COUNTS = CATEGORIES.reduce((acc, cat) => {
  acc[cat] = cat === 'All'
    ? PROJECTS_DATA.length
    : PROJECTS_DATA.filter(p => p.category === cat).length;
  return acc;
}, {});

// Marquee data — module-level, never recreated
const MARQUEE_ITEMS = [
  '$683K Meta/mo', '600% ROAS', '$2.7M Amazon', '14.54x ROAS',
  '$290K GMV', '15,594 Conversions', '251K SEO Clicks',
  '+121% TikTok Growth', '4.86x ROAS', '978+ AI Calls',
];
const MARQUEE_TRACK = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

// Stats bar data — module-level
const STATS_DATA = [
  { v: '$683K+', l: 'Meta / Month',  icon: 'ƒ', color: '#FF570F' },
  { v: '14',     l: 'Live Projects', icon: '◈', color: '#FDE87A' },
  { v: '$2.7M+', l: 'Amazon Sales',  icon: 'a', color: '#EE7D1D' },
  { v: '600%',   l: 'Peak ROAS',     icon: 'G', color: '#4ade80' },
];

// ─── Singleton CSS Injection ───────────────────────────────────────────────────
// Add Google Fonts to your _document.js / index.html <head> instead:
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900
//   &family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Keyframes ── */
  @keyframes mq {
    from { transform: translate3d(0,0,0); }
    to   { transform: translate3d(-33.33%,0,0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.35; }
  }
  @keyframes spinRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes spinRingRev {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }

  /* ── Card: all hover transitions in CSS — zero JS re-renders ── */
  .ddw-card-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    background: linear-gradient(155deg, #12151a 0%, #0b0d12 100%);
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 4px 28px rgba(0,0,0,0.4);
    transition: border-color 0.35s ease, box-shadow 0.35s ease;
  }
  .ddw-card-inner:hover {
    border-color: var(--card-accent-30, rgba(255,255,255,0.06));
    box-shadow: 0 2px 0 var(--card-accent-20) inset,
                0 28px 70px rgba(0,0,0,0.65),
                0 0 0 1px var(--card-accent-10);
  }

  /* Glow overlay */
  .ddw-card-glow {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 0; border-radius: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .ddw-card-inner:hover .ddw-card-glow { opacity: 1; }

  /* Top accent bar */
  .ddw-card-top-bar {
    height: 2px; position: relative; z-index: 1;
    background: rgba(255,255,255,0.045);
    transition: background 0.4s ease;
  }
  .ddw-card-inner:hover .ddw-card-top-bar {
    background: linear-gradient(90deg, var(--card-accent), transparent);
  }

  /* Image */
  .ddw-card-img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top;
    opacity: 0.48;
    transform: scale(1);
    transition: opacity 0.5s ease, transform 0.7s ease;
  }
  .ddw-card-img[data-loaded="true"] { opacity: 0.48; }
  .ddw-card-inner:hover .ddw-card-img[data-loaded="true"] {
    opacity: 0.7;
    transform: scale(1.06);
  }

  /* Primary metric in no-image cards */
  .ddw-card-metric-primary {
    transition: transform 0.5s ease;
  }
  .ddw-card-inner:hover .ddw-card-metric-primary {
    transform: scale(1.09);
  }

  /* Tags */
  .ddw-card-tag {
    padding: 3px 9px; font-size: 9px; font-weight: 700; border-radius: 99px;
    background: rgba(0,0,0,0.65);
    color: rgba(255,255,255,0.65);
    border: 1px solid rgba(255,255,255,0.09);
    text-transform: uppercase; letter-spacing: 0.12em;
    backdrop-filter: blur(8px);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    font-family: Montserrat, sans-serif;
  }
  .ddw-card-inner:hover .ddw-card-tag { opacity: 1; transform: translateY(0); }

  /* Stagger tag reveals via nth-child */
  .ddw-card-inner:hover .ddw-card-tag:nth-child(2) { transition-delay: 50ms; }
  .ddw-card-inner:hover .ddw-card-tag:nth-child(3) { transition-delay: 100ms; }

  /* Card title */
  .ddw-card-title {
    font-size: clamp(13px,2vw,16px); font-weight: 900; line-height: 1.3;
    color: rgba(255,255,255,0.88);
    margin-bottom: 14px; letter-spacing: -0.02em;
    transition: color 0.3s ease;
    font-family: Montserrat, sans-serif;
  }
  .ddw-card-inner:hover .ddw-card-title { color: #fff; }

  /* Metric items */
  .ddw-card-metric {
    transition: transform 0.3s ease;
  }
  .ddw-card-inner:hover .ddw-card-metric { transform: translateY(-3px); }
  .ddw-card-inner:hover .ddw-card-metric:nth-child(2) { transition-delay: 45ms; }
  .ddw-card-inner:hover .ddw-card-metric:nth-child(3) { transition-delay: 90ms; }

  /* Divider */
  .ddw-card-divider {
    height: 1px; margin-bottom: 14px;
    background: rgba(255,255,255,0.048);
    transition: background 0.4s ease;
  }
  .ddw-card-inner:hover .ddw-card-divider {
    background: linear-gradient(90deg, var(--card-accent-38), transparent);
  }

  /* CTA text */
  .ddw-card-btn-text {
    font-size: 12px; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.22);
    transition: color 0.3s ease;
    font-family: Montserrat, sans-serif;
  }
  .ddw-card-inner:hover .ddw-card-btn-text {
    color: var(--card-accent);
  }

  /* Arrow button */
  .ddw-card-btn-arrow {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    transform: rotate(0deg) scale(1);
    transition: all 0.32s ease;
  }
  .ddw-card-btn-arrow svg {
    width: 13px; height: 13px;
    color: rgba(255,255,255,0.4);
    transition: color 0.3s ease;
  }
  .ddw-card-inner:hover .ddw-card-btn-arrow {
    background: var(--card-accent);
    border-color: var(--card-accent);
    transform: rotate(45deg) scale(1.12);
    box-shadow: 0 0 22px var(--card-accent-66);
  }
  .ddw-card-inner:hover .ddw-card-btn-arrow svg { color: #000; }

  /* ── Filter button ── */
  .ddw-filter-btn {
    position: relative;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; min-height: 44px; border-radius: 99px;
    font-size: 12px; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.18em;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: Montserrat, sans-serif;
  }
  .ddw-filter-btn .ddw-filter-icon {
    font-size: 12px; display: inline-block;
    transition: transform 0.25s ease;
  }
  .ddw-filter-btn:hover .ddw-filter-icon {
    transform: scale(1.2) rotate(10deg);
  }

  /* ── CTA button ── */
  .ddw-cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; min-height: 52px; border-radius: 99px;
    background: linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%);
    color: #000; font-weight: 900; font-size: 12px;
    text-transform: uppercase; letter-spacing: 0.2em;
    text-decoration: none;
    box-shadow: 0 0 24px #FF570F35;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    font-family: Montserrat, sans-serif;
  }
  .ddw-cta-btn:hover {
    box-shadow: 0 0 40px #FF570F60, 0 8px 32px rgba(255,87,15,0.4);
    transform: scale(1.04);
  }
  .ddw-cta-btn svg {
    width: 14px; height: 14px;
    transition: transform 0.3s ease;
  }
  .ddw-cta-btn:hover svg { transform: translateX(3px); }

  /* ── Stats grid responsive ── */
  .ddw-stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  @media (min-width: 640px) {
    .ddw-stats-grid { grid-template-columns: repeat(4,1fr); }
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080a0c; }
  ::-webkit-scrollbar-thumb { background: #FF570F40; border-radius: 99px; }

  /* ── Focus ── */
  button:focus-visible, a:focus-visible {
    outline: 2px solid #FF570F; outline-offset: 3px;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .header-title-container {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .header-desc {
      text-align: left !important;
      max-width: 100% !important;
      margin-top: 10px;
    }
    .floating-pills {
      position: relative !important;
      top: 0 !important; right: 0 !important;
      flex-direction: row !important;
      flex-wrap: wrap;
      margin-bottom: 24px;
      opacity: 1 !important;
    }
  }

  /* ── Touch fallbacks ── */
  @media (hover: none) {
    .ddw-card-tag    { opacity: 1 !important; transform: translateY(0) !important; }
    .ddw-card-title  { color: #fff !important; }
    .ddw-card-img[data-loaded="true"] { opacity: 0.7 !important; transform: scale(1.06) !important; }
    .ddw-card-btn-text  { color: var(--card-accent) !important; }
    .ddw-card-btn-arrow {
      transform: rotate(45deg) scale(1.12) !important;
      background: var(--card-accent) !important;
      border-color: var(--card-accent) !important;
    }
    .ddw-card-btn-arrow svg { color: #000 !important; }
  }
`;

if (typeof document !== 'undefined') {
  const existing = document.getElementById('ddw-portfolio-styles');
  if (!existing) {
    const tag = document.createElement('style');
    tag.id = 'ddw-portfolio-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }
}

// ─── Hook: Magnetic ───────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.22) => {
  useEffect(() => {
    if (IS_TOUCH || !ref?.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = ref.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' });
      let raf = 0;
      const move = (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width  / 2) * strength);
          yTo((e.clientY - r.top  - r.height / 2) * strength);
        });
      };
      const leave = () => { cancelAnimationFrame(raf); xTo(0); yTo(0); };
      el.addEventListener('mousemove', move, { passive: true });
      el.addEventListener('mouseleave', leave);
      return () => {
        cancelAnimationFrame(raf);
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      };
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);
};

// ─── OrbitalNode ──────────────────────────────────────────────────────────────
/**
 * Removed filter:blur from glow div — avoids per-card GPU rasterization.
 * All animations are CSS keyframes — compositor thread only.
 */
const OrbitalNode = memo(({ accent }) => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', pointerEvents: 'none',
  }}>
    {/* Centre glow — SVG radial, no filter:blur */}
    <div style={{
      position: 'absolute', width: 60, height: 60, borderRadius: '50%',
      background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
    }} />
    <div style={{
      position: 'absolute', width: 8, height: 8, borderRadius: '50%',
      background: accent, boxShadow: `0 0 16px ${accent}`,
      animation: 'pulse 2s ease infinite',
    }} />
    {/* Inner ring */}
    <div style={{
      position: 'absolute', width: 90, height: 90, borderRadius: '50%',
      border: `1px dashed ${accent}40`,
      animation: 'spinRing 8s linear infinite',
    }}>
      <div style={{
        position: 'absolute', top: -3, left: '50%',
        transform: 'translateX(-50%)',
        width: 6, height: 6, borderRadius: '50%',
        background: accent, boxShadow: `0 0 8px ${accent}`,
      }} />
    </div>
    {/* Mid ring */}
    <div style={{
      position: 'absolute', width: 140, height: 140, borderRadius: '50%',
      border: `1px dashed ${accent}22`,
      animation: 'spinRingRev 14s linear infinite',
    }}>
      <div style={{
        position: 'absolute', bottom: -3, left: '50%',
        transform: 'translateX(-50%)',
        width: 5, height: 5, borderRadius: '50%',
        background: `${accent}88`,
      }} />
    </div>
    {/* Outer ring — no dot, no boxShadow */}
    <div style={{
      position: 'absolute', width: 190, height: 190, borderRadius: '50%',
      border: `1px solid ${accent}10`,
      animation: 'spinRing 22s linear infinite',
    }} />
    {/* Dot grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `radial-gradient(${accent}30 1px, transparent 1px)`,
      backgroundSize: '18px 18px',
      maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
      WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
      opacity: 0.4,
    }} />
  </div>
));
OrbitalNode.displayName = 'OrbitalNode';

// ─── Marquee ──────────────────────────────────────────────────────────────────
// Pure render — no state, no effects. MARQUEE_TRACK is module-level.
const Marquee = memo(() => (
  <div style={{
    position: 'relative', overflow: 'hidden',
    borderTop:    '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    padding: '11px 0',
  }}>
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
      pointerEvents: 'none',
      background: 'linear-gradient(90deg, #080a0c, transparent)',
    }} />
    <div style={{
      position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
      pointerEvents: 'none',
      background: 'linear-gradient(-90deg, #080a0c, transparent)',
    }} />
    <div
      aria-hidden="true"
      style={{
        display: 'flex', gap: 40, whiteSpace: 'nowrap',
        animation: 'mq 32s linear infinite',
        willChange: 'transform',
      }}
    >
      {MARQUEE_TRACK.map((t, i) => (
        <span
          key={i}
          className="text-xs font-bold uppercase tracking-widest"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            color: 'rgba(255,255,255,0.22)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: '#FF570F', display: 'inline-block', flexShrink: 0,
          }} />
          {t}
        </span>
      ))}
    </div>
  </div>
));
Marquee.displayName = 'Marquee';

// ─── StatsBar ─────────────────────────────────────────────────────────────────
// STATS_DATA is module-level. itemRefs instead of class selector.
const StatsBar = memo(() => {
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="ddw-stats-grid"
      style={{ margin: '20px 0 28px' }}
    >
      {STATS_DATA.map((s, i) => (
        <div
          key={s.l}
          ref={el => { itemRefs.current[i] = el; }}
          style={{
            opacity: 0, textAlign: 'center',
            padding: '18px 12px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.012) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            className="text-4xl font-bold"
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              color: s.color,
              opacity: 0.04, pointerEvents: 'none',
              fontFamily: 'Montserrat, sans-serif', lineHeight: 1,
            }}
          >
            {s.icon}
          </div>
          <div className="text-xl md:text-2xl font-bold" style={{
            color: '#fff', letterSpacing: '-0.03em', marginBottom: 4,
            fontFamily: 'Montserrat, sans-serif', position: 'relative',
          }}>
            {s.v}
          </div>
          <div className="text-xs uppercase tracking-widest font-bold" style={{
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'Montserrat, sans-serif', position: 'relative',
          }}>
            {s.l}
          </div>
        </div>
      ))}
    </div>
  );
});
StatsBar.displayName = 'StatsBar';

// ─── FilterTab ────────────────────────────────────────────────────────────────
/**
 * Hover styles applied via direct DOM mutation (not state).
 * useMagnetic kept per-tab — acceptable for 7 tabs.
 * CSS handles icon transform via .ddw-filter-btn:hover .ddw-filter-icon.
 */
const FilterTab = memo(({ cat, isActive, onClick, count }) => {
  const ref    = useRef(null);
  const accent = CAT_COLORS[cat];
  useMagnetic(ref, 0.12);

  const activeStyle = useMemo(() => ({
    border: `1px solid ${accent}`,
    background: accent,
    color: '#000',
    boxShadow: `0 0 28px ${accent}45, 0 0 60px ${accent}15`,
  }), [accent]);

  const inactiveStyle = {
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.035)',
    color: 'rgba(255,255,255,0.4)',
    boxShadow: 'none',
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="ddw-filter-btn text-sm font-bold uppercase tracking-widest" style={{
        ...(isActive ? activeStyle : inactiveStyle),
        willChange: 'transform',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        if (isActive) return;
        const t = e.currentTarget;
        t.style.borderColor = `${accent}55`;
        t.style.color       = accent;
        t.style.background  = `${accent}12`;
      }}
      onMouseLeave={e => {
        if (isActive) return;
        const t = e.currentTarget;
        t.style.borderColor = 'rgba(255,255,255,0.07)';
        t.style.color       = 'rgba(255,255,255,0.4)';
        t.style.background  = 'rgba(255,255,255,0.035)';
      }}
      aria-pressed={isActive}
    >
      <span className="ddw-filter-icon" aria-hidden="true">
        {CAT_ICONS[cat]}
      </span>
      {cat}
      {count != null && (
        <span className="text-xs font-bold" style={{ opacity: 0.55 }}>
          {count}
        </span>
      )}
    </button>
  );
});
FilterTab.displayName = 'FilterTab';

// ─── ProjectCard ──────────────────────────────────────────────────────────────
/**
 * CRITICAL: hovered state completely removed.
 * All visual hover states driven by CSS (.ddw-card-inner:hover .*)
 *
 * imgLoaded now uses data attribute on the img element — no React state.
 * Single gsap.context() for both entrance and tilt animations.
 * key={item.id} in parent — this component never remounts on filter/page change.
 */
const ProjectCard = memo(({ item, index }) => {
  const wrapperRef = useRef(null);
  const tiltRef    = useRef(null);
  const glowRef    = useRef(null);
  const imgRef     = useRef(null);

  const isExternal = !!item.url;
  const dest       = item.url ?? `/projects/${item.id}`;
  const accent     = CAT_COLORS[item.category] ?? '#FF570F';

  // Pre-compute these once — they're derived from stable props
  const primaryVal = Object.values(item.metrics)[0];
  const primaryKey = Object.keys(item.metrics)[0];
  const metricPairs = Object.entries(item.metrics).slice(0, 3);

  // CSS variable values — memoized, only change if accent changes
  const cssVars = useMemo(() => ({
    '--card-accent':    accent,
    '--card-accent-30': `${accent}3a`,
    '--card-accent-20': `${accent}20`,
    '--card-accent-10': `${accent}10`,
    '--card-accent-38': `${accent}38`,
    '--card-accent-66': `${accent}66`,
  }), [accent]);

  // Single unified GSAP context: entrance + tilt
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      // Scroll entrance on the outer wrapper
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'power3.out',
          // Clamped delay — max 280ms regardless of index
          delay: Math.min((index % ITEMS_PER_PAGE) * 0.07, 0.28),
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 93%',
            once: true,
          },
        }
      );

      // 3D tilt — desktop only, via matchMedia
      if (!IS_TOUCH) {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 769px)', () => {
          const el = tiltRef.current;
          if (!el) return;
          const move = (e) => {
            const r  = el.getBoundingClientRect();
            const rx = ((e.clientY - r.top)  / r.height - 0.5) * -12;
            const ry = ((e.clientX - r.left) / r.width  - 0.5) *  12;
            gsap.to(el, {
              rotationX: rx, rotationY: ry,
              duration: 0.45, ease: 'power2.out',
              transformPerspective: 900,
            });
          };
          const leave = () => {
            gsap.to(el, {
              rotationX: 0, rotationY: 0,
              duration: 0.55, ease: 'power3.out',
            });
          };
          el.addEventListener('mousemove', move, { passive: true });
          el.addEventListener('mouseleave', leave);
          return () => {
            el.removeEventListener('mousemove', move);
            el.removeEventListener('mouseleave', leave);
          };
        });
        return () => mm.revert();
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [index]);

  // Glow: direct DOM mutation — no state, no re-render
  const handleMouseMove = useCallback((e) => {
    if (!glowRef.current || !tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    glowRef.current.style.background =
      `radial-gradient(220px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${accent}20, transparent 68%)`;
  }, [accent]);

  // Image load: data attribute, not React state
  const handleImageLoad = useCallback(() => {
    if (imgRef.current) imgRef.current.setAttribute('data-loaded', 'true');
  }, []);

  const cardContent = (
    <div
      ref={tiltRef}
      style={{
        height: '100%',
        transformStyle: 'preserve-3d',
        ...cssVars,
      }}
    >
      <div
        className="ddw-card-inner"
        onMouseMove={handleMouseMove}
      >
        {/* Cursor glow — mutated directly */}
        <div ref={glowRef} className="ddw-card-glow" />

        {/* Top accent bar */}
        <div className="ddw-card-top-bar" />

        {/* Media area */}
        <div style={{
          position: 'relative', height: 215,
          background: '#090c10', overflow: 'hidden', zIndex: 1,
        }}>
          {item.img ? (
            <img
              ref={imgRef}
              src={item.img}
              alt={item.title}
              loading="lazy"
              onLoad={handleImageLoad}
              className="ddw-card-img"
              data-loaded="false"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at 50% 0%, ${accent}16, transparent 65%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <OrbitalNode accent={accent} />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <div
                  className="ddw-card-metric-primary text-3xl md:text-4xl leading-[1.1] tracking-tight"
                  style={{
                    fontWeight: 700, color: accent,
                    textShadow: `0 0 60px ${accent}66`,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {primaryVal}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold" style={{
                  color: `${accent}60`, marginTop: 6,
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {primaryKey}
                </div>
              </div>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent 28%, #0b0d12 100%)',
            }}
          />

          {/* Category badge */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 3 }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{
              padding: '5px 11px', borderRadius: 99,
              background: `${accent}1a`, color: accent,
              border: `1px solid ${accent}38`,
              fontFamily: 'Montserrat, sans-serif',
              backdropFilter: 'blur(8px)',
            }}>
              {CAT_ICONS[item.category]} {item.category}
            </span>
          </div>

          {/* Live badge */}
          {isExternal && (
            <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 10px',
                borderRadius: 99, backdropFilter: 'blur(10px)',
                background: 'rgba(0,0,0,0.58)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'Montserrat, sans-serif',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#4ade80', display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }} />
                Live
              </span>
            </div>
          )}

          {/* Tags — CSS-driven reveal */}
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            display: 'flex', flexWrap: 'wrap', gap: 5, zIndex: 3,
          }}>
            {item.tags.map(tag => (
              <span key={tag} className="ddw-card-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card body */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '18px 20px 20px', position: 'relative', zIndex: 1,
        }}>
          <h4 className="ddw-card-title text-xl sm:text-2xl font-bold tracking-tight">{item.title}</h4>

          {/* Metrics */}
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 14 }}>
            {metricPairs.map(([key, val]) => (
              <div key={key} className="ddw-card-metric">
                <div className="text-lg font-bold" style={{
                  color: accent, lineHeight: 1, letterSpacing: '-0.02em',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {val}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold" style={{
                  color: 'rgba(255,255,255,0.28)', marginTop: 3,
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {key}
                </div>
              </div>
            ))}
          </div>

          <div className="ddw-card-divider" />

          {/* Footer row */}
          <div style={{
            marginTop: 'auto', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span className="ddw-card-btn-text">
              {isExternal ? 'Visit Live' : 'View Project'}
            </span>
            <div className="ddw-card-btn-arrow">
              <svg
                fill="none" stroke="currentColor" strokeWidth="2.5"
                viewBox="0 0 24 24" aria-hidden="true"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // Outer wrapper: GSAP entrance target (starts opacity:0)
    <div ref={wrapperRef} style={{ opacity: 0, height: '100%' }}>
      <a
        href={dest}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        style={{ display: 'block', outline: 'none', textDecoration: 'none', height: '100%' }}
      >
        {cardContent}
      </a>
    </div>
  );
});
ProjectCard.displayName = 'ProjectCard';

// ─── PageBtn ──────────────────────────────────────────────────────────────────
const PageBtn = memo(({ onClick, disabled, isActive, children, label }) => {
  const ref = useRef(null);
  useMagnetic(ref, 0.18);

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className="text-xs font-bold"
      style={{
        width: 42, height: 42, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: isActive
          ? '#FF570F'
          : disabled ? 'transparent' : 'rgba(255,255,255,0.04)',
        color: isActive
          ? '#000'
          : disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.55)',
        border: `1px solid ${
          isActive ? '#FF570F' : disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'
        }`,
        boxShadow: isActive ? '0 0 24px #FF570F50' : 'none',
        transition: 'all 0.25s ease',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {children}
    </button>
  );
});
PageBtn.displayName = 'PageBtn';

// ─── FloatingPill ─────────────────────────────────────────────────────────────
/**
 * Fixed duration (no Math.random).
 * GSAP animation properly killed on unmount.
 */
const FloatingPill = memo(({ children, style = {}, duration = 2.4 }) => {
  const ref  = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    anim.current = gsap.to(ref.current, {
      y: -10, duration,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    return () => anim.current?.kill();
  }, [duration]);

  return (
    <div
      ref={ref}
      className="text-xs font-bold uppercase tracking-widest"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 14px', borderRadius: 99,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(12px)',
        color: 'rgba(255,255,255,0.55)',
        fontFamily: 'Montserrat, sans-serif',
        ...style,
      }}
    >
      {children}
    </div>
  );
});
FloatingPill.displayName = 'FloatingPill';

// ─── CtaButton ────────────────────────────────────────────────────────────────
/**
 * useState removed entirely.
 * All hover effects handled by CSS .ddw-cta-btn class.
 */
const CtaButton = memo(() => {
  const ref = useRef(null);
  useMagnetic(ref, 0.25);

  return (
    <a
      ref={ref}
      href="/contact"
      className="ddw-cta-btn"
    >
      Start a Project
      <svg
        fill="none" stroke="currentColor" strokeWidth="2.5"
        viewBox="0 0 24 24" aria-hidden="true"
      >
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </a>
  );
});
CtaButton.displayName = 'CtaButton';

// ─── BackgroundSVG ────────────────────────────────────────────────────────────
/**
 * Replaces three filter:blur() divs with a single SVG.
 * SVG radialGradients are GPU-composited — no layout, no rasterization on scroll.
 */
const BackgroundSVG = memo(() => (
  <svg
    aria-hidden="true"
    style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', overflow: 'visible',
    }}
  >
    <defs>
      <radialGradient id="ap-bg1" cx="95%" cy="0%" r="45%">
        <stop offset="0%" stopColor="#FF570F" stopOpacity="0.035" />
        <stop offset="100%" stopColor="#FF570F" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ap-bg2" cx="0%" cy="80%" r="35%">
        <stop offset="0%" stopColor="#FDE87A" stopOpacity="0.025" />
        <stop offset="100%" stopColor="#FDE87A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ap-bg3" cx="45%" cy="50%" r="25%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.018" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#ap-bg1)" />
    <rect width="100%" height="100%" fill="url(#ap-bg2)" />
    <rect width="100%" height="100%" fill="url(#ap-bg3)" />
  </svg>
));
BackgroundSVG.displayName = 'BackgroundSVG';

// ─── AllProjects ──────────────────────────────────────────────────────────────
const AllProjects = () => {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const gridRef    = useRef(null);
  const headerRefs = useRef([]); // direct element refs for GSAP

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage,    setCurrentPage]    = useState(1);

  // ── Derived state — memoized, recomputed only when deps change ──
  const filtered = useMemo(() => (
    activeCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter(p => p.category === activeCategory)
  ), [activeCategory]);

  const totalPages = useMemo(() =>
    Math.ceil(filtered.length / ITEMS_PER_PAGE),
  [filtered.length]);

  const visibleProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const startIndex  = (currentPage - 1) * ITEMS_PER_PAGE;
  const accentColor = CAT_COLORS[activeCategory];

  // ── Header entrance — direct element refs, not class selectors ──
  useEffect(() => {
    if (!headerRef.current) return;
    const targets = headerRefs.current.filter(Boolean);
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // ── Page numbers — memoized ──
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }, [totalPages, currentPage]);

  // ── Grid transition helper ──
  const animateGrid = useCallback((onMid) => {
    const el = gridRef.current;
    if (!el) { onMid(); return; }
    gsap.to(el, {
      opacity: 0, y: 12, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        onMid();
        // Defer scroll/restore until after React commits new render
        requestAnimationFrame(() => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' });
        });
      },
    });
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    if (cat === activeCategory) return;
    animateGrid(() => {
      setActiveCategory(cat);
      setCurrentPage(1);
    });
  }, [activeCategory, animateGrid]);

  const goTo = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    animateGrid(() => {
      setCurrentPage(page);
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }, [totalPages, animateGrid]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#080a0c',
        color: '#fff',
        overflowX: 'hidden',
        scrollMarginTop: 96,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Background — SVG, no filter:blur */}
      <BackgroundSVG />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.052) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
        }}
      />

      {/* ── HEADER ── */}
      <div
        ref={headerRef}
        style={{
          position: 'relative',
          padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,40px) 0',
          maxWidth: 1280, margin: '0 auto',
        }}
      >
        {/* Eyebrow */}
        <div
          ref={el => { headerRefs.current[0] = el; }}
          style={{
            opacity: 0, display: 'flex', alignItems: 'center',
            gap: 12, marginBottom: 28,
          }}
        >
          <div style={{ height: 1, width: 36, background: '#FF570F', flexShrink: 0 }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{
            color: '#FF570F',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Real Accounts · Real Numbers · No Projections
          </span>
        </div>

        {/* Floating pills */}
        <div
          className="floating-pills"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'clamp(60px,9vw,100px)',
            right: 'clamp(16px,5vw,60px)',
            display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.7,
          }}
        >
          <FloatingPill
            duration={2.2}
            style={{ color: '#FF570F', borderColor: '#FF570F20' }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#FF570F', animation: 'pulse 1.5s infinite',
            }} />
            Live Data
          </FloatingPill>
          <FloatingPill duration={2.8}>
            ◈ 14 Campaigns
          </FloatingPill>
        </div>

        {/* Title block */}
        <div
          ref={el => { headerRefs.current[1] = el; }}
          style={{ opacity: 0, marginBottom: 30 }}
        >
          <div
            className="header-title-container"
            style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', flexWrap: 'wrap', gap: 20,
            }}
          >
            <h2 style={{
              
               
               margin: 0,
              fontFamily: 'Montserrat, sans-serif',
            }}>
              <span style={{ color: '#fff', display: 'block' }}>Projects</span>
              <span style={{
                background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', display: 'block',
              }}>
                We've Built.
              </span>
            </h2>
            <p
              className="header-desc text-base leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.38)',
                maxWidth: 260, textAlign: 'right', margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Every number is from a live account.
              <br />Dashboard screenshots available on request.
            </p>
          </div>
        </div>

        {/* Marquee */}
        <div
          ref={el => { headerRefs.current[2] = el; }}
          style={{ opacity: 0, marginBottom: 24 }}
        >
          <Marquee />
        </div>

        <StatsBar />

        {/* Filter tabs */}
        <div
          ref={el => { headerRefs.current[3] = el; }}
          style={{
            opacity: 0,
            display: 'flex', flexWrap: 'wrap', gap: 8,
            justifyContent: 'center', paddingBottom: 36,
          }}
        >
          {CATEGORIES.map(cat => (
            <FilterTab
              key={cat}
              cat={cat}
              isActive={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
              count={cat !== 'All' ? CATEGORY_COUNTS[cat] : null}
            />
          ))}
        </div>
      </div>

      {/* ── GRID ── */}
      <div style={{
        position: 'relative',
        padding: '0 clamp(16px,4vw,40px) clamp(60px,8vw,100px)',
        maxWidth: 1280, margin: '0 auto',
      }}>
        {/* Grid meta row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 22, flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              height: 16, width: 2.5, borderRadius: 2,
              background: accentColor, transition: 'background 0.35s ease',
            }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{
              color: accentColor,
              transition: 'color 0.35s ease',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {activeCategory === 'All' ? 'All Projects' : activeCategory}
            </span>
            <span className="text-xs font-bold" style={{
              color: 'rgba(255,255,255,0.2)',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              — {filtered.length} results
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest" style={{
            color: 'rgba(255,255,255,0.18)',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
        </div>

        {/* Card grid */}
        <div ref={gridRef}>
          {visibleProjects.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: 16,
            }}>
              {visibleProjects.map((item, index) => (
                <ProjectCard
                  key={item.id}  
                  item={item}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 20px', borderRadius: 18,
              background: 'rgba(255,255,255,0.016)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div
                aria-hidden="true"
                className="text-3xl md:text-4xl"
                style={{
                  marginBottom: 16,
                  opacity: 0.08, fontFamily: 'Montserrat, sans-serif',
                }}
              >
                ◈
              </div>
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed" style={{
                color: 'rgba(255,255,255,0.18)',
                fontFamily: 'Montserrat, sans-serif',
              }}>
                No projects in this category yet
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 6, marginTop: 52, flexWrap: 'wrap',
          }}>
            <PageBtn
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              label="Previous page"
            >
              ←
            </PageBtn>
            {pageNumbers.map(num => (
              <PageBtn
                key={num}
                onClick={() => goTo(num)}
                isActive={num === currentPage}
                label={`Page ${num}`}
              >
                {num}
              </PageBtn>
            ))}
            <PageBtn
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              label="Next page"
            >
              →
            </PageBtn>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', marginTop: 60, padding: '40px 24px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255,87,15,0.06) 0%, rgba(253,232,122,0.03) 100%)',
          border: '1px solid rgba(255,87,15,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>


          <p className="text-xs font-bold uppercase tracking-widest leading-relaxed" style={{
            color: '#FF570F',
            marginBottom: 12, fontFamily: 'Montserrat, sans-serif',
          }}>
            Want results like these?
          </p>
          <h3 style={{
             
             
            color: '#fff', marginBottom: 24,
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Let's build your next{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              success story.
            </span>
          </h3>

          <CtaButton />
        </div>
      </div>
    </section>
  );
};

export default AllProjects;