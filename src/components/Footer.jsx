// src/components/Footer/index.jsx
// DDW Agency — Premium Footer | Optimized | Production-Ready

import React, {
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
// Defined as a frozen object — prevents accidental mutation
const B = Object.freeze({
  orange:     '#FF570F',
  orangeSoft: '#EE7D1D',
  accent:     '#FDE87A',
  bg:         '#080a0c',
  bgCard:     '#0d1012',
  bgCardAlt:  '#0a0c0e',
});

// ─── Module-Level Singletons ──────────────────────────────────────────────────
// FIX #1: isTouch computed ONCE at module load, not per-component-mount.
// A mediaQuery listener handles resize without re-running matchMedia repeatedly.
const touchQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)')
    : null;

let _isTouch =
  typeof window !== 'undefined'
    ? touchQuery.matches || navigator.maxTouchPoints > 0
    : false;

if (touchQuery) {
  touchQuery.addEventListener('change', (e) => {
    _isTouch = e.matches || navigator.maxTouchPoints > 0;
  });
}

const getIsTouch = () => _isTouch;

// FIX #9: currentYear as explicit build-time constant
const CURRENT_YEAR = new Date().getFullYear();

// ─── Static Data ──────────────────────────────────────────────────────────────
const NAV = Object.freeze({
  services: [
    { label: 'Meta Ads',      href: '/services' },
    { label: 'Google Ads',    href: '/services' },
    { label: 'Amazon',        href: '/services' },
    { label: 'TikTok Shop',   href: '/services' },
    { label: 'SEO',           href: '/services' },
    { label: 'AI SaaS',       href: '/services' },
  ],
  company: [
    { label: 'About Us',      href: '/about' },
    { label: 'Portfolio',     href: '/projects' },
    { label: 'Services',      href: '/services' },
    {
      label: 'Contact',
      href: 'https://calendly.com/digi-dreamworks/onboarding-call',
      external: true,
    },
  ],
  resources: [
    { label: 'Case Studies',  href: '#', external: true },
    { label: 'Tech Stack',    href: '#', external: true },
    { label: 'Blog',          href: '#', external: true },
    { label: 'Documentation', href: '#', external: true },
  ],
  legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy',    href: '#' },
  ],
});

const OFFICES = Object.freeze([
  { city: 'Rome',    country: 'Italy', flag: '🇮🇹' },
  { city: 'Florida', country: 'USA',   flag: '🇺🇸' },
]);

