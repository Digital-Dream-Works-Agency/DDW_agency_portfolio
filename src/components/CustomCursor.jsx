// src/components/CustomCursor.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [cursorText, setCursorText] = useState('');
    const [cursorVariant, setCursorVariant] = useState('default');

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        // Mouse Move Handler
        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
            
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power2.out'
            });
        };

        // Hover Effects
        const links = document.querySelectorAll('a, button, .magnetic');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                setCursorVariant('link');
                gsap.to(cursor, { scale: 3, duration: 0.3 });
                gsap.to(follower, { scale: 0, duration: 0.3 });
            });
            
            link.addEventListener('mouseleave', () => {
                setCursorVariant('default');
                gsap.to(cursor, { scale: 1, duration: 0.3 });
                gsap.to(follower, { scale: 1, duration: 0.3 });
            });
        });

        // Magnetic Effect
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    // Hide on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return null;
    }

    return (
        <>
            {/* Main Cursor */}
            <div
                ref={cursorRef}
                className="fixed w-4 h-4 bg-orange-vibrant rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ 
                    transform: 'translate(-50%, -50%)',
                    left: 0,
                    top: 0
                }}
            />
            
            {/* Follower Cursor */}
            <div
                ref={followerRef}
                className="fixed w-10 h-10 border-2 border-orange-vibrant rounded-full pointer-events-none z-[9998]"
                style={{ 
                    transform: 'translate(-50%, -50%)',
                    left: 0,
                    top: 0,
                    transition: 'width 0.3s, height 0.3s'
                }}
            />
        </>
    );
};

export default CustomCursor;