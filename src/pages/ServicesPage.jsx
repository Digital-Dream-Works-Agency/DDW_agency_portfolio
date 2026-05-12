/**
 * ServicesPage — Production-Optimized
 *
 * Critical fixes:
 * - GlobalStyles → singleton CSS injection (no @import, no component)
 * - BorderBeamCard: offsetWidth/offsetHeight reads moved outside RAF loop
 *   via ResizeObserver; geometry cached — eliminates 720 reflows/sec
 * - ServiceCard: hovered state removed; all hover visual driven by CSS
 * - All inline <style> tags → singleton CSS
 * - AnimatedStat/ServiceCard/BottomCTA: gsap.context() properly scoped
 * - SectionIntro/BentoStrip/BottomCTA: direct ref arrays replace querySelectorAll
 * - BottomCTA: primaryHover state removed; CSS handles button hover
 * - LogoMarquee: doubled array hoisted to module level
 * - Feature item hover: CSS :hover replaces 24 JS event listeners
 * - Bento pill hover: CSS :hover replaces 10 JS event listeners
 * - Fixed blur orbs replaced with SVG radial gradients
 * - isTouchDevice() → IS_TOUCH module constant throughout
 * - servicesData keys use service.number
 * - SpotlightCard: IS_TOUCH used in mousemove handler
 * - BorderBeamCard: fixed initial progress value (SSR-safe)
 */

import React, {
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar    from '../components/Navbar';
import Footer    from '../components/Footer';
import PageHeader from '../components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// ─── Module-Level Constants ────────────────────────────────────────────────────
const IS_TOUCH =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const ACCENTS = ['#FF570F', '#FDE87A', '#FFFFFF'];

// Pre-doubled for marquee — computed once, never recreated
const CLIENTS        = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Loom', 'Clerk', 'PlanetScale'];
const CLIENTS_DOUBLED = [...CLIENTS, ...CLIENTS];

const BENTO_ITEMS = [
  'No retainer lock-in',
  'Dedicated tech lead',
  'Weekly async updates',
  'IP fully yours',
  '24hr response SLA',
];

const STATS_DATA = [
  { value: '47+',   label: 'Projects Delivered' },
  { value: '$3.2M', label: 'Revenue Generated'  },
  { value: 'US & EU', label: 'Active Markets'   },
  { value: '98%',   label: 'Client Retention'   },
];

// ─── Icon Components — memoized, not inline JSX in data ───────────────────────
const IconCode = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
));
IconCode.displayName = 'IconCode';

const IconAI = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z" />
    <circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" />
  </svg>
));
IconAI.displayName = 'IconAI';

const IconCloud = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
  </svg>
));
IconCloud.displayName = 'IconCloud';

const IconBook = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
));
IconBook.displayName = 'IconBook';

const IconChart = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
));
IconChart.displayName = 'IconChart';

const IconSearch = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M11 8v6M8 11h6" />
  </svg>
));
IconSearch.displayName = 'IconSearch';

