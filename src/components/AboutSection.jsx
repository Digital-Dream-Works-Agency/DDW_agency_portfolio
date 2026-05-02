// src/components/AboutSection.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            tl.fromTo(".about-header",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
            )
            .fromTo(".about-left",
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
                "-=0.7"
            )
            .fromTo(".about-content-main",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
                "-=1"
            )
            .fromTo(".about-content-side",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
                "-=1"
            )
            .fromTo(".feature-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
                "-=0.5"
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="py-20 bg-deep-black text-white overflow-hidden relative">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-orange-vibrant rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cream rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header Area - FIXED CONTRAST */}
                <div className="mb-20 about-header">
                    <div className="inline-block mb-6">
                        <span className="px-6 py-2 border-2 border-orange-vibrant/50 text-orange-vibrant text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-vibrant/20">
                            Our DNA
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-heading font-black mb-6 text-pure-white">
                        Bridging The Gap Between <br />
                        <span className="gradient-text">Vision And Execution</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl bg-bg-surface/50 backdrop-blur-sm p-4 rounded-lg border border-orange-vibrant/10">
                        We don't just build software — we architect systems that drive measurable business outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Side: Large Image */}
                    <div className="lg:col-span-4 relative about-left">
                        <div className="rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10 hover:border-orange-vibrant/50 transition-all duration-500">
                            <img
                                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
                                alt="Team collaboration"
                                className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Middle Content Area - IMPROVED CONTRAST */}
                    <div className="lg:col-span-5 about-content-main pt-0 lg:pt-10">
                        <h3 className="text-3xl md:text-4xl font-heading font-bold leading-tight mb-8 text-pure-white">
                            Bridging The Gap Between Vision And Execution.
                        </h3>
                        <p className="text-pure-white/80 mb-12 leading-relaxed bg-bg-surface/30 backdrop-blur-sm p-6 rounded-xl border border-orange-vibrant/10">
                            DDW Agency provides high-level technical services and infrastructure. We operate separately from DDW Studio to ensure your business gets tailored, production-ready solutions that scale with your goals.
                        </p>

                        {/* Features Row - BETTER VISIBILITY */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-orange-vibrant/20">
                            <div className="feature-item bg-bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-orange-vibrant/20 hover:border-orange-vibrant/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/50"></div>
                                    <h4 className="text-lg font-bold text-pure-white">Strategic Advisory</h4>
                                </div>
                                <p className="text-sm text-pure-white/70 leading-relaxed">
                                    High-margin consulting and architectural oversight.
                                </p>
                            </div>
                            <div className="feature-item bg-bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-orange-vibrant/20 hover:border-orange-vibrant/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/50"></div>
                                    <h4 className="text-lg font-bold text-pure-white">Execution Excellence</h4>
                                </div>
                                <p className="text-sm text-pure-white/70 leading-relaxed">
                                    Building robust, enterprise-grade systems.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image Area + Badge */}
                    <div className="lg:col-span-3 flex flex-col items-center gap-12 about-content-side">
                        <div className="rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 w-full hover:border-orange-vibrant/50 transition-all duration-500 shadow-xl">
                            <img 
                                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg" 
                                alt="Discussion" 
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
                            />
                        </div>

                        {/* Neon Spinning Badge - BETTER CONTRAST */}
                        <div className="relative w-44 h-44 bg-gradient-to-br from-orange-vibrant to-orange-soft rounded-full flex items-center justify-center text-deep-black overflow-hidden group shadow-2xl shadow-orange-vibrant/50">
                            <div className="absolute inset-0 border-[3px] border-dashed border-deep-black/30 rounded-full animate-spin-slow"></div>
                            <div className="text-center z-10">
                                <div className="text-5xl font-black leading-none text-deep-black">10</div>
                                <div className="text-xs font-bold uppercase tracking-widest mt-1 text-deep-black/80">Years</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;