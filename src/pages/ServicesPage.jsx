import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    body {
      background: #080a0c;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }

    .font-heading { font-family: 'Montserrat', sans-serif; }
    .font-mono    { font-family: 'JetBrains Mono', monospace; }

    @keyframes marqueeScroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.55; transform: scale(0.85); }
    }

    @keyframes breatheOrb {
      0%, 100% { opacity: 0.04; transform: scale(1); }
      50%       { opacity: 0.08; transform: scale(1.06); }
    }

    @keyframes beamOrbit {
      from { transform: rotate(0deg) translateX(var(--orbit-r, 80px)) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(var(--orbit-r, 80px)) rotate(-360deg); }
    }

    @keyframes shimmerSweep {
      from { transform: translateX(-100%); }
      to   { transform: translateX(100%); }
    }

    .shimmer-btn { position: relative; overflow: hidden; }
    .shimmer-btn::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      transform: translateX(-100%);
      transition: transform 0s;
      z-index: 1;
    }
    .shimmer-btn:hover::before {
      animation: shimmerSweep 0.65s ease forwards;
    }

    .bottom-sweep { position: relative; }
    .bottom-sweep::after {
      content: '';
      position: absolute; bottom: 0; left: 0;
      height: 2px; width: 0%;
      background: linear-gradient(90deg, #FF570F, #FDE87A);
      transition: width 0.55s cubic-bezier(0.4,0,0.2,1);
    }
    .bottom-sweep:hover::after { width: 100%; }

    .tilt-card {
      transform-style: preserve-3d;
      will-change: transform;
    }

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

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #080a0c; }
    ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.25); border-radius: 2px; }
  `}</style>
);

// ─── Utilities ─────────────────────────────────────────────────────────────────
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const ACCENTS = ['#FF570F', '#FDE87A', '#FFFFFF'];

// ─── Data ──────────────────────────────────────────────────────────────────────
const servicesData = [
  {
    number: '01',
    title: 'Custom Software Development',
    tagline: 'Built for scale. Designed for growth.',
    desc: 'Enterprise-grade web applications, internal tools, and bespoke system architecture designed for high-stakes operations. We architect systems that are maintainable, scalable, and built to last.',
    features: ['Full-stack web application development', 'API design & integrations', 'Database architecture', 'Legacy modernization'],
    deliverable: 'Production-ready system',
    timeline: '6–16 weeks',
    accentIndex: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
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
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z" />
        <circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
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
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
      </svg>
    ),
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
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
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
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
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
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M11 8v6M8 11h6" />
      </svg>
    ),
  },
];

const statsData = [
  { value: '47+',  label: 'Projects Delivered' },
  { value: '$3.2M', label: 'Revenue Generated'  },
  { value: 'US & EU', label: 'Active Markets'   },
  { value: '98%',  label: 'Client Retention'    },
];

const clients = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Loom', 'Clerk', 'PlanetScale'];

const bentoItems = [
  'No retainer lock-in',
  'Dedicated tech lead',
  'Weekly async updates',
  'IP fully yours',
  '24hr response SLA',
];

// ─── Hook: Magnetic ────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.28) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
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
      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
  }, [strength]);
};

// ─── Component: GSAPTilt ───────────────────────────────────────────────────────
const GSAPTilt = ({ children, className, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power2.out' });
      let rect = null;
      let rafId;
      const onEnter = () => { rect = el.getBoundingClientRect(); };
      const onMove  = (e) => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (!rect) rect = el.getBoundingClientRect();
          xTo(((e.clientX - rect.left) / rect.width  - 0.5) *  5);
          yTo(((e.clientY - rect.top)  / rect.height - 0.5) * -5);
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(rafId);
        xTo(0); yTo(0); rect = null;
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
    <div ref={ref} className={`tilt-card ${className || ''}`}
      style={{ perspective: '1400px', ...style }}>
      {children}
    </div>
  );
};

// ─── Component: SpotlightCard ──────────────────────────────────────────────────
const SpotlightCard = ({ children, className, style, onMouseEnter, onMouseLeave }) => {
  const onMouseMove = useCallback((e) => {
    if (isTouchDevice()) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);
  return (
    <div
      className={`spotlight-card ${className || ''}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

