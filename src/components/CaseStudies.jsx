import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ───────────────────────────────────────────────────────────────────────
const caseStudies = [
    {
        client: 'Mathfel',
        industry: 'B2B Tech — Video Door Intercom Systems',
        location: 'EU',
        title: 'ROAS Doubled to 600% on €69.7K Monthly Google Ads Spend',
        challenge: 'Mathfel specialises in high-quality video door intercom systems. They were running Google Shopping at 310% ROAS on ~€60K/month. The ceiling was margin erosion as spend scaled toward €70K. They needed a structure that could absorb the budget increase without compressing returns.',
        solution: ['Restructured Google Shopping feed with product-level margin segmentation', 'Implemented tiered bidding by margin and seasonal demand curves', 'Split campaigns by high-AOV vs. volume products to protect blended ROAS', 'Added Performance Max alongside Shopping for incremental reach'],
        results: [{ display: '600%', label: 'Peak ROAS', sub: 'Up from 310%' }, { display: '418K', label: 'Sales (EUR)', sub: 'Sep–Dec 2024' }, { display: '1.1K', label: 'Conversions', sub: 'Up from 623' }, { display: '114%', label: 'Conv. Value Increase', sub: 'Same budget' }],
        tags: ['Google Ads', 'Google Shopping', 'B2B', 'EU'],
        heroStat: '600%', heroLabel: 'ROAS',
        accent: '#FF570F', number: '01',
    },
    {
        client: 'PJ BOLD',
        industry: 'E-Commerce — Custom Silicone Molds',
        location: 'USA',
        title: '$38K Revenue on a $2,600 Budget: ROAS 1.83x to 14.54x',
        challenge: 'PJ BOLD sells custom silicone molds for gummies, candies, and chocolates. Google Ads were generating $4,830 in conversion value on $2,634 spend — a 1.83x ROAS. Profitable but stuck. Higher-margin SKUs were being treated identically to low-margin volume products.',
        solution: ['Complete campaign rebuild with SKU-level segmentation by margin and AOV', 'Keyword strategy shifted to high-intent transactional terms', 'Landing page alignment to highest-converting product categories', 'Budget reallocation from broad match to exact and phrase match winners'],
        results: [{ display: '14.54x', label: 'Final ROAS', sub: 'Up from 1.83x' }, { display: '$38K', label: 'Revenue Generated', sub: 'On $2,625 spend' }, { display: '7x', label: 'Sales Increase', sub: 'Same budget' }, { display: '62%', label: 'Impressions Growth', sub: '270K → 441K' }],
        tags: ['Google Ads', 'E-Commerce', 'ROAS Turnaround', 'USA'],
        heroStat: '14.54x', heroLabel: 'ROAS',
        accent: '#EE7D1D', number: '02',
    },
    {
        client: 'CPA MOMS',
        industry: 'Professional Services — National Tax Franchise',
        location: 'USA',
        title: '53% More Conversions, Cost Per Lead Cut in Half in 30 Days',
        challenge: 'CPA MOMS is a national franchise of specialist CPAs serving entrepreneurs. Google Ads were generating 15 conversions/month at $144.54 per conversion. With known LTV, they needed more volume and lower CPL — not just one or the other.',
        solution: ['Full keyword audit: removed low-intent terms bleeding budget', 'Restructured ad groups around franchise-specific service lines', 'Landing page rebuilds to match ad message and eliminate conversion friction', 'Added callout extensions and sitelinks for credibility and click-through'],
        results: [{ display: '53%', label: 'Conversion Increase', sub: '15 → 23/month' }, { display: '$71.42', label: 'Cost Per Conv.', sub: 'Down from $144.54' }, { display: '45%', label: 'Conv. Rate Lift', sub: '8.33% → 12.11%' }, { display: '56%', label: 'Brand Impressions', sub: '5.72K → 8.5K' }],
        tags: ['Google Ads', 'Lead Generation', 'Franchise', 'USA'],
        heroStat: '53%', heroLabel: 'More Conversions',
        accent: '#FDE87A', number: '03',
    },
    {
        client: 'UAE Home Appliances',
        industry: 'E-Commerce — Home Appliances',
        location: 'UAE',
        title: 'AED 47,950 in Sales on 7,500 AED/Month Meta Ads Budget',
        challenge: 'A UAE home appliances brand on Shopify was running Meta Ads without a funnel structure — all spend hitting cold audiences, conversion rate below 1%. They needed a full-funnel rebuild without increasing the monthly budget.',
        solution: ['Built awareness-to-conversion funnel: reach → engagement → purchase', 'Created lookalike audiences from Shopify purchase data', 'Launched dynamic product ads for abandoned cart recovery', 'Optimised creative by product category for UAE purchasing behaviour'],
        results: [{ display: 'AED 47.9K', label: 'Total Sales', sub: 'Shopify-tracked' }, { display: '572', label: 'Orders', sub: '1.32% conv. rate' }, { display: '4.86x', label: 'Purchase ROAS', sub: 'Return on ad spend' }, { display: '42,633', label: 'Sessions', sub: 'Driven to storefront' }],
        tags: ['Meta Ads', 'Shopify', 'E-Commerce', 'UAE'],
        heroStat: '4.86x', heroLabel: 'ROAS',
        accent: '#FF570F', number: '04',
    },
    {
        client: 'US Health Clinic',
        industry: 'Healthcare — Medical Services',
        location: 'USA',
        title: '15,594 Patient Conversions at $0.09 CPC Across the USA',
        challenge: 'A US healthcare provider offering multiple service lines needed cost-effective patient acquisition nationally. Competitors were pushing CPCs to $3–5. They needed high conversion volume without paying premium rates for generic medical keywords.',
        solution: ['Rebuilt keyword strategy around long-tail, high-intent health service queries', 'Created service-line specific ad groups with dedicated landing pages', 'Implemented call tracking integrated with appointment booking system', 'Layered bid adjustments for time-of-day and geo to match intent windows'],
        results: [{ display: '15,594', label: 'Conversions', sub: 'Patient contacts' }, { display: '$0.09', label: 'Average CPC', sub: 'vs $3–5 benchmark' }, { display: '4.58%', label: 'CTR', sub: '1.56M impressions' }, { display: '$6.3K', label: 'Total Ad Spend', sub: 'Exceptional efficiency' }],
        tags: ['Google Ads', 'Healthcare', 'Lead Generation', 'USA'],
        heroStat: '$0.09', heroLabel: 'CPC',
        accent: '#EE7D1D', number: '05',
    },
    {
        client: 'US Therapy Practice',
        industry: 'Mental Health — Counseling Services',
        location: 'USA',
        title: '517 Qualified Therapy Calls at $34.70 Per Call',
        challenge: 'A therapy and counseling provider needed phone calls from people actively seeking help — not generic health browsers. Standard lead gen was pulling low-intent clicks. Every wasted call slot had a real cost to a small practice.',
        solution: ['Call-only campaigns targeting crisis and immediate-need search queries', 'Custom call tracking with practice management system integration', 'Optimised phone impression share during highest-intent time windows', 'A/B tested ad copy focused on immediate availability and confidentiality'],
        results: [{ display: '517', label: 'Phone Calls', sub: 'High-intent seekers' }, { display: '$34.70', label: 'Cost Per Call', sub: '$17,943 total spend' }, { display: '3.23%', label: 'CTR', sub: '481K impressions' }, { display: '4,644', label: 'Limo Campaign Calls', sub: 'Parallel campaign' }],
        tags: ['Google Ads', 'Call Campaigns', 'Mental Health', 'USA'],
        heroStat: '517', heroLabel: 'Qualified Calls',
        accent: '#FDE87A', number: '06',
    }
];

