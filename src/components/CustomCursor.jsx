import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        // Mobile pe cursor nahi dikhana
        if (window.innerWidth < 768) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        // Start off-screen
        gsap.set([cursor, follower], { x: -100, y: -100 });

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.08,
                ease: 'none',
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const onEnterLink = () => {
            gsap.to(cursor, { scale: 2.5, duration: 0.3 });
            gsap.to(follower, { scale: 0, duration: 0.3 });
        };

        const onLeaveLink = () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(follower, { scale: 1, duration: 0.3 });
        };

        window.addEventListener('mousemove', moveCursor);

        // Attach to interactive elements
        const attachHover = () => {
            document.querySelectorAll('a, button, .magnetic').forEach((el) => {
                el.addEventListener('mouseenter', onEnterLink);
                el.addEventListener('mouseleave', onLeaveLink);
            });
        };

        attachHover();

        // Magnetic effect
        const onMagneticMove = (e) => {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
        };

        const onMagneticLeave = (e) => {
            gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        };

        document.querySelectorAll('.magnetic').forEach((el) => {
            el.addEventListener('mousemove', onMagneticMove);
            el.addEventListener('mouseleave', onMagneticLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed w-3 h-3 bg-orange-vibrant rounded-full pointer-events-none"
                style={{
                    zIndex: 99999,
                    transform: 'translate(-50%, -50%)',
                    left: 0,
                    top: 0,
                    mixBlendMode: 'difference',
                }}
            />
            <div
                ref={followerRef}
                className="fixed w-8 h-8 border border-orange-vibrant/60 rounded-full pointer-events-none"
                style={{
                    zIndex: 99998,
                    transform: 'translate(-50%, -50%)',
                    left: 0,
                    top: 0,
                }}
            />
        </>
    );
};

export default CustomCursor;