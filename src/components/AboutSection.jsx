// src/components/AboutSection.jsx - ULTRA ADVANCED VERSION
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';
import CountUp from 'react-countup';

gsap.registerPlugin(ScrollTrigger);

// ─── Custom Hooks ──────────────────────────────────────────────────────────────

// Magnetic Effect Hook (Reusable)
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
                duration: 0.3,
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

// ─── Magnetic Button Component ─────────────────────────────────────────────────
const MagneticButton = ({ to, children, variant = 'primary', className = '' }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);

    const baseStyles = 'relative px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-500 overflow-hidden group';
    
    const variants = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream border-2 border-orange-vibrant',
        secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };

    return (
        <Link
            ref={btnRef}
            to={to}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Ripple effect */}
            <span className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500 bg-orange-vibrant/20 rounded-full blur-xl" />
            
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
        </Link>
    );
};

// ─── Animated Counter Card ─────────────────────────────────────────────────────
const StatCard = ({ stat, index, counterStart }) => {
    const cardRef = useRef(null);

    return (
        <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.05}
            transitionSpeed={2000}
            glareEnable={true}
            glareMaxOpacity={0.1}
            glareColor="#FF570F"
        >
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative p-6 rounded-2xl border-2 border-orange-vibrant/20 bg-gradient-to-br from-deep-black via-deep-black to-orange-vibrant/5 hover:border-orange-vibrant/60 transition-all duration-500 overflow-hidden group"
            >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glowing orb on hover */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-vibrant/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    {/* Counter */}
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-vibrant to-cream bg-clip-text text-transparent mb-2">
                        {counterStart ? (
                            <>
                                {stat.prefix}
                                <CountUp 
                                    end={stat.value} 
                                    duration={2.5} 
                                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                                    useEasing={true}
                                />
                                {stat.suffix}
                            </>
                        ) : (
                            `${stat.prefix || ''}${stat.value}${stat.suffix}`
                        )}
                    </div>

                    {/* Label */}
                    <div className="text-xs text-text-muted uppercase tracking-widest group-hover:text-orange-vibrant transition-colors duration-300">
                        {stat.label}
                    </div>

                    {/* Icon/Symbol */}
                    <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                        {stat.icon || '●'}
                    </div>
                </div>

                {/* Progress bar animation */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </motion.div>
        </Tilt>
    );
};

