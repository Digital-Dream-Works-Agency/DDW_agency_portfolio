// src/components/ProductsSection/index.jsx
// DDW — Own SaaS Products | v4 — hoverGradient pattern from reference

import React, { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Mobile singleton ──────────────────────────────────────────────────────────
const _mq =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)')
    : null;

let _isMobile =
  typeof window !== 'undefined' ? (_mq?.matches ?? false) : false;

if (_mq) {
  _mq.addEventListener('change', (e) => { _isMobile = e.matches; });
}

// ─── Static data ───────────────────────────────────────────────────────────────
// `hoverGradient` is the ONLY place glow colors appear — injected as an
// overlay on hover. Everything else uses `accent` (the brand color).
const PRODUCTS = Object.freeze([
  Object.freeze({
    name:          'Lyra',
    tagline:       'AI Voice Receptionist',
    description:
      'Every missed call is a missed customer. Lyra answers 24/7, books appointments into your calendar, qualifies leads, and sends follow-up messages — without a single human receptionist.',
    url:           'https://lyrabyddw.com',
    tags:          Object.freeze(['AI SaaS', 'Voice AI', 'Twilio + AWS']),
    accent:        '#FF570F',
    accentRgb:     '255,87,15',
    hoverGradient: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
    bigMetric:     '978+',
    bigLabel:      'Calls handled',
    pill:          Object.freeze({ value: '24/7', label: 'Always live' }),
    stats: Object.freeze([
      Object.freeze({ value: '978+', label: 'Calls handled' }),
      Object.freeze({ value: '24/7', label: 'Availability'  }),
      Object.freeze({ value: '0',    label: 'Missed calls'  }),
    ]),
  }),
  Object.freeze({
    name:          'Sviluppiamo.dev',
    tagline:       'Vibe Coding Platform — Italy',
    description:
      'The Italian-market vibe coding platform. Connects Italian developers and businesses with AI-assisted software building — a product DDW built, owns, and operates.',
    url:           'https://sviluppiamo.dev',
    tags:          Object.freeze(['SaaS', 'Italy Market', 'Built by DDW']),
    accent:        '#FDE87A',
    accentRgb:     '253,232,122',
    hoverGradient: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 30%, #EA580C 65%, #DB2777 100%)',
    bigMetric:     'Live',
    bigLabel:      'Platform status',
    pill:          Object.freeze({ value: 'IT', label: 'Market' }),
    stats: Object.freeze([
      Object.freeze({ value: 'IT',   label: 'Market'  }),
      Object.freeze({ value: 'AI',   label: 'Powered' }),
      Object.freeze({ value: 'Live', label: 'Status'  }),
    ]),
  }),
]);

// ─── External link icon ────────────────────────────────────────────────────────
const ExternalLinkIcon = memo(() => (
  <svg
    width="12" height="12" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    viewBox="0 0 24 24" aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
));
ExternalLinkIcon.displayName = 'ExternalLinkIcon';

