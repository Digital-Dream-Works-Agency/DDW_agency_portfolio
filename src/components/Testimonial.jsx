// src/components/Testimonial.jsx
// Real testimonials needed before launch — placeholders anonymized by industry + role
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// InitialsAvatar replaces Pexels headshots
const InitialsAvatar = ({ initials, accent = '#FF570F' }) => (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-deep-black flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${accent}, #EE7D1D)` }}>
        {initials}
    </div>
);

// TODO: Replace with real client testimonials before launch
// Keep format: name (or anonymized role), company (or industry), comment, stat
const testimonialData = [
    {
        initials: 'VC',
        name: 'VP of Operations',
        company: 'US logistics company',
        comment: 'TODO: Real testimonial — this client runs a custom dispatch system we built. Ask for a written quote.',
        stat: { value: '—', label: 'Confirm with client' },
        accent: '#FF570F',
    },
    {
        initials: 'CM',
        name: 'CMO',
        company: 'EU SaaS company',
        comment: 'TODO: Real testimonial — this client had their marketing automation rebuilt. Ask for a written quote.',
        stat: { value: '—', label: 'Confirm with client' },
        accent: '#EE7D1D',
    },
    {
        initials: 'CT',
        name: 'CTO',
        company: 'US fintech startup',
        comment: 'TODO: Real testimonial — this client used our consultancy to de-risk an architectural decision. Ask for a written quote.',
        stat: { value: '—', label: 'Confirm with client' },
        accent: '#FDE87A',
    },
];

const StarRating = () => (
    <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-orange-vibrant" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const TestimonialCard = ({ t, isActive }) => (
    <div className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}>
        <div className="bg-[#0e1012] border border-white/6 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px]"
                style={{ background: `${t.accent}25` }} />
            <div className="relative z-10">
                <StarRating />
                <blockquote className="text-pure-white/75 text-base md:text-lg leading-relaxed mb-8 italic">
                    &ldquo;{t.comment}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <InitialsAvatar initials={t.initials} accent={t.accent} />
                        <div>
                            <p className="text-pure-white font-semibold text-sm">{t.name}</p>
                            <p className="text-pure-white/40 text-xs">{t.company}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xl" style={{ color: t.accent }}>{t.stat.value}</p>
                        <p className="text-pure-white/35 text-xs">{t.stat.label}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    const [active, setActive] = useState(0);
    const sectionRef = useRef(null);
    const intervalRef = useRef(null);

    const next = useCallback(() => setActive((p) => (p + 1) % testimonialData.length), []);
    const prev = useCallback(() => setActive((p) => (p - 1 + testimonialData.length) % testimonialData.length), []);

    useEffect(() => {
        intervalRef.current = setInterval(next, 6000);
        return () => clearInterval(intervalRef.current);
    }, [next]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonials-heading', {
                opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.testimonials-heading', start: 'top 85%', once: true },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 bg-deep-black overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]" />
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-12 testimonials-heading">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
                        <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Client results</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-pure-white mb-4">
                        What retainer clients{' '}
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">actually say.</span>
                    </h2>
                    <p className="text-pure-white/45 text-sm">Real quotes from ongoing engagements. No fabricated logos, no invented metrics.</p>
                </div>

                <div className="relative min-h-[280px]">
                    {testimonialData.map((t, i) => (
                        <TestimonialCard key={i} t={t} isActive={i === active} />
                    ))}
                </div>

                <div className="flex items-center justify-center gap-4 mt-8">
                    <button onClick={prev} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-pure-white/50 hover:border-orange-vibrant/50 hover:text-orange-vibrant transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <div className="flex gap-2">
                        {testimonialData.map((_, i) => (
                            <button key={i} onClick={() => setActive(i)}
                                className="w-2 h-2 rounded-full transition-all duration-300"
                                style={{ background: i === active ? '#FF570F' : 'rgba(255,255,255,0.15)' }} />
                        ))}
                    </div>
                    <button onClick={next} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-pure-white/50 hover:border-orange-vibrant/50 hover:text-orange-vibrant transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
