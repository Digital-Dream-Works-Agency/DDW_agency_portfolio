import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────
const METRICS = [
  {
    value: '$683K',
    label: 'Meta Ad Spend',
    sublabel: 'Managed Last 30 Days',
    color: '#FF570F',
    accent: '#FDE87A',
    tag: 'META',
  },
  {
    value: '$2.7M',
    label: 'Amazon Revenue',
    sublabel: 'Attributed Since 2015',
    color: '#FDE87A',
    accent: '#EE7D1D',
    tag: 'AMAZON',
  },
  {
    value: '600%',
    label: 'Google ROAS',
    sublabel: 'Active Campaign',
    color: '#EE7D1D',
    accent: '#FF570F',
    tag: 'GOOGLE',
  },
]

const PLATFORM_LOGOS = [
  'Meta',
  'Google',
  'Amazon',
  'TikTok',
  'Shopify',
  'Stripe',
  'Klaviyo',
  'HubSpot',
]

const TRUST_PILLS = [
  { label: 'Retainer-Only', icon: '◈' },
  { label: 'Florida LLC', icon: '◎' },
  { label: 'Live Accounts', icon: '◇' },
]

// ─── Magnetic Button ──────────────────────────────────────────────────────────
const MagneticButton = ({
  href,
  children,
  external = false,
  primary = true,
  className = '',
}) => {
  const btnRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 769px) and (hover: hover)', () => {
      const el = btnRef.current
      if (!el) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power2.out' })

      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width / 2) * 0.22)
        yTo((e.clientY - r.top - r.height / 2) * 0.22)
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

  const baseStyle = {
    fontSize: '10px',
    letterSpacing: '0.2em',
    boxShadow: primary ? '0 8px 36px rgba(255,87,15,0.3)' : 'none',
  }

  const content = (
    <>
      {primary && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/28 to-transparent skew-x-12 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2 font-extrabold uppercase">
        {children}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        >
          <path
            d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  )

  const sharedClass = `group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl overflow-hidden will-change-transform min-h-[40px] transition-all duration-300 ${className}`

  const primaryInlineStyle = {
    ...baseStyle,
    background: 'linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%)',
    color: '#0A0B0D',
  }

  const ghostInlineStyle = {
    ...baseStyle,
    background: 'transparent',
    color: 'rgba(255,255,255,0.55)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  if (external) {
    return (
      <a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
        style={primary ? primaryInlineStyle : ghostInlineStyle}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      ref={btnRef}
      to={href}
      className={sharedClass}
      style={primary ? primaryInlineStyle : ghostInlineStyle}
    >
      {content}
    </Link>
  )
}

// ─── Floating Pill ─────────────────────────────────────────────────────────────
const FloatingPill = ({
  label,
  value,
  color,
  className = '',
  delay = 0,
}) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.to(ref.current, {
      y: -10,
      duration: 2 + delay * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay,
    })
  }, [delay])

  return (
    <div
      ref={ref}
      className={`absolute flex items-center gap-2 px-3 py-1.5 rounded-xl pointer-events-none z-20 ${className}`}
      style={{
        background: 'rgba(8,10,12,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}22`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <div className="flex flex-col gap-0.5 leading-none">
        <span
          className="font-bold uppercase font-mono"
          style={{ fontSize: '8px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.18em' }}
        >
          {label}
        </span>
        <span className="font-black font-mono text-[11px]" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  )
}

// ─── Live Metrics Dashboard ───────────────────────────────────────────────────
const LiveMetricsDashboard = () => {
  const [activeIdx, setActiveIdx] = useState(0)
  const dashRef      = useRef(null)
  const barRefs      = useRef([])
  const pulseRef     = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((p) => (p + 1) % METRICS.length), 3200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!dashRef.current) return
    gsap.fromTo(
      dashRef.current,
      { opacity: 0.4, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
    )
  }, [activeIdx])

  useEffect(() => {
    barRefs.current.forEach((bar, i) => {
      if (!bar) return
      gsap.to(bar, {
        scaleY: gsap.utils.random(0.35, 1),
        duration: gsap.utils.random(1.0, 2.0),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.15,
      })
    })
  }, [])

  useEffect(() => {
    if (!pulseRef.current) return
    gsap.to(pulseRef.current, {
      opacity: 0.3,
      scale: 1.6,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  const active = METRICS[activeIdx]
  const bars   = [38, 55, 42, 78, 60, 88, 65, 95, 72, 82]

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Floating pills */}
      <FloatingPill
        label="ROAS"
        value="600%"
        color="#FF570F"
        className="hidden sm:flex -left-6 top-6"
        delay={0}
      />
      <FloatingPill
        label="Revenue"
        value="$2.7M"
        color="#FDE87A"
        className="hidden sm:flex -right-4 top-16"
        delay={0.55}
      />
      <FloatingPill
        label="Ad Spend"
        value="$683K"
        color="#EE7D1D"
        className="hidden md:flex left-8 -bottom-3"
        delay={1.0}
      />

      <div
        ref={dashRef}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(10,11,13,0.96)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          <div
            className="ml-3 flex-1 h-5 rounded flex items-center px-2 gap-2"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#27C93F', boxShadow: '0 0 6px #27C93F' }}
            />
            <span
              className="font-mono text-[8px]"
              style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}
            >
              app.digitaldreamworksagency.com
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
            style={{
              background: 'rgba(39,201,63,0.08)',
              border: '1px solid rgba(39,201,63,0.2)',
            }}
          >
            <div
              ref={pulseRef}
              className="w-1 h-1 rounded-full"
              style={{ background: '#27C93F' }}
            />
            <span
              className="font-bold font-mono"
              style={{ fontSize: '7px', color: '#27C93F', letterSpacing: '0.18em' }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* Dashboard Padding Reduced */}
        <div className="p-4 md:p-5 space-y-3">
          <div className="flex gap-2">
            {METRICS.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="px-3 py-1 rounded-lg font-bold font-mono transition-all duration-300 min-h-[28px]"
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.16em',
                  background: i === activeIdx ? 'rgba(255,87,15,0.12)' : 'rgba(255,255,255,0.03)',
                  border: i === activeIdx
                    ? '1px solid rgba(255,87,15,0.3)'
                    : '1px solid rgba(255,255,255,0.06)',
                  color: i === activeIdx ? m.color : 'rgba(255,255,255,0.3)',
                }}
              >
                {m.tag}
              </button>
            ))}
          </div>

          <div
            className="rounded-xl p-3.5 flex flex-col gap-0.5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${active.color}22`,
            }}
          >
            <span
              className="font-bold uppercase font-mono"
              style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}
            >
              {active.sublabel}
            </span>
            <span
              className="font-black font-mono"
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                letterSpacing: '-0.04em',
                color: active.color,
                textShadow: `0 0 40px ${active.color}55`,
              }}
            >
              {active.value}
            </span>
            <span
              className="font-bold"
              style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}
            >
              {active.label}
            </span>
          </div>

          <div
            className="rounded-xl p-3.5"
            style={{
              background: 'rgba(255,255,255,0.018)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-bold uppercase font-mono"
                style={{ fontSize: '7px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.18em' }}
              >
                Performance Index
              </span>
              <span
                className="font-bold font-mono text-[8px]"
                style={{ color: active.color }}
              >
                ↑ +{activeIdx === 0 ? '28' : activeIdx === 1 ? '41' : '62'}% MoM
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-12">
              {bars.map((h, i) => (
                <div
                  key={i}
                  ref={(el) => { barRefs.current[i] = el }}
                  className="flex-1 rounded-sm origin-bottom"
                  style={{
                    height: `${h}%`,
                    background:
                      i >= 7
                        ? `linear-gradient(to top, ${active.color}, ${active.accent}55)`
                        : 'rgba(255,255,255,0.06)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { l: 'Purchases', v: '418K' },
              { l: 'Avg. CPC', v: '$0.09' },
              { l: 'CTR', v: '4.58%' },
            ].map((kpi, i) => (
              <div
                key={i}
                className="rounded-lg p-2 flex flex-col gap-0.5"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span
                  className="font-bold uppercase font-mono"
                  style={{ fontSize: '6px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em' }}
                >
                  {kpi.l}
                </span>
                <span
                  className="font-black font-mono"
                  style={{ fontSize: 'clamp(11px, 1.5vw, 14px)', color: 'white', letterSpacing: '-0.03em' }}
                >
                  {kpi.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${active.color}30 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transition: 'background 0.6s ease',
        }}
      />
    </div>
  )
}

// ─── Platform Marquee ─────────────────────────────────────────────────────────
const PlatformMarquee = () => {
  const marqueeRef = useRef(null)

  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    gsap.to(el, {
      xPercent: -50,
      duration: 22,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  const doubled = [...PLATFORM_LOGOS, ...PLATFORM_LOGOS]

  return (
    <div
      className="relative w-full overflow-hidden py-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #080a0c, transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #080a0c, transparent)' }}
      />

      <div ref={marqueeRef} className="flex items-center gap-10 whitespace-nowrap">
        {doubled.map((name, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: 'rgba(255,87,15,0.4)' }}
            />
            <span
              className="font-bold uppercase font-mono"
              style={{ fontSize: '9px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em' }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Hero Component ───────────────────────────────────────────────────────────
const Hero = () => {
  const sectionRef  = useRef(null)
  const headingRef  = useRef(null)
  const heading2Ref = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    let split1 = null
    let split2 = null

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        split1 = new SplitType(headingRef.current, { types: 'words' })
      }
      
      // H2 ke liye bhi SplitType use kar rahe hain, par iski styling humne Tailwind classes me theek kar di hai
      if (heading2Ref.current) {
        split2 = new SplitType(heading2Ref.current, { types: 'words' })
      }

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.hero-pill',
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08 },
        0,
      )

      if (split1?.words) {
        tl.fromTo(
          split1.words,
          { opacity: 0, y: 40, rotationX: -35, skewX: 3 },
          {
            opacity: 1, y: 0, rotationX: 0, skewX: 0,
            duration: 0.8, stagger: 0.055,
            transformOrigin: 'top center',
          },
          '-=0.4',
        )
      }

      if (split2?.words) {
        tl.fromTo(
          split2.words,
          { opacity: 0, y: 40, rotationX: -35, skewX: 3 },
          {
            opacity: 1, y: 0, rotationX: 0, skewX: 0,
            duration: 0.8, stagger: 0.055,
            transformOrigin: 'top center',
          },
          '-=0.55',
        )
      }

      tl.fromTo(
        '.hero-body',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.45',
      )
      tl.fromTo(
        '.hero-ctas',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65 },
        '-=0.4',
      )

      tl.fromTo(
        '.hero-dashboard',
        { opacity: 0, y: 44, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1 },
        '-=0.7',
      )
    }, sectionRef)

    return () => {
      split1?.revert()
      split2?.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col justify-between overflow-hidden"
      style={{
        minHeight: '100dvh',
        background: '#080a0c',
      }}
    >
      <div
        className="absolute -top-40 -left-20 w-[50vw] h-[50vw] max-w-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,87,15,0.09) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute top-1/2 -right-32 w-[40vw] h-[40vw] max-w-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(253,232,122,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black, transparent)',
        }}
      />

      {/* Paddings Reduced for Above the Fold */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-[1280px] mx-auto px-5 sm:px-7 pt-20 md:pt-24 pb-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">

          {/* ── Left: Copy ────────────────────────────────────────────── */}
          {/* Gaps Reduced */}
          <div className="flex flex-col gap-3.5 md:gap-4">
            
            <div className="flex flex-wrap gap-2">
              {TRUST_PILLS.map((pill, i) => (
                <div
                  key={i}
                  className="hero-pill opacity-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: '#FF570F', fontSize: '10px' }}>{pill.icon}</span>
                  <span
                    className="font-bold uppercase font-mono"
                    style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em' }}
                  >
                    {pill.label}
                  </span>
                </div>
              ))}

              <div
                className="hero-pill opacity-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                style={{
                  background: 'rgba(39,201,63,0.06)',
                  border: '1px solid rgba(39,201,63,0.18)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: '#27C93F', boxShadow: '0 0 6px #27C93F' }}
                />
                <span
                  className="font-bold uppercase font-mono"
                  style={{ fontSize: '8px', color: '#27C93F', letterSpacing: '0.18em' }}
                >
                  Accounts Verified Live
                </span>
              </div>
            </div>

            {/* Typography Scaled Down Slightly */}
            <h1
              ref={headingRef}
              className="font-black leading-[1.04] tracking-tight"
              style={{
                fontSize: 'clamp(28px, 4.5vw, 54px)',
                letterSpacing: '-0.03em',
                fontFamily: 'Montserrat, sans-serif',
                color: 'white',
              }}
            >
              Most agencies show case studies.
            </h1>

            {/* Gradient Text Fix - Tailwind use kiya aur SplitType support class add ki */}
            <h2
              ref={heading2Ref}
              className="font-black leading-[1.04] tracking-tight -mt-1 md:-mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF570F] to-[#FDE87A] [&_.word]:text-transparent [&_.word]:bg-clip-text [&_.word]:bg-gradient-to-r [&_.word]:from-[#FF570F] [&_.word]:to-[#FDE87A]"
              style={{
                fontSize: 'clamp(28px, 4.5vw, 54px)',
                letterSpacing: '-0.03em',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              We show the accounts.
            </h2>

            <p
              className="hero-body opacity-0 leading-relaxed max-w-lg mt-1"
              style={{
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              $683K in Meta spend managed last month. $2.7M in Amazon sales since 2015.
              600% ROAS on Google. Every number is live — on our first call.
            </p>

            <div className="hero-ctas opacity-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <MagneticButton
                href="https://calendly.com/digi-dreamworks/onboarding-call"
                external
                primary
              >
                See If We&rsquo;re a Fit
              </MagneticButton>

              <Link
                to="/case-studies"
                className="group flex items-center gap-2 min-h-[40px] transition-colors duration-200"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                }}
              >
                View Numbers
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path
                    d="M3 7H11M7.5 3.5L11 7L7.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <div
              className="flex flex-wrap items-center gap-4 pt-3 mt-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {[
                { val: '$683K', label: 'Meta/mo' },
                { val: '$2.7M', label: 'Amazon' },
                { val: '600%', label: 'ROAS' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span
                    className="font-black font-mono"
                    style={{
                      fontSize: 'clamp(14px, 1.8vw, 18px)',
                      color: '#FF570F',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {s.val}
                  </span>
                  <span
                    className="font-bold uppercase font-mono"
                    style={{ fontSize: '7px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.18em' }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Dashboard ────────────────────────────────────────── */}
          <div className="hero-dashboard opacity-0 relative mt-4 lg:mt-0">
            <LiveMetricsDashboard />
          </div>
        </div>
      </div>

      {/* ── Platform Marquee ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full mt-auto">
        <PlatformMarquee />
      </div>
    </section>
  )
}

export default Hero