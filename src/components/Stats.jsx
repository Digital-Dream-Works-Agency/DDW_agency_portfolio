// src/components/Stats.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatItem = ({ end, suffix, label, prefix = '' }) => {
    const countRef = useRef(null);

    useEffect(() => {
        const obj = { value: 0 };
        gsap.to(obj, {
            value: end,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: countRef.current,
                start: "top 85%",
            },
            onUpdate: () => {
                if (countRef.current) {
                    countRef.current.innerText = prefix + Math.floor(obj.value) + suffix;
                }
            }
        });
    }, [end, suffix, prefix]);

    return (
        <div className="stat-item magnetic group text-center p-12 rounded-3xl bg-gradient-to-br from-bg-surface to-bg-base border-2 border-orange-vibrant/10 hover:border-orange-vibrant/30 transition-all duration-500 shadow-xl hover:shadow-orange-vibrant/20">
            <div ref={countRef} className="text-7xl font-black gradient-text mb-4">
                0{suffix}
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-vibrant to-transparent mx-auto mb-4"></div>
            <div className="text-text-muted uppercase text-sm tracking-[0.2em] font-bold group-hover:text-orange-vibrant transition-colors">
                {label}
            </div>
        </div>
    );
};

const Stats = () => {
    const statsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat-item", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 85%",
                }
            });
        }, statsRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={statsRef} className="py-16 bg-bg-surface border-y border-orange-vibrant/10 overflow-hidden relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-vibrant rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cream rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatItem end={150} suffix="+" label="Enterprise Projects" />
                    <StatItem end={50} suffix="M+" prefix="$" label="Client Revenue Growth" />
                    <StatItem end={10} suffix="+" label="Years of Leadership" />
                </div>
            </div>
        </section>
    );
};

export default Stats;