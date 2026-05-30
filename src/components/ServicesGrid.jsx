// services-grid/ServicesGrid.jsx
import React, {
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Stable, computed-once mobile detection
// ─────────────────────────────────────────────────────────────────────────────
let mobileMediaQuery = null;
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  if (!mobileMediaQuery) {
    mobileMediaQuery = window.matchMedia('(max-width: 768px)');
  }
  return mobileMediaQuery.matches;
};

// ─────────────────────────────────────────────────────────────────────────────
// ICON COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const IconMeta = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconGoogle = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M11 8v3l2 2" />
  </svg>
);

const IconAmazon = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconTikTok = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const IconSEO = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconAI = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>
);

const IconSaaS = (props) => (
  <svg width="28" height="28" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
  </svg>
);

const IconArrow = (props) => (
  <svg width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES DATA
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES_DATA = [
  {
    title: 'Meta Ads Management',
    desc: '$683K managed in a single month. 343 active campaigns. 5.48x average ROAS. We run full-funnel Meta strategy for EU and US brands — prospecting, retargeting, catalog, and creative testing — on retainer.',
    proof: '$683K / mo managed',
    accent: '#FF570F',
    href: '/services/meta-ads',
    IconComponent: IconMeta,
  },
  {
    title: 'Google Ads Management',
    desc: '600% ROAS on €69.7K spend. €418K in revenue for a single EU brand. We manage search, shopping, and display campaigns across US and EU markets — built around real conversion data, not vanity clicks.',
    proof: '600% ROAS achieved',
    accent: '#EE7D1D',
    href: '/services/google-ads',
    IconComponent: IconGoogle,
  },
  {
    title: 'Amazon Management',
    desc: "$2.7M in sales managed. 129,800 orders. 27.64% ACOS. We've run one account since 2015 — full PPC management, seller central operations, listing optimization, and inventory strategy on retainer.",
    proof: '$2.7M+ sales managed',
    accent: '#FDE87A',
    href: '/services/amazon',
    IconComponent: IconAmazon,
  },
  {
    title: 'TikTok Shop & Social Commerce',
    desc: '$290,753 GMV in 7 days. 9,010 orders. +121% order growth. Full TikTok Shop setup, affiliate creator management, shoppable content strategy, and LIVE commerce execution — all maintained on retainer.',
    proof: '$290K GMV in 7 days',
    accent: '#FF570F',
    href: '/services/tiktok-shop',
    IconComponent: IconTikTok,
  },
  {
    title: 'SEO & Organic Growth',
    desc: 'From 2K to 54K monthly visitors. 251K total clicks. 10.3M impressions. We run technical SEO audits, site architecture rebuilds, link-building programs, and content strategies that compound — on retainer.',
    proof: '2K → 54K visitors/mo',
    accent: '#EE7D1D',
    href: '/services/seo',
    IconComponent: IconSEO,
  },
  {
    title: 'AI Development & Software',
    desc: 'We build the exact system your operation needs — not the closest off-the-shelf approximation. LLM pipelines, AI automation, custom dashboards, and production-grade software. Maintained by the engineers who built it.',
    proof: '3 live SaaS products shipped',
    accent: '#FDE87A',
    href: '/services/ai-development',
    IconComponent: IconAI,
  },
  {
    title: 'SaaS Products',
    desc: "We don't just build for clients. Lyra answers every business call 24/7 with AI — books appointments, qualifies leads, sends follow-ups. Sviluppiamo.dev is our Italian-market vibe coding platform. Built and shipped by DDW.",
    proof: 'Lyra · Sviluppiamo.dev',
    accent: '#FF570F',
    href: '/services/saas-products',
    IconComponent: IconSaaS,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CSS CUSTOM PROPERTY HELPER
// ─────────────────────────────────────────────────────────────────────────────
function setCSSVar(el, key, value) {
  el.style.setProperty(key, value);
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────────────────────────────────────────
const ServiceCard = memo(({ service, index }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const spotlightRef = useRef(null);
  const bottomBarRef = useRef(null);
  const rafRef = useRef(null);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = getIsMobile();
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const bar = bottomBarRef.current;
    if (!card) return;

    card.style.willChange = 'transform';
    setCSSVar(card, '--border-color', `${service.accent}55`);
    setCSSVar(card, '--title-color', service.accent);
    setCSSVar(card, '--desc-opacity', '0.72');

    if (bar) {
      bar.style.width = '100%';
    }

    if (icon) {
      gsap.to(icon, {
        scale: 1.15,
        rotation: 6,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [service.accent]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const spotlight = spotlightRef.current;
    const bar = bottomBarRef.current;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!card) return;

    card.style.willChange = 'auto';
    setCSSVar(card, '--border-color', 'rgba(255,255,255,0.06)');
    setCSSVar(card, '--title-color', '#ffffff');
    setCSSVar(card, '--desc-opacity', '0.42');

    if (spotlight) {
      spotlight.style.background = 'transparent';
    }

    if (bar) {
      bar.style.width = '0%';
    }

    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
    });

    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    }
  }, []);

  // RAF-throttled mousemove
  const handleMouseMove = useCallback((e) => {
    if (isMobile.current || !cardRef.current) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      const spotlight = spotlightRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (clientX - cx) / (rect.width / 2);
      const dy = (clientY - cy) / (rect.height / 2);

      gsap.to(card, {
        rotationY: dx * 7,
        rotationX: -dy * 5,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.35,
      });

      if (spotlight) {
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        spotlight.style.background =
          `radial-gradient(280px circle at ${x}% ${y}%, ${service.accent}12, transparent 70%)`;
      }

      rafRef.current = null;
    });
  }, [service.accent]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const { IconComponent } = service;

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="service-card group relative flex flex-col rounded-2xl overflow-hidden cursor-default"
      aria-label={`Service: ${service.title}`}
      style={{
        background: 'linear-gradient(145deg, #111416 0%, #0d1012 100%)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.06))',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.4s ease',
        minHeight: '420px',
      }}
    >
      {/* Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          transition: 'background 0.12s ease',
          zIndex: 1,
        }}
      />

      {/* Dot grid watermark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${service.accent}22 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      {/* Top glow orb */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none
                    opacity-0 group-hover:opacity-100"
        style={{
          background: `${service.accent}25`,
          filter: 'blur(32px)',
          transition: 'opacity 0.5s ease',
          zIndex: 0,
        }}
      />



      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 p-7 md:p-8">

        {/* Icon */}
        <div
          ref={iconRef}
          className="flex items-center justify-center w-12 h-12 rounded-xl mb-6 flex-shrink-0"
          style={{
            background: `${service.accent}15`,
            border: `1px solid ${service.accent}30`,
            color: service.accent,
          }}
          aria-hidden="true"
        >
          <IconComponent />
        </div>

        {/* Title */}
        <h3
          className="mb-3 text-xl sm:text-2xl font-bold tracking-tight"
          style={{
            
            
            color: 'var(--title-color, #ffffff)',
            transition: 'color 0.3s ease',
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="mb-6 flex-1 text-base leading-relaxed"
          style={{
            fontSize: 'clamp(16px, 1.1vw, 18px)',
            color: `rgba(255,255,255,var(--desc-opacity, 0.42))`,
            transition: 'color 0.3s ease',
          }}
        >
          {service.desc}
        </p>

        {/* Proof badge */}
        <div
          className="inline-flex items-center gap-2 self-start mb-6 rounded-full"
          style={{
            padding: '5px 12px',
            border: `1px solid ${service.accent}35`,
            background: `${service.accent}10`,
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: service.accent }}
            aria-hidden="true"
          />
          <span
            className="uppercase text-xs font-bold uppercase tracking-widest" style={{
              color: service.accent,
            }}
          >
            {service.proof}
          </span>
        </div>

        {/* Learn More */}
        <a
          href={service.href}
          className="learn-more-link inline-flex items-center gap-2 w-max min-h-[44px]"
          aria-label={`Learn more about ${service.title}`}
          style={{ textDecoration: 'none' }}
        >
          <span
            className="learn-more-text uppercase text-xs font-bold uppercase tracking-widest" style={{
              color: 'rgba(255,255,255,0.35)',
              transition: 'color 0.3s ease',
            }}
          >
            Learn More
          </span>
          <IconArrow
            className="learn-more-arrow"
            stroke={service.accent}
            style={{
              transition: 'transform 0.3s ease',
              opacity: 0.7,
            }}
          />
        </a>
      </div>

      {/* Bottom gradient bar */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
        style={{
          background: `linear-gradient(to right, ${service.accent}, #FDE87A)`,
          width: '0%',
          transition: 'width 0.6s ease',
        }}
      />
    </article>
  );
});

ServiceCard.displayName = 'ServiceCard';

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC CTA
// ─────────────────────────────────────────────────────────────────────────────
const MagneticCTA = memo(({ href, children }) => {
  const btnRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || getIsMobile()) return;

    xTo.current = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      xTo.current((e.clientX - (rect.left + rect.width / 2)) * 0.32);
      yTo.current((e.clientY - (rect.top + rect.height / 2)) * 0.32);
    };

    const handleEnter = () => {
      el.style.willChange = 'transform';
      el.setAttribute('data-hovered', 'true');
    };

    const handleLeave = () => {
      el.style.willChange = 'auto';
      el.setAttribute('data-hovered', 'false');
      xTo.current(0);
      yTo.current(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      className="magnetic-cta relative inline-flex items-center gap-3 uppercase overflow-hidden text-sm font-bold uppercase tracking-widest" style={{
        padding: '15px 36px',
        
        
        minHeight: '52px',
        textDecoration: 'none',
        background: '#FF570F',
        color: '#080a0c',
        boxShadow: '0 8px 32px rgba(255,87,15,0.35)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <span
        className="shimmer absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s ease',
        }}
      />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <svg
          className="cta-arrow"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ transition: 'transform 0.3s ease' }}
        >
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </a>
  );
});

