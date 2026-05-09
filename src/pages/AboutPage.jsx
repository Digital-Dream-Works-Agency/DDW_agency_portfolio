import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// ─── Keyframe Injection ────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .font-heading { font-family: 'Montserrat', sans-serif; }
    .font-mono-custom { font-family: 'JetBrains Mono', monospace; }

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

    .tilt-card { transform-style: preserve-3d; will-change: transform; }

    .spotlight-card { position: relative; overflow: hidden; }
    .spotlight-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(255,87,15,0.08), transparent 50%);
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
      height: 2px;
      width: 0%;
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

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #080a0c; }
    ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.25); border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,87,15,0.5); }

    .fluid-watermark {
      font-size: clamp(80px, 10vw, 180px);
      opacity: 0.045;
      pointer-events: none;
      user-select: none;
    }
  `}</style>
);

// ─── Utility ───────────────────────────────────────────────────────────────────
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// ─── Hook: Magnetic ────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.28) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });
      const onMove  = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width  / 2) * strength);
        yTo((e.clientY - r.top  - r.height / 2) * strength);
      };
      const onLeave = () => { xTo(0); yTo(0); };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
  }, [strength]);
};

// ─── Component: GSAPTilt ───────────────────────────────────────────────────────
const GSAPTilt = ({ children, className, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      const onMove  = (e) => {
        const r = el.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width  - 0.5) *  9);
        yTo(((e.clientY - r.top)  / r.height - 0.5) * -9);
      };
      const onLeave = () => { xTo(0); yTo(0); };
      el.addEventListener('mousemove', onMove);
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
      className={`tilt-card ${className || ''}`}
      style={{ perspective: '1000px', ...style }}
    >
      {children}
    </div>
  );
};

// ─── Component: SpotlightCard ──────────────────────────────────────────────────
const SpotlightCard = ({ children, className, style, onMouseEnter, onMouseLeave }) => {
  const onMouseMove = useCallback((e) => {
    if (isTouchDevice()) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);
  return (
    <div
      className={`spotlight-card ${className || ''}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

// ─── Component: Eyebrow ────────────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <div style={{ marginBottom: 20 }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 18px',
      border: '1px solid rgba(255,87,15,0.3)',
      background: 'rgba(255,87,15,0.07)',
      borderRadius: 999,
      color: '#FF570F',
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.25em', textTransform: 'uppercase',
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
);

