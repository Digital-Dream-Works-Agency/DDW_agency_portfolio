// ─── about.jsx (Production-Ready) ─────────────────────────────────────────────
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';

// ─── GSAP Plugin Registration (module-level, runs once) ───────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── Static Constants (defined outside components, zero re-creation cost) ─────
const PLATFORMS = [
  { name: 'Meta Ads',    icon: '◈' },
  { name: 'Google Ads',  icon: '◉' },
  { name: 'Amazon',      icon: '◇' },
  { name: 'TikTok Shop', icon: '◆' },
  { name: 'Shopify',     icon: '○' },
  { name: 'OpenAI',      icon: '◎' },
  { name: 'Stripe',      icon: '▣' },
  { name: 'Vercel',      icon: '△' },
];
// Pre-doubled at module level — never recomputed
const MARQUEE_ITEMS = [...PLATFORMS, ...PLATFORMS];

const STORY_PARAGRAPHS = [
  'Digital Dream Works is a Florida LLC with offices in Florida and Rome. We serve US and EU clients across digital marketing, AI, and custom software — all on retainer.',
  'We manage $683K+ in Meta ad spend per month, $2.7M+ in Amazon sales, run Google Ads at 600% ROAS, and have shipped 3 live SaaS products including Lyra and Sviluppiamo.dev.',
  "Our clients don't come to us for one-off projects. They come when the stakes are real — when they need a team that builds the infrastructure, runs the accounts, and stays accountable month over month.",
];

const STAT_HEIGHTS = [40, 68, 45, 90, 55, 82, 72];
const CHART_HEIGHTS = [55, 70, 48, 85, 60, 90, 75, 65, 88, 72, 95, 80];

const DASHBOARD_METRICS = [
  { label: 'Revenue MTD',     val: '$683K', delta: '+14.2%' },
  { label: 'ROAS',            val: '6.0×',  delta: '+0.8×'  },
  { label: 'Active Accounts', val: '14',    delta: '+3'     },
];

const STAT_CARDS = [
  { value: '683K+', label: 'Meta $/month' },
  { value: '7',     label: 'Service Areas' },
  { value: '2',     label: 'Offices'       },
  { value: '2015',  label: 'Since'         },
];

// ─── Touch Detection (computed once, never on hot path) ──────────────────────
const IS_TOUCH_DEVICE =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// ─── Lat/Lng data for GlobeVisual (static, no recalculation) ─────────────────
const GLOBE_LATITUDES  = [-60, -30, 0, 30, 60];
const GLOBE_LONGITUDES = [0, 30, 60, 90, 120, 150];

// ─── Values Data ──────────────────────────────────────────────────────────────
// SVG icons extracted as stable components — never re-created inline
const IconLightning = memo(() => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
));
IconLightning.displayName = 'IconLightning';

const IconCheck = memo(() => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
));
IconCheck.displayName = 'IconCheck';

const IconPlus = memo(() => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v20M2 12h20" />
  </svg>
));
IconPlus.displayName = 'IconPlus';

const IconEye = memo(() => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
));
IconEye.displayName = 'IconEye';

const VALUES_DATA = [
  {
    number: '01',
    title:  'No Bullshit Engineering',
    desc:   'We build what you need, not what sounds impressive in a pitch deck. Every technical decision is justified by measurable business outcomes.',
    icon:   <IconLightning />,
  },
  {
    number: '02',
    title:  'Skin in the Game',
    desc:   'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.',
    icon:   <IconCheck />,
  },
  {
    number: '03',
    title:  'Speed Without Shortcuts',
    desc:   "We move fast because we've done this before — not because we skip tests, documentation, or proper architecture.",
    icon:   <IconPlus />,
  },
  {
    number: '04',
    title:  'Radical Transparency',
    desc:   "You know exactly what we're building, why, and when it ships. No surprises. No excuses. No hidden costs.",
    icon:   <IconEye />,
  },
];

const TIMELINE_DATA = [
  { year: '2015', event: 'First Amazon brand taken on retainer. Still running that account today — $2.7M+ in sales managed.' },
  { year: '2019', event: 'DDW formally founded as a Florida LLC. Expanded into Meta and Google Ads management for US and EU brands.' },
  { year: '2021', event: 'Rome office opened. EU client base grows — Meta spend hits $400K+/month under management.' },
  { year: '2023', event: 'AI development and custom software added as core retainer services. TikTok Shop launched for clients.' },
  { year: '2025', event: 'Seven retainer services active. $683K managed in a single month. Lyra and Sviluppiamo.dev live.' },
];

