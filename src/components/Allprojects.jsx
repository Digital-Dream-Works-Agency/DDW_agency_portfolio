import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────────
const projectsData = [
  { id: 'meta-eu-fashion', title: 'EU Fashion & Golf Brand', category: 'Meta Ads', img: '/portfolio/google-ads-600roas.png', tags: ['Meta Ads', 'EU Market', 'E-Commerce'], metrics: { 'Monthly Spend': '$683K', 'ROAS': '5.48x', 'Campaigns': '343' }, url: null },
  { id: 'meta-eu-oct', title: 'EU Brand — October Scale', category: 'Meta Ads', img: '/portfolio/google-ads-600roas.png', tags: ['Meta Ads', 'EU Market', 'Scale'], metrics: { 'Monthly Spend': '$441K', 'ROAS': '4.70x', 'Campaigns': '285' }, url: null },
  { id: 'uae-home-appliances', title: 'UAE Home Appliances', category: 'Meta Ads', img: null, tags: ['Meta Ads', 'Shopify', 'UAE'], metrics: { ROAS: '4.86x', Orders: '572' }, url: null },
  { id: 'mathfel-google', title: 'Mathfel — Video Door Intercom', category: 'Google Ads', img: '/portfolio/google-ads-600roas.png', tags: ['Google Ads', 'EU Market', 'E-Commerce'], metrics: { ROAS: '600%', Revenue: '€418K', Spend: '€69.7K' }, url: null },
  { id: 'google-eu-310roas', title: 'EU Brand — Google Shopping', category: 'Google Ads', img: '/portfolio/google-ads-310roas.png', tags: ['Google Ads', 'EU Market', 'Shopping'], metrics: { ROAS: '310%', Revenue: '€60.1K' }, url: null },
  { id: 'pj-bold', title: 'PJ BOLD — Silicone Molds', category: 'Google Ads', img: null, tags: ['Google Ads', 'USA', 'E-Commerce'], metrics: { ROAS: '14.54x', Revenue: '$38K' }, url: null },
  { id: 'cpa-moms', title: 'CPA MOMS — Tax Franchise', category: 'Google Ads', img: null, tags: ['Google Ads', 'Lead Gen', 'USA'], metrics: { Conversions: '+53%', CPC: '-51%' }, url: null },
  { id: 'us-health-clinic', title: 'US Health Clinic — Multi-Location', category: 'Google Ads', img: null, tags: ['Google Ads', 'Healthcare', 'USA'], metrics: { Conversions: '15,594', CPC: '$0.09' }, url: null },
  { id: 'amazon-us', title: 'Amazon Brand — US Market', category: 'Amazon', img: '/portfolio/amazon-ads-main.png', tags: ['Amazon Ads', 'Amazon FBA', 'USA'], metrics: { Sales: '$2.7M+', ACOS: '27.64%', Orders: '129,800' }, url: null },
  { id: 'tiktok-shop', title: 'TikTok Shop — E-Commerce', category: 'TikTok Shop', img: '/portfolio/tiktok-shop.png', tags: ['TikTok Shop', 'E-Commerce', 'Social Commerce'], metrics: { '7-Day GMV': '$290K', Orders: '9,010', Growth: '+121%' }, url: null },
  { id: 'seo-syncwire', title: 'Syncwire — E-Commerce SEO', category: 'SEO', img: '/portfolio/seo-251k.png', tags: ['SEO', 'E-Commerce', 'Organic Growth'], metrics: { Visitors: '2K → 54K', Clicks: '251K', Impressions: '10.3M' }, url: null },
  { id: 'seo-brand-2', title: 'E-Commerce Brand — SEO', category: 'SEO', img: '/portfolio/seo-147k.png', tags: ['SEO', 'E-Commerce', 'Organic Growth'], metrics: { Clicks: '147K', Impressions: '4.43M' }, url: null },
  { id: 'lyra-saas', title: 'Lyra — AI Voice Receptionist', category: 'SaaS', img: null, tags: ['AI SaaS', 'Voice AI', 'Built by DDW'], metrics: { 'Calls Handled': '978+', 'Availability': '24/7' }, url: 'https://lyrabyddw.com' },
  { id: 'sviluppiamo', title: 'Sviluppiamo.dev — Vibe Coding', category: 'SaaS', img: null, tags: ['SaaS', 'Vibe Coding', 'Italy Market'], metrics: { Market: 'Italy', Stack: 'Next.js + AI' }, url: 'https://sviluppiamo.dev' },
];

const CATEGORIES = ['All', 'Meta Ads', 'Google Ads', 'Amazon', 'TikTok Shop', 'SEO', 'SaaS'];
const ITEMS_PER_PAGE = 6;

