// src/components/Testimonial/index.jsx
// DDW Agency — Verified Channel Wins | Optimized | Production-Ready

import React, { useEffect, useRef, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
// FIX #12: Frozen — prevents accidental mutation
const BRAND = Object.freeze({
  orange:     '#FF570F',
  orangeSoft: '#EE7D1D',
  accent:     '#FDE87A',
  bg:         '#080a0c',
  bgCard:     '#0d1012',
  bgCardAlt:  '#0a0c0e',
});

// ─── FIX #3: isTouch singleton — one matchMedia, computed once ────────────────
const _mq =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)')
    : null;

let _isTouch =
  typeof window !== 'undefined'
    ? (_mq?.matches || navigator.maxTouchPoints > 0)
    : false;

if (_mq) {
  _mq.addEventListener('change', (e) => {
    _isTouch = e.matches || navigator.maxTouchPoints > 0;
  });
}

const getIsTouch = () => _isTouch;

// ─── Static Data ──────────────────────────────────────────────────────────────
// FIX #11: Fully frozen at all levels
const RESULTS = Object.freeze([
  Object.freeze({
    value: '$683K',  label: 'Monthly Meta Spend',
    context: '343 campaigns · 5.48x avg ROAS',
    client:  'EU fashion & golf brand — 12+ month retainer',
    accent: '#FF570F', channel: 'Meta Ads', icon: '◈',
    floatPill: Object.freeze({ label: '5.48x ROAS', delay: 0 }),
  }),
  Object.freeze({
    value: '$2.7M+', label: 'Amazon Sales Managed',
    context: '27.64% ACOS · 129,800 orders',
    client:  'US Amazon brand — managed since 2015',
    accent: '#EE7D1D', channel: 'Amazon', icon: '◉',
    floatPill: Object.freeze({ label: '129.8K Orders', delay: 0.4 }),
  }),
  Object.freeze({
    value: '600%',  label: 'Google Ads ROAS',
    context: '€418K revenue on €69.7K spend',
    client:  'EU video door intercom brand',
    accent: '#FF570F', channel: 'Google Ads', icon: '◎',
    floatPill: Object.freeze({ label: '€418K Revenue', delay: 0.8 }),
  }),
  Object.freeze({
    value: '$290K', label: '7-Day TikTok GMV',
    context: '9,010 orders · +121% order growth',
    client:  'E-commerce brand — full shop setup & affiliate management',
    accent: '#EE7D1D', channel: 'TikTok Shop', icon: '◇',
    floatPill: Object.freeze({ label: '+121% Growth', delay: 0.2 }),
  }),
  Object.freeze({
    value: '54K',   label: 'Monthly SEO Visitors',
    context: 'From 2K to 54K — 251K total clicks',
    client:  'Syncwire e-commerce — full SEO retainer',
    accent: '#FDE87A', channel: 'SEO', icon: '◆',
    floatPill: Object.freeze({ label: '251K Clicks', delay: 0.6 }),
  }),
  Object.freeze({
    value: '978+',  label: 'AI Calls Handled',
    context: '24/7 · Books appointments · Qualifies leads',
    client:  "Lyra — DDW's own AI voice receptionist SaaS",
    accent: '#FF570F', channel: 'AI SaaS', icon: '◈',
    floatPill: Object.freeze({ label: '24/7 Active', delay: 1.0 }),
  }),
]);

// FIX #13: Mini stats at module scope
const FOOTER_STATS = Object.freeze([
  { val: '6',      lbl: 'Channels'         },
  { val: '$3.7M+', lbl: 'Revenue Managed'  },
  { val: '100%',   lbl: 'Retainer Based'   },
]);

const CHANNEL_BARS = Object.freeze([
  { label: 'Meta',   pct: 92, accent: '#FF570F', delay: 0.1 },
  { label: 'Amazon', pct: 85, accent: '#EE7D1D', delay: 0.2 },
  { label: 'Google', pct: 78, accent: '#FF570F', delay: 0.3 },
  { label: 'TikTok', pct: 70, accent: '#EE7D1D', delay: 0.4 },
  { label: 'SEO',    pct: 65, accent: '#FDE87A', delay: 0.5 },
  { label: 'AI SaaS', pct: 88, accent: '#FF570F', delay: 0.6 },
]);

