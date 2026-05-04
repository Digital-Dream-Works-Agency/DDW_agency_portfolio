// src/components/Allprojects.jsx
import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────────
const projectsData = [
    {
        id: 'mathfel',
        title: 'Mathfel — Video Door Intercom',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'EU Market', 'E-Commerce'],
        metrics: { ROAS: '600%', Revenue: '€418K' },
        gradient: 'from-orange-vibrant/20 to-amber-400/20',
    },
    {
        id: 'pj-bold',
        title: 'PJ BOLD — Silicone Molds',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'USA', 'E-Commerce'],
        metrics: { ROAS: '14.54x', Revenue: '$38K' },
        gradient: 'from-orange-vibrant/20 to-red-500/20',
    },
    {
        id: 'cpa-moms',
        title: 'CPA MOMS — Tax Franchise',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'Lead Gen', 'USA'],
        metrics: { Conversions: '+53%', CPC: '-51%' },
        gradient: 'from-blue-500/20 to-cyan-400/20',
    },
    {
        id: 'uae-home-appliances',
        title: 'UAE Home Appliances',
        category: 'Meta Ads',
        img: null,
        tags: ['Meta Ads', 'Shopify', 'UAE'],
        metrics: { ROAS: '4.86x', Orders: '572' },
        gradient: 'from-purple-500/20 to-pink-400/20',
    },
    {
        id: 'us-health-clinic',
        title: 'US Health Clinic',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'Healthcare', 'USA'],
        metrics: { Conversions: '15,594', CPC: '$0.09' },
        gradient: 'from-green-500/20 to-emerald-400/20',
    },
    {
        id: 'us-therapy-practice',
        title: 'US Therapy Practice',
        category: 'Google Ads',
        img: null,
        tags: ['Google Ads', 'Healthcare', 'Calls'],
        metrics: { Calls: '517', 'Per Call': '$34.70' },
        gradient: 'from-teal-500/20 to-cyan-400/20',
    },
];

const CATEGORIES = ['All', 'Google Ads', 'Meta Ads'];
const ITEMS_PER_PAGE = 6;

// ─── Native GSAP Tilt Component ────────────────────────────────────────────────
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
            xTo(x * 6); 
            yTo(-y * 6); 
        };

        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

const useMagneticEffect = (ref, strength = 0.25) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power2.out" });

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const handleMouseLeave = () => { xTo(0); yTo(0); };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        return () => { element.removeEventListener('mousemove', handleMouseMove); element.removeEventListener('mouseleave', handleMouseLeave); };
    }, [strength]);
};

