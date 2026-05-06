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

// ─── Custom Hooks & Components ────────────────────────────────────────────────
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

const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            xTo(x * 8); // Adjusted for smoother professional feel
            yTo(-y * 8); 
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Modern Tech Visual Components ─────────────────────────────────────────────

const GlobalRadarVisual = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Radar Rings */}
        <div className="absolute w-[120%] h-[120%] border border-[#FF570F]/5 rounded-full" />
        <div className="absolute w-[80%] h-[80%] border border-[#FF570F]/10 rounded-full" />
        <div className="absolute w-[40%] h-[40%] border border-[#FF570F]/20 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
        
        {/* Sweeping Line */}
        <div className="absolute top-1/2 left-1/2 w-[50%] h-0.5 bg-gradient-to-r from-transparent to-[#FF570F]/40 origin-left animate-[spin_4s_linear_infinite]" />
        
        {/* Connection Arch */}
        <svg className="absolute inset-0 w-full h-full z-10 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 30,60 Q 50,20 70,40" fill="none" stroke="#FF570F" strokeWidth="0.5" strokeDasharray="2 2" className="animate-[dash_20s_linear_infinite]" />
        </svg>

        {/* Node 1: Florida */}
        <div className="absolute top-[60%] left-[30%] w-2.5 h-2.5 bg-[#FF570F] rounded-full shadow-[0_0_10px_#FF570F] z-20">
            <div className="absolute inset-0 rounded-full bg-[#FF570F] animate-ping opacity-50" />
            <span className="absolute top-4 -left-4 text-[9px] text-[#FF570F] font-mono font-bold tracking-widest uppercase">FL_USA</span>
        </div>

        {/* Node 2: Rome */}
        <div className="absolute top-[40%] left-[70%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-20">
            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-50" style={{ animationDelay: '1s' }} />
            <span className="absolute top-4 -left-4 text-[9px] text-white font-mono font-bold tracking-widest uppercase">RM_ITA</span>
        </div>
    </div>
);

const DataFlowVisual = () => (
    <div className="absolute inset-0 flex items-end justify-between p-8 gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
        {[40, 70, 45, 90, 60, 85].map((height, i) => (
            <div key={i} className="relative w-full bg-white/5 rounded-t-sm overflow-hidden" style={{ height: '100%' }}>
                <div 
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FF570F]/20 to-[#FF570F]" 
                    style={{ 
                        height: `${height}%`, 
                        animation: `pulseHeight ${2 + i * 0.5}s ease-in-out infinite alternate` 
                    }} 
                />
            </div>
        ))}
        <style>{`
            @keyframes pulseHeight {
                0% { transform: scaleY(0.8); transform-origin: bottom; }
                100% { transform: scaleY(1.1); transform-origin: bottom; }
            }
        `}</style>
    </div>
);

const TechCoreVisual = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_8s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
            <div className="absolute inset-2 border-2 border-[#FF570F]/20 rounded-full animate-[spin_6s_linear_infinite_reverse]" style={{ borderTopColor: 'transparent' }} />
            <div className="absolute inset-6 border border-white/20 rounded-full animate-[spin_4s_linear_infinite]" style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }} />
            <div className="absolute w-2 h-2 bg-[#FF570F] rounded-full shadow-[0_0_15px_#FF570F] animate-pulse" />
        </div>
    </div>
);

// ─── Stat Card Component ───────────────────────────────────────────────────────
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
                val: numericValue,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => { if (numRef.current) numRef.current.innerText = Math.floor(obj.val) + suffix; }
            });
        }
    }, [inView, numericValue, suffix]);

    return (
        <GSAPTilt className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-[#151a1d] to-[#0d1012] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-500 group overflow-hidden">
            <div ref={cardRef} className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            <div className="relative z-10">
                <div ref={numRef} className="text-4xl font-black mb-2 bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">
                    0{suffix}
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest group-hover:text-orange-vibrant transition-colors">
                    {label}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
        </GSAPTilt>
    );
};

const ValueCard = ({ value }) => {
    return (
        <GSAPTilt className="group relative p-10 rounded-3xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 bg-gradient-to-br from-[#151a1d] to-[#0d1012] transition-all duration-500 overflow-hidden h-full">
            <div className="absolute top-8 right-8 text-7xl font-black text-orange-vibrant/10 group-hover:text-orange-vibrant/20 transition-colors duration-500">{value.number}</div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-vibrant/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-vibrant to-orange-soft flex items-center justify-center text-deep-black mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-vibrant/50">{value.icon}</div>
                <h4 className="text-2xl font-heading font-bold text-pure-white mb-4 group-hover:text-orange-vibrant transition-colors duration-300">{value.title}</h4>
                <p className="text-text-muted leading-relaxed group-hover:text-pure-white/80 transition-colors duration-300">{value.desc}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
        </GSAPTilt>
    );
};

const TimelineItem = ({ item, index }) => {
    const itemRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(itemRef.current, {
                opacity: 0, y: 60, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: itemRef.current, start: 'top 80%', once: true },
            });
        }, itemRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={itemRef} className="relative">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
                <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:text-right' : 'lg:col-start-8'}`}>
                    <div className="inline-block transform lg:hover:scale-105 transition-transform duration-300">
                        <div className="px-8 py-4 bg-gradient-to-r from-orange-vibrant to-orange-soft rounded-2xl shadow-2xl shadow-orange-vibrant/40">
                            <div className="text-3xl md:text-4xl font-black text-deep-black">{item.year}</div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-2 relative z-20">
                    <div className="flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-orange-vibrant border-4 border-deep-black shadow-2xl shadow-orange-vibrant/60 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                            <div className="w-4 h-4 rounded-full bg-deep-black animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:col-start-8' : ''}`}>
                    <GSAPTilt className="group p-8 rounded-2xl bg-gradient-to-br from-[#151a1d] to-[#0d1012] border-2 border-orange-vibrant/20 hover:border-orange-vibrant/60 transition-all duration-500 shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="lg:hidden flex-shrink-0">
                                <div className="w-16 h-16 rounded-xl bg-orange-vibrant flex items-center justify-center shadow-lg"><span className="text-sm font-black text-deep-black">{item.year}</span></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-pure-white/90 text-base md:text-lg leading-relaxed group-hover:text-orange-vibrant transition-colors duration-300">{item.event}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
                    </GSAPTilt>
                </div>
            </div>
        </div>
    );
};

const CTAButton = ({ to, children, variant = 'primary' }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);
    const baseStyles = 'relative inline-flex items-center justify-center gap-3 px-10 py-5 font-bold text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden group';
    const variants = { primary: 'bg-orange-vibrant text-deep-black hover:bg-cream shadow-lg shadow-orange-vibrant/30', secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black' };

    return (
        <Link ref={btnRef} to={to} className={`${baseStyles} ${variants[variant]}`}>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative z-10 flex items-center gap-3">
                {children}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
        </Link>
    );
};

