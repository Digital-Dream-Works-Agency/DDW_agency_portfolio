import { useState, useRef, useEffect } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
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
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Animated Number Counter ────────────────────────────────────────────────────
const CountUp = ({ end, suffix = '', duration = 2 }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                gsap.to({ v: 0 }, {
                    v: end, duration,
                    ease: 'power2.out',
                    onUpdate: function () { setVal(Math.round(this.targets()[0].v)); },
                });
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [end, duration]);
    return <span ref={ref}>{val}{suffix}</span>;
};

// ─── Split‑line Heading Animation ───────────────────────────────────────────────
const AnimatedHeading = ({ lines }) => {
    const containerRef = useRef(null);
    useEffect(() => {
        const spans = containerRef.current?.querySelectorAll('.line-inner');
        if (!spans?.length) return;
        gsap.fromTo(spans,
            { yPercent: 110, skewX: 3 },
            { yPercent: 0, skewX: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true } }
        );
    }, []);
    return (
        <div ref={containerRef}>
            {lines.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
                    <span className="line-inner" style={{ display: 'block', willChange: 'transform' }}>{line}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Form Field ─────────────────────────────────────────────────────────────────
const FormField = ({ label, name, type = 'text', placeholder, value, onChange }) => {
    const [focused, setFocused] = useState(false);
    const filled = value.length > 0;
    return (
        <div>
            <label
                style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: focused ? '#FF570F' : 'rgba(255,255,255,0.4)', marginBottom: '8px', transition: 'color 0.2s', fontWeight: 600 }}
            >{label}</label>
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
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `1px solid ${focused ? '#FF570F' : filled ? 'rgba(255,87,15,0.35)' : 'rgba(255,255,255,0.12)'}`,
                        color: '#fff',
                        fontSize: '15px',
                        padding: '10px 0',
                        outline: 'none',
                        transition: 'border-color 0.25s',
                        boxSizing: 'border-box',
                    }}
                    className="contact-input"
                />
                {/* animated underline */}
                <span style={{
                    position: 'absolute',
                    bottom: 0, left: 0,
                    height: '1px',
                    width: focused ? '100%' : '0%',
                    background: 'linear-gradient(90deg,#FF570F,#FDE87A)',
                    transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
                }} />
            </div>
        </div>
    );
};

