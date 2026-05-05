// src/pages/Home.jsx
import React from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import ServicesGrid from '../components/ServicesGrid';
import AboutSection from '../components/AboutSection';
import HomeProjects from '../components/Homepage_projects';
import ProductsSection from '../components/ProductsSection';
import Testimonials from '../components/Testimonial';
import Collaborate from '../components/Collaborate';
import Footer from '../components/Footer';

const Home = () => {
    useSeoMeta(SEO.home);
    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <Hero />
            <Stats />
            <ServicesGrid />
            <HomeProjects />
            <ProductsSection />
            <Testimonials />
            <AboutSection />
            <Collaborate />
            <Footer />
        </main>
    );
};

export default Home;
