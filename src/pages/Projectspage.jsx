import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Allprojects from '../components/Allprojects';

const ProjectsPage = () => {
    return (
        <main className="relative w-full bg-deep-black text-white">
            <Navbar />
            <PageHeader
                title="Our Portfolio"
                breadcrumb="Portfolio"
                subtitle="150+ projects delivered across custom software, AI integration, and marketing infrastructure."
            />
            <Allprojects />
            <Footer />
        </main>
    );
};

export default ProjectsPage;