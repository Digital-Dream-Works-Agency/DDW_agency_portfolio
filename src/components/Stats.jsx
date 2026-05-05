// src/components/Stats.jsx
// Real DDW performance numbers from live ad accounts and client dashboards
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    {
        end: 683,
        format: (v) => `$${Math.floor(v)}K+`,
        label: 'Monthly Meta Spend Managed',
        sublabel: '343 campaigns · 76M impressions · 5.48x avg ROAS. EU fashion & golf brand.',
    },
    {
        end: 27,
        format: (v) => `$${(v / 10).toFixed(1)}M+`,
        label: 'Amazon Sales Managed',
        sublabel: '129,800 orders · 27.64% ACOS · Full seller central operations since 2015.',
    },
    {
        end: 600,
        format: (v) => `${Math.floor(v)}%`,
        label: 'Peak Google Ads ROAS',
        sublabel: '€418K revenue on €69.7K spend. EU video door intercom brand.',
    },
    {
        end: 54,
        format: (v) => `${Math.floor(v)}K`,
        label: 'Monthly SEO Visitors',
        sublabel: 'From 2K to 54K. 251K clicks · 10.3M impressions. E-commerce SEO retainer.',
    },
];

const StatItem = ({ stat }) => {
    const countRef = useRef(null);

    useEffect(() => {
        if (!countRef.current) return;
        const obj = { value: 0 };
        const anim = gsap.to(obj, {
            value: stat.end,
            duration: 2.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: countRef.current, start: 'top 85%', once: true },
            onUpdate: () => {
                if (countRef.current) {
                    countRef.current.innerText = stat.format(obj.value);
                }
            },
        });
        return () => anim.kill();
    }, [stat]);

    return (
        <div className="stat-item group text-center p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#111416] to-[#0a0d0f] border border-orange-vibrant/10 hover:border-orange-vibrant/25 transition-all duration-500">
            <div
                ref={countRef}
                className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent mb-3 tabular-nums"
            >
                {stat.format(0)}
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-vibrant to-transparent mx-auto mb-3" />
            <div className="text-pure-white text-sm font-bold uppercase tracking-[0.12em] mb-2 group-hover:text-orange-vibrant transition-colors duration-300">
                {stat.label}
            </div>
            <div className="text-text-muted text-xs leading-relaxed max-w-[200px] mx-auto">
                {stat.sublabel}
            </div>
        </div>
    );
};

const Stats = () => {
    const statsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.stat-item', {
                y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
            });
        }, statsRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={statsRef} className="py-20 bg-deep-black border-y border-orange-vibrant/10 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-orange-vibrant/5 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cream/3 rounded-full blur-3xl -translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                    <p className="text-text-muted text-xs uppercase tracking-[0.25em] font-bold">
                        Real numbers · live accounts · dashboard screenshots available
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {stats.map((stat, i) => <StatItem key={i} stat={stat} />)}
                </div>
            </div>
        </section>
    );
};

export default Stats;
