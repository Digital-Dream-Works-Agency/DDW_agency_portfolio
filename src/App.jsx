// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectsPage from './pages/Projectspage';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

const AppContent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SmoothScroll>
      <div className="App">
        <CustomCursor />
        <LoadingScreen isLoading={loading} />

        {!loading && (
          <Routes>
            <Route path="/" element={
              <PageTransition><Home /></PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition><ProjectsPage /></PageTransition>
            } />
          </Routes>
        )}
      </div>
    </SmoothScroll>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;