// ─── Marquee Ticker ─────────────────────────────────────────────────────────────
const Ticker = () => {
    const items = ['600% ROAS', '$38K Revenue', '53% More Conversions', 'AED 47.9K Sales', '$0.09 CPC', '517 Therapy Calls', '14.54x ROAS', '15,594 Conversions', '$2.7M+ Amazon', '$683K Meta/mo'];
    const track = [...items, ...items];
    return (
        <div className="w-full overflow-hidden border-y border-[#FF570F]/20 py-3 mb-20 relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #0a0a0a, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg, #0a0a0a, transparent)' }} />
            <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'ticker 30s linear infinite' }}>
                {track.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-pure-white/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF570F] inline-block flex-shrink-0" />
                        {item}
                    </span>
                ))}
            </div>
            <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
    );
};

// ─── GSAP Counter ──────────────────────────────────────────────────────────────
const GSAPCounter = ({ display }) => {
    const valRef = useRef(null);
    useEffect(() => {
        const el = valRef.current;
        if (!el) return;
        const numMatch = display.replace(/[^0-9.]/g, '');
        const target = parseFloat(numMatch);
        if (isNaN(target)) { el.innerText = display; return; }
        const prefix = display.match(/^[^0-9]*/)?.[0] || '';
        const suffix = display.match(/[^0-9.]+$/)?.[0] || '';
        const isDecimal = display.includes('.');
        const decimals = isDecimal ? (display.split('.')[1]?.replace(/[^0-9]/g, '').length || 0) : 0;
        const obj = { val: 0 };
        const anim = gsap.to(obj, {
            val: target, duration: 2, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
                const v = isDecimal ? obj.val.toFixed(decimals) : Math.floor(obj.val);
                const formatted = parseFloat(v) >= 1000 ? parseFloat(v).toLocaleString() : v;
                el.innerText = `${prefix}${formatted}${suffix}`;
            },
            onComplete: () => { el.innerText = display; }
        });
        return () => anim.kill();
    }, [display]);
    return <span ref={valRef}>0</span>;
};

