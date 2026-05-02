// src/components/Navbar.jsx - FINAL CLEAN VERSION
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

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

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }}
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                    scrolled
                        ? 'bg-deep-black/95 backdrop-blur-xl border-b border-orange-vibrant/20 py-4 shadow-2xl'
                        : 'bg-transparent py-6'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                    <Link 
                        to="/" 
                        onClick={handleHomeClick}
                        className="flex items-center gap-3 group z-[110]"
                    >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-vibrant/30 group-hover:border-orange-vibrant transition-all duration-300 shadow-lg group-hover:shadow-orange-vibrant/50">
                            <img src="/logo.jpeg" alt="DDW Agency" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xl font-heading font-bold tracking-tight leading-none">
                                DDW <span className="gradient-text">Agency</span>
                            </span>
                            <span className="text-[8px] text-text-muted uppercase tracking-wider">Enterprise Solutions</span>
                        </div>
                    </Link>

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

                    <a
                        href="https://calendly.com/digi-dreamworks/onboarding-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden lg:flex magnetic items-center gap-2 px-8 py-3 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30 group"
                    >
                        Book a Call
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>

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
            </motion.nav>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[98] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-md bg-bg-surface border-l border-orange-vibrant/20 z-[99] lg:hidden overflow-y-auto"
                        >
                            <div className="relative p-8 pt-24">
                                <ul className="space-y-6 mb-12">
                                    {navLinks.map((link, index) => (
                                        <motion.li
                                            key={link.name}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            <Link
                                                to={link.path}
                                                onClick={(e) => {
                                                    if (link.path === '/') handleHomeClick(e);
                                                    setMobileOpen(false);
                                                }}
                                                className="block text-3xl font-heading font-bold text-pure-white hover:text-orange-vibrant transition-colors py-2"
                                            >
                                                {link.name}
                                            </Link>
                                            <div className="h-px bg-gradient-to-r from-orange-vibrant/30 to-transparent mt-3" />
                                        </motion.li>
                                    ))}
                                </ul>
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
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;