import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const featuredProjects = [
    {
        id: 'mathfel',
        title: 'Mathfel — Video Door Intercom',
        category: 'Google Ads',
        description: 'EU Google Ads campaign generating 600% ROAS on €69.7K spend in the competitive home security market.',
        img: null,
        tags: ['Google Ads', 'EU Market', 'E-Commerce'],
        metrics: [{ label: 'ROAS', value: '600%' }, { label: 'Revenue', value: '€418K' }],
        featured: true,
    },
    {
        id: 'pj-bold',
        title: 'PJ BOLD — Silicone Molds',
        category: 'Google Ads',
        description: 'Scaled Google Ads from 1.83x to 14.54x ROAS — $2.6K spend turned into $38K revenue in 60 days.',
        img: null,
        tags: ['Google Ads', 'USA', 'E-Commerce'],
        metrics: [{ label: 'ROAS', value: '14.54x' }, { label: 'Revenue', value: '$38K' }],
    },
    {
        id: 'cpa-moms',
        title: 'CPA MOMS — Tax Franchise',
        category: 'Google Ads',
        description: 'Cut CPC from $144 to $71 while growing conversions 53% for a national US tax franchise.',
        img: null,
        tags: ['Google Ads', 'Lead Gen', 'USA'],
        metrics: [{ label: 'More Conversions', value: '+53%' }, { label: 'CPC Drop', value: '-51%' }],
    },
    {
        id: 'uae-home-appliances',
        title: 'UAE Home Appliances',
        category: 'Meta Ads',
        description: 'Meta Ads + Shopify optimization: AED 47.9K sales, 572 orders, 42K sessions at 4.86x ROAS.',
        img: null,
        tags: ['Meta Ads', 'Shopify', 'UAE'],
        metrics: [{ label: 'ROAS', value: '4.86x' }, { label: 'Orders', value: '572' }],
    },
    {
        id: 'us-health-clinic',
        title: 'US Health Clinic',
        category: 'Google Ads',
        description: 'Google Ads delivering 15,594 conversions at $0.09 CPC for a multi-location US health clinic.',
        img: null,
        tags: ['Google Ads', 'Healthcare', 'USA'],
        metrics: [{ label: 'Conversions', value: '15,594' }, { label: 'CPC', value: '$0.09' }],
    },
    {
        id: 'us-therapy-practice',
        title: 'US Therapy Practice',
        category: 'Google Ads',
        description: '517 qualified phone calls at $34.70/call from Google Ads for a US therapy practice.',
        img: null,
        tags: ['Google Ads', 'Healthcare', 'Calls'],
        metrics: [{ label: 'Phone Calls', value: '517' }, { label: 'Per Call', value: '$34.70' }],
    },
];

const HeroProjectCard = ({ project }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <Link to="/projects" className="group block relative h-[600px] rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 hover:border-orange-vibrant/50 transition-all duration-700">
            <div className="absolute inset-0">
                {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/20 to-deep-black animate-pulse" />}
                {project.img
                    ? <img src={project.img} alt={project.title} loading="eager" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                    : <div className="absolute inset-0 bg-gradient-to-br from-[#0e1012] to-[#080808] flex items-center justify-center"><div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '24px 24px' }} /><div className="w-16 h-16 rounded-xl border border-orange-vibrant/20 flex items-center justify-center opacity-40"><svg fill="none" stroke="#FF570F" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg></div></div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-10 md:p-12">
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => <span key={tag} className="px-4 py-1.5 bg-orange-vibrant/20 backdrop-blur-sm border border-orange-vibrant/40 text-orange-vibrant text-xs font-bold rounded-full">{tag}</span>)}
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
        </Link>
    );
};

const ProjectCard = ({ project }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current, 
            { y: 60, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: cardRef.current, start: 'top 85%' } }
        );
    }, []);

    return (
        <Link to="/projects" ref={cardRef} className="group block relative h-[480px] rounded-3xl overflow-hidden border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-700 hover:-translate-y-2">
            <div className="absolute inset-0">
                {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/10 to-deep-black animate-pulse" />}
                {project.img
                    ? <img src={project.img} alt={project.title} loading="lazy" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                    : <div className="absolute inset-0 bg-gradient-to-br from-[#0e1012] to-[#080808] flex items-center justify-center"><div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} /><div className="w-10 h-10 rounded-lg border border-orange-vibrant/20 flex items-center justify-center opacity-35"><svg fill="none" stroke="#FF570F" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg></div></div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/40 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-8">
                <div className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em] mb-3">{project.category}</div>
                <h4 className="text-2xl font-heading font-bold text-pure-white mb-3 group-hover:text-orange-vibrant transition-colors duration-300">{project.title}</h4>
                <p className="text-pure-white/70 text-sm leading-relaxed mb-6 line-clamp-2">{project.description}</p>
                <div className="flex gap-6 pt-4 border-t border-orange-vibrant/20">
                    {project.metrics.map((metric, i) => (
                        <div key={i}>
                            <div className="text-xl font-black text-orange-vibrant">{metric.value}</div>
                            <div className="text-text-muted text-[10px] uppercase tracking-wider">{metric.label}</div>
                        </div>
                    ))}
                </div>
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-orange-vibrant/20 backdrop-blur-sm border border-orange-vibrant/40 flex items-center justify-center text-orange-vibrant font-bold text-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">↗</div>
            </div>
        </Link>
    );
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
            if(heroProjectRef.current) gsap.from(heroProjectRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: heroProjectRef.current, start: 'top 85%' }});
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
                            <span className="px-6 py-2.5 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full">Featured Work</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 leading-tight text-pure-white">
                            Selected <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Projects</span>
                        </h2>
                        <p className="text-pure-white/70 text-base md:text-lg leading-relaxed">Real systems. Real results. Built for enterprises that demand excellence.</p>
                    </div>
                    <Link to="/projects" className="group flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30">
                        View All Work
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>

                {heroProject && <div ref={heroProjectRef} className="mb-8"><HeroProjectCard project={heroProject} /></div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {gridProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
                </div>
            </div>
        </section>
    );
};

export default HomeProjects;