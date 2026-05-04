import { useEffect, useRef, useState } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

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
            xTo(x * 5); // Subtle tilt for cards
            yTo(-y * 5); 
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Services Data ──────────────────────────────────────────────────────────────
const servicesData = [
    { number: '01', title: 'Custom Software Development', tagline: 'Built for scale. Designed for growth.', desc: 'Enterprise-grade web applications, internal tools, and bespoke system architecture designed for high-stakes operations. We architect systems that are maintainable, scalable, and built to last.', features: ['Full-stack web application development', 'API design and third-party integrations', 'Database architecture and optimization', 'Legacy system modernization', 'Code audits and technical due diligence'], deliverable: 'Production-ready system with full documentation', timeline: '6–16 weeks', color: 'from-orange-vibrant to-orange-soft', img: null, icon: '💻' },
    { number: '02', title: 'AI Development & Integration', tagline: 'LLMs that work for your business, not the other way around.', desc: 'We integrate large language models and AI automation into your existing workflows. From customer-facing chatbots to internal data pipelines, we build AI that generates measurable ROI.', features: ['LLM API integration (OpenAI, Anthropic, custom)', 'Retrieval-Augmented Generation (RAG) systems', 'Workflow automation with AI decision layers', 'Custom fine-tuning and prompt engineering', 'AI-powered analytics dashboards'], deliverable: 'Integrated AI system with monitoring dashboard', timeline: '4–10 weeks', color: 'from-cream to-orange-vibrant', img: null, icon: '🤖' },
    { number: '03', title: 'Cloud Infrastructure & DevOps', tagline: 'Ship faster. Break nothing.', desc: 'Secure, scalable cloud environments with automated CI/CD pipelines. We handle architecture, deployment, monitoring, and security so your team can focus on building.', features: ['AWS / GCP / Azure architecture design', 'Automated CI/CD pipeline setup', 'Docker and Kubernetes orchestration', 'Security hardening and compliance', 'Performance monitoring and alerting'], deliverable: 'Fully automated infrastructure with runbook', timeline: '3–8 weeks', color: 'from-orange-soft to-maroon-dark', img: null, icon: '☁️' },
    { number: '04', title: 'Strategic Technical Consulting', tagline: 'The CTO you need, without the full-time cost.', desc: 'Fractional CTO services, technical audits, and architectural roadmaps. We help you make the right technical decisions before you build — saving months of rework and hundreds of thousands in wasted budget.', features: ['Technical architecture review', 'Build vs. buy analysis', 'Engineering team assessment', 'Vendor and technology selection', 'Roadmap planning and prioritization'], deliverable: 'Architecture document + prioritized roadmap', timeline: '1–4 weeks', color: 'from-orange-vibrant to-cream', img: null, icon: '📊' },
    { number: '05', title: 'Marketing Systems & Automation', tagline: 'Your marketing stack, finally connected.', desc: 'We build unified marketing infrastructure that connects your CRM, email platform, ad accounts, and analytics into one coherent growth engine — fully automated and measurable.', features: ['CRM setup and migration (HubSpot, Salesforce)', 'Email automation sequences', 'Ad platform integration and tracking', 'Attribution modeling', 'Reporting dashboards'], deliverable: 'Connected marketing stack with SOP documentation', timeline: '4–8 weeks', color: 'from-cream to-orange-soft', img: null, icon: '📈' },
    { number: '06', title: 'SEO & Content Strategy', tagline: 'Organic growth that compounds.', desc: 'Data-backed technical SEO and content strategy to build long-term market authority. We focus on the 20% of optimizations that drive 80% of results — not vanity metrics.', features: ['Technical SEO audit and fixes', 'Keyword research and content planning', 'Link building and authority building', 'Core Web Vitals optimization', 'Monthly performance reporting'], deliverable: 'SEO roadmap + monthly execution report', timeline: 'Ongoing monthly retainer', color: 'from-orange-vibrant to-maroon-dark', img: null, icon: '🔍' },
];

const useMagneticEffect = (ref, strength = 0.2) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, [strength]);
};

