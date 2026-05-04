// src/components/ServicesGrid.jsx
// Seven retainer services — no Cyber Security, no Data Analytics
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
    {
        title: "Custom Software Development",
        desc: "We build the exact system your operation needs — not the closest off-the-shelf approximation. Scoped to your stack, maintained on retainer.",
        gradient: "from-[#FF570F]/15 to-[#630D00]/10",
        accent: "#FF570F",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    },
    {
        title: "Web Development",
        desc: "Performance-first web applications and marketing sites. Built for conversion, maintained for stability. Not launched and forgotten.",
        gradient: "from-[#EE7D1D]/15 to-[#FF570F]/8",
        accent: "#EE7D1D",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><path d="M9 15l-3-3 3-3" /><path d="M15 9l3 3-3 3" /></svg>,
    },
    {
        title: "AI Development & Integration",
        desc: "We wire AI into your existing systems as production infrastructure, not prototypes. From LLM pipelines to automated decision flows.",
        gradient: "from-[#FDE87A]/12 to-[#EE7D1D]/10",
        accent: "#FDE87A",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
    },
    {
        title: "Cloud Infrastructure & DevOps",
        desc: "Secure cloud environments, automated CI/CD pipelines, and ongoing monitoring. The infrastructure behind 99.9% uptime targets.",
        gradient: "from-[#FF570F]/12 to-[#EE7D1D]/8",
        accent: "#FF570F",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>,
    },
    {
        title: "Software Consultancy",
        desc: "Fractional CTO services and technical audits. When the architectural decision you're making will define your next three years, get a second opinion from engineers who have shipped comparable systems.",
        gradient: "from-[#EE7D1D]/15 to-[#630D00]/10",
        accent: "#EE7D1D",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    },
    {
        title: "Marketing Systems & Automation",
        desc: "A CRM that actually fires. Email sequences calibrated to your funnel. Analytics connected to outcomes, not vanity metrics. We build the infrastructure and keep it tuned.",
        gradient: "from-[#FDE87A]/12 to-[#FF570F]/8",
        accent: "#FDE87A",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>,
    },
    {
        title: "SEO & Content Strategy",
        desc: "Technical SEO and content infrastructure built for compounding returns. We audit your current state, close the gaps, and run the program that builds domain authority over time.",
        gradient: "from-[#FF570F]/12 to-[#EE7D1D]/8",
        accent: "#FF570F",
        icon: <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
];

const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });
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
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: `radial-gradient(${service.accent} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="relative z-10">
                    <div className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/8"
                        style={{ background: `${service.accent}18`, color: service.accent }}>
                        {service.icon}
                    </div>
                    <h3 className="text-base font-bold text-pure-white mb-3">{service.title}</h3>
                    <p className="text-pure-white/50 text-sm leading-relaxed">{service.desc}</p>
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
                        <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Seven retainer services</span>
                    </div>
                    <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-pure-white mb-5">
                        One team.{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">No handoffs.</span>
                    </h2>
                    <p className="text-pure-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Every engagement is a retainer. The engineers who scoped it are the ones who maintain it. Your context never gets lost in a transition.
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