// ─── Case Study Card — World Class Redesign ────────────────────────────────────
const CaseStudyCard = ({ study, index }) => {
    const cardRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        gsap.fromTo(el,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            }
        );
    }, []);

    const isLight = study.accent === '#FDE87A';

    return (
        <div ref={cardRef} className="opacity-0 group relative" style={{ opacity: 0 }}>
            {/* Outer glow on hover */}
            <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${study.accent}30, transparent 60%)` }} />

            <div className="relative rounded-3xl overflow-hidden border border-white/5 group-hover:border-white/10 transition-all duration-500"
                style={{ background: 'linear-gradient(145deg, #111418 0%, #0a0c0e 100%)' }}>

                {/* ── GIANT NUMBER WATERMARK ── */}
                <div className="absolute top-0 right-0 text-[200px] font-black leading-none select-none pointer-events-none z-0 translate-x-8 -translate-y-4"
                    style={{ color: `${study.accent}06`, fontVariantNumeric: 'tabular-nums' }}>
                    {study.number}
                </div>

                {/* ── TOP STRIP — accent bar ── */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${study.accent}, transparent)` }} />

                <div className="relative z-10 p-8 lg:p-12">

                    {/* ── ROW 1: Meta info + Hero Stat ── */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
                        <div className="flex-1">
                            {/* Client badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border"
                                    style={{ color: study.accent, borderColor: `${study.accent}40`, background: `${study.accent}10` }}>
                                    {study.location}
                                </span>
                                <span className="text-white/20 text-xs">—</span>
                                <span className="text-white/40 text-xs uppercase tracking-widest font-bold">{study.client}</span>
                            </div>

                            {/* Industry */}
                            <p className="text-white/30 text-xs uppercase tracking-[0.15em] font-semibold mb-3">{study.industry}</p>

                            {/* Title */}
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight max-w-xl">
                                {study.title}
                            </h3>
                        </div>

                        {/* Hero Stat — the money shot */}
                        <div className="flex-shrink-0 text-right lg:text-right">
                            <div className="inline-block relative">
                                <div className="absolute inset-0 blur-3xl opacity-30 rounded-full"
                                    style={{ background: study.accent }} />
                                <div className="relative text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter"
                                    style={{ color: study.accent }}>
                                    <GSAPCounter display={study.heroStat} />
                                </div>
                                <div className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1 text-right">
                                    {study.heroLabel}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="h-px w-full mb-8" style={{ background: `linear-gradient(90deg, ${study.accent}30, transparent)` }} />

                    {/* ── ROW 2: Results Grid ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {study.results.map((r, i) => (
                            <div key={i} className="relative group/stat rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at 50% 0%, ${study.accent}15, transparent 70%)` }} />
                                <div className="relative z-10">
                                    <div className="text-2xl md:text-3xl font-black mb-1 tabular-nums"
                                        style={{ color: study.accent }}>
                                        <GSAPCounter display={r.display} />
                                    </div>
                                    <div className="text-white/70 text-xs font-bold uppercase tracking-wider mb-0.5">{r.label}</div>
                                    <div className="text-white/30 text-[10px]">{r.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── ROW 3: Expandable Detail ── */}
                    <div>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 group/btn"
                            style={{ color: study.accent }}>
                            <span>{expanded ? 'Hide Details' : 'View Challenge & Solution'}</span>
                            <svg className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Expandable panel */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                {/* Challenge */}
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: study.accent }}>
                                        The Challenge
                                    </p>
                                    <p className="text-white/60 text-sm leading-relaxed">{study.challenge}</p>
                                </div>
                                {/* Solution */}
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: study.accent }}>
                                        What We Did
                                    </p>
                                    <ul className="space-y-2.5">
                                        {study.solution.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: study.accent }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── ROW 4: Footer ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-white/5">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {study.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 text-[10px] font-bold rounded-full text-white/40 border border-white/10 uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <a href="https://calendly.com/digi-dreamworks/onboarding-call"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-full group/cta flex-shrink-0"
                            style={{
                                background: `${study.accent}15`,
                                color: study.accent,
                                border: `1px solid ${study.accent}30`
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = study.accent;
                                e.currentTarget.style.color = isLight ? '#0a0a0a' : '#0a0a0a';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = `${study.accent}15`;
                                e.currentTarget.style.color = study.accent;
                            }}>
                            Get This Result
                            <svg className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Section Header ─────────────────────────────────────────────────────────────
