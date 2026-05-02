import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const values = [
    {
        number: '01',
        title: 'No Bullshit Engineering',
        desc: 'We build what you need, not what sounds impressive. Every technical decision is justified by business outcomes.',
    },
    {
        number: '02',
        title: 'Skin in the Game',
        desc: 'We tie our success to yours. If your system fails, we failed. That accountability shapes every line of code we write.',
    },
    {
        number: '03',
        title: 'Speed Without Shortcuts',
        desc: 'We move fast because we have done this before. Not because we skip tests, documentation, or architecture.',
    },
    {
        number: '04',
        title: 'Radical Transparency',
        desc: 'You know exactly what we are building, why, and when it ships. No surprises. No excuses.',
    },
];

const AboutSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.about-fade',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative py-32 bg-deep-black text-white overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-vibrant/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cream/3 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Top section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-28">

                    {/* Left image stack */}
                    <div className="about-fade relative hidden lg:block">
                        <div className="relative h-[580px]">
                            {/* Main large image */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-orange-vibrant/20 shadow-2xl">
                                <img
                                    src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Team"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 to-transparent" />
                            </div>

                            {/* Overlapping smaller image */}
                            <div className="absolute -bottom-8 -right-8 w-56 h-64 rounded-2xl overflow-hidden border-4 border-deep-black shadow-2xl z-10">
                                <img
                                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400"
                                    alt="Discussion"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Experience badge */}
                            <div className="absolute top-8 -left-8 bg-orange-vibrant rounded-2xl p-6 z-10 shadow-xl shadow-orange-vibrant/40">
                                <div className="text-5xl font-black text-deep-black leading-none">10</div>
                                <div className="text-xs font-black uppercase tracking-widest text-deep-black/70 mt-1">Years<br />Experience</div>
                            </div>

                            {/* Projects badge */}
                            <div className="absolute bottom-20 -left-6 bg-bg-surface border border-orange-vibrant/30 rounded-xl p-4 z-20 shadow-xl">
                                <div className="text-2xl font-black text-pure-white">150+</div>
                                <div className="text-[10px] text-text-muted uppercase tracking-widest">Completed Projects</div>
                            </div>
                        </div>
                    </div>

                    {/* Right content */}
                    <div>
                        <div className="about-fade inline-block mb-6">
                            <span className="px-5 py-2 border border-orange-vibrant/30 bg-orange-vibrant/5 text-orange-vibrant text-xs font-bold uppercase tracking-[0.25em]">
                                Who We Are
                            </span>
                        </div>

                        <h2 className="about-fade text-5xl md:text-6xl font-heading font-black leading-[1.05] mb-8 text-pure-white">
                            We Are Not An Agency.<br />
                            <span className="gradient-text">We Are A Partner.</span>
                        </h2>

                        <div className="about-fade space-y-5 text-pure-white/70 leading-relaxed mb-10">
                            <p>
                                DDW Agency was built by engineers and growth operators who were frustrated with agencies that overpromise and underdeliver. So we built the firm we always wanted to hire.
                            </p>
                            <p>
                                We operate as an embedded technical partner — not a vendor. We sit inside your business, understand your constraints, and build systems that actually move the needle. Our clients don't come to us for websites. They come to us when the stakes are high.
                            </p>
                        </div>

                        <div className="about-fade grid grid-cols-2 gap-4 mb-10">
                            {[
                                { value: '$50M+', label: 'Revenue Generated for Clients' },
                                { value: '600%', label: 'Peak ROAS Achieved' },
                                { value: '99.9%', label: 'System Uptime SLA' },
                                { value: '24hr', label: 'Average Response Time' },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="p-5 rounded-xl border border-orange-vibrant/15 bg-bg-surface/50"
                                >
                                    <div className="text-2xl font-black gradient-text mb-1">{stat.value}</div>
                                    <div className="text-xs text-text-muted leading-snug">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="about-fade">
                            <Link
                                to="/contact"
                                className="magnetic inline-flex items-center gap-3 px-8 py-4 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 shadow-lg shadow-orange-vibrant/30 group"
                            >
                                Work With Us
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Values grid */}
                <div className="about-fade border-t border-orange-vibrant/10 pt-20">
                    <div className="text-center mb-14">
                        <h3 className="text-3xl md:text-4xl font-heading font-black text-pure-white mb-3">
                            How We <span className="gradient-text">Operate</span>
                        </h3>
                        <p className="text-text-muted max-w-xl mx-auto text-sm">
                            Four principles that govern every project, every client, every line of code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v) => (
                            <div
                                key={v.number}
                                className="about-fade group p-7 rounded-2xl border border-orange-vibrant/10 hover:border-orange-vibrant/40 bg-bg-surface/50 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="text-4xl font-black text-orange-vibrant/20 group-hover:text-orange-vibrant/40 transition-colors duration-500 mb-4">
                                    {v.number}
                                </div>
                                <h4 className="text-lg font-heading font-bold text-pure-white mb-3 group-hover:text-orange-vibrant transition-colors duration-300">
                                    {v.title}
                                </h4>
                                <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutSection;