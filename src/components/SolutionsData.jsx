// src/components/SolutionsData.jsx
// Six homepage service cards — no stock photos, brand-aligned abstract backgrounds
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// Abstract card background: dot grid + corner glow — no stock photography
const AbstractCardBg = ({ accent = '#FF570F' }) => (
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px]"
            style={{ background: `${accent}33` }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-[60px]"
            style={{ background: `${accent}1a` }} />
    </div>
);

const solutionsData = [
    {
        title: "Custom Software Development",
        desc: "Most off-the-shelf tools create workarounds, not solutions. We build the exact system your operation needs, then keep it running on retainer.",
        features: ["Bespoke architecture", "API integration", "Ongoing maintenance"],
        accent: "#FF570F",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    },
    {
        title: "AI Development & Integration",
        desc: "We wire LLMs and automation into your existing stack, not as experiments but as production systems your team relies on daily.",
        features: ["LLM infrastructure", "Workflow automation", "Custom model deployment"],
        accent: "#EE7D1D",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
    },
    {
        title: "Cloud Infrastructure & DevOps",
        desc: "A 99.9% uptime target means nothing without the infrastructure decisions behind it. We architect, deploy, and monitor cloud environments on retainer.",
        features: ["CI/CD automation", "Cloud scaling", "Security hardening"],
        accent: "#FDE87A",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-15 4.5 4.5 4.5 0 0 0 2.5 8.5h10z" /></svg>,
    },

    {
        title: "Software Consultancy",
        desc: "When you're making an architectural decision you'll live with for three years, a fractional CTO who's shipped comparable systems is worth more than a slide deck.",
        features: ["Technical audits", "Architectural roadmaps", "Executive advisory"],
        accent: "#FF570F",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    },
    {
        title: "Marketing Systems & Automation",
        desc: "A CRM your team actually uses. Email sequences that fire when they should. Analytics that tell you what changed and why. We build the stack and keep it calibrated.",
        features: ["CRM integration", "Email automation", "Analytics infrastructure"],
        accent: "#EE7D1D",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>,
    },
    {
        title: "SEO & Content Strategy",
        desc: "Not keyword stuffing. Technical SEO and content infrastructure built for compounding returns. Your domain becomes an asset, not an afterthought.",
        features: ["Technical SEO", "Content infrastructure", "Rank tracking"],
        accent: "#FDE87A",
        icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
];

const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });
        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo(((e.clientX - rect.left) / rect.width - 0.5) * 10);
            yTo(-((e.clientY - rect.top) / rect.height - 0.5) * 10);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);
    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

const SolutionCard = ({ solution, index }) => {
    const cardRef = useRef(null);
    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current, { opacity: 0, y: 48 }, {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
            delay: (index % 3) * 0.12,
        });
    }, [index]);
    return (
        <GSAPTilt className="solution-card h-full">
            <div ref={cardRef} className="relative h-[380px] bg-[#0e1012] rounded-3xl overflow-hidden border border-white/5 hover:border-orange-vibrant/30 transition-all duration-500 cursor-default group">
                <AbstractCardBg accent={solution.accent} />
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/8"
                            style={{ background: `${solution.accent}18`, color: solution.accent }}>
                            {solution.icon}
                        </div>
                        <h3 className="text-lg font-bold text-pure-white mb-3 leading-tight">{solution.title}</h3>
                        <p className="text-pure-white/55 text-sm leading-relaxed">{solution.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {solution.features.map((f) => (
                            <span key={f} className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                                style={{ borderColor: `${solution.accent}40`, color: solution.accent }}>
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </GSAPTilt>
    );
};

const Solutions = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headingRef.current) {
                const split = new SplitType(headingRef.current, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0, y: 32, duration: 0.8, stagger: 0.05, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
                });
            }
            gsap.from('.solutions-sub', {
                opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
                scrollTrigger: { trigger: '.solutions-sub', start: 'top 88%', once: true },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="solutions" className="relative py-28 px-6 bg-deep-black overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.018)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-vibrant/4 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
                        <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">What we maintain</span>
                    </div>
                    <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-pure-white mb-5">
                        Six services.{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Ongoing retainers.</span>
                    </h2>
                    <p className="solutions-sub text-pure-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Every service is sold as a retainer. The same team that builds it maintains it. No handoffs, no re-onboarding.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutionsData.map((s, i) => <SolutionCard key={s.title} solution={s} index={i} />)}
                </div>

                <div className="text-center mt-14">
                    <a href="https://calendly.com/digi-dreamworks/onboarding-call"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-colors duration-300 shadow-lg shadow-orange-vibrant/20">
                        Discuss Your Retainer
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Solutions;
