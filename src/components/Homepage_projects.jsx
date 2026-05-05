import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Real DDW client results — all numbers from live ad accounts and dashboards
const featuredProjects = [
    {
        id: 'meta-eu-fashion',
        title: 'EU Fashion & Golf Brand',
        category: 'Meta Ads',
        description: '$683K managed in a single month. 343 campaigns. 76M impressions. 5.48 ROAS across the full account. One of our longest-running Meta retainers.',
        img: '/portfolio/google-ads-600roas.png',
        proof: '/portfolio/google-ads-600roas.png',
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
            { label: 'AI-Handled', value: '300%' },
            { label: 'Time to Market', value: '95X Faster' },
        ],
    },
];

const HeroProjectCard = ({ project }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const dest = project.url || '/projects';
    const isExternal = !!project.url;

    const inner = (
        <div className="relative h-[600px] rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 hover:border-orange-vibrant/50 transition-all duration-700 group">
            <div className="absolute inset-0">
                {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-deep-black animate-pulse" />}
                {project.img
                    ? <img src={project.img} alt={project.title} loading="eager" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-40' : 'opacity-0'}`} />
                    : <div className="absolute inset-0 bg-gradient-to-br from-[#0e1012] to-[#080808]">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                      </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/70 to-deep-black/30" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-10 md:p-12">
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-orange-vibrant/20 backdrop-blur-sm border border-orange-vibrant/40 text-orange-vibrant text-xs font-bold rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="text-orange-vibrant text-sm font-bold uppercase tracking-[0.2em] mb-3">{project.category}</div>
                <h3 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-4 group-hover:text-orange-vibrant transition-colors duration-300">{project.title}</h3>
                <p className="text-pure-white/80 text-lg leading-relaxed mb-8 max-w-2xl">{project.description}</p>
                <div className="flex flex-wrap gap-8">
                    {project.metrics.map((metric, i) => (
                        <div key={i}>
                            <div className="text-3xl font-black bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">{metric.value}</div>
                            <div className="text-text-muted text-xs uppercase tracking-wider mt-1">{metric.label}</div>
                        </div>
                    ))}
                </div>
                <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-orange-vibrant flex items-center justify-center text-deep-black font-bold text-2xl group-hover:scale-110 group-hover:rotate-45 transition-all duration-500 shadow-2xl shadow-orange-vibrant/50">→</div>
            </div>
        </div>
    );

    return isExternal
        ? <a href={dest} target="_blank" rel="noopener noreferrer">{inner}</a>
        : <Link to={dest}>{inner}</Link>;
};

const ProjectCard = ({ project }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef(null);
    const dest = project.url || '/projects';
    const isExternal = !!project.url;

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: cardRef.current, start: 'top 85%' } }
        );
    }, []);

    const inner = (
        <div className="group block relative h-[480px] rounded-3xl overflow-hidden border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-700 hover:-translate-y-2">
            <div className="absolute inset-0">
                {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/10 to-deep-black animate-pulse" />}
                {project.img
                    ? <img src={project.img} alt={project.title} loading="lazy" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-35' : 'opacity-0'}`} />
                    : <div className="absolute inset-0 bg-gradient-to-br from-[#0e1012] to-[#080808]">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-8">
                <div className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em] mb-3">{project.category}</div>
                <h4 className="text-2xl font-heading font-bold text-pure-white mb-3 group-hover:text-orange-vibrant transition-colors duration-300">{project.title}</h4>
                <p className="text-pure-white/70 text-sm leading-relaxed mb-6 line-clamp-2">{project.description}</p>
                <div className="flex gap-6 pt-4 border-t border-orange-vibrant/20 flex-wrap">
                    {project.metrics.map((metric, i) => (
                        <div key={i}>
                            <div className="text-xl font-black text-orange-vibrant">{metric.value}</div>
                            <div className="text-text-muted text-[10px] uppercase tracking-wider">{metric.label}</div>
                        </div>
                    ))}
                </div>
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-orange-vibrant/20 backdrop-blur-sm border border-orange-vibrant/40 flex items-center justify-center text-orange-vibrant font-bold text-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">↗</div>
            </div>
        </div>
    );

    return isExternal
        ? <a ref={cardRef} href={dest} target="_blank" rel="noopener noreferrer">{inner}</a>
        : <div ref={cardRef}><Link to={dest}>{inner}</Link></div>;
};

const HomeProjects = () => {
    const sectionRef = useRef(null);
    const heroProjectRef = useRef(null);
    const labelRef = useRef(null);
    const heroProject = featuredProjects.find((p) => p.featured);
    const gridProjects = featuredProjects.filter((p) => !p.featured);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.section-header', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
            gsap.from(labelRef.current, { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.7)', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
            if (heroProjectRef.current) gsap.from(heroProjectRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: heroProjectRef.current, start: 'top 85%' } });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-deep-black overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-vibrant/30 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="section-header flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div ref={labelRef} className="inline-block mb-6">
                            <span className="px-6 py-2.5 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full">• Real Accounts. Real Numbers.</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 leading-tight text-pure-white">
                            What We've <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Actually Built</span>
                        </h2>
                        <p className="text-pure-white/70 text-base md:text-lg leading-relaxed">Every number below is from a live account. Dashboard screenshots available. No estimates, no projections.</p>
                    </div>
                    <Link to="/projects" className="group flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30">
                        See All Work
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>

                {heroProject && (
                    <div ref={heroProjectRef} className="mb-8">
                        <HeroProjectCard project={heroProject} />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {gridProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeProjects;
