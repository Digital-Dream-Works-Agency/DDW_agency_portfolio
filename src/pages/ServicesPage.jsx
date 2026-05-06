import { useEffect, useRef, useState } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ───────────────────────────────────────────────────────────────────────
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
    },
];

// Accent palette — rotates per card (Fixed #fff to #FFFFFF for valid hex alpha blending)
const ACCENTS = ['#FF570F', '#FDE87A', '#FFFFFF'];

// ─── GSAP Tilt (optimized, raf-throttled) ─────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.6 });
        const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.6 });
        
        let rect = null;
        let rafId;

        const onEnter = () => { rect = el.getBoundingClientRect(); };
        const onMove = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                if (!rect) rect = el.getBoundingClientRect();
                xTo(((e.clientX - rect.left) / rect.width - 0.5) * 5);
                yTo(-((e.clientY - rect.top) / rect.height - 0.5) * 5);
            });
        };
        const onLeave = () => { 
            cancelAnimationFrame(rafId);
            xTo(0); yTo(0); rect = null; 
        };
        
        el.addEventListener('mouseenter', onEnter);
        // Added passive flag for scrolling performance
        el.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave);
        
        return () => {
            cancelAnimationFrame(rafId);
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, []);
    return <div ref={ref} className={className} style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}>{children}</div>;
};

// ─── Service Card ──────────────────────────────────────────────────────────────
const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);
    const accent = ACCENTS[service.accentIndex];
    const isLight = accent === '#FDE87A' || accent === '#FFFFFF';

    useEffect(() => {
        // Proper GSAP context for unmount cleanup
        let ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
                    scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} style={{ opacity: 0, willChange: 'transform, opacity' }}>
            <GSAPTilt className="w-full">
                <div
                    className="group relative w-full rounded-2xl overflow-hidden transition-all duration-500"
                    style={{
                        background: 'linear-gradient(145deg, #111518 0%, #0c0e10 100%)',
                        border: `1px solid rgba(255,255,255,0.06)`,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.border = `1px solid ${accent}35`;
                        e.currentTarget.style.boxShadow = `0 16px 60px rgba(0,0,0,0.5), 0 0 80px ${accent}10`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                        e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
                    }}
                >
                    {/* Top accent bar */}
                    <div className="h-[2px] w-full transition-all duration-700 group-hover:opacity-100 opacity-40"
                        style={{ background: `linear-gradient(90deg, ${accent}, transparent 60%)` }} />

                    {/* Main content row */}
                    <div className="flex flex-col lg:flex-row">

                        {/* ── LEFT: number + title + desc + features ── */}
                        <div className="flex-1 p-8 lg:p-12 relative overflow-hidden">

                            {/* Giant watermark number - Fixed Opacity here */}
                            <div className="absolute bottom-0 right-0 text-[180px] font-black leading-none select-none pointer-events-none translate-x-6 translate-y-6 transition-all duration-700 group-hover:translate-x-4 group-hover:translate-y-4"
                                style={{ color: accent, opacity: 0.06, willChange: 'transform' }}>
                                {service.number}
                            </div>

                            <div className="relative z-10">
                                {/* Number badge + title */}
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                                        style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}25` }}>
                                        {service.number}
                                    </span>
                                    <div className="h-px flex-1 transition-all duration-500"
                                        style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
                                </div>

                                <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-black text-white leading-tight mb-2 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-xs font-black uppercase tracking-[0.2em] mb-6 transition-colors duration-300"
                                    style={{ color: accent }}>
                                    {service.tagline}
                                </p>
                                <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xl">
                                    {service.desc}
                                </p>

                                {/* Features grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {service.features.map((feat, i) => (
                                        <div key={i} className="flex items-start gap-3 group/f">
                                            <span className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover/f:scale-150"
                                                style={{ background: accent }} />
                                            <span className="text-white/40 text-sm transition-colors duration-300 group-hover/f:text-white/75">
                                                {feat}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT: meta + CTA panel ── */}
                        <div className="lg:w-[280px] flex-shrink-0 flex flex-col justify-between p-8 lg:p-10 border-t lg:border-t-0 lg:border-l relative overflow-hidden"
                            style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>

                            {/* Ambient glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ background: accent, transform: 'translateZ(0)' }} />

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.22em] block mb-2"
                                        style={{ color: `${accent}80` }}>Deliverable</span>
                                    <span className="text-white text-sm font-bold block">{service.deliverable}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.22em] block mb-2"
                                        style={{ color: `${accent}80` }}>Timeline</span>
                                    <span className="text-white text-sm font-bold block">{service.timeline}</span>
                                </div>
                            </div>

                            <div className="relative z-10 mt-10 lg:mt-0">
                                <Link
                                    to="/contact"
                                    className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 group/btn overflow-hidden"
                                    style={{
                                        background: `${accent}12`,
                                        color: accent,
                                        border: `1px solid ${accent}25`,
                                        transform: 'translateZ(0)'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = accent;
                                        e.currentTarget.style.color = isLight ? '#000' : '#000';
                                        e.currentTarget.style.boxShadow = `0 0 30px ${accent}50`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = `${accent}12`;
                                        e.currentTarget.style.color = accent;
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    Get a Quote
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                                        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </GSAPTilt>
        </div>
    );
};

// ─── Section intro header ──────────────────────────────────────────────────────
const SectionIntro = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.intro-el',
                { opacity: 0, y: 35 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
            {/* Ambient blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-[0.07] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF570F, transparent 70%)', transform: 'translateZ(0)' }} />

            <div className="intro-el opacity-0 inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8"
                style={{ background: 'rgba(255,87,15,0.08)', border: '1px solid rgba(255,87,15,0.2)', willChange: 'transform, opacity' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF570F] animate-pulse" />
                <span className="text-[#FF570F] text-[10px] font-black uppercase tracking-[0.25em]">What We Do</span>
            </div>

            <h2 className="intro-el opacity-0 text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[1.02] tracking-tight text-white mb-5"
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

            <p className="intro-el opacity-0 text-white/40 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
                style={{ willChange: 'transform, opacity' }}>
                From technical strategy to full-stack execution — we build systems that drive measurable growth.
            </p>

            {/* Service count strip */}
            <div className="intro-el opacity-0 flex items-center justify-center gap-8 mt-12" style={{ willChange: 'transform, opacity' }}>
                {[['6', 'Service Areas'], ['US + EU', 'Markets'], ['Retainer', 'Model Only']].map(([v, l]) => (
                    <div key={l} className="text-center">
                        <div className="text-xl font-black text-white mb-0.5">{v}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/25 font-bold">{l}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Services Page ─────────────────────────────────────────────────────────────
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

            {/* Background atmosphere — CSS only, zero JS cost */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[160px] opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, #FF570F, transparent 65%)', transform: 'translateZ(0)' }} />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.025]"
                    style={{ background: 'radial-gradient(circle, #FDE87A, transparent 65%)', transform: 'translateZ(0)' }} />
                <div className="absolute inset-0 opacity-[0.018]"
                    style={{ backgroundImage: 'radial-gradient(rgba(255,87,15,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            {/* Section intro */}
            <SectionIntro />

            {/* ── Cards ── */}
            <section className="relative z-10 pb-32">
                <div className="max-w-[1160px] mx-auto px-6 space-y-6">
                    {servicesData.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section className="relative z-10 py-28 border-t border-white/[0.05]"
                style={{ background: 'linear-gradient(180deg, transparent, #111316 40%)' }}>
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '36px 36px', transform: 'translateZ(0)' }} />

                <div className="relative max-w-3xl mx-auto px-6 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">Next step</p>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        Ready to Build
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>Something Real?</span>
                    </h3>
                    <p className="text-white/35 text-base mb-12 max-w-md mx-auto leading-relaxed">
                        Book a free technical consultation to discuss your roadmap.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/contact"
                            className="group inline-flex items-center gap-3 px-9 py-4 bg-[#FF570F] text-black font-black text-xs uppercase tracking-[0.18em] rounded-full transition-all duration-300 hover:bg-[#FDE87A] hover:scale-105 shadow-2xl shadow-[#FF570F]/30"
                            style={{ transform: 'translateZ(0)' }}
                        >
                            Schedule Consultation
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            to="/case-studies"
                            className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-[0.18em] text-white/50 transition-all duration-300 hover:text-white"
                            style={{ border: '1px solid rgba(255,255,255,0.08)', transform: 'translateZ(0)' }}
                        >
                            See Our Work
                        </Link>
                    </div>

                    <p className="text-white/15 text-[11px] uppercase tracking-widest mt-8 font-bold">
                        Response within 24 hours · No pitch · No fluff
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ServicesPage;