// ─── Services Data — icons are component references, not inline JSX ───────────
const SERVICES_DATA = [
  {
    number: '01',
    title: 'Custom Software Development',
    tagline: 'Built for scale. Designed for growth.',
    desc: 'Enterprise-grade web applications, internal tools, and bespoke system architecture designed for high-stakes operations. We architect systems that are maintainable, scalable, and built to last.',
    features: ['Full-stack web application development', 'API design & integrations', 'Database architecture', 'Legacy modernization'],
    deliverable: 'Production-ready system',
    timeline: '6–16 weeks',
    accentIndex: 0,
    Icon: IconCode,
  },
  {
    number: '02',
    title: 'AI Development & Integration',
    tagline: 'LLMs that work for your business.',
    desc: 'We integrate large language models and AI automation into your existing workflows. From custom chatbots to internal data pipelines, we build AI that generates measurable ROI.',
    features: ['LLM API integration', 'Retrieval-Augmented Gen (RAG)', 'AI Workflow automation', 'Custom prompt engineering'],
    deliverable: 'Integrated AI system',
    timeline: '4–10 weeks',
    accentIndex: 1,
    Icon: IconAI,
  },
  {
    number: '03',
    title: 'Cloud Infrastructure & DevOps',
    tagline: 'Ship faster. Break nothing.',
    desc: 'Secure, scalable cloud environments with automated CI/CD pipelines. We handle architecture, deployment, monitoring, and security so your team can focus on building.',
    features: ['AWS/GCP architecture', 'CI/CD pipeline setup', 'Kubernetes orchestration', 'Security hardening'],
    deliverable: 'Automated infrastructure',
    timeline: '3–8 weeks',
    accentIndex: 2,
    Icon: IconCloud,
  },
  {
    number: '04',
    title: 'Strategic Technical Consulting',
    tagline: 'The CTO you need, on-demand.',
    desc: 'Fractional CTO services, technical audits, and architectural roadmaps. We help you make the right technical decisions before you build — saving months of rework.',
    features: ['Architecture review', 'Build vs. buy analysis', 'Engineering team assessment', 'Roadmap planning'],
    deliverable: 'Architecture & roadmap',
    timeline: '1–4 weeks',
    accentIndex: 0,
    Icon: IconBook,
  },
  {
    number: '05',
    title: 'Marketing Systems & Automation',
    tagline: 'Your marketing stack, unified.',
    desc: 'We build unified marketing infrastructure that connects your CRM, email platform, ad accounts, and analytics into one coherent growth engine — fully automated and measurable.',
    features: ['CRM setup & migration', 'Email automation', 'Ad platform integration', 'Attribution modeling'],
    deliverable: 'Connected marketing stack',
    timeline: '4–8 weeks',
    accentIndex: 1,
    Icon: IconChart,
  },
  {
    number: '06',
    title: 'SEO & Content Strategy',
    tagline: 'Organic growth that compounds.',
    desc: 'Data-backed technical SEO and content strategy to build long-term market authority. We focus on the 20% of optimizations that drive 80% of results.',
    features: ['Technical SEO audit', 'Keyword research', 'Authority building', 'Core Web Vitals'],
    deliverable: 'SEO roadmap & execution',
    timeline: 'Monthly retainer',
    accentIndex: 2,
    Icon: IconSearch,
  },
];

