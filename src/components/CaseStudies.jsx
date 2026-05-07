import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────────
const caseStudies = [
  {
    client: 'Mathfel',
    industry: 'B2B Tech — Video Door Intercom Systems',
    location: 'EU',
    title: 'ROAS Doubled to 600% on €69.7K Monthly Google Ads Spend',
    challenge: 'Mathfel specialises in high-quality video door intercom systems. They were running Google Shopping at 310% ROAS on ~€60K/month. The ceiling was margin erosion as spend scaled toward €70K. They needed a structure that could absorb the budget increase without compressing returns.',
    solution: ['Restructured Google Shopping feed with product-level margin segmentation', 'Implemented tiered bidding by margin and seasonal demand curves', 'Split campaigns by high-AOV vs. volume products to protect blended ROAS', 'Added Performance Max alongside Shopping for incremental reach'],
    results: [{ display: '600%', label: 'Peak ROAS', sub: 'Up from 310%' }, { display: '418K', label: 'Sales (EUR)', sub: 'Sep–Dec 2024' }, { display: '1.1K', label: 'Conversions', sub: 'Up from 623' }, { display: '114%', label: 'Conv. Value Increase', sub: 'Same budget' }],
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
    solution: ['Complete campaign rebuild with SKU-level segmentation by margin and AOV', 'Keyword strategy shifted to high-intent transactional terms', 'Landing page alignment to highest-converting product categories', 'Budget reallocation from broad match to exact and phrase match winners'],
    results: [{ display: '14.54x', label: 'Final ROAS', sub: 'Up from 1.83x' }, { display: '$38K', label: 'Revenue Generated', sub: 'On $2,625 spend' }, { display: '7x', label: 'Sales Increase', sub: 'Same budget' }, { display: '62%', label: 'Impressions Growth', sub: '270K → 441K' }],
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
    solution: ['Full keyword audit: removed low-intent terms bleeding budget', 'Restructured ad groups around franchise-specific service lines', 'Landing page rebuilds to match ad message and eliminate conversion friction', 'Added callout extensions and sitelinks for credibility and click-through'],
    results: [{ display: '53%', label: 'Conversion Increase', sub: '15 → 23/month' }, { display: '$71.42', label: 'Cost Per Conv.', sub: 'Down from $144.54' }, { display: '45%', label: 'Conv. Rate Lift', sub: '8.33% → 12.11%' }, { display: '56%', label: 'Brand Impressions', sub: '5.72K → 8.5K' }],
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
    solution: ['Built awareness-to-conversion funnel: reach → engagement → purchase', 'Created lookalike audiences from Shopify purchase data', 'Launched dynamic product ads for abandoned cart recovery', 'Optimised creative by product category for UAE purchasing behaviour'],
    results: [{ display: 'AED 47.9K', label: 'Total Sales', sub: 'Shopify-tracked' }, { display: '572', label: 'Orders', sub: '1.32% conv. rate' }, { display: '4.86x', label: 'Purchase ROAS', sub: 'Return on ad spend' }, { display: '42,633', label: 'Sessions', sub: 'Driven to storefront' }],
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
    solution: ['Rebuilt keyword strategy around long-tail, high-intent health service queries', 'Created service-line specific ad groups with dedicated landing pages', 'Implemented call tracking integrated with appointment booking system', 'Layered bid adjustments for time-of-day and geo to match intent windows'],
    results: [{ display: '15,594', label: 'Conversions', sub: 'Patient contacts' }, { display: '$0.09', label: 'Average CPC', sub: 'vs $3–5 benchmark' }, { display: '4.58%', label: 'CTR', sub: '1.56M impressions' }, { display: '$6.3K', label: 'Total Ad Spend', sub: 'Exceptional efficiency' }],
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
    solution: ['Call-only campaigns targeting crisis and immediate-need search queries', 'Custom call tracking with practice management system integration', 'Optimised phone impression share during highest-intent time windows', 'A/B tested ad copy focused on immediate availability and confidentiality'],
    results: [{ display: '517', label: 'Phone Calls', sub: 'High-intent seekers' }, { display: '$34.70', label: 'Cost Per Call', sub: '$17,943 total spend' }, { display: '3.23%', label: 'CTR', sub: '481K impressions' }, { display: '4,644', label: 'Limo Campaign Calls', sub: 'Parallel campaign' }],
    tags: ['Google Ads', 'Call Campaigns', 'Mental Health', 'USA'],
    heroStat: '517', heroLabel: 'Qualified Calls',
    accent: '#FDE87A', number: '06',
  }
];

