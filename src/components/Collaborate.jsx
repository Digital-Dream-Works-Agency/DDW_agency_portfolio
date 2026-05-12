// src/components/Collaborate/index.jsx
// DDW Agency — Discovery CTA Section | Optimized | Production-Ready

import React, { useEffect, useRef, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
// FIX #6: Frozen — prevents accidental mutation
const B = Object.freeze({
  orange:     '#FF570F',
  orangeSoft: '#EE7D1D',
  accent:     '#FDE87A',
  bg:         '#080a0c',
  bgCard:     '#0d1012',
  bgCardAlt:  '#0a0c0e',
  border:     'rgba(255,87,15,0.18)',
});

// ─── FIX #2: isTouch singleton — computed once at module load ─────────────────
const _touchQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)')
    : null;

let _isTouch =
  typeof window !== 'undefined'
    ? (_touchQuery?.matches || navigator.maxTouchPoints > 0)
    : false;

if (_touchQuery) {
  _touchQuery.addEventListener('change', (e) => {
    _isTouch = e.matches || navigator.maxTouchPoints > 0;
  });
}

const getIsTouch = () => _isTouch;

// ─── Static Data ──────────────────────────────────────────────────────────────
// FIX #8: h1Words at module scope
const H1_WORDS = Object.freeze([
  'Every', 'month', 'with', 'the', 'wrong', 'team', 'is', 'budget', 'that',
]);

// FIX #16: Trust copy lines at module scope
const TRUST_LINES = Object.freeze([
  'No commitment · 20 minutes',
  'Straight talk, not a pitch',
]);

// FIX #15: Accent color lookup — O(1), scalable
const AGENDA_ACCENTS = Object.freeze([B.orange, B.orangeSoft, B.accent]);

const AGENDA = Object.freeze([
  {
    num: '01',
    title: "'Look at what you're running'",
    desc: 'We look at the actual account — spend, ROAS, structure, where the budget goes. Not a questionnaire. The real numbers.',
  },
  {
    num: '02',
    title: 'Tell you exactly where the gap is',
    desc: "There's usually one thing costing the most. We'll name it in plain terms, not agency jargon.",
  },
  {
    num: '03',
    title: "Tell you plainly if we're the right fit",
    desc: "If DDW isn't the right team for your account, we'll say so on the call. No follow-up unless you ask for one.",
  },
]);

// FIX #12: Consistent string-typed positions throughout
const PILLS = Object.freeze([
  { value: '600%',  label: 'Peak ROAS',    delay: 0,   pos: { top: '-24px',  left: '-24px'  } },
  { value: '$418K', label: 'EU Revenue',   delay: 0.5, pos: { bottom: '-24px', right: '-24px' } },
  { value: '$0.09', label: 'CPC Achieved', delay: 1.0, pos: { top: '42%',    right: '-32px' } },
]);

// FIX #17: Bar animation config at module scope — never recreated
const BAR_CONFIG = Object.freeze([
  { timing: 1.2, delay: 0,    scale: 0.4  },
  { timing: 1.6, delay: 0.3,  scale: 0.6  },
  { timing: 1.0, delay: 0.6,  scale: 0.3  },
  { timing: 1.4, delay: 0.1,  scale: 0.7  },
  { timing: 1.8, delay: 0.9,  scale: 0.5  },
  { timing: 1.3, delay: 0.45, scale: 0.45 },
]);

const BAR_HEIGHTS = Object.freeze(['100%', '80%', '60%', '90%', '70%', '85%']);

const CALENDLY_URL = 'https://calendly.com/digi-dreamworks/onboarding-call';

// ─── Shared SVG Components ────────────────────────────────────────────────────
const ArrowIcon = memo(() => (
  <svg
    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
));
ArrowIcon.displayName = 'ArrowIcon';