// ─── Singleton CSS Injection ───────────────────────────────────────────────────
// Add to your _document.js / index.html <head>:
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900
//   &family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap"
//   rel="stylesheet" />
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }

  body {
    background: #080a0c;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  .font-heading { font-family: 'Montserrat', sans-serif; }
  .font-mono    { font-family: 'JetBrains Mono', monospace; }

  /* ── Keyframes ── */
  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(0.85); }
  }
  @keyframes shimmerSweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  /* ── Shimmer button ── */
  .shimmer-btn { position: relative; overflow: hidden; }
  .shimmer-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: translateX(-100%);
    z-index: 1;
  }
  .shimmer-btn:hover::before {
    animation: shimmerSweep 0.65s ease forwards;
  }

  /* ── Bottom sweep underline ── */
  .bottom-sweep { position: relative; }
  .bottom-sweep::after {
    content: '';
    position: absolute; bottom: 0; left: 0;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, #FF570F, #FDE87A);
    transition: width 0.55s cubic-bezier(0.4,0,0.2,1);
  }
  .bottom-sweep:hover::after { width: 100%; }

  /* ── Tilt card ── */
  .tilt-card { transform-style: preserve-3d; }

  /* ── Spotlight card ── */
  .spotlight-card { position: relative; overflow: hidden; }
  .spotlight-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(
      500px circle at var(--mx, 50%) var(--my, 50%),
      rgba(255,87,15,0.07),
      transparent 55%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
    z-index: 1;
  }
  .spotlight-card:hover::before { opacity: 1; }

  /* ── Service card: all hover states in CSS — zero JS re-renders ── */
  .ddw-service-card {
    border-radius: 20px; overflow: hidden;
    background: linear-gradient(145deg, #111518 0%, #0c0e10 100%);
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 4px 32px rgba(0,0,0,0.35);
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }
  .ddw-service-card:hover {
    box-shadow: 0 16px 56px rgba(0,0,0,0.5), 0 0 70px var(--card-accent-10);
    border-color: var(--card-accent-35);
  }

  /* Top accent bar */
  .ddw-service-top-bar {
    height: 2px; width: 100%;
    transition: opacity 0.5s ease;
    opacity: 0.3;
  }
  .ddw-service-card:hover .ddw-service-top-bar { opacity: 0.85; }

  /* Watermark number */
  .ddw-service-watermark {
    transform: translateX(16px);
    transition: transform 0.6s ease;
  }
  .ddw-service-card:hover .ddw-service-watermark { transform: translateX(8px); }

  /* Ambient glow in meta panel */
  .ddw-service-meta-glow {
    position: absolute; top: -20px; right: -20px;
    width: 140px; height: 140px; border-radius: 50%;
    filter: blur(50px);
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
  }
  .ddw-service-card:hover .ddw-service-meta-glow { opacity: 0.07; }

  /* Feature item hover — CSS replaces 24 JS event listeners */
  .ddw-feature-item {
    color: rgba(255,255,255,0.38);
    transition: color 0.25s ease;
    font-size: 13px;
    font-family: Inter, sans-serif;
  }
  .ddw-feature-item:hover { color: rgba(255,255,255,0.7); }

  /* Service inner layout */
  .ddw-service-inner { display: flex; flex-direction: column; }
  @media (min-width: 1024px) {
    .ddw-service-inner { flex-direction: row; }
  }

  /* Feature grid */
  .ddw-feat-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 600px) {
    .ddw-feat-grid { grid-template-columns: repeat(2,1fr); }
  }

  /* Meta panel */
  .ddw-meta-panel {
    flex-shrink: 0; position: relative; overflow: hidden;
    padding: clamp(20px,3vw,32px);
    border-top: 1px solid rgba(255,255,255,0.04);
    background: rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
    justify-content: space-between; gap: 24px;
  }
  @media (min-width: 1024px) {
    .ddw-meta-panel {
      width: 260px;
      border-top: none;
      border-left: 1px solid rgba(255,255,255,0.04);
    }
  }

  /* Service CTA anchor */
  .ddw-service-cta {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 12px 18px;
    border-radius: 12px; text-decoration: none;
    font-size: 10px; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.15em; font-family: JetBrains Mono, monospace;
    min-height: 44px;
    transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
  }

  /* Bento pill hover — CSS replaces 10 JS event listeners */
  .ddw-bento-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 999px;
    font-size: 10px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.18em; color: rgba(255,255,255,0.38);
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    font-family: JetBrains Mono, monospace;
    min-height: 36px; cursor: default; opacity: 0;
    transition: color 0.25s ease, border-color 0.25s ease;
  }
  .ddw-bento-pill:hover {
    color: rgba(255,255,255,0.7);
    border-color: rgba(255,87,15,0.25);
  }

  /* Primary CTA hover — removes useState(primaryHover) */
  .ddw-primary-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 999px;
    font-family: Montserrat, sans-serif; font-weight: 900;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em;
    text-decoration: none; min-height: 52px;
    background: #FF570F; color: #000;
    box-shadow: 0 8px 40px rgba(255,87,15,0.38);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .ddw-primary-cta:hover {
    background: #FDE87A;
    box-shadow: 0 8px 40px rgba(253,232,122,0.4);
  }
  .ddw-primary-cta svg { transition: transform 0.3s ease; }
  .ddw-primary-cta:hover svg { transform: translateX(3px); }

  /* Secondary CTA */
  .ddw-secondary-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 999px;
    font-family: Montserrat, sans-serif; font-weight: 900;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em;
    text-decoration: none; min-height: 52px;
    color: rgba(255,255,255,0.4);
    border: 1px solid rgba(255,255,255,0.07);
    background: transparent;
    transition: color 0.25s ease, border-color 0.25s ease;
  }
  .ddw-secondary-cta:hover {
    color: rgba(255,255,255,0.8);
    border-color: rgba(255,255,255,0.18);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080a0c; }
  ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.25); border-radius: 2px; }

  /* Focus */
  button:focus-visible, a:focus-visible {
    outline: 2px solid #FF570F; outline-offset: 3px;
  }
`;

if (typeof document !== 'undefined') {
  const existing = document.getElementById('ddw-services-styles');
  if (!existing) {
    const tag = document.createElement('style');
    tag.id = 'ddw-services-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }
}

// ─── Hook: Magnetic ───────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.28) => {
  useEffect(() => {
    if (IS_TOUCH || !ref?.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = ref.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power2.out' });
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width  / 2) * strength);
        yTo((e.clientY - r.top  - r.height / 2) * strength);
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      };
      el.addEventListener('mousemove', onMove,  { passive: true });
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);
};

// ─── GSAPTilt ────────────────────────────────────────────────────────────────
const GSAPTilt = memo(({ children, className, style }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (IS_TOUCH || !ref.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = ref.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power2.out' });
      // Cache rect on enter — never read geometry inside RAF
      let rect = null;
      let rafId = 0;
      const onEnter = () => { rect = el.getBoundingClientRect(); };
      const onMove  = (e) => {
        if (!rect) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          xTo(((e.clientX - rect.left) / rect.width  - 0.5) *  5);
          yTo(((e.clientY - rect.top)  / rect.height - 0.5) * -5);
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(rafId);
        xTo(0); yTo(0);
        rect = null;
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove',  onMove,  { passive: true });
      el.addEventListener('mouseleave', onLeave);
      return () => {
        cancelAnimationFrame(rafId);
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mousemove',  onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className ?? ''}`}
      style={{ perspective: '1400px', ...style }}
    >
      {children}
    </div>
  );
});
GSAPTilt.displayName = 'GSAPTilt';

