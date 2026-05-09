import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    @keyframes ticker {
      from { transform: translate3d(0,0,0); }
      to   { transform: translate3d(-33.33%,0,0); }
    }
    @keyframes pulse {
      0%,100% { opacity:1; }
      50%      { opacity:0.35; }
    }
    @keyframes orbitA {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes orbitB {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }
    @keyframes floatY {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-10px); }
    }
    @keyframes barPulse {
      0%,100% { transform: scaleY(0.5); opacity:0.4; }
      50%      { transform: scaleY(1);   opacity:1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    .ddw-card {
      transform-style: preserve-3d;
      will-change: transform;
    }
    .ddw-result-cell {
      transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
    }
    .ddw-result-cell:hover {
      transform: translateY(-2px);
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #080a0c; }
    ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.35); border-radius: 99px; }

    button:focus-visible, a:focus-visible {
      outline: 2px solid #FF570F;
      outline-offset: 3px;
    }

    /* Responsive grid overrides */
    @media (max-width: 639px) {
      .ddw-results-grid { grid-template-columns: repeat(2,1fr) !important; }
      .ddw-expand-grid  { grid-template-columns: 1fr !important; }
      .ddw-summary-grid { grid-template-columns: repeat(2,1fr) !important; }
      .ddw-header-row   { flex-direction: column !important; align-items: flex-start !important; }
      .ddw-hero-stat    { text-align: left !important; }
      .ddw-footer-row   { flex-direction: column !important; align-items: flex-start !important; }
    }
    @media (max-width: 479px) {
      .ddw-results-grid { grid-template-columns: 1fr 1fr !important; }
    }
  `}</style>
);

// ─── Data ──────────────────────────────────────────────────────────────────────
const caseStudies = [
  {
    client: 'Mathfel',
    industry: 'B2B Tech — Video Door Intercom Systems',
    location: 'EU',
    title: 'ROAS Doubled to 600% on €69.7K Monthly Google Ads Spend',
    challenge: 'Mathfel specialises in high-quality video door intercom systems. They were running Google Shopping at 310% ROAS on ~€60K/month. The ceiling was margin erosion as spend scaled toward €70K. They needed a structure that could absorb the budget increase without compressing returns.',
    solution: [
      'Restructured Google Shopping feed with product-level margin segmentation',
      'Implemented tiered bidding by margin and seasonal demand curves',
      'Split campaigns by high-AOV vs. volume products to protect blended ROAS',
      'Added Performance Max alongside Shopping for incremental reach',
    ],
    results: [
      { display: '600%',  label: 'Peak ROAS',              sub: 'Up from 310%' },
      { display: '418K',  label: 'Sales (EUR)',             sub: 'Sep–Dec 2024' },
      { display: '1.1K',  label: 'Conversions',            sub: 'Up from 623' },
      { display: '114%',  label: 'Conv. Value Increase',   sub: 'Same budget' },
    ],
    tags: ['Google Ads', 'Google Shopping', 'B2B', 'EU'],
    heroStat: '600%', heroLabel: 'ROAS',
    accent: '#FF570F', number: '01',
  },
  {
    client: 'PJ BOLD',
    industry: 'E-Commerce — Custom Silicone Molds',
    location: 'USA',
    title: '$38K Revenue on a $2,600 Budget: ROAS 1.83x to 14.54x',
    challenge: 'PJ BOLD sells custom silicone molds for gummies, candies, and chocolates. Google Ads were generating $4,830 in conversion value on $2,634 spend — a 1.83x ROAS. Profitable but stuck. Higher-margin SKUs were being treated identically to low-margin volume products.',
    solution: [
      'Complete campaign rebuild with SKU-level segmentation by margin and AOV',
      'Keyword strategy shifted to high-intent transactional terms',
      'Landing page alignment to highest-converting product categories',
      'Budget reallocation from broad match to exact and phrase match winners',
    ],
    results: [
      { display: '14.54x', label: 'Final ROAS',        sub: 'Up from 1.83x' },
      { display: '$38K',   label: 'Revenue Generated', sub: 'On $2,625 spend' },
      { display: '7x',     label: 'Sales Increase',    sub: 'Same budget' },
      { display: '62%',    label: 'Impressions Growth',sub: '270K → 441K' },
    ],
    tags: ['Google Ads', 'E-Commerce', 'ROAS Turnaround', 'USA'],
    heroStat: '14.54x', heroLabel: 'ROAS',
    accent: '#EE7D1D', number: '02',
  },
  {
    client: 'CPA MOMS',
    industry: 'Professional Services — National Tax Franchise',
    location: 'USA',
    title: '53% More Conversions, Cost Per Lead Cut in Half in 30 Days',
    challenge: 'CPA MOMS is a national franchise of specialist CPAs serving entrepreneurs. Google Ads were generating 15 conversions/month at $144.54 per conversion. With known LTV, they needed more volume and lower CPL — not just one or the other.',
    solution: [
      'Full keyword audit: removed low-intent terms bleeding budget',
      'Restructured ad groups around franchise-specific service lines',
      'Landing page rebuilds to match ad message and eliminate conversion friction',
      'Added callout extensions and sitelinks for credibility and click-through',
    ],
    results: [
      { display: '53%',     label: 'Conversion Increase', sub: '15 → 23/month' },
      { display: '$71.42',  label: 'Cost Per Conv.',       sub: 'Down from $144.54' },
      { display: '45%',     label: 'Conv. Rate Lift',      sub: '8.33% → 12.11%' },
      { display: '56%',     label: 'Brand Impressions',    sub: '5.72K → 8.5K' },
    ],
    tags: ['Google Ads', 'Lead Generation', 'Franchise', 'USA'],
    heroStat: '53%', heroLabel: 'More Conversions',
    accent: '#FDE87A', number: '03',
  },
  {
    client: 'UAE Home Appliances',
    industry: 'E-Commerce — Home Appliances',
    location: 'UAE',
    title: 'AED 47,950 in Sales on 7,500 AED/Month Meta Ads Budget',
    challenge: 'A UAE home appliances brand on Shopify was running Meta Ads without a funnel structure — all spend hitting cold audiences, conversion rate below 1%. They needed a full-funnel rebuild without increasing the monthly budget.',
    solution: [
      'Built awareness-to-conversion funnel: reach → engagement → purchase',
      'Created lookalike audiences from Shopify purchase data',
      'Launched dynamic product ads for abandoned cart recovery',
      'Optimised creative by product category for UAE purchasing behaviour',
    ],
    results: [
      { display: 'AED 47.9K', label: 'Total Sales',   sub: 'Shopify-tracked' },
      { display: '572',        label: 'Orders',        sub: '1.32% conv. rate' },
      { display: '4.86x',      label: 'Purchase ROAS', sub: 'Return on ad spend' },
      { display: '42,633',     label: 'Sessions',      sub: 'Driven to storefront' },
    ],
    tags: ['Meta Ads', 'Shopify', 'E-Commerce', 'UAE'],
    heroStat: '4.86x', heroLabel: 'ROAS',
    accent: '#FF570F', number: '04',
  },
  {
    client: 'US Health Clinic',
    industry: 'Healthcare — Medical Services',
    location: 'USA',
    title: '15,594 Patient Conversions at $0.09 CPC Across the USA',
    challenge: 'A US healthcare provider offering multiple service lines needed cost-effective patient acquisition nationally. Competitors were pushing CPCs to $3–5. They needed high conversion volume without paying premium rates for generic medical keywords.',
    solution: [
      'Rebuilt keyword strategy around long-tail, high-intent health service queries',
      'Created service-line specific ad groups with dedicated landing pages',
      'Implemented call tracking integrated with appointment booking system',
      'Layered bid adjustments for time-of-day and geo to match intent windows',
    ],
    results: [
      { display: '15,594', label: 'Conversions',    sub: 'Patient contacts' },
      { display: '$0.09',  label: 'Average CPC',    sub: 'vs $3–5 benchmark' },
      { display: '4.58%',  label: 'CTR',            sub: '1.56M impressions' },
      { display: '$6.3K',  label: 'Total Ad Spend', sub: 'Exceptional efficiency' },
    ],
    tags: ['Google Ads', 'Healthcare', 'Lead Generation', 'USA'],
    heroStat: '$0.09', heroLabel: 'CPC',
    accent: '#EE7D1D', number: '05',
  },
  {
    client: 'US Therapy Practice',
    industry: 'Mental Health — Counseling Services',
    location: 'USA',
    title: '517 Qualified Therapy Calls at $34.70 Per Call',
    challenge: 'A therapy and counseling provider needed phone calls from people actively seeking help — not generic health browsers. Standard lead gen was pulling low-intent clicks. Every wasted call slot had a real cost to a small practice.',
    solution: [
      'Call-only campaigns targeting crisis and immediate-need search queries',
      'Custom call tracking with practice management system integration',
      'Optimised phone impression share during highest-intent time windows',
      'A/B tested ad copy focused on immediate availability and confidentiality',
    ],
    results: [
      { display: '517',    label: 'Phone Calls',          sub: 'High-intent seekers' },
      { display: '$34.70', label: 'Cost Per Call',        sub: '$17,943 total spend' },
      { display: '3.23%',  label: 'CTR',                  sub: '481K impressions' },
      { display: '4,644',  label: 'Limo Campaign Calls',  sub: 'Parallel campaign' },
    ],
    tags: ['Google Ads', 'Call Campaigns', 'Mental Health', 'USA'],
    heroStat: '517', heroLabel: 'Qualified Calls',
    accent: '#FDE87A', number: '06',
  },
];

const summaryStats = [
  { value: '6+',    label: 'Verified Case Studies',  color: '#FF570F' },
  { value: '$683K+', label: 'Meta Revenue / Month',  color: '#EE7D1D' },
  { value: '600%',  label: 'Peak ROAS Achieved',     color: '#FDE87A' },
  { value: '$2.7M+', label: 'Amazon Sales Driven',   color: '#FF570F' },
];

// ─── Utility ───────────────────────────────────────────────────────────────────
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// ─── Hook: Magnetic ───────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.22) => {
  useEffect(() => {
    if (isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = ref.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' });
      let raf;
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
  }, [ref, strength]);
};

// ─── GSAP Counter ─────────────────────────────────────────────────────────────
const GSAPCounter = ({ display }) => {
  const valRef = useRef(null);

  useEffect(() => {
    const el = valRef.current;
    if (!el) return;
    const numStr  = display.replace(/[^0-9.]/g, '');
    const target  = parseFloat(numStr);
    if (isNaN(target)) { el.innerText = display; return; }
    const prefix   = display.match(/^[^0-9]*/)?.[0]  || '';
    const suffix   = display.match(/[^0-9.]+$/)?.[0] || '';
    const isDecimal = display.includes('.');
    const decimals  = isDecimal
      ? (display.split('.')[1]?.replace(/[^0-9]/g, '').length || 0)
      : 0;
    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 93%', once: true },
      onUpdate() {
        const v = isDecimal ? obj.val.toFixed(decimals) : Math.floor(obj.val);
        const fmt = parseFloat(v) >= 1000
          ? parseFloat(v).toLocaleString()
          : v;
        el.innerText = `${prefix}${fmt}${suffix}`;
      },
      onComplete() { el.innerText = display; },
    });
    return () => anim.kill();
  }, [display]);

  return (
    <span
      ref={valRef}
      style={{ fontFamily: 'Montserrat, sans-serif', fontVariantNumeric: 'tabular-nums' }}
    >
      0
    </span>
  );
};

// ─── Abstract Data Visual ─────────────────────────────────────────────────────
const DataVisual = ({ accent }) => {
  const bars = [0.4, 0.65, 0.9, 0.75, 1, 0.82, 0.6, 0.88, 0.5, 0.72];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      {/* Orbiting rings */}
      <div style={{
        position: 'absolute', width: 220, height: 220, borderRadius: '50%',
        border: `1px dashed ${accent}28`,
        animation: 'orbitA 18s linear infinite',
      }}>
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: accent, boxShadow: `0 0 12px ${accent}`,
        }} />
      </div>
      <div style={{
        position: 'absolute', width: 150, height: 150, borderRadius: '50%',
        border: `1px dashed ${accent}18`,
        animation: 'orbitB 12s linear infinite',
      }}>
        <div style={{
          position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)',
          width: 5, height: 5, borderRadius: '50%',
          background: `${accent}99`,
        }} />
      </div>
      {/* Center glow */}
      <div style={{
        position: 'absolute', width: 48, height: 48, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}50 0%, transparent 70%)`,
        filter: 'blur(8px)',
      }} />
      {/* Data bars */}
      <div style={{
        position: 'absolute', bottom: 18, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'flex-end', gap: 4,
      }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 5, borderRadius: 3,
              height: `${h * 44}px`,
              background: `linear-gradient(to top, ${accent}, ${accent}40)`,
              animation: `barPulse ${1.2 + i * 0.18}s ease-in-out infinite`,
              animationDelay: `${i * 0.12}s`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
      {/* Dot grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(${accent}25 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
      }} />
    </div>
  );
};

// ─── Ticker / Marquee ─────────────────────────────────────────────────────────
const Ticker = () => {
  const items = [
    '600% ROAS', '$38K Revenue', '53% More Conversions',
    'AED 47.9K Sales', '$0.09 CPC', '517 Therapy Calls',
    '14.54x ROAS', '15,594 Conversions', '$2.7M+ Amazon', '$683K Meta/mo',
  ];
  const track = [...items, ...items, ...items];

  return (
    <div style={{
      position: 'relative', width: '100%', overflow: 'hidden',
      padding: '11px 0',
      borderTop:    '1px solid rgba(255,87,15,0.14)',
      borderBottom: '1px solid rgba(255,87,15,0.14)',
    }}>
      {/* Edge fades */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
        zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(90deg, #080a0c, transparent)',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(-90deg, #080a0c, transparent)',
      }} />

      <div style={{
        display: 'flex', gap: 40, whiteSpace: 'nowrap',
        animation: 'ticker 35s linear infinite',
        willChange: 'transform',
      }}>
        {track.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: '0.22em', color: 'rgba(255,255,255,0.22)',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#FF570F', display: 'inline-block', flexShrink: 0,
            }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Summary Stats Bar ────────────────────────────────────────────────────────
const SummaryBar = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ddw-sb',
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 93%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="ddw-summary-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10, margin: '24px 0 32px',
      }}
    >
      {summaryStats.map((s, i) => (
        <div
          key={i}
          className="ddw-sb"
          style={{
            opacity: 0, textAlign: 'center',
            padding: '18px 12px', borderRadius: 14,
            background: 'linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle accent glow */}
          <div style={{
            position: 'absolute', bottom: -20, left: '50%',
            transform: 'translateX(-50%)',
            width: 80, height: 40, borderRadius: '50%',
            background: s.color, filter: 'blur(24px)', opacity: 0.12,
            pointerEvents: 'none',
          }} />
          <div style={{
            fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.025em', marginBottom: 4,
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {s.value}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.28)', fontSize: 9,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ddw-cs-hdr',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 36px' }}
    >
      {/* Eyebrow badge */}
      <div className="ddw-cs-hdr" style={{ opacity: 0, display: 'inline-block', marginBottom: 20 }}>
        <span style={{
          padding: '7px 20px', borderRadius: 99,
          border: '1px solid rgba(255,87,15,0.3)',
          color: '#FF570F', fontSize: 10, fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '0.26em',
          background: 'rgba(255,87,15,0.08)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'Montserrat, sans-serif',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#FF570F',
            animation: 'pulse 2s infinite',
            display: 'inline-block', flexShrink: 0,
          }} />
          Verified Results — Real Dashboards
        </span>
      </div>

      {/* Headline */}
      <h2
        className="ddw-cs-hdr"
        style={{
          opacity: 0,
          fontSize: 'clamp(34px,5.5vw,62px)',
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-0.03em', color: '#fff',
          marginBottom: 14,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        Case Studies{' '}
        <span style={{
          background: 'linear-gradient(135deg,#FF570F 0%,#FDE87A 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          You Can Verify
        </span>
      </h2>

      {/* Subline */}
      <p
        className="ddw-cs-hdr"
        style={{
          opacity: 0, color: 'rgba(255,255,255,0.38)',
          fontSize: 'clamp(13px,1.8vw,15px)', lineHeight: 1.7,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Platform dashboards. Real clients. Numbers you can check.
        <br />Every result below was captured directly from live ad accounts.
      </p>
    </div>
  );
};

// ─── Case Study Card ──────────────────────────────────────────────────────────
const CaseStudyCard = memo(({ study, index }) => {
  const cardRef    = useRef(null);
  const tiltRef    = useRef(null);
  const glowRef    = useRef(null);
  const ctaRef     = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  const isLight = study.accent === '#FDE87A';
  useMagnetic(ctaRef, 0.2);

  // Entrance
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 60, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9, ease: 'power3.out',
        delay: index * 0.08,
        scrollTrigger: { trigger: cardRef.current, start: 'top 91%', once: true },
      }
    );
  }, [index]);

  // 3D Tilt — desktop only
  useEffect(() => {
    if (isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = tiltRef.current;
      if (!el) return;
      const move = (e) => {
        const r  = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top)  / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width  - 0.5) *  6;
        gsap.to(el, {
          rotationX: rx, rotationY: ry,
          duration: 0.5, ease: 'power2.out',
          transformPerspective: 1200,
        });
      };
      const leave = () => {
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
      };
      el.addEventListener('mousemove', move, { passive: true });
      el.addEventListener('mouseleave', leave);
      return () => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      };
    });
    return () => mm.revert();
  }, []);

  // Spotlight cursor glow
  const handleMouseMove = useCallback((e) => {
    if (!glowRef.current || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glowRef.current.style.background =
      `radial-gradient(280px circle at ${x}px ${y}px, ${study.accent}15, transparent 65%)`;
  }, [study.accent]);

  return (
    <div
      ref={cardRef}
      style={{ opacity: 0, transformStyle: 'preserve-3d' }}
    >
      <div
        ref={tiltRef}
        className="ddw-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{ position: 'relative' }}
      >
        {/* Card shell */}
        <div
          style={{
            position: 'relative', overflow: 'hidden',
            borderRadius: 22,
            background: 'linear-gradient(158deg,#121620 0%,#0c0f15 100%)',
            border: `1px solid ${hovered ? study.accent + '30' : 'rgba(255,255,255,0.06)'}`,
            boxShadow: hovered
              ? `0 28px 80px rgba(0,0,0,0.6), 0 0 0 1px ${study.accent}10`
              : '0 6px 32px rgba(0,0,0,0.4)',
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Spotlight glow layer */}
          <div
            ref={glowRef}
            style={{
              position: 'absolute', inset: 0,
              pointerEvents: 'none', zIndex: 0, borderRadius: 22,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />

          {/* Top accent gradient bar */}
          <div style={{
            height: 2, position: 'relative', zIndex: 1,
            background: hovered
              ? `linear-gradient(90deg,${study.accent} 0%,${study.accent}40 60%,transparent 100%)`
              : `linear-gradient(90deg,${study.accent}50 0%,transparent 70%)`,
            transition: 'background 0.4s ease',
          }} />

          {/* Watermark number */}
          <div style={{
            position: 'absolute', top: -20, right: 24,
            fontSize: 'clamp(100px,14vw,200px)',
            fontWeight: 900, lineHeight: 1,
            color: `${study.accent}06`,
            pointerEvents: 'none', userSelect: 'none', zIndex: 0,
            letterSpacing: '-0.05em',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {study.number}
          </div>

          {/* Content wrapper */}
          <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(20px,3vw,32px)' }}>

            {/* ── Header Row ── */}
            <div
              className="ddw-header-row"
              style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: 24,
                marginBottom: 22, flexWrap: 'wrap',
              }}
            >
              {/* Left: meta + title */}
              <div style={{ flex: 1, minWidth: 240 }}>
                {/* Meta badges */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 8, marginBottom: 10, flexWrap: 'wrap',
                }}>
                  <span style={{
                    padding: '4px 11px', fontSize: 9, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                    borderRadius: 99,
                    border: `1px solid ${study.accent}45`,
                    color: study.accent, background: `${study.accent}14`,
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    {study.location}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>—</span>
                  <span style={{
                    color: 'rgba(255,255,255,0.38)', fontSize: 10,
                    fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    {study.client}
                  </span>
                </div>

                {/* Industry */}
                <p style={{
                  color: 'rgba(255,255,255,0.22)', fontSize: 9.5,
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                  fontWeight: 700, marginBottom: 10,
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {study.industry}
                </p>

                {/* Title */}
                <h3 style={{
                  color: hovered ? '#ffffff' : 'rgba(255,255,255,0.92)',
                  fontSize: 'clamp(16px,2.2vw,23px)',
                  fontWeight: 900, lineHeight: 1.28,
                  maxWidth: 540, letterSpacing: '-0.02em',
                  transition: 'color 0.3s ease',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {study.title}
                </h3>
              </div>

              {/* Right: hero stat */}
              <div className="ddw-hero-stat" style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {/* Glow blob behind stat */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: study.accent,
                    filter: 'blur(36px)', opacity: hovered ? 0.28 : 0.16,
                    borderRadius: '50%', pointerEvents: 'none',
                    transition: 'opacity 0.4s ease',
                  }} />
                  <div style={{
                    position: 'relative',
                    fontSize: 'clamp(40px,5.5vw,72px)',
                    fontWeight: 900, lineHeight: 1,
                    letterSpacing: '-0.035em', color: study.accent,
                    fontFamily: 'Montserrat, sans-serif',
                    transform: hovered ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                    willChange: 'transform',
                  }}>
                    <GSAPCounter display={study.heroStat} />
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: 9,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    fontWeight: 800, textAlign: 'right', marginTop: 4,
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    {study.heroLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{
              height: 1, marginBottom: 20,
              background: hovered
                ? `linear-gradient(90deg,${study.accent}35,${study.accent}10,transparent)`
                : `linear-gradient(90deg,${study.accent}18,transparent)`,
              transition: 'background 0.4s ease',
            }} />

            {/* ── Results Grid ── */}
            <div
              className="ddw-results-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                gap: 10, marginBottom: 20,
              }}
            >
              {study.results.map((r, i) => (
                <div
                  key={i}
                  className="ddw-result-cell"
                  style={{
                    padding: 'clamp(12px,1.8vw,16px) clamp(10px,1.5vw,14px)',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.055)',
                    background: 'rgba(255,255,255,0.022)',
                    cursor: 'default',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                    transition: `transform 0.35s ${i * 45}ms ease, border-color 0.3s ease, background 0.3s ease`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${study.accent}32`;
                    e.currentTarget.style.background  = `${study.accent}0a`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.055)';
                    e.currentTarget.style.background  = 'rgba(255,255,255,0.022)';
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(16px,2.2vw,24px)', fontWeight: 900,
                    color: study.accent, marginBottom: 4,
                    letterSpacing: '-0.02em',
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    <GSAPCounter display={r.display} />
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.62)', fontSize: 9, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3,
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    {r.label}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.24)', fontSize: 9,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {r.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Expand Toggle ── */}
            <div>
              <button
                onClick={() => setExpanded(prev => !prev)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: study.accent, fontSize: 10, fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  padding: '6px 0', minHeight: 44,
                  transition: 'opacity 0.2s ease',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.65'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                aria-expanded={expanded}
              >
                {expanded ? 'Hide Details' : 'View Challenge & Solution'}
                <svg
                  style={{
                    width: 15, height: 15,
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.35s ease',
                  }}
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expandable content */}
              <div style={{
                overflow: 'hidden',
                maxHeight: expanded ? 600 : 0,
                opacity: expanded ? 1 : 0,
                marginTop: expanded ? 20 : 0,
                transition: 'max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease, margin-top 0.3s ease',
              }}>
                <div
                  className="ddw-expand-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 28, paddingTop: 20,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Challenge */}
                  <div>
                    <p style={{
                      fontSize: 9, fontWeight: 900,
                      textTransform: 'uppercase', letterSpacing: '0.22em',
                      color: study.accent, marginBottom: 12,
                      fontFamily: 'Montserrat, sans-serif',
                    }}>
                      The Challenge
                    </p>
                    <p style={{
                      color: 'rgba(255,255,255,0.52)', fontSize: 13, lineHeight: 1.75,
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <p style={{
                      fontSize: 9, fontWeight: 900,
                      textTransform: 'uppercase', letterSpacing: '0.22em',
                      color: study.accent, marginBottom: 12,
                      fontFamily: 'Montserrat, sans-serif',
                    }}>
                      What We Did
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {study.solution.map((item, i) => (
                        <li
                          key={i}
                          style={{
                            display: 'flex', alignItems: 'flex-start',
                            gap: 10, marginBottom: 10,
                            color: 'rgba(255,255,255,0.52)',
                            fontSize: 13, lineHeight: 1.65,
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          <span style={{
                            marginTop: 7, width: 5, height: 5, borderRadius: '50%',
                            background: study.accent, flexShrink: 0,
                            display: 'inline-block',
                            boxShadow: `0 0 6px ${study.accent}`,
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div
              className="ddw-footer-row"
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 14, marginTop: 20,
                paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {study.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 11px', fontSize: 9, fontWeight: 700,
                      borderRadius: 99, color: 'rgba(255,255,255,0.32)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textTransform: 'uppercase', letterSpacing: '0.12em',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                ref={ctaRef}
                href="https://calendly.com/digi-dreamworks/onboarding-call"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', minHeight: 44, borderRadius: 99,
                  fontSize: 10, fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  background: `${study.accent}18`, color: study.accent,
                  border: `1px solid ${study.accent}38`,
                  textDecoration: 'none',
                  transition: 'all 0.28s ease',
                  flexShrink: 0, willChange: 'transform',
                  fontFamily: 'Montserrat, sans-serif',
                }}
                onMouseEnter={e => {
                  const t = e.currentTarget;
                  t.style.background  = study.accent;
                  t.style.color       = isLight ? '#0a0a0a' : '#000';
                  t.style.transform   = 'translateY(-2px)';
                  t.style.boxShadow   = `0 10px 28px ${study.accent}40`;
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget;
                  t.style.background  = `${study.accent}18`;
                  t.style.color       = study.accent;
                  t.style.transform   = 'translateY(0)';
                  t.style.boxShadow   = 'none';
                }}
              >
                Get This Result
                <svg
                  style={{ width: 12, height: 12 }}
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
CaseStudyCard.displayName = 'CaseStudyCard';

// ─── Floating CTA Button ──────────────────────────────────────────────────────
const CtaButton = () => {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);
  useMagnetic(ref, 0.28);

  return (
    <a
      ref={ref}
      href="https://calendly.com/digi-dreamworks/onboarding-call"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '16px 36px', minHeight: 56, borderRadius: 99,
        background: hov
          ? 'linear-gradient(135deg,#FDE87A 0%,#FF570F 100%)'
          : 'linear-gradient(135deg,#FF570F 0%,#EE7D1D 100%)',
        color: '#000', fontWeight: 900, fontSize: 11,
        textTransform: 'uppercase', letterSpacing: '0.2em',
        textDecoration: 'none',
        boxShadow: hov
          ? '0 0 52px rgba(253,232,122,0.4), 0 10px 40px rgba(255,87,15,0.45)'
          : '0 0 28px rgba(255,87,15,0.35), 0 8px 24px rgba(255,87,15,0.25)',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        willChange: 'transform',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      Book a Strategy Call
      <svg
        style={{
          width: 16, height: 16,
          transform: hov ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
        fill="none" stroke="currentColor" strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CaseStudies = () => {
  const sectionRef = useRef(null);
  const ctaRef     = useRef(null);
  const pillRef1   = useRef(null);
  const pillRef2   = useRef(null);

  // CTA entrance
  useEffect(() => {
    if (!ctaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 93%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Floating pills
  useEffect(() => {
    [{ ref: pillRef1, d: 0 }, { ref: pillRef2, d: 0.6 }].forEach(({ ref, d }) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y: -10, duration: 2.2, repeat: -1,
        yoyo: true, ease: 'sine.inOut', delay: d,
      });
    });
  }, []);

  return (
    <>
      <GlobalStyles />

      <section
        ref={sectionRef}
        id="case-studies"
        style={{
          position: 'relative',
          paddingTop:    'clamp(60px,8vw,100px)',
          paddingBottom: 'clamp(60px,8vw,100px)',
          overflowX: 'hidden',
          background: '#080a0c',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
        }}
      >

        {/* ── Atmospheric Orbs ── */}
        <div style={{
          position: 'absolute', top: '-8%', right: '-5%',
          width: 750, height: 750, borderRadius: '50%',
          background: 'radial-gradient(circle,#FF570F 0%,transparent 68%)',
          filter: 'blur(180px)', opacity: 0.035,
          pointerEvents: 'none', transform: 'translateZ(0)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-8%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle,#FDE87A 0%,transparent 68%)',
          filter: 'blur(160px)', opacity: 0.025,
          pointerEvents: 'none', transform: 'translateZ(0)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '35%',
          width: 450, height: 450, borderRadius: '50%',
          background: 'radial-gradient(circle,#EE7D1D 0%,transparent 68%)',
          filter: 'blur(170px)', opacity: 0.018,
          pointerEvents: 'none', transform: 'translateZ(0)',
        }} />

        {/* ── Dot Grid ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,87,15,0.1) 1px,transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage:
            'radial-gradient(ellipse at 50% 20%,black 30%,transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 20%,black 30%,transparent 75%)',
        }} />

        {/* ── Decorative floating pills ── */}
        <div
          ref={pillRef1}
          style={{
            position: 'absolute', top: '8%', right: 'clamp(16px,5vw,60px)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 16px', borderRadius: 99,
            background: 'rgba(255,87,15,0.08)',
            border: '1px solid rgba(255,87,15,0.2)',
            fontSize: 10, fontWeight: 900, color: '#FF570F',
            textTransform: 'uppercase', letterSpacing: '0.14em',
            pointerEvents: 'none',
            fontFamily: 'Montserrat, sans-serif',
            willChange: 'transform',
            zIndex: 2,
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#FF570F', animation: 'pulse 1.8s infinite',
          }} />
          Live Verified
        </div>

        <div
          ref={pillRef2}
          style={{
            position: 'absolute', top: '14%', right: 'clamp(16px,5vw,60px)',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 99,
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.42)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            pointerEvents: 'none',
            fontFamily: 'Montserrat, sans-serif',
            willChange: 'transform',
            zIndex: 2,
          }}
        >
          ◈ 6 Case Studies
        </div>

        {/* ── Main content ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 1160, margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
        }}>
          <SectionHeader />
          <Ticker />
          <SummaryBar />

          {/* Cards stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={study.client} study={study} index={index} />
            ))}
          </div>

          {/* ── Bottom CTA block ── */}
          <div
            ref={ctaRef}
            style={{
              opacity: 0, marginTop: 64,
              textAlign: 'center',
              padding: 'clamp(36px,5vw,56px) clamp(20px,4vw,48px)',
              borderRadius: 24,
              background:
                'linear-gradient(135deg,rgba(255,87,15,0.07) 0%,rgba(253,232,122,0.03) 100%)',
              border: '1px solid rgba(255,87,15,0.14)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* BG watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              fontSize: 'clamp(80px,14vw,200px)',
              fontWeight: 900, color: '#fff',
              opacity: 0.025, pointerEvents: 'none', lineHeight: 1,
              letterSpacing: '-0.05em', whiteSpace: 'nowrap',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              DDW
            </div>

            {/* Abstract data visual in background */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }}>
              <DataVisual accent="#FF570F" />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{
                fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.3em', color: '#FF570F', marginBottom: 14,
                fontFamily: 'Montserrat, sans-serif',
              }}>
                Ready to be the next case study?
              </p>

              <h3 style={{
                fontSize: 'clamp(24px,4vw,42px)', fontWeight: 900,
                lineHeight: 1.15, letterSpacing: '-0.025em',
                color: '#fff', marginBottom: 8,
                fontFamily: 'Montserrat, sans-serif',
              }}>
                Let's build results{' '}
                <span style={{
                  background: 'linear-gradient(135deg,#FF570F 0%,#FDE87A 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  you can verify.
                </span>
              </h3>

              <p style={{
                color: 'rgba(255,255,255,0.3)', fontSize: 13, lineHeight: 1.65,
                marginBottom: 32, fontFamily: 'Inter, sans-serif',
              }}>
                Platform dashboards. Real numbers. No projections.
              </p>

              <CtaButton />

              <p style={{
                color: 'rgba(255,255,255,0.18)', fontSize: 11,
                marginTop: 16, fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.04em',
              }}>
                Response within 24 hours. No pitch. No fluff.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CaseStudies;