const CAT_COLORS = {
  'Meta Ads':    '#FF570F',
  'Google Ads':  '#FDE87A',
  'Amazon':      '#EE7D1D',
  'TikTok Shop': '#ff4d6d',
  'SEO':         '#4ade80',
  'SaaS':        '#a78bfa',
  'All':         '#FF570F',
};

const CAT_ICONS = {
  'All': '◈',
  'Meta Ads': 'ƒ',
  'Google Ads': 'G',
  'Amazon': 'a',
  'TikTok Shop': '♪',
  'SEO': '⟳',
  'SaaS': '⬡',
};

// ─── Hooks ─────────────────────────────────────────────────────────────────────
const useMagnetic = (ref, strength = 0.22) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' });
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      });
    };
    const leave = () => { cancelAnimationFrame(raf); xTo(0); yTo(0); };
    el.addEventListener('mousemove', move, { passive: true });
    el.addEventListener('mouseleave', leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [strength]);
};

// ─── Marquee ───────────────────────────────────────────────────────────────────
const Marquee = () => {
  const items = ['$683K Meta/mo', '600% ROAS', '$2.7M Amazon', '14.54x ROAS', '$290K GMV', '15,594 Conversions', '251K SEO Clicks', '+121% TikTok Growth', '4.86x ROAS', '978+ AI Calls'];
  const track = [...items, ...items, ...items];
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(90deg,#080a0c,transparent)' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(-90deg,#080a0c,transparent)' }} />
      <div style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap', animation: 'mq 32s linear infinite', willChange: 'transform' }}>
        {track.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)' }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#FF570F', display: 'inline-block', flexShrink: 0 }} />
            {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes mq{from{transform:translate3d(0,0,0)}to{transform:translate3d(-33.33%,0,0)}}`}</style>
    </div>
  );
};

// ─── Filter Tab ────────────────────────────────────────────────────────────────
const FilterTab = memo(({ cat, isActive, onClick, count }) => {
  const ref = useRef(null);
  useMagnetic(ref, 0.12);
  const accent = CAT_COLORS[cat];
  return (
    <button
      ref={ref} onClick={onClick}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 16px', borderRadius: 99, fontSize: 10, fontWeight: 900,
        textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer',
        border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.07)'}`,
        background: isActive ? accent : 'rgba(255,255,255,0.035)',
        color: isActive ? '#000' : 'rgba(255,255,255,0.4)',
        boxShadow: isActive ? `0 0 28px ${accent}45` : 'none',
        transition: 'all 0.25s ease',
        willChange: 'transform',
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = `${accent}50`; e.currentTarget.style.color = accent; e.currentTarget.style.background = `${accent}10`; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.035)'; } }}
    >
      <span style={{ fontSize: 11 }}>{CAT_ICONS[cat]}</span>
      {cat}
      {count != null && <span style={{ fontSize: 9, opacity: 0.55, fontWeight: 700 }}>{count}</span>}
    </button>
  );
});
FilterTab.displayName = 'FilterTab';

