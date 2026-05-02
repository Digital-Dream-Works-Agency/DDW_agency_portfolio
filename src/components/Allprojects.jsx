// src/components/Allprojects.jsx - FULLY ADVANCED VERSION
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';

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
        gradient: 'from-orange-vibrant/20 to-purple-600/20',
    },
    {
        id: 'financial-intelligence-dashboard',
        title: 'Financial Intelligence Dashboard',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Data Viz', 'Python', 'ML'],
        metrics: { revenue: '$2M+', accuracy: '95%' },
        gradient: 'from-blue-500/20 to-cyan-400/20',
    },
    {
        id: 'supply-chain-erp',
        title: 'Supply Chain ERP Architecture',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['SAP', 'Oracle', 'Integration'],
        metrics: { efficiency: '+40%', cost: '-30%' },
        gradient: 'from-green-500/20 to-emerald-400/20',
    },
    {
        id: 'healthcare-data-infrastructure',
        title: 'Healthcare Data Infrastructure',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['HIPAA', 'Cloud', 'Security'],
        metrics: { compliance: '100%', scale: '5x' },
        gradient: 'from-red-500/20 to-pink-400/20',
    },
    {
        id: 'legal-case-management',
        title: 'Legal Case Management Suite',
        category: 'Custom Software',
        img: 'https://images.pexels.com/photos/1181333/pexels-photo-1181333.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['React', 'PostgreSQL', 'Auth'],
        metrics: { cases: '10K+', time: '-50%' },
        gradient: 'from-indigo-500/20 to-violet-400/20',
    },
    {
        id: 'saas-seo-strategy',
        title: 'SaaS Growth & SEO Strategy',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['SEO', 'Content', 'Analytics'],
        metrics: { traffic: '+250%', leads: '+180%' },
        gradient: 'from-yellow-500/20 to-amber-400/20',
    },
    {
        id: 'marketing-automation-hub',
        title: 'Marketing Automation Hub',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['HubSpot', 'Automation', 'CRM'],
        metrics: { conversion: '+65%', roi: '450%' },
        gradient: 'from-orange-vibrant/20 to-red-500/20',
    },
    {
        id: 'omni-channel-crm',
        title: 'Omni-channel CRM Integration',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['CRM', 'API', 'Omnichannel'],
        metrics: { channels: '8', retention: '+42%' },
        gradient: 'from-teal-500/20 to-cyan-400/20',
    },
    {
        id: 'enterprise-content-authority',
        title: 'Enterprise Content Authority',
        category: 'SEO & Marketing',
        img: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Content', 'SEO', 'DA'],
        metrics: { da: '72', articles: '500+' },
        gradient: 'from-purple-500/20 to-pink-400/20',
    },
];

const CATEGORIES = ['All', 'Custom Software', 'SEO & Marketing'];
const ITEMS_PER_PAGE = 6;

// ─── Advanced Magnetic Button Hook ────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(element, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);
};