// ─── Main Contact Page ──────────────────────────────────────────────────────────
const ContactPage = () => {
    useSeoMeta(SEO.contact);

    const [formData, setFormData] = useState({ name: '', email: '', company: '', budget: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const ctaBtnRef = useRef(null);
    const submitBtnRef = useRef(null);
    const successRef = useRef(null);
    const lineRef = useRef(null);

    useMagnetic(ctaBtnRef, 0.22);
    useMagnetic(submitBtnRef, 0.18);

    // Vertical line draw
    useEffect(() => {
        if (!lineRef.current) return;
        gsap.fromTo(lineRef.current, { scaleY: 0 }, {
            scaleY: 1, duration: 1.4, ease: 'expo.inOut',
            scrollTrigger: { trigger: lineRef.current, start: 'top 70%', once: true }
        });
    }, []);

    useEffect(() => {
        if (submitted && successRef.current) {
            gsap.fromTo(successRef.current,
                { opacity: 0, scale: 0.88, y: 16 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'expo.out' }
            );
        }
    }, [submitted]);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1600);
    };

    // Steps for process display (left column lower section)
    const steps = [
        { num: '01', title: 'Tell us about your project', body: 'Fill the form or book a call directly. We read every submission personally.' },
        { num: '02', title: 'We evaluate the fit', body: 'Not every project is a match. We\'ll be honest if we\'re not the right team for you.' },
        { num: '03', title: 'Strategy call within 24h', body: 'If we\'re aligned, you\'ll get a calendar invite within one business day.' },
        { num: '04', title: 'Proposal & kickoff', body: 'A scoped proposal arrives in 48h. No vague retainers — just clear deliverables.' },
    ];

    const stats = [
        { value: 98, suffix: '%', label: 'Client Satisfaction' },
        { value: 24, suffix: 'h', label: 'Response Time' },
        { value: 40, suffix: '+', label: 'Projects Delivered' },
        { value: 6, suffix: '+', label: 'Years Experience' },
    ];

    return (
        <main style={{ background: '#0A0B0D', minHeight: '100vh', fontFamily: 'inherit' }}>
            <style>{`
                ::placeholder { color: rgba(255,255,255,0.22) !important; }
                .contact-input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0A0B0D inset !important; -webkit-text-fill-color: #fff !important; }
                select option { background: #0d1015; color: #fff; }
                textarea { resize: none; }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
                @keyframes fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .stat-card:hover { border-color: rgba(255,87,15,0.35) !important; background: rgba(255,87,15,0.04) !important; }
                .step-item:hover .step-dot { background: #FF570F !important; box-shadow: 0 0 0 4px rgba(255,87,15,0.2) !important; }
            `}</style>

            <Navbar />
            <PageHeader title="Let's Work Together" breadcrumb="Contact" subtitle="We work with a limited number of clients to ensure quality. Response within 24 hours." />

            {/* ── Stats Strip ─────────────────────────────────────────────────── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                    {stats.map((s, i) => (
                        <div key={i} className="stat-card" style={{
                            padding: '28px 0', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            border: '1px solid transparent', transition: 'all 0.3s',
                        }}>
                            <div style={{ fontSize: '34px', fontWeight: 800, color: '#FF570F', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                <CountUp end={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Section ────────────────────────────────────────────────── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '96px 32px 120px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

                {/* LEFT ─ Info + Process */}
                <div style={{ animation: 'fade-up 0.7s ease both' }}>
                    {/* Tag */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', border: '1px solid rgba(255,87,15,0.3)', borderRadius: '100px', marginBottom: '32px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF570F', display: 'inline-block', position: 'relative' }}>
                            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#FF570F', animation: 'pulse-ring 1.8s ease-out infinite' }} />
                        </span>
                        <span style={{ fontSize: '11px', color: '#FF570F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Limited Availability</span>
                    </div>

                    {/* Heading */}
                    <div style={{ marginBottom: '20px' }}>
                        <AnimatedHeading lines={[
                            <span style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, display: 'block' }}>Tell us what</span>,
                            <span style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 900, lineHeight: 1.1, display: 'block', background: 'linear-gradient(95deg,#FF570F 30%,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>you need.</span>,
                        ]} />
                    </div>

                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '56px', maxWidth: '400px' }}>
                        We take on 3–4 new projects per quarter. If we're a fit, you'll hear back within 24 hours.
                    </p>

                    {/* Contact info — inline, no cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '56px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        {[
                            { label: 'Offices', value: 'Rome, Italy · Florida, USA' },
                            { label: 'Email', value: 'hello@digitaldreamworksagency.com' },
                            { label: 'Response', value: 'Within 24 business hours' },
                        ].map((item) => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{item.label}</span>
                                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Process Steps */}
                    <div style={{ position: 'relative', paddingLeft: '24px' }}>
                        {/* Vertical timeline line */}
                        <div ref={lineRef} style={{
                            position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '1px',
                            background: 'linear-gradient(to bottom, #FF570F, rgba(255,87,15,0.05))',
                            transformOrigin: 'top', willChange: 'transform',
                        }} />
                        {steps.map((step, i) => (
                            <div key={i} className="step-item" onClick={() => setActiveStep(i)} style={{ position: 'relative', paddingBottom: i < steps.length - 1 ? '32px' : 0, cursor: 'pointer' }}>
                                <div className="step-dot" style={{
                                    position: 'absolute', left: '-20px', top: '4px',
                                    width: '9px', height: '9px', borderRadius: '50%',
                                    background: activeStep === i ? '#FF570F' : 'rgba(255,255,255,0.18)',
                                    border: activeStep === i ? '2px solid #FF570F' : '2px solid rgba(255,255,255,0.2)',
                                    transition: 'all 0.25s', boxSizing: 'border-box',
                                }} />
                                <div style={{ fontSize: '10px', color: '#FF570F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>{step.num}</div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: activeStep === i ? '#fff' : 'rgba(255,255,255,0.5)', marginBottom: activeStep === i ? '6px' : 0, transition: 'color 0.25s' }}>{step.title}</div>
                                {activeStep === i && (
                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, animation: 'fade-up 0.3s ease both' }}>{step.body}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: '48px' }}>
                        <a ref={ctaBtnRef} href="https://calendly.com/digi-dreamworks/onboarding-call" target="_blank" rel="noopener noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '14px 28px', background: 'transparent',
                            border: '1px solid rgba(255,87,15,0.45)', color: '#FF570F',
                            fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
                            textTransform: 'uppercase', transition: 'all 0.25s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,87,15,0.08)'; e.currentTarget.style.borderColor = '#FF570F'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,87,15,0.45)'; }}>
                            <span>Schedule a strategy call</span>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>

                {/* RIGHT ─ Form */}
                <div style={{ position: 'sticky', top: '120px', animation: 'fade-up 0.7s 0.15s ease both', opacity: 0, animationFillMode: 'forwards' }}>
                    <div style={{
                        background: '#0E1014',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '48px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Decorative corner accent */}
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top right, rgba(255,87,15,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                        {submitted ? (
                            <div ref={successRef} style={{ textAlign: 'center', padding: '48px 0', opacity: 0 }}>
                                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,87,15,0.1)', border: '1px solid rgba(255,87,15,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <svg width="28" height="28" fill="none" stroke="#FF570F" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Message received.</h3>
                                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>We'll review your project and get back<br />to you within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: '6px' }}>Project Enquiry</div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>Start a conversation.</h3>
                                    </div>
                                    <span style={{ padding: '5px 12px', border: '1px solid rgba(255,87,15,0.3)', color: '#FF570F', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '2px' }}>24h reply</span>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <FormField label="Full name" name="name" placeholder="John Smith" value={formData.name} onChange={handleChange} />
                                        <FormField label="Work email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <FormField label="Company" name="company" placeholder="Acme Corp" value={formData.company} onChange={handleChange} />

                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600 }}>Budget range</label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                name="budget" value={formData.budget} onChange={handleChange} required
                                                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${formData.budget ? 'rgba(255,87,15,0.35)' : 'rgba(255,255,255,0.12)'}`, color: formData.budget ? '#fff' : 'rgba(255,255,255,0.22)', fontSize: '15px', padding: '10px 0', outline: 'none', cursor: 'pointer', appearance: 'none', transition: 'border-color 0.25s' }}
                                                className="contact-input"
                                            >
                                                <option value="" style={{ color: 'rgba(255,255,255,0.22)' }}>Select budget range</option>
                                                <option value="5k-15k">$5,000 – $15,000</option>
                                                <option value="15k-50k">$15,000 – $50,000</option>
                                                <option value="50k-100k">$50,000 – $100,000</option>
                                                <option value="100k+">$100,000+</option>
                                            </select>
                                            <svg style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.3)' }} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600 }}>Project details</label>
                                        <textarea
                                            name="message" value={formData.message} onChange={handleChange}
                                            placeholder="Tell us about your project, goals, and timeline..."
                                            required rows={4}
                                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${formData.message ? 'rgba(255,87,15,0.35)' : 'rgba(255,255,255,0.12)'}`, color: '#fff', fontSize: '15px', padding: '10px 0', outline: 'none', resize: 'none', transition: 'border-color 0.25s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                            className="contact-input"
                                        />
                                    </div>

                                    <div ref={submitBtnRef} style={{ marginTop: '4px' }}>
                                        <button
                                            type="submit" disabled={submitting}
                                            style={{
                                                width: '100%', padding: '16px', background: submitting ? 'rgba(255,87,15,0.7)' : '#FF570F',
                                                border: 'none', color: '#0A0B0D', fontSize: '13px', fontWeight: 800,
                                                textTransform: 'uppercase', letterSpacing: '0.1em', cursor: submitting ? 'wait' : 'pointer',
                                                transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
                                            }}
                                            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#e84e0a'; }}
                                            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#FF570F'; }}
                                        >
                                            {submitting ? (
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                    <svg style={{ animation: 'spin 0.9s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                                    Sending…
                                                </span>
                                            ) : 'Send Enquiry →'}
                                        </button>
                                    </div>

                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', textAlign: 'center', margin: 0 }}>
                                        We respond within 24 hours · No spam, ever
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>

            </section>
            <Footer />

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </main>
    );
};

export default ContactPage;