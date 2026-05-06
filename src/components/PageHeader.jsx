import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Native GSAP Tilt Component ────────────────────────────────────────────────
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
            xTo(x * 8);
            yTo(-y * 8);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={tiltRef} className={className} style={{ transformPerspective: 1200 }}>
            {children}
        </div>
    );
};

// ─── Floating Metric Card ────────────────────────────────────────────────────────
const MetricCard = ({ metric, label, sublabel, icon, accentColor, delay, floatY, floatDuration, style }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        gsap.fromTo(el,
            { opacity: 0, y: 40, scale: 0.85 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.5)', delay: delay || 0 }
        );

        gsap.to(el, {
            y: floatY || -12,
            duration: floatDuration || 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    }, [delay, floatY, floatDuration]);

    return (
        <div ref={cardRef} className="absolute group/card cursor-default" style={{ opacity: 0, ...style }}>
            <div className="relative bg-gradient-to-br from-[#1a1f23] to-[#0f1315] border border-orange-vibrant/20 rounded-2xl p-4 shadow-2xl backdrop-blur-sm hover:border-orange-vibrant/50 transition-all duration-300 hover:shadow-orange-vibrant/20 hover:shadow-xl min-w-[170px]"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-70" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
                <div className="absolute top-3 right-3">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                </div>
                <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                        style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-xl font-black leading-none text-pure-white tracking-tight" style={{ fontFamily: 'var(--font-heading, inherit)' }}>
                            {metric}
                        </div>
                        <div className="text-[11px] font-bold text-pure-white/60 mt-1 uppercase tracking-wide">{label}</div>
                        {sublabel && <div className="text-[10px] text-pure-white/35 mt-0.5">{sublabel}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Central Orbit Visual ────────────────────────────────────────────────────────
const OrbitVisual = () => {
    const containerRef = useRef(null);
    const ring1Ref = useRef(null);
    const ring2Ref = useRef(null);
    const ring3Ref = useRef(null);
    const pulseRef = useRef(null);

    useEffect(() => {
        if (!ring1Ref.current) return;
        gsap.to(ring1Ref.current, { rotation: 360, duration: 18, ease: 'none', repeat: -1, transformOrigin: 'center center' });
        gsap.to(ring2Ref.current, { rotation: -360, duration: 26, ease: 'none', repeat: -1, transformOrigin: 'center center' });
        gsap.to(ring3Ref.current, { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: 'center center' });
        gsap.to(pulseRef.current, { scale: 1.15, opacity: 0.5, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, []);

    const services = ['Meta', 'Google', 'Amazon', 'TikTok', 'SEO', 'AI'];
    const serviceAngles = [0, 60, 120, 180, 240, 300];

    return (
        <div ref={containerRef} className="relative w-[340px] h-[340px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-orange-vibrant/5 blur-3xl" />

            <div ref={ring1Ref} className="absolute w-full h-full">
                <svg width="340" height="340" viewBox="0 0 340 340">
                    <circle cx="170" cy="170" r="148" fill="none" stroke="rgba(255,87,15,0.12)" strokeWidth="1" strokeDasharray="6 10" />
                    <circle cx="170" cy="22" r="5" fill="#FF570F" opacity="0.8" />
                    <circle cx="170" cy="22" r="8" fill="none" stroke="#FF570F" strokeWidth="0.5" opacity="0.4" />
                </svg>
            </div>

            <div ref={ring2Ref} className="absolute" style={{ width: '240px', height: '240px' }}>
                <svg width="240" height="240" viewBox="0 0 240 240">
                    <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(253,232,122,0.08)" strokeWidth="1" strokeDasharray="3 8" />
                    <circle cx="228" cy="120" r="3.5" fill="#FDE87A" opacity="0.7" />
                </svg>
            </div>

            <div ref={ring3Ref} className="absolute" style={{ width: '180px', height: '180px' }}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(255,87,15,0.06)" strokeWidth="0.8" />
                    <circle cx="90" cy="12" r="3" fill="#FF570F" opacity="0.5" />
                </svg>
            </div>

            {services.map((service, i) => {
                const angle = (serviceAngles[i] * Math.PI) / 180 - Math.PI / 2;
                const radius = 148;
                const x = 170 + radius * Math.cos(angle);
                const y = 170 + radius * Math.sin(angle);
                return (
                    <div key={service} className="absolute text-[9px] font-black uppercase tracking-widest text-orange-vibrant/60 bg-[#0f1315] border border-orange-vibrant/15 px-2 py-1 rounded-full"
                        style={{ left: x - 20, top: y - 10, transform: 'translate(-50%, -50%)', whiteSpace: 'nowrap' }}>
                        {service}
                    </div>
                );
            })}

            <div className="relative z-10 flex flex-col items-center justify-center">
                <div ref={pulseRef} className="absolute w-24 h-24 rounded-full bg-orange-vibrant/15 blur-xl" />
                <div className="relative w-20 h-20 rounded-full border-2 border-orange-vibrant/40 bg-gradient-to-br from-[#1a1f23] to-[#0a0c0e] flex items-center justify-center shadow-2xl"
                    style={{ boxShadow: '0 0 40px rgba(255,87,15,0.25), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <div className="text-center">
                        <div className="text-orange-vibrant font-black text-xl leading-none">DDW</div>
                        <div className="text-pure-white/30 text-[8px] uppercase tracking-widest mt-0.5">Agency</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Page Header ────────────────────────────────────────────────────────────────
const PageHeader = ({ title, breadcrumb, subtitle }) => {
    const headerRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const cardPrlxRef = useRef(null);
    const circleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-anim',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo('.header-title-word',
                { y: 80, opacity: 0, rotationX: -40 },
                { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3, transformOrigin: 'top center' }
            );
            if (circleRef.current) {
                gsap.to(circleRef.current, { rotation: 360, duration: 20, repeat: -1, ease: 'none' });
            }
            gsap.to(prlx1Ref.current, { yPercent: 20, ease: 'none', scrollTrigger: { trigger: headerRef.current, scrub: true } });
            gsap.to(prlx2Ref.current, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: headerRef.current, scrub: true } });
            gsap.to(cardPrlxRef.current, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: headerRef.current, scrub: true } });
        }, headerRef);

        return () => ctx.revert();
    }, [title]);

    const words = title.split(' ');

    return (
        <section ref={headerRef} className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-deep-black">

            <div ref={prlx1Ref} className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-vibrant/6 blur-[160px] rounded-full pointer-events-none" />
            <div ref={prlx2Ref} className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/3 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#FF570F 1px, transparent 1px), linear-gradient(90deg, #FF570F 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-[22vw] font-black text-white/[0.018] uppercase tracking-tighter select-none whitespace-nowrap">
                    {breadcrumb}
                </span>
            </div>

            {/* ── ONLY CHANGE: pt-36 → pt-24 ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">

                    {/* LEFT */}
                    <div>
                        <div className="header-anim flex items-center gap-3 mb-10">
                            <Link to="/" className="text-xs font-bold uppercase tracking-[0.25em] text-text-muted hover:text-orange-vibrant transition-colors duration-300">Home</Link>
                            <svg className="w-3 h-3 text-orange-vibrant" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-vibrant">{breadcrumb}</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-black leading-[1.0] mb-6 tracking-tight perspective-1000 overflow-hidden">
                            {words.map((word, i) => {
                                const isLast = i === words.length - 1;
                                return (
                                    <span key={i} className="header-title-word inline-block mr-4"
                                        style={isLast ? {
                                            background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        } : { color: '#FFFFFF' }}>
                                        {word}
                                    </span>
                                );
                            })}
                        </h1>

                        {subtitle && <p className="header-anim text-lg text-text-muted leading-relaxed max-w-lg mt-4">{subtitle}</p>}

                        <div className="header-anim flex items-center gap-4 mt-10">
                            <div className="w-16 h-1 bg-orange-vibrant rounded-full" />
                            <div className="w-4 h-1 bg-orange-vibrant/40 rounded-full" />
                            <div className="w-2 h-1 bg-orange-vibrant/20 rounded-full" />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="header-anim hidden lg:flex items-center justify-end">
                        <div ref={cardPrlxRef} className="relative w-[480px] h-[480px]">

                            <div className="absolute inset-0 flex items-center justify-center">
                                <OrbitVisual />
                            </div>

                            <MetricCard metric="5.48x" label="Meta ROAS" sublabel="$683K managed / mo" icon="📱"
                                accentColor="#FF570F" delay={0.5} floatY={-10} floatDuration={3.2}
                                style={{ top: '30px', left: '-30px' }} />

                            <MetricCard metric="600%" label="Google ROAS" sublabel="€418K on €69.7K spend" icon="🔍"
                                accentColor="#FDE87A" delay={0.75} floatY={-14} floatDuration={2.8}
                                style={{ top: '20px', right: '-20px' }} />

                            <MetricCard metric="$2.7M" label="Amazon Sales" sublabel="27.64% ACOS · since 2015" icon="📦"
                                accentColor="#FF570F" delay={1.0} floatY={-8} floatDuration={3.8}
                                style={{ top: '50%', left: '-55px', transform: 'translateY(-50%)' }} />

                            <MetricCard metric="$290K" label="TikTok GMV" sublabel="7 days · 9,010 orders" icon="🎵"
                                accentColor="#FDE87A" delay={1.2} floatY={-16} floatDuration={3.4}
                                style={{ top: '50%', right: '-50px', transform: 'translateY(-50%)' }} />

                            <MetricCard metric="54K" label="Monthly Visitors" sublabel="SEO · 2K → 54K growth" icon="📈"
                                accentColor="#FF570F" delay={1.4} floatY={-10} floatDuration={4.0}
                                style={{ bottom: '30px', left: '-20px' }} />

                            <MetricCard metric="24/7" label="AI Voice AI (Lyra)" sublabel="Calls answered · Zero missed" icon="🤖"
                                accentColor="#FDE87A" delay={1.6} floatY={-12} floatDuration={3.0}
                                style={{ bottom: '20px', right: '-35px' }} />

                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0f1315] border border-orange-vibrant/20 rounded-full px-4 py-2 shadow-lg whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-pure-white/50">Florida LLC · US + EU Markets</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-[0.3em]">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-orange-vibrant to-transparent" />
                </div>
            </div>

            <style>{`.perspective-1000 { perspective: 1000px; }`}</style>
        </section>
    );
};

export default PageHeader;