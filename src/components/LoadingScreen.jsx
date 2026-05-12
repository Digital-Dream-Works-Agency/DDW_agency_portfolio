/**
 * LoadingScreen.jsx
 * DDW Agency — Production-optimized loading screen
 *
 * Key architectural decisions:
 * - GlobalStyles component deleted — fonts in index.html, keyframes in index.css
 * - Zero React state for visual transitions — all GSAP-driven via refs
 * - background-position animation replaced with transform-based equivalent
 * - 'left' property animation replaced with translateX (compositor-safe)
 * - All constant data hoisted to module scope
 * - Math.random() for particle duration moved into useMemo data array
 * - willChange applied only on elements that actually composite
 * - Pill refs consolidated into single useRef([]) array
 * - CornerDeco uses lookup map instead of 4 conditional branches
 * - Mounted guard prevents setState/callback on unmounted component
 */

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

// ─── Brand constants (module-level — allocated once, never GC'd) ───────────
const ORANGE      = '#FF570F';
const ORANGE_SOFT = '#EE7D1D';
const ACCENT      = '#FDE87A';
const BG          = '#080a0c';

// ─── Particle data shape — duration included here, NOT in render ───────────
// FIXED: Math.random() was inside Particle's style prop — caused animation
// restarts on every AmbientParticles re-render.
// Now fully pre-computed in the factory, memoized in AmbientParticles.
const createParticles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id:       i,
    x:        `${5  + Math.random() * 90}%`,
    y:        `${20 + Math.random() * 60}%`,
    size:     `${1.5 + Math.random() * 2.5}px`,
    delay:    Math.random() * 3,
    drift:    (Math.random() - 0.5) * 60,
    // FIXED: duration pre-computed here so Particle render is pure/stable
    duration: 2.8 + Math.random(),
  }));

// ─── OrbitRings static data (module-level) ────────────────────────────────
// FIXED: Was re-allocated inside component body on every render.
const RING_SIZES    = [260, 190, 128];
const RING_RADII    = [122, 87, 56];
const RING_STROKES  = [
  'rgba(255,87,15,0.22)',
  'rgba(253,232,122,0.12)',
  'rgba(255,87,15,0.07)',
];
const RING_DASHES   = ['5 14', '3 10', '2 7'];
const NODE_COLORS   = [ORANGE, ACCENT, ORANGE];
const NODE_SIZES    = [5, 4, 3];

// ─── DataBars heights (module-level) ─────────────────────────────────────
// FIXED: Was re-allocated inside DataBars component body.
const BAR_HEIGHTS = [0.45, 0.7, 1, 0.82, 0.6, 0.9, 0.5, 0.75, 0.88, 0.55, 0.92, 0.65];

// ─── Pill data (module-level) ─────────────────────────────────────────────
const PILLS = Object.freeze([
  { label: '600% ROAS',   color: ORANGE      },
  { label: '$2.7M Amazon', color: ACCENT      },
  { label: '54K SEO/mo',  color: ORANGE_SOFT },
]);

// ─── Taglines (module-level) ──────────────────────────────────────────────
const TAGLINES = Object.freeze([
  'Initializing systems...',
  'Loading campaigns...',
  'Syncing data...',
  'Ready.',
]);

// ─── CornerDeco path lookup (module-level) ────────────────────────────────
// FIXED: Was 4 conditional branches evaluated on every render.
// Now: O(1) lookup, computed once.
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

// ─── Particle ────────────────────────────────────────────────────────────
// FIXED: duration now comes from props (pre-computed in createParticles)
// so this component is fully pure — same props always produce same output.
const Particle = React.memo(({ x, y, size, delay, drift, duration }) => (
  <div
    style={{
      position:     'absolute',
      left:         x,
      top:          y,
      width:        size,
      height:       size,
      borderRadius: '50%',
      background:   `radial-gradient(circle, ${ORANGE} 0%, ${ACCENT} 60%, transparent 100%)`,
      '--px':       `${drift}px`,
      // FIXED: duration from props — stable across re-renders
      animation:    `ddwParticleFloat ${duration}s ease-in ${delay}s infinite`,
      pointerEvents:'none',
      zIndex:       1,
      willChange:   'transform, opacity',
    }}
  />
));
Particle.displayName = 'Particle';

// ─── AmbientParticles ────────────────────────────────────────────────────
const AmbientParticles = React.memo(() => {
  // FIXED: createParticles called once, result memoized.
  // Particles include all random values — no randomness escapes useMemo.
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

// ─── AuroraOrbs ──────────────────────────────────────────────────────────
// FIXED: Removed ddwDotGrid animation (background-position = non-compositable
// = full repaint 60×/sec). Replaced with a static dot grid — visually
// identical at rest, zero CPU cost.
// The ddwAuroraFloat animation on the orbs uses transform — compositor-safe.
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
    {/* Primary orange orb */}
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
    {/* Accent yellow orb */}
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
    {/* Center glow pulse */}
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
        // willChange covers both transform (translate) and opacity — compositor-safe
        willChange:   'transform, opacity',
      }}
    />
    {/*
      FIXED: Static dot grid — no animation.
      ddwDotGrid animated background-position which is non-compositable.
      That caused 60 full repaints/sec on the busiest frame of the page load.
      A static grid is visually equivalent and costs zero CPU after first paint.
    */}
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

