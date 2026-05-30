// src/components/Footer/index.jsx
// DDW Portfolio — Premium Footer | Agency UI | Original Functionality Preserved

import React, { useEffect, useRef, useCallback, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const B = Object.freeze({
  orange:     '#FF570F',
  orangeSoft: '#EE7D1D',
  accent:     '#FDE87A',
  bg:         '#080a0c',
  bgCard:     '#0d1012',
  bgCardAlt:  '#0a0c0e',
})

// ─── Module-Level Singletons ──────────────────────────────────────────────────
const touchQuery =
  typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : null

let _isTouch =
  typeof window !== 'undefined'
    ? touchQuery.matches || navigator.maxTouchPoints > 0
    : false

if (touchQuery) {
  touchQuery.addEventListener('change', (e) => {
    _isTouch = e.matches || navigator.maxTouchPoints > 0
  })
}

const getIsTouch = () => _isTouch
const CURRENT_YEAR = new Date().getFullYear()

// ─── Static Data ──────────────────────────────────────────────────────────────
const NAV = Object.freeze({
  services: [
    { label: 'Meta Ads',    href: '/services' },
    { label: 'Google Ads',  href: '/services' },
    { label: 'Amazon',      href: '/services' },
    { label: 'TikTok Shop', href: '/services' },
    { label: 'SEO',         href: '/services' },
    { label: 'AI SaaS',     href: '/services' },
  ],
  company: [
    { label: 'About Us',  href: '/about'     },
    { label: 'Portfolio', href: '/projects'  },
    { label: 'Services',  href: '/services'  },
    {
      label: 'Contact',
      href: 'https://calendly.com/digi-dreamworks/onboarding-call',
      external: true,
    },
  ],
  resources: [
    { label: 'Case Studies',  href: '#', external: true },
    { label: 'Tech Stack',    href: '#', external: true },
    { label: 'Blog',          href: '#', external: true },
    { label: 'Documentation', href: '#', external: true },
  ],
  legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy',    href: '#' },
  ],
})

const OFFICES = Object.freeze([
  { city: 'Rome',    country: 'Italy', flag: '🇮🇹' },
  { city: 'Florida', country: 'USA',   flag: '🇺🇸' },
])

const TRUST = Object.freeze([
  { value: '50+',  label: 'Brands',       sub: 'Active retainers'   },
  { value: '200+', label: 'Projects',     sub: 'Delivered on time'  },
  { value: '<2hr', label: 'Response',     sub: 'Average SLA'        },
  { value: '98%',  label: 'Satisfaction', sub: 'Client retention'   },
])

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconLinkedIn = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const IconInstagram = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const IconX = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const SOCIALS = Object.freeze([
  { label: 'LinkedIn',    href: 'https://linkedin.com',  Icon: IconLinkedIn  },
  { label: 'Instagram',   href: 'https://instagram.com', Icon: IconInstagram },
  { label: 'X / Twitter', href: 'https://x.com',         Icon: IconX         },
])

// ─── Magnetic hook ────────────────────────────────────────────────────────────
function useMagneticEffect(strength = 0.35) {
  const ref  = useRef(null)
  const xTo  = useRef(null)
  const yTo  = useRef(null)

  useEffect(() => {
    if (getIsTouch() || !ref.current) return

    xTo.current = gsap.quickTo(ref.current, 'x', { duration: 0.4, ease: 'power2.out' })
    yTo.current = gsap.quickTo(ref.current, 'y', { duration: 0.4, ease: 'power2.out' })

    const el = ref.current
    const onEnter = () => { el.style.willChange = 'transform' }
    const onLeave = () => { el.style.willChange = 'auto' }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (getIsTouch() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    xTo.current?.((e.clientX - (rect.left + rect.width  / 2)) * strength)
    yTo.current?.((e.clientY - (rect.top  + rect.height / 2)) * strength)
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    if (getIsTouch()) return
    xTo.current?.(0)
    yTo.current?.(0)
  }, [])

  return { ref, handleMouseMove, handleMouseLeave }
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = memo(() => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticEffect(0.28)

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col md:flex-row
                 items-center justify-between gap-8 text-center md:text-left"
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 'clamp(32px, 5vw, 56px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}
    >
      {/* Orb */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${B.orange}28 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${B.orange}50, ${B.accent}20, transparent)`,
        }}
      />

      {/* Copy */}
      <div className="relative z-10">
        <h3
          className="font-bold tracking-tight mb-4 text-3xl md:text-4xl"
          style={{
            background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.55))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Ready to scale{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${B.orange} 0%, ${B.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            your systems?
          </span>
        </h3>
        <p
          className="text-base leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 480,
          }}
        >
          Book a 30-min strategy call. No commitment. We'll tell you what's broken
          and if DDW is the right fit.
        </p>
      </div>

      {/* CTA */}
      <div className="relative z-10 w-full md:w-auto shrink-0">
        <a
          ref={ref}
          href="https://calendly.com/digi-dreamworks/onboarding-call"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full sm:w-auto inline-flex items-center justify-center
                     font-bold uppercase tracking-widest rounded-xl text-xs
                     transition-all duration-300 hover:scale-[1.02]"
          style={{
            padding: '16px 40px',
            background: `linear-gradient(135deg, ${B.orange} 0%, ${B.orangeSoft} 100%)`,
            color: B.bg,
            textDecoration: 'none',
            boxShadow: `0 0 28px ${B.orange}32, 0 8px 28px rgba(0,0,0,0.4)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          Book Strategy Call
        </a>
        <p
          className="mt-2 text-center text-xs tracking-wider"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          No commitment · 30 minutes
        </p>
      </div>
    </div>
  )
})
CTABanner.displayName = 'CTABanner'

