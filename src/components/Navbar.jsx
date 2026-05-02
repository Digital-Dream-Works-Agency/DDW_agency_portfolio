// src/components/Navbar.jsx - FULLY FIXED VERSION
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { scroller } from 'react-scroll';

const Navbar = () => {
    const navRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // ─── Scroll Effect ────────────────────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ─── Entry Animation ──────────────────────────────────────────────────────
    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
        );
    }, []);

    // ─── Close menu on route change ───────────────────────────────────────────
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // ─── Smart scroll handler ─────────────────────────────────────────────────
    // If already on '/' → smooth scroll to section
    // If on another page → navigate to '/' first, then scroll after mount
    const handleSectionNav = useCallback(
        (sectionId, closeMenu = false) => {
            if (closeMenu) setIsMenuOpen(false);

            if (location.pathname === '/') {
                // Already on home — just scroll
                scroller.scrollTo(sectionId, {
                    smooth: true,
                    offset: -100,
                    duration: 800,
                });
            } else {
                // Store target in sessionStorage, navigate to home
                sessionStorage.setItem('scrollTarget', sectionId);
                navigate('/');
            }
        },
        [location.pathname, navigate]
    );

    // ─── After navigating to home, fire pending scroll ────────────────────────
    useEffect(() => {
        if (location.pathname === '/') {
            const target = sessionStorage.getItem('scrollTarget');
            if (target) {
                sessionStorage.removeItem('scrollTarget');
                // Wait for page render + any loading screen
                const t = setTimeout(() => {
                    scroller.scrollTo(target, {
                        smooth: true,
                        offset: -100,
                        duration: 900,
                    });
                }, 600);
                return () => clearTimeout(t);
            }
        }
    }, [location.pathname]);

    // ─── Logo / Home click ────────────────────────────────────────────────────
    const handleHomeClick = useCallback(
        (e) => {
            if (location.pathname === '/') {
                // Already on home — scroll to very top
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Otherwise, Link's normal navigation handles it (ScrollToTop in App.jsx fires)
        },
        [location.pathname]
    );

    // ─── Nav link definitions ─────────────────────────────────────────────────
    const navLinks = [
        { name: 'Home',      path: '/',          type: 'route'  },
        { name: 'Solutions', path: 'solutions',  type: 'scroll' },
        { name: 'Portfolio', path: '/projects',  type: 'route'  },
        { name: 'About',     path: 'about',      type: 'scroll' },
    ];

    // ─── Render helpers ───────────────────────────────────────────────────────
    const underline = (
        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream group-hover:w-full transition-all duration-300" />
    );

    const renderDesktopLink = (link) => {
        if (link.type === 'scroll') {
            return (
                <button
                    key={link.name}
                    onClick={() => handleSectionNav(link.path)}
                    className="relative text-sm font-bold uppercase tracking-wider text-text-muted hover:text-orange-vibrant transition-colors duration-300 group cursor-pointer"
                >
                    {link.name}
                    {underline}
                </button>
            );
        }

        if (link.path === '/') {
            return (
                <Link
                    key={link.name}
                    to={link.path}
                    onClick={handleHomeClick}
                    className="relative text-sm font-bold uppercase tracking-wider text-text-muted hover:text-orange-vibrant transition-colors duration-300 group"
                >
                    {link.name}
                    {underline}
                </Link>
            );
        }

        return (
            <Link
                key={link.name}
                to={link.path}
                className="relative text-sm font-bold uppercase tracking-wider text-text-muted hover:text-orange-vibrant transition-colors duration-300 group"
            >
                {link.name}
                {underline}
            </Link>
        );
    };

    const renderMobileLink = (link, index) => {
        const inner = (
            <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">
                {link.name}
            </span>
        );

        const baseClass =
            'block text-3xl font-heading font-bold text-pure-white hover:text-orange-vibrant transition-colors py-2 group cursor-pointer';

        if (link.type === 'scroll') {
            return (
                <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <button
                        className={`${baseClass} text-left w-full`}
                        onClick={() => handleSectionNav(link.path, true)}
                    >
                        {inner}
                    </button>
                    <div className="h-px bg-gradient-to-r from-orange-vibrant/50 to-transparent mt-4" />
                </motion.li>
            );
        }

        if (link.path === '/') {
            return (
                <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link
                        to={link.path}
                        onClick={(e) => {
                            handleHomeClick(e);
                            setIsMenuOpen(false);
                        }}
                        className={baseClass}
                    >
                        {inner}
                    </Link>
                    <div className="h-px bg-gradient-to-r from-orange-vibrant/50 to-transparent mt-4" />
                </motion.li>
            );
        }

        return (
            <motion.li
                key={link.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={baseClass}
                >
                    {inner}
                </Link>
                <div className="h-px bg-gradient-to-r from-orange-vibrant/50 to-transparent mt-4" />
            </motion.li>
        );
    };

    // ─── JSX ──────────────────────────────────────────────────────────────────
    return (
        <>
            <motion.nav
                ref={navRef}
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                    isScrolled
                        ? 'bg-deep-black/90 backdrop-blur-xl border-b border-orange-vibrant/10 py-4 shadow-2xl'
                        : 'bg-transparent py-6'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                    {/* ── Logo ── */}
                    <Link
                        to="/"
                        onClick={handleHomeClick}
                        className="flex items-center gap-3 group z-[110]"
                    >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-vibrant/30 group-hover:border-orange-vibrant transition-all duration-300 shadow-lg group-hover:shadow-orange-vibrant/50">
                            <img
                                src="/logo.jpeg"
                                alt="DDW Agency"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-heading font-bold tracking-tight leading-none">
                                DDW <span className="gradient-text">Agency</span>
                            </span>
                            <span className="text-[8px] text-text-muted uppercase tracking-wider">
                                Enterprise Solutions
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <ul className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <li key={link.name}>{renderDesktopLink(link)}</li>
                        ))}
                    </ul>

                    {/* ── CTA ── */}
                    <a
                        href="https://calendly.com/digi-dreamworks/onboarding-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:block magnetic px-8 py-3 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg hover:shadow-orange-vibrant/50"
                    >
                        Book a Call
                    </a>

                    {/* ── Hamburger ── */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden relative z-[110] flex flex-col gap-1.5 w-8 h-8 justify-center items-center group"
                        aria-label="Toggle Menu"
                    >
                        <span className={`w-7 h-0.5 bg-orange-vibrant transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-7 h-0.5 bg-pure-white transition-all duration-300   ${isMenuOpen ? 'opacity-0 scale-0'         : ''}`} />
                        <span className={`w-7 h-0.5 bg-orange-vibrant transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </motion.nav>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[98] md:hidden"
                        />

                        {/* Slide-in Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-md bg-bg-surface border-l border-orange-vibrant/20 z-[99] md:hidden overflow-y-auto"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-vibrant/10 blur-3xl rounded-full pointer-events-none" />

                            <div className="relative p-8 pt-24">
                                <ul className="space-y-8 mb-12">
                                    {navLinks.map((link, index) => renderMobileLink(link, index))}
                                </ul>

                                {/* Mobile CTA */}
                                <motion.a
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    href="https://calendly.com/digi-dreamworks/onboarding-call"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all shadow-lg"
                                >
                                    Book a Call
                                </motion.a>

                                {/* Social Icons */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex gap-4 mt-12 justify-center"
                                >
                                    <a
                                        href="#"
                                        aria-label="LinkedIn"
                                        className="w-12 h-12 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        aria-label="Instagram"
                                        className="w-12 h-12 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                </motion.div>

                                {/* Bottom copyright */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute bottom-8 left-8 right-8 text-center"
                                >
                                    <p className="text-xs text-text-muted uppercase tracking-wider">
                                        © {new Date().getFullYear()} DDW Agency
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;