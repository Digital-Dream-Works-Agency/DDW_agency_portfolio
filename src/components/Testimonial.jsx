// src/components/Testimonial.jsx
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const testimonialData = [
    {
        name: "James Davidson",
        role: "VP of Operations",
        company: "TechCorp Inc.",
        comment: "They Built What We Couldn't Find Anywhere. DDW Agency built exactly what we needed — a custom dispatch system. It's now the backbone of our operations.",
        img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 5,
        project: "Enterprise Dispatch System"
    },
    {
        name: "Sarah Mitchell",
        role: "CMO",
        company: "Meridian Health Group",
        comment: "Our Marketing Infrastructure Partner. They built a unified system — CRM, automation, analytics — all connected. Our team is now 3x more efficient.",
        img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 5,
        project: "Marketing Automation Hub"
    },
    {
        name: "Michael Chen",
        role: "CEO",
        company: "Apex Logistics",
        comment: "Strategic Partner, Not Just a Vendor. Their technical advisory saved us from a $200K mistake and executed the right solution in half the time.",
        img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300",
        rating: 5,
        project: "Supply Chain Optimization"
    }
];

const Testimonials = () => {
    const testiRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".testi-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: ".testi-header",
                    start: "top 85%",
                }
            });
        }, testiRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={testiRef} className="py-20 bg-bg-surface text-white overflow-hidden relative">
            
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-vibrant blur-3xl rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="testi-header text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block mb-6"
                    >
                        <span className="px-6 py-2 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-widest">
                            Client Reviews
                        </span>
                    </motion.div>

                    <h2 className="text-5xl md:text-6xl font-heading font-black mb-6">
                        Happy <span className="gradient-text">Customers</span>
                    </h2>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-6 h-6 text-orange-vibrant" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>

                    <p className="text-text-muted text-sm">Based on 150+ verified reviews</p>
                </div>

                {/* Testimonials Swiper */}
                <div className="relative max-w-4xl mx-auto">
                    <Swiper
                        modules={[Navigation, Autoplay, EffectFade]}
                        effect="fade"
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ 
                            delay: 5000, 
                            disableOnInteraction: false 
                        }}
                        speed={1000}
                        navigation={{
                            prevEl: '.testi-prev-new',
                            nextEl: '.testi-next-new',
                        }}
                        className="testimonial-swiper-new"
                    >
                        {testimonialData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <motion.div 
                                    className="bg-deep-black/50 backdrop-blur-md p-12 md:p-16 rounded-3xl border border-orange-vibrant/20 text-center relative overflow-hidden"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Quote Icon */}
                                    <div className="absolute top-8 left-8 opacity-10">
                                        <svg width="60" height="45" viewBox="0 0 60 45" fill="none">
                                            <path d="M15.4 0L24 7.6C16 14.6 14.2 21.6 14.2 27.2H27.6V45H0V27.2C0 14 6.8 4.6 15.4 0ZM47.8 0L56.4 7.6C48.4 14.6 46.6 21.6 46.6 27.2H60V45H32.4V27.2C32.4 14 39.2 4.6 47.8 0Z" fill="currentColor" className="text-orange-vibrant" />
                                        </svg>
                                    </div>

                                    {/* Project Tag */}
                                    <div className="inline-block px-4 py-2 bg-orange-vibrant/10 border border-orange-vibrant/30 rounded-full text-orange-vibrant text-xs font-bold uppercase tracking-wider mb-8">
                                        {item.project}
                                    </div>

                                    {/* Comment */}
                                    <p className="text-2xl md:text-3xl font-medium leading-relaxed text-pure-white mb-12 italic max-w-3xl mx-auto">
                                        "{item.comment}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full border-4 border-orange-vibrant p-1 shadow-lg shadow-orange-vibrant/30 mb-4 overflow-hidden">
                                            <img 
                                                src={item.img} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover rounded-full" 
                                            />
                                        </div>
                                        <h4 className="text-xl font-bold text-pure-white mb-1">{item.name}</h4>
                                        <p className="text-orange-vibrant text-sm font-bold mb-1">{item.role}</p>
                                        <p className="text-text-muted text-xs uppercase tracking-wider">{item.company}</p>
                                    </div>

                                    {/* Rating Stars */}
                                    <div className="flex justify-center gap-1 mt-6">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-orange-vibrant" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-12">
                        <button className="testi-prev-new magnetic w-14 h-14 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className="testi-next-new magnetic w-14 h-14 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-orange-vibrant hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;