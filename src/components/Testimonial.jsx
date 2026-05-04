// src/components/Testimonials.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────────
const testimonialData = [
    {
        name: 'James Davidson',
        role: 'VP of Operations',
        company: 'TechCorp Inc.',
        comment: 'They Built What We Could Not Find Anywhere. DDW Agency built exactly what we needed — a custom dispatch system. It is now the backbone of our operations.',
        img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 5,
        project: 'Enterprise Dispatch System',
        stat: { value: '3x', label: 'Ops Efficiency' },
    },
    {
        name: 'Sarah Mitchell',
        role: 'CMO',
        company: 'Meridian Health Group',
        comment: 'Our Marketing Infrastructure Partner. They built a unified system — CRM, automation, analytics — all connected. Our team is now 3x more efficient.',
        img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 5,
        project: 'Marketing Automation Hub',
        stat: { value: '3x', label: 'Team Output' },
    },
    {
        name: 'Michael Chen',
        role: 'CEO',
        company: 'Apex Logistics',
        comment: 'Strategic Partner, Not Just a Vendor. Their technical advisory saved us from a $200K mistake and executed the right solution in half the time.',
        img: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 5,
        project: 'Supply Chain Optimization',
        stat: { value: '$200K', label: 'Cost Saved' },
    },
];

// ─── Magnetic Hook ─────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.25) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// ─── Nav Button ────────────────────────────────────────────────────────────────
const NavBtn = ({ children, onClick }) => {
    const ref = useRef(null);
    useMagnetic(ref, 0.3);
    return (
        <button
            ref={ref}
            onClick={onClick}
            className="relative w-14 h-14 rounded-full border border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black hover:border-orange-vibrant transition-all duration-300 overflow-hidden group z-20"
        >
            <span className="absolute inset-0 bg-orange-vibrant scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-center" />
            <span className="relative z-10 group-hover:text-deep-black transition-colors duration-300">{children}</span>
        </button>
    );
};

// ─── Progress Bar ──────────────────────────────────────────────────────────────
const SlideProgress = ({ current, total }) => (
    <div className="flex items-center gap-3 justify-center mt-10">
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                className={`h-0.5 rounded-full transition-all duration-500 ${i === current ? 'w-12 bg-orange-vibrant' : 'w-4 bg-white/10'}`}
            />
        ))}
    </div>
);