// ─── OrbitRings ──────────────────────────────────────────────────────────
// FIXED: All constant arrays hoisted to module scope.
// gsap.context() correctly scopes and cleans up all 3 infinite tweens.
const OrbitRings = React.memo(() => {
  // Single ref array instead of 3 separate named refs
  const ringsRef = useRef([]);

  useEffect(() => {
    // Guard: ensure all 3 refs are populated before animating
    if (ringsRef.current.some((r) => !r)) return;

    const ctx = gsap.context(() => {
      const durations = [16, 26, 40];
      const directions = [360, -360, 360];

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
            style={{
              position:   'absolute',
              width:      S,
              height:     S,
              willChange: 'transform',
            }}
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

// ─── DataBars ────────────────────────────────────────────────────────────
// FIXED: heights array at module scope.
// FIXED: visibility now GSAP-controlled via ref — no React state.
// The ref is forwarded from LoadingScreen so GSAP can set initial opacity.
const DataBars = React.memo(({ barsRef }) => (
  <div
    ref={barsRef}
    style={{
      display:    'flex',
      alignItems: 'flex-end',
      gap:        3,
      opacity:    0, // GSAP will animate this in — no React state needed
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

// ─── LogoMark ────────────────────────────────────────────────────────────
// FIXED: No React state. Receives a ref forwarded from LoadingScreen.
// GSAP animates opacity/scale directly on the DOM node.
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
      opacity:        0,    // GSAP starts from 0
      transform:      'scale(0.8)', // GSAP starts from scale(0.8)
      willChange:     'box-shadow, transform, opacity',
    }}
  >
    <div
      style={{
        fontFamily:    'Montserrat, sans-serif',
        fontSize:      11,
        fontWeight:    900,
        letterSpacing: '-0.02em',
        color:         ORANGE,
        lineHeight:    1,
      }}
    >
      DDW
    </div>
  </div>
));
LogoMark.displayName = 'LogoMark';

// ─── CornerDeco ──────────────────────────────────────────────────────────
// FIXED: O(1) lookup map replaces 4 conditional branches.
// position prop is a string literal — React.memo correctly bails out.
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

// ─── LoadingScreen ───────────────────────────────────────────────────────
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

  // FIXED: Single ref array for all pills — no pill1Ref/pill2Ref/pill3Ref
  const pillRefs       = useRef([]);

  // Stable callback reference — won't change between renders
  const handleComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Null-guard all critical refs before touching the DOM
    if (
      !curtainRef.current     ||
      !contentRef.current     ||
      !progressBarRef.current ||
      !counterRef.current     ||
      !glowDotRef.current     ||
      !logoRef.current
    ) return;

    // Prevent body scroll during loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // Mounted guard — prevents callbacks firing on unmounted component
    let mounted = true;

    // ── Phase 1: Entrance animations ──────────────────────────────────────
    // FIXED: React state replaced with direct GSAP DOM mutation.
    // Logo and bars now animate in via GSAP — zero React re-renders.
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

    // ── Phase 2: Tagline cycling — direct DOM, no setState ────────────────
    // FIXED: setTaglineIdx caused 3 full React re-renders.
    // Now: direct textContent mutation — microseconds vs milliseconds.
    const taglineTimers = TAGLINES.map((text, i) => {
      if (i === 0) return null; // first tagline is the initial content
      const delays = [400, 900, 1400];
      return setTimeout(() => {
        if (!mounted || !taglineRef.current) return;
        // Trigger the CSS animation by cloning the node
        // (force animation restart on same element)
        taglineRef.current.textContent = text;
        taglineRef.current.style.animation = 'none';
        // Reflow to restart animation
        void taglineRef.current.offsetWidth;
        taglineRef.current.style.animation = 'ddwTaglineReveal 0.35s ease both';
      }, delays[i - 1]);
    }).filter(Boolean);

    // ── Phase 3: Master progress timeline ─────────────────────────────────
    const progressState = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        if (!mounted) return;
        document.body.style.overflow = originalOverflow;
        handleComplete();
      },
    });

    // Counter — direct DOM mutation, no React state
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

    // Progress bar — transform: scaleX (compositor-safe)
    tl.to(progressBarRef.current, {
      scaleX:   1,
      duration: 1.8,
      ease:     'power3.inOut',
      force3D:  true,
    }, 0);

    /*
     * FIXED: Glow dot previously animated `left` CSS property.
     * `left` triggers layout reflow every frame — the definition of jank.
     *
     * Solution: animate `xPercent` (maps to translateX) instead.
     * The dot starts at x:0 (left edge after centering) and moves to
     * the right edge of the bar using xPercent: 100 relative to bar width.
     *
     * We use a wrapper div for the dot positioned at left:0, then
     * translateX it to match the bar's width. GSAP's `x` property
     * uses transform — runs entirely on the compositor thread.
     */
    tl.to(glowDotRef.current, {
      x:        '100%',  // compositor-safe: transform: translateX(100%)
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

    // Pause before exit
    tl.to({}, { duration: 0.28 });

    // Content fade out
    tl.to(contentRef.current, {
      opacity:  0,
      y:        -16,
      duration: 0.38,
      ease:     'power2.in',
      force3D:  true,
    });

    // Curtain slide up — exit
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
    /*
      NOTE: No <GlobalStyles> here — it has been deleted.
      All keyframes are in index.css (parsed once at app load).
      Fonts are in index.html <link> tags (preloaded before JS executes).
    */
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

        {/* Main content card */}
        <div
          ref={contentRef}
          style={{
            position:  'relative',
            zIndex:    10,
            display:   'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap:        'clamp(20px,3.5vw,32px)',
            padding:    '0 clamp(16px,4vw,32px)',
            width:      '100%',
            maxWidth:   480,
          }}
        >
          {/* Logo + brand row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,16px)' }}>
            {/*
              FIXED: LogoMark no longer uses React state for visibility.
              logoRef is passed in and GSAP animates it directly.
            */}
            <LogoMark logoRef={logoRef} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <h2
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      'clamp(22px,4.5vw,34px)',
                  fontWeight:    900,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  lineHeight:    1,
                  color:         '#fff',
                }}
              >
                DDW{' '}
                <span
                  style={{
                    background:            `linear-gradient(135deg, ${ORANGE} 0%, ${ACCENT} 100%)`,
                    WebkitBackgroundClip:  'text',
                    WebkitTextFillColor:   'transparent',
                    backgroundClip:        'text',
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

          {/* Data visualization row */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            20,
              width:          '100%',
            }}
          >
            {/*
              FIXED: DataBars receives a ref for GSAP control — no visible/state prop.
              Both sets of bars animate in together via GSAP in the main useEffect.
            */}
            <DataBars barsRef={bars1Ref} />

            <div
              style={{
                display:   'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap:        2,
              }}
            >
              <span
                style={{
                  fontFamily:           'Montserrat, sans-serif',
                  fontSize:             'clamp(28px,5vw,40px)',
                  fontWeight:           900,
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

            {/* Status row: tagline + counter */}
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
                {/*
                  FIXED: taglineRef used for direct DOM text mutation.
                  No key={taglineIdx} forcing React reconciliation.
                  No useState causing re-renders.
                  CSS animation restarted via offsetWidth reflow trick (one-time, cheap).
                */}
                <span
                  ref={taglineRef}
                  style={{
                    fontFamily:    'Inter, sans-serif',
                    fontSize:      'clamp(9px,1.6vw,11px)',
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

              {/* Counter — GSAP mutates textContent directly */}
              <div
                ref={counterRef}
                style={{
                  fontFamily:        'Montserrat, sans-serif',
                  fontSize:          'clamp(11px,2vw,13px)',
                  fontWeight:        700,
                  color:             'rgba(255,255,255,0.45)',
                  letterSpacing:     '0.12em',
                  fontVariantNumeric:'tabular-nums',
                  minWidth:          36,
                  textAlign:         'right',
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
              {/* Fill bar — scaleX animation, compositor-safe */}
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
                FIXED: Glow dot no longer animates `left` (layout-triggering).
                Initial position: left:0, transform: translateX(-50%) translateY(-50%)
                GSAP animates `x` (translateX) — pure compositor.
                The dot starts at the left edge of the bar.
              */}
              <div
                ref={glowDotRef}
                style={{
                  position:     'absolute',
                  top:          '50%',
                  left:         0,
                  // translateX(-50%) centers the dot on its left edge
                  // translateY(-50%) centers vertically
                  transform:    'translateX(-50%) translateY(-50%)',
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
              {/*
                FIXED: Single pillRefs array replaces pill1Ref/pill2Ref/pill3Ref.
                Stable key uses pill.label (unique string) instead of index.
              */}
              {PILLS.map((pill) => (
                <div
                  key={pill.label}
                  ref={(el) => {
                    const idx = PILLS.indexOf(pill);
                    pillRefs.current[idx] = el;
                  }}
                  style={{
                    display:     'inline-flex',
                    alignItems:  'center',
                    gap:         5,
                    padding:     '3px 10px',
                    borderRadius: 99,
                    background:  `${pill.color}10`,
                    border:      `1px solid ${pill.color}28`,
                    opacity:     0,
                    transform:   'translateY(6px)',
                    willChange:  'transform, opacity',
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
                      fontWeight:    800,
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