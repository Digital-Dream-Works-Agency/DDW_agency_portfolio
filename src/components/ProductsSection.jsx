// src/components/ProductsSection/index.jsx
// DDW — Own SaaS Products | Optimized | Production-Ready

import React, { useEffect, useRef, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── FIX #1: isTouch singleton — computed once at module load ─────────────────
const _mq =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)')
    : null;

let _isMobile =
  typeof window !== 'undefined'
    ? (_mq?.matches ?? false)
    : false;

if (_mq) {
  _mq.addEventListener('change', (e) => { _isMobile = e.matches; });
}

const getIsMobile = () => _isMobile;

// ─── FIX #9: Pre-compute maxBar per product — never computed in render ────────
function computeMaxBar(bars) {
  let max = 0;
  for (let i = 0; i < bars.length; i++) {
    if (bars[i] > max) max = bars[i];
  }
  return max;
}

// ─── FIX #11: Fully frozen static data ───────────────────────────────────────
const PRODUCTS = Object.freeze([
  Object.freeze({
    name:             'Lyra',
    tagline:          'AI Voice Receptionist',
    description:
      'Every missed call is a missed customer. Lyra answers every call 24/7, books appointments into your calendar, qualifies leads, and sends follow-up messages — without a single human receptionist. Built on Twilio, AWS, and Google Cloud. Powered by DDW.',
    url:              'https://lyrabyddw.com',
    stats: Object.freeze([
      Object.freeze({ value: '978+', label: 'Calls Handled' }),
      Object.freeze({ value: '24/7',  label: 'Availability'  }),
      Object.freeze({ value: '0',     label: 'Missed Calls'  }),
    ]),
    accent:          '#FF570F',
    accentSoft:      '#EE7D1D',
    tags:            Object.freeze(['AI SaaS', 'Voice AI', 'Twilio + AWS']),
    bars:            Object.freeze([60, 85, 45, 100, 70, 90, 55, 78, 65, 95]),
    maxBar:          100, // FIX #9: pre-computed
    mockupLabel:     'lyra.dashboard',
    mockupMetric:    '978+',
    mockupMetricLabel: 'Calls Handled',
    pillTop:         Object.freeze({ value: '24/7', label: 'Always On'    }),
    pillBottom:      Object.freeze({ value: '0',    label: 'Missed Calls' }),
  }),
  Object.freeze({
    name:             'Sviluppiamo.dev',
    tagline:          'Vibe Coding Platform — Italy Market',
    description:
      'The Italian-market vibe coding platform. Sviluppiamo.dev connects Italian developers and businesses with AI-assisted software building — a product DDW built, owns, and operates. Part of our growing portfolio of market-specific SaaS tools.',
    url:              'https://sviluppiamo.dev',
    stats: Object.freeze([
      Object.freeze({ value: 'IT',   label: 'Market'  }),
      Object.freeze({ value: 'AI',   label: 'Powered' }),
      Object.freeze({ value: 'Live', label: 'Status'  }),
    ]),
    accent:          '#FDE87A',
    accentSoft:      '#EE7D1D',
    tags:            Object.freeze(['SaaS', 'Italy Market', 'Built by DDW']),
    bars:            Object.freeze([40, 70, 55, 88, 50, 95, 60, 75, 45, 82]),
    maxBar:          95, // FIX #9: pre-computed
    mockupLabel:     'sviluppiamo.dev',
    mockupMetric:    'Live',
    mockupMetricLabel: 'Platform Status',
    pillTop:         Object.freeze({ value: 'IT', label: 'Market'  }),
    pillBottom:      Object.freeze({ value: 'AI', label: 'Powered' }),
  }),
]);

// ─── Shared SVG ───────────────────────────────────────────────────────────────
const ExternalLinkIcon = memo(() => (
  <svg
    width="16" height="16" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    viewBox="0 0 24 24" aria-hidden="true"
    className="product-cta-icon"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
));
ExternalLinkIcon.displayName = 'ExternalLinkIcon';

