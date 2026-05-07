import { useEffect, useRef, useState } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Custom Hooks ──────────────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.2) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });
        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, [strength]);
};

const GSAPTilt = ({ children, className, style }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });
        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo(((e.clientX - rect.left) / rect.width - 0.5) * 8);
            yTo(-((e.clientY - rect.top) / rect.height - 0.5) * 8);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);
    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000, ...style }}>{children}</div>;
};

// ─── NEW: Logo Marquee ─────────────────────────────────────────────────────────
// WHY: Social proof is the #1 trust signal for agencies. Platform logos = credibility.
const LogoMarquee = () => {
    const platforms = [
        { name: 'Meta Ads', icon: '◈' },
        { name: 'Google Ads', icon: '◉' },
        { name: 'Amazon', icon: '◇' },
        { name: 'TikTok Shop', icon: '◆' },
        { name: 'Shopify', icon: '○' },
        { name: 'OpenAI', icon: '◎' },
        { name: 'Stripe', icon: '▣' },
        { name: 'Vercel', icon: '△' },
    ];
    const doubled = [...platforms, ...platforms];

    return (
        <div className="relative border-y border-white/5 bg-gradient-to-r from-deep-black via-[#0d1012] to-deep-black overflow-hidden py-5">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep-black to-transparent z-10 pointer-events-none" />
            <div
                className="flex gap-16 items-center"
                style={{ animation: 'marqueeScroll 28s linear infinite', width: 'max-content' }}
            >
                {doubled.map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5 shrink-0 group cursor-default">
                        <span className="text-orange-vibrant/40 group-hover:text-orange-vibrant transition-colors duration-300 text-sm">{p.icon}</span>
                        <span className="text-white/25 group-hover:text-white/60 font-bold text-sm uppercase tracking-widest transition-colors duration-300 font-mono">
                            {p.name}
                        </span>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes marqueeScroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

// ─── IMPROVED: Globe Visual ────────────────────────────────────────────────────
// WHY: The old CSS radar looked like a placeholder. This SVG globe is actually impressive.
const GlobeVisual = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 300 300" className="absolute w-[85%] h-[85%] opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="globeGlow" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#FF570F" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FF570F" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* Globe sphere */}
            <circle cx="150" cy="150" r="120" fill="url(#globeGlow)" stroke="#FF570F" strokeWidth="0.5" strokeOpacity="0.3" />
            {/* Latitude lines */}
            {[-60, -30, 0, 30, 60].map((lat, i) => {
                const y = 150 + (lat / 90) * 120;
                const rx = Math.cos((lat * Math.PI) / 180) * 120;
                return <ellipse key={i} cx="150" cy={y} rx={rx} ry="6" fill="none" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.2" />;
            })}
            {/* Longitude lines */}
            {[0, 30, 60, 90, 120, 150].map((lng, i) => (
                <ellipse key={i} cx="150" cy="150" rx={Math.abs(Math.cos((lng * Math.PI) / 180)) * 120 + 2} ry="120" fill="none" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.15" transform={`rotate(${lng}, 150, 150)`} />
            ))}
            {/* Continents - simplified paths */}
            <path d="M 90 110 L 105 100 L 125 108 L 130 125 L 115 135 L 95 128 Z" fill="#FF570F" fillOpacity="0.12" stroke="#FF570F" strokeWidth="0.5" strokeOpacity="0.5" />
            <path d="M 150 95 L 175 88 L 195 100 L 200 120 L 185 130 L 160 125 L 148 110 Z" fill="#FF570F" fillOpacity="0.08" stroke="#FF570F" strokeWidth="0.5" strokeOpacity="0.4" />
            <path d="M 155 155 L 175 148 L 195 158 L 200 175 L 180 185 L 158 178 Z" fill="#FF570F" fillOpacity="0.06" stroke="#FF570F" strokeWidth="0.4" strokeOpacity="0.35" />
        </svg>

        {/* Rotating ring */}
        <div className="absolute w-[65%] h-[65%] border border-[#FF570F]/15 rounded-full animate-[spin_20s_linear_infinite]" style={{ borderStyle: 'dashed', borderDashArray: '4 8' }} />
        <div className="absolute w-[80%] h-[80%] border border-[#FF570F]/8 rounded-full animate-[spin_35s_linear_infinite_reverse]" />

        {/* Node: Florida */}
        <div className="absolute z-20" style={{ top: '52%', left: '28%' }}>
            <div className="relative w-3 h-3">
                <div className="w-3 h-3 bg-[#FF570F] rounded-full shadow-[0_0_12px_#FF570F]" />
                <div className="absolute inset-0 rounded-full bg-[#FF570F] animate-ping opacity-40" />
                <div className="absolute top-4 -left-5 text-[8px] text-[#FF570F] font-mono font-bold tracking-widest uppercase whitespace-nowrap">Florida</div>
            </div>
        </div>

        {/* Node: Rome */}
        <div className="absolute z-20" style={{ top: '38%', left: '62%' }}>
            <div className="relative w-2.5 h-2.5">
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30" style={{ animationDelay: '1.2s' }} />
                <div className="absolute top-4 -left-3 text-[8px] text-white/80 font-mono font-bold tracking-widest uppercase whitespace-nowrap">Rome</div>
            </div>
        </div>

        {/* Arc connecting FL → Rome */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 28,52 Q 45,20 62,38" fill="none" stroke="#FF570F" strokeWidth="0.6" strokeOpacity="0.6" strokeDasharray="2 3">
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
            </path>
            {/* Travelling dot on arc */}
            <circle r="0.8" fill="#FF570F" opacity="0.9">
                <animateMotion dur="3s" repeatCount="indefinite" path="M 28,52 Q 45,20 62,38" />
            </circle>
        </svg>
    </div>
);

const DataFlowVisual = () => (
    <div className="absolute inset-0 flex items-end justify-between p-6 gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
        {[40, 65, 45, 88, 55, 80, 70].map((height, i) => (
            <div key={i} className="relative flex-1 bg-white/5 rounded-t-sm overflow-hidden" style={{ height: '80%' }}>
                <div
                    className="absolute bottom-0 left-0 w-full rounded-t-sm"
                    style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, rgba(255,87,15,0.15), #FF570F)`,
                        animation: `pulseBar ${1.8 + i * 0.4}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.15}s`
                    }}
                />
                {/* Glow top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-[#FF570F] opacity-60" style={{ bottom: `${height}%`, top: 'auto' }} />
            </div>
        ))}
        <style>{`
            @keyframes pulseBar {
                0% { transform: scaleY(0.85); transform-origin: bottom; opacity: 0.8; }
                100% { transform: scaleY(1.05); transform-origin: bottom; opacity: 1; }
            }
        `}</style>
    </div>
);

const TechCoreVisual = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/8 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
            <div className="absolute inset-3 border-2 border-[#FF570F]/25 rounded-full animate-[spin_7s_linear_infinite_reverse]" style={{ borderTopColor: 'transparent' }} />
            <div className="absolute inset-7 border border-white/15 rounded-full animate-[spin_5s_linear_infinite]" style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }} />
            {/* Orbiting dot */}
            <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF570F] rounded-full shadow-[0_0_10px_#FF570F]" />
            </div>
            <div className="absolute w-2.5 h-2.5 bg-[#FF570F] rounded-full shadow-[0_0_20px_#FF570F] animate-pulse" />
        </div>
    </div>
);

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ value, label }) => {
    const [inView, setInView] = useState(false);
    const cardRef = useRef(null);
    const numRef = useRef(null);
    useMagneticEffect(cardRef, 0.25);
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (inView && numRef.current) {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: numericValue, duration: 2.5, ease: "power2.out",
                onUpdate: () => { if (numRef.current) numRef.current.innerText = Math.floor(obj.val) + suffix; }
            });
        }
    }, [inView, numericValue, suffix]);

    return (
        <GSAPTilt className="relative text-center p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#151a1d] to-[#0d1012] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-500 group overflow-hidden flex flex-col justify-center min-h-[110px]">
            <div ref={cardRef} className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            <div className="relative z-10">
                <div ref={numRef} className="text-xl md:text-2xl lg:text-3xl font-black mb-1 bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent whitespace-nowrap">
                    0{suffix}
                </div>
                <div className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest group-hover:text-orange-vibrant transition-colors mt-1">{label}</div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
        </GSAPTilt>
    );
};

