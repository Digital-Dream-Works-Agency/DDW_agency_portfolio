// src/components/Stats.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Authority (#19): only verifiable, defensible numbers from the DDW brief.
//   7   — Core retainer service areas (confirmed in brief + ServicesGrid)
//   100% — Retainer-only model (the core differentiation promise)
//   2   — Global markets: US + EU (confirmed in Hero + brand badge)
// TODO Usama: replace stat #3 with a real client performance metric once confirmed.

const StatItem = ({ end, suffix, prefix = '', label, sublabel }) => {
    const countRef = useRef(null);

    useEffect(() => {
        if (!countRef.current) return;
        const obj = { value: 0 };
        const anim = gsap.to(obj, {
            value: end,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: countRef.current, start: 'top 85%', once: true },
            onUpdate: () => {
                if (countRef.current) {
                    countRef.current.innerText = prefix + Math.floor(obj.value) + suffix;
                }
            },
        });
        return () => anim.kill();
    }, [end, suffix, prefix]);

    return (
        <div className="stat-item group text-center p-10 rounded-2xl bg-gradient-to-br from-[#111416] to-[#0a0d0f] border border-orange-vibrant/10 hover:border-orange-vibrant/25 transition-all duration-500">
            <div
                ref={countRef}
                className="text-6xl md:text-7xl font-black bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent mb-3 tabular-nums"
            >
                {prefix}0{suffix}
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-vibrant to-transparent mx-auto mb-3" />
            <div className="text-pure-white text-sm font-bold uppercase tracking-[0.15em] mb-1.5 group-hover:text-orange-vibrant transition-colors duration-300">
                {label}
            </div>
            {sublabel && (
                <div className="text-text-muted text-xs leading-relaxed max-w-[180px] mx-auto">
                    {sublabel}
                </div>
            )}
        </div>
    );
};

const Stats = () => {
    const statsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.stat-item', {
                y: 50, opacity: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out',
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

            <div className="relative z-10 max-w-[1440px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatItem
                        end={7}
                        suffix=""
                        label="Core retainer services"
                        sublabel="All maintained by the same team that built them."
                    />
                    <StatItem
                        end={100}
                        suffix="%"
                        label="Retainer-only engagements"
                        sublabel="No one-off projects. Accountability built into the model."
                    />
                    <StatItem
                        end={2}
                        suffix=""
                        label="Global markets"
                        sublabel="US and EU clients. Florida and Rome."
                    />
                </div>
            </div>
        </section>
    );
};

export default Stats;
