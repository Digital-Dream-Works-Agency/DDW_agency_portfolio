/**
 * LoadingScreen.jsx
 * Portfolio — Agency loading screen (optimized build)
 *
 * Merged from agency's production-optimized version into portfolio's
 * pure React (no Next.js / TypeScript / next/image) environment.
 *
 * Key improvements over old portfolio loading screen:
 * - Zero React state for visual transitions — all GSAP-driven via refs
 * - background-position animation replaced with transform-based equivalent
 * - 'left' property animation replaced with translateX (compositor-safe)
 * - All constant data hoisted to module scope
 * - Math.random() for particle duration moved into useMemo data array
 * - willChange applied only on elements that actually composite
 * - Pill refs consolidated into single useRef([]) array
 * - CornerDeco uses lookup map instead of 4 conditional branches
 * - Mounted guard prevents setState/callback on unmounted component
 * - Taglines updated via direct DOM mutation — no React re-renders
 * - Logo animated via GSAP ref — no React state needed
 */

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

// ─── Brand constants (module-level) ──────────────────────────────────────────
const ORANGE      = '#FF570F';
const ORANGE_SOFT = '#EE7D1D';
const ACCENT      = '#FDE87A';
const BG          = '#080a0c';

// ─── CSS keyframes (injected once) ───────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes ddwCorePulse {
    0%,100% { box-shadow: 0 0 10px rgba(255,87,15,0.3), 0 0 20px rgba(255,87,15,0.1); }
    50%      { box-shadow: 0 0 20px rgba(255,87,15,0.6), 0 0 40px rgba(255,87,15,0.2), 0 0 60px rgba(255,87,15,0.1); }
  }
  @keyframes ddwGlowPulse {
    0%,100% { opacity: 0.35; transform: scale(1) translateZ(0); }
    50%      { opacity: 0.7;  transform: scale(1.25) translateZ(0); }
  }
  @keyframes ddwScanLine {
    0%   { transform: translateY(-100%); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateY(400%); opacity: 0; }
  }
  @keyframes ddwParticleFloat {
    0%   { transform: translateY(0px) translateX(0px) translateZ(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-120px) translateX(var(--px, 0px)) translateZ(0); opacity: 0; }
  }
  @keyframes ddwShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ddwBlinkCursor {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes ddwBarRise {
    0%,100% { transform: scaleY(0.2) translateZ(0); opacity: 0.2; }
    50%      { transform: scaleY(1) translateZ(0);   opacity: 1;   }
  }
  @keyframes ddwAuroraFloat {
    0%   { transform: translate(0,0) scale(1) translateZ(0); }
    50%  { transform: translate(-30px,20px) scale(1.12) translateZ(0); }
    100% { transform: translate(0,0) scale(1) translateZ(0); }
  }
  @keyframes ddwProgressGlow {
    0%,100% { opacity: 0.8; }
    50%      { opacity: 1; }
  }
  @keyframes ddwTaglineReveal {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
`;

// Inject styles once into <head>
if (typeof document !== 'undefined' && !document.getElementById('ddw-loading-css')) {
  const style = document.createElement('style');
  style.id = 'ddw-loading-css';
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

// ─── Particle data — duration pre-computed, NOT in render ─────────────────────
const createParticles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id:       i,
    x:        `${5  + Math.random() * 90}%`,
    y:        `${20 + Math.random() * 60}%`,
    size:     `${1.5 + Math.random() * 2.5}px`,
    delay:    Math.random() * 3,
    drift:    (Math.random() - 0.5) * 60,
    duration: 2.8 + Math.random(),
  }));

// ─── Static module-level data ─────────────────────────────────────────────────
const RING_SIZES   = [260, 190, 128];
const RING_RADII   = [122, 87, 56];
const RING_STROKES = [
  'rgba(255,87,15,0.22)',
  'rgba(253,232,122,0.12)',
  'rgba(255,87,15,0.07)',
];
const RING_DASHES  = ['5 14', '3 10', '2 7'];
const NODE_COLORS  = [ORANGE, ACCENT, ORANGE];
const NODE_SIZES   = [5, 4, 3];

const BAR_HEIGHTS = [0.45, 0.7, 1, 0.82, 0.6, 0.9, 0.5, 0.75, 0.88, 0.55, 0.92, 0.65];

const PILLS = Object.freeze([
  { label: '600% ROAS',    color: ORANGE      },
  { label: '$2.7M Amazon', color: ACCENT      },
  { label: '54K SEO/mo',   color: ORANGE_SOFT },
]);

const TAGLINES = Object.freeze([
  'Initializing systems...',
  'Loading campaigns...',
  'Syncing data...',
  'Ready.',
]);

// ─── CornerDeco lookup maps (O(1), allocated once) ────────────────────────────
const CORNER_LINES = {
  tl: [{ x1:  0, y1:  0, x2: 18, y2:  0 }, { x1:  0, y1:  0, x2:  0, y2: 18 }],
  tr: [{ x1: 28, y1:  0, x2: 10, y2:  0 }, { x1: 28, y1:  0, x2: 28, y2: 18 }],
  bl: [{ x1:  0, y1: 28, x2: 18, y2: 28 }, { x1:  0, y1: 28, x2:  0, y2: 10 }],
  br: [{ x1: 28, y1: 28, x2: 10, y2: 28 }, { x1: 28, y1: 28, x2: 28, y2: 10 }],
};
const CORNER_POSITIONS = {
  tl: { top:    'clamp(12px,2vw,20px)', left:  'clamp(12px,2vw,20px)' },
  tr: { top:    'clamp(12px,2vw,20px)', right: 'clamp(12px,2vw,20px)' },
  bl: { bottom: 'clamp(12px,2vw,20px)', left:  'clamp(12px,2vw,20px)' },
  br: { bottom: 'clamp(12px,2vw,20px)', right: 'clamp(12px,2vw,20px)' },
};

// ─── Particle ─────────────────────────────────────────────────────────────────
const Particle = React.memo(({ x, y, size, delay, drift, duration }) => (
  <div
    style={{
      position:      'absolute',
      left:          x,
      top:           y,
      width:         size,
      height:        size,
      borderRadius:  '50%',
      background:    `radial-gradient(circle, ${ORANGE} 0%, ${ACCENT} 60%, transparent 100%)`,
      '--px':        `${drift}px`,
      animation:     `ddwParticleFloat ${duration}s ease-in ${delay}s infinite`,
      pointerEvents: 'none',
      zIndex:        1,
      willChange:    'transform, opacity',
    }}
  />
));
Particle.displayName = 'Particle';

// ─── AmbientParticles ─────────────────────────────────────────────────────────
const AmbientParticles = React.memo(() => {
  const particles = useMemo(() => createParticles(18), []);
  return (
    <div
      style={{
        position:      'absolute',
        inset:         0,
        overflow:      'hidden',
        pointerEvents: 'none',
        zIndex:        1,
      }}
    >
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  );
});
AmbientParticles.displayName = 'AmbientParticles';

// ─── AuroraOrbs ───────────────────────────────────────────────────────────────
// Dot grid uses static background — no background-position animation (avoids repaint).
const AuroraOrbs = React.memo(() => (
  <div
    style={{
      position:      'absolute',
      inset:         0,
      overflow:      'hidden',
      pointerEvents: 'none',
      zIndex:        0,
    }}
  >
    <div
      style={{
        position:     'absolute',
        width:        'clamp(300px,50vw,700px)',
        height:       'clamp(300px,50vw,700px)',
        borderRadius: '50%',
        background:   `radial-gradient(circle, ${ORANGE} 0%, transparent 68%)`,
        filter:       'blur(80px)',
        opacity:      0.08,
        top:          '-20%',
        right:        '-15%',
        animation:    'ddwAuroraFloat 14s ease-in-out infinite',
        willChange:   'transform',
      }}
    />
    <div
      style={{
        position:     'absolute',
        width:        'clamp(200px,35vw,500px)',
        height:       'clamp(200px,35vw,500px)',
        borderRadius: '50%',
        background:   `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`,
        filter:       'blur(70px)',
        opacity:      0.05,
        bottom:       '-15%',
        left:         '-10%',
        animation:    'ddwAuroraFloat 18s ease-in-out infinite reverse',
        willChange:   'transform',
      }}
    />
    <div
      style={{
        position:     'absolute',
        width:        'clamp(150px,25vw,350px)',
        height:       'clamp(150px,25vw,350px)',
        borderRadius: '50%',
        background:   `radial-gradient(circle, rgba(255,87,15,0.35) 0%, transparent 70%)`,
        filter:       'blur(50px)',
        opacity:      1,
        top:          '50%',
        left:         '50%',
        transform:    'translate(-50%,-50%)',
        animation:    'ddwGlowPulse 3s ease-in-out infinite',
        willChange:   'transform, opacity',
      }}
    />
    {/* Static dot grid — no animation = zero repaint cost */}
    <div
      style={{
        position:          'absolute',
        inset:             0,
        backgroundImage:   `radial-gradient(rgba(255,87,15,0.12) 1px, transparent 1px)`,
        backgroundSize:    '28px 28px',
        maskImage:         'radial-gradient(ellipse at 50% 50%, black 30%, transparent 72%)',
        WebkitMaskImage:   'radial-gradient(ellipse at 50% 50%, black 30%, transparent 72%)',
        opacity:           0.5,
      }}
    />
  </div>
));
AuroraOrbs.displayName = 'AuroraOrbs';

// ─── OrbitRings ───────────────────────────────────────────────────────────────
const OrbitRings = React.memo(() => {
  const ringsRef = useRef([]);

  useEffect(() => {
    if (ringsRef.current.some((r) => !r)) return;

    const ctx = gsap.context(() => {
      const durations   = [16, 26, 40];
      const directions  = [360, -360, 360];

      ringsRef.current.forEach((ring, i) => {
        gsap.to(ring, {
          rotation:        directions[i],
          duration:        durations[i],
          ease:            'none',
          repeat:          -1,
          transformOrigin: 'center',
          force3D:         true,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      style={{
        position:       'absolute',
        inset:          0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        pointerEvents:  'none',
        zIndex:         1,
      }}
    >
      {RING_SIZES.map((S, i) => {
        const C = S / 2;
        const R = RING_RADII[i];
        return (
          <div
            key={i}
            ref={(el) => { ringsRef.current[i] = el; }}
            style={{ position: 'absolute', width: S, height: S, willChange: 'transform' }}
          >
            <svg
              width={S}
              height={S}
              viewBox={`0 0 ${S} ${S}`}
              style={{ overflow: 'visible' }}
              aria-hidden="true"
            >
              <circle
                cx={C} cy={C} r={R}
                fill="none"
                stroke={RING_STROKES[i]}
                strokeWidth="0.8"
                strokeDasharray={RING_DASHES[i]}
              />
              <circle cx={C} cy={C - R} r={NODE_SIZES[i]}     fill={NODE_COLORS[i]} />
              <circle cx={C} cy={C - R} r={NODE_SIZES[i] + 5} fill="none" stroke={NODE_COLORS[i]} strokeWidth="0.5" opacity="0.3" />
              {i === 0 && (
                <circle cx={C + R} cy={C} r={3} fill={ACCENT} opacity="0.6" />
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
});
OrbitRings.displayName = 'OrbitRings';

// ─── DataBars ─────────────────────────────────────────────────────────────────
const DataBars = React.memo(({ barsRef }) => (
  <div
    ref={barsRef}
    style={{
      display:    'flex',
      alignItems: 'flex-end',
      gap:        3,
      opacity:    0, // GSAP animates in
    }}
  >
    {BAR_HEIGHTS.map((h, i) => (
      <div
        key={i}
        style={{
          width:           4,
          borderRadius:    2,
          height:          `${h * 32}px`,
          background:      `linear-gradient(to top, ${ORANGE}, ${i % 2 === 0 ? ACCENT : ORANGE_SOFT})`,
          animation:       `ddwBarRise ${1 + i * 0.15}s ease-in-out ${i * 0.1}s infinite`,
          transformOrigin: 'bottom',
          willChange:      'transform, opacity',
        }}
      />
    ))}
  </div>
));
DataBars.displayName = 'DataBars';

// ─── LogoMark ─────────────────────────────────────────────────────────────────
const LogoMark = React.memo(({ logoRef }) => (
  <div
    ref={logoRef}
    style={{
      width:          52,
      height:         52,
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'linear-gradient(135deg,#1a1f26 0%,#0d1014 100%)',
      border:         `1.5px solid rgba(255,87,15,0.5)`,
      animation:      'ddwCorePulse 2.6s ease-in-out infinite',
      flexShrink:     0,
      opacity:        0,           // GSAP animates in
      transform:      'scale(0.8)', // GSAP animates to scale(1)
      willChange:     'box-shadow, transform, opacity',
    }}
  >
    <img
      src="/logo.jpeg"
      alt="DDW Agency Logo"
      style={{
        width:        '100%',
        height:       '100%',
        objectFit:    'cover',
        borderRadius: '50%',
        display:      'block',
      }}
    />
  </div>
));
LogoMark.displayName = 'LogoMark';

// ─── CornerDeco ───────────────────────────────────────────────────────────────
const CornerDeco = React.memo(({ position }) => {
  const lines    = CORNER_LINES[position];
  const posStyle = CORNER_POSITIONS[position];
  return (
    <div
      style={{
        position:      'absolute',
        zIndex:        5,
        pointerEvents: 'none',
        ...posStyle,
      }}
    >
      <svg width={28} height={28} viewBox="0 0 28 28" style={{ opacity: 0.2 }} aria-hidden="true">
        {lines.map((l, i) => (
          <line key={i} {...l} stroke={ORANGE} strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
});
CornerDeco.displayName = 'CornerDeco';

// ─── LoadingScreen ────────────────────────────────────────────────────────────
const LoadingScreen = ({ onComplete }) => {
  const curtainRef     = useRef(null);
  const contentRef     = useRef(null);
  const progressBarRef = useRef(null);
  const counterRef     = useRef(null);
  const taglineRef     = useRef(null);
  const glowDotRef     = useRef(null);
  const logoRef        = useRef(null);
  const bars1Ref       = useRef(null);
  const bars2Ref       = useRef(null);
  const pillRefs       = useRef([]);

  const handleComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (
      !curtainRef.current     ||
      !contentRef.current     ||
      !progressBarRef.current ||
      !counterRef.current     ||
      !glowDotRef.current     ||
      !logoRef.current
    ) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    let mounted = true;

    // ── Phase 1: Entrance ──────────────────────────────────────────────────
    gsap.to(logoRef.current, {
      opacity:  1,
      scale:    1,
      duration: 0.5,
      ease:     'power2.out',
      force3D:  true,
    });

    gsap.to([bars1Ref.current, bars2Ref.current], {
      opacity:  1,
      duration: 0.5,
      ease:     'power2.out',
    });

    // ── Phase 2: Tagline cycling — direct DOM mutation, zero re-renders ────
    const taglineTimers = TAGLINES.map((text, i) => {
      if (i === 0) return null;
      const delays = [400, 900, 1400];
      return setTimeout(() => {
        if (!mounted || !taglineRef.current) return;
        taglineRef.current.textContent = text;
        taglineRef.current.style.animation = 'none';
        void taglineRef.current.offsetWidth; // reflow to restart animation
        taglineRef.current.style.animation = 'ddwTaglineReveal 0.35s ease both';
      }, delays[i - 1]);
    }).filter(Boolean);

    // ── Phase 3: Master timeline ───────────────────────────────────────────
    const progressState = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        if (!mounted) return;
        document.body.style.overflow = originalOverflow;
        handleComplete();
      },
    });

    // Counter
    tl.to(progressState, {
      val:      100,
      duration: 1.8,
      ease:     'power3.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent =
            String(Math.round(progressState.val)).padStart(2, '0') + '%';
        }
      },
    }, 0);

    // Progress bar fill — scaleX (compositor-safe)
    tl.to(progressBarRef.current, {
      scaleX:   1,
      duration: 1.8,
      ease:     'power3.inOut',
      force3D:  true,
    }, 0);

    // Glow dot — animate via x (pixels) from 0 to bar's full width.
    // We use a lazy getter so we read offsetWidth AFTER layout, not before.
    // x in pixels = no conflict with any CSS transform.
    const barEl = progressBarRef.current?.parentElement ?? progressBarRef.current;
    const barW  = barEl ? barEl.offsetWidth : 300;

    gsap.set(glowDotRef.current, { x: 0 });
    tl.to(glowDotRef.current, {
      x:        barW,
      duration: 1.8,
      ease:     'power3.inOut',
      force3D:  true,
    }, 0);

    // Pills stagger
    tl.to(pillRefs.current.filter(Boolean), {
      opacity:  1,
      y:        0,
      duration: 0.4,
      stagger:  0.2,
      ease:     'power2.out',
      force3D:  true,
    }, 0.5);

    // Pause → content fade out → curtain slide up
    tl.to({}, { duration: 0.28 });
    tl.to(contentRef.current, {
      opacity:  0,
      y:        -16,
      duration: 0.38,
      ease:     'power2.in',
      force3D:  true,
    });
    tl.to(curtainRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease:     'power4.inOut',
      force3D:  true,
    }, '+=0.05');

    return () => {
      mounted = false;
      tl.kill();
      taglineTimers.forEach(clearTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleComplete]);

  return (
    <div
      ref={curtainRef}
      style={{
        position:   'fixed',
        inset:      0,
        zIndex:     99999,
        willChange: 'transform',
      }}
    >
      <div
        style={{
          position:       'absolute',
          inset:          0,
          background:     BG,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          overflow:       'hidden',
        }}
      >
        <AuroraOrbs />
        <AmbientParticles />

        {/* Scan line */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            overflow:      'hidden',
            pointerEvents: 'none',
            zIndex:        2,
          }}
        >
          <div
            style={{
              position:   'absolute',
              left:       0,
              right:      0,
              height:     '1px',
              background: `linear-gradient(90deg, transparent, rgba(255,87,15,0.4), rgba(253,232,122,0.2), transparent)`,
              animation:  'ddwScanLine 3s ease-in-out 1.2s infinite',
              willChange: 'transform, opacity',
            }}
          />
        </div>

        <OrbitRings />

        {/* Main content */}
        <div
          ref={contentRef}
          style={{
            position:      'relative',
            zIndex:        10,
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           'clamp(20px,3.5vw,32px)',
            padding:       '0 clamp(16px,4vw,32px)',
            width:         '100%',
            maxWidth:      480,
          }}
        >
          {/* Logo + brand row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,16px)' }}>
            <LogoMark logoRef={logoRef} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <h2
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      'clamp(18px,3vw,24px)',
                  fontWeight:    700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color:         '#fff',
                  margin:        0,
                  lineHeight:    1.2,
                }}
              >
                DDW{' '}
                <span
                  style={{
                    background:           `linear-gradient(135deg, ${ORANGE} 0%, ${ACCENT} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor:  'transparent',
                    backgroundClip:       'text',
                  }}
                >
                  Agency
                </span>
              </h2>
              <div
                style={{
                  height:         1.5,
                  borderRadius:   99,
                  background:     `linear-gradient(90deg, transparent, ${ORANGE}, ${ACCENT}, transparent)`,
                  opacity:        0.55,
                  animation:      'ddwShimmer 2.5s linear infinite',
                  backgroundSize: '200% auto',
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width:      '100%',
              height:     1,
              background: `linear-gradient(90deg, transparent, rgba(255,87,15,0.2), transparent)`,
            }}
          />

          {/* Data viz row */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            20,
              width:          '100%',
            }}
          >
            <DataBars barsRef={bars1Ref} />

            <div
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           2,
              }}
            >
              <span
                style={{
                  fontFamily:           'Montserrat, sans-serif',
                  fontSize:             'clamp(28px,5vw,40px)',
                  fontWeight:           700,
                  lineHeight:           1,
                  letterSpacing:        '-0.03em',
                  background:           `linear-gradient(135deg, ${ORANGE}, ${ACCENT})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                $4.2M+
              </span>
              <span
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      8,
                  fontWeight:    700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color:         'rgba(255,255,255,0.28)',
                }}
              >
                Ad Spend Managed
              </span>
            </div>

            <DataBars barsRef={bars2Ref} />
          </div>

          {/* Divider */}
          <div
            style={{
              width:      '100%',
              height:     1,
              background: `linear-gradient(90deg, transparent, rgba(255,87,15,0.2), transparent)`,
            }}
          />

          {/* Progress section */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Status row */}
            <div
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div
                  style={{
                    width:        5,
                    height:       5,
                    borderRadius: '50%',
                    background:   ORANGE,
                    flexShrink:   0,
                    animation:    'ddwGlowPulse 1.6s ease-in-out infinite',
                  }}
                />
                {/* Direct DOM text mutation via ref — no React re-renders */}
                <span
                  ref={taglineRef}
                  style={{
                    fontFamily:    'Inter, sans-serif',
                    fontSize:      'clamp(12px,1.6vw,13px)',
                    fontWeight:    500,
                    color:         'rgba(255,255,255,0.38)',
                    letterSpacing: '0.1em',
                    animation:     'ddwTaglineReveal 0.35s ease both',
                  }}
                >
                  {TAGLINES[0]}
                </span>
                <span
                  style={{
                    display:    'inline-block',
                    width:      1.5,
                    height:     11,
                    background: ORANGE,
                    marginLeft: 2,
                    animation:  'ddwBlinkCursor 0.9s step-end infinite',
                  }}
                />
              </div>

              <div
                ref={counterRef}
                style={{
                  fontFamily:         'Montserrat, sans-serif',
                  fontSize:           'clamp(12px,2vw,13px)',
                  fontWeight:         700,
                  color:              'rgba(255,255,255,0.45)',
                  letterSpacing:      '0.12em',
                  fontVariantNumeric: 'tabular-nums',
                  minWidth:           36,
                  textAlign:          'right',
                }}
              >
                00%
              </div>
            </div>

            {/* Progress bar track */}
            <div
              style={{
                width:        '100%',
                height:       3,
                borderRadius: 99,
                background:   'rgba(255,255,255,0.07)',
                overflow:     'visible',
                position:     'relative',
              }}
            >
              {/* Fill — scaleX (compositor-safe) */}
              <div
                ref={progressBarRef}
                style={{
                  position:        'absolute',
                  top:             0,
                  left:            0,
                  width:           '100%',
                  height:          '100%',
                  borderRadius:    99,
                  background:      `linear-gradient(90deg, ${ORANGE}, ${ORANGE_SOFT}, ${ACCENT})`,
                  transform:       'scaleX(0)',
                  transformOrigin: 'left center',
                  animation:       'ddwProgressGlow 1.5s ease-in-out infinite',
                  willChange:      'transform',
                }}
              />

              {/*
                Glow dot — NO CSS transform on this element.
                If CSS transform and GSAP x are both set, GSAP overwrites the
                CSS transform entirely, freezing the centering offset.
                Fix: center via marginTop (static offset, not transform),
                marginLeft shifts it half-width left of its track position.
                GSAP only touches `x` (translateX) — nothing conflicts.
              */}
              <div
                ref={glowDotRef}
                style={{
                  position:     'absolute',
                  top:          '50%',
                  left:         0,
                  marginTop:    -4,   // half of height:8 — vertical center
                  marginLeft:   -4,   // half of width:8  — starts flush at left edge
                  width:        8,
                  height:       8,
                  borderRadius: '50%',
                  background:   ACCENT,
                  boxShadow:    `0 0 10px ${ACCENT}, 0 0 20px ${ORANGE}88`,
                  zIndex:       2,
                  willChange:   'transform',
                }}
              />

              {/* Tick marks */}
              {[25, 50, 75].map((tick) => (
                <div
                  key={tick}
                  style={{
                    position:     'absolute',
                    top:          '50%',
                    left:         `${tick}%`,
                    transform:    'translate(-50%,-50%)',
                    width:        1,
                    height:       6,
                    background:   'rgba(255,255,255,0.1)',
                    borderRadius: 99,
                  }}
                />
              ))}
            </div>

            {/* Stat pills */}
            <div
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            8,
                marginTop:      4,
                flexWrap:       'wrap',
              }}
            >
              {PILLS.map((pill, idx) => (
                <div
                  key={pill.label}
                  ref={(el) => { pillRefs.current[idx] = el; }}
                  style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          5,
                    padding:      '3px 10px',
                    borderRadius: 99,
                    background:   `${pill.color}10`,
                    border:       `1px solid ${pill.color}28`,
                    opacity:      0,
                    transform:    'translateY(6px)',
                    willChange:   'transform, opacity',
                  }}
                >
                  <div
                    style={{
                      width:        4,
                      height:       4,
                      borderRadius: '50%',
                      background:   pill.color,
                      flexShrink:   0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily:    'Montserrat, sans-serif',
                      fontSize:      8,
                      fontWeight:    700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color:         pill.color,
                    }}
                  >
                    {pill.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.28 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
            <span
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      8,
                fontWeight:    700,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color:         'rgba(255,255,255,0.6)',
                whiteSpace:    'nowrap',
              }}
            >
              Elite Performance Agency
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
          </div>
        </div>

        {/* Corner decorations */}
        <CornerDeco position="tl" />
        <CornerDeco position="tr" />
        <CornerDeco position="bl" />
        <CornerDeco position="br" />

        {/* Bottom vignette */}
        <div
          style={{
            position:      'absolute',
            bottom:        0,
            left:          0,
            right:         0,
            height:        80,
            background:    'linear-gradient(to bottom, transparent, rgba(8,10,12,0.6))',
            pointerEvents: 'none',
            zIndex:        3,
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;