// src/components/Homepage_projects.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
    { 
        title: "Enterprise Dispatch System", 
        category: "Custom Software", 
        img: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["React", "Node.js", "AWS"],
        metrics: { clients: "500+", uptime: "99.9%" }
    },
    { 
        title: "Financial Intelligence Dashboard", 
        category: "Custom Software", 
        img: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["Data Viz", "Python", "ML"],
        metrics: { revenue: "$2M+", accuracy: "95%" }
    },
    { 
        title: "Supply Chain ERP Architecture", 
        category: "Custom Software", 
        img: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["SAP", "Oracle", "Integration"],
        metrics: { efficiency: "+40%", cost: "-30%" }
    },
    { 
        title: "SaaS Growth & SEO Strategy", 
        category: "SEO & Marketing", 
        img: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["SEO", "Content", "Analytics"],
        metrics: { traffic: "+250%", leads: "+180%" }
    },
    { 
        title: "Marketing Automation Hub", 
        category: "SEO & Marketing", 
        img: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["HubSpot", "Automation", "CRM"],
        metrics: { conversion: "+65%", roi: "450%" }
    },
    { 
        title: "Healthcare Data Infrastructure", 
        category: "Custom Software", 
        img: "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=800",
        tags: ["HIPAA", "Cloud", "Security"],
        metrics: { compliance: "100%", scale: "5x" }
    },
];

const ImageWithLoader = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full h-full relative bg-bg-surface">
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-orange-vibrant/20 border-t-orange-vibrant rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={`${src}?auto=compress&cs=tinysrgb&w=1200`}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                    loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-lg'
                }`}
            />
        </div>
    );
};

const HomePortfolio = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        projectsData.forEach(project => {
            const img = new Image();
            img.src = `${project.img}?auto=compress&cs=tinysrgb&w=1200`;
        });

        const ctx = gsap.context(() => {
            gsap.from(".portfolio-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 bg-deep-black text-white overflow-hidden relative">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-vibrant rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-cream rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6">

                {/* Header Section */}
                <div className="portfolio-header flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                    <div className="max-w-2xl text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block mb-4"
                        >
                            <span className="px-6 py-2 border-2 border-orange-vibrant/50 text-orange-vibrant text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-vibrant/20">
                                Our Work
                            </span>
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-tight leading-tight text-pure-white">
                            Completed <span className="gradient-text">Projects</span>
                        </h2>
                        
                        <p className="text-pure-white/70 text-sm md:text-base leading-relaxed">
                            Solutions delivered with architectural precision. Explore how we help enterprise brands scale their technical presence.
                        </p>
                    </div>
                    
                    <Link 
                        to="/projects" 
                        className="magnetic bg-orange-vibrant text-deep-black px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg hover:shadow-orange-vibrant/50 whitespace-nowrap flex items-center gap-2"
                    >
                        View All Projects
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Swiper Slider - FIXED FOR SMOOTH SCROLLING */}
                <div className="portfolio-slider-container relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        speed={800}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        navigation={{
                            prevEl: '.portfolio-prev',
                            nextEl: '.portfolio-next',
                        }}
                        breakpoints={{
                            640: { 
                                slidesPerView: 1,
                                spaceBetween: 20 
                            },
                            768: { 
                                slidesPerView: 2,
                                spaceBetween: 25 
                            },
                            1024: { 
                                slidesPerView: 3,
                                spaceBetween: 30 
                            },
                        }}
                        className="home-portfolio-swiper !pb-4"
                    >
                        {projectsData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link to="/projects" className="block group">
                                    <motion.div 
                                        className="magnetic relative bg-bg-surface rounded-2xl overflow-hidden cursor-pointer flex flex-col h-[480px] border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 shadow-2xl transition-all duration-700"
                                        whileHover={{ y: -10 }}
                                    >
                                        {/* Image Area */}
                                        <div className="flex-1 overflow-hidden relative">
                                            <ImageWithLoader src={item.img} alt={item.title} />
                                            
                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            {/* Tags */}
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                {item.tags.map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 bg-orange-vibrant text-deep-black text-xs font-bold rounded-full shadow-lg">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Content Box */}
                                        <div className="bg-deep-black/95 backdrop-blur-md p-6 border-t-2 border-orange-vibrant/20 transition-all duration-500 group-hover:border-orange-vibrant/50">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <span className="text-orange-vibrant text-xs font-bold uppercase tracking-widest block mb-2">
                                                        {item.category}
                                                    </span>
                                                    <h4 className="text-xl font-heading font-bold leading-tight text-pure-white group-hover:text-orange-vibrant transition-colors line-clamp-2">
                                                        {item.title}
                                                    </h4>
                                                </div>

                                                {/* Arrow Button */}
                                                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-vibrant flex items-center justify-center text-deep-black font-bold text-lg group-hover:-rotate-45 transition-all duration-500 shadow-lg shadow-orange-vibrant/50 ml-3">
                                                    ↗
                                                </div>
                                            </div>

                                            {/* Metrics */}
                                            <div className="flex gap-4 pt-4 border-t border-orange-vibrant/10">
                                                {Object.entries(item.metrics).map(([key, value], i) => (
                                                    <div key={i} className="flex-1">
                                                        <div className="text-cream font-bold text-sm">{value}</div>
                                                        <div className="text-pure-white/60 text-xs uppercase tracking-wider">{key}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-12">
                        <button className="portfolio-prev magnetic w-14 h-14 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300 shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className="portfolio-next magnetic w-14 h-14 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300 shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            {/* Custom Swiper Styles */}
            <style jsx global>{`
                .home-portfolio-swiper .swiper-slide {
                    opacity: 0.4;
                    transform: scale(0.9);
                    transition: all 0.5s ease;
                }
                .home-portfolio-swiper .swiper-slide-active {
                    opacity: 1;
                    transform: scale(1);
                }
                .home-portfolio-swiper .swiper-slide-next,
                .home-portfolio-swiper .swiper-slide-prev {
                    opacity: 0.7;
                    transform: scale(0.95);
                }
            `}</style>
        </section>
    );
};

export default HomePortfolio;