// ─── Trust Card ───────────────────────────────────────────────────────────────
const TrustCard = memo(({ item, index }) => {
  const cardRef = useRef(null)
  const spotRef = useRef(null)
  const accent  = index % 2 === 0 ? B.orange : B.orangeSoft

  useEffect(() => {
    const card = cardRef.current
    const spot = spotRef.current
    if (!card || !spot) return

    const enableCompositing  = () => { card.style.willChange = 'transform' }
    const disableCompositing = () => { card.style.willChange = 'auto' }

    const onMouseMove = (e) => {
      if (getIsTouch()) return
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width)  * 100
      const y = ((e.clientY - rect.top)  / rect.height) * 100
      spot.style.setProperty('--spot-x', `${x}%`)
      spot.style.setProperty('--spot-y', `${y}%`)
      spot.style.opacity = '1'
      gsap.to(card, {
        rotationY:  ((e.clientX - rect.left) / rect.width  - 0.5) * 10,
        rotationX: -((e.clientY - rect.top)  / rect.height - 0.5) * 10,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onMouseLeave = () => {
      if (getIsTouch()) return
      spot.style.opacity = '0'
      gsap.to(card, {
        rotationY: 0, rotationX: 0,
        duration: 0.5, ease: 'power3.out', overwrite: 'auto',
      })
    }

    card.addEventListener('mouseenter', enableCompositing)
    card.addEventListener('mouseleave', disableCompositing)
    card.addEventListener('mousemove',  onMouseMove,  { passive: true })
    card.addEventListener('mouseleave', onMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', enableCompositing)
      card.removeEventListener('mouseleave', disableCompositing)
      card.removeEventListener('mousemove',  onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl border overflow-hidden cursor-default group"
      style={{
        background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.bgCardAlt} 100%)`,
        borderColor: `${accent}18`,
        padding: 'clamp(16px, 2vw, 22px)',
      }}
    >
      {/* Spotlight */}
      <div
        ref={spotRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${accent}14 0%, transparent 65%)`,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          '--spot-x': '50%',
          '--spot-y': '50%',
        }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}45, transparent)` }}
      />
      {/* Bottom progress */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, ${B.accent})`,
          transition: 'width 0.65s ease',
        }}
      />

      <div className="relative z-10">
        <div
          className="font-bold leading-none mb-1 text-2xl md:text-3xl"
          style={{
            letterSpacing: '-0.03em',
            color: accent,
          }}
        >
          {item.value}
        </div>
        <div
          className="text-xs font-bold uppercase tracking-widest"
          style={{
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {item.label}
        </div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
          {item.sub}
        </div>
      </div>
    </div>
  )
})
TrustCard.displayName = 'TrustCard'

// ─── Footer Nav Link ──────────────────────────────────────────────────────────
const FooterNavLink = memo(({ children, href, external = false }) => (
  <a
    href={href || '#'}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group inline-flex items-center gap-1.5 text-sm font-medium
               transition-colors duration-200 hover:text-white w-max"
    style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
  >
    {children}
    <svg
      className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                 transition-all duration-200"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </a>
))
FooterNavLink.displayName = 'FooterNavLink'

// ─── Social Button ────────────────────────────────────────────────────────────
const SocialBtn = memo(({ item }) => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticEffect(0.35)
  const { Icon } = item

  return (
    <a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      className="flex items-center justify-center rounded-xl border
                 transition-colors duration-200 hover:text-white hover:border-[#FF570F]/40"
      style={{
        width: 40, height: 40,
        borderColor: 'rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.4)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Icon />
    </a>
  )
})
SocialBtn.displayName = 'SocialBtn'

// ─── Nav Column ───────────────────────────────────────────────────────────────
const NavColumn = memo(({ title, items }) => (
  <div className="footer-col">
    {title && (
      <h4
        className="text-xs font-bold uppercase tracking-widest text-white mb-6"
      >
        {title}
      </h4>
    )}
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.label}>
          <FooterNavLink href={item.href} external={item.external}>
            {item.label}
          </FooterNavLink>
        </li>
      ))}
    </ul>
  </div>
))
NavColumn.displayName = 'NavColumn'

