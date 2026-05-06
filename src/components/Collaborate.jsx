// src/components/Collaborate.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// ─── Native GSAP Tilt Component ────────────────────────────────────────────────
const GSAPTilt = ({ children, className }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'rotationY', { ease: 'power2.out', duration: 0.5 });
    const yTo = gsap.quickTo(el, 'rotationX', { ease: 'power2.out', duration: 0.5 });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(x * 8);
      yTo(-y * 8);
    };
    const handleMouseLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div ref={tiltRef} className={className} style={{ transformPerspective: 1000 }}>{children}</div>;
};

// ─── Magnetic Hook ─────────────────────────────────────────────────────────────
const useMagneticEffect = (ref, strength = 0.3) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - rect.left - rect.width / 2) * strength);
      yTo((e.clientY - rect.top - rect.height / 2) * strength);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
};

// ─── Magnetic Button ───────────────────────────────────────────────────────────
const MagneticButton = ({ href, children }) => {
  const ref = useRef(null);
  useMagneticEffect(ref, 0.25);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group inline-flex items-center gap-3 bg-orange-vibrant text-deep-black font-bold text-sm uppercase tracking-widest px-12 py-6 overflow-hidden shadow-2xl shadow-orange-vibrant/40 hover:shadow-cream/30 transition-shadow duration-500"
    >
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <span className="absolute inset-0 bg-cream scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </a>
  );
};

// ─── Abstract Animated Visual (No Stock Images) ────────────────────────────────
const AbstractCTAVisual = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orbiting dots
      gsap.to('.orb-dot-1', { rotation: 360, duration: 8, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('.orb-dot-2', { rotation: -360, duration: 12, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('.orb-dot-3', { rotation: 360, duration: 18, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

      // Glow pulse
      gsap.to('.abs-glow-a', { scale: 1.25, opacity: 0.6, duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut' });
      gsap.to('.abs-glow-b', { scale: 0.8, opacity: 0.4, duration: 6, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1.5 });

      // Center icon breathe
      gsap.to('.abs-center', { scale: 1.06, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      // Floating bars (data / analytics feel)
      gsap.to('.bar-1', { scaleY: 0.4, duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut', transformOrigin: 'bottom' });
      gsap.to('.bar-2', { scaleY: 0.6, duration: 1.6, repeat: -1, yoyo: true, ease: 'power1.inOut', transformOrigin: 'bottom', delay: 0.3 });
      gsap.to('.bar-3', { scaleY: 0.3, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut', transformOrigin: 'bottom', delay: 0.6 });
      gsap.to('.bar-4', { scaleY: 0.7, duration: 1.4, repeat: -1, yoyo: true, ease: 'power1.inOut', transformOrigin: 'bottom', delay: 0.1 });
      gsap.to('.bar-5', { scaleY: 0.5, duration: 1.8, repeat: -1, yoyo: true, ease: 'power1.inOut', transformOrigin: 'bottom', delay: 0.9 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative w-full h-80 flex items-center justify-center select-none">
      {/* Ambient glows */}
      <div className="abs-glow-a absolute w-56 h-56 rounded-full bg-orange-vibrant/15 blur-[60px]" />
      <div className="abs-glow-b absolute w-32 h-32 rounded-full bg-[#FDE87A]/10 blur-[40px]" />

      {/* Outer orbit ring */}
      <div className="orb-dot-3 absolute w-72 h-72 rounded-full border border-dashed border-orange-vibrant/15" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,87,15,0.5)', marginTop: -4 }} />
      </div>

      {/* Mid orbit ring */}
      <div className="orb-dot-2 absolute w-52 h-52 rounded-full border border-orange-vibrant/20" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FDE87A', marginRight: -3 }} />
      </div>

      {/* Inner orbit ring */}
      <div className="orb-dot-1 absolute w-36 h-36 rounded-full border border-orange-vibrant/30" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF570F', marginBottom: -2.5 }} />
      </div>

      {/* Center card */}
      <div className="abs-center relative z-10 w-28 h-28 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-orange-vibrant/30 shadow-2xl shadow-orange-vibrant/20">
        {/* Animated bars — analytics/ROAS feel */}
        <div className="flex items-end gap-[3px] h-8 mb-2">
          <div className="bar-1 w-2 bg-gradient-to-t from-orange-vibrant to-[#FDE87A] rounded-sm" style={{ height: '100%' }} />
          <div className="bar-2 w-2 bg-gradient-to-t from-orange-vibrant to-[#FDE87A] rounded-sm" style={{ height: '80%' }} />
          <div className="bar-3 w-2 bg-gradient-to-t from-orange-vibrant to-[#FDE87A] rounded-sm" style={{ height: '60%' }} />
          <div className="bar-4 w-2 bg-gradient-to-t from-orange-vibrant to-[#FDE87A] rounded-sm" style={{ height: '90%' }} />
          <div className="bar-5 w-2 bg-gradient-to-t from-orange-vibrant to-[#FDE87A] rounded-sm" style={{ height: '70%' }} />
        </div>
        <span className="text-[9px] font-bold text-orange-vibrant/70 uppercase tracking-widest">20 min</span>
      </div>
    </div>
  );
};

// ─── Floating Stat Pill ────────────────────────────────────────────────────────
const StatPill = ({ value, label, delay }) => {
  const pillRef = useRef(null);
  useEffect(() => {
    gsap.to(pillRef.current, {
      y: -10, duration: 2 + delay, repeat: -1, yoyo: true, ease: 'sine.inOut', delay,
    });
  }, [delay]);

  return (
    <div ref={pillRef} className="absolute bg-deep-black/80 backdrop-blur-md border border-orange-vibrant/30 rounded-2xl px-5 py-3 shadow-2xl shadow-orange-vibrant/10">
      <div className="text-xl font-black text-orange-vibrant">{value}</div>
      <div className="text-xs text-pure-white/50 uppercase tracking-wider">{label}</div>
    </div>
  );
};

// ─── Agenda Data (from new code) ───────────────────────────────────────────────
const agendaItems = [
  {
    num: '01',
    title: "Look at what you're running",
    desc: "We look at the actual account — spend, ROAS, structure, where the budget goes. Not a questionnaire. The real numbers.",
  },
  {
    num: '02',
    title: 'Tell you exactly where the gap is',
    desc: "There's usually one thing costing the most. We'll name it in plain terms, not agency jargon.",
  },
  {
    num: '03',
    title: "Tell you plainly if we're the right fit",
    desc: "If DDW isn't the right team for your account, we'll say so on the call. No follow-up unless you ask for one.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const Collaborate = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);
  const prlxGlowRef = useRef(null);

  // ── SplitType text reveal ──
  useEffect(() => {
    if (!headingRef.current) return;
    const split = new SplitType(headingRef.current, { types: 'words' });

    gsap.from(split.words, {
      opacity: 0, y: 60, rotationX: -40, transformOrigin: 'top center',
      stagger: 0.08, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
    });

    return () => split.revert();
  }, []);

  // ── Other animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        opacity: 0, x: -40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.from(ctaRef.current, {
        opacity: 0, y: 30, scale: 0.95, duration: 0.8, delay: 0.5, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.from('.collab-sub', {
        opacity: 0, y: 20, duration: 0.75, ease: 'power2.out',
        scrollTrigger: { trigger: '.collab-sub', start: 'top 88%', once: true },
      });
      gsap.from('.agenda-item', {
        opacity: 0, x: -24, duration: 0.65, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.agenda-item', start: 'top 88%', once: true },
      });

      // Parallax glow
      gsap.to(prlxGlowRef.current, {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 w-full overflow-hidden bg-deep-black border-y border-orange-vibrant/20">

      {/* ── Animated grid overlay ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,87,15,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,15,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
        }}
      />

      {/* ── Background glow blobs ── */}
      <div ref={prlxGlowRef} className="absolute top-0 left-0 w-96 h-96 bg-orange-vibrant/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-orange-vibrant/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#630D00]/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Main Content ── */}
          <div>
            {/* Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-3 px-6 py-3 border border-orange-vibrant/40 mb-10 backdrop-blur-sm bg-orange-vibrant/8 shadow-lg shadow-orange-vibrant/15">
              <span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse shadow-lg shadow-orange-vibrant/80" />
              <span className="text-orange-vibrant text-xs font-bold tracking-[0.3em] uppercase">Discovery Call</span>
              <span className="w-2 h-2 rounded-full bg-orange-vibrant animate-pulse shadow-lg shadow-orange-vibrant/80" />
            </div>

            {/* Heading — new content, old SplitType animation */}
            <h2 ref={headingRef} className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.05] mb-4 tracking-tight text-pure-white perspective-1000">
              Every month with the wrong team is budget that
            </h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.05] mb-10 tracking-tight" style={{ background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }}>
              doesn&rsquo;t compound.
            </h2>

            {/* Sub copy — new content */}
            <p className="collab-sub text-pure-white/60 text-lg leading-relaxed mb-4 max-w-lg">
              At $50K/month in ad spend, a 1x improvement in ROAS is worth more than the retainer costs in a year. There&rsquo;s one thing we say on every first call that most agencies won&rsquo;t. It usually tells you in 10 minutes whether we&rsquo;re worth your time.
            </p>
            <p className="collab-sub text-pure-white/50 text-sm leading-relaxed mb-10 max-w-lg font-bold">
              Book 20 minutes. Here&rsquo;s what happens on the call:
            </p>

            {/* Agenda items — new content */}
            <div className="space-y-6 mb-12">
              {agendaItems.map((item) => (
                <div key={item.num} className="agenda-item flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-orange-vibrant/30 bg-orange-vibrant/10 shadow-md">
                    <span className="text-orange-vibrant font-mono text-sm font-bold">{item.num}</span>
                  </div>
                  <div>
                    <h3 className="text-pure-white font-bold text-base mb-1">{item.title}</h3>
                    <p className="text-pure-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA — old magnetic button, new label + URL */}
            <div ref={ctaRef}>
              <MagneticButton href="https://calendly.com/digi-dreamworks/onboarding-call">
                Book the 20-Minute Call
              </MagneticButton>
            </div>
          </div>

          {/* ── RIGHT: Abstract Visual + Floating Stats (old layout, no stock image) ── */}
          <div className="hidden lg:block relative h-80">
            <GSAPTilt className="absolute inset-0">
              <div
                className="w-full h-full rounded-3xl border border-orange-vibrant/15 backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(255,87,15,0.05) 0%, rgba(10,10,10,0.8) 100%)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-vibrant/5 to-transparent rounded-3xl" />
                <AbstractCTAVisual />
              </div>
            </GSAPTilt>

            {/* Floating stat pills — kept from old code */}
            <div className="collab-stat absolute -top-6 -left-6 z-20"><StatPill value="600%" label="Peak ROAS" delay={0} /></div>
            <div className="collab-stat absolute -bottom-6 -right-6 z-20"><StatPill value="418K" label="Purchases" delay={0.4} /></div>
            <div className="collab-stat absolute top-1/2 -right-10 z-20"><StatPill value="$0.09" label="CPC Achieved" delay={0.8} /></div>
          </div>

        </div>
      </div>

      <style jsx>{`.perspective-1000 { perspective: 1000px; }`}</style>
    </section>
  );
};

export default Collaborate;