import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const servicesData = [
    {
        number: '01',
        title: 'Custom Software Development',
        tagline: 'Built for scale. Designed for growth.',
        desc: 'Enterprise-grade web applications, internal tools, and bespoke system architecture designed for high-stakes operations. We architect systems that are maintainable, scalable, and built to last.',
        features: [
            'Full-stack web application development',
            'API design and third-party integrations',
            'Database architecture and optimization',
            'Legacy system modernization',
            'Code audits and technical due diligence',
        ],
        deliverable: 'Production-ready system with full documentation',
        timeline: '6–16 weeks',
        color: 'from-orange-vibrant to-orange-soft',
        img: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        number: '02',
        title: 'AI Development & Integration',
        tagline: 'LLMs that work for your business, not the other way around.',
        desc: 'We integrate large language models and AI automation into your existing workflows. From customer-facing chatbots to internal data pipelines, we build AI that generates measurable ROI.',
        features: [
            'LLM API integration (OpenAI, Anthropic, custom)',
            'Retrieval-Augmented Generation (RAG) systems',
            'Workflow automation with AI decision layers',
            'Custom fine-tuning and prompt engineering',
            'AI-powered analytics dashboards',
        ],
        deliverable: 'Integrated AI system with monitoring dashboard',
        timeline: '4–10 weeks',
        color: 'from-cream to-orange-vibrant',
        img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        number: '03',
        title: 'Cloud Infrastructure & DevOps',
        tagline: 'Ship faster. Break nothing.',
        desc: 'Secure, scalable cloud environments with automated CI/CD pipelines. We handle architecture, deployment, monitoring, and security so your team can focus on building.',
        features: [
            'AWS / GCP / Azure architecture design',
            'Automated CI/CD pipeline setup',
            'Docker and Kubernetes orchestration',
            'Security hardening and compliance',
            'Performance monitoring and alerting',
        ],
        deliverable: 'Fully automated infrastructure with runbook',
        timeline: '3–8 weeks',
        color: 'from-orange-soft to-maroon-dark',
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    },
    {
        number: '04',
        title: 'Strategic Technical Consulting',
        tagline: 'The CTO you need, without the full-time cost.',
        desc: 'Fractional CTO services, technical audits, and architectural roadmaps. We help you make the right technical decisions before you build — saving months of rework and hundreds of thousands in wasted budget.',
        features: [
            'Technical architecture review',
            'Build vs. buy analysis',
            'Engineering team assessment',
            'Vendor and technology selection',
            'Roadmap planning and prioritization',
        ],
        deliverable: 'Architecture document + prioritized roadmap',
        timeline: '1–4 weeks',
        color: 'from-orange-vibrant to-cream',
        img: 'https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        number: '05',
        title: 'Marketing Systems & Automation',
        tagline: 'Your marketing stack, finally connected.',
        desc: 'We build unified marketing infrastructure that connects your CRM, email platform, ad accounts, and analytics into one coherent growth engine — fully automated and measurable.',
        features: [
            'CRM setup and migration (HubSpot, Salesforce)',
            'Email automation sequences',
            'Ad platform integration and tracking',
            'Attribution modeling',
            'Reporting dashboards',
        ],
        deliverable: 'Connected marketing stack with SOP documentation',
        timeline: '4–8 weeks',
        color: 'from-cream to-orange-soft',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    },
    {
        number: '06',
        title: 'SEO & Content Strategy',
        tagline: 'Organic growth that compounds.',
        desc: 'Data-backed technical SEO and content strategy to build long-term market authority. We focus on the 20% of optimizations that drive 80% of results — not vanity metrics.',
        features: [
            'Technical SEO audit and fixes',
            'Keyword research and content planning',
            'Link building and authority building',
            'Core Web Vitals optimization',
            'Monthly performance reporting',
        ],
        deliverable: 'SEO roadmap + monthly execution report',
        timeline: 'Ongoing monthly retainer',
        color: 'from-orange-vibrant to-maroon-dark',
        img: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
];

const ServicesPage = () => {
    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
<PageHeader
    title="Our Services"
    breadcrumb="Services"
    subtitle="Enterprise-grade solutions built for businesses that cannot afford to fail."
/>
            <section className="py-20 bg-deep-black">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="space-y-8">
                        {servicesData.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: index * 0.05 }}
                                className="group grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-orange-vibrant/10 hover:border-orange-vibrant/40 transition-all duration-500 bg-bg-surface"
                            >
                                {/* Image col */}
                                <div className="lg:col-span-3 overflow-hidden relative h-48 lg:h-auto">
                                    <img
                                        src={service.img}
                                        alt={service.title}
                                        className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-surface hidden lg:block" />
                                    <div className="absolute top-6 left-6">
                                        <span className="text-5xl font-black text-orange-vibrant/20 group-hover:text-orange-vibrant/40 transition-colors duration-500">
                                            {service.number}
                                        </span>
                                    </div>
                                </div>

                                {/* Content col */}
                                <div className="lg:col-span-6 p-8 lg:p-10">
                                    <div className={`inline-block w-10 h-1 bg-gradient-to-r ${service.color} rounded-full mb-4`} />
                                    <h3 className="text-2xl md:text-3xl font-heading font-black text-pure-white mb-2 group-hover:text-orange-vibrant transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-orange-vibrant text-sm font-bold mb-4 italic">{service.tagline}</p>
                                    <p className="text-text-muted text-sm leading-relaxed mb-6">{service.desc}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-pure-white/70">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} flex-shrink-0`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Meta col */}
                                <div className="lg:col-span-3 p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-orange-vibrant/10 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-[10px] text-orange-vibrant font-bold uppercase tracking-widest mb-1">Deliverable</div>
                                            <div className="text-sm text-pure-white/80">{service.deliverable}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-orange-vibrant font-bold uppercase tracking-widest mb-1">Timeline</div>
                                            <div className="text-sm text-pure-white/80">{service.timeline}</div>
                                        </div>
                                    </div>
                                    <Link
                                        to="/contact"
                                        className="mt-8 w-full text-center px-6 py-3 bg-orange-vibrant text-deep-black font-bold text-xs uppercase tracking-wider hover:bg-cream transition-all duration-300 block"
                                    >
                                        Get a Quote
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ServicesPage;    