// ─── Advanced 3D Card with Tilt + Parallax ─────────────────────────────────────
const ProjectCard = ({ item, index }) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(() => {
        // Add micro-interaction before navigation
        gsap.to(cardRef.current, {
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: () => navigate(`/projects/${item.id}`),
        });
    }, [navigate, item.id]);

    return (
        <Tilt
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            scale={1.02}
            transitionSpeed={2500}
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#FF570F"
            glarePosition="all"
            glareBorderRadius="1rem"
            className="proj-card"
            style={{ '--card-index': index }}
        >
            <div
                ref={cardRef}
                className="relative bg-gradient-to-br from-bg-surface to-deep-black rounded-2xl overflow-hidden flex flex-col h-[480px] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/60 shadow-2xl transition-all duration-500 cursor-pointer group"
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`} />

                {/* Image with Parallax */}
                <Parallax speed={-5} className="flex-1 overflow-hidden relative">
                    <div className="relative h-full">
                        <img
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                        />
                        {/* Multi-layer gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/0 to-orange-vibrant/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Animated tags */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {item.tags.map((tag, i) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 bg-orange-vibrant/90 backdrop-blur-sm text-deep-black text-xs font-bold rounded-full shadow-lg shadow-orange-vibrant/50 transform translate-y-[-50px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                    style={{ transitionDelay: `${i * 75}ms` }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Scan line effect (cyberpunk style) */}
                        {isHovered && (
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="scan-line" />
                            </div>
                        )}
                    </div>
                </Parallax>

                {/* Content footer with slide-up animation */}
                <div className="relative bg-deep-black/95 backdrop-blur-xl p-6 border-t-2 border-orange-vibrant/20 group-hover:border-orange-vibrant/60 transition-all duration-500 z-10">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-vibrant/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                        {/* Category badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse" />
                            <span className="text-orange-vibrant text-xs font-bold uppercase tracking-widest">
                                {item.category}
                            </span>
                        </div>

                        {/* Title with text reveal */}
                        <h4 className="text-xl font-heading font-bold leading-tight text-pure-white group-hover:text-orange-vibrant transition-colors duration-300 line-clamp-2 mb-4">
                            {item.title}
                        </h4>

                        {/* Metrics with counter animation */}
                        <div className="flex gap-6 pt-4 border-t border-orange-vibrant/20 group-hover:border-orange-vibrant/40 transition-colors">
                            {Object.entries(item.metrics).map(([key, val], i) => (
                                <div
                                    key={key}
                                    className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    <div className="text-cream font-bold text-base tracking-tight">{val}</div>
                                    <div className="text-pure-white/50 text-[10px] uppercase tracking-widest mt-0.5">{key}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Magnetic arrow button */}
                    <MagneticArrow />
                </div>

                {/* Corner accent (geometric design) */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <svg viewBox="0 0 100 100" className="text-orange-vibrant">
                        <path d="M 0 0 L 100 0 L 100 100 Z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </Tilt>
    );
};

// ─── Magnetic Arrow Component ──────────────────────────────────────────────────
const MagneticArrow = () => {
    const arrowRef = useRef(null);
    useMagneticEffect(arrowRef, 0.4);

    return (
        <div className="absolute bottom-6 right-6">
            <div
                ref={arrowRef}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-vibrant to-orange-600 flex items-center justify-center text-deep-black font-bold text-xl shadow-2xl shadow-orange-vibrant/60 group-hover:shadow-orange-vibrant/80 transition-all duration-500 group-hover:rotate-45"
            >
                <span className="transform group-hover:scale-110 transition-transform duration-300">↗</span>
            </div>
        </div>
    );
};

// ─── Category Filter with Magnetic Effect ──────────────────────────────────────
const CategoryButton = ({ cat, isActive, onClick, count }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.2);

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            className={`
                relative px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xl
                border-2 transition-all duration-500 overflow-hidden group
                ${isActive
                    ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-2xl shadow-orange-vibrant/50'
                    : 'border-orange-vibrant/30 text-text-muted hover:border-orange-vibrant hover:text-orange-vibrant'
                }
            `}
        >
            {/* Animated background */}
            <span className="absolute inset-0 bg-gradient-to-r from-orange-vibrant to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {cat}
                {count && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-deep-black/20' : 'bg-orange-vibrant/10'}`}>
                        {count}
                    </span>
                )}
            </span>

            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>
    );
};