// ─── Main Footer ──────────────────────────────────────────────────────────────
const Footer = () => {
  const footerRef    = useRef(null)
  const ctaRef       = useRef(null)
  const trustRef     = useRef(null)
  const navGridRef   = useRef(null)
  const bottomBarRef = useRef(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const ctx = gsap.context(() => {
      // CTA Banner
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', once: true },
        },
      )

      // Trust cards stagger
      gsap.fromTo(
        trustRef.current.children,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: trustRef.current, start: 'top 88%', once: true },
        },
      )

      // Nav columns stagger
      gsap.fromTo(
        navGridRef.current.querySelectorAll('.footer-col'),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.75, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: navGridRef.current, start: 'top 88%', once: true },
        },
      )

      // Bottom bar
      gsap.fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: bottomBarRef.current, start: 'top 95%', once: true },
        },
      )
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{
        background: B.bg,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Mesh grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,87,15,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,87,15,0.022) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 100%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 100%, black 20%, transparent 100%)',
        }}
      />

      <div
        className="relative z-10 max-w-7xl mx-auto"
        style={{
          padding: 'clamp(56px, 7vw, 96px) clamp(20px, 5vw, 48px) clamp(32px, 4vw, 48px)',
        }}
      >
        {/* ── CTA Banner ── */}
        <div ref={ctaRef} className="mb-14 md:mb-20" style={{ opacity: 0 }}>
          <CTABanner />
        </div>

        {/* ── Trust Cards ── */}
        <div
          ref={trustRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14 md:mb-20"
        >
          {TRUST.map((item, i) => (
            <TrustCard key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* ── Nav Grid ── */}
        <div
          ref={navGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 pt-12 mb-12"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Brand column */}
          <div className="footer-col lg:col-span-4 flex flex-col gap-6">
            <a
              href="/"
              className="inline-flex items-center gap-3 w-max"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <img
                  src="/logo.jpeg"
                  alt="DDW Agency"
                  width="40" height="40"
                  className="w-full h-full object-cover block"
                />
              </div>
              <span
                className="font-bold text-white text-xl tracking-tight leading-none"
              >
                DDW{' '}
                <span style={{ color: B.orange }}>Agency</span>
              </span>
            </a>

            <p
              className="text-base leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.4)',
                maxWidth: 280,
              }}
            >
              Production-ready software systems and strategic consulting for
              enterprise brands who demand real results.
            </p>

            {/* Office pills */}
            <div className="flex flex-wrap gap-2">
              {OFFICES.map((office) => (
                <div
                  key={office.city}
                  className="inline-flex items-center gap-1.5 rounded-full"
                  style={{
                    padding: '5px 12px',
                    background: `${B.orange}0A`,
                    border: `1px solid ${B.orange}18`,
                  }}
                >
                  <span className="text-sm" aria-hidden="true">{office.flag}</span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {office.city}
                  </span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <SocialBtn key={s.label} item={s} />
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-2">
            <NavColumn title="Services"  items={NAV.services}  />
          </div>
          <div className="lg:col-span-2">
            <NavColumn title="Company"   items={NAV.company}   />
          </div>
          <div className="lg:col-span-2">
            <NavColumn title="Resources" items={NAV.resources} />
          </div>

          {/* Status + Legal column */}
          <div className="footer-col lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              Status
            </h4>
            <div
              className="inline-flex items-center gap-2 rounded-full mb-6"
              style={{
                padding: '6px 14px',
                background: 'rgba(40,200,64,0.08)',
                border: '1px solid rgba(40,200,64,0.22)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#28C840' }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{
                  color: '#28C840',
                }}
              >
                All Systems
              </span>
            </div>
            <NavColumn title="" items={NAV.legal} />
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          ref={bottomBarRef}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', opacity: 0 }}
        >
          <p
            className="text-xs tracking-wider"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            © {CURRENT_YEAR}{' '}
            <span style={{ color: B.orange, fontWeight: 600 }}>DDW Agency</span>
            {' '}— Florida LLC · All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs font-medium transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs font-medium transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer