// src/components/ProductsSection.jsx
// DDW's own live SaaS products — Lyra and Sviluppiamo.dev

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────
const isMobileDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const products = [
  {
    name: 'Lyra',
    tagline: 'AI Voice Receptionist',
    description:
      'Every missed call is a missed customer. Lyra answers every call 24/7, books appointments into your calendar, qualifies leads, and sends follow-up messages — without a single human receptionist. Built on Twilio, AWS, and Google Cloud. Powered by DDW.',
    url: 'https://lyrabyddw.com',
    stats: [
      { value: '978+', label: 'Calls Handled' },
      { value: '24/7', label: 'Availability' },
      { value: '0', label: 'Missed Calls' },
    ],
    accent: '#FF570F',
    accentSoft: '#EE7D1D',
    tags: ['AI SaaS', 'Voice AI', 'Twilio + AWS'],
    // Abstract visual bars data for the Mac mockup
    bars: [60, 85, 45, 100, 70, 90, 55, 78, 65, 95],
    mockupLabel: 'lyra.dashboard',
    mockupMetric: '978+',
    mockupMetricLabel: 'Calls Handled',
    pillTop: { value: '24/7', label: 'Always On' },
    pillBottom: { value: '0', label: 'Missed Calls' },
  },
  {
    name: 'Sviluppiamo.dev',
    tagline: 'Vibe Coding Platform — Italy Market',
    description:
      'The Italian-market vibe coding platform. Sviluppiamo.dev connects Italian developers and businesses with AI-assisted software building — a product DDW built, owns, and operates. Part of our growing portfolio of market-specific SaaS tools.',
    url: 'https://sviluppiamo.dev',
    stats: [
      { value: 'IT', label: 'Market' },
      { value: 'AI', label: 'Powered' },
      { value: 'Live', label: 'Status' },
    ],
    accent: '#FDE87A',
    accentSoft: '#EE7D1D',
    tags: ['SaaS', 'Italy Market', 'Built by DDW'],
    bars: [40, 70, 55, 88, 50, 95, 60, 75, 45, 82],
    mockupLabel: 'sviluppiamo.dev',
    mockupMetric: 'Live',
    mockupMetricLabel: 'Platform Status',
    pillTop: { value: 'IT', label: 'Market' },
    pillBottom: { value: 'AI', label: 'Powered' },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING STAT PILL
// ─────────────────────────────────────────────────────────────────────────────
const FloatingPill = ({ value, label, accent, pillRef, style }) => (
  <div
    ref={pillRef}
    className="absolute z-20 flex items-center gap-2 rounded-xl pointer-events-none"
    style={{
      padding: '8px 14px',
      background: 'rgba(8,10,12,0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: `1px solid ${accent}35`,
      boxShadow: `0 8px 32px rgba(0,0,0,0.45)`,
      ...style,
    }}
  >
    <div
      className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
      style={{ background: accent }}
    />
    <div>
      <div className="font-black leading-none" style={{ fontSize: '13px', color: accent }}>
        {value}
      </div>
      <div
        className="uppercase leading-none mt-0.5"
        style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}
      >
        {label}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAC OS BROWSER MOCKUP — Abstract visual dashboard
// ─────────────────────────────────────────────────────────────────────────────
const MacMockup = ({ product }) => {
  const maxBar = Math.max(...product.bars);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(10,11,13,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
        minHeight: '260px',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {/* Window controls */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
        </div>
        {/* URL bar */}
        <div
          className="flex-1 mx-4 px-3 py-1 rounded-md flex items-center gap-2"
          style={{ background: 'rgba(255,255,255,0.04)', maxWidth: '220px' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: product.accent, opacity: 0.7 }} />
          <span
            className="font-mono"
            style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}
          >
            {product.mockupLabel}
          </span>
        </div>
        <div className="w-14" />
      </div>

      {/* Dashboard body */}
      <div className="flex-1 p-5 flex flex-col gap-4">
        {/* Top metric row */}
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
              style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em' }}
            >
              {product.mockupMetricLabel}
            </div>
          </div>

          {/* Live indicator */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: `${product.accent}15`, border: `1px solid ${product.accent}30` }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: product.accent }}
            />
            <span
              className="font-bold uppercase"
              style={{ fontSize: '9px', color: product.accent, letterSpacing: '0.16em' }}
            >
              Live
            </span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex-1 flex items-end gap-1.5" style={{ minHeight: '80px' }}>
          {product.bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background:
                    h === maxBar
                      ? `linear-gradient(to top, ${product.accent}, #FDE87A)`
                      : `${product.accent}25`,
                  transition: 'height 0.3s ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom stats row */}
        <div
          className="flex gap-5 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {product.stats.map((s, i) => (
            <div key={i}>
              <div
                className="font-black"
                style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}
              >
                {s.value}
              </div>
              <div
                className="uppercase"
                style={{ fontSize: '8px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const [hovered, setHovered] = useState(false);

  // Scroll fade-up
  useEffect(() => {
    if (!wrapRef.current) return;
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 86%',
          once: true,
        },
      }
    );
  }, [index]);

  // Floating pill yoyo
  useEffect(() => {
    const p1 = pill1Ref.current;
    const p2 = pill2Ref.current;
    if (!p1 || !p2) return;
    const tl = gsap.timeline();
    tl.to(p1, { y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }).to(
      p2,
      { y: -8, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' },
      0.5
    );
    return () => tl.kill();
  }, []);

  // 3D tilt + spotlight — desktop only
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isMobileDevice()) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    gsap.to(cardRef.current, {
      rotationY: dx * 5,
      rotationX: -dy * 3.5,
      transformPerspective: 1100,
      ease: 'power2.out',
      duration: 0.4,
    });
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.75)',
    });
    setSpotlight((s) => ({ ...s, active: false }));
    setHovered(false);
    if (cardRef.current) cardRef.current.style.borderColor = `${product.accent}18`;
  }, [product.accent]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (cardRef.current) cardRef.current.style.borderColor = `${product.accent}50`;
  }, [product.accent]);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0e1114 0%, #080a0c 100%)',
          border: `1px solid ${product.accent}18`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'border-color 0.45s ease',
        }}
      >
        {/* Spotlight overlay — desktop only */}
        <div
          className="absolute inset-0 z-10 pointer-events-none hidden md:block"
          style={{
            background: spotlight.active
              ? `radial-gradient(380px circle at ${spotlight.x}% ${spotlight.y}%, ${product.accent}0D, transparent 70%)`
              : 'transparent',
            transition: 'background 0.15s ease',
          }}
        />

        {/* Dot grid watermark */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${product.accent}20 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
            opacity: 0.7,
          }}
        />

        {/* Ambient top-right glow */}
        <div
          className="absolute top-0 right-0 pointer-events-none rounded-2xl"
          style={{
            width: 'clamp(200px, 40%, 320px)',
            height: 'clamp(200px, 40%, 320px)',
            background: `radial-gradient(circle at top right, ${product.accent}18, transparent 70%)`,
            filter: 'blur(40px)',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Watermark name */}
        <div
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

        {/* ── Inner layout: two columns on lg ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* ─ LEFT: Content ─ */}
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
                      fontSize: '10px',
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

              {/* Tagline eyebrow */}
              <div
                className="font-bold uppercase mb-2"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.26em',
                  color: product.accent,
                }}
              >
                {product.tagline}
              </div>

              {/* Product name */}
              <h3
                className="font-black leading-tight mb-5"
                style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  letterSpacing: '-0.03em',
                  color: hovered ? product.accent : '#ffffff',
                  transition: 'color 0.35s ease',
                }}
              >
                {product.name}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed mb-8"
                style={{
                  fontSize: 'clamp(14px, 1.4vw, 16px)',
                  color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.52)',
                  transition: 'color 0.35s ease',
                  maxWidth: '480px',
                }}
              >
                {product.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-7 mb-10">
                {product.stats.map((stat, i) => (
                  <div key={i}>
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
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.3)',
                        letterSpacing: '0.18em',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <CTAButton product={product} />
          </div>

          {/* ─ RIGHT: Mac Mockup + floating pills ─ */}
          <div className="relative flex items-center justify-center p-6 sm:p-8 md:p-10 lg:pl-4">
            {/* Floating pills — hidden on mobile */}
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

            {/* Mac Mockup */}
            <div className="w-full" style={{ maxWidth: '420px' }}>
              <MacMockup product={product} />
            </div>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, ${product.accent}, #FDE87A)`,
            width: hovered ? '100%' : '0%',
            transition: 'width 0.65s ease',
          }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC CTA BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const CTAButton = ({ product }) => {
  const btnRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!btnRef.current || isMobileDevice()) return;
    const el = btnRef.current;
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      xTo.current((e.clientX - (rect.left + rect.width / 2)) * 0.3);
      yTo.current((e.clientY - (rect.top + rect.height / 2)) * 0.3);
    };
    const onLeave = () => {
      xTo.current(0);
      yTo.current(0);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center gap-3 font-bold uppercase overflow-hidden"
      style={{
        padding: '14px 30px',
        background: hovered
          ? product.accent === '#FDE87A' ? '#FDE87A' : '#FDE87A'
          : product.accent,
        color: '#080a0c',
        fontSize: '12px',
        letterSpacing: '0.18em',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        minHeight: '52px',
        willChange: 'transform',
        textDecoration: 'none',
        boxShadow: hovered
          ? `0 10px 40px ${product.accent}55`
          : `0 6px 28px ${product.accent}35`,
      }}
    >
      {/* Shimmer */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.55s ease',
        }}
      />
      <span className="relative z-10 flex items-center gap-3">
        Visit {product.name}
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          style={{
            transform: hovered ? 'translate(3px, -3px)' : 'translate(0,0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </span>
    </a>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS SECTION — Main
// ─────────────────────────────────────────────────────────────────────────────
const ProductsSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Badge + heading + sub stagger
      gsap.fromTo(
        '.ps-badge, .ps-heading, .ps-sub',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // Parallax orbs — desktop only
      if (!isMobileDevice()) {
        if (orb1Ref.current) {
          gsap.to(orb1Ref.current, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, scrub: 1.5 },
          });
        }
        if (orb2Ref.current) {
          gsap.to(orb2Ref.current, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, scrub: 1.5 },
          });
        }
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24 lg:py-32"
      style={{ background: '#060809' }}
    >
      {/* ── Atmospheric orbs ── */}
      <div
        ref={orb1Ref}
        className="absolute top-0 right-1/4 pointer-events-none"
        style={{
          width: 'clamp(280px, 45vw, 600px)',
          height: 'clamp(280px, 45vw, 600px)',
          background: 'radial-gradient(circle, rgba(255,87,15,0.09), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: 'clamp(200px, 35vw, 440px)',
          height: 'clamp(200px, 35vw, 440px)',
          background: 'radial-gradient(circle, rgba(253,232,122,0.06), transparent 70%)',
          filter: 'blur(100px)',
          borderRadius: '50%',
        }}
      />

      {/* ── Mesh grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,87,15,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.022) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-14 md:mb-20">

          {/* Badge */}
          <div
            className="ps-badge inline-flex items-center gap-2 rounded-full mb-5 md:mb-6"
            style={{
              padding: '7px 18px',
              border: '1px solid rgba(255,87,15,0.28)',
              background: 'rgba(255,87,15,0.07)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#FF570F' }}
            />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: '10px',
                color: 'rgba(255,87,15,0.92)',
                letterSpacing: '0.22em',
              }}
            >
              Products We've Built & Ship
            </span>
          </div>

          {/* Heading */}
          <h2
            ref={headingRef}
            className="ps-heading font-black leading-tight mb-5"
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

          {/* Sub */}
          <p
            className="ps-sub leading-relaxed mx-auto"
            style={{
              fontSize: 'clamp(14px, 1.5vw, 17px)',
              color: 'rgba(255,255,255,0.48)',
              maxWidth: '540px',
            }}
          >
            We don't just run client accounts — we build our own software too. These
            are live, paying products built and operated by the DDW team.
          </p>
        </div>

        {/* ── Product Cards ── */}
        <div className="flex flex-col gap-5 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;