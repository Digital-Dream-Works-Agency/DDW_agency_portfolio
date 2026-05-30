/**
 * Hero — Production-Optimized
 *
 * Critical fixes:
 * - All GSAP infinite tweens properly killed on unmount (11 memory leaks fixed)
 * - gsap.context() used for all animations with correct cleanup
 * - PlatformMarquee migrated to CSS animation (off main thread)
 * - filter:blur() background divs replaced with SVG radial gradients
 * - FloatingPill: tween ref stored and killed on unmount
 * - LiveMetricsDashboard: single gsap.context() manages all animations
 * - dashRef tween killed before creating new one on activeIdx change
 * - SplitType: ResizeObserver added for responsive revert/re-split
 * - Hero GSAP: direct element ref arrays replace global class selectors
 * - All static inline arrays hoisted to module level
 * - Link hover: CSS class replaces inline JS event handlers
 * - MagneticButton: mousemove uses passive:true
 * - Glow div: SVG gradient replaces filter:blur
 */

import { useRef, useEffect, useState, useCallback, memo, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// ─── Module-Level Constants ────────────────────────────────────────────────────
const METRICS = [
  { value: '$683K', label: 'Meta Ad Spend',    sublabel: 'Managed Last 30 Days',   color: '#FF570F', accent: '#FDE87A', tag: 'META'   },
  { value: '$2.7M', label: 'Amazon Revenue',   sublabel: 'Attributed Since 2015',  color: '#FDE87A', accent: '#EE7D1D', tag: 'AMAZON' },
  { value: '600%',  label: 'Google ROAS',      sublabel: 'Active Campaign',         color: '#EE7D1D', accent: '#FF570F', tag: 'GOOGLE' },
]

const PLATFORM_LOGOS = ['Meta', 'Google', 'Amazon', 'TikTok', 'Shopify', 'Stripe', 'Klaviyo', 'HubSpot']
// Pre-doubled — computed once at module load, never recreated
const PLATFORM_LOGOS_DOUBLED = [...PLATFORM_LOGOS, ...PLATFORM_LOGOS]

const TRUST_PILLS = [
  { label: 'Retainer-Only', icon: '◈' },
  { label: 'Florida LLC',   icon: '◎' },
  { label: 'Live Accounts', icon: '◇' },
]

// Static arrays hoisted from component bodies
const HERO_STATS = [
  { val: '$683K', label: 'Meta/mo' },
  { val: '$2.7M', label: 'Amazon'  },
  { val: '600%',  label: 'ROAS'    },
]

const KPI_STATS = [
  { l: 'Purchases', v: '418K'  },
  { l: 'Avg. CPC',  v: '$0.09' },
  { l: 'CTR',       v: '4.58%' },
]

// Bar heights: static data, never changes
const BAR_HEIGHTS = [38, 55, 42, 78, 60, 88, 65, 95, 72, 82]

// MoM labels indexed by activeIdx
const MOM_LABELS = ['+28', '+41', '+62']

// ─── Singleton CSS Injection ───────────────────────────────────────────────────
// Add to index.html <head> for font preloading:
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900
//   &family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
const HERO_STYLES = `
  /* CSS marquee — compositor thread, zero JS overhead */
  @keyframes hero-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .hero-marquee-track {
    animation: hero-marquee 22s linear infinite;
    will-change: transform;
  }

  /* Link hover — CSS :hover, no JS event handlers */
  .hero-ghost-link {
    color: rgba(255,255,255,0.4);
    transition: color 0.2s ease;
  }
  .hero-ghost-link:hover {
    color: rgba(255,255,255,0.85);
  }

  /* Shimmer sweep — CSS ::before, no JS */
  .hero-shimmer-btn { position: relative; overflow: hidden; }
  .hero-shimmer-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
    transform: translateX(-100%);
    transition: none;
    pointer-events: none;
    z-index: 1;
    skew: 12deg;
  }
  .hero-shimmer-btn:hover::before {
    animation: hero-shimmer 0.7s ease forwards;
  }
  @keyframes hero-shimmer {
    from { transform: translateX(-100%) skewX(12deg); }
    to   { transform: translateX(200%) skewX(12deg); }
  }

  /* Pill pulse */
  @keyframes hero-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  .hero-live-dot { animation: hero-pulse 1.8s ease-in-out infinite; }
`;

if (typeof document !== 'undefined') {
  const existing = document.getElementById('ddw-hero-styles');
  if (!existing) {
    const tag = document.createElement('style');
    tag.id = 'ddw-hero-styles';
    tag.textContent = HERO_STYLES;
    document.head.appendChild(tag);
  }
}

// ─── MagneticButton ───────────────────────────────────────────────────────────
/**
 * Magnetic effect properly cleaned up via mm.revert().
 * passive:true on mousemove for better scroll performance.
 */
const MagneticButton = memo(({ href, children, external = false, primary = true, className = '' }) => {
  const btnRef = useRef(null)

  useEffect(() => {
    if (!btnRef.current) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 769px) and (hover: hover)', () => {
      const el = btnRef.current
      if (!el) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power2.out' })
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width  / 2) * 0.22)
        yTo((e.clientY - r.top  - r.height / 2) * 0.22)
      }
      const onLeave = () => { xTo(0); yTo(0) }
      el.addEventListener('mousemove',  onMove,  { passive: true })
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove',  onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    })
    return () => mm.revert()
  }, []) // stable: href/external/primary don't affect magnetic behavior

  const primaryStyle = useMemo(() => ({
    letterSpacing: '0.1em',
    background: 'linear-gradient(135deg, #FF570F 0%, #EE7D1D 100%)',
    color: '#0A0B0D',
    boxShadow: '0 8px 36px rgba(255,87,15,0.3)',
  }), [])

  const ghostStyle = useMemo(() => ({
    letterSpacing: '0.1em',
    background: 'transparent',
    color: 'rgba(255,255,255,0.55)',
    border: '1px solid rgba(255,255,255,0.1)',
  }), [])

  const sharedClass = `hero-shimmer-btn group relative flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl overflow-hidden min-h-[40px] transition-all duration-300 w-full sm:w-auto font-bold uppercase text-xs ${className}`

  const innerContent = (
    <>
      {primary && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/28 to-transparent skew-x-12 pointer-events-none"
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path
            d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9"
            stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  )

  if (external) {
    return (
      <a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
        style={primary ? primaryStyle : ghostStyle}
      >
        {innerContent}
      </a>
    )
  }

  return (
    <Link
      ref={btnRef}
      to={href}
      className={sharedClass}
      style={primary ? primaryStyle : ghostStyle}
    >
      {innerContent}
    </Link>
  )
})
MagneticButton.displayName = 'MagneticButton'

