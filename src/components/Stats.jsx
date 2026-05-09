import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: isMobile check (for graceful degradation)
// ─────────────────────────────────────────────────────────────────────────────
const isMobileDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// STATS DATA
// ─────────────────────────────────────────────────────────────────────────────
const stats = [
  {
    end: 683,
    format: (v) => `$${Math.floor(v)}K+`,
    label: 'Monthly Meta Spend Managed',
    sublabel: '343 campaigns · 76M impressions · 5.48x avg ROAS. EU fashion & golf brand.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
        viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    end: 27,
    format: (v) => `$${(v / 10).toFixed(1)}M+`,
    label: 'Amazon Sales Managed',
    sublabel: '129,800 orders · 27.64% ACOS · Full seller central operations since 2015.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
        viewBox="0 0 24 24">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    end: 600,
    format: (v) => `${Math.floor(v)}%`,
    label: 'Peak Google Ads ROAS',
    sublabel: '€418K revenue on €69.7K spend. EU video door intercom brand.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
        viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M11 8v3l2 2" />
      </svg>
    ),
  },
  {
    end: 54,
    format: (v) => `${Math.floor(v)}K`,
    label: 'Monthly SEO Visitors',
    sublabel: 'From 2K to 54K. 251K clicks · 10.3M impressions. E-commerce SEO retainer.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"
        viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STAT ITEM — Individual animated counter card
// ─────────────────────────────────────────────────────────────────────────────
const StatItem = ({ stat }) => {
  const countRef = useRef(null);
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  // Counter animation
  useEffect(() => {
    if (!countRef.current) return;
    const obj = { value: 0 };
    const anim = gsap.to(obj, {
      value: stat.end,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: countRef.current,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = stat.format(obj.value);
        }
      },
    });
    return () => anim.kill();
  }, [stat]);

  // 3D tilt + Spotlight — desktop only
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isMobileDevice()) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    gsap.to(cardRef.current, {
      rotationY: dx * 8,
      rotationX: -dy * 6,
      transformPerspective: 900,
      ease: 'power2.out',
      duration: 0.35,
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
    // Reset border color on mouse leave for smooth transition
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(255,255,255,0.1)';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="stat-card group relative flex flex-col items-center text-center rounded-2xl p-6 md:p-8 cursor-default"
      style={{
        background: 'linear-gradient(135deg, #131618 0%, #0d1012 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'border-color 0.4s ease',
      }}
      onMouseEnter={(e) => {
        if (cardRef.current) {
          cardRef.current.style.borderColor = 'rgba(255,87,15,0.35)';
        }
      }}
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none hidden md:block"
        style={{
          background: spotlight.active
            ? `radial-gradient(220px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,87,15,0.07), transparent 70%)`
            : 'transparent',
          transition: 'background 0.12s ease',
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-2xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100"
        style={{ transition: 'opacity 0.4s ease' }}
      >
        <div
          className="absolute top-0 right-0 w-20 h-20"
          style={{
            background: 'linear-gradient(135deg, transparent 60%, rgba(255,87,15,0.12) 100%)',
          }}
        />
      </div>

      {/* Icon badge */}
      <div
        className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl mb-5 flex-shrink-0"
        style={{
          background: 'rgba(255,87,15,0.1)',
          border: '1px solid rgba(255,87,15,0.2)',
          color: '#FF570F',
        }}
      >
        {stat.icon}
      </div>

      {/* Counter */}
      <div
        ref={countRef}
        className="relative z-10 font-black tabular-nums mb-4 leading-none"
        style={{
          fontSize: 'clamp(36px, 5vw, 52px)',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {stat.format(0)}
      </div>

      {/* Divider */}
      <div
        className="relative z-10 w-12 h-px mb-4"
        style={{
          background: 'linear-gradient(to right, transparent, #FF570F, transparent)',
        }}
      />

      {/* Label */}
      <div
        className="relative z-10 font-bold uppercase mb-3 group-hover:text-[#FF570F]"
        style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.9)',
          transition: 'color 0.3s ease',
        }}
      >
        {stat.label}
      </div>

      {/* Sub label */}
      <p
        className="relative z-10 leading-relaxed"
        style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.38)',
          maxWidth: '200px',
        }}
      >
        {stat.sublabel}
      </p>

      {/* Bottom progress bar on hover */}
      <div
        className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
        style={{
          background: 'linear-gradient(to right, #FF570F, #FDE87A)',
          width: '0%',
          transition: 'width 0.6s ease',
        }}
        ref={(el) => {
          if (el) {
            const parent = el.closest('.group');
            if (parent) {
              parent.addEventListener('mouseenter', () => {
                el.style.width = '100%';
              });
              parent.addEventListener('mouseleave', () => {
                el.style.width = '0%';
              });
            }
          }
        }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const Stats = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-card',
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
          },
        }
      );
      gsap.fromTo(
        '.stats-badge',
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-20"
      style={{
        background: '#080a0c',
        borderTop: '1px solid rgba(255,87,15,0.08)',
        borderBottom: '1px solid rgba(255,87,15,0.08)',
      }}
    >
      {/* Atmospheric orbs */}
      <div
        className="absolute top-1/2 left-1/4 pointer-events-none"
        style={{
          width: 'clamp(240px, 40vw, 480px)',
          height: 'clamp(240px, 40vw, 480px)',
          background: 'radial-gradient(circle, rgba(255,87,15,0.07), transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 pointer-events-none"
        style={{
          width: 'clamp(180px, 30vw, 380px)',
          height: 'clamp(180px, 30vw, 380px)',
          background: 'radial-gradient(circle, rgba(253,232,122,0.04), transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Mesh grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,87,15,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
          opacity: 0.35,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="text-center mb-10">
          <div
            className="stats-badge inline-flex items-center gap-2 rounded-full"
            style={{
              padding: '6px 16px',
              border: '1px solid rgba(255,87,15,0.25)',
              background: 'rgba(255,87,15,0.06)',
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
                color: 'rgba(255,87,15,0.9)',
                letterSpacing: '0.22em',
              }}
            >
              Real numbers · live accounts · dashboard screenshots available
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;