// FIX #4: Pre-computed stable bar animation config — no random in effects
const DATA_VISUAL_BAR_CONFIG = Object.freeze([
  { scaleY: 0.52, duration: 1.6 }, { scaleY: 0.88, duration: 2.1 },
  { scaleY: 0.67, duration: 1.3 }, { scaleY: 0.95, duration: 2.3 },
  { scaleY: 0.40, duration: 1.8 }, { scaleY: 0.78, duration: 1.5 },
  { scaleY: 0.61, duration: 2.0 }, { scaleY: 0.83, duration: 2.2 },
  { scaleY: 0.35, duration: 1.4 }, { scaleY: 0.70, duration: 1.9 },
  { scaleY: 0.55, duration: 2.4 }, { scaleY: 0.92, duration: 1.7 },
]);

const BAR_HEIGHTS = Object.freeze([40, 65, 50, 80, 45, 70, 55, 90, 35, 75, 60, 85]);

const CALENDLY = 'https://calendly.com/digi-dreamworks/onboarding-call';

// ─── Shared SVG ───────────────────────────────────────────────────────────────
const ArrowIcon = memo(() => (
  <svg
    width="16" height="16" viewBox="0 0 16 16"
    fill="none" aria-hidden="true"
    className="transition-transform duration-300 group-hover/btn:translate-x-1"
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
));
ArrowIcon.displayName = 'ArrowIcon';

