// src/components/Testimonial.jsx
// DDW Agency — Verified Channel Wins | Premium GSAP React Component

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand Tokens ──────────────────────────────────────────────────────────────
const BRAND = {
  orange: '#FF570F',
  orangeSoft: '#EE7D1D',
  accent: '#FDE87A',
  bg: '#080a0c',
  bgCard: '#0d1012',
  bgCardAlt: '#0a0c0e',
};

// ─── Verified Results Data ─────────────────────────────────────────────────────
const results = [
  {
    value: '$683K',
    label: 'Monthly Meta Spend',
    context: '343 campaigns · 5.48x avg ROAS',
    client: 'EU fashion & golf brand — 12+ month retainer',
    accent: '#FF570F',
    channel: 'Meta Ads',
    icon: '◈',
    floatPill: { label: '5.48x ROAS', delay: 0 },
  },
  {
    value: '$2.7M+',
    label: 'Amazon Sales Managed',
    context: '27.64% ACOS · 129,800 orders',
    client: 'US Amazon brand — managed since 2015',
    accent: '#EE7D1D',
    channel: 'Amazon',
    icon: '◉',
    floatPill: { label: '129.8K Orders', delay: 0.4 },
  },
  {
    value: '600%',
    label: 'Google Ads ROAS',
    context: '€418K revenue on €69.7K spend',
    client: 'EU video door intercom brand',
    accent: '#FF570F',
    channel: 'Google Ads',
    icon: '◎',
    floatPill: { label: '€418K Revenue', delay: 0.8 },
  },
  {
    value: '$290K',
    label: '7-Day TikTok GMV',
    context: '9,010 orders · +121% order growth',
    client: 'E-commerce brand — full shop setup & affiliate management',
    accent: '#EE7D1D',
    channel: 'TikTok Shop',
    icon: '◇',
    floatPill: { label: '+121% Growth', delay: 0.2 },
  },
  {
    value: '54K',
    label: 'Monthly SEO Visitors',
    context: 'From 2K to 54K — 251K total clicks',
    client: 'Syncwire e-commerce — full SEO retainer',
    accent: '#FDE87A',
    channel: 'SEO',
    icon: '◆',
    floatPill: { label: '251K Clicks', delay: 0.6 },
  },
  {
    value: '978+',
    label: 'AI Calls Handled',
    context: '24/7 · Books appointments · Qualifies leads',
    client: "Lyra — DDW's own AI voice receptionist SaaS",
    accent: '#FF570F',
    channel: 'AI SaaS',
    icon: '◈',
    floatPill: { label: '24/7 Active', delay: 1.0 },
  },
];