// ─── SpotlightCard ────────────────────────────────────────────────────────────
const SpotlightCard = memo(({ children, className, style }) => {
  // IS_TOUCH: module constant — not called on every move
  const onMouseMove = useCallback((e) => {
    if (IS_TOUCH) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  return (
    <div
      className={`spotlight-card ${className ?? ''}`}
      style={style}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
});
SpotlightCard.displayName = 'SpotlightCard';

// ─── BorderBeamCard ───────────────────────────────────────────────────────────
/**
 * CRITICAL FIX:
 * - offsetWidth/offsetHeight reads moved OUT of RAF loop
 * - ResizeObserver caches dimensions; RAF only does arithmetic + style mutation
 * - Fixed initial progress (0.0) — no Math.random() = SSR-safe
 * - IntersectionObserver pauses animation when off-screen
 */
const BorderBeamCard = memo(({ children, accent }) => {
  const cardRef = useRef(null);
  const beamRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const beam = beamRef.current;
    if (!card || !beam || IS_TOUCH) return;

    let progress = 0; // Fixed start — SSR-safe, deterministic
    let rafId    = 0;
    let running  = false;

    // Cache geometry — updated by ResizeObserver, never inside RAF
    let cachedW = card.offsetWidth;
    let cachedH = card.offsetHeight;

    const ro = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) {
        cachedW = e.contentRect.width;
        cachedH = e.contentRect.height;
      }
    });
    ro.observe(card);

    const animate = () => {
      if (!running) return;
      progress = (progress + 0.0025) % 1;

      // Pure arithmetic — no DOM reads
      const w         = cachedW;
      const h         = cachedH;
      const perimeter = 2 * (w + h);
      const pos       = progress * perimeter;
      let x, y;
      if      (pos < w)           { x = pos;           y = 0;               }
      else if (pos < w + h)       { x = w;             y = pos - w;         }
      else if (pos < 2 * w + h)   { x = w - (pos-w-h); y = h;               }
      else                        { x = 0;             y = h-(pos-2*w-h);   }

      beam.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        beam.style.opacity = '0.65';
        running = true;
        animate();
      } else {
        running = false;
        cancelAnimationFrame(rafId);
        beam.style.opacity = '0';
      }
    }, { threshold: 0.15 });

    io.observe(card);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [accent]);

  return (
    <div ref={cardRef} style={{ position: 'relative' }}>
      <div
        ref={beamRef}
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 12, height: 12, borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 14px 5px ${accent}70`,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 20,
          transition: 'opacity 0.4s ease',
        }}
      />
      {children}
    </div>
  );
});
BorderBeamCard.displayName = 'BorderBeamCard';

// ─── Eyebrow ─────────────────────────────────────────────────────────────────
const Eyebrow = memo(({ children, color = '#FF570F' }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 16px', borderRadius: 999,
    background: `${color}0f`,
    border: `1px solid ${color}28`,
    color,
    fontSize: 9, fontWeight: 800,
    letterSpacing: '0.26em', textTransform: 'uppercase',
    fontFamily: 'JetBrains Mono, monospace',
  }}>
    <span style={{
      width: 6, height: 6, borderRadius: '50%',
      background: color,
      animation: 'pulseGlow 1.8s ease-in-out infinite',
      display: 'inline-block', flexShrink: 0,
    }} />
    {children}
  </span>
));
Eyebrow.displayName = 'Eyebrow';

// ─── AnimatedStat ─────────────────────────────────────────────────────────────
// gsap.context() properly scoped with ref
const AnimatedStat = memo(({ value, label }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity: 0, textAlign: 'center', padding: '12px 20px', position: 'relative' }}
    >
      <div
        className="font-heading"
        style={{
          fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 900,
          color: '#fff', letterSpacing: '-0.03em', marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{
        fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em',
        color: 'rgba(255,255,255,0.28)', fontWeight: 700,
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        {label}
      </div>
    </div>
  );
});
AnimatedStat.displayName = 'AnimatedStat';

// ─── LogoMarquee ──────────────────────────────────────────────────────────────
// CLIENTS_DOUBLED is module-level — never recreated
const LogoMarquee = memo(() => (
  <div style={{
    position: 'relative', overflow: 'hidden',
    padding: '20px 0',
    borderTop:    '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  }}>
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 96,
      background: 'linear-gradient(90deg,#080a0c,transparent)',
      zIndex: 10, pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', right: 0, top: 0, bottom: 0, width: 96,
      background: 'linear-gradient(270deg,#080a0c,transparent)',
      zIndex: 10, pointerEvents: 'none',
    }} />
    <div
      aria-hidden="true"
      style={{
        display: 'flex', gap: 48, alignItems: 'center',
        width: 'max-content',
        animation: 'marqueeScroll 28s linear infinite',
      }}
    >
      {CLIENTS_DOUBLED.map((c, i) => (
        <span
          key={i}
          style={{
            color: 'rgba(255,255,255,0.13)', fontSize: 11, fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '0.2em',
            whiteSpace: 'nowrap', userSelect: 'none',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {c}
        </span>
      ))}
    </div>
  </div>
));
LogoMarquee.displayName = 'LogoMarquee';

// ─── BeamDivider ─────────────────────────────────────────────────────────────
const BeamDivider = memo(({ color = '#FF570F' }) => (
  <div style={{
    display: 'flex', justifyContent: 'center',
    padding: '12px 0', pointerEvents: 'none',
  }}>
    <div style={{ position: 'relative', width: 1, height: 48 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, transparent, ${color}50, transparent)`,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 6, height: 6, borderRadius: '50%',
        background: color, opacity: 0.7, boxShadow: `0 0 10px ${color}`,
      }} />
    </div>
  </div>
));
BeamDivider.displayName = 'BeamDivider';