// ─── Visual: Globe ─────────────────────────────────────────────────────────────
const GlobeVisual = () => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
      {[-60, -30, 0, 30, 60].map((lat, i) => {
        const y  = 150 + (lat / 90) * 120;
        const rx = Math.cos((lat * Math.PI) / 180) * 120;
        return <ellipse key={i} cx="150" cy={y} rx={rx} ry="6" fill="none" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.22" />;
      })}
      {[0, 30, 60, 90, 120, 150].map((lng, i) => (
        <ellipse key={i} cx="150" cy="150"
          rx={Math.abs(Math.cos((lng * Math.PI) / 180)) * 120 + 2}
          ry="120" fill="none"
          stroke="#FF570F" strokeWidth="0.35" strokeOpacity="0.14"
          transform={`rotate(${lng},150,150)`}
        />
      ))}
      <path d="M88 108 L106 97 L128 107 L132 126 L114 137 L92 130Z" fill="#FF570F" fillOpacity="0.13" stroke="#FF570F" strokeWidth="0.6" strokeOpacity="0.55" />
      <path d="M148 93 L176 86 L197 99 L202 121 L184 133 L157 127 L146 109Z" fill="#FF570F" fillOpacity="0.09" stroke="#FF570F" strokeWidth="0.5" strokeOpacity="0.42" />
      <path d="M153 153 L176 145 L198 157 L202 177 L179 188 L156 180Z" fill="#FF570F" fillOpacity="0.07" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.36" />
      <path d="M28,52 Q45,20 62,38" fill="none" stroke="#FF570F" strokeWidth="0.7" strokeOpacity="0.65" strokeDasharray="2 3">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
      </path>
      <circle r="0.9" fill="#FF570F" opacity="0.95">
        <animateMotion dur="3s" repeatCount="indefinite" path="M28,52 Q45,20 62,38" />
      </circle>
    </svg>
    <div style={{ position: 'absolute', width: '65%', height: '65%', border: '1px dashed rgba(255,87,15,0.18)', borderRadius: '50%', animation: 'orbitSpin 22s linear infinite' }} />
    <div style={{ position: 'absolute', width: '82%', height: '82%', border: '1px solid rgba(255,87,15,0.08)', borderRadius: '50%', animation: 'orbitSpinRev 38s linear infinite' }} />
    {/* Florida node */}
    <div style={{ position: 'absolute', top: '51%', left: '27%', zIndex: 20 }}>
      <div style={{ position: 'relative', width: 12, height: 12 }}>
        <div style={{ width: 12, height: 12, background: '#FF570F', borderRadius: '50%', boxShadow: '0 0 14px #FF570F' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#FF570F', animation: 'pingPulse 1.8s ease-out infinite', opacity: 0.45 }} />
        <span style={{ position: 'absolute', top: 16, left: -18, fontSize: 7, color: '#FF570F', fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Florida</span>
      </div>
    </div>
    {/* Rome node */}
    <div style={{ position: 'absolute', top: '37%', left: '62%', zIndex: 20 }}>
      <div style={{ position: 'relative', width: 10, height: 10 }}>
        <div style={{ width: 10, height: 10, background: '#fff', borderRadius: '50%', boxShadow: '0 0 12px rgba(255,255,255,0.8)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', animation: 'pingPulse 1.8s ease-out infinite', animationDelay: '1.2s', opacity: 0.35 }} />
        <span style={{ position: 'absolute', top: 14, left: -8, fontSize: 7, color: 'rgba(255,255,255,0.85)', fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Rome</span>
      </div>
    </div>
  </div>
);

// ─── Visual: Data Bars ─────────────────────────────────────────────────────────
const DataFlowVisual = () => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 24, gap: 6, opacity: 0.75 }}>
    {[40, 68, 45, 90, 55, 82, 72].map((h, i) => (
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
);

// ─── Visual: Tech Core ─────────────────────────────────────────────────────────
const TechCoreVisual = () => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
    <div style={{ position: 'relative', width: 112, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%', animation: 'orbitSpin 11s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 12, border: '2px solid rgba(255,87,15,0.28)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'orbitSpinRev 7s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 28, border: '1px solid rgba(255,255,255,0.18)', borderBottomColor: 'transparent', borderRightColor: 'transparent', borderRadius: '50%', animation: 'orbitSpin 5s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 0, animation: 'orbitSpin 4s linear infinite' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: '#FF570F', borderRadius: '50%', boxShadow: '0 0 12px #FF570F' }} />
      </div>
      <div style={{ width: 10, height: 10, background: '#FF570F', borderRadius: '50%', boxShadow: '0 0 22px #FF570F', animation: 'breatheGlow 2.8s ease-in-out infinite' }} />
    </div>
  </div>
);

// ─── Component: Logo Marquee ───────────────────────────────────────────────────
const LogoMarquee = () => {
  const platforms = [
    { name: 'Meta Ads',    icon: '◈' }, { name: 'Google Ads',  icon: '◉' },
    { name: 'Amazon',      icon: '◇' }, { name: 'TikTok Shop', icon: '◆' },
    { name: 'Shopify',     icon: '○' }, { name: 'OpenAI',      icon: '◎' },
    { name: 'Stripe',      icon: '▣' }, { name: 'Vercel',      icon: '△' },
  ];
  const doubled = [...platforms, ...platforms];
  return (
    <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'linear-gradient(90deg,#080a0c,#0d1012,#080a0c)', overflow: 'hidden', padding: '20px 0' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(90deg,#080a0c,transparent)', zIndex: 10, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(270deg,#080a0c,transparent)', zIndex: 10, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 64, alignItems: 'center', width: 'max-content', animation: 'marqueeScroll 30s linear infinite' }}>
        {doubled.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ color: 'rgba(255,87,15,0.35)', fontSize: 13 }}>{p.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Component: Floating Pill ──────────────────────────────────────────────────
const FloatingPill = ({ style, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -10, duration: 2 + Math.random() * 0.8,
      repeat: -1, yoyo: true, ease: 'power1.inOut',
      delay: Math.random() * 1.5,
    });
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
};

// ─── Component: Mac Browser Mockup ────────────────────────────────────────────
const BrowserMockup = ({ children }) => (
  <div style={{
    borderRadius: 14, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(10,11,13,0.9)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
  }}>
    {/* Title bar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F56' }} />
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }} />
      <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27C93F' }} />
      <div style={{ flex: 1, margin: '0 12px', height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}>app.ddwagency.com</span>
      </div>
    </div>
    {children}
  </div>
);

// ─── Component: Stat Card ──────────────────────────────────────────────────────
const StatCard = ({ value, label }) => {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);
  const numRef  = useRef(null);
  useMagnetic(cardRef, 0.25);
  const numericVal = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix     = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    if (cardRef.current) io.observe(cardRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !numRef.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericVal, duration: 2.6, ease: 'power2.out',
      onUpdate: () => { if (numRef.current) numRef.current.textContent = Math.floor(obj.val) + suffix; },
    });
  }, [inView, numericVal, suffix]);

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
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)';
          e.currentTarget.style.boxShadow   = '0 0 40px rgba(255,87,15,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,87,15,0.12)';
          e.currentTarget.style.boxShadow   = 'none';
        }}
      >
        <div ref={cardRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div ref={numRef} className="font-heading" style={{
          fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 900,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg,#FF570F,#FDE87A)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 4, whiteSpace: 'nowrap',
        }}>
          0{suffix}
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'JetBrains Mono' }}>{label}</div>
      </SpotlightCard>
    </GSAPTilt>
  );
};

// ─── Component: Value Card ─────────────────────────────────────────────────────
const ValueCard = ({ value }) => (
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
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)';
        e.currentTarget.style.boxShadow   = '0 20px 60px rgba(255,87,15,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,87,15,0.1)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      {/* Watermark number */}
      <div className="fluid-watermark font-heading" style={{
        position: 'absolute', top: -10, right: 16,
        color: '#FF570F', fontWeight: 900, lineHeight: 1,
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
          transition: 'transform 0.4s ease', flexShrink: 0,
        }}>
          {value.icon}
        </div>
        <h4 className="font-heading" style={{ fontSize: 'clamp(1rem,1.8vw,1.2rem)', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
          {value.title}
        </h4>
        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: 14, fontFamily: 'Inter' }}>
          {value.desc}
        </p>
      </div>
    </SpotlightCard>
  </GSAPTilt>
);

// ─── Component: Timeline Item ──────────────────────────────────────────────────
const TimelineItem = ({ item, index }) => {
  const ref    = useRef(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0, y: 55, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 84%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, alignItems: 'center' }} className={`timeline-row-${index}`}>
        <style>{`
          @media (min-width: 1024px) {
            .timeline-row-${index} {
              grid-template-columns: 1fr 80px 1fr !important;
            }
            .tl-year-${index}  { order: ${isEven ? 0 : 2} !important; justify-content: ${isEven ? 'flex-end' : 'flex-start'} !important; }
            .tl-dot-${index}   { display: flex !important; order: 1 !important; }
            .tl-event-${index} { order: ${isEven ? 2 : 0} !important; }
          }
        `}</style>

        {/* Year badge */}
        <div className={`tl-year-${index}`} style={{ display: 'flex', justifyContent: 'flex-start', order: 0 }}>
          <div
            style={{ padding: '10px 24px', background: 'linear-gradient(90deg,#FF570F,#EE7D1D)', borderRadius: 12, boxShadow: '0 8px 30px rgba(255,87,15,0.35)', display: 'inline-block', transition: 'transform 0.3s ease', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="font-heading" style={{ fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 900, color: '#080a0c', letterSpacing: '-0.03em' }}>{item.year}</span>
          </div>
        </div>

        {/* Center dot — desktop only */}
        <div className={`tl-dot-${index}`} style={{ display: 'none', justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FF570F', border: '4px solid #080a0c', boxShadow: '0 0 0 2px #FF570F, 0 0 24px rgba(255,87,15,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#080a0c', animation: 'breatheGlow 2s ease-in-out infinite' }} />
          </div>
        </div>

        {/* Event card */}
        <div className={`tl-event-${index}`} style={{ order: 2 }}>
          <GSAPTilt>
            <SpotlightCard
              className="bottom-sweep"
              style={{
                padding: '20px 24px', borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(135deg,#131719,#0a0c0f)',
                border: '1px solid rgba(255,87,15,0.18)',
                transition: 'border-color 0.4s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,87,15,0.55)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,87,15,0.18)'}
            >
              {/* Mobile-only year inside card */}
              <div className={`tl-mobile-year-${index}`} style={{ marginBottom: 8 }}>
                <style>{`@media (min-width:1024px){ .tl-mobile-year-${index} { display:none !important; } }`}</style>
                <span style={{ fontSize: 10, color: '#FF570F', fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{item.year}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, fontSize: 14, fontFamily: 'Inter' }}>{item.event}</p>
            </SpotlightCard>
          </GSAPTilt>
        </div>
      </div>
    </div>
  );
};

// ─── Component: CTA Button ─────────────────────────────────────────────────────
const CTAButton = ({ href, children, variant = 'primary' }) => {
  const ref = useRef(null);
  useMagnetic(ref, 0.3);
  const isPrimary = variant === 'primary';
  return (
    <a
      ref={ref}
      href={href}
      className="shimmer-btn"
      style={{
        position: 'relative', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, padding: '14px 36px',
        fontFamily: 'Montserrat', fontWeight: 800,
        fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em',
        textDecoration: 'none', borderRadius: 2,
        minHeight: 52, cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'box-shadow 0.35s ease',
        background: isPrimary ? '#FF570F' : 'transparent',
        color: isPrimary ? '#080a0c' : '#ffffff',
        border: isPrimary ? 'none' : '1.5px solid rgba(255,87,15,0.45)',
        boxShadow: isPrimary ? '0 4px 20px rgba(255,87,15,0.35)' : 'none',
      }}
      onMouseEnter={e => {
        if (isPrimary) {
          e.currentTarget.style.boxShadow = '0 0 50px rgba(255,87,15,0.55)';
        } else {
          e.currentTarget.style.borderColor = 'rgba(255,87,15,0.9)';
          e.currentTarget.style.background  = 'rgba(255,87,15,0.08)';
        }
      }}
      onMouseLeave={e => {
        if (isPrimary) {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,87,15,0.35)';
        } else {
          e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)';
          e.currentTarget.style.background  = 'transparent';
        }
      }}
    >
      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
        {children}
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </a>
  );
};

// ─── DATA ──────────────────────────────────────────────────────────────────────
const valuesData = [
  {
    number: '01', title: 'No Bullshit Engineering',
    desc: 'We build what you need, not what sounds impressive in a pitch deck. Every technical decision is justified by measurable business outcomes.',
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    number: '02', title: 'Skin in the Game',
    desc: 'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.',
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    number: '03', title: 'Speed Without Shortcuts',
    desc: "We move fast because we've done this before — not because we skip tests, documentation, or proper architecture.",
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>,
  },
  {
    number: '04', title: 'Radical Transparency',
    desc: "You know exactly what we're building, why, and when it ships. No surprises. No excuses. No hidden costs.",
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  },
];

const timelineData = [
  { year: '2015', event: 'First Amazon brand taken on retainer. Still running that account today — $2.7M+ in sales managed.' },
  { year: '2019', event: 'DDW formally founded as a Florida LLC. Expanded into Meta and Google Ads management for US and EU brands.' },
  { year: '2021', event: 'Rome office opened. EU client base grows — Meta spend hits $400K+/month under management.' },
  { year: '2023', event: 'AI development and custom software added as core retainer services. TikTok Shop launched for clients.' },
  { year: '2025', event: 'Seven retainer services active. $683K managed in a single month. Lyra and Sviluppiamo.dev live.' },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const AboutPage = () => {
  const heroRef    = useRef(null);
  const headingRef = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);

  // SplitType heading reveal
  useEffect(() => {
    if (!headingRef.current) return;
    const split = new SplitType(headingRef.current, { types: 'words,chars' });
    gsap.from(split.chars, {
      opacity: 0, y: 45, rotationX: -35, skewX: 3,
      transformOrigin: 'top center',
      stagger: 0.028, duration: 0.85, ease: 'power3.out',
      delay: 0.15,
    });
    return () => split.revert();
  }, []);

  // Parallax orbs
  useEffect(() => {
    if (!orb1Ref.current || !orb2Ref.current || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, { yPercent: 30, ease: 'none', scrollTrigger: { trigger: heroRef.current, scrub: 1.2 } });
      gsap.to(orb2Ref.current, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: heroRef.current, scrub: 1.2 } });
    });
    return () => ctx.revert();
  }, []);

  // Global scroll fade-ups
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll('.scroll-fade-up').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 50, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <GlobalStyles />
      <main style={{ position: 'relative', width: '100%', background: '#080a0c', overflowX: 'hidden' }}>

        {/* ── Your existing Navbar ── */}
        <Navbar />

        {/* ════════════════════════════════════════════════
            § PAGE HEADER — passes through to your existing
              PageHeader component, same props as before
        ════════════════════════════════════════════════ */}
        <PageHeader
          title="About DDW"
          breadcrumb="About"
          subtitle="Florida LLC. Offices in Florida and Rome. We manage $683K+/month in Meta spend, $2.7M+ in Amazon sales, and ship live SaaS products — all on retainer."
        />

        {/* ── Logo Marquee ── */}
        <LogoMarquee />

        {/* ════════════════════════════════════════════════
            § STORY + BENTO
        ════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: 'clamp(56px,8vw,96px) 24px', background: '#080a0c', overflow: 'hidden' }}>
          {/* Grid mesh */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,87,15,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,87,15,0.02) 1px,transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%,black,transparent)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%,black,transparent)', pointerEvents: 'none' }} />
          {/* Orbs */}
          <div ref={orb1Ref} style={{ position: 'absolute', top: '5%', right: '10%', width: 'clamp(280px,40vw,600px)', height: 'clamp(280px,40vw,600px)', background: 'rgba(255,87,15,0.06)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
          <div ref={orb2Ref} style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 'clamp(200px,30vw,450px)', height: 'clamp(200px,30vw,450px)', background: 'rgba(253,232,122,0.03)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(40px,6vw,72px)', alignItems: 'center' }} className="story-grid">
              <style>{`@media (min-width:1024px){ .story-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>

              {/* Left: Text */}
              <div className="scroll-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Eyebrow>Our Story</Eyebrow>
                <h2 className="font-heading" style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.12, color: '#fff' }}>
                  Florida LLC.{' '}<br />
                  <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Two Offices.</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    'Digital Dream Works is a Florida LLC with offices in Florida and Rome. We serve US and EU clients across digital marketing, AI, and custom software — all on retainer.',
                    'We manage $683K+ in Meta ad spend per month, $2.7M+ in Amazon sales, run Google Ads at 600% ROAS, and have shipped 3 live SaaS products including Lyra and Sviluppiamo.dev.',
                    "Our clients don't come to us for one-off projects. They come when the stakes are real — when they need a team that builds the infrastructure, runs the accounts, and stays accountable month over month.",
                  ].map((text, i) => (
                    <p key={i} style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.78, fontSize: 'clamp(0.875rem,1.4vw,1rem)', fontFamily: 'Inter' }}>{text}</p>
                  ))}
                  <p style={{ color: '#FF570F', fontWeight: 700, fontSize: 15, fontFamily: 'Montserrat', letterSpacing: '0.02em' }}>Retainer-only. One team. US + EU markets.</p>
                </div>

                {/* Stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, paddingTop: 20, borderTop: '1px solid rgba(255,87,15,0.12)' }} className="stat-grid">
                  <style>{`@media (min-width:480px){ .stat-grid { grid-template-columns: repeat(4,1fr) !important; } }`}</style>
                  <StatCard value="683K+" label="Meta $/month" />
                  <StatCard value="7"     label="Service Areas" />
                  <StatCard value="2"     label="Offices" />
                  <StatCard value="2015"  label="Since" />
                </div>
              </div>

              {/* Right: Bento */}
              <div className="scroll-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                {/* Globe — full width */}
                <GSAPTilt style={{ gridColumn: '1 / -1' }}>
                  <SpotlightCard style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,87,15,0.18)', background: '#05070a', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,87,15,0.12) 1px,transparent 1px)', backgroundSize: '18px 18px', opacity: 0.4, pointerEvents: 'none' }} />
                    <GlobeVisual />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#05070a 8%,transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: 18, left: 18, zIndex: 30 }}>
                      <p style={{ color: '#FF570F', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>Global Infrastructure</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>US & EU Endpoints Active</p>
                    </div>
                    <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 30, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', animation: 'breatheGlow 1.8s ease-in-out infinite' }} />
                      <span style={{ fontSize: 9, color: '#22c55e', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Live</span>
                    </div>
                    <FloatingPill style={{ bottom: 18, right: 18 }}>
                      <span style={{ fontSize: 10, color: '#FF570F', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>+$683K</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', display: 'block', letterSpacing: '0.1em' }}>this month</span>
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
                      <p style={{ color: '#FF570F', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>Ad Spend</p>
                      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>$683K+/mo</p>
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
                      <p style={{ color: '#FF570F', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>AI Logic</p>
                      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Custom Arch</p>
                    </div>
                  </SpotlightCard>
                </GSAPTilt>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            § BROWSER MOCKUP
        ════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: 'clamp(48px,7vw,80px) 24px', background: '#0a0c0f', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'rgba(255,87,15,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="scroll-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
              <Eyebrow>Live Products</Eyebrow>
              <h3 className="font-heading" style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>
                Shipped.{' '}
                <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>In Production.</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 12, fontFamily: 'Inter' }}>Real products. Real revenue. Running on real infrastructure.</p>
            </div>
            <div className="scroll-fade-up">
              <BrowserMockup>
                <div style={{ background: '#080a0c', padding: 24, minHeight: 280, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }} className="dash-cols">
                    <style>{`@media (max-width:600px){ .dash-cols { grid-template-columns: 1fr !important; } }`}</style>
                    {[
                      { label: 'Revenue MTD',    val: '$683K', delta: '+14.2%' },
                      { label: 'ROAS',           val: '6.0×',  delta: '+0.8×'  },
                      { label: 'Active Accounts',val: '14',    delta: '+3'     },
                    ].map((d, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,87,15,0.1)' }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{d.label}</p>
                        <p className="font-heading" style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{d.val}</p>
                        <p style={{ fontSize: 10, color: '#22c55e', fontFamily: 'JetBrains Mono', marginTop: 4 }}>{d.delta} this mo.</p>
                      </div>
                    ))}
                  </div>
                  {/* Faux chart */}
                  <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, position: 'relative' }}>
                    {[55,70,48,85,60,90,75,65,88,72,95,80].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: 'linear-gradient(to top,rgba(255,87,15,0.1),#FF570F)', borderRadius: '3px 3px 0 0', height: `${h}%`, minWidth: 6, opacity: 0.7 + i * 0.02 }} />
                    ))}
                    <div style={{ position: 'absolute', top: 10, right: 14 }}>
                      <span style={{ fontSize: 9, color: '#FF570F', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em' }}>META SPEND · 12 WEEKS</span>
                    </div>
                  </div>
                  <FloatingPill style={{ top: 16, right: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', animation: 'breatheGlow 1.5s ease-in-out infinite' }} />
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono' }}>All systems operational</span>
                    </div>
                  </FloatingPill>
                </div>
              </BrowserMockup>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            § VALUES
        ════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: 'clamp(56px,8vw,96px) 24px', background: '#0d1012', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, left: '25%', width: 500, height: 500, background: 'rgba(253,232,122,0.03)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="scroll-fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
              <Eyebrow>Our Principles</Eyebrow>
              <h3 className="font-heading" style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12 }}>
                How We{' '}
                <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Operate</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, maxWidth: 480, margin: '0 auto', fontFamily: 'Inter' }}>Four non-negotiable principles that govern every project.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="values-grid scroll-fade-up">
              <style>{`@media (min-width:768px){ .values-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
              {valuesData.map((v, i) => <ValueCard key={i} value={v} />)}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            § TIMELINE
        ════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: 'clamp(56px,8vw,96px) 24px', background: '#080a0c', overflow: 'hidden' }}>
          {/* Vertical center line — desktop only */}
          <div className="timeline-center-line" style={{ display: 'none', position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, transform: 'translateX(-50%)', background: 'linear-gradient(to bottom,transparent,rgba(255,87,15,0.12),transparent)', pointerEvents: 'none' }}>
            <style>{`@media (min-width:1024px){ .timeline-center-line { display:block !important; } }`}</style>
          </div>
          <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="scroll-fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
              <Eyebrow>Our Journey</Eyebrow>
              <h3 className="font-heading" style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12 }}>
                The{' '}
                <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Timeline</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, maxWidth: 440, margin: '0 auto', fontFamily: 'Inter' }}>From frustrated engineers to trusted enterprise partner.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {timelineData.map((item, i) => <TimelineItem key={i} item={item} index={i} />)}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            § CTA
        ════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: 'clamp(64px,10vw,120px) 24px', background: 'linear-gradient(180deg,#080a0c,#0d1012)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(300px,60vw,700px)', height: 'clamp(150px,30vw,350px)', background: 'rgba(255,87,15,0.09)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,87,15,0.35),transparent)' }} />

          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div className="scroll-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1, background: 'rgba(255,87,15,0.4)' }} />
              <span style={{ color: '#FF570F', fontSize: 10, fontFamily: 'JetBrains Mono', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Let's Work Together</span>
              <div style={{ width: 32, height: 1, background: 'rgba(255,87,15,0.4)' }} />
            </div>

            <h3 className="font-heading scroll-fade-up" style={{ fontSize: 'clamp(2rem,5vw,4.2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', marginBottom: 20 }}>
              Ready to Build{' '}
              <span style={{ background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Something Real?</span>
            </h3>

            <p className="scroll-fade-up" style={{ color: 'rgba(255,255,255,0.42)', fontSize: 'clamp(0.875rem,1.5vw,1.05rem)', lineHeight: 1.75, maxWidth: 580, margin: '0 auto 40px', fontFamily: 'Inter' }}>
              Let's talk about your technical challenges and how we can solve them with infrastructure that scales.
            </p>

            <div className="scroll-fade-up" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <CTAButton href="/contact"     variant="primary">Start a Project</CTAButton>
              <CTAButton href="/case-studies" variant="secondary">View Our Work</CTAButton>
            </div>

            <p className="scroll-fade-up" style={{ marginTop: 32, color: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'JetBrains Mono', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Retainer-only · No lock-in contracts · US + EU
            </p>
          </div>
        </section>

        {/* ── Your existing Footer ── */}
        <Footer />

      </main>
    </>
  );
};

export default AboutPage;