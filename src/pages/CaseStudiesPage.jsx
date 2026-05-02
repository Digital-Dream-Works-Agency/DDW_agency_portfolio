import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import CaseStudies from '../components/CaseStudies';

const CaseStudiesPage = () => {
    return (
        <main className="relative w-full bg-deep-black">
            <Navbar />
<PageHeader
    title="Case Studies"
    breadcrumb="Case Studies"
    subtitle="Real numbers. Real clients. Platform dashboards you can verify yourself."
/>            <CaseStudies />
            <Footer />
        </main>
    );
};

export default CaseStudiesPage;