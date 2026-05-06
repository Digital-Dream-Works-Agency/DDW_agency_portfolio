import { useEffect, useRef, useState } from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const GSAPTilt = ({ children, className }) => {
    const tiltRef = useRef(null);
    const rectRef = useRef(null);

    useEffect(() => {
        const el = tiltRef.current;
        if (!el) return;
        
        const xTo = gsap.quickTo(el, "rotationY", { ease: "power2.out", duration: 0.5 });
        const yTo = gsap.quickTo(el, "rotationX", { ease: "power2.out", duration: 0.5 });

        const handleMouseEnter = () => {
            rectRef.current = el.getBoundingClientRect();
        };

        const handleMouseMove = (e) => {
            if (!rectRef.current) rectRef.current = el.getBoundingClientRect();
            const x = (e.clientX - rectRef.current.left) / rectRef.current.width - 0.5;
            const y = (e.clientY - rectRef.current.top) / rectRef.current.height - 0.5;
            xTo(x * 2);
            yTo(-y * 2);
        };

        const handleMouseLeave = () => { 
            xTo(0); 
            yTo(0); 
            rectRef.current = null;
        };

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        
        return () => { 
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mousemove', handleMouseMove); 
            el.removeEventListener('mouseleave', handleMouseLeave); 
        };
    }, []);

    return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const isVisibleRef = useRef(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
            { rootMargin: '50px' }
        );
        if (canvasRef.current) observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = Array.from({ length: 25 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.4 + 0.1,
        }));

        let frame;
        const draw = () => {
            frame = requestAnimationFrame(draw);
            
            if (!isVisibleRef.current) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,87,15,${p.alpha})`;
                ctx.fill();
            });
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;
                    
                    if (distSq < 6400) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255,87,15,${0.1 * (1 - Math.sqrt(distSq) / 80)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };
        draw();
        
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111418] via-[#111418]/90 to-transparent" />
        </div>
    );
};

const servicesData = [
    {
        number: '01', title: 'Custom Software Development',
        tagline: 'Built for scale. Designed for growth.',
        desc: 'Enterprise-grade web applications, internal tools, and bespoke system architecture designed for high-stakes operations. We architect systems that are maintainable, scalable, and built to last.',
        features: ['Full-stack web application development', 'API design & integrations', 'Database architecture', 'Legacy modernization'],
        deliverable: 'Production-ready system', timeline: '6–16 weeks'
    },
    {
        number: '02', title: 'AI Development & Integration',
        tagline: 'LLMs that work for your business.',
        desc: 'We integrate large language models and AI automation into your existing workflows. From custom chatbots to internal data pipelines, we build AI that generates measurable ROI.',
        features: ['LLM API integration', 'Retrieval-Augmented Gen (RAG)', 'AI Workflow automation', 'Custom prompt engineering'],
        deliverable: 'Integrated AI system', timeline: '4–10 weeks'
    },
    {
        number: '03', title: 'Cloud Infrastructure & DevOps',
        tagline: 'Ship faster. Break nothing.',
        desc: 'Secure, scalable cloud environments with automated CI/CD pipelines. We handle architecture, deployment, monitoring, and security so your team can focus on building.',
        features: ['AWS/GCP architecture', 'CI/CD pipeline setup', 'Kubernetes orchestration', 'Security hardening'],
        deliverable: 'Automated infrastructure', timeline: '3–8 weeks'
    },
    {
        number: '04', title: 'Strategic Technical Consulting',
        tagline: 'The CTO you need, on-demand.',
        desc: 'Fractional CTO services, technical audits, and architectural roadmaps. We help you make the right technical decisions before you build — saving months of rework.',
        features: ['Architecture review', 'Build vs. buy analysis', 'Engineering team assessment', 'Roadmap planning'],
        deliverable: 'Architecture & roadmap', timeline: '1–4 weeks'
    },
    {
        number: '05', title: 'Marketing Systems & Automation',
        tagline: 'Your marketing stack, unified.',
        desc: 'We build unified marketing infrastructure that connects your CRM, email platform, ad accounts, and analytics into one coherent growth engine — fully automated and measurable.',
        features: ['CRM setup & migration', 'Email automation', 'Ad platform integration', 'Attribution modeling'],
        deliverable: 'Connected marketing stack', timeline: '4–8 weeks'
    },
    {
        number: '06', title: 'SEO & Content Strategy',
        tagline: 'Organic growth that compounds.',
        desc: 'Data-backed technical SEO and content strategy to build long-term market authority. We focus on the 20% of optimizations that drive 80% of results.',
        features: ['Technical SEO audit', 'Keyword research', 'Authority building', 'Core Web Vitals'],
        deliverable: 'SEO roadmap & execution', timeline: 'Monthly retainer'
    },
];

const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true }
            });
        }, cardRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="mb-12 lg:mb-16">
            <GSAPTilt>
                <div className="group relative w-full rounded-2xl bg-[#111418] border border-white/5 hover:border-[#FF570F]/30 transition-all duration-500 overflow-hidden flex flex-col lg:flex-row shadow-2xl hover:shadow-[#FF570F]/10">
                    
                    <ParticleBackground />

                    <div className="relative z-10 p-8 lg:p-12 lg:w-[65%] flex flex-col justify-center overflow-hidden">
                        <div className="absolute -bottom-12 -right-6 text-[200px] lg:text-[280px] font-black text-white/[0.03] pointer-events-none leading-none group-hover:scale-105 group-hover:text-[#FF570F]/[0.03] transition-all duration-700 ease-out select-none">
                            {service.number}
                        </div>

                        <div className="relative z-20">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-[#FF570F] font-black text-xl lg:text-2xl">{service.number}.</span>
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black text-white leading-tight drop-shadow-md">{service.title}</h3>
                            </div>
                            <p className="text-[#FF570F] font-bold tracking-widest text-xs uppercase mb-6 drop-shadow-sm">{service.tagline}</p>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 max-w-2xl">{service.desc}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                {service.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 group/feature">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF570F]/60 group-hover/feature:bg-[#FF570F] group-hover/feature:scale-150 transition-all duration-300 flex-shrink-0 shadow-[0_0_8px_rgba(255,87,15,0.5)]" />
                                        <span className="text-gray-400 group-hover/feature:text-gray-200 text-sm font-medium transition-colors duration-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 lg:w-[35%] bg-gradient-to-br from-[#0a0c0e]/80 to-[#111418]/80 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/5 p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
                        
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF570F]/10 blur-[60px] rounded-full group-hover:bg-[#FF570F]/20 transition-colors duration-700 pointer-events-none" />

                        <div className="relative z-20 space-y-8">
                            <div>
                                <span className="text-[10px] text-[#FF570F] font-bold uppercase tracking-widest block mb-2 opacity-80">Deliverable</span>
                                <span className="text-white text-sm lg:text-base font-semibold block">{service.deliverable}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-[#FF570F] font-bold uppercase tracking-widest block mb-2 opacity-80">Timeline</span>
                                <span className="text-white text-sm lg:text-base font-semibold block">{service.timeline}</span>
                            </div>
                        </div>

                        <div className="relative z-20 mt-12 lg:mt-0">
                            <Link 
                                to="/contact" 
                                className="group/btn relative w-full flex items-center justify-between px-6 py-4 bg-[#15181c]/80 backdrop-blur-md border border-white/10 hover:border-[#FF570F] text-white font-bold text-xs uppercase tracking-widest transition-all duration-500 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-[#FF570F]/0 via-[#FF570F]/10 to-[#FF570F]/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out" />
                                <span className="relative z-10 group-hover/btn:text-[#FF570F] transition-colors duration-300">Get a Quote</span>
                                <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-[#FF570F] transition-colors duration-300 shadow-[0_0_15px_rgba(255,87,15,0)] group-hover/btn:shadow-[0_0_15px_rgba(255,87,15,0.4)]">
                                    <svg className="w-4 h-4 text-white group-hover/btn:text-black group-hover/btn:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </GSAPTilt>
        </div>
    );
};

const ServicesPage = () => {
    useSeoMeta(SEO.services);
    const headingRef = useRef(null);
    const prlx1Ref = useRef(null);
    const [textSplit, setTextSplit] = useState(null);

    useEffect(() => {
        if (headingRef.current && !textSplit) {
            const split = new SplitType(headingRef.current, { types: 'words' });
            setTextSplit(split);
            gsap.from(split.words, {
                opacity: 0, y: 30, rotationX: -30, transformOrigin: 'top center', stagger: 0.05, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 80%', once: true },
            });
        }
        return () => { if (textSplit) textSplit.revert(); };
    }, [textSplit]);

    useEffect(() => {
        gsap.to(prlx1Ref.current, { yPercent: 20, ease: "none", scrollTrigger: { scrub: true } });
    }, []);

    return (
        <main className="relative w-full bg-[#0d1012] min-h-screen">
            <Navbar />
            <PageHeader
                title="Services"
                breadcrumb="Services"
                subtitle="Enterprise-grade solutions built for businesses that cannot afford to fail."
            />

            <section className="relative pt-24 pb-16 overflow-hidden">
                <div ref={prlx1Ref} className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF570F]/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
                <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-[#FF570F]/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-flex items-center justify-center px-6 py-2.5 bg-[#FF570F]/10 border border-[#FF570F]/20 text-[#FF570F] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(255,87,15,0.1)]">
                        <span className="w-1.5 h-1.5 bg-[#FF570F] rounded-full mr-3 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        What We Do
                    </span>
                    <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 leading-tight">
                        Solutions That Scale <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-[#FF570F] to-[#ff844f] bg-clip-text text-transparent">With Your Business.</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
                        From technical strategy to full-stack execution, we build systems that drive measurable growth.
                    </p>
                </div>
            </section>

            <section className="pb-32 relative z-10">
                <div className="max-w-[1200px] mx-auto px-6">
                    {servicesData.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </section>

            <section className="relative py-24 bg-[#111418] border-t border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-[#FF570F]/[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">Ready to Build?</h3>
                    <p className="text-lg text-gray-400 mb-10">Book a free technical consultation to discuss your roadmap.</p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-4 px-10 py-5 bg-[#FF570F] text-[#0d1012] font-black text-xs uppercase tracking-[0.15em] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,87,15,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] group rounded-none"
                    >
                        Schedule Consultation
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ServicesPage;