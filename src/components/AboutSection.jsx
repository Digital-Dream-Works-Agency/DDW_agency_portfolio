// src/components/AboutSection.jsx - PROFESSIONAL CLEAN VERSION
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.about-reveal',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative py-24 md:py-32 bg-deep-black overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/30 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/20 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* LEFT: Image Column - 5 cols */}
                    <div className="about-reveal lg:col-span-5">
                        <div className="relative w-full max-w-md mx-auto lg:mx-0">
                            
                            {/* Main Image Container */}
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 shadow-2xl">
                                <img
                                    src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1000"
                                    alt="DDW Agency Team"
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/70 via-transparent to-transparent" />
                            </div>

                            {/* Floating Badge - Top Left */}
                            <div className="absolute -top-6 -left-6 bg-orange-vibrant rounded-2xl p-5 shadow-2xl shadow-orange-vibrant/50 z-10">
                                <div className="text-4xl font-black text-deep-black leading-none">10+</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-deep-black/70 mt-1">Years<br/>Experience</div>
                            </div>

                            {/* Floating Stat - Bottom Right */}
                            <div className="absolute -bottom-6 -right-6 bg-bg-surface/95 backdrop-blur-sm border-2 border-orange-vibrant/30 rounded-2xl p-5 shadow-2xl z-10">
                                <div className="text-3xl font-black gradient-text leading-none">150+</div>
                                <div className="text-[9px] text-text-muted uppercase tracking-wider mt-2">Projects</div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT: Content Column - 7 cols */}
                    <div className="about-reveal lg:col-span-7 space-y-6">
                        
                        {/* Badge */}
                        <div className="inline-block">
                            <span className="px-5 py-2 border-2 border-orange-vibrant/30 bg-orange-vibrant/5 text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em] rounded-full">
                                Who We Are
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[1.1] text-pure-white">
                            Built By Engineers.<br />
                            <span className="gradient-text">Not Marketers.</span>
                        </h2>

                        {/* Description */}
                        <p className="text-base md:text-lg text-pure-white/70 leading-relaxed max-w-2xl">
                            We don't do cookie-cutter solutions. Every system we build is architected for your specific business constraints — because we've been in your seat.
                        </p>

                        {/* Stats Grid - 2x2 */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {[
                                { value: '$50M+', label: 'Revenue Generated' },
                                { value: '600%', label: 'Peak ROAS' },
                                { value: '99.9%', label: 'System Uptime' },
                                { value: '24hr', label: 'Response Time' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 rounded-xl border border-orange-vibrant/10 bg-deep-black/30 hover:border-orange-vibrant/30 transition-all duration-300"
                                >
                                    <div className="text-2xl font-black gradient-text mb-1">{stat.value}</div>
                                    <div className="text-[10px] text-text-muted uppercase tracking-wider leading-tight">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Link
                                to="/about"
                                className="magnetic group inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30"
                            >
                                Learn Our Story
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <Link
                                to="/contact"
                                className="magnetic group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-orange-vibrant text-pure-white font-bold text-sm uppercase tracking-wider hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300"
                            >
                                Work With Us
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default AboutSection;