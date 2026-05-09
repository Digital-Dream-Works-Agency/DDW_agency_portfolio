import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';

// ─── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyles = React.memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes ddwOrbit1 {
      from { transform: rotate(0deg) translateZ(0); }
      to   { transform: rotate(360deg) translateZ(0); }
    }
    @keyframes ddwOrbit2 {
      from { transform: rotate(0deg) translateZ(0); }
      to   { transform: rotate(-360deg) translateZ(0); }
    }
    @keyframes ddwCorePulse {
      0%,100% {
        box-shadow:
          0 0 0 0 rgba(255,87,15,0),
          0 0 40px rgba(255,87,15,0.3),
          0 0 80px rgba(255,87,15,0.1);
      }
      50% {
        box-shadow:
          0 0 0 12px rgba(255,87,15,0),
          0 0 60px rgba(255,87,15,0.55),
          0 0 120px rgba(255,87,15,0.22);
      }
    }
    @keyframes ddwGlowPulse {
      0%,100% { opacity: 0.35; transform: scale(1) translateZ(0); }
      50%      { opacity: 0.7;  transform: scale(1.25) translateZ(0); }
    }
    @keyframes ddwScanLine {
      0%   { transform: translateY(-100%); opacity: 0; }
      20%  { opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translateY(400%); opacity: 0; }
    }
    @keyframes ddwParticleFloat {
      0%   { transform: translateY(0px) translateX(0px) translateZ(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-120px) translateX(var(--px, 0px)) translateZ(0); opacity: 0; }
    }
    @keyframes ddwShimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes ddwBlinkCursor {
      0%,100% { opacity: 1; }
      50%      { opacity: 0; }
    }
    @keyframes ddwBarRise {
      0%,100% { transform: scaleY(0.2) translateZ(0); opacity: 0.2; }
      50%      { transform: scaleY(1) translateZ(0);   opacity: 1;   }
    }
    @keyframes ddwAuroraFloat {
      0%   { transform: translate(0,0) scale(1) translateZ(0); }
      50%  { transform: translate(-30px,20px) scale(1.12) translateZ(0); }
      100% { transform: translate(0,0) scale(1) translateZ(0); }
    }
    @keyframes ddwDotGrid {
      0%   { background-position: 0 0; }
      100% { background-position: 28px 28px; }
    }
    @keyframes ddwProgressGlow {
      0%,100% { opacity: 0.8; }
      50%      { opacity: 1; }
    }
    @keyframes ddwTaglineReveal {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
  `}} />
));

// ─── Particle ────────────────────────────────────────────────────────────────
const Particle = React.memo(({ x, y, size, delay, drift }) => (
  <div
    style={{
      position: 'absolute',
      left: x, top: y,
      width: size, height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle, #FF570F 0%, #FDE87A 60%, transparent 100%)',
      '--px': `${drift}px`,
      animation: `ddwParticleFloat ${2.8 + Math.random()}s ease-in ${delay}s infinite`,
      pointerEvents: 'none',
      zIndex: 1,
      willChange: 'transform, opacity' // GPU acceleration
    }}
  />
));

// ─── Ambient Particles ────────────────────────────────────────────────────────
const AmbientParticles = React.memo(() => {
  // Array sirf aik dafa calculate hogi render par
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${20 + Math.random() * 60}%`,
    size: `${1.5 + Math.random() * 2.5}px`,
    delay: Math.random() * 3,
    drift: (Math.random() - 0.5) * 60,
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map(p => <Particle key={p.id} {...p} />)}
    </div>
  );
});

