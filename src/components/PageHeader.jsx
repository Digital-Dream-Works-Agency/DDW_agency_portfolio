import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const PageHeader = ({ title, breadcrumb, subtitle }) => {
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.header-anim',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
            );
        }, headerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={headerRef}
            className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-deep-black"
        >
            {/* Background layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-vibrant/6 blur-[160px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/3 blur-[140px] rounded-full" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#FF570F 1px, transparent 1px), linear-gradient(90deg, #FF570F 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>

            {/* Decorative large text behind */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                <span className="text-[20vw] font-black text-white/[0.02] uppercase tracking-tighter select-none whitespace-nowrap">
                    {breadcrumb}
                </span>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">

                    {/* Left */}
                    <div>
                        {/* Breadcrumb */}
                        <div className="header-anim flex items-center gap-3 mb-8">
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

                        {/* Title */}
                        <h1 className="header-anim text-6xl md:text-7xl lg:text-8xl font-heading font-black text-pure-white leading-[1.0] mb-6 tracking-tight">
                            {title}
                        </h1>

                        {/* Subtitle if passed */}
                        {subtitle && (
                            <p className="header-anim text-lg text-text-muted leading-relaxed max-w-lg">
                                {subtitle}
                            </p>
                        )}

                        {/* Divider line */}
                        <div className="header-anim flex items-center gap-4 mt-10">
                            <div className="w-16 h-1 bg-orange-vibrant rounded-full" />
                            <div className="w-4 h-1 bg-orange-vibrant/40 rounded-full" />
                            <div className="w-2 h-1 bg-orange-vibrant/20 rounded-full" />
                        </div>
                    </div>

                    {/* Right — decorative image block */}
                    <div className="header-anim hidden lg:flex items-center justify-end">
                        <div className="relative">
                            {/* Main image */}
                            <div className="w-[380px] h-[460px] rounded-2xl overflow-hidden border border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10">
                                <img
                                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt={title}
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
                            </div>

                            {/* Floating stat card */}
                            <div className="absolute -bottom-6 -left-10 bg-bg-surface border border-orange-vibrant/30 rounded-xl p-5 shadow-xl backdrop-blur-sm">
                                <div className="text-3xl font-black gradient-text">10+</div>
                                <div className="text-xs text-text-muted uppercase tracking-widest mt-1">Years Experience</div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-vibrant rounded-full flex flex-col items-center justify-center text-deep-black shadow-lg shadow-orange-vibrant/40">
                                <div className="text-xl font-black leading-none">150+</div>
                                <div className="text-[8px] font-black uppercase tracking-tighter">Projects</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom scroll indicator */}
                <div className="header-anim absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-text-muted uppercase tracking-[0.3em]">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-orange-vibrant to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default PageHeader;