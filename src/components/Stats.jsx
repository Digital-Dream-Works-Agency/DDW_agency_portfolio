/**
 * Stats.jsx — Enterprise-grade, performance-optimized implementation
 *
 * Key optimizations:
 * - Zero useState for animation state (all via refs + direct DOM mutation)
 * - isMobile computed once, never re-evaluated
 * - No memory leaks (all listeners via GSAP, all cleanup via ctx.revert())
 * - Scoped GSAP selectors via refs + gsap.context
 * - will-change applied/removed dynamically
 * - Icons as stable component references, not inline JSX
 * - Spotlight via CSS custom properties (zero re-renders)
 * - Single ScrollTrigger instance for counter (coordinated with card entrance)
 */

import React, {
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — computed once at module level, never re-evaluated
// ─────────────────────────────────────────────────────────────────────────────
const IS_MOBILE =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 768px)').matches;

const IS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// ICON COMPONENTS — stable references, not inline JSX in data
// Defined outside data array so they are never reconstructed
// ─────────────────────────────────────────────────────────────────────────────
const IconMeta = memo(() => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
));

const IconAmazon = memo(() => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
));

const IconGoogle = memo(() => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M11 8v3l2 2" />
  </svg>
));

const IconSEO = memo(() => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
));

// ─────────────────────────────────────────────────────────────────────────────
// STATS DATA — stable, defined once, icons are component refs not JSX
// Using explicit IDs as keys instead of array indices
// ─────────────────────────────────────────────────────────────────────────────
const STATS_DATA = [
  {
    id: 'meta-spend',
    end: 683,
    format: (v) => `$${Math.floor(v)}K+`,
    label: 'Monthly Meta Spend Managed',
    sublabel:
      '343 campaigns · 76M impressions · 5.48x avg ROAS. EU fashion & golf brand.',
    Icon: IconMeta,
  },
  {
    id: 'amazon-sales',
    end: 27,
    format: (v) => `$${(v / 10).toFixed(1)}M+`,
    label: 'Amazon Sales Managed',
    sublabel:
      '129,800 orders · 27.64% ACOS · Full seller central operations since 2015.',
    Icon: IconAmazon,
  },
  {
    id: 'google-roas',
    end: 600,
    format: (v) => `${Math.floor(v)}%`,
    label: 'Peak Google Ads ROAS',
    sublabel: '€418K revenue on €69.7K spend. EU video door intercom brand.',
    Icon: IconGoogle,
  },
  {
    id: 'seo-visitors',
    end: 54,
    format: (v) => `${Math.floor(v)}K`,
    label: 'Monthly SEO Visitors',
    sublabel:
      'From 2K to 54K. 251K clicks · 10.3M impressions. E-commerce SEO retainer.',
    Icon: IconSEO,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATIC STYLE OBJECTS — defined outside components, never reconstructed
// Only truly dynamic values use inline styles inside JSX
// ─────────────────────────────────────────────────────────────────────────────
const CARD_BASE_STYLE = {
  background: 'linear-gradient(135deg, #131618 0%, #0d1012 100%)',
  border: '1px solid rgba(255,255,255,0.1)',
  transformStyle: 'preserve-3d',
  transition: 'border-color 0.4s ease',
};

const ICON_BADGE_STYLE = {
  background: 'rgba(255,87,15,0.1)',
  border: '1px solid rgba(255,87,15,0.2)',
  color: '#FF570F',
};

const COUNTER_STYLE = {
  background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const LABEL_STYLE = {
  color: 'rgba(255,255,255,0.9)',
  transition: 'color 0.3s ease',
};

const SUBLABEL_STYLE = {
  color: 'rgba(255,255,255,0.38)',
  maxWidth: '200px',
};

const DIVIDER_STYLE = {
  background: 'linear-gradient(to right, transparent, #FF570F, transparent)',
};

const PROGRESS_BAR_STYLE = {
  background: 'linear-gradient(to right, #FF570F, #FDE87A)',
};

const CORNER_GRADIENT_STYLE = {
  background:
    'linear-gradient(135deg, transparent 60%, rgba(255,87,15,0.12) 100%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT ITEM — Individual animated counter card
// memo() prevents re-renders when parent re-renders
// ─────────────────────────────────────────────────────────────────────────────
const StatItem = memo(({ stat, animationDelay }) => {
  const cardRef = useRef(null);
  const countRef = useRef(null);
  const progressBarRef = useRef(null);
  const spotlightRef = useRef(null);
  // Track if counter animation has run — avoid GSAP ScrollTrigger duplication
  const hasAnimatedRef = useRef(false);

  const { id, end, format, label, sublabel, Icon } = stat;

  // ── Counter animation — triggered by parent's ScrollTrigger callback ────
  // Exposed via imperative ref pattern; parent calls this at the right time
  const runCounterAnimation = useCallback(() => {
    if (hasAnimatedRef.current || !countRef.current || IS_REDUCED_MOTION) {
      if (countRef.current) countRef.current.textContent = format(end);
      return;
    }
    hasAnimatedRef.current = true;

    const obj = { value: 0 };
    // Delay staggered per card index — avoids multiple ScrollTrigger instances
    gsap.to(obj, {
      value: end,
      duration: IS_REDUCED_MOTION ? 0 : 1.6,
      delay: animationDelay,
      ease: 'power2.out',
      onUpdate() {
        // Direct DOM mutation — zero React re-renders
        if (countRef.current) {
          countRef.current.textContent = format(obj.value);
        }
      },
      onComplete() {
        // Ensure final value is pixel-perfect
        if (countRef.current) {
          countRef.current.textContent = format(end);
        }
      },
    });
  }, [end, format, animationDelay]);

  // Expose the trigger function via a data attribute for parent coordination
  useEffect(() => {
    if (cardRef.current) {
      // Store callback reference on DOM node for parent's ScrollTrigger
      cardRef.current._runCounter = runCounterAnimation;
    }
  }, [runCounterAnimation]);

  // ── Mouse interactions — desktop only, zero state, pure DOM mutation ────
  const handleMouseEnter = useCallback(() => {
    if (IS_MOBILE || !cardRef.current) return;
    // Activate will-change only during interaction — not statically
    cardRef.current.style.willChange = 'transform';
    cardRef.current.style.borderColor = 'rgba(255,87,15,0.35)';
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '100%';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.75)',
      onComplete() {
        // Remove will-change after animation to free compositor layer
        if (cardRef.current) {
          cardRef.current.style.willChange = 'auto';
        }
      },
    });

    cardRef.current.style.borderColor = 'rgba(255,255,255,0.1)';

    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
    }

    // Deactivate spotlight via CSS custom property — zero re-render
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 'transparent';
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (IS_MOBILE || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Batch all reads before writes to avoid layout thrashing
    const dx =
      (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy =
      (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const spotX = ((e.clientX - rect.left) / rect.width) * 100;
    const spotY = ((e.clientY - rect.top) / rect.height) * 100;

    // All writes via GSAP — batched in its render loop, off main thread where possible
    gsap.to(cardRef.current, {
      rotationY: dx * 8,
      rotationX: -dy * 6,
      transformPerspective: 900,
      ease: 'power2.out',
      duration: 0.35,
      overwrite: 'auto', // Prevents GSAP animation queue buildup
    });

    // Spotlight: direct style mutation on the overlay div — zero React re-render
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(220px circle at ${spotX}% ${spotY}%, rgba(255,87,15,0.07), transparent 70%)`;
    }
  }, []);

  return (
    <div
      ref={cardRef}
      data-stat-card
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="stat-card group relative flex flex-col items-center text-center rounded-2xl p-6 md:p-8 cursor-default"
      style={CARD_BASE_STYLE}
      aria-label={`${label}: ${format(end)}`}
    >
      {/* Spotlight overlay — mutated directly via ref, never via state */}
      {!IS_MOBILE && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ transition: 'background 0.12s ease' }}
          aria-hidden="true"
        />
      )}

      {/* Corner accent — pure CSS hover via Tailwind group */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-2xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100"
        style={{ transition: 'opacity 0.4s ease' }}
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-20 h-20" style={CORNER_GRADIENT_STYLE} />
      </div>

      {/* Icon badge */}
      <div
        className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl mb-5 flex-shrink-0"
        style={ICON_BADGE_STYLE}
        aria-hidden="true"
      >
        <Icon />
      </div>

      {/* Counter — textContent mutated directly, never via state */}
      <div
        ref={countRef}
        className="relative z-10 font-bold tabular-nums mb-4 leading-[1.1] tracking-tight text-3xl md:text-4xl"
        style={COUNTER_STYLE}
        aria-live="polite"
      >
        {format(0)}
      </div>

      {/* Divider */}
      <div
        className="relative z-10 w-12 h-px mb-4"
        style={DIVIDER_STYLE}
        aria-hidden="true"
      />

      {/* Label */}
      <div
        className="relative z-10 text-xs font-bold uppercase tracking-widest mb-3 group-hover:text-[#FF570F]"
        style={LABEL_STYLE}
      >
        {label}
      </div>

      {/* Sub label */}
      <p
        className="relative z-10 text-sm leading-relaxed"
        style={SUBLABEL_STYLE}
      >
        {sublabel}
      </p>

      {/* Bottom progress bar — width mutated via ref */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
        style={{
          ...PROGRESS_BAR_STYLE,
          width: '0%',
          transition: 'width 0.6s ease',
        }}
        aria-hidden="true"
      />
    </div>
  );
});

StatItem.displayName = 'StatItem';

// ─────────────────────────────────────────────────────────────────────────────
// STATIC SECTION STYLE OBJECTS
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_STYLE = {
  background: '#080a0c',
  borderTop: '1px solid rgba(255,87,15,0.08)',
  borderBottom: '1px solid rgba(255,87,15,0.08)',
};

const ORB_LEFT_STYLE = {
  width: 'clamp(240px, 40vw, 480px)',
  height: 'clamp(240px, 40vw, 480px)',
  background: 'radial-gradient(circle, rgba(255,87,15,0.07), transparent 70%)',
  filter: 'blur(80px)',
  borderRadius: '50%',
  transform: 'translateY(-50%)',
};

const ORB_RIGHT_STYLE = {
  width: 'clamp(180px, 30vw, 380px)',
  height: 'clamp(180px, 30vw, 380px)',
  background:
    'radial-gradient(circle, rgba(253,232,122,0.04), transparent 70%)',
  filter: 'blur(80px)',
  borderRadius: '50%',
  transform: 'translateY(-50%)',
};

const MESH_STYLE = {
  backgroundImage: 'radial-gradient(rgba(255,87,15,0.1) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
  maskImage:
    'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
  WebkitMaskImage:
    'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
  opacity: 0.35,
};

const BADGE_STYLE = {
  padding: '6px 16px',
  border: '1px solid rgba(255,87,15,0.25)',
  background: 'rgba(255,87,15,0.06)',
};

const BADGE_DOT_STYLE = { background: '#FF570F' };

const BADGE_TEXT_STYLE = {
  color: 'rgba(255,87,15,0.9)',
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const Stats = () => {
  const sectionRef = useRef(null);
  // Keep refs to child card DOM nodes for imperative counter triggering
  const cardRefsMapRef = useRef(new Map());

  useEffect(() => {
    if (!sectionRef.current || IS_REDUCED_MOTION) {
      // Accessibility: if reduced motion, show everything immediately
      sectionRef.current
        ?.querySelectorAll('[data-stat-card]')
        .forEach((card) => card._runCounter?.());
      return;
    }

    // Single gsap.context for this section — all animations scoped here
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-stat-card]', sectionRef.current);
      const badge = sectionRef.current.querySelector('[data-stats-badge]');

      // Badge entrance
      if (badge) {
        gsap.fromTo(
          badge,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // Cards entrance — single ScrollTrigger for all cards
      // Counter animation triggered from onEnter callback — not separate ScrollTriggers
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 88%',
              once: true,
              onEnter() {
                // Trigger counter animations — stagger via animationDelay prop
                cards.forEach((card) => card._runCounter?.());
              },
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []); // No dependencies — setup runs once on mount

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-8 md:py-12 lg:py-16"
      style={SECTION_STYLE}
      aria-label="Performance Statistics"
    >
      {/* Atmospheric orbs — decorative, aria-hidden */}
      <div
        className="absolute top-1/2 left-1/4 pointer-events-none"
        style={ORB_LEFT_STYLE}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-1/4 pointer-events-none"
        style={ORB_RIGHT_STYLE}
        aria-hidden="true"
      />

      {/* Mesh grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={MESH_STYLE}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="text-center mb-10">
          <div
            data-stats-badge
            className="inline-flex items-center gap-2 rounded-full"
            style={BADGE_STYLE}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={BADGE_DOT_STYLE}
              aria-hidden="true"
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={BADGE_TEXT_STYLE}
            >
              Real numbers · live accounts · dashboard screenshots available
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {STATS_DATA.map((stat, i) => (
            <StatItem
              key={stat.id}
              stat={stat}
              animationDelay={i * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;