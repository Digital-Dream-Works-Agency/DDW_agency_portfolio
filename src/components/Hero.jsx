import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Magnetic Effect (Optimized for zero lag) ─────────────────────────
const useMagneticEffect = (ref, strength = 0.15) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });
        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => { 
            el.removeEventListener('mousemove', onMove); 
            el.removeEventListener('mouseleave', onLeave); 
        };
    }, [strength]);
};

// ─── Primary CTA Button (Sleeker & Magnetic) ───────────────────────────
const PrimaryCTA = ({ href, children }) => {
    const btnRef = useRef(null);
    useMagneticEffect(btnRef, 0.2);
    
    return (
        <a 
            ref={btnRef}
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-wide rounded-xl hover:bg-cream transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(255,87,15,0.3)] hover:shadow-[0_0_30px_rgba(255,87,15,0.5)] will-change-transform"
        >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
        </a>
    );
};

// ─── Safari Browser Mockup Dashboard (Billion $ Feel) ───────────────────
const LiveMetricsDashboard = () => {
    const [activeMetric, setActiveMetric] = useState(0);
    const dashboardRef = useRef(null);
    
    const metrics = [
        { value: '$683K', label: 'Meta Spend', sublabel: 'Last 30 days', color: 'from-blue-400 to-blue-600' },
        { value: '$2.7M', label: 'Amazon Sales', sublabel: 'Since 2015', color: 'from-orange-400 to-orange-600' },
        { value: '600%', label: 'Google ROAS', sublabel: 'Active campaign', color: 'from-green-400 to-green-600' },
    ];
    
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMetric((prev) => (prev + 1) % metrics.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [metrics.length]);
    
    useEffect(() => {
        gsap.fromTo(dashboardRef.current, 
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
    }, [activeMetric]);
    
    return (
        <div className="relative w-full max-w-md mx-auto perspective-1000">
            {/* Safari Window Container */}
            <div ref={dashboardRef} className="relative rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transform-gpu hover:-translate-y-2 transition-transform duration-500">
                
                {/* Mac OS Top Bar */}
                <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                    <div className="flex-1 text-center text-[10px] text-white/30 font-medium">app.digitaldreamworks.com</div>
                </div>

                <div className="p-6">
                    <div className="text-center mb-4">
                        <div className={`inline-block text-4xl md:text-5xl font-black bg-gradient-to-br ${metrics[activeMetric].color} bg-clip-text text-transparent mb-1`}>
                            {metrics[activeMetric].value}
                        </div>
                        <div className="text-pure-white font-bold text-sm mb-1">{metrics[activeMetric].label}</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">{metrics[activeMetric].sublabel}</div>
                    </div>
                    
                    {/* Mini bar chart */}
                    <div className="flex items-end justify-center gap-1.5 h-16 mb-4">
                        {[40, 65, 50, 80, 60, 95, 75].map((height, i) => (
                            <div 
                                key={i}
                                className="w-4 rounded-t-sm transition-all duration-500"
                                style={{ 
                                    height: `${height}%`,
                                    background: i === activeMetric + 3 ? 'linear-gradient(to top, #FF570F, #FDE87A)' : 'rgba(255,255,255,0.05)'
                                }}
                            />
                        ))}
                    </div>
                    
                    <div className="absolute top-10 right-4 flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-500 text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                </div>
            </div>

            {/* Glowing background behind dashboard */}
            <div className="absolute inset-0 bg-orange-vibrant/20 blur-[80px] -z-10 rounded-full" />
        </div>
    );
};

// ─── Client Logo Marquee (Tighter integration) ───────────────────────────
const ClientLogoMarquee = () => {
    const marqueeRef = useRef(null);
    const logos = ['Meta', 'Google', 'Amazon', 'TikTok', 'Shopify', 'Stripe'];
    
    useEffect(() => {
        if (!marqueeRef.current) return;
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            duration: 20,
            repeat: -1,
            ease: 'none',
        });
    }, []);
    
    return (
        <div className="relative w-full overflow-hidden py-3 border-t border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep-black to-transparent z-10" />
            
            <div ref={marqueeRef} className="flex gap-8 items-center">
                {[...logos, ...logos].map((name, i) => (
                    <div key={i} className="flex-shrink-0 text-white/30 text-sm font-bold uppercase tracking-widest hover:text-white/60 transition-colors">
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Hero Component (Strict 100dvh One-View Fit) ─────────────────────
const Hero = () => {
    const sectionRef = useRef(null);
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.hero-anim', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 });
        }, sectionRef);
        return () => ctx.revert();
    }, []);
    
    return (
        // Changed to exactly 100dvh, flex-col, hidden overflow
        <section ref={sectionRef} className="relative w-full h-[100dvh] flex flex-col justify-between overflow-hidden bg-deep-black">
            
            {/* Subtle Aurora / Tech Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)] z-0" />
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-orange-vibrant/10 blur-[120px] rounded-full z-0 pointer-events-none" />
            
            {/* Main Content Centered vertically */}
            <div className="relative z-10 flex-grow flex items-center w-full max-w-7xl mx-auto px-6 mt-16 md:mt-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                    
                    {/* Left: Copy */}
                    <div className="space-y-5">
                        <div className="hero-anim inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-pulse" />
                            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                                Retainer-Only · Florida LLC
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <h1 className="hero-anim text-3xl md:text-5xl lg:text-[54px] font-black text-pure-white leading-tight">
                                Most agencies show case studies.
                            </h1>
                            <h1 className="hero-anim text-3xl md:text-5xl lg:text-[54px] font-black text-orange-vibrant leading-tight">
                                We show the accounts.
                            </h1>
                        </div>
                        
                        <p className="hero-anim text-white/60 text-base leading-relaxed max-w-lg">
                            $683K in Meta spend managed last month. $2.7M in Amazon sales since 2015. 600% ROAS on Google. Every number is live on our first call.
                        </p>
                        
                        <div className="hero-anim flex items-center gap-4 pt-2">
                            <PrimaryCTA href="https://calendly.com/digi-dreamworks/onboarding-call">
                                See If We're a Fit
                            </PrimaryCTA>
                            <button className="text-white/50 hover:text-white text-sm font-medium transition-colors">
                                View Numbers →
                            </button>
                        </div>
                    </div>
                    
                    {/* Right: Visual */}
                    <div className="hero-anim flex items-center justify-center w-full">
                        <LiveMetricsDashboard />
                    </div>
                </div>
            </div>
            
            {/* Sticky Logo Marquee at absolute bottom inside the 100dvh */}
            <div className="relative z-10 w-full mt-auto">
                <ClientLogoMarquee />
            </div>
            
        </section>
    );
};

export default Hero;