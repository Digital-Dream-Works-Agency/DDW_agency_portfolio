'use client'

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom'; // 1. Change: next/navigation ki jagah react-router-dom

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const location = useLocation(); // 2. Change: location hook initialize kiya

    // Jab bhi URL path badlega, cursor reset ho jayega
    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (cursor && follower) {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
            gsap.to(follower, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
    }, [location.pathname]); // 3. location.pathname par nazar rakhega

    useEffect(() => {
        // ... (Baaki saara mouse move aur gsap code waisa hi rahega)
        if (typeof window === 'undefined' || window.innerWidth < 768) return;
        
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

        const moveCursor = (e) => {
            gsap.set(cursor, { x: e.clientX, y: e.clientY });
            gsap.to(follower, { 
                x: e.clientX, 
                y: e.clientY, 
                duration: 0.3, 
                ease: "power3.out",
                overwrite: "auto" 
            });

            if (e.clientX <= 5 || e.clientY <= 5 || e.clientX >= window.innerWidth - 5 || e.clientY >= window.innerHeight - 5) {
                gsap.to([cursor, follower], { opacity: 0, duration: 0.2, overwrite: "auto" });
            } else {
                gsap.to([cursor, follower], { opacity: 1, duration: 0.2, overwrite: "auto" });
            }
        };

        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, input, textarea, select');
            if (target) {
                gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: "power2.out", overwrite: "auto" });
                gsap.to(follower, { scale: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest('a, button, input, textarea, select');
            if (target) {
                gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
                gsap.to(follower, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
            }
        };

        const handleWindowLeave = () => {
            gsap.to([cursor, follower], { opacity: 0, duration: 0.2, overwrite: "auto" });
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('mouseleave', handleWindowLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('mouseleave', handleWindowLeave);
            gsap.killTweensOf([cursor, follower]); 
        };
    }, []);

    if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-[#FF570F] rounded-full pointer-events-none mix-blend-difference z-[99999]"
                style={{ opacity: 0 }} 
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-[#FF570F]/60 rounded-full pointer-events-none z-[99998]"
                style={{ opacity: 0 }}
            />
        </>
    );
}