// ─── ServiceCard ──────────────────────────────────────────────────────────────
/**
 * CRITICAL: hovered state removed entirely.
 * All hover visuals driven by .ddw-service-card:hover CSS.
 * CSS variables communicate accent to child selectors.
 * CTA hover: direct DOM mutation on mouseenter/leave (no state).
 * Feature item hover: CSS .ddw-feature-item:hover.
 */
const ServiceCard = memo(({ service }) => {
  const wrapperRef = useRef(null);
  const btnRef     = useRef(null);

  const accent = ACCENTS[service.accentIndex];
  const { Icon } = service;

  // CSS variable object — memoized per accent
  const cssVars = useMemo(() => ({
    '--card-accent':    accent,
    '--card-accent-35': `${accent}35`,
    '--card-accent-10': `${accent}10`,
  }), [accent]);

  // Memoized gradient string
  const topBarGradient = useMemo(() =>
    `linear-gradient(90deg, ${accent}, transparent 55%)`,
  [accent]);

  useMagnetic(btnRef, 0.3);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 52 },
        {
          opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ opacity: 0 }}>
      <GSAPTilt>
        <BorderBeamCard accent={accent}>
          <SpotlightCard className="bottom-sweep">
            <div className="ddw-service-card" style={cssVars}>

              {/* Top accent bar */}
              <div
                className="ddw-service-top-bar"
                style={{ background: topBarGradient }}
              />

              <div className="ddw-service-inner">

                {/* ── Left: Main Content ── */}
                <div style={{
                  flex: 1,
                  padding: 'clamp(20px,4vw,40px)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Watermark — CSS drives transform on hover */}
                  <div
                    className="font-heading ddw-service-watermark"
                    aria-hidden="true"
                    style={{
                      position: 'absolute', bottom: -10, right: 0,
                      fontSize: 'clamp(80px,10vw,160px)',
                      fontWeight: 900, lineHeight: 1,
                      color: accent, opacity: 0.045,
                      pointerEvents: 'none', userSelect: 'none',
                    }}
                  >
                    {service.number}
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* Badge row */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 12, marginBottom: 18,
                    }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 14px', borderRadius: 999,
                        background: `${accent}12`,
                        border: `1px solid ${accent}22`,
                        color: accent, opacity: 0.9,
                      }}>
                        <Icon />
                        <span style={{
                          fontSize: 9, fontWeight: 900,
                          letterSpacing: '0.2em', textTransform: 'uppercase',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>
                          {service.number}
                        </span>
                      </div>
                      <div style={{
                        flex: 1, height: 1,
                        background: `linear-gradient(90deg, ${accent}35, transparent)`,
                      }} />
                    </div>

                    {/* Title */}
                    <h3
                      className="font-heading"
                      style={{
                        fontSize: 'clamp(1.2rem,2.8vw,1.85rem)',
                        fontWeight: 900, color: '#fff',
                        letterSpacing: '-0.03em', lineHeight: 1.15,
                        marginBottom: 6,
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Tagline */}
                    <p style={{
                      fontSize: 10, fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.22em',
                      color: accent, marginBottom: 18,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p style={{
                      color: 'rgba(255,255,255,0.45)', fontSize: 14,
                      lineHeight: 1.75, marginBottom: 24,
                      maxWidth: 560, fontFamily: 'Inter, sans-serif',
                    }}>
                      {service.desc}
                    </p>

                    {/* Features — CSS :hover handles color, no JS listeners */}
                    <div className="ddw-feat-grid">
                      {service.features.map((feat) => (
                        <div
                          key={feat}
                          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: accent, flexShrink: 0,
                            boxShadow: `0 0 6px ${accent}80`,
                          }} />
                          <span className="ddw-feature-item">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right: Meta Panel ── */}
                <div className="ddw-meta-panel">
                  {/* Ambient glow — CSS drives opacity on card hover */}
                  <div
                    className="ddw-service-meta-glow"
                    aria-hidden="true"
                    style={{ background: accent }}
                  />

                  {/* Meta info */}
                  <div style={{
                    position: 'relative', zIndex: 2,
                    display: 'flex', flexDirection: 'column', gap: 20,
                  }}>
                    {[
                      { label: 'Deliverable', value: service.deliverable },
                      { label: 'Timeline',    value: service.timeline    },
                    ].map(item => (
                      <div key={item.label}>
                        <span style={{
                          display: 'block', marginBottom: 5,
                          fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.25em', color: `${accent}70`,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>
                          {item.label}
                        </span>
                        <span style={{
                          color: 'rgba(255,255,255,0.78)',
                          fontSize: 13, fontWeight: 700,
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA — direct DOM mutation, no React state */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <a
                      ref={btnRef}
                      href="/contact"
                      className="shimmer-btn ddw-service-cta"
                      style={{
                        background: `${accent}14`,
                        color: accent,
                        border: `1px solid ${accent}25`,
                      }}
                      onMouseEnter={e => {
                        if (IS_TOUCH) return;
                        const t = e.currentTarget;
                        t.style.background = accent;
                        t.style.color      = '#000';
                        t.style.boxShadow  = `0 0 30px ${accent}50`;
                      }}
                      onMouseLeave={e => {
                        const t = e.currentTarget;
                        t.style.background = `${accent}14`;
                        t.style.color      = accent;
                        t.style.boxShadow  = 'none';
                      }}
                    >
                      Start a Project
                      <svg
                        width="14" height="14" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        viewBox="0 0 24 24" aria-hidden="true"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </SpotlightCard>
        </BorderBeamCard>
      </GSAPTilt>
    </div>
  );
});
ServiceCard.displayName = 'ServiceCard';

// ─── SectionIntro ─────────────────────────────────────────────────────────────
// Direct ref array replaces querySelectorAll('.intro-el')
const SectionIntro = memo(() => {
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const targets = itemRefs.current.filter(Boolean);
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative', maxWidth: 880, margin: '0 auto',
        padding: 'clamp(48px,8vw,80px) 24px clamp(32px,5vw,48px)',
        textAlign: 'center',
      }}
    >
      {/* Atmospheric orb — SVG gradient, no filter:blur */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(300px,50vw,600px)',
          height: 'clamp(140px,20vw,280px)',
          pointerEvents: 'none', overflow: 'visible', opacity: 0.06,
        }}
      >
        <defs>
          <radialGradient id="si-orb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF570F" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF570F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#si-orb)" />
      </svg>

      {/* Eyebrow */}
      <div
        ref={el => { itemRefs.current[0] = el; }}
        style={{ opacity: 0, marginBottom: 24 }}
      >
        <Eyebrow>What We Do</Eyebrow>
      </div>

      {/* Heading */}
      <h2
        ref={el => { itemRefs.current[1] = el; }}
        className="font-heading"
        style={{
          opacity: 0,
          fontSize: 'clamp(1.9rem,6vw,4rem)',
          fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.06,
          color: '#fff', marginBottom: 16,
        }}
      >
        Solutions That Scale
        <br />
        <span style={{
          background: 'linear-gradient(135deg,#FF570F 0%,#FDE87A 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          With Your Business.
        </span>
      </h2>

      {/* Subtext */}
      <p
        ref={el => { itemRefs.current[2] = el; }}
        style={{
          opacity: 0, color: 'rgba(255,255,255,0.35)',
          fontSize: 'clamp(0.875rem,1.5vw,1rem)', lineHeight: 1.75,
          maxWidth: 480, margin: '0 auto 36px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        From technical strategy to full-stack execution — we build systems that drive measurable growth.
      </p>

      {/* Stats strip */}
      <div
        ref={el => { itemRefs.current[3] = el; }}
        style={{ opacity: 0, overflowX: 'auto', paddingBottom: 4 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          borderRadius: 16, overflow: 'hidden', minWidth: 'max-content',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {STATS_DATA.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div style={{
                  width: 1, alignSelf: 'stretch',
                  background: 'rgba(255,255,255,0.06)',
                }} />
              )}
              <AnimatedStat value={s.value} label={s.label} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
});
SectionIntro.displayName = 'SectionIntro';

// ─── BentoStrip ───────────────────────────────────────────────────────────────
// Direct ref array; CSS handles pill hover (no JS event listeners per pill)
const BentoStrip = memo(() => {
  const containerRef = useRef(null);
  const pillRefs     = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const targets = pillRefs.current.filter(Boolean);
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.65, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: 1160, margin: '0 auto',
        padding: '0 24px clamp(24px,4vw,36px)',
      }}
    >
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', gap: 8,
      }}>
        {BENTO_ITEMS.map((item, i) => (
          <div
            key={item}
            ref={el => { pillRefs.current[i] = el; }}
            className="ddw-bento-pill"
          >
            <span style={{ color: '#FF570F', fontSize: 11 }} aria-hidden="true">✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});
BentoStrip.displayName = 'BentoStrip';

// ─── BottomCTA ────────────────────────────────────────────────────────────────
/**
 * primaryHover state removed — CSS .ddw-primary-cta:hover handles all transitions.
 * Direct ref array for GSAP targets.
 */
const BottomCTA = memo(() => {
  const containerRef = useRef(null);
  const btn1Ref      = useRef(null);
  const btn2Ref      = useRef(null);
  const itemRefs     = useRef([]);

  useMagnetic(btn1Ref, 0.3);
  useMagnetic(btn2Ref, 0.3);

  useEffect(() => {
    if (!containerRef.current) return;
    const targets = itemRefs.current.filter(Boolean);
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.85, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative', zIndex: 10,
        padding: 'clamp(64px,10vw,120px) 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'linear-gradient(180deg, transparent, rgba(10,11,13,0.9) 50%)',
      }}
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,87,15,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.015, pointerEvents: 'none',
        }}
      />

      {/* Glow — SVG, no filter:blur */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(350px,55vw,700px)',
          height: 'clamp(160px,25vw,360px)',
          pointerEvents: 'none', overflow: 'visible', opacity: 0.055,
        }}
      >
        <defs>
          <radialGradient id="cta-glow" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#FF570F" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF570F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-glow)" />
      </svg>

      <div style={{
        position: 'relative', maxWidth: 680,
        margin: '0 auto', textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <div
          ref={el => { itemRefs.current[0] = el; }}
          style={{
            opacity: 0, marginBottom: 20,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 12,
          }}
        >
          <div style={{ width: 28, height: 1, background: 'rgba(255,87,15,0.4)' }} />
          <span style={{
            color: '#FF570F', fontSize: 9,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 800,
          }}>
            Next Step
          </span>
          <div style={{ width: 28, height: 1, background: 'rgba(255,87,15,0.4)' }} />
        </div>

        {/* Heading */}
        <h3
          ref={el => { itemRefs.current[1] = el; }}
          className="font-heading"
          style={{
            opacity: 0,
            fontSize: 'clamp(1.9rem,5vw,3.6rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08,
            color: '#fff', marginBottom: 16,
          }}
        >
          Ready to Build
          <br />
          <span style={{
            background: 'linear-gradient(135deg,#FF570F,#FDE87A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Something Real?
          </span>
        </h3>

        {/* Subtext */}
        <p
          ref={el => { itemRefs.current[2] = el; }}
          style={{
            opacity: 0, color: 'rgba(255,255,255,0.3)',
            fontSize: 'clamp(0.8rem,1.4vw,0.9rem)', lineHeight: 1.75,
            maxWidth: 420, margin: '0 auto 36px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Book a free technical consultation to discuss your roadmap. No pitch. No fluff.
        </p>

        {/* Buttons */}
        <div
          ref={el => { itemRefs.current[3] = el; }}
          style={{
            opacity: 0, display: 'flex', flexWrap: 'wrap',
            gap: 12, justifyContent: 'center', alignItems: 'center',
          }}
        >
          {/* Primary CTA — all hover in CSS, no useState */}
          <a
            ref={btn1Ref}
            href="/contact"
            className="shimmer-btn ddw-primary-cta"
          >
            Schedule Consultation
            <svg
              width="14" height="14" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              viewBox="0 0 24 24" aria-hidden="true"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          {/* Secondary CTA — CSS hover */}
          <a
            ref={btn2Ref}
            href="/case-studies"
            className="ddw-secondary-cta"
          >
            See Our Work
          </a>
        </div>

        {/* Footer note */}
        <p
          ref={el => { itemRefs.current[4] = el; }}
          style={{
            opacity: 0, marginTop: 24,
            color: 'rgba(255,255,255,0.12)', fontSize: 9,
            textTransform: 'uppercase', letterSpacing: '0.24em',
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          }}
        >
          Response within 24 hours · No pitch · No fluff
        </p>
      </div>
    </section>
  );
});
BottomCTA.displayName = 'BottomCTA';

// ─── BackgroundSVG ────────────────────────────────────────────────────────────
/**
 * Replaces two fixed-position filter:blur() divs.
 * SVG radialGradients are GPU-composited, never repainted on scroll.
 * position:absolute on a non-scrolling wrapper avoids fixed repaint.
 */
const BackgroundSVG = memo(() => (
  <div style={{
    position: 'absolute', inset: 0,
    pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
  }}>
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        overflow: 'visible',
      }}
    >
      <defs>
        <radialGradient id="sp-bg1" cx="100%" cy="0%" r="55%">
          <stop offset="0%" stopColor="#FF570F" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FF570F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sp-bg2" cx="0%" cy="80%" r="40%">
          <stop offset="0%" stopColor="#FDE87A" stopOpacity="0.018" />
          <stop offset="100%" stopColor="#FDE87A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sp-bg1)" />
      <rect width="100%" height="100%" fill="url(#sp-bg2)" />
    </svg>
    {/* Dot grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(rgba(255,87,15,0.55) 1px, transparent 1px)',
      backgroundSize: '32px 32px', opacity: 0.013,
    }} />
  </div>
));
BackgroundSVG.displayName = 'BackgroundSVG';

// ─── ServicesPage ─────────────────────────────────────────────────────────────
const ServicesPage = () => (
  <main style={{
    position: 'relative', width: '100%',
    background: '#080a0c', minHeight: '100vh', overflowX: 'hidden',
  }}>
    {/* Background: absolute, no fixed, no filter:blur */}
    <BackgroundSVG />

    <Navbar />

    <PageHeader
      title="Services"
      breadcrumb="Services"
      subtitle="Enterprise-grade solutions built for businesses that cannot afford to fail."
    />

    {/* Logo Marquee */}
    <div style={{ position: 'relative', zIndex: 10, maxWidth: 1160, margin: '0 auto' }}>
      <p style={{
        textAlign: 'center', marginBottom: 12,
        fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.28em', color: 'rgba(255,255,255,0.13)',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        Trusted by teams at
      </p>
      <LogoMarquee />
    </div>

    {/* Section Intro */}
    <div style={{ position: 'relative', zIndex: 10 }}>
      <SectionIntro />
    </div>

    {/* Bento Pills */}
    <div style={{ position: 'relative', zIndex: 10 }}>
      <BentoStrip />
    </div>

    {/* Divider */}
    <div style={{ position: 'relative', zIndex: 10 }}>
      <BeamDivider color="#FF570F" />
    </div>

    {/* Service Cards */}
    <section style={{
      position: 'relative', zIndex: 10,
      paddingBottom: 'clamp(24px,4vw,40px)',
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto',
        padding: '0 clamp(16px,4vw,24px)',
        display: 'flex', flexDirection: 'column',
        gap: 'clamp(14px,2vw,20px)',
      }}>
        {SERVICES_DATA.map(service => (
          // service.number is stable and unique — correct key
          <ServiceCard key={service.number} service={service} />
        ))}
      </div>
    </section>

    <BottomCTA />

    <Footer />
  </main>
);

export default ServicesPage;