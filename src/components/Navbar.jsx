import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Nav Links Config ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { name: 'Home',         path: '/' },
  { name: 'Services',     path: '/services' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Portfolio',    path: '/projects' },
  { name: 'About',        path: '/about' },
  { name: 'Contact',      path: '/contact' },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const navRef         = useRef(null)
  const progressRef    = useRef(null)
  const overlayRef     = useRef(null)
  const menuLinksRef   = useRef([])
  const ctaRef         = useRef(null)
  const stInstancesRef = useRef([])

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  // Vite/React Router approach for pathname
  const location = useLocation()
  const pathname = location.pathname

  // ── Active state ─────────────────────────────────────────────────────────
  const isActive = useCallback(
    (path) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path),
    [pathname],
  )

  // ── Close mobile on route change ─────────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // ── Navbar intro + scroll logic ──────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // Entrance animation
    gsap.fromTo(
      nav,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.1 },
    )

    // Scroll progress bar
    const progressST = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.15,
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: self.progress })
        }
      },
    })

    // Scroll appearance state
    const appearST = ScrollTrigger.create({
      start: 'top -40',
      end: 99999,
      onEnter:     () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    })

    stInstancesRef.current = [progressST, appearST]

    return () => {
      stInstancesRef.current.forEach((st) => st.kill())
    }
  }, [])

  // ── Magnetic CTA — desktop only ───────────────────────────────────────────
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (hover: hover)', () => {
      const el = ctaRef.current
      if (!el) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' })

      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width  / 2) * 0.22)
        yTo((e.clientY - r.top  - r.height / 2) * 0.22)
      }
      const onLeave = () => { xTo(0); yTo(0) }

      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    })
    return () => mm.revert()
  }, [])

  // ── Mobile overlay animation ──────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    if (mobileOpen) {
      gsap.set(overlay, { display: 'flex', x: '100%' })
      gsap.to(overlay, { x: '0%', duration: 0.55, ease: 'expo.out' })
      gsap.fromTo(
        menuLinksRef.current.filter(Boolean),
        { x: 32, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: 'expo.out', stagger: 0.07, delay: 0.22 },
      )
    } else {
      gsap.to(overlay, {
        x: '100%',
        duration: 0.45,
        ease: 'expo.in',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
  }, [mobileOpen])

  // ── Scroll-to-top on Home re-click ────────────────────────────────────────
  const handleHomeClick = (e) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ── Main nav bar ──────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] will-change-transform"
        style={{
          padding: scrolled ? '10px 0' : '18px 0',
          background: scrolled
            ? 'rgba(10,11,13,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(255,87,15,0.14)'
            : '1px solid transparent',
          transition:
            'padding 0.35s ease, background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-7 flex items-center justify-between gap-6">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 shrink-0 z-[110] group"
            style={{ textDecoration: 'none' }}
          >
            {/* Logo mark */}
            <div
              className="w-9 h-9 rounded-lg overflow-hidden shrink-0 transition-all duration-300"
              style={{
                border: '1.5px solid rgba(255,87,15,0.35)',
              }}
            >
              <img
                src="/logo.jpeg"
                alt="DDW Agency"
                width="36"
                height="36"
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none gap-0.5">
              <span
                className="font-extrabold text-white"
                style={{ fontSize: '15px', letterSpacing: '-0.02em' }}
              >
                DDW
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #FF570F, #FDE87A)' }}
                >
                  {' '}Agency
                </span>
              </span>
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: '8px',
                  color: 'rgba(255,255,255,0.28)',
                  letterSpacing: '0.18em',
                }}
              >
                Digital Dreamworks
              </span>
            </div>
          </Link>

          {/* ── Desktop links ─────────────────────────────────────────────── */}
          <ul className="hidden lg:flex items-center gap-0.5 list-none m-0 p-0">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.path)
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={link.path === '/' ? handleHomeClick : undefined}
                    className="relative block transition-colors duration-200 min-h-[44px] flex items-center"
                    style={{
                      padding: '6px 13px',
                      fontSize: '13px',
                      fontWeight: active ? 600 : 400,
                      color: active ? '#FF570F' : 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget).style.color = 'rgba(255,255,255,0.92)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget).style.color = 'rgba(255,255,255,0.5)'
                    }}
                  >
                    {link.name}
                    {/* Active dot indicator */}
                    {active && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#FF570F', boxShadow: '0 0 6px #FF570F' }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* ── Right side ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Desktop CTA */}
            <a
              ref={ctaRef}
              href="https://calendly.com/digi-dreamworks/onboarding-call"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 will-change-transform group overflow-hidden relative min-h-[44px]"
              style={{
                padding: '9px 20px',
                background: 'linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%)',
                color: '#0A0B0D',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '10px',
                boxShadow: '0 6px 28px rgba(255,87,15,0.25)',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget).style.boxShadow = '0 8px 36px rgba(255,87,15,0.4)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget).style.boxShadow = '0 6px 28px rgba(255,87,15,0.25)'
              }}
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                Book a Call
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path
                    d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="lg:hidden flex flex-col items-center justify-center gap-[5px] p-2 z-[110] min-h-[44px] min-w-[44px]"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span
                className="block h-[1.5px] bg-[#FF570F] transition-transform duration-300"
                style={{
                  width: '22px',
                  transform: mobileOpen
                    ? 'rotate(45deg) translate(4.5px, 4.5px)'
                    : 'none',
                }}
              />
              <span
                className="block h-[1.5px] transition-all duration-200"
                style={{
                  width: '22px',
                  background: 'rgba(255,255,255,0.65)',
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? 'scaleX(0)' : 'scaleX(1)',
                }}
              />
              <span
                className="block h-[1.5px] bg-[#FF570F] transition-transform duration-300"
                style={{
                  width: '22px',
                  transform: mobileOpen
                    ? 'rotate(-45deg) translate(4.5px, -4.5px)'
                    : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Scroll progress bar ───────────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 w-full h-[1.5px] transition-opacity duration-300"
          style={{
            background: 'rgba(255,255,255,0.04)',
            opacity: scrolled ? 1 : 0,
          }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left will-change-transform"
            style={{
              background: 'linear-gradient(90deg, #FF570F, #FDE87A)',
              scaleX: 0,
            }}
          />
        </div>
      </nav>

      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="fixed top-0 right-0 bottom-0 z-[99] flex-col justify-center will-change-transform"
        style={{
          display: 'none',
          width: 'min(100vw, 420px)',
          background: 'rgba(8,10,12,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,87,15,0.1)',
          padding: '40px 44px',
          boxSizing: 'border-box',
        }}
      >
        {/* Menu label */}
        <div className="absolute top-7 left-7">
          <span
            className="font-bold uppercase"
            style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.18)',
              letterSpacing: '0.22em',
            }}
          >
            Navigation
          </span>
        </div>

        {/* Decorative orb */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,87,15,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Nav links */}
        <ul className="list-none m-0 p-0 relative z-10">
          {NAV_LINKS.map((link, i) => {
            const active = isActive(link.path)
            return (
              <li
                key={link.name}
                ref={(el) => { menuLinksRef.current[i] = el }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Link
                  to={link.path}
                  onClick={(e) => {
                    if (link.path === '/') handleHomeClick(e)
                    setMobileOpen(false)
                  }}
                  className="flex items-center justify-between py-4 transition-colors duration-200 min-h-[56px]"
                  style={{
                    fontSize: 'clamp(22px, 5vw, 30px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: active ? '#FF570F' : 'rgba(255,255,255,0.72)',
                    textDecoration: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget).style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget).style.color = 'rgba(255,255,255,0.72)'
                  }}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: '#FF570F', boxShadow: '0 0 10px #FF570F' }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile CTA */}
        <a
          href="https://calendly.com/digi-dreamworks/onboarding-call"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="relative flex items-center justify-center gap-2 mt-8 group overflow-hidden min-h-[52px]"
          style={{
            padding: '15px 24px',
            background: 'linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%)',
            color: '#0A0B0D',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(255,87,15,0.28)',
          }}
        >
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2">
            Book a Strategy Call
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        {/* Contact info strip */}
        <div className="absolute bottom-8 left-11 right-11">
          <div
            className="pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p
              className="font-mono"
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.1em',
                margin: 0,
              }}
            >
              Rome, Italy · Florida, USA
            </p>
            <a
              href="mailto:hello@digitaldreamworksagency.com"
              className="block mt-1 transition-colors duration-200 hover:text-[#FF570F]"
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.06em',
                textDecoration: 'none',
              }}
            >
              hello@digitaldreamworksagency.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Backdrop tap-to-close ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[98]"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
      )}
    </>
  )
}

export default Navbar
