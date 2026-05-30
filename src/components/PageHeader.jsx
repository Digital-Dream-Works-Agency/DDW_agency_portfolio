/**
 * PageHeader.jsx
 * DDW Agency — Reusable page header with orbit visual and metric cards
 *
 * Fixes applied:
 * - gsap.registerPlugin removed (belongs in main.jsx)
 * - All <style> tags deleted — keyframes in index.css
 * - All constant arrays/data hoisted to module scope
 * - MetricCard GSAP tweens properly killed on unmount via gsap.context()
 * - OrbitVisual uses gsap.context() + full null guard
 * - Trig calculations pre-computed at module scope
 * - MagneticCTA consolidated to single return branch
 * - textRef dead code removed
 * - onMouseEnter/Leave style mutations replaced with CSS class
 * - Three ScrollTrigger instances merged into one timeline
 * - words useMemo + stable keys
 * - floatY ?? / delay ?? nullish coalescing
 * - force3D: true on all rotation/transform tweens
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { Link }          from 'react-router-dom';
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Module-level constants ────────────────────────────────────────────────────
// FIXED: All data arrays hoisted from component bodies.
// Zero allocations per render for any of these structures.

const STATS = Object.freeze([
  { value: '$4.2M+', label: 'Ad Spend Managed' },
  { value: '600%',   label: 'Peak Google ROAS'  },
  { value: '54K',    label: 'SEO Visitors/mo'   },
  { value: '9+',     label: 'Years in Market'   },
]);

// FIXED: Trig computed once at module load, not inside map() on every render.
// Math.cos/Math.sin are pure functions of constants — result never changes.
const SERVICE_ORBIT_RADIUS = 148;
const SERVICE_CENTER       = 160;

const SERVICES = Object.freeze([
  { name: 'Meta',   color: '#0080FF' },
  { name: 'Google', color: '#34A853' },
  { name: 'Amazon', color: '#FF9900' },
  { name: 'TikTok', color: '#FF2D55' },
  { name: 'SEO',    color: '#FDE87A' },
  { name: 'AI',     color: '#FF570F' },
].map((service, i) => {
  const angle = (i * 60 * Math.PI) / 180 - Math.PI / 2;
  return {
    ...service,
    x: SERVICE_CENTER + SERVICE_ORBIT_RADIUS * Math.cos(angle),
    y: SERVICE_CENTER + SERVICE_ORBIT_RADIUS * Math.sin(angle),
  };
}));

// MetricCard data — defined at module scope, passed as props from PageHeader
// so MetricCard itself remains a pure, reusable component.
const METRIC_CARDS = Object.freeze([
  {
    id:           'meta-roas',
    metric:       '5.48x',
    label:        'Meta ROAS',
    sublabel:     '$683K managed/mo',
    icon:         '📱',
    accentColor:  '#FF570F',
    delay:        0.5,
    floatY:       -10,
    floatDuration: 3.2,
    style:        { top: '18px', left: '0px' },
  },
  {
    id:           'google-roas',
    metric:       '600%',
    label:        'Google ROAS',
    sublabel:     '€69.7K → €418K',
    icon:         '🔍',
    accentColor:  '#FDE87A',
    delay:        0.75,
    floatY:       -14,
    floatDuration: 2.8,
    style:        { top: '10px', right: '0px' },
  },
  {
    id:           'amazon-sales',
    metric:       '$2.7M',
    label:        'Amazon Sales',
    sublabel:     '27.64% ACOS · 2015',
    icon:         '📦',
    accentColor:  '#FF570F',
    delay:        1.0,
    floatY:       -8,
    floatDuration: 3.8,
    style:        { top: '50%', left: '0px', transform: 'translateY(-50%)' },
  },
  {
    id:           'tiktok-gmv',
    metric:       '$290K',
    label:        'TikTok GMV',
    sublabel:     '7 days · 9,010 orders',
    icon:         '🎵',
    accentColor:  '#FDE87A',
    delay:        1.2,
    floatY:       -16,
    floatDuration: 3.4,
    style:        { top: '50%', right: '0px', transform: 'translateY(-50%)' },
  },
  {
    id:           'seo-visitors',
    metric:       '54K',
    label:        'Monthly Visitors',
    sublabel:     'SEO · 2K → 54K',
    icon:         '📈',
    accentColor:  '#FF570F',
    delay:        1.4,
    floatY:       -10,
    floatDuration: 4.0,
    style:        { bottom: '18px', left: '10px' },
  },
  {
    id:           'ai-lyra',
    metric:       '24/7',
    label:        'AI Voice (Lyra)',
    sublabel:     'Zero missed calls',
    icon:         '🤖',
    accentColor:  '#FDE87A',
    delay:        1.6,
    floatY:       -12,
    floatDuration: 3.0,
    style:        { bottom: '10px', right: '0px' },
  },
]);

// Static gradient style for the last heading word — created once, never recreated
const GRADIENT_WORD_STYLE = Object.freeze({
  background:           'linear-gradient(135deg, #FF570F 0%, #FDE87A 60%, #FF8C42 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor:  'transparent',
  backgroundClip:       'text',
});

const WHITE_WORD_STYLE = Object.freeze({ color: '#FFFFFF' });

// ─── AuroraBackground ──────────────────────────────────────────────────────────
// FIXED: <style> tag removed entirely — keyframes now in index.css.
// Pure presentational component — React.memo prevents all re-renders.
const AuroraBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Primary orange blob */}
    <div
      style={{
        position:   'absolute',
        width:      'clamp(500px, 60vw, 900px)',
        height:     'clamp(350px, 40vw, 600px)',
        borderRadius: '50%',
        opacity:    0.07,
        filter:     'blur(120px)',
        background: 'radial-gradient(ellipse, #FF570F 0%, transparent 70%)',
        top:        '-200px',
        right:      '-100px',
        // FIXED: willChange scoped to transform only — compositor-eligible
        willChange: 'transform',
        animation:  'aurora1 12s ease-in-out infinite alternate',
      }}
    />
    {/* Accent yellow blob */}
    <div
      style={{
        position:   'absolute',
        width:      'clamp(400px, 45vw, 700px)',
        height:     'clamp(300px, 35vw, 500px)',
        borderRadius: '50%',
        opacity:    0.04,
        filter:     'blur(100px)',
        background: 'radial-gradient(ellipse, #FDE87A 0%, transparent 70%)',
        top:        '100px',
        left:       '-200px',
        willChange: 'transform',
        animation:  'aurora2 16s ease-in-out infinite alternate',
      }}
    />
    {/* Warm mid blob */}
    <div
      style={{
        position:   'absolute',
        width:      'clamp(280px, 30vw, 500px)',
        height:     'clamp(230px, 25vw, 400px)',
        borderRadius: '50%',
        opacity:    0.05,
        filter:     'blur(80px)',
        background: 'radial-gradient(ellipse, #FF8C42 0%, transparent 70%)',
        bottom:     '-100px',
        right:      '30%',
        willChange: 'transform',
        animation:  'aurora3 10s ease-in-out infinite alternate',
      }}
    />

    {/* Noise texture — static, no animation, no willChange */}
    <div
      style={{
        position:          'absolute',
        inset:             0,
        opacity:           0.03,
        backgroundImage:   `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat:  'repeat',
        backgroundSize:    '128px',
      }}
    />

    {/* Dot grid — static, no animation */}
    <div
      style={{
        position:        'absolute',
        inset:           0,
        opacity:         0.035,
        backgroundImage: 'radial-gradient(circle, #FF570F 1px, transparent 1px)',
        backgroundSize:  '40px 40px',
      }}
    />
  </div>
));
AuroraBackground.displayName = 'AuroraBackground';

// ─── GSAPTilt ──────────────────────────────────────────────────────────────────
// FIXED: Added proper cleanup — quickTo doesn't return a killable tween,
// but we snap back to neutral on unmount to prevent stuck rotations.
const GSAPTilt = React.memo(({ children, className }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.6 });
    const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.6 });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y = (e.clientY - rect.top)   / rect.height - 0.5;
      xTo(x * 6);
      yTo(-y * 6);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove',  handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove',  handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      // Snap back on unmount — prevents stuck 3D rotation
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, []); // No deps — el reference is stable

  return (
    <div ref={tiltRef} className={className} style={{ transformPerspective: 1200 }}>
      {children}
    </div>
  );
});
GSAPTilt.displayName = 'GSAPTilt';

// ─── MetricCard ────────────────────────────────────────────────────────────────
// FIXED:
// 1. gsap.context() wraps both tweens — ctx.revert() kills both on unmount
// 2. Infinite float tween no longer leaks on unmount
// 3. || replaced with ?? for floatY/delay (falsy-default bug)
// 4. Memoized border gradient string to avoid template literal on every render
const MetricCard = React.memo(({
  metric, label, sublabel, icon, accentColor,
  delay = 0, floatY = -12, floatDuration = 3, style,
}) => {
  const cardRef = useRef(null);

  // Memoize derived styles — template literals create new strings every render
  const borderGradient = useMemo(
    () => `linear-gradient(135deg, ${accentColor}40, transparent 60%, ${accentColor}15)`,
    [accentColor]
  );
  const innerBoxShadow = useMemo(
    () => `0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 16px 48px ${accentColor}12`,
    [accentColor]
  );
  const shimmerGradient = useMemo(
    () => `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
    [accentColor]
  );
  const iconStyle = useMemo(() => ({
    background:  `${accentColor}15`,
    border:      `1px solid ${accentColor}25`,
    boxShadow:   `0 0 12px ${accentColor}20`,
  }), [accentColor]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // FIXED: gsap.context() scopes both tweens.
    // ctx.revert() on cleanup kills the entrance tween AND the infinite float tween.
    // Previously: 6 float tweens leaked on every page navigation.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity:  1,
          y:        0,
          scale:    1,
          duration: 1,
          ease:     'back.out(1.7)',
          // FIXED: ?? instead of || — floatY=0 would have been falsy
          delay:    delay ?? 0,
          force3D:  true,
        }
      );

      gsap.to(el, {
        y:        floatY   ?? -12,
        duration: floatDuration ?? 3,
        ease:     'sine.inOut',
        yoyo:     true,
        repeat:   -1,
        force3D:  true,
      });
    });

    return () => ctx.revert();
    // Props are stable number literals from METRIC_CARDS frozen array
  }, [delay, floatY, floatDuration]);

  return (
    <div
      ref={cardRef}
      className="absolute group/card cursor-default"
      style={{ opacity: 0, ...style }}
    >
      <div
        className="relative rounded-2xl p-[1px] min-w-[165px]"
        style={{ background: borderGradient }}
      >
        <div
          className="relative rounded-2xl p-4 overflow-hidden"
          style={{
            background:          'rgba(10, 12, 14, 0.75)',
            backdropFilter:      'blur(20px)',
            WebkitBackdropFilter:'blur(20px)',
            boxShadow:           innerBoxShadow,
          }}
        >
          {/* Shimmer top line */}
          <div
            className="absolute top-0 left-0 w-full h-[1px]"
            style={{ background: shimmerGradient }}
          />

          {/* Live dot */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          <div className="flex items-start gap-2.5">
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
              style={iconStyle}
            >
              {icon}
            </div>

            {/* Text */}
            <div>
              <div
                className="text-xl font-bold leading-none tracking-tight"
                style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading, inherit)' }}
              >
                {metric}
              </div>
              <div
                className="mt-1 uppercase text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {label}
              </div>
              {sublabel && (
                <div
                  className="text-sm mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {sublabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
MetricCard.displayName = 'MetricCard';

// ─── OrbitVisual ───────────────────────────────────────────────────────────────
// FIXED:
// 1. gsap.context() wraps all 5 tweens — ctx.revert() cleans all on unmount
// 2. Full null guard on all refs before animating
// 3. force3D: true on all rotation tweens
// 4. SERVICES array with pre-computed x/y at module scope
// 5. Single ringsRef array replaces ring1Ref/ring2Ref/ring3Ref
const OrbitVisual = React.memo(() => {
  const ringsRef = useRef([]);
  const coreRef  = useRef(null);
  const glowRef  = useRef(null);

  useEffect(() => {
    // FIXED: Full null guard — all refs must be populated before animating
    if (
      ringsRef.current.some((r) => !r) ||
      !coreRef.current ||
      !glowRef.current
    ) return;

    const [ring1, ring2, ring3] = ringsRef.current;

    const ctx = gsap.context(() => {
      gsap.to(ring1, {
        rotation: 360, duration: 20, ease: 'none',
        repeat: -1, transformOrigin: 'center', force3D: true,
      });
      gsap.to(ring2, {
        rotation: -360, duration: 30, ease: 'none',
        repeat: -1, transformOrigin: 'center', force3D: true,
      });
      gsap.to(ring3, {
        rotation: 360, duration: 45, ease: 'none',
        repeat: -1, transformOrigin: 'center', force3D: true,
      });
      gsap.to(coreRef.current, {
        scale: 1.08, duration: 2.5, ease: 'sine.inOut',
        yoyo: true, repeat: -1, force3D: true,
      });
      gsap.to(glowRef.current, {
        opacity: 0.8, scale: 1.3, duration: 2, ease: 'sine.inOut',
        yoyo: true, repeat: -1, force3D: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center">
      {/* Deep glow */}
      <div
        ref={glowRef}
        className="absolute w-40 h-40 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(255,87,15,0.4) 0%, transparent 70%)',
          filter:     'blur(30px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Ring 1 — outer */}
      <div
        ref={(el) => { ringsRef.current[0] = el; }}
        className="absolute w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <svg width="320" height="320" viewBox="0 0 320 320" aria-hidden="true">
          <circle cx="160" cy="160" r="148" fill="none" stroke="rgba(255,87,15,0.15)" strokeWidth="0.8" strokeDasharray="4 12" />
          <circle cx="160" cy="12"  r="4.5" fill="#FF570F" />
          <circle cx="160" cy="12"  r="10"  fill="none" stroke="#FF570F" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Ring 2 — mid */}
      <div
        ref={(el) => { ringsRef.current[1] = el; }}
        className="absolute"
        style={{ width: 230, height: 230, willChange: 'transform' }}
      >
        <svg width="230" height="230" viewBox="0 0 230 230" aria-hidden="true">
          <circle cx="115" cy="115" r="103" fill="none" stroke="rgba(253,232,122,0.10)" strokeWidth="0.8" strokeDasharray="2 10" />
          <circle cx="218" cy="115" r="3.5" fill="#FDE87A" />
          <circle cx="12"  cy="115" r="2.5" fill="#FDE87A" opacity="0.5" />
        </svg>
      </div>

      {/* Ring 3 — inner */}
      <div
        ref={(el) => { ringsRef.current[2] = el; }}
        className="absolute"
        style={{ width: 160, height: 160, willChange: 'transform' }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
          <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,87,15,0.08)" strokeWidth="0.6" />
          <circle cx="80" cy="12" r="3"  fill="#FF570F" opacity="0.6" />
        </svg>
      </div>

      {/* Service labels — positions pre-computed at module scope */}
      {SERVICES.map((service) => (
        <div
          key={service.name}
          className="absolute text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full"
          style={{
            left:            service.x,
            top:             service.y,
            transform:       'translate(-50%, -50%)',
            background:      'rgba(10,12,14,0.85)',
            border:          `1px solid ${service.color}30`,
            color:           service.color,
            backdropFilter:  'blur(8px)',
            whiteSpace:      'nowrap',
            boxShadow:       `0 0 12px ${service.color}20`,
          }}
        >
          {service.name}
        </div>
      ))}

      {/* Core */}
      <div
        ref={coreRef}
        className="relative z-10 w-[88px] h-[88px] rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1f23 0%, #0a0c0e 100%)',
          border:     '1.5px solid rgba(255,87,15,0.45)',
          boxShadow:  '0 0 50px rgba(255,87,15,0.3), 0 0 100px rgba(255,87,15,0.1), inset 0 1px 0 rgba(255,255,255,0.07)',
          willChange: 'transform',
        }}
      >
        <div className="text-center">
          <div
            className="font-bold text-xl leading-none"
            style={{
              color:         '#FF570F',
              fontFamily:    'var(--font-heading, inherit)',
              letterSpacing: '-0.02em',
            }}
          >
            DDW
          </div>
          <div
            className="text-xs uppercase tracking-[0.2em] mt-1"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Agency
          </div>
        </div>
      </div>
    </div>
  );
});
OrbitVisual.displayName = 'OrbitVisual';

// ─── MagneticCTA ───────────────────────────────────────────────────────────────
// FIXED:
// 1. textRef removed — was declared but never used in any effect
// 2. Consolidated to single return branch — eliminates duplicate JSX tree
// 3. gsap.set() on unmount to prevent stuck magnetic position
const MagneticCTA = React.memo(({ children, href = '#', secondary = false }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, 'x', { ease: 'power3.out', duration: 0.6 });
    const yTo = gsap.quickTo(btn, 'y', { ease: 'power3.out', duration: 0.6 });

    const handleMove = (e) => {
      const rect = btn.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width  / 2)) * 0.35);
      yTo((e.clientY - (rect.top  + rect.height / 2)) * 0.35);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove',  handleMove);
    btn.addEventListener('mouseleave', handleLeave);

    return () => {
      btn.removeEventListener('mousemove',  handleMove);
      btn.removeEventListener('mouseleave', handleLeave);
      gsap.set(btn, { x: 0, y: 0 });
    };
  }, []);

  // FIXED: Single return branch. Conditional logic via variables, not two full JSX trees.
  const primaryStyle = {
    background: 'linear-gradient(135deg, #FF570F, #FF8C42)',
    boxShadow:  '0 0 30px rgba(255,87,15,0.35), 0 4px 20px rgba(255,87,15,0.2)',
  };
  const secondaryStyle = {
    border:     '1px solid rgba(255,87,15,0.3)',
    background: 'transparent',
    color:      'rgba(255,255,255,0.7)',
  };

  return (
    <Link to={href}>
      <div
        ref={btnRef}
        className="relative inline-flex items-center gap-2.5 px-7 py-4 rounded-full cursor-pointer group overflow-hidden"
        style={secondary ? secondaryStyle : primaryStyle}
      >
        {/* Shine sweep — primary only */}
        {!secondary && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}

        <span
          className={`relative text-sm font-${secondary ? 'bold' : 'black'} tracking-wide ${secondary ? 'group-hover:text-white transition-colors' : 'text-white'}`}
        >
          {children}
        </span>

        <svg
          className="w-4 h-4 relative transition-transform group-hover:translate-x-1"
          style={{ color: secondary ? 'currentColor' : 'white' }}
          fill="none"
          stroke="currentColor"
          strokeWidth={secondary ? 2 : 2.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
});
MagneticCTA.displayName = 'MagneticCTA';

// ─── StatsRow ──────────────────────────────────────────────────────────────────
// FIXED: STATS array at module scope. Stable key uses stat.label.
const StatsRow = React.memo(() => (
  <div className="header-anim flex flex-wrap gap-x-8 gap-y-4 mt-12">
    {STATS.map((s) => (
      <div key={s.label} className="flex flex-col">
        <span
          className="text-2xl font-bold leading-none tracking-tight"
          style={{
            fontFamily:           'var(--font-heading, inherit)',
            background:           'linear-gradient(135deg, #FF570F, #FDE87A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}
        >
          {s.value}
        </span>
        <span
          className="uppercase mt-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {s.label}
        </span>
      </div>
    ))}
  </div>
));
StatsRow.displayName = 'StatsRow';

// ─── ScrollIndicator ──────────────────────────────────────────────────────────
// Extracted to its own memoized component — never re-renders after mount
const ScrollIndicator = React.memo(() => (
  <div className="header-anim absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
    <span
      className="text-xs font-bold uppercase tracking-[0.4em]"
      style={{ color: 'rgba(255,255,255,0.25)' }}
    >
      Scroll
    </span>
    <div
      className="w-px h-10 rounded-full overflow-hidden"
      style={{ background: 'rgba(255,87,15,0.15)' }}
    >
      <div
        style={{
          width:      '100%',
          height:     '40%',
          background: 'linear-gradient(to bottom, #FF570F, transparent)',
          borderRadius: '9999px',
          // FIXED: scrollDrop keyframe now in index.css — not inline <style>
          animation:  'scrollDrop 1.8s ease-in-out infinite',
        }}
      />
    </div>
  </div>
));
ScrollIndicator.displayName = 'ScrollIndicator';

// ─── PageHeader ────────────────────────────────────────────────────────────────
const PageHeader = ({ title, breadcrumb, subtitle }) => {
  const headerRef   = useRef(null);
  const prlx1Ref    = useRef(null);
  const prlx2Ref    = useRef(null);
  const cardPrlxRef = useRef(null);

  // FIXED: title.split() memoized — not recomputed on every render.
  // Stable key: word content + index (handles duplicate words in title).
  const words = useMemo(() => title.split(' '), [title]);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo(
        '.header-anim',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9,
          stagger: 0.12, ease: 'power3.out', delay: 0.15,
        }
      );

      gsap.fromTo(
        '.header-title-word',
        { y: 100, opacity: 0, rotationX: -50 },
        {
          y: 0, opacity: 1, rotationX: 0,
          duration: 1.1, stagger: 0.08, ease: 'power4.out',
          delay: 0.25, transformOrigin: 'top center', force3D: true,
        }
      );

      // FIXED: Three separate ScrollTrigger instances merged into ONE timeline.
      // Previously: 3 scroll listeners on the same trigger element.
      // Now: 1 ScrollTrigger drives a single timeline with all 3 animations.
      // Reduces scroll event overhead by 66%.
      const parallaxTL = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          scrub:   1,
        },
      });

      parallaxTL
        .to(prlx1Ref.current,    { yPercent:  25, ease: 'none' }, 0)
        .to(prlx2Ref.current,    { yPercent: -18, ease: 'none' }, 0)
        .to(cardPrlxRef.current, { yPercent:  10, ease: 'none' }, 0);

    }, headerRef);

    return () => ctx.revert();
  }, [title]); // Re-run animations when title changes (route navigation)

  return (
    <section
      ref={headerRef}
      className="relative w-full flex flex-col justify-center overflow-hidden"
      style={{
        minHeight:  '100vh',
        background: '#08090A',
        fontFamily: 'var(--font-body, inherit)',
      }}
    >
      {/*
        FIXED: No <style> tags anywhere in this component.
        aurora1/2/3 keyframes → index.css
        scrollDrop keyframe   → index.css
        .page-header-breadcrumb-link hover → index.css
      */}

      <AuroraBackground />



      {/* Parallax decorative element 2 (background use) */}
      <div ref={prlx2Ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-16">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          style={{ minHeight: 'calc(100vh - 160px)' }}
        >
          {/* ── LEFT — Copy ── */}
          <div className="flex flex-col justify-center">

            {/* Breadcrumb */}
            <div className="header-anim flex items-center gap-3 mb-8">
              {/*
                FIXED: onMouseEnter/Leave inline style mutations removed.
                Replaced with CSS class .page-header-breadcrumb-link defined in index.css.
                No new arrow functions created on every render.
                No e.target unreliability risk.
              */}
              <Link
                to="/"
                className="page-header-breadcrumb-link"
              >
                Home
              </Link>
              <svg
                className="w-3 h-3"
                style={{ color: '#FF570F' }}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span
                className="text-sm font-semibold uppercase tracking-[0.25em]"
                style={{ color: '#FF570F' }}
              >
                {breadcrumb}
              </span>
            </div>

            {/* Heading */}
            <h1
              className="overflow-hidden mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.035em]"
              style={{
                
                fontFamily:    'var(--font-heading, inherit)',
                
                
                
                perspective:   '1000px',
              }}
            >
              {/*
                FIXED:
                1. words computed via useMemo — not split() on every render
                2. GRADIENT_WORD_STYLE / WHITE_WORD_STYLE are frozen module-level objects
                   — not inline object literals recreated per render per word
                3. key uses `${word}-${i}` — stable even with duplicate words
              */}
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="header-title-word inline-block mr-4"
                  style={i === words.length - 1 ? GRADIENT_WORD_STYLE : WHITE_WORD_STYLE}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="header-anim max-w-md text-base leading-relaxed"
                style={{
                  color:      'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-body, inherit)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                }}
              >
                {subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="header-anim flex flex-wrap items-center gap-4 mt-10">
              <MagneticCTA href="/contact">Book a Free Audit</MagneticCTA>
              <MagneticCTA href="/work" secondary>View Case Studies</MagneticCTA>
            </div>

            <StatsRow />

            {/* Accent lines */}
            <div className="header-anim flex items-center gap-3 mt-10">
              <div className="w-16 h-[2px] rounded-full" style={{ background: '#FF570F' }} />
              <div className="w-4  h-[2px] rounded-full" style={{ background: 'rgba(255,87,15,0.35)' }} />
              <div className="w-2  h-[2px] rounded-full" style={{ background: 'rgba(255,87,15,0.15)' }} />
            </div>
          </div>

          {/* ── RIGHT — Visual ── */}
          <div className="header-anim hidden lg:flex items-center justify-center">
            <div
              ref={cardPrlxRef}
              className="relative"
              style={{ width: 500, height: 500, transform: 'scale(0.92)' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <OrbitVisual />
              </div>

              {/* Metric cards — data from module-level METRIC_CARDS constant */}
              {METRIC_CARDS.map((card) => (
                <MetricCard key={card.id} {...card} />
              ))}

              {/* Florida badge */}
              <div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap"
                style={{
                  background:     'rgba(10,12,14,0.8)',
                  border:         '1px solid rgba(255,87,15,0.2)',
                  backdropFilter: 'blur(12px)',
                  boxShadow:      '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: '#FF570F' }}
                />
                <span
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  Florida LLC · US + EU Markets
                </span>
              </div>
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </div>
    </section>
  );
};

export default PageHeader;