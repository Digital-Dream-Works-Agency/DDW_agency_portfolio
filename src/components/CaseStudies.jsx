// src/components/CaseStudies.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

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
            { metric: '418K', label: 'Purchases (4 months)' },
            { metric: '600%', label: 'Peak ROAS' },
            { metric: '€69.7K', label: 'Monthly spend' },
            { metric: '1.1K', label: 'Daily conversions' },
        ],
        tags: ['Google Ads', 'E-Commerce', 'Italy'],
        gradient: 'from-orange-vibrant to-cream',
        icon: '📈'
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
            { metric: '15,594', label: 'Conversions' },
            { metric: '$0.09', label: 'Average CPC' },
            { metric: '4.58%', label: 'CTR' },
            { metric: '$6.3K', label: 'Total spend' },
        ],
        tags: ['Google Ads', 'Healthcare', 'USA'],
        gradient: 'from-orange-soft to-orange-vibrant',
        icon: '🏥'
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
            { metric: '317', label: 'Purchases' },
            { metric: '€11.52', label: 'Cost/purchase' },
            { metric: '6,190', label: 'Add-to-carts' },
            { metric: '3.61%', label: 'CTR' },
        ],
        tags: ['Meta Ads', 'E-Commerce', 'EU'],
        gradient: 'from-cream to-orange-vibrant',
        icon: '🛒'
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
            { metric: '517', label: 'Phone calls' },
            { metric: '$34.70', label: 'Cost per call' },
            { metric: '3.23%', label: 'CTR' },
            { metric: '60%+', label: 'Booked rate' },
        ],
        tags: ['Google Ads', 'Call Campaigns', 'USA'],
        gradient: 'from-orange-vibrant to-maroon-dark',
        icon: '⚡'
    },
];

const CaseStudies = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".case-study-card", {
                y: 80,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="case-studies" className="relative py-20 overflow-hidden bg-bg-surface">
            
            {/* Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 bg-orange-vibrant rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                
                {/* Section Header - REDUCED SPACING */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="px-6 py-2 border-2 border-orange-vibrant/50 text-orange-vibrant text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-vibrant/20">
                            Verified Results
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 text-pure-white">
                        Case Studies <span className="gradient-text">You Can Verify</span>
                    </h2>

                    <p className="text-lg text-pure-white/70 leading-relaxed">
                        Platform dashboards. Real clients. Numbers you can check.
                    </p>
                </div>

                {/* Case Studies */}
                <div className="space-y-12">
                    {caseStudies.map((study, index) => (
                        <motion.div
                            key={index}
                            className="case-study-card magnetic glass rounded-3xl overflow-hidden border-2 border-orange-vibrant/20 hover:border-orange-vibrant/50 transition-all duration-500 shadow-2xl"
                            whileHover={{ y: -5 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                
                                {/* Left: Content */}
                                <div className="p-8 lg:p-10 space-y-6 bg-deep-black/50 backdrop-blur-sm">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="text-5xl">
                                            {study.icon}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-pure-white font-bold">{study.client}</div>
                                            <div className="text-xs text-orange-vibrant uppercase tracking-wider">{study.industry}</div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-pure-white leading-tight">
                                        {study.title}
                                    </h3>

                                    {/* Challenge */}
                                    <div>
                                        <div className="text-xs text-orange-vibrant font-bold mb-2 uppercase tracking-wide">Challenge</div>
                                        <p className="text-pure-white/80 text-sm leading-relaxed">{study.challenge}</p>
                                    </div>

                                    {/* Solution */}
                                    <div>
                                        <div className="text-xs text-orange-vibrant font-bold mb-2 uppercase tracking-wide">Solution</div>
                                        <ul className="space-y-2">
                                            {study.solution.map((item, i) => (
                                                <li key={i} className="flex items-start space-x-2 text-sm text-pure-white/80">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${study.gradient} mt-2 flex-shrink-0`} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {study.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-xs font-bold text-orange-vibrant bg-orange-vibrant/10 border border-orange-vibrant/30 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Results */}
                                <div className="bg-gradient-to-br from-orange-vibrant/5 to-orange-vibrant/[0.02] p-8 lg:p-10 border-l-2 border-orange-vibrant/20">
                                    <div className="text-xs text-orange-vibrant font-bold mb-6 uppercase tracking-wide">Results</div>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {study.results.map((result, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="bg-deep-black/50 backdrop-blur-sm border-2 border-orange-vibrant/20 rounded-xl p-5 text-center hover:border-orange-vibrant/50 transition-all"
                                            >
                                                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-2`}>
                                                    {result.metric}
                                                </div>
                                                <div className="text-xs text-pure-white/70">{result.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href="https://calendly.com/digi-dreamworks/onboarding-call"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="magnetic group w-full bg-orange-vibrant hover:bg-cream text-deep-black px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                                    >
                                        <span>Request Full Breakdown</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CaseStudies;