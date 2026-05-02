// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Collaborators from '../components/Collaborators';
import Solutions from '../components/SolutionsData';
import AboutSection from '../components/AboutSection';
import Testimonials from '../components/Testimonial';
import Collaborate from '../components/Collaborate';
import Footer from '../components/Footer';
import Stats from '../components/Stats';
import HomePortfolio from '../components/Homepage_projects';
import CaseStudies from '../components/CaseStudies'; // NEW IMPORT

const Home = () => {
    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <Hero />
            <Stats />
            <Collaborators />
            <Solutions />
            <AboutSection />
            <HomePortfolio />
            <CaseStudies /> {/* NEW SECTION */}
            <Testimonials />
            <Collaborate />
            <Footer />
        </main>
    );
};

export default Home;