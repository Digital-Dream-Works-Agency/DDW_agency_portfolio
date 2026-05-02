// src/components/Solutions.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const solutionsData = [
    {
        title: "Custom Software Development",
        desc: "Enterprise-grade web applications and bespoke system architecture designed for high-stakes operations.",
        features: ["Scalable Architecture", "Bespoke Design", "API Integration"],
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        color: "from-orange-vibrant to-orange-soft"
    },
    {
        title: "AI Development & Integration",
        desc: "Seamless LLM integration and workflow automation tailored to your enterprise systems.",
        features: ["LLM Infrastructure", "Workflow Automation", "Custom Models"],
        image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M12 12L2.1 12.3" />
            </svg>
        ),
        color: "from-cream to-orange-vibrant"
    },
    {
        title: "Cloud Infrastructure & DevOps",
        desc: "Secure, scalable cloud environments with automated CI/CD pipelines for continuous deployment.",
        features: ["Automated Pipelines", "Cloud Scaling", "Security Hardening"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-15 4.5 4.5 4.5 0 0 0 2.5 8.5h10z" />
            </svg>
        ),
        color: "from-orange-soft to-maroon-dark"
    },
    {
        title: "Strategic Consulting",
        desc: "Fractional CTO services and technical audits to guide your architectural roadmap.",
        features: ["Technical Audits", "Architectural Roadmap", "Executive Advisory"],
        image: "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=800",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
        color: "from-orange-vibrant to-cream"
    },
    {
        title: "Marketing Systems & Automation",
        desc: "Unified marketing infrastructure connecting CRM, ESP, and analytics into a single growth engine.",
        features: ["CRM Integration", "Email Automation", "Analytics Dashboard"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 20v-6M6 20V10M18 20V4" />
            </svg>
        ),
        color: "from-cream to-orange-soft"
    },
    {
        title: "SEO & Content Strategy",
        desc: "Data-backed Technical SEO and content strategy to build long-term market authority.",
        features: ["Technical SEO", "Content Strategy", "Link Building"],
        image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        color: "from-orange-vibrant to-maroon-dark"
    }
];

const Solutions = () => {
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".solutions-header", {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".solutions-header",
                    start: "top 85%",
                }
            });

            // Cards Stagger Animation
            gsap.from(".solution-card", {
                y: 80,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 75%",
                }
            });
        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="solutions" className="py-20 bg-deep-black relative overflow-hidden">
            
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-vibrant/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cream/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6" ref={gridRef}>

                {/* Section Header */}
                <div className="solutions-header text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block mb-6"
                    >
                        <span className="px-4 py-2 border border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-wider">
                            Enterprise Solutions
                        </span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 leading-tight">
                        Solutions Built For
                        <br />
                        <span className="gradient-text">Modern Brands</span>
                    </h2>

                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Empowering your digital journey with state-of-the-art technology services tailored for growth and innovation.
                    </p>
                </div>

                {/* Solutions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutionsData.map((solution, index) => (
                        <motion.div
                            key={index}
                            className="solution-card group relative h-[500px] bg-bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-orange-vibrant/30 transition-all duration-500 cursor-pointer"
                            whileHover={{ y: -10 }}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={solution.image}
                                    alt={solution.title}
                                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/90 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                
                                {/* Top: Icon & Number */}
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-xl bg-gradient-to-br ${solution.color} text-deep-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        {solution.icon}
                                    </div>
                                    <span className="text-6xl font-black text-white/5 group-hover:text-orange-vibrant/10 transition-colors">
                                        0{index + 1}
                                    </span>
                                </div>

                                {/* Bottom: Title, Desc, Features */}
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-heading font-bold text-pure-white group-hover:text-orange-vibrant transition-colors">
                                        {solution.title}
                                    </h3>

                                    <p className="text-sm text-text-muted leading-relaxed">
                                        {solution.desc}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {solution.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-pure-white/80">
                                                <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${solution.color}`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-orange-vibrant text-deep-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Solutions;