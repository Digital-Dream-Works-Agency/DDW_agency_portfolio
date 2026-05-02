import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Solutions from '../components/SolutionsData';
import AboutSection from '../components/AboutSection';
import Testimonials from '../components/Testimonial';
import Collaborate from '../components/Collaborate';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
            <Hero />
            <Stats />
            <Solutions />
            <AboutSection />
            <Testimonials />
            <Collaborate />
            <Footer />
        </main>
    );
};

export default Home;