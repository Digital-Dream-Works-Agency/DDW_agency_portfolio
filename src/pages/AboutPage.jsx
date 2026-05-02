// src/pages/AboutPage.jsx - ULTRA ADVANCED VERSION
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';
import SplitType from 'split-type';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Effect Hook ──────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.2) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(element, {
                x: x * strength,
                y: y * strength,
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);
};

// ─── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ value, label, index }) => {
    const [inView, setInView] = useState(false);
    const cardRef = useRef(null);
    useMagneticEffect(cardRef, 0.25);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.5 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');

    return (
        <Tilt
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            scale={1.05}
            transitionSpeed={2000}
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#FF570F"
        >
            <div
                ref={cardRef}
                className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-[#151a1d] to-[#0d1012] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-500 group overflow-hidden"
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

                <div className="relative z-10">
                    <div
                        className="text-4xl font-black mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {inView ? <CountUp end={numericValue} duration={2.5} /> : '0'}
                        {suffix}
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-widest group-hover:text-orange-vibrant transition-colors">
                        {label}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </Tilt>
    );
};

// ─── Value Card Component ──────────────────────────────────────────────────────
const ValueCard = ({ value, index }) => {
    const cardRef = useRef(null);

    return (
        <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.02}
            transitionSpeed={2000}
            glareEnable={true}
            glareMaxOpacity={0.2}
            glareColor="#FF570F"
        >
            <div
                ref={cardRef}
                className="group relative p-10 rounded-3xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 bg-gradient-to-br from-[#151a1d] to-[#0d1012] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
                {/* Number Badge */}
                <div className="absolute top-8 right-8 text-7xl font-black text-orange-vibrant/10 group-hover:text-orange-vibrant/20 transition-colors duration-500">
                    {value.number}
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />

                {/* Glowing orb */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-vibrant/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-vibrant to-orange-soft flex items-center justify-center text-deep-black mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-vibrant/50">
                        {value.icon}
                    </div>

                    {/* Title */}
                    <h4 className="text-2xl font-heading font-bold text-pure-white mb-4 group-hover:text-orange-vibrant transition-colors duration-300">
                        {value.title}
                    </h4>

                    {/* Description */}
                    <p className="text-text-muted leading-relaxed group-hover:text-pure-white/80 transition-colors duration-300">
                        {value.desc}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </Tilt>
    );
};

// ─── Timeline Item Component ───────────────────────────────────────────────────
const TimelineItem = ({ item, index }) => {
    const itemRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(itemRef.current, {
                opacity: 0,
                y: 60,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: itemRef.current,
                    start: 'top 80%',
                    once: true,
                },
            });
        }, itemRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={itemRef} className="relative">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
                {/* Year Column */}
                <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:text-right' : 'lg:col-start-8'}`}>
                    <Parallax speed={index % 2 === 0 ? -5 : 5}>
                        <div className="inline-block">
                            <div className="px-8 py-4 bg-gradient-to-r from-orange-vibrant to-orange-soft rounded-2xl shadow-2xl shadow-orange-vibrant/40 hover:scale-105 transition-transform duration-300">
                                <div className="text-3xl md:text-4xl font-black text-deep-black">{item.year}</div>
                            </div>
                        </div>
                    </Parallax>
                </div>

                {/* Center Icon (Desktop) */}
                <div className="hidden lg:block lg:col-span-2 relative z-20">
                    <div className="flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-orange-vibrant border-4 border-deep-black shadow-2xl shadow-orange-vibrant/60 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                            <div className="w-4 h-4 rounded-full bg-deep-black animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Event Card */}
                <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:col-start-8' : ''}`}>
                    <Tilt
                        tiltMaxAngleX={8}
                        tiltMaxAngleY={8}
                        scale={1.03}
                        transitionSpeed={2000}
                    >
                        <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#151a1d] to-[#0d1012] border-2 border-orange-vibrant/20 hover:border-orange-vibrant/60 transition-all duration-500 hover:-translate-y-2 shadow-2xl overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative z-10 flex items-start gap-4">
                                {/* Mobile Year Badge */}
                                <div className="lg:hidden flex-shrink-0">
                                    <div className="w-16 h-16 rounded-xl bg-orange-vibrant flex items-center justify-center shadow-lg">
                                        <span className="text-sm font-black text-deep-black">{item.year}</span>
                                    </div>
                                </div>

                                {/* Event Text */}
                                <div className="flex-1">
                                    <p className="text-pure-white/90 text-base md:text-lg leading-relaxed group-hover:text-orange-vibrant transition-colors duration-300">
                                        {item.event}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
                        </div>
                    </Tilt>
                </div>
            </div>
        </div>
    );
};