// ─── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = memo(({ product, index }) => {
  const cardRef    = useRef(null);
  const overlayRef = useRef(null);   // hoverGradient lives here, opacity 0→1
  const barRef     = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity:    1,
        y:          0,
        duration:   0.7,
        ease:       'power3.out',
        delay:      index * 0.11,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: el,
          start:   'top 88%',
          once:    true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [index]);

  const handleEnter = (e) => {
    // border shifts to accent on hover (same as original)
    e.currentTarget.style.borderColor = `${product.accent}30`;
    // fade in the hoverGradient overlay
    if (overlayRef.current) overlayRef.current.style.opacity = '1';
    // slide in the bottom bar
    if (barRef.current) barRef.current.style.width = '100%';
  };

  const handleLeave = (e) => {
    e.currentTarget.style.borderColor = `${product.accent}14`;
    if (overlayRef.current) overlayRef.current.style.opacity = '0';
    if (barRef.current) barRef.current.style.width = '0%';
  };

  return (
    <div
      ref={cardRef}
      className="products-card"
      style={{
        background:    'rgba(13,15,17,0.9)',
        border:        `1px solid ${product.accent}14`,
        borderRadius:  12,
        padding:       '24px',
        position:      'relative',
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        transition:    'border-color 0.35s ease',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── hoverGradient overlay — opacity 0 at rest, 1 on hover ── */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          // Same pattern as reference: gradient fades in as a top-anchored wash
          background:    product.hoverGradient,
          opacity:       0,
          transition:    'opacity 0.45s ease',
          // Mask it so only the top portion bleeds in — keeps text legible
          maskImage:     'radial-gradient(ellipse 100% 60% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 60% at 50% 0%, black 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex:        0,
        }}
      />

      {/* ── Static ambient corner glow (always on, brand accent) ── */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           0,
          right:         0,
          width:         180,
          height:        180,
          background:    `radial-gradient(circle at top right, rgba(${product.accentRgb},0.07), transparent 65%)`,
          pointerEvents: 'none',
          zIndex:        0,
        }}
      />

      {/* ── Top row: tags + big metric ── */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start',
          gap:            16,
          marginBottom:   16,
          position:       'relative',
          zIndex:         1,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {product.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize:      9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight:    600,
                padding:       '3px 8px',
                borderRadius:  20,
                background:    `rgba(${product.accentRgb},0.10)`,
                border:        `1px solid rgba(${product.accentRgb},0.25)`,
                color:         product.accent,
                whiteSpace:    'nowrap',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
          <div
            className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight"
            style={{
              background:           `linear-gradient(135deg, ${product.accent}, #FDE87A)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}
          >
            {product.bigMetric}
          </div>
          <div
            style={{
              fontSize:      8,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.22)',
              marginTop:     3,
            }}
          >
            {product.bigLabel}
          </div>
        </div>
      </div>

      {/* ── Product name + tagline ── */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 10 }}>
        <h3
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color: '#ffffff', margin: '0 0 3px' }}
        >
          {product.name}
        </h3>
        <div
          style={{
            fontSize:      10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color:         `${product.accent}BB`,
            fontWeight:    600,
          }}
        >
          {product.tagline}
        </div>
      </div>

      {/* ── Description ── */}
      <p
        style={{
          fontSize:   16,
          color:      'rgba(255,255,255,0.42)',
          lineHeight: 1.65,
          margin:     '0 0 18px',
          position:   'relative',
          zIndex:     1,
          flexGrow:   1,
        }}
      >
        {product.description}
      </p>

      {/* ── Stats row ── */}
      <div
        style={{
          display:      'flex',
          gap:          18,
          marginBottom: 18,
          position:     'relative',
          zIndex:       1,
          paddingTop:   14,
          borderTop:    '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {product.stats.map((stat) => (
          <div key={stat.label}>
            <div
              className="text-lg font-bold leading-[1.1] tracking-tight"
              style={{
                background:           `linear-gradient(135deg, ${product.accent}, #FDE87A)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize:      8,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.25)',
                marginTop:     2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom row: CTA + pill ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            12,
          position:       'relative',
          zIndex:         1,
        }}
      >
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            7,
            fontSize:       10,
            fontWeight:     700,
            letterSpacing:  '0.16em',
            textTransform:  'uppercase',
            padding:        '9px 18px',
            background:     product.accent,
            color:          '#060809',
            borderRadius:   6,
            textDecoration: 'none',
            transition:     'opacity 0.2s ease, transform 0.15s ease',
            boxShadow:      `0 3px 14px rgba(${product.accentRgb},0.25)`,
            flexShrink:     0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity   = '0.85';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity   = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Visit {product.name}
          <ExternalLinkIcon />
        </a>

        <div
          style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           6,
            fontSize:      9,
            fontWeight:    700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding:       '5px 10px',
            borderRadius:  20,
            background:    `rgba(${product.accentRgb},0.10)`,
            border:        `1px solid rgba(${product.accentRgb},0.25)`,
            color:         product.accent,
            whiteSpace:    'nowrap',
          }}
        >
          <span
            className="products-pulse-dot"
            aria-hidden="true"
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: product.accent, flexShrink: 0, display: 'inline-block',
            }}
          />
          {product.pill.value} · {product.pill.label}
        </div>
      </div>

      {/* ── Bottom bar — accent gradient ── */}
      <div
        ref={barRef}
        aria-hidden="true"
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          height:     2,
          width:      '0%',
          background: `linear-gradient(to right, ${product.accent}, #FDE87A)`,
          transition: 'width 0.5s ease',
          zIndex:     2,
        }}
      />
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// ─── Products Section ──────────────────────────────────────────────────────────
const ProductsSection = () => {
  const sectionRef = useRef(null);
  const badgeRef   = useRef(null);
  const headingRef = useRef(null);
  const subRef     = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    [badgeRef.current, headingRef.current, subRef.current].forEach((el) => {
      if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; }
    });

    const ctx = gsap.context(() => {
      gsap.to(
        [badgeRef.current, headingRef.current, subRef.current],
        {
          opacity:    1,
          y:          0,
          duration:   0.7,
          stagger:    0.09,
          ease:       'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: section,
            start:   'top 84%',
            once:    true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#060809',
        padding:    'clamp(56px, 7vw, 96px) 0',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Atmospheric orbs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-10%', right: '15%',
        width: 'clamp(220px, 35vw, 460px)', height: 'clamp(220px, 35vw, 460px)',
        background: 'radial-gradient(circle, rgba(255,87,15,0.07), transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none', borderRadius: '50%',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '5%', left: '5%',
        width: 'clamp(160px, 25vw, 320px)', height: 'clamp(160px, 25vw, 320px)',
        background: 'radial-gradient(circle, rgba(253,232,122,0.05), transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none', borderRadius: '50%',
      }} />

      {/* Mesh grid */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,87,15,0.016) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,87,15,0.016) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        maskImage:       'radial-gradient(ellipse 65% 55% at 50% 40%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, black, transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1080, margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 40px)',
      }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 4vw, 48px)' }}>
          <div
            ref={badgeRef}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 20,
              border: '1px solid rgba(255,87,15,0.22)',
              background: 'rgba(255,87,15,0.05)', marginBottom: 14,
            }}
          >
            <span
              className="products-pulse-dot"
              aria-hidden="true"
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#FF570F', flexShrink: 0, display: 'inline-block',
              }}
            />
            <span style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,87,15,0.88)',
            }}>
              Products We've Built &amp; Ship
            </span>
          </div>

          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight"
            style={{ color: '#ffffff', margin: '0 0 12px' }}
          >
            We also{' '}
            <span style={{
              background:           'linear-gradient(135deg, #FF570F, #FDE87A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}>
              ship products.
            </span>
          </h2>

          <p
            ref={subRef}
            style={{
              fontSize:   'clamp(16px, 1.3vw, 18px)',
              color:      'rgba(255,255,255,0.4)',
              lineHeight: 1.65,
              margin:     '0 auto',
              maxWidth:   440,
            }}
          >
            We don't just run client accounts — we build our own software too.
            These are live, paying products built and operated by the DDW team.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div
          className="products-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 14,
            alignItems:          'stretch',
          }}
        >
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>

      {/* ── Global styles ── */}
      <style>{`
        @keyframes products-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .products-pulse-dot {
          animation: products-pulse 2.2s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductsSection;