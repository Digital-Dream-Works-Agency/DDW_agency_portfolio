// src/components/ServicesGrid.jsx
// DDW core service areas — digital marketing channels + AI/software
import { useEffect, useRef } from 'react';
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
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                <path d="M11 8v3l2 2" />
            </svg>
        ),
    },
    {
        title: 'Amazon Management',
        desc: '$2.7M in sales managed. 129,800 orders. 27.64% ACOS. We've run one account since 2015 — full PPC management, seller central operations, listing optimization, and inventory strategy on retainer.',
        proof: '$2.7M+ sales managed',
        gradient: 'from-[#FDE87A]/12 to-[#EE7D1D]/10',
        accent: '#FDE87A',
        icon: (
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
            <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
        ),
    },
];

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

const ServiceCard = ({ service, index }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        gsap.fromTo(ref.current, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
            delay: (index % 3) * 0.1,
        });
    }, [index]);
    return (
        <GSAPTilt className="h-full">
            <div ref={ref} className={`relative h-full p-8 rounded-2xl border border-white/6 bg-gradient-to-br ${service.gradient} bg-[#0e1012] overflow-hidden group hover:border-orange-vibrant/25 transition-all duration-500`}>
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: `radial-gradient(${service.accent} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="relative z-10">
                    <div className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/8"
                        style={{ background: `${service.accent}18`, color: service.accent }}>
                        {service.icon}
                    </div>
                    <h3 className="text-base font-bold text-pure-white mb-3">{service.title}</h3>
                    <p className="text-pure-white/50 text-sm leading-relaxed mb-4">{service.desc}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide" style={{ borderColor: service.accent + '40', color: service.accent, background: service.accent + '12' }}>
                        <div className="w-1 h-1 rounded-full" style={{ background: service.accent }} />
                        {service.proof}
                    </div>
                </div>
            </div>
        </GSAPTilt>
    );
};

const ServicesGrid = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headingRef.current) {
                const split = new SplitType(headingRef.current, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0, y: 28, duration: 0.8, stagger: 0.05, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
                });
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 bg-[#080808] overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-orange-vibrant/4 blur-[120px] rounded-full" />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
                        <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Seven service areas · Florida LLC · Rome & Florida offices</span>
                    </div>
                    <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-pure-white mb-5">
                        Every channel.{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">One team.</span>
                    </h2>
                    <p className="text-pure-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        From Meta budgets to Amazon seller central to custom AI software — all maintained on retainer by the same engineers and marketers who built it.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {servicesData.map((s, i) => <ServiceCard key={s.title} service={s} index={i} />)}
                </div>
            </div>
        </section>
    );
};

export default ServicesGrid;
