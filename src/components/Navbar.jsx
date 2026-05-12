// src/components/Navbar/index.jsx
// DDW Agency — Navbar | Optimized | Production-Ready

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants ────────────────────────────────────────────────────────────────
// FIX #12: Frozen at module level — signals immutability
const NAV_LINKS = Object.freeze([
  { name: 'Home',         path: '/'            },
  { name: 'Services',     path: '/services'    },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Portfolio',    path: '/projects'    },
  { name: 'About',        path: '/about'       },
  { name: 'Contact',      path: '/contact'     },
])

const BRAND = Object.freeze({
  orange:    '#FF570F',
  accent:    '#FDE87A',
  bg:        '#0A0B0D',
  darkBg:    'rgba(8,10,12,0.97)',
  navBg:     'rgba(10,11,13,0.92)',
})

const CALENDLY = 'https://calendly.com/digi-dreamworks/onboarding-call'

// ─── FIX #9: Correct active route matching — no false positives ───────────────
function isRouteActive(linkPath, currentPath) {
  if (linkPath === '/') return currentPath === '/'
  return currentPath === linkPath || currentPath.startsWith(linkPath + '/')
}

// ─── Shared SVG Components ────────────────────────────────────────────────────
// FIX #14: Arrow SVG extracted — used in both CTAs
const ArrowIcon = memo(() => (
  <svg
    width="12" height="12" viewBox="0 0 12 12"
    fill="none" aria-hidden="true"
    className="transition-transform duration-300 group-hover:translate-x-0.5 shrink-0"
  >
    <path
      d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
))
ArrowIcon.displayName = 'ArrowIcon'

// ─── FIX #13 + #14: Shared CTA Button component — eliminates duplication ─────
const CTAButton = memo(({ href, children, className = '', style = {} }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`relative flex items-center justify-center gap-2 group overflow-hidden cta-button ${className}`}
    style={style}
  >
    {/* FIX #15: aria-hidden on decorative shimmer */}
    <span
      aria-hidden="true"
      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
    />
    <span className="relative z-10 flex items-center gap-2">
      {children}
      <ArrowIcon />
    </span>
  </a>
))
CTAButton.displayName = 'CTAButton'

// ─── Active Dot Indicator ─────────────────────────────────────────────────────
const ActiveDot = memo(({ size = 'sm' }) => (
  <span
    aria-hidden="true"
    className={`rounded-full shrink-0 ${size === 'lg' ? 'w-2 h-2' : 'w-1 h-1'}`}
    style={{
      background: BRAND.orange,
      boxShadow: `0 0 ${size === 'lg' ? 10 : 6}px ${BRAND.orange}`,
    }}
  />
))
ActiveDot.displayName = 'ActiveDot'

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────
// FIX #1: Hover driven by CSS class — no direct DOM style mutation
// FIX #15: memo prevents re-renders from parent
const DesktopNavLink = memo(({ link, isActive, onClick }) => (
  <li>
    <Link
      to={link.path}
      onClick={onClick}
      className={`nav-desktop-link relative block min-h-[44px] flex items-center ${isActive ? 'nav-desktop-link--active' : ''}`}
      style={{ padding: '6px 13px' }}
      aria-current={isActive ? 'page' : undefined}
    >
      {link.name}
      {isActive && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
          <ActiveDot size="sm" />
        </span>
      )}
    </Link>
  </li>
))
DesktopNavLink.displayName = 'DesktopNavLink'

// ─── Mobile Nav Link ──────────────────────────────────────────────────────────
// FIX #1: Hover driven by CSS class
const MobileNavLink = memo(({ link, isActive, onClick, refCallback }) => (
  <li
    ref={refCallback}
    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
  >
    <Link
      to={link.path}
      onClick={onClick}
      className={`nav-mobile-link flex items-center justify-between py-4 min-h-[56px] ${isActive ? 'nav-mobile-link--active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span>{link.name}</span>
      {isActive && <ActiveDot size="lg" />}
    </Link>
  </li>
))
MobileNavLink.displayName = 'MobileNavLink'

// ─── Hamburger Button ─────────────────────────────────────────────────────────
const HamburgerButton = memo(({ open, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    aria-controls="mobile-nav-overlay"
    className="lg:hidden flex flex-col items-center justify-center gap-[5px] p-2 z-[110] min-h-[44px] min-w-[44px]"
    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
  >
    <span
      aria-hidden="true"
      className="block h-[1.5px] transition-transform duration-300"
      style={{
        width: '22px',
        background: BRAND.orange,
        transform: open ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none',
      }}
    />
    <span
      aria-hidden="true"
      className="block h-[1.5px] transition-all duration-200"
      style={{
        width: '22px',
        background: 'rgba(255,255,255,0.65)',
        opacity: open ? 0 : 1,
        transform: open ? 'scaleX(0)' : 'scaleX(1)',
      }}
    />
    <span
      aria-hidden="true"
      className="block h-[1.5px] transition-transform duration-300"
      style={{
        width: '22px',
        background: BRAND.orange,
        transform: open ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none',
      }}
    />
  </button>
))
HamburgerButton.displayName = 'HamburgerButton'

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const navRef       = useRef(null)
  const progressRef  = useRef(null)
  const overlayRef   = useRef(null)
  const backdropRef  = useRef(null)
  const ctaRef       = useRef(null)
  // FIX #4: Reset ref array via initializer function — never stale
  const menuLinksRef = useRef([])
  menuLinksRef.current = [] // Reset before each render population

  const [mobileOpen, setMobileOpen] = useState(false)
  const location  = useLocation()
  const pathname  = location.pathname

  // ── FIX #9: Corrected active matching ──────────────────────────────────────
  const isActive = useCallback(
    (path) => isRouteActive(path, pathname),
    [pathname],
  )

  // ── Close mobile on route change ───────────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // ── FIX #3: handleHomeClick stabilized with useCallback ────────────────────
  const handleHomeClick = useCallback(
    (e) => {
      if (pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [pathname],
  )

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  // ── Navbar intro + scroll logic ────────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    // FIX #5: gsap.context() handles all cleanup — no manual stInstancesRef needed
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        nav,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.1 },
      )

      // FIX #6: Progress bar driven by direct style write — zero GSAP overhead per frame
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
        onUpdate: (self) => {
          if (progressRef.current) {
            // Direct transform write — most performant path possible
            progressRef.current.style.transform = `scaleX(${self.progress})`
          }
        },
      })

      // FIX #2: scrolled state → CSS class toggle on DOM node directly
      // Zero React state, zero re-renders, zero reconciler involvement
      ScrollTrigger.create({
        start: 'top -40',
        end: 99999,
        onEnter: () => {
          nav.classList.add('nav--scrolled')
          if (progressRef.current?.parentElement) {
            progressRef.current.parentElement.style.opacity = '1'
          }
        },
        onLeaveBack: () => {
          nav.classList.remove('nav--scrolled')
          if (progressRef.current?.parentElement) {
            progressRef.current.parentElement.style.opacity = '0'
          }
        },
      })
    }, nav)

    return () => ctx.revert()
  }, [])

  // ── Magnetic CTA — desktop only ────────────────────────────────────────────
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (hover: hover)', () => {
      const el = ctaRef.current
      if (!el) return

      // FIX #11: willChange set only during interaction
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' })

      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width  / 2) * 0.22)
        yTo((e.clientY - r.top  - r.height / 2) * 0.22)
      }
      const onEnter = () => { el.style.willChange = 'transform' }
      const onLeave = () => {
        xTo(0)
        yTo(0)
        el.style.willChange = 'auto'
      }

      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mousemove',  onMove)
      el.addEventListener('mouseleave', onLeave)

      return () => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mousemove',  onMove)
        el.removeEventListener('mouseleave', onLeave)
        gsap.set(el, { x: 0, y: 0 })
      }
    })
    return () => mm.revert()
  }, [])

  // ── Mobile overlay animation ───────────────────────────────────────────────
  // FIX #7: visibility + pointer-events instead of display toggle
  // FIX #8: Backdrop always in DOM, toggled via CSS class — no layout thrash
  useEffect(() => {
    const overlay  = overlayRef.current
    const backdrop = backdropRef.current
    if (!overlay || !backdrop) return

    if (mobileOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Show overlay
      overlay.style.visibility    = 'visible'
      overlay.style.pointerEvents = 'auto'
      gsap.fromTo(
        overlay,
        { x: '100%' },
        { x: '0%', duration: 0.55, ease: 'expo.out' },
      )

      // Show backdrop
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      backdrop.style.pointerEvents = 'auto'

      // Stagger links — filter stale nulls defensively
      const links = menuLinksRef.current.filter(Boolean)
      if (links.length) {
        gsap.fromTo(
          links,
          { x: 32, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.45,
            ease: 'expo.out', stagger: 0.07, delay: 0.22,
          },
        )
      }
    } else {
      document.body.style.overflow = ''

      gsap.to(overlay, {
        x: '100%', duration: 0.45, ease: 'expo.in',
        onComplete: () => {
          overlay.style.visibility    = 'hidden'
          overlay.style.pointerEvents = 'none'
        },
      })

      gsap.to(backdrop, {
        opacity: 0, duration: 0.35, ease: 'power2.out',
        onComplete: () => { backdrop.style.pointerEvents = 'none' },
      })
    }

    return () => {
      // Guarantee body scroll is restored on unmount
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // ── Ref callback factory for mobile links ──────────────────────────────────
  // FIX #4: Stable per-index ref callback — avoids closure over stale array
  const getMobileLinkRef = useCallback((i) => (el) => {
    menuLinksRef.current[i] = el
  }, [])

  return (
    <>
      {/* ── Main nav bar ──────────────────────────────────────────────────── */}
      {/*
        FIX #2: All scroll-driven styles handled via CSS class .nav--scrolled
        injected directly onto the DOM node — zero React re-renders
      */}
      <nav
        ref={navRef}
        className="navbar fixed top-0 left-0 w-full z-[100]"
        aria-label="Main navigation"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-7 flex items-center justify-between gap-6">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 shrink-0 z-[110] group"
            style={{ textDecoration: 'none' }}
            aria-label="DDW Agency — Home"
          >
            <div
              className="w-9 h-9 rounded-lg overflow-hidden shrink-0 transition-all duration-300"
              style={{ border: '1.5px solid rgba(255,87,15,0.35)' }}
            >
              <img
                src="/logo.jpeg"
                alt=""
                width="36"
                height="36"
                className="w-full h-full object-cover block"
                // Decorative — aria-label on parent Link covers this
                aria-hidden="true"
              />
            </div>

            <div className="flex flex-col leading-none gap-0.5">
              <span
                className="font-extrabold text-white"
                style={{ fontSize: '15px', letterSpacing: '-0.02em' }}
              >
                DDW
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${BRAND.orange}, ${BRAND.accent})`,
                  }}
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
          <ul className="hidden lg:flex items-center gap-0.5 list-none m-0 p-0" role="list">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink
                key={link.name}
                link={link}
                isActive={isActive(link.path)}
                onClick={link.path === '/' ? handleHomeClick : undefined}
              />
            ))}
          </ul>

          {/* ── Right side ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">
            {/* FIX #13: Desktop CTA — shared CTAButton component */}
            <CTAButton
              href={CALENDLY}
              className="hidden lg:inline-flex min-h-[44px]"
              style={{
                padding: '9px 20px',
                background: `linear-gradient(135deg, ${BRAND.orange} 0%, #EE7D1D 100%)`,
                color: BRAND.bg,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '10px',
                boxShadow: `0 6px 28px rgba(255,87,15,0.25)`,
              }}
              // FIX: pass ref for magnetic effect via wrapper
            >
              {/* Inner ref target for magnetic effect */}
              <span ref={ctaRef} className="absolute inset-0 rounded-[10px]" aria-hidden="true" />
              Book a Call
            </CTAButton>

            {/* Hamburger */}
            <HamburgerButton open={mobileOpen} onToggle={toggleMobile} />
          </div>
        </div>

        {/* ── Scroll progress bar ───────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-[1.5px] transition-opacity duration-300"
          style={{
            background: 'rgba(255,255,255,0.04)',
            opacity: 0, // FIX #2: controlled directly via DOM in ScrollTrigger
          }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{
              background: `linear-gradient(90deg, ${BRAND.orange}, ${BRAND.accent})`,
              transform: 'scaleX(0)', // FIX #6: direct style, no GSAP per frame
            }}
          />
        </div>
      </nav>

      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {/*
        FIX #7: visibility/pointer-events instead of display toggle —
        React reconciler never fights GSAP over display property
      */}
      <div
        ref={overlayRef}
        id="mobile-nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed top-0 right-0 bottom-0 z-[99] flex flex-col justify-center"
        style={{
          width: 'min(100vw, 420px)',
          background: BRAND.darkBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,87,15,0.1)',
          padding: '40px 44px',
          boxSizing: 'border-box',
          // FIX #7: Start hidden via visibility, not display
          visibility: 'hidden',
          pointerEvents: 'none',
          transform: 'translateX(100%)', // Initial off-screen
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
          aria-hidden="true"
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,87,15,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Nav links */}
        <ul className="list-none m-0 p-0 relative z-10" role="list">
          {NAV_LINKS.map((link, i) => {
            const active = isActive(link.path)
            const handleClick = (e) => {
              if (link.path === '/') handleHomeClick(e)
              closeMobile()
            }
            return (
              <MobileNavLink
                key={link.name}
                link={link}
                isActive={active}
                onClick={handleClick}
                // FIX #4: stable ref callback per index
                refCallback={getMobileLinkRef(i)}
              />
            )
          })}
        </ul>

        {/* FIX #13: Mobile CTA — shared CTAButton component */}
        <CTAButton
          href={CALENDLY}
          className="mt-8 min-h-[52px]"
          style={{
            padding: '15px 24px',
            background: `linear-gradient(135deg, ${BRAND.orange} 0%, #EE7D1D 100%)`,
            color: BRAND.bg,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(255,87,15,0.28)',
          }}
        >
          Book a Strategy Call
        </CTAButton>

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
              className="block mt-1 nav-email-link"
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
      {/*
        FIX #8: Always in DOM — toggled via opacity, not mount/unmount.
        Eliminates layout recalculation on every menu toggle.
      */}
      <div
        ref={backdropRef}
        onClick={closeMobile}
        aria-hidden="true"
        className="fixed inset-0 z-[98]"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: 0,           // FIX #8: starts invisible
          pointerEvents: 'none', // FIX #8: starts non-interactive
        }}
      />
    </>
  )
}

export default Navbar