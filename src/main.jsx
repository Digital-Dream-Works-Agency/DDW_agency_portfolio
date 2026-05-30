import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import App from './App.jsx';

// ─── GSAP Plugin Registration ──────────────────────────────────────────────────
// Register once at the application entry point.
// GSAP silently ignores duplicate calls, but components calling registerPlugin
// at module scope still carry evaluation overhead. This central registration
// ensures correctness and makes the dependency explicit.
gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

