import { useState, useRef, useEffect } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Hook (disabled on touch) ──────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(hover: none)').matches) return;

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

// ─── Animated Number Counter ────────────────────────────────────────────────
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

// ─── Split‑line Heading Animation ───────────────────────────────────────────
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

// ─── Form Field ─────────────────────────────────────────────────────────────
const FormField = ({ label, name, type = 'text', placeholder, value, onChange }) => {
    const [focused, setFocused] = useState(false);
    const filled = value.length > 0;
    return (
        <div>
            <label className="text-[10px] sm:text-[11px] block tracking-[0.12em] uppercase mb-2 transition-colors duration-200 font-semibold"
                style={{ color: focused ? '#FF570F' : 'rgba(255,255,255,0.4)' }}>
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    required
                    className="contact-input w-full bg-transparent border-none text-white text-sm sm:text-[15px] py-2.5 sm:py-3 outline-none transition-all"
                    style={{
                        borderBottom: `1px solid ${focused ? '#FF570F' : filled ? 'rgba(255,87,15,0.35)' : 'rgba(255,255,255,0.12)'}`,
                    }}
                />
                <span className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#FF570F] to-[#FDE87A] transition-all duration-400"
                    style={{ width: focused ? '100%' : '0%' }} />
            </div>
        </div>
    );
};