// ─── Component: BorderBeamCard ─────────────────────────────────────────────────
const BorderBeamCard = ({ children, accent }) => {
  const cardRef = useRef(null);
  const beamRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const beam = beamRef.current;
    if (!card || !beam || isTouchDevice()) return;

    let progress = Math.random();
    let rafId;

    const animate = () => {
      progress = (progress + 0.0025) % 1;
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const perimeter = 2 * (w + h);
      const pos = progress * perimeter;
      let x, y;
      if      (pos < w)         { x = pos;             y = 0;             }
      else if (pos < w + h)     { x = w;               y = pos - w;       }
      else if (pos < 2 * w + h) { x = w - (pos-w-h);   y = h;             }
      else                      { x = 0;               y = h-(pos-2*w-h); }
      beam.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { beam.style.opacity = '0.65'; animate(); }
      else { cancelAnimationFrame(rafId); beam.style.opacity = '0'; }
    }, { threshold: 0.15 });

    io.observe(card);
    return () => { cancelAnimationFrame(rafId); io.disconnect(); };
  }, [accent]);

  return (
    <div ref={cardRef} style={{ position: 'relative' }}>
      <div
        ref={beamRef}
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
};

// ─── Component: Eyebrow ────────────────────────────────────────────────────────
const Eyebrow = ({ children, color = '#FF570F' }) => (
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
      display: 'inline-block',
    }} />
    {children}
  </span>
);

// ─── Component: Animated Stat ──────────────────────────────────────────────────
const AnimatedStat = ({ value, label }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0, textAlign: 'center', padding: '12px 20px', position: 'relative' }}>
      <div className="font-heading" style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{label}</div>
    </div>
  );
};

