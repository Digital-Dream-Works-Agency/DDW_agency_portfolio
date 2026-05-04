// src/components/CustomCursor.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        // Mobile par cursor nahi dikhana
        if (window.innerWidth < 768) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        // GSAP Center initial position
        gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

        // GSAP quickTo: Highly optimized for high-frequency updates like mousemove
        const cursorX = gsap.quickTo(cursor, "x", { duration: 0, ease: "none" });
        const cursorY = gsap.quickTo(cursor, "y", { duration: 0, ease: "none" });
        
        const followerX = gsap.quickTo(follower, "x", { duration: 0.3, ease: "power3.out" });
        const followerY = gsap.quickTo(follower, "y", { duration: 0.3, ease: "power3.out" });

        const moveCursor = (e) => {
            cursorX(e.clientX);
            cursorY(e.clientY);
            followerX(e.clientX);
            followerY(e.clientY);
        };

        // Event Delegation: Sirf ek listener jo poori app ke buttons/links handle karega (No querySelectorAll)
        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, input, textarea, select');
            if (target) {
                gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: "power2.out" });
                gsap.to(follower, { scale: 0, duration: 0.3, ease: "power2.out" });
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest('a, button, input, textarea, select');
            if (target) {
                gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
                gsap.to(follower, { scale: 1, duration: 0.3, ease: "power2.out" });
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    // Mobile check at render level too
    if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-orange-vibrant rounded-full pointer-events-none mix-blend-difference z-[99999]"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-orange-vibrant/60 rounded-full pointer-events-none z-[99998]"
            />
        </>
    );
};

export default CustomCursor;