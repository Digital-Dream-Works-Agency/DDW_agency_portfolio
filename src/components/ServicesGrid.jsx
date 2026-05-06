// src/components/ServicesGrid.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
    {
        title: 'Meta Ads Management',
        desc: '$683K managed in a single month. 343 active campaigns. 5.48x average ROAS. We run full-funnel Meta strategy for EU and US brands — prospecting, retargeting, catalog, and creative testing — on retainer.',
        proof: '$683K / mo managed',
        gradient: 'from-[#FF570F]/15 to-[#630D00]/10',
        accent: '#FF570F',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        title: 'Google Ads Management',
        desc: '600% ROAS on €69.7K spend. €418K in revenue for a single EU brand. We manage search, shopping, and display campaigns across US and EU markets — built around real conversion data, not vanity clicks.',
        proof: '600% ROAS achieved',
        gradient: 'from-[#EE7D1D]/15 to-[#FF570F]/8',
        accent: '#EE7D1D',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                <path d="M11 8v3l2 2" />
            </svg>
        ),
    },
    {
        title: 'Amazon Management',
        desc: "$2.7M in sales managed. 129,800 orders. 27.64% ACOS. We've run one account since 2015 — full PPC management, seller central operations, listing optimization, and inventory strategy on retainer.",
        proof: '$2.7M+ sales managed',
        gradient: 'from-[#FDE87A]/12 to-[#EE7D1D]/10',
        accent: '#FDE87A',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
        ),
    },
    {
        title: 'TikTok Shop & Social Commerce',
        desc: '$290,753 GMV in 7 days. 9,010 orders. +121% order growth. Full TikTok Shop setup, affiliate creator management, shoppable content strategy, and LIVE commerce execution — all maintained on retainer.',
        proof: '$290K GMV in 7 days',
        gradient: 'from-[#FF570F]/12 to-[#EE7D1D]/8',
        accent: '#FF570F',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
        ),
    },
    {
        title: 'SEO & Organic Growth',
        desc: 'From 2K to 54K monthly visitors. 251K total clicks. 10.3M impressions. We run technical SEO audits, site architecture rebuilds, link-building programs, and content strategies that compound — on retainer.',
        proof: '2K → 54K visitors/mo',
        gradient: 'from-[#EE7D1D]/15 to-[#630D00]/10',
        accent: '#EE7D1D',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        title: 'AI Development & Software',
        desc: "We build the exact system your operation needs — not the closest off-the-shelf approximation. LLM pipelines, AI automation, custom dashboards, and production-grade software. Maintained by the engineers who built it.",
        proof: '3 live SaaS products shipped',
        gradient: 'from-[#FDE87A]/12 to-[#FF570F]/8',
        accent: '#FDE87A',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
        ),
    },
    {
        title: 'SaaS Products',
        desc: "We don't just build for clients. Lyra answers every business call 24/7 with AI — books appointments, qualifies leads, sends follow-ups. Sviluppiamo.dev is our Italian-market vibe coding platform. Built and shipped by DDW.",
        proof: 'Lyra · Sviluppiamo.dev',
        gradient: 'from-[#FF570F]/12 to-[#EE7D1D]/8',
        accent: '#FF570F',
        icon: (
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-orange-vibrant">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
        ),
    },
];

// ─── Native GSAP Tilt ──────────────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.5 });
        const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.5 });
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            xTo(((e.clientX - r.left) / r.width - 0.5) * 8);
            yTo(-((e.clientY - r.top) / r.height - 0.5) * 8);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, []);
    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Magnetic Hook ─────────────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.2) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const xTo = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power2.out' });
        const onMove = (e) => {
            const rect = element.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        element.addEventListener('mousemove', onMove);
        element.addEventListener('mouseleave', onLeave);
        return () => { element.removeEventListener('mousemove', onMove); element.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Learn More Button ─────────────────────────────────────────────────────────
const LearnMoreButton = () => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.3);
    return (
        <a ref={btnRef} href="#learn-more" className="relative inline-flex items-center gap-3 group/btn w-max">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-orange-vibrant rounded-[40%] rotate-45 transition-all duration-500 group-hover/btn:rotate-90 group-hover/btn:scale-110 shadow-lg shadow-orange-vibrant/50" />
                <div className="absolute inset-0 bg-orange-vibrant rounded-[40%] rotate-45 animate-ping opacity-20" />
                <span className="relative z-10 text-deep-black text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                    Learn<br />More
                </span>
            </div>
            <span className="text-text-muted group-hover/btn:text-orange-vibrant group-hover/btn:translate-x-1 transition-all duration-300 text-xl">→</span>
        </a>
    );
};

// ─── View All Button ───────────────────────────────────────────────────────────
const ViewAllButton = () => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);
    return (
        <a ref={btnRef} href="#all-services" className="relative group bg-orange-vibrant text-deep-black px-10 py-4 font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 inline-flex items-center gap-3 overflow-hidden shadow-lg shadow-orange-vibrant/40">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative z-10 flex items-center gap-3">
                View All Services
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
            <span className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500" />
        </a>
    );
};

// ─── Service Card ──────────────────────────────────────────────────────────────
const ServiceCard = ({ service, index }) => {
    const iconRef = useRef(null);
    const handleMouseEnter = () => gsap.to(iconRef.current, { scale: 1.1, rotation: 5, duration: 0.3, ease: 'power2.out' });
    const handleMouseLeave = () => gsap.to(iconRef.current, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });

    return (
        <GSAPTilt className="service-box h-full">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`relative bg-gradient-to-br ${service.gradient} from-[#151a1d] to-[#0d1012] p-10 rounded-2xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-500 group flex flex-col justify-between h-full overflow-hidden`}
            >
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: `radial-gradient(${service.accent} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
                    style={{ background: `radial-gradient(ellipse at top right, ${service.accent}22, transparent 70%)` }} />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `${service.accent}30` }} />

                <div className="relative z-10">
                    <div ref={iconRef} className="mb-6 transform transition-transform duration-300">
                        {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-wide text-pure-white group-hover:text-orange-vibrant transition-colors duration-300">
                        {service.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-6 group-hover:text-pure-white/80 transition-colors duration-300">
                        {service.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide mb-8"
                        style={{ borderColor: service.accent + '40', color: service.accent, background: service.accent + '12' }}>
                        <div className="w-1 h-1 rounded-full" style={{ background: service.accent }} />
                        {service.proof}
                    </div>
                </div>

                <LearnMoreButton />

                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <svg viewBox="0 0 100 100" className="text-orange-vibrant">
                        <path d="M 0 100 L 100 100 L 100 0 Z" fill="currentColor" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </GSAPTilt>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ServicesGrid = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const prlxHeaderRef = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    useEffect(() => {
        const heading = document.querySelector('.services-heading');
        if (heading && !textSplit) {
            const split = new SplitType(heading, { types: 'words' });
            setTextSplit(split);
            gsap.from(split.words, {
                opacity: 0, y: 50, rotationX: -45, transformOrigin: 'top center', stagger: 0.05, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: heading, start: 'top 80%', once: true },
            });
        }
        return () => { if (textSplit) textSplit.revert(); };
    }, [textSplit]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.service-box', {
                y: 80, opacity: 0, scale: 0.9, rotationY: -15, duration: 1, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
            });
            gsap.to(prlx1Ref.current, { yPercent: 20, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(prlx2Ref.current, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(prlxHeaderRef.current, { yPercent: 15, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative pt-16 pb-24 bg-[#0d1012] text-white overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div ref={prlx1Ref} className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
            <div ref={prlx2Ref} className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div ref={prlxHeaderRef} className="text-center mb-16 md:mb-20">
                    
                    {/* FIX 1: Trust badge styled consistently with Hero section */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em]">Seven service areas &middot; Florida LLC &middot; Rome &amp; Florida offices</span>
                    </div>

                    {/* FIX 2: Replaced inline gradient with solid text-[#FF570F] to prevent SplitType bug */}
                    <h2 ref={headingRef} className="services-heading text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight perspective-1000 mb-6">
                        Every channel.{' '}
                        <span className="text-[#FF570F]">
                            One team.
                        </span>
                    </h2>

                    <p className="text-pure-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        From Meta budgets to Amazon seller central to custom AI software — all maintained on retainer by the same engineers and marketers who built it.
                    </p>
                </div>

                {/* First 6 cards — 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {servicesData.slice(0, 6).map((service, index) => (
                        <ServiceCard key={service.title} service={service} index={index} />
                    ))}
                </div>

                {/* 7th card — centered */}
                <div className="flex justify-center mb-14">
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <ServiceCard service={servicesData[6]} index={6} />
                    </div>
                </div>

                {/* CTA */}
                <div className="flex justify-center">
                    <ViewAllButton />
                </div>
            </div>

            <style jsx>{`.perspective-1000 { perspective: 1000px; }`}</style>
        </section>
    );
};

export default ServicesGrid;