const AboutPage = () => {
    useSeoMeta(SEO.about);
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const prlx3Ref = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    useEffect(() => {
        if (headingRef.current && !textSplit) {
            const split = new SplitType(headingRef.current, { types: 'words' });
            setTextSplit(split);
            gsap.from(split.words, { opacity: 0, y: 50, rotationX: -45, transformOrigin: 'top center', stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: headingRef.current, start: 'top 80%', once: true } });
        }
        return () => { if (textSplit) textSplit.revert(); };
    }, [textSplit]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.fade-up', { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
            
            // Native Parallax Backgrounds
            gsap.to(prlx1Ref.current, { yPercent: 30, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            if(prlx2Ref.current) gsap.to(prlx2Ref.current, { yPercent: -30, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            if(prlx3Ref.current) gsap.to(prlx3Ref.current, { yPercent: 20, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const valuesData = [
        { number: '01', title: 'No Bullshit Engineering', desc: 'We build what you need, not what sounds impressive in a pitch deck. Every technical decision is justified by measurable business outcomes.', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
        { number: '02', title: 'Skin in the Game', desc: 'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { number: '03', title: 'Speed Without Shortcuts', desc: "We move fast because we've done this before — not because we skip tests, documentation, or proper architecture.", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
        { number: '04', title: 'Radical Transparency', desc: "You know exactly what we're building, why, and when it ships. No surprises. No excuses. No hidden costs.", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></path></svg> },
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
            <PageHeader title="About DDW" breadcrumb="About" subtitle="Florida LLC. Offices in Florida and Rome. We manage $683K+/month in Meta spend, $2.7M+ in Amazon sales, and ship live SaaS products — all on retainer." />

            <section ref={sectionRef} className="relative py-20 md:py-32 bg-deep-black overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                <div ref={prlx1Ref} className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-vibrant/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                        <div className="fade-up space-y-8">
                            <div>
                                <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                                    <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" /> Our Story
                                </span>
                                <h2 ref={headingRef} className="about-main-heading text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight perspective-[1000px]">
                                    Florida LLC.{' '}
                                    <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Two Offices.</span>
                                </h2>
                            </div>
                            <div className="space-y-6 text-base md:text-lg text-pure-white/70 leading-relaxed">
                                <p>Digital Dream Works is a Florida LLC with offices in Florida and Rome. We serve US and EU clients across digital marketing, AI, and custom software — all on retainer.</p>
                                <p>We manage $683K+ in Meta ad spend per month, $2.7M+ in Amazon sales, run Google Ads at 600% ROAS, and have shipped 3 live SaaS products including Lyra and Sviluppiamo.dev.</p>
                                <p>Our clients don't come to us for one-off projects. They come when the stakes are real — when they need a team that builds the infrastructure, runs the accounts, and stays accountable month over month.</p>
                                <p className="text-orange-vibrant font-bold text-lg">Retainer-only. One team. US + EU markets.</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t-2 border-orange-vibrant/20">
                                <StatCard value="683K+" label="Meta $/month" />
                                <StatCard value="7" label="Service Areas" />
                                <StatCard value="2" label="Offices" />
                                <StatCard value="2015" label="Since" />
                            </div>
                        </div>

                        {/* ─── REPLACED THE EMPTY BOXES WITH HIGH-TECH BENTO GRID ─── */}
                        <div className="fade-up">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Top Wide Box: Global Reach */}
                                <GSAPTilt className="col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden border-2 border-[#FF570F]/20 shadow-2xl group bg-gradient-to-br from-[#0a0c0e] to-[#111418]">
                                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                    <GlobalRadarVisual />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0e] via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 left-6 z-30">
                                        <p className="text-[#FF570F] text-xs font-mono font-bold tracking-widest uppercase mb-1">Global Infrastructure</p>
                                        <p className="text-white text-sm">US & EU Endpoints Active</p>
                                    </div>
                                </GSAPTilt>
                                
                                {/* Bottom Left Box: Data Metrics */}
                                <GSAPTilt className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#FF570F]/10 group bg-gradient-to-br from-[#0a0c0e] to-[#111418]">
                                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                    <DataFlowVisual />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0e]/80 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 left-6 z-30">
                                        <p className="text-[#FF570F] text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Data Flow</p>
                                        <p className="text-white/80 text-xs">$2.7M+ Processed</p>
                                    </div>
                                </GSAPTilt>
                                
                                {/* Bottom Right Box: AI Core */}
                                <GSAPTilt className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#FF570F]/10 group bg-gradient-to-br from-[#0a0c0e] to-[#111418]">
                                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                    <TechCoreVisual />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0e]/80 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 left-6 z-30">
                                        <p className="text-[#FF570F] text-[10px] font-mono font-bold tracking-widest uppercase mb-1">AI Logic</p>
                                        <p className="text-white/80 text-xs">Custom Architecture</p>
                                    </div>
                                </GSAPTilt>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative py-20 md:py-32 bg-[#0d1012] overflow-hidden">
                <div ref={prlx2Ref} className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cream/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 fade-up">
                        <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">Our Principles</span>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-4">How We <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Operate</span></h3>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">Four non-negotiable principles that govern every project.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {valuesData.map((value, index) => <ValueCard key={index} value={value} />)}
                    </div>
                </div>
            </section>

            <section className="relative py-20 md:py-32 bg-deep-black overflow-hidden">
                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20 fade-up">
                        <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">Our Journey</span>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-4">The <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Timeline</span></h3>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">From frustrated engineers to trusted enterprise partner.</p>
                    </div>
                    <div className="relative">
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange-vibrant via-orange-soft to-transparent opacity-30" />
                        <div className="space-y-20">
                            {timelineData.map((item, index) => <TimelineItem key={index} item={item} index={index} />)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-gradient-to-b from-deep-black to-[#0d1012]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight">Ready to Build <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Something Real?</span></h3>
                    <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">Let's talk about your technical challenges and how we can solve them.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <CTAButton to="/contact" variant="primary">Start a Project</CTAButton>
                        <CTAButton to="/case-studies" variant="secondary">View Our Work</CTAButton>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default AboutPage;