// ─── Floating Badge Component ──────────────────────────────────────────────────
const FloatingBadge = ({ value, label, position = 'top-left' }) => {
    const badgeRef = useRef(null);

    useEffect(() => {
        // Floating animation
        gsap.to(badgeRef.current, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
        });
    }, []);

    const positions = {
        'top-left': '-top-6 -left-6',
        'bottom-right': '-bottom-6 -right-6',
    };

    return (
        <div
            ref={badgeRef}
            className={`absolute ${positions[position]} bg-gradient-to-br from-orange-vibrant to-orange-600 rounded-2xl p-6 shadow-2xl shadow-orange-vibrant/50 z-10 border-2 border-orange-vibrant/30`}
        >
            <div className="text-5xl font-black text-deep-black mb-1">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-deep-black/80 leading-tight">
                {label.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                ))}
            </div>
            
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-2xl border-2 border-orange-vibrant animate-ping opacity-20" />
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AboutSection = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const imageRef = useRef(null);
    const [counterStart, setCounterStart] = useState(false);

    // Stats data with icons
    const stats = [
        { value: 50, prefix: '$', suffix: 'M+', label: 'Revenue Generated', icon: '💰' },
        { value: 600, suffix: '%', label: 'Peak ROAS', icon: '📈' },
        { value: 99.9, suffix: '%', label: 'System Uptime', icon: '⚡' },
        { value: 24, suffix: 'hr', label: 'Response Time', icon: '⏱️' },
    ];

    // ── Advanced Text Reveal Animation ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split heading into words for reveal
            const heading = headingRef.current;
            const words = heading.querySelectorAll('.word');

            gsap.from(words, {
                y: 100,
                opacity: 0,
                rotationX: -90,
                transformOrigin: 'top center',
                stagger: 0.1,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    once: true,
                },
            });

            // Image reveal with scale
            gsap.from(imageRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: 'top 75%',
                    onEnter: () => setCounterStart(true),
                    once: true,
                },
            });

            // Content reveal
            gsap.from('.about-content', {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // ── Image Hover Effect ──
    useEffect(() => {
        const image = imageRef.current?.querySelector('img');
        if (!image) return;

        const handleMouseMove = (e) => {
            const rect = imageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

            gsap.to(image, {
                x: x,
                y: y,
                duration: 0.5,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(image, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        imageRef.current?.addEventListener('mousemove', handleMouseMove);
        imageRef.current?.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            imageRef.current?.removeEventListener('mousemove', handleMouseMove);
            imageRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <ParallaxProvider>
            <section
                id="about"
                ref={sectionRef}
                className="relative py-24 md:py-32 bg-deep-black overflow-hidden"
            >
                {/* ── Animated Grid Background ── */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                {/* ── Background Glows with Parallax ── */}
                <Parallax speed={-15}>
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-vibrant/20 rounded-full blur-[200px] animate-pulse" />
                </Parallax>

                <Parallax speed={10}>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cream/10 rounded-full blur-[180px]" />
                </Parallax>

                {/* ── Floating Particles ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-orange-vibrant/30 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                        {/* ── LEFT: Image Section ── */}
                        <div className="lg:col-span-5">
                            <Parallax speed={-5}>
                                <div ref={imageRef} className="relative w-full max-w-md mx-auto lg:mx-0">
                                    
                                    {/* Main Image Container with 3D Effect */}
                                    <Tilt
                                        tiltMaxAngleX={15}
                                        tiltMaxAngleY={15}
                                        scale={1.05}
                                        transitionSpeed={2000}
                                        glareEnable={true}
                                        glareMaxOpacity={0.2}
                                        glareColor="#FF570F"
                                        className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-orange-vibrant/30 shadow-2xl shadow-orange-vibrant/20 group"
                                    >
                                        {/* Image */}
                                        <img
                                            src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                            alt="DDW Agency Team"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Gradient Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Scan line effect */}
                                        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="scan-line" />
                                        </div>
                                    </Tilt>

                                    {/* Floating Badges */}
                                    <FloatingBadge value="10+" label="Years Experience" position="top-left" />
                                    <FloatingBadge 
                                        value={counterStart ? <CountUp end={150} duration={2} suffix="+" /> : "150+"} 
                                        label="Projects Delivered" 
                                        position="bottom-right" 
                                    />

                                    {/* Decorative Elements */}
                                    <div className="absolute -z-10 inset-0 bg-gradient-to-br from-orange-vibrant/20 to-transparent rounded-3xl blur-2xl transform scale-105" />
                                </div>
                            </Parallax>
                        </div>

                        {/* ── RIGHT: Content Section ── */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* Badge */}
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="about-content inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full backdrop-blur-sm"
                            >
                                <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />
                                Who We Are
                            </motion.span>

                            {/* Heading with Word Reveal */}
                            <h2
                                ref={headingRef}
                                className="about-content text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black text-pure-white leading-[1.1] perspective-1000"
                            >
                                <span className="word inline-block">Built</span>{' '}
                                <span className="word inline-block">By</span>{' '}
                                <span className="word inline-block">Engineers.</span>
                                <br />
                                <span className="word inline-block bg-gradient-to-r from-orange-vibrant via-cream to-orange-vibrant bg-clip-text text-transparent">
                                    Not
                                </span>{' '}
                                <span className="word inline-block bg-gradient-to-r from-orange-vibrant via-cream to-orange-vibrant bg-clip-text text-transparent">
                                    Marketers.
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="about-content text-base md:text-lg lg:text-xl text-pure-white/70 leading-relaxed max-w-2xl">
                                Every system we build is architected for{' '}
                                <span className="text-orange-vibrant font-semibold">real business constraints</span>.
                                No templates. No shortcuts. Only{' '}
                                <span className="text-cream font-semibold">performance-driven engineering</span>.
                            </p>

                            {/* Stats Grid */}
                            <div className="about-content grid grid-cols-2 gap-4 pt-6">
                                {stats.map((stat, i) => (
                                    <StatCard key={i} stat={stat} index={i} counterStart={counterStart} />
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="about-content flex flex-col sm:flex-row gap-4 pt-8">
                                <MagneticButton to="/about" variant="primary">
                                    Learn Our Story
                                </MagneticButton>

                                <MagneticButton to="/contact" variant="secondary">
                                    Work With Us
                                </MagneticButton>
                            </div>

                            {/* Trust Indicators */}
                            <div className="about-content flex flex-wrap gap-6 pt-6 border-t border-orange-vibrant/20">
                                {[
                                    { icon: '🏆', text: 'Award Winning' },
                                    { icon: '🔒', text: 'Enterprise Security' },
                                    { icon: '⚡', text: 'Lightning Fast' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-text-muted group cursor-default">
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                                            {item.icon}
                                        </span>
                                        <span className="text-xs uppercase tracking-wider group-hover:text-orange-vibrant transition-colors">
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>

                {/* Custom CSS */}
                <style jsx>{`
                    @keyframes scan {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(100%); }
                    }
                    .scan-line {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 2px;
                        background: linear-gradient(90deg, transparent, rgba(255, 87, 15, 0.8), transparent);
                        animation: scan 2s linear infinite;
                        filter: blur(1px);
                    }
                    .perspective-1000 {
                        perspective: 1000px;
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        50% { transform: translateY(-20px) translateX(10px); }
                    }
                    .animate-float {
                        animation: float linear infinite;
                    }
                `}</style>
            </section>
        </ParallaxProvider>
    );
};

export default AboutSection;