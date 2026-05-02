// src/components/CaseStudies.jsx - FULLY UPGRADED VERSION
// Features: Parallax, 3D Tilt, Magnetic Buttons, Text Reveal, Scroll Counter, Scroll Progress

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const caseStudies = [
    {
        client: 'Italian Fashion E-Commerce',
        industry: 'E-Commerce • Italy/EU',
        title: '€69.7K Ad Spend Generated 418K Purchases at 600% ROAS',
        challenge: 'Italian fashion retailer spending €20K/month on Google Shopping with inconsistent 180-250% ROAS. Needed to scale profitably to €70K/month without margin erosion.',
        solution: [
            'Restructured entire Google Shopping feed with Italian-optimized product titles',
            'Implemented tiered bidding strategy by product margin and seasonality',
            'Created separate campaigns for high-AOV vs. volume products',
            'Integrated with existing Italian e-commerce platform (custom API)',
        ],
        results: [
            { metric: 418000, display: '418K', label: 'Purchases (4 months)', suffix: '' },
            { metric: 600, display: '600%', label: 'Peak ROAS', suffix: '%' },
            { metric: 69.7, display: '€69.7K', label: 'Monthly Spend', suffix: '' },
            { metric: 1100, display: '1.1K', label: 'Daily Conversions', suffix: '' },
        ],
        tags: ['Google Ads', 'E-Commerce', 'Italy'],
        accent: '#FF570F',
        number: '01',
        icon: '📈',
    },
    {
        client: 'US Healthcare Clinic',
        industry: 'Healthcare • USA',
        title: '15,594 Patient Appointments Booked at $0.09 CPC',
        challenge: 'Medical clinic in competitive US market struggling with $3+ CPC on Google Ads. Needed cost-effective patient acquisition across 12 states.',
        solution: [
            'Built location-specific landing pages for each service line',
            'Implemented appointment booking integration with Google Ads tracking',
            'Optimized for "near me" searches with geo-targeted bid adjustments',
            'Created remarketing campaigns for incomplete bookings',
        ],
        results: [
            { metric: 15594, display: '15,594', label: 'Conversions', suffix: '' },
            { metric: 0.09, display: '$0.09', label: 'Average CPC', suffix: '' },
            { metric: 4.58, display: '4.58%', label: 'CTR', suffix: '%' },
            { metric: 6.3, display: '$6.3K', label: 'Total Spend', suffix: '' },
        ],
        tags: ['Google Ads', 'Healthcare', 'USA'],
        accent: '#FDE87A',
        number: '02',
        icon: '🏥',
    },
    {
        client: 'European E-Commerce',
        industry: 'E-Commerce • EU',
        title: '317 Purchases via Meta Ads at €11.52 Cost Per Sale',
        challenge: 'Multi-country EU e-commerce store struggling with Meta Ads profitability. High cart abandonment, low ROAS across 5 markets.',
        solution: [
            'Built retargeting campaigns with dynamic product ads in 5 languages',
            'Created lookalike audiences based on high-LTV customer segments',
            'Implemented abandoned cart recovery via Meta Messenger',
            'Optimized creative testing framework (10+ variants per product)',
        ],
        results: [
            { metric: 317, display: '317', label: 'Purchases', suffix: '' },
            { metric: 11.52, display: '€11.52', label: 'Cost/Purchase', suffix: '' },
            { metric: 6190, display: '6,190', label: 'Add-to-Carts', suffix: '' },
            { metric: 3.61, display: '3.61%', label: 'CTR', suffix: '%' },
        ],
        tags: ['Meta Ads', 'E-Commerce', 'EU'],
        accent: '#FF570F',
        number: '03',
        icon: '🛒',
    },
    {
        client: 'US Therapy Practice',
        industry: 'Mental Health • USA',
        title: '517 High-Intent Phone Calls for Therapy Services',
        challenge: 'Therapy practice needed qualified calls from people actively seeking help. Standard lead gen campaigns were attracting low-intent browsers.',
        solution: [
            'Call-only Google Ads campaigns targeting crisis + immediate-need keywords',
            'Custom call tracking integration with practice management system',
            'Optimized for phone impression share in high-intent moments',
            'A/B tested ad copy focused on immediate availability',
        ],
        results: [
            { metric: 517, display: '517', label: 'Phone Calls', suffix: '' },
            { metric: 34.70, display: '$34.70', label: 'Cost Per Call', suffix: '' },
            { metric: 3.23, display: '3.23%', label: 'CTR', suffix: '%' },
            { metric: 60, display: '60%+', label: 'Booked Rate', suffix: '%' },
        ],
        tags: ['Google Ads', 'Call Campaigns', 'USA'],
        accent: '#FDE87A',
        number: '04',
        icon: '⚡',
    },
];

