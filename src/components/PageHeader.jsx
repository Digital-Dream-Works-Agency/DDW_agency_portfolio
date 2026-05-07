import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Aurora Background ────────────────────────────────────────────────────────
const AuroraBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary aurora blobs */}
        <div className="aurora-blob absolute w-[900px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
            style={{
                background: 'radial-gradient(ellipse, #FF570F 0%, transparent 70%)',
                top: '-200px', right: '-100px',
                animation: 'aurora1 12s ease-in-out infinite alternate',
            }} />
        <div className="aurora-blob absolute w-[700px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
            style={{
                background: 'radial-gradient(ellipse, #FDE87A 0%, transparent 70%)',
                top: '100px', left: '-200px',
                animation: 'aurora2 16s ease-in-out infinite alternate',
            }} />
        <div className="aurora-blob absolute w-[500px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
            style={{
                background: 'radial-gradient(ellipse, #FF8C42 0%, transparent 70%)',
                bottom: '-100px', right: '30%',
                animation: 'aurora3 10s ease-in-out infinite alternate',
            }} />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '128px',
            }} />

        {/* Fine dot grid */}
        <div className="absolute inset-0 opacity-[0.035]"
            style={{
                backgroundImage: 'radial-gradient(circle, #FF570F 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

        <style>{`
            @keyframes aurora1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-80px, 60px) scale(1.15); } }
            @keyframes aurora2 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px, -40px) scale(1.1); } }
            @keyframes aurora3 { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px, 30px) scale(1.2); } }
        `}</style>
    </div>
);

// ─── GSAP Tilt ──────────────────────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.6 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.6 });
        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            xTo(x * 6); yTo(-y * 6);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);
    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1200 }}>{children}</div>;
};

// ─── Metric Card (Glassmorphism) ────────────────────────────────────────────────
const MetricCard = ({ metric, label, sublabel, icon, accentColor, delay, floatY, floatDuration, style }) => {
    const cardRef = useRef(null);
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        gsap.fromTo(el, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: delay || 0 });
        gsap.to(el, { y: floatY || -12, duration: floatDuration || 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, [delay, floatY, floatDuration]);

    return (
        <div ref={cardRef} className="absolute group/card cursor-default" style={{ opacity: 0, ...style }}>
            <div className="relative rounded-2xl p-[1px] min-w-[165px]"
                style={{ background: `linear-gradient(135deg, ${accentColor}40, transparent 60%, ${accentColor}15)` }}>
                <div className="relative rounded-2xl p-4 overflow-hidden"
                    style={{
                        background: 'rgba(10, 12, 14, 0.75)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 16px 48px ${accentColor}12`,
                    }}>
                    {/* Shimmer top line */}
                    <div className="absolute top-0 left-0 w-full h-[1px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
                    {/* Live dot */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                    </div>
                    <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25`, boxShadow: `0 0 12px ${accentColor}20` }}>
                            {icon}
                        </div>
                        <div>
                            <div className="text-xl font-black leading-none tracking-tight" style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading, inherit)' }}>
                                {metric}
                            </div>
                            <div className="text-[11px] font-bold mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</div>
                            {sublabel && <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{sublabel}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Orbit Visual (Upgraded) ────────────────────────────────────────────────────
const OrbitVisual = () => {
    const ring1Ref = useRef(null);
    const ring2Ref = useRef(null);
    const ring3Ref = useRef(null);
    const coreRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        if (!ring1Ref.current) return;
        gsap.to(ring1Ref.current, { rotation: 360, duration: 20, ease: 'none', repeat: -1, transformOrigin: 'center' });
        gsap.to(ring2Ref.current, { rotation: -360, duration: 30, ease: 'none', repeat: -1, transformOrigin: 'center' });
        gsap.to(ring3Ref.current, { rotation: 360, duration: 45, ease: 'none', repeat: -1, transformOrigin: 'center' });
        gsap.to(coreRef.current, { scale: 1.08, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(glowRef.current, { opacity: 0.8, scale: 1.3, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, []);

    const services = [
        { name: 'Meta', color: '#0080FF' },
        { name: 'Google', color: '#34A853' },
        { name: 'Amazon', color: '#FF9900' },
        { name: 'TikTok', color: '#FF2D55' },
        { name: 'SEO', color: '#FDE87A' },
        { name: 'AI', color: '#FF570F' },
    ];

    return (
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
            {/* Deep glow */}
            <div ref={glowRef} className="absolute w-40 h-40 rounded-full opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(255,87,15,0.4) 0%, transparent 70%)', filter: 'blur(30px)' }} />

            {/* Ring 1 — outer */}
            <div ref={ring1Ref} className="absolute w-full h-full">
                <svg width="320" height="320" viewBox="0 0 320 320">
                    <circle cx="160" cy="160" r="148" fill="none" stroke="rgba(255,87,15,0.15)" strokeWidth="0.8" strokeDasharray="4 12" />
                    {/* Bright node */}
                    <circle cx="160" cy="12" r="4.5" fill="#FF570F" />
                    <circle cx="160" cy="12" r="10" fill="none" stroke="#FF570F" strokeWidth="0.5" opacity="0.3" />
                </svg>
            </div>

            {/* Ring 2 — mid */}
            <div ref={ring2Ref} className="absolute" style={{ width: '230px', height: '230px' }}>
                <svg width="230" height="230" viewBox="0 0 230 230">
                    <circle cx="115" cy="115" r="103" fill="none" stroke="rgba(253,232,122,0.10)" strokeWidth="0.8" strokeDasharray="2 10" />
                    <circle cx="218" cy="115" r="3.5" fill="#FDE87A" />
                    <circle cx="12" cy="115" r="2.5" fill="#FDE87A" opacity="0.5" />
                </svg>
            </div>

            {/* Ring 3 — inner */}
            <div ref={ring3Ref} className="absolute" style={{ width: '160px', height: '160px' }}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,87,15,0.08)" strokeWidth="0.6" />
                    <circle cx="80" cy="12" r="3" fill="#FF570F" opacity="0.6" />
                </svg>
            </div>

            {/* Service labels */}
            {services.map((service, i) => {
                const angle = (i * 60 * Math.PI) / 180 - Math.PI / 2;
                const r = 148;
                const x = 160 + r * Math.cos(angle);
                const y = 160 + r * Math.sin(angle);
                return (
                    <div key={service.name}
                        className="absolute text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                        style={{
                            left: x,
                            top: y,
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(10,12,14,0.85)',
                            border: `1px solid ${service.color}30`,
                            color: service.color,
                            backdropFilter: 'blur(8px)',
                            whiteSpace: 'nowrap',
                            boxShadow: `0 0 12px ${service.color}20`,
                        }}>
                        {service.name}
                    </div>
                );
            })}

            {/* Core */}
            <div ref={coreRef} className="relative z-10 w-[88px] h-[88px] rounded-full flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #1a1f23 0%, #0a0c0e 100%)',
                    border: '1.5px solid rgba(255,87,15,0.45)',
                    boxShadow: '0 0 50px rgba(255,87,15,0.3), 0 0 100px rgba(255,87,15,0.1), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}>
                <div className="text-center">
                    <div className="font-black text-xl leading-none" style={{ color: '#FF570F', fontFamily: 'var(--font-heading, inherit)', letterSpacing: '-0.02em' }}>DDW</div>
                    <div className="text-[7px] uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Agency</div>
                </div>
            </div>
        </div>
    );
};

// ─── Magnetic CTA Button ────────────────────────────────────────────────────────
const MagneticCTA = ({ children, href, secondary }) => {
    const btnRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;
        const xTo = gsap.quickTo(btn, "x", { ease: "power3.out", duration: 0.6 });
        const yTo = gsap.quickTo(btn, "y", { ease: "power3.out", duration: 0.6 });
        const handleMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            xTo((e.clientX - cx) * 0.35);
            yTo((e.clientY - cy) * 0.35);
        };
        const handleLeave = () => { xTo(0); yTo(0); };
        btn.addEventListener('mousemove', handleMove);
        btn.addEventListener('mouseleave', handleLeave);
        return () => { btn.removeEventListener('mousemove', handleMove); btn.removeEventListener('mouseleave', handleLeave); };
    }, []);

    if (secondary) {
        return (
            <Link to={href || '#'}>
                <div ref={btnRef} className="relative inline-flex items-center gap-2.5 px-7 py-4 rounded-full cursor-pointer group"
                    style={{ border: '1px solid rgba(255,87,15,0.3)', background: 'transparent', color: 'rgba(255,255,255,0.7)' }}>
                    <span ref={textRef} className="text-sm font-bold tracking-wide group-hover:text-white transition-colors">
                        {children}
                    </span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
            </Link>
        );
    }

    return (
        <Link to={href || '#'}>
            <div ref={btnRef} className="relative inline-flex items-center gap-2.5 px-7 py-4 rounded-full cursor-pointer group overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FF570F, #FF8C42)', boxShadow: '0 0 30px rgba(255,87,15,0.35), 0 4px 20px rgba(255,87,15,0.2)' }}>
                {/* Shine sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }} />
                <span ref={textRef} className="relative text-sm font-black tracking-wide text-white">
                    {children}
                </span>
                <svg className="w-4 h-4 text-white relative transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
        </Link>
    );
};

// ─── Stats Row ──────────────────────────────────────────────────────────────────
const StatsRow = () => {
    const stats = [
        { value: '$4.2M+', label: 'Ad Spend Managed' },
        { value: '600%', label: 'Peak Google ROAS' },
        { value: '54K', label: 'SEO Visitors/mo' },
        { value: '9+', label: 'Years in Market' },
    ];
    return (
        <div className="header-anim flex flex-wrap gap-x-8 gap-y-4 mt-12">
            {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                    <span className="text-2xl font-black leading-none tracking-tight"
                        style={{
                            fontFamily: 'var(--font-heading, inherit)',
                            background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>{s.value}</span>
                    <span className="text-[11px] font-medium uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Page Header ────────────────────────────────────────────────────────────────
const PageHeader = ({ title, breadcrumb, subtitle }) => {
    const headerRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const cardPrlxRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-anim',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );
            gsap.fromTo('.header-title-word',
                { y: 100, opacity: 0, rotationX: -50 },
                { y: 0, opacity: 1, rotationX: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out', delay: 0.25, transformOrigin: 'top center' }
            );

            // Parallax
            gsap.to(prlx1Ref.current, { yPercent: 25, ease: 'none', scrollTrigger: { trigger: headerRef.current, scrub: 1 } });
            gsap.to(prlx2Ref.current, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: headerRef.current, scrub: 1 } });
            gsap.to(cardPrlxRef.current, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: headerRef.current, scrub: 1 } });
        }, headerRef);

        return () => ctx.revert();
    }, [title]);

    const words = title.split(' ');

    return (
        <>
            <section ref={headerRef}
                className="relative w-full flex flex-col justify-center overflow-hidden"
                style={{
                    minHeight: '100vh',
                    background: '#08090A',
                    fontFamily: 'var(--font-body, inherit)',
                }}>

                <AuroraBackground />

                {/* Watermark text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <span style={{
                        fontSize: 'clamp(80px, 20vw, 220px)',
                        fontFamily: 'var(--font-heading, inherit)',
                        fontWeight: 900,
                        color: 'rgba(255,255,255,0.012)',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.05em',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                    }}>
                        {breadcrumb}
                    </span>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ minHeight: 'calc(100vh - 160px)' }}>

                        {/* ── LEFT ── */}
                        <div className="flex flex-col justify-center">

                            {/* Breadcrumb */}
                            <div className="header-anim flex items-center gap-3 mb-8">
                                <Link to="/" className="text-xs font-semibold uppercase tracking-[0.25em] transition-colors duration-300"
                                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body, inherit)' }}
                                    onMouseEnter={e => e.target.style.color = '#FF570F'}
                                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                                    Home
                                </Link>
                                <svg className="w-3 h-3" style={{ color: '#FF570F' }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                                <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: '#FF570F' }}>{breadcrumb}</span>
                            </div>

                            {/* Title */}
                            <h1 className="overflow-hidden mb-6"
                                style={{
                                    fontSize: 'clamp(48px, 6vw, 88px)',
                                    fontFamily: 'var(--font-heading, inherit)',
                                    fontWeight: 900,
                                    lineHeight: 1.0,
                                    letterSpacing: '-0.03em',
                                    perspective: '1000px',
                                }}>
                                {words.map((word, i) => {
                                    const isLast = i === words.length - 1;
                                    return (
                                        <span key={i} className="header-title-word inline-block mr-4"
                                            style={isLast ? {
                                                background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 60%, #FF8C42 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            } : { color: '#FFFFFF' }}>
                                            {word}
                                        </span>
                                    );
                                })}
                            </h1>

                            {/* Subtitle */}
                            {subtitle && (
                                <p className="header-anim text-base leading-relaxed max-w-md"
                                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body, inherit)', fontWeight: 300, lineHeight: 1.7 }}>
                                    {subtitle}
                                </p>
                            )}

                            {/* CTA Buttons */}
                            <div className="header-anim flex flex-wrap items-center gap-4 mt-10">
                                <MagneticCTA href="/contact">Book a Free Audit</MagneticCTA>
                                <MagneticCTA href="/work" secondary>View Case Studies</MagneticCTA>
                            </div>

                            {/* Stats */}
                            <StatsRow />

                            {/* Accent lines */}
                            <div className="header-anim flex items-center gap-3 mt-10">
                                <div className="w-16 h-[2px] rounded-full" style={{ background: '#FF570F' }} />
                                <div className="w-4 h-[2px] rounded-full" style={{ background: 'rgba(255,87,15,0.35)' }} />
                                <div className="w-2 h-[2px] rounded-full" style={{ background: 'rgba(255,87,15,0.15)' }} />
                            </div>
                        </div>

                        {/* ── RIGHT ── */}
                        <div className="header-anim hidden lg:flex items-center justify-center">
                            <div ref={cardPrlxRef} className="relative"
                                style={{ width: '500px', height: '500px', transform: 'scale(0.92)' }}>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <OrbitVisual />
                                </div>

                                {/* Metric Cards — improved positioning with no overflow */}
                                <MetricCard metric="5.48x" label="Meta ROAS" sublabel="$683K managed/mo" icon="📱"
                                    accentColor="#FF570F" delay={0.5} floatY={-10} floatDuration={3.2}
                                    style={{ top: '18px', left: '0px' }} />

                                <MetricCard metric="600%" label="Google ROAS" sublabel="€69.7K → €418K" icon="🔍"
                                    accentColor="#FDE87A" delay={0.75} floatY={-14} floatDuration={2.8}
                                    style={{ top: '10px', right: '0px' }} />

                                <MetricCard metric="$2.7M" label="Amazon Sales" sublabel="27.64% ACOS · 2015" icon="📦"
                                    accentColor="#FF570F" delay={1.0} floatY={-8} floatDuration={3.8}
                                    style={{ top: '50%', left: '0px', transform: 'translateY(-50%)' }} />

                                <MetricCard metric="$290K" label="TikTok GMV" sublabel="7 days · 9,010 orders" icon="🎵"
                                    accentColor="#FDE87A" delay={1.2} floatY={-16} floatDuration={3.4}
                                    style={{ top: '50%', right: '0px', transform: 'translateY(-50%)' }} />

                                <MetricCard metric="54K" label="Monthly Visitors" sublabel="SEO · 2K → 54K" icon="📈"
                                    accentColor="#FF570F" delay={1.4} floatY={-10} floatDuration={4.0}
                                    style={{ bottom: '18px', left: '10px' }} />

                                <MetricCard metric="24/7" label="AI Voice (Lyra)" sublabel="Zero missed calls" icon="🤖"
                                    accentColor="#FDE87A" delay={1.6} floatY={-12} floatDuration={3.0}
                                    style={{ bottom: '10px', right: '0px' }} />

                                {/* Florida badge */}
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap"
                                    style={{
                                        background: 'rgba(10,12,14,0.8)',
                                        border: '1px solid rgba(255,87,15,0.2)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                    }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" style={{ backgroundColor: '#FF570F' }} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                        Florida LLC · US + EU Markets
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="header-anim absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.25)' }}>Scroll</span>
                        <div className="w-px h-10 rounded-full overflow-hidden" style={{ background: 'rgba(255,87,15,0.15)' }}>
                            <div className="w-full bg-gradient-to-b from-orange-500 to-transparent rounded-full"
                                style={{
                                    height: '40%',
                                    backgroundColor: '#FF570F',
                                    animation: 'scrollDrop 1.8s ease-in-out infinite',
                                }} />
                        </div>
                    </div>
                </div>

                <style>{`
                    .perspective-1000 { perspective: 1000px; }
                    @keyframes scrollDrop {
                        0% { transform: translateY(-100%); opacity: 0; }
                        30% { opacity: 1; }
                        100% { transform: translateY(300%); opacity: 0; }
                    }
                `}</style>
            </section>
        </>
    );
};

export default PageHeader;