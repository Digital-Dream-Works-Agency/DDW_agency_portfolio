// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/Projectspage';
import ServicesPage from './pages/ServicesPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <ScrollToTop />
      <SmoothScroll>
        <div className="App relative w-full bg-deep-black min-h-screen">
          <CustomCursor />
          
          {/* GSAP Loading Screen */}
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          
          {/* Main App Content - Wait for loader to finish */}
          <div className={isLoading ? "h-screen overflow-hidden" : ""}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </div>
        </div>
      </SmoothScroll>
    </Router>
  );
}

export default App;