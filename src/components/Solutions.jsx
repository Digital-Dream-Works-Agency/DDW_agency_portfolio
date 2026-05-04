import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Solutions Data ─────────────────────────────────────────────────────────────
const solutionsData = [
    { title: "Custom Software Development", desc: "Enterprise-grade web applications and bespoke system architecture designed for high-stakes operations.", features: ["Scalable Architecture", "Bespoke Design", "API Integration"], image: null, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>, color: "from-orange-vibrant to-orange-soft" },
    { title: "AI Development & Integration", desc: "Seamless LLM integration and workflow automation tailored to your enterprise systems.", features: ["LLM Infrastructure", "Workflow Automation", "Custom Models"], image: null, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.1 12.3" /></svg>, color: "from-cream to-orange-vibrant" },
    { title: "Cloud Infrastructure & DevOps", desc: "Secure, scalable cloud environments with automated CI/CD pipelines for continuous deployment.", features: ["Automated Pipelines", "Cloud Scaling", "Security Hardening"], image: null, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-15 4.5 4.5 4.5 0 0 0 2.5 8.5h10z" /></svg>, color: "from-orange-soft to-maroon-dark" },
    { title: "Software Consultancy", desc: "Fractional CTO services and technical audits to guide your architectural roadmap.", features: ["Technical Audits", "Architectural Roadmap", "Executive Advisory"], image: null, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>, color: "from-orange-vibrant to-cream" },
    { title: "Marketing Systems & Automation", desc: "Unified marketing infrastructure connecting CRM, ESP, and analytics into a single growth engine.", features: ["CRM Integration", "Email Automation", "Analytics Dashboard"], image: null, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>, color: "from-cream to-orange-soft" },
    { title: "SEO & Content Strategy", desc: "Data-backed Technical SEO and content strategy to build long-term market authority.", features: ["Technical SEO", "Content Strategy", "Link Building"], image: null, icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>, color: "from-orange-vibrant to-maroon-dark" }
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
            xTo(x * 10); 
            yTo(-y * 10); 
        };

        const handleMouseLeave = () => { xTo(0); yTo(0); };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => { el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseleave', handleMouseLeave); };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Solution Card Component ───────────────────────────────────────────────────
const SolutionCard = ({ solution, index }) => {
    const cardRef = useRef(null);

    return (
        <GSAPTilt className="solution-card">
            <div ref={cardRef} className="relative h-[520px] bg-gradient-to-br from-[#151a1d] to-[#0d1012] rounded-3xl overflow-hidden border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 transition-all duration-500 cursor-pointer group">
                <div className="absolute inset-0 z-0">
                    {solution.image
                        ? <img src={solution.image} alt={solution.title} className="w-full h-full object-cover opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0" loading="lazy" />
                        : <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '24px 24px' }} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/95 to-transparent" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color.replace('to-', 'to-').replace('from-', 'from-')} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl`} />

                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${solution.color} text-deep-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-orange-vibrant/50`}>
                            {solution.icon}
                        </div>
                        <span className="text-7xl font-black text-white/5 group-hover:text-orange-vibrant/20 transition-colors duration-500">0{index + 1}</span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-heading font-bold text-pure-white group-hover:text-orange-vibrant transition-colors duration-300">{solution.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed group-hover:text-pure-white/80 transition-colors duration-300">{solution.desc}</p>
                        <ul className="space-y-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-48 transition-all duration-500 overflow-hidden">
                            {solution.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-pure-white/90">
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${solution.color}`} /> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-orange-vibrant to-orange-600 text-deep-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20 shadow-2xl shadow-orange-vibrant/60">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </GSAPTilt>
    );
};

const Solutions = () => {
    const gridRef = useRef(null);
    const headingRef = useRef(null);
    const sectionRef = useRef(null);
    const prlx1Ref = useRef(null);
    const prlx2Ref = useRef(null);
    const prlxHeaderRef = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    useEffect(() => {
        const heading = document.querySelector('.solutions-main-heading');
        if (heading && !textSplit) {
            const split = new SplitType(heading, { types: 'words' });
            setTextSplit(split);

            gsap.from(split.words, {
                opacity: 0, y: 50, rotationX: -45, transformOrigin: 'top center', stagger: 0.06, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: heading, start: 'top 80%', once: true }
            });
        }
        return () => { if (textSplit) textSplit.revert(); };
    }, [textSplit]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.solution-card', {
                y: 80, opacity: 0, scale: 0.9, rotationY: -15, duration: 1, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: gridRef.current, start: 'top 70%', once: true }
            });

            // Native Parallax
            gsap.to(prlx1Ref.current, { yPercent: 20, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlx2Ref.current, { yPercent: -20, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});
            gsap.to(prlxHeaderRef.current, { yPercent: 10, ease: "none", scrollTrigger: { trigger: sectionRef.current, scrub: true }});

        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="solutions" ref={sectionRef} className="relative py-32 bg-deep-black overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div ref={prlx1Ref} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-vibrant/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
            <div ref={prlx2Ref} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cream/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6" ref={gridRef}>
                <div ref={prlxHeaderRef} className="solutions-header text-center mb-20">
                    <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em] rounded-full mb-8 backdrop-blur-sm shadow-lg shadow-orange-vibrant/20">
                        <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" /> Enterprise Solutions
                    </span>
                    <h2 ref={headingRef} className="solutions-main-heading text-5xl md:text-6xl lg:text-7xl font-heading font-black mb-6 leading-tight perspective-1000">
                        Solutions Built For <br />
                        <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">Modern Brands</span>
                    </h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">Empowering your digital journey with state-of-the-art technology services tailored for growth and innovation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutionsData.map((solution, index) => <SolutionCard key={index} solution={solution} index={index} />)}
                </div>
            </div>
            <style jsx>{`.perspective-1000 { perspective: 1000px; }`}</style>
        </section>
    );
};

export default Solutions;