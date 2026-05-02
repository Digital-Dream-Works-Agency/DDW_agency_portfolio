// src/components/Collaborate.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Collaborate = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".collab-bg", {
                scale: 1.2,
                duration: 2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            gsap.from(".collab-text", {
                x: -100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 w-full overflow-hidden bg-deep-black border-y border-orange-vibrant/20">

            {/* Background Image & Dark Overlay - IMPROVED CONTRAST */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg"
                    alt="Collaboration"
                    className="collab-bg w-full h-full object-cover object-right"
                />
                {/* Stronger Dark Gradient for Better Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/95 to-deep-black/70"></div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 relative z-20">
                <div className="max-w-3xl">

                    {/* Badge - BETTER VISIBILITY */}
                    <div className="collab-text inline-flex items-center gap-3 px-6 py-3 border-2 border-orange-vibrant/50 mb-10 backdrop-blur-sm bg-orange-vibrant/10 shadow-lg shadow-orange-vibrant/20">
                        <span className="w-2 h-2 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/80"></span>
                        <span className="text-orange-vibrant text-xs font-bold tracking-[0.3em] uppercase">
                            Let's Collaborate
                        </span>
                        <span className="w-2 h-2 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/80"></span>
                    </div>

                    {/* Heading - HIGH CONTRAST */}
                    <h2 className="collab-text text-6xl md:text-7xl lg:text-8xl font-heading font-black leading-[1.05] mb-16 tracking-tight text-pure-white drop-shadow-2xl">
                        Ready to <br />
                        <span className="gradient-text text-shadow">work with us?</span>
                    </h2>

                    {/* CTA Button - ENHANCED */}
                    <div className="collab-text">
                        <a
                            href="https://calendly.com/digi-dreamworks/onboarding-call"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="magnetic inline-block bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider px-12 py-6 hover:bg-cream transition-all duration-300 shadow-2xl shadow-orange-vibrant/50 hover:shadow-cream/50"
                        >
                            Book a call
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Collaborate;