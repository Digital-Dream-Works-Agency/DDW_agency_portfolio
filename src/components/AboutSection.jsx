import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Abstract Team Visual (No Images) ──────────────────────────────────────────
const AbstractTeamVisual = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.at-orb-1', { scale: 1.18, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.at-orb-2', { scale: 0.82, duration: 7, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 2 });
            gsap.to('.at-ring-a', { rotation: 360, duration: 25, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
            gsap.to('.at-ring-b', { rotation: -360, duration: 18, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
            gsap.to('.at-dot-1', { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.at-dot-2', { y: 6, duration: 3.2, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
            <div className="at-orb-1 absolute inset-0 rounded-full bg-gradient-to-br from-[#FF570F]/20 to-[#630D00]/15 blur-[70px]" />
            <div className="at-orb-2 absolute inset-[20%] rounded-full bg-gradient-to-tr from-[#FDE87A]/18 to-[#EE7D1D]/12 blur-[45px]" />
            <div className="at-ring-a absolute inset-[5%] rounded-full border border-dashed border-orange-vibrant/25" />
            <div className="at-ring-b absolute inset-[20%] rounded-full border border-dotted border-cream/15" />
            
            {/* Dot nodes */}
            <div className="at-dot-1 absolute top-[10%] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/60" />
            <div className="absolute top-[35%] right-[8%] w-1.5 h-1.5 rounded-full bg-orange-soft opacity-70" />
            <div className="at-dot-2 absolute bottom-[12%] left-[20%] w-2 h-2 rounded-full bg-cream/70 shadow-md" />
            <div className="absolute bottom-[30%] right-[15%] w-1 h-1 rounded-full bg-orange-vibrant/60" />
            
            {/* Core Box */}
            <div className="relative z-10 w-32 h-32 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="mb-2">
                    <rect x="3" y="3" width="13" height="13" rx="2" stroke="#FF570F" strokeWidth="1.4" />
                    <rect x="20" y="3" width="13" height="13" rx="2" stroke="#EE7D1D" strokeWidth="1.4" />
                    <rect x="3" y="20" width="13" height="13" rx="2" stroke="#EE7D1D" strokeWidth="1.4" />
                    <rect x="20" y="20" width="13" height="13" rx="2" stroke="#FDE87A" strokeWidth="1.4" />
                    <circle cx="18" cy="18" r="2.5" fill="#FF570F" />
                </svg>
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted">DDW</span>
            </div>
            
            {/* Floating badges */}
            <div className="absolute top-[5%] left-[-8%] px-4 py-2 rounded-xl bg-[#111]/90 border border-orange-vibrant/25 backdrop-blur-sm shadow-lg hidden md:block">
                <span className="text-[10px] font-bold text-orange-vibrant uppercase tracking-widest">7 Core Services</span>
            </div>
            <div className="absolute bottom-[10%] right-[-6%] px-4 py-2 rounded-xl bg-[#111]/90 border border-cream/20 backdrop-blur-sm shadow-lg hidden md:block">
                <span className="text-[10px] font-bold text-cream uppercase tracking-widest">100% Retainer</span>
            </div>
        </div>
    );
};

// ─── Custom GSAP Counter ───────────────────────────────────────────────────────
const GSAPCounter = ({ end, suffix = '', duration = 2.5, start = false }) => {
    const valRef = useRef(null);
    useEffect(() => {
        if (!start || !valRef.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: end, duration, ease: 'power2.out',
            onUpdate: () => { if (valRef.current) valRef.current.innerText = Math.round(obj.val) + suffix; }
        });
    }, [end, start, suffix, duration]);
    return <span ref={valRef}>0{suffix}</span>;
};

// ─── GSAP Tilt Component ───────────────────────────────────────────────────────
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
            xTo(x * 10); 
            yTo(-y * 10); 
        };

        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Magnetic Button Component ─────────────────────────────────────────────────
const MagneticButton = ({ to, children, variant = 'primary', className = '' }) => {
    const btnRef = useRef(null);

    useEffect(() => {
        const el = btnRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * 0.25);
            yTo((e.clientY - rect.top - rect.height / 2) * 0.25);
        };
        const onLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, []);

    const baseStyles = 'relative px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-500 overflow-hidden group inline-block';
    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream border-2 border-orange-vibrant',
        secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };

    return (
        <Link ref={btnRef} to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500 bg-orange-vibrant/20 rounded-full blur-xl" />
            <span className="relative z-10 flex items-center gap-2 justify-center">
                {children}
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
        </Link>
    );
};

