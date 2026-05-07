// src/components/LoadingScreen.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const curtainRef = useRef(null);
    const logoRef = useRef(null);
    const taglineRef = useRef(null);
    const counterRef = useRef(null);
    const progressTrackRef = useRef(null);
    const progressFillRef = useRef(null);
    const ring1Ref = useRef(null);
    const ring2Ref = useRef(null);
    const ring3Ref = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const counterObj = { val: 0 };

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = '';
                if (onComplete) onComplete();
            }
        });

        // ── Phase 1: Elements fade in (faster) ──────────────────────────
        tl.fromTo(ring1Ref.current,
            { scale: 0, opacity: 0, rotation: -90 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.4)' }, 0
        )
        .fromTo(ring2Ref.current,
            { scale: 0, opacity: 0, rotation: 90 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.2)' }, 0.1
        )
        .fromTo(ring3Ref.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.0)' }, 0.15
        )
        .fromTo(logoRef.current,
            { opacity: 0, y: 8, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.3
        )
        .fromTo(taglineRef.current,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.5
        )
        .fromTo(progressTrackRef.current,
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.6
        )

        // ── Phase 2: Progress fill + counter (faster) ──────────────────
        .to(progressFillRef.current,
            { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.7
        )
        .to(counterObj,
            {
                val: 100,
                duration: 1.2,
                ease: 'power2.inOut',
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = Math.round(counterObj.val);
                    }
                }
            }, 0.7
        )

        // ── Phase 3: Spin rings ──────────────────────────────────────────
        .to(ring1Ref.current, { rotation: 180, duration: 0.4, ease: 'power3.in' }, 1.7)
        .to(ring2Ref.current, { rotation: -180, duration: 0.4, ease: 'power3.in' }, 1.7)

        // ── Phase 4: Fade out ─────────────────────────────────────────────
        .to([logoRef.current, taglineRef.current, progressTrackRef.current, counterRef.current],
            { opacity: 0, scale: 1.05, duration: 0.3, ease: 'power2.in' }, 1.95
        )
        .to([ring1Ref.current, ring2Ref.current, ring3Ref.current],
            { scale: 1.3, opacity: 0, duration: 0.35, ease: 'power2.in' }, 1.95
        )

        // ── Phase 5: Curtain reveal ───────────────────────────────────────
        .to(curtainRef.current,
            { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 2.2
        );

        // ── Continuous ring rotations ──────────────────────────────────────
        gsap.to(ring1Ref.current, {
            rotation: '+=360', duration: 8, ease: 'none', repeat: -1,
        });
        gsap.to(ring2Ref.current, {
            rotation: '-=360', duration: 12, ease: 'none', repeat: -1,
        });

        // Glow pulse
        gsap.to(glowRef.current, {
            scale: 1.3, opacity: 0.5, duration: 1.5,
            ease: 'sine.inOut', yoyo: true, repeat: -1,
        });

        return () => tl.kill();
    }, [onComplete]);

    // Dot positions (reduced from 5 to 4 for cleaner look)
    const dots = [
        { top: '18%', left: '12%' },
        { top: '22%', right: '10%' },
        { bottom: '20%', left: '15%' },
        { bottom: '15%', right: '12%' },
    ];

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
            {/* ── Curtain (single layer for smoother animation) ── */}
            <div
                ref={curtainRef}
                className="absolute inset-0 z-10"
                style={{
                    background: '#08090A',
                    borderBottom: '1px solid rgba(255,87,15,0.08)',
                }}
            />

            {/* ── Background ── */}
            <div className="absolute inset-0" style={{ background: '#08090A' }} />

            {/* ── Aurora glow (subtle) ── */}
            <div
                ref={glowRef}
                className="absolute rounded-full"
                style={{
                    width: '500px', height: '500px',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(255,87,15,0.10) 0%, rgba(253,232,122,0.03) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Dot grid (lighter) ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,87,15,0.04) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 1,
                }}
            />

            {/* ── Corner labels (smaller text) ── */}
            <div className="absolute top-6 left-6 text-[8px] font-black uppercase tracking-[0.3em]"
                style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-heading, inherit)' }}>
                DDW
            </div>
            <div className="absolute top-6 right-6 text-[8px] font-bold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(255,255,255,0.10)', fontFamily: 'var(--font-body, inherit)' }}>
                Performance Marketing
            </div>
            <div className="absolute bottom-6 left-6 text-[8px] font-bold tracking-widest"
                style={{ color: 'rgba(255,255,255,0.08)', fontFamily: 'var(--font-body, inherit)' }}>
                US + EU Markets
            </div>

            {/* ── Ambient dots ── */}
            <div>
                {dots.map((pos, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            ...pos,
                            background: i % 2 === 0 ? '#FF570F' : '#FDE87A',
                            opacity: 0.2,
                            animation: `ambientPulse ${2 + i * 0.3}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>

            {/* ── Center stage (reduced spacing) ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">

                {/* Orbital rings (tighter) */}
                <div className="relative flex items-center justify-center mb-4" style={{ width: '180px', height: '180px' }}>

                    {/* Ring 3 */}
                    <div
                        ref={ring3Ref}
                        className="absolute rounded-full"
                        style={{
                            width: '170px', height: '170px',
                            border: '1px solid rgba(255,87,15,0.08)',
                        }}
                    />

                    {/* Ring 2 */}
                    <div
                        ref={ring2Ref}
                        className="absolute rounded-full"
                        style={{
                            width: '132px', height: '132px',
                            border: '1px dashed rgba(253,232,122,0.18)',
                        }}
                    />

                    {/* Ring 1 */}
                    <div
                        ref={ring1Ref}
                        className="absolute rounded-full flex items-start justify-center"
                        style={{
                            width: '98px', height: '98px',
                            border: '1.5px solid rgba(255,87,15,0.30)',
                        }}
                    >
                        {/* Orbit node */}
                        <div
                            className="absolute rounded-full"
                            style={{
                                width: '6px', height: '6px',
                                background: '#FF570F',
                                top: '-3px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                boxShadow: '0 0 8px rgba(255,87,15,0.7)',
                            }}
                        />
                    </div>

                    {/* Core (smaller) */}
                    <div
                        className="relative z-10 flex items-center justify-center rounded-full"
                        style={{
                            width: '64px', height: '64px',
                            background: 'linear-gradient(145deg, #141719 0%, #08090A 100%)',
                            border: '1.5px solid rgba(255,87,15,0.25)',
                            boxShadow: '0 0 30px rgba(255,87,15,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}
                    >
                        <div ref={logoRef} style={{ opacity: 0 }}>
                            <div
                                className="font-black text-base leading-none tracking-tight"
                                style={{
                                    fontFamily: 'var(--font-heading, inherit)',
                                    background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                DDW
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tagline (reduced margin) */}
                <div ref={taglineRef} className="mt-3 text-center" style={{ opacity: 0 }}>
                    <p
                        className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                        style={{ color: 'rgba(255,255,255,0.30)' }}
                    >
                        Performance Marketing Agency
                    </p>
                </div>

                {/* Progress bar (reduced gap) */}
                <div className="mt-5 flex flex-col items-center gap-2">
                    <div
                        ref={progressTrackRef}
                        className="relative rounded-full overflow-hidden"
                        style={{
                            width: '140px', height: '2px',
                            background: 'rgba(255,255,255,0.06)',
                            opacity: 0,
                        }}
                    >
                        <div
                            ref={progressFillRef}
                            className="absolute inset-0 rounded-full origin-left scale-x-0"
                            style={{
                                background: 'linear-gradient(90deg, #FF570F 0%, #FDE87A 100%)',
                                boxShadow: '0 0 6px rgba(255,87,15,0.5)',
                            }}
                        />
                    </div>

                    {/* Counter (smaller) */}
                    <div className="flex items-baseline gap-0.5">
                        <span
                            ref={counterRef}
                            className="font-black text-xl leading-none tabular-nums"
                            style={{
                                fontFamily: 'var(--font-heading, inherit)',
                                color: '#FFFFFF',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            0
                        </span>
                        <span
                            className="text-xs font-bold"
                            style={{ color: 'rgba(255,255,255,0.25)' }}
                        >
                            %
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ambientPulse {
                    from { opacity: 0.12; transform: scale(1); }
                    to   { opacity: 0.35; transform: scale(1.4); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;