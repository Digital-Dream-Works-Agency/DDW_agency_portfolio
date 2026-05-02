// src/components/Hero.jsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const textRef = useRef(null);
    const imgRef = useRef(null);
    const circleRef = useRef(null);
    const satisfactionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.set(".gsap-reveal", { autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(textRef.current, {
            autoAlpha: 1,
            x: 0,
            duration: 1.5,
            startAt: { x: -150 }
        })
        .to(imgRef.current, {
            autoAlpha: 1,
            x: 0,
            duration: 1.5,
            startAt: { x: 150 }
        }, "-=1.2")
        .to(circleRef.current, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        const obj = { value: 0 };
        gsap.to(obj, {
            value: 100,
            duration: 2.5,
            delay: 1.5,
            ease: "power2.out",
            onUpdate: () => {
                if (satisfactionRef.current) {
                    satisfactionRef.current.innerText = Math.floor(obj.value) + "%";
                }
            }
        });
    }, []);

    // ✅ FIX: View Case Studies - Navigate to page
    const handleViewCaseStudies = () => {
        navigate('/case-studies');
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-8 px-6 overflow-hidden bg-deep-black">
            
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-vibrant/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cream/5 blur-[100px] rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">

                {/* Left: Text Content */}
                <div className="flex-1 text-center lg:text-left gsap-reveal" ref={textRef}>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.1] mb-4 text-pure-white">
                        Strategic Software <br />
                        Consulting & <br />
                        <span className="gradient-text">Marketing Systems.</span>
                    </h1>
                    
                    <p className="text-pure-white/80 text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Enterprise-grade solutions that scale with your ambition.
                        We build systems that drive <span className="text-orange-vibrant font-bold">real results</span>.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a
                            href="https://calendly.com/digi-dreamworks/onboarding-call"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="magnetic px-8 py-3 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg group"
                        >
                            Book Strategy Call
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>

                        {/* ✅ FIXED: Now navigates to Case Studies page */}
                        <button
                            onClick={handleViewCaseStudies}
                            className="magnetic px-8 py-3 border-2 border-orange-vibrant text-pure-white font-bold text-xs uppercase tracking-wider hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300 inline-flex items-center justify-center gap-2"
                        >
                            View Case Studies
                        </button>
                    </div>
                </div>

                {/* Right: Image Layout */}
                <div ref={imgRef} className="flex-1 relative gsap-reveal">
                    <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] mx-auto">

                        <div className="absolute inset-0 rounded-full overflow-hidden border-[10px] border-white/5 z-20 shadow-2xl">
                            <img
                                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Modern Agency Team"
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>

                        <div ref={circleRef} className="absolute -inset-3 border border-dashed border-orange-vibrant/40 rounded-full z-10"></div>

                        <div className="absolute -top-3 -right-3 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-deep-black z-30 shadow-2xl hidden md:block">
                            <img
                                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400"
                                alt="Business Meeting"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        <div className="absolute -bottom-4 -left-8 w-32 h-32 md:w-44 md:h-40 rounded-2xl overflow-hidden border-4 border-deep-black z-30 shadow-2xl hidden md:block">
                            <img
                                src="https://images.pexels.com/photos/3182762/pexels-photo-3182762.jpeg?auto=compress&cs=tinysrgb&w=400"
                                alt="Creative Designer"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        <div className="absolute bottom-8 -right-10 bg-orange-vibrant p-4 md:p-5 rounded-full z-40 shadow-xl flex flex-col items-center justify-center text-deep-black leading-tight">
                            <span ref={satisfactionRef} className="text-xl md:text-2xl font-black">0%</span>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter text-center">Satisfaction</span>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;