const ValueCard = ({ value }) => (
    <GSAPTilt className="group relative p-8 rounded-3xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 bg-gradient-to-br from-[#151a1d] to-[#0d1012] transition-all duration-500 overflow-hidden h-full">
        <div className="absolute top-6 right-6 text-6xl font-black text-orange-vibrant/8 group-hover:text-orange-vibrant/15 transition-colors duration-500 select-none">{value.number}</div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
        <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-vibrant to-orange-soft flex items-center justify-center text-deep-black mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-vibrant/40">
                {value.icon}
            </div>
            <h4 className="text-xl font-heading font-bold text-pure-white mb-3 group-hover:text-orange-vibrant transition-colors duration-300">{value.title}</h4>
            <p className="text-text-muted leading-relaxed text-sm group-hover:text-pure-white/80 transition-colors duration-300">{value.desc}</p>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
    </GSAPTilt>
);

const TimelineItem = ({ item, index }) => {
    const itemRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(itemRef.current, {
                opacity: 0, y: 50, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: itemRef.current, start: 'top 82%', once: true },
            });
        }, itemRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={itemRef} className="relative">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
                <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:text-right' : 'lg:col-start-8'}`}>
                    <div className="inline-block transform lg:hover:scale-105 transition-transform duration-300">
                        <div className="px-7 py-3 bg-gradient-to-r from-orange-vibrant to-orange-soft rounded-xl shadow-2xl shadow-orange-vibrant/30">
                            <div className="text-2xl md:text-3xl font-black text-deep-black">{item.year}</div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-2 relative z-20">
                    <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-orange-vibrant border-4 border-deep-black shadow-2xl shadow-orange-vibrant/50 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                            <div className="w-3 h-3 rounded-full bg-deep-black animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:col-start-8' : ''}`}>
                    <GSAPTilt className="group p-6 rounded-2xl bg-gradient-to-br from-[#151a1d] to-[#0d1012] border-2 border-orange-vibrant/20 hover:border-orange-vibrant/60 transition-all duration-500 shadow-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="lg:hidden flex-shrink-0">
                                <div className="w-14 h-14 rounded-xl bg-orange-vibrant flex items-center justify-center shadow-lg"><span className="text-xs font-black text-deep-black">{item.year}</span></div>
                            </div>
                            <p className="text-pure-white/90 text-sm md:text-base leading-relaxed group-hover:text-orange-vibrant transition-colors duration-300">{item.event}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
                    </GSAPTilt>
                </div>
            </div>
        </div>
    );
};