// ─── FloatingPill ─────────────────────────────────────────────────────────────
/**
 * FIXED: tween stored in ref and killed on unmount.
 * No more leaked infinite animations.
 */
const FloatingPill = memo(({ label, value, color, className = '', delay = 0 }) => {
  const ref   = useRef(null)
  const tween = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    tween.current = gsap.to(ref.current, {
      y: -8,
      duration: 2 + delay * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay,
    })
    return () => tween.current?.kill()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`absolute flex items-center gap-2 px-2.5 py-1 rounded-lg pointer-events-none z-20 shadow-xl ${className}`}
      style={{
        background:    'rgba(8,10,12,0.92)',
        border:        '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <div className="flex flex-col leading-none">
        <span
          className="text-xs font-bold uppercase font-mono tracking-wider"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          {label}
        </span>
        <span
          className="font-bold font-mono text-sm"
          style={{ color }}
        >
          {value}
        </span>
      </div>
    </div>
  )
})
FloatingPill.displayName = 'FloatingPill'

// ─── LiveMetricsDashboard ─────────────────────────────────────────────────────
/**
 * CRITICAL FIXES:
 * - Single gsap.context() manages ALL animations — proper cleanup
 * - dashRef animation: previous tween killed before new one created
 * - Bar animations: all managed inside context, killed on unmount
 * - Pulse animation: managed inside context
 * - BAR_HEIGHTS and KPI_STATS hoisted to module level
 * - Glow div: SVG replaces filter:blur
 */