// ─── Aurora Orbs ─────────────────────────────────────────────────────────────
const AuroraOrbs = React.memo(() => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <div style={{
      position: 'absolute', width: 'clamp(300px,50vw,700px)', height: 'clamp(300px,50vw,700px)',
      borderRadius: '50%', background: 'radial-gradient(circle, #FF570F 0%, transparent 68%)',
      filter: 'blur(80px)', opacity: 0.08, top: '-20%', right: '-15%',
      animation: 'ddwAuroraFloat 14s ease-in-out infinite', willChange: 'transform'
    }} />
    <div style={{
      position: 'absolute', width: 'clamp(200px,35vw,500px)', height: 'clamp(200px,35vw,500px)',
      borderRadius: '50%', background: 'radial-gradient(circle, #FDE87A 0%, transparent 70%)',
      filter: 'blur(70px)', opacity: 0.05, bottom: '-15%', left: '-10%',
      animation: 'ddwAuroraFloat 18s ease-in-out infinite reverse', willChange: 'transform'
    }} />
    <div style={{
      position: 'absolute', width: 'clamp(150px,25vw,350px)', height: 'clamp(150px,25vw,350px)',
      borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,87,15,0.35) 0%, transparent 70%)',
      filter: 'blur(50px)', opacity: 1, top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      animation: 'ddwGlowPulse 3s ease-in-out infinite', willChange: 'transform, opacity'
    }} />
    <div style={{
      position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,87,15,0.12) 1px, transparent 1px)',
      backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 72%)',
      WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 72%)',
      opacity: 0.5, animation: 'ddwDotGrid 4s linear infinite', willChange: 'background-position'
    }} />
  </div>
));

// ─── Orbit Ring Visual ────────────────────────────────────────────────────────
const OrbitRings = React.memo(() => {
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);

  useEffect(() => {
    if (!ring1Ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ring1Ref.current, { rotation: 360,  duration: 16, ease: 'none', repeat: -1, transformOrigin: 'center', force3D: true });
      gsap.to(ring2Ref.current, { rotation: -360, duration: 26, ease: 'none', repeat: -1, transformOrigin: 'center', force3D: true });
      gsap.to(ring3Ref.current, { rotation: 360,  duration: 40, ease: 'none', repeat: -1, transformOrigin: 'center', force3D: true });
    });
    return () => ctx.revert();
  }, []);

  const SIZES   = [260, 190, 128];
  const RADII   = [122, 87, 56];
  const refs    = [ring1Ref, ring2Ref, ring3Ref];
  const strokes = ['rgba(255,87,15,0.22)', 'rgba(253,232,122,0.12)', 'rgba(255,87,15,0.07)'];
  const dashes  = ['5 14', '3 10', '2 7'];
  const nodeColors = ['#FF570F', '#FDE87A', '#FF570F'];
  const nodeSizes  = [5, 4, 3];

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1 }}>
      {refs.map((ref, i) => {
        const S = SIZES[i], C = S / 2, R = RADII[i];
        return (
          <div key={i} ref={ref} style={{ position: 'absolute', width: S, height: S, willChange: 'transform' }}>
            <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: 'visible' }}>
              <circle cx={C} cy={C} r={R} fill="none" stroke={strokes[i]} strokeWidth="0.8" strokeDasharray={dashes[i]} />
              <circle cx={C} cy={C - R} r={nodeSizes[i]} fill={nodeColors[i]} />
              <circle cx={C} cy={C - R} r={nodeSizes[i] + 5} fill="none" stroke={nodeColors[i]} strokeWidth="0.5" opacity="0.3" />
              {i === 0 && ( <circle cx={C + R} cy={C} r={3} fill="#FDE87A" opacity="0.6" /> )}
            </svg>
          </div>
        );
      })}
    </div>
  );
});

// ─── Data Bars Visual ─────────────────────────────────────────────────────────
const DataBars = React.memo(({ visible }) => {
  const heights = [0.45, 0.7, 1, 0.82, 0.6, 0.9, 0.5, 0.75, 0.88, 0.55, 0.92, 0.65];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 4, borderRadius: 2, height: `${h * 32}px`,
          background: `linear-gradient(to top, #FF570F, ${i % 2 === 0 ? '#FDE87A' : '#EE7D1D'})`,
          animation: `ddwBarRise ${1 + i * 0.15}s ease-in-out ${i * 0.1}s infinite`,
          transformOrigin: 'bottom', willChange: 'transform, opacity'
        }} />
      ))}
    </div>
  );
});