const summaryStats = [
  { value: '6+', label: 'Verified Case Studies', icon: '◈' },
  { value: '$683K+', label: 'Meta Revenue / Month', icon: '◈' },
  { value: '600%', label: 'Peak ROAS Achieved', icon: '◈' },
  { value: '$2.7M+', label: 'Amazon Sales Driven', icon: '◈' },
];

// ─── GSAP Counter ──────────────────────────────────────────────────────────────
const GSAPCounter = ({ display }) => {
  const valRef = useRef(null);
  useEffect(() => {
    const el = valRef.current;
    if (!el) return;
    const numMatch = display.replace(/[^0-9.]/g, '');
    const target = parseFloat(numMatch);
    if (isNaN(target)) { el.innerText = display; return; }
    const prefix = display.match(/^[^0-9]*/)?.[0] || '';
    const suffix = display.match(/[^0-9.]+$/)?.[0] || '';
    const isDecimal = display.includes('.');
    const decimals = isDecimal ? (display.split('.')[1]?.replace(/[^0-9]/g, '').length || 0) : 0;
    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        const v = isDecimal ? obj.val.toFixed(decimals) : Math.floor(obj.val);
        const formatted = parseFloat(v) >= 1000 ? parseFloat(v).toLocaleString() : v;
        el.innerText = `${prefix}${formatted}${suffix}`;
      },
      onComplete: () => { el.innerText = display; }
    });
    return () => anim.kill();
  }, [display]);
  return <span ref={valRef}>0</span>;
};

// ─── Ticker ────────────────────────────────────────────────────────────────────
const Ticker = () => {
  const items = ['600% ROAS', '$38K Revenue', '53% More Conversions', 'AED 47.9K Sales', '$0.09 CPC', '517 Therapy Calls', '14.54x ROAS', '15,594 Conversions', '$2.7M+ Amazon', '$683K Meta/mo'];
  const track = [...items, ...items, ...items];
  return (
    <div className="relative w-full overflow-hidden py-3" style={{ borderTop: '1px solid rgba(255,87,15,0.12)', borderBottom: '1px solid rgba(255,87,15,0.12)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #080a0c, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg, #080a0c, transparent)' }} />
      <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'ticker 35s linear infinite' }}>
        {track.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.22)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF570F', display: 'inline-block', flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
    </div>
  );
};

