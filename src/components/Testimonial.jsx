// src/components/Testimonial.jsx
// Verified client results section — replaces placeholder testimonials
// Real numbers from real engagements. Update when written testimonials are collected.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Verified results from real retainer engagements ──────────────────────────
const results = [
    { value: '600%', label: 'ROAS', context: 'Google Ads', client: 'EU video intercom brand', accent: '#FF570F' },
    { value: '14.54x', label: 'ROAS', context: 'Google Ads', client: 'US silicone molds brand', accent: '#EE7D1D' },
    { value: '15,594', label: 'Conversions', context: '$0.09 CPC', client: 'US multi-location health clinic', accent: '#FF570F' },
    { value: '+53%', label: 'More Conversions', context: 'CPC cut 51%', client: 'US tax franchise', accent: '#EE7D1D' },
    { value: '€418K', label: 'Revenue Generated', context: '€69.7K spend', client: 'EU e-commerce brand', accent: '#FDE87A' },
    { value: '4.86x', label: 'ROAS', context: 'Meta Ads + Shopify', client: 'UAE home appliances retailer', accent: '#FF570F' },
];

// ─── Result stat card ─────────────────────────────────────────────────────────
const ResultStat = ({ item, index }) => (
    <div
        className="result-stat relative bg-gradient-to-br from-[#111518] to-[#0a0d0f] rounded-2xl p-7 border border-white/5 hover:border-orange-vibrant/30 transition-all duration-500 group overflow-hidden"
        style={{ opacity: 0, transform: 'translateY(30px)' }}
    >
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.04] rounded-2xl"
            style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        {/* corner glow */}
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: item.accent + '40' }} />

        <div className="relative z-10">
            <div className="text-4xl font-black mb-1 leading-none" style={{ color: item.accent }}>
                {item.value}
            </div>
            <div className="text-pure-white font-semibold text-sm uppercase tracking-widest mb-3">
                {item.label}
            </div>
            <div className="w-8 h-px mb-3" style={{ background: item.accent + '60' }} />
            <div className="text-text-muted text-xs">{item.context}</div>
            <div className="text-pure-white/40 text-xs mt-1">{item.client}</div>
        </div>
    </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const Testimonial = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Animate heading
        gsap.fromTo(headingRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true }
            }
        );

        // Stagger cards
        const cards = section.querySelectorAll('.result-stat');
        gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: section.querySelector('.results-grid'), start: 'top 80%', once: true }
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-28 bg-deep-black overflow-hidden">
            {/* background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-orange-vibrant/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* heading */}
                <div ref={headingRef} className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-vibrant/20 bg-orange-vibrant/5 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-xs font-semibold text-orange-vibrant uppercase tracking-widest">Verified Client Results</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-4">
                        Six retainers.{' '}
                        <span className="text-orange-vibrant">Six data sets.</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl">
                        Every number below is from a live retainer engagement. Verified ad account data, no estimates, no projections.
                    </p>
                </div>

                {/* results grid */}
                <div className="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                    {results.map((item, i) => (
                        <ResultStat key={i} item={item} index={i} />
                    ))}
                </div>

                {/* bottom strip */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-white/5 bg-[#0a0d0f]">
                    <div>
                        <p className="text-pure-white font-semibold text-base">
                            All results are from active retainer clients.
                        </p>
                        <p className="text-text-muted text-sm mt-1">
                            We build the systems, run the accounts, and stay accountable to the numbers — month over month.
                        </p>
                    </div>
                    <a
                        href="https://calendly.com/digi-dreamworks/onboarding-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-8 py-3.5 bg-orange-vibrant text-deep-black font-bold text-sm rounded-xl hover:bg-orange-soft transition-colors duration-300 whitespace-nowrap"
                    >
                        BOOK A 20-MIN CALL &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
