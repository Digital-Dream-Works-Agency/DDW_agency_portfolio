import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Data (New Content with Custom SVGs) ───────────────────────────────────────
const caseStudies = [
    {
        client: 'Mathfel',
        industry: 'B2B Tech — Video Door Intercom Systems',
        location: 'EU',
        title: 'ROAS Doubled to 600% on €69.7K Monthly Google Ads Spend',
        challenge: 'Mathfel specialises in high-quality video door intercom systems. They were running Google Shopping at 310% ROAS on ~€60K/month. The ceiling was margin erosion as spend scaled toward €70K. They needed a structure that could absorb the budget increase without compressing returns.',
        solution: ['Restructured Google Shopping feed with product-level margin segmentation', 'Implemented tiered bidding by margin and seasonal demand curves', 'Split campaigns by high-AOV vs. volume products to protect blended ROAS', 'Added Performance Max alongside Shopping for incremental reach'],
        results: [{ display: '600%', label: 'Peak ROAS', sub: 'Up from 310% before engagement' }, { display: '418K', label: 'Sales (EUR)', sub: 'Sep–Dec 2024, 4-month window' }, { display: '1.1K', label: 'Conversions', sub: 'Up from 623 in prior period' }, { display: '114%', label: 'Conv. Value Increase', sub: 'Same budget, significantly more return' }],
        tags: ['Google Ads', 'Google Shopping', 'B2B', 'EU'],
        accent: '#FF570F', number: '01',
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
    },
    {
        client: 'PJ BOLD',
        industry: 'E-Commerce — Custom Silicone Molds',
        location: 'USA',
        title: '$38K Revenue on a $2,600 Budget: ROAS 1.83x to 14.54x',
        challenge: 'PJ BOLD sells custom silicone molds for gummies, candies, and chocolates. Google Ads were generating $4,830 in conversion value on $2,634 spend — a 1.83x ROAS. Profitable but stuck. Higher-margin SKUs were being treated identically to low-margin volume products in the campaign structure.',
        solution: ['Complete campaign rebuild with SKU-level segmentation by margin and AOV', 'Keyword strategy shifted to high-intent transactional terms', 'Landing page alignment to highest-converting product categories', 'Budget reallocation from broad match to exact and phrase match winners'],
        results: [{ display: '14.54x', label: 'Final ROAS', sub: 'Up from 1.83x at start' }, { display: '$38K', label: 'Revenue Generated', sub: 'On $2,625 ad spend' }, { display: '7x', label: 'Sales Increase', sub: 'Same budget, 7x more revenue' }, { display: '62%', label: 'Impressions Growth', sub: '270K to 441K impressions' }],
        tags: ['Google Ads', 'E-Commerce', 'ROAS Turnaround', 'USA'],
        accent: '#EE7D1D', number: '02',
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
    },
    {
        client: 'CPA MOMS',
        industry: 'Professional Services — National Tax Franchise',
        location: 'USA',
        title: '53% More Conversions, Cost Per Lead Cut in Half in 30 Days',
        challenge: 'CPA MOMS is a national franchise of specialist CPAs serving entrepreneurs. Google Ads were generating 15 conversions/month at $144.54 per conversion. With known LTV, they needed more volume and lower CPL — not just one or the other.',
        solution: ['Full keyword audit: removed low-intent terms bleeding budget', 'Restructured ad groups around franchise-specific service lines', 'Landing page rebuilds to match ad message and eliminate conversion friction', 'Added callout extensions and sitelinks for credibility and click-through'],
        results: [{ display: '53%', label: 'Conversion Increase', sub: '15 to 23 conversions/month' }, { display: '$71.42', label: 'Cost Per Conversion', sub: 'Down from $144.54 — 50% drop' }, { display: '45%', label: 'Conv. Rate Improvement', sub: '8.33% to 12.11%' }, { display: '56%', label: 'Brand Impression Growth', sub: '5.72K to 8.5K impressions' }],
        tags: ['Google Ads', 'Lead Generation', 'Franchise', 'USA'],
        accent: '#FDE87A', number: '03',
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
        client: 'UAE Home Appliances Brand',
        industry: 'E-Commerce — Home Appliances',
        location: 'UAE',
        title: 'AED 47,950 in Sales on 7,500 AED/Month Meta Ads Budget',
        challenge: 'A UAE home appliances brand on Shopify was running Meta Ads without a funnel structure — all spend hitting cold audiences, conversion rate below 1%. They needed a full-funnel rebuild without increasing the monthly budget.',
        solution: ['Built awareness-to-conversion funnel: reach then engagement then purchase campaigns', 'Created lookalike audiences from Shopify purchase data', 'Launched dynamic product ads for abandoned cart recovery', 'Optimised creative by product category for UAE purchasing behaviour'],
        results: [{ display: 'AED 47.9K', label: 'Total Sales', sub: 'Shopify-tracked revenue' }, { display: '572', label: 'Orders', sub: '1.32% conversion rate' }, { display: '4.86x', label: 'Purchase ROAS', sub: 'Return on ad spend' }, { display: '42,633', label: 'Sessions', sub: 'Driven to storefront' }],
        tags: ['Meta Ads', 'Shopify', 'E-Commerce', 'UAE'],
        accent: '#FF570F', number: '04',
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 2.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
    },
    {
        client: 'US Health Clinic',
        industry: 'Healthcare — Medical Services',
        location: 'USA',
        title: '15,594 Patient Conversions at $0.09 CPC Across the USA',
        challenge: 'A US healthcare provider offering multiple service lines needed cost-effective patient acquisition nationally. Competitors were pushing CPCs to $3–5. They needed high conversion volume without paying premium rates for generic medical keywords.',
        solution: ['Rebuilt keyword strategy around long-tail, high-intent health service queries', 'Created service-line specific ad groups with dedicated landing pages', 'Implemented call tracking integrated with their appointment booking system', 'Layered bid adjustments for time-of-day and geo to match intent windows'],
        results: [{ display: '15,594', label: 'Conversions', sub: 'Patient contacts and bookings' }, { display: '$0.09', label: 'Average CPC', sub: 'vs. $3–5+ industry benchmark' }, { display: '4.58%', label: 'CTR', sub: '1.56M impressions, 71,784 clicks' }, { display: '$6.3K', label: 'Total Ad Spend', sub: 'Exceptional acquisition efficiency' }],
        tags: ['Google Ads', 'Healthcare', 'Lead Generation', 'USA'],
        accent: '#EE7D1D', number: '05',
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
    },
    {
        client: 'US Therapy Practice',
        industry: 'Mental Health — Counseling Services',
        location: 'USA',
        title: '517 Qualified Therapy Calls at $34.70 Per Call',
        challenge: 'A therapy and counseling provider needed phone calls from people actively seeking help — not generic health browsers. Standard lead gen was pulling low-intent clicks. Every wasted call slot had a real cost to a small practice.',
        solution: ['Call-only campaigns targeting crisis and immediate-need search queries', 'Custom call tracking with practice management system integration', 'Optimised phone impression share during highest-intent time windows', 'A/B tested ad copy focused on immediate availability and confidentiality'],
        results: [{ display: '517', label: 'Phone Calls', sub: 'High-intent therapy seekers' }, { display: '$34.70', label: 'Cost Per Call', sub: 'Total spend $17,943 for 517 calls' }, { display: '3.23%', label: 'CTR', sub: '481K impressions, 15,556 clicks' }, { display: '4,644', label: 'Calls — Limo Campaign', sub: 'Parallel luxury transport campaign' }],
        tags: ['Google Ads', 'Call Campaigns', 'Mental Health', 'USA'],
        accent: '#FDE87A', number: '06',
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
    }
];

