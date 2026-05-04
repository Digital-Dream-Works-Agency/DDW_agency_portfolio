// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Hook (GSAP quickTo se optimized) ─────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => {
            xTo(0);
            yTo(0);
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Magnetic CTA Button ───────────────────────────────────────────────────
const MagneticCTA = () => {
    const ref = useRef(null);
    useMagnetic(ref, 0.25);

    return (
        <a
            ref={ref}
            href="https://calendly.com/digi-dreamworks/onboarding-call"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex relative items-center gap-2 px-8 py-3 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider overflow-hidden group transition-colors duration-300 shadow-lg shadow-orange-vibrant/30"
        >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-2">
                Book a Call
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </a>
    );
};

// ─── Main Navbar ───────────────────────────────────────────────────────────
const Navbar = () => {
    const navRef = useRef(null);
    const progressRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Reset mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location]);

    // GSAP Scroll Animations (No React State Re-renders!)
    useEffect(() => {
        const nav = navRef.current;
        const progressBar = progressRef.current;

        // Intro animation for Navbar
        gsap.fromTo(nav, { yPercent: -100 }, { yPercent: 0, duration: 1, ease: 'power3.out' });

        // ScrollTrigger for background and padding change
        ScrollTrigger.create({
            start: 'top -50',
            end: 99999,
            toggleClass: { className: 'nav-scrolled', targets: nav },
            onEnter: () => gsap.to(nav, { backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)', padding: '12px 0', borderBottom: '1px solid rgba(255,87,15,0.2)', duration: 0.3 }),
            onLeaveBack: () => gsap.to(nav, { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', padding: '24px 0', borderBottom: '1px solid transparent', duration: 0.3 })
        });

        // ScrollTrigger for Progress Bar
        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.1, // Smooth progress
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // Mobile Menu Animation
    useEffect(() => {
        if (mobileOpen) {
            gsap.to(mobileMenuRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
        } else {
            gsap.to(mobileMenuRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' });
        }
    }, [mobileOpen]);

    const handleHomeClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'Portfolio', path: '/projects' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 w-full z-[100] py-6 transition-colors duration-300"
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    
                    {/* Logo */}
                    <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group z-[110]">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-orange-vibrant/30 group-hover:border-orange-vibrant transition-all duration-500 shadow-lg">
                            <img src="/logo.jpeg" alt="DDW Agency" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xl font-heading font-bold tracking-tight leading-none">
                                DDW <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Agency</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <ul className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    onClick={link.path === '/' ? handleHomeClick : undefined}
                                    className={`relative text-sm font-bold uppercase tracking-wider transition-colors duration-300 group ${
                                        isActive(link.path) ? 'text-orange-vibrant' : 'text-text-muted hover:text-orange-vibrant'
                                    }`}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream transition-all duration-300 ${
                                        isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <MagneticCTA />

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden relative z-[110] w-10 h-10 flex flex-col justify-center items-center gap-1.5"
                        aria-label="Toggle Menu"
                    >
                        <span className={`w-7 h-0.5 bg-orange-vibrant transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-7 h-0.5 bg-pure-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
                        <span className={`w-7 h-0.5 bg-orange-vibrant transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* GSAP Scroll Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 opacity-0 nav-progress-wrapper transition-opacity duration-300">
                    <div 
                        ref={progressRef}
                        className="h-full bg-gradient-to-r from-[#FF570F] to-[#FDE87A] origin-left scale-x-0"
                    />
                </div>
            </nav>

            {/* Mobile Menu (GSAP Controlled) */}
            <div 
                ref={mobileMenuRef}
                className="fixed top-0 right-0 bottom-0 w-full md:w-[85%] max-w-md bg-deep-black/95 backdrop-blur-xl border-l border-orange-vibrant/20 z-[99] lg:hidden overflow-y-auto translate-x-full"
            >
                <div className="relative p-8 pt-32">
                    <ul className="space-y-6 mb-12">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    onClick={(e) => {
                                        if (link.path === '/') handleHomeClick(e);
                                        setMobileOpen(false);
                                    }}
                                    className={`block text-3xl font-heading font-bold transition-colors py-2 ${
                                        isActive(link.path) ? 'text-orange-vibrant' : 'text-pure-white hover:text-orange-vibrant'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                                <div className="h-px bg-gradient-to-r from-orange-vibrant/30 to-transparent mt-3" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <style jsx>{`
                /* Jab navbar scroll hota hai toh progress bar dikhegi */
                .nav-scrolled .nav-progress-wrapper {
                    opacity: 1;
                }
            `}</style>
        </>
    );
};

export default Navbar;