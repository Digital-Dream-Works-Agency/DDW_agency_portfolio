// src/components/Collaborate.jsx
// No stock photography — abstract gradient with call-to-action
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const useMagneticEffect = (ref, strength = 0.2) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * strength);
            yTo((e.clientY - r.top - r.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    }, [strength]);
};

// Abstract brand visual: no stock photos, pure CSS + SVG
const AbstractCTAVisual = () => {
    const ref = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.cta-orb-a', { scale: 1.2, duration: 4.5, repeat: -1, yoyo: true, ease: 'power1.inOut' });
            gsap.to('.cta-orb-b', { scale: 0.85, duration: 6, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1.5 });
            gsap.to('.cta-ring', { rotation: 360, duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        }, ref);
        return () => ctx.revert();
    }, []);
    return (
        <div ref={ref} className="relative w-64 h-64 mx-auto flex items-center justify-center hidden lg:flex">
            <div className="cta-orb-a absolute inset-0 rounded-full bg-gradient-to-br from-[#FF570F]/25 to-[#630D00]/15 blur-[50px]" />
            <div className="cta-orb-b absolute inset-[20%] rounded-full bg-gradient-to-tr from-[#FDE87A]/20 to-[#EE7D1D]/15 blur-[30px]" />
            <div className="cta-ring absolute inset-[5%] rounded-full border border-dashed border-orange-vibrant/25" />
            <div className="relative z-10 w-24 h-24 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-orange-vibrant/20 shadow-xl">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32" className="text-orange-vibrant">
                    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-1.5">20 min</span>
            </div>
        </div>
    );
};

const agendaItems = [
    {
        num: '01',
        title: "Look at what you're running",
        desc: "We look at the actual account — spend, ROAS, structure, where the budget goes. Not a questionnaire. The real numbers.",
    },
    {
        num: '02',
        title: 'Tell you exactly where the gap is',
        desc: "There's usually one thing costing the most. We'll name it in plain terms, not agency jargon.",
    },
    {
        num: '03',
        title: "Tell you plainly if we're the right fit",
        desc: "If DDW isn't the right team for your account, we'll say so on the call. No follow-up unless you ask for one.",
    },
];

const Collaborate = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const ctaBtnRef = useRef(null);
    useMagneticEffect(ctaBtnRef, 0.2);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headingRef.current) {
                const split = new SplitType(headingRef.current, { types: 'words' });
                gsap.from(split.words, {
                    opacity: 0, y: 32, duration: 0.9, stagger: 0.06, ease: 'power3.out',
                    scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
                });
            }
            gsap.from('.collab-sub', {
                opacity: 0, y: 20, duration: 0.75, ease: 'power2.out',
                scrollTrigger: { trigger: '.collab-sub', start: 'top 88%', once: true },
            });
            gsap.from('.agenda-item', {
                opacity: 0, x: -24, duration: 0.65, stagger: 0.12, ease: 'power2.out',
                scrollTrigger: { trigger: '.agenda-item', start: 'top 88%', once: true },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-28 px-6 overflow-hidden bg-[#080808]">
            {/* Abstract background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />
            <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#FF570F]/6 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#630D00]/10 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Copy */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-orange-vibrant/30 bg-orange-vibrant/8 rounded-full mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                            <span className="text-orange-vibrant text-[11px] font-bold uppercase tracking-[0.18em]">Discovery call</span>
                        </div>

                        <h2 ref={headingRef} className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-pure-white leading-[1.08] mb-6">
                            Every month with the wrong team is budget that{' '}
                            <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent">doesn&rsquo;t compound.</span>
                        </h2>

                        <p className="collab-sub text-pure-white/55 text-base md:text-lg leading-relaxed mb-3 max-w-lg">
                            At $50K/month in ad spend, a 1x improvement in ROAS is worth more than the retainer costs in a year. There&rsquo;s one thing we say on every first call that most agencies won&rsquo;t. It usually tells you in 10 minutes whether we&rsquo;re worth your time.
                        </p>
                        <p className="collab-sub text-pure-white/40 text-sm leading-relaxed mb-10 max-w-lg">
                            Book 20 minutes. Here&rsquo;s what happens on the call:
                        </p>

                        <div className="space-y-6 mb-10">
                            {agendaItems.map((item) => (
                                <div key={item.num} className="agenda-item flex gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-orange-vibrant/30 bg-orange-vibrant/10">
                                        <span className="text-orange-vibrant font-mono text-xs font-bold">{item.num}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-pure-white font-semibold text-sm mb-1">{item.title}</h3>
                                        <p className="text-pure-white/45 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a ref={ctaBtnRef}
                            href="https://calendly.com/digi-dreamworks/onboarding-call"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-colors duration-300 shadow-lg shadow-orange-vibrant/25 group">
                            Book the 20-Minute Call
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>

                    {/* Right: Abstract visual */}
                    <div className="flex items-center justify-center">
                        <AbstractCTAVisual />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Collaborate;