// ─── Magnetic Button Hook ──────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power2.out' });
        };

        const onLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);
};

// ─── Magnetic CTA Button ───────────────────────────────────────────────────────
const MagneticCTA = ({ href, children, variant = 'primary' }) => {
    const ref = useRef(null);
    useMagneticEffect(ref, 0.25);

    const styles = {
        primary: 'bg-orange-vibrant text-deep-black hover:bg-cream',
        secondary: 'border-2 border-orange-vibrant text-pure-white hover:bg-orange-vibrant hover:text-deep-black',
    };

    return (
        <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group inline-flex items-center gap-2 px-7 py-3.5 font-bold text-xs uppercase tracking-widest transition-all duration-300 overflow-hidden shadow-lg ${styles[variant]}`}
        >
            {/* Shine sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
            </span>
        </a>
    );
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ display, inView }) => {
    const [shown, setShown] = useState('0');
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!inView || hasAnimated.current) return;
        hasAnimated.current = true;

        // Extract numeric part
        const numMatch = display.replace(/[^0-9.]/g, '');
        const target = parseFloat(numMatch);
        if (isNaN(target)) { setShown(display); return; }

        const prefix = display.match(/^[^0-9]*/)?.[0] || '';
        const suffix = display.match(/[^0-9.]+$/)?.[0] || '';
        const isDecimal = display.includes('.');
        const decimals = isDecimal ? (display.split('.')[1]?.replace(/[^0-9]/g, '').length || 0) : 0;

        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                const v = isDecimal ? obj.val.toFixed(decimals) : Math.floor(obj.val);
                const formatted = parseFloat(v) >= 1000
                    ? parseFloat(v).toLocaleString()
                    : v;
                setShown(`${prefix}${formatted}${suffix}`);
            },
            onComplete: () => setShown(display),
        });
    }, [inView, display]);

    return <span>{shown}</span>;
};

// ─── Result Card ──────────────────────────────────────────────────────────────
const ResultCard = ({ result, accent, inView, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
        className="relative group bg-deep-black/60 border border-white/5 rounded-2xl p-5 text-center hover:border-orange-vibrant/40 transition-all duration-500 overflow-hidden"
    >
        {/* Glow on hover */}
        <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-2xl"
            style={{ background: `radial-gradient(circle at center, ${accent}15, transparent 70%)` }}
        />
        <div
            className="text-3xl md:text-4xl font-black mb-1 relative z-10"
            style={{ color: accent }}
        >
            <AnimatedCounter display={result.display} inView={inView} />
        </div>
        <div className="text-xs text-pure-white/50 uppercase tracking-wider relative z-10">{result.label}</div>
    </motion.div>
);

// ─── Case Study Card ──────────────────────────────────────────────────────────
const CaseStudyCard = ({ study, index }) => {
    const cardRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.2 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const isEven = index % 2 === 0;

    return (
        <div ref={cardRef} className="relative">
            <Tilt
                tiltMaxAngleX={4}
                tiltMaxAngleY={4}
                scale={1.01}
                transitionSpeed={2000}
                glareEnable={true}
                glareMaxOpacity={0.05}
                glareColor={study.accent}
                className="w-full"
            >
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative rounded-3xl overflow-hidden border border-white/5 hover:border-orange-vibrant/30 transition-all duration-700 shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(255,87,15,0.03) 0%, rgba(10,10,10,0.95) 100%)' }}
                >
                    {/* Large number watermark */}
                    <div
                        className="absolute top-6 right-8 text-[120px] md:text-[160px] font-black leading-none select-none pointer-events-none z-0"
                        style={{ color: `${study.accent}08` }}
                    >
                        {study.number}
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${!isEven ? 'lg:[direction:rtl]' : ''}`}>

                        {/* ── LEFT: Content ── */}
                        <div className={`relative z-10 p-8 lg:p-12 space-y-6 ${!isEven ? 'lg:[direction:ltr]' : ''}`}>

                            {/* Top row */}
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">{study.icon}</span>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-pure-white">{study.client}</div>
                                    <div className="text-xs uppercase tracking-widest" style={{ color: study.accent }}>{study.industry}</div>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-pure-white leading-tight">
                                {study.title}
                            </h3>

                            {/* Divider */}
                            <div className="h-px w-16" style={{ background: study.accent }} />

                            {/* Challenge */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: study.accent }}>Challenge</p>
                                <p className="text-pure-white/70 text-sm leading-relaxed">{study.challenge}</p>
                            </div>

                            {/* Solution */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: study.accent }}>Solution</p>
                                <ul className="space-y-2">
                                    {study.solution.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={inView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                                            className="flex items-start gap-3 text-sm text-pure-white/70"
                                        >
                                            <span
                                                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ background: study.accent }}
                                            />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {study.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs font-bold rounded-full border"
                                        style={{ color: study.accent, borderColor: `${study.accent}40`, background: `${study.accent}10` }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="pt-2">
                                <MagneticCTA href="https://calendly.com/digi-dreamworks/onboarding-call" variant="primary">
                                    Request Full Breakdown
                                </MagneticCTA>
                            </div>
                        </div>

                        {/* ── RIGHT: Results ── */}
                        <div className={`relative z-10 p-8 lg:p-12 flex flex-col justify-center ${!isEven ? 'lg:[direction:ltr]' : ''}`}
                            style={{ borderLeft: isEven ? `1px solid ${study.accent}15` : 'none', borderRight: !isEven ? `1px solid ${study.accent}15` : 'none' }}
                        >
                            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: study.accent }}>Results</p>

                            <div className="grid grid-cols-2 gap-4">
                                {study.results.map((result, i) => (
                                    <ResultCard
                                        key={i}
                                        result={result}
                                        accent={study.accent}
                                        inView={inView}
                                        index={i}
                                    />
                                ))}
                            </div>

                            {/* Decorative glow blob */}
                            <div
                                className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none"
                                style={{ background: study.accent }}
                            />
                        </div>
                    </div>
                </motion.div>
            </Tilt>
        </div>
    );
};