// ─── CSS Injection (single component, stable string, rendered once) ───────────
// Font loaded via <link> in your HTML <head> — NOT via @import here.
// This eliminates the render-blocking font request entirely.
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  .font-heading       { font-family: 'Montserrat', sans-serif; }
  .font-mono-custom   { font-family: 'JetBrains Mono', monospace; }

  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseBar {
    0%   { transform: scaleY(0.82); opacity: 0.75; }
    100% { transform: scaleY(1.06); opacity: 1; }
  }
  @keyframes orbitSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbitSpinRev {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes pingPulse {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.06; transform: scale(1); }
    50%       { opacity: 0.12; transform: scale(1.04); }
  }
  @keyframes breatheGlow {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }

  /* Tilt — will-change applied only on hover to manage GPU layer budget */
  .tilt-card { transform-style: preserve-3d; }
  .tilt-card:hover { will-change: transform; }

  .spotlight-card { position: relative; overflow: hidden; }
  .spotlight-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--mx, 50%) var(--my, 50%),
      rgba(255,87,15,0.08),
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 1;
  }
  .spotlight-card:hover::before { opacity: 1; }

  .bottom-sweep { position: relative; }
  .bottom-sweep::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, #FF570F, #FDE87A);
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .bottom-sweep:hover::after { width: 100%; }

  .shimmer-btn { position: relative; overflow: hidden; }
  .shimmer-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: transform 0.65s ease;
    z-index: 1;
  }
  .shimmer-btn:hover::before { transform: translateX(100%); }

  ::-webkit-scrollbar       { width: 4px; }
  ::-webkit-scrollbar-track { background: #080a0c; }
  ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.25); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,87,15,0.5); }

  .fluid-watermark {
    font-size: clamp(80px, 10vw, 180px);
    opacity: 0.045;
    pointer-events: none;
    user-select: none;
  }

  /* ── Responsive layouts (CSS-native, no per-instance <style> injection) ── */
  .story-grid         { display: grid; grid-template-columns: 1fr; gap: clamp(40px,6vw,72px); align-items: center; }
  .stat-grid          { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .values-grid        { display: grid; grid-template-columns: 1fr; gap: 20px; }
  .dash-cols          { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px; }
  .timeline-row       { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: center; }
  .tl-center-dot      { display: none; }
  .tl-mobile-year     { display: block; margin-bottom: 8px; }
  .timeline-center-line { display: none; }

  @media (min-width: 480px) {
    .stat-grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (min-width: 600px) {
    .dash-cols { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 768px) {
    .values-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .story-grid           { grid-template-columns: 1fr 1fr; }
    .timeline-row         { grid-template-columns: 1fr 80px 1fr; }
    .tl-center-dot        { display: flex; order: 1; justify-content: center; }
    .tl-mobile-year       { display: none; }
    .timeline-center-line { display: block; }

    .tl-year-even   { order: 0; justify-content: flex-end; }
    .tl-year-odd    { order: 2; justify-content: flex-start; }
    .tl-event-even  { order: 2; }
    .tl-event-odd   { order: 0; }
  }
`;

// Rendered once as a stable singleton — never causes re-renders
const GlobalStyles = memo(() => <style>{STYLES}</style>);
GlobalStyles.displayName = 'GlobalStyles';

// ─── Hook: Magnetic ────────────────────────────────────────────────────────────
// Accepts a ref and strength. Uses a single matchMedia instance per hook call.
const useMagnetic = (ref, strength = 0.28) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || IS_TOUCH_DEVICE) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width  / 2) * strength);
        yTo((e.clientY - r.top  - r.height / 2) * strength);
      };
      const onLeave = () => { xTo(0); yTo(0); };

      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
  }, [ref, strength]);
  // ref is intentionally included — it's a stable object but explicit is correct
};

// ─── Component: GSAPTilt ───────────────────────────────────────────────────────
const GSAPTilt = memo(({ children, className, style }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || IS_TOUCH_DEVICE) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width  - 0.5) *  9);
        yTo(((e.clientY - r.top)  / r.height - 0.5) * -9);
      };
      const onLeave = () => { xTo(0); yTo(0); };

      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card${className ? ` ${className}` : ''}`}
      style={{ perspective: '1000px', ...style }}
    >
      {children}
    </div>
  );
});
GSAPTilt.displayName = 'GSAPTilt';