// ─── Logo Mark ────────────────────────────────────────────────────────────────
const LogoMark = React.memo(({ visible }) => (
  <div style={{
    width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#1a1f26 0%,#0d1014 100%)', border: '1.5px solid rgba(255,87,15,0.5)',
    animation: 'ddwCorePulse 2.6s ease-in-out infinite', flexShrink: 0,
    opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.8)',
    transition: 'opacity 0.5s ease, transform 0.5s ease', willChange: 'box-shadow, transform'
  }}>
    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 900, letterSpacing: '-0.02em', color: '#FF570F', lineHeight: 1 }}>
      DDW
    </div>
  </div>
));

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = ({ onComplete }) => {
  const containerRef  = useRef(null);
  const curtainRef    = useRef(null);
  const progressBarRef = useRef(null);
  const contentRef    = useRef(null);
  const glowDotRef    = useRef(null);
  
  // React render se bachne ke liye direct DOM node useRef ke zariye update karenge
  const counterRef    = useRef(null); 
  const pill1Ref      = useRef(null);
  const pill2Ref      = useRef(null);
  const pill3Ref      = useRef(null);

  const [taglineIdx,  setTaglineIdx]  = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  const taglines = ['Initializing systems...', 'Loading campaigns...', 'Syncing data...', 'Ready.'];

  useEffect(() => {
    setLogoVisible(true);
    setBarsVisible(true);
    const intervals = [400, 900, 1400];
    const timers = intervals.map((delay, i) => setTimeout(() => setTaglineIdx(i + 1), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Master GSAP timeline
  useEffect(() => {
    if (!containerRef.current) return;

    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      },
    });

    // Custom object animate karenge takay React bar bar re-render na ho
    const progressState = { val: 0 };

    tl.to(progressState, {
      val: 100,
      duration: 1.8,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          // Direct DOM manipulation - super fast!
          counterRef.current.innerText = String(Math.round(progressState.val)).padStart(2, '0') + '%';
        }
      }
    }, 0);

    tl.to(progressBarRef.current, { scaleX: 1, duration: 1.8, ease: 'power3.inOut', force3D: true }, 0);
    tl.to(glowDotRef.current, { left: '100%', duration: 1.8, ease: 'power3.inOut', force3D: true }, 0);

    // Stat pills ab state se nahi balki gsap timeline se aayenge
    tl.to([pill1Ref.current, pill2Ref.current, pill3Ref.current], {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.2, ease: 'power2.out', force3D: true
    }, 0.5);

    tl.to({}, { duration: 0.28 });

    tl.to(contentRef.current, { opacity: 0, y: -16, duration: 0.38, ease: 'power2.in', force3D: true });
    tl.to(curtainRef.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut', force3D: true }, '+=0.05');

    return () => { tl.kill(); document.body.style.overflow = ''; };
  }, [onComplete]);

  return (
    <>
      <GlobalStyles />
      <div ref={curtainRef} style={{ position: 'fixed', inset: 0, zIndex: 99999, willChange: 'transform' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0, background: '#080a0c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          
          <AuroraOrbs />
          <AmbientParticles />
          
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,87,15,0.4), rgba(253,232,122,0.2), transparent)', animation: 'ddwScanLine 3s ease-in-out 1.2s infinite', willChange: 'transform, opacity' }} />
          </div>

          <OrbitRings />

          <div ref={contentRef} style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(20px,3.5vw,32px)', padding: '0 clamp(16px,4vw,32px)', width: '100%', maxWidth: 480 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,16px)' }}>
              <LogoMark visible={logoVisible} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(22px,4.5vw,34px)', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1, color: '#fff', position: 'relative' }}>
                  DDW <span style={{ background: 'linear-gradient(135deg,#FF570F 0%,#FDE87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Agency</span>
                </h2>
                <div style={{ height: 1.5, borderRadius: 99, background: 'linear-gradient(90deg, transparent, #FF570F, #FDE87A, transparent)', opacity: 0.55, animation: 'ddwShimmer 2.5s linear infinite', backgroundSize: '200% auto' }} />
              </div>
            </div>

            <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,87,15,0.2),transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, width: '100%' }}>
              <DataBars visible={barsVisible} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', background: 'linear-gradient(135deg,#FF570F,#FDE87A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  $4.2M+
                </span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)' }}>
                  Ad Spend Managed
                </span>
              </div>
              <DataBars visible={barsVisible} />
            </div>

            <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,87,15,0.2),transparent)' }} />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF570F', flexShrink: 0, animation: 'ddwGlowPulse 1.6s ease-in-out infinite' }} />
                  <span key={taglineIdx} style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(9px,1.6vw,11px)', fontWeight: 500, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.1em', animation: 'ddwTaglineReveal 0.35s ease both' }}>
                    {taglines[Math.min(taglineIdx, taglines.length - 1)]}
                  </span>
                  <span style={{ display: 'inline-block', width: 1.5, height: 11, background: '#FF570F', marginLeft: 2, animation: 'ddwBlinkCursor 0.9s step-end infinite' }} />
                </div>
                
                {/* Counter directly updated by GSAP DOM manipulation */}
                <div ref={counterRef} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(11px,2vw,13px)', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
                  00%
                </div>
              </div>

              <div style={{ width: '100%', height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'visible', position: 'relative' }}>
                <div ref={progressBarRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#FF570F,#EE7D1D,#FDE87A)', transform: 'scaleX(0)', transformOrigin: 'left center', animation: 'ddwProgressGlow 1.5s ease-in-out infinite', willChange: 'transform' }} />
                <div ref={glowDotRef} style={{ position: 'absolute', top: '50%', left: '0%', transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: '50%', background: '#FDE87A', boxShadow: '0 0 10px #FDE87A, 0 0 20px #FF570F88', zIndex: 2, willChange: 'left' }} />
                {[25, 50, 75].map(tick => (
                  <div key={tick} style={{ position: 'absolute', top: '50%', left: `${tick}%`, transform: 'translate(-50%,-50%)', width: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }} />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                {[
                  { label: '600% ROAS', color: '#FF570F', ref: pill1Ref },
                  { label: '$2.7M Amazon', color: '#FDE87A', ref: pill2Ref },
                  { label: '54K SEO/mo', color: '#EE7D1D', ref: pill3Ref },
                ].map((pill, i) => (
                  <div key={i} ref={pill.ref} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, background: `${pill.color}10`, border: `1px solid ${pill.color}28`, opacity: 0, transform: 'translateY(6px)', willChange: 'transform, opacity' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: pill.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: pill.color }}>{pill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.28 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
                Elite Performance Agency
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
            </div>

          </div>

          <CornerDeco position="tl" /> <CornerDeco position="tr" /> <CornerDeco position="bl" /> <CornerDeco position="br" />
          
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, rgba(8,10,12,0.6))', pointerEvents: 'none', zIndex: 3 }} />
        </div>
      </div>
    </>
  );
};

const CornerDeco = React.memo(({ position }) => {
  const isTop  = position.startsWith('t');
  const isLeft = position.endsWith('l');
  return (
    <div style={{ position: 'absolute', zIndex: 5, pointerEvents: 'none', ...(isTop ? { top: 'clamp(12px,2vw,20px)' } : { bottom: 'clamp(12px,2vw,20px)' }), ...(isLeft ? { left: 'clamp(12px,2vw,20px)' } : { right: 'clamp(12px,2vw,20px)' }) }}>
      <svg width={28} height={28} viewBox="0 0 28 28" style={{ opacity: 0.2 }}>
        {isTop && isLeft && <><line x1="0" y1="0" x2="18" y2="0" stroke="#FF570F" strokeWidth="1.5" /><line x1="0" y1="0" x2="0" y2="18" stroke="#FF570F" strokeWidth="1.5" /></>}
        {isTop && !isLeft && <><line x1="28" y1="0" x2="10" y2="0" stroke="#FF570F" strokeWidth="1.5" /><line x1="28" y1="0" x2="28" y2="18" stroke="#FF570F" strokeWidth="1.5" /></>}
        {!isTop && isLeft && <><line x1="0" y1="28" x2="18" y2="28" stroke="#FF570F" strokeWidth="1.5" /><line x1="0" y1="28" x2="0" y2="10" stroke="#FF570F" strokeWidth="1.5" /></>}
        {!isTop && !isLeft && <><line x1="28" y1="28" x2="10" y2="28" stroke="#FF570F" strokeWidth="1.5" /><line x1="28" y1="28" x2="28" y2="10" stroke="#FF570F" strokeWidth="1.5" /></>}
      </svg>
    </div>
  );
});

export default LoadingScreen;