// ─── Component: Logo Marquee ───────────────────────────────────────────────────
const LogoMarquee = () => {
  const doubled = [...clients, ...clients];
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(90deg,#080a0c,transparent)', zIndex: 10, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(270deg,#080a0c,transparent)', zIndex: 10, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 48, alignItems: 'center', width: 'max-content', animation: 'marqueeScroll 28s linear infinite' }}>
        {doubled.map((c, i) => (
          <span key={i} style={{ color: 'rgba(255,255,255,0.13)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', whiteSpace: 'nowrap', userSelect: 'none', fontFamily: 'JetBrains Mono' }}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Component: AnimatedBeam Divider ──────────────────────────────────────────
const BeamDivider = ({ color = '#FF570F' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0', pointerEvents: 'none' }}>
    <div style={{ position: 'relative', width: 1, height: 48 }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent, ${color}50, transparent)` }} />
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.7, boxShadow: `0 0 10px ${color}` }} />
    </div>
  </div>
);

// ─── Component: Magnetic Button ────────────────────────────────────────────────
const MagneticButton = ({ children, href, style, onMouseEnter, onMouseLeave, className }) => {
  const ref = useRef(null);
  useMagnetic(ref, 0.28);
  return (
    <a
      ref={ref}
      href={href}
      className={`shimmer-btn ${className || ''}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', cursor: 'pointer', ...style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
};

// ─── Component: Service Card ───────────────────────────────────────────────────
const ServiceCard = ({ service }) => {
  const cardRef  = useRef(null);
  const btnRef   = useRef(null);
  const accent   = ACCENTS[service.accentIndex];
  const [hovered, setHovered] = useState(false);

  useMagnetic(btnRef, 0.3);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 52 },
        { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 90%', once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} style={{ opacity: 0, willChange: 'transform, opacity' }}>
      <GSAPTilt>
        <BorderBeamCard accent={accent}>
          <SpotlightCard
            className="bottom-sweep"
            style={{
              borderRadius: 20, overflow: 'hidden',
              background: 'linear-gradient(145deg,#111518 0%,#0c0e10 100%)',
              border: hovered ? `1px solid ${accent}35` : '1px solid rgba(255,255,255,0.06)',
              boxShadow: hovered
                ? `0 16px 56px rgba(0,0,0,0.5), 0 0 70px ${accent}10`
                : '0 4px 32px rgba(0,0,0,0.35)',
              transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            }}
            onMouseEnter={() => !isTouchDevice() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Top accent bar */}
            <div style={{
              height: 2, width: '100%',
              background: `linear-gradient(90deg, ${accent}, transparent 55%)`,
              opacity: hovered ? 0.85 : 0.3,
              transition: 'opacity 0.5s ease',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column' }} className="service-inner">
              <style>{`
                @media (min-width: 1024px) {
                  .service-inner { flex-direction: row !important; }
                }
              `}</style>

              {/* ── Left: Main Content ── */}
              <div style={{ flex: 1, padding: 'clamp(20px,4vw,40px)', position: 'relative', overflow: 'hidden' }}>

                {/* Watermark number */}
                <div className="font-heading" style={{
                  position: 'absolute', bottom: -10, right: 0,
                  fontSize: 'clamp(80px,10vw,160px)',
                  fontWeight: 900, lineHeight: 1,
                  color: accent, opacity: 0.045,
                  pointerEvents: 'none', userSelect: 'none',
                  transform: hovered ? 'translateX(8px)' : 'translateX(16px)',
                  transition: 'transform 0.6s ease',
                }}>
                  {service.number}
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  {/* Badge row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '6px 14px', borderRadius: 999,
                      background: `${accent}12`,
                      border: `1px solid ${accent}22`,
                      color: accent, opacity: 0.9,
                    }}>
                      {service.icon}
                      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>
                        {service.number}
                      </span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}35, transparent)` }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading" style={{
                    fontSize: 'clamp(1.2rem,2.8vw,1.85rem)',
                    fontWeight: 900, color: '#fff',
                    letterSpacing: '-0.03em', lineHeight: 1.15,
                    marginBottom: 6,
                  }}>
                    {service.title}
                  </h3>

                  {/* Tagline */}
                  <p style={{
                    fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                    letterSpacing: '0.22em', color: accent, marginBottom: 18,
                    fontFamily: 'JetBrains Mono',
                  }}>
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p style={{
                    color: 'rgba(255,255,255,0.45)', fontSize: 14,
                    lineHeight: 1.75, marginBottom: 24,
                    maxWidth: 560, fontFamily: 'Inter',
                  }}>
                    {service.desc}
                  </p>

                  {/* Features */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }} className="feat-grid">
                    <style>{`@media (min-width:600px){ .feat-grid { grid-template-columns: repeat(2,1fr) !important; } }`}</style>
                    {service.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: accent, flexShrink: 0,
                          boxShadow: `0 0 6px ${accent}80`,
                        }} />
                        <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter', transition: 'color 0.25s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right: Meta Panel ── */}
              <div style={{
                flexShrink: 0, position: 'relative', overflow: 'hidden',
                padding: 'clamp(20px,3vw,32px)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(0,0,0,0.18)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24,
              }} className="meta-panel">
                <style>{`
                  @media (min-width: 1024px) {
                    .meta-panel {
                      width: 260px !important;
                      border-top: none !important;
                      border-left: 1px solid rgba(255,255,255,0.04) !important;
                    }
                  }
                `}</style>

                {/* Ambient glow */}
                <div style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 140, height: 140, borderRadius: '50%',
                  background: accent, filter: 'blur(50px)',
                  opacity: hovered ? 0.07 : 0,
                  transition: 'opacity 0.6s ease', pointerEvents: 'none',
                }} />

                {/* Meta info */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { label: 'Deliverable', value: service.deliverable },
                    { label: 'Timeline',    value: service.timeline    },
                  ].map(item => (
                    <div key={item.label}>
                      <span style={{
                        display: 'block', marginBottom: 5,
                        fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                        letterSpacing: '0.25em', color: `${accent}70`,
                        fontFamily: 'JetBrains Mono',
                      }}>
                        {item.label}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <a
                    ref={btnRef}
                    href="/contact"
                    className="shimmer-btn"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '12px 18px',
                      borderRadius: 12, textDecoration: 'none',
                      fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                      letterSpacing: '0.15em', fontFamily: 'JetBrains Mono',
                      background: `${accent}14`,
                      color: accent,
                      border: `1px solid ${accent}25`,
                      minHeight: 44,
                      transition: 'background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      if (isTouchDevice()) return;
                      e.currentTarget.style.background = accent;
                      e.currentTarget.style.color      = '#000';
                      e.currentTarget.style.boxShadow  = `0 0 30px ${accent}50`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${accent}14`;
                      e.currentTarget.style.color      = accent;
                      e.currentTarget.style.boxShadow  = 'none';
                    }}
                  >
                    Start a Project
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </BorderBeamCard>
      </GSAPTilt>
    </div>
  );
};

// ─── Component: Section Intro ──────────────────────────────────────────────────
const SectionIntro = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('.intro-el'),
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', maxWidth: 880, margin: '0 auto', padding: 'clamp(48px,8vw,80px) 24px clamp(32px,5vw,48px)', textAlign: 'center' }}>

      {/* Atmospheric orb */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'clamp(300px,50vw,600px)', height: 'clamp(140px,20vw,280px)',
        borderRadius: '50%', filter: 'blur(110px)',
        background: 'radial-gradient(circle, #FF570F, transparent 70%)',
        animation: 'breatheOrb 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Eyebrow */}
      <div className="intro-el" style={{ opacity: 0, marginBottom: 24 }}>
        <Eyebrow>What We Do</Eyebrow>
      </div>

      {/* Heading */}
      <h2 className="intro-el font-heading" style={{
        opacity: 0,
        fontSize: 'clamp(1.9rem,6vw,4rem)',
        fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.06,
        color: '#fff', marginBottom: 16,
      }}>
        Solutions That Scale
        <br />
        <span style={{
          background: 'linear-gradient(135deg,#FF570F 0%,#FDE87A 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          With Your Business.
        </span>
      </h2>

      {/* Subtext */}
      <p className="intro-el" style={{
        opacity: 0, color: 'rgba(255,255,255,0.35)',
        fontSize: 'clamp(0.875rem,1.5vw,1rem)', lineHeight: 1.75,
        maxWidth: 480, margin: '0 auto 36px', fontFamily: 'Inter',
      }}>
        From technical strategy to full-stack execution — we build systems that drive measurable growth.
      </p>

      {/* Stats strip */}
      <div className="intro-el" style={{ opacity: 0, overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          divideX: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, overflow: 'hidden', minWidth: 'max-content',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {statsData.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.06)' }} />}
              <AnimatedStat value={s.value} label={s.label} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Component: Bento Strip ────────────────────────────────────────────────────
const BentoStrip = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('.bento-pill'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px clamp(24px,4vw,36px)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        {bentoItems.map((item, i) => (
          <div key={i} className="bento-pill" style={{
            opacity: 0,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999,
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: 'rgba(255,255,255,0.38)',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'JetBrains Mono',
            minHeight: 36,
            transition: 'color 0.25s, border-color 0.25s',
            cursor: 'default',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.borderColor = 'rgba(255,87,15,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.38)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <span style={{ color: '#FF570F', fontSize: 11 }}>✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Component: Bottom CTA ─────────────────────────────────────────────────────
const BottomCTA = () => {
  const ref    = useRef(null);
  const btn1   = useRef(null);
  const btn2   = useRef(null);
  const [primaryHover, setPrimaryHover] = useState(false);
  useMagnetic(btn1, 0.3);
  useMagnetic(btn2, 0.3);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('.cta-el'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 86%', once: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{
      position: 'relative', zIndex: 10,
      padding: 'clamp(64px,10vw,120px) 24px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      background: 'linear-gradient(180deg, transparent, rgba(10,11,13,0.9) 50%)',
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,87,15,0.5) 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.015, pointerEvents: 'none',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 'clamp(350px,55vw,700px)', height: 'clamp(160px,25vw,360px)',
        borderRadius: '50%', filter: 'blur(130px)',
        background: 'radial-gradient(circle, #FF570F, transparent 60%)',
        opacity: 0.055, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>

        {/* Eyebrow */}
        <div className="cta-el" style={{ opacity: 0, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 1, background: 'rgba(255,87,15,0.4)' }} />
          <span style={{ color: '#FF570F', fontSize: 9, fontFamily: 'JetBrains Mono', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 800 }}>Next Step</span>
          <div style={{ width: 28, height: 1, background: 'rgba(255,87,15,0.4)' }} />
        </div>

        {/* Heading */}
        <h3 className="cta-el font-heading" style={{
          opacity: 0,
          fontSize: 'clamp(1.9rem,5vw,3.6rem)',
          fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08,
          color: '#fff', marginBottom: 16,
        }}>
          Ready to Build
          <br />
          <span style={{
            background: 'linear-gradient(135deg,#FF570F,#FDE87A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Something Real?
          </span>
        </h3>

        {/* Subtext */}
        <p className="cta-el" style={{
          opacity: 0, color: 'rgba(255,255,255,0.3)',
          fontSize: 'clamp(0.8rem,1.4vw,0.9rem)', lineHeight: 1.75,
          maxWidth: 420, margin: '0 auto 36px', fontFamily: 'Inter',
        }}>
          Book a free technical consultation to discuss your roadmap. No pitch. No fluff.
        </p>

        {/* Buttons */}
        <div className="cta-el" style={{ opacity: 0, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <a
            ref={btn1}
            href="/contact"
            className="shimmer-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', borderRadius: 999,
              fontFamily: 'Montserrat', fontWeight: 900,
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em',
              textDecoration: 'none', minHeight: 52,
              background: primaryHover ? '#FDE87A' : '#FF570F',
              color: '#000',
              boxShadow: primaryHover
                ? '0 8px 40px rgba(253,232,122,0.4)'
                : '0 8px 40px rgba(255,87,15,0.38)',
              transition: 'background 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={() => !isTouchDevice() && setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
          >
            Schedule Consultation
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <a
            ref={btn2}
            href="/case-studies"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 999,
              fontFamily: 'Montserrat', fontWeight: 900,
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em',
              textDecoration: 'none', minHeight: 52,
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent',
              transition: 'color 0.25s, border-color 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            See Our Work
          </a>
        </div>

        {/* Footer note */}
        <p className="cta-el" style={{
          opacity: 0, marginTop: 24,
          color: 'rgba(255,255,255,0.12)', fontSize: 9,
          textTransform: 'uppercase', letterSpacing: '0.24em',
          fontFamily: 'JetBrains Mono', fontWeight: 700,
        }}>
          Response within 24 hours · No pitch · No fluff
        </p>
      </div>
    </section>
  );
};

// ─── MAIN: Services Page ────────────────────────────────────────────────────────
const ServicesPage = () => {
  return (
    <>
      <GlobalStyles />
      <main style={{ position: 'relative', width: '100%', background: '#080a0c', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ── Fixed atmospheric background ── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 'clamp(350px,55vw,800px)', height: 'clamp(350px,55vw,800px)',
            borderRadius: '50%', filter: 'blur(180px)',
            background: 'radial-gradient(circle, #FF570F, transparent 65%)',
            opacity: 0.03, animation: 'breatheOrb 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '20%', left: 0,
            width: 'clamp(280px,40vw,600px)', height: 'clamp(280px,40vw,600px)',
            borderRadius: '50%', filter: 'blur(160px)',
            background: 'radial-gradient(circle, #FDE87A, transparent 65%)',
            opacity: 0.018,
          }} />
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,87,15,0.55) 1px, transparent 1px)',
            backgroundSize: '32px 32px', opacity: 0.013,
          }} />
        </div>

        {/* ── Navbar (your existing component) ── */}
        <Navbar />

        {/* ── PageHeader (your existing component) ── */}
        <PageHeader
          title="Services"
          breadcrumb="Services"
          subtitle="Enterprise-grade solutions built for businesses that cannot afford to fail."
        />

        {/* ── Logo Marquee Trust Strip ── */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1160, margin: '0 auto' }}>
          <p style={{
            textAlign: 'center', marginBottom: 12,
            fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.28em', color: 'rgba(255,255,255,0.13)',
            fontFamily: 'JetBrains Mono',
          }}>
            Trusted by teams at
          </p>
          <LogoMarquee />
        </div>

        {/* ── Section Intro + Stats ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <SectionIntro />
        </div>

        {/* ── Bento Pills ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <BentoStrip />
        </div>

        {/* ── Beam Divider ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <BeamDivider color="#FF570F" />
        </div>

        {/* ── Services Cards ── */}
        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 'clamp(24px,4vw,40px)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(16px,4vw,24px)', display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2vw,20px)' }}>
            {servicesData.map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <BottomCTA />

        {/* ── Footer (your existing component) ── */}
        <Footer />
      </main>
    </>
  );
};

export default ServicesPage;