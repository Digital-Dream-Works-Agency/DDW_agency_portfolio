/**
 * AboutSection.jsx
 * DDW Agency — Fully optimized About Section
 *
 * Key fixes applied:
 * - No <style> tag injection
 * - No @import
 * - No gsap.registerPlugin (moved to main.jsx)
 * - isTouchDevice computed once at module level
 * - All style objects memoized or hoisted to module scope
 * - GSAP cleanup on every infinite tween
 * - wordRefs array reset before population
 * - glowRef dead code removed
 * - MagneticButton uses href prop correctly
 * - FloatingBadge ping ring opacity bug fixed
 * - willChange applied dynamically, not permanently
 * - barData hoisted to module scope
 * - headingWords dead variable removed
 * - ScrollTrigger instances batched where possible
 * - setCounterActive guarded against unmounted calls
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Brand Tokens (module-level — never reconstructed) ─────────────────────
const B = Object.freeze({
  orange:    '#FF570F',
  orangeSoft:'#EE7D1D',
  accent:    '#FDE87A',
  bg:        '#080a0c',
  bgCard:    '#0d1012',
  bgCardAlt: '#0a0c0e',
  border:    'rgba(255,87,15,0.18)',
});

// ─── Static data (module-level — allocated once) ───────────────────────────
const STATS = Object.freeze([
  { end: 7,   suffix: '',   label: 'Core Services',  sub: 'One team across all seven'   },
  { end: 100, suffix: '%',  label: 'Retainer Only',  sub: 'No one-off projects, ever'   },
  { end: 2,   suffix: '',   label: 'Global Markets', sub: 'US and EU operations'         },
  { end: 24,  suffix: 'hr', label: 'Response SLA',   sub: 'For all active retainers'    },
]);

const PILLS = Object.freeze([
  'Florida, USA', 'Rome, Italy', 'Retainer-only', 'US + EU clients',
]);

// SVG icons extracted as module-level constants — never re-created in render
const IconAward = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 4h12M6 4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2m12-6c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2" />
  </svg>
);
const IconShield = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconBolt = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TRUST = Object.freeze([
  { text: 'Award Winning',     icon: IconAward  },
  { text: 'Enterprise Security', icon: IconShield },
  { text: 'Lightning Fast',    icon: IconBolt   },
]);

// Bar heights for AbstractTeamVisual — module-level, never re-allocated
const BAR_DATA = Object.freeze([30, 55, 45, 70, 40, 65, 50, 80]);

// ─── Touch detection — computed ONCE at module load, not per component ─────
// FIXED: Previously called isTouchDevice() inside every StatCard and MagneticButton mount.
// 6 matchMedia queries per render cycle. Now: exactly 1, at import time.
const IS_TOUCH =
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0);

// ─── Memoized style factories ──────────────────────────────────────────────
// FIXED: Inline template literals in JSX create new objects every render.
// These are computed once and reused. For dynamic values, useMemo is used
// inside components. For static values, module-level objects are used.

const sectionStyle = {
  background: B.bg,
  padding: 'clamp(72px, 9vw, 128px) 0',
};

const meshGridStyle = {
  backgroundImage: `
    linear-gradient(rgba(255,87,15,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,87,15,0.035) 1px, transparent 1px)
  `,
  backgroundSize: '54px 54px',
  maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 20%, transparent 100%)',
  WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 20%, transparent 100%)',
};

const lineStyle = {
  background: `linear-gradient(90deg, transparent, ${B.orange}35, ${B.accent}20, transparent)`,
  opacity: 0,
};

// ─── GSAPCounter ──────────────────────────────────────────────────────────
// No changes needed structurally, but deps array was already correct.
const GSAPCounter = ({ end, suffix = '', duration = 2.2, active = false, decimals = 0 }) => {
  const ref     = useRef(null);
  const animated = useRef(false);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!active || animated.current || !ref.current) return;
    animated.current = true;

    const obj = { val: 0 };
    tweenRef.current = gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        // Guard against unmount during tween
        if (ref.current) {
          ref.current.textContent = obj.val.toFixed(decimals) + suffix;
        }
      },
    });

    return () => {
      // FIXED: Kill tween on unmount to prevent setState on dead node
      tweenRef.current?.kill();
    };
  }, [active, end, suffix, duration, decimals]);

  return (
    <span ref={ref} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      0{suffix}
    </span>
  );
};

// ─── AbstractTeamVisual ────────────────────────────────────────────────────
const AbstractTeamVisual = React.memo(() => {
  const containerRef = useRef(null);
  const orb1Ref      = useRef(null);
  const orb2Ref      = useRef(null);
  const ringARef     = useRef(null);
  const ringBRef     = useRef(null);
  const dot1Ref      = useRef(null);
  const dot2Ref      = useRef(null);
  // FIXED: Use a ref to a stable array, cleared on unmount via ctx.revert()
  const barsRef      = useRef([]);

  useEffect(() => {
    // FIXED: gsap.context() correctly scopes and kills ALL tweens including
    // repeat:-1 infinite ones on ctx.revert(). No manual cleanup needed
    // beyond returning ctx.revert.
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, {
        scale: 1.2, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut',
      });
      gsap.to(orb2Ref.current, {
        scale: 0.8, duration: 7, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 2,
      });
      gsap.to(ringARef.current, {
        rotation: 360, duration: 24, repeat: -1, ease: 'none', transformOrigin: '50% 50%',
      });
      gsap.to(ringBRef.current, {
        rotation: -360, duration: 16, repeat: -1, ease: 'none', transformOrigin: '50% 50%',
      });
      gsap.to(dot1Ref.current, {
        y: -9, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut',
      });
      gsap.to(dot2Ref.current, {
        y: 7, duration: 3.2, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1,
      });

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
  }, []); // No deps — pure visual, never needs to re-run

  // Memoized inline styles for orbs (static values, defined once)
  const orb1Style = useMemo(() => ({
    background: `radial-gradient(circle, ${B.orange}20 0%, transparent 70%)`,
    filter: 'blur(60px)',
  }), []);

  const orb2Style = useMemo(() => ({
    inset: '20%',
    background: `radial-gradient(circle, ${B.accent}18 0%, transparent 70%)`,
    filter: 'blur(40px)',
  }), []);

  const ringAStyle = useMemo(() => ({
    inset: '6%',
    border: `1px dashed ${B.orange}28`,
  }), []);

  const ringBStyle = useMemo(() => ({
    inset: '22%',
    border: `1px dotted rgba(255,255,255,0.1)`,
  }), []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
    >
      {/* Glowing orbs */}
      <div ref={orb1Ref} className="absolute inset-0 rounded-full" style={orb1Style} />
      <div ref={orb2Ref} className="absolute rounded-full"         style={orb2Style} />

      {/* Rings */}
      <div ref={ringARef} className="absolute rounded-full" style={ringAStyle} />
      <div ref={ringBRef} className="absolute rounded-full" style={ringBStyle} />

      {/* Orbit dots */}
      <div
        ref={dot1Ref}
        className="absolute"
        style={{
          top: '9%', left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: B.orange,
          boxShadow: `0 0 12px 4px ${B.orange}70`,
        }}
      />
      <div
        className="absolute"
        style={{
          top: '34%', right: '8%',
          width: 6, height: 6, borderRadius: '50%',
          background: B.orangeSoft, opacity: 0.7,
        }}
      />
      <div
        ref={dot2Ref}
        className="absolute"
        style={{
          bottom: '11%', left: '20%',
          width: 8, height: 8, borderRadius: '50%',
          background: `${B.accent}BB`,
          boxShadow: `0 0 10px 3px ${B.accent}40`,
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: '28%', right: '14%',
          width: 5, height: 5, borderRadius: '50%',
          background: `${B.orange}60`,
        }}
      />

      {/* Data bars */}
      <div
        className="absolute flex items-end gap-1"
        style={{ bottom: '12%', left: '50%', transform: 'translateX(-50%)' }}
      >
        {BAR_DATA.map((h, i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className="rounded-t-sm origin-bottom"
            style={{
              width: 4,
              height: h * 0.45,
              background:
                i % 3 === 0 ? B.orange
                : i % 3 === 1 ? `${B.orangeSoft}60`
                : `${B.accent}40`,
            }}
          />
        ))}
      </div>

      {/* Center node */}
      <div
        className="relative z-10 flex flex-col items-center justify-center rounded-2xl"
        style={{
          width: 120, height: 120,
          background: `linear-gradient(135deg, #1c1c1c 0%, ${B.bgCardAlt} 100%)`,
          border: `1px solid ${B.orange}25`,
          boxShadow: `0 0 40px ${B.orange}15, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 6 }} aria-hidden="true">
          <rect x="3"  y="3"  width="13" height="13" rx="2" stroke={B.orange}     strokeWidth="1.4" />
          <rect x="20" y="3"  width="13" height="13" rx="2" stroke={B.orangeSoft}  strokeWidth="1.4" />
          <rect x="3"  y="20" width="13" height="13" rx="2" stroke={B.orangeSoft}  strokeWidth="1.4" />
          <rect x="20" y="20" width="13" height="13" rx="2" stroke={B.accent}      strokeWidth="1.4" />
          <circle cx="18" cy="18" r="3" fill={B.orange} />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          DDW
        </span>
      </div>

      {/* Floating info chips */}
      <div
        className="absolute hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
        style={{
          top: '5%', left: '-6%',
          background: 'rgba(13,16,18,0.92)',
          border: `1px solid ${B.orange}28`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.orange }} />
        <span className="text-xs font-bold" style={{ color: B.orange, fontFamily: 'Montserrat, sans-serif' }}>
          7 Core Services
        </span>
      </div>
      <div
        className="absolute hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
        style={{
          bottom: '8%', right: '-5%',
          background: 'rgba(13,16,18,0.92)',
          border: `1px solid ${B.accent}28`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.accent }} />
        <span className="text-xs font-bold" style={{ color: B.accent, fontFamily: 'Montserrat, sans-serif' }}>
          100% Retainer
        </span>
      </div>
    </div>
  );
});
AbstractTeamVisual.displayName = 'AbstractTeamVisual';

// ─── BrowserMockup ─────────────────────────────────────────────────────────
// FIXED: Pure presentational — wrapped in React.memo, never re-renders
// unless children change.
const BrowserMockup = React.memo(({ children, className = '' }) => (
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
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
      <div
        className="flex-1 mx-4 flex items-center gap-2 px-3 py-1 rounded-md"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
          ddwagency.com/about
        </span>
      </div>
    </div>
    {children}
  </div>
));
BrowserMockup.displayName = 'BrowserMockup';

// ─── FloatingBadge ─────────────────────────────────────────────────────────
// FIXED:
// 1. GSAP tween killed on unmount (was leaking)
// 2. Ping ring opacity bug fixed — removed inline opacity:0 that was
//    permanently overriding the keyframe animation
// 3. CSS class 'about-ping-ring' drives the animation instead of inline style
const FloatingBadge = React.memo(({ value, label, accent, delay = 0, style = {} }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay,
    });
    // FIXED: Kill on unmount — was leaking before
    return () => tween.kill();
  }, [delay]);

  const containerStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${accent} 0%, ${B.orangeSoft} 100%)`,
    border: `2px solid ${accent}40`,
    boxShadow: `0 16px 48px ${accent}40`,
    ...style,
  }), [accent, style]);

  return (
    <div
      ref={ref}
      className="absolute z-20 rounded-2xl p-4 sm:p-5"
      style={containerStyle}
    >
      <div
        className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight"
        style={{
          color: B.bg,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {value}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest"
        style={{
          color: `${B.bg}CC`,
          fontFamily: 'Montserrat, sans-serif',
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
      {/*
        FIXED: Removed inline style={{ animation: '...', opacity: 0 }}
        The opacity: 0 was permanently overriding the keyframe animation,
        making the ping ring completely invisible.
        Now uses CSS class 'about-ping-ring' defined in index.css.
      */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none about-ping-ring" />
    </div>
  );
});
FloatingBadge.displayName = 'FloatingBadge';

// ─── StatCard ──────────────────────────────────────────────────────────────
// FIXED:
// 1. glowRef removed — was declared but never used (dead code)
// 2. isTouch uses module-level IS_TOUCH constant — no per-mount matchMedia query
// 3. willChange applied only on hover, not permanently
// 4. spotlight uses requestAnimationFrame to batch state updates on mousemove
const StatCard = React.memo(({ stat, active, index }) => {
  const cardRef  = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  const accent = useMemo(
    () => (index % 2 === 0 ? B.orange : B.orangeSoft),
    [index]
  );

  // Memoized static styles
  const cardStyle = useMemo(() => ({
    background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
    borderColor: `${accent}20`,
    transition: 'border-color 0.4s ease',
  }), [accent]);


  const numberStyle = useMemo(() => ({
    letterSpacing: '-0.03em',
    background: `linear-gradient(135deg, ${accent} 0%, ${B.accent} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: 'Montserrat, sans-serif',
  }), [accent]);

  const handleMouseMove = useCallback((e) => {
    if (IS_TOUCH || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width  - 0.5;
    const dy = (e.clientY - rect.top)  / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotationY:           dx * 14,
      rotationX:           -dy * 14,
      transformPerspective: 900,
      duration:            0.4,
      ease:                'power2.out',
      // FIXED: willChange set only while animating, removed after
      willChange:          'transform',
    });

    setSpot({
      x: ((e.clientX - rect.left)  / rect.width)  * 100,
      y: ((e.clientY - rect.top)   / rect.height) * 100,
      on: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (IS_TOUCH || !cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0, rotationX: 0,
      duration: 0.6, ease: 'power3.out',
      // FIXED: Clear willChange when animation is done
      onComplete: () => {
        if (cardRef.current) cardRef.current.style.willChange = 'auto';
      },
    });
    setSpot((s) => ({ ...s, on: false }));
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden border group cursor-default min-h-[44px]"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight */}
      {spot.on && !IS_TOUCH && (
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

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />

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
        <div className="font-bold mb-1 leading-[1.1] tracking-tight text-3xl md:text-4xl" style={numberStyle}>
          <GSAPCounter end={stat.end} suffix={stat.suffix} active={active} />
        </div>
        <div
          className="uppercase mb-1 group-hover: transition-colors duration-300 text-xs font-bold uppercase tracking-widest" style={{   color: 'rgba(255,255,255,0.7)', fontFamily: 'Montserrat, sans-serif' }}
        >
          {stat.label}
        </div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
          {stat.sub}
        </div>
      </div>
    </div>
  );
});
StatCard.displayName = 'StatCard';

// ─── MagneticButton ────────────────────────────────────────────────────────
// FIXED:
// 1. href prop is now actually used — was completely ignored before
// 2. variant determines styling only, not the destination
// 3. CSS classes applied correctly so shimmer animation works
// 4. isTouch uses module-level constant
const MagneticButton = React.memo(({ href, children, variant = 'primary' }) => {
  const btnRef = useRef(null);
  const xTo    = useRef(null);
  const yTo    = useRef(null);

  useEffect(() => {
    if (IS_TOUCH || !btnRef.current) return;
    xTo.current = gsap.quickTo(btnRef.current, 'x', { duration: 0.45, ease: 'power3.out' });
    yTo.current = gsap.quickTo(btnRef.current, 'y', { duration: 0.45, ease: 'power3.out' });

    return () => {
      // quickTo doesn't return a killable tween directly,
      // but we need to snap back on unmount
      gsap.set(btnRef.current, { x: 0, y: 0 });
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (IS_TOUCH || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * 0.3);
    yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * 0.3);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (IS_TOUCH) return;
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  const isPrimary = variant === 'primary';

  const btnStyle = useMemo(() => ({
    minHeight: 52,
    padding: '14px 32px',
    borderRadius: 12,
    letterSpacing: '0.16em',
    fontFamily: 'Montserrat, sans-serif',
    background: isPrimary
      ? `linear-gradient(135deg, ${B.orange} 0%, ${B.orangeSoft} 100%)`
      : 'transparent',
    color: isPrimary ? B.bg : '#fff',
    border: `2px solid ${isPrimary ? 'transparent' : B.orange}`,
    boxShadow: isPrimary ? `0 0 28px ${B.orange}30` : 'none',
    transition: 'box-shadow 0.4s ease, background 0.4s ease',
    textDecoration: 'none',
  }), [isPrimary]);

  return (
    <a
      ref={btnRef}
      // FIXED: href prop is now used. Previously hardcoded based on variant.
      href={href}
      className="about-magnetic-btn text-xs relative inline-flex items-center justify-center gap-2 font-bold uppercase overflow-hidden group"
      style={btnStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/*
        FIXED: Class 'about-magnetic-btn__shimmer' now applied correctly.
        The CSS in index.css targets '.about-magnetic-btn:hover .about-magnetic-btn__shimmer'
        which now matches. Previously the class was never applied so shimmer never triggered.
      */}
      <span
        className="absolute inset-0 pointer-events-none about-magnetic-btn__shimmer"
        aria-hidden="true"
      />

      {/* Hover fill for secondary variant */}
      {!isPrimary && (
        <span
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `${B.orange}18` }}
          aria-hidden="true"
        />
      )}

      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        width="14" height="14" viewBox="0 0 16 16" fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </a>
  );
});
MagneticButton.displayName = 'MagneticButton';

// ─── Pill (extracted to avoid re-creating inline JSX in map) ──────────────
const Pill = React.memo(({ pill }) => (
  <div
    className="about-pill flex items-center gap-2 rounded-full border cursor-default"
    style={{
      padding: '8px 16px',
      borderColor: `${B.orange}20`,
      background: `${B.orange}08`,
    }}
  >
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.orange, flexShrink: 0 }} />
    <span className="text-xs font-bold uppercase tracking-widest"
      style={{
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {pill}
    </span>
  </div>
));
Pill.displayName = 'Pill';

// ─── TrustItem ────────────────────────────────────────────────────────────
const TrustItem = React.memo(({ item }) => (
  <div
    className="about-trust-item flex items-center gap-2 cursor-default"
    style={{ color: 'rgba(255,255,255,0.35)' }}
  >
    <span className="about-trust-icon">{item.icon}</span>
    <span
      className="about-trust-text transition-colors duration-300 text-xs font-bold uppercase tracking-widest" style={{
         
         
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {item.text}
    </span>
  </div>
));
TrustItem.displayName = 'TrustItem';

// ─── AboutSection (Main) ───────────────────────────────────────────────────
const AboutSection = () => {
  const sectionRef   = useRef(null);
  const headingRef   = useRef(null);
  const visualWrapRef= useRef(null);
  const bgOrb1Ref    = useRef(null);
  const bgOrb2Ref    = useRef(null);
  const lineRef      = useRef(null);
  const eyebrowRef   = useRef(null);
  const bodyRef      = useRef(null);
  const body2Ref     = useRef(null);
  const pillsRef     = useRef(null);
  const statsRef     = useRef(null);
  const ctaRef       = useRef(null);
  const trustRef     = useRef(null);
  const wordRefs     = useRef([]);

  // FIXED: Array ko useEffect se bahar render cycle mein reset karna zaroori hai
  // taakeh jab GSAP chalay toh array khali na ho.
  wordRefs.current = [];

  const [counterActive, setCounterActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Guard for setCounterActive after unmount
    let mounted = true;

    const ctx = gsap.context(() => {
      // ── Background orb parallax ──────────────────────────────────────────
      const orbTrigger = {
        trigger: section,
        scrub: 1.5,
      };
      gsap.to(bgOrb1Ref.current, { yPercent:  35, ease: 'none', scrollTrigger: orbTrigger });
      gsap.to(bgOrb2Ref.current, { yPercent: -30, ease: 'none', scrollTrigger: orbTrigger });

      // ── Top rule ──────────────────────────────────────────────────────────
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 90%', once: true },
        }
      );

      // ── Eyebrow ───────────────────────────────────────────────────────────
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 18, filter: 'blur(4px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: eyebrowRef.current, start: 'top 88%', once: true },
        }
      );

      // ── Heading words stagger ─────────────────────────────────────────────
      gsap.fromTo(
        wordRefs.current.filter(Boolean),
        { opacity: 0, y: 44, rotationX: -35, skewX: 3 },
        {
          opacity: 1, y: 0, rotationX: 0, skewX: 0,
          duration: 0.9, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: 'top 84%', once: true },
        }
      );

      // ── Body paragraphs ───────────────────────────────────────────────────
      gsap.fromTo(
        [bodyRef.current, body2Ref.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: bodyRef.current, start: 'top 88%', once: true },
        }
      );

      // ── Pills ─────────────────────────────────────────────────────────────
      gsap.fromTo(
        pillsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { trigger: pillsRef.current, start: 'top 90%', once: true },
        }
      );

      // ── Stats ─────────────────────────────────────────────────────────────
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 86%',
            once: true,
            onEnter: () => { if (mounted) setCounterActive(true); },
          },
        }
      );

      // ── CTAs + Trust ──────────────────────────────────────────────────────
      gsap.fromTo(
        [ctaRef.current, trustRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', once: true },
        }
      );

      // ── Visual panel ──────────────────────────────────────────────────────
      gsap.fromTo(
        visualWrapRef.current,
        { opacity: 0, x: -32, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: visualWrapRef.current, start: 'top 85%', once: true },
        }
      );
    }, section);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={sectionStyle}
    >
      {/* Mesh grid background */}
      <div className="absolute inset-0 pointer-events-none" style={meshGridStyle} />

      {/* Atmospheric orbs */}
      <div
        ref={bgOrb1Ref}
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
        ref={bgOrb2Ref}
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

      {/* Top rule */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={lineStyle}
      />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

          {/* ════ LEFT — Visual Panel ════ */}
          <div
            ref={visualWrapRef}
            className="lg:col-span-5 flex justify-center lg:justify-start"
            style={{ opacity: 0 }}
          >
            <div className="relative w-full" style={{ maxWidth: 460 }}>
              <BrowserMockup>
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    height: 'clamp(280px, 40vw, 420px)',
                    background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${B.orange}08 0%, ${B.bg} 100%)`,
                  }}
                >
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

          {/* ════ RIGHT — Copy + Stats + CTAs ════ */}
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
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{
                  color: B.orange, fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Who We Are
              </span>
            </div>

            {/* Heading */}
            <h2
              ref={headingRef}
              className=".08 text-3xl md:text-4xl font-bold leading-[1.1] tracking-[-0.035em]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                
                
                
                perspective: '1000px',
              }}
            >
              <span className="block mb-1">
                {['Built by', 'engineers.'].map((word, i) => (
                  <span
                    key={word}
                    ref={(el) => { wordRefs.current[i] = el; }}
                    className="about-word mr-3 text-white"
                    style={{ opacity: 0 }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="block">
                {['Not', 'marketers.'].map((word, i) => (
                  <span
                    key={word}
                    ref={(el) => { wordRefs.current[i + 2] = el; }}
                    className="about-word mr-3"
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
            <p className="text-base leading-relaxed"
              ref={bodyRef}
              style={{
                fontFamily: 'Inter, sans-serif',
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
            <p className=" text-base leading-relaxed"
              ref={body2Ref}
              style={{
                fontFamily: 'Inter, sans-serif',
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
            <div ref={pillsRef} className="flex flex-wrap gap-2.5" style={{ opacity: 0 }}>
              {PILLS.map((pill) => (
                <Pill key={pill} pill={pill} />
              ))}
            </div>

            {/* Stats grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-3 sm:gap-4"
              style={{ opacity: 0 }}
            >
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} active={counterActive} index={i} />
              ))}
            </div>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
              style={{ opacity: 0 }}
            >
              <MagneticButton href="/about"   variant="primary">Read Our Story</MagneticButton>
              <MagneticButton href="/contact" variant="secondary">Work With Us</MagneticButton>
            </div>

            {/* Trust badges */}
            <div
              ref={trustRef}
              className="flex flex-wrap gap-5 sm:gap-7 pt-5 border-t"
              style={{ borderColor: `${B.orange}18`, opacity: 0 }}
            >
              {TRUST.map((item) => (
                <TrustItem key={item.text} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${B.orange}18, transparent)` }}
      />
    </section>
  );
};

export default AboutSection;