// src/components/AboutSection.jsx
// DDW Agency — About Section | Premium GSAP + React JSX | Vite Compatible

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand Tokens ──────────────────────────────────────────────────────────────
const B = {
  orange:    '#FF570F',
  orangeSoft:'#EE7D1D',
  accent:    '#FDE87A',
  bg:        '#080a0c',
  bgCard:    '#0d1012',
  bgCardAlt: '#0a0c0e',
  border:    'rgba(255,87,15,0.18)',
};

// ─── Stats Data ────────────────────────────────────────────────────────────────
const STATS = [
  { end: 7,   suffix: '',    label: 'Core Services',       sub: 'One team across all seven'   },
  { end: 100, suffix: '%',   label: 'Retainer Only',       sub: 'No one-off projects, ever'   },
  { end: 2,   suffix: '',    label: 'Global Markets',      sub: 'US and EU operations'         },
  { end: 24,  suffix: 'hr',  label: 'Response SLA',        sub: 'For all active retainers'    },
];

const PILLS = ['Florida, USA', 'Rome, Italy', 'Retainer-only', 'US + EU clients'];

const TRUST = [
  {
    text: 'Award Winning',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 4v12l-4-2-4 2V4M6 4h12M6 4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2m12-6c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2" />
      </svg>
    ),
  },
  {
    text: 'Enterprise Security',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    text: 'Lightning Fast',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

// ─── Utility: is touch / mobile ────────────────────────────────────────────────
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0);

// ─── GSAP Counter ─────────────────────────────────────────────────────────────
const GSAPCounter = ({ end, suffix = '', duration = 2.2, active = false, decimals = 0 }) => {
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!active || animated.current || !ref.current) return;
    animated.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = obj.val.toFixed(decimals) + suffix;
      },
    });
  }, [active, end, suffix, duration, decimals]);

  return (
    <span ref={ref} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      0{suffix}
    </span>
  );
};

