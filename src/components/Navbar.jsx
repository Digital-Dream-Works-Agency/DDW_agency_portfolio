// src/components/Navbar/index.jsx
// DDW Portfolio — Navbar | Agency-Grade UI | Original Links Preserved

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_LINKS = Object.freeze([
  { name: 'Home',         path: '/'             },
  { name: 'Services',     path: '/services'     },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Portfolio',    path: '/projects'     },
  { name: 'About',        path: '/about'        },
  { name: 'Contact',      path: '/contact'      },
])

const BRAND = Object.freeze({
  orange: '#FF570F',
  accent: '#FDE87A',
  bg:     '#080a0c',
})

const ACCENT_COLORS = ['#FF570F', '#EE7D1D', '#FDE87A']

const CALENDLY = 'https://calendly.com/digi-dreamworks/onboarding-call'

// ─── Active route matching ────────────────────────────────────────────────────
function isRouteActive(linkPath, currentPath) {
  if (linkPath === '/') return currentPath === '/'
  return currentPath === linkPath || currentPath.startsWith(linkPath + '/')
}

// ─── Arrow Icon ───────────────────────────────────────────────────────────────
const ArrowIcon = memo(() => (
  <svg
    width="11" height="11" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    aria-hidden="true"
    className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
))
ArrowIcon.displayName = 'ArrowIcon'

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
        background: 'rgba(255,255,255,0.5)',
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
  const menuLinksRef = useRef([])

  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  // ── Close mobile on route change ───────────────────────────────────────────
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // ── Active check ───────────────────────────────────────────────────────────
  const isActive = useCallback(
    (path) => isRouteActive(path, pathname),
    [pathname],
  )

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleHomeClick = useCallback((e) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname])

  const closeMobile  = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  // ── GSAP: Entrance + Scroll ────────────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nav,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.05 },
      )

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        onUpdate: (s) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${s.progress})`
          }
        },
      })

      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        onEnter: () => {
          gsap.to(nav, {
            backgroundColor: 'rgba(10,10,10,0.85)',
            borderBottomColor: 'rgba(255,87,15,0.20)',
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          if (progressRef.current?.parentElement) {
            gsap.to(progressRef.current.parentElement, { opacity: 1, duration: 0.3 })
          }
        },
        onLeaveBack: () => {
          gsap.to(nav, {
            backgroundColor: 'rgba(0,0,0,0)',
            borderBottomColor: 'rgba(255,87,15,0.05)',
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          if (progressRef.current?.parentElement) {
            gsap.to(progressRef.current.parentElement, { opacity: 0, duration: 0.3 })
          }
        },
      })
    }, nav)

    return () => ctx.revert()
  }, [])

  // ── Magnetic CTA ───────────────────────────────────────────────────────────
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (hover: hover)', () => {
      const el = ctaRef.current
      if (!el) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' })

      const onMove  = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width  / 2) * 0.22)
        yTo((e.clientY - r.top  - r.height / 2) * 0.22)
      }
      const onEnter = () => { el.style.willChange = 'transform' }
      const onLeave = () => { xTo(0); yTo(0); el.style.willChange = 'auto' }

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
  useEffect(() => {
    const overlay  = overlayRef.current
    const backdrop = backdropRef.current
    if (!overlay || !backdrop) return

    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      gsap.to(backdrop, { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' })
      gsap.set(overlay, { display: 'flex', x: '100%' })
      gsap.to(overlay, { x: '0%', duration: 0.6, ease: 'expo.out' })

      const validLinks = menuLinksRef.current.filter(Boolean)
      if (validLinks.length > 0) {
        gsap.fromTo(
          validLinks,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.055, delay: 0.2 },
        )
      }
    } else {
      document.body.style.overflow = ''
      gsap.to(backdrop, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.out' })
      gsap.to(overlay, {
        x: '100%',
        duration: 0.4,
        ease: 'expo.in',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }

    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const setMenuLinkRef = useCallback(
    (index) => (el) => { menuLinksRef.current[index] = el },
    [],
  )

  return (
    <>
      {/* ── Main nav ──────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] will-change-transform"
        aria-label="Main navigation"
        style={{
          padding: '18px 0',
          background: 'rgba(0,0,0,0)',
          borderBottom: '1px solid rgba(255,87,15,0.05)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.02)',
          transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-4">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="group flex items-center gap-3 shrink-0 z-[110]"
            style={{ textDecoration: 'none' }}
            aria-label="DDW Agency — Home"
          >
            <div className="relative w-9 h-9 shrink-0">
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 20px rgba(255,87,15,0.35)' }}
              />
              <div
                className="relative w-full h-full rounded-lg overflow-hidden"
                style={{ border: '1.5px solid rgba(255,87,15,0.35)' }}
              >
                <img
                  src="/logo.jpeg"
                  alt=""
                  width="36" height="36"
                  className="w-full h-full object-cover block"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(255,87,15,0.15) 0%, transparent 60%)' }}
                />
              </div>
            </div>

            <div className="flex flex-col leading-none gap-[3px]">
              <span className="text-base font-bold tracking-tight text-white">
                DDW
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #FF570F, #FDE87A)' }}
                >
                  {' '}Agency
                </span>
              </span>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                Digital Dreamworks
              </span>
            </div>
          </Link>

          {/* ── Desktop links ─────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.path)
              return (
                <Link
                  key={l.name}
                  to={l.path}
                  onClick={l.path === '/' ? handleHomeClick : undefined}
                  className="relative px-3 py-2 text-sm font-semibold tracking-wider
                             transition-colors duration-[250ms] hover:text-white"
                  style={{
                    color: active ? BRAND.orange : 'rgba(255,255,255,0.45)',
                    textDecoration: 'none',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  {l.name}
                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: BRAND.orange }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Right side ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">

            {/* CTA — clip-path polygon */}
            <a
              ref={ctaRef}
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden lg:inline-flex items-center gap-2 text-xs font-bold
                         uppercase tracking-wider transition-shadow duration-300
                         hover:shadow-[0_0_30px_rgba(255,87,15,0.4)]"
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #FF570F, #EE7D1D)',
                color: '#080a0c',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                textDecoration: 'none',
              }}
            >
              Book a Call
              <ArrowIcon />
            </a>

            <HamburgerButton open={mobileOpen} onToggle={toggleMobile} />
          </div>
        </div>

        {/* ── Scroll progress bar ───────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{ opacity: 0, background: 'rgba(255,255,255,0.04)' }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left will-change-transform"
            style={{
              background: `linear-gradient(to right, ${BRAND.orange}, ${BRAND.accent})`,
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </nav>

      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        id="mobile-nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-[99] flex-col will-change-transform overflow-y-auto"
        style={{
          display: 'none',
          background: 'rgba(8,10,12,0.98)',
          borderLeft: '1px solid rgba(255,87,15,0.10)',
        }}
      >
        {/* Top bar */}
        <div className="absolute top-7 left-8 right-8 flex items-center justify-between">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.18)' }}
          >
            Navigation
          </span>
          <div className="flex gap-1">
            {ACCENT_COLORS.map((c) => (
              <span
                key={c}
                className="w-2 h-2 rounded-full"
                style={{ background: c, opacity: 0.5 }}
              />
            ))}
          </div>
        </div>

        {/* Decorative orb */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF570F 0%, transparent 70%)',
            opacity: 0.06,
          }}
        />

        {/* Nav links */}
        <div className="flex flex-col gap-0 my-auto pt-24 pb-10 px-8 sm:px-12">
          {NAV_LINKS.map((l, i) => {
            const active = isActive(l.path)
            return (
              <div
                key={l.name}
                ref={setMenuLinkRef(i)}
                className="border-b py-5"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <Link
                  to={l.path}
                  onClick={(e) => {
                    if (l.path === '/') handleHomeClick(e)
                    closeMobile()
                  }}
                  className="flex items-center justify-between group"
                  style={{ textDecoration: 'none' }}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className="text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-white"
                    style={{ color: active ? BRAND.orange : 'rgba(255,255,255,0.8)' }}
                  >
                    {l.name}
                  </span>
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
                    style={{ color: BRAND.orange }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )
          })}

          {/* Mobile CTAs */}
          <div
            ref={setMenuLinkRef(NAV_LINKS.length)}
            className="mt-8 flex flex-col gap-3"
          >
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2.5 w-full py-4 text-xs font-bold
                         uppercase tracking-widest transition-shadow duration-300
                         hover:shadow-[0_0_30px_rgba(255,87,15,0.3)]"
              style={{
                background: 'linear-gradient(135deg, #FF570F, #EE7D1D)',
                color: '#080a0c',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                textDecoration: 'none',
              }}
            >
              Book a Strategy Call
              <ArrowIcon />
            </a>


          </div>
        </div>

        {/* Bottom strip */}
        <div className="absolute bottom-7 left-8 right-8 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.18)', margin: 0 }}>
            Rome, Italy · Florida, USA
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,87,15,0.35)', margin: 0 }}>
            © 2026 DDW
          </p>
        </div>
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        ref={backdropRef}
        onClick={closeMobile}
        aria-hidden="true"
        className="fixed inset-0 z-[98] cursor-pointer"
        style={{
          background: 'rgba(0,0,0,0.65)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

export default Navbar