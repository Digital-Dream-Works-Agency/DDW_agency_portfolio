// src/components/Collaborate.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

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
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Magnetic Hook ─────────────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: 'power2.out' });

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Magnetic Button ───────────────────────────────────────────────────────────
const MagneticButton = ({ href, children }) => {
    const ref = useRef(null);
    useMagneticEffect(ref, 0.25);
    
    return (
        <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group inline-flex items-center gap-3 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-widest px-12 py-6 overflow-hidden shadow-2xl shadow-orange-vibrant/40 hover:shadow-cream/30 transition-shadow duration-500"
        >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-3">
                {children}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </a>
    );
};

// ─── Floating Stat Pill ────────────────────────────────────────────────────────
const StatPill = ({ value, label, delay }) => {
    const pillRef = useRef(null);
    useEffect(() => {
        gsap.to(pillRef.current, {
            y: -10, duration: 2 + delay, repeat: -1, yoyo: true, ease: 'sine.inOut', delay,
        });
    }, [delay]);

    return (
        <div ref={pillRef} className="absolute bg-deep-black/80 backdrop-blur-md border border-orange-vibrant/30 rounded-2xl px-5 py-3 shadow-2xl shadow-orange-vibrant/10">
            <div className="text-xl font-black text-orange-vibrant">{value}</div>
            <div className="text-xs text-pure-white/50 uppercase tracking-wider">{label}</div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Collaborate = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const badgeRef = useRef(null);
    const ctaRef = useRef(null);
    const prlxBgRef = useRef(null);
    const prlxGlowRef = useRef(null);

    // ── SplitType text reveal ──
    useEffect(() => {
        if (!headingRef.current) return;
        const split = new SplitType(headingRef.current, { types: 'words' });
        
        gsap.from(split.words, {
            opacity: 0, y: 60, rotationX: -40, transformOrigin: 'top center', stagger: 0.08, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        });

        return () => split.revert();
    }, []);

    // ── Other animations ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(badgeRef.current, { opacity: 0, x: -40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }});
            gsap.from(ctaRef.current, { opacity: 0, y: 30, scale: 0.95, duration: 0.8, delay: 0.5, ease: 'back.out(1.7)', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }});
            gsap.from('.collab-stat', { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.7, ease: 'back.out(1.5)', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }});
            
            // Background image scale
            gsap.fromTo('.collab-bg-img', { scale: 1.15 }, { scale: 1, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }});

            // Native GSAP Parallax
            gsap.to(prlxBgRef.current, { yPercent: 20, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlxGlowRef.current, { yPercent: -30, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-32 w-full overflow-hidden bg-deep-black border-y border-orange-vibrant/20">
            
            {/* ── Background Image with Native Parallax ── */}
            <div ref={prlxBgRef} className="absolute inset-0 z-0">
                <div className="absolute inset-0">
                    <img src="https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg" alt="Collaboration" className="collab-bg-img w-full h-full object-cover object-right" />
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/92 to-deep-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 via-transparent to-transparent" />
                </div>
            </div>

            {/* ── Animated grid overlay ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,87,15,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'linear-gradient(to right, black 40%, transparent 100%)' }} />

            {/* ── Background glow blobs ── */}
            <div ref={prlxGlowRef} className="absolute top-0 left-0 w-96 h-96 bg-orange-vibrant/8 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── LEFT: Main Content ── */}
                    <div>
                        <div ref={badgeRef} className="inline-flex items-center gap-3 px-6 py-3 border border-orange-vibrant/40 mb-10 backdrop-blur-sm bg-orange-vibrant/8 shadow-lg shadow-orange-vibrant/15">
                            <span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse shadow-lg shadow-orange-vibrant/80" />
                            <span className="text-orange-vibrant text-xs font-bold tracking-[0.3em] uppercase">Let's Collaborate</span>
                            <span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse shadow-lg shadow-orange-vibrant/80" />
                        </div>

                        <h2 ref={headingRef} className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.05] mb-6 tracking-tight text-pure-white perspective-1000">
                            Ready to <br />
                        </h2>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.05] mb-12 tracking-tight" style={{ background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }}>
                            work with us?
                        </h2>

                        <p className="text-pure-white/60 text-lg leading-relaxed mb-10 max-w-md">
                            From strategy to execution — we build systems that drive measurable growth. One call is all it takes.
                        </p>

                        <div ref={ctaRef}>
                            <MagneticButton href="https://calendly.com/digi-dreamworks/onboarding-call">
                                Book a Strategy Call
                            </MagneticButton>
                        </div>
                    </div>

                    {/* ── RIGHT: 3D Tilt Card + Floating Stats ── */}
                    <div className="hidden lg:block relative h-80">
                        <GSAPTilt className="absolute inset-0">
                            <div className="w-full h-full rounded-3xl border border-orange-vibrant/15 backdrop-blur-sm flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,87,15,0.05) 0%, rgba(10,10,10,0.8) 100%)' }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/5 to-transparent rounded-3xl" />
                                <div className="text-center relative z-10">
                                    <div className="text-6xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                        100%
                                    </div>
                                    <div className="text-pure-white/40 text-xs uppercase tracking-widest">Client Satisfaction</div>
                                </div>
                            </div>
                        </GSAPTilt>

                        <div className="collab-stat absolute -top-6 -left-6 z-20"><StatPill value="600%" label="Peak ROAS" delay={0} /></div>
                        <div className="collab-stat absolute -bottom-6 -right-6 z-20"><StatPill value="418K" label="Purchases" delay={0.4} /></div>
                        <div className="collab-stat absolute top-1/2 -right-10 z-20"><StatPill value="$0.09" label="CPC Achieved" delay={0.8} /></div>
                    </div>
                </div>
            </div>

            <style jsx>{`.perspective-1000 { perspective: 1000px; }`}</style>
        </section>
    );
};

export default Collaborate;