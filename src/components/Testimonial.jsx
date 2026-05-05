// src/components/Testimonial.jsx
// Verified channel wins — all numbers from live DDW retainer accounts
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Verified results across all DDW channels ─────────────────────────────────
const results = [
    {
        value: '$683K',
        label: 'Monthly Meta Spend',
        context: '343 campaigns · 5.48x avg ROAS',
        client: 'EU fashion & golf brand — 12+ month retainer',
        accent: '#FF570F',
        channel: 'Meta Ads',
    },
    {
        value: '$2.7M+',
        label: 'Amazon Sales Managed',
        context: '27.64% ACOS · 129,800 orders',
        client: 'US Amazon brand — managed since 2015',
        accent: '#EE7D1D',
        channel: 'Amazon',
    },
    {
        value: '600%',
        label: 'Google Ads ROAS',
        context: '€418K revenue on €69.7K spend',
        client: 'EU video door intercom brand',
        accent: '#FF570F',
        channel: 'Google Ads',
    },
    {
        value: '$290K',
        label: '7-Day TikTok GMV',
        context: '9,010 orders · +121% order growth',
        client: 'E-commerce brand — full shop setup & affiliate management',
        accent: '#EE7D1D',
        channel: 'TikTok Shop',
    },
    {
        value: '54K',
        label: 'Monthly SEO Visitors',
        context: 'From 2K to 54K — 251K total clicks',
        client: 'Syncwire e-commerce — full SEO retainer',
        accent: '#FDE87A',
        channel: 'SEO',
    },
    {
        value: '978+',
        label: 'AI Calls Handled',
        context: '24/7 · Books appointments · Qualifies leads',
        client: "Lyra — DDW's own AI voice receptionist SaaS",
        accent: '#FF570F',
        channel: 'AI SaaS',
    },
];

const ResultStat = ({ item }) => (
    <div
        className="result-stat relative bg-gradient-to-br from-[#111518] to-[#0a0d0f] rounded-2xl p-7 border border-white/5 hover:border-orange-vibrant/30 transition-all duration-500 group overflow-hidden"
        style={{ opacity: 0, transform: 'translateY(30px)' }}
    >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] rounded-2xl"
            style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        {/* Corner glow */}
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: item.accent + '40' }} />

        <div className="relative z-10">
            {/* Channel tag */}
            <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider"
                style={{ borderColor: item.accent + '40', color: item.accent, background: item.accent + '12' }}>
                <div className="w-1 h-1 rounded-full" style={{ background: item.accent }} />
                {item.channel}
            </div>
            <div className="text-4xl font-black mb-1 leading-none" style={{ color: item.accent }}>
                {item.value}
            </div>
            <div className="text-pure-white font-semibold text-sm uppercase tracking-widest mb-3">
                {item.label}
            </div>
            <div className="w-8 h-px mb-3" style={{ background: item.accent + '60' }} />
            <div className="text-text-muted text-xs leading-relaxed">{item.context}</div>
            <div className="text-pure-white/40 text-xs mt-1">{item.client}</div>
        </div>
    </div>
);

const Testimonial = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.fromTo(headingRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true }
            }
        );

        const cards = section.querySelectorAll('.result-stat');
        gsap.to(cards, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: section.querySelector('.results-grid'), start: 'top 80%', once: true }
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-28 bg-deep-black overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-orange-vibrant/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div ref={headingRef} className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-vibrant/20 bg-orange-vibrant/5 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-xs font-semibold text-orange-vibrant uppercase tracking-widest">Verified Results — Six Channels</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-4">
                        Six channels.{' '}
                        <span className="text-orange-vibrant">All proven.</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl">
                        Every number is from a live account. We manage Meta, Google, Amazon, TikTok, SEO, and our own AI software — one team, all on retainer.
                    </p>
                </div>

                <div className="results-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                    {results.map((item, i) => <ResultStat key={i} item={item} />)}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-white/5 bg-[#0a0d0f]">
                    <div>
                        <p className="text-pure-white font-semibold text-base">
                            All results are from active retainer clients.
                        </p>
                        <p className="text-text-muted text-sm mt-1">
                            Dashboard screenshots available. US + EU accounts. Florida LLC with offices in Florida and Rome.
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