// ─── Single Testimonial Card ────────────────────────────────────────────────────
const TestiCard = ({ item, isActive, isFirstRender }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            // Animating IN
            gsap.fromTo(cardRef.current, 
                { opacity: 0, y: isFirstRender ? 0 : 30 }, 
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", zIndex: 10 }
            );
            
            // Stagger stars manually
            gsap.fromTo(cardRef.current.querySelectorAll('.testi-star'),
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)", delay: 0.2 }
            );
        } else {
            // Animating OUT
            gsap.to(cardRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in", zIndex: 0 });
        }
    }, [isActive, isFirstRender]);

    return (
        <div
            ref={cardRef}
            className="absolute inset-0 p-10 md:p-14 rounded-3xl border border-white/5 overflow-hidden opacity-0 pointer-events-none"
            style={{ 
                background: 'linear-gradient(135deg, rgba(255,87,15,0.04) 0%, rgba(10,10,10,0.95) 100%)',
                pointerEvents: isActive ? 'auto' : 'none' // Clickable only when active
            }}
        >
            {/* Giant quote mark */}
            <div className="absolute top-6 left-8 text-[160px] font-black leading-none select-none pointer-events-none"
                style={{ color: 'rgba(255,87,15,0.05)', fontFamily: 'Georgia, serif' }}>
                "
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle at 100% 0%, rgba(255,87,15,0.06) 0%, transparent 60%)' }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10 h-full">
                {/* Left: Author */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full p-0.5" style={{ background: 'linear-gradient(135deg, #FF570F, #FDE87A)' }}>
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-full border-2 border-deep-black" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-vibrant rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-deep-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="font-black text-pure-white text-lg text-center lg:text-left">{item.name}</div>
                        <div className="text-orange-vibrant text-sm font-bold text-center lg:text-left">{item.role}</div>
                        <div className="text-text-muted text-xs uppercase tracking-wider text-center lg:text-left">{item.company}</div>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                            <svg key={i} className="testi-star w-4 h-4" fill="#FF570F" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    
                    {/* Highlight Metric */}
                    <div className="px-4 py-3 rounded-xl border border-orange-vibrant/20 text-center w-full mt-2" style={{ background: 'rgba(255,87,15,0.06)' }}>
                        <div className="text-2xl font-black bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">
                            {item.stat.value}
                        </div>
                        <div className="text-xs text-text-muted uppercase tracking-wider mt-1">{item.stat.label}</div>
                    </div>
                </div>

                {/* Right: Quote + Project tag */}
                <div className="lg:col-span-2">
                    <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border border-orange-vibrant/30 mb-6" style={{ color: '#FF570F', background: 'rgba(255,87,15,0.08)' }}>
                        {item.project}
                    </span>
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-pure-white mb-8">
                        "{item.comment}"
                    </blockquote>
                    <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, #FF570F, transparent)' }} />
                </div>
            </div>
        </div>
    );
};

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = () => {
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-elem', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }}
            );
        }, headerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={headerRef} className="text-center mb-16">
            <div className="header-elem inline-block mb-6">
                <span className="px-6 py-2 border border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-widest rounded-full">
                    Client Reviews
                </span>
            </div>
            
            <h2 className="header-elem text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 perspective-1000">
                <span className="inline-block text-pure-white mr-4">Happy</span>
                <span className="inline-block bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Customers</span>
            </h2>
            
            <p className="header-elem text-text-muted text-sm uppercase tracking-widest">
                Based on 150+ verified reviews
            </p>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Testimonials = () => {
    const sectionRef = useRef(null);
    const parallaxBgRef = useRef(null);
    
    // Custom GSAP Slider State
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const timeoutRef = useRef(null);

    // Prevent weird jump on load
    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    // Navigation Handlers
    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialData.length);
        setIsAutoPlaying(false); // Pause autoplay if user interacts
    }, []);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + testimonialData.length) % testimonialData.length);
        setIsAutoPlaying(false);
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (isAutoPlaying) {
            timeoutRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % testimonialData.length);
            }, 6000); // 6 seconds per slide
        }
        return () => clearInterval(timeoutRef.current);
    }, [isAutoPlaying]);

    // Parallax Effect
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(parallaxBgRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-bg-surface overflow-hidden">
            {/* Background Glow */}
            <div 
                ref={parallaxBgRef}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[150px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,87,15,0.06) 0%, transparent 70%)' }}
            />

            {/* Grid Lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,87,15,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <SectionHeader />

                {/* Custom Native GSAP Slider */}
                <div 
                    className="relative min-h-[580px] md:min-h-[400px] lg:min-h-[380px] w-full"
                    onMouseEnter={() => setIsAutoPlaying(false)} 
                    onMouseLeave={() => setIsAutoPlaying(true)} 
                >
                    {testimonialData.map((item, i) => (
                        <TestiCard 
                            key={i} 
                            item={item} 
                            isActive={i === activeIndex} 
                            isFirstRender={isFirstRender} 
                        />
                    ))}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-10">
                    <div className="text-text-muted text-sm font-mono">
                        <span className="text-orange-vibrant font-bold text-lg">
                            {String(activeIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="mx-2">/</span>
                        {String(testimonialData.length).padStart(2, '0')}
                    </div>

                    <SlideProgress current={activeIndex} total={testimonialData.length} />

                    <div className="flex gap-3">
                        <NavBtn onClick={handlePrev}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </NavBtn>
                        <NavBtn onClick={handleNext}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </NavBtn>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;