// ─── Abstract Data Visual ─────────────────────────────────────────────────────
// FIX #4: Stable bar config at module scope — no gsap.utils.random in effect
// FIX #5: barsRef reset before population
// FIX #6: gsap.context() handles all cleanup
const DataVisual = memo(() => {
  const containerRef = useRef(null);
  const ringRef      = useRef(null);
  const nodeRef      = useRef(null);
  const barsRef      = useRef([]);

  useEffect(() => {
    // FIX #5: Reset before population
    barsRef.current = [];

    // FIX #6: All tweens inside context — automatic cleanup on revert()
    const ctx = gsap.context(() => {
      // Pulse ring
      gsap.to(ringRef.current, {
        scale: 1.18, opacity: 0.15,
        duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });

      // Node glow — boxShadow is not compositor-eligible but acceptable for
      // a small isolated element. Kept for visual fidelity.
      gsap.to(nodeRef.current, {
        boxShadow: '0 0 32px 8px #FF570F60',
        duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });

      // FIX #4: Stable config — no gsap.utils.random() in effect
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const cfg = DATA_VISUAL_BAR_CONFIG[i];
        gsap.to(bar, {
          scaleY: cfg.scaleY,
          duration: cfg.duration,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.15,
          transformOrigin: 'bottom',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Orbit rings — CSS class from global stylesheet (FIX #14) */}
      <div
        className="absolute rounded-full border border-dashed border-white/5 testimonial-spin-cw"
        style={{ width: 220, height: 220 }}
      />
      <div
        className="absolute rounded-full border border-dashed border-white/[0.07] testimonial-spin-ccw"
        style={{ width: 150, height: 150 }}
      />

      {/* Pulse ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full"
        style={{
          width: 90, height: 90,
          background: 'radial-gradient(circle, #FF570F20 0%, transparent 70%)',
          border: '1px solid #FF570F30',
          opacity: 0.3,
        }}
      />

      {/* Center node */}
      <div
        ref={nodeRef}
        className="absolute rounded-full z-10"
        style={{
          width: 20, height: 20,
          background: 'radial-gradient(circle, #FF570F 0%, #EE7D1D 100%)',
          boxShadow: '0 0 16px 4px #FF570F40',
        }}
      />

      {/* Data bars */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className="rounded-t-sm"
            style={{
              width: 4,
              height: h * 0.5,
              transformOrigin: 'bottom',
              background:
                i % 3 === 0 ? '#FF570F'
                : i % 3 === 1 ? '#EE7D1D50'
                : '#FDE87A30',
            }}
          />
        ))}
      </div>
    </div>
  );
});
DataVisual.displayName = 'DataVisual';

// ─── Floating Pill ────────────────────────────────────────────────────────────
// FIX #7: Tween stored and killed on cleanup
const FloatingPill = memo(({ label, accent, delay, style: posStyle }) => {
  const pillRef  = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!pillRef.current) return;

    tweenRef.current = gsap.to(pillRef.current, {
      y: -10, duration: 2,
      repeat: -1, yoyo: true,
      ease: 'sine.inOut', delay,
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [delay]);

  return (
    <div
      ref={pillRef}
      className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full z-20 pointer-events-none"
      style={{
        background: `${accent}18`,
        border: `1px solid ${accent}35`,
        color: accent,
        backdropFilter: 'blur(8px)',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        ...posStyle,
      }}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: accent }}
      />
      {label}
    </div>
  );
});
FloatingPill.displayName = 'FloatingPill';

// ─── Channel Bar ──────────────────────────────────────────────────────────────
// FIX #8: Animate scaleX (compositor) instead of width (layout trigger)
//         ScrollTrigger cleaned up via gsap.context()
const ChannelBar = memo(({ label, pct, accent, delay }) => {
  const barRef       = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;

    const ctx = gsap.context(() => {
      // FIX #8: scaleX on transform — compositor-eligible, zero layout recalculation
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: pct / 100,
          duration: 1.2,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            once: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [pct, delay]);

  return (
    <div ref={containerRef} className="flex items-center gap-3 mb-3">
      <span
        className="text-[10px] font-bold uppercase w-20 flex-shrink-0"
        style={{
          color: accent,
          letterSpacing: '0.18em',
        }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-white/[0.06] relative">
        {/* FIX #8: Full-width bar, scaleX animates from 0 to pct/100 */}
        <div
          ref={barRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full w-full"
          style={{
            background: accent,
            transformOrigin: 'left center',
            transform: 'scaleX(0)', // Initial state
          }}
        />
      </div>
      <span className="text-[10px] text-white/30">{pct}%</span>
    </div>
  );
});
ChannelBar.displayName = 'ChannelBar';

// ─── Result Card ──────────────────────────────────────────────────────────────
// FIX #2:  Spotlight via CSS custom properties — zero setState, zero re-renders
// FIX #9:  Spotlight always in DOM, opacity toggled — no mount/unmount
// FIX #16: Single event handler drives both tilt and spotlight
const ResultCard = memo(({ item }) => {
  const cardRef = useRef(null);
  const spotRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    // FIX #3: Module-level singleton — no per-instance matchMedia
    const enableCompositing  = () => { card.style.willChange = 'transform'; };
    const disableCompositing = () => { card.style.willChange = 'auto'; };

    // FIX #2+#16: Single handler drives both GSAP tilt AND CSS-var spotlight
    // Zero React re-renders — everything via direct DOM writes
    const onMouseMove = (e) => {
      if (getIsTouch()) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width;
      const dy = (e.clientY - rect.top)  / rect.height;

      // Spotlight via CSS custom properties
      spot.style.setProperty('--spot-x', `${dx * 100}%`);
      spot.style.setProperty('--spot-y', `${dy * 100}%`);
      spot.style.opacity = '1';

      // 3D tilt via GSAP
      gsap.to(card, {
        rotationY: (dx - 0.5) * 16,
        rotationX: -(dy - 0.5) * 16,
        transformPerspective: 900,
        ease: 'power2.out',
        duration: 0.5,
        overwrite: 'auto',
      });
    };

    const onMouseLeave = () => {
      if (getIsTouch()) return;
      spot.style.opacity = '0';
      gsap.to(card, {
        rotationY: 0, rotationX: 0,
        duration: 0.7, ease: 'power3.out',
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
      className="result-stat relative rounded-2xl overflow-hidden border border-white/[0.06] group cursor-default"
      style={{
        background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bgCardAlt} 100%)`,
      }}
    >
      {/* FIX #2+#9: Always in DOM, CSS-var driven, opacity toggled — zero re-renders */}
      <div
        ref={spotRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${item.accent}14 0%, transparent 65%)`,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          '--spot-x': '50%',
          '--spot-y': '50%',
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${item.accent} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Corner glow */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${item.accent}35 0%, transparent 70%)`,
          filter: 'blur(24px)',
        }}
      />

      {/* Watermark */}
      <div
        aria-hidden="true"
        className="absolute -bottom-4 -right-3 font-black pointer-events-none select-none leading-none"
        style={{
          fontSize: 'clamp(60px, 8vw, 120px)',
          color: item.accent, opacity: 0.04,
          letterSpacing: '-0.04em',
        }}
      >
        {item.value}
      </div>

      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accent}50, transparent)`,
        }}
      />

      {/* Bottom progress on hover */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-full"
        style={{ background: `linear-gradient(90deg, ${item.accent}, ${BRAND.accent})` }}
      />

      {/* Floating pill */}
      <FloatingPill
        label={item.floatPill.label}
        accent={item.accent}
        delay={item.floatPill.delay}
        style={{ top: 12, right: 12 }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-7">
        {/* Channel tag */}
        <div
          className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border"
          style={{
            borderColor: `${item.accent}35`,
            color: item.accent,
            background: `${item.accent}10`,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.channel}
        </div>

        {/* Stat value */}
        <div
          className="font-black leading-none mb-2"
          style={{
            fontSize: 'clamp(36px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            color: item.accent,
          }}
        >
          {item.value}
        </div>

        {/* Label */}
        <div className="text-white font-bold text-xs uppercase mb-4"
          style={{ letterSpacing: '0.18em' }}>
          {item.label}
        </div>

        {/* Divider */}
        <div
          className="w-10 h-px mb-4 transition-all duration-500 group-hover:w-16"
          style={{ background: `${item.accent}55` }}
        />

        {/* Context */}
        <p className="text-white/45 text-xs leading-relaxed mb-2">
          {item.context}
        </p>

        {/* Client */}
        <p className="text-white/25 text-[11px] leading-relaxed">
          {item.client}
        </p>
      </div>
    </div>
  );
});
ResultCard.displayName = 'ResultCard';

// ─── Magnetic CTA Button ──────────────────────────────────────────────────────
// FIX #15: quickTo instances cleaned up on unmount
const MagneticButton = memo(({ href, children, className }) => {
  const btnRef = useRef(null);
  const xTo    = useRef(null);
  const yTo    = useRef(null);

  useEffect(() => {
    if (getIsTouch() || !btnRef.current) return;

    const el = btnRef.current;
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

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
    xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * 0.35);
    yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * 0.35);
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onMouseMove={handleMouseMove}
    >
      {children}
    </a>
  );
});
MagneticButton.displayName = 'MagneticButton';

// ─── Results Grid ─────────────────────────────────────────────────────────────
// Extracted so we can hold a direct ref for GSAP targeting — FIX #10
const ResultsGrid = memo(({ gridRef }) => (
  <div
    ref={gridRef}
    className="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12 md:mb-16"
  >
    {RESULTS.map((item) => (
      <ResultCard key={item.label} item={item} />
    ))}
  </div>
));
ResultsGrid.displayName = 'ResultsGrid';

// ─── Main Testimonial Section ─────────────────────────────────────────────────
const Testimonial = () => {
  const sectionRef  = useRef(null);
  const headingRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const subtitleRef = useRef(null);
  const footerRef   = useRef(null);
  const orb1Ref     = useRef(null);
  const orb2Ref     = useRef(null);
  const lineRef     = useRef(null);
  const visualRef   = useRef(null);
  // FIX #10: Direct ref to grid container — no querySelectorAll
  const gridRef     = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // FIX (from prior components): gsap.set initial states — never invisible if GSAP fails
    gsap.set(
      [
        eyebrowRef.current,
        headingRef.current,
        subtitleRef.current,
        footerRef.current,
        visualRef.current,
        lineRef.current,
      ],
      { opacity: 0 },
    );

    const ctx = gsap.context(() => {

      // Orb drift
      gsap.to(orb1Ref.current, {
        x: 40, y: -30,
        duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        x: -30, y: 20,
        duration: 10, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: 2,
      });

      // Top line reveal
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 90%', once: true },
        },
      );

      // Eyebrow
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%', once: true },
        },
      );

      // Heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50, skewX: 2 },
        {
          opacity: 1, y: 0, skewX: 0,
          duration: 1, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%', once: true },
        },
      );

      // Subtitle
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out', delay: 0.3,
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%', once: true },
        },
      );

      // FIX #10: Direct ref to grid children — no querySelectorAll
      if (gridRef.current?.children) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
          },
        );
      }

      // Footer
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%', once: true },
        },
      );

      // Visual panel
      gsap.fromTo(
        visualRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: visualRef.current, start: 'top 85%', once: true },
        },
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: BRAND.bg }}
    >
      {/* FIX #1: No @import style tag — CSS in index.css */}

      {/* Atmospheric orbs */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '-10%', left: '-8%',
          width: 'clamp(300px, 40vw, 600px)',
          height: 'clamp(300px, 40vw, 600px)',
          background: `radial-gradient(circle, ${BRAND.orange}18 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: '5%', right: '-10%',
          width: 'clamp(250px, 35vw, 500px)',
          height: 'clamp(250px, 35vw, 500px)',
          background: `radial-gradient(circle, ${BRAND.orangeSoft}14 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      {/* Mesh grid — FIX #17: will-change to promote layer for opacity animation */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none testimonial-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          willChange: 'opacity', // FIX #17: promote for compositor-driven opacity
        }}
      />

      {/* Top border line */}
      <div
        ref={lineRef}
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px origin-left pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND.orange}35, ${BRAND.accent}25, transparent)`,
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10"
        style={{ padding: 'clamp(64px, 8vw, 120px) 0' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">

          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-14 md:mb-20">

            {/* Left: copy */}
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div
                ref={eyebrowRef}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 md:mb-8"
                style={{
                  borderColor: `${BRAND.orange}25`,
                  background: `${BRAND.orange}08`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: BRAND.orange,
                    boxShadow: `0 0 6px ${BRAND.orange}`,
                  }}
                />
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ color: BRAND.orange, letterSpacing: '0.22em' }}
                >
                  Verified Results — Six Channels
                </span>
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: `${BRAND.accent}80` }}
                />
              </div>

              {/* Heading */}
              <h2
                ref={headingRef}
                className="font-black mb-5 leading-[1.05]"
                style={{
                  fontSize: 'clamp(34px, 5vw, 64px)',
                  letterSpacing: '-0.03em',
                  color: '#fff',
                }}
              >
                Six channels.{' '}
                <span
                  className="inline-block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${BRAND.orange} 0%, ${BRAND.accent} 100%)`,
                  }}
                >
                  All proven.
                </span>
              </h2>

              {/* Subtitle */}
              <p
                ref={subtitleRef}
                className="leading-relaxed text-sm md:text-base"
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  maxWidth: '540px',
                }}
              >
                Every number is pulled from a live account. We manage Meta, Google,
                Amazon, TikTok, SEO, and our own AI software — one team, fully on
                retainer.
              </p>
            </div>

            {/* Right: channel bar visual */}
            <div
              ref={visualRef}
              className="relative flex-shrink-0 w-full lg:w-64 xl:w-72 h-48 lg:h-56 rounded-2xl overflow-hidden border border-white/[0.06] hidden sm:flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bgCardAlt} 100%)`,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(${BRAND.orange} 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${BRAND.orange}40, transparent)`,
                }}
              />
              <div className="relative z-10 w-full px-6 py-4">
                <p
                  className="text-[9px] font-bold uppercase mb-4"
                  style={{ color: `${BRAND.orange}80`, letterSpacing: '0.22em' }}
                >
                  Channel Performance
                </p>
                {CHANNEL_BARS.map((bar) => (
                  <ChannelBar
                    key={bar.label}
                    label={bar.label}
                    pct={bar.pct}
                    accent={bar.accent}
                    delay={bar.delay}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* FIX #10: ResultsGrid holds its own ref — no querySelectorAll */}
          <ResultsGrid gridRef={gridRef} />

          {/* Footer proof bar */}
          <div
            ref={footerRef}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 p-6 md:p-7 rounded-2xl border border-white/[0.06] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${BRAND.bgCard}ee 0%, ${BRAND.bgCardAlt}ee 100%)`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${BRAND.orange} 1px, transparent 1px)`,
                backgroundSize: '22px 22px',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${BRAND.orange}30, transparent)`,
              }}
            />

            {/* Left copy */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: BRAND.orange,
                    boxShadow: `0 0 8px ${BRAND.orange}`,
                  }}
                />
                <p className="font-bold text-sm text-white">
                  All results are from active retainer clients.
                </p>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.38)',
                  paddingLeft: '18px',
                }}
              >
                Dashboard screenshots available on request. US + EU accounts.
                Florida LLC with offices in Florida and Rome.
              </p>

              {/* FIX #13: FOOTER_STATS from module scope */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pl-[18px]">
                {FOOTER_STATS.map((s, i) => (
                  <div key={s.lbl} className="flex items-center gap-2">
                    <span
                      className="font-black text-sm"
                      style={{ color: BRAND.orange, letterSpacing: '-0.02em' }}
                    >
                      {s.val}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.28)' }}
                    >
                      {s.lbl}
                    </span>
                    {i < FOOTER_STATS.length - 1 && (
                      <span aria-hidden="true" className="w-px h-3 bg-white/10 ml-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
              <MagneticButton
                href={CALENDLY}
                className="flex items-center justify-center gap-3 min-h-[52px] px-8 py-4 rounded-xl font-bold text-sm uppercase w-full md:w-auto group/btn"
                style={{
                  letterSpacing: '0.14em',
                  background: `linear-gradient(135deg, ${BRAND.orange} 0%, ${BRAND.orangeSoft} 100%)`,
                  color: '#080a0c',
                  boxShadow: `0 0 24px ${BRAND.orange}30`,
                  textDecoration: 'none',
                  display: 'flex',
                }}
              >
                <span>Book a 20-Min Call</span>
                <ArrowIcon />
              </MagneticButton>
              <p
                className="text-center text-[10px] mt-2.5 uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.22)' }}
              >
                No commitment · 20 minutes
              </p>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div
            aria-hidden="true"
            className="mt-16 md:mt-20 h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${BRAND.orange}15, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonial;