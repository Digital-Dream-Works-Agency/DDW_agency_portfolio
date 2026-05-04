import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';

// ─── Custom GSAP Tilt Component ────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            xTo(x * 10); // tilt angle
            yTo(-y * 10); 
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Magnetic Hook (GSAP quickTo) ──────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });

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

const MagneticCTA = ({ href, children }) => {
    const ref = useRef(null);
    useMagnetic(ref, 0.25);
    return (
        <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className="relative group inline-flex items-center gap-3 px-10 py-5 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider overflow-hidden shadow-2xl shadow-orange-vibrant/40 transition-all duration-300 hover:shadow-orange-vibrant/60">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-3">
                {children}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
        </a>
    );
};

const FormField = ({ label, name, type = 'text', placeholder, value, onChange, required = true }) => {
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(false);
    return (
        <div className="relative">
            <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">{label}</label>
            <div className="relative">
                <input type={type} name={name} value={value} onChange={(e) => { onChange(e); setFilled(e.target.value.length > 0); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} required={required} className="w-full px-4 py-3.5 bg-deep-black border-2 border-orange-vibrant/20 text-pure-white placeholder-text-muted/50 text-sm focus:outline-none transition-all duration-300" style={{ borderColor: focused ? '#FF570F' : filled ? 'rgba(255,87,15,0.4)' : 'rgba(255,87,15,0.2)', boxShadow: focused ? '0 0 0 1px #FF570F, 0 4px 20px rgba(255,87,15,0.15)' : 'none' }} />
                <div className="absolute bottom-0 left-0 h-1 transition-all duration-500 origin-left" style={{ width: focused ? '100%' : '0%', background: 'linear-gradient(90deg, #FF570F, #FDE87A)' }} />
                {filled && !focused && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-vibrant/15 border border-orange-vibrant/30 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-orange-vibrant" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                )}
            </div>
        </div>
    );
};

const ContactItem = ({ icon, title, lines }) => (
    <GSAPTilt>
        <div className="flex items-start gap-5 group cursor-default p-5 rounded-xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/30 transition-all duration-300 bg-gradient-to-br from-[#151a1d] to-[#0d1012]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-vibrant to-orange-600 border-2 border-orange-vibrant/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-orange-vibrant/30">{icon}</div>
            <div>
                <div className="text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">{title}</div>
                {lines.map((l) => <div key={l} className="text-pure-white/70 text-sm group-hover:text-pure-white transition-colors duration-300">{l}</div>)}
            </div>
        </div>
    </GSAPTilt>
);

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', budget: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const submitBtnRef = useRef(null);
    const successRef = useRef(null);
    useMagnetic(submitBtnRef, 0.2);

    useEffect(() => {
        if (submitted && successRef.current) {
            gsap.fromTo(successRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
        }
    }, [submitted]);

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1500);
    };

    const contactInfo = [
        { icon: <svg className="w-6 h-6 text-deep-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Our Offices', lines: ['Rome, Italy', 'Florida, USA'] },
        { icon: <svg className="w-6 h-6 text-deep-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Email Us', lines: ['hello@ddwagency.com'] },
        { icon: <svg className="w-6 h-6 text-deep-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, title: 'Book Directly', lines: ['30-min strategy call via Calendly'] },
    ];

    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <PageHeader title="Let's Work Together" breadcrumb="Contact" subtitle="We work with a limited number of clients to ensure quality. Response within 24 hours." />

            <section className="relative py-24 bg-deep-black overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div className="gsap-fade-up">
                            <span className="inline-block px-5 py-2 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-widest rounded-full mb-8 backdrop-blur-sm"><span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />Start a Project</span>
                            <h2 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-4 leading-tight">Tell us what you need.</h2>
                            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 leading-tight bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">We'll tell you if we can help.</h2>
                            <p className="text-text-muted text-lg leading-relaxed mb-14">We work with a limited number of clients at a time to ensure quality. If we're a fit, you'll hear back within 24 hours.</p>
                            <div className="space-y-6 mb-14">{contactInfo.map((item) => <ContactItem key={item.title} {...item} />)}</div>
                            <div className="pt-10 border-t-2 border-orange-vibrant/20"><MagneticCTA href="https://calendly.com/digi-dreamworks/onboarding-call">Schedule a Call Now</MagneticCTA></div>
                        </div>

                        <div className="relative gsap-fade-up">
                            <GSAPTilt>
                                <div className="relative bg-gradient-to-br from-[#151a1d] to-[#0d1012] rounded-2xl p-8 md:p-10 border-2 border-orange-vibrant/20 overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-vibrant/10 rounded-full blur-3xl pointer-events-none" />
                                    {submitted ? (
                                        <div ref={successRef} className="relative text-center py-16 opacity-0">
                                            <div className="w-24 h-24 bg-gradient-to-br from-orange-vibrant to-orange-600 border-2 border-orange-vibrant/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-vibrant/50">
                                                <svg className="w-12 h-12 text-deep-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <h3 className="text-3xl font-heading font-black text-pure-white mb-3">Message Received</h3>
                                            <p className="text-text-muted text-lg">We'll get back to you within 24 hours.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="relative">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-2xl font-heading font-black text-pure-white">Project Enquiry</h3>
                                                <span className="px-3 py-1 bg-orange-vibrant/15 border border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-widest rounded-full">24h Response</span>
                                            </div>
                                            <div className="space-y-6">
                                                <FormField label="Full Name" name="name" placeholder="John Smith" value={formData.name} onChange={handleChange} />
                                                <FormField label="Work Email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} />
                                                <FormField label="Company" name="company" placeholder="Acme Corp" value={formData.company} onChange={handleChange} />
                                                <div>
                                                    <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">Budget Range</label>
                                                    <select name="budget" value={formData.budget} onChange={handleChange} required className="w-full px-4 py-3.5 bg-deep-black border-2 border-orange-vibrant/20 text-pure-white text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300">
                                                        <option value="">Select budget range</option>
                                                        <option value="5k-15k">$5,000 – $15,000</option>
                                                        <option value="15k-50k">$15,000 – $50,000</option>
                                                        <option value="50k-100k">$50,000 – $100,000</option>
                                                        <option value="100k+">$100,000+</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">Project Details</label>
                                                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project, goals, and timeline..." required rows={5} className="w-full px-4 py-3.5 bg-deep-black border-2 border-orange-vibrant/20 text-pure-white placeholder-text-muted/50 text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300 resize-none" />
                                                </div>
                                                <div ref={submitBtnRef}>
                                                    <button type="submit" disabled={submitting} className="relative w-full py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider overflow-hidden group transition-all duration-300 disabled:opacity-70 shadow-lg shadow-orange-vibrant/40">
                                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                                        <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                                                        <span className="relative z-10">{submitting ? 'Sending...' : 'Send Enquiry →'}</span>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-text-muted text-center">We respond within 24 hours. No spam, ever.</p>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </GSAPTilt>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default ContactPage;