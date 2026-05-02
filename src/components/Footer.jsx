// src/components/Footer.jsx - ULTRA ADVANCED VERSION
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Effect Hook ──────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            gsap.to(el, {
                x: (e.clientX - rect.left - rect.width / 2) * strength,
                y: (e.clientY - rect.top - rect.height / 2) * strength,
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const onLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);

        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);
};

// ─── Magnetic Social Button ───────────────────────────────────────────────────
const MagneticSocial = ({ label, url, icon }) => {
    const ref = useRef(null);
    useMagneticEffect(ref, 0.35);

    return (
        <a
            ref={ref}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-14 h-14 rounded-full border-2 border-orange-vibrant/20 flex items-center justify-center hover:bg-orange-vibrant hover:border-orange-vibrant transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-orange-vibrant/50"
            aria-label={label}
        >
            {/* Ripple effect */}
            <span className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500 bg-orange-vibrant/20 rounded-full" />
            
            {/* Icon */}
            <span className="relative z-10 text-orange-vibrant group-hover:text-deep-black transition-colors duration-300 group-hover:scale-110 transform">
                {icon}
            </span>

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-orange-vibrant animate-ping opacity-0 group-hover:opacity-20" />
        </a>
    );
};

// ─── Footer Link Component ─────────────────────────────────────────────────────
const FooterLink = ({ children, to, href, external }) => {
    const linkRef = useRef(null);

    useEffect(() => {
        const link = linkRef.current;
        if (!link) return;

        const handleMouseEnter = () => {
            gsap.to(link.querySelector('.link-line'), {
                scaleX: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(link.querySelector('.link-line'), {
                scaleX: 0,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            link.removeEventListener('mouseenter', handleMouseEnter);
            link.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const baseClass = "relative group text-text-muted hover:text-orange-vibrant transition-colors duration-300 text-sm flex items-center gap-2";

    const inner = (
        <>
            <span className="link-line w-3 h-px bg-orange-vibrant origin-left scale-x-0" />
            <span className="relative">
                {children}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-orange-vibrant group-hover:w-full transition-all duration-300" />
            </span>
        </>
    );

    if (to) return <Link ref={linkRef} to={to} className={baseClass}>{inner}</Link>;
    if (external) return <a ref={linkRef} href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>{inner}</a>;
    return <span ref={linkRef} className={`${baseClass} cursor-pointer`}>{inner}</span>;
};

// ─── Newsletter Component ──────────────────────────────────────────────────────
const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="footer-col lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-pure-white">
                Stay Updated
            </h4>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
                Get monthly insights on technical strategy, AI integration, and scaling systems.
            </p>
            
            <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-5 py-3.5 bg-[#151a1d] border-2 border-orange-vibrant/20 rounded-lg text-pure-white placeholder:text-text-muted focus:border-orange-vibrant focus:outline-none transition-colors duration-300 text-sm"
                        disabled={status === 'loading'}
                    />
                    <button
                        ref={btnRef}
                        type="submit"
                        disabled={status === 'loading'}
                        className="relative px-6 py-3.5 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-cream transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg shadow-orange-vibrant/30"
                    >
                        {/* Shine effect */}
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        
                        <span className="relative z-10">
                            {status === 'loading' ? '...' : status === 'success' ? '✓' : '→'}
                        </span>
                    </button>
                </div>

                {status === 'success' && (
                    <p className="text-green-500 text-xs mt-2 animate-fadeIn">
                        Thanks! Check your inbox.
                    </p>
                )}
            </form>
        </div>
    );
};

// ─── Main Footer Component ─────────────────────────────────────────────────────
const Footer = () => {
    const footerRef = useRef(null);
    const headingRef = useRef(null);
    const [textSplit, setTextSplit] = useState(null);
    const currentYear = new Date().getFullYear();

    // Text Reveal Animation for the first part
    useEffect(() => {
        const heading = document.querySelector('.footer-main-heading');
        if (heading && !textSplit) {
            const split = new SplitType(heading, { types: 'words' });
            setTextSplit(split);
            gsap.from(split.words, {
                opacity: 0,
                y: 30,
                rotationX: -45,
                transformOrigin: 'top center',
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    once: true,
                },
            });
        }
        return () => {
            if (textSplit) textSplit.revert();
        };
    }, [textSplit]);

    // Stagger reveal for footer columns
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.footer-col', {
                opacity: 0,
                y: 40,
                stagger: 0.12,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 85%',
                    once: true,
                },
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    const socials = [
        {
            label: 'LinkedIn',
            url: '#',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            ),
        },
        {
            label: 'Instagram',
            url: '#',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            label: 'Twitter',
            url: '#',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            ),
        },
    ];

    return (
        <ParallaxProvider>
            <footer ref={footerRef} className="relative bg-deep-black border-t-2 border-orange-vibrant/20 pt-24 pb-12 overflow-hidden">
                {/* Background effects same as before */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    {/* ── Top: Brand Statement ── */}
                    <div className="mb-20 pb-16 border-b-2 border-orange-vibrant/20">
                        <Parallax speed={-5}>
                            <div className="max-w-3xl">
                                <p className="inline-block px-4 py-1.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-widest rounded-full mb-6 backdrop-blur-sm">
                                    <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />
                                    Enterprise Solutions
                                </p>
                                
                                {/* FIX: SplitType only on first line, Gradient on separate h3 to avoid contrast break */}
                                <h3 ref={headingRef} className="footer-main-heading text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white leading-tight perspective-1000">
                                    Systems that scale.
                                </h3>
                                <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight mt-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        display: 'block',
                                    }}
                                >
                                    Results you can verify.
                                </h3>
                            </div>
                        </Parallax>
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                        {/* Brand Column */}
                        <div className="footer-col lg:col-span-3">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
                                <div className="mb-6 flex items-center gap-3 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-orange-vibrant/30 group-hover:border-orange-vibrant transition-colors duration-300 shadow-lg">
                                        <img src="/logo.jpeg" alt="DDW Agency Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-white font-heading font-bold tracking-tight text-xl block leading-none group-hover:text-orange-vibrant transition-colors">
                                            DDW{' '}
                                            <span
                                                style={{
                                                    background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                }}
                                            >
                                                Agency
                                            </span>
                                        </span>
                                        <span className="text-text-muted text-xs uppercase tracking-wider">Enterprise Solutions</span>
                                    </div>
                                </div>
                            </Tilt>

                            <p className="text-text-muted text-sm leading-relaxed mb-8">
                                High-margin technical consulting and production-ready software systems for enterprise brands.
                            </p>

                            <div className="flex gap-3">
                                {socials.map((s, i) => (
                                    <MagneticSocial key={i} {...s} />
                                ))}
                            </div>
                        </div>

                        {/* Services Column */}
                        <div className="footer-col lg:col-span-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-pure-white flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-orange-vibrant" />
                                Our Focus
                            </h4>
                            <ul className="space-y-4">
                                {['Custom Software', 'AI Integration', 'Marketing Tech', 'Strategic Advisory'].map((item) => (
                                    <li key={item}>
                                        <FooterLink>{item}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Links Column */}
                        <div className="footer-col lg:col-span-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-pure-white flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-orange-vibrant" />
                                Quick Links
                            </h4>
                            <ul className="space-y-4">
                                <li><FooterLink to="/projects">Portfolio</FooterLink></li>
                                <li><FooterLink to="/about">Our Approach</FooterLink></li>
                                <li><FooterLink href="https://ddwstudio.com" external>Visit DDW Studio</FooterLink></li>
                                <li><FooterLink href="https://calendly.com/digi-dreamworks/onboarding-call" external>Book a Call</FooterLink></li>
                            </ul>
                        </div>

                        {/* Offices Column */}
                        <div className="footer-col lg:col-span-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-pure-white flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-orange-vibrant" />
                                Offices
                            </h4>
                            <ul className="space-y-6">
                                {[
                                    { code: 'IT', city: 'Rome', country: 'Italy' },
                                    { code: 'US', city: 'Florida', country: 'USA' },
                                ].map((office) => (
                                    <li key={office.code} className="flex items-start gap-3 group cursor-default">
                                        <div className="w-10 h-10 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-[10px] text-orange-vibrant font-black mt-0.5 group-hover:bg-orange-vibrant group-hover:text-deep-black group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                                            {office.code}
                                        </div>
                                        <div>
                                            <div className="text-pure-white text-sm font-bold group-hover:text-orange-vibrant transition-colors">
                                                {office.city}
                                            </div>
                                            <div className="text-text-muted text-xs">{office.country}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <Newsletter />
                    </div>

                    {/* ── Bottom Bar ── */}
                    <div className="pt-8 border-t-2 border-orange-vibrant/20 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-text-muted text-sm">
                            © {currentYear}{' '}
                            <span className="text-orange-vibrant font-bold">DDW Agency</span>. All rights reserved.
                        </p>
                        <div className="flex gap-8 text-sm">
                            {['Privacy Policy', 'Terms & Conditions'].map((item) => (
                                <span
                                    key={item}
                                    className="relative text-text-muted hover:text-orange-vibrant cursor-pointer transition-colors duration-300 group"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-orange-vibrant group-hover:w-full transition-all duration-300" />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .perspective-1000 {
                        perspective: 1000px;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.5s ease-out;
                    }
                `}</style>
            </footer>
        </ParallaxProvider>
    );
};

export default Footer;