const ProjectCard = memo(({ item, index }) => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => navigate(`/projects/${item.id}`), [navigate, item.id]);

    return (
        <GSAPTilt>
            <div onClick={handleClick} className="proj-card relative bg-gradient-to-br from-[#151a1d] to-[#0d1012] rounded-2xl overflow-hidden flex flex-col h-[480px] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 shadow-2xl transition-all duration-500 cursor-pointer group">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl`} />
                <div className="flex-1 overflow-hidden relative">
                    {item.img
                        ? <img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        : <div className="absolute inset-0 bg-gradient-to-br from-[#0e1012] to-[#080808]"><div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                            <span key={tag} className="px-3 py-1.5 bg-orange-vibrant/90 backdrop-blur-sm text-deep-black text-xs font-bold rounded-full shadow-lg transform translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${i * 60}ms` }}>{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="relative bg-deep-black/95 backdrop-blur-md p-6 border-t-2 border-orange-vibrant/20 group-hover:border-orange-vibrant/50 transition-all duration-500 z-10">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-vibrant/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3"><span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse" /><span className="text-orange-vibrant text-xs font-bold uppercase tracking-widest">{item.category}</span></div>
                        <h4 className="text-xl font-heading font-bold leading-tight text-pure-white group-hover:text-orange-vibrant transition-colors duration-300 line-clamp-2 mb-4">{item.title}</h4>
                        <div className="flex gap-6 pt-4 border-t border-orange-vibrant/20 group-hover:border-orange-vibrant/40 transition-colors">
                            {Object.entries(item.metrics).map(([key, val], i) => (
                                <div key={key} className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${i * 80}ms` }}>
                                    <div className="text-cream font-bold text-base">{val}</div>
                                    <div className="text-pure-white/50 text-[10px] uppercase tracking-widest">{key}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-6"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-vibrant to-orange-600 flex items-center justify-center text-deep-black font-bold text-xl shadow-2xl shadow-orange-vibrant/50 group-hover:rotate-45 transition-all duration-500"><span className="transform group-hover:scale-110 transition-transform">↗</span></div></div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-30 transition-opacity duration-500"><svg viewBox="0 0 100 100" className="text-orange-vibrant"><path d="M 0 0 L 100 0 L 100 100 Z" fill="currentColor" /></svg></div>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </GSAPTilt>
    );
});
ProjectCard.displayName = 'ProjectCard';

const CategoryButton = memo(({ cat, isActive, onClick, count }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.15);
    return (
        <button ref={btnRef} onClick={onClick} className={`relative px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xl border-2 transition-all duration-300 overflow-hidden group ${isActive ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-lg shadow-orange-vibrant/40' : 'border-orange-vibrant/30 text-text-muted hover:border-orange-vibrant hover:text-orange-vibrant'}`}>
            <span className="absolute inset-0 bg-gradient-to-r from-orange-vibrant to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">{cat}{count && <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-deep-black/20' : 'bg-orange-vibrant/10'}`}>{count}</span>}</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>
    );
});
CategoryButton.displayName = 'CategoryButton';

const PaginationButton = memo(({ onClick, disabled, isActive, label, children }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);
    return (
        <button ref={btnRef} onClick={onClick} disabled={disabled} aria-label={label} aria-current={isActive ? 'page' : undefined} className={`relative w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 overflow-hidden group ${disabled ? 'border-white/5 text-white/20 cursor-not-allowed' : isActive ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-lg shadow-orange-vibrant/40 scale-105' : 'border-orange-vibrant/30 text-pure-white hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant'}`}>
            {!disabled && !isActive && <span className="absolute inset-0 rounded-xl bg-orange-vibrant opacity-0 group-hover:opacity-20 transition-opacity" />}
            <span className="relative z-10">{children}</span>
        </button>
    );
});
PaginationButton.displayName = 'PaginationButton';

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
            gsap.from('.proj-card', { y: 60, opacity: 0, scale: 0.95, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true } });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => { gsap.fromTo('.proj-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }); }, [currentPage, activeCategory]);

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
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-heading font-black leading-tight mb-6">
                        <span style={{ background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Our Project Portfolio</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">Transforming ideas into scalable solutions across industries</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {CATEGORIES.map((cat) => <CategoryButton key={cat} cat={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} count={cat !== 'All' ? projectsData.filter((p) => p.category === cat).length : null} /> )}
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {visibleProjects.length > 0 ? (visibleProjects.map((item, index) => <ProjectCard key={item.id} item={item} index={index} />)) : (<div className="col-span-3 text-center py-32"><div className="text-6xl mb-4">🔍</div><p className="text-text-muted text-lg">No projects found</p></div>)}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 flex-wrap mb-8">
                        <PaginationButton onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} label="Previous">←</PaginationButton>
                        {pageNumbers().map((num) => <PaginationButton key={num} onClick={() => goTo(num)} isActive={num === currentPage} label={`Page ${num}`}>{num}</PaginationButton>)}
                        <PaginationButton onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} label="Next">→</PaginationButton>
                    </div>
                )}
                <p className="text-center text-text-muted text-xs uppercase tracking-widest">Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} projects</p>
            </div>
        </section>
    );
};

export default AllProjects;