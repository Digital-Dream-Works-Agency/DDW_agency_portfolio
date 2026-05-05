// src/components/Allprojects.jsx
// All DDW projects — real accounts, real numbers, all channels
import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── All DDW real projects ─────────────────────────────────────────────────────
const projectsData = [
    {
        id: 'meta-eu-fashion',
        title: 'EU Fashion & Golf Brand',
        category: 'Meta Ads',
        img: '/portfolio/google-ads-600roas.png',
        tags: ['Meta Ads', 'EU Market', 'E-Commerce'],
        metrics: { 'Monthly Spend': '$683K', 'ROAS': '5.48x', 'Campaigns': '343' },
        gradient: 'from-orange-vibrant/20 to-red-600/15',
        url: null,
    },
    {
        id: 'meta-eu-oct',
        title: 'EU Brand — October Scale',
        category: 'Meta Ads',
        img: '/portfolio/google-ads-600roas.png',
        tags: ['Meta Ads', 'EU Market', 'Scale'],
        metrics: { 'Monthly Spend': '$441K', 'ROAS': '4.70x', 'Campaigns': '285' },
        gradient: 'from-orange-vibrant/15 to-red-500/15',
        url: null,
    },
    {
        id: 'uae-home-appliances',
        title: 'UAE Home Appliances',
        category: 'Meta Ads',
        img: null,
        tags: ['Meta Ads', 'Shopify', 'UAE'],
        metrics: { ROAS: '4.86x', Orders: '572' },
        gradient: 'from-purple-500/20 to-pink-400/20',
        url: null,
    },
    {
        id: 'mathfel-google',
        title: 'Mathfel — Video Door Intercom',
        category: 'Google Ads',
        img: '/portfolio/google-ads-600roas.png',
        tags: ['Google Ads', 'EU Market', 'E-Commerce'],
        metrics: { ROAS: '600%', Revenue: '€418K', Spend: '€69.7K' },
        gradient: 'from-orange-vibrant/20 to-amber-400/20',
        url: null,
    },
    {
        id: 'google-eu-310roas',
        title: 'EU Brand — Google Shopping',
        category: 'Google Ads',
        img: '/portfolio/google-ads-310roas.png',
        tags: ['Google Ads', 'EU Market', 'Shopping'],
        metrics: { ROAS: '310%', Revenue: '€60.1K' },
        gradient: 'from-amber-500/20 to-orange-400/20',
        url: null,
    },
    {
        id: 'pj-bold',
        title: 'PJ BOLD — Silicone Molds',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'USA', 'E-Commerce'],
        metrics: { ROAS: '14.54x', Revenue: '$38K' },
        gradient: 'from-orange-vibrant/20 to-red-500/20',
        url: null,
    },
    {
        id: 'cpa-moms',
        title: 'CPA MOMS — Tax Franchise',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'Lead Gen', 'USA'],
        metrics: { Conversions: '+53%', CPC: '-51%' },
        gradient: 'from-blue-500/20 to-cyan-400/20',
        url: null,
    },
    {
        id: 'us-health-clinic',
        title: 'US Health Clinic — Multi-Location',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'Healthcare', 'USA'],
        metrics: { Conversions: '15,594', CPC: '$0.09' },
        gradient: 'from-green-500/20 to-emerald-400/20',
        url: null,
    },
    {
        id: 'amazon-us',
        title: 'Amazon Brand — US Market',
        category: 'Amazon',
        img: '/portfolio/amazon-ads-main.png',
        tags: ['Amazon Ads', 'Amazon FBA', 'USA'],
        metrics: { Sales: '$2.7M+', ACOS: '27.64%', Orders: '129,800' },
        gradient: 'from-yellow-500/20 to-orange-400/20',
        url: null,
    },
    {
        id: 'tiktok-shop',
        title: 'TikTok Shop — E-Commerce',
        category: 'TikTok Shop',
        img: '/portfolio/tiktok-shop.png',
        tags: ['TikTok Shop', 'E-Commerce', 'Social Commerce'],
        metrics: { '7-Day GMV': '$290K', Orders: '9,010', Growth: '+121%' },
        gradient: 'from-pink-500/20 to-purple-400/20',
        url: null,
    },
    {
        id: 'seo-syncwire',
        title: 'Syncwire — E-Commerce SEO',
        category: 'SEO',
        img: '/portfolio/seo-251k.png',
        tags: ['SEO', 'E-Commerce', 'Organic Growth'],
        metrics: { Visitors: '2K → 54K', Clicks: '251K', Impressions: '10.3M' },
        gradient: 'from-teal-500/20 to-cyan-400/20',
        url: null,
    },
    {
        id: 'seo-brand-2',
        title: 'E-Commerce Brand — SEO',
        category: 'SEO',
        img: '/portfolio/seo-147k.png',
        tags: ['SEO', 'E-Commerce', 'Organic Growth'],
        metrics: { Clicks: '147K', Impressions: '4.43M' },
        gradient: 'from-cyan-500/20 to-blue-400/20',
        url: null,
    },
    {
        id: 'lyra-saas',
        title: 'Lyra — AI Voice Receptionist',
        category: 'SaaS',
        img: null,
        tags: ['AI SaaS', 'Voice AI', 'Built by DDW'],
        metrics: { 'Calls Handled': '978+', 'Availability': '24/7' },
        gradient: 'from-violet-500/20 to-purple-400/20',
        url: 'https://lyrabyddw.com',
    },
    {
        id: 'sviluppiamo',
        title: 'Sviluppiamo.dev — Vibe Coding',
        category: 'SaaS',
        img: null,
        tags: ['SaaS', 'Vibe Coding', 'Italy Market'],
        metrics: { Market: 'Italy', Stack: 'Next.js + AI' },
        gradient: 'from-indigo-500/20 to-blue-400/20',
        url: 'https://sviluppiamo.dev',
    },
];

const CATEGORIES = ['All', 'Meta Ads', 'Google Ads', 'Amazon', 'TikTok Shop', 'SEO', 'SaaS'];
const ITEMS_PER_PAGE = 6;

// ─── GSAP Tilt ─────────────────────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.5 });
        const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.5 });
        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo(((e.clientX - rect.left) / rect.width - 0.5) * 6);
            yTo(-((e.clientY - rect.top) / rect.height - 0.5) * 6);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, []);
    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

const useMagneticEffect = (ref, strength = 0.25) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const xTo = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power2.out' });
        const onMove = (e) => {
            const rect = element.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        element.addEventListener('mousemove', onMove);
        element.addEventListener('mouseleave', onLeave);
        return () => { element.removeEventListener('mousemove', onMove); element.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = memo(({ item }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const dest = item.url || '/projects';
    const isExternal = !!item.url;

    const inner = (
        <div className="proj-card relative bg-gradient-to-br from-[#151a1d] to-[#0d1012] rounded-2xl overflow-hidden flex flex-col h-[480px] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 shadow-2xl transition-all duration-500 cursor-pointer group">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl`} />
            <div className="flex-1 overflow-hidden relative">
                {item.img ? (
                    <>
                        {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/10 to-deep-black animate-pulse" />}
                        <img src={item.img} alt={item.title} loading="lazy" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105 ${imgLoaded ? 'opacity-40' : 'opacity-0'}`} />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0e1012] to-[#080808]">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                        <span key={tag} className="px-3 py-1.5 bg-orange-vibrant/90 backdrop-blur-sm text-deep-black text-xs font-bold rounded-full shadow-lg transform translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${i * 60}ms` }}>{tag}</span>
                    ))}
                </div>
                {isExternal && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-orange-vibrant/90 backdrop-blur-sm text-deep-black text-[10px] font-black rounded-full uppercase tracking-wider">Live ↗</div>
                )}
            </div>
            <div className="relative bg-deep-black/95 backdrop-blur-md p-6 border-t-2 border-orange-vibrant/20 group-hover:border-orange-vibrant/50 transition-all duration-500 z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-vibrant/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-widest">{item.category}</span>
                    </div>
                    <h4 className="text-xl font-heading font-bold leading-tight text-pure-white group-hover:text-orange-vibrant transition-colors duration-300 line-clamp-2 mb-4">{item.title}</h4>
                    <div className="flex gap-5 pt-4 border-t border-orange-vibrant/20 group-hover:border-orange-vibrant/40 transition-colors flex-wrap">
                        {Object.entries(item.metrics).slice(0, 3).map(([key, val], i) => (
                            <div key={key} className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${i * 80}ms` }}>
                                <div className="text-cream font-bold text-sm md:text-base">{val}</div>
                                <div className="text-pure-white/50 text-[10px] uppercase tracking-widest">{key}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-6 right-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-vibrant to-orange-600 flex items-center justify-center text-deep-black font-bold text-lg shadow-2xl shadow-orange-vibrant/50 group-hover:rotate-45 transition-all duration-500">
                        {isExternal ? '↗' : '→'}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
        </div>
    );

    return isExternal
        ? <GSAPTilt><a href={dest} target="_blank" rel="noopener noreferrer">{inner}</a></GSAPTilt>
        : <GSAPTilt>{inner}</GSAPTilt>;
});
ProjectCard.displayName = 'ProjectCard';

// ─── Category Filter Button ────────────────────────────────────────────────────
const CategoryButton = memo(({ cat, isActive, onClick, count }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.15);
    return (
        <button ref={btnRef} onClick={onClick} className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border-2 transition-all duration-300 overflow-hidden group ${isActive ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-lg shadow-orange-vibrant/40' : 'border-orange-vibrant/30 text-text-muted hover:border-orange-vibrant hover:text-orange-vibrant'}`}>
            <span className="relative z-10 flex items-center gap-2">
                {cat}
                {count != null && <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-deep-black/20' : 'bg-orange-vibrant/10'}`}>{count}</span>}
            </span>
        </button>
    );
});
CategoryButton.displayName = 'CategoryButton';

// ─── Pagination Button ─────────────────────────────────────────────────────────
const PaginationButton = memo(({ onClick, disabled, isActive, label, children }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);
    return (
        <button ref={btnRef} onClick={onClick} disabled={disabled} aria-label={label} aria-current={isActive ? 'page' : undefined}
            className={`relative w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 overflow-hidden group ${disabled ? 'border-white/5 text-white/20 cursor-not-allowed' : isActive ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-lg shadow-orange-vibrant/40 scale-105' : 'border-orange-vibrant/30 text-pure-white hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant'}`}>
            <span className="relative z-10">{children}</span>
        </button>
    );
});
PaginationButton.displayName = 'PaginationButton';

// ─── Main Component ────────────────────────────────────────────────────────────
const AllProjects = () => {
    const gridRef = useRef(null);
    const sectionRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = activeCategory === 'All' ? projectsData : projectsData.filter((p) => p.category === activeCategory);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [activeCategory]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.proj-card', {
                y: 60, opacity: 0, scale: 0.95, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        gsap.fromTo('.proj-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
    }, [currentPage, activeCategory]);

    const goTo = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const pageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, 5];
        if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    return (
        <section ref={sectionRef} className="relative py-24 bg-deep-black text-white min-h-screen scroll-mt-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            <div className="relative max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em]">Real Accounts · Real Numbers · No Projections</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-heading font-black leading-tight mb-6">
                        <span style={{ background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Work We've Done
                        </span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        Every number is from a live account. Dashboard screenshots available on request.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {CATEGORIES.map((cat) => (
                        <CategoryButton
                            key={cat}
                            cat={cat}
                            isActive={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                            count={cat !== 'All' ? projectsData.filter((p) => p.category === cat).length : null}
                        />
                    ))}
                </div>

                {/* Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {visibleProjects.length > 0
                        ? visibleProjects.map((item) => <ProjectCard key={item.id} item={item} />)
                        : (
                            <div className="col-span-3 text-center py-32">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-text-muted text-lg">No projects in this category yet</p>
                            </div>
                        )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 flex-wrap mb-8">
                        <PaginationButton onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} label="Previous">←</PaginationButton>
                        {pageNumbers().map((num) => (
                            <PaginationButton key={num} onClick={() => goTo(num)} isActive={num === currentPage} label={`Page ${num}`}>{num}</PaginationButton>
                        ))}
                        <PaginationButton onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} label="Next">→</PaginationButton>
                    </div>
                )}

                <p className="text-center text-text-muted text-xs uppercase tracking-widest">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} projects
                </p>
            </div>
        </section>
    );
};

export default AllProjects;