// ─── Case Study Card ───────────────────────────────────────────────────────────
const CaseStudyCard = ({ study, index }) => {
  const cardRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const isLight = study.accent === '#FDE87A';

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  }, []);

  return (
    <div ref={cardRef} style={{ opacity: 0 }} className="group relative">
      {/* Card */}
      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          background: 'linear-gradient(160deg, #10131a 0%, #0b0d12 100%)',
          border: '1px solid rgba(255,255,255,0.055)',
          borderRadius: 20,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${study.accent}35`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.055)'; }}
      >
        {/* Top accent line */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${study.accent} 0%, transparent 70%)` }} />

        {/* Watermark number */}
        <div style={{
          position: 'absolute', top: -10, right: 20,
          fontSize: 180, fontWeight: 900, lineHeight: 1,
          color: `${study.accent}07`, pointerEvents: 'none',
          userSelect: 'none', zIndex: 0, fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.04em',
        }}>
          {study.number}
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px 24px' }}>

          {/* ── Header Row ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              {/* Meta badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', fontSize: 9, fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  borderRadius: 99, border: `1px solid ${study.accent}45`,
                  color: study.accent, background: `${study.accent}12`,
                }}>
                  {study.location}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>—</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {study.client}
                </span>
              </div>

              {/* Industry */}
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 8 }}>
                {study.industry}
              </p>

              {/* Title */}
              <h3 style={{
                color: '#fff', fontSize: 'clamp(17px, 2.2vw, 24px)',
                fontWeight: 900, lineHeight: 1.25, maxWidth: 520,
                letterSpacing: '-0.01em',
              }}>
                {study.title}
              </h3>
            </div>

            {/* Hero Stat */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: study.accent, filter: 'blur(32px)', opacity: 0.18, pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'relative',
                  fontSize: 'clamp(44px, 5vw, 68px)',
                  fontWeight: 900, lineHeight: 1,
                  letterSpacing: '-0.03em', color: study.accent,
                }}>
                  <GSAPCounter display={study.heroStat} />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, textAlign: 'right', marginTop: 2 }}>
                  {study.heroLabel}
                </div>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${study.accent}25, transparent)`, marginBottom: 18 }} />

          {/* ── Results Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
            {study.results.map((r, i) => (
              <div
                key={i}
                className="group/stat"
                style={{
                  padding: '14px 12px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.018)',
                  transition: 'border-color 0.3s, background 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${study.accent}30`;
                  e.currentTarget.style.background = `${study.accent}08`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.018)';
                }}
              >
                <div style={{ fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 900, color: study.accent, marginBottom: 3, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                  <GSAPCounter display={r.display} />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{r.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{r.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Expand Toggle ── */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: study.accent, fontSize: 10, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                padding: 0, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {expanded ? 'Hide Details' : 'View Challenge & Solution'}
              <svg
                style={{ width: 14, height: 14, transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div style={{
              overflow: 'hidden',
              maxHeight: expanded ? 500 : 0,
              opacity: expanded ? 1 : 0,
              transition: 'max-height 0.5s ease, opacity 0.4s ease',
              marginTop: expanded ? 18 : 0,
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
                paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: study.accent, marginBottom: 10 }}>
                    The Challenge
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7 }}>{study.challenge}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: study.accent, marginBottom: 10 }}>
                    What We Did
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {study.solution.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9, color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.55 }}>
                        <span style={{ marginTop: 6, width: 5, height: 5, borderRadius: '50%', background: study.accent, flexShrink: 0, display: 'inline-block' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12, marginTop: 18,
            paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.045)',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {study.tags.map(tag => (
                <span key={tag} style={{
                  padding: '4px 10px', fontSize: 9, fontWeight: 700, borderRadius: 99,
                  color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Magnetic-feel CTA */}
            <a
              href="https://calendly.com/digi-dreamworks/onboarding-call"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 20px', borderRadius: 99, fontSize: 10,
                fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em',
                background: `${study.accent}18`, color: study.accent,
                border: `1px solid ${study.accent}35`,
                textDecoration: 'none', transition: 'all 0.25s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = study.accent;
                e.currentTarget.style.color = isLight ? '#0a0a0a' : '#0a0a0a';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${study.accent}35`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `${study.accent}18`;
                e.currentTarget.style.color = study.accent;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get This Result
              <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = () => {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cs-hdr',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true }
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 32px' }}>
      <div className="cs-hdr" style={{ opacity: 0, display: 'inline-block', marginBottom: 16 }}>
        <span style={{
          padding: '6px 18px', borderRadius: 99,
          border: '1px solid rgba(255,87,15,0.28)',
          color: '#FF570F', fontSize: 10, fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '0.25em',
          background: 'rgba(255,87,15,0.07)',
          display: 'inline-flex', alignItems: 'center', gap: 7,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF570F', animation: 'pulse 2s infinite' }} />
          Verified Results
        </span>
      </div>

      <h2 className="cs-hdr" style={{
        opacity: 0, fontSize: 'clamp(34px, 5vw, 58px)',
        fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em',
        color: '#fff', marginBottom: 12,
      }}>
        Case Studies{' '}
        <span style={{
          background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          You Can Verify
        </span>
      </h2>

      <p className="cs-hdr" style={{ opacity: 0, color: 'rgba(255,255,255,0.38)', fontSize: 15, lineHeight: 1.65 }}>
        Platform dashboards. Real clients. Numbers you can check.
      </p>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

// ─── Summary Stats Bar ─────────────────────────────────────────────────────────
const SummaryBar = () => {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sb-item',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true }
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, margin: '24px 0 28px' }}>
      {summaryStats.map((s, i) => (
        <div key={i} className="sb-item" style={{
          opacity: 0, textAlign: 'center', padding: '16px 12px',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.018)',
        }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>{s.value}</div>
          <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const CaseStudies = () => {
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="case-studies"
      style={{
        position: 'relative',
        paddingTop: 80,
        paddingBottom: 80,
        overflow: 'hidden',
        background: '#080a0c',
      }}
    >
      {/* Atmosphere blobs */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, #FF570F 0%, transparent 70%)',
        filter: 'blur(150px)', opacity: 0.035, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, #FDE87A 0%, transparent 70%)',
        filter: 'blur(130px)', opacity: 0.025, pointerEvents: 'none',
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25,
        backgroundImage: 'radial-gradient(rgba(255,87,15,0.12) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />

      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 24px', zIndex: 1 }}>
        <SectionHeader />
        <Ticker />
        <SummaryBar />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={index} study={study} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div ref={ctaRef} style={{ opacity: 0, marginTop: 56, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700, marginBottom: 20 }}>
            Ready to be the next case study?
          </p>
          <a
            href="https://calendly.com/digi-dreamworks/onboarding-call"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', background: '#FF570F',
              color: '#000', fontWeight: 900, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              borderRadius: 99, textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 12px 36px rgba(255,87,15,0.28)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FDE87A';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 44px rgba(253,232,122,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FF570F';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,87,15,0.28)';
            }}
          >
            Book a Strategy Call
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, marginTop: 12 }}>Response within 24 hours. No pitch. No fluff.</p>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;