/**
 * ContactPage — Production-Optimized
 *
 * Critical fixes:
 * - GlobalStyles removed; styles injected as module-level singleton
 * - Google Fonts loaded via <link> preconnect (add to _document.js / index.html)
 * - All inline <style> tags replaced with singleton CSS injection
 * - CountUp migrated from useState+setVal to direct innerText mutation
 * - FormField fully memoized; focus/fill state driven by CSS data attributes
 * - ContactForm children memoized; no cascade re-renders on keystrokes
 * - ProcessSteps: single implementation, matchMedia for desktop/mobile layout
 * - Fixed-position blur orbs replaced with SVG radial gradients (no repaint)
 * - isTouchDevice computed once at module level
 * - All pure components wrapped in memo
 * - GSAP contexts properly scoped with ref argument
 * - handleSubmit scaffolded for real async submission with error state
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// ─── Module-Level Constants ────────────────────────────────────────────────────
const IS_TOUCH =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const STATS = [
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: 'h', label: 'Avg. Response Time'  },
  { value: 47, suffix: '+', label: 'Projects Delivered'  },
  { value: 6,  suffix: '+', label: 'Years in Business'   },
];

const STEPS = [
  {
    num: '01',
    title: 'Tell us about your project',
    body: 'Fill the form or book a call. We read every submission personally — no filters.',
  },
  {
    num: '02',
    title: 'We evaluate the fit',
    body: "Not every project is a match. We'll be honest if we're not the right team for you.",
  },
  {
    num: '03',
    title: 'Strategy call within 24h',
    body: "If we're aligned, you'll get a calendar invite within one business day.",
  },
  {
    num: '04',
    title: 'Proposal & kickoff',
    body: 'A scoped proposal arrives in 48h. Clear deliverables, no vague retainers.',
  },
];

const CONTACT_INFO = [
  { label: 'Offices',  value: 'Rome, Italy · Florida, USA'       },
  { label: 'Email',    value: 'hello@digitaldreamworksagency.com' },
  { label: 'Response', value: 'Within 24 business hours'         },
];

const BUDGET_OPTIONS = [
  { value: '5k-15k',   label: '$5,000 – $15,000'   },
  { value: '15k-50k',  label: '$15,000 – $50,000'  },
  { value: '50k-100k', label: '$50,000 – $100,000' },
  { value: '100k+',    label: '$100,000+'           },
];

const CALENDLY_URL = 'https://calendly.com/digi-dreamworks/onboarding-call';

const INITIAL_FORM = {
  name: '', email: '', company: '', budget: '', message: '',
};

// ─── Singleton CSS Injection ───────────────────────────────────────────────────
// Injected exactly once at module evaluation — never on re-render.
// Move ALL of this to a .css / .scss file in production for best practice.
// Google Fonts: add these two <link> tags to your _document.js / index.html <head>:
//   <link rel="preconnect" href="https://fonts.googleapis.com" />
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900
//     &family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap"
//     rel="stylesheet" />
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #080a0c;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* ── Fonts ── */
  .font-heading { font-family: 'Montserrat', sans-serif; }
  .font-mono    { font-family: 'JetBrains Mono', monospace; }

  /* ── Form ── */
  ::placeholder { color: rgba(255,255,255,0.18) !important; }

  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #0e1115 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #ffffff;
  }

  select option { background: #0e1115; color: #fff; }
  textarea { resize: none; }

  .ddw-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.09);
    color: #fff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    padding: 10px 0 11px;
    outline: none;
    transition: border-color 0.3s ease;
    -webkit-appearance: none;
    appearance: none;
  }
  .ddw-input:focus {
    border-bottom-color: rgba(255,87,15,0.6);
  }

  /* ── Field label: CSS-driven focus state — zero JS re-renders ── */
  .ddw-field { display: flex; flex-direction: column; }
  .ddw-field:focus-within .ddw-label { color: #FF570F; }
  .ddw-field[data-filled="true"] .ddw-input {
    border-bottom-color: rgba(255,87,15,0.35);
  }

  /* ── Focus underline ── */
  .ddw-underline {
    position: absolute; bottom: 0; left: 0;
    height: 1.5px; width: 0%;
    background: linear-gradient(90deg, #FF570F, #FDE87A);
    pointer-events: none;
    transition: width 0.38s cubic-bezier(0.4,0,0.2,1);
  }
  .ddw-field:focus-within .ddw-underline { width: 100%; }

  /* ── Stats ── */
  .stat-card { transition: background 0.3s ease; cursor: default; }
  .stat-card:hover { background: rgba(255,87,15,0.03) !important; }
  .stat-card:hover .stat-value { color: #FF570F !important; }
  .stat-value { transition: color 0.3s ease; }

  /* ── Steps ── */
  .step-row { cursor: pointer; }
  .step-row:hover .step-dot-inner { background: #FF570F !important; }

  /* ── Stats strip responsive ── */
  .stats-strip-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 768px) {
    .stats-strip-grid { grid-template-columns: repeat(4, 1fr); }
  }

  /* ── Main contact grid ── */
  .contact-main-grid { display: grid; grid-template-columns: 1fr; gap: clamp(48px,6vw,72px); align-items: start; }
  @media (min-width: 1024px) {
    .contact-main-grid { grid-template-columns: 1fr 1fr; gap: clamp(56px,6vw,96px); }
    .form-col-sticky   { position: sticky; top: 100px; }
    .steps-mobile-only { display: none !important; }
    .steps-desktop-only { display: block !important; }
  }
  @media (max-width: 1023px) {
    .steps-desktop-only { display: none !important; }
  }

  /* ── Form name/email grid ── */
  .form-name-email { display: grid; gap: 24px; grid-template-columns: 1fr; }
  @media (min-width: 560px) {
    .form-name-email { grid-template-columns: 1fr 1fr; }
  }

  /* ── Keyframes ── */
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(2.2); opacity: 0;   }
  }
  @keyframes breatheOrb {
    0%, 100% { opacity: 0.04; }
    50%       { opacity: 0.09; }
  }
  @keyframes spinLoader {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes shimmerOnce {
    from { transform: translateX(-100%); }
    to   { transform: translateX(200%);  }
  }
  @keyframes nodePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,87,15,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(255,87,15,0); }
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #080a0c; }
  ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.2); border-radius: 2px; }