// ─── Main Contact Page ──────────────────────────────────────────────────────
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
        <main className="bg-[#0A0B0D] min-h-screen">
            <style>{`
                ::placeholder { color: rgba(255,255,255,0.22) !important; }
                .contact-input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0A0B0D inset !important; -webkit-text-fill-color: #fff !important; }
                select option { background: #0d1015; color: #fff; }
                textarea { resize: none; }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
                @keyframes fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .stat-card:hover { border-color: rgba(255,87,15,0.35) !important; background: rgba(255,87,15,0.04) !important; }
                .step-item:hover .step-dot { background: #FF570F !important; box-shadow: 0 0 0 4px rgba(255,87,15,0.2) !important; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <Navbar />
            <PageHeader 
                title="Let's Work Together" 
                breadcrumb="Contact" 
                subtitle="We work with a limited number of clients to ensure quality. Response within 24 hours." 
            />

            {/* ── Stats Strip ─────────────────────────────────────────────────── */}
            <div className="border-t border-b border-white/[0.06] bg-white/[0.015]">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
                        {stats.map((s, i) => (
                            <div key={i} className="stat-card py-6 sm:py-7 text-center border border-transparent transition-all duration-300">
                                <div className="text-2xl sm:text-[34px] font-extrabold text-[#FF570F] tracking-tight leading-none">
                                    <CountUp end={s.value} suffix={s.suffix} />
                                </div>
                                <div className="text-[9px] sm:text-[11px] text-white/40 uppercase tracking-wider mt-1.5 sm:mt-2 font-medium">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Section ────────────────────────────────────────────────── */}
            <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* LEFT ─ Info + Process */}
                    <div style={{ animation: 'fade-up 0.7s ease both' }}>
                        {/* Tag */}
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 border border-[#FF570F]/30 rounded-full mb-6 sm:mb-8">
                            <span className="relative w-1.5 h-1.5 rounded-full bg-[#FF570F]">
                                <span className="absolute inset-0 rounded-full bg-[#FF570F] animate-[pulse-ring_1.8s_ease-out_infinite]" />
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-[#FF570F] font-bold uppercase tracking-wider">
                                Limited Availability
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="mb-4 sm:mb-5">
                            <AnimatedHeading lines={[
                                <span className="text-[clamp(2rem,5vw,3.25rem)] font-black text-white leading-[1.1] block">
                                    Tell us what
                                </span>,
                                <span className="text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.1] block bg-gradient-to-r from-[#FF570F] via-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">
                                    you need.
                                </span>,
                            ]} />
                        </div>

                        <p className="text-sm sm:text-base text-white/45 leading-relaxed mb-10 sm:mb-14 max-w-md">
                            We take on 3–4 new projects per quarter. If we're a fit, you'll hear back within 24 hours.
                        </p>

                        {/* Contact info */}
                        <div className="flex flex-col border-t border-white/[0.07] mb-10 sm:mb-14">
                            {[
                                { label: 'Offices', value: 'Rome, Italy · Florida, USA' },
                                { label: 'Email', value: 'hello@digitaldreamworksagency.com' },
                                { label: 'Response', value: 'Within 24 business hours' },
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-5 border-b border-white/[0.07] gap-1 sm:gap-0">
                                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/30 font-semibold">
                                        {item.label}
                                    </span>
                                    <span className="text-xs sm:text-sm text-white/70 break-words">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Process Steps */}
                        <div className="relative pl-6 sm:pl-7 hidden lg:block">
                            <div ref={lineRef} className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#FF570F] to-[#FF570F]/5 origin-top" />
                            {steps.map((step, i) => (
                                <div 
                                    key={i} 
                                    className="step-item relative cursor-pointer"
                                    style={{ paddingBottom: i < steps.length - 1 ? '32px' : 0 }}
                                    onClick={() => setActiveStep(i)}
                                >
                                    <div className="step-dot absolute left-[-20px] top-1 w-[9px] h-[9px] rounded-full border-2 transition-all duration-250"
                                        style={{
                                            background: activeStep === i ? '#FF570F' : 'rgba(255,255,255,0.18)',
                                            borderColor: activeStep === i ? '#FF570F' : 'rgba(255,255,255,0.2)',
                                        }} />
                                    <div className="text-[10px] text-[#FF570F] font-bold uppercase tracking-wider mb-1">{step.num}</div>
                                    <div className="text-sm font-bold transition-colors duration-250 mb-1.5"
                                        style={{ color: activeStep === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                                        {step.title}
                                    </div>
                                    {activeStep === i && (
                                        <div className="text-[13px] text-white/40 leading-relaxed" style={{ animation: 'fade-up 0.3s ease both' }}>
                                            {step.body}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile: Show all steps expanded */}
                        <div className="flex flex-col gap-5 lg:hidden">
                            {steps.map((step, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-[#FF570F]/20">
                                    <div className="text-[10px] text-[#FF570F] font-bold uppercase tracking-wider mb-1">
                                        {step.num}
                                    </div>
                                    <div className="text-sm font-bold text-white mb-1.5">
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-white/40 leading-relaxed">
                                        {step.body}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-8 sm:mt-12">
                            <a 
                                ref={ctaBtnRef}
                                href="https://calendly.com/digi-dreamworks/onboarding-call" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-transparent border border-[#FF570F]/45 text-[#FF570F] text-xs sm:text-[13px] font-bold tracking-wide uppercase transition-all duration-250 hover:bg-[#FF570F]/8 hover:border-[#FF570F]"
                            >
                                <span>Schedule a strategy call</span>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT ─ Form */}
                    <div className="lg:sticky lg:top-32" style={{ animation: 'fade-up 0.7s 0.15s ease both', opacity: 0, animationFillMode: 'forwards' }}>
                        <div className="bg-[#0E1014] border border-white/[0.08] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,87,15,0.12)_0%,transparent_70%)] pointer-events-none" />

                            {submitted ? (
                                <div ref={successRef} className="text-center py-12 opacity-0">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF570F]/10 border border-[#FF570F]/30 flex items-center justify-center mx-auto mb-6">
                                        <svg width="24" height="24" fill="none" stroke="#FF570F" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl sm:text-[26px] font-extrabold text-white mb-2.5">
                                        Message received.
                                    </h3>
                                    <p className="text-sm sm:text-[15px] text-white/40 leading-relaxed">
                                        We'll review your project and get back<br className="hidden sm:block" />
                                        to you within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start sm:items-center justify-between mb-8 sm:mb-10 flex-col sm:flex-row gap-3 sm:gap-0">
                                        <div>
                                            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/30 font-semibold mb-1.5">
                                                Project Enquiry
                                            </div>
                                            <h3 className="text-xl sm:text-[22px] font-extrabold text-white leading-tight">
                                                Start a conversation.
                                            </h3>
                                        </div>
                                        <span className="px-3 py-1.5 border border-[#FF570F]/30 text-[#FF570F] text-[9px] sm:text-[10px] font-bold uppercase tracking-wide rounded-sm">
                                            24h reply
                                        </span>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField label="Full name" name="name" placeholder="John Smith" value={formData.name} onChange={handleChange} />
                                            <FormField label="Work email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} />
                                        </div>
                                        <FormField label="Company" name="company" placeholder="Acme Corp" value={formData.company} onChange={handleChange} />

                                        <div>
                                            <label className="block text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-white/40 mb-2 font-semibold">
                                                Budget range
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="budget" 
                                                    value={formData.budget} 
                                                    onChange={handleChange} 
                                                    required
                                                    className="contact-input w-full bg-transparent border-none text-sm sm:text-[15px] py-2.5 sm:py-3 outline-none cursor-pointer appearance-none transition-all"
                                                    style={{
                                                        borderBottom: `1px solid ${formData.budget ? 'rgba(255,87,15,0.35)' : 'rgba(255,255,255,0.12)'}`,
                                                        color: formData.budget ? '#fff' : 'rgba(255,255,255,0.22)',
                                                    }}
                                                >
                                                    <option value="">Select budget range</option>
                                                    <option value="5k-15k">$5,000 – $15,000</option>
                                                    <option value="15k-50k">$15,000 – $50,000</option>
                                                    <option value="50k-100k">$50,000 – $100,000</option>
                                                    <option value="100k+">$100,000+</option>
                                                </select>
                                                <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-white/30" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-white/40 mb-2 font-semibold">
                                                Project details
                                            </label>
                                            <textarea
                                                name="message" 
                                                value={formData.message} 
                                                onChange={handleChange}
                                                placeholder="Tell us about your project, goals, and timeline..."
                                                required 
                                                rows={4}
                                                className="contact-input w-full bg-transparent border-none text-white text-sm sm:text-[15px] py-2.5 sm:py-3 outline-none resize-none transition-all"
                                                style={{
                                                    borderBottom: `1px solid ${formData.message ? 'rgba(255,87,15,0.35)' : 'rgba(255,255,255,0.12)'}`,
                                                }}
                                            />
                                        </div>

                                        <div ref={submitBtnRef}>
                                            <button
                                                type="submit" 
                                                disabled={submitting}
                                                className="w-full py-3.5 sm:py-4 border-none text-[#0A0B0D] text-xs sm:text-[13px] font-extrabold uppercase tracking-wide transition-all duration-250 relative overflow-hidden disabled:cursor-wait"
                                                style={{
                                                    background: submitting ? 'rgba(255,87,15,0.7)' : '#FF570F',
                                                }}
                                                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#e84e0a'; }}
                                                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#FF570F'; }}
                                            >
                                                {submitting ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                                        </svg>
                                                        Sending…
                                                    </span>
                                                ) : 'Send Enquiry →'}
                                            </button>
                                        </div>

                                        <p className="text-[11px] sm:text-xs text-white/25 text-center">
                                            We respond within 24 hours · No spam, ever
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ContactPage;