// ─── Native GSAP Tilt Component ────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);

    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;

        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            xTo(x * 4); 
            yTo(-y * 4); 
        };

        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Magnetic Hook ─────────────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: 'power2.out' });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: 'power2.out' });

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

// ─── CTA Button ────────────────────────────────────────────────────────────────
const MagneticCTA = ({ href, children, variant = 'primary' }) => {
    const ref = useRef(null);
    useMagneticEffect(ref, 0.25);
    const styles = { primary: 'bg-orange-vibrant text-deep-black hover:bg-cream', secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black' };

    return (
        <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={`relative group inline-flex items-center gap-2 px-7 py-3.5 font-bold text-xs uppercase tracking-widest transition-all duration-300 overflow-hidden shadow-lg ${styles[variant]}`}>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative z-10 flex items-center gap-2">
                {children} <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
            </span>
        </a>
    );
};

// ─── GSAP Optimized Counter ────────────────────────────────────────────────────
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
            val: target, 
            duration: 2.5, 
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true
            },
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

// ─── Result Card ──────────────────────────────────────────────────────────────
const ResultCard = ({ result, accent }) => (
    <div className="result-card opacity-0 relative group bg-deep-black/60 border border-white/5 rounded-2xl p-5 text-center hover:border-orange-vibrant/40 transition-all duration-500 overflow-hidden" style={{ visibility: 'hidden' }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-2xl" style={{ background: `radial-gradient(circle at center, ${accent}15, transparent 70%)` }} />
        <div className="text-3xl md:text-4xl font-black mb-1 relative z-10" style={{ color: accent }}>
            <GSAPCounter display={result.display} />
        </div>
        <div className="text-sm font-bold text-pure-white mt-2 relative z-10">{result.label}</div>
        <div className="text-xs text-pure-white/40 mt-1 relative z-10">{result.sub}</div>
    </div>
);

// ─── Case Study Card ──────────────────────────────────────────────────────────
const CaseStudyCard = ({ study, index }) => {
    const cardRef = useRef(null);
    const isEven = index % 2 === 0;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top 85%',
                    once: true
                }
            });

            tl.to(cardRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
              .to('.solution-item', { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4")
              .to('.result-card', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");
        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative">
            <GSAPTilt className="w-full">
                <div ref={cardRef} className="opacity-0 translate-y-12 relative rounded-3xl overflow-hidden border border-white/5 hover:border-orange-vibrant/30 transition-all duration-700 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,87,15,0.03) 0%, rgba(10,10,10,0.95) 100%)', visibility: 'hidden' }}>
                    
                    <div className="absolute top-6 right-8 text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none z-0" style={{ color: `${study.accent}08` }}>
                        {study.number}
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${!isEven ? 'lg:[direction:rtl]' : ''}`}>
                        
                        {/* ── LEFT: Content ── */}
                        <div className={`relative z-10 p-8 lg:p-12 space-y-6 ${!isEven ? 'lg:[direction:ltr]' : ''}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-orange-vibrant">{study.icon}</span>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-pure-white">{study.client}</div>
                                    <div className="text-xs uppercase tracking-widest" style={{ color: study.accent }}>{study.industry}</div>
                                </div>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-pure-white leading-tight">{study.title}</h3>
                            <div className="h-px w-16" style={{ background: study.accent }} />
                            
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: study.accent }}>Challenge</p>
                                <p className="text-pure-white/70 text-sm leading-relaxed">{study.challenge}</p>
                            </div>
                            
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: study.accent }}>Solution</p>
                                <ul className="space-y-2">
                                    {study.solution.map((item, i) => (
                                        <li key={i} className="solution-item opacity-0 -translate-x-5 flex items-start gap-3 text-sm text-pure-white/70" style={{ visibility: 'hidden' }}>
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: study.accent }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-2">
                                {study.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 text-xs font-bold rounded-full border" style={{ color: study.accent, borderColor: `${study.accent}40`, background: `${study.accent}10` }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="pt-2">
                                <MagneticCTA href="https://calendly.com/digi-dreamworks/onboarding-call" variant="primary">Request Full Breakdown</MagneticCTA>
                            </div>
                        </div>

                        {/* ── RIGHT: Results ── */}
                        <div className={`relative z-10 p-8 lg:p-12 flex flex-col justify-center ${!isEven ? 'lg:[direction:ltr]' : ''}`} style={{ borderLeft: isEven ? `1px solid ${study.accent}15` : 'none', borderRight: !isEven ? `1px solid ${study.accent}15` : 'none' }}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: study.accent }}>Results</p>
                            <div className="grid grid-cols-2 gap-4">
                                {study.results.map((result, i) => (
                                    <ResultCard key={i} result={result} accent={study.accent} />
                                ))}
                            </div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none" style={{ background: study.accent }} />
                        </div>

                    </div>
                </div>
            </GSAPTilt>
        </div>
    );
};