// ─── Component: SpotlightCard ──────────────────────────────────────────────────
const SpotlightCard = memo(({
  children, className, style, onMouseEnter, onMouseLeave,
}) => {
  // Stable handler — IS_TOUCH_DEVICE is a module-level constant, not a closure
  const onMouseMove = useCallback((e) => {
    if (IS_TOUCH_DEVICE) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []); // empty deps — truly stable

  return (
    <div
      className={`spotlight-card${className ? ` ${className}` : ''}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
});
SpotlightCard.displayName = 'SpotlightCard';

// ─── Component: Eyebrow ────────────────────────────────────────────────────────
const Eyebrow = memo(({ children }) => (
  <div style={{ marginBottom: 20 }}>
    <span className="text-xs font-bold uppercase tracking-widest" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 18px',
      border: '1px solid rgba(255,87,15,0.3)',
      background: 'rgba(255,87,15,0.07)',
      borderRadius: 999,
      color: '#FF570F',
      fontFamily: 'JetBrains Mono, monospace',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{
        width: 6, height: 6, background: '#FF570F', borderRadius: '50%',
        animation: 'breatheGlow 1.8s ease-in-out infinite',
        display: 'inline-block', flexShrink: 0,
      }} />
      {children}
    </span>
  </div>
));
Eyebrow.displayName = 'Eyebrow';

// ─── Visual: Globe ─────────────────────────────────────────────────────────────
// Pure visual — no state, no effects, memo prevents any re-render
const GlobeVisual = memo(() => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  }}>
    <svg viewBox="0 0 300 300" style={{ position: 'absolute', width: '88%', height: '88%', opacity: 0.45 }}>
      <defs>
        <radialGradient id="gGlow" cx="38%" cy="34%" r="60%">
          <stop offset="0%"   stopColor="#FF570F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF570F" stopOpacity="0"    />
        </radialGradient>
        <radialGradient id="gCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FF570F" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#080a0c" stopOpacity="0"    />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="120" fill="url(#gCore)" stroke="#FF570F" strokeWidth="0.6" strokeOpacity="0.25" />
      <circle cx="150" cy="150" r="120" fill="url(#gGlow)" />
      {GLOBE_LATITUDES.map((lat, i) => {
        const y  = 150 + (lat / 90) * 120;
        const rx = Math.cos((lat * Math.PI) / 180) * 120;
        return <ellipse key={i} cx="150" cy={y} rx={rx} ry="6" fill="none" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.22" />;
      })}
      {GLOBE_LONGITUDES.map((lng, i) => (
        <ellipse key={i} cx="150" cy="150"
          rx={Math.abs(Math.cos((lng * Math.PI) / 180)) * 120 + 2}
          ry="120" fill="none"
          stroke="#FF570F" strokeWidth="0.35" strokeOpacity="0.14"
          transform={`rotate(${lng},150,150)`}
        />
      ))}
      <path d="M88 108 L106 97 L128 107 L132 126 L114 137 L92 130Z"      fill="#FF570F" fillOpacity="0.13" stroke="#FF570F" strokeWidth="0.6" strokeOpacity="0.55" />
      <path d="M148 93 L176 86 L197 99 L202 121 L184 133 L157 127 L146 109Z" fill="#FF570F" fillOpacity="0.09" stroke="#FF570F" strokeWidth="0.5" strokeOpacity="0.42" />
      <path d="M153 153 L176 145 L198 157 L202 177 L179 188 L156 180Z"    fill="#FF570F" fillOpacity="0.07" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.36" />
      <path d="M28,52 Q45,20 62,38" fill="none" stroke="#FF570F" strokeWidth="0.7" strokeOpacity="0.65" strokeDasharray="2 3">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
      </path>
      <circle r="0.9" fill="#FF570F" opacity="0.95">
        <animateMotion dur="3s" repeatCount="indefinite" path="M28,52 Q45,20 62,38" />
      </circle>
    </svg>

    {/* Orbit rings */}
    <div style={{ position: 'absolute', width: '65%', height: '65%', border: '1px dashed rgba(255,87,15,0.18)', borderRadius: '50%', animation: 'orbitSpin 22s linear infinite' }} />
    <div style={{ position: 'absolute', width: '82%', height: '82%', border: '1px solid rgba(255,87,15,0.08)', borderRadius: '50%', animation: 'orbitSpinRev 38s linear infinite' }} />

    {/* Florida node */}
    <div style={{ position: 'absolute', top: '51%', left: '27%', zIndex: 20 }}>
      <div style={{ position: 'relative', width: 12, height: 12 }}>
        <div style={{ width: 12, height: 12, background: '#FF570F', borderRadius: '50%', boxShadow: '0 0 14px #FF570F' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#FF570F', animation: 'pingPulse 1.8s ease-out infinite', opacity: 0.45 }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ position: 'absolute', top: 16, left: -18, color: '#FF570F', fontFamily: 'JetBrains Mono', whiteSpace: 'nowrap' }}>Florida</span>
      </div>
    </div>

    {/* Rome node */}
    <div style={{ position: 'absolute', top: '37%', left: '62%', zIndex: 20 }}>
      <div style={{ position: 'relative', width: 10, height: 10 }}>
        <div style={{ width: 10, height: 10, background: '#fff', borderRadius: '50%', boxShadow: '0 0 12px rgba(255,255,255,0.8)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', animation: 'pingPulse 1.8s ease-out infinite', animationDelay: '1.2s', opacity: 0.35 }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ position: 'absolute', top: 14, left: -8, color: 'rgba(255,255,255,0.85)', fontFamily: 'JetBrains Mono', whiteSpace: 'nowrap' }}>Rome</span>
      </div>
    </div>
  </div>
));
GlobeVisual.displayName = 'GlobeVisual';

// ─── Visual: Data Bars ─────────────────────────────────────────────────────────
const DataFlowVisual = memo(() => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 24, gap: 6, opacity: 0.75 }}>
    {STAT_HEIGHTS.map((h, i) => (
      <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '3px 3px 0 0', height: '80%', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%',
          borderRadius: '3px 3px 0 0', height: `${h}%`,
          background: 'linear-gradient(to top, rgba(255,87,15,0.12), #FF570F)',
          transformOrigin: 'bottom',
          animation: `pulseBar ${1.8 + i * 0.38}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.14}s`,
        }} />
        <div style={{ position: 'absolute', bottom: `${h}%`, left: 0, right: 0, height: 1, background: '#FF570F', opacity: 0.7 }} />
      </div>
    ))}
  </div>
));
DataFlowVisual.displayName = 'DataFlowVisual';

// ─── Visual: Tech Core ─────────────────────────────────────────────────────────
const TechCoreVisual = memo(() => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
    <div style={{ position: 'relative', width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0,  border: '1px dashed rgba(255,255,255,0.1)',          borderRadius: '50%', animation: 'orbitSpin 11s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 12, border: '2px solid rgba(255,87,15,0.28)',             borderTopColor: 'transparent', borderRadius: '50%', animation: 'orbitSpinRev 7s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 28, border: '1px solid rgba(255,255,255,0.18)',           borderBottomColor: 'transparent', borderRightColor: 'transparent', borderRadius: '50%', animation: 'orbitSpin 5s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 0, animation: 'orbitSpin 4s linear infinite' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: '#FF570F', borderRadius: '50%', boxShadow: '0 0 12px #FF570F' }} />
      </div>
      <div style={{ width: 10, height: 10, background: '#FF570F', borderRadius: '50%', boxShadow: '0 0 22px #FF570F', animation: 'breatheGlow 2.8s ease-in-out infinite' }} />
    </div>
  </div>
));
TechCoreVisual.displayName = 'TechCoreVisual';

// ─── Component: Logo Marquee ───────────────────────────────────────────────────
const LogoMarquee = memo(() => (
  <div style={{
    position: 'relative',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'linear-gradient(90deg,#080a0c,#0d1012,#080a0c)',
    overflow: 'hidden', padding: '20px 0',
  }}>
    {/* Fade masks via CSS — no extra DOM paint cost */}
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(90deg,#080a0c,transparent)', zIndex: 10, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(270deg,#080a0c,transparent)', zIndex: 10, pointerEvents: 'none' }} />
    <div style={{ display: 'flex', gap: 64, alignItems: 'center', width: 'max-content', animation: 'marqueeScroll 30s linear infinite' }}>
      {MARQUEE_ITEMS.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span className="text-sm" style={{ color: 'rgba(255,87,15,0.35)' }}>{p.icon}</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'JetBrains Mono' }}>{p.name}</span>
        </div>
      ))}
    </div>
  </div>
));
LogoMarquee.displayName = 'LogoMarquee';

// ─── Component: FloatingPill ───────────────────────────────────────────────────
// Math.random() extracted to module scope constants — computed once per session
const PILL_DURATIONS = [2.1, 2.6, 2.3, 2.8]; // deterministic pool
const PILL_DELAYS    = [0.0, 0.7, 1.2, 0.4];

let _pillIndex = 0;
const getNextPillConfig = () => {
  const i = _pillIndex % PILL_DURATIONS.length;
  _pillIndex++;
  return { duration: PILL_DURATIONS[i], delay: PILL_DELAYS[i] };
};

const FloatingPill = memo(({ style, children }) => {
  const ref = useRef(null);
  // Config is derived once at construction time, not on every render
  const config = useRef(getNextPillConfig());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = gsap.to(el, {
      y: -10,
      duration: config.current.duration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: config.current.delay,
    });
    return () => tween.kill(); // ← explicit kill prevents memory leak
  }, []);

  return (
    <div ref={ref} style={{
      position: 'absolute',
      backdropFilter: 'blur(12px)',
      background: 'rgba(13,16,18,0.88)',
      border: '1px solid rgba(255,87,15,0.22)',
      borderRadius: 12, padding: '10px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: 30, ...style,
    }}>
      {children}
    </div>
  );
});
FloatingPill.displayName = 'FloatingPill';

// ─── Component: BrowserMockup ──────────────────────────────────────────────────
const BrowserMockup = memo(({ children }) => (
  <div style={{
    borderRadius: 14, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(10,11,13,0.9)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F56' }} />
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }} />
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27C93F' }} />
      <div style={{ flex: 1, margin: '0 12px', height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}>app.ddwagency.com</span>
      </div>
    </div>
    {children}
  </div>
));
BrowserMockup.displayName = 'BrowserMockup';

// ─── Component: StatCard ───────────────────────────────────────────────────────
const StatCard = memo(({ value, label }) => {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);
  const numRef  = useRef(null);

  // Magnetic hook now correctly targets the card's visible element
  useMagnetic(cardRef, 0.25);

  // Derived values memoized — not recomputed on re-renders
  const { numericVal, suffix } = useMemo(() => ({
    numericVal: parseInt(value.replace(/\D/g, ''), 10) || 0,
    suffix:     value.replace(/\d/g, ''),
  }), [value]);

  // Single shared IntersectionObserver would be ideal across all stat cards,
  // but per-card is acceptable here given low cardinality (4 cards max).
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // ← stop observing once triggered, free the observer
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Counter animation — only fires once due to io.disconnect() above
  useEffect(() => {
    const el = numRef.current;
    if (!inView || !el) return;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: numericVal,
      duration: 2.6,
      ease: 'power2.out',
      onUpdate() {
        // Guard against unmount during animation
        if (numRef.current) {
          numRef.current.textContent = `${Math.floor(obj.val)}${suffix}`;
        }
      },
    });
    return () => tween.kill(); // ← kill on unmount, prevents null-ref error
  }, [inView, numericVal, suffix]);

  // Stable hover handlers — defined once, not per render
  const onEnter = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)';
    e.currentTarget.style.boxShadow   = '0 0 40px rgba(255,87,15,0.12)';
  }, []);
  const onLeave = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(255,87,15,0.12)';
    e.currentTarget.style.boxShadow   = 'none';
  }, []);

  return (
    <GSAPTilt>
      <SpotlightCard
        className="bottom-sweep"
        style={{
          position: 'relative', textAlign: 'center',
          padding: '16px 12px', borderRadius: 16, minHeight: 110,
          background: 'linear-gradient(135deg,#151a1d,#0d1012)',
          border: '1px solid rgba(255,87,15,0.12)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          cursor: 'default',
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {/*
          Magnetic target is the card root itself — ref on a real element
          that occupies space and can produce a meaningful bounding rect
        */}
        <div ref={cardRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div
          ref={numRef}
          className="font-heading text-3xl md:text-4xl leading-[1.1] tracking-tight"
          style={{
            fontWeight: 700,
            background: 'linear-gradient(135deg,#FF570F,#FDE87A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: 4, whiteSpace: 'nowrap',
          }}
        >
          {`0${suffix}`}
        </div>
        <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono' }}>
          {label}
        </div>
      </SpotlightCard>
    </GSAPTilt>
  );
});
StatCard.displayName = 'StatCard';

// ─── Component: ValueCard ──────────────────────────────────────────────────────
const ValueCard = memo(({ value }) => {
  const onEnter = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)';
    e.currentTarget.style.boxShadow   = '0 20px 60px rgba(255,87,15,0.1)';
  }, []);
  const onLeave = useCallback((e) => {
    e.currentTarget.style.borderColor = 'rgba(255,87,15,0.1)';
    e.currentTarget.style.boxShadow   = 'none';
  }, []);

  return (
    <GSAPTilt>
      <SpotlightCard
        className="bottom-sweep"
        style={{
          position: 'relative', padding: '2rem', borderRadius: 20,
          height: '100%', overflow: 'hidden',
          background: 'linear-gradient(135deg,#131719,#0a0c0f)',
          border: '1px solid rgba(255,87,15,0.1)',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          cursor: 'default',
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div className="fluid-watermark font-heading" style={{
          position: 'absolute', top: -10, right: 16,
          color: '#FF570F', fontWeight: 700, lineHeight: 1,
        }}>
          {value.number}
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg,#FF570F,#EE7D1D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20, color: '#080a0c',
            boxShadow: '0 8px 24px rgba(255,87,15,0.4)',
            flexShrink: 0,
          }}>
            {value.icon}
          </div>
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight" style={{   color: '#fff', marginBottom: 12,  }}>
            {value.title}
          </h4>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter' }}>
            {value.desc}
          </p>
        </div>
      </SpotlightCard>
    </GSAPTilt>
  );
});
ValueCard.displayName = 'ValueCard';

// ─── Component: TimelineItem ───────────────────────────────────────────────────
const TimelineItem = memo(({ item, index }) => {
  const ref    = useRef(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Scoped context prevents leaking tweens outside this element's subtree
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0, y: 55, duration: 1.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          once: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Stable hover handlers
  const onYearEnter = useCallback((e) => { e.currentTarget.style.transform = 'scale(1.05)'; }, []);
  const onYearLeave = useCallback((e) => { e.currentTarget.style.transform = 'scale(1)';    }, []);
  const onDotEnter  = useCallback((e) => { e.currentTarget.style.transform = 'scale(1.15)'; }, []);
  const onDotLeave  = useCallback((e) => { e.currentTarget.style.transform = 'scale(1)';    }, []);
  const onCardEnter = useCallback((e) => { e.currentTarget.style.borderColor = 'rgba(255,87,15,0.55)'; }, []);
  const onCardLeave = useCallback((e) => { e.currentTarget.style.borderColor = 'rgba(255,87,15,0.18)'; }, []);

  return (
    <div ref={ref}>
      {/*
        All responsive layout handled by global CSS classes.
        Zero per-instance <style> injection.
        isEven/isOdd classes control ordering via CSS-only rules.
      */}
      <div className="timeline-row">
        {/* Year badge */}
        <div className={`tl-year-${isEven ? 'even' : 'odd'}`}
          style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <div
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(90deg,#FF570F,#EE7D1D)',
              borderRadius: 12,
              boxShadow: '0 8px 30px rgba(255,87,15,0.35)',
              display: 'inline-block',
              transition: 'transform 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={onYearEnter}
            onMouseLeave={onYearLeave}
          >
            <span className="font-heading text-xl md:text-2xl" style={{ fontWeight: 700, color: '#080a0c', letterSpacing: '-0.03em' }}>
              {item.year}
            </span>
          </div>
        </div>

        {/* Center dot — visible on desktop via CSS class */}
        <div className="tl-center-dot">
          <div
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#FF570F', border: '4px solid #080a0c',
              boxShadow: '0 0 0 2px #FF570F, 0 0 24px rgba(255,87,15,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.3s ease', flexShrink: 0,
            }}
            onMouseEnter={onDotEnter}
            onMouseLeave={onDotLeave}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#080a0c', animation: 'breatheGlow 2s ease-in-out infinite' }} />
          </div>
        </div>

        {/* Event card */}
        <div className={`tl-event-${isEven ? 'even' : 'odd'}`}>
          <GSAPTilt>
            <SpotlightCard
              className="bottom-sweep"
              style={{
                padding: '20px 24px', borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(135deg,#131719,#0a0c0f)',
                border: '1px solid rgba(255,87,15,0.18)',
                transition: 'border-color 0.4s ease',
              }}
              onMouseEnter={onCardEnter}
              onMouseLeave={onCardLeave}
            >
              {/* Mobile year — hidden on desktop via CSS class */}
              <div className="tl-mobile-year">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono' }}>
                  {item.year}
                </span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter' }}>
                {item.event}
              </p>
            </SpotlightCard>
          </GSAPTilt>
        </div>
      </div>
    </div>
  );
});
TimelineItem.displayName = 'TimelineItem';

// ─── Arrow Icon (stable, module-level) ────────────────────────────────────────
const ArrowIcon = (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ─── Component: CTAButton ──────────────────────────────────────────────────────
const CTAButton = memo(({ href, children, variant = 'primary' }) => {
  const ref       = useRef(null);
  const isPrimary = variant === 'primary';
  useMagnetic(ref, 0.3);

  const onEnter = useCallback((e) => {
    if (isPrimary) {
      e.currentTarget.style.boxShadow = '0 0 50px rgba(255,87,15,0.55)';
    } else {
      e.currentTarget.style.borderColor = 'rgba(255,87,15,0.9)';
      e.currentTarget.style.background  = 'rgba(255,87,15,0.08)';
    }
  }, [isPrimary]);

  const onLeave = useCallback((e) => {
    if (isPrimary) {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,87,15,0.35)';
    } else {
      e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)';
      e.currentTarget.style.background  = 'transparent';
    }
  }, [isPrimary]);

  return (
    <a
      ref={ref}
      href={href}
      className="shimmer-btn text-sm font-bold uppercase tracking-widest" style={{
        position: 'relative', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, padding: '14px 36px',
        fontFamily: 'Montserrat', 
         textTransform: 'uppercase', 
        textDecoration: 'none', borderRadius: 2,
        minHeight: 52, cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'box-shadow 0.35s ease',
        background:  isPrimary ? '#FF570F' : 'transparent',
        color:       isPrimary ? '#080a0c' : '#ffffff',
        border:      isPrimary ? 'none'    : '1.5px solid rgba(255,87,15,0.45)',
        boxShadow:   isPrimary ? '0 4px 20px rgba(255,87,15,0.35)' : 'none',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
        {children}
        {ArrowIcon}
      </span>
    </a>
  );
});
CTAButton.displayName = 'CTAButton';

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const AboutPage = () => {
  const heroRef    = useRef(null);
  const headingRef = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);

  // SplitType heading reveal
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const split = new SplitType(el, { types: 'words,chars' });
    const tween = gsap.from(split.chars, {
      opacity: 0, y: 45, rotationX: -35, skewX: 3,
      transformOrigin: 'top center',
      stagger: 0.028, duration: 0.85, ease: 'power3.out',
      delay: 0.15,
    });
    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  // Parallax orbs — scoped to hero section
  useEffect(() => {
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    const hero = heroRef.current;
    if (!orb1 || !orb2 || !hero) return;

    const ctx = gsap.context(() => {
      gsap.to(orb1, { yPercent: 30,  ease: 'none', scrollTrigger: { trigger: hero, scrub: 1.2 } });
      gsap.to(orb2, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: hero, scrub: 1.2 } });
    }, hero); // scope to hero subtree
    return () => ctx.revert();
  }, []);

  // Scroll fade-ups — using refs, not document.querySelectorAll
  // Each section's elements are targeted via a scoped context ref
  const storyRef    = useRef(null);
  const mockupRef   = useRef(null);
  const valuesRef   = useRef(null);
  const timelineRef = useRef(null);
  const ctaRef      = useRef(null);

  useEffect(() => {
    const sections = [
      storyRef.current,
      mockupRef.current,
      valuesRef.current,
      timelineRef.current,
      ctaRef.current,
    ].filter(Boolean);

    const ctxList = sections.map((section) => {
      const ctx = gsap.context(() => {
        section.querySelectorAll('.scroll-fade-up').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 50, duration: 0.95, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });
      }, section);
      return ctx;
    });

    // Refresh ScrollTrigger after all contexts are registered
    // so layout is fully settled
    ScrollTrigger.refresh();

    return () => {
      ctxList.forEach((ctx) => ctx.revert());
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <main style={{ position: 'relative', width: '100%', background: '#080a0c', overflowX: 'hidden' }}>

        <Navbar />

        <PageHeader
          title="About DDW"
          breadcrumb="About"
          subtitle="Florida LLC. Offices in Florida and Rome. We manage $683K+/month in Meta spend, $2.7M+ in Amazon sales, and ship live SaaS products — all on retainer."
        />

        <LogoMarquee />

        {/* ── STORY + BENTO ─────────────────────────────────────────── */}
        <section ref={storyRef} style={{ position: 'relative', padding: 'clamp(56px,8vw,96px) 24px', background: '#080a0c', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,87,15,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,87,15,0.02) 1px,transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%,black,transparent)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%,black,transparent)', pointerEvents: 'none' }} />

          {/* Parallax orbs — ref is on the heroRef wrapping section */}
          <div ref={heroRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div ref={orb1Ref} style={{ position: 'absolute', top: '5%', right: '10%', width: 'clamp(280px,40vw,600px)', height: 'clamp(280px,40vw,600px)', background: 'rgba(255,87,15,0.06)', borderRadius: '50%', filter: 'blur(120px)' }} />
            <div ref={orb2Ref} style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 'clamp(200px,30vw,450px)', height: 'clamp(200px,30vw,450px)', background: 'rgba(253,232,122,0.03)', borderRadius: '50%', filter: 'blur(100px)' }} />
          </div>

          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="story-grid">
              {/* Left: Text */}
              <div className="scroll-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Eyebrow>Our Story</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-[-0.035em]" style={{     color: '#fff' }}>
                  Florida LLC.{' '}<br />
                  <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Two Offices.</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {STORY_PARAGRAPHS.map((text, i) => (
                    <p className="text-base leading-relaxed" key={i} style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter' }}>{text}</p>
                  ))}
                  <p className="text-base leading-relaxed font-bold" style={{ color: '#FF570F', fontFamily: 'Montserrat' }}>
                    Retainer-only. One team. US + EU markets.
                  </p>
                </div>

                <div className="stat-grid" style={{ paddingTop: 20, borderTop: '1px solid rgba(255,87,15,0.12)' }}>
                  {STAT_CARDS.map((s) => (
                    <StatCard key={s.label} value={s.value} label={s.label} />
                  ))}
                </div>
              </div>

              {/* Right: Bento */}
              <div className="scroll-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Globe */}
                <GSAPTilt style={{ gridColumn: '1 / -1' }}>
                  <SpotlightCard style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,87,15,0.18)', background: '#05070a', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,87,15,0.12) 1px,transparent 1px)', backgroundSize: '18px 18px', opacity: 0.4, pointerEvents: 'none' }} />
                    <GlobeVisual />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#05070a 8%,transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: 18, left: 18, zIndex: 30 }}>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>Global Infrastructure</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>US & EU Endpoints Active</p>
                    </div>
                    <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 30, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', animation: 'breatheGlow 1.8s ease-in-out infinite' }} />
                      <span className="text-xs uppercase tracking-widest" style={{ color: '#22c55e', fontFamily: 'JetBrains Mono' }}>Live</span>
                    </div>
                    <FloatingPill style={{ bottom: 18, right: 18 }}>
                      <span className="text-xs font-bold" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono' }}>+$683K</span>
                      <span className="text-xs tracking-wider" style={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>this month</span>
                    </FloatingPill>
                  </SpotlightCard>
                </GSAPTilt>

                {/* Data bars */}
                <GSAPTilt>
                  <SpotlightCard style={{ position: 'relative', aspectRatio: '1', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,87,15,0.1)', background: '#05070a' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,87,15,0.1) 1px,transparent 1px)', backgroundSize: '18px 18px', opacity: 0.35 }} />
                    <DataFlowVisual />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#05070a 12%,transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: 14, left: 14, zIndex: 30 }}>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>Ad Spend</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>$683K+/mo</p>
                    </div>
                  </SpotlightCard>
                </GSAPTilt>

                {/* Tech core */}
                <GSAPTilt>
                  <SpotlightCard style={{ position: 'relative', aspectRatio: '1', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,87,15,0.1)', background: '#05070a' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,87,15,0.1) 1px,transparent 1px)', backgroundSize: '18px 18px', opacity: 0.35 }} />
                    <TechCoreVisual />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#05070a 12%,transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: 14, left: 14, zIndex: 30 }}>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>AI Logic</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Custom Arch</p>
                    </div>
                  </SpotlightCard>
                </GSAPTilt>
              </div>
            </div>
          </div>
        </section>

        {/* ── BROWSER MOCKUP ────────────────────────────────────────── */}
        <section ref={mockupRef} style={{ position: 'relative', padding: 'clamp(48px,7vw,80px) 24px', background: '#0a0c0f', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'rgba(255,87,15,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="scroll-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
              <Eyebrow>Live Products</Eyebrow>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{    color: '#fff' }}>
                Shipped.{' '}
                <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>In Production.</span>
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontFamily: 'Inter' }}>Real products. Real revenue. Running on real infrastructure.</p>
            </div>
            <div className="scroll-fade-up">
              <BrowserMockup>
                <div style={{ background: '#080a0c', padding: 24, minHeight: 280, position: 'relative', overflow: 'hidden' }}>
                  <div className="dash-cols">
                    {DASHBOARD_METRICS.map((d, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,87,15,0.1)' }}>
                        <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono', marginBottom: 8 }}>{d.label}</p>
                        <p className="font-heading text-3xl md:text-4xl leading-[1.1] tracking-tight" style={{ fontWeight: 700, color: '#fff' }}>{d.val}</p>
                        <p className="text-xs" style={{ color: '#22c55e', fontFamily: 'JetBrains Mono', marginTop: 4 }}>{d.delta} this mo.</p>
                      </div>
                    ))}
                  </div>
                  {/* Faux chart */}
                  <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, position: 'relative' }}>
                    {CHART_HEIGHTS.map((h, i) => (
                      <div key={i} style={{ flex: 1, background: 'linear-gradient(to top,rgba(255,87,15,0.1),#FF570F)', borderRadius: '3px 3px 0 0', height: `${h}%`, minWidth: 6, opacity: 0.7 + i * 0.02 }} />
                    ))}
                    <div style={{ position: 'absolute', top: 10, right: 14 }}>
                      <span className="text-xs tracking-widest uppercase" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono' }}>META SPEND · 12 WEEKS</span>
                    </div>
                  </div>
                  <FloatingPill style={{ top: 16, right: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', animation: 'breatheGlow 1.5s ease-in-out infinite' }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono' }}>All systems operational</span>
                    </div>
                  </FloatingPill>
                </div>
              </BrowserMockup>
            </div>
          </div>
        </section>

        {/* ── VALUES ───────────────────────────────────────────────── */}
        <section ref={valuesRef} style={{ position: 'relative', padding: 'clamp(56px,8vw,96px) 24px', background: '#0d1012', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, left: '25%', width: 500, height: 500, background: 'rgba(253,232,122,0.03)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="scroll-fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
              <Eyebrow>Our Principles</Eyebrow>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{    color: '#fff', marginBottom: 12 }}>
                How We{' '}
                <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Operate</span>
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', maxWidth: 480, margin: '0 auto', fontFamily: 'Inter' }}>
                Four non-negotiable principles that govern every project.
              </p>
            </div>
            <div className="values-grid scroll-fade-up">
              {VALUES_DATA.map((v) => <ValueCard key={v.number} value={v} />)}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ─────────────────────────────────────────────── */}
        <section ref={timelineRef} style={{ position: 'relative', padding: 'clamp(56px,8vw,96px) 24px', background: '#080a0c', overflow: 'hidden' }}>
          <div className="timeline-center-line" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, transform: 'translateX(-50%)', background: 'linear-gradient(to bottom,transparent,rgba(255,87,15,0.12),transparent)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="scroll-fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
              <Eyebrow>Our Journey</Eyebrow>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{    color: '#fff', marginBottom: 12 }}>
                The{' '}
                <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Timeline</span>
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', maxWidth: 440, margin: '0 auto', fontFamily: 'Inter' }}>
                From frustrated engineers to trusted enterprise partner.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {TIMELINE_DATA.map((item, i) => (
                <TimelineItem key={item.year} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section ref={ctaRef} style={{ position: 'relative', padding: 'clamp(64px,10vw,120px) 24px', background: 'linear-gradient(180deg,#080a0c,#0d1012)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(300px,60vw,700px)', height: 'clamp(150px,30vw,350px)', background: 'rgba(255,87,15,0.09)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,87,15,0.35),transparent)' }} />
          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div className="scroll-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1, background: 'rgba(255,87,15,0.4)' }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: '#FF570F', fontFamily: 'JetBrains Mono' }}>Let's Work Together</span>
              <div style={{ width: 32, height: 1, background: 'rgba(255,87,15,0.4)' }} />
            </div>
            <h3 ref={headingRef} className="scroll-fade-up text-xl sm:text-2xl font-bold tracking-tight" style={{     color: '#fff', marginBottom: 20 }}>
              Ready to Build{' '}
<span className="hero-gradient-text">
                Something Real?</span>
            </h3>
            <p className="scroll-fade-up text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)', maxWidth: 580, margin: '0 auto 40px', fontFamily: 'Inter' }}>
              Let's talk about your technical challenges and how we can solve them with infrastructure that scales.
            </p>
            <div className="scroll-fade-up" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <CTAButton href="/contact"      variant="primary">Start a Project</CTAButton>
              <CTAButton href="/case-studies" variant="secondary">View Our Work</CTAButton>
            <p className="scroll-fade-up text-xs uppercase tracking-widest" style={{ marginTop: 32, color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono' }}>
              Retainer-only · No lock-in contracts · US + EU
            </p>
          </div>
           </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default AboutPage;