// ─── Section Header with SplitType ────────────────────────────────────────────
const SectionHeader = () => {
    const headingRef = useRef(null);
    const subtitleRef = useRef(null);

    useEffect(() => {
        if (!headingRef.current) return;

        // Title word-by-word reveal
        const split = new SplitType(headingRef.current, { types: 'words' });
        gsap.from(split.words, {
            opacity: 0,
            y: 40,
            rotationX: -30,
            transformOrigin: 'top center',
            stagger: 0.07,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: headingRef.current,
                start: 'top 85%',
            },
        });

        // Subtitle fade
        gsap.from(subtitleRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: subtitleRef.current,
                start: 'top 90%',
            },
        });

        return () => split.revert();
    }, []);

    return (
        <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
            >
                <span className="px-6 py-2 border border-orange-vibrant/40 text-orange-vibrant text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-vibrant/10">
                    Verified Results
                </span>
            </motion.div>

            <h2
                ref={headingRef}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-5 text-pure-white perspective-1000"
            >
                Case Studies{' '}
                <span style={{
                    background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                }}>
                    You Can Verify
                </span>
            </h2>

            <p ref={subtitleRef} className="text-lg text-pure-white/60 leading-relaxed">
                Platform dashboards. Real clients. Numbers you can check.
            </p>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CaseStudies = () => {
    const sectionRef = useRef(null);

    // Subtle parallax for background glow
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

    return (
        <ParallaxProvider>
            <section
                ref={sectionRef}
                id="case-studies"
                className="relative py-24 md:py-32 overflow-hidden bg-bg-surface"
            >
                {/* ── Animated background glows ── */}
                <Parallax speed={-12}>
                    <motion.div
                        style={{ y: glowY }}
                        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-8 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(255,87,15,0.08) 0%, transparent 70%)' }}
                    />
                </Parallax>

                <Parallax speed={8}>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-5 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(253,232,122,0.06) 0%, transparent 70%)' }}
                    />
                </Parallax>

                {/* ── Subtle grid ── */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,87,15,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.015) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6">
                    <SectionHeader />

                    {/* Cards with alternating layout */}
                    <div className="space-y-16">
                        {caseStudies.map((study, index) => (
                            <Parallax key={index} speed={index % 2 === 0 ? -3 : 3}>
                                <CaseStudyCard study={study} index={index} />
                            </Parallax>
                        ))}
                    </div>

                    {/* ── Bottom CTA ── */}
                    <Parallax speed={-5}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mt-24 text-center"
                        >
                            <p className="text-pure-white/40 text-sm uppercase tracking-widest mb-6">
                                Ready to be the next case study?
                            </p>
                            <MagneticCTA
                                href="https://calendly.com/digi-dreamworks/onboarding-call"
                                variant="primary"
                            >
                                Book a Strategy Call
                            </MagneticCTA>
                        </motion.div>
                    </Parallax>
                </div>

                <style jsx>{`
                    .perspective-1000 { perspective: 1000px; }
                `}</style>
            </section>
        </ParallaxProvider>
    );
};

export default CaseStudies;