const CheckIcon = memo(() => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="5.5" stroke={`${B.orange}50`} />
    <path
      d="M3.5 6l2 2 3-3"
      stroke={B.orange} strokeWidth="1.3"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

// ─── Abstract CTA Visual ──────────────────────────────────────────────────────
// FIX #11: barsRef reset before population
const AbstractCTAVisual = memo(() => {
  const containerRef = useRef(null);
  const glowARef     = useRef(null);
  const glowBRef     = useRef(null);
  const ring1Ref     = useRef(null);
  const ring2Ref     = useRef(null);
  const ring3Ref     = useRef(null);
  const centerRef    = useRef(null);
  const barsRef      = useRef([]);

  useEffect(() => {
    // FIX #11: Reset bar refs before population
    barsRef.current = [];

    const ctx = gsap.context(() => {
      gsap.to(glowARef.current, {
        scale: 1.28, opacity: 0.65,
        duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut',
      });
      gsap.to(glowBRef.current, {
        scale: 0.78, opacity: 0.38,
        duration: 6, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1.5,
      });

      gsap.to(ring1Ref.current, {
        rotation: 360, duration: 8,
        repeat: -1, ease: 'none', transformOrigin: '50% 50%', force3D: true,
      });
      gsap.to(ring2Ref.current, {
        rotation: -360, duration: 14,
        repeat: -1, ease: 'none', transformOrigin: '50% 50%', force3D: true,
      });
      gsap.to(ring3Ref.current, {
        rotation: 360, duration: 20,
        repeat: -1, ease: 'none', transformOrigin: '50% 50%', force3D: true,
      });

      gsap.to(centerRef.current, {
        scale: 1.07, duration: 3,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });

      // FIX #17: BAR_CONFIG from module scope — no array allocation in effect
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const cfg = BAR_CONFIG[i];
        gsap.to(bar, {
          scaleY: cfg.scale,
          duration: cfg.timing,
          repeat: -1, yoyo: true,
          ease: 'power1.inOut',
          transformOrigin: 'bottom',
          delay: cfg.delay,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={glowARef}
        className="absolute rounded-full"
        style={{
          width: 220, height: 220,
          background: `radial-gradient(circle, ${B.orange}18 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
      />
      <div
        ref={glowBRef}
        className="absolute rounded-full"
        style={{
          width: 130, height: 130,
          background: `radial-gradient(circle, ${B.accent}14 0%, transparent 70%)`,
          filter: 'blur(36px)',
        }}
      />

      {/* Outer orbit ring */}
      <div
        ref={ring3Ref}
        className="absolute rounded-full flex items-start justify-center"
        style={{
          width: 280, height: 280,
          border: `1px dashed ${B.orange}18`,
          willChange: 'transform',
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: `${B.orange}60`, marginTop: -4,
          boxShadow: `0 0 8px ${B.orange}`,
        }} />
      </div>

      {/* Mid orbit ring */}
      <div
        ref={ring2Ref}
        className="absolute rounded-full flex items-center justify-end"
        style={{
          width: 200, height: 200,
          border: `1px solid ${B.orange}22`,
          willChange: 'transform',
        }}
      >
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: B.accent, marginRight: -3,
          boxShadow: `0 0 8px ${B.accent}80`,
        }} />
      </div>

      {/* Inner orbit ring */}
      <div
        ref={ring1Ref}
        className="absolute rounded-full flex items-end justify-center"
        style={{
          width: 130, height: 130,
          border: `1px solid ${B.orange}35`,
          willChange: 'transform',
        }}
      >
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: B.orange, marginBottom: -2.5,
          boxShadow: `0 0 6px ${B.orange}`,
        }} />
      </div>

      {/* Center node */}
      <div
        ref={centerRef}
        className="relative z-10 flex flex-col items-center justify-center rounded-2xl"
        style={{
          width: 110, height: 110,
          background: `linear-gradient(135deg, #1c1c1c 0%, ${B.bgCardAlt} 100%)`,
          border: `1px solid ${B.orange}30`,
          boxShadow: `0 0 40px ${B.orange}18, 0 20px 60px rgba(0,0,0,0.55)`,
        }}
      >
        <div className="flex items-end mb-2" style={{ gap: 3, height: 32 }}>
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              ref={(el) => { barsRef.current[i] = el; }}
              className="rounded-t-sm"
              style={{
                width: 6, height: h,
                background: `linear-gradient(to top, ${B.orange}, ${B.accent})`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 9, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: `${B.orange}90`,
          }}
        >
          20 min
        </span>
      </div>

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `radial-gradient(${B.orange}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity: 0.4,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
    </div>
  );
});
AbstractCTAVisual.displayName = 'AbstractCTAVisual';

// ─── Browser Mockup Shell ─────────────────────────────────────────────────────
// FIX #13: aria-hidden on all decorative SVGs
const BrowserMockup = memo(({ children }) => (
  <div
    className="relative w-full h-full rounded-2xl overflow-hidden"
    style={{
      background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: `0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px ${B.orange}0A`,
    }}
  >
    <div
      className="flex items-center gap-2 px-4 py-3 border-b"
      style={{
        borderColor: 'rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
      }}
      aria-hidden="true"
    >
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
      <div
        className="flex-1 mx-3 flex items-center gap-2 px-3 rounded-md"
        style={{
          height: 20,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* FIX #13: aria-hidden on decorative lock icon */}
        <svg
          width="9" height="9" viewBox="0 0 24 24"
          fill="none" stroke="rgba(255,255,255,0.2)"
          strokeWidth="2" aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>
          calendly.com/digi-dreamworks/onboarding-call
        </span>
      </div>
    </div>
    {children}
  </div>
));
BrowserMockup.displayName = 'BrowserMockup';

// ─── Floating Stat Pill ───────────────────────────────────────────────────────
// FIX #5: GSAP tween killed on unmount via returned cleanup
const StatPill = memo(({ value, label, delay, pos }) => {
  const ref   = useRef(null);
  const tween = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // FIX #5: Store tween reference for cleanup
    tween.current = gsap.to(ref.current, {
      y: -10,
      duration: 2 + delay * 0.5,
      repeat: -1, yoyo: true,
      ease: 'sine.inOut',
      delay,
    });

    return () => {
      tween.current?.kill();
      tween.current = null;
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className="absolute z-20 rounded-xl"
      style={{
        padding: '10px 16px',
        background: 'rgba(8,10,12,0.88)',
        border: `1px solid ${B.orange}35`,
        backdropFilter: 'blur(14px)',
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${B.orange}10`,
        ...pos, // FIX #12: consistent string positions
      }}
      aria-label={`${value} ${label}`}
    >
      <div
        style={{
          fontSize: 'clamp(16px, 2vw, 22px)',
          fontWeight: 900,
          color: B.orange,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 9, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.4)',
          marginTop: 3,
        }}
      >
        {label}
      </div>
    </div>
  );
});
StatPill.displayName = 'StatPill';

// ─── Agenda Card ──────────────────────────────────────────────────────────────
// FIX #3: Spotlight via CSS custom properties — zero setState, zero re-renders
// FIX #4: Spotlight div always in DOM, toggled by opacity — no mount/unmount
// FIX #15: Accent via lookup array
const AgendaCard = memo(({ item, index }) => {
  const cardRef  = useRef(null);
  const spotRef  = useRef(null);

  // FIX #15: O(1) lookup
  const accent = AGENDA_ACCENTS[index] ?? B.orange;

  useEffect(() => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    // FIX #11: willChange only during interaction
    const enableCompositing  = () => { card.style.willChange = 'transform'; };
    const disableCompositing = () => { card.style.willChange = 'auto'; };

    // FIX #3: Write CSS custom properties directly — zero React re-renders
    const onMouseMove = (e) => {
      if (getIsTouch()) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;

      spot.style.setProperty('--spot-x', `${x}%`);
      spot.style.setProperty('--spot-y', `${y}%`);
      spot.style.opacity = '1';

      gsap.to(card, {
        rotationY:  ((e.clientX - rect.left) / rect.width  - 0.5) * 10,
        rotationX: -((e.clientY - rect.top)  / rect.height - 0.5) * 10,
        transformPerspective: 900,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onMouseLeave = () => {
      if (getIsTouch()) return;
      spot.style.opacity = '0';
      gsap.to(card, {
        rotationY: 0, rotationX: 0,
        duration: 0.6, ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('mouseenter',  enableCompositing);
    card.addEventListener('mouseleave',  disableCompositing);
    card.addEventListener('mousemove',   onMouseMove,  { passive: true });
    card.addEventListener('mouseleave',  onMouseLeave);

    return () => {
      card.removeEventListener('mouseenter',  enableCompositing);
      card.removeEventListener('mouseleave',  disableCompositing);
      card.removeEventListener('mousemove',   onMouseMove);
      card.removeEventListener('mouseleave',  onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="agenda-item relative rounded-2xl border group overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
        borderColor: `${accent}18`,
        transition: 'border-color 0.4s ease',
        padding: 'clamp(18px, 2.5vw, 26px)',
      }}
    >
      {/* FIX #3+#4: Spotlight always in DOM, driven by CSS vars, toggled by opacity */}
      <div
        ref={spotRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${accent}14 0%, transparent 65%)`,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          '--spot-x': '50%',
          '--spot-y': '50%',
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}45, transparent)`,
        }}
      />

      {/* Hover progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full rounded-full"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${B.accent})`,
          transition: 'width 0.7s ease',
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex gap-4 sm:gap-5">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl font-mono font-bold"
          aria-hidden="true"
          style={{
            width: 44, height: 44, minWidth: 44,
            background: `${accent}12`,
            border: `1px solid ${accent}30`,
            color: accent,
            fontSize: 12,
            letterSpacing: '0.05em',
          }}
        >
          {item.num}
        </div>

        <div>
          <h3
            className="font-bold mb-1.5 group-hover:text-white transition-colors duration-300"
            style={{
              fontSize: 'clamp(13px, 1.4vw, 15px)',
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '-0.01em',
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              fontSize: 'clamp(12px, 1.2vw, 13px)',
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.7,
            }}
          >
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  );
});
AgendaCard.displayName = 'AgendaCard';

// ─── Magnetic CTA Button ──────────────────────────────────────────────────────
// FIX #10: willChange managed via mouseenter/mouseleave
// FIX #14: Shimmer now functional via CSS class
const MagneticButton = memo(({ href, children }) => {
  const btnRef = useRef(null);
  const xTo    = useRef(null);
  const yTo    = useRef(null);

  useEffect(() => {
    if (getIsTouch() || !btnRef.current) return;

    const el = btnRef.current;
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    // FIX #10: willChange only during magnetic interaction
    const onEnter = () => { el.style.willChange = 'transform'; };
    const onLeave = () => {
      xTo.current?.(0);
      yTo.current?.(0);
      el.style.willChange = 'auto';
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (getIsTouch() || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * 0.3);
    yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * 0.3);
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="magnetic-cta relative inline-flex items-center justify-center gap-3 font-bold uppercase overflow-hidden group"
      style={{
        minHeight: 56,
        padding: '16px 40px',
        fontSize: 12,
        letterSpacing: '0.18em',
        background: `linear-gradient(135deg, ${B.orange} 0%, ${B.orangeSoft} 100%)`,
        color: B.bg,
        borderRadius: 4,
        boxShadow: `0 0 32px ${B.orange}35, 0 8px 32px rgba(0,0,0,0.4)`,
        textDecoration: 'none',
        transition: 'box-shadow 0.4s ease',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* FIX #14: Shimmer functional via CSS class in global stylesheet */}
      <span
        aria-hidden="true"
        className="magnetic-cta__shimmer absolute inset-0 pointer-events-none"
      />
      {/* Accent fill on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms]"
        style={{ background: B.accent }}
      />
      <span className="relative z-10">{children}</span>
      <ArrowIcon />
    </a>
  );
});
MagneticButton.displayName = 'MagneticButton';

// ─── Word Span ────────────────────────────────────────────────────────────────
// Extracted to prevent inline ref callback recreation
const WordSpan = memo(({ word, refCallback }) => (
  <span
    ref={refCallback}
    className="ddw-word inline-block"
    style={{
      opacity: 0,
      marginRight: '0.3em',
      transformStyle: 'preserve-3d',
    }}
  >
    {word}
  </span>
));
WordSpan.displayName = 'WordSpan';

// ─── Main Collaborate Section ─────────────────────────────────────────────────
const Collaborate = () => {
  const sectionRef  = useRef(null);
  const badgeRef    = useRef(null);
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const sub1Ref     = useRef(null);
  const sub2Ref     = useRef(null);
  const agendaRef   = useRef(null);
  const ctaRef      = useRef(null);
  const visualRef   = useRef(null);
  const orb1Ref     = useRef(null);
  const orb2Ref     = useRef(null);
  const orb3Ref     = useRef(null);
  const topLineRef  = useRef(null);
  const botLineRef  = useRef(null);

  // FIX #7: Reset word refs before each render
  const wordRefs = useRef([]);
  wordRefs.current = [];

  // FIX #7: Stable ref callback factory per index
  const getWordRef = useCallback(
    (i) => (el) => { wordRefs.current[i] = el; },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // FIX #14: GSAP initial states — never invisible if GSAP fails
    gsap.set(
      [
        badgeRef.current,
        heading2Ref.current,
        sub1Ref.current,
        sub2Ref.current,
        ctaRef.current,
        visualRef.current,
      ],
      { opacity: 0 },
    );

    const ctx = gsap.context(() => {

      // Parallax orbs
      gsap.to(orb1Ref.current, {
        yPercent: -28, ease: 'none',
        scrollTrigger: { trigger: section, scrub: 1.8 },
      });
      gsap.to(orb2Ref.current, {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: section, scrub: 1.4 },
      });
      gsap.to(orb3Ref.current, {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: section, scrub: 2 },
      });

      // Border lines reveal
      gsap.fromTo(
        [topLineRef.current, botLineRef.current],
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 1.4, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top 90%', once: true },
        },
      );

      // Badge
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, x: -32, filter: 'blur(4px)' },
        {
          opacity: 1, x: 0, filter: 'blur(0px)',
          duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: badgeRef.current, start: 'top 88%', once: true },
        },
      );

      // Word-split heading
      const validWords = wordRefs.current.filter(Boolean);
      if (validWords.length) {
        gsap.fromTo(
          validWords,
          { opacity: 0, y: 52, rotationX: -38, skewX: 3 },
          {
            opacity: 1, y: 0, rotationX: 0, skewX: 0,
            duration: 0.9, ease: 'power3.out', stagger: 0.07,
            scrollTrigger: { trigger: heading1Ref.current, start: 'top 84%', once: true },
          },
        );
      }

      // Gradient heading line 2
      gsap.fromTo(
        heading2Ref.current,
        { opacity: 0, y: 36, skewX: 2 },
        {
          opacity: 1, y: 0, skewX: 0,
          duration: 0.95, ease: 'power3.out', delay: 0.55,
          scrollTrigger: { trigger: heading1Ref.current, start: 'top 84%', once: true },
        },
      );

      // Sub copy
      gsap.fromTo(
        [sub1Ref.current, sub2Ref.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: sub1Ref.current, start: 'top 88%', once: true },
        },
      );

      // FIX #9: Agenda cards via direct ref to container children — no querySelector
      if (agendaRef.current?.children) {
        gsap.fromTo(
          Array.from(agendaRef.current.children),
          { opacity: 0, x: -28, scale: 0.97 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.7, ease: 'power3.out', stagger: 0.13,
            scrollTrigger: { trigger: agendaRef.current, start: 'top 86%', once: true },
          },
        );
      }

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 28, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.85, ease: 'back.out(1.7)', delay: 0.1,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', once: true },
        },
      );

      // Visual panel
      gsap.fromTo(
        visualRef.current,
        { opacity: 0, x: 40, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 1.1, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: visualRef.current, start: 'top 82%', once: true },
        },
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: B.bg,
        padding: 'clamp(72px, 9vw, 128px) 0',
      }}
    >
      {/* FIX #1: No @import style tag — fonts in index.html, keyframes in index.css */}

      {/* Top border */}
      <div
        ref={topLineRef}
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px origin-left pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}40, ${B.accent}20, transparent)`,
        }}
      />

      {/* Bottom border */}
      <div
        ref={botLineRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px origin-left pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}25, transparent)`,
        }}
      />

      {/* Mesh grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.032) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)',
          opacity: 0.5,
        }}
      />

      {/* Atmospheric orbs */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '-8%', left: '-6%',
          width: 'clamp(280px, 40vw, 580px)',
          height: 'clamp(280px, 40vw, 580px)',
          background: `radial-gradient(circle, ${B.orange}10 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: '-6%', right: '-5%',
          width: 'clamp(250px, 38vw, 540px)',
          height: 'clamp(250px, 38vw, 540px)',
          background: `radial-gradient(circle, ${B.orange}0D 0%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
      />
      <div
        ref={orb3Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '40%', right: '20%',
          width: 'clamp(180px, 25vw, 360px)',
          height: 'clamp(180px, 25vw, 360px)',
          background: `radial-gradient(circle, ${B.accent}06 0%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
      />

      {/* Main container */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left: Copy Column ─────────────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Eyebrow badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 self-start mb-8 rounded-full"
              style={{
                padding: '10px 20px',
                border: `1px solid ${B.orange}35`,
                background: `${B.orange}0A`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                aria-hidden="true"
                className="collaborate-ping-dot"
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: B.orange,
                  boxShadow: `0 0 10px ${B.orange}`,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.28em',
                  color: B.orange,
                }}
              >
                Discovery Call
              </span>
              <span
                aria-hidden="true"
                className="collaborate-ping-dot collaborate-ping-dot--delayed"
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: B.orange,
                  boxShadow: `0 0 10px ${B.orange}`,
                  display: 'inline-block',
                }}
              />
            </div>

            {/* Heading line 1 — word split */}
            <div
              ref={heading1Ref}
              className="mb-2 overflow-visible"
              style={{ perspective: '1000px' }}
            >
              <h2
                className="font-black leading-[1.08] text-white"
                style={{
                  fontSize: 'clamp(28px, 4.5vw, 58px)',
                  letterSpacing: '-0.03em',
                }}
              >
                {/* FIX #7: stable ref callbacks via getWordRef */}
                {H1_WORDS.map((word, i) => (
                  <React.Fragment key={word + i}>
                    <WordSpan word={word} refCallback={getWordRef(i)} />
                    {i === 5 && <br className="hidden sm:block" />}
                  </React.Fragment>
                ))}
              </h2>
            </div>

            {/* Heading line 2 — gradient */}
            <h2
              ref={heading2Ref}
              className="font-black leading-[1.08] mb-8"
              style={{
                fontSize: 'clamp(28px, 4.5vw, 58px)',
                letterSpacing: '-0.03em',
                background: `linear-gradient(135deg, ${B.orange} 0%, ${B.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              doesn&rsquo;t compound.
            </h2>

            {/* Sub copy */}
            <p
              ref={sub1Ref}
              style={{
                fontSize: 'clamp(14px, 1.5vw, 17px)',
                lineHeight: 1.78,
                color: 'rgba(255,255,255,0.52)',
                maxWidth: 520,
                marginBottom: 12,
              }}
            >
              At $50K/month in ad spend, a 1x improvement in ROAS is worth more
              than the retainer costs in a year. There&rsquo;s one thing we say on
              every first call that most agencies won&rsquo;t. It usually tells you
              in 10 minutes whether we&rsquo;re worth your time.
            </p>
            <p
              ref={sub2Ref}
              className="font-bold"
              style={{
                fontSize: 'clamp(12px, 1.2vw, 14px)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.38)',
                maxWidth: 500,
                marginBottom: 32,
              }}
            >
              Book 20 minutes. Here&rsquo;s what happens on the call:
            </p>

            {/* Agenda cards */}
            {/* FIX #9: Direct children used — no querySelectorAll needed */}
            <div ref={agendaRef} className="flex flex-col gap-3 mb-10">
              {AGENDA.map((item, i) => (
                <AgendaCard key={item.num} item={item} index={i} />
              ))}
            </div>

            {/* CTA block */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <MagneticButton href={CALENDLY_URL}>
                Book the 20-Minute Call
              </MagneticButton>

              {/* Trust micro-copy */}
              {/* FIX #16: TRUST_LINES from module scope */}
              <div className="flex flex-col gap-1">
                {TRUST_LINES.map((line) => (
                  <div key={line} className="flex items-center gap-2">
                    <CheckIcon />
                    <span
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.32)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Visual Panel ───────────────────────────────────────── */}
          <div
            ref={visualRef}
            className="relative hidden lg:block"
            style={{ height: 'clamp(360px, 45vw, 520px)' }}
          >
            <BrowserMockup>
              <div
                className="relative overflow-hidden"
                style={{
                  height: 'calc(100% - 37px)',
                  background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${B.orange}07 0%, ${B.bg} 100%)`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(${B.orange}22 1px, transparent 1px)`,
                    backgroundSize: '22px 22px',
                    opacity: 0.04,
                  }}
                />
                <AbstractCTAVisual />

                <div
                  aria-hidden="true"
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 font-black pointer-events-none select-none whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(40px, 6vw, 90px)',
                    color: B.orange,
                    opacity: 0.04,
                    letterSpacing: '-0.04em',
                  }}
                >
                  DDW
                </div>
              </div>
            </BrowserMockup>

            {/* Floating stat pills */}
            {PILLS.map((pill) => (
              <StatPill
                key={pill.label}
                value={pill.value}
                label={pill.label}
                delay={pill.delay}
                pos={pill.pos}
              />
            ))}

            {/* Glow halo */}
            <div
              aria-hidden="true"
              className="absolute -z-10 rounded-3xl pointer-events-none"
              style={{
                inset: '-8%',
                background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${B.orange}14 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Collaborate;