// ─── Animated Counter Card ─────────────────────────────────────────────────────
const StatCard = ({ stat, counterStart }) => {
    return (
        <GSAPTilt className="relative p-6 rounded-2xl border-2 border-orange-vibrant/20 bg-gradient-to-br from-deep-black via-deep-black to-orange-vibrant/5 hover:border-orange-vibrant/60 transition-all duration-500 overflow-hidden group h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-vibrant/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 text-center">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent mb-2">
                    <GSAPCounter start={counterStart} end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-pure-white font-bold uppercase tracking-widest mb-2 group-hover:text-orange-vibrant transition-colors duration-300">
                    {stat.label}
                </div>
                <div className="text-xs text-text-muted">
                    {stat.sub}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FF570F] to-[#FDE87A] w-0 group-hover:w-full transition-all duration-700" />
        </GSAPTilt>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AboutSection = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const parallax1Ref = useRef(null);
    const parallax2Ref = useRef(null);
    const [counterStart, setCounterStart] = useState(false);

    const statsData = [
        { end: 7, suffix: '', label: 'Core retainer services', sub: 'One team across all seven' },
        { end: 100, suffix: '%', label: 'Retainer engagements', sub: 'No one-off projects, ever' },
        { end: 2, suffix: '', label: 'Global markets', sub: 'US and EU operations' },
        { end: 24, suffix: 'hr', label: 'Response SLA', sub: 'For all active retainers' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading SplitText Animation
            if (headingRef.current) {
                const split = new SplitType(headingRef.current, { types: 'words' });
                gsap.from(split.words, {
                    y: 50, opacity: 0, rotationX: -90, stagger: 0.05, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
                });
            }

            // Content Reveal
            gsap.from('.about-content', {
                y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            });

            // Trigger Counters
            ScrollTrigger.create({
                trigger: '.about-stats-grid',
                start: 'top 85%',
                once: true,
                onEnter: () => setCounterStart(true),
            });

            // Native GSAP Parallax Backgrounds
            gsap.to(parallax1Ref.current, { yPercent: 40, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(parallax2Ref.current, { yPercent: -40, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true } });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="relative py-28 px-6 bg-deep-black border-y border-orange-vibrant/10 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            {/* GSAP Parallax Glows */}
            <div ref={parallax1Ref} className="absolute top-0 left-0 w-[500px] h-[400px] bg-orange-vibrant/5 blur-[130px] rounded-full pointer-events-none" />
            <div ref={parallax2Ref} className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-cream/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24">
                    
                    {/* LEFT: Abstract Visual Section */}
                    <div className="lg:col-span-5 about-content">
                        <GSAPTilt>
                            <AbstractTeamVisual />
                        </GSAPTilt>
                    </div>

                    {/* RIGHT: Content Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="about-content inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                            <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Who we are</span>
                        </div>

                        <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white leading-[1.1] perspective-1000">
                            Built by engineers.<br />
                            <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Not marketers.</span>
                        </h2>

                        <p className="about-content text-pure-white/70 text-base md:text-lg leading-relaxed max-w-xl">
                            Digital Dream Works is a cross-functional team operating from Florida and Rome. We build and maintain software systems and marketing infrastructure for US and EU clients on an ongoing retainer basis.
                        </p>
                        
                        <p className="about-content text-pure-white/50 text-sm leading-relaxed max-w-xl">
                            Every engagement is a retainer. The team that scopes the work is the team that maintains it. No handing off to juniors. No re-onboarding every six months.
                        </p>

                        <div className="about-content flex flex-wrap gap-3 pt-2">
                            {['Florida, USA', 'Rome, Italy', 'Retainer-only', 'US + EU clients'].map((pill) => (
                                <div key={pill} className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-vibrant/20 bg-orange-vibrant/5 hover:border-orange-vibrant/50 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
                                    <span className="text-pure-white/80 text-xs font-bold tracking-wider">{pill}</span>
                                </div>
                            ))}
                        </div>

                        <div className="about-content pt-6">
                            <MagneticButton to="/about" variant="primary">Read Our Story</MagneticButton>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="about-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, i) => (
                        <div key={i} className="h-full about-content">
                            <StatCard stat={stat} counterStart={counterStart} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;