const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.3);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                opacity: 0, y: 60, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true }
            });
        }, cardRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef}>
            <GSAPTilt>
                <div className="group grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 transition-all duration-500 bg-gradient-to-br from-[#151a1d] to-[#0d1012] shadow-2xl hover:shadow-orange-vibrant/20">
                    <div className="lg:col-span-4 overflow-hidden relative h-64 lg:h-auto">
                        {service.img ? <img src={service.img} alt={service.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#0e1012] to-[#080808]"><div className="w-full h-full opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '24px 24px' }} /></div>}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0d1012]/50 to-[#0d1012] lg:bg-gradient-to-r lg:from-transparent lg:via-[#0d1012]/80 lg:to-[#0d1012]" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700 mix-blend-overlay`} />
                        <div className="absolute top-6 left-6">
                            <div className="relative">
                                <span className="text-6xl md:text-7xl font-black text-orange-vibrant/20 group-hover:text-orange-vibrant/40 transition-colors duration-500">{service.number}</span>
                                <span className="absolute -top-2 -right-2 text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:rotate-12">{service.icon}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-vibrant/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    <div className="lg:col-span-5 p-8 lg:p-10 relative">
                        <div className={`inline-block w-16 h-1.5 bg-gradient-to-r ${service.color} rounded-full mb-6 group-hover:w-24 transition-all duration-500`} />
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black text-pure-white mb-3 group-hover:text-orange-vibrant transition-colors duration-300 leading-tight">{service.title}</h3>
                        <p className="text-orange-vibrant text-sm md:text-base font-bold mb-6 italic opacity-80 group-hover:opacity-100 transition-opacity">{service.tagline}</p>
                        <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8 group-hover:text-pure-white/70 transition-colors">{service.desc}</p>
                        <ul className="space-y-3">
                            {service.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-pure-white/70 group-hover:text-pure-white/90 transition-colors duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                                    <div className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${service.color} flex-shrink-0 group-hover:scale-125 transition-transform duration-300`} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3 p-8 lg:p-10 border-t-2 lg:border-t-0 lg:border-l-2 border-orange-vibrant/10 group-hover:border-orange-vibrant/30 transition-colors duration-500 flex flex-col justify-between relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
                        <div className="relative z-10 space-y-8">
                            <div>
                                <div className="text-[10px] text-orange-vibrant font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><div className={`w-1 h-1 rounded-full bg-gradient-to-r ${service.color}`} /> Deliverable</div>
                                <div className="text-sm text-pure-white/90 leading-relaxed">{service.deliverable}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-orange-vibrant font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><div className={`w-1 h-1 rounded-full bg-gradient-to-r ${service.color}`} /> Timeline</div>
                                <div className="text-sm text-pure-white/90 font-bold">{service.timeline}</div>
                            </div>
                        </div>
                        <Link ref={btnRef} to="/contact" className="relative mt-8 w-full text-center px-6 py-4 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 block overflow-hidden group/btn shadow-lg shadow-orange-vibrant/40">
                            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <span className="relative z-10 flex items-center justify-center gap-2">Get a Quote <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
                        </Link>
                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                    </div>
                </div>
            </GSAPTilt>
        </div>
    );
};

const ServicesPage = () => {
    useSeoMeta(SEO.services);
    const headingRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    useEffect(() => {
        if (headingRef.current && !textSplit) {
            const split = new SplitType(headingRef.current, { types: 'words' });
            setTextSplit(split);
            gsap.from(split.words, {
                opacity: 0, y: 50, rotationX: -45, transformOrigin: 'top center', stagger: 0.06, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 80%', once: true },
            });
        }
        return () => { if (textSplit) textSplit.revert(); };
    }, [textSplit]);

    useEffect(() => {
        gsap.to(prlx1Ref.current, { yPercent: 30, ease: "none", scrollTrigger: { scrub: true } });
        gsap.to(prlx2Ref.current, { yPercent: -30, ease: "none", scrollTrigger: { scrub: true } });
    }, []);

    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <PageHeader title="Our Services" breadcrumb="Services" subtitle="Enterprise-grade solutions built for businesses that cannot afford to fail." />

            <section className="relative py-20 bg-deep-black overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                <div ref={prlx1Ref} className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-vibrant/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
                <div ref={prlx2Ref} className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cream/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-20">
                    <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-8 backdrop-blur-sm"><span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />What We Do</span>
                    <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight perspective-[1000px]">
                        Solutions That Scale <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">With Your Business</span>
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted leading-relaxed">From technical strategy to full-stack execution, we build systems that drive measurable growth.</p>
                </div>
            </section>

            <section className="py-20 bg-deep-black">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="space-y-12">
                        {servicesData.map((service, index) => <ServiceCard key={index} service={service} index={index} />)}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-deep-black to-[#0d1012]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-6">Not Sure Where to Start?</h3>
                    <p className="text-lg text-text-muted mb-10">Book a free 30-minute consultation to discuss your technical challenges.</p>
                    <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/40 group">
                        Schedule Consultation <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default ServicesPage;