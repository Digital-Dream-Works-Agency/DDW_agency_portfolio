// src/components/ProductsSection.jsx
// DDW's own live SaaS products — Lyra and Sviluppiamo.dev
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
    {
        name: 'Lyra',
        tagline: 'AI Voice Receptionist',
        description: "Every missed call is a missed customer. Lyra answers every call 24/7, books appointments into your calendar, qualifies leads, and sends follow-up messages — without a single human receptionist. Built on Twilio, AWS, and Google Cloud. Powered by DDW.",
        url: 'https://lyrabyddw.com',
        stats: [
            { value: '978+', label: 'Calls Handled' },
            { value: '24/7', label: 'Availability' },
            { value: '0', label: 'Missed Calls' },
        ],
        accent: '#FF570F',
        tags: ['AI SaaS', 'Voice AI', 'Twilio + AWS'],
        gradient: 'from-[#FF570F]/20 via-[#630D00]/10 to-transparent',
    },
    {
        name: 'Sviluppiamo.dev',
        tagline: 'Vibe Coding Platform — Italy Market',
        description: 'The Italian-market vibe coding platform. Sviluppiamo.dev connects Italian developers and businesses with AI-assisted software building — a product DDW built, owns, and operates. Part of our growing portfolio of market-specific SaaS tools.',
        url: 'https://sviluppiamo.dev',
        stats: [
            { value: 'IT', label: 'Market' },
            { value: 'AI', label: 'Powered' },
            { value: 'Live', label: 'Status' },
        ],
        accent: '#FDE87A',
        tags: ['SaaS', 'Italy Market', 'Built by DDW'],
        gradient: 'from-[#FDE87A]/15 via-[#EE7D1D]/10 to-transparent',
    },
];

const ProductCard = ({ product, index }) => {
    const cardRef = useRef(null);
    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true },
                delay: index * 0.15,
            }
        );
    }, [index]);

    return (
        <div ref={cardRef} className="relative rounded-3xl border-2 border-orange-vibrant/15 hover:border-orange-vibrant/40 overflow-hidden transition-all duration-700 group bg-gradient-to-br from-[#0e1012] to-[#080808]">
            {/* Background glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(${product.accent} 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />

            <div className="relative z-10 p-10 md:p-12">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border" style={{ borderColor: product.accent + '40', color: product.accent, background: product.accent + '12' }}>{tag}</span>
                    ))}
                </div>

                {/* Name + tagline */}
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: product.accent }}>{product.tagline}</div>
                <h3 className="text-4xl md:text-5xl font-heading font-black text-pure-white mb-5 group-hover:text-orange-vibrant transition-colors duration-300">{product.name}</h3>
                <p className="text-pure-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">{product.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mb-8">
                    {product.stats.map((stat, i) => (
                        <div key={i}>
                            <div className="text-3xl font-black" style={{ color: product.accent }}>{stat.value}</div>
                            <div className="text-text-muted text-xs uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-300 text-deep-black group-inner"
                    style={{ background: product.accent }}
                >
                    Visit {product.name}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
            </div>
        </div>
    );
};

const ProductsSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.products-header', {
                opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 bg-[#060809] overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-orange-vibrant/5 blur-[150px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="products-header text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                        <span className="text-orange-vibrant text-xs font-bold uppercase tracking-[0.2em]">Products We've Built & Ship</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pure-white mb-5 leading-tight">
                        We also{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">ship products.</span>
                    </h2>
                    <p className="text-pure-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        We don't just run client accounts — we build our own software too. These are live, paying products built and operated by the DDW team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {products.map((product, i) => <ProductCard key={product.name} product={product} index={i} />)}
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;