// ─── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = memo(({ item, index }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const dest = item.url || `/projects/${item.id}`;
  const isExternal = !!item.url;
  const accent = CAT_COLORS[item.category] || '#FF570F';
  const primaryVal = Object.values(item.metrics)[0];
  const primaryKey = Object.keys(item.metrics)[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 44, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out',
          delay: (index % ITEMS_PER_PAGE) * 0.065,
          scrollTrigger: { trigger: cardRef.current, start: 'top 92%', once: true }
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  // cursor glow follow
  const handleMouseMove = useCallback((e) => {
    if (!glowRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glowRef.current.style.background = `radial-gradient(200px circle at ${x}px ${y}px, ${accent}18, transparent 70%)`;
  }, [accent]);

  const inner = (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        opacity: 0, position: 'relative', display: 'flex', flexDirection: 'column',
        borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        background: 'linear-gradient(155deg, #111418 0%, #0b0d11 100%)',
        border: `1px solid ${hovered ? accent + '38' : 'rgba(255,255,255,0.055)'}`,
        boxShadow: hovered ? `0 2px 0 ${accent}25 inset, 0 24px 60px rgba(0,0,0,0.55)` : '0 4px 24px rgba(0,0,0,0.35)',
        transition: 'border-color 0.35s, box-shadow 0.35s',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    >
      {/* Cursor glow layer */}
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, borderRadius: 18, transition: 'opacity 0.3s', opacity: hovered ? 1 : 0 }} />

      {/* Top accent bar */}
      <div style={{ height: 2, background: hovered ? `linear-gradient(90deg, ${accent}, ${accent}00)` : 'rgba(255,255,255,0.04)', transition: 'background 0.4s', position: 'relative', zIndex: 1 }} />

      {/* Image / stat zone */}
      <div style={{ position: 'relative', height: 210, background: '#090b0f', overflow: 'hidden', zIndex: 1 }}>
        {item.img ? (
          <>
            {!imgLoaded && <div style={{ position: 'absolute', inset: 0, background: `${accent}06`, animation: 'pulse 2s ease infinite' }} />}
            <img
              src={item.img} alt={item.title} loading="lazy"
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
                opacity: imgLoaded ? (hovered ? 0.65 : 0.45) : 0,
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'opacity 0.5s, transform 0.7s ease',
                willChange: 'transform, opacity',
              }}
            />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(ellipse at 50% 0%, ${accent}14, transparent 65%)` }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.045, backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: primaryVal.length > 6 ? '3rem' : '4.8rem',
                fontWeight: 900, color: accent, lineHeight: 1,
                letterSpacing: '-0.04em',
                textShadow: `0 0 60px ${accent}55`,
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.5s ease',
                willChange: 'transform',
              }}>
                {primaryVal}
              </div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: `${accent}55`, marginTop: 6 }}>{primaryKey}</div>
            </div>
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, #0b0d11 100%)', pointerEvents: 'none' }} />

        {/* Category badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <span style={{
            padding: '4px 10px', fontSize: 9, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.18em', borderRadius: 99,
            background: `${accent}18`, color: accent, border: `1px solid ${accent}35`,
          }}>
            {item.category}
          </span>
        </div>

        {/* Live badge */}
        {isExternal && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', borderRadius: 99, background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live
            </span>
          </div>
        )}

        {/* Tags — slide up on hover */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', flexWrap: 'wrap', gap: 5, zIndex: 2 }}>
          {item.tags.map((tag, i) => (
            <span key={tag} style={{
              padding: '3px 8px', fontSize: 9, fontWeight: 700, borderRadius: 99,
              background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.09)', textTransform: 'uppercase', letterSpacing: '0.12em',
              backdropFilter: 'blur(8px)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.3s ${i * 45}ms, transform 0.3s ${i * 45}ms`,
              willChange: 'transform, opacity',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 20px 18px', position: 'relative', zIndex: 1 }}>
        <h4 style={{ fontSize: 15, fontWeight: 900, lineHeight: 1.3, color: hovered ? '#fff' : 'rgba(255,255,255,0.86)', marginBottom: 14, letterSpacing: '-0.01em', transition: 'color 0.3s' }}>
          {item.title}
        </h4>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
          {Object.entries(item.metrics).slice(0, 3).map(([key, val], i) => (
            <div key={key} style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)', transition: `transform 0.3s ${i * 40}ms`, willChange: 'transform' }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: '-0.01em' }}>{val}</div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginTop: 2 }}>{key}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: hovered ? `linear-gradient(90deg, ${accent}35, transparent)` : 'rgba(255,255,255,0.045)', transition: 'background 0.4s', marginBottom: 14 }} />

        {/* Footer CTA */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: hovered ? accent : 'rgba(255,255,255,0.2)', transition: 'color 0.3s' }}>
            {isExternal ? 'Visit Live' : 'View Project'}
          </span>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovered ? accent : 'rgba(255,255,255,0.05)',
            border: `1px solid ${hovered ? accent : 'rgba(255,255,255,0.07)'}`,
            transform: hovered ? 'rotate(45deg) scale(1.1)' : 'rotate(0) scale(1)',
            boxShadow: hovered ? `0 0 18px ${accent}55` : 'none',
            transition: 'all 0.3s ease',
            willChange: 'transform',
          }}>
            <svg style={{ width: 13, height: 13, color: hovered ? '#000' : 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );

  return isExternal
    ? <a href={dest} target="_blank" rel="noopener noreferrer" style={{ display: 'block', outline: 'none', textDecoration: 'none' }}>{inner}</a>
    : <Link to={dest} style={{ display: 'block', outline: 'none', textDecoration: 'none' }}>{inner}</Link>;
});
ProjectCard.displayName = 'ProjectCard';

