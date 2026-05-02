// src/components/Collaborators.jsx - COMPLETELY FIXED
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", name: "Amazon" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", name: "Google" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", name: "Netflix" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg", name: "Slack" }
];

const Collaborators = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (!marquee) return;

        const ctx = gsap.context(() => {
            gsap.from(".collab-title", {
                x: -50,
                opacity: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: ".collab-title",
                    start: "top 90%",
                }
            });

            gsap.from(".marquee-container", {
                x: 100,
                opacity: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: ".marquee-container",
                    start: "top 90%",
                }
            });

            // FIXED: Perfectly smooth infinite loop
            const wrap = gsap.utils.wrap(-100, 0);
            
            gsap.to(marquee, {
                xPercent: -100,
                duration: 15,
                ease: "none",
                repeat: -1,
                modifiers: {
                    xPercent: wrap
                }
            });
        }, marqueeRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full bg-bg-surface border-y border-orange-vibrant/10 py-12 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">

                {/* Left: Title */}
                <div className="lg:w-1/4 w-full text-center lg:text-left collab-title">
                    <h3 className="text-2xl md:text-3xl font-heading font-black leading-tight uppercase tracking-tighter text-pure-white">
                        Our <br /> 
                        <span className="gradient-text">Collaborators</span>
                    </h3>
                </div>

                {/* Right: Marquee - FIXED SMOOTH LOOP */}
                <div className="lg:w-3/4 w-full relative overflow-hidden marquee-container">
                    <div className="absolute left-0 top-0 h-full w-px bg-orange-vibrant/20 hidden lg:block"></div>

                    <div className="lg:pl-12 overflow-hidden">
                        <div ref={marqueeRef} className="flex items-center gap-16 whitespace-nowrap">
                            {/* Triple repeat for seamless loop */}
                            {[...logos, ...logos, ...logos].map((logo, index) => (
                                <div key={index} className="flex-shrink-0 bg-pure-white/5 backdrop-blur-sm px-8 py-4 rounded-lg border border-orange-vibrant/10 hover:border-orange-vibrant/30 transition-all">
                                    <img
                                        src={logo.src}
                                        alt={logo.name}
                                        className="h-8 md:h-9 object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Collaborators;