import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Constants (module-level — never recreated) ───────────────────────────────
const BRAND = {
  orange: '#FF570F',
  yellow: '#FDE87A',
  bg: '#08090A',
  bgDark: '#0d0d0f',
};

const GRADIENT_TEXT = {
  background: `linear-gradient(135deg, ${BRAND.orange}, ${BRAND.yellow})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

// Pre-derive hero/grid split once — data is static, never changes at runtime
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

// Derive once at module scope — these will never change
const HERO_PROJECT = featuredProjects.find((p) => p.featured) ?? null;
const GRID_PROJECTS = featuredProjects.filter((p) => !p.featured);
const IS_ODD_GRID = GRID_PROJECTS.length % 2 !== 0;

// Bar chart data — static, computed once
const CHART_BARS = [55, 80, 40, 95, 65, 100, 45, 75, 60, 88];
const CHART_MAX_IDX = CHART_BARS.indexOf(Math.max(...CHART_BARS));

const MINI_BARS = [50, 80, 35, 100, 60, 85, 45];
const MINI_MAX_IDX = MINI_BARS.indexOf(Math.max(...MINI_BARS));

// Stable MediaQueryList — created once, reused across the module
// Avoids repeated window.matchMedia() calls in hot paths
let _isMobileQuery = null;
const getIsMobileQuery = () => {
  if (!_isMobileQuery && typeof window !== 'undefined') {
    _isMobileQuery = window.matchMedia('(max-width: 768px)');
  }
  return _isMobileQuery;
};

// ─── Custom Hook: 3D Tilt via GSAP (no React state) ──────────────────────────
/**
 * Encapsulates the 3D tilt + spotlight effect entirely in the DOM layer.
 * Zero React state updates = zero re-renders from mouse movement.
 */
const useTilt = (cardRef, spotlightRef, { rotX = 5, rotY = 7 } = {}) => {
  const isMobileRef = useRef(false);

  useEffect(() => {
    const mq = getIsMobileQuery();
    if (!mq) return;

    // Read initial value
    isMobileRef.current = mq.matches;

    // Keep in sync if user resizes
    const onChange = (e) => {
      isMobileRef.current = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isMobileRef.current || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      gsap.to(cardRef.current, {
        rotationY: dx * rotY,
        rotationX: -dy * rotX,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.4,
        // Activate willChange only during animation
        onStart() {
          if (cardRef.current) cardRef.current.style.willChange = 'transform';
        },
      });

      // Spotlight: direct DOM manipulation — bypasses React entirely
      if (spotlightRef?.current) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        spotlightRef.current.style.background = `radial-gradient(300px circle at ${x}% ${y}%, rgba(255,87,15,0.08), transparent 70%)`;
        spotlightRef.current.style.opacity = '1';
      }
    },
    [cardRef, spotlightRef, rotX, rotY]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
      // Release compositor layer after animation settles
      onComplete() {
        if (cardRef.current) cardRef.current.style.willChange = 'auto';
      },
    });

    if (spotlightRef?.current) {
      spotlightRef.current.style.opacity = '0';
    }
  }, [cardRef, spotlightRef]);

  return { handleMouseMove, handleMouseLeave };
};

// ─── MetricsDashboard ─────────────────────────────────────────────────────────
const MetricsDashboard = memo(({ project }) => (
  <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
    {/* Ambient glow — static, no interaction */}
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
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <span
          className="font-mono uppercase"
          style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}
        >
          {project.category}
        </span>
        <div className="w-14" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5 min-h-0">
        {/* Primary metric */}
        <div className="mb-4">
          <div
            className="font-black leading-none mb-1"
            style={{ fontSize: 'clamp(28px, 5vw, 38px)', ...GRADIENT_TEXT }}
          >
            {project.metrics[0]?.value}
          </div>
          <div
            className="uppercase font-bold"
            style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.2em' }}
          >
            {project.metrics[0]?.label}
          </div>
        </div>

        {/* Bar chart — static data, stable keys */}
        <div className="flex-1 flex items-end gap-1 min-h-0">
          {CHART_BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background:
                  i === CHART_MAX_IDX
                    ? `linear-gradient(to top, ${BRAND.orange}, ${BRAND.yellow})`
                    : 'rgba(255,87,15,0.18)',
              }}
            />
          ))}
        </div>

        {/* Secondary metrics */}
        {project.metrics.length > 1 && (
          <div
            className="mt-4 pt-3 flex gap-4 flex-wrap"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {project.metrics.slice(1).map((m) => (
              <div key={m.label}>
                <div
                  className="font-black"
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}
                >
                  {m.value}
                </div>
                <div
                  className="uppercase"
                  style={{ fontSize: '8px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em' }}
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
));

MetricsDashboard.displayName = 'MetricsDashboard';

// ─── FloatingPill ─────────────────────────────────────────────────────────────
const FloatingPill = memo(({ value, label, style, pillRef }) => (
  <div
    ref={pillRef}
    className="absolute z-20 flex items-center gap-2 rounded-xl pointer-events-none"
    style={{
      padding: '8px 12px',
      background: 'rgba(10,11,13,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: `1px solid rgba(255,87,15,0.25)`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      ...style,
    }}
  >
    {/*
      Replaced Tailwind's animate-pulse (which runs a CSS animation permanently)
      with a simple static indicator dot. The parent pill already has GSAP
      floating animation — a pulsing dot on top is redundant compositor overhead.
      If a pulse is required, drive it from the existing GSAP timeline.
    */}
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: BRAND.orange }}
    />
    <div>
      <div
        className="font-black leading-none"
        style={{ fontSize: '12px', color: BRAND.orange }}
      >
        {value}
      </div>
      <div
        className="uppercase"
        style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}
      >
        {label}
      </div>
    </div>
  </div>
));

FloatingPill.displayName = 'FloatingPill';

// ─── HeroProjectCard ──────────────────────────────────────────────────────────
const HeroProjectCard = memo(({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);

  const isExternal = !!project.url;
  const dest = project.url || '/projects';

  // Pill float animations — scoped GSAP context
  useEffect(() => {
    const ctx = gsap.context(() => {
      const p1 = pill1Ref.current;
      const p2 = pill2Ref.current;
      if (!p1 || !p2) return;

      gsap
        .timeline()
        .to(p1, { y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        .to(p2, { y: -8, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0.4);
    });

    return () => ctx.revert();
  }, []);

  // Tilt + spotlight — zero re-renders from mouse movement
  const { handleMouseMove, handleMouseLeave } = useTilt(cardRef, spotlightRef, {
    rotX: 4,
    rotY: 6,
  });

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // Memoize tag list — only changes if project.tags reference changes (never)
  const tagElements = useMemo(
    () =>
      project.tags.map((tag) => (
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
      )),
    [project.tags]
  );

  // Memoize metric elements
  const metricElements = useMemo(
    () =>
      project.metrics.map((metric) => (
        <div key={metric.label}>
          <div
            className="font-black leading-tight"
            style={{
              fontSize: 'clamp(22px, 3vw, 34px)',
              ...GRADIENT_TEXT,
              letterSpacing: '-0.02em',
            }}
          >
            {metric.value}
          </div>
          <div
            className="uppercase mt-1"
            style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em' }}
          >
            {metric.label}
          </div>
        </div>
      )),
    [project.metrics]
  );

  const cardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        height: 'clamp(480px, 60vw, 640px)',
        background: BRAND.bg,
        border: '1px solid rgba(255,87,15,0.18)',
        transformStyle: 'preserve-3d',
        // willChange intentionally omitted here — applied dynamically on hover via useTilt
      }}
    >
      {/*
        Spotlight: a raw DOM ref — no React state, no re-renders.
        Opacity toggled directly via ref in useTilt.
      */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
        style={{ opacity: 0, transition: 'opacity 0.15s ease' }}
      />

      {/* Floating pills — desktop only */}
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

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {project.img ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0" style={{ background: BRAND.bgDark }} />
            )}
            <img
              src={project.img}
              alt={project.title}
              loading="eager"
              decoding="async"
              onLoad={handleImageLoad}
              className="w-full h-full object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.7s',
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
              style={{ background: 'linear-gradient(to top, #08090A 20%, transparent 60%)' }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,87,15,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.8) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                opacity: 0.025,
              }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
              <MetricsDashboard project={project} />
            </div>
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

      {/* Watermark */}
      <div
        className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden select-none"
        style={{ opacity: 0.04 }}
      >
        <div
          className="font-black whitespace-nowrap leading-none"
          style={{ fontSize: 'clamp(80px, 12vw, 160px)', color: BRAND.orange }}
        >
          {project.category.toUpperCase()}
        </div>
      </div>

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10 md:p-14">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">{tagElements}</div>
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
              width: '44px',
              height: '44px',
              border: `1px solid rgba(255,87,15,0.35)`,
              color: BRAND.orange,
              fontSize: '16px',
            }}
          >
            ↗
          </div>
        </div>

        <div style={{ maxWidth: '520px' }}>
          <div
            className="font-bold uppercase mb-3"
            style={{ color: BRAND.orange, fontSize: '11px', letterSpacing: '0.25em' }}
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
          <div className="flex flex-wrap gap-6 sm:gap-10">{metricElements}</div>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={dest} target="_blank" rel="noopener noreferrer" className="block w-full">
        {cardContent}
      </a>
    );
  }
  return (
    <Link to={dest} className="block w-full">
      {cardContent}
    </Link>
  );
});

HeroProjectCard.displayName = 'HeroProjectCard';

// ─── ProjectCard ──────────────────────────────────────────────────────────────
const ProjectCard = memo(({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const wrapRef = useRef(null);
  const spotlightRef = useRef(null);

  const isExternal = !!project.url;
  const dest = project.url || '/projects';

  // Scoped scroll-triggered fade — kills ONLY its own trigger on unmount
  useEffect(() => {
    if (!wrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });

    // ctx.revert() kills only the ScrollTrigger(s) created in this context
    return () => ctx.revert();
  }, []);

  const { handleMouseMove, handleMouseLeave } = useTilt(cardRef, spotlightRef, {
    rotX: 5,
    rotY: 7,
  });

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  const metricElements = useMemo(
    () =>
      project.metrics.map((metric) => (
        <div key={metric.label}>
          <div
            className="font-black"
            style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: BRAND.orange }}
          >
            {metric.value}
          </div>
          <div
            className="uppercase mt-0.5"
            style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}
          >
            {metric.label}
          </div>
        </div>
      )),
    [project.metrics]
  );

  const cardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        height: 'clamp(380px, 45vw, 440px)',
        background: BRAND.bg,
        border: '1px solid rgba(255,255,255,0.06)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Spotlight — DOM-direct, no React state */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
        style={{ opacity: 0, transition: 'opacity 0.12s ease' }}
      />

      {/* Hover glow — pure CSS, no JS */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, rgba(255,87,15,0.04), rgba(253,232,122,0.04))',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {project.img ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0" style={{ background: BRAND.bgDark }} />
            )}
            <img
              src={project.img}
              alt={project.title}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              className="w-full h-full object-cover"
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.7s' }}
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
              className="absolute right-5 top-5 bottom-5 w-32"
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
                  style={{ fontSize: '8px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.15em' }}
                >
                  {project.category}
                </div>
                <div
                  className="font-black mb-1"
                  style={{ fontSize: '16px', color: BRAND.orange }}
                >
                  {project.metrics[0]?.value}
                </div>
                <div
                  className="uppercase mb-4"
                  style={{ fontSize: '7px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em' }}
                >
                  {project.metrics[0]?.label}
                </div>
                <div className="flex-1 flex items-end gap-1 min-h-0">
                  {MINI_BARS.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background:
                          i === MINI_MAX_IDX
                            ? `linear-gradient(to top, ${BRAND.orange}, rgba(255,87,15,0.6))`
                            : 'rgba(255,255,255,0.06)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
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
        <div className="flex items-center justify-between">
          <span
            className="font-bold uppercase"
            style={{ color: BRAND.orange, fontSize: '10px', letterSpacing: '0.2em' }}
          >
            {project.category}
          </span>
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '14px',
            }}
          >
            ↗
          </div>
        </div>

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
            {metricElements}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={wrapRef} className="block w-full">
      {isExternal ? (
        <a href={dest} target="_blank" rel="noopener noreferrer" className="block w-full">
          {cardContent}
        </a>
      ) : (
        <Link to={dest} className="block w-full">
          {cardContent}
        </Link>
      )}
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// ─── MagneticButton ───────────────────────────────────────────────────────────
/**
 * Hover state replaced with direct CSS class toggle via ref.
 * Zero React re-renders for a hover color change.
 */
const MagneticButton = memo(({ to, children }) => {
  const btnRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const mq = getIsMobileQuery();
    if (!mq) return;

    isMobileRef.current = mq.matches;
    const onChange = (e) => { isMobileRef.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || isMobileRef.current) return;

    xTo.current = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e) => {
      if (isMobileRef.current) return;
      const rect = el.getBoundingClientRect();
      xTo.current((e.clientX - (rect.left + rect.width / 2)) * 0.35);
      yTo.current((e.clientY - (rect.top + rect.height / 2)) * 0.35);
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

  // Hover handled via CSS class toggle — zero re-renders
  const handleMouseEnter = useCallback(() => {
    btnRef.current?.classList.add('hp-cta--hovered');
  }, []);
  const handleMouseLeave = useCallback(() => {
    btnRef.current?.classList.remove('hp-cta--hovered');
  }, []);

  return (
    <>
      {/*
        Inject the hover styles once via a <style> tag.
        In a real project this goes into your global CSS / CSS module.
      */}
      <style>{`
        .hp-cta {
          color: ${BRAND.orange};
          background: transparent;
          border: 1px solid rgba(255,87,15,0.4);
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .hp-cta--hovered {
          color: #080a0c;
          background: ${BRAND.orange};
          border-color: ${BRAND.orange};
        }
        .hp-cta__arrow {
          transition: transform 0.3s ease;
        }
        .hp-cta--hovered .hp-cta__arrow {
          transform: translateX(4px);
        }
      `}</style>
      <Link
        ref={btnRef}
        to={to}
        className="hp-cta group inline-flex items-center gap-3 font-bold uppercase"
        style={{
          padding: '14px 28px',
          fontSize: '11px',
          letterSpacing: '0.18em',
          minHeight: '48px',
          willChange: 'transform',
          textDecoration: 'none',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        <svg
          className="hp-cta__arrow"
          style={{ width: '16px', height: '16px' }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </>
  );
});

MagneticButton.displayName = 'MagneticButton';

// ─── HomeProjects ─────────────────────────────────────────────────────────────
const HomeProjects = () => {
  const sectionRef = useRef(null);
  const heroProjectRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const sharedTrigger = {
        trigger: sectionRef.current,
        start: 'top 82%',
        once: true,
      };

      // Batch header animations into a single timeline — one ScrollTrigger, one tick
      gsap
        .timeline({ scrollTrigger: sharedTrigger })
        .fromTo('.hp-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.hp-heading', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
        .fromTo('.hp-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.2)
        .fromTo('.hp-cta', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0.28);

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
      {/* Atmospheric orbs — static decorative elements */}
      <div
        className="absolute top-0 right-1/3 pointer-events-none"
        aria-hidden="true"
        style={{
          width: 'clamp(300px, 50vw, 600px)',
          height: 'clamp(300px, 50vw, 600px)',
          background: 'radial-gradient(circle, rgba(255,87,15,0.09), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute bottom-1/4 left-0 pointer-events-none"
        aria-hidden="true"
        style={{
          width: 'clamp(200px, 35vw, 400px)',
          height: 'clamp(200px, 35vw, 400px)',
          background: 'radial-gradient(circle, rgba(253,232,122,0.05), transparent 70%)',
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />

      {/* Dot mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,87,15,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
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
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.orange }} />
              <span
                className="font-bold uppercase"
                style={{ color: BRAND.orange, fontSize: '11px', letterSpacing: '0.2em' }}
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
              <span style={GRADIENT_TEXT}>Actually Built</span>
            </h2>

            {/* Subheading */}
            <p
              className="hp-sub leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.48)',
                fontSize: 'clamp(14px, 1.5vw, 17px)',
                maxWidth: '460px',
              }}
            >
              Every number below is from a live account. Dashboard screenshots available. No
              estimates, no projections.
            </p>
          </div>

          <MagneticButton to="/projects">See All Work</MagneticButton>
        </div>

        {/* Hero Card */}
        {HERO_PROJECT && (
          <div ref={heroProjectRef} className="mb-5 md:mb-6">
            <HeroProjectCard project={HERO_PROJECT} />
          </div>
        )}

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {GRID_PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className={IS_ODD_GRID && index === GRID_PROJECTS.length - 1 ? 'md:col-span-2' : ''}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProjects;