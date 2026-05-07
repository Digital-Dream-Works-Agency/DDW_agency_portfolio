// src/components/Navbar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Hook ──────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * strength);
            yTo((e.clientY - r.top - r.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Nav links config ───────────────────────────────────────────────────────────
const NAV_LINKS = [
    { name: 'Home',         path: '/' },
    { name: 'Services',     path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Portfolio',    path: '/projects' },
    { name: 'About',        path: '/about' },
    { name: 'Contact',      path: '/contact' },
];

// ─── Navbar ─────────────────────────────────────────────────────────────────────
const Navbar = () => {
    const navRef        = useRef(null);
    const progressRef   = useRef(null);
    const overlayRef    = useRef(null);
    const menuLinksRef  = useRef([]);
    const ctaRef        = useRef(null);
    const scrollTriggerRef = useRef(null);   // ← store ST instance to kill only ours

    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled]     = useState(false);
    const location = useLocation();

    useMagnetic(ctaRef, 0.22);

    const isActive = useCallback(
        (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path),
        [location.pathname]
    );

    // ── Close mobile on route change
    useEffect(() => { setMobileOpen(false); }, [location]);

    // ── Navbar intro + scroll-based style  (kills only OUR ST instance)
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        gsap.fromTo(nav,
            { yPercent: -100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.1 }
        );

        // Scroll progress bar
        const progressST = ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.15,
            onUpdate: (self) => {
                if (progressRef.current) {
                    gsap.set(progressRef.current, { scaleX: self.progress });
                }
            },
        });

        // Scroll appearance
        const appearST = ScrollTrigger.create({
            start: 'top -40',
            end: 99999,
            onEnter:     () => setScrolled(true),
            onLeaveBack: () => setScrolled(false),
        });

        scrollTriggerRef.current = [progressST, appearST];

        return () => {
            // Only kill OUR triggers — not every ST on the page
            scrollTriggerRef.current?.forEach(st => st.kill());
        };
    }, []);

    // ── Mobile overlay animation — GSAP only, no Tailwind class conflict
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        if (mobileOpen) {
            // Make visible first so GSAP can animate it
            gsap.set(overlay, { display: 'flex', x: '100%' });
            gsap.to(overlay, { x: '0%', duration: 0.55, ease: 'expo.out' });

            // Stagger links in
            gsap.fromTo(
                menuLinksRef.current.filter(Boolean),
                { x: 32, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.45, ease: 'expo.out', stagger: 0.06, delay: 0.2 }
            );
        } else {
            gsap.to(overlay, {
                x: '100%', duration: 0.45, ease: 'expo.in',
                onComplete: () => gsap.set(overlay, { display: 'none' }),
            });
        }
    }, [mobileOpen]);

    // ── Scroll to top on Home re-click
    const handleHomeClick = (e) => {
        if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };

    return (
        <>
            {/* ── Main nav bar ─────────────────────────────────────────── */}
            <nav
                ref={navRef}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
                    padding: scrolled ? '12px 0' : '20px 0',
                    background: scrolled ? 'rgba(10,11,13,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,87,15,0.14)' : '1px solid transparent',
                    transition: 'padding 0.35s ease, background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
                    willChange: 'transform',
                }}
            >
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

                    {/* ── Logo ───────────────────────────────────────────── */}
                    <Link
                        to="/"
                        onClick={handleHomeClick}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', zIndex: 110, flexShrink: 0 }}
                    >
                        {/* Logo mark */}
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden',
                            border: '1.5px solid rgba(255,87,15,0.4)',
                            flexShrink: 0, transition: 'border-color 0.3s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#FF570F'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,87,15,0.4)'}
                        >
                            <img src="/logo.jpeg" alt="DDW" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>

                        {/* Wordmark — visible sm+ */}
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                                DDW
                                <span style={{ background: 'linear-gradient(90deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {' '}Agency
                                </span>
                            </span>
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '2px', fontWeight: 500 }}>
                                Digital Dreamworks
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop links ──────────────────────────────────── */}
                    <ul style={{ display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }} className="navbar-desktop-links">
                        {NAV_LINKS.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        onClick={link.path === '/' ? handleHomeClick : undefined}
                                        style={{
                                            position: 'relative', display: 'block',
                                            padding: '6px 14px',
                                            fontSize: '13px', fontWeight: active ? 600 : 400,
                                            color: active ? '#FF570F' : 'rgba(255,255,255,0.52)',
                                            textDecoration: 'none', letterSpacing: '0.01em',
                                            transition: 'color 0.22s',
                                        }}
                                        onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                                        onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.52)'; }}
                                    >
                                        {link.name}
                                        {/* Active dot */}
                                        {active && (
                                            <span style={{
                                                position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%)',
                                                width: '4px', height: '4px', borderRadius: '50%', background: '#FF570F',
                                            }} />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* ── Right side ────────────────────────────────────── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        {/* CTA — desktop only */}
                        <a
                            ref={ctaRef}
                            href="https://calendly.com/digi-dreamworks/onboarding-call"
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '7px',
                                padding: '9px 20px',
                                background: '#FF570F', color: '#0A0B0D',
                                fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em',
                                textTransform: 'uppercase', textDecoration: 'none',
                                transition: 'background 0.22s, transform 0.22s',
                                flexShrink: 0,
                            }}
                            className="navbar-cta"
                            onMouseEnter={e => e.currentTarget.style.background = '#e84e0a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#FF570F'}
                        >
                            Book a Call
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>

                        {/* Hamburger — mobile only */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '6px', zIndex: 110, display: 'none', flexDirection: 'column',
                                gap: '5px', alignItems: 'center', justifyContent: 'center',
                            }}
                            className="navbar-hamburger"
                        >
                            <span style={{
                                display: 'block', width: '22px', height: '1.5px',
                                background: '#FF570F',
                                transform: mobileOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none',
                                transition: 'transform 0.3s ease',
                            }} />
                            <span style={{
                                display: 'block', width: '22px', height: '1.5px',
                                background: 'rgba(255,255,255,0.7)',
                                opacity: mobileOpen ? 0 : 1,
                                transform: mobileOpen ? 'scaleX(0)' : 'scaleX(1)',
                                transition: 'opacity 0.2s, transform 0.2s',
                            }} />
                            <span style={{
                                display: 'block', width: '22px', height: '1.5px',
                                background: '#FF570F',
                                transform: mobileOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none',
                                transition: 'transform 0.3s ease',
                            }} />
                        </button>
                    </div>
                </div>

                {/* ── Scroll progress bar ────────────────────────────── */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1.5px',
                    background: 'rgba(255,255,255,0.04)',
                    opacity: scrolled ? 1 : 0, transition: 'opacity 0.35s',
                }}>
                    <div
                        ref={progressRef}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #FF570F, #FDE87A)',
                            transformOrigin: 'left center',
                            scaleX: 0,
                            willChange: 'transform',
                        }}
                    />
                </div>
            </nav>

            {/* ── Mobile overlay ─────────────────────────────────────────── */}
            {/* GSAP controls display/transform — no Tailwind translate class */}
            <div
                ref={overlayRef}
                style={{
                    display: 'none',          // GSAP sets to 'flex' on open
                    position: 'fixed',
                    top: 0, right: 0, bottom: 0,
                    width: 'min(100vw, 420px)',
                    background: 'rgba(10,11,13,0.97)',
                    backdropFilter: 'blur(24px)',
                    borderLeft: '1px solid rgba(255,87,15,0.12)',
                    zIndex: 99,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '40px 48px',
                    boxSizing: 'border-box',
                    willChange: 'transform',
                }}
            >
                {/* Close hint */}
                <div style={{ position: 'absolute', top: '28px', left: '28px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Menu</span>
                </div>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {NAV_LINKS.map((link, i) => {
                        const active = isActive(link.path);
                        return (
                            <li key={link.name} ref={el => menuLinksRef.current[i] = el}
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px', marginBottom: '4px' }}>
                                <Link
                                    to={link.path}
                                    onClick={(e) => { if (link.path === '/') handleHomeClick(e); setMobileOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '16px 0',
                                        fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em',
                                        color: active ? '#FF570F' : 'rgba(255,255,255,0.75)',
                                        textDecoration: 'none', transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                                >
                                    {link.name}
                                    {active && (
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: '#FF570F', flexShrink: 0,
                                        }} />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Mobile CTA */}
                <a
                    href="https://calendly.com/digi-dreamworks/onboarding-call"
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        marginTop: '32px', padding: '16px',
                        background: '#FF570F', color: '#0A0B0D',
                        fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase', textDecoration: 'none',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e84e0a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FF570F'}
                >
                    Book a Strategy Call
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>

                {/* Footer detail */}
                <div style={{ position: 'absolute', bottom: '32px', left: '48px', right: '48px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', margin: 0, letterSpacing: '0.06em' }}>
                        Rome, Italy · Florida, USA
                    </p>
                </div>
            </div>

            {/* ── Backdrop tap-to-close ──────────────────────────────────── */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 98,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
                    }}
                />
            )}

            {/* ── Responsive rules ──────────────────────────────────────── */}
            <style>{`
                @media (min-width: 1024px) {
                    .navbar-desktop-links { display: flex !important; }
                    .navbar-cta           { display: inline-flex !important; }
                    .navbar-hamburger     { display: none !important; }
                }
                @media (max-width: 1023px) {
                    .navbar-desktop-links { display: none !important; }
                    .navbar-cta           { display: none !important; }
                    .navbar-hamburger     { display: flex !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;