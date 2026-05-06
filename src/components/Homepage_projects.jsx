import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const featuredProjects = [
    {
        id: 'meta-eu-fashion',
        title: 'EU Fashion & Golf Brand',
        category: 'Meta Ads',
        description: '$683K managed in a single month. 343 campaigns. 76M impressions. 5.48 ROAS across the full account. One of our longest-running Meta retainers.',
        img: null,
        proof: null,
        tags: ['Meta Ads', 'EU Market', 'E-Commerce'],
        metrics: [
            { label: 'Monthly Spend Managed', value: '$683K' },
            { label: 'Average ROAS', value: '5.48x' },
            { label: 'Active Campaigns', value: '343' },
        ],
        featured: true,
    },
    {
        id: 'amazon-us',
        title: 'Amazon Brand — US Market',
        category: 'Amazon Management',
        description: "$2.7M in sales managed. 27.64% ACOS. 129,800 orders. We've run this account since 2015 — full PPC management and seller central operations.",
        img: '/portfolio/amazon-ads-main.png',
        proof: '/portfolio/amazon-ads-main.png',
        tags: ['Amazon Ads', 'Amazon FBA', 'USA'],
        metrics: [
            { label: 'Total Sales Managed', value: '$2.7M+' },
            { label: 'ACOS', value: '27.64%' },
            { label: 'Orders', value: '129,800' },
        ],
    },
    {
        id: 'mathfel-google',
        title: 'Mathfel — Video Door Intercom',
        category: 'Google Ads',
        description: 'EU Google Ads campaign: 600% ROAS on €69.7K spend. €418K in revenue. Competitive home security market, EU audience.',
        img: '/portfolio/google-ads-600roas.png',
        proof: '/portfolio/google-ads-600roas.png',
        tags: ['Google Ads', 'EU Market', 'E-Commerce'],
        metrics: [
            { label: 'ROAS', value: '600%' },
            { label: 'Revenue', value: '€418K' },
        ],
    },
    {
        id: 'tiktok-shop',
        title: 'TikTok Shop — E-Commerce',
        category: 'TikTok Shop',
        description: '$290,753 GMV in 7 days. 9,010 orders. +121% order growth. Full TikTok Shop setup, affiliate management, and shoppable content strategy.',
        img: '/portfolio/tiktok-shop.png',
        proof: '/portfolio/tiktok-shop.png',
        tags: ['TikTok Shop', 'E-Commerce', 'Social Commerce'],
        metrics: [
            { label: '7-Day GMV', value: '$290K' },
            { label: 'Orders', value: '9,010' },
            { label: 'Order Growth', value: '+121%' },
        ],
    },
    {
        id: 'seo-syncwire',
        title: 'Syncwire — E-Commerce SEO',
        category: 'SEO',
        description: 'From 2K to 54K monthly visitors. 251K total clicks. 10.3M impressions. Full SEO: technical audit, content, link-building, and site architecture rebuild.',
        img: '/portfolio/seo-251k.png',
        proof: '/portfolio/seo-251k.png',
        tags: ['SEO', 'E-Commerce', 'Organic Growth'],
        metrics: [
            { label: 'Monthly Visitors', value: '2K → 54K' },
            { label: 'Total Clicks', value: '251K' },
            { label: 'Impressions', value: '10.3M' },
        ],
    },
    {
        id: 'lyra-saas',
        title: 'Lyra — AI Voice Receptionist',
        category: 'Product Built',
        description: 'Our flagship AI SaaS. Answers every call, books appointments, sends qualified leads — 24/7. Powered by Twilio, AWS, and Google Cloud. Built and shipped by DDW.',
        img: null,
        proof: null,
        url: 'https://lyrabyddw.com',
        tags: ['AI SaaS', 'Voice AI', 'Built by DDW'],
        metrics: [
            { label: 'Calls Handled', value: '978+' },
            { label: 'Availability', value: '24/7' },
            { label: 'Built by DDW', value: 'Live' },
        ],
    },
];

// ─── Abstract Dashboard Visual (for no-image cards) ───────────────────────────
const MetricsDashboard = ({ project }) => {
    const bars = [55, 80, 40, 95, 65, 100, 45, 75, 60, 88];
    return (
        <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="w-full h-full max-w-sm mx-auto relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-orange-vibrant/5 rounded-2xl blur-3xl" />
                {/* Dashboard card */}
                <div className="relative w-full h-full rounded-2xl border border-white/8 bg-[#0d0d0f] overflow-hidden flex flex-col p-6">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-vibrant/40" />
                        </div>
                        <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{project.category}</span>
                    </div>
                    {/* Primary metric */}
                    <div className="mb-6">
                        <div className="text-4xl font-black text-orange-vibrant mb-1">{project.metrics[0]?.value}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest">{project.metrics[0]?.label}</div>
                    </div>
                    {/* Bar chart */}
                    <div className="flex-1 flex items-end gap-1.5">
                        {bars.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
                                <div
                                    className="w-full rounded-t-sm"
                                    style={{
                                        height: `${h}%`,
                                        background: i === bars.indexOf(Math.max(...bars))
                                            ? 'linear-gradient(to top, #FF570F, #FDE87A)'
                                            : 'rgba(255,87,15,0.2)',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Bottom metrics row */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                        {project.metrics.slice(1).map((m, i) => (
                            <div key={i}>
                                <div className="text-sm font-black text-white/80">{m.value}</div>
                                <div className="text-[9px] text-white/25 uppercase tracking-wider">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Featured Hero Card ───────────────────────────────────────────────────────
const HeroProjectCard = ({ project }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const dest = project.url || '/projects';
    const isExternal = !!project.url;

    const inner = (
        <div className="group relative h-[560px] md:h-[620px] rounded-2xl overflow-hidden border border-orange-vibrant/20 hover:border-orange-vibrant/40 transition-all duration-700 bg-[#080809] cursor-pointer">

            {/* Background */}
            <div className="absolute inset-0">
                {project.img ? (
                    <>
                        {!imageLoaded && <div className="absolute inset-0 bg-[#0d0d0f]" />}
                        <img
                            src={project.img} alt={project.title} loading="eager"
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/70 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-transparent" />
                    </>
                ) : (
                    <>
                        {/* Subtle grid */}
                        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,87,15,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                        {/* Right side dashboard */}
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                            <MetricsDashboard project={project} />
                        </div>
                        {/* Fade overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/85 to-transparent md:w-3/4 w-full" />
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-10 md:p-14">
                {/* Top */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold rounded-full uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="w-10 h-10 rounded-full border border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant text-sm group-hover:bg-orange-vibrant group-hover:text-deep-black group-hover:border-orange-vibrant transition-all duration-300 flex-shrink-0 ml-4">
                        ↗
                    </div>
                </div>

                {/* Bottom */}
                <div className="max-w-lg">
                    <div className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.25em] mb-3">{project.category}</div>
                    <h3 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-4 leading-tight group-hover:text-orange-vibrant transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-white/55 text-base leading-relaxed mb-8 max-w-md">{project.description}</p>
                    <div className="flex flex-wrap gap-10">
                        {project.metrics.map((metric, i) => (
                            <div key={i}>
                                <div className="text-2xl md:text-3xl font-black bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">
                                    {metric.value}
                                </div>
                                <div className="text-white/35 text-[10px] uppercase tracking-widest mt-1">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return isExternal
        ? <a href={dest} target="_blank" rel="noopener noreferrer">{inner}</a>
        : <Link to={dest}>{inner}</Link>;
};

// ─── Grid Project Card ────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef(null);
    const dest = project.url || '/projects';
    const isExternal = !!project.url;

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true } }
        );
    }, []);

    const inner = (
        <div className="group relative h-[420px] rounded-2xl overflow-hidden border border-white/6 hover:border-orange-vibrant/30 transition-all duration-500 bg-[#080809] cursor-pointer">

            {/* Background */}
            <div className="absolute inset-0">
                {project.img ? (
                    <>
                        {!imageLoaded && <div className="absolute inset-0 bg-[#0d0d0f]" />}
                        <img
                            src={project.img} alt={project.title} loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/60 to-transparent" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,87,15,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        {/* Compact dashboard right side */}
                        <div className="absolute right-6 top-6 bottom-6 w-[140px] opacity-60 group-hover:opacity-90 transition-opacity duration-500">
                            <div className="w-full h-full rounded-xl border border-white/6 bg-white/[0.02] p-4 flex flex-col">
                                <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">{project.category}</div>
                                <div className="text-lg font-black text-orange-vibrant mb-1">{project.metrics[0]?.value}</div>
                                <div className="text-[8px] text-white/20 uppercase mb-4">{project.metrics[0]?.label}</div>
                                <div className="flex-1 flex items-end gap-1">
                                    {[50, 80, 35, 100, 60, 85, 45].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-t-sm"
                                            style={{
                                                height: `${h}%`,
                                                background: i === 3 ? 'rgba(255,87,15,0.7)' : 'rgba(255,255,255,0.06)',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-[#080809]/80 to-transparent" />
                    </>
                )}
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-7">
                {/* Top */}
                <div className="flex items-center justify-between">
                    <span className="text-orange-vibrant text-[10px] font-bold uppercase tracking-[0.2em]">{project.category}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-xs group-hover:border-orange-vibrant/50 group-hover:text-orange-vibrant transition-all duration-300">
                        ↗
                    </div>
                </div>

                {/* Bottom */}
                <div>
                    <h4 className="text-xl md:text-2xl font-heading font-bold text-pure-white mb-2 group-hover:text-orange-vibrant transition-colors duration-300 leading-tight">
                        {project.title}
                    </h4>
                    <p className="text-white/45 text-sm leading-relaxed mb-5 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
                        {project.metrics.map((metric, i) => (
                            <div key={i}>
                                <div className="text-lg font-black text-orange-vibrant">{metric.value}</div>
                                <div className="text-white/25 text-[9px] uppercase tracking-wider mt-0.5">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return isExternal
        ? <a ref={cardRef} href={dest} target="_blank" rel="noopener noreferrer" className="block w-full">{inner}</a>
        : <div ref={cardRef} className="block w-full"><Link to={dest} className="block w-full">{inner}</Link></div>;
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const HomeProjects = () => {
    const sectionRef = useRef(null);
    const heroProjectRef = useRef(null);
    const heroProject = featuredProjects.find(p => p.featured);
    const gridProjects = featuredProjects.filter(p => !p.featured);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hp-badge', {
                opacity: 0, y: 16, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
            });
            gsap.from('.hp-heading', {
                opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', delay: 0.1,
                scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
            });
            gsap.from('.hp-sub', {
                opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.2,
                scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
            });
            gsap.from('.hp-cta', {
                opacity: 0, x: 20, duration: 0.6, ease: 'power2.out', delay: 0.25,
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
            });
            if (heroProjectRef.current) {
                gsap.from(heroProjectRef.current, {
                    opacity: 0, y: 32, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: heroProjectRef.current, start: 'top 88%', once: true },
                });
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-deep-black overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-orange-vibrant/8 rounded-full blur-[160px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="hp-badge inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                            <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Real Accounts. Real Numbers.</span>
                        </div>
                        <h2 className="hp-heading text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white leading-tight mb-4">
                            What We've{' '}
                            <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">
                                Actually Built
                            </span>
                        </h2>
                        <p className="hp-sub text-white/50 text-base md:text-lg leading-relaxed max-w-lg">
                            Every number below is from a live account. Dashboard screenshots available. No estimates, no projections.
                        </p>
                    </div>
                    <Link
                        to="/projects"
                        className="hp-cta group flex-shrink-0 inline-flex items-center gap-3 px-7 py-3.5 border border-orange-vibrant/40 text-orange-vibrant text-xs font-bold uppercase tracking-wider hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300"
                    >
                        See All Work
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Hero project */}
                {heroProject && (
                    <div ref={heroProjectRef} className="mb-6">
                        <HeroProjectCard project={heroProject} />
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {gridProjects.map((project, index) => {
                        const isLastOdd = gridProjects.length % 2 !== 0 && index === gridProjects.length - 1;
                        return (
                            <div key={project.id} className={isLastOdd ? 'md:col-span-2' : ''}>
                                <ProjectCard project={project} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeProjects;