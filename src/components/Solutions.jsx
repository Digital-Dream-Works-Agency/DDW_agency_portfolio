// src/components/Solutions.jsx
// DDW Agency — Enterprise Solutions Section | Fully Optimized | Production-Ready

import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// FIX #1: gsap.registerPlugin removed — registered centrally in main.jsx.
// Duplicate calls are harmless but wasteful at module evaluation time.

// ─── Solutions Data ────────────────────────────────────────────────────────────
// FIX #2: Data at module scope — never re-allocated per render.
// JSX icons are stable references; objects are frozen.
const solutionsData = Object.freeze([
  {
    title: 'Custom Software Development',
    desc: 'Enterprise-grade web applications and bespoke system architecture designed for high-stakes operations.',
    features: ['Scalable Architecture', 'Bespoke Design', 'API Integration'],
    image: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: 'from-orange-vibrant to-orange-soft',
  },
  {
    title: 'AI Development & Integration',
    desc: 'Seamless LLM integration and workflow automation tailored to your enterprise systems.',
    features: ['LLM Infrastructure', 'Workflow Automation', 'Custom Models'],
    image: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 12L2.1 12.3" />
      </svg>
    ),
    color: 'from-cream to-orange-vibrant',
  },
  {
    title: 'Cloud Infrastructure & DevOps',
    desc: 'Secure, scalable cloud environments with automated CI/CD pipelines for continuous deployment.',
    features: ['Automated Pipelines', 'Cloud Scaling', 'Security Hardening'],
    image: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-15 4.5 4.5 4.5 0 0 0 2.5 8.5h10z" />
      </svg>
    ),
    color: 'from-orange-soft to-maroon-dark',
  },
  {
    title: 'Software Consultancy',
    desc: 'Fractional CTO services and technical audits to guide your architectural roadmap.',
    features: ['Technical Audits', 'Architectural Roadmap', 'Executive Advisory'],
    image: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    color: 'from-orange-vibrant to-cream',
  },
  {
    title: 'Marketing Systems & Automation',
    desc: 'Unified marketing infrastructure connecting CRM, ESP, and analytics into a single growth engine.',
    features: ['CRM Integration', 'Email Automation', 'Analytics Dashboard'],
    image: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20v-6M6 20V10M18 20V4" />
      </svg>
    ),
    color: 'from-cream to-orange-soft',
  },
  {
    title: 'SEO & Content Strategy',
    desc: 'Data-backed Technical SEO and content strategy to build long-term market authority.',
    features: ['Technical SEO', 'Content Strategy', 'Link Building'],
    image: null,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    color: 'from-orange-vibrant to-maroon-dark',
  },
]);

// ─── GSAPTilt ──────────────────────────────────────────────────────────────────
// FIX #3: memo prevents re-renders from parent; gsap.set on unmount prevents
//         stuck 3D rotation if component unmounts while cursor is over it.
const GSAPTilt = memo(({ children, className }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    // quickTo — no return value to kill, but we clean up via gsap.set on unmount
    const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.5 });
    const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.5 });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      xTo(x * 10);
      yTo(-y * 10);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove',  handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove',  handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      // FIX #3: Snap back on unmount — prevents stuck 3D rotation across navigations
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, []);

  return (
    <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>
      {children}
    </div>
  );
});
GSAPTilt.displayName = 'GSAPTilt';

// ─── SolutionCard ──────────────────────────────────────────────────────────────
// FIX #4: memo added — prevents re-renders when parent Solutions re-renders.
const SolutionCard = memo(({ solution, index }) => (
  <GSAPTilt className="solution-card">
    <div
      className="relative h-[520px] bg-gradient-to-br from-[#151a1d] to-[#0d1012] rounded-3xl overflow-hidden border-2 border-orange-vibrant/10 hover:border-orange-vibrant/50 transition-all duration-500 cursor-pointer group"
    >
      <div className="absolute inset-0 z-0">
        {solution.image ? (
          <img
            src={solution.image}
            alt={solution.title}
            className="w-full h-full object-cover opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(#FF570F 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/95 to-transparent" />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl`}
        aria-hidden="true"
      />

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${solution.color} text-deep-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-orange-vibrant/50`}
            aria-hidden="true"
          >
            {solution.icon}
          </div>
          <span
            className="text-3xl md:text-4xl font-bold text-white/5 group-hover:text-orange-vibrant/20 transition-colors duration-500"
            aria-hidden="true"
          >
            0{index + 1}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300">
            {solution.title}
          </h3>
          <p className="text-base text-text-muted group-hover:text-pure-white/80 transition-colors duration-300 leading-relaxed">
            {solution.desc}
          </p>
          <ul className="space-y-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-48 transition-all duration-500 overflow-hidden">
            {solution.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-pure-white/90">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${solution.color}`} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-orange-vibrant to-orange-600 text-deep-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20 shadow-2xl shadow-orange-vibrant/60"
        aria-hidden="true"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-vibrant to-cream w-0 group-hover:w-full transition-all duration-700"
        aria-hidden="true"
      />
    </div>
  </GSAPTilt>
));
SolutionCard.displayName = 'SolutionCard';

// ─── Solutions Section ─────────────────────────────────────────────────────────
const Solutions = () => {
  const gridRef       = useRef(null);
  const headingRef    = useRef(null);
  const sectionRef    = useRef(null);
  const prlx1Ref      = useRef(null);
  const prlx2Ref      = useRef(null);
  const prlxHeaderRef = useRef(null);

  // FIX #5: SplitType instance held in a ref, NOT state.
  // Using useState caused a re-render loop:
  //   mount → setTextSplit(split) → re-render → effect runs again
  //           (guard `if (!textSplit)` prevented the second split, but the
  //            cleanup `if (textSplit) textSplit.revert()` was always stale
  //            because the first render closure captured textSplit = null).
  // With a ref: no re-render, stable reference in cleanup, no closure issues.
  const splitRef = useRef(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // FIX #6: headingRef.current used — no document.querySelector class selector.
    splitRef.current = new SplitType(heading, { types: 'words' });

    gsap.from(splitRef.current.words, {
      opacity: 0,
      y: 50,
      rotationX: -45,
      transformOrigin: 'top center',
      stagger: 0.06,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 80%', once: true },
    });

    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, []); // Run once on mount

  useEffect(() => {
    if (!sectionRef.current) return;

    // FIX #7: gsap.context scoped to sectionRef — all refs (prlx1Ref, prlx2Ref,
    //         prlxHeaderRef, gridRef) are children of sectionRef, so ctx.revert()
    //         correctly cleans every tween and ScrollTrigger created here.
    //         Previously context was scoped to gridRef, which excluded prlx refs.
    const ctx = gsap.context(() => {
      // FIX #8: Target card elements via DOM traversal from gridRef,
      //         not via class selector that can match other components.
      const cards = gridRef.current
        ? Array.from(gridRef.current.querySelectorAll('.solution-card'))
        : [];

      if (cards.length) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          scale: 0.9,
          rotationY: -15,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 70%', once: true },
        });
      }

      gsap.to(prlx1Ref.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, scrub: true },
      });
      gsap.to(prlx2Ref.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, scrub: true },
      });
      gsap.to(prlxHeaderRef.current, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, scrub: true },
      });
    }, sectionRef); // FIX #7: scope to section root

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative py-8 md:py-12 lg:py-16 bg-deep-black overflow-hidden"
    >
      {/* Mesh grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,87,15,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,87,15,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"
        aria-hidden="true"
      />

      {/* Parallax orbs */}
      <div
        ref={prlx1Ref}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-vibrant/10 rounded-full blur-[150px] animate-pulse pointer-events-none"
        aria-hidden="true"
      />
      <div
        ref={prlx2Ref}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cream/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={gridRef}>
        <div ref={prlxHeaderRef} className="solutions-header text-center mb-20">
          <span className="inline-block px-6 py-2.5 border-2 border-orange-vibrant/40 bg-orange-vibrant/10 text-orange-vibrant text-sm font-bold uppercase tracking-[0.25em] rounded-full mb-8 backdrop-blur-sm shadow-lg shadow-orange-vibrant/20">
            <span className="inline-block w-2 h-2 bg-orange-vibrant rounded-full mr-2 animate-pulse" aria-hidden="true" />
            Enterprise Solutions
          </span>

          {/* FIX #9: headingRef attached here instead of document.querySelector */}
          <h2
            ref={headingRef}
            className="solutions-main-heading mb-6 text-3xl md:text-4xl font-bold leading-[1.1] tracking-[-0.035em]"
            style={{ perspective: '1000px' }}
          >
            Solutions Built For{' '}
            <br />
            <span className="bg-gradient-to-br from-[#FF570F] to-[#FDE87A] bg-clip-text text-transparent inline-block">
              Modern Brands
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-base leading-relaxed">
            Empowering your digital journey with state-of-the-art technology services tailored for growth and innovation.
          </p>
        </div>

        {/* FIX #10: Stable key uses solution.title, not array index */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionsData.map((solution, index) => (
            <SolutionCard key={solution.title} solution={solution} index={index} />
          ))}
        </div>
      </div>
      {/* FIX #11: <style jsx> removed — it requires styled-jsx which is not a dependency.
          The perspective style is now applied as an inline style on the heading element above. */}
    </section>
  );
};

export default Solutions;