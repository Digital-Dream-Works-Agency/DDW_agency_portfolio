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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
        );
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleSectionNav = useCallback((sectionId, closeMenu = false) => {
        if (closeMenu) setIsMenuOpen(false);
        if (location.pathname === '/') {
            scroller.scrollTo(sectionId, {
                smooth: true,
                offset: -100,
                duration: 800,
            });
        } else {
            sessionStorage.setItem('scrollTarget', sectionId);
            navigate('/');
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        if (location.pathname === '/') {
            const target = sessionStorage.getItem('scrollTarget');
            if (target) {
                sessionStorage.removeItem('scrollTarget');
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

    const handleHomeClick = useCallback((e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home',         path: '/',             type: 'route'  },
        { name: 'Services',     path: '/services',     type: 'route'  },
        { name: 'Case Studies', path: '/case-studies', type: 'route'  },
        { name: 'Portfolio',    path: '/projects',     type: 'route'  },
        { name: 'About',        path: 'about',         type: 'scroll' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

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

                    <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group z-[110]">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-vibrant/30 group-hover:border-orange-vibrant transition-all duration-300 shadow-lg group-hover:shadow-orange-vibrant/50">
                            <img src="/logo.jpeg" alt="DDW Agency" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-heading font-bold tracking-tight leading-none">
                                DDW <span className="gradient-text">Agency</span>
                            </span>
                            <span className="text-[8px] text-text-muted uppercase tracking-wider">Enterprise Solutions</span>
                        </div>
                    </Link>

                    <ul className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                {link.type === 'scroll' ? (
                                    <button
                                        onClick={() => handleSectionNav(link.path)}
                                        className="relative text-sm font-bold uppercase tracking-wider text-text-muted hover:text-orange-vibrant transition-colors duration-300 group cursor-pointer"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream group-hover:w-full transition-all duration-300" />
                                    </button>
                                ) : link.path === '/' ? (
                                    <Link
                                        to={link.path}
                                        onClick={handleHomeClick}
                                        className={`relative text-sm font-bold uppercase tracking-wider transition-colors duration-300 group ${isActive(link.path) ? 'text-orange-vibrant' : 'text-text-muted hover:text-orange-vibrant'}`}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </Link>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`relative text-sm font-bold uppercase tracking-wider transition-colors duration-300 group ${isActive(link.path) ? 'text-orange-vibrant' : 'text-text-muted hover:text-orange-vibrant'}`}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-orange-vibrant to-cream transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <Link
                        to="/contact"
                        className="hidden md:block magnetic px-8 py-3 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg hover:shadow-orange-vibrant/50"
                    >
                        Book a Call
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden relative z-[110] flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
                        aria-label="Toggle Menu"
                    >
                        <span className={`w-7 h-0.5 bg-orange-vibrant transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-7 h-0.5 bg-pure-white transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                        <span className={`w-7 h-0.5 bg-orange-vibrant transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[98] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-md bg-bg-surface border-l border-orange-vibrant/20 z-[99] md:hidden overflow-y-auto"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-vibrant/10 blur-3xl rounded-full pointer-events-none" />
                            <div className="relative p-8 pt-24">
                                <ul className="space-y-6 mb-12">
                                    {navLinks.map((link, index) => (
                                        <motion.li
                                            key={link.name}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            {link.type === 'scroll' ? (
                                                <button
                                                    className="block text-3xl font-heading font-bold text-pure-white hover:text-orange-vibrant transition-colors py-2 text-left w-full"
                                                    onClick={() => handleSectionNav(link.path, true)}
                                                >
                                                    {link.name}
                                                </button>
                                            ) : link.path === '/' ? (
                                                <Link
                                                    to={link.path}
                                                    onClick={(e) => { handleHomeClick(e); setIsMenuOpen(false); }}
                                                    className="block text-3xl font-heading font-bold text-pure-white hover:text-orange-vibrant transition-colors py-2"
                                                >
                                                    {link.name}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={link.path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="block text-3xl font-heading font-bold text-pure-white hover:text-orange-vibrant transition-colors py-2"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                            <div className="h-px bg-gradient-to-r from-orange-vibrant/30 to-transparent mt-3" />
                                        </motion.li>
                                    ))}
                                </ul>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all shadow-lg"
                                    >
                                        Book a Call
                                    </Link>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute bottom-8 left-0 right-0 text-center text-xs text-text-muted uppercase tracking-wider"
                                >
                                    © {new Date().getFullYear()} DDW Agency
                                </motion.p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;