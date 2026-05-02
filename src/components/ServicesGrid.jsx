// src/components/ServicesGrid.jsx - ULTRA ADVANCED VERSION
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Services Data ──────────────────────────────────────────────────────────────
const servicesData = [
  {
    title: "Web Development",
    desc: "Web development is the process of creating websites and web applications for the internet or intranet.",
    gradient: "from-orange-vibrant/20 to-purple-600/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-vibrant">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <path d="M9 15l-3-3 3-3"></path>
        <path d="M15 9l3 3-3 3"></path>
      </svg>
    )
  },
  {
    title: "Cloud Solutions",
    desc: "Cloud solutions refer to the use of cloud computing technology to provide services and solutions over the internet.",
    gradient: "from-blue-500/20 to-cyan-400/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-vibrant">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        <path d="M12 12v6"></path>
        <path d="M9 15l3 3 3-3"></path>
      </svg>
    )
  },
  {
    title: "Cyber Security",
    desc: "Cybersecurity refers to the protection of computer systems, networks, and data from theft, damage, or unauthorized access.",
    gradient: "from-red-500/20 to-pink-400/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-vibrant">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <rect x="9" y="9" width="6" height="6" rx="1"></rect>
      </svg>
    )
  },
  {
    title: "Data Analytics",
    desc: "Data analytics refers to the process of examining and interpreting large datasets to extract insights and draw conclusions.",
    gradient: "from-green-500/20 to-emerald-400/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-vibrant">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )
  },
  {
    title: "Software Development",
    desc: "Software development is the process of creating computer software programs that perform specific functions or tasks.",
    gradient: "from-indigo-500/20 to-violet-400/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-vibrant">
        <path d="M2 12h4l3-9 5 18 3-9h5"></path>
      </svg>
    )
  },
  {
    title: "Digital Marketing",
    desc: "Digital marketing refers to the use of digital channels and technologies to promote products, services, or brands.",
    gradient: "from-yellow-500/20 to-amber-400/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-vibrant">
        <path d="M12 20v-6M6 20V10M18 20V4"></path>
      </svg>
    )
  }
];

// ─── Magnetic Effect Hook ──────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.2) => {
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
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.6,
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

// ─── Service Card Component ────────────────────────────────────────────────────
const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);
    const iconRef = useRef(null);

    // Icon hover animation
    useEffect(() => {
        const card = cardRef.current;
        const icon = iconRef.current;

        const handleMouseEnter = () => {
            gsap.to(icon, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <Tilt
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            scale={1.02}
            transitionSpeed={2000}
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#FF570F"
            className="service-box"
            style={{ '--card-index': index }}
        >
            <div
                ref={cardRef}
                className="relative bg-gradient-to-br from-[#151a1d] to-[#0d1012] p-10 rounded-2xl border-2 border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-500 group flex flex-col justify-between h-full overflow-hidden"
            >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl`} />

                {/* Glowing orb on hover */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-vibrant/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    {/* Icon */}
                    <div ref={iconRef} className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 tracking-wide text-pure-white group-hover:text-orange-vibrant transition-colors duration-300">
                        {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-muted text-sm leading-relaxed mb-10 group-hover:text-pure-white/80 transition-colors duration-300">
                        {service.desc}
                    </p>
                </div>

                {/* Learn More Button */}
                <LearnMoreButton />

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <svg viewBox="0 0 100 100" className="text-orange-vibrant">
                        <path d="M 0 100 L 100 100 L 100 0 Z" fill="currentColor" />
                    </svg>
                </div>

                {/* Progress bar animation */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </Tilt>
    );
};

// ─── Learn More Button Component ───────────────────────────────────────────────
const LearnMoreButton = () => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.3);

    return (
        <a
            ref={btnRef}
            href="#learn-more"
            className="relative inline-flex items-center gap-3 group/btn w-max"
        >
            <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Star shape background */}
                <div className="absolute inset-0 bg-orange-vibrant rounded-[40%] rotate-45 transition-all duration-500 group-hover/btn:rotate-90 group-hover/btn:scale-110 shadow-lg shadow-orange-vibrant/50" />
                
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-orange-vibrant rounded-[40%] rotate-45 animate-ping opacity-20" />
                
                {/* Text */}
                <span className="relative z-10 text-deep-black text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                    Learn<br />More
                </span>
            </div>

            {/* Arrow */}
            <span className="text-text-muted group-hover/btn:text-orange-vibrant group-hover/btn:translate-x-1 transition-all duration-300 text-xl">
                →
            </span>
        </a>
    );
};

// ─── View All Button Component ─────────────────────────────────────────────────
const ViewAllButton = () => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.25);

    return (
        <a
            ref={btnRef}
            href="#all-services"
            className="relative group bg-orange-vibrant text-deep-black px-10 py-4 font-bold text-sm uppercase tracking-wider hover:bg-cream transition-all duration-300 inline-flex items-center gap-3 overflow-hidden shadow-lg shadow-orange-vibrant/40"
        >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                View All Services
                <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>

            {/* Border animation */}
            <span className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500" />
        </a>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ServicesGrid = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    // ── Text Reveal Animation ──
    useEffect(() => {
        const heading = document.querySelector('.services-heading');
        if (heading && !textSplit) {
            const split = new SplitType(heading, { types: 'words' });
            setTextSplit(split);

            gsap.from(split.words, {
                opacity: 0,
                y: 50,
                rotationX: -45,
                transformOrigin: 'top center',
                stagger: 0.05,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    once: true,
                },
            });
        }

        return () => {
            if (textSplit) textSplit.revert();
        };
    }, [textSplit]);

    // ── Cards Animation ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.service-box', {
                y: 80,
                opacity: 0,
                scale: 0.9,
                rotationY: -15,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <ParallaxProvider>
            <section ref={sectionRef} className="relative py-32 bg-[#0d1012] text-white overflow-hidden">
                {/* ── Animated Grid Background ── */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                {/* ── Background Glows ── */}
                <Parallax speed={-10}>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/10 blur-[150px] rounded-full animate-pulse" />
                </Parallax>

                <Parallax speed={8}>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 blur-[120px] rounded-full" />
                </Parallax>

                <div className="relative z-10 max-w-[1440px] mx-auto px-6">

                    {/* ── Section Header ── */}
                    <Parallax speed={-5}>
                        <div className="text-center mb-20">
                            <span className="inline-block px-5 py-2 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                                <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" />
                                Solutions We Offer
                            </span>
                            
                            <h2 ref={headingRef} className="services-heading text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight perspective-1000">
                                Bring The Revolution With <br />
                                The{' '}
                                <span 
                                    style={{
                                        background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        display: 'inline-block'
                                    }}
                                >
                                    Diligence
                                </span>{' '}
                                Service
                            </h2>
                        </div>
                    </Parallax>

                    {/* ── Services Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {servicesData.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>

                    {/* ── View All Button ── */}
                    <div className="flex justify-center">
                        <ViewAllButton />
                    </div>

                </div>

                {/* Custom CSS */}
                <style jsx>{`
                    .perspective-1000 {
                        perspective: 1000px;
                    }
                `}</style>
            </section>
        </ParallaxProvider>
    );
};

export default ServicesGrid;