// FIX #2: Icons as pure functional components — properly composable,
// aria-hidden for screen readers, no JSX stored in data arrays.
const IconBrands = () => (
  <svg
    width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    viewBox="0 0 24 24" aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const IconProjects = () => (
  <svg
    width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    viewBox="0 0 24 24" aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconResponse = () => (
  <svg
    width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    viewBox="0 0 24 24" aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const IconSatisfaction = () => (
  <svg
    width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    viewBox="0 0 24 24" aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const IconLinkedIn = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const IconInstagram = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconArrow = () => (
  <svg
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const IconBolt = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={B.orange} aria-hidden="true">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// FIX #2 cont'd: Trust and Socials data now references component constructors
const TRUST = Object.freeze([
  {
    value: '50+',
    label: 'Brands',
    sub: 'Active retainers',
    Icon: IconBrands,
  },
  {
    value: '200+',
    label: 'Projects',
    sub: 'Delivered on time',
    Icon: IconProjects,
  },
  {
    value: '<2hr',
    label: 'Response',
    sub: 'Average SLA',
    Icon: IconResponse,
  },
  {
    value: '98%',
    label: 'Satisfaction',
    sub: 'Client retention',
    Icon: IconSatisfaction,
  },
]);

const SOCIALS = Object.freeze([
  { label: 'LinkedIn',   href: 'https://linkedin.com',  Icon: IconLinkedIn  },
  { label: 'Instagram',  href: 'https://instagram.com', Icon: IconInstagram },
  { label: 'X / Twitter', href: 'https://x.com',        Icon: IconX         },
]);

// ─── Shared hook: Magnetic GSAP effect ───────────────────────────────────────
// Extracted as a reusable hook — eliminates duplicated logic in SocialBtn + MagneticCTA
function useMagneticEffect(strength = 0.35) {
  const ref  = useRef(null);
  const xTo  = useRef(null);
  const yTo  = useRef(null);

  useEffect(() => {
    // FIX #1: Use module-level singleton, not per-call isTouch()
    if (getIsTouch() || !ref.current) return;

    xTo.current = gsap.quickTo(ref.current, 'x', {
      duration: 0.4,
      ease: 'power2.out',
    });
    yTo.current = gsap.quickTo(ref.current, 'y', {
      duration: 0.4,
      ease: 'power2.out',
    });

    // FIX #11: willChange applied only during hover, not permanently
    const el = ref.current;
    const onEnter = () => { el.style.willChange = 'transform'; };
    const onLeave = () => { el.style.willChange = 'auto'; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      // Reset position on unmount
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (getIsTouch() || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * strength);
      yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * strength);
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    if (getIsTouch()) return;
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

// ─── Abstract Animated Visual ─────────────────────────────────────────────────
// FIX #15: Wrapped in memo
// FIX #7:  Single gsap.context, animations paused when off-screen via ScrollTrigger
const FooterVisual = memo(() => {
  const containerRef = useRef(null);
  const ring1Ref     = useRef(null);
  const ring2Ref     = useRef(null);
  const ring3Ref     = useRef(null);
  const glowRef      = useRef(null);
  // FIX #12: Reset barsRef array before population via initializer
  const barsRef      = useRef([]);

  useEffect(() => {
    barsRef.current = barsRef.current.slice(0, 6); // prevent stale entries

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // FIX #7: Pause all visual animations when not in viewport
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause play pause',
        },
      });

      tl.to(ring1Ref.current, {
        rotation: 360, duration: 10,
        repeat: -1, ease: 'none', transformOrigin: '50% 50%',
      }, 0)
        .to(ring2Ref.current, {
          rotation: -360, duration: 16,
          repeat: -1, ease: 'none', transformOrigin: '50% 50%',
        }, 0)
        .to(ring3Ref.current, {
          rotation: 360, duration: 24,
          repeat: -1, ease: 'none', transformOrigin: '50% 50%',
        }, 0)
        .to(glowRef.current, {
          scale: 1.3, opacity: 0.6,
          duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
        }, 0);

      const BAR_CONFIG = [
        { scale: 0.35, duration: 1.1, delay: 0    },
        { scale: 0.6,  duration: 1.5, delay: 0.25 },
        { scale: 0.4,  duration: 0.9, delay: 0.5  },
        { scale: 0.75, duration: 1.3, delay: 0.12 },
        { scale: 0.5,  duration: 1.7, delay: 0.7  },
        { scale: 0.45, duration: 1.2, delay: 0.38 },
      ];

      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const cfg = BAR_CONFIG[i];
        tl.to(bar, {
          scaleY: cfg.scale, duration: cfg.duration,
          repeat: -1, yoyo: true,
          ease: 'power1.inOut', transformOrigin: 'bottom',
          delay: cfg.delay,
        }, 0);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // FIX #12: Stable heights — no need for delay in data, that's a GSAP concern
  const BAR_HEIGHTS = ['100%', '75%', '55%', '90%', '65%', '80%'];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="absolute rounded-full"
        style={{
          width: 160, height: 160,
          background: `radial-gradient(circle, ${B.orange}1A 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Rings — extracted to reduce repetition */}
      <div
        ref={ring3Ref}
        className="absolute rounded-full flex items-start justify-center"
        style={{
          width: 220, height: 220,
          border: `1px dashed ${B.orange}18`,
        }}
      >
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: `${B.orange}70`, marginTop: -3.5,
          boxShadow: `0 0 8px ${B.orange}`,
        }} />
      </div>

      <div
        ref={ring2Ref}
        className="absolute rounded-full flex items-center justify-end"
        style={{
          width: 160, height: 160,
          border: `1px solid ${B.orange}25`,
        }}
      >
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: B.accent, marginRight: -2.5,
          boxShadow: `0 0 8px ${B.accent}80`,
        }} />
      </div>

      <div
        ref={ring1Ref}
        className="absolute rounded-full flex items-end justify-center"
        style={{
          width: 100, height: 100,
          border: `1px solid ${B.orange}38`,
        }}
      >
        <div style={{
          width: 4, height: 4, borderRadius: '50%',
          background: B.orange, marginBottom: -2,
        }} />
      </div>

      {/* Center node */}
      <div
        className="relative z-10 flex flex-col items-center justify-center rounded-xl"
        style={{
          width: 80, height: 80,
          background: `linear-gradient(135deg, #1c1c1c 0%, ${B.bgCardAlt} 100%)`,
          border: `1px solid ${B.orange}28`,
          boxShadow: `0 0 30px ${B.orange}14, 0 12px 40px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="flex items-end mb-1.5" style={{ gap: 2, height: 24 }}>
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              ref={(el) => { barsRef.current[i] = el; }}
              className="rounded-t-sm"
              style={{
                width: 5, height: h,
                background: `linear-gradient(to top, ${B.orange}, ${B.accent})`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 7, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: `${B.orange}80`,
          }}
        >
          DDW
        </span>
      </div>
    </div>
  );
});
FooterVisual.displayName = 'FooterVisual';

// ─── Trust Badge Card ─────────────────────────────────────────────────────────
// FIX #4: Spotlight is now driven by CSS custom properties via GSAP.
//         Zero setState calls on mousemove — zero re-renders.
// FIX #15: Wrapped in memo
const TrustCard = memo(({ item, index }) => {
  const cardRef  = useRef(null);
  const spotRef  = useRef(null);

  // Derive accent at render time — no state needed
  const accent = index % 2 === 0 ? B.orange : B.orangeSoft;

  useEffect(() => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    // FIX #11: willChange only during interaction
    const enableCompositing  = () => { card.style.willChange = 'transform'; };
    const disableCompositing = () => { card.style.willChange = 'auto'; };

    const onMouseMove = (e) => {
      if (getIsTouch()) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;

      // FIX #4: Drive spotlight via direct CSS custom property — no React state
      spot.style.setProperty('--spot-x', `${x}%`);
      spot.style.setProperty('--spot-y', `${y}%`);
      spot.style.opacity = '1';

      // Tilt — GSAP batches this efficiently
      gsap.to(card, {
        rotationY:  ((e.clientX - rect.left) / rect.width  - 0.5) * 12,
        rotationX: -((e.clientY - rect.top)  / rect.height - 0.5) * 12,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onMouseLeave = () => {
      if (getIsTouch()) return;
      spot.style.opacity = '0';
      gsap.to(card, {
        rotationY: 0, rotationX: 0,
        duration: 0.5, ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('mouseenter', enableCompositing);
    card.addEventListener('mouseleave', disableCompositing);
    card.addEventListener('mousemove', onMouseMove,  { passive: true });
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', enableCompositing);
      card.removeEventListener('mouseleave', disableCompositing);
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const { Icon } = item;

  return (
    <div
      ref={cardRef}
      className="trust-card relative rounded-2xl border group overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
        borderColor: `${accent}18`,
        transition: 'border-color 0.4s ease',
        padding: 'clamp(14px, 2vw, 20px)',
      }}
    >
      {/* FIX #4: Spotlight driven by CSS vars, toggled by opacity — zero re-renders */}
      <div
        ref={spotRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${accent}14 0%, transparent 65%)`,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          '--spot-x': '50%',
          '--spot-y': '50%',
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}45, transparent)`,
        }}
      />

      {/* Bottom progress on hover */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${B.accent})`,
          transition: 'width 0.65s ease',
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
          filter: 'blur(16px)',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Watermark */}
      <div
        className="absolute -bottom-1 -right-1 font-black pointer-events-none select-none leading-none"
        aria-hidden="true"
        style={{
          fontSize: 'clamp(40px, 5vw, 64px)',
          color: accent,
          opacity: 0.04,
          letterSpacing: '-0.04em',
        }}
      >
        {item.value}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            width: 40, height: 40,
            background: `${accent}12`,
            border: `1px solid ${accent}28`,
            color: accent,
          }}
        >
          <Icon />
        </div>
        <div>
          <div
            className="font-black leading-none mb-0.5"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              letterSpacing: '-0.03em',
              color: accent,
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.16em',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              marginTop: 2,
            }}
          >
            {item.sub}
          </div>
        </div>
      </div>
    </div>
  );
});
TrustCard.displayName = 'TrustCard';

// ─── Footer Nav Link ──────────────────────────────────────────────────────────
// FIX #3:  Hover driven by CSS class, not direct DOM style mutation
// FIX #15: memo prevents re-renders when parent updates
const FooterLink = memo(({ children, href, external = false }) => (
  <a
    href={href || '#'}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="footer-nav-link group inline-flex items-center gap-1.5"
    style={{
      fontSize: 13,
      color: 'rgba(255,255,255,0.38)',
      textDecoration: 'none',
    }}
  >
    <span
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      aria-hidden="true"
      style={{ color: B.orange, fontSize: 10 }}
    >
      ›
    </span>
    {children}
  </a>
));
FooterLink.displayName = 'FooterLink';

// ─── Social Icon Button ───────────────────────────────────────────────────────
// FIX #5:  Hover driven by CSS class
// FIX #15: memo + shared useMagneticEffect hook (DRY)
const SocialBtn = memo(({ item }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticEffect(0.35);
  const { Icon } = item;

  return (
    <a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      className="social-btn group flex items-center justify-center rounded-xl border"
      style={{
        width: 40, height: 40, minHeight: 44,
        borderColor: `${B.orange}22`,
        background: 'transparent',
        color: 'rgba(255,255,255,0.35)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Icon />
    </a>
  );
});
SocialBtn.displayName = 'SocialBtn';

// ─── Magnetic CTA Button ──────────────────────────────────────────────────────
// FIX #10: Shimmer now functional via group-hover CSS class
// FIX #11: willChange managed by useMagneticEffect hook
// FIX #15: memo
const MagneticCTA = memo(({ href, children }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticEffect(0.28);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="magnetic-cta relative inline-flex items-center justify-center gap-2.5 font-bold uppercase overflow-hidden group flex-shrink-0"
      style={{
        minHeight: 52,
        padding: '14px 32px',
        fontSize: 11,
        letterSpacing: '0.18em',
        background: `linear-gradient(135deg, ${B.orange} 0%, ${B.orangeSoft} 100%)`,
        color: B.bg,
        borderRadius: 10,
        boxShadow: `0 0 28px ${B.orange}32, 0 8px 28px rgba(0,0,0,0.4)`,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'box-shadow 0.4s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* FIX #10: Shimmer triggered by group-hover via CSS class */}
      <span
        aria-hidden="true"
        className="magnetic-cta__shimmer absolute inset-0 pointer-events-none"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: B.accent }}
      />
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
        <IconArrow />
      </span>
    </a>
  );
});
MagneticCTA.displayName = 'MagneticCTA';

// ─── CTA Panel ────────────────────────────────────────────────────────────────
// FIX #7: No nested GSAP context conflict — FooterVisual manages its own context
// FIX #15: memo
const CTAPanel = memo(() => {
  const panelRef = useRef(null);
  const orb1Ref  = useRef(null);
  const orb2Ref  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, {
        scale: 1.2, opacity: 0.5,
        duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        scale: 0.8, opacity: 0.3,
        duration: 5.5, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: 1.5,
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
        border: `1px solid ${B.orange}20`,
        padding: 'clamp(28px, 4vw, 48px)',
      }}
    >
      {/* Mesh grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* Orbs */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '-30%', right: '-10%',
          width: 280, height: 280,
          background: `radial-gradient(circle, ${B.orange}18 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: '-20%', left: '-5%',
          width: 200, height: 200,
          background: `radial-gradient(circle, ${B.accent}10 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Top line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}40, ${B.accent}20, transparent)`,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
        {/* Visual — hidden on mobile */}
        <div
          aria-hidden="true"
          className="hidden lg:block flex-shrink-0 rounded-xl overflow-hidden"
          style={{
            width: 160, height: 140,
            background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${B.orange}08 0%, ${B.bgCardAlt} 100%)`,
            border: `1px solid ${B.orange}15`,
          }}
        >
          <FooterVisual />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 rounded-full mb-4"
            style={{
              padding: '6px 14px',
              background: `${B.orange}0E`,
              border: `1px solid ${B.orange}28`,
            }}
          >
            {/* FIX #13: Pulse dot driven by GSAP in global CSS, not inline animation */}
            <span className="footer-pulse-dot" aria-hidden="true" />
            <span
              style={{
                fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.24em',
                color: B.orange,
              }}
            >
              Limited Slots Available
            </span>
          </div>

          <h3
            className="font-black leading-tight mb-2"
            style={{
              fontSize: 'clamp(22px, 3vw, 36px)',
              letterSpacing: '-0.03em',
              color: '#fff',
            }}
          >
            Ready to scale{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${B.orange} 0%, ${B.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              your systems?
            </span>
          </h3>
          <p
            style={{
              fontSize: 'clamp(13px, 1.4vw, 15px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.42)',
              maxWidth: 480,
            }}
          >
            Join 50+ enterprises using our battle-tested frameworks. 20-min
            strategy call — no commitment required.
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <MagneticCTA href="https://calendly.com/digi-dreamworks/onboarding-call">
            Book Strategy Call
          </MagneticCTA>
          <p
            className="text-center mt-2"
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.06em',
            }}
          >
            No commitment · 20 minutes
          </p>
        </div>
      </div>
    </div>
  );
});
CTAPanel.displayName = 'CTAPanel';

// ─── Nav Column ───────────────────────────────────────────────────────────────
// FIX: Extracted as memoized sub-component to prevent re-renders
const NavColumn = memo(({ title, items }) => (
  <div className="footer-col">
    <h4
      className="mb-5"
      style={{
        fontSize: 10, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.22em',
        color: '#fff',
      }}
    >
      {title}
    </h4>
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <FooterLink href={item.href} external={item.external}>
            {item.label}
          </FooterLink>
        </li>
      ))}
    </ul>
  </div>
));
NavColumn.displayName = 'NavColumn';

// ─── Refs collector helper ────────────────────────────────────────────────────
// Gives Footer direct ref access to animated targets — no querySelector needed
function useFooterRefs() {
  return {
    footerRef:    useRef(null),
    topLineRef:   useRef(null),
    orb1Ref:      useRef(null),
    orb2Ref:      useRef(null),
    ctaPanelRef:  useRef(null),
    trustGridRef: useRef(null),
    navRef:       useRef(null),
    bottomBarRef: useRef(null),
  };
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
const Footer = () => {
  const {
    footerRef,
    topLineRef,
    orb1Ref,
    orb2Ref,
    ctaPanelRef,
    trustGridRef,
    navRef,
    bottomBarRef,
  } = useFooterRefs();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // FIX #14: Initial states set via gsap.set() — content never invisible if GSAP fails
      gsap.set(
        [
          ctaPanelRef.current,
          // trustGridRef.current,
          // navRef.current,
          bottomBarRef.current,
          topLineRef.current,
        ],
        { opacity: 0 },
      );

      // Top line reveal
      gsap.fromTo(
        topLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 1.3, ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 92%',
            once: true,
          },
        },
      );

      // FIX #6: Orb drift scoped to footer context — no querySelector
      gsap.to(orb1Ref.current, {
        x: 30, y: -20,
        duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        x: -25, y: 15,
        duration: 12, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: 2,
      });

      // CTA panel
      gsap.fromTo(
        ctaPanelRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaPanelRef.current,
            start: 'top 90%',
            once: true,
          },
        },
      );

      // FIX #6: Trust cards via direct ref to grid container
      // GSAP will query children internally — still faster than our own querySelectorAll
      gsap.fromTo(
        trustGridRef.current.children,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: {
            trigger: trustGridRef.current,
            start: 'top 88%',
            once: true,
          },
        },
      );

      // Nav columns
      gsap.fromTo(
        navRef.current.querySelectorAll('.footer-col'),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.75, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: {
            trigger: navRef.current,
            start: 'top 88%',
            once: true,
          },
        },
      );

      // Bottom bar
      gsap.fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: bottomBarRef.current,
            start: 'top 95%',
            once: true,
          },
        },
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{ background: B.bg }}
    >
      {/* ── Mesh grid ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.022) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 50% 100%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 100%, black 20%, transparent 100%)',
        }}
      />

      {/* ── Top border rule ── */}
      <div
        ref={topLineRef}
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px origin-left pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}40, ${B.accent}20, transparent)`,
        }}
      />

      {/* ── Atmospheric orbs ── */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '5%', left: '-5%',
          width: 'clamp(200px, 30vw, 420px)',
          height: 'clamp(200px, 30vw, 420px)',
          background: `radial-gradient(circle, ${B.orange}0C 0%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: '10%', right: '-5%',
          width: 'clamp(180px, 28vw, 380px)',
          height: 'clamp(180px, 28vw, 380px)',
          background: `radial-gradient(circle, ${B.accent}07 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* ── Watermark ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 font-black pointer-events-none select-none leading-none whitespace-nowrap"
        style={{
          fontSize: 'clamp(80px, 12vw, 180px)',
          color: B.orange,
          opacity: 0.025,
          letterSpacing: '-0.04em',
        }}
      >
        DDW
      </div>

      {/* ── Main content ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto"
        style={{
          padding:
            'clamp(56px, 7vw, 100px) clamp(20px, 5vw, 48px) clamp(32px, 4vw, 56px)',
        }}
      >
        {/* ── CTA Panel ── */}
        <div ref={ctaPanelRef} className="mb-12 md:mb-16">
          <CTAPanel />
        </div>

        {/* ── Trust Cards ── */}
        <div
          ref={trustGridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 md:mb-16"
        >
          {TRUST.map((item, i) => (
            <TrustCard key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* ── Nav Grid ── */}
        <div
          ref={navRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pt-10 mb-10"
          style={{ borderTop: `1px solid ${B.orange}12` }}
        >
          {/* Brand column */}
          <div className="footer-col lg:col-span-4">
            <a
              href="/"
              className="inline-flex items-center gap-3 mb-5 group"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="flex items-center justify-center rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  width: 48, height: 48,
                  background: `linear-gradient(135deg, ${B.bgCard} 0%, #1c1c1c 100%)`,
                  border: `1px solid ${B.orange}25`,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <rect x="3"  y="3"  width="13" height="13" rx="2" stroke={B.orange}     strokeWidth="1.6" />
                  <rect x="20" y="3"  width="13" height="13" rx="2" stroke={B.orangeSoft} strokeWidth="1.6" />
                  <rect x="3"  y="20" width="13" height="13" rx="2" stroke={B.orangeSoft} strokeWidth="1.6" />
                  <rect x="20" y="20" width="13" height="13" rx="2" stroke={B.accent}     strokeWidth="1.6" />
                  <circle cx="18" cy="18" r="2.8" fill={B.orange} />
                </svg>
              </div>
              <div>
                <span
                  className="block leading-none mb-0.5 font-black"
                  style={{
                    fontSize: 18,
                    letterSpacing: '-0.02em',
                    color: '#fff',
                  }}
                >
                  DDW{' '}
                  <span style={{ color: B.orange }}>Agency</span>
                </span>
                <span
                  style={{
                    fontSize: 9, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.22em',
                    color: 'rgba(255,255,255,0.28)',
                  }}
                >
                  Enterprise Solutions
                </span>
              </div>
            </a>

            <p
              className="mb-6"
              style={{
                fontSize: 13, lineHeight: 1.75,
                color: 'rgba(255,255,255,0.35)',
                maxWidth: 280,
              }}
            >
              Production-ready software systems and strategic consulting for
              enterprise brands who demand real results.
            </p>

            {/* Office pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {OFFICES.map((office) => (
                <div
                  key={office.city}
                  className="inline-flex items-center gap-1.5 rounded-full"
                  style={{
                    padding: '5px 12px',
                    background: `${B.orange}0A`,
                    border: `1px solid ${B.orange}18`,
                  }}
                >
                  <span style={{ fontSize: 12 }} aria-hidden="true">
                    {office.flag}
                  </span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.16em',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {office.city}
                  </span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <SocialBtn key={s.label} item={s} />
              ))}
            </div>
          </div>

          {/* Nav columns — FIX: extracted as NavColumn, no repeated JSX patterns */}
          <div className="lg:col-span-2">
            <NavColumn title="Services"   items={NAV.services}   />
          </div>
          <div className="lg:col-span-2">
            <NavColumn title="Company"    items={NAV.company}    />
          </div>
          <div className="lg:col-span-2">
            <NavColumn title="Resources"  items={NAV.resources}  />
          </div>

          {/* Status column */}
          <div className="footer-col lg:col-span-2">
            <h4
              className="mb-5"
              style={{
                fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.22em',
                color: '#fff',
              }}
            >
              Status
            </h4>

            <div
              className="inline-flex items-center gap-2 rounded-full mb-4"
              style={{
                padding: '6px 14px',
                background: 'rgba(40,200,64,0.08)',
                border: '1px solid rgba(40,200,64,0.22)',
              }}
            >
              {/* FIX #13: Using shared CSS class for pulse — not inline animation */}
              <span className="footer-pulse-dot footer-pulse-dot--green" aria-hidden="true" />
              <span
                style={{
                  fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: '#28C840',
                }}
              >
                All Systems
              </span>
            </div>

            <NavColumn title="" items={NAV.legal} />
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          ref={bottomBarRef}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7"
          style={{ borderTop: `1px solid ${B.orange}0E` }}
        >
          <p
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.04em',
            }}
          >
            © {CURRENT_YEAR}{' '}
            <span style={{ color: B.orange, fontWeight: 600 }}>DDW Agency</span>
            {' '}— Florida LLC · All rights reserved.
          </p>

          <div
            className="inline-flex items-center gap-2 rounded-full"
            style={{
              padding: '5px 14px',
              background: `${B.orange}08`,
              border: `1px solid ${B.orange}15`,
            }}
          >
            <IconBolt />
            <span
              style={{
                fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              Built by DDW · US + EU
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;