// ─── Abstract Team Visual ──────────────────────────────────────────────────────
const AbstractTeamVisual = () => {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const ringARef = useRef(null);
  const ringBRef = useRef(null);
  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, { scale: 1.2, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
      gsap.to(orb2Ref.current, { scale: 0.8, duration: 7, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 2 });
      gsap.to(ringARef.current, { rotation: 360, duration: 24, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to(ringBRef.current, { rotation: -360, duration: 16, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to(dot1Ref.current, { y: -9, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
      gsap.to(dot2Ref.current, { y: 7, duration: 3.2, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 });

      // Animate data bars
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        gsap.to(bar, {
          scaleY: gsap.utils.random(0.3, 1),
          duration: gsap.utils.random(1.2, 2.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.18,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const barData = [30, 55, 45, 70, 40, 65, 50, 80];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
    >
      {/* Glowing orbs */}
      <div
        ref={orb1Ref}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${B.orange}20 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute rounded-full"
        style={{
          inset: '20%',
          background: `radial-gradient(circle, ${B.accent}18 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Dashed orbiting rings */}
      <div
        ref={ringARef}
        className="absolute rounded-full"
        style={{
          inset: '6%',
          border: `1px dashed ${B.orange}28`,
        }}
      />
      <div
        ref={ringBRef}
        className="absolute rounded-full"
        style={{
          inset: '22%',
          border: `1px dotted rgba(255,255,255,0.1)`,
        }}
      />

      {/* Orbit dots */}
      <div
        ref={dot1Ref}
        className="absolute"
        style={{
          top: '9%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: B.orange,
          boxShadow: `0 0 12px 4px ${B.orange}70`,
        }}
      />
      <div
        className="absolute"
        style={{
          top: '34%',
          right: '8%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: B.orangeSoft,
          opacity: 0.7,
        }}
      />
      <div
        ref={dot2Ref}
        className="absolute"
        style={{
          bottom: '11%',
          left: '20%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: `${B.accent}BB`,
          boxShadow: `0 0 10px 3px ${B.accent}40`,
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: '28%',
          right: '14%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: `${B.orange}60`,
        }}
      />

      {/* Pulsing data bars at bottom */}
      <div
        className="absolute flex items-end gap-1"
        style={{ bottom: '12%', left: '50%', transform: 'translateX(-50%)' }}
      >
        {barData.map((h, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className="rounded-t-sm origin-bottom"
            style={{
              width: 4,
              height: h * 0.45,
              background:
                i % 3 === 0
                  ? B.orange
                  : i % 3 === 1
                  ? `${B.orangeSoft}60`
                  : `${B.accent}40`,
            }}
          />
        ))}
      </div>

      {/* Center glowing node */}
      <div
        className="relative z-10 flex flex-col items-center justify-center rounded-2xl"
        style={{
          width: 120,
          height: 120,
          background: `linear-gradient(135deg, #1c1c1c 0%, ${B.bgCardAlt} 100%)`,
          border: `1px solid ${B.orange}25`,
          boxShadow: `0 0 40px ${B.orange}15, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* DDW grid icon */}
        <svg width="40" height="40" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 6 }}>
          <rect x="3"  y="3"  width="13" height="13" rx="2" stroke={B.orange}    strokeWidth="1.4" />
          <rect x="20" y="3"  width="13" height="13" rx="2" stroke={B.orangeSoft} strokeWidth="1.4" />
          <rect x="3"  y="20" width="13" height="13" rx="2" stroke={B.orangeSoft} strokeWidth="1.4" />
          <rect x="20" y="20" width="13" height="13" rx="2" stroke={B.accent}     strokeWidth="1.4" />
          <circle cx="18" cy="18" r="3" fill={B.orange} />
        </svg>
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          DDW
        </span>
      </div>

      {/* Floating info chips — hidden on smallest screens */}
      <div
        className="absolute hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
        style={{
          top: '5%',
          left: '-6%',
          background: 'rgba(13,16,18,0.92)',
          border: `1px solid ${B.orange}28`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.orange }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: B.orange, fontFamily: 'Montserrat, sans-serif' }}>
          7 Core Services
        </span>
      </div>
      <div
        className="absolute hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
        style={{
          bottom: '8%',
          right: '-5%',
          background: 'rgba(13,16,18,0.92)',
          border: `1px solid ${B.accent}28`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.accent }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: B.accent, fontFamily: 'Montserrat, sans-serif' }}>
          100% Retainer
        </span>
      </div>
    </div>
  );
};

// ─── Browser Mockup Wrapper ────────────────────────────────────────────────────
const BrowserMockup = ({ children, className = '' }) => (
  <div
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{
      background: 'rgba(13,16,18,0.97)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,87,15,0.08)`,
      backdropFilter: 'blur(20px)',
    }}
  >
    {/* Title bar */}
    <div
      className="flex items-center gap-2 px-4 py-3 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Traffic lights */}
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
      {/* URL bar */}
      <div
        className="flex-1 mx-4 flex items-center gap-2 px-3 py-1 rounded-md"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
          ddwagency.com/about
        </span>
      </div>
    </div>
    {children}
  </div>
);

// ─── Floating Stat Badge ───────────────────────────────────────────────────────
const FloatingBadge = ({ value, label, accent, delay = 0, style = {} }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay,
    });
  }, [delay]);

  return (
    <div
      ref={ref}
      className="absolute z-20 rounded-2xl p-4 sm:p-5"
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${B.orangeSoft} 100%)`,
        border: `2px solid ${accent}40`,
        boxShadow: `0 16px 48px ${accent}40`,
        ...style,
      }}
    >
      <div
        className="font-black leading-none mb-1"
        style={{
          fontSize: 'clamp(22px, 3vw, 32px)',
          color: B.bg,
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '-0.03em',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: `${B.bg}CC`,
          fontFamily: 'Montserrat, sans-serif',
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
      {/* Ping ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `2px solid ${accent}`,
          animation: 'ddwPing 2.5s ease-out infinite',
          opacity: 0,
        }}
      />
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ stat, active, index }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const isTouch = useRef(isTouchDevice());
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  // 3D tilt — desktop only
  const handleMouseMove = useCallback(
    (e) => {
      if (isTouch.current || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(cardRef.current, {
        rotationY: dx * 14,
        rotationX: -dy * 14,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out',
      });
      setSpot({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
        on: true,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouch.current || !cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0, rotationX: 0,
      duration: 0.6, ease: 'power3.out',
    });
    setSpot((s) => ({ ...s, on: false }));
  }, []);

  const accent = index % 2 === 0 ? B.orange : B.orangeSoft;

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden border group cursor-default min-h-[44px]"
      style={{
        background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
        borderColor: `${accent}20`,
        willChange: 'transform',
        transition: 'border-color 0.4s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight */}
      {spot.on && !isTouch.current && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, ${accent}16 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Dot grid watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />

      {/* Watermark number */}
      <div
        className="absolute -bottom-2 -right-1 font-black pointer-events-none select-none leading-none"
        style={{
          fontSize: 'clamp(48px, 6vw, 80px)',
          color: accent,
          opacity: 0.05,
          letterSpacing: '-0.04em',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {stat.end}{stat.suffix}
      </div>

      {/* Bottom progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, ${B.accent})` }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}45, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 p-5">
        <div
          className="font-black mb-1 leading-none"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, ${accent} 0%, ${B.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <GSAPCounter end={stat.end} suffix={stat.suffix} active={active} />
        </div>
        <div
          className="font-bold uppercase mb-1 group-hover:text-white transition-colors duration-300"
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {stat.label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {stat.sub}
        </div>
      </div>
    </div>
  );
};

// ─── Magnetic CTA Button ───────────────────────────────────────────────────────
const MagneticButton = ({ href, children, variant = 'primary' }) => {
  const btnRef = useRef(null);
  const isTouch = useRef(isTouchDevice());
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    if (isTouch.current || !btnRef.current) return;
    xTo.current = gsap.quickTo(btnRef.current, 'x', { duration: 0.45, ease: 'power3.out' });
    yTo.current = gsap.quickTo(btnRef.current, 'y', { duration: 0.45, ease: 'power3.out' });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isTouch.current || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * 0.3);
    yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * 0.3);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isTouch.current) return;
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  const isPrimary = variant === 'primary';

  return (
    <a
      ref={btnRef}
      href={isPrimary ? '/about' : '/contact'}
      className="relative inline-flex items-center justify-center gap-2 font-bold uppercase overflow-hidden group"
      style={{
        minHeight: 52,
        padding: '14px 32px',
        borderRadius: 12,
        fontSize: 12,
        letterSpacing: '0.16em',
        fontFamily: 'Montserrat, sans-serif',
        background: isPrimary
          ? `linear-gradient(135deg, ${B.orange} 0%, ${B.orangeSoft} 100%)`
          : 'transparent',
        color: isPrimary ? B.bg : '#fff',
        border: `2px solid ${isPrimary ? 'transparent' : B.orange}`,
        boxShadow: isPrimary ? `0 0 28px ${B.orange}30` : 'none',
        transition: 'box-shadow 0.4s ease, background 0.4s ease',
        willChange: 'transform',
        textDecoration: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shimmer sweep */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.8s ease',
        }}
        aria-hidden
      />
      {/* Hover fill for secondary */}
      {!isPrimary && (
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: `${B.orange}18` }}
          aria-hidden
        />
      )}
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        width="14" height="14" viewBox="0 0 16 16" fill="none"
      >
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
};

// ─── Main About Section ────────────────────────────────────────────────────────
const AboutSection = () => {
  const sectionRef      = useRef(null);
  const headingRef      = useRef(null);
  const visualWrapRef   = useRef(null);
  const orb1Ref         = useRef(null);
  const orb2Ref         = useRef(null);
  const lineRef         = useRef(null);
  const eyebrowRef      = useRef(null);
  const bodyRef         = useRef(null);
  const body2Ref        = useRef(null);
  const pillsRef        = useRef(null);
  const statsRef        = useRef(null);
  const ctaRef          = useRef(null);
  const trustRef        = useRef(null);
  const wordRefs        = useRef([]);
  const [counterActive, setCounterActive] = useState(false);

  // heading words
  const headingWords = [
    { text: 'Built by',      gradient: false },
    { text: 'engineers.',   gradient: false },
    { text: 'Not',          gradient: true  },
    { text: 'marketers.',   gradient: true  },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Orb parallax (scrub) ──────────────────────────────────────
      gsap.to(orb1Ref.current, {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: { trigger: section, scrub: 1.5 },
      });
      gsap.to(orb2Ref.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: section, scrub: 1.5 },
      });

      // ── Top line reveal ───────────────────────────────────────────
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 90%', once: true },
        }
      );

      // ── Eyebrow ───────────────────────────────────────────────────
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 18, filter: 'blur(4px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%', once: true },
        }
      );

      // ── Heading words stagger ─────────────────────────────────────
      gsap.fromTo(
        wordRefs.current.filter(Boolean),
        { opacity: 0, y: 44, rotationX: -35, skewX: 3 },
        {
          opacity: 1, y: 0, rotationX: 0, skewX: 0,
          duration: 0.9, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 84%', once: true },
        }
      );

      // ── Body paragraphs ───────────────────────────────────────────
      gsap.fromTo(
        [bodyRef.current, body2Ref.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: bodyRef.current, start: 'top 88%', once: true },
        }
      );

      // ── Pills row ─────────────────────────────────────────────────
      gsap.fromTo(
        pillsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { trigger: pillsRef.current, start: 'top 90%', once: true },
        }
      );

      // ── Stats grid ────────────────────────────────────────────────
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 86%',
            once: true,
            onEnter: () => setCounterActive(true),
          },
        }
      );

      // ── CTA + Trust ───────────────────────────────────────────────
      gsap.fromTo(
        [ctaRef.current, trustRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', once: true },
        }
      );

      // ── Visual panel ──────────────────────────────────────────────
      gsap.fromTo(
        visualWrapRef.current,
        { opacity: 0, x: -32, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: visualWrapRef.current, start: 'top 85%', once: true },
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: B.bg, padding: 'clamp(72px, 9vw, 128px) 0' }}
    >
      {/* ── Injected styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes ddwPing {
          0%   { transform: scale(1);   opacity: 0.4; }
          80%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .ddw-about-word { display: inline-block; transform-style: preserve-3d; }
        .ddw-pill-hover:hover { border-color: ${B.orange}60 !important; }
        .ddw-trust-item:hover .ddw-trust-icon { transform: scale(1.25); }
        .ddw-trust-item:hover .ddw-trust-text { color: ${B.orange}; }
      `}</style>

      {/* ── Mesh grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* ── Atmospheric orbs ── */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        style={{
          top: '-5%', right: '-8%',
          width: 'clamp(320px, 45vw, 700px)',
          height: 'clamp(320px, 45vw, 700px)',
          background: `radial-gradient(circle, ${B.orange}12 0%, transparent 70%)`,
          filter: 'blur(90px)',
          borderRadius: '50%',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        style={{
          bottom: '-5%', left: '-8%',
          width: 'clamp(280px, 40vw, 600px)',
          height: 'clamp(280px, 40vw, 600px)',
          background: `radial-gradient(circle, ${B.accent}0C 0%, transparent 70%)`,
          filter: 'blur(100px)',
          borderRadius: '50%',
        }}
      />

      {/* ── Top rule ── */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}35, ${B.accent}20, transparent)`,
          opacity: 0,
        }}
      />

      {/* ── Content wrapper ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

          {/* ════════════════════════════════════════════════════════
              LEFT — Visual Panel
          ════════════════════════════════════════════════════════ */}
          <div
            ref={visualWrapRef}
            className="lg:col-span-5 flex justify-center lg:justify-start"
            style={{ opacity: 0 }}
          >
            <div className="relative w-full" style={{ maxWidth: 460 }}>

              {/* Browser mockup housing the abstract visual */}
              <BrowserMockup>
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    height: 'clamp(280px, 40vw, 420px)',
                    background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${B.orange}08 0%, ${B.bg} 100%)`,
                  }}
                >
                  {/* Dot grid inside mockup */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(${B.orange}28 1px, transparent 1px)`,
                      backgroundSize: '22px 22px',
                      opacity: 0.035,
                    }}
                  />
                  <AbstractTeamVisual />
                </div>
              </BrowserMockup>

              {/* Floating badges */}
              <FloatingBadge
                value="7+"
                label="Core Services"
                accent={B.orange}
                delay={0}
                style={{ top: -20, left: -20 }}
              />
              <FloatingBadge
                value="100%"
                label="Retainer Only"
                accent={B.orangeSoft}
                delay={0.8}
                style={{ bottom: -20, right: -20 }}
              />

              {/* Glow behind mockup */}
              <div
                className="absolute -z-10 rounded-3xl pointer-events-none"
                style={{
                  inset: '-5%',
                  background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${B.orange}18 0%, transparent 70%)`,
                  filter: 'blur(30px)',
                }}
              />
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              RIGHT — Copy + Stats + CTAs
          ════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-7">

            {/* Eyebrow */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2.5 self-start px-5 py-2.5 rounded-full border"
              style={{
                borderColor: `${B.orange}30`,
                background: `${B.orange}0A`,
                opacity: 0,
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: B.orange,
                  boxShadow: `0 0 8px ${B.orange}`,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.24em',
                  color: B.orange,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Who We Are
              </span>
            </div>

            {/* Heading */}
            <h2
              ref={headingRef}
              className="leading-[1.08]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                fontSize: 'clamp(32px, 5vw, 64px)',
                perspective: '1000px',
              }}
            >
              {/* Line 1 */}
              <span className="block mb-1">
                {['Built by', 'engineers.'].map((word, i) => (
                  <span
                    key={i}
                    ref={(el) => (wordRefs.current[i] = el)}
                    className="ddw-about-word mr-3 text-white"
                    style={{ opacity: 0 }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              {/* Line 2 — gradient */}
              <span className="block">
                {['Not', 'marketers.'].map((word, i) => (
                  <span
                    key={i}
                    ref={(el) => (wordRefs.current[i + 2] = el)}
                    className="ddw-about-word mr-3"
                    style={{
                      opacity: 0,
                      background: `linear-gradient(135deg, ${B.orange} 0%, ${B.accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h2>

            {/* Body copy */}
            <p
              ref={bodyRef}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(14px, 1.5vw, 17px)',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.55)',
                maxWidth: 540,
                opacity: 0,
              }}
            >
              Digital Dream Works is a cross-functional team operating from Florida
              and Rome. We build and maintain software systems and marketing
              infrastructure for US and EU clients on an ongoing retainer basis.
            </p>
            <p
              ref={body2Ref}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.35)',
                maxWidth: 520,
                opacity: 0,
              }}
            >
              Every engagement is a retainer. The team that scopes the work is the
              team that maintains it — no handing off to juniors, no re-onboarding
              every six months.
            </p>

            {/* Location pills */}
            <div
              ref={pillsRef}
              className="flex flex-wrap gap-2.5"
              style={{ opacity: 0 }}
            >
              {PILLS.map((pill) => (
                <div
                  key={pill}
                  className="ddw-pill-hover flex items-center gap-2 rounded-full border transition-all duration-300 cursor-default"
                  style={{
                    padding: '8px 16px',
                    borderColor: `${B.orange}20`,
                    background: `${B.orange}08`,
                  }}
                >
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: B.orange, flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {pill}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-3 sm:gap-4"
              style={{ opacity: 0 }}
            >
              {STATS.map((stat, i) => (
                <StatCard key={i} stat={stat} active={counterActive} index={i} />
              ))}
            </div>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
              style={{ opacity: 0 }}
            >
              <MagneticButton href="/about" variant="primary">
                Read Our Story
              </MagneticButton>
              <MagneticButton href="/contact" variant="secondary">
                Work With Us
              </MagneticButton>
            </div>

            {/* Trust badges */}
            <div
              ref={trustRef}
              className="flex flex-wrap gap-5 sm:gap-7 pt-5 border-t"
              style={{
                borderColor: `${B.orange}18`,
                opacity: 0,
              }}
            >
              {TRUST.map((item, i) => (
                <div
                  key={i}
                  className="ddw-trust-item flex items-center gap-2 cursor-default"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  <span
                    className="ddw-trust-icon transition-transform duration-300"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="ddw-trust-text transition-colors duration-300"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom rule ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}18, transparent)`,
        }}
      />
    </section>
  );
};

export default AboutSection;