// ─── Pagination Button ─────────────────────────────────────────────────────────
const PageBtn = memo(({ onClick, disabled, isActive, children, label }) => {
  const ref = useRef(null);
  useMagnetic(ref, 0.18);
  return (
    <button
      ref={ref} onClick={onClick} disabled={disabled} aria-label={label}
      style={{
        width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 900, cursor: disabled ? 'not-allowed' : 'pointer',
        background: isActive ? '#FF570F' : disabled ? 'transparent' : 'rgba(255,255,255,0.04)',
        color: isActive ? '#000' : disabled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.55)',
        border: `1px solid ${isActive ? '#FF570F' : disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: isActive ? '0 0 22px #FF570F45' : 'none',
        transition: 'all 0.25s ease', willChange: 'transform',
      }}
    >
      {children}
    </button>
  );
});
PageBtn.displayName = 'PageBtn';

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsBar = () => {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sb', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true } });
    }, ref);
    return () => ctx.revert();
  }, []);
  const stats = [{ v: '$683K+', l: 'Meta / Month' }, { v: '14', l: 'Live Projects' }, { v: '$2.7M+', l: 'Amazon Sales' }, { v: '600%', l: 'Peak ROAS' }];
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, margin: '20px 0 24px' }}>
      {stats.map((s, i) => (
        <div key={i} className="sb" style={{
          opacity: 0, textAlign: 'center', padding: '14px 10px', borderRadius: 12,
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)',
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>{s.v}</div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>{s.l}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllProjects = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filtered = activeCategory === 'All' ? projectsData : projectsData.filter(p => p.category === activeCategory);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Category change with grid fade
  const handleCategoryChange = useCallback((cat) => {
    if (cat === activeCategory) return;
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0, y: 10, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          setActiveCategory(cat);
          setCurrentPage(1);
          gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        }
      });
    } else {
      setActiveCategory(cat);
      setCurrentPage(1);
    }
  }, [activeCategory]);

  const goTo = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0, y: 8, duration: 0.18, ease: 'power2.in',
        onComplete: () => {
          setCurrentPage(page);
          gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      setCurrentPage(page);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [totalPages]);

  // Header animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hi',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const accentColor = CAT_COLORS[activeCategory];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', minHeight: '100vh',
        background: '#080a0c', color: '#fff',
        overflow: 'hidden', scrollMarginTop: 96,
      }}
    >
      {/* Atmosphere */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, #FF570F 0%, transparent 65%)', filter: 'blur(170px)', opacity: 0.032, pointerEvents: 'none', transform: 'translateZ(0)' }} />
      <div style={{ position: 'absolute', bottom: '30%', left: 0, width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, #FDE87A 0%, transparent 65%)', filter: 'blur(140px)', opacity: 0.022, pointerEvents: 'none', transform: 'translateZ(0)' }} />

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* ── Header ── */}
      <div ref={headerRef} style={{ position: 'relative', padding: '80px 24px 0', maxWidth: 1200, margin: '0 auto' }}>

        {/* Eyebrow */}
        <div className="hi" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ height: 1, width: 32, background: '#FF570F' }} />
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.28em', color: '#FF570F' }}>
            Real Accounts · Real Numbers · No Projections
          </span>
        </div>

        {/* Title + desc */}
        <div className="hi" style={{ opacity: 0, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{
              fontSize: 'clamp(44px, 8vw, 90px)', fontWeight: 900,
              lineHeight: 0.95, letterSpacing: '-0.03em', margin: 0,
            }}>
              <span style={{ color: '#fff', display: 'block' }}>Projects</span>
              <span style={{
                background: 'linear-gradient(135deg, #FF570F 0%, #FDE87A 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', display: 'block',
              }}>
                We've Built.
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, lineHeight: 1.7, maxWidth: 280, textAlign: 'right', margin: 0 }}>
              Every number is from a live account.<br />Dashboard screenshots available on request.
            </p>
          </div>
        </div>

        {/* Marquee */}
        <div className="hi" style={{ opacity: 0 }}>
          <Marquee />
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Filter tabs */}
        <div className="hi" style={{ opacity: 0, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', paddingBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <FilterTab
              key={cat} cat={cat}
              isActive={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
              count={cat !== 'All' ? projectsData.filter(p => p.category === cat).length : null}
            />
          ))}
        </div>
      </div>

      {/* ── Grid Section ── */}
      <div style={{ position: 'relative', padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Grid meta bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 14, width: 2, borderRadius: 2, background: accentColor, transition: 'background 0.3s' }} />
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor, transition: 'color 0.3s' }}>
              {activeCategory === 'All' ? 'All Projects' : activeCategory}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>— {filtered.length} results</span>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700 }}>
            {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
        </div>

        {/* Grid */}
        <div ref={gridRef}>
          {visibleProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {visibleProjects.map((item, index) => (
                <ProjectCard key={`${item.id}-${currentPage}-${activeCategory}`} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 20px', borderRadius: 16,
              background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 900 }}>
                No projects in this category yet
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 48 }}>
            <PageBtn onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} label="Previous">←</PageBtn>
            {pageNumbers().map(num => (
              <PageBtn key={num} onClick={() => goTo(num)} isActive={num === currentPage} label={`Page ${num}`}>{num}</PageBtn>
            ))}
            <PageBtn onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} label="Next">→</PageBtn>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProjects;