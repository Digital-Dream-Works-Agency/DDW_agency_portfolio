import { useEffect, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
    { id: 'meta-eu-fashion', title: 'EU Fashion & Golf Brand', category: 'Meta Ads', img: '/portfolio/google-ads-600roas.png', tags: ['Meta Ads', 'EU Market', 'E-Commerce'], metrics: { 'Monthly Spend': '$683K', 'ROAS': '5.48x', 'Campaigns': '343' }, gradient: 'from-orange-vibrant/20 to-red-600/15', url: null },
    { id: 'meta-eu-oct', title: 'EU Brand — October Scale', category: 'Meta Ads', img: '/portfolio/google-ads-600roas.png', tags: ['Meta Ads', 'EU Market', 'Scale'], metrics: { 'Monthly Spend': '$441K', 'ROAS': '4.70x', 'Campaigns': '285' }, gradient: 'from-orange-vibrant/15 to-red-500/15', url: null },
    { id: 'uae-home-appliances', title: 'UAE Home Appliances', category: 'Meta Ads', img: null, tags: ['Meta Ads', 'Shopify', 'UAE'], metrics: { ROAS: '4.86x', Orders: '572' }, gradient: 'from-purple-500/20 to-pink-400/20', url: null },
    { id: 'mathfel-google', title: 'Mathfel — Video Door Intercom', category: 'Google Ads', img: '/portfolio/google-ads-600roas.png', tags: ['Google Ads', 'EU Market', 'E-Commerce'], metrics: { ROAS: '600%', Revenue: '€418K', Spend: '€69.7K' }, gradient: 'from-orange-vibrant/20 to-amber-400/20', url: null },
    { id: 'google-eu-310roas', title: 'EU Brand — Google Shopping', category: 'Google Ads', img: '/portfolio/google-ads-310roas.png', tags: ['Google Ads', 'EU Market', 'Shopping'], metrics: { ROAS: '310%', Revenue: '€60.1K' }, gradient: 'from-amber-500/20 to-orange-400/20', url: null },
    { id: 'pj-bold', title: 'PJ BOLD — Silicone Molds', category: 'Google Ads', img: null, tags: ['Google Ads', 'USA', 'E-Commerce'], metrics: { ROAS: '14.54x', Revenue: '$38K' }, gradient: 'from-orange-vibrant/20 to-red-500/20', url: null },
    { id: 'cpa-moms', title: 'CPA MOMS — Tax Franchise', category: 'Google Ads', img: null, tags: ['Google Ads', 'Lead Gen', 'USA'], metrics: { Conversions: '+53%', CPC: '-51%' }, gradient: 'from-blue-500/20 to-cyan-400/20', url: null },
    { id: 'us-health-clinic', title: 'US Health Clinic — Multi-Location', category: 'Google Ads', img: null, tags: ['Google Ads', 'Healthcare', 'USA'], metrics: { Conversions: '15,594', CPC: '$0.09' }, gradient: 'from-green-500/20 to-emerald-400/20', url: null },
    { id: 'amazon-us', title: 'Amazon Brand — US Market', category: 'Amazon', img: '/portfolio/amazon-ads-main.png', tags: ['Amazon Ads', 'Amazon FBA', 'USA'], metrics: { Sales: '$2.7M+', ACOS: '27.64%', Orders: '129,800' }, gradient: 'from-yellow-500/20 to-orange-400/20', url: null },
    { id: 'tiktok-shop', title: 'TikTok Shop — E-Commerce', category: 'TikTok Shop', img: '/portfolio/tiktok-shop.png', tags: ['TikTok Shop', 'E-Commerce', 'Social Commerce'], metrics: { '7-Day GMV': '$290K', Orders: '9,010', Growth: '+121%' }, gradient: 'from-pink-500/20 to-purple-400/20', url: null },
    { id: 'seo-syncwire', title: 'Syncwire — E-Commerce SEO', category: 'SEO', img: '/portfolio/seo-251k.png', tags: ['SEO', 'E-Commerce', 'Organic Growth'], metrics: { Visitors: '2K → 54K', Clicks: '251K', Impressions: '10.3M' }, gradient: 'from-teal-500/20 to-cyan-400/20', url: null },
    { id: 'seo-brand-2', title: 'E-Commerce Brand — SEO', category: 'SEO', img: '/portfolio/seo-147k.png', tags: ['SEO', 'E-Commerce', 'Organic Growth'], metrics: { Clicks: '147K', Impressions: '4.43M' }, gradient: 'from-cyan-500/20 to-blue-400/20', url: null },
    { id: 'lyra-saas', title: 'Lyra — AI Voice Receptionist', category: 'SaaS', img: null, tags: ['AI SaaS', 'Voice AI', 'Built by DDW'], metrics: { 'Calls Handled': '978+', 'Availability': '24/7' }, gradient: 'from-violet-500/20 to-purple-400/20', url: 'https://lyrabyddw.com' },
    { id: 'sviluppiamo', title: 'Sviluppiamo.dev — Vibe Coding', category: 'SaaS', img: null, tags: ['SaaS', 'Vibe Coding', 'Italy Market'], metrics: { Market: 'Italy', Stack: 'Next.js + AI' }, gradient: 'from-indigo-500/20 to-blue-400/20', url: 'https://sviluppiamo.dev' },
];

const CATEGORIES = ['All', 'Meta Ads', 'Google Ads', 'Amazon', 'TikTok Shop', 'SEO', 'SaaS'];
const ITEMS_PER_PAGE = 6;

const CAT_COLORS = {
    'Meta Ads':    '#FF570F',
    'Google Ads':  '#FDE87A',
    'Amazon':      '#EE7D1D',
    'TikTok Shop': '#ff4d6d',
    'SEO':         '#4ade80',
    'SaaS':        '#a78bfa',
    'All':         '#FF570F',
};

const GSAPTilt = ({ children, className }) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.5 });
        const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.5 });
        
        let rafId;
        const move = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                xTo(((e.clientX - r.left) / r.width - 0.5) * 6);
                yTo(-((e.clientY - r.top) / r.height - 0.5) * 6);
            });
        };
        const leave = () => {
            cancelAnimationFrame(rafId);
            xTo(0); 
            yTo(0); 
        };
        
        el.addEventListener('mousemove', move, { passive: true });
        el.addEventListener('mouseleave', leave);
        return () => { 
            cancelAnimationFrame(rafId);
            el.removeEventListener('mousemove', move); 
            el.removeEventListener('mouseleave', leave); 
        };
    }, []);
    return <div ref={ref} className={className} style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}>{children}</div>;
};

const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });
        
        let rafId;
        const move = (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * strength);
                yTo((e.clientY - r.top - r.height / 2) * strength);
            });
        };
        const leave = () => { 
            cancelAnimationFrame(rafId);
            xTo(0); 
            yTo(0); 
        };
        
        el.addEventListener('mousemove', move, { passive: true });
        el.addEventListener('mouseleave', leave);
        return () => { 
            cancelAnimationFrame(rafId);
            el.removeEventListener('mousemove', move); 
            el.removeEventListener('mouseleave', leave); 
        };
    }, [strength]);
};

const Marquee = () => {
    const items = ['$683K Meta/mo', '600% ROAS', '$2.7M Amazon', '14.54x ROAS', '$290K GMV', '15,594 Conversions', '251K SEO Clicks', '+121% TikTok Growth', '4.86x ROAS', '978+ AI Calls'];
    const doubled = [...items, ...items];
    return (
        <div className="relative w-full overflow-hidden border-y border-white/[0.06] py-3.5 mb-0" style={{ transform: 'translateZ(0)' }}>
            <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg,#09090b,transparent)' }} />
            <div className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg,#09090b,transparent)' }} />
            <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'marquee 28s linear infinite', willChange: 'transform' }}>
                {doubled.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/25">
                        <span className="w-1 h-1 rounded-full bg-[#FF570F] inline-block" />
                        {t}
                    </span>
                ))}
            </div>
            <style>{`@keyframes marquee { from{transform:translate3d(0,0,0)} to{transform:translate3d(-50%,0,0)} }`}</style>
        </div>
    );
};

