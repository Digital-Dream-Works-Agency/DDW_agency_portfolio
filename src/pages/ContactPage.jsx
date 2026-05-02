import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// ─── Magnetic Hook ─────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            gsap.to(el, {
                x: (e.clientX - rect.left - rect.width / 2) * strength,
                y: (e.clientY - rect.top - rect.height / 2) * strength,
                duration: 0.4, ease: 'power2.out',
            });
        };
        const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Magnetic CTA ──────────────────────────────────────────────────────────────
// ─── Magnetic CTA ──────────────────────────────────────────────────────────────
const MagneticCTA = ({ href, children }) => {
    const ref = useRef(null);
    useMagnetic(ref, 0.25);
    return (
        <a // <--- Ye tag yahan missing tha
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group inline-flex items-center gap-3 px-10 py-5 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider overflow-hidden shadow-lg shadow-orange-vibrant/30 transition-shadow duration-300"
        >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-3">
                {children}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </a>
    );
};

// ─── Animated Form Field ───────────────────────────────────────────────────────
const FormField = ({ label, name, type = 'text', placeholder, value, onChange, required = true }) => {
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(false);

    return (
        <div className="relative">
            <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={(e) => { onChange(e); setFilled(e.target.value.length > 0); }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-3.5 bg-deep-black border border-orange-vibrant/20 text-pure-white placeholder-text-muted/50 text-sm focus:outline-none transition-all duration-300 rounded-none"
                    style={{
                        borderColor: focused ? '#FF570F' : filled ? 'rgba(255,87,15,0.4)' : 'rgba(255,87,15,0.2)',
                        boxShadow: focused ? '0 0 0 1px #FF570F, 0 4px 20px rgba(255,87,15,0.1)' : 'none',
                    }}
                />
                {/* Bottom accent line */}
                <div
                    className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 origin-left"
                    style={{
                        width: focused ? '100%' : '0%',
                        background: 'linear-gradient(90deg, #FF570F, #FDE87A)',
                    }}
                />
                {/* Filled checkmark */}
                {filled && !focused && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-orange-vibrant/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-orange-vibrant" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Contact Info Item ─────────────────────────────────────────────────────────
const ContactItem = ({ icon, title, lines }) => (
    <motion.div
        whileHover={{ x: 6 }}
        transition={{ duration: 0.3 }}
        className="flex items-start gap-5 group cursor-default"
    >
        <div className="w-12 h-12 rounded-xl bg-orange-vibrant/8 border border-orange-vibrant/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-orange-vibrant/15 group-hover:border-orange-vibrant/40 transition-all duration-300">
            {icon}
        </div>
        <div>
            <div className="text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-1">{title}</div>
            {lines.map((l) => (
                <div key={l} className="text-pure-white/70 text-sm group-hover:text-pure-white/90 transition-colors duration-300">{l}</div>
            ))}
        </div>
    </motion.div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', company: '', budget: '', message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const submitBtnRef = useRef(null);
    useMagnetic(submitBtnRef, 0.2);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate submission — replace with EmailJS / Formspree
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <PageHeader
                title="Let's Work Together"
                breadcrumb="Contact"
                subtitle="We work with a limited number of clients to ensure quality. Response within 24 hours."
            />

            <section className="py-24 bg-deep-black relative overflow-hidden">

                {/* Background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-vibrant/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                        {/* ── LEFT: Info ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="px-5 py-2 border border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-widest inline-block mb-8">
                                Start a Project
                            </span>

                            <h2 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-4 leading-tight">
                                Tell us what you need.
                            </h2>
                            <h2
                                className="text-4xl md:text-5xl font-heading font-black mb-8 leading-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    display: 'block',
                                }}
                            >
                                We'll tell you if we can help.
                            </h2>

                            <p className="text-text-muted text-lg leading-relaxed mb-14">
                                We work with a limited number of clients at a time to ensure quality. If we're a fit, you'll hear back within 24 hours.
                            </p>

                            <div className="space-y-8 mb-14">
                                {[
                                    { icon: '📍', title: 'Offices', lines: ['Rome, Italy', 'Florida, USA'] },
                                    { icon: '📩', title: 'Email', lines: ['hello@ddwagency.com'] },
                                    { icon: '📅', title: 'Book Directly', lines: ['30-min strategy call via Calendly'] },
                                ].map((item) => (
                                    <ContactItem key={item.title} {...item} />
                                ))}
                            </div>

                            <div className="pt-10 border-t border-orange-vibrant/10">
                                <MagneticCTA href="https://calendly.com/digi-dreamworks/onboarding-call">
                                    Schedule a Call Now
                                </MagneticCTA>
                            </div>
                        </motion.div>

                        {/* ── RIGHT: Form ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            {/* Card border glow */}
                            <div
                                className="absolute -inset-px rounded-2xl pointer-events-none"
                                style={{ background: 'linear-gradient(135deg, rgba(255,87,15,0.2), rgba(253,232,122,0.1), transparent 60%)', borderRadius: '1rem' }}
                            />

                            <div className="relative bg-bg-surface rounded-2xl p-8 md:p-10 border border-white/5 overflow-hidden">

                                {/* Inner glow */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-vibrant/5 rounded-full blur-3xl pointer-events-none" />

                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-16"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                                className="w-20 h-20 bg-orange-vibrant/15 border border-orange-vibrant/40 rounded-full flex items-center justify-center mx-auto mb-6"
                                            >
                                                <svg className="w-10 h-10 text-orange-vibrant" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                            <h3 className="text-2xl font-heading font-black text-pure-white mb-3">Message Received</h3>
                                            <p className="text-text-muted">We'll get back to you within 24 hours.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            onSubmit={handleSubmit}
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xl font-heading font-black text-pure-white">Project Enquiry</h3>
                                                <span className="text-xs text-text-muted uppercase tracking-widest">24h response</span>
                                            </div>

                                            <div className="space-y-6">

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

                                                <FormField
                                                    label="Company"
                                                    name="company"
                                                    placeholder="Acme Corp"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                />

                                                {/* Budget select */}
                                                <div>
                                                    <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">
                                                        Budget Range
                                                    </label>
                                                    <select
                                                        name="budget"
                                                        value={formData.budget}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3.5 bg-deep-black border border-orange-vibrant/20 text-pure-white text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300"
                                                        style={{ colorScheme: 'dark' }}
                                                    >
                                                        <option value="">Select budget range</option>
                                                        <option value="5k-15k">$5,000 – $15,000</option>
                                                        <option value="15k-50k">$15,000 – $50,000</option>
                                                        <option value="50k-100k">$50,000 – $100,000</option>
                                                        <option value="100k+">$100,000+</option>
                                                    </select>
                                                </div>

                                                {/* Message */}
                                                <div>
                                                    <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">
                                                        Project Details
                                                    </label>
                                                    <textarea
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        placeholder="Tell us about your project, goals, and timeline..."
                                                        required
                                                        rows={5}
                                                        className="w-full px-4 py-3.5 bg-deep-black border border-orange-vibrant/20 text-pure-white placeholder-text-muted/50 text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300 resize-none"
                                                    />
                                                </div>

                                                {/* Submit Button — magnetic */}
                                                <div ref={submitBtnRef}>
                                                    <button
                                                        type="submit"
                                                        disabled={submitting}
                                                        className="relative w-full py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider overflow-hidden group transition-all duration-300 disabled:opacity-70"
                                                    >
                                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                                        <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                                                        <span className="relative z-10">
                                                            {submitting ? (
                                                                <span className="flex items-center justify-center gap-2">
                                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                    </svg>
                                                                    Sending...
                                                                </span>
                                                            ) : 'Send Enquiry →'}
                                                        </span>
                                                    </button>
                                                </div>

                                                <p className="text-xs text-text-muted text-center">
                                                    We respond within 24 hours. No spam, ever.
                                                </p>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ContactPage;