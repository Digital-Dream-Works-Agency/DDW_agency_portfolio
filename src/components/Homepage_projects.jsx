import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const featuredProjects = [
  {
    id: 'meta-eu-fashion',
    title: 'EU Fashion & Golf Brand',
    category: 'Meta Ads',
    description:
      '$683K managed in a single month. 343 campaigns. 76M impressions. 5.48 ROAS across the full account. One of our longest-running Meta retainers.',
    img: null,
    tags: ['Meta Ads', 'EU Market', 'E-Commerce'],
    metrics: [
      { label: 'Monthly Spend Managed', value: '$683K' },
      { label: 'Average ROAS', value: '5.48x' },
      { label: 'Active Campaigns', value: '343' },
    ],
    featured: true,
  },
  {
    id: 'amazon-us',
    title: 'Amazon Brand — US Market',
    category: 'Amazon Management',
    description:
      "$2.7M in sales managed. 27.64% ACOS. 129,800 orders. We've run this account since 2015 — full PPC management and seller central operations.",
    img: '/portfolio/amazon-ads-main.png',
    tags: ['Amazon Ads', 'Amazon FBA', 'USA'],
    metrics: [
      { label: 'Total Sales Managed', value: '$2.7M+' },
      { label: 'ACOS', value: '27.64%' },
      { label: 'Orders', value: '129,800' },
    ],
  },
  {
    id: 'mathfel-google',
    title: 'Mathfel — Video Door Intercom',
    category: 'Google Ads',
    description:
      'EU Google Ads campaign: 600% ROAS on €69.7K spend. €418K in revenue. Competitive home security market, EU audience.',
    img: '/portfolio/google-ads-600roas.png',
    tags: ['Google Ads', 'EU Market', 'E-Commerce'],
    metrics: [
      { label: 'ROAS', value: '600%' },
      { label: 'Revenue', value: '€418K' },
    ],
  },
  {
    id: 'tiktok-shop',
    title: 'TikTok Shop — E-Commerce',
    category: 'TikTok Shop',
    description:
      '$290,753 GMV in 7 days. 9,010 orders. +121% order growth. Full TikTok Shop setup, affiliate management, and shoppable content strategy.',
    img: '/portfolio/tiktok-shop.png',
    tags: ['TikTok Shop', 'E-Commerce', 'Social Commerce'],
    metrics: [
      { label: '7-Day GMV', value: '$290K' },
      { label: 'Orders', value: '9,010' },
      { label: 'Order Growth', value: '+121%' },
    ],
  },
  {
    id: 'seo-syncwire',
    title: 'Syncwire — E-Commerce SEO',
    category: 'SEO',
    description:
      'From 2K to 54K monthly visitors. 251K total clicks. 10.3M impressions. Full SEO: technical audit, content, link-building, and site architecture rebuild.',
    img: '/portfolio/seo-251k.png',
    tags: ['SEO', 'E-Commerce', 'Organic Growth'],
    metrics: [
      { label: 'Monthly Visitors', value: '2K → 54K' },
      { label: 'Total Clicks', value: '251K' },
      { label: 'Impressions', value: '10.3M' },
    ],
  },
  {
    id: 'lyra-saas',
    title: 'Lyra — AI Voice Receptionist',
    category: 'Product Built',
    description:
      'Our flagship AI SaaS. Answers every call, books appointments, sends qualified leads — 24/7. Powered by Twilio, AWS, and Google Cloud. Built and shipped by DDW.',
    img: null,
    url: 'https://lyrabyddw.com',
    tags: ['AI SaaS', 'Voice AI', 'Built by DDW'],
    metrics: [
      { label: 'Calls Handled', value: '978+' },
      { label: 'Availability', value: '24/7' },
      { label: 'Built by DDW', value: 'Live' },
    ],
  },
];

