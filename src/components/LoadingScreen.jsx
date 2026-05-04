// src/components/LoadingScreen.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        // Scroll lock
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = '';
                if (onComplete) onComplete();
            }
        });

        // 1. Loader progress animation
        tl.to(progressRef.current, {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut"
        })
        // 2. Text fade out up
        .to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        }, "+=0.2")
        // 3. Screen slide up (Curtain reveal)
        .to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut"
        });

        return () => tl.kill();
    }, [onComplete]);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-[99999] bg-deep-black flex flex-col items-center justify-center"
        >
            <div className="flex flex-col items-center gap-8">
                {/* Glowing Logo Text */}
                <h2 ref={textRef} className="text-3xl md:text-4xl font-heading font-black text-pure-white tracking-[0.2em] uppercase relative">
                    DDW <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Agency</span>
                    <span className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF570F] to-transparent blur-[2px] opacity-50" />
                </h2>
                
                {/* Minimal Progress Bar */}
                <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div 
                        ref={progressRef} 
                        className="w-full h-full bg-gradient-to-r from-[#FF570F] to-[#FDE87A] origin-left scale-x-0" 
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;