const SectionHeader = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.hdr-el',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true }
                }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-12">
            <div className="hdr-el opacity-0 inline-block mb-6">
                <span className="px-6 py-2.5 border border-[#FF570F]/30 text-[#FF570F] text-xs font-black uppercase tracking-[0.25em] rounded-full bg-[#FF570F]/08 backdrop-blur-sm">
                    <span className="inline-block w-1.5 h-1.5 bg-[#FF570F] rounded-full mr-2 animate-pulse" />
                    Verified Results
                </span>
            </div>

            <h2 className="hdr-el opacity-0 text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4 leading-[1.05]">
                <span className="text-white">Case Studies</span>
                <br />
                <span style={{ background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    You Can Verify
                </span>
            </h2>

            <p className="hdr-el opacity-0 text-white/40 text-base md:text-lg leading-relaxed">
                Platform dashboards. Real clients. Numbers you can check.
            </p>
        </div>
    );
};

// ─── Summary Stats Bar ──────────────────────────────────────────────────────────
const SummaryBar = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.stat-bar-item',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
                  scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true }
                }
            );
        }, ref);
        return () => ctx.revert();
    }, []);

    const summaryStats = [
        { value: '6', label: 'Case Studies' },
        { value: '$683K+', label: 'Meta/Month' },
        { value: '600%', label: 'Peak ROAS' },
        { value: '$2.7M+', label: 'Amazon Sales' },
    ];

    return (
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {summaryStats.map((s, i) => (
                <div key={i} className="stat-bar-item opacity-0 text-center py-5 px-4 rounded-2xl border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-2xl md:text-3xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{s.label}</div>
                </div>
            ))}
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const CaseStudies = () => {
    const sectionRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8,
                  scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', once: true }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="case-studies" className="relative pt-28 pb-24 overflow-hidden bg-[#0a0c0e]">

            {/* Background atmosphere */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.04] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF570F 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.03] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FDE87A 0%, transparent 70%)' }} />

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ backgroundImage: 'radial-gradient(rgba(255,87,15,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative max-w-6xl mx-auto px-6 z-10">
                <SectionHeader />
                <Ticker />
                <SummaryBar />

                <div className="space-y-8">
                    {caseStudies.map((study, index) => (
                        <CaseStudyCard key={index} study={study} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div ref={ctaRef} className="opacity-0 mt-24 text-center">
                    <p className="text-white/20 text-xs uppercase tracking-[0.3em] font-bold mb-8">
                        Ready to be the next case study?
                    </p>
                    <a href="https://calendly.com/digi-dreamworks/onboarding-call"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-[#FF570F] text-black font-black text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-[#FDE87A] hover:scale-105 shadow-2xl shadow-[#FF570F]/30 group">
                        Book a Strategy Call
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                    <p className="text-white/20 text-xs mt-4">Response within 24 hours. No pitch. No fluff.</p>
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;