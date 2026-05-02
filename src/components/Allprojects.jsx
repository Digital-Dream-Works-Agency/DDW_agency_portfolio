// src/components/Allprojects.jsx - FULLY FIXED VERSION
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────────
const projectsData = [
    {
        id: 'enterprise-dispatch-system',
        title: 'Enterprise Dispatch System',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['React', 'Node.js', 'AWS'],
        metrics: { clients: '500+', uptime: '99.9%' },
    },
    {
        id: 'financial-intelligence-dashboard',
        title: 'Financial Intelligence Dashboard',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Data Viz', 'Python', 'ML'],
        metrics: { revenue: '$2M+', accuracy: '95%' },
    },
    {
        id: 'supply-chain-erp',
        title: 'Supply Chain ERP Architecture',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['SAP', 'Oracle', 'Integration'],
        metrics: { efficiency: '+40%', cost: '-30%' },
    },
    {
        id: 'healthcare-data-infrastructure',
        title: 'Healthcare Data Infrastructure',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['HIPAA', 'Cloud', 'Security'],
        metrics: { compliance: '100%', scale: '5x' },
    },
    {
        id: 'legal-case-management',
        title: 'Legal Case Management Suite',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/1181333/pexels-photo-1181333.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['React', 'PostgreSQL', 'Auth'],
        metrics: { cases: '10K+', time: '-50%' },
    },
    {
        id: 'saas-seo-strategy',
        title: 'SaaS Growth & SEO Strategy',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['SEO', 'Content', 'Analytics'],
        metrics: { traffic: '+250%', leads: '+180%' },
    },
    {
        id: 'marketing-automation-hub',
        title: 'Marketing Automation Hub',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['HubSpot', 'Automation', 'CRM'],
        metrics: { conversion: '+65%', roi: '450%' },
    },
    {
        id: 'omni-channel-crm',
        title: 'Omni-channel CRM Integration',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['CRM', 'API', 'Omnichannel'],
        metrics: { channels: '8', retention: '+42%' },
    },
    {
        id: 'enterprise-content-authority',
        title: 'Enterprise Content Authority',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Content', 'SEO', 'DA'],
        metrics: { da: '72', articles: '500+' },
    },
];

const CATEGORIES = ['All', 'Custom Software', 'SEO & Marketing'];
const ITEMS_PER_PAGE = 6;

