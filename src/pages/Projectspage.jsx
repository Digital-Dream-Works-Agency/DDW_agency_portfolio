// src/pages/ProjectsPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Allprojects from '../components/Allprojects';
import { useSeoMeta, SEO } from '../lib/useSeoMeta';

const ProjectsPage = () => {
    useSeoMeta(SEO.projects);
    return (
        <main className="relative w-full bg-deep-black text-white">
            <Navbar />
            <PageHeader
                title="Work We've Done"
                breadcrumb="Portfolio"
                subtitle="Real accounts. Real numbers. Every result below is from a live retainer — dashboard screenshots available on request."
            />
            <Allprojects />
            <Footer />
        </main>
    );
};

export default ProjectsPage;