// ─── Scroll Progress Bar ───────────────────────────────────────────────────────
const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    const barRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / totalHeight) * 100;
            setProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        gsap.to(barRef.current, {
            scaleX: progress / 100,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, [progress]);

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-orange-vibrant/10 z-[9999]">
            <div
                ref={barRef}
                className="h-full bg-gradient-to-r from-orange-vibrant to-orange-600 origin-left shadow-lg shadow-orange-vibrant/50"
                style={{ transformOrigin: 'left' }}
            />
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllProjects = () => {
    const gridRef = useRef(null);
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter projects
    const filtered = activeCategory === 'All'
        ? projectsData
        : projectsData.filter((p) => p.category === activeCategory);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    // ── Text Reveal Animation for Heading ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            const words = headingRef.current.querySelectorAll('.word');
            gsap.from(words, {
                y: 100,
                opacity: 0,
                rotationX: -90,
                transformOrigin: 'top center',
                stagger: 0.08,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: 'top 80%',
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // ── Cards Entrance Animation ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.proj-card', {
                y: 80,
                opacity: 0,
                scale: 0.9,
                rotationY: -15,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 85%',
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // ── Re-animate on page/filter change ──
    const prevPage = useRef(currentPage);
    const prevCategory = useRef(activeCategory);

    useEffect(() => {
        if (currentPage !== prevPage.current || activeCategory !== prevCategory.current) {
            prevPage.current = currentPage;
            prevCategory.current = activeCategory;

            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            gsap.fromTo(
                '.proj-card',
                { y: 40, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [currentPage, activeCategory]);

    // ── Pagination ──
    const goTo = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const pageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, 5];
        if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    return (
        <ParallaxProvider>
            <ScrollProgress />

            <section ref={sectionRef} className="relative py-24 bg-deep-black text-white min-h-screen scroll-mt-24 overflow-hidden">
                {/* Animated background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                <div className="relative max-w-[1440px] mx-auto px-6">
                    {/* ── Section Heading with Text Reveal ── */}
                    <Parallax speed={-10}>
                        <div ref={headingRef} className="text-center mb-16">
                            <h2 className="text-5xl md:text-7xl font-heading font-black leading-tight mb-6 perspective-1000">
                                {['Our', 'Project', 'Portfolio'].map((word, i) => (
                                    <span key={i} className="word inline-block mr-4" style={{ display: 'inline-block' }}>
                                        <span className="inline-block bg-gradient-to-r from-orange-vibrant to-orange-600 bg-clip-text text-transparent">
                                            {word}
                                        </span>
                                    </span>
                                ))}
                            </h2>
                            <p className="text-text-muted text-lg max-w-2xl mx-auto">
                                Transforming ideas into scalable solutions across industries
                            </p>
                        </div>
                    </Parallax>

                    {/* ── Category Filter ── */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
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

                    {/* ── Projects Grid ── */}
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {visibleProjects.length > 0 ? (
                            visibleProjects.map((item, index) => (
                                <ProjectCard key={item.id} item={item} index={index} />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-32">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-text-muted text-lg">No projects found for this category</p>
                            </div>
                        )}
                    </div>

                    {/* ── Advanced Pagination ── */}
                    {totalPages > 1 && (
                        <Parallax speed={5}>
                            <div className="flex justify-center items-center gap-3 flex-wrap mb-8">
                                <PaginationButton
                                    onClick={() => goTo(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    label="Previous"
                                >
                                    ←
                                </PaginationButton>

                                {pageNumbers().map((num) => (
                                    <PaginationButton
                                        key={num}
                                        onClick={() => goTo(num)}
                                        isActive={num === currentPage}
                                        label={`Page ${num}`}
                                    >
                                        {num}
                                    </PaginationButton>
                                ))}

                                <PaginationButton
                                    onClick={() => goTo(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    label="Next"
                                >
                                    →
                                </PaginationButton>
                            </div>
                        </Parallax>
                    )}

                    {/* Results counter with animation */}
                    <p className="text-center text-text-muted text-xs uppercase tracking-widest">
                        <span className="inline-block animate-pulse mr-2">●</span>
                        Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} projects
                    </p>
                </div>
            </section>

            {/* Custom CSS for scan line effect */}
            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(255, 87, 15, 0.8), transparent);
                    animation: scan 2s linear infinite;
                    filter: blur(1px);
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </ParallaxProvider>
    );
};

// ─── Pagination Button Component ───────────────────────────────────────────────
const PaginationButton = ({ onClick, disabled, isActive, label, children }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.3);

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`
                relative w-12 h-12 rounded-xl border-2 flex items-center justify-center
                font-bold text-sm transition-all duration-500 overflow-hidden group
                ${disabled
                    ? 'border-white/5 text-white/20 cursor-not-allowed'
                    : isActive
                    ? 'bg-orange-vibrant border-orange-vibrant text-deep-black shadow-2xl shadow-orange-vibrant/50 scale-110'
                    : 'border-orange-vibrant/30 text-pure-white hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant hover:scale-105'
                }
            `}
        >
            {/* Ripple effect */}
            {!disabled && !isActive && (
                <span className="absolute inset-0 rounded-xl bg-orange-vibrant opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            )}
            
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default AllProjects;