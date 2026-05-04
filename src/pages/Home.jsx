// src/pages/Home.jsx - COMPLETE WITH PROJECTS SECTION
import React from 'react';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Solutions from '../components/SolutionsData';
import AboutSection from '../components/AboutSection';
import HomeProjects from '../components/Homepage_projects'; // ✅ IMPORT KIYA
import CaseStudies from '../components/CaseStudies';
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
            <Solutions />
            <AboutSection />
            <HomeProjects /> {/* ✅ ADDED - Projects slider section */}
            <Testimonials />
            <Collaborate />
            <Footer />
        </main>
    );
};

export default Home;