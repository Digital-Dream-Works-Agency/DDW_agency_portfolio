import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Global Styles Injection ───────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes mq {
      from { transform: translate3d(0,0,0); }
      to   { transform: translate3d(-33.33%,0,0); }
    }
    @keyframes pulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.35; }
    }
    @keyframes spinRing {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes spinRingRev {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }
    @keyframes floatY {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-10px); }
    }
    @keyframes blink {
      0%,100% { opacity:1; }
      50%      { opacity:0; }
    }

    .ddw-card-tilt { transform-style: preserve-3d; will-change: transform; }

    .ddw-filter-btn:hover .ddw-filter-icon { transform: scale(1.2) rotate(10deg); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #080a0c; }
    ::-webkit-scrollbar-thumb { background: #FF570F40; border-radius: 99px; }

    /* Focus outline */
    button:focus-visible { outline: 2px solid #FF570F; outline-offset: 3px; }
    a:focus-visible      { outline: 2px solid #FF570F; outline-offset: 3px; }
  `}</style>
);

// ─── Data ──────────────────────────────────────────────────────────────────────
const projectsData = [
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

const CATEGORIES  = ['All', 'Meta Ads', 'Google Ads', 'Amazon', 'TikTok Shop', 'SEO', 'SaaS'];
const ITEMS_PER_PAGE = 6;

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

// ─── Utility: is touch device ─────────────────────────────────────────────────
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
          xTo((e.clientX - r.left - r.width / 2) * strength);
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

// ─── Abstract Visual: Orbital Ring Node ──────────────────────────────────────
const OrbitalNode = ({ accent }) => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', pointerEvents: 'none',
  }}>
    {/* Glow core */}
    <div style={{
      position: 'absolute', width: 60, height: 60, borderRadius: '50%',
      background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
      filter: 'blur(12px)',
    }} />
    {/* Inner dot */}
    <div style={{
      position: 'absolute', width: 8, height: 8, borderRadius: '50%',
      background: accent, boxShadow: `0 0 16px ${accent}`,
      animation: 'pulse 2s ease infinite',
    }} />
    {/* Ring 1 */}
    <div style={{
      position: 'absolute', width: 90, height: 90, borderRadius: '50%',
      border: `1px dashed ${accent}40`,
      animation: 'spinRing 8s linear infinite',
    }}>
      <div style={{
        position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)',
        width: 6, height: 6, borderRadius: '50%', background: accent,
        boxShadow: `0 0 8px ${accent}`,
      }} />
    </div>
    {/* Ring 2 */}
    <div style={{
      position: 'absolute', width: 140, height: 140, borderRadius: '50%',
      border: `1px dashed ${accent}22`,
      animation: 'spinRingRev 14s linear infinite',
    }}>
      <div style={{
        position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)',
        width: 5, height: 5, borderRadius: '50%', background: `${accent}88`,
      }} />
    </div>
    {/* Ring 3 */}
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
);

// ─── Marquee ──────────────────────────────────────────────────────────────────
const Marquee = () => {
  const items = [
    '$683K Meta/mo', '600% ROAS', '$2.7M Amazon', '14.54x ROAS',
    '$290K GMV', '15,594 Conversions', '251K SEO Clicks',
    '+121% TikTok Growth', '4.86x ROAS', '978+ AI Calls',
  ];
  const track = [...items, ...items, ...items];

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderTop:    '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '11px 0',
    }}>
      {/* Edge fades */}
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

      <div style={{
        display: 'flex', gap: 40, whiteSpace: 'nowrap',
        animation: 'mq 32s linear infinite',
        willChange: 'transform',
      }}>
        {track.map((t, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              background: '#FF570F', display: 'inline-block', flexShrink: 0,
            }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ddw-sb',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const stats = [
    { v: '$683K+', l: 'Meta / Month',   icon: 'ƒ',  color: '#FF570F' },
    { v: '14',     l: 'Live Projects',  icon: '◈',  color: '#FDE87A' },
    { v: '$2.7M+', l: 'Amazon Sales',   icon: 'a',  color: '#EE7D1D' },
    { v: '600%',   l: 'Peak ROAS',      icon: 'G',  color: '#4ade80' },
  ];

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10,
      margin: '20px 0 28px',
    }}>
      <style>{`
        @media (min-width: 640px) {
          .ddw-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
      {stats.map((s, i) => (
        <div
          key={i}
          className="ddw-sb"
          style={{
            opacity: 0, textAlign: 'center',
            padding: '18px 12px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.012) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Watermark icon */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 64, fontWeight: 900, color: s.color,
            opacity: 0.04, pointerEvents: 'none',
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: 1,
          }}>
            {s.icon}
          </div>
          <div style={{
            fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.03em', marginBottom: 4,
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {s.v}
          </div>
          <div style={{
            fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em',
            fontWeight: 700, color: 'rgba(255,255,255,0.25)',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {s.l}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Filter Tab ───────────────────────────────────────────────────────────────
const FilterTab = memo(({ cat, isActive, onClick, count }) => {
  const ref    = useRef(null);
  const accent = CAT_COLORS[cat];
  useMagnetic(ref, 0.12);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="ddw-filter-btn"
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 16px',
        minHeight: 44,
        borderRadius: 99,
        fontSize: 10, fontWeight: 900,
        textTransform: 'uppercase', letterSpacing: '0.18em',
        cursor: 'pointer',
        border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.07)'}`,
        background: isActive ? accent : 'rgba(255,255,255,0.035)',
        color: isActive ? '#000' : 'rgba(255,255,255,0.4)',
        boxShadow: isActive ? `0 0 28px ${accent}45, 0 0 60px ${accent}15` : 'none',
        transition: 'all 0.25s ease',
        willChange: 'transform',
        fontFamily: 'Montserrat, sans-serif',
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
    >
      <span
        className="ddw-filter-icon"
        style={{
          fontSize: 12, display: 'inline-block',
          transition: 'transform 0.25s ease',
        }}
      >
        {CAT_ICONS[cat]}
      </span>
      {cat}
      {count != null && (
        <span style={{ fontSize: 9, opacity: 0.55, fontWeight: 700 }}>
          {count}
        </span>
      )}
    </button>
  );
});
FilterTab.displayName = 'FilterTab';

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = memo(({ item, index }) => {
  const [hovered,   setHovered]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const tiltRef = useRef(null);

  const isExternal = !!item.url;
  const dest       = item.url || `/projects/${item.id}`;
  const accent     = CAT_COLORS[item.category] || '#FF570F';
  const primaryVal = Object.values(item.metrics)[0];
  const primaryKey = Object.keys(item.metrics)[0];

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'power3.out',
          delay: (index % ITEMS_PER_PAGE) * 0.07,
          scrollTrigger: {
            trigger: cardRef.current, start: 'top 93%', once: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  // 3D Tilt — desktop only
  useEffect(() => {
    if (isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = tiltRef.current;
      if (!el) return;
      const move = (e) => {
        const r   = el.getBoundingClientRect();
        const rx  = ((e.clientY - r.top)  / r.height - 0.5) * -12;
        const ry  = ((e.clientX - r.left) / r.width  - 0.5) *  12;
        gsap.to(el, { rotationX: rx, rotationY: ry, duration: 0.45, ease: 'power2.out', transformPerspective: 900 });
      };
      const leave = () => {
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.55, ease: 'power3.out' });
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

  // Spotlight / cursor glow
  const handleMouseMove = useCallback((e) => {
    if (!glowRef.current || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glowRef.current.style.background =
      `radial-gradient(220px circle at ${x}px ${y}px, ${accent}20, transparent 68%)`;
  }, [accent]);

  const cardInner = (
    <div
      ref={tiltRef}
      className="ddw-card-tilt"
      style={{ height: '100%' }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          opacity: 0,
          position: 'relative', display: 'flex', flexDirection: 'column',
          height: '100%', borderRadius: 20, overflow: 'hidden',
          cursor: 'pointer',
          background: 'linear-gradient(155deg, #12151a 0%, #0b0d12 100%)',
          border: `1px solid ${hovered ? accent + '3a' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered
            ? `0 2px 0 ${accent}20 inset, 0 28px 70px rgba(0,0,0,0.65), 0 0 0 1px ${accent}10`
            : '0 4px 28px rgba(0,0,0,0.4)',
          transition: 'border-color 0.35s, box-shadow 0.35s',
          willChange: 'transform, opacity',
        }}
      >
        {/* Spotlight glow layer */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none', zIndex: 0, borderRadius: 20,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Top gradient accent bar */}
        <div style={{
          height: 2, position: 'relative', zIndex: 1,
          background: hovered
            ? `linear-gradient(90deg, ${accent}, ${accent}00)`
            : 'rgba(255,255,255,0.045)',
          transition: 'background 0.4s',
        }} />

        {/* ── Thumbnail / Visual Zone ── */}
        <div style={{
          position: 'relative', height: 215,
          background: '#090c10', overflow: 'hidden', zIndex: 1,
        }}>
          {item.img ? (
            <>
              {!imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `${accent}08`,
                  animation: 'pulse 2s ease infinite',
                }} />
              )}
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'top',
                  opacity: imgLoaded ? (hovered ? 0.7 : 0.48) : 0,
                  transform: hovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'opacity 0.5s, transform 0.7s ease',
                  willChange: 'transform, opacity',
                }}
              />
            </>
          ) : (
            /* Abstract orbital visual */
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at 50% 0%, ${accent}16, transparent 65%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <OrbitalNode accent={accent} />
              {/* Primary metric overlay */}
              <div style={{
                position: 'relative', zIndex: 2, textAlign: 'center',
              }}>
                <div style={{
                  fontSize: primaryVal.length > 6 ? 'clamp(28px,6vw,42px)' : 'clamp(38px,7vw,58px)',
                  fontWeight: 900, color: accent, lineHeight: 1,
                  letterSpacing: '-0.04em',
                  textShadow: `0 0 60px ${accent}66`,
                  transform: hovered ? 'scale(1.09)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                  willChange: 'transform',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {primaryVal}
                </div>
                <div style={{
                  fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.24em',
                  fontWeight: 700, color: `${accent}60`, marginTop: 6,
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {primaryKey}
                </div>
              </div>
            </div>
          )}

          {/* Bottom vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent 28%, #0b0d12 100%)',
          }} />

          {/* Category badge */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 3 }}>
            <span style={{
              padding: '5px 11px', fontSize: 9, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.18em', borderRadius: 99,
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
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', fontSize: 9, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.15em',
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

          {/* Tags — slide up on hover */}
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            display: 'flex', flexWrap: 'wrap', gap: 5, zIndex: 3,
          }}>
            {item.tags.map((tag, i) => (
              <span
                key={tag}
                style={{
                  padding: '3px 9px', fontSize: 9, fontWeight: 700, borderRadius: 99,
                  background: 'rgba(0,0,0,0.65)',
                  color: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  backdropFilter: 'blur(8px)',
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.3s ${i * 50}ms, transform 0.3s ${i * 50}ms`,
                  willChange: 'transform, opacity',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Content Area ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '18px 20px 20px', position: 'relative', zIndex: 1,
        }}>
          {/* Title */}
          <h4 style={{
            fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 900, lineHeight: 1.3,
            color: hovered ? '#fff' : 'rgba(255,255,255,0.88)',
            marginBottom: 14, letterSpacing: '-0.02em',
            transition: 'color 0.3s',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {item.title}
          </h4>

          {/* Metrics row */}
          <div style={{
            display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 14,
          }}>
            {Object.entries(item.metrics).slice(0, 3).map(([key, val], i) => (
              <div
                key={key}
                style={{
                  transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                  transition: `transform 0.3s ${i * 45}ms`,
                  willChange: 'transform',
                }}
              >
                <div style={{
                  fontSize: 'clamp(15px, 3vw, 19px)', fontWeight: 900,
                  color: accent, lineHeight: 1, letterSpacing: '-0.02em',
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {val}
                </div>
                <div style={{
                  fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.16em',
                  color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginTop: 3,
                  fontFamily: 'Montserrat, sans-serif',
                }}>
                  {key}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: 1, marginBottom: 14,
            background: hovered
              ? `linear-gradient(90deg, ${accent}38, transparent)`
              : 'rgba(255,255,255,0.048)',
            transition: 'background 0.4s',
          }} />

          {/* Footer CTA */}
          <div style={{
            marginTop: 'auto', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: hovered ? accent : 'rgba(255,255,255,0.22)',
              transition: 'color 0.3s',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {isExternal ? 'Visit Live' : 'View Project'}
            </span>

            {/* Arrow button */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hovered ? accent : 'rgba(255,255,255,0.05)',
              border: `1px solid ${hovered ? accent : 'rgba(255,255,255,0.08)'}`,
              transform: hovered ? 'rotate(45deg) scale(1.12)' : 'rotate(0) scale(1)',
              boxShadow: hovered ? `0 0 22px ${accent}66` : 'none',
              transition: 'all 0.32s ease',
              willChange: 'transform',
            }}>
              <svg
                style={{
                  width: 13, height: 13,
                  color: hovered ? '#000' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.3s',
                }}
                fill="none" stroke="currentColor" strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isExternal ? (
    <a
      href={dest}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block', outline: 'none',
        textDecoration: 'none', height: '100%',
      }}
    >
      {cardInner}
    </a>
  ) : (
    <a
      href={dest}
      style={{
        display: 'block', outline: 'none',
        textDecoration: 'none', height: '100%',
      }}
    >
      {cardInner}
    </a>
  );
});
ProjectCard.displayName = 'ProjectCard';

// ─── Pagination Button ────────────────────────────────────────────────────────
const PageBtn = memo(({ onClick, disabled, isActive, children, label }) => {
  const ref = useRef(null);
  useMagnetic(ref, 0.18);

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 42, height: 42,
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 900,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: isActive
          ? '#FF570F'
          : disabled ? 'transparent' : 'rgba(255,255,255,0.04)',
        color: isActive
          ? '#000'
          : disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.55)',
        border: `1px solid ${
          isActive
            ? '#FF570F'
            : disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'
        }`,
        boxShadow: isActive ? '0 0 24px #FF570F50' : 'none',
        transition: 'all 0.25s ease',
        willChange: 'transform',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {children}
    </button>
  );
});
PageBtn.displayName = 'PageBtn';

// ─── Floating Ambient Pill ────────────────────────────────────────────────────
const FloatingPill = ({ children, style = {} }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -10, duration: 2 + Math.random(),
      repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
  }, []);
  return (
    <div ref={ref} style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 14px', borderRadius: 99,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      backdropFilter: 'blur(12px)',
      fontSize: 10, fontWeight: 700,
      color: 'rgba(255,255,255,0.55)',
      fontFamily: 'Montserrat, sans-serif',
      letterSpacing: '0.12em', textTransform: 'uppercase',
      willChange: 'transform',
      ...style,
    }}>
      {children}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AllProjects = () => {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const gridRef     = useRef(null);
  const titleRef    = useRef(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage,    setCurrentPage]    = useState(1);

  const filtered       = activeCategory === 'All'
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);
  const totalPages     = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex     = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const accentColor    = CAT_COLORS[activeCategory];

  // Header entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ddw-hi',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  // Category change
  const handleCategoryChange = useCallback((cat) => {
    if (cat === activeCategory) return;
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0, y: 12, duration: 0.22, ease: 'power2.in',
        onComplete: () => {
          setActiveCategory(cat);
          setCurrentPage(1);
          gsap.to(gridRef.current, {
            opacity: 1, y: 0, duration: 0.38, ease: 'power3.out',
          });
        },
      });
    } else {
      setActiveCategory(cat);
      setCurrentPage(1);
    }
  }, [activeCategory]);

  // Pagination
  const goTo = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0, y: 10, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          setCurrentPage(page);
          gsap.to(gridRef.current, {
            opacity: 1, y: 0, duration: 0.32, ease: 'power3.out',
          });
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      });
    } else {
      setCurrentPage(page);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [totalPages]);

  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <>
      <GlobalStyles />

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

        {/* ── Atmospheric Orbs ── */}
        <div style={{
          position: 'absolute', top: '-5%', right: '-5%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, #FF570F 0%, transparent 65%)',
          filter: 'blur(180px)', opacity: 0.035,
          pointerEvents: 'none', transform: 'translateZ(0)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '-8%',
          width: 550, height: 550, borderRadius: '50%',
          background: 'radial-gradient(circle, #FDE87A 0%, transparent 65%)',
          filter: 'blur(150px)', opacity: 0.025,
          pointerEvents: 'none', transform: 'translateZ(0)',
        }} />
        <div style={{
          position: 'absolute', top: '45%', left: '40%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, #a78bfa 0%, transparent 65%)',
          filter: 'blur(160px)', opacity: 0.018,
          pointerEvents: 'none', transform: 'translateZ(0)',
        }} />

        {/* ── Dot Grid ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.052) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
        }} />

        {/* ─────────────────── HEADER ─────────────────── */}
        <div
          ref={headerRef}
          style={{
            position: 'relative',
            padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 40px) 0',
            maxWidth: 1280, margin: '0 auto',
          }}
        >

          {/* Eyebrow */}
          <div className="ddw-hi" style={{
            opacity: 0, display: 'flex', alignItems: 'center',
            gap: 12, marginBottom: 28,
          }}>
            <div style={{ height: 1, width: 36, background: '#FF570F', flexShrink: 0 }} />
            <span style={{
              fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: '0.28em', color: '#FF570F',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              Real Accounts · Real Numbers · No Projections
            </span>
          </div>

          {/* Floating pills — decorative */}
          <div style={{ position: 'absolute', top: 'clamp(60px,9vw,100px)', right: 'clamp(16px,5vw,60px)', display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.7 }}>
            <FloatingPill style={{ color: '#FF570F', borderColor: '#FF570F20' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF570F', animation: 'pulse 1.5s infinite' }} />
              Live Data
            </FloatingPill>
            <FloatingPill>
              ◈ 14 Campaigns
            </FloatingPill>
          </div>

          {/* Title */}
          <div className="ddw-hi" style={{ opacity: 0, marginBottom: 30 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', flexWrap: 'wrap', gap: 20,
            }}>
              <h2
                ref={titleRef}
                style={{
                  fontSize: 'clamp(42px, 8.5vw, 92px)',
                  fontWeight: 900, lineHeight: 0.93,
                  letterSpacing: '-0.03em', margin: 0,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                <span style={{ color: '#fff', display: 'block' }}>Projects</span>
                <span style={{
                  background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', display: 'block',
                }}>
                  We've Built.
                </span>
              </h2>

              <p style={{
                color: 'rgba(255,255,255,0.38)', fontSize: 14, lineHeight: 1.75,
                maxWidth: 260, textAlign: 'right', margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}>
                Every number is from a live account.
                <br />
                Dashboard screenshots available on request.
              </p>
            </div>
          </div>

          {/* Marquee */}
          <div className="ddw-hi" style={{ opacity: 0, marginBottom: 24 }}>
            <Marquee />
          </div>

          {/* Stats */}
          <StatsBar />

          {/* Filter Tabs */}
          <div className="ddw-hi" style={{
            opacity: 0,
            display: 'flex', flexWrap: 'wrap', gap: 8,
            justifyContent: 'center', paddingBottom: 36,
          }}>
            {CATEGORIES.map(cat => (
              <FilterTab
                key={cat}
                cat={cat}
                isActive={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
                count={cat !== 'All' ? projectsData.filter(p => p.category === cat).length : null}
              />
            ))}
          </div>
        </div>

        {/* ─────────────────── GRID SECTION ─────────────────── */}
        <div style={{
          position: 'relative',
          padding: '0 clamp(16px, 4vw, 40px) clamp(60px, 8vw, 100px)',
          maxWidth: 1280, margin: '0 auto',
        }}>

          {/* Grid meta bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 22, flexWrap: 'wrap', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                height: 16, width: 2.5, borderRadius: 2,
                background: accentColor, transition: 'background 0.35s',
              }} />
              <span style={{
                fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: accentColor,
                transition: 'color 0.35s',
                fontFamily: 'Montserrat, sans-serif',
              }}>
                {activeCategory === 'All' ? 'All Projects' : activeCategory}
              </span>
              <span style={{
                fontSize: 10, color: 'rgba(255,255,255,0.2)',
                fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
              }}>
                — {filtered.length} results
              </span>
            </div>
            <span style={{
              fontSize: 10, color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase', letterSpacing: '0.18em',
              fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
            }}>
              {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
          </div>

          {/* ── Card Grid ── */}
          <div ref={gridRef}>
            {visibleProjects.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: 16,
              }}>
                {visibleProjects.map((item, index) => (
                  <ProjectCard
                    key={`${item.id}-${currentPage}-${activeCategory}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.016)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  fontSize: 'clamp(48px, 8vw, 72px)', marginBottom: 16,
                  opacity: 0.08, fontFamily: 'Montserrat, sans-serif',
                }}>
                  ◈
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.18)', fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.25em',
                  fontWeight: 900, fontFamily: 'Montserrat, sans-serif',
                }}>
                  No projects in this category yet
                </p>
              </div>
            )}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', gap: 6,
              marginTop: 52, flexWrap: 'wrap',
            }}>
              <PageBtn
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                label="Previous page"
              >
                ←
              </PageBtn>

              {pageNumbers().map(num => (
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

          {/* ── Bottom CTA ── */}
          <div style={{
            textAlign: 'center', marginTop: 60,
            padding: '40px 24px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255,87,15,0.06) 0%, rgba(253,232,122,0.03) 100%)',
            border: '1px solid rgba(255,87,15,0.12)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* BG watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              fontSize: 'clamp(80px, 12vw, 180px)',
              fontWeight: 900, color: '#fff',
              opacity: 0.025, pointerEvents: 'none', lineHeight: 1,
              letterSpacing: '-0.04em',
              fontFamily: 'Montserrat, sans-serif',
              whiteSpace: 'nowrap',
            }}>
              DDW
            </div>

            <p style={{
              fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: '0.28em', color: '#FF570F',
              marginBottom: 12, fontFamily: 'Montserrat, sans-serif',
            }}>
              Want results like these?
            </p>
            <h3 style={{
              fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900,
              lineHeight: 1.15, letterSpacing: '-0.025em',
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
    </>
  );
};

// ─── CTA Button ───────────────────────────────────────────────────────────────
const CtaButton = () => {
  const ref   = useRef(null);
  const [hov, setHov] = useState(false);
  useMagnetic(ref, 0.25);

  return (
    <a
      ref={ref}
      href="/contact"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '14px 32px', minHeight: 52, borderRadius: 99,
        background: hov
          ? 'linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%)'
          : 'linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%)',
        color: '#000', fontWeight: 900, fontSize: 11,
        textTransform: 'uppercase', letterSpacing: '0.2em',
        textDecoration: 'none',
        boxShadow: hov
          ? '0 0 40px #FF570F60, 0 8px 32px rgba(255,87,15,0.4)'
          : '0 0 24px #FF570F35',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'box-shadow 0.3s, transform 0.3s',
        willChange: 'transform',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      Start a Project
      <svg
        style={{
          width: 14, height: 14,
          transform: hov ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.3s',
        }}
        fill="none" stroke="currentColor" strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </a>
  );
};

export default AllProjects;