`;

if (typeof document !== 'undefined') {
  const existing = document.getElementById('ddw-contact-styles');
  if (!existing) {
    const tag = document.createElement('style');
    tag.id = 'ddw-contact-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }
}

// ─── Hook: Magnetic ───────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
  useEffect(() => {
    if (IS_TOUCH || !ref?.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const el = ref.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.42, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.42, ease: 'power2.out' });
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width  / 2) * strength);
        yTo((e.clientY - r.top  - r.height / 2) * strength);
      };
      const onLeave = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.45)' });
      el.addEventListener('mousemove', onMove,  { passive: true });
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);
};

// ─── Hook: ScrollFadeUp ───────────────────────────────────────────────────────
const useScrollFadeUp = (ref, { delay = 0, y = 36 } = {}) => {
  useEffect(() => {
    if (!ref?.current) return;
    // Pass ref.current as scope for proper GSAP context isolation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out', delay,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 87%',
            once: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
    // delay and y are primitive literals — safe deps
  }, [delay, y]);
};

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
const Eyebrow = memo(({ children, pulse = false }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '5px 14px', borderRadius: 999,
    background: 'rgba(255,87,15,0.07)',
    border: '1px solid rgba(255,87,15,0.25)',
  }}>
    {pulse && (
      <span style={{
        position: 'relative', width: 7, height: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: '#FF570F',
          animation: 'pulseRing 1.8s ease-out infinite',
        }} />
        <span style={{
          position: 'relative', width: 5, height: 5, borderRadius: '50%',
          background: '#FF570F', flexShrink: 0,
        }} />
      </span>
    )}
    <span style={{
      color: '#FF570F', fontSize: 9, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: '0.24em',
      fontFamily: 'JetBrains Mono, monospace', lineHeight: 1,
    }}>
      {children}
    </span>
  </div>
));
Eyebrow.displayName = 'Eyebrow';

// ─── CountUp ──────────────────────────────────────────────────────────────────
/**
 * CRITICAL FIX: Removed useState entirely.
 * Direct innerText mutation inside GSAP onUpdate = zero React re-renders.
 * IntersectionObserver fires once, then disconnects.
 */
const CountUp = memo(({ end, suffix = '', duration = 2 }) => {
  const spanRef = useRef(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    let anim = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const obj = { v: 0 };
        anim = gsap.to(obj, {
          v: end,
          duration,
          ease: 'power2.out',
          onUpdate() {
            // Direct DOM mutation — no React setState, no re-render
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
          onComplete() {
            // Ensure final value is pixel-perfect
            el.textContent = `${end}${suffix}`;
          },
        });
      },
      { threshold: 0.6 }
    );

    if (el) io.observe(el);

    return () => {
      io.disconnect();
      anim?.kill();
    };
  }, [end, suffix, duration]);

  return (
    <span ref={spanRef}>
      0{suffix}
    </span>
  );
});
CountUp.displayName = 'CountUp';

// ─── StatsStrip ───────────────────────────────────────────────────────────────
/**
 * STATS is module-level — never recreated.
 * itemRefs array used instead of class selector for GSAP targeting.
 */
const StatsStrip = memo(() => {
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.65, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        borderTop:    '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 clamp(16px,4vw,32px)',
      }}>
        <div className="stats-strip-grid">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              ref={el => { itemRefs.current[i] = el; }}
              className="stat-card"
              style={{
                opacity: 0,
                textAlign: 'center',
                padding: '28px 16px',
                borderRight: i < STATS.length - 1
                  ? '1px solid rgba(255,255,255,0.05)'
                  : 'none',
              }}
            >
              <div
                className="stat-value font-heading"
                style={{
                  fontSize: 'clamp(1.5rem,3vw,2rem)',
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div style={{
                fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.28)',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
StatsStrip.displayName = 'StatsStrip';

// ─── AnimatedHeading ──────────────────────────────────────────────────────────
/**
 * Accepts explicit `lines` array prop instead of React.Children manipulation.
 * Safer reconciliation, no key collisions.
 */
const AnimatedHeading = memo(({ lines = [] }) => {
  const containerRef = useRef(null);
  const lineRefs     = useRef([]);

  useEffect(() => {
    if (!containerRef.current || !lineRefs.current.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRefs.current.filter(Boolean),
        { yPercent: 105, skewX: 2, opacity: 0 },
        {
          yPercent: 0, skewX: 0, opacity: 1,
          duration: 0.9, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden', lineHeight: 1.12 }}>
          <span
            ref={el => { lineRefs.current[i] = el; }}
            style={{ display: 'block', willChange: 'transform, opacity' }}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
});
AnimatedHeading.displayName = 'AnimatedHeading';

// ─── ProcessSteps ─────────────────────────────────────────────────────────────
/**
 * Single DOM implementation — CSS classes control layout.
 * No more hidden/shown duplicate JSX trees.
 * lineRef animation scoped with gsap.context.
 */
const ProcessSteps = memo(({ activeStep, setActiveStep }) => {
  const containerRef = useRef(null);
  const lineRef      = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.4, ease: 'expo.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleStepClick = useCallback((i) => {
    setActiveStep(i);
  }, [setActiveStep]);

  return (
    <div ref={containerRef}>
      {/* ── Desktop: vertical timeline ── */}
      <div
        className="steps-desktop-only"
        style={{ position: 'relative', paddingLeft: 26 }}
      >
        <div
          ref={lineRef}
          style={{
            position: 'absolute', left: 6, top: 6, bottom: 6,
            width: 1, transformOrigin: 'top',
            background: 'linear-gradient(to bottom, rgba(255,87,15,0.8), rgba(255,87,15,0.06))',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <div
                key={step.num}
                className="step-row"
                onClick={() => handleStepClick(i)}
                style={{
                  position: 'relative',
                  paddingBottom: i < STEPS.length - 1 ? 26 : 0,
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -20, top: 3,
                  width: 9, height: 9, borderRadius: '50%',
                  border: `1.5px solid ${isActive ? '#FF570F' : 'rgba(255,255,255,0.16)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? '#FF570F' : 'transparent',
                  boxShadow: isActive ? '0 0 0 3px rgba(255,87,15,0.18)' : 'none',
                  transition: 'all 0.25s ease',
                }}>
                  <span
                    className="step-dot-inner"
                    style={{
                      width: 3, height: 3, borderRadius: '50%',
                      background: isActive ? '#080a0c' : 'rgba(255,255,255,0.3)',
                      transition: 'background 0.25s ease',
                    }}
                  />
                </div>

                {/* Number */}
                <div style={{
                  fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.2em', color: '#FF570F',
                  fontFamily: 'JetBrains Mono', marginBottom: 4,
                }}>
                  {step.num}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  marginBottom: isActive ? 8 : 0,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.25s ease',
                  lineHeight: 1.4,
                }}>
                  {step.title}
                </div>

                {/* Body — rendered conditionally to avoid height calculation */}
                {isActive && (
                  <div style={{
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.36)',
                    lineHeight: 1.72,
                    animation: 'fadeUp 0.28s ease both',
                  }}>
                    {step.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: simple left-border list (CSS hides on desktop) ── */}
      <div
        className="steps-mobile-only"
        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        {STEPS.map((step) => (
          <div
            key={step.num}
            style={{
              paddingLeft: 16,
              borderLeft: '2px solid rgba(255,87,15,0.2)',
            }}
          >
            <div style={{
              fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.2em', color: '#FF570F',
              fontFamily: 'JetBrains Mono', marginBottom: 4,
            }}>
              {step.num}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: '#fff', marginBottom: 4, lineHeight: 1.4,
            }}>
              {step.title}
            </div>
            <div style={{
              fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7,
            }}>
              {step.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
ProcessSteps.displayName = 'ProcessSteps';

// ─── FormField ────────────────────────────────────────────────────────────────
/**
 * CRITICAL FIX: `focused` state removed entirely.
 * Focus underline and label color driven by CSS :focus-within on .ddw-field.
 * `data-filled` attribute drives filled border color.
 * Component wrapped in memo — only re-renders when value or name changes.
 */
const FormField = memo(({ label, name, type = 'text', placeholder, value, onChange }) => {
  const isFilled = value.length > 0;

  return (
    <div className="ddw-field" data-filled={String(isFilled)}>
      <label
        className="ddw-label"
        htmlFor={`field-${name}`}
        style={{
          display: 'block',
          marginBottom: 8,
          fontSize: 9,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(255,255,255,0.3)',
          transition: 'color 0.25s ease',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={`field-${name}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete={name === 'email' ? 'email' : name === 'name' ? 'name' : 'off'}
          className="ddw-input"
        />
        {/* CSS-driven focus underline — no JS, no GSAP, no state */}
        <span className="ddw-underline" aria-hidden="true" />
      </div>
    </div>
  );
});
FormField.displayName = 'FormField';

// ─── ContactForm ──────────────────────────────────────────────────────────────
/**
 * Key fixes:
 * - budgetFocused state removed; CSS :focus-within handles label color
 * - All FormField children memoized — only re-render the field being typed into
 * - handleChange stable via useCallback
 * - handleSubmit scaffolded for real async with error state
 * - isTouchDevice() removed from event handler (use IS_TOUCH constant)
 */
const ContactForm = memo(({ onSuccess }) => {
  const [formData,   setFormData]   = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const submitRef = useRef(null);
  useMagnetic(submitRef, 0.16);

  // Stable change handler — FormField children won't re-create this ref
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Scaffold for real submission — replace body with your API call
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // TODO: replace with real endpoint
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      await new Promise(res => setTimeout(res, 1200)); // remove in production
      onSuccess();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }, [formData, onSuccess]);

  const isBudgetFilled = formData.budget.length > 0;

  return (
    <>
      {/* Form header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 12,
        marginBottom: 32, flexWrap: 'wrap',
      }}>
        <div>
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)',
            fontFamily: 'JetBrains Mono', marginBottom: 6,
          }}>
            Project Enquiry
          </p>
          <h3
            className="font-heading"
            style={{
              fontSize: 'clamp(1.05rem,1.8vw,1.3rem)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-0.02em', lineHeight: 1.2,
            }}
          >
            Start a conversation.
          </h3>
        </div>
        <div style={{
          flexShrink: 0, padding: '5px 10px',
          border: '1px solid rgba(255,87,15,0.25)',
          color: '#FF570F', fontSize: 8.5, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.18em',
          fontFamily: 'JetBrains Mono',
          alignSelf: 'flex-start',
        }}>
          24h reply
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        noValidate
      >
        {/* Name + Email row */}
        <div className="form-name-email">
          <FormField
            label="Full Name"
            name="name"
            placeholder="John Smith"
            value={formData.name}
            onChange={handleChange}
          />
          <FormField
            label="Work Email"
            name="email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Company */}
        <FormField
          label="Company"
          name="company"
          placeholder="Acme Corp"
          value={formData.company}
          onChange={handleChange}
        />

        {/* Budget — select uses CSS data-filled pattern too */}
        <div
          className="ddw-field"
          data-filled={String(isBudgetFilled)}
        >
          <label
            className="ddw-label"
            htmlFor="field-budget"
            style={{
              display: 'block', marginBottom: 8,
              fontSize: 9, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.16em',
              fontFamily: 'JetBrains Mono',
              color: 'rgba(255,255,255,0.3)',
              transition: 'color 0.25s ease',
            }}
          >
            Budget Range
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="field-budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="ddw-input"
              style={{
                cursor: 'pointer',
                color: isBudgetFilled ? '#fff' : 'rgba(255,255,255,0.18)',
                paddingRight: 20,
              }}
            >
              <option value="">Select a range</option>
              {BUDGET_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              style={{
                position: 'absolute', right: 2, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
                color: 'rgba(255,255,255,0.25)',
              }}
              width="11" height="11" fill="none"
              stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div
          className="ddw-field"
          data-filled={String(formData.message.length > 0)}
        >
          <label
            className="ddw-label"
            htmlFor="field-message"
            style={{
              display: 'block', marginBottom: 8,
              fontSize: 9, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.16em',
              fontFamily: 'JetBrains Mono',
              color: 'rgba(255,255,255,0.3)',
              transition: 'color 0.25s ease',
            }}
          >
            Project Details
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              id="field-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project, goals, and timeline..."
              required
              rows={4}
              className="ddw-input"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p style={{
            fontSize: 11, color: '#ff4444',
            fontFamily: 'JetBrains Mono', letterSpacing: '0.06em',
          }}>
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          ref={submitRef}
          type="submit"
          disabled={submitting}
          onMouseEnter={e => {
            if (submitting || IS_TOUCH) return;
            e.currentTarget.style.background = '#e84e0a';
            e.currentTarget.style.boxShadow  = '0 0 40px rgba(255,87,15,0.4)';
          }}
          onMouseLeave={e => {
            if (submitting) return;
            e.currentTarget.style.background = '#FF570F';
            e.currentTarget.style.boxShadow  = 'none';
          }}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            width: '100%', minHeight: 50,
            padding: '13px 24px',
            background: submitting ? 'rgba(255,87,15,0.6)' : '#FF570F',
            color: '#080a0c',
            border: 'none', borderRadius: 0,
            fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em',
            cursor: submitting ? 'wait' : 'pointer',
            position: 'relative', overflow: 'hidden',
            transition: 'background 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          {!submitting && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                animation: 'shimmerOnce 2.8s ease 0.8s forwards',
                transform: 'translateX(-100%)',
              }}
            />
          )}
          <span style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {submitting ? (
              <>
                <svg
                  aria-hidden="true"
                  width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ animation: 'spinLoader 0.85s linear infinite' }}
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Sending…
              </>
            ) : (
              <>
                Send Enquiry
                <svg
                  aria-hidden="true"
                  width="13" height="13" fill="none"
                  stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </span>
        </button>

        <p style={{
          textAlign: 'center', fontSize: 10,
          color: 'rgba(255,255,255,0.18)',
          fontFamily: 'JetBrains Mono', letterSpacing: '0.1em',
        }}>
          We respond within 24 hours · No spam, ever
        </p>
      </form>
    </>
  );
});
ContactForm.displayName = 'ContactForm';

// ─── SuccessState ─────────────────────────────────────────────────────────────
const SuccessState = memo(() => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    // Use gsap.set for initial state — prevents invisible-on-JS-fail issue
    gsap.set(ref.current, { opacity: 0, scale: 0.9, y: 14 });
    const anim = gsap.to(ref.current, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.6, ease: 'expo.out',
    });
    return () => anim.kill();
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      style={{ textAlign: 'center', padding: '52px 0' }}
    >
      <div style={{
        width: 68, height: 68, borderRadius: '50%',
        background: 'rgba(255,87,15,0.07)',
        border: '1px solid rgba(255,87,15,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <svg
          width="24" height="24" fill="none"
          stroke="#FF570F" strokeWidth="2.5" viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3
        className="font-heading"
        style={{
          fontSize: 'clamp(1.3rem,2.5vw,1.6rem)',
          fontWeight: 900, color: '#fff',
          letterSpacing: '-0.03em', marginBottom: 10,
        }}
      >
        Message received.
      </h3>
      <p style={{
        fontSize: 13.5, color: 'rgba(255,255,255,0.36)',
        lineHeight: 1.75, maxWidth: 320, margin: '0 auto 28px',
        fontFamily: 'Inter',
      }}>
        We'll review your project and respond within 24 business hours.
      </p>

      {/* Progress dots — static, no state needed */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
        {[5, 20, 5].map((width, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              width, height: 5, borderRadius: 3,
              background: i === 1 ? '#FF570F' : 'rgba(255,87,15,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
});
SuccessState.displayName = 'SuccessState';

// ─── ContactInfoBlock ─────────────────────────────────────────────────────────
const ContactInfoBlock = memo(() => (
  <div style={{
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 36,
  }}>
    {CONTACT_INFO.map((item) => (
      <div
        key={item.label}
        style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '16px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          gap: 16, flexWrap: 'wrap',
        }}
      >
        <span style={{
          fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)',
          fontFamily: 'JetBrains Mono', flexShrink: 0,
        }}>
          {item.label}
        </span>
        <span style={{
          fontSize: 12.5, color: 'rgba(255,255,255,0.6)',
          fontFamily: 'Inter', wordBreak: 'break-word', textAlign: 'right',
        }}>
          {item.value}
        </span>
      </div>
    ))}
  </div>
));
ContactInfoBlock.displayName = 'ContactInfoBlock';

// ─── AvailabilityBadge ────────────────────────────────────────────────────────
const AvailabilityBadge = memo(() => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '7px 14px',
    background: 'rgba(34,197,94,0.06)',
    border: '1px solid rgba(34,197,94,0.18)',
    borderRadius: 999, marginBottom: 32,
  }}>
    <span style={{
      width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
      animation: 'nodePulse 2s ease-in-out infinite',
      display: 'inline-block', flexShrink: 0,
    }} />
    <span style={{
      fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.2em', color: 'rgba(34,197,94,0.85)',
      fontFamily: 'JetBrains Mono',
    }}>
      Now accepting Q3 projects
    </span>
  </div>
));
AvailabilityBadge.displayName = 'AvailabilityBadge';

// ─── CalendlyLink ─────────────────────────────────────────────────────────────
const CalendlyLink = memo(({ magnetRef }) => (
  <a
    ref={magnetRef}
    href={CALENDLY_URL}
    target="_blank"
    rel="noopener noreferrer"
    onMouseEnter={e => {
      if (IS_TOUCH) return;
      e.currentTarget.style.borderColor = '#FF570F';
      e.currentTarget.style.background  = 'rgba(255,87,15,0.06)';
      e.currentTarget.style.boxShadow   = '0 0 28px rgba(255,87,15,0.16)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,87,15,0.35)';
      e.currentTarget.style.background  = 'transparent';
      e.currentTarget.style.boxShadow   = 'none';
    }}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '12px 22px', minHeight: 46,
      background: 'transparent',
      border: '1px solid rgba(255,87,15,0.35)',
      color: '#FF570F',
      fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
      fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.14em',
      textDecoration: 'none',
      transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
    }}
  >
    Schedule a Strategy Call
    <svg
      aria-hidden="true"
      width="13" height="13" fill="none"
      stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
    >
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </a>
));
CalendlyLink.displayName = 'CalendlyLink';

// ─── BackgroundSVG ────────────────────────────────────────────────────────────
/**
 * Replaces two filter:blur() fixed-position divs.
 * SVG radial gradients: GPU-accelerated, no layout, no repaint on scroll.
 * position:absolute on a non-scrolling wrapper avoids fixed-position repaint.
 */
const BackgroundSVG = memo(() => (
  <>
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible',
        zIndex: 0,
      }}
    >
      <defs>
        <radialGradient id="cg-orb1" cx="92%" cy="0%" r="48%">
          <stop offset="0%" stopColor="#FF570F" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#FF570F" stopOpacity="0" />
          <animate
            attributeName="opacity"
            values="0.04;0.09;0.04"
            dur="8s"
            repeatCount="indefinite"
          />
        </radialGradient>
        <radialGradient id="cg-orb2" cx="0%" cy="100%" r="38%">
          <stop offset="0%" stopColor="#FDE87A" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FDE87A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#cg-orb1)" />
      <rect width="100%" height="100%" fill="url(#cg-orb2)" />
    </svg>

    {/* Dot grid — opacity so low it needs no compositing layer */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(255,87,15,0.45) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.012,
        pointerEvents: 'none',
      }}
    />
  </>
));
BackgroundSVG.displayName = 'BackgroundSVG';

// ─── ContactPage ──────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [submitted,  setSubmitted]  = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const leftRef   = useRef(null);
  const rightRef  = useRef(null);
  const ctaBtnRef = useRef(null);

  useMagnetic(ctaBtnRef, 0.22);
  useScrollFadeUp(leftRef,  { delay: 0,    y: 32 });
  useScrollFadeUp(rightRef, { delay: 0.12, y: 32 });

  // Stable callback — won't cause ContactForm re-render
  const handleSuccess = useCallback(() => setSubmitted(true), []);

  // Memoized AnimatedHeading lines — only recomputed if locale changes (never)
  const headingLines = useMemo(() => [
    <span
      key="line1"
      className="font-heading"
      style={{
        fontSize: 'clamp(2rem,4.5vw,3.2rem)',
        fontWeight: 900, color: '#fff', letterSpacing: '-0.03em',
      }}
    >
      Tell us what
    </span>,
    <span
      key="line2"
      className="font-heading"
      style={{
        fontSize: 'clamp(2rem,4.5vw,3.2rem)',
        fontWeight: 900, letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      you need.
    </span>,
  ], []);

  return (
    <main style={{
      background: '#080a0c',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/*
       * Background: position:absolute on main (not fixed).
       * No filter:blur — SVG gradients handle atmosphere.
       * This eliminates fixed-position repaint on every scroll frame.
       */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <BackgroundSVG />
      </div>

      <div style={{ position: 'relative', zIndex: 100 }}>
        <Navbar />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <PageHeader
          title="Let's Work Together"
          breadcrumb="Contact"
          subtitle="We work with a limited number of clients to ensure quality. Response within 24 hours."
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <StatsStrip />
      </div>

      {/* ── Main Grid ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)',
      }}>
        <div className="contact-main-grid">

          {/* ── LEFT — Info ── */}
          <div ref={leftRef} style={{ opacity: 0 }}>
            <div style={{ marginBottom: 24 }}>
              <Eyebrow pulse>Limited Availability</Eyebrow>
            </div>

            <AvailabilityBadge />

            <div style={{ marginBottom: 20 }}>
              <AnimatedHeading lines={headingLines} />
            </div>

            <p style={{
              fontSize: 'clamp(13.5px,1.3vw,15px)',
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.8, maxWidth: 420,
              marginBottom: 'clamp(32px,4vw,48px)',
              fontFamily: 'Inter',
            }}>
              We take on 3–4 new projects per quarter. If we're a fit, you'll
              hear back within 24 hours.
            </p>

            <ContactInfoBlock />

            <div style={{ marginBottom: 36 }}>
              <p style={{
                fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)',
                fontFamily: 'JetBrains Mono', marginBottom: 20,
              }}>
                Our Process
              </p>
              <ProcessSteps
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </div>

            <CalendlyLink magnetRef={ctaBtnRef} />
          </div>

          {/* ── RIGHT — Form Card ── */}
          <div ref={rightRef} style={{ opacity: 0 }} className="form-col-sticky">
            <div style={{
              background: '#0e1115',
              border: '1px solid rgba(255,255,255,0.07)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top accent line */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, #FF570F 0%, rgba(253,232,122,0.5) 60%, transparent 100%)',
                }}
              />

              {/* Corner glow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 200, height: 200, borderRadius: '0 0 0 100%',
                  background: 'radial-gradient(circle at top right, rgba(255,87,15,0.09), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Watermark */}
              <div
                aria-hidden="true"
                className="font-heading"
                style={{
                  position: 'absolute', bottom: -16, right: -8,
                  fontSize: 'clamp(80px,10vw,150px)',
                  fontWeight: 900, lineHeight: 1,
                  color: '#FF570F', opacity: 0.025,
                  pointerEvents: 'none', userSelect: 'none',
                }}
              >
                DDW
              </div>

              <div style={{
                position: 'relative', zIndex: 2,
                padding: 'clamp(28px,4vw,44px)',
              }}>
                {submitted
                  ? <SuccessState />
                  : <ContactForm onSuccess={handleSuccess} />
                }
              </div>
            </div>

            {/* Trust footnote */}
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0 4px',
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <p style={{
                fontSize: 9, color: 'rgba(255,255,255,0.18)',
                fontFamily: 'JetBrains Mono', textTransform: 'uppercase',
                letterSpacing: '0.16em', whiteSpace: 'nowrap',
              }}>
                Retainer-only · US & EU · Est. 2015
              </p>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </div>
          </div>

        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Footer />
      </div>
    </main>
  );
};

export default ContactPage;