// ─── Floating Stat Pill ───────────────────────────────────────────────────────
// FIX #13: Pulse dot uses a shared CSS class — not Tailwind animate-pulse per instance
const FloatingPill = memo(({ value, label, accent, pillRef, style: posStyle }) => (
  <div
    ref={pillRef}
    className="absolute z-20 flex items-center gap-2 rounded-xl pointer-events-none"
    style={{
      padding: '8px 14px',
      background: 'rgba(8,10,12,0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: `1px solid ${accent}35`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      ...posStyle,
    }}
  >
    {/* FIX #13: shared CSS class instead of per-element animate-pulse */}
    <div
      aria-hidden="true"
      className="product-pulse-dot w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ background: accent }}
    />
    <div>
      <div className="font-black leading-none" style={{ fontSize: 13, color: accent }}>
        {value}
      </div>
      <div
        className="uppercase leading-none mt-0.5"
        style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}
      >
        {label}
      </div>
    </div>
  </div>
));
FloatingPill.displayName = 'FloatingPill';

// ─── Mac Mockup ───────────────────────────────────────────────────────────────
// FIX #9:  maxBar pre-computed in data — no Math.max in render
// FIX #15: Bars keyed by index+value — stable for static data
const MacMockup = memo(({ product }) => (
  <div
    className="relative w-full rounded-2xl overflow-hidden flex flex-col"
    style={{
      background: 'rgba(10,11,13,0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow:
        '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
      minHeight: 260,
    }}
  >
    {/* Title bar */}
    <div
      className="flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
      }}
      aria-hidden="true"
    >
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
      </div>
      <div
        className="flex-1 mx-4 px-3 py-1 rounded-md flex items-center gap-2"
        style={{ background: 'rgba(255,255,255,0.04)', maxWidth: 220 }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: product.accent, opacity: 0.7 }}
        />
        <span
          className="font-mono"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}
        >
          {product.mockupLabel}
        </span>
      </div>
      <div className="w-14" />
    </div>

    {/* Dashboard body */}
    <div className="flex-1 p-5 flex flex-col gap-4">
      {/* Top metric */}
      <div className="flex items-start justify-between">
        <div>
          <div
            className="font-black leading-none mb-1"
            style={{
              fontSize: 'clamp(30px, 4vw, 40px)',
              background: `linear-gradient(135deg, ${product.accent}, #FDE87A)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {product.mockupMetric}
          </div>
          <div
            className="uppercase font-bold"
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em' }}
          >
            {product.mockupMetricLabel}
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background: `${product.accent}15`, border: `1px solid ${product.accent}30` }}
        >
          <div
            aria-hidden="true"
            className="product-pulse-dot w-1.5 h-1.5 rounded-full"
            style={{ background: product.accent }}
          />
          <span
            className="font-bold uppercase"
            style={{ fontSize: 9, color: product.accent, letterSpacing: '0.16em' }}
          >
            Live
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex items-end gap-1.5" style={{ minHeight: 80 }}>
        {product.bars.map((h, i) => (
          <div
            key={`${i}-${h}`}
            className="flex-1 flex flex-col justify-end"
            style={{ height: '100%' }}
          >
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${h}%`,
                // FIX #9: maxBar from frozen product data — zero runtime computation
                background:
                  h === product.maxBar
                    ? `linear-gradient(to top, ${product.accent}, #FDE87A)`
                    : `${product.accent}25`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div
        className="flex gap-5 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {product.stats.map((s) => (
          <div key={s.label}>
            <div
              className="font-black"
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}
            >
              {s.value}
            </div>
            <div
              className="uppercase"
              style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em' }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));
MacMockup.displayName = 'MacMockup';

// ─── CTA Button ───────────────────────────────────────────────────────────────
// FIX #3:  Removed dead ternary — both branches were identical
// FIX #3:  Removed hovered state — all hover effects via CSS classes
// FIX #12: willChange managed on mouseenter/mouseleave — not permanent
const CTAButton = memo(({ product }) => {
  const btnRef = useRef(null);
  const xTo    = useRef(null);
  const yTo    = useRef(null);

  useEffect(() => {
    if (getIsMobile() || !btnRef.current) return;

    const el = btnRef.current;
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    // FIX #12: willChange only during magnetic interaction
    const onEnter = () => { el.style.willChange = 'transform'; };
    const onLeave = () => {
      xTo.current?.(0);
      yTo.current?.(0);
      el.style.willChange = 'auto';
    };
    const onMove  = (e) => {
      const rect = el.getBoundingClientRect();
      xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * 0.3);
      yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * 0.3);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove',  onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="product-cta-btn relative inline-flex items-center gap-3 font-bold uppercase overflow-hidden group"
      style={{
        padding: '14px 30px',
        background: product.accent,
        color: '#080a0c',
        fontSize: 12,
        letterSpacing: '0.18em',
        minHeight: 52,
        textDecoration: 'none',
        // FIX #12: No willChange here — managed via event listeners above
        boxShadow: `0 6px 28px ${product.accent}35`,
      }}
    >
      {/* FIX: Shimmer via CSS class — actually functional */}
      <span
        aria-hidden="true"
        className="product-cta-shimmer absolute inset-0 pointer-events-none"
      />
      <span className="relative z-10 flex items-center gap-3">
        Visit {product.name}
        <ExternalLinkIcon />
      </span>
    </a>
  );
});
CTAButton.displayName = 'CTAButton';

// ─── Product Card ─────────────────────────────────────────────────────────────
// FIX #2:  All spotlight/hover state removed — CSS custom properties + CSS classes
// FIX #4:  Single mousemove handler — drives GSAP tilt + CSS-var spotlight
// FIX #5:  Border color via CSS class — not split between DOM mutation and JSX
// FIX #6:  Hover-driven styles via CSS classes in global stylesheet
// FIX #7:  gsap.context() wraps all tweens — proper cleanup
// FIX #8:  Pill timeline consolidated into single context
const ProductCard = memo(({ product, index }) => {
  const wrapRef  = useRef(null);
  const cardRef  = useRef(null);
  const spotRef  = useRef(null);
  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!wrap || !card) return;

    // FIX #16: gsap.set initial state — never invisible if GSAP fails
    gsap.set(wrap, { opacity: 0, y: 50 });

    // FIX #7+#8: Single context wraps scroll animation + pill animations
    const ctx = gsap.context(() => {

      // Scroll fade-up
      gsap.to(wrap, {
        opacity: 1, y: 0,
        duration: 0.9, ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 86%',
          once: true,
        },
      });

      // Floating pills
      const p1 = pill1Ref.current;
      const p2 = pill2Ref.current;
      if (p1 && p2) {
        gsap.to(p1, {
          y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
        gsap.to(p2, {
          y: -8, duration: 1.8, repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: 0.5,
        });
      }

    }, wrap);

    // FIX #4+#5: All interaction via native listeners — zero React state
    const enableCompositing  = () => {
      card.style.willChange = 'transform';
      card.classList.add('product-card--hovered');
    };
    const disableCompositing = () => {
      card.style.willChange = 'auto';
      card.classList.remove('product-card--hovered');
    };

    const onMouseMove = (e) => {
      if (getIsMobile()) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);

      // FIX #4: CSS custom properties for spotlight — zero re-renders
      if (spot) {
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        spot.style.setProperty('--spot-x', `${x}%`);
        spot.style.setProperty('--spot-y', `${y}%`);
        spot.style.opacity = '1';
      }

      gsap.to(card, {
        rotationY: dx * 5,
        rotationX: -dy * 3.5,
        transformPerspective: 1100,
        ease: 'power2.out',
        duration: 0.4,
        overwrite: 'auto',
      });
    };

    const onMouseLeave = () => {
      if (getIsMobile()) return;
      if (spot) spot.style.opacity = '0';
      gsap.to(card, {
        rotationX: 0, rotationY: 0,
        duration: 0.7, ease: 'elastic.out(1, 0.75)',
        overwrite: 'auto',
      });
    };

    card.addEventListener('mouseenter',  enableCompositing);
    card.addEventListener('mouseleave',  disableCompositing);
    card.addEventListener('mousemove',   onMouseMove,  { passive: true });
    card.addEventListener('mouseleave',  onMouseLeave);

    return () => {
      ctx.revert();
      card.removeEventListener('mouseenter',  enableCompositing);
      card.removeEventListener('mouseleave',  disableCompositing);
      card.removeEventListener('mousemove',   onMouseMove);
      card.removeEventListener('mouseleave',  onMouseLeave);
    };
  }, [index]);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        ref={cardRef}
        className="product-card relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0e1114 0%, #080a0c 100%)',
          border: `1px solid ${product.accent}18`,
          transformStyle: 'preserve-3d',
          // FIX #6: hover styles via CSS class .product-card--hovered
        }}
      >
        {/* FIX #2+#14: Spotlight always in DOM, CSS-var driven, no gradient transition */}
        <div
          ref={spotRef}
          className="absolute inset-0 z-10 pointer-events-none hidden md:block"
          style={{
            background: `radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${product.accent}0D, transparent 70%)`,
            opacity: 0,
            // FIX #14: Transition only on opacity — NOT on background/gradient position
            transition: 'opacity 0.2s ease',
            '--spot-x': '50%',
            '--spot-y': '50%',
          }}
        />

        {/* Dot grid watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${product.accent}20 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
            opacity: 0.7,
          }}
        />

        {/* Ambient glow — CSS transition via class */}
        <div
          aria-hidden="true"
          className="product-card-glow absolute top-0 right-0 pointer-events-none rounded-2xl"
          style={{
            width: 'clamp(200px, 40%, 320px)',
            height: 'clamp(200px, 40%, 320px)',
            background: `radial-gradient(circle at top right, ${product.accent}18, transparent 70%)`,
            filter: 'blur(40px)',
            // FIX #6: opacity controlled by CSS class — not React state
          }}
        />

        {/* Watermark name */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0.04 }}
        >
          <div
            className="font-black leading-none"
            style={{ fontSize: 'clamp(80px, 10vw, 160px)', color: product.accent }}
          >
            {product.name}
          </div>
        </div>

        {/* Inner layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* Left: Content */}
          <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-between">
            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-bold uppercase rounded-full"
                    style={{
                      padding: '4px 12px',
                      fontSize: 10,
                      letterSpacing: '0.16em',
                      border: `1px solid ${product.accent}35`,
                      color: product.accent,
                      background: `${product.accent}10`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Tagline */}
              <div
                className="font-bold uppercase mb-2"
                style={{ fontSize: 11, letterSpacing: '0.26em', color: product.accent }}
              >
                {product.tagline}
              </div>

              {/* Product name — FIX #6: hover color via CSS class */}
              <h3
                className="product-card-title font-black leading-tight mb-5"
                style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  transition: 'color 0.35s ease',
                }}
              >
                {product.name}
              </h3>

              {/* Description — FIX #6: hover color via CSS class */}
              <p
                className="product-card-desc leading-relaxed mb-8"
                style={{
                  fontSize: 'clamp(14px, 1.4vw, 16px)',
                  color: 'rgba(255,255,255,0.52)',
                  transition: 'color 0.35s ease',
                  maxWidth: 480,
                }}
              >
                {product.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-7 mb-10">
                {product.stats.map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-black leading-tight"
                      style={{
                        fontSize: 'clamp(24px, 3vw, 32px)',
                        background: `linear-gradient(135deg, ${product.accent}, #FDE87A)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="uppercase mt-1"
                      style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CTAButton product={product} />
          </div>

          {/* Right: Mockup + pills */}
          <div className="relative flex items-center justify-center p-6 sm:p-8 md:p-10 lg:pl-4">
            <div className="hidden md:block">
              <FloatingPill
                pillRef={pill1Ref}
                value={product.pillTop.value}
                label={product.pillTop.label}
                accent={product.accent}
                style={{ top: '12%', right: '-4%' }}
              />
              <FloatingPill
                pillRef={pill2Ref}
                value={product.pillBottom.value}
                label={product.pillBottom.label}
                accent={product.accent}
                style={{ bottom: '18%', left: '-2%' }}
              />
            </div>

            <div className="w-full" style={{ maxWidth: 420 }}>
              <MacMockup product={product} />
            </div>
          </div>
        </div>

        {/* Bottom gradient bar — FIX #6: width via CSS class */}
        <div
          aria-hidden="true"
          className="product-card-bar absolute bottom-0 left-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, ${product.accent}, #FDE87A)`,
            transition: 'width 0.65s ease',
          }}
        />
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// ─── Products Section ─────────────────────────────────────────────────────────
// FIX #10: Direct refs — no CSS class selectors
const ProductsSection = () => {
  const sectionRef = useRef(null);
  const badgeRef   = useRef(null);
  const headingRef = useRef(null);
  const subRef     = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // FIX #16: Set initial states — never invisible if GSAP fails
    gsap.set([badgeRef.current, headingRef.current, subRef.current], {
      opacity: 0, y: 24,
    });

    const ctx = gsap.context(() => {
      // FIX #10: Direct refs — no querySelectorAll with class selectors
      gsap.to(
        [badgeRef.current, headingRef.current, subRef.current],
        {
          opacity: 1, y: 0,
          duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        },
      );

      // Parallax orbs — desktop only
      if (!getIsMobile()) {
        gsap.to(orb1Ref.current, {
          yPercent: 20, ease: 'none',
          scrollTrigger: { trigger: section, scrub: 1.5 },
        });
        gsap.to(orb2Ref.current, {
          yPercent: -15, ease: 'none',
          scrollTrigger: { trigger: section, scrub: 1.5 },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24 lg:py-32"
      style={{ background: '#060809' }}
    >
      {/* Atmospheric orbs */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute top-0 right-1/4 pointer-events-none rounded-full"
        style={{
          width: 'clamp(280px, 45vw, 600px)',
          height: 'clamp(280px, 45vw, 600px)',
          background: 'radial-gradient(circle, rgba(255,87,15,0.09), transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute bottom-0 left-0 pointer-events-none rounded-full"
        style={{
          width: 'clamp(200px, 35vw, 440px)',
          height: 'clamp(200px, 35vw, 440px)',
          background: 'radial-gradient(circle, rgba(253,232,122,0.06), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Mesh grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,87,15,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.022) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14 md:mb-20">
          {/* FIX #10: direct refs — no class selectors */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full mb-5 md:mb-6"
            style={{
              padding: '7px 18px',
              border: '1px solid rgba(255,87,15,0.28)',
              background: 'rgba(255,87,15,0.07)',
            }}
          >
            <div
              aria-hidden="true"
              className="product-pulse-dot w-1.5 h-1.5 rounded-full"
              style={{ background: '#FF570F' }}
            />
            <span
              className="font-bold uppercase"
              style={{ fontSize: 10, color: 'rgba(255,87,15,0.92)', letterSpacing: '0.22em' }}
            >
              Products We've Built & Ship
            </span>
          </div>

          <h2
            ref={headingRef}
            className="font-black leading-tight mb-5"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 64px)',
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            We also{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ship products.
            </span>
          </h2>

          <p
            ref={subRef}
            className="leading-relaxed mx-auto"
            style={{
              fontSize: 'clamp(14px, 1.5vw, 17px)',
              color: 'rgba(255,255,255,0.48)',
              maxWidth: 540,
            }}
          >
            We don't just run client accounts — we build our own software too. These
            are live, paying products built and operated by the DDW team.
          </p>
        </div>

        {/* Product Cards */}
        <div className="flex flex-col gap-5 md:gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;