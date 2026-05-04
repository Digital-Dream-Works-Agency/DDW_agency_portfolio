// src/components/AboutSection.jsx
// No stock photography — abstract team visual with brand-accurate copy
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// Animated abstract visual — rotating rings + dot constellation, no photos
const AbstractTeamVisual = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.at-orb-1', { scale: 1.18, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.at-orb-2', { scale: 0.82, duration: 7, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 2 });
            gsap.to('.at-ring-a', { rotation: 360, duration: 25, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
            gsap.to('.at-ring-b', { rotation: -360, duration: 18, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
            gsap.to('.at-dot-1', { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.at-dot-2', { y: 6, duration: 3.2, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1 });
        }, ref);
        return () => ctx.revert();
    }, []);
    return (
        <div ref={ref} className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
            <div className="at-orb-1 absolute inset-0 rounded-full bg-gradient-to-br from-[#FF570F]/20 to-[#630D00]/15 blur-[70px]" />
            <div className="at-orb-2 absolute inset-[20%] rounded-full bg-gradient-to-tr from-[#FDE87A]/18 to-[#EE7D1D]/12 blur-[45px]" />
            <div className="at-ring-a absolute inset-[5%] rounded-full border border-dashed border-orange-vibrant/25" />
            <div className="at-ring-b absolute inset-[20%] rounded-full border border-dotted border-cream/15" />
            {/* Dot nodes */}
            <div className="at-dot-1 absolute top-[10%] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-orange-vibrant shadow-lg shadow-orange-vibrant/60" />
            <div className="absolute top-[35%] right-[8%] w-1.5 h-1.5 rounded-full bg-orange-soft opacity-70" />
            <div className="at-dot-2 absolute bottom-[12%] left-[20%] w-2 h-2 rounded-full bg-cream/70 shadow-md" />
            <div className="absolute bottom-[30%] right-[15%] w-1 h-1 rounded-full bg-orange-vibrant/60" />
            {/* Core */}
            <div className="relative z-10 w-32 h-32 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-orange-vibrant/20 shadow-2xl shadow-orange-vibrant/10">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="mb-2">
                    <rect x="3" y="3" width="13" height="13" rx="2" stroke="#FF570F" strokeWidth="1.4" />
                    <rect x="20" y="3" width="13" height="13" rx="2" stroke="#EE7D1D" strokeWidth="1.4" />
                    <rect x="3" y="20" width="13" height="13" rx="2" stroke="#EE7D1D" strokeWidth="1.4" />
                    <rect x="20" y="20" width="13" height="13" rx="2" stroke="#FDE87A" strokeWidth="1.4" />
                    <circle cx="18" cy="18" r="2.5" fill="#FF570F" />
                </svg>
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted">DDW</span>
            </div>
            {/* Floating badges */}
            <div className="absolute top-[5%] left-[-8%] px-3 py-1.5 rounded-xl bg-[#111]/90 border border-orange-vibrant/25 backdrop-blur-sm shadow-lg hidden md:block">
                <span className="text-[10px] font-bold text-orange-vibrant">7 Core Services</span>
            </div>
            <div className="absolute bottom-[10%] right-[-6%] px-3 py-1.5 rounded-xl bg-[#111]/90 border border-cream/20 backdrop-blur-sm shadow-lg hidden md:block">
                <span className="text-[10px] font-bold text-cream">100% Retainer</span>
            </div>
        </div>
    );
};

const GSAPCounter = ({ end, suffix = '', duration = 2.5, start = false }) => {
    const valRef = useRef(null);
    useEffect(() => {
        if (!start || !valRef.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: end, duration, ease: 'power2.out',
            onUpdate: () => { if (valRef.current) valRef.current.innerText = Math.round(obj.val) + suffix; }
        });
    }, [end, start, suffix, duration]);
    return <span ref={valRef}>0{suffix}</span>;
};

const statsData = [
    { end: 7, suffix: '', label: 'Core retainer services', sub: 'One team across all seven' },
    { end: 100, suffix: '%', label: 'Retainer engagements', sub: 'No one-off projects, ever' },
    { end: 2, suffix: '', label: 'Global markets', sub: 'US and EU operations' },
    { end: 24, suffix: 'hr', label: 'Response SLA', sub: 'For all active retainers' },
];

const AboutSection = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const [statsStarted, setStatsStarted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headingRef.current) {
                const split = new SplitType(headingRef.current, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0, y: 32, duration: 0.85, stagger: 0.05, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
                });
            }
            gsap.from('.about-sub', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: '.about-sub', start: 'top 88%', once: true } });
            gsap.from('.about-pill', { opacity: 0, x: -16, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.about-pill', start: 'top 88%', once: true } });
            gsap.from('.about-visual', { opacity: 0, x: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-visual', start: 'top 85%', once: true } });
            ScrollTrigger.create({
                trigger: '.about-stats',
                start: 'top 80%',
                once: true,
                onEnter: () => setStatsStarted(true),
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 bg-[#080808] overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-[#FF570F]/5 blur-[130px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#630D00]/8 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Top: Heading + intro */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
                            <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Who we are</span>
                        </div>
                        <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-pure-white leading-[1.08] mb-6">
                            Built by engineers.{' '}
                            <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">Not marketers.</span>
                        </h2>
                        <p className="about-sub text-pure-white/55 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                            Digital Dream Works is a cross-functional team operating from Florida and Rome. We build and maintain software systems and marketing infrastructure for US and EU clients on an ongoing retainer basis.
                        </p>
                        <p className="about-sub text-pure-white/45 text-sm leading-relaxed mb-8 max-w-lg">
                            Every engagement is a retainer. The team that scopes the work is the team that maintains it. No handing off to juniors. No re-onboarding every six months.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Florida, USA', 'Rome, Italy', 'Retainer-only', 'US + EU clients'].map((pill) => (
                                <div key={pill} className="about-pill flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
                                    <span className="text-pure-white/70 text-xs font-medium">{pill}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="about-visual flex items-center justify-center">
                        <AbstractTeamVisual />
                    </div>
                </div>

                {/* Stats row */}
                <div className="about-stats grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statsData.map((s) => (
                        <div key={s.label} className="p-6 rounded-2xl border border-white/6 bg-[#0e1012] text-center">
                            <p className="text-3xl md:text-4xl font-heading font-black text-orange-vibrant mb-1">
                                <GSAPCounter end={s.end} suffix={s.suffix} start={statsStarted} />
                            </p>
                            <p className="text-pure-white text-sm font-semibold mb-1">{s.label}</p>
                            <p className="text-pure-white/35 text-xs">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-14">
                    <Link to="/about"
                        className="inline-flex items-center gap-2 px-7 py-3 border border-orange-vibrant/40 text-orange-vibrant text-xs font-bold uppercase tracking-wider hover:bg-orange-vibrant hover:text-deep-black transition-all duration-300">
                        Read Our Story
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
