import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';

const PageHeader = ({ title, breadcrumb, subtitle }) => {
    const headerRef = useRef(null);
    const circleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Breadcrumb + divider stagger
            gsap.fromTo('.header-anim',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );

            // Title words manually animate — no SplitType to avoid gradient break
            gsap.fromTo('.header-title-word',
                { y: 80, opacity: 0, rotationX: -40 },
                { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3, transformOrigin: 'top center' }
            );

            // Rotating circle on right decorative card
            if (circleRef.current) {
                gsap.to(circleRef.current, {
                    rotation: 360,
                    duration: 20,
                    repeat: -1,
                    ease: 'none',
                });
            }
        }, headerRef);

        return () => ctx.revert();
    }, [title]);

    // Split title into words for animation — preserve gradient on last word if needed
    const words = title.split(' ');

    return (
        <ParallaxProvider>
            <section
                ref={headerRef}
                className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-deep-black"
            >
                {/* Background glows */}
                <Parallax speed={-12}>
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-vibrant/6 blur-[160px] rounded-full pointer-events-none" />
                </Parallax>
                <Parallax speed={8}>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/3 blur-[140px] rounded-full pointer-events-none" />
                </Parallax>

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#FF570F 1px, transparent 1px), linear-gradient(90deg, #FF570F 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Giant watermark behind */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <span className="text-[22vw] font-black text-white/[0.018] uppercase tracking-tighter select-none whitespace-nowrap">
                        {breadcrumb}
                    </span>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-36 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">

                        {/* ── LEFT ── */}
                        <div>
                            {/* Breadcrumb */}
                            <div className="header-anim flex items-center gap-3 mb-10">
                                <Link
                                    to="/"
                                    className="text-xs font-bold uppercase tracking-[0.25em] text-text-muted hover:text-orange-vibrant transition-colors duration-300"
                                >
                                    Home
                                </Link>
                                <svg className="w-3 h-3 text-orange-vibrant" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-vibrant">
                                    {breadcrumb}
                                </span>
                            </div>

                            {/* Title — word by word animation, last word gradient */}
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-black leading-[1.0] mb-6 tracking-tight perspective-1000 overflow-hidden">
                                {words.map((word, i) => {
                                    const isLast = i === words.length - 1;
                                    return (
                                        <span
                                            key={i}
                                            className="header-title-word inline-block mr-4"
                                            style={isLast ? {
                                                background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            } : { color: '#FFFFFF' }}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </h1>

                            {/* Subtitle */}
                            {subtitle && (
                                <p className="header-anim text-lg text-text-muted leading-relaxed max-w-lg mt-4">
                                    {subtitle}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="header-anim flex items-center gap-4 mt-10">
                                <div className="w-16 h-1 bg-orange-vibrant rounded-full" />
                                <div className="w-4 h-1 bg-orange-vibrant/40 rounded-full" />
                                <div className="w-2 h-1 bg-orange-vibrant/20 rounded-full" />
                            </div>
                        </div>

                        {/* ── RIGHT: 3D Tilt Card ── */}
                        <div className="header-anim hidden lg:flex items-center justify-end">
                            <Parallax speed={-6}>
                                <Tilt
                                    tiltMaxAngleX={8}
                                    tiltMaxAngleY={8}
                                    scale={1.02}
                                    transitionSpeed={2000}
                                    glareEnable={true}
                                    glareMaxOpacity={0.1}
                                    glareColor="#FF570F"
                                >
                                    <div className="relative w-[380px] h-[460px]">

                                        {/* Main image */}
                                        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10">
                                            <img
                                                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                                                alt={title}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
                                        </div>

                                        {/* Rotating dashed ring */}
                                        <div
                                            ref={circleRef}
                                            className="absolute -inset-4 border border-dashed border-orange-vibrant/20 rounded-2xl pointer-events-none"
                                        />

                                        {/* Stat card */}
                                        <div className="absolute -bottom-6 -left-10 bg-bg-surface border border-orange-vibrant/30 rounded-xl p-5 shadow-xl backdrop-blur-sm z-10">
                                            <div
                                                className="text-3xl font-black mb-1"
                                                style={{
                                                    background: 'linear-gradient(135deg, #FF570F, #FDE87A)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                }}
                                            >
                                                10+
                                            </div>
                                            <div className="text-xs text-text-muted uppercase tracking-widest">Years Experience</div>
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-vibrant rounded-full flex flex-col items-center justify-center text-deep-black shadow-lg shadow-orange-vibrant/40 z-10">
                                            <div className="text-xl font-black leading-none">150+</div>
                                            <div className="text-[8px] font-black uppercase tracking-tighter">Projects</div>
                                        </div>
                                    </div>
                                </Tilt>
                            </Parallax>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="header-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <span className="text-[10px] text-text-muted uppercase tracking-[0.3em]">Scroll</span>
                        <div className="w-px h-12 bg-gradient-to-b from-orange-vibrant to-transparent" />
                    </div>
                </div>

                <style jsx>{`
                    .perspective-1000 { perspective: 1000px; }
                `}</style>
            </section>
        </ParallaxProvider>
    );
};

export default PageHeader;