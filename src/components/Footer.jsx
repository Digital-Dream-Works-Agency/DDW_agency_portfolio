import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Effect (Optimized - Sirf CTA pe) ────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
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
        const onLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { 
            el.removeEventListener('mousemove', onMove); 
            el.removeEventListener('mouseleave', onLeave); 
        };
    }, [strength]);
};

// ─── Trust Badge Component (NEW) ───────────────────────────────────────────────
const TrustBadge = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-vibrant/5 border border-orange-vibrant/10 hover:border-orange-vibrant/30 transition-all duration-300 group">
        <div className="w-10 h-10 rounded-full bg-orange-vibrant/10 flex items-center justify-center text-orange-vibrant group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <div className="text-xs text-text-muted uppercase tracking-wider">{label}</div>
            <div className="text-sm font-bold text-pure-white">{value}</div>
        </div>
    </div>
);

// ─── Social Links (Simplified) ─────────────────────────────────────────────────
const SocialLink = ({ label, url, icon }) => (
    <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label={label}
        className="w-10 h-10 rounded-lg border border-orange-vibrant/20 flex items-center justify-center text-text-muted hover:text-orange-vibrant hover:border-orange-vibrant hover:bg-orange-vibrant/5 transition-all duration-300"
    >
        {icon}
    </a>
);

// ─── Footer Link (Cleaner) ─────────────────────────────────────────────────────
const FooterLink = ({ children, to, href, external }) => {
    const baseClass = "text-text-muted hover:text-orange-vibrant transition-colors duration-200 text-sm inline-block";
    
    if (to) return <Link to={to} className={baseClass}>{children}</Link>;
    if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>{children}</a>;
    return <span className={`${baseClass} cursor-pointer`}>{children}</span>;
};

// ─── Premium CTA Section (NEW) ─────────────────────────────────────────────────
const CTASection = () => {
    const ctaRef = useRef(null);
    useMagneticEffect(ctaRef, 0.15);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-vibrant/10 via-orange-vibrant/5 to-transparent border border-orange-vibrant/20 p-8 md:p-10">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            {/* Gradient Orb */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-vibrant/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-vibrant/10 border border-orange-vibrant/20 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-xs font-semibold text-orange-vibrant uppercase tracking-wider">Limited Slots</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-pure-white mb-2">
                        Ready to scale your systems?
                    </h3>
                    <p className="text-text-muted text-sm max-w-xl">
                        Join 50+ enterprises using our battle-tested frameworks. 30-min strategy call • No commitment required
                    </p>
                </div>
                
                <a 
                    ref={ctaRef}
                    href="https://calendly.com/digi-dreamworks/onboarding-call" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-cream transition-all duration-300 overflow-hidden shadow-xl shadow-orange-vibrant/20 hover:shadow-2xl hover:shadow-orange-vibrant/40 flex-shrink-0"
                >
                    {/* Shine Effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                    
                    <span className="relative z-10 flex items-center gap-2">
                        Book Strategy Call
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                </a>
            </div>
        </div>
    );
};

// ─── Main Footer Component ─────────────────────────────────────────────────────
const Footer = () => {
    const footerRef = useRef(null);
    const currentYear = new Date().getFullYear();

    // Simplified Animation - Sirf ek baar subtle
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.footer-section', {
                opacity: 0, 
                y: 20, 
                duration: 0.6, 
                ease: 'power2.out',
                scrollTrigger: { 
                    trigger: footerRef.current, 
                    start: 'top 90%', 
                    once: true 
                },
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    const socials = [
        { label: 'LinkedIn', url: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> },
        { label: 'Instagram', url: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
        { label: 'Twitter', url: '#', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg> },
    ];

    return (
        <footer ref={footerRef} className="relative bg-deep-black border-t border-orange-vibrant/10 pt-16 pb-8 overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-12">
                
                {/* ─── CTA Section ─────────────────────────────────────────── */}
                <div className="footer-section">
                    <CTASection />
                </div>

                {/* ─── Trust Signals (NEW) ────────────────────────────────── */}
                <div className="footer-section grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TrustBadge 
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        label="Trusted By"
                        value="50+ Brands"
                    />
                    <TrustBadge 
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Projects"
                        value="200+ Done"
                    />
                    <TrustBadge 
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        label="Avg Response"
                        value="< 2 Hours"
                    />
                    <TrustBadge 
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                        label="Satisfaction"
                        value="98% Rate"
                    />
                </div>

                {/* ─── Main Footer Content ────────────────────────────────── */}
                <div className="footer-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pt-8 border-t border-orange-vibrant/10">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-orange-vibrant/20 group-hover:border-orange-vibrant transition-colors">
                                <img src="/logo.jpeg" alt="DDW Agency" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <span className="text-white font-heading font-bold text-lg block leading-none">
                                    DDW <span className="text-orange-vibrant">Agency</span>
                                </span>
                                <span className="text-text-muted text-[10px] uppercase tracking-wider">Enterprise Solutions</span>
                            </div>
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
                            Production-ready software systems and strategic consulting for enterprise brands who demand results.
                        </p>
                        <div className="flex gap-2">
                            {socials.map((s, i) => <SocialLink key={i} {...s} />)}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-pure-white">Services</h4>
                        <ul className="space-y-2.5">
                            {['Custom Software', 'AI Integration', 'Marketing Tech', 'Strategic Advisory'].map((item) => (
                                <li key={item}><FooterLink>{item}</FooterLink></li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-pure-white">Company</h4>
                        <ul className="space-y-2.5">
                            <li><FooterLink to="/about">About Us</FooterLink></li>
                            <li><FooterLink to="/projects">Portfolio</FooterLink></li>
                            <li><FooterLink to="/services">Our Services</FooterLink></li>
                            <li><FooterLink href="https://calendly.com/digi-dreamworks/onboarding-call" external>Contact</FooterLink></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-pure-white">Resources</h4>
                        <ul className="space-y-2.5">
                            <li><FooterLink href="#" external>Case Studies</FooterLink></li>
                            <li><FooterLink href="#" external>Tech Stack</FooterLink></li>
                            <li><FooterLink href="#" external>Blog</FooterLink></li>
                            <li><FooterLink href="#" external>Documentation</FooterLink></li>
                        </ul>
                    </div>

                    {/* Offices */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-pure-white">Offices</h4>
                        <div className="space-y-3">
                            {[
                                { city: 'Rome', country: 'Italy' }, 
                                { city: 'Florida', country: 'USA' }
                            ].map((office) => (
                                <div key={office.city} className="text-sm">
                                    <div className="text-pure-white font-medium">{office.city}</div>
                                    <div className="text-text-muted text-xs">{office.country}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ─── Bottom Bar ─────────────────────────────────────────── */}
                <div className="footer-section pt-6 border-t border-orange-vibrant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p className="text-text-muted">
                        © {currentYear} <span className="text-orange-vibrant font-semibold">DDW Agency</span>. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <FooterLink href="#">Privacy Policy</FooterLink>
                        <FooterLink href="#">Terms of Service</FooterLink>
                        <FooterLink href="#">Cookie Policy</FooterLink>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;