const ProjectCard = memo(({ item, index }) => {
    const [hovered, setHovered] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const cardRef = useRef(null);
    const dest = item.url || `/projects/${item.id}`;
    const isExternal = !!item.url;
    const accent = CAT_COLORS[item.category] || '#FF570F';
    const primaryVal = Object.values(item.metrics)[0];
    const primaryKey = Object.keys(item.metrics)[0];

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: (index % ITEMS_PER_PAGE) * 0.07,
                  scrollTrigger: { trigger: cardRef.current, start: 'top 90%', once: true }
                }
            );
        });
        return () => ctx.revert(); 
    }, [index]);

    const inner = (
        <div
            ref={cardRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
            style={{
                opacity: 0,
                background: 'linear-gradient(160deg, #111316 0%, #0c0e10 100%)',
                border: `1px solid ${hovered ? accent + '40' : 'rgba(255,255,255,0.05)'}`,
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                boxShadow: hovered ? `0 0 60px ${accent}18, 0 20px 60px rgba(0,0,0,0.5)` : '0 4px 30px rgba(0,0,0,0.4)',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased'
            }}
        >
            <div className="h-[2px] w-full transition-all duration-500"
                style={{ background: hovered ? `linear-gradient(90deg, ${accent}, transparent)` : 'rgba(255,255,255,0.04)' }} />

            <div className="relative overflow-hidden" style={{ height: '220px', backgroundColor: '#0c0e10' }}>
                {item.img ? (
                    <>
                        {!imgLoaded && (
                            <div className="absolute inset-0 animate-pulse" style={{ background: `${accent}08` }} />
                        )}
                        <img
                            src={item.img} alt={item.title} loading="lazy"
                            onLoad={() => setImgLoaded(true)}
                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                            style={{ opacity: imgLoaded ? 0.55 : 0, willChange: 'transform, opacity' }}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}12, transparent 70%)` }}>
                        <div className="absolute inset-0 opacity-[0.04]"
                            style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />
                        <div className="text-center select-none">
                            <div className="font-black leading-none transition-transform duration-500 group-hover:scale-110"
                                style={{
                                    fontSize: primaryVal.length > 6 ? '3.5rem' : '5rem',
                                    color: accent,
                                    textShadow: `0 0 80px ${accent}50`,
                                    letterSpacing: '-0.03em',
                                    willChange: 'transform'
                                }}>
                                {primaryVal}
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.22em] font-bold mt-2"
                                style={{ color: accent + '60' }}>
                                {primaryKey}
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 30%, #0c0e10 100%)' }} />

                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] rounded-full"
                        style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}>
                        {item.category}
                    </span>
                </div>

                {isExternal && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white/50 border border-white/10">
                        Live ↗
                    </div>
                )}

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                        <span key={tag}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-full text-white/70 border border-white/10 uppercase tracking-wider transition-all duration-300"
                            style={{
                                opacity: hovered ? 1 : 0,
                                transform: hovered ? 'translateY(0)' : 'translateY(6px)',
                                transitionDelay: `${i * 50}ms`,
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(8px)',
                                willChange: 'transform, opacity'
                            }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col p-6 pt-5">
                <h4 className="text-lg font-black leading-snug text-white mb-4 transition-colors duration-300"
                    style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.88)' }}>
                    {item.title}
                </h4>

                <div className="flex gap-5 flex-wrap mb-5">
                    {Object.entries(item.metrics).slice(0, 3).map(([key, val], i) => (
                        <div key={key} className="transition-all duration-300"
                            style={{ opacity: 1, transform: hovered ? 'translateY(-2px)' : 'translateY(0)', transitionDelay: `${i * 40}ms` }}>
                            <div className="text-lg font-black leading-none mb-0.5" style={{ color: accent }}>{val}</div>
                            <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">{key}</div>
                        </div>
                    ))}
                </div>

                <div className="h-px mb-5 transition-all duration-500"
                    style={{ background: hovered ? `linear-gradient(90deg, ${accent}40, transparent)` : 'rgba(255,255,255,0.05)' }} />

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-black transition-colors duration-300"
                        style={{ color: hovered ? accent : 'rgba(255,255,255,0.2)' }}>
                        {isExternal ? 'Visit Live' : 'View Project'}
                    </span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400"
                        style={{
                            background: hovered ? accent : 'rgba(255,255,255,0.05)',
                            transform: hovered ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                            boxShadow: hovered ? `0 0 20px ${accent}60` : 'none',
                            willChange: 'transform, box-shadow'
                        }}>
                        <svg className="w-4 h-4 transition-colors duration-300"
                            style={{ color: hovered ? '#000' : 'rgba(255,255,255,0.4)' }}
                            fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );

    return isExternal ? (
        <GSAPTilt>
            <a href={dest} target="_blank" rel="noopener noreferrer" className="block outline-none">{inner}</a>
        </GSAPTilt>
    ) : (
        <GSAPTilt>
            <Link to={dest} className="block outline-none">{inner}</Link>
        </GSAPTilt>
    );
});
ProjectCard.displayName = 'ProjectCard';

const FilterTab = memo(({ cat, isActive, onClick, count }) => {
    const ref = useRef(null);
    useMagnetic(ref, 0.15);
    const accent = CAT_COLORS[cat] || '#FF570F';
    return (
        <button ref={ref} onClick={onClick}
            className="relative px-5 py-2 text-[11px] font-black uppercase tracking-[0.18em] rounded-full transition-all duration-300 overflow-hidden"
            style={{
                background: isActive ? accent : 'rgba(255,255,255,0.04)',
                color: isActive ? '#000' : 'rgba(255,255,255,0.45)',
                border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isActive ? `0 0 30px ${accent}40` : 'none',
                willChange: 'transform'
            }}>
            {cat}
            {count != null && (
                <span className="ml-2 text-[9px] opacity-60">{count}</span>
            )}
        </button>
    );
});
FilterTab.displayName = 'FilterTab';

const PageBtn = memo(({ onClick, disabled, isActive, children, label }) => {
    const ref = useRef(null);
    useMagnetic(ref, 0.2);
    return (
        <button ref={ref} onClick={onClick} disabled={disabled} aria-label={label}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300"
            style={{
                background: isActive ? '#FF570F' : disabled ? 'transparent' : 'rgba(255,255,255,0.04)',
                color: isActive ? '#000' : disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${isActive ? '#FF570F' : disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isActive ? '0 0 24px #FF570F50' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                willChange: 'transform'
            }}>
            {children}
        </button>
    );
});
PageBtn.displayName = 'PageBtn';

const AllProjects = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = activeCategory === 'All' ? projectsData : projectsData.filter(p => p.category === activeCategory);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [activeCategory]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.hdr-item',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } 
                }
            );
        }, headerRef);
        return () => ctx.revert();
    }, []);

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
        <section ref={sectionRef} className="relative min-h-screen bg-[#09090b] text-white overflow-hidden scroll-mt-24">
            
            <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full blur-[180px] opacity-[0.035] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF570F 0%, transparent 65%)', transform: 'translateZ(0)' }} />
            <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.025] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FDE87A 0%, transparent 65%)', transform: 'translateZ(0)' }} />

            <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div ref={headerRef} className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto">
                <div className="hdr-item opacity-0 flex items-center gap-3 mb-8">
                    <div className="h-px w-8 bg-[#FF570F]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#FF570F]">
                        Real Accounts · Real Numbers · No Projections
                    </span>
                </div>

                <div className="hdr-item opacity-0 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-[clamp(2.8rem,8vw,6rem)] font-black leading-[0.95] tracking-tight">
                            <span className="text-white">Projects</span>
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>We'veBuilt.</span>
                        </h2>
                    </div>
                    <p className="text-white/40 text-base leading-relaxed max-w-xs lg:text-right">
                        Every number is from a live account. Dashboard screenshots available on request.
                    </p>
                </div>

                <Marquee />

                <div className="hdr-item opacity-0 grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 mb-14">
                    {[
                        { v: '$683K+', l: 'Meta/Month' },
                        { v: '14', l: 'Projects' },
                        { v: '$2.7M+', l: 'Amazon Sales' },
                        { v: '600%', l: 'Peak ROAS' },
                    ].map((s, i) => (
                        <div key={i} className="py-4 px-5 rounded-xl text-center"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="text-2xl font-black text-white mb-0.5">{s.v}</div>
                            <div className="text-[10px] uppercase tracking-widest text-white/25 font-bold">{s.l}</div>
                        </div>
                    ))}
                </div>

                <div className="hdr-item opacity-0 flex flex-wrap gap-2.5 justify-center">
                    {CATEGORIES.map(cat => (
                        <FilterTab
                            key={cat} cat={cat} isActive={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                            count={cat !== 'All' ? projectsData.filter(p => p.category === cat).length : null}
                        />
                    ))}
                </div>
            </div>

            <div className="relative px-6 max-w-7xl mx-auto pb-24">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-[2px] rounded-full" style={{ background: CAT_COLORS[activeCategory] }} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]"
                            style={{ color: CAT_COLORS[activeCategory] }}>
                            {activeCategory === 'All' ? `All Projects` : activeCategory}
                        </span>
                        <span className="text-[11px] text-white/20 font-bold">— {filtered.length} items</span>
                    </div>
                    <span className="text-[11px] text-white/20 uppercase tracking-widest font-bold">
                        {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                </div>

                {visibleProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleProjects.map((item, index) => (
                            <ProjectCard key={`${item.id}-${currentPage}-${activeCategory}`} item={item} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p className="text-white/20 text-sm uppercase tracking-[0.25em] font-black">No projects in this category yet</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <PageBtn onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} label="Previous">←</PageBtn>
                        {pageNumbers().map(num => (
                            <PageBtn key={num} onClick={() => goTo(num)} isActive={num === currentPage} label={`Page ${num}`}>{num}</PageBtn>
                        ))}
                        <PageBtn onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} label="Next">→</PageBtn>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllProjects;