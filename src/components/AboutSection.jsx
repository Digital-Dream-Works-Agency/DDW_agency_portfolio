import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Custom GSAP Counter ───────────────────────────────────────────────────────
const GSAPCounter = ({ end, prefix = '', suffix = '', duration = 2.5, start = false, decimals = 0 }) => {
    const valRef = useRef(null);

    useEffect(() => {
        if (!start || !valRef.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: end,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
                if (valRef.current) {
                    valRef.current.innerText = prefix + (obj.val).toFixed(decimals) + suffix;
                }
            }
        });
    }, [end, start, prefix, suffix, duration, decimals]);

    return <span ref={valRef}>{prefix}0{suffix}</span>;
};

// ─── Custom GSAP Tilt Component ────────────────────────────────────────────────
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
            xTo(x * 15); // tilt angle
            yTo(-y * 15); 
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>
            {children}
        </div>
    );
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

    const baseStyles = 'relative px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-500 overflow-hidden group';
    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream border-2 border-orange-vibrant',
        secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };

    return (
        <Link ref={btnRef} to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500 bg-orange-vibrant/20 rounded-full blur-xl" />
            <span className="relative z-10 flex items-center gap-2">
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

            <div className="relative z-10">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent mb-2">
                    <GSAPCounter 
                        start={counterStart} 
                        end={stat.value} 
                        prefix={stat.prefix} 
                        suffix={stat.suffix} 
                        decimals={stat.value % 1 !== 0 ? 1 : 0} 
                    />
                </div>
                <div className="text-xs text-text-muted uppercase tracking-widest group-hover:text-orange-vibrant transition-colors duration-300">
                    {stat.label}
                </div>
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                    {stat.icon}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FF570F] to-[#FDE87A] w-0 group-hover:w-full transition-all duration-700" />
        </GSAPTilt>
    );
};

// ─── Floating Badge Component ──────────────────────────────────────────────────
const FloatingBadge = ({ value, label, position = 'top-left', startCounter }) => {
    const badgeRef = useRef(null);

    useEffect(() => {
        gsap.to(badgeRef.current, {
            y: -10, duration: 2, repeat: -1, yoyo: true, ease: 'power1.inOut',
        });
    }, []);

    const positions = {
        'top-left': '-top-6 -left-6',
        'bottom-right': '-bottom-6 -right-6',
    };

    return (
        <div ref={badgeRef} className={`absolute ${positions[position]} bg-gradient-to-br from-orange-vibrant to-orange-600 rounded-2xl p-6 shadow-2xl shadow-orange-vibrant/50 z-10 border-2 border-orange-vibrant/30`}>
            <div className="text-5xl font-black text-deep-black mb-1">
                {typeof value === 'number' ? <GSAPCounter start={startCounter} end={value} suffix="+" /> : value}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-deep-black/80 leading-tight">
                {label.split(' ').map((word, i) => <div key={i}>{word}</div>)}
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-orange-vibrant animate-ping opacity-20" />
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AboutSection = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const imageWrapperRef = useRef(null);
    const parallax1Ref = useRef(null);
    const parallax2Ref = useRef(null);
    const [counterStart, setCounterStart] = useState(false);

    // Replaced Emojis with Premium SVGs
    const stats = [
        { value: 50, prefix: '$', suffix: 'M+', label: 'Revenue Generated', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { value: 600, suffix: '%', label: 'Peak ROAS', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
        { value: 99.9, suffix: '%', label: 'System Uptime', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg> },
        { value: 24, suffix: 'hr', label: 'Response Time', icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading Reveal
            gsap.from(".heading-word", {
                y: 50, opacity: 0, rotationX: -90, stagger: 0.1, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 80%' }
            });

            // Image Reveal
            gsap.from(imageWrapperRef.current, {
                scale: 0.8, opacity: 0, duration: 1.5, ease: 'power3.out',
                scrollTrigger: {
                    trigger: imageWrapperRef.current, start: 'top 80%',
                    onEnter: () => setCounterStart(true)
                }
            });

            // Content Reveal
            gsap.from('.about-content', {
                y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
            });

            // Native GSAP Parallax Backgrounds
            gsap.to(parallax1Ref.current, { yPercent: 40, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(parallax2Ref.current, { yPercent: -40, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true } });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="relative py-24 md:py-32 bg-deep-black overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            {/* GSAP Parallax Glows */}
            <div ref={parallax1Ref} className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-vibrant/10 rounded-full blur-[200px] pointer-events-none" />
            <div ref={parallax2Ref} className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cream/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    {/* LEFT: Image Section */}
                    <div className="lg:col-span-5" ref={imageWrapperRef}>
                        <div className="relative w-full max-w-md mx-auto lg:mx-0">
                            
                            <GSAPTilt className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-orange-vibrant/30 shadow-2xl shadow-orange-vibrant/20 group">
                                <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="DDW Agency Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </GSAPTilt>

                            <FloatingBadge value="10+" label="Years Experience" position="top-left" />
                            <FloatingBadge value={150} startCounter={counterStart} label="Projects Delivered" position="bottom-right" />
                            
                            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent rounded-3xl blur-2xl transform scale-105" />
                        </div>
                    </div>

                    {/* RIGHT: Content Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <span className="about-content inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full backdrop-blur-sm">
                            Who We Are
                        </span>

                        <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black text-pure-white leading-[1.1] perspective-1000">
                            <span className="heading-word inline-block mr-3">Built</span>
                            <span className="heading-word inline-block mr-3">By</span>
                            <span className="heading-word inline-block">Engineers.</span>
                            <br />
                            <span className="heading-word inline-block mr-3 bg-gradient-to-r from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Not</span>
                            <span className="heading-word inline-block bg-gradient-to-r from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Marketers.</span>
                        </h2>

                        <p className="about-content text-base md:text-lg lg:text-xl text-pure-white/70 leading-relaxed max-w-2xl">
                            Every system we build is architected for <span className="text-orange-vibrant font-semibold">real business constraints</span>. No templates. No shortcuts. Only <span className="text-cream font-semibold">performance-driven engineering</span>.
                        </p>

                        <div className="about-content grid grid-cols-2 gap-4 pt-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="h-full">
                                    <StatCard stat={stat} counterStart={counterStart} />
                                </div>
                            ))}
                        </div>

                        <div className="about-content flex flex-col sm:flex-row gap-4 pt-8">
                            <MagneticButton to="/about" variant="primary">Learn Our Story</MagneticButton>
                            <MagneticButton to="/contact" variant="secondary">Work With Us</MagneticButton>
                        </div>

                        {/* Replaced Emojis with Premium SVGs */}
                        <div className="about-content flex flex-wrap gap-6 pt-6 border-t border-orange-vibrant/20">
                            {[
                                { 
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 4h12M6 4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2m12-6c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2" /></svg>, 
                                    text: 'Award Winning' 
                                }, 
                                { 
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, 
                                    text: 'Enterprise Security' 
                                }, 
                                { 
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, 
                                    text: 'Lightning Fast' 
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-text-muted group">
                                    <span className="group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                                    <span className="text-xs uppercase tracking-wider group-hover:text-orange-vibrant transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;