// ─── Abstract Animated Visual ─────────────────────────────────────────────────
const DataVisual = () => {
  const barsRef = useRef([]);
  const ringRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    // Animate bars
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      gsap.to(bar, {
        scaleY: gsap.utils.random(0.3, 1.0),
        duration: gsap.utils.random(1.2, 2.4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.15,
      });
    });
    // Pulse ring
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 1.18,
        opacity: 0.15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    // Node glow
    if (nodeRef.current) {
      gsap.to(nodeRef.current, {
        boxShadow: `0 0 32px 8px #FF570F60`,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  const barHeights = [40, 65, 50, 80, 45, 70, 55, 90, 35, 75, 60, 85];

  return (
    <div className="relative flex items-center justify-center w-full h-full select-none pointer-events-none">
      {/* Dashed orbiting rings */}
      <div
        className="absolute rounded-full border border-dashed border-white/5"
        style={{ width: 220, height: 220, animation: 'spin 18s linear infinite' }}
      />
      <div
        className="absolute rounded-full border border-dashed border-white/[0.07]"
        style={{ width: 150, height: 150, animation: 'spin 12s linear infinite reverse' }}
      />
      {/* Pulse ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
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
          width: 20,
          height: 20,
          background: 'radial-gradient(circle, #FF570F 0%, #EE7D1D 100%)',
          boxShadow: '0 0 16px 4px #FF570F40',
        }}
      />
      {/* Data bars */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
        {barHeights.map((h, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className="rounded-t-sm origin-bottom"
            style={{
              width: 4,
              height: h * 0.5,
              background: i % 3 === 0
                ? '#FF570F'
                : i % 3 === 1
                ? '#EE7D1D50'
                : '#FDE87A30',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Floating Pill ─────────────────────────────────────────────────────────────
const FloatingPill = ({ label, accent, delay, style }) => {
  const pillRef = useRef(null);

  useEffect(() => {
    if (!pillRef.current) return;
    gsap.to(pillRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay,
    });
  }, [delay]);

  return (
    <div
      ref={pillRef}
      className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-20 pointer-events-none"
      style={{
        background: `${accent}18`,
        border: `1px solid ${accent}35`,
        color: accent,
        backdropFilter: 'blur(8px)',
        ...style,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: accent }}
      />
      {label}
    </div>
  );
};

// ─── Spotlight Hook ────────────────────────────────────────────────────────────
const useSpotlight = () => {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setSpot((s) => ({ ...s, active: false }));
  }, []);

  return { spot, onMouseMove, onMouseLeave };
};

// ─── Result Card ───────────────────────────────────────────────────────────────
const ResultCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const { spot, onMouseMove, onMouseLeave } = useSpotlight();
  const isMobile = useRef(window.matchMedia('(max-width: 768px)').matches);

  // 3D Tilt — desktop only
  const handleMouseMove3D = useCallback(
    (e) => {
      if (isMobile.current || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      gsap.to(cardRef.current, {
        rotationY: dx * 8,
        rotationX: -dy * 8,
        transformPerspective: 900,
        ease: 'power2.out',
        duration: 0.5,
      });
      onMouseMove(e);
    },
    [onMouseMove]
  );

  const handleMouseLeave3D = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
    onMouseLeave();
  }, [onMouseLeave]);

  return (
    <div
      ref={cardRef}
      className="result-stat relative rounded-2xl overflow-hidden border border-white/[0.06] group cursor-default"
      style={{
        background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bgCardAlt} 100%)`,
        willChange: 'transform',
      }}
      onMouseMove={!isMobile.current ? handleMouseMove3D : undefined}
      onMouseLeave={!isMobile.current ? handleMouseLeave3D : undefined}
    >
      {/* Spotlight overlay */}
      {spot.active && !isMobile.current && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, ${item.accent}14 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${item.accent} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${item.accent}35 0%, transparent 70%)`,
          filter: 'blur(24px)',
        }}
      />

      {/* Watermark */}
      <div
        className="absolute -bottom-4 -right-3 font-black pointer-events-none select-none leading-none"
        style={{
          fontSize: 'clamp(60px, 8vw, 120px)',
          color: item.accent,
          opacity: 0.04,
          letterSpacing: '-0.04em',
        }}
      >
        {item.value}
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accent}50, transparent)`,
        }}
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
        <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{
            borderColor: `${item.accent}35`,
            color: item.accent,
            background: `${item.accent}10`,
          }}
        >
          <span style={{ color: item.accent }}>{item.icon}</span>
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
        <div
          className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-4"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {item.label}
        </div>

        {/* Divider */}
        <div
          className="w-10 h-px mb-4 transition-all duration-500 group-hover:w-16"
          style={{ background: `${item.accent}55` }}
        />

        {/* Context */}
        <p className="text-white/45 text-xs leading-relaxed mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          {item.context}
        </p>

        {/* Client */}
        <p className="text-white/25 text-[11px] leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          {item.client}
        </p>
      </div>
    </div>
  );
};

// ─── Magnetic CTA Button ───────────────────────────────────────────────────────
const MagneticButton = ({ href, children, className }) => {
  const btnRef = useRef(null);
  const isMobile = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
  );
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    if (isMobile.current || !btnRef.current) return;
    xTo.current = gsap.quickTo(btnRef.current, 'x', {
      duration: 0.5,
      ease: 'power3.out',
    });
    yTo.current = gsap.quickTo(btnRef.current, 'y', {
      duration: 0.5,
      ease: 'power3.out',
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isMobile.current || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    xTo.current?.(dx * 0.35);
    yTo.current?.(dy * 0.35);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isMobile.current || !btnRef.current) return;
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onMouseMove={!isMobile.current ? handleMouseMove : undefined}
      onMouseLeave={!isMobile.current ? handleMouseLeave : undefined}
    >
      {children}
    </a>
  );
};

// ─── Channel Bar Visual ────────────────────────────────────────────────────────
const ChannelBar = ({ label, pct, accent, delay }) => {
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { width: 0 },
      {
        width: `${pct}%`,
        duration: 1.2,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 90%',
          once: true,
        },
      }
    );
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.18em] w-20 flex-shrink-0"
        style={{ color: accent, fontFamily: 'Montserrat, sans-serif' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-white/[0.06] relative">
        <div
          ref={barRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full"
          style={{ background: accent, width: 0 }}
        />
      </div>
      <span className="text-[10px] text-white/30" style={{ fontFamily: 'Inter, sans-serif' }}>
        {pct}%
      </span>
    </div>
  );
};

// ─── Main Testimonial Component ────────────────────────────────────────────────
const Testimonial = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subtitleRef = useRef(null);
  const footerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const lineRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ── Orb drift
      gsap.to(orb1Ref.current, {
        x: 40,
        y: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        x: -30,
        y: 20,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });

      // ── Top line reveal
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            once: true,
          },
        }
      );

      // ── Eyebrow
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );

      // ── Heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50, skewX: 2 },
        {
          opacity: 1,
          y: 0,
          skewX: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );

      // ── Subtitle
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );

      // ── Cards stagger
      const cards = section.querySelectorAll('.result-stat');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section.querySelector('.results-grid'),
            start: 'top 82%',
            once: true,
          },
        }
      );

      // ── Footer bar
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );

      // ── Visual panel
      if (visualRef.current) {
        gsap.fromTo(
          visualRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: visualRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: BRAND.bg }}
    >
      {/* ── CSS keyframes injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.025; }
          50% { opacity: 0.05; }
        }
        .ddw-section-pad { padding: clamp(64px, 8vw, 120px) 0; }
      `}</style>

      {/* ── Atmospheric orbs ── */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '-8%',
          width: 'clamp(300px, 40vw, 600px)',
          height: 'clamp(300px, 40vw, 600px)',
          background: `radial-gradient(circle, ${BRAND.orange}18 0%, transparent 70%)`,
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        style={{
          bottom: '5%',
          right: '-10%',
          width: 'clamp(250px, 35vw, 500px)',
          height: 'clamp(250px, 35vw, 500px)',
          background: `radial-gradient(circle, ${BRAND.orangeSoft}14 0%, transparent 70%)`,
          filter: 'blur(100px)',
          borderRadius: '50%',
        }}
      />

      {/* ── Mesh grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          animation: 'gridPulse 6s ease-in-out infinite',
        }}
      />

      {/* ── Top border line ── */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND.orange}35, ${BRAND.accent}25, transparent)`,
          opacity: 0,
        }}
      />

      {/* ── Main content ── */}
      <div className="ddw-section-pad relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">

          {/* ── Header row ── */}
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
                  opacity: 0,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: BRAND.orange, boxShadow: `0 0 6px ${BRAND.orange}` }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: BRAND.orange, fontFamily: 'Montserrat, sans-serif' }}
                >
                  Verified Results — Six Channels
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: `${BRAND.accent}80` }}
                />
              </div>

              {/* Heading */}
              <h2
                ref={headingRef}
                className="font-black mb-5 leading-[1.05]"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(34px, 5vw, 64px)',
                  letterSpacing: '-0.03em',
                  color: '#fff',
                  opacity: 0,
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
                  fontFamily: 'Inter, sans-serif',
                  color: 'rgba(255,255,255,0.45)',
                  maxWidth: '540px',
                  opacity: 0,
                }}
              >
                Every number is pulled from a live account. We manage Meta, Google,
                Amazon, TikTok, SEO, and our own AI software — one team, fully on
                retainer.
              </p>
            </div>

            {/* Right: abstract visual box */}
            <div
              ref={visualRef}
              className="relative flex-shrink-0 w-full lg:w-64 xl:w-72 h-48 lg:h-56 rounded-2xl overflow-hidden border border-white/[0.06] hidden sm:flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${BRAND.bgCard} 0%, ${BRAND.bgCardAlt} 100%)`,
                opacity: 0,
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(${BRAND.orange} 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${BRAND.orange}40, transparent)`,
                }}
              />
              {/* Channel bars */}
              <div className="relative z-10 w-full px-6 py-4">
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.22em] mb-4"
                  style={{ color: `${BRAND.orange}80`, fontFamily: 'Montserrat, sans-serif' }}
                >
                  Channel Performance
                </p>
                <ChannelBar label="Meta" pct={92} accent={BRAND.orange} delay={0.1} />
                <ChannelBar label="Amazon" pct={85} accent={BRAND.orangeSoft} delay={0.2} />
                <ChannelBar label="Google" pct={78} accent={BRAND.orange} delay={0.3} />
                <ChannelBar label="TikTok" pct={70} accent={BRAND.orangeSoft} delay={0.4} />
                <ChannelBar label="SEO" pct={65} accent={BRAND.accent} delay={0.5} />
                <ChannelBar label="AI SaaS" pct={88} accent={BRAND.orange} delay={0.6} />
              </div>
            </div>
          </div>

          {/* ── Results grid ── */}
          <div className="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12 md:mb-16">
            {results.map((item, i) => (
              <ResultCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* ── Footer proof bar ── */}
          <div
            ref={footerRef}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 p-6 md:p-7 rounded-2xl border border-white/[0.06] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${BRAND.bgCard}ee 0%, ${BRAND.bgCardAlt}ee 100%)`,
              backdropFilter: 'blur(12px)',
              opacity: 0,
            }}
          >
            {/* Footer dot grid */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${BRAND.orange} 1px, transparent 1px)`,
                backgroundSize: '22px 22px',
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${BRAND.orange}30, transparent)`,
              }}
            />

            {/* Left copy */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: BRAND.orange,
                    boxShadow: `0 0 8px ${BRAND.orange}`,
                  }}
                />
                <p
                  className="font-bold text-sm text-white"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  All results are from active retainer clients.
                </p>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.38)',
                  fontFamily: 'Inter, sans-serif',
                  paddingLeft: '18px',
                }}
              >
                Dashboard screenshots available on request. US + EU accounts.
                Florida LLC with offices in Florida and Rome.
              </p>

              {/* Mini stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pl-[18px]">
                {[
                  { val: '6', lbl: 'Channels' },
                  { val: '$3.7M+', lbl: 'Revenue Managed' },
                  { val: '100%', lbl: 'Retainer Based' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="font-black text-sm"
                      style={{
                        color: BRAND.orange,
                        fontFamily: 'Montserrat, sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {s.val}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {s.lbl}
                    </span>
                    {i < 2 && (
                      <span className="w-px h-3 bg-white/10 ml-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
              <MagneticButton
                href="https://calendly.com/digi-dreamworks/onboarding-call"
                className="flex items-center justify-center gap-3 min-h-[52px] px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.14em] w-full md:w-auto transition-all duration-300 group/btn"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  background: `linear-gradient(135deg, ${BRAND.orange} 0%, ${BRAND.orangeSoft} 100%)`,
                  color: '#080a0c',
                  boxShadow: `0 0 24px ${BRAND.orange}30`,
                }}
              >
                <span>Book a 20-Min Call</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </MagneticButton>
              <p
                className="text-center text-[10px] mt-2.5 uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'Inter, sans-serif' }}
              >
                No commitment · 20 minutes
              </p>
            </div>
          </div>

          {/* ── Bottom decorative line ── */}
          <div
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