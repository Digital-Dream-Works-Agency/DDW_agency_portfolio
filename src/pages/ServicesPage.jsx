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
    {
        number: '01', title: 'Meta Ads Management', icon: '📱',
        tagline: '$683K managed in a single month. 5.48x average ROAS.',
        desc: 'We run full-funnel Meta strategy for EU and US e-commerce brands — prospecting, retargeting, catalog ads, and creative testing. 343 active campaigns across one account. Not a single one running without a reason.',
        features: ['Full-funnel campaign architecture (prospecting + retargeting)', 'Dynamic catalog and shopping ads', 'Creative testing and iteration frameworks', 'Audience segmentation across EU and US markets', 'Monthly performance reporting with dashboard access'],
        deliverable: 'Live account access + monthly performance review', timeline: 'Ongoing retainer', color: 'from-orange-vibrant to-orange-soft', img: null,
    },
    {
        number: '02', title: 'Google Ads Management', icon: '🔍',
        tagline: '600% ROAS. €418K revenue on €69.7K spend.',
        desc: 'Search, shopping, and display campaigns built around real conversion data. We manage EU and US accounts across competitive verticals — home security, e-commerce, healthcare, lead gen. The ROAS numbers are from live accounts, not projections.',
        features: ['Search and shopping campaign architecture', 'Conversion tracking and attribution setup', 'Competitor and keyword gap analysis', 'Bid strategy optimisation and audience layering', 'Cross-market EU and US campaign management'],
        deliverable: 'Live account access + weekly optimisation log', timeline: 'Ongoing retainer', color: 'from-orange-soft to-cream', img: null,
    },
    {
        number: '03', title: 'Amazon Management', icon: '📦',
        tagline: '$2.7M in sales managed. Running since 2015.',
        desc: 'Full Amazon PPC management and seller central operations. We have managed one account continuously since 2015 — 129,800 orders, 27.64% ACOS. We handle everything: sponsored products, sponsored brands, listing optimisation, inventory strategy, and review management.',
        features: ['Sponsored Products, Brands, and Display campaigns', 'Seller Central operations and account health', 'Listing copy and A+ content optimisation', 'Inventory and FBA strategy', 'Review management and brand protection'],
        deliverable: 'Full account access + monthly ACOS and revenue report', timeline: 'Ongoing retainer', color: 'from-cream to-orange-vibrant', img: null,
    },
    {
        number: '04', title: 'TikTok Shop & Social Commerce', icon: '🎵',
        tagline: '$290K GMV in 7 days. 9,010 orders. +121% order growth.',
        desc: 'Full TikTok Shop setup, affiliate creator management, shoppable content strategy, and LIVE commerce execution. We built the infrastructure, recruited the affiliates, and ran the GMV — $290,753 in one week on a single account.',
        features: ['TikTok Shop setup and product onboarding', 'Affiliate creator recruitment and management', 'Shoppable video content strategy', 'LIVE commerce planning and execution', 'TikTok Ads integration for paid amplification'],
        deliverable: 'Live shop + affiliate network + weekly GMV report', timeline: 'Ongoing retainer', color: 'from-orange-vibrant to-orange-soft', img: null,
    },
    {
        number: '05', title: 'SEO & Organic Growth', icon: '📈',
        tagline: '2K to 54K monthly visitors. 251K clicks. 10.3M impressions.',
        desc: 'Technical SEO, content architecture, and link-building that compounds. We rebuilt Syncwire from 2K to 54K monthly visitors — full technical audit, site architecture overhaul, content strategy, and sustained link acquisition. All maintained on retainer.',
        features: ['Technical SEO audit and implementation', 'Site architecture and internal linking rebuild', 'Keyword research and content strategy', 'Link-building and authority acquisition', 'Core Web Vitals and crawl optimisation'],
        deliverable: 'SEO roadmap + monthly ranking and traffic report', timeline: 'Ongoing retainer', color: 'from-orange-soft to-cream', img: null,
    },
    {
        number: '06', title: 'AI Development & Custom Software', icon: '🤖',
        tagline: 'Built for your stack. Maintained by the team that built it.',
        desc: 'We build AI automation, custom software, and internal tools that your operation actually runs on. LLM pipelines, voice AI (Lyra), workflow automation, and full-stack web applications — all maintained on retainer by the same engineers who scoped it.',
        features: ['LLM and voice AI integration (OpenAI, Twilio, Google Cloud)', 'Custom web applications and internal tools', 'Workflow automation and decision pipelines', 'API design and third-party integrations', 'Cloud infrastructure on AWS / GCP'],
        deliverable: 'Production system + documentation + ongoing maintenance', timeline: 'Ongoing retainer', color: 'from-cream to-orange-vibrant', img: null,
    },
    {
        number: '07', title: 'SaaS Products', icon: '🚀',
        tagline: 'Lyra. Sviluppiamo.dev. Built and shipped by DDW.',
        desc: "We build and operate our own SaaS products. Lyra is an AI voice receptionist that answers every business call 24/7 — books appointments, qualifies leads, sends follow-ups. Sviluppiamo.dev is our Italian-market vibe coding platform. Both are live, paying products.",
        features: ['Lyra — AI voice receptionist (lyrabyddw.com)', 'Sviluppiamo.dev — Italian vibe coding platform', 'Twilio + AWS + Google Cloud infrastructure', 'Full product ownership from build to GTM', 'Available as white-label for select partners'],
        deliverable: 'Live product with full operational runbook', timeline: 'Ongoing operations', color: 'from-orange-vibrant to-cream', img: null,
    },
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
            <PageHeader title="Services" breadcrumb="Services" subtitle="Meta · Google · Amazon · TikTok · SEO · AI · SaaS. Seven retainer services. One team. Florida LLC with offices in Florida and Rome." />

            <section className="relative py-20 bg-deep-black overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                <div ref={prlx1Ref} className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-vibrant/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
                <div ref={prlx2Ref} className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cream/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-20">
                    <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-8 backdrop-blur-sm"><span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />What We Do</span>
                    <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-6 leading-tight perspective-[1000px]">
                        Every channel.{' '}<span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">One team.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted leading-relaxed">All seven retainer services are run by the same team. No handoffs, no account managers reading your numbers for the first time on the monthly call.</p>
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