// ─── CTA Button Component ──────────────────────────────────────────────────────
const CTAButton = ({ to, children, variant = 'primary' }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);

    const baseStyles = 'relative inline-flex items-center justify-center gap-3 px-10 py-5 font-bold text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden group';

    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream shadow-lg shadow-orange-vibrant/30',
        secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };

    return (
        <Link ref={btnRef} to={to} className={`${baseStyles} ${variants[variant]}`}>
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                {children}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </Link>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AboutPage = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    // Text Reveal Animation
    useEffect(() => {
        const heading = document.querySelector('.about-main-heading');
        if (heading && !textSplit) {
            const split = new SplitType(heading, { types: 'words' });
            setTextSplit(split);

            gsap.from(split.words, {
                opacity: 0,
                y: 50,
                rotationX: -45,
                transformOrigin: 'top center',
                stagger: 0.08,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    once: true,
                },
            });
        }

        return () => {
            if (textSplit) textSplit.revert();
        };
    }, [textSplit]);

    // Fade-up animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.fade-up', {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    once: true,
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const valuesData = [
        {
            number: '01',
            title: 'No Bullshit Engineering',
            desc: 'We build what you need, not what sounds impressive in a pitch deck. Every technical decision is justified by measurable business outcomes.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
        {
            number: '02',
            title: 'Skin in the Game',
            desc: 'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            number: '03',
            title: 'Speed Without Shortcuts',
            desc: "We move fast because we've done this before — not because we skip tests, documentation, or proper architecture.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
        {
            number: '04',
            title: 'Radical Transparency',
            desc: "You know exactly what we're building, why, and when it ships. No surprises. No excuses. No hidden costs.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
        },
    ];

    const timelineData = [
        { year: '2014', event: 'Founded by ex-Google engineers frustrated with agency quality' },
        { year: '2017', event: 'First enterprise client: $2M+ annual contract' },
        { year: '2020', event: 'Expanded to AI/ML infrastructure consulting' },
        { year: '2024', event: '150+ projects delivered, $50M+ client revenue generated' },
    ];

    return (
        <ParallaxProvider>
            <main className="relative w-full bg-deep-black">
                <Navbar />
                <PageHeader
                    title="About Us"
                    breadcrumb="About"
                    subtitle="We're not an agency. We're an embedded technical partner that sits inside your business and builds systems that scale."
                />

                {/* SECTION 1: Story + Image */}
                <section ref={sectionRef} className="relative py-20 md:py-32 bg-deep-black overflow-hidden">
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                    {/* Background Glow */}
                    <Parallax speed={-10}>
                        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-vibrant/10 rounded-full blur-[150px] animate-pulse" />
                    </Parallax>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                            {/* LEFT: Content */}
                            <div className="fade-up space-y-8">
                                <div>
                                    <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                                        <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />
                                        Our Story
                                    </span>
                                    <h2 className="about-main-heading text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight perspective-1000">
                                        Why We{' '}
                                        <span
                                            style={{
                                                background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                display: 'inline-block',
                                            }}
                                        >
                                            Exist
                                        </span>
                                    </h2>
                                </div>

                                <div className="space-y-6 text-base md:text-lg text-pure-white/70 leading-relaxed">
                                    <p>
                                        DDW Agency was born out of frustration. We were the engineers and growth operators getting burned by agencies that overpromised and underdelivered.
                                    </p>
                                    <p>
                                        So we built the firm we always wanted to hire — one that treats your business like our own, builds systems that scale, and ties our success to measurable outcomes.
                                    </p>
                                    <p>
                                        Our clients don't come to us for templated websites. They come when the stakes are high: scaling from $1M → $10M ARR, rebuilding legacy infrastructure, or launching products where failure costs millions.
                                    </p>
                                    <p className="text-orange-vibrant font-bold text-lg">
                                        We operate as your technical partner, not a vendor.
                                    </p>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t-2 border-orange-vibrant/20">
                                    <StatCard value="10+" label="Years" index={0} />
                                    <StatCard value="150+" label="Projects" index={1} />
                                    <StatCard value="$50M+" label="Revenue" index={2} />
                                    <StatCard value="600%" label="Peak ROAS" index={3} />
                                </div>
                            </div>

                            {/* RIGHT: Image Grid */}
                            <Parallax speed={-8}>
                                <div className="fade-up">
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Large Image */}
                                        <Tilt
                                            tiltMaxAngleX={10}
                                            tiltMaxAngleY={10}
                                            scale={1.03}
                                            transitionSpeed={2000}
                                            className="col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 shadow-2xl group"
                                        >
                                            <img
                                                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                                alt="Team collaboration"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 to-transparent" />
                                        </Tilt>

                                        {/* Two smaller images */}
                                        <Tilt
                                            tiltMaxAngleX={8}
                                            tiltMaxAngleY={8}
                                            scale={1.05}
                                            transitionSpeed={2000}
                                            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-orange-vibrant/10 group"
                                        >
                                            <img
                                                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600"
                                                alt="Strategy session"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        </Tilt>

                                        <Tilt
                                            tiltMaxAngleX={8}
                                            tiltMaxAngleY={8}
                                            scale={1.05}
                                            transitionSpeed={2000}
                                            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-orange-vibrant/10 group"
                                        >
                                            <img
                                                src="https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=600"
                                                alt="Development work"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        </Tilt>
                                    </div>
                                </div>
                            </Parallax>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: Values */}
                <section className="relative py-20 md:py-32 bg-[#0d1012] overflow-hidden">
                    {/* Background */}
                    <Parallax speed={8}>
                        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cream/5 rounded-full blur-[150px]" />
                    </Parallax>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-16 fade-up">
                            <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                                Our Principles
                            </span>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-4">
                                How We{' '}
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        display: 'inline-block',
                                    }}
                                >
                                    Operate
                                </span>
                            </h3>
                            <p className="text-text-muted text-lg max-w-2xl mx-auto">
                                Four non-negotiable principles that govern every project.
                            </p>
                        </div>

                        {/* Values Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {valuesData.map((value, index) => (
                                <ValueCard key={index} value={value} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Timeline */}
                <section className="relative py-20 md:py-32 bg-deep-black overflow-hidden">
                    <div className="relative z-10 max-w-6xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-20 fade-up">
                            <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                                Our Journey
                            </span>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-4">
                                The{' '}
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        display: 'inline-block',
                                    }}
                                >
                                    Timeline
                                </span>
                            </h3>
                            <p className="text-text-muted text-lg max-w-2xl mx-auto">
                                From frustrated engineers to trusted enterprise partner.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical Line (Desktop) */}
                            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange-vibrant via-orange-soft to-transparent opacity-30" />

                            <div className="space-y-20">
                                {timelineData.map((item, index) => (
                                    <TimelineItem key={index} item={item} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-32 bg-gradient-to-b from-deep-black to-[#0d1012]">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight">
                            Ready to Build{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    display: 'inline-block',
                                }}
                            >
                                Something Real?
                            </span>
                        </h3>
                        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                            Let's talk about your technical challenges and how we can solve them.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <CTAButton to="/contact" variant="primary">
                                Start a Project
                            </CTAButton>
                            <CTAButton to="/case-studies" variant="secondary">
                                View Our Work
                            </CTAButton>
                        </div>
                    </div>
                </section>

                <Footer />

                <style jsx>{`
                    .perspective-1000 {
                        perspective: 1000px;
                    }
                `}</style>
            </main>
        </ParallaxProvider>
    );
};

export default AboutPage;