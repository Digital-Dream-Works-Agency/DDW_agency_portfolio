// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-deep-black border-t border-orange-vibrant/10 pt-24 pb-12 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-vibrant rounded-full blur-3xl" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-cream rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-1">
                        <motion.div 
                            className="mb-6 flex items-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-orange-vibrant/30">
                                <img src="/logo.jpeg" alt="DDW Agency Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <span className="text-white font-heading font-bold tracking-tight text-2xl block leading-none">
                                    DDW <span className="gradient-text">Agency</span>
                                </span>
                                <span className="text-text-muted text-xs uppercase tracking-wider">Enterprise Solutions</span>
                            </div>
                        </motion.div>
                        
                        <p className="text-text-muted text-sm leading-relaxed mb-8">
                            High-margin technical consulting and production-ready software systems for enterprise brands.
                        </p>
                        
                        <div className="flex gap-4">
                            {[
                                {
                                    label: 'LinkedIn',
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    ),
                                    url: "#"
                                },
                                {
                                    label: 'Instagram',
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    ),
                                    url: "#"
                                }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="magnetic w-12 h-12 rounded-full border-2 border-orange-vibrant/20 flex items-center justify-center hover:bg-orange-vibrant hover:border-orange-vibrant transition-all group"
                                    aria-label={social.label}
                                >
                                    <span className="text-orange-vibrant group-hover:text-deep-black transition-colors">
                                        {social.icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-heading font-bold mb-8 text-pure-white">Our Focus</h4>
                        <ul className="space-y-4 text-sm text-text-muted">
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Custom Software</li>
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">AI Integration</li>
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Marketing Tech</li>
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Strategic Advisory</li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-heading font-bold mb-8 text-pure-white">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-text-muted">
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">
                                <Link to="/projects">Portfolio</Link>
                            </li>
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Our Approach</li>
                            <li>
                                <a href="https://ddwstudio.com" target="_blank" rel="noopener noreferrer" className="text-orange-vibrant font-bold hover:text-cream transition-colors">
                                    Visit DDW Studio →
                                </a>
                            </li>
                            <li className="hover:text-orange-vibrant cursor-pointer transition-colors hover:translate-x-1 transform duration-300">Book a Call</li>
                        </ul>
                    </div>

                    {/* Office */}
                    <div>
                        <h4 className="text-lg font-heading font-bold mb-8 text-pure-white">Offices</h4>
                        <ul className="space-y-6 text-sm text-text-muted">
                            <li className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-[10px] text-orange-vibrant font-bold mt-0.5 group-hover:bg-orange-vibrant group-hover:text-deep-black transition-all">
                                    IT
                                </div>
                                <span className="group-hover:text-orange-vibrant transition-colors">Rome, <br />Italy</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-vibrant/30 flex items-center justify-center text-[10px] text-orange-vibrant font-bold mt-0.5 group-hover:bg-orange-vibrant group-hover:text-deep-black transition-all">
                                    US
                                </div>
                                <span className="group-hover:text-orange-vibrant transition-colors">Florida, <br />USA</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="pt-12 border-t border-orange-vibrant/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-text-muted text-sm">
                        © {currentYear} <span className="text-orange-vibrant font-bold">DDW Agency</span>. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-text-muted">
                        <span className="hover:text-orange-vibrant cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-orange-vibrant cursor-pointer transition-colors">Terms & Conditions</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;