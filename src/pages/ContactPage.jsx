import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', company: '', budget: '', message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here (e.g. EmailJS, Formspree, etc.)
        setSubmitted(true);
    };

    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <PageHeader title="Let's Work Together" breadcrumb="Contact" />

            <section className="py-20 bg-deep-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left: Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="px-5 py-2 border border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-widest inline-block mb-8">
                                Start a Project
                            </span>

                            <h2 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-6 leading-tight">
                                Tell us what you need.<br />
                                <span className="gradient-text">We'll tell you if we can help.</span>
                            </h2>

                            <p className="text-text-muted text-lg leading-relaxed mb-12">
                                We work with a limited number of clients at a time to ensure quality. If we're a fit, you'll hear back within 24 hours.
                            </p>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: '📍',
                                        title: 'Offices',
                                        lines: ['Rome, Italy', 'Florida, USA'],
                                    },
                                    {
                                        icon: '📩',
                                        title: 'Email',
                                        lines: ['hello@ddwagency.com'],
                                    },
                                    {
                                        icon: '📅',
                                        title: 'Book Directly',
                                        lines: ['30-min strategy call via Calendly'],
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-orange-vibrant/10 border border-orange-vibrant/20 flex items-center justify-center text-xl flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-1">{item.title}</div>
                                            {item.lines.map((l) => (
                                                <div key={l} className="text-pure-white/80 text-sm">{l}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-orange-vibrant/10">
                                <a 
                                    href="https://calendly.com/digi-dreamworks/onboarding-call"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="magnetic inline-flex items-center gap-3 px-10 py-5 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30 group"
                                >
                                    Schedule a Call Now
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>

                        {/* Right: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-bg-surface rounded-2xl p-8 md:p-10 border border-orange-vibrant/10"
                        >
                            {submitted ? (
                                <div className="text-center py-16">
                                    <div className="text-5xl mb-6">✅</div>
                                    <h3 className="text-2xl font-heading font-black text-pure-white mb-3">Message Received</h3>
                                    <p className="text-text-muted">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h3 className="text-xl font-heading font-black text-pure-white mb-8">
                                        Project Enquiry
                                    </h3>

                                    <div className="space-y-5">
                                        {[
                                            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Smith' },
                                            { label: 'Work Email', name: 'email', type: 'email', placeholder: 'john@company.com' },
                                            { label: 'Company', name: 'company', type: 'text', placeholder: 'Acme Corp' },
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    placeholder={field.placeholder}
                                                    required
                                                    className="w-full px-4 py-3 bg-deep-black border border-orange-vibrant/20 rounded-lg text-pure-white placeholder-text-muted text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300"
                                                />
                                            </div>
                                        ))}

                                        <div>
                                            <label className="block text-xs text-orange-vibrant font-bold uppercase tracking-widest mb-2">
                                                Budget Range
                                            </label>
                                            <select
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-deep-black border border-orange-vibrant/20 rounded-lg text-pure-white text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300"
                                            >
                                                <option value="">Select budget range</option>
                                                <option value="5k-15k">$5,000 – $15,000</option>
                                                <option value="15k-50k">$15,000 – $50,000</option>
                                                <option value="50k-100k">$50,000 – $100,000</option>
                                                <option value="100k+">$100,000+</option>
                                            </select>
                                        </div>

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
                                                className="w-full px-4 py-3 bg-deep-black border border-orange-vibrant/20 rounded-lg text-pure-white placeholder-text-muted text-sm focus:outline-none focus:border-orange-vibrant transition-colors duration-300 resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg mt-2"
                                        >
                                            Send Enquiry →
                                        </button>

                                        <p className="text-xs text-text-muted text-center mt-4">
                                            We respond within 24 hours. No spam, ever.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ContactPage;