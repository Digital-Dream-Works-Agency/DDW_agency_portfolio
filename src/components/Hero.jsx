// src/components/Hero.jsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Effect Hook ──────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.2) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power2.out" });
        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        return () => { element.removeEventListener('mousemove', handleMouseMove); element.removeEventListener('mouseleave', handleMouseLeave); };
    }, [strength]);
};

// ─── CTA Button ────────────────────────────────────────────────────────────────
const CTAButton = ({ href, children, variant = 'primary', onClick, external = false }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);
    const base = 'relative group px-8 py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-300 inline-flex items-center justify-center gap-2 overflow-hidden shadow-lg';
    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream',
        secondary: 'border-2 border-orange-vibrant/60 text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };
    const inner = (
        <>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
            <span className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500" />
        </>
    );
    if (external) return <a ref={btnRef} href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${variants[variant]}`}>{inner}</a>;
    return <button ref={btnRef} onClick={onClick} className={`${base} ${variants[variant]}`}>{inner}</button>;
};

// ─── Floating Metric Badge ─────────────────────────────────────────────────────
const FloatingMetricBadge = ({ satisfactionRef }) => {
    const badgeRef = useRef(null);
    useEffect(() => {
        gsap.to(badgeRef.current, { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
        gsap.to(badgeRef.current, { rotation: 3, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, []);
    return (
        <div ref={badgeRef} className="absolute bottom-8 -right-10 bg-gradient-to-br from-orange-vibrant to-orange-600 p-4 md:p-5 rounded-full z-40 shadow-2xl shadow-orange-vibrant/50 flex flex-col items-center justify-center text-deep-black border-4 border-deep-black group cursor-default">
            <div className="absolute inset-0 rounded-full border-2 border-orange-vibrant animate-ping opacity-20" />
            <span ref={satisfactionRef} className="text-xl md:text-2xl font-black mb-0.5">0%</span>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter text-center leading-tight">Client<br />Satisfaction</span>
            <div className="absolute inset-0 rounded-full bg-cream opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
        </div>
    );
};

// ─── Abstract Brand Visual (replaces stock images) ───────────────────────────
const AbstractBrandVisual = ({ circleRef, prlx3Ref, prlx4Ref, satisfactionRef }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Orb pulses
            gsap.to('.orb-1', { scale: 1.15, duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.orb-2', { scale: 0.88, duration: 5.5, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 });
            gsap.to('.orb-3', { scale: 1.1, duration: 3.5, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 0.5 });

            // Floating metric cards
            gsap.to('.metric-card-1', { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.metric-card-2', { y: 8, duration: 3.8, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 0.7 });

            // Data line animations
            gsap.fromTo('.data-line', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.5, stagger: 0.2, ease: 'power2.out', delay: 1.2 });

            // Bar chart pulse
            gsap.to('.bar-item', { scaleY: 1.08, duration: 1.2, stagger: 0.15, repeat: -1, yoyo: true, ease: 'power1.inOut', transformOrigin: 'bottom center' });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] mx-auto flex items-center justify-center">
            {/* Background orbs */}
            <div className="orb-1 absolute inset-0 rounded-full bg-gradient-to-br from-[#FF570F]/30 to-[#630D00]/20 blur-[60px]" />
            <div className="orb-2 absolute inset-[15%] rounded-full bg-gradient-to-tr from-[#EE7D1D]/40 to-[#FF570F]/10 blur-[40px]" />
            <div className="orb-3 absolute inset-[30%] rounded-full bg-gradient-to-br from-[#FDE87A]/30 to-[#FF570F]/40 blur-[30px]" />

            {/* Rotating rings */}
            <div ref={circleRef} className="absolute -inset-3 border border-dashed border-orange-vibrant/40 rounded-full z-10" />
            <div className="absolute inset-[6%] rounded-full border border-dotted border-cream/15" />

            {/* Accent dots */}
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/60" />
            <div className="absolute bottom-[14%] right-[18%] w-1.5 h-1.5 rounded-full bg-cream shadow-lg shadow-cream/50" />
            <div className="absolute left-[8%] top-[45%] w-1.5 h-1.5 rounded-full bg-orange-soft shadow-lg shadow-orange-soft/50" />

            {/* Center card — main visual */}
            <div className="relative z-20 w-36 h-36 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10 backdrop-blur-sm flex flex-col items-center justify-center p-4 gap-2">
                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-12 w-full px-2">
                    {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
                        <div key={i} className="bar-item flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? 'linear-gradient(to top, #FF570F, #FDE87A)' : 'rgba(255,87,15,0.3)' }} />
                    ))}
                </div>
                {/* Data lines */}
                <div className="w-full flex flex-col gap-1 px-1">
                    <div className="data-line h-px bg-gradient-to-r from-orange-vibrant/80 to-transparent" />
                    <div className="data-line h-px bg-gradient-to-r from-cream/40 to-transparent" />
                    <div className="data-line h-px bg-gradient-to-r from-orange-vibrant/50 to-transparent" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">600% ROAS</span>
            </div>

            {/* Floating metric card 1 — top right */}
            <div ref={prlx3Ref} className="metric-card-1 absolute -top-3 -right-3 px-3 py-2.5 rounded-xl bg-[#111]/90 border border-orange-vibrant/25 backdrop-blur-sm z-30 shadow-xl hidden md:flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                    <span className="text-[10px] font-bold text-orange-vibrant">$683K</span>
                </div>
                <span className="text-[9px] text-text-muted font-mono">Meta spend / mo</span>
            </div>

            {/* Floating metric card 2 — bottom left */}
            <div ref={prlx4Ref} className="metric-card-2 absolute -bottom-4 -left-8 px-3 py-2.5 rounded-xl bg-[#111]/90 border border-cream/20 backdrop-blur-sm z-30 shadow-xl hidden md:flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cream">$2.7M</span>
                </div>
                <span className="text-[9px] text-text-muted font-mono">Amazon · since 2015</span>
            </div>

            <FloatingMetricBadge satisfactionRef={satisfactionRef} />

            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent rounded-full blur-3xl scale-110" />
        </div>
    );
};

// ─── Main Hero ─────────────────────────────────────────────────────────────────
const Hero = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef(null);
    const circleRef = useRef(null);
    const satisfactionRef = useRef(null);
    const headlineRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const prlx3Ref = useRef(null);
    const prlx4Ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.set([textRef.current, imgRef.current], { autoAlpha: 0 });
        const ctx = gsap.context(() => {
            // Headline word-by-word split animation
            if (headlineRef.current) {
                const split = new SplitType(headlineRef.current, { types: 'words' });
                gsap.from(split.words, { opacity: 0, y: 40, duration: 0.9, stagger: 0.06, ease: 'power3.out', delay: 0.3 });
            }

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.to(textRef.current, { autoAlpha: 1, x: 0, duration: 1.2, delay: 0.2 }, 0)
              .to(imgRef.current, { autoAlpha: 1, x: 0, scale: 1, duration: 1.2 }, '-=0.9')
              .from('.hero-sub', { opacity: 0, y: 24, duration: 0.8 }, '-=0.5')
              .from('.hero-cta', { opacity: 0, y: 20, stagger: 0.12, duration: 0.7 }, '-=0.4')
              .from('.hero-trust', { opacity: 0, duration: 0.6 }, '-=0.3');

            // Rotating dashed ring
            gsap.to(circleRef.current, { rotation: 360, duration: 25, repeat: -1, ease: 'none' });

            // Client satisfaction counter
            const obj = { value: 0 };
            gsap.to(obj, {
                value: 100, duration: 2.5, delay: 1.5, ease: 'power2.out',
                onUpdate: () => { if (satisfactionRef.current) satisfactionRef.current.innerText = Math.floor(obj.value) + '%'; }
            });

            // Parallax layers
            gsap.to(prlx1Ref.current, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(prlx2Ref.current, { yPercent: 30, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(prlx3Ref.current, { yPercent: 15, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });
            gsap.to(prlx4Ref.current, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: sectionRef.current, scrub: true } });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleViewWork = () => {
        navigate('/projects');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    return (
        // Fix: Changed 'overflow-hidden' to 'overflow-x-hidden' and reduced top/bottom padding
        <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center pt-20 pb-8 px-6 overflow-x-hidden bg-deep-black">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.025)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />

            {/* Parallax ambient blobs */}
            <div ref={prlx1Ref} className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/8 blur-[140px] rounded-full -z-10 animate-pulse" />
            <div ref={prlx2Ref} className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#630D00]/15 blur-[100px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">

                {/* ── Left: Text ── */}
                <div ref={textRef} className="flex-1 text-center lg:text-left max-w-2xl">
                    {/* Trust badge - Fix: mb-8 to mb-5 */}
                    <div className="hero-trust inline-flex items-center gap-2 px-4 py-2 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em]">Florida LLC &middot; Florida &amp; Rome &middot; Retainer-only</span>
                    </div>

                    {/* Headline - Fix: Adjusted text sizes slightly to save vertical space, mb-6 to mb-4 */}
                    <h1 ref={headlineRef} className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-heading font-black leading-[1.05] mb-4 text-pure-white">
                        Most agencies show you case studies.{' '}
                        {/* Fix: Replaced gradient text with solid theme color to fix SplitType issue */}
                        <span className="text-[#FF570F]">We show you the accounts.</span>
                    </h1>

                    {/* Sub-copy - Fix: mb-3 to mb-2 */}
                    <p className="hero-sub text-pure-white/65 text-base md:text-lg leading-relaxed mb-2 max-w-xl mx-auto lg:mx-0">
                        $683K in Meta spend managed last month. $2.7M in Amazon sales on a retainer running since 2015. 600% ROAS on Google. Every number is live &mdash; dashboard screenshots available on the first call.
                    </p>
                    {/* Fix: mb-8 to mb-5 */}
                    <p className="hero-sub text-pure-white/45 text-sm leading-relaxed mb-5 max-w-xl mx-auto lg:mx-0">
                        If you&rsquo;re spending $50K+ a month and the returns don&rsquo;t match, the channel isn&rsquo;t the problem. Who owns the account is.
                    </p>

                    {/* CTAs - Fix: mb-3 to mb-2 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-2">
                        <div className="hero-cta">
                            <CTAButton href="https://calendly.com/digi-dreamworks/onboarding-call" variant="primary" external>See If We&rsquo;re a Fit</CTAButton>
                        </div>
                        <div className="hero-cta">
                            <CTAButton onClick={handleViewWork} variant="secondary">See the Numbers</CTAButton>
                        </div>
                    </div>

                    {/* Fix: mb-6 to mb-4 */}
                    <p className="hero-cta text-text-muted text-xs text-center lg:text-left mb-4">
                        20 minutes. No deck. If we&rsquo;re not the right fit, we&rsquo;ll tell you on the call.
                    </p>

                    {/* Trust signals */}
                    <div className="hero-trust flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start">
                        {['Meta · Google · Amazon · TikTok · SEO', 'US & EU clients', 'Active since 2015'].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-orange-vibrant flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                <span className="text-text-muted text-xs font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: Abstract Visual ── */}
                <div ref={imgRef} className="flex-1 flex items-center justify-center">
                    <AbstractBrandVisual
                        circleRef={circleRef}
                        prlx3Ref={prlx3Ref}
                        prlx4Ref={prlx4Ref}
                        satisfactionRef={satisfactionRef}
                    />
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-orange-vibrant to-transparent" />
            </div>
        </section>
    );
};

export default Hero;