// ─── Abstract Metrics Dashboard (no-image cards) ──────────────────────────────
const MetricsDashboard = ({ project }) => {
  const bars = [55, 80, 40, 95, 65, 100, 45, 75, 60, 88];
  const maxIdx = bars.indexOf(Math.max(...bars));

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'rgba(255,87,15,0.06)',
          filter: 'blur(40px)',
        }}
      />

      {/* Mac OS Window Mockup */}
      <div
        className="relative w-full h-full max-w-xs mx-auto rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'rgba(10,11,13,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Window Title Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <div className="flex gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: '#FF5F57' }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: '#FEBC2E' }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: '#28C840' }}
            />
          </div>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.2em',
            }}
          >
            {project.category}
          </span>
          <div className="w-14" />
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 flex flex-col p-5 min-h-0">
          {/* Primary metric */}
          <div className="mb-4">
            <div
              className="font-black leading-none mb-1"
              style={{
                fontSize: 'clamp(28px, 5vw, 38px)',
                background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.metrics[0]?.value}
            </div>
            <div
              className="uppercase font-bold"
              style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.2em',
              }}
            >
              {project.metrics[0]?.label}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex-1 flex items-end gap-1 min-h-0">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-300"
                style={{
                  height: `${h}%`,
                  background:
                    i === maxIdx
                      ? 'linear-gradient(to top, #FF570F, #FDE87A)'
                      : 'rgba(255,87,15,0.18)',
                }}
              />
            ))}
          </div>

          {/* Secondary metrics row */}
          {project.metrics.length > 1 && (
            <div
              className="mt-4 pt-3 flex gap-4 flex-wrap"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {project.metrics.slice(1).map((m, i) => (
                <div key={i}>
                  <div
                    className="font-black"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="uppercase"
                    style={{
                      fontSize: '8px',
                      color: 'rgba(255,255,255,0.22)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Floating Stat Pill ────────────────────────────────────────────────────────
const FloatingPill = ({ value, label, style, pillRef }) => (
  <div
    ref={pillRef}
    className="absolute z-20 flex items-center gap-2 rounded-xl pointer-events-none"
    style={{
      padding: '8px 12px',
      background: 'rgba(10,11,13,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,87,15,0.25)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      ...style,
    }}
  >
    <div
      className="w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ background: '#FF570F' }}
    />
    <div>
      <div
        className="font-black leading-none"
        style={{ fontSize: '12px', color: '#FF570F' }}
      >
        {value}
      </div>
      <div
        className="uppercase"
        style={{
          fontSize: '8px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.15em',
        }}
      >
        {label}
      </div>
    </div>
  </div>
);

// ─── Hero Project Card ─────────────────────────────────────────────────────────
const HeroProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const cardRef = useRef(null);
  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);
  const isExternal = !!project.url;
  const dest = project.url || '/projects';

  // Floating pill GSAP yoyo animations
  useEffect(() => {
    const p1 = pill1Ref.current;
    const p2 = pill2Ref.current;
    if (!p1 || !p2) return;

    const tl = gsap.timeline();
    tl.to(p1, {
      y: -10,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }).to(
      p2,
      {
        y: -8,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      },
      0.4
    );

    return () => tl.kill();
  }, []);

  // 3D Tilt — desktop only via matchMedia
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const isTouchDevice = window.matchMedia('(max-width: 768px)').matches;
    if (isTouchDevice) return;

    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    gsap.to(cardRef.current, {
      rotationY: dx * 6,
      rotationX: -dy * 4,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.4,
    });

    // Spotlight
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
    });
    setSpotlight((s) => ({ ...s, active: false }));
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        height: 'clamp(480px, 60vw, 640px)',
        background: '#08090A',
        border: '1px solid rgba(255,87,15,0.18)',
        transition: 'border-color 0.5s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
        style={{
          background: spotlight.active
            ? `radial-gradient(320px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,87,15,0.08), transparent 70%)`
            : 'transparent',
          transition: 'background 0.15s ease',
        }}
      />

      {/* Floating pills — hidden on mobile */}
      <div className="hidden md:block">
        <FloatingPill
          pillRef={pill1Ref}
          value={project.metrics[0]?.value}
          label={project.metrics[0]?.label}
          style={{ top: '18%', right: '5%' }}
        />
        {project.metrics[1] && (
          <FloatingPill
            pillRef={pill2Ref}
            value={project.metrics[1]?.value}
            label={project.metrics[1]?.label}
            style={{ top: '38%', right: '6%' }}
          />
        )}
      </div>

      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        {project.img ? (
          <>
            {!imageLoaded && (
              <div
                className="absolute inset-0"
                style={{ background: '#0d0d0f' }}
              />
            )}
            <img
              src={project.img}
              alt={project.title}
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.7s, transform 0.7s',
                transform: 'scale(1)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, #08090A 30%, rgba(8,9,10,0.65) 60%, transparent 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, #08090A 20%, transparent 60%)',
              }}
            />
          </>
        ) : (
          <>
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,87,15,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.8) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                opacity: 0.025,
              }}
            />
            {/* Right-side dashboard — md+ only */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
              <MetricsDashboard project={project} />
            </div>
            {/* Gradient fade */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, #08090A 40%, rgba(8,9,10,0.82) 65%, transparent 100%)',
              }}
            />
          </>
        )}
      </div>

      {/* Watermark text */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden select-none"
        style={{ opacity: 0.04 }}
      >
        <div
          className="font-black whitespace-nowrap leading-none"
          style={{
            fontSize: 'clamp(80px, 12vw, 160px)',
            color: '#FF570F',
          }}
        >
          {project.category.toUpperCase()}
        </div>
      </div>

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10 md:p-14">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-bold uppercase"
                style={{
                  padding: '4px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  borderRadius: '999px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid rgba(255,87,15,0.35)',
              color: '#FF570F',
              fontSize: '16px',
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            ↗
          </div>
        </div>

        {/* Bottom: heading + desc + metrics */}
        <div style={{ maxWidth: '520px' }}>
          <div
            className="font-bold uppercase mb-3"
            style={{
              color: '#FF570F',
              fontSize: '11px',
              letterSpacing: '0.25em',
            }}
          >
            {project.category}
          </div>
          <h3
            className="font-black leading-tight mb-4"
            style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            {project.title}
          </h3>
          <p
            className="leading-relaxed mb-8"
            style={{
              color: 'rgba(255,255,255,0.52)',
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              maxWidth: '440px',
            }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-10">
            {project.metrics.map((metric, i) => (
              <div key={i}>
                <div
                  className="font-black leading-tight"
                  style={{
                    fontSize: 'clamp(22px, 3vw, 34px)',
                    background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {metric.value}
                </div>
                <div
                  className="uppercase mt-1"
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.18em',
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={dest}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        {cardContent}
      </a>
    );
  }
  return (
    <Link to={dest} className="block w-full">
      {cardContent}
    </Link>
  );
};

// ─── Grid Project Card ─────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const cardRef = useRef(null);
  const wrapRef = useRef(null);
  const isExternal = !!project.url;
  const dest = project.url || '/projects';

  // Scroll-triggered fade-up
  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // 3D tilt — desktop only
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const dx =
      (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy =
      (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    gsap.to(cardRef.current, {
      rotationY: dx * 7,
      rotationX: -dy * 5,
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
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        height: 'clamp(380px, 45vw, 440px)',
        background: '#08090A',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.5s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Spotlight — desktop only */}
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
        style={{
          background: spotlight.active
            ? `radial-gradient(260px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,87,15,0.07), transparent 70%)`
            : 'transparent',
          transition: 'background 0.12s ease',
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,87,15,0.04), rgba(253,232,122,0.04))',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {project.img ? (
          <>
            {!imageLoaded && (
              <div
                className="absolute inset-0"
                style={{ background: '#0d0d0f' }}
              />
            )}
            <img
              src={project.img}
              alt={project.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.7s, transform 0.7s',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, #08090A 25%, rgba(8,9,10,0.55) 60%, transparent 100%)',
              }}
            />
          </>
        ) : (
          <>
            {/* Grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,87,15,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.8) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                opacity: 0.02,
              }}
            />
            {/* Mini dashboard panel */}
            <div
              className="absolute right-5 top-5 bottom-5 w-32 transition-opacity duration-500"
              style={{ opacity: 0.5 }}
            >
              <div
                className="group-hover:opacity-100 w-full h-full rounded-xl p-4 flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  opacity: 'inherit',
                  transition: 'opacity 0.5s',
                }}
              >
                <div
                  className="font-mono uppercase mb-3"
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.18)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {project.category}
                </div>
                <div
                  className="font-black mb-1"
                  style={{ fontSize: '16px', color: '#FF570F' }}
                >
                  {project.metrics[0]?.value}
                </div>
                <div
                  className="uppercase mb-4"
                  style={{
                    fontSize: '7px',
                    color: 'rgba(255,255,255,0.18)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {project.metrics[0]?.label}
                </div>
                <div className="flex-1 flex items-end gap-1 min-h-0">
                  {[50, 80, 35, 100, 60, 85, 45].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 3
                            ? 'linear-gradient(to top, #FF570F, rgba(255,87,15,0.6))'
                            : 'rgba(255,255,255,0.06)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Gradient fade over mini dashboard */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, #08090A 45%, rgba(8,9,10,0.78) 70%, transparent 100%)',
              }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span
            className="font-bold uppercase"
            style={{
              color: '#FF570F',
              fontSize: '10px',
              letterSpacing: '0.2em',
            }}
          >
            {project.category}
          </span>
          <div
            className="flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: '40px',
              height: '40px',
              minHeight: '40px',
              minWidth: '40px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '14px',
            }}
          >
            ↗
          </div>
        </div>

        {/* Bottom content */}
        <div>
          <h4
            className="font-black leading-tight mb-2"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              letterSpacing: '-0.025em',
              color: '#ffffff',
            }}
          >
            {project.title}
          </h4>
          <p
            className="leading-relaxed mb-5"
            style={{
              color: 'rgba(255,255,255,0.42)',
              fontSize: 'clamp(13px, 1.2vw, 14px)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </p>
          <div
            className="flex flex-wrap gap-5 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {project.metrics.map((metric, i) => (
              <div key={i}>
                <div
                  className="font-black"
                  style={{
                    fontSize: 'clamp(15px, 2vw, 18px)',
                    color: '#FF570F',
                  }}
                >
                  {metric.value}
                </div>
                <div
                  className="uppercase mt-0.5"
                  style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <div ref={wrapRef} className="block w-full">
        <a
          href={dest}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          {cardContent}
        </a>
      </div>
    );
  }
  return (
    <div ref={wrapRef} className="block w-full">
      <Link to={dest} className="block w-full">
        {cardContent}
      </Link>
    </div>
  );
};

// ─── Magnetic CTA Button ───────────────────────────────────────────────────────
const MagneticButton = ({ to, children }) => {
  const btnRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    if (!btnRef.current) return;
    const el = btnRef.current;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    xTo.current = gsap.quickTo(el, 'x', {
      duration: 0.4,
      ease: 'power3.out',
    });
    yTo.current = gsap.quickTo(el, 'y', {
      duration: 0.4,
      ease: 'power3.out',
    });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      xTo.current((e.clientX - cx) * 0.35);
      yTo.current((e.clientY - cy) * 0.35);
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

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={btnRef}
      to={to}
      className="hp-cta group inline-flex items-center gap-3 font-bold uppercase"
      style={{
        padding: '14px 28px',
        border: '1px solid rgba(255,87,15,0.4)',
        color: hovered ? '#080a0c' : '#FF570F',
        background: hovered ? '#FF570F' : 'transparent',
        borderColor: hovered ? '#FF570F' : 'rgba(255,87,15,0.4)',
        fontSize: '11px',
        letterSpacing: '0.18em',
        transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        minHeight: '48px',
        display: 'inline-flex',
        alignItems: 'center',
        willChange: 'transform',
        textDecoration: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <svg
        style={{
          width: '16px',
          height: '16px',
          transition: 'transform 0.3s ease',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  );
};

// ─── Main Section ──────────────────────────────────────────────────────────────
const HomeProjects = () => {
  const sectionRef = useRef(null);
  const heroProjectRef = useRef(null);

  const heroProject = featuredProjects.find((p) => p.featured);
  const gridProjects = featuredProjects.filter((p) => !p.featured);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const triggerOpts = {
        trigger: sectionRef.current,
        start: 'top 82%',
        once: true,
      };

      gsap.fromTo(
        '.hp-badge',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: triggerOpts }
      );
      gsap.fromTo(
        '.hp-heading',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: triggerOpts,
        }
      );
      gsap.fromTo(
        '.hp-sub',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: triggerOpts,
        }
      );
      gsap.fromTo(
        '.hp-cta',
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.28,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      if (heroProjectRef.current) {
        gsap.fromTo(
          heroProjectRef.current,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroProjectRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24 lg:py-32"
      style={{ background: '#080a0c' }}
    >
      {/* ── Atmospheric background orbs ── */}
      <div
        className="absolute top-0 right-1/3 pointer-events-none"
        style={{
          width: 'clamp(300px, 50vw, 600px)',
          height: 'clamp(300px, 50vw, 600px)',
          background:
            'radial-gradient(circle, rgba(255,87,15,0.09), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute bottom-1/4 left-0 pointer-events-none"
        style={{
          width: 'clamp(200px, 35vw, 400px)',
          height: 'clamp(200px, 35vw, 400px)',
          background:
            'radial-gradient(circle, rgba(253,232,122,0.05), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />

      {/* ── Dotted mesh mask ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,87,15,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-8">
          <div className="max-w-2xl">

            {/* Badge */}
            <div
              className="hp-badge inline-flex items-center gap-2 rounded-full mb-5 md:mb-6"
              style={{
                padding: '7px 16px',
                border: '1px solid rgba(255,87,15,0.3)',
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
                  color: '#FF570F',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                }}
              >
                Real Accounts. Real Numbers.
              </span>
            </div>

            {/* Heading */}
            <h2
              className="hp-heading font-black leading-tight mb-4"
              style={{
                fontSize: 'clamp(32px, 5vw, 62px)',
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              What We've{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Actually Built
              </span>
            </h2>

            {/* Sub */}
            <p
              className="hp-sub leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.48)',
                fontSize: 'clamp(14px, 1.5vw, 17px)',
                maxWidth: '460px',
              }}
            >
              Every number below is from a live account. Dashboard screenshots
              available. No estimates, no projections.
            </p>
          </div>

          {/* Magnetic CTA */}
          <MagneticButton to="/projects">See All Work</MagneticButton>
        </div>

        {/* ── Hero Featured Card ── */}
        {heroProject && (
          <div ref={heroProjectRef} className="mb-5 md:mb-6">
            <HeroProjectCard project={heroProject} />
          </div>
        )}

        {/* ── Grid Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {gridProjects.map((project, index) => {
            const isLastOdd =
              gridProjects.length % 2 !== 0 &&
              index === gridProjects.length - 1;
            return (
              <div
                key={project.id}
                className={isLastOdd ? 'md:col-span-2' : ''}
              >
                <ProjectCard project={project} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeProjects;