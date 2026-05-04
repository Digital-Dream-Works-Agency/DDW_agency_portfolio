import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
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
            xTo(x * 15);
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

// ─── Advanced CTA Button Component ─────────────────────────────────────────────
const CTAButton = ({ href, children, variant = 'primary', onClick, external = false }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);

    const baseStyles = 'relative group px-8 py-3 font-bold text-xs uppercase tracking-wider transition-all duration-300 inline-flex items-center justify-center gap-2 overflow-hidden shadow-lg';
    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream',
        secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };

    const ButtonContent = (
        <>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
            <span className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500" />
        </>
    );

    if (external) return <a ref={btnRef} href={href} target="_blank" rel="noopener noreferrer" className={`${baseStyles} ${variants[variant]}`}>{ButtonContent}</a>;
    return <button ref={btnRef} onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>{ButtonContent}</button>;
};

// ─── Floating Badge Component ──────────────────────────────────────────────────
const FloatingBadge = ({ satisfactionRef }) => {
    const badgeRef = useRef(null);

    useEffect(() => {
        gsap.to(badgeRef.current, { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
        gsap.to(badgeRef.current, { rotation: 5, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, []);

    return (
        <div ref={badgeRef} className="absolute bottom-8 -right-10 bg-gradient-to-br from-orange-vibrant to-orange-600 p-4 md:p-5 rounded-full z-40 shadow-2xl shadow-orange-vibrant/50 flex flex-col items-center justify-center text-deep-black border-4 border-deep-black group cursor-default">
            <div className="absolute inset-0 rounded-full border-2 border-orange-vibrant animate-ping opacity-20" />
            <span ref={satisfactionRef} className="text-xl md:text-2xl font-black mb-0.5">0%</span>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter text-center leading-tight">Client<br/>Satisfaction</span>
            <div className="absolute inset-0 rounded-full bg-cream opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
        </div>
    );
};

// ─── Main Hero Component ───────────────────────────────────────────────────────
const Hero = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef(null);
    const circleRef = useRef(null);
    const satisfactionRef = useRef(null);
    const gradientTextRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const prlx3Ref = useRef(null);
    const prlx4Ref = useRef(null);
    const navigate = useNavigate();

    // Container Animations & Counter
    useEffect(() => {
        gsap.set('.gsap-reveal', { autoAlpha: 0 });
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.to(textRef.current, { autoAlpha: 1, x: 0, duration: 1.2, delay: 0.2 }, 0)
              .to(imgRef.current, { autoAlpha: 1, x: 0, scale: 1, duration: 1.2 }, '-=0.9')
              .from('.hero-description', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
              .from('.hero-cta', { opacity: 0, y: 20, stagger: 0.15, duration: 0.7 }, '-=0.4');

            gsap.to(circleRef.current, { rotation: 360, duration: 25, repeat: -1, ease: 'none' });

            const obj = { value: 0 };
            gsap.to(obj, {
                value: 100, duration: 2.5, delay: 1.5, ease: 'power2.out',
                onUpdate: () => { if (satisfactionRef.current) satisfactionRef.current.innerText = Math.floor(obj.value) + '%'; }
            });

            // Native GSAP Parallax
            gsap.to(prlx1Ref.current, { yPercent: -40, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlx2Ref.current, { yPercent: 30, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlx3Ref.current, { yPercent: 15, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlx4Ref.current, { yPercent: -20, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleViewCaseStudies = () => {
        navigate('/case-studies');
        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
    };

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-8 px-6 overflow-hidden bg-deep-black">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div ref={prlx1Ref} className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-vibrant/10 blur-[120px] rounded-full -z-10 animate-pulse" />
            <div ref={prlx2Ref} className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cream/5 blur-[100px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
                <div className="flex-1 text-center lg:text-left gsap-reveal" ref={textRef}>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] mb-0 text-pure-white perspective-[1000px]">
                        Strategic Software <br /> Consulting &
                    </h1>
                    <h1 ref={gradientTextRef} className="text-4xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] mb-4 bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">
                        Marketing Systems.
                    </h1>
                    <p className="hero-description text-pure-white/80 text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Enterprise-grade solutions that scale with your ambition. We build systems that drive <span className="text-orange-vibrant font-bold relative">real results<span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-vibrant/40" /></span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <div className="hero-cta"><CTAButton href="https://calendly.com/digi-dreamworks/onboarding-call" variant="primary" external={true}>Book Strategy Call</CTAButton></div>
                        <div className="hero-cta"><CTAButton onClick={handleViewCaseStudies} variant="secondary">View Case Studies</CTAButton></div>
                    </div>
                </div>

                <div ref={imgRef} className="flex-1 relative gsap-reveal">
                    <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] mx-auto">
                        <GSAPTilt className="absolute inset-0 rounded-full overflow-hidden border-[10px] border-white/5 z-20 shadow-2xl shadow-orange-vibrant/20 group">
                            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Modern Agency Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="eager" />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </GSAPTilt>

                        <div ref={circleRef} className="absolute -inset-3 border border-dashed border-orange-vibrant/40 rounded-full z-10" />

                        <div ref={prlx3Ref} className="absolute -top-3 -right-3 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-deep-black z-30 shadow-2xl hidden md:block">
                            <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Business Meeting" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                        </div>

                        <div ref={prlx4Ref} className="absolute -bottom-4 -left-8 w-32 h-32 md:w-44 md:h-40 rounded-2xl overflow-hidden border-4 border-deep-black z-30 shadow-2xl hidden md:block">
                            <img src="https://images.pexels.com/photos/3182762/pexels-photo-3182762.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Creative Designer" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                        </div>

                        <FloatingBadge satisfactionRef={satisfactionRef} />
                        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent rounded-full blur-3xl scale-110" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;