// ─── Card Component ────────────────────────────────────────────────────────────
// Pure CSS transitions — no Framer Motion here to avoid GSAP conflict
const ProjectCard = ({ item, index }) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        // Navigate to individual project page when it exists
        // For now scrolls to case studies on home; swap for navigate(`/projects/${item.id}`) later
        navigate(`/projects/${item.id}`);
    }, [navigate, item.id]);

    return (
        <div
            className="proj-card group cursor-pointer"
            style={{ '--card-index': index }}
            onClick={handleClick}
        >
            <div className="relative bg-bg-surface rounded-2xl overflow-hidden flex flex-col h-[450px] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 shadow-2xl transition-all duration-500 hover:-translate-y-2">

                {/* Image */}
                <div className="flex-1 overflow-hidden relative">
                    <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Tags appear on hover */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-orange-vibrant text-deep-black text-xs font-bold rounded-full shadow-lg"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content footer */}
                <div className="bg-deep-black/95 backdrop-blur-md p-6 border-t border-orange-vibrant/20 flex justify-between items-center transition-all duration-500 group-hover:border-orange-vibrant/50">
                    <div className="flex-1 min-w-0">
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-widest block mb-2">
                            {item.category}
                        </span>
                        <h4 className="text-lg font-heading font-bold leading-tight text-pure-white group-hover:text-orange-vibrant transition-colors line-clamp-2">
                            {item.title}
                        </h4>

                        {/* Metrics row */}
                        <div className="flex gap-4 mt-3 pt-3 border-t border-orange-vibrant/10">
                            {Object.entries(item.metrics).map(([key, val]) => (
                                <div key={key}>
                                    <div className="text-cream font-bold text-sm">{val}</div>
                                    <div className="text-pure-white/50 text-[10px] uppercase tracking-wider">{key}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-vibrant flex items-center justify-center text-deep-black font-bold text-lg group-hover:-rotate-45 transition-all duration-500 shadow-lg shadow-orange-vibrant/50 ml-4">
                        ↗
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllProjects = () => {
    const gridRef   = useRef(null);
    const sectionRef = useRef(null);

    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage,    setCurrentPage]    = useState(1);

    // Filter projects
    const filtered = activeCategory === 'All'
        ? projectsData
        : projectsData.filter((p) => p.category === activeCategory);

    const totalPages    = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex    = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 whenever filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    // GSAP entrance — runs once on mount
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.proj-card', {
                y: 60,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 88%',
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Re-animate cards when page/filter changes (no ScrollTrigger needed — user is already here)
    const prevPage     = useRef(currentPage);
    const prevCategory = useRef(activeCategory);

    useEffect(() => {
        if (
            currentPage  !== prevPage.current ||
            activeCategory !== prevCategory.current
        ) {
            prevPage.current     = currentPage;
            prevCategory.current = activeCategory;

            // Scroll section into comfortable view
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            gsap.fromTo(
                '.proj-card',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
            );
        }
    }, [currentPage, activeCategory]);

    // ── Pagination helpers ──────────────────────────────────────────────────
    const goTo = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Build page number array (always show max 5 buttons)
    const pageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3)  return [1, 2, 3, 4, 5];
        if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    // ── JSX ─────────────────────────────────────────────────────────────────
    return (
        <section ref={sectionRef} className="py-20 bg-deep-black text-white min-h-screen scroll-mt-24">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* ── Category Filter ── */}
                <div className="flex flex-wrap justify-center gap-3 mb-14">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg
                                border-2 transition-all duration-300
                                ${activeCategory === cat
                                    ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-lg shadow-orange-vibrant/40'
                                    : 'border-orange-vibrant/30 text-text-muted hover:border-orange-vibrant hover:text-orange-vibrant'
                                }
                            `}
                        >
                            {cat}
                            {cat !== 'All' && (
                                <span className="ml-2 opacity-60">
                                    ({projectsData.filter((p) => p.category === cat).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Projects Grid ── */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {visibleProjects.length > 0 ? (
                        visibleProjects.map((item, index) => (
                            <ProjectCard key={item.id} item={item} index={index} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 text-text-muted">
                            No projects found for this category.
                        </div>
                    )}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 flex-wrap">

                        {/* Prev */}
                        <button
                            onClick={() => goTo(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`
                                w-12 h-12 rounded-lg border-2 flex items-center justify-center
                                font-bold text-lg transition-all duration-300
                                ${currentPage === 1
                                    ? 'border-white/10 text-white/20 cursor-not-allowed'
                                    : 'border-orange-vibrant/30 text-pure-white hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant'
                                }
                            `}
                            aria-label="Previous page"
                        >
                            ←
                        </button>

                        {/* Page numbers */}
                        {pageNumbers().map((num) => (
                            <button
                                key={num}
                                onClick={() => goTo(num)}
                                className={`
                                    w-12 h-12 rounded-lg border-2 flex items-center justify-center
                                    font-bold text-sm transition-all duration-300
                                    ${num === currentPage
                                        ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-lg shadow-orange-vibrant/40'
                                        : 'border-orange-vibrant/30 text-pure-white hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant'
                                    }
                                `}
                                aria-label={`Page ${num}`}
                                aria-current={num === currentPage ? 'page' : undefined}
                            >
                                {num}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                            onClick={() => goTo(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`
                                w-12 h-12 rounded-lg border-2 flex items-center justify-center
                                font-bold text-lg transition-all duration-300
                                ${currentPage === totalPages
                                    ? 'border-white/10 text-white/20 cursor-not-allowed'
                                    : 'border-orange-vibrant/30 text-pure-white hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant'
                                }
                            `}
                            aria-label="Next page"
                        >
                            →
                        </button>
                    </div>
                )}

                {/* Results count */}
                <p className="text-center text-text-muted text-xs uppercase tracking-widest mt-8">
                    Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} projects
                </p>

            </div>
        </section>
    );
};

export default AllProjects;