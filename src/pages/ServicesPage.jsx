import { useEffect, useRef, useState } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Color Palette ──────────────────────────────────────────────────────────
const ACCENTS = ['#FF570F', '#FDE87A', '#FFFFFF'];

// ─── Services Data ──────────────────────────────────────────────────────────
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z"/>
                <circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
            </svg>
        ),
    },
];

// ─── Stats Data ─────────────────────────────────────────────────────────────
const stats = [
    { value: '47+', label: 'Projects Delivered' },
    { value: '$3.2M', label: 'Revenue Generated' },
    { value: 'US & EU', label: 'Active Markets' },
    { value: '98%', label: 'Client Retention' },
];

// ─── Animated Number Component ───────────────────────────────────────────────
const AnimatedStat = ({ value, label }) => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }
            );
        });
        return () => ctx.revert();
    }, []);
    return (
        <div ref={ref} style={{ opacity: 0 }} className="text-center px-6 py-3 relative">
            <div className="text-2xl font-black text-white tracking-tight mb-0.5">{value}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/30 font-bold">{label}</div>
        </div>
    );
};

// ─── Logo Marquee ────────────────────────────────────────────────────────────
const clients = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Loom', 'Clerk', 'PlanetScale'];

const LogoMarquee = () => (
    <div className="relative overflow-hidden py-6 border-t border-b border-white/[0.05]">
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #09090b, transparent)' }} />
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #09090b, transparent)' }} />
        <div className="flex gap-12 items-center"
            style={{
                animation: 'marquee 28s linear infinite',
                width: 'max-content',
            }}>
            {[...clients, ...clients].map((c, i) => (
                <span key={i} className="text-white/15 text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap select-none hover:text-white/35 transition-colors duration-300">
                    {c}
                </span>
            ))}
        </div>
        <style>{`
            @keyframes marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
        `}</style>
    </div>
);

// ─── Border Beam Card ────────────────────────────────────────────────────────
const BorderBeamCard = ({ children, accent, className = '' }) => {
    const beamRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const beam = beamRef.current;
        if (!card || !beam) return;

        let progress = Math.random();
        let raf;
        let active = false;

        const animate = () => {
            progress = (progress + 0.003) % 1;
            const perimeter = 2 * (card.offsetWidth + card.offsetHeight);
            const pos = progress * perimeter;
            let x, y;
            const w = card.offsetWidth, h = card.offsetHeight;
            if (pos < w) { x = pos; y = 0; }
            else if (pos < w + h) { x = w; y = pos - w; }
            else if (pos < 2 * w + h) { x = w - (pos - w - h); y = h; }
            else { x = 0; y = h - (pos - 2 * w - h); }
            beam.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
            raf = requestAnimationFrame(animate);
        };

        const onEnter = () => { active = true; animate(); };
        const onLeave = () => { active = false; cancelAnimationFrame(raf); beam.style.opacity = '0'; };

        // passive animation on scroll-in too
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { beam.style.opacity = '0.7'; animate(); }
            else { cancelAnimationFrame(raf); beam.style.opacity = '0'; }
        }, { threshold: 0.2 });

        card.addEventListener('mouseenter', () => { beam.style.opacity = '1'; });
        card.addEventListener('mouseleave', onLeave);
        observer.observe(card);

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, [accent]);

    return (
        <div ref={cardRef} className={`relative ${className}`}>
            {/* Border beam dot */}
            <div
                ref={beamRef}
                className="absolute w-3 h-3 rounded-full pointer-events-none z-20 transition-opacity duration-500"
                style={{
                    background: accent,
                    boxShadow: `0 0 12px 4px ${accent}80`,
                    opacity: 0,
                    top: 0,
                    left: 0,
                }}
            />
            {children}
        </div>
    );
};

// ─── Spotlight Card (mouse-follow glow) ──────────────────────────────────────
const SpotlightCard = ({ children, accent, className = '' }) => {
    const ref = useRef(null);
    const spotRef = useRef(null);

    useEffect(() => {
        const card = ref.current;
        if (!card) return;
        const onMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (spotRef.current) {
                spotRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${accent}12, transparent 60%)`;
            }
        };
        card.addEventListener('mousemove', onMove, { passive: true });
        return () => card.removeEventListener('mousemove', onMove);
    }, [accent]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <div ref={spotRef} className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            {children}
        </div>
    );
};

// ─── GSAP Tilt ───────────────────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Skip tilt on touch devices
        if (window.matchMedia('(hover: none)').matches) return;

        const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.7 });
        const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.7 });
        let rect = null;
        let rafId;

        const onEnter = () => { rect = el.getBoundingClientRect(); };
        const onMove = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                if (!rect) rect = el.getBoundingClientRect();
                xTo(((e.clientX - rect.left) / rect.width - 0.5) * 4);
                yTo(-((e.clientY - rect.top) / rect.height - 0.5) * 4);
            });
        };
        const onLeave = () => { cancelAnimationFrame(rafId); xTo(0); yTo(0); rect = null; };

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave);
        return () => {
            cancelAnimationFrame(rafId);
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, []);
    return (
        <div ref={ref} className={className} style={{ transformPerspective: 1400, transformStyle: 'preserve-3d' }}>
            {children}
        </div>
    );
};

// ─── Magnetic Button ─────────────────────────────────────────────────────────
const MagneticButton = ({ children, className, to, style, onMouseEnter, onMouseLeave }) => {
    const ref = useRef(null);

    useEffect(() => {
        const btn = ref.current;
        if (!btn || window.matchMedia('(hover: none)').matches) return;

        const onMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.28;
            const dy = (e.clientY - cy) * 0.28;
            gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
        };
        const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });

        btn.addEventListener('mousemove', onMove, { passive: true });
        btn.addEventListener('mouseleave', onLeave);
        return () => {
            btn.removeEventListener('mousemove', onMove);
            btn.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <Link ref={ref} to={to} className={className} style={style}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {children}
        </Link>
    );
};

// ─── Service Card ─────────────────────────────────────────────────────────────
const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);
    const accent = ACCENTS[service.accentIndex];
    const isLight = accent === '#FDE87A' || accent === '#FFFFFF';

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 48 },
                {
                    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: cardRef.current, start: 'top 90%', once: true },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} style={{ opacity: 0, willChange: 'transform, opacity' }}>
            <GSAPTilt className="w-full">
                <BorderBeamCard accent={accent}>
                    <SpotlightCard accent={accent} className="group w-full rounded-2xl overflow-hidden transition-all duration-500"
                        style={{
                            background: 'linear-gradient(145deg, #111518 0%, #0c0e10 100%)',
                            border: `1px solid rgba(255,255,255,0.06)`,
                            boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.border = `1px solid ${accent}30`;
                            e.currentTarget.style.boxShadow = `0 12px 50px rgba(0,0,0,0.45), 0 0 60px ${accent}0d`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                            e.currentTarget.style.boxShadow = '0 4px 32px rgba(0,0,0,0.35)';
                        }}
                    >
                        {/* Top accent bar */}
                        <div className="h-[1.5px] w-full transition-all duration-700 group-hover:opacity-80 opacity-25"
                            style={{ background: `linear-gradient(90deg, ${accent}, transparent 55%)` }} />

                        <div className="flex flex-col lg:flex-row">

                            {/* LEFT: content */}
                            <div className="flex-1 p-7 lg:p-10 relative overflow-hidden">
                                {/* Giant watermark number */}
                                <div className="absolute bottom-0 right-0 text-[160px] font-black leading-none select-none pointer-events-none translate-x-4 translate-y-4 transition-all duration-700 group-hover:translate-x-2 group-hover:translate-y-2"
                                    style={{ color: accent, opacity: 0.05, willChange: 'transform' }}>
                                    {service.number}
                                </div>

                                <div className="relative z-10">
                                    {/* Number badge + divider line */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full"
                                            style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
                                            <span style={{ color: accent }} className="opacity-70">
                                                {service.icon}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]"
                                                style={{ color: accent }}>{service.number}</span>
                                        </div>
                                        <div className="h-px flex-1"
                                            style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
                                    </div>

                                    <h3 className="text-2xl md:text-[1.85rem] font-black text-white leading-tight mb-1.5 tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-5"
                                        style={{ color: accent }}>
                                        {service.tagline}
                                    </p>
                                    <p className="text-white/45 text-sm leading-relaxed mb-7 max-w-xl">
                                        {service.desc}
                                    </p>

                                    {/* Features grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {service.features.map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2.5 group/f">
                                                <span className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300 group-hover/f:scale-[2]"
                                                    style={{ background: accent }} />
                                                <span className="text-white/35 text-[13px] transition-colors duration-300 group-hover/f:text-white/65">
                                                    {feat}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: meta panel */}
                            <div className="lg:w-[260px] flex-shrink-0 flex flex-col justify-between p-7 lg:p-8 border-t lg:border-t-0 lg:border-l relative overflow-hidden"
                                style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.15)' }}>

                                {/* Ambient glow */}
                                <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{ background: accent, transform: 'translateZ(0)' }} />

                                <div className="relative z-10 space-y-6">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.25em] block mb-1.5"
                                            style={{ color: `${accent}60` }}>Deliverable</span>
                                        <span className="text-white/80 text-sm font-bold block">{service.deliverable}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.25em] block mb-1.5"
                                            style={{ color: `${accent}60` }}>Timeline</span>
                                        <span className="text-white/80 text-sm font-bold block">{service.timeline}</span>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-8 lg:mt-0">
                                    <MagneticButton
                                        to="/contact"
                                        className="flex items-center justify-between w-full px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-250 overflow-hidden group/btn"
                                        style={{
                                            background: `${accent}10`,
                                            color: accent,
                                            border: `1px solid ${accent}22`,
                                            transform: 'translateZ(0)',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = accent;
                                            e.currentTarget.style.color = '#000';
                                            e.currentTarget.style.boxShadow = `0 0 28px ${accent}45`;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = `${accent}10`;
                                            e.currentTarget.style.color = accent;
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        Start a Project
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                                            fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </MagneticButton>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </BorderBeamCard>
            </GSAPTilt>
        </div>
    );
};

// ─── Animated Beam (connecting line between sections) ────────────────────────
const AnimatedBeam = ({ color = '#FF570F' }) => (
    <div className="flex justify-center py-3 pointer-events-none select-none" aria-hidden>
        <div className="relative w-px h-12">
            <div className="absolute inset-0"
                style={{ background: `linear-gradient(to bottom, transparent, ${color}40, transparent)` }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: color, opacity: 0.6, boxShadow: `0 0 8px ${color}` }} />
        </div>
    </div>
);

// ─── Section Intro ────────────────────────────────────────────────────────────
const SectionIntro = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.intro-el',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="relative max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
            {/* Ambient blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-[120px] opacity-[0.06] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF570F, transparent 70%)', transform: 'translateZ(0)' }} />

            <div className="intro-el opacity-0 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-7"
                style={{ background: 'rgba(255,87,15,0.07)', border: '1px solid rgba(255,87,15,0.18)', willChange: 'transform, opacity' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF570F] animate-pulse" />
                <span className="text-[#FF570F] text-[9px] font-black uppercase tracking-[0.28em]">What We Do</span>
            </div>

            <h2 className="intro-el opacity-0 text-[clamp(2.2rem,5.5vw,4rem)] font-black leading-[1.04] tracking-tight text-white mb-4"
                style={{ willChange: 'transform, opacity' }}>
                Solutions That Scale
                <br />
                <span style={{
                    background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    With Your Business.
                </span>
            </h2>

            <p className="intro-el opacity-0 text-white/35 text-base leading-relaxed max-w-lg mx-auto mb-10"
                style={{ willChange: 'transform, opacity' }}>
                From technical strategy to full-stack execution — we build systems that drive measurable growth.
            </p>

            {/* Stats strip */}
            <div className="intro-el opacity-0 inline-flex items-center divide-x divide-white/[0.07] rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', willChange: 'transform, opacity' }}>
                {stats.map(({ value, label }) => (
                    <AnimatedStat key={label} value={value} label={label} />
                ))}
            </div>
        </div>
    );
};

// ─── Bento Features Strip (below intro, above cards) ─────────────────────────
const BentoStrip = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.bento-el',
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    const items = [
        { label: 'No retainer lock-in', icon: '✓' },
        { label: 'Dedicated tech lead', icon: '✓' },
        { label: 'Weekly async updates', icon: '✓' },
        { label: 'IP fully yours', icon: '✓' },
        { label: '24hr response SLA', icon: '✓' },
    ];

    return (
        <div ref={ref} className="max-w-[1160px] mx-auto px-6 pb-8">
            <div className="flex flex-wrap justify-center gap-2">
                {items.map((item, i) => (
                    <div key={i} className="bento-el opacity-0 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.18em] text-white/40 transition-colors duration-300 hover:text-white/70"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', willChange: 'transform, opacity' }}>
                        <span className="text-[#FF570F] text-xs">{item.icon}</span>
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
const BottomCTA = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.cta-el',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    const [primaryHover, setPrimaryHover] = useState(false);

    return (
        <section ref={ref} className="relative z-10 py-24 border-t border-white/[0.05]"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(15,16,18,0.9) 40%)' }}>

            {/* Dot pattern bg */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '32px 32px', transform: 'translateZ(0)' }} />

            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF570F, transparent 60%)' }} />

            <div className="relative max-w-2xl mx-auto px-6 text-center">
                <p className="cta-el opacity-0 text-[9px] font-black uppercase tracking-[0.32em] text-white/18 mb-5">Next step</p>

                <h3 className="cta-el opacity-0 text-4xl md:text-5xl font-black text-white mb-3 leading-[1.06] tracking-tight">
                    Ready to Build
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>Something Real?</span>
                </h3>

                <p className="cta-el opacity-0 text-white/30 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                    Book a free technical consultation to discuss your roadmap. No pitch. No fluff.
                </p>

                <div className="cta-el opacity-0 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {/* Shimmer primary button */}
                    <MagneticButton
                        to="/contact"
                        className="group relative inline-flex items-center gap-3 px-9 py-4 text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300"
                        style={{
                            background: primaryHover ? '#FDE87A' : '#FF570F',
                            boxShadow: primaryHover
                                ? '0 8px 40px rgba(253,232,122,0.35)'
                                : '0 8px 40px rgba(255,87,15,0.35)',
                            transform: 'translateZ(0) scale(1)',
                        }}
                        onMouseEnter={() => setPrimaryHover(true)}
                        onMouseLeave={() => setPrimaryHover(false)}
                    >
                        {/* shimmer overlay */}
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
                        Schedule Consultation
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </MagneticButton>

                    <MagneticButton
                        to="/case-studies"
                        className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white/40 transition-all duration-300 hover:text-white/80"
                        style={{ border: '1px solid rgba(255,255,255,0.07)', transform: 'translateZ(0)' }}
                    >
                        See Our Work
                    </MagneticButton>
                </div>

                <p className="cta-el opacity-0 text-white/12 text-[10px] uppercase tracking-widest mt-7 font-bold">
                    Response within 24 hours · No pitch · No fluff
                </p>
            </div>
        </section>
    );
};

// ─── Services Page ────────────────────────────────────────────────────────────
const ServicesPage = () => {
    useSeoMeta(SEO.services);

    return (
        <main className="relative w-full bg-[#09090b] min-h-screen">
            <Navbar />
            <PageHeader
                title="Services"
                breadcrumb="Services"
                subtitle="Enterprise-grade solutions built for businesses that cannot afford to fail."
            />

            {/* Fixed background atmosphere — CSS only */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.035]"
                    style={{ background: 'radial-gradient(circle, #FF570F, transparent 65%)', transform: 'translateZ(0)' }} />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.02]"
                    style={{ background: 'radial-gradient(circle, #FDE87A, transparent 65%)', transform: 'translateZ(0)' }} />
                {/* Subtle dot grid */}
                <div className="absolute inset-0 opacity-[0.015]"
                    style={{ backgroundImage: 'radial-gradient(rgba(255,87,15,0.7) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
            </div>

            {/* Section intro */}
            <SectionIntro />

            {/* Logo Marquee — social proof */}
            <div className="relative z-10 max-w-[1160px] mx-auto px-0 mb-10">
                <p className="text-center text-[9px] font-black uppercase tracking-[0.28em] text-white/15 mb-4">
                    Trusted by teams at
                </p>
                <LogoMarquee />
            </div>

            {/* Bento pill strip */}
            <BentoStrip />

            {/* Connector beam */}
            <AnimatedBeam color="#FF570F" />

            {/* Cards */}
            <section className="relative z-10 pb-8">
                <div className="max-w-[1160px] mx-auto px-6 space-y-5">
                    {servicesData.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <BottomCTA />

            <Footer />
        </main>
    );
};

export default ServicesPage;