// ─── Robust Section Header ───────────────────────────────────
const SectionHeader = () => {
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.header-elem', {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: 'top 85%'
                }
            });
        }, headerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20 relative z-20">
            <div className="header-elem opacity-0 translate-y-5 inline-block mb-6" style={{ visibility: 'hidden' }}>
                <span className="px-6 py-2.5 border-2 border-orange-vibrant/30 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full bg-orange-vibrant/10 backdrop-blur-sm shadow-lg shadow-orange-vibrant/10">
                    <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" /> Verified Results
                </span>
            </div>

            <h2 className="header-elem text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-6 text-pure-white leading-tight">
                Case Studies <br />
                <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">You Can Verify</span>
            </h2>

            <p className="header-elem opacity-0 translate-y-5 text-lg text-pure-white/60 leading-relaxed" style={{ visibility: 'hidden' }}>
                Platform dashboards. Real clients. Numbers you can check.
            </p>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CaseStudies = () => {
    const sectionRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(prlx1Ref.current, { yPercent: -30, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlx2Ref.current, { yPercent: -20, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            
            gsap.to(ctaRef.current, {
                y: 0, opacity: 1, duration: 0.8,
                scrollTrigger: { trigger: ctaRef.current, start: "top 90%", once: true }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="case-studies" className="relative pt-32 pb-24 overflow-hidden bg-deep-black">
            
            <div ref={prlx1Ref} className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,87,15,0.08) 0%, transparent 70%)' }} />
            <div ref={prlx2Ref} className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(253,232,122,0.06) 0%, transparent 70%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,87,15,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="relative max-w-7xl mx-auto px-6 z-10">
                <SectionHeader />

                <div className="space-y-16">
                    {caseStudies.map((study, index) => (
                        <CaseStudyCard key={index} study={study} index={index} />
                    ))}
                </div>

                <div ref={ctaRef} className="opacity-0 translate-y-8 mt-24 text-center" style={{ visibility: 'hidden' }}>
                    <p className="text-pure-white/40 text-sm uppercase tracking-widest mb-6">Ready to be the next case study?</p>
                    <MagneticCTA href="https://calendly.com/digi-dreamworks/onboarding-call" variant="primary">Book a Strategy Call</MagneticCTA>
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;