// src/components/Hero.jsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

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
        </>
    );
    if (external) return <a ref={btnRef} href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${variants[variant]}`}>{inner}</a>;
    return <button ref={btnRef} onClick={onClick} className={`${base} ${variants[variant]}`}>{inner}</button>;
};

const AbstractBrandVisual = () => {
    const containerRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.orb-1', { scale: 1.15, duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.orb-2', { scale: 0.88, duration: 5.5, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 });
            gsap.to('.orb-3', { scale: 1.1, duration: 3.5, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 0.5 });
            gsap.to('.ring-rotate', { rotation: 360, duration: 28, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
            gsap.to('.ring-rotate-2', { rotation: -360, duration: 20, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        }, containerRef);
        return () => ctx.revert();
    }, []);
    return (
        <div ref={containerRef} className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] mx-auto flex items-center justify-center">
            <div className="orb-1 absolute inset-0 rounded-full bg-gradient-to-br from-[#FF570F]/30 to-[#630D00]/20 blur-[60px]" />
            <div className="orb-2 absolute inset-[15%] rounded-full bg-gradient-to-tr from-[#EE7D1D]/40 to-[#FF570F]/10 blur-[40px]" />
            <div className="orb-3 absolute inset-[30%] rounded-full bg-gradient-to-br from-[#FDE87A]/30 to-[#FF570F]/40 blur-[30px]" />
            <div className="ring-rotate absolute inset-0 rounded-full border border-dashed border-orange-vibrant/30" />
            <div className="ring-rotate-2 absolute inset-[8%] rounded-full border border-dotted border-cream/20" />
            <div className="absolute top-[12%] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/60" />
            <div className="absolute bottom-[15%] right-[20%] w-1.5 h-1.5 rounded-full bg-cream shadow-lg shadow-cream/50" />
            <div className="absolute left-[10%] top-[45%] w-1.5 h-1.5 rounded-full bg-orange-soft shadow-lg shadow-orange-soft/50" />
            <div className="relative z-10 flex flex-col items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10 backdrop-blur-sm">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-2 opacity-80">
                    <rect x="4" y="4" width="14" height="14" rx="2" stroke="#FF570F" strokeWidth="1.5" />
                    <rect x="22" y="4" width="14" height="14" rx="2" stroke="#EE7D1D" strokeWidth="1.5" />
                    <rect x="4" y="22" width="14" height="14" rx="2" stroke="#EE7D1D" strokeWidth="1.5" />
                    <rect x="22" y="22" width="14" height="14" rx="2" stroke="#FDE87A" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="3" fill="#FF570F" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Systems</span>
            </div>
            <div className="absolute top-[8%] right-[10%] px-3 py-1.5 rounded-lg bg-[#111]/80 border border-orange-vibrant/20 backdrop-blur-sm hidden md:flex items-center gap-2 shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-mono text-text-muted">US + EU</span>
            </div>
            <div className="absolute bottom-[12%] left-[5%] px-3 py-1.5 rounded-lg bg-[#111]/80 border border-cream/20 backdrop-blur-sm hidden md:flex items-center gap-2 shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                <span className="text-[10px] font-mono text-text-muted">Retainer-based</span>
            </div>
        </div>
    );
};

const Hero = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headlineRef.current) {
                const split = new SplitType(headlineRef.current, { types: 'words' });
                gsap.from(split.words, { opacity: 0, y: 40, duration: 0.9, stagger: 0.06, ease: 'power3.out', delay: 0.2 });
            }
            gsap.from('.hero-sub', { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out', delay: 0.7 });
            gsap.from('.hero-cta', { opacity: 0, y: 16, stagger: 0.12, duration: 0.7, ease: 'power2.out', delay: 0.95 });
            gsap.from('.hero-trust', { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 1.3 });
            gsap.from('.hero-visual', { opacity: 0, x: 40, duration: 1.1, ease: 'power3.out', delay: 0.4 });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleViewWork = () => { navigate('/projects'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); };

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center pt-28 pb-12 px-6 overflow-hidden bg-deep-black">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.025)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/8 blur-[140px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#630D00]/15 blur-[100px] rounded-full -z-10" />
            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
                <div className="flex-1 text-center lg:text-left max-w-2xl">
                    <div className="hero-trust inline-flex items-center gap-2 px-4 py-2 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em]">Florida LLC &middot; Florida &amp; Rome &middot; Retainer-only</span>
                    </div>
                    <h1 ref={headlineRef} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.05] mb-6 text-pure-white">
                        Most agencies show you case studies.{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">We show you the accounts.</span>
                    </h1>
                    <p className="hero-sub text-pure-white/65 text-base md:text-lg leading-relaxed mb-3 max-w-xl mx-auto lg:mx-0">
                        $683K in Meta spend managed last month. $2.7M in Amazon sales on a retainer running since 2015. 600% ROAS on Google. Every number is live &mdash; dashboard screenshots available on the first call.
                    </p>
                    <p className="hero-sub text-pure-white/45 text-sm leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                        If you&rsquo;re spending $50K+ a month and the returns don&rsquo;t match, the channel isn&rsquo;t the problem. Who owns the account is.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                        <div className="hero-cta"><CTAButton href="https://calendly.com/digi-dreamworks/onboarding-call" variant="primary" external>See If We&rsquo;re a Fit</CTAButton></div>
                        <div className="hero-cta"><CTAButton onClick={handleViewWork} variant="secondary">See the Numbers</CTAButton></div>
                    </div>
                    <p className="hero-cta text-text-muted text-xs text-center lg:text-left mb-6">20 minutes. No deck. If we&rsquo;re not the right fit, we&rsquo;ll tell you on the call.</p>
                    <div className="hero-trust flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start">
                        {['Meta · Google · Amazon · TikTok · SEO', 'US & EU clients', 'Active since 2015'].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-orange-vibrant flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                <span className="text-text-muted text-xs font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hero-visual flex-1 flex items-center justify-center"><AbstractBrandVisual /></div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-orange-vibrant to-transparent" />
            </div>
        </section>
    );
};

export default Hero;
