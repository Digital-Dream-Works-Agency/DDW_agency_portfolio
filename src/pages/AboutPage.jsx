// src/pages/AboutPage.jsx - FINAL PROFESSIONAL VERSION
import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
    const sectionRef = useRef(null);

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
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <PageHeader
                title="About Us"
                breadcrumb="About"
                subtitle="We're not an agency. We're an embedded technical partner that sits inside your business and builds systems that scale."
            />

            {/* SECTION 1: Story + Image */}
            <section ref={sectionRef} className="py-20 md:py-32 bg-deep-black relative overflow-hidden">
                
                {/* Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-vibrant/30 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                        
                        {/* LEFT: Content */}
                        <div className="fade-up space-y-8">
                            <div>
                                <span className="px-5 py-2 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em] inline-block mb-6 rounded-full">
                                    Our Story
                                </span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight">
                                    Why We <span className="gradient-text">Exist</span>
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-orange-vibrant/10">
                                {[
                                    { value: '10+', label: 'Years' },
                                    { value: '150+', label: 'Projects' },
                                    { value: '$50M+', label: 'Revenue' },
                                    { value: '600%', label: 'Peak ROAS' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-4 rounded-xl bg-bg-surface border border-orange-vibrant/10 hover:border-orange-vibrant/30 transition-all duration-300">
                                        <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                                        <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Image Grid */}
                        <div className="fade-up">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Large Image - Spans 2 rows */}
                                <div className="col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 shadow-2xl group">
                                    <img
                                        src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        alt="Team collaboration"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 to-transparent" />
                                </div>

                                {/* Two smaller images */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-orange-vibrant/10 group">
                                    <img
                                        src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600"
                                        alt="Strategy session"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-orange-vibrant/10 group">
                                    <img
                                        src="https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=600"
                                        alt="Development work"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* SECTION 2: Values - PROFESSIONAL ICONS */}
            <section className="py-20 md:py-32 bg-bg-surface relative overflow-hidden">
                
                {/* Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cream/40 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16 fade-up">
                        <span className="px-5 py-2 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em] inline-block mb-6 rounded-full">
                            Our Principles
                        </span>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-4">
                            How We <span className="gradient-text">Operate</span>
                        </h3>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            Four non-negotiable principles that govern every project.
                        </p>
                    </div>

                    {/* Values Grid - 2x2 with PROFESSIONAL SVG ICONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                number: '01',
                                title: 'No Bullshit Engineering',
                                desc: 'We build what you need, not what sounds impressive in a pitch deck. Every technical decision is justified by measurable business outcomes.',
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                            },
                            {
                                number: '02',
                                title: 'Skin in the Game',
                                desc: 'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.',
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                            },
                            {
                                number: '03',
                                title: 'Speed Without Shortcuts',
                                desc: 'We move fast because we\'ve done this before — not because we skip tests, documentation, or proper architecture.',
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                    </svg>
                                ),
                            },
                            {
                                number: '04',
                                title: 'Radical Transparency',
                                desc: 'You know exactly what we\'re building, why, and when it ships. No surprises. No excuses. No hidden costs.',
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ),
                            },
                        ].map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-10 rounded-3xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 bg-deep-black transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Number Badge - Top Right */}
                                <div className="absolute top-8 right-8 text-6xl font-black text-orange-vibrant/10 group-hover:text-orange-vibrant/20 transition-colors duration-500">
                                    {v.number}
                                </div>

                                <div className="relative z-10">
                                    {/* Professional SVG Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-vibrant to-orange-soft flex items-center justify-center text-deep-black mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        {v.icon}
                                    </div>
                                    
                                    <h4 className="text-2xl font-heading font-bold text-pure-white mb-4 group-hover:text-orange-vibrant transition-colors">
                                        {v.title}
                                    </h4>
                                    <p className="text-text-muted leading-relaxed">
                                        {v.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* SECTION 3: Timeline - PROFESSIONAL REDESIGN */}
            <section className="py-20 md:py-32 bg-deep-black relative overflow-hidden">
                
                <div className="relative z-10 max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-20 fade-up">
                        <span className="px-5 py-2 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em] inline-block mb-6 rounded-full">
                            Our Journey
                        </span>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-4">
                            The <span className="gradient-text">Timeline</span>
                        </h3>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            From frustrated engineers to trusted enterprise partner.
                        </p>
                    </div>

                    {/* Timeline Items - REDESIGNED */}
                    <div className="relative">
                        
                        {/* PROFESSIONAL Vertical Line - Gradient with Dots */}
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                            <div className="absolute inset-0 bg-gradient-to-b from-orange-vibrant via-orange-soft to-transparent opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-b from-orange-vibrant via-orange-soft to-transparent" 
                                 style={{
                                     backgroundImage: 'linear-gradient(to bottom, transparent 0%, transparent 48%, #FF570F 48%, #FF570F 52%, transparent 52%, transparent 100%)',
                                     backgroundSize: '100% 60px',
                                     backgroundRepeat: 'repeat-y'
                                 }}
                            />
                        </div>

                        <div className="space-y-20">
                            {[
                                { year: '2014', event: 'Founded by ex-Google engineers frustrated with agency quality' },
                                { year: '2017', event: 'First enterprise client: $2M+ annual contract' },
                                { year: '2020', event: 'Expanded to AI/ML infrastructure consulting' },
                                { year: '2024', event: '150+ projects delivered, $50M+ client revenue generated' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    className="relative"
                                >
                                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${i % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
                                        
                                        {/* Year Column */}
                                        <div className={`lg:col-span-5 ${i % 2 === 0 ? 'lg:text-right' : 'lg:col-start-8'}`}>
                                            <div className="inline-block">
                                                <div className="px-8 py-4 bg-gradient-to-r from-orange-vibrant to-orange-soft rounded-2xl shadow-2xl shadow-orange-vibrant/30">
                                                    <div className="text-3xl font-black text-deep-black">{item.year}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Center Icon (Desktop) */}
                                        <div className="hidden lg:block lg:col-span-2 relative z-20">
                                            <div className="flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-orange-vibrant border-4 border-deep-black shadow-lg shadow-orange-vibrant/50 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-deep-black" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event Card */}
                                        <div className={`lg:col-span-5 ${i % 2 === 0 ? 'lg:col-start-8' : ''}`}>
                                            <div className="group p-8 rounded-2xl bg-gradient-to-br from-bg-surface to-deep-black border-2 border-orange-vibrant/20 hover:border-orange-vibrant/50 transition-all duration-500 hover:-translate-y-2 shadow-xl">
                                                <div className="flex items-start gap-4">
                                                    {/* Mobile Year Badge */}
                                                    <div className="lg:hidden flex-shrink-0">
                                                        <div className="w-16 h-16 rounded-xl bg-orange-vibrant flex items-center justify-center shadow-lg">
                                                            <span className="text-sm font-black text-deep-black">{item.year}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Event Text */}
                                                    <div className="flex-1">
                                                        <p className="text-pure-white/90 text-base md:text-lg leading-relaxed group-hover:text-orange-vibrant transition-colors">
                                                            {item.event}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-deep-black to-bg-surface">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight">
                        Ready to Build <span className="gradient-text">Something Real?</span>
                    </h3>
                    <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                        Let's talk about your technical challenges and how we can solve them.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="magnetic inline-flex items-center justify-center gap-3 px-10 py-5 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30 group"
                        >
                            Start a Project
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            to="/case-studies"
                            className="magnetic inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-orange-vibrant text-pure-white font-bold text-sm uppercase tracking-wider hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300"
                        >
                            View Our Work
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default AboutPage;