// ─── IMPROVED CTA Button ───────────────────────────────────────────────────────
const CTAButton = ({ to, children, variant = 'primary' }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.3);
    const baseStyles = 'relative inline-flex items-center justify-center gap-3 px-10 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden group rounded-none';
    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:shadow-[0_0_40px_rgba(255,87,15,0.5)] shadow-lg shadow-orange-vibrant/30',
        secondary: 'border-2 border-orange-vibrant/50 text-pure-white hover:border-orange-vibrant hover:bg-orange-vibrant/10'
    };
    return (
        <Link ref={btnRef} to={to} className={`${baseStyles} ${variants[variant]}`}>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative z-10 flex items-center gap-3">
                {children}
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
        </Link>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AboutPage = () => {
    useSeoMeta(SEO.about);
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    useEffect(() => {
        if (headingRef.current && !textSplit) {
            const split = new SplitType(headingRef.current, { types: 'words' });
            setTextSplit(split);
            gsap.from(split.words, {
                opacity: 0, y: 40, rotationX: -35, transformOrigin: 'top center',
                stagger: 0.07, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 82%', once: true }
            });
        }
        return () => { if (textSplit) textSplit.revert(); };
    }, [textSplit]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.fade-up', {
                y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true }
            });
            gsap.to(prlx1Ref.current, { yPercent: 25, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            if (prlx2Ref.current) gsap.to(prlx2Ref.current, { yPercent: -25, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true } });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const valuesData = [
        {
            number: '01', title: 'No Bullshit Engineering',
            desc: 'We build what you need, not what sounds impressive in a pitch deck. Every technical decision is justified by measurable business outcomes.',
            icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        },
        {
            number: '02', title: 'Skin in the Game',
            desc: 'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.',
            icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            number: '03', title: 'Speed Without Shortcuts',
            desc: "We move fast because we've done this before — not because we skip tests, documentation, or proper architecture.",
            icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
        },
        {
            number: '04', title: 'Radical Transparency',
            desc: "You know exactly what we're building, why, and when it ships. No surprises. No excuses. No hidden costs.",
            icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        },
    ];

    const timelineData = [
        { year: '2015', event: 'First Amazon brand taken on retainer. Still running that account today — $2.7M+ in sales managed.' },
        { year: '2019', event: 'DDW formally founded as a Florida LLC. Expanded into Meta and Google Ads management for US and EU brands.' },
        { year: '2021', event: 'Rome office opened. EU client base grows — Meta spend hits $400K+/month under management.' },
        { year: '2023', event: 'AI development and custom software added as core retainer services. TikTok Shop launched for clients.' },
        { year: '2025', event: 'Seven retainer services active. $683K managed in a single month. Lyra and Sviluppiamo.dev live.' },
    ];

    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <PageHeader
                title="About DDW"
                breadcrumb="About"
                subtitle="Florida LLC. Offices in Florida and Rome. We manage $683K+/month in Meta spend, $2.7M+ in Amazon sales, and ship live SaaS products — all on retainer."
            />

            {/* ── Logo Marquee (NEW) ── */}
            {/* WHY: Placed right after header = instant platform credibility before user reads a word */}
            <LogoMarquee />

            {/* ── Story + Bento ── */}
            {/* CHANGE: py-20 md:py-32 → py-14 md:py-20 (saves ~64px per section) */}
            <section ref={sectionRef} className="relative py-14 md:py-20 bg-deep-black overflow-hidden isolate">
                {/* Aurora background — more atmospheric than static grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.025)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                {/* Aurora blobs */}
                <div ref={prlx1Ref} className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-vibrant/8 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-vibrant/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    {/* CHANGE: mb-32 → mb-16 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">
                        <div className="fade-up space-y-7 relative z-20">
                            <div>
                                <span className="inline-flex items-center gap-2 px-5 py-2 border border-orange-vibrant/35 bg-orange-vibrant/8 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-5 backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 bg-orange-vibrant rounded-full animate-pulse" /> Our Story
                                </span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-5 leading-tight">
                                    <span className="text-pure-white">Florida LLC.</span>
                                    <br />
                                    <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Two Offices.</span>
                                </h2>
                            </div>
                            <div className="space-y-4 text-base md:text-lg text-pure-white/65 leading-relaxed">
                                <p>Digital Dream Works is a Florida LLC with offices in Florida and Rome. We serve US and EU clients across digital marketing, AI, and custom software — all on retainer.</p>
                                <p>We manage $683K+ in Meta ad spend per month, $2.7M+ in Amazon sales, run Google Ads at 600% ROAS, and have shipped 3 live SaaS products including Lyra and Sviluppiamo.dev.</p>
                                <p>Our clients don't come to us for one-off projects. They come when the stakes are real — when they need a team that builds the infrastructure, runs the accounts, and stays accountable month over month.</p>
                                <p className="text-orange-vibrant font-bold">Retainer-only. One team. US + EU markets.</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-orange-vibrant/15">
                                <StatCard value="683K+" label="Meta $/month" />
                                <StatCard value="7" label="Service Areas" />
                                <StatCard value="2" label="Offices" />
                                <StatCard value="2015" label="Since" />
                            </div>
                        </div>

                        {/* Bento with IMPROVED globe */}
                        <div className="fade-up relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Globe card */}
                                <GSAPTilt className="col-span-2 relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#FF570F]/20 shadow-2xl group bg-[#080a0c]">
                                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                                    <GlobeVisual />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c] via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-5 left-5 z-30">
                                        <p className="text-[#FF570F] text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5">Global Infrastructure</p>
                                        <p className="text-white/70 text-xs">US & EU Endpoints Active</p>
                                    </div>
                                    {/* Live indicator */}
                                    <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[9px] text-green-400 font-mono uppercase tracking-widest">Live</span>
                                    </div>
                                </GSAPTilt>

                                {/* Data Flow */}
                                <GSAPTilt className="relative aspect-square rounded-2xl overflow-hidden border border-[#FF570F]/10 group bg-[#080a0c]">
                                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                                    <DataFlowVisual />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c]/90 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-4 left-4 z-30">
                                        <p className="text-[#FF570F] text-[9px] font-mono font-bold tracking-widest uppercase mb-0.5">Ad Spend</p>
                                        <p className="text-white/60 text-[11px]">$683K+/mo</p>
                                    </div>
                                </GSAPTilt>

                                {/* AI Core */}
                                <GSAPTilt className="relative aspect-square rounded-2xl overflow-hidden border border-[#FF570F]/10 group bg-[#080a0c]">
                                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                                    <TechCoreVisual />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c]/90 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-4 left-4 z-30">
                                        <p className="text-[#FF570F] text-[9px] font-mono font-bold tracking-widest uppercase mb-0.5">AI Logic</p>
                                        <p className="text-white/60 text-[11px]">Custom Arch</p>
                                    </div>
                                </GSAPTilt>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            {/* CHANGE: py-20 md:py-32 → py-14 md:py-20 */}
            <section className="relative py-14 md:py-20 bg-[#0d1012] overflow-hidden">
                <div ref={prlx2Ref} className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cream/4 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12 fade-up">
                        <span className="inline-flex items-center gap-2 px-5 py-2 border border-orange-vibrant/35 bg-orange-vibrant/8 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-5 backdrop-blur-sm">Our Principles</span>
                        <h3 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-3">
                            How We <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Operate</span>
                        </h3>
                        <p className="text-text-muted text-base max-w-xl mx-auto">Four non-negotiable principles that govern every project.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {valuesData.map((value, index) => <ValueCard key={index} value={value} />)}
                    </div>
                </div>
            </section>

            {/* ── Timeline ── */}
            {/* CHANGE: py-20 md:py-32 → py-14 md:py-20 */}
            <section className="relative py-14 md:py-20 bg-deep-black overflow-hidden">
                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16 fade-up">
                        <span className="inline-flex items-center gap-2 px-5 py-2 border border-orange-vibrant/35 bg-orange-vibrant/8 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-5 backdrop-blur-sm">Our Journey</span>
                        <h3 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-3">
                            The <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Timeline</span>
                        </h3>
                        <p className="text-text-muted text-base max-w-xl mx-auto">From frustrated engineers to trusted enterprise partner.</p>
                    </div>
                    <div className="relative">
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-orange-vibrant via-orange-soft to-transparent opacity-25" />
                        {/* CHANGE: space-y-20 → space-y-14 */}
                        <div className="space-y-14">
                            {timelineData.map((item, index) => <TimelineItem key={index} item={item} index={index} />)}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            {/* CHANGE: Tighter padding + improved visual impact */}
            <section className="relative py-14 md:py-24 bg-gradient-to-b from-deep-black to-[#0d1012] overflow-hidden">
                {/* Dramatic glow behind CTA */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[300px] bg-orange-vibrant/10 rounded-full blur-[80px]" />
                </div>
                {/* Subtle scan line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-vibrant/30 to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-px bg-orange-vibrant/40" />
                        <span className="text-orange-vibrant text-xs font-mono uppercase tracking-[0.3em]">Let's Work Together</span>
                        <div className="w-8 h-px bg-orange-vibrant/40" />
                    </div>

                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-5 leading-tight">
                        Ready to Build{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Something Real?</span>
                    </h3>
                    <p className="text-base md:text-lg text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                        Let's talk about your technical challenges and how we can solve them.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <CTAButton to="/contact" variant="primary">Start a Project</CTAButton>
                        <CTAButton to="/case-studies" variant="secondary">View Our Work</CTAButton>
                    </div>

                    {/* Social proof under CTA */}
                    <p className="mt-8 text-text-muted/50 text-xs font-mono uppercase tracking-widest">
                        Retainer-only · No lock-in contracts · US + EU
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default AboutPage;