MagneticCTA.displayName = 'MagneticCTA';

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES GRID — Main section
// ─────────────────────────────────────────────────────────────────────────────
const FIRST_SIX = SERVICES_DATA.slice(0, 6);
const LAST_ONE = SERVICES_DATA[6];

const ServicesGrid = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const badgeRef = useRef(null);
  const subRef = useRef(null);
  const prlx1Ref = useRef(null);
  const prlx2Ref = useRef(null);
  const cardRefs = useRef([]);

  const registerCardRef = useCallback(
    (index) => (el) => {
      cardRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const mobile = getIsMobile();

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      const revealEls = [badgeRef.current, subRef.current].filter(Boolean);
      if (revealEls.length) {
        gsap.fromTo(
          revealEls,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      if (!mobile) {
        if (prlx1Ref.current) {
          gsap.to(prlx1Ref.current, {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, scrub: 1.5 },
          });
        }
        if (prlx2Ref.current) {
          gsap.to(prlx2Ref.current, {
            yPercent: -18,
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
      className="relative overflow-hidden py-16 md:py-8 md:py-12 lg:py-16"
      style={{ background: '#0d1012' }}
      aria-labelledby="services-heading"
    >
      {/* Mesh grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,87,15,0.025) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,87,15,0.025) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}
      />

      {/* Atmospheric orbs */}
      <div
        ref={prlx1Ref}
        className="absolute top-0 right-0 pointer-events-none"
        aria-hidden="true"
        style={{
          width: 'clamp(300px, 45vw, 600px)',
          height: 'clamp(300px, 45vw, 600px)',
          background: 'radial-gradient(circle, rgba(255,87,15,0.1), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />
      <div
        ref={prlx2Ref}
        className="absolute bottom-0 left-0 pointer-events-none"
        aria-hidden="true"
        style={{
          width: 'clamp(200px, 35vw, 480px)',
          height: 'clamp(200px, 35vw, 480px)',
          background: 'radial-gradient(circle, rgba(253,232,122,0.05), transparent 70%)',
          filter: 'blur(100px)',
          borderRadius: '50%',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">

          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full mb-5 md:mb-6"
            style={{
              padding: '7px 18px',
              border: '1px solid rgba(255,87,15,0.28)',
              background: 'rgba(255,87,15,0.07)',
              opacity: 0,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#FF570F' }}
              aria-hidden="true"
            />
            <span
              className="uppercase text-xs font-bold uppercase tracking-widest" style={{
                
                color: 'rgba(255,87,15,0.9)',
                
              }}
            >
              Seven service areas · Florida LLC · Rome & Florida offices
            </span>
          </div>

          {/* Heading */}
          <h2
            id="services-heading"
            ref={headingRef}
            className="mb-5 text-3xl md:text-4xl font-bold leading-[1.1] tracking-[-0.035em]"
            style={{
              
              
              color: '#ffffff',
              opacity: 0,
            }}
          >
            Every channel.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              One team.
            </span>
          </h2>

          {/* Sub */}
          <p
            ref={subRef}
            className="mx-auto text-base leading-relaxed"
            style={{
              fontSize: 'clamp(16px, 1.5vw, 18px)',
              color: 'rgba(255,255,255,0.48)',
              maxWidth: '560px',
              opacity: 0,
            }}
          >
            From Meta budgets to Amazon seller central to custom AI software — all
            maintained on retainer by the same engineers and marketers who built it.
          </p>
        </div>

        {/* First 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
          {FIRST_SIX.map((service, index) => (
            <div
              key={service.title}
              ref={registerCardRef(index)}
            >
              <ServiceCard service={service} index={index} />
            </div>
          ))}
        </div>

        {/* 7th card centered */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div
            className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            ref={registerCardRef(6)}
          >
            <ServiceCard service={LAST_ONE} index={6} />
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <MagneticCTA href="/services">View All Services</MagneticCTA>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;