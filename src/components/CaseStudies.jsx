import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Data (Emojis Replaced with High-End SVGs) ────────────────────────────────
const caseStudies = [
    { 
        client: 'Italian Fashion E-Commerce', industry: 'E-Commerce • Italy/EU', title: '€69.7K Ad Spend Generated 418K Purchases at 600% ROAS', challenge: 'Italian fashion retailer spending €20K/month on Google Shopping with inconsistent 180-250% ROAS. Needed to scale profitably to €70K/month without margin erosion.', solution: ['Restructured entire Google Shopping feed with Italian-optimized product titles', 'Implemented tiered bidding strategy by product margin and seasonality', 'Created separate campaigns for high-AOV vs. volume products', 'Integrated with existing Italian e-commerce platform (custom API)'], results: [{ metric: 418000, display: '418K', label: 'Purchases (4 months)', suffix: '' }, { metric: 600, display: '600%', label: 'Peak ROAS', suffix: '%' }, { metric: 69.7, display: '€69.7K', label: 'Monthly Spend', suffix: '' }, { metric: 1100, display: '1.1K', label: 'Daily Conversions', suffix: '' }], tags: ['Google Ads', 'E-Commerce', 'Italy'], accent: '#FF570F', number: '01', 
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> 
    },
    { 
        client: 'US Healthcare Clinic', industry: 'Healthcare • USA', title: '15,594 Patient Appointments Booked at $0.09 CPC', challenge: 'Medical clinic in competitive US market struggling with $3+ CPC on Google Ads. Needed cost-effective patient acquisition across 12 states.', solution: ['Built location-specific landing pages for each service line', 'Implemented appointment booking integration with Google Ads tracking', 'Optimized for "near me" searches with geo-targeted bid adjustments', 'Created remarketing campaigns for incomplete bookings'], results: [{ metric: 15594, display: '15,594', label: 'Conversions', suffix: '' }, { metric: 0.09, display: '$0.09', label: 'Average CPC', suffix: '' }, { metric: 4.58, display: '4.58%', label: 'CTR', suffix: '%' }, { metric: 6.3, display: '$6.3K', label: 'Total Spend', suffix: '' }], tags: ['Google Ads', 'Healthcare', 'USA'], accent: '#FDE87A', number: '02', 
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0V5a2 2 0 012-2h-2m0 10h5m-9 0h4m-8 8V9c0-1.1.9-2 2-2h14a2 2 0 012 2v12H2z" /></svg> 
    },
    { 
        client: 'European E-Commerce', industry: 'E-Commerce • EU', title: '317 Purchases via Meta Ads at €11.52 Cost Per Sale', challenge: 'Multi-country EU e-commerce store struggling with Meta Ads profitability. High cart abandonment, low ROAS across 5 markets.', solution: ['Built retargeting campaigns with dynamic product ads in 5 languages', 'Created lookalike audiences based on high-LTV customer segments', 'Implemented abandoned cart recovery via Meta Messenger', 'Optimized creative testing framework (10+ variants per product)'], results: [{ metric: 317, display: '317', label: 'Purchases', suffix: '' }, { metric: 11.52, display: '€11.52', label: 'Cost/Purchase', suffix: '' }, { metric: 6190, display: '6,190', label: 'Add-to-Carts', suffix: '' }, { metric: 3.61, display: '3.61%', label: 'CTR', suffix: '%' }], tags: ['Meta Ads', 'E-Commerce', 'EU'], accent: '#FF570F', number: '03', 
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> 
    },
    { 
        client: 'US Therapy Practice', industry: 'Mental Health • USA', title: '517 High-Intent Phone Calls for Therapy Services', challenge: 'Therapy practice needed qualified calls from people actively seeking help. Standard lead gen campaigns were attracting low-intent browsers.', solution: ['Call-only Google Ads campaigns targeting crisis + immediate-need keywords', 'Custom call tracking integration with practice management system', 'Optimized for phone impression share in high-intent moments', 'A/B tested ad copy focused on immediate availability'], results: [{ metric: 517, display: '517', label: 'Phone Calls', suffix: '' }, { metric: 34.70, display: '$34.70', label: 'Cost Per Call', suffix: '' }, { metric: 3.23, display: '3.23%', label: 'CTR', suffix: '%' }, { metric: 60, display: '60%+', label: 'Booked Rate', suffix: '%' }], tags: ['Google Ads', 'Call Campaigns', 'USA'], accent: '#FDE87A', number: '04', 
        icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> 
    },
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
        <div className="text-xs text-pure-white/50 uppercase tracking-wider relative z-10">{result.label}</div>
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
        // FIX: Replaced mt-10/pt-10 with standard margin to prevent overlap
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
        // FIX: Explicitly added pt-32 (padding-top) to ensure spacing from previous section
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