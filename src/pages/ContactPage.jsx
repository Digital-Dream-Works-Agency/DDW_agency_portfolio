import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: #080a0c;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }

    .font-heading { font-family: 'Montserrat', sans-serif; }
    .font-mono    { font-family: 'JetBrains Mono', monospace; }

    /* ── Form inputs ── */
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
      border-bottom-color: rgba(255, 87, 15, 0.6);
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
    @keyframes orbitCW {
      from { transform: rotate(0deg);   }
      to   { transform: rotate(360deg); }
    }
    @keyframes orbitCCW {
      from { transform: rotate(0deg);    }
      to   { transform: rotate(-360deg); }
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
      50%       { box-shadow: 0 0 0 8px rgba(255,87,15,0);  }
    }

    /* ── Stat card hover ── */
    .stat-card:hover {
      background: rgba(255,87,15,0.03) !important;
    }
    .stat-card:hover .stat-value {
      color: #FF570F !important;
    }

    /* ── Step hover ── */
    .step-row:hover .step-dot-inner {
      background: #FF570F !important;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #080a0c; }
    ::-webkit-scrollbar-thumb { background: rgba(255,87,15,0.2); border-radius: 2px; }
  `}</style>
);

// ─── Utility ───────────────────────────────────────────────────────────────────
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// ─── Hook: Magnetic ────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
  useEffect(() => {
    const el = ref?.current;
    if (!el || isTouchDevice()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
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
  }, [strength]);
};

// ─── Hook: ScrollFadeUp ────────────────────────────────────────────────────────
const useScrollFadeUp = (ref, { delay = 0, y = 36 } = {}) => {
  useEffect(() => {
    if (!ref?.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out', delay,
          scrollTrigger: { trigger: ref.current, start: 'top 87%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, y]);
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Eyebrow Tag ───────────────────────────────────────────────────────────────
const Eyebrow = ({ children, pulse = false }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '5px 14px', borderRadius: 999,
    background: 'rgba(255,87,15,0.07)',
    border: '1px solid rgba(255,87,15,0.25)',
  }}>
    {pulse && (
      <span style={{ position: 'relative', width: 7, height: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
      fontFamily: 'JetBrains Mono, monospace',
      lineHeight: 1,
    }}>
      {children}
    </span>
  </div>
);

// ─── Stats Strip ───────────────────────────────────────────────────────────────
const CountUp = ({ end, suffix = '', duration = 2 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration, ease: 'power2.out',
        onUpdate: () => setVal(Math.round(obj.v)),
      });
      io.disconnect();
    }, { threshold: 0.6 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const StatsStrip = () => {
  const stats = [
    { value: 98,  suffix: '%', label: 'Client Satisfaction' },
    { value: 24,  suffix: 'h', label: 'Avg. Response Time'  },
    { value: 47,  suffix: '+', label: 'Projects Delivered'  },
    { value: 6,   suffix: '+', label: 'Years in Business'   },
  ];
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.querySelectorAll('.stat-item'),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,32px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
          className="stats-strip-grid"
        >
          <style>{`
            @media (min-width: 768px) {
              .stats-strip-grid { grid-template-columns: repeat(4, 1fr) !important; }
            }
          `}</style>

          {stats.map((s, i) => (
            <div
              key={s.label}
              className="stat-item stat-card"
              style={{
                opacity: 0,
                textAlign: 'center',
                padding: '28px 16px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'background 0.3s ease',
                cursor: 'default',
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
                  transition: 'color 0.3s ease',
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
};

// ─── Animated Heading ──────────────────────────────────────────────────────────
const AnimatedHeading = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const lines = ref.current.querySelectorAll('.ah-line');
    if (!lines.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(lines,
        { yPercent: 105, skewX: 2, opacity: 0 },
        {
          yPercent: 0, skewX: 0, opacity: 1,
          duration: 0.9, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const lines = React.Children.toArray(children);
  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden', lineHeight: 1.12 }}>
          <span className="ah-line" style={{ display: 'block', willChange: 'transform, opacity' }}>
            {line}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Process Steps ─────────────────────────────────────────────────────────────
const steps = [
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

const ProcessSteps = ({ activeStep, setActiveStep }) => {
  const lineRef = useRef(null);
  useEffect(() => {
    if (!lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.4, ease: 'expo.inOut',
          scrollTrigger: { trigger: lineRef.current, start: 'top 78%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* ── Desktop ── */}
      <div
        className="steps-desktop"
        style={{ display: 'none', position: 'relative', paddingLeft: 26 }}
      >
        <style>{`@media (min-width:1024px){ .steps-desktop{ display:block !important; } }`}</style>

        {/* Vertical line */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute', left: 6, top: 6, bottom: 6,
            width: 1, transformOrigin: 'top',
            background: 'linear-gradient(to bottom, rgba(255,87,15,0.8), rgba(255,87,15,0.06))',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <div
                key={i}
                className="step-row"
                onClick={() => setActiveStep(i)}
                style={{
                  position: 'relative',
                  paddingBottom: i < steps.length - 1 ? 26 : 0,
                  cursor: 'pointer',
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

                {/* Content */}
                <div style={{
                  fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.2em', color: '#FF570F',
                  fontFamily: 'JetBrains Mono', marginBottom: 4,
                }}>
                  {step.num}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 700, marginBottom: isActive ? 8 : 0,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.25s ease',
                  lineHeight: 1.4,
                }}>
                  {step.title}
                </div>
                {isActive && (
                  <div style={{
                    fontSize: 12.5, color: 'rgba(255,255,255,0.36)',
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

      {/* ── Mobile ── */}
      <div
        className="steps-mobile"
        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        <style>{`@media (min-width:1024px){ .steps-mobile{ display:none !important; } }`}</style>
        {steps.map((step, i) => (
          <div
            key={i}
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
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.4 }}>
              {step.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
              {step.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Form Field ────────────────────────────────────────────────────────────────
const FormField = ({ label, name, type = 'text', placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, {
      width: focused ? '100%' : '0%',
      duration: 0.38, ease: 'power2.out',
    });
  }, [focused]);

  const isFilled = value?.length > 0;

  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: 8,
        fontSize: 9,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        fontFamily: 'JetBrains Mono, monospace',
        color: focused ? '#FF570F' : 'rgba(255,255,255,0.3)',
        transition: 'color 0.25s ease',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          className="ddw-input"
          style={{
            borderBottomColor: isFilled
              ? 'rgba(255,87,15,0.35)'
              : 'rgba(255,255,255,0.09)',
          }}
        />
        {/* Animated focus underline */}
        <span
          ref={lineRef}
          style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '1.5px', width: '0%',
            background: 'linear-gradient(90deg, #FF570F, #FDE87A)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

// ─── Contact Form ──────────────────────────────────────────────────────────────
const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', budget: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [budgetFocused, setBudgetFocused] = useState(false);
  const submitRef = useRef(null);
  useMagnetic(submitRef, 0.16);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onSuccess(); }, 1800);
  };

  return (
    <>
      {/* Form header row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 32,
        flexWrap: 'wrap',
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
          flexShrink: 0,
          padding: '5px 10px',
          border: '1px solid rgba(255,87,15,0.25)',
          color: '#FF570F',
          fontSize: 8.5, fontWeight: 800,
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
      >
        {/* Name + Email */}
        <div style={{ display: 'grid', gap: 24 }} className="form-name-email">
          <style>{`@media (min-width:560px){ .form-name-email{ grid-template-columns: 1fr 1fr !important; } }`}</style>
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

        {/* Budget */}
        <div>
          <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 9, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.16em',
            fontFamily: 'JetBrains Mono',
            color: budgetFocused ? '#FF570F' : 'rgba(255,255,255,0.3)',
            transition: 'color 0.25s ease',
          }}>
            Budget Range
          </label>
          <div style={{ position: 'relative' }}>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              onFocus={() => setBudgetFocused(true)}
              onBlur={() => setBudgetFocused(false)}
              required
              className="ddw-input"
              style={{
                cursor: 'pointer',
                color: formData.budget ? '#fff' : 'rgba(255,255,255,0.18)',
                borderBottomColor: formData.budget
                  ? 'rgba(255,87,15,0.35)'
                  : 'rgba(255,255,255,0.09)',
                paddingRight: 20,
              }}
            >
              <option value="">Select a range</option>
              <option value="5k-15k">$5,000 – $15,000</option>
              <option value="15k-50k">$15,000 – $50,000</option>
              <option value="50k-100k">$50,000 – $100,000</option>
              <option value="100k+">$100,000+</option>
            </select>
            <svg
              style={{
                position: 'absolute', right: 2, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
                color: 'rgba(255,255,255,0.25)',
              }}
              width="11" height="11" fill="none" stroke="currentColor"
              strokeWidth="2" viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 9, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.16em',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(255,255,255,0.3)',
          }}>
            Project Details
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project, goals, and timeline..."
              required
              rows={4}
              className="ddw-input"
              style={{
                borderBottomColor: formData.message
                  ? 'rgba(255,87,15,0.35)'
                  : 'rgba(255,255,255,0.09)',
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            ref={submitRef}
            type="submit"
            disabled={submitting}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
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
            onMouseEnter={e => {
              if (submitting || isTouchDevice()) return;
              e.currentTarget.style.background = '#e84e0a';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255,87,15,0.4)';
            }}
            onMouseLeave={e => {
              if (submitting) return;
              e.currentTarget.style.background = '#FF570F';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Shimmer sweep */}
            {!submitting && (
              <span style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)',
                animation: 'shimmerOnce 2.8s ease 0.8s forwards',
                transform: 'translateX(-100%)',
              }} />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              {submitting ? (
                <>
                  <svg
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
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>

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
};

// ─── Success State ─────────────────────────────────────────────────────────────
const SuccessState = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, scale: 0.9, y: 14 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '52px 0',
        opacity: 0,
      }}
    >
      {/* Check circle */}
      <div style={{
        width: 68, height: 68, borderRadius: '50%',
        background: 'rgba(255,87,15,0.07)',
        border: '1px solid rgba(255,87,15,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <svg width="24" height="24" fill="none" stroke="#FF570F" strokeWidth="2.5" viewBox="0 0 24 24">
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

      <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: i === 1 ? 20 : 5,
              height: 5, borderRadius: 3,
              background: i === 1 ? '#FF570F' : 'rgba(255,87,15,0.25)',
              transition: 'width 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Contact Info Block ────────────────────────────────────────────────────────
const contactInfo = [
  { label: 'Offices',  value: 'Rome, Italy · Florida, USA'           },
  { label: 'Email',    value: 'hello@digitaldreamworksagency.com'     },
  { label: 'Response', value: 'Within 24 business hours'             },
];

const ContactInfoBlock = () => (
  <div style={{
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 36,
  }}>
    {contactInfo.map((item) => (
      <div
        key={item.label}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          gap: 16,
          flexWrap: 'wrap',
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
);

// ─── Availability Badge ────────────────────────────────────────────────────────
const AvailabilityBadge = () => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '7px 14px',
    background: 'rgba(34,197,94,0.06)',
    border: '1px solid rgba(34,197,94,0.18)',
    borderRadius: 999,
    marginBottom: 32,
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
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const ContactPage = () => {
  const [submitted,  setSubmitted]  = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const leftRef   = useRef(null);
  const rightRef  = useRef(null);
  const ctaBtnRef = useRef(null);

  useMagnetic(ctaBtnRef, 0.22);

  useScrollFadeUp(leftRef,  { delay: 0,    y: 32 });
  useScrollFadeUp(rightRef, { delay: 0.12, y: 32 });

  return (
    <>
      <GlobalStyles />

      <main style={{
        background: '#080a0c',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}>

        {/* ── Atmospheric background (fixed) ── */}
        <div style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none', zIndex: 0,
        }}>
          {/* Top-right orb */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-8%',
            width: 'clamp(360px,48vw,720px)',
            height: 'clamp(360px,48vw,720px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FF570F, transparent 68%)',
            filter: 'blur(160px)',
            animation: 'breatheOrb 8s ease-in-out infinite',
          }} />
          {/* Bottom-left orb */}
          <div style={{
            position: 'absolute', bottom: '-5%', left: '-10%',
            width: 'clamp(260px,38vw,580px)',
            height: 'clamp(260px,38vw,580px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FDE87A, transparent 68%)',
            filter: 'blur(140px)',
            opacity: 0.4,
          }} />
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,87,15,0.45) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.012,
          }} />
        </div>

        {/* ── Navbar ── */}
        <div style={{ position: 'relative', zIndex: 100 }}>
          <Navbar />
        </div>

        {/* ── Page Header ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <PageHeader
            title="Let's Work Together"
            breadcrumb="Contact"
            subtitle="We work with a limited number of clients to ensure quality. Response within 24 hours."
          />
        </div>

        {/* ── Stats Strip ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <StatsStrip />
        </div>

        {/* ══════════════════════════════════════════
            MAIN CONTENT GRID
        ══════════════════════════════════════════ */}
        <section style={{
          position: 'relative', zIndex: 10,
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(56px,7vw,88px) clamp(20px,4vw,40px)',
        }}>
          <div
            className="contact-main-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(48px,6vw,72px)', alignItems: 'start' }}
          >
            <style>{`
              @media (min-width: 1024px) {
                .contact-main-grid {
                  grid-template-columns: 1fr 1fr !important;
                  gap: clamp(56px,6vw,96px) !important;
                }
              }
            `}</style>

            {/* ══════════════════════════════
                LEFT — Info
            ══════════════════════════════ */}
            <div ref={leftRef} style={{ opacity: 0 }}>

              {/* Limited availability */}
              <div style={{ marginBottom: 24 }}>
                <Eyebrow pulse>Limited Availability</Eyebrow>
              </div>

              {/* Availability badge */}
              <AvailabilityBadge />

              {/* Main heading */}
              <div style={{ marginBottom: 20 }}>
                <AnimatedHeading>
                  <span
                    className="font-heading"
                    style={{
                      fontSize: 'clamp(2rem,4.5vw,3.2rem)',
                      fontWeight: 900, color: '#fff',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Tell us what
                  </span>
                  <span
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
                  </span>
                </AnimatedHeading>
              </div>

              {/* Body copy */}
              <p style={{
                fontSize: 'clamp(13.5px,1.3vw,15px)',
                color: 'rgba(255,255,255,0.42)',
                lineHeight: 1.8,
                maxWidth: 420,
                marginBottom: 'clamp(32px,4vw,48px)',
                fontFamily: 'Inter',
              }}>
                We take on 3–4 new projects per quarter. If we're a fit, you'll hear back within 24 hours.
              </p>

              {/* Contact info rows */}
              <ContactInfoBlock />

              {/* Process steps */}
              <div style={{ marginBottom: 36 }}>
                <p style={{
                  fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)',
                  fontFamily: 'JetBrains Mono', marginBottom: 20,
                }}>
                  Our Process
                </p>
                <ProcessSteps activeStep={activeStep} setActiveStep={setActiveStep} />
              </div>

              {/* Calendly CTA */}
              <a
                ref={ctaBtnRef}
                href="https://calendly.com/digi-dreamworks/onboarding-call"
                target="_blank"
                rel="noopener noreferrer"
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
                onMouseEnter={e => {
                  if (isTouchDevice()) return;
                  e.currentTarget.style.borderColor = '#FF570F';
                  e.currentTarget.style.background = 'rgba(255,87,15,0.06)';
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(255,87,15,0.16)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,87,15,0.35)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Schedule a Strategy Call
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* ══════════════════════════════
                RIGHT — Form Card
            ══════════════════════════════ */}
            <div ref={rightRef} style={{ opacity: 0 }} className="form-col-sticky">
              <style>{`
                @media (min-width: 1024px) {
                  .form-col-sticky { position: sticky !important; top: 100px !important; }
                }
              `}</style>

              {/* Form card */}
              <div style={{
                background: '#0e1115',
                border: '1px solid rgba(255,255,255,0.07)',
                position: 'relative',
                overflow: 'hidden',
              }}>

                {/* Top orange accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, #FF570F 0%, rgba(253,232,122,0.5) 60%, transparent 100%)',
                }} />

                {/* Corner radial glow */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 200, height: 200, borderRadius: '0 0 0 100%',
                  background: 'radial-gradient(circle at top right, rgba(255,87,15,0.09), transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Watermark */}
                <div
                  className="font-heading"
                  style={{
                    position: 'absolute',
                    bottom: -16, right: -8,
                    fontSize: 'clamp(80px,10vw,150px)',
                    fontWeight: 900, lineHeight: 1,
                    color: '#FF570F', opacity: 0.025,
                    pointerEvents: 'none', userSelect: 'none',
                  }}
                >
                  DDW
                </div>

                {/* Inner padding */}
                <div style={{
                  position: 'relative', zIndex: 2,
                  padding: 'clamp(28px,4vw,44px)',
                }}>
                  {submitted
                    ? <SuccessState />
                    : <ContactForm onSuccess={() => setSubmitted(true)} />
                  }
                </div>
              </div>

              {/* Trust footnote below card */}
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

        {/* ── Footer ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Footer />
        </div>

      </main>
    </>
  );
};

export default ContactPage;