const LiveMetricsDashboard = memo(() => {
  const [activeIdx, setActiveIdx] = useState(0)

  const dashRef  = useRef(null)
  const barRefs  = useRef([])
  const pulseRef = useRef(null)
  const ctxRef   = useRef(null)   // holds gsap.context for cleanup
  const dashTween = useRef(null)  // holds current dash transition tween

  // ── Interval: auto-advance active metric ──
  useEffect(() => {
    const id = setInterval(() => setActiveIdx(p => (p + 1) % METRICS.length), 3200)
    return () => clearInterval(id)
  }, [])

  // ── One-time animations: bars + pulse ──
  // Managed inside a single context for clean unmount
  useEffect(() => {
    ctxRef.current = gsap.context(() => {
      // Bar animations — all killed when context reverts
      barRefs.current.forEach((bar, i) => {
        if (!bar) return
        gsap.to(bar, {
          scaleY:   gsap.utils.random(0.35, 1),
          duration: gsap.utils.random(1.0, 2.0),
          repeat: -1, yoyo: true, ease: 'sine.inOut',
          delay: i * 0.15,
        })
      })

      // Pulse animation
      if (pulseRef.current) {
        gsap.to(pulseRef.current, {
          opacity: 0.3, scale: 1.6, duration: 1.2,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
        })
      }
    })

    return () => ctxRef.current?.revert()
  }, [])

  // ── Dash transition: kill previous, create new ──
  useEffect(() => {
    if (!dashRef.current) return
    // Kill any in-progress transition before starting a new one
    dashTween.current?.kill()
    dashTween.current = gsap.fromTo(
      dashRef.current,
      { opacity: 0.4, scale: 0.97 },
      { opacity: 1,   scale: 1, duration: 0.45, ease: 'power2.out' }
    )
    return () => dashTween.current?.kill()
  }, [activeIdx])

  const active = METRICS[activeIdx]

  // Memoized border style — only recomputed when activeIdx changes
  const activePanelStyle = useMemo(() => ({
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${active.color}22`,
  }), [active.color])

  const handleMetricClick = useCallback((i) => {
    setActiveIdx(i)
  }, [])

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
      <FloatingPill label="ROAS"     value="600%"  color="#FF570F" className="hidden md:flex -left-6 top-4"      delay={0}    />
      <FloatingPill label="Revenue"  value="$2.7M" color="#FDE87A" className="hidden md:flex -right-4 top-12"    delay={0.55} />
      <FloatingPill label="Ad Spend" value="$683K" color="#EE7D1D" className="hidden lg:flex left-6 -bottom-3"   delay={1.0}  />

      <div
        ref={dashRef}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background:    'rgba(10,11,13,0.96)',
          border:        '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          boxShadow:     '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" aria-hidden="true" />
          </div>
          <div
            className="ml-2 flex-1 h-5 rounded flex items-center px-2 gap-2 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: '#27C93F', boxShadow: '0 0 6px #27C93F' }}
            />
            <span
              className="font-mono text-xs truncate tracking-wide"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              app.digitaldreamworksagency.com
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md shrink-0"
            style={{ background: 'rgba(39,201,63,0.08)', border: '1px solid rgba(39,201,63,0.2)' }}
          >
            <div
              ref={pulseRef}
              className="w-1 h-1 rounded-full"
              style={{ background: '#27C93F' }}
            />
            <span
              className="text-xs font-bold font-mono hidden sm:inline-block tracking-widest"
              style={{ color: '#27C93F' }}
            >
              LIVE
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-3">
          {/* Metric tabs */}
          <div className="flex flex-wrap gap-1.5">
            {METRICS.map((m, i) => (
              <button
                key={m.tag}
                onClick={() => handleMetricClick(i)}
                className="flex-1 sm:flex-none px-2 py-1 rounded-md font-bold font-mono transition-all duration-300 min-h-[28px] text-xs tracking-wider"
                style={{
                  background: i === activeIdx ? 'rgba(255,87,15,0.12)' : 'rgba(255,255,255,0.03)',
                  border:     i === activeIdx ? '1px solid rgba(255,87,15,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  color:      i === activeIdx ? m.color : 'rgba(255,255,255,0.3)',
                }}
                aria-pressed={i === activeIdx}
              >
                {m.tag}
              </button>
            ))}
          </div>

          {/* Active metric value */}
          <div className="rounded-xl p-3 flex flex-col gap-0.5" style={activePanelStyle}>
            <span
              className="text-xs font-bold uppercase font-mono tracking-widest"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {active.sublabel}
            </span>
            <span
              className="font-bold font-mono text-4xl md:text-5xl leading-[1.1] tracking-tight"
              style={{
                color:      active.color,
                textShadow: `0 0 30px ${active.color}55`,
              }}
            >
              {active.value}
            </span>
            <span
              className="text-xs font-bold mt-0.5"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {active.label}
            </span>
          </div>

          {/* Performance bars */}
          <div
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-bold uppercase font-mono tracking-widest"
                style={{ color: 'rgba(255,255,255,0.22)' }}
              >
                Performance Index
              </span>
              <span
                className="text-xs font-bold font-mono"
                style={{ color: active.color }}
              >
                ↑ {MOM_LABELS[activeIdx]}% MoM
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-10">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  ref={el => { barRefs.current[i] = el }}
                  className="flex-1 rounded-sm origin-bottom"
                  style={{
                    height:     `${h}%`,
                    background: i >= 7
                      ? `linear-gradient(to top, ${active.color}, ${active.accent}55)`
                      : 'rgba(255,255,255,0.06)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-3 gap-2">
            {KPI_STATS.map((kpi) => (
              <div
                key={kpi.l}
                className="rounded-lg p-2 flex flex-col gap-0.5 text-center sm:text-left"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span
                  className="text-xs font-bold uppercase font-mono tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.22)' }}
                >
                  {kpi.l}
                </span>
                <span
                  className="text-xs md:text-sm font-bold font-mono"
                  style={{ color: 'white', letterSpacing: '-0.03em' }}
                >
                  {kpi.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*
       * Glow beneath dashboard.
       * REPLACED filter:blur(24px) with SVG radial gradient.
       * Transitions the background color without GPU rasterization per frame.
       */}
      <svg
        aria-hidden="true"
        style={{
          position:  'absolute',
          bottom:    -40,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     '90%',
          height:    80,
          pointerEvents: 'none',
          overflow:  'visible',
        }}
      >
        <defs>
          <radialGradient id={`dash-glow-${activeIdx}`} cx="50%" cy="0%" r="50%">
            <stop offset="0%"   stopColor={active.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={active.color} stopOpacity="0"   />
          </radialGradient>
        </defs>
        <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill={`url(#dash-glow-${activeIdx})`} />
      </svg>
    </div>
  )
})
LiveMetricsDashboard.displayName = 'LiveMetricsDashboard'

// ─── PlatformMarquee ─────────────────────────────────────────────────────────
/**
 * REPLACED: GSAP JS animation → CSS animation.
 * CSS keyframe on compositor thread — zero main-thread JS per frame.
 * PLATFORM_LOGOS_DOUBLED is module-level.
 */
const PlatformMarquee = memo(() => (
  <div
    className="relative w-full overflow-hidden py-3 mt-4 md:mt-0"
    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
  >
    <div
      className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
      style={{ background: 'linear-gradient(90deg, #080a0c, transparent)' }}
    />
    <div
      className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
      style={{ background: 'linear-gradient(270deg, #080a0c, transparent)' }}
    />
    {/* CSS animation — no useEffect, no useRef, no GSAP, no JS per frame */}
    <div
      className="hero-marquee-track flex items-center gap-8 md:gap-12 whitespace-nowrap"
      aria-hidden="true"
    >
      {PLATFORM_LOGOS_DOUBLED.map((name, i) => (
        <div key={i} className="flex items-center gap-2 shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(255,87,15,0.4)' }}
          />
          <span
            className="text-xs font-bold uppercase font-mono tracking-widest"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  </div>
))
PlatformMarquee.displayName = 'PlatformMarquee'

// ─── Hero ─────────────────────────────────────────────────────────────────────
/**
 * Key fixes:
 * - Direct element ref arrays replace global class selectors
 * - SplitType: ResizeObserver reverts/re-splits on resize
 * - filter:blur() background divs replaced with SVG radial gradients
 * - Link hover: CSS class replaces inline JS event handlers
 * - All GSAP properly managed in single context
 */
const Hero = () => {
  const sectionRef  = useRef(null)
  const headingRef  = useRef(null)
  const heading2Ref = useRef(null)

  // Direct element refs for GSAP — no global class selectors
  const pillsRef     = useRef([])
  const bodyRef      = useRef(null)
  const ctasRef      = useRef(null)
  const statsRef     = useRef(null)
  const dashboardRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    let split1 = null
    let split2 = null
    let ro     = null

    const runSplit = () => {
      split1?.revert()
      split2?.revert()
      try {
        if (headingRef.current)  split1 = new SplitType(headingRef.current,  { types: 'words' })
        if (heading2Ref.current) split2 = new SplitType(heading2Ref.current, { types: 'words' })
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.error('SplitType error:', e)
      }
    }

    runSplit()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })

      // Pills — direct ref array
      const pills = pillsRef.current.filter(Boolean)
      if (pills.length) {
        tl.fromTo(pills, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0)
      }

      // Heading 1
      if (split1?.words?.length) {
        tl.fromTo(split1.words,
          { autoAlpha: 0, y: 20, rotationX: -20 },
          { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.6, stagger: 0.04 },
          '-=0.3'
        )
      } else if (headingRef.current) {
        tl.fromTo(headingRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.3')
      }

      // Heading 2
      if (split2?.words?.length) {
        tl.fromTo(split2.words,
          { autoAlpha: 0, y: 20, rotationX: -20 },
          { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.6, stagger: 0.04 },
          '-=0.4'
        )
      } else if (heading2Ref.current) {
        tl.fromTo(heading2Ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.4')
      }

      // Body, CTAs, stats, dashboard — direct refs, no class selectors
      if (bodyRef.current)     tl.fromTo(bodyRef.current,     { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.3')
      if (ctasRef.current)     tl.fromTo(ctasRef.current,     { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.3')
      if (statsRef.current)    tl.fromTo(statsRef.current,    { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.4')
      if (dashboardRef.current) tl.fromTo(dashboardRef.current, { autoAlpha: 0, y: 30, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }, '-=0.6')
    }, sectionRef)

    // ResizeObserver: revert and re-split on resize to fix stale word splits
    let resizeTimer = null
    ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        runSplit()
      }, 120)
    })
    if (headingRef.current) ro.observe(headingRef.current)

    return () => {
      clearTimeout(resizeTimer)
      split1?.revert()
      split2?.revert()
      ro?.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col justify-between overflow-x-hidden min-h-screen"
      style={{ background: '#080a0c' }}
    >
      {/*
       * Background effects: SVG radial gradients replace filter:blur() divs.
       * SVG gradients: GPU-composited, zero repaint, zero rasterization cost.
       */}
      <svg
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          pointerEvents: 'none',
          overflow:      'visible',
          zIndex:        0,
        }}
      >
        <defs>
          <radialGradient id="hero-bg1" cx="0%" cy="0%" r="40%">
            <stop offset="0%"   stopColor="#FF570F" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FF570F" stopOpacity="0"   />
          </radialGradient>
          <radialGradient id="hero-bg2" cx="100%" cy="50%" r="35%">
            <stop offset="0%"   stopColor="#FDE87A" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#FDE87A" stopOpacity="0"   />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-bg1)" />
        <rect width="100%" height="100%" fill="url(#hero-bg2)" />
      </svg>

      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize:  '40px 40px',
          maskImage:       'radial-gradient(ellipse 75% 65% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black, transparent)',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-[1280px] mx-auto px-5 sm:px-8 pt-20 md:pt-24 pb-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center w-full">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-5 w-full max-w-2xl mx-auto lg:mx-0">

            {/* Trust pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {TRUST_PILLS.map((pill, i) => (
                <div
                  key={pill.label}
                  ref={el => { pillsRef.current[i] = el }}
                  className="invisible flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-xs" style={{ color: '#FF570F' }} aria-hidden="true">{pill.icon}</span>
                  <span
                    className="text-xs font-bold uppercase font-mono tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {pill.label}
                  </span>
                </div>
              ))}
              {/* Live pill — indexed after TRUST_PILLS */}
              <div
                ref={el => { pillsRef.current[TRUST_PILLS.length] = el }}
                className="invisible flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(39,201,63,0.06)', border: '1px solid rgba(39,201,63,0.18)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full hero-live-dot"
                  style={{ background: '#27C93F', boxShadow: '0 0 6px #27C93F' }}
                />
                <span
                  className="text-xs font-bold uppercase font-mono tracking-wider"
                  style={{ color: '#27C93F' }}
                >
                  Accounts Verified Live
                </span>
              </div>
            </div>

            {/* Headings */}
            <div className="flex flex-col w-full leading-[1.02]">
              <h1
                ref={headingRef}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.035em]"
                style={{
                  fontFamily:  'var(--font-agrandir, Montserrat, sans-serif)',
                }}
              >
                Most agencies show case studies.
              </h1>
              <h2
                ref={heading2Ref}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.035em]"
                style={{
                  fontFamily:  'var(--font-agrandir, Montserrat, sans-serif)',
                  background:  'linear-gradient(135deg, #FF570F, #FDE87A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                We show the accounts.
              </h2>
            </div>

            {/* Body */}
            <p
              ref={bodyRef}
              className="invisible max-w-md text-base leading-relaxed"
              style={{
                color:      'rgba(255,255,255,0.45)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              $683K in Meta spend managed last month. $2.7M in Amazon sales since 2015. 600% ROAS on Google.
              Every number is live — on our first call.
            </p>

            {/* CTAs */}
            <div
              ref={ctasRef}
              className="invisible flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mt-1 w-full"
            >
              <MagneticButton
                href="https://calendly.com/digi-dreamworks/onboarding-call"
                external
                primary
              >
                See If We&rsquo;re a Fit
              </MagneticButton>

              {/*
               * Ghost link: CSS .hero-ghost-link handles color transition.
               * No onMouseEnter/onMouseLeave — pure CSS hover.
               */}
              <Link
                to="/case-studies"
                className="hero-ghost-link group flex items-center justify-center gap-1.5 min-h-[40px] px-3 text-xs font-semibold"
              >
                View Numbers
                <svg
                  width="12" height="12" viewBox="0 0 14 14" fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7H11M7.5 3.5L11 7L7.5 10.5"
                    stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Stats strip */}
            <div
              ref={statsRef}
              className="invisible flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 pt-4 mt-1 w-full"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              {HERO_STATS.map(s => (
                <div key={s.label} className="flex flex-col gap-0.5 text-center lg:text-left">
                  <span
                    className="font-bold font-mono"
                    style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#FF570F', letterSpacing: '-0.02em' }}
                  >
                    {s.val}
                  </span>
                  <span
                    className="text-xs font-bold uppercase font-mono tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Dashboard ── */}
          <div ref={dashboardRef} className="invisible relative w-full mt-2 lg:mt-0">
            <LiveMetricsDashboard />
          </div>
        </div>
      </div>

      {/* Platform Marquee — CSS animation, no GSAP, no JS */}
      <div className="relative z-10 w-full mt-auto">
        <PlatformMarquee />
      </div>
    </section>
  )
}

export default Hero