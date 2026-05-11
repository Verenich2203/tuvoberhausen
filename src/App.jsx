import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --blue:    #0A4FA0;
      --blue-deep:#062D63;
      --blue-mid: #1A6EC4;
      --sky:      #4AA3DF;
      --sky-light:#D6ECFB;
      --white:    #FFFFFF;
      --off-white:#F4F7FB;
      --charcoal: #12202E;
      --slate:    #4A637A;
      --muted:    #7A90A4;
      --border:   #DDE6EF;
      --red:      #D63030;
      --green:    #1B9D5E;
      --gold:     #C8952A;
      --radius:   14px;
    }

    html { scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--off-white);
      color: var(--charcoal);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    h1,h2,h3,h4,h5 { font-family: 'DM Sans', sans-serif; line-height: 1.15; color: var(--charcoal); font-weight: 700; }

    .bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
    .serif { font-family: 'DM Serif Display', serif; }

    a { text-decoration: none; color: inherit; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

    /* Sections */
    .section { padding: 100px 0; }
    .section-sm { padding: 60px 0; }

    /* Container */
    .wrap { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 60px; }
    @media(max-width:768px){ .wrap { padding: 0 24px; } }

    /* Tag */
    .tag {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--blue); background: var(--sky-light); padding: 6px 14px; border-radius: 100px;
    }
    .tag-dark {
      color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px;
      letter-spacing: 0.06em; text-transform: uppercase;
      padding: 15px 30px; border-radius: var(--radius); border: none; cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .btn-blue {
      background: var(--blue); color: var(--white);
      box-shadow: 0 6px 20px rgba(10,79,160,0.3);
    }
    .btn-blue:hover { background: var(--blue-mid); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(10,79,160,0.4); }
    .btn-white {
      background: var(--white); color: var(--blue);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .btn-ghost {
      background: rgba(255,255,255,0.1); color: var(--white);
      border: 1.5px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px);
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.2); }
    .btn-lg { padding: 18px 40px; font-size: 14px; }

    /* Form */
    .form-row { display: grid; gap: 20px; }
    .form-row-2 { grid-template-columns: 1fr 1fr; }
    .form-row-3 { grid-template-columns: 1fr 1fr 1fr; }
    @media(max-width:640px){ .form-row-2,.form-row-3 { grid-template-columns: 1fr; } }

    .field { display: flex; flex-direction: column; gap: 7px; }
    .field label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--slate); }
    .field input, .field select, .field textarea {
      font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--charcoal);
      background: var(--off-white); border: 2px solid var(--border); border-radius: 10px;
      padding: 13px 16px; transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none; border-color: var(--blue); background: #fff;
      box-shadow: 0 0 0 4px rgba(10,79,160,0.1);
    }
    .field textarea { resize: vertical; min-height: 100px; }
    .field select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%234A637A' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 42px; cursor: pointer; }

    /* Card */
    .card {
      background: var(--white); border-radius: 20px; border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); }

    /* Divider */
    .divider { width: 50px; height: 3px; background: var(--blue); border-radius: 2px; margin: 16px 0 24px; }

    /* Grid layouts */
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    @media(max-width:1024px){ .grid-4{grid-template-columns:repeat(2,1fr);} .grid-3{grid-template-columns:repeat(2,1fr);} }
    @media(max-width:640px){ .grid-4,.grid-3,.grid-2{grid-template-columns:1fr;} }

    /* Stat badge */
    .stat-badge { text-align: center; }
    .stat-badge .number { font-family: 'Bebas Neue',sans-serif; font-size: 56px; color: var(--blue); line-height: 1; }
    .stat-badge .label { font-size: 13px; color: var(--slate); font-weight: 500; margin-top: 4px; }

    /* Step line */
    .steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; position: relative; }
    .steps::before { content:''; position:absolute; top:28px; left:calc(100%/8); right:calc(100%/8); height:2px; background: linear-gradient(90deg, var(--blue), var(--sky)); z-index:0; }
    @media(max-width:768px){ .steps{grid-template-columns:1fr 1fr;} .steps::before{display:none;} }

    /* Testimonial */
    .stars { color: var(--gold); font-size: 16px; letter-spacing: 2px; }

    /* Price table */
    .price-card { border-radius: 20px; overflow: hidden; border: 2px solid var(--border); background: var(--white); transition: all 0.3s; }
    .price-card:hover { border-color: var(--blue); box-shadow: 0 16px 48px rgba(10,79,160,0.12); transform: translateY(-6px); }
    .price-card.featured { border-color: var(--blue); background: linear-gradient(160deg, var(--blue-deep), var(--blue)); color: var(--white); }

    /* Notice bar */
    .notice { background: var(--blue); color: var(--white); text-align: center; padding: 10px; font-size: 13px; font-weight: 500; }

    /* FAQ accordion */
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-q { width:100%; background:none; border:none; text-align:left; cursor:pointer; padding: 22px 0; display:flex; justify-content:space-between; align-items:center; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:600; color:var(--charcoal); gap:16px; }
    .faq-q .icon { width:28px; height:28px; border-radius:50%; background:var(--sky-light); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.3s; }
    .faq-q.open .icon { background:var(--blue); color:var(--white); transform:rotate(45deg); }
    .faq-a { font-size:14px; line-height:1.8; color:var(--slate); padding-bottom:20px; }

    /* Map */
    .map-wrap { border-radius: 24px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.08); }

    /* Floating info cards */
    .float-card { background:var(--white); border-radius:12px; padding:16px 20px; box-shadow:0 8px 30px rgba(0,0,0,0.12); display:inline-flex; align-items:center; gap:12px; }

    /* Nav */
    .nav-link { font-size:14px; font-weight:600; color:var(--charcoal); padding:8px 4px; position:relative; transition:color 0.2s; }
    .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px; background:var(--blue); transform:scaleX(0); transition:transform 0.2s; }
    .nav-link:hover::after { transform:scaleX(1); }
    .nav-link:hover { color:var(--blue); }

    /* Mobile menu */
    @media(max-width:900px){
      .nav-desktop { display: none !important; }
      .nav-mobile-btn { display: flex !important; }
    }

    /* Noise overlay */
    .noise::before {
      content:''; position:absolute; inset:0; pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      background-size: 200px;
    }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Check: ({size=20,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Close: ({size=22}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock: ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Shield: ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Car: ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h10l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>,
  Wrench: ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Clipboard: ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Star: ({filled=true}) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled?"var(--gold)":"none"} stroke="var(--gold)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  ArrowRight: ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Leaf: ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 8C8 10 5.9 16.17 3.82 19.72A2 2 0 0 0 5 22c2.24-.47 4.43-1.82 7-4 2.64-2.24 4.53-5.52 5-10z"/><path d="M22 2s-4 0-7 3"/></svg>,
  Award: ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
};

// ─── NOTICE BAR ───────────────────────────────────────────────────────────────
const NoticeBar = () => (
  <div className="notice">
    📢 <strong>Sonderaktion bis 31. Mai:</strong> 10 % Rabatt auf HU/AU bei Online-Terminbuchung — Code: <strong>SICHER10</strong>
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ onBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(0,0,0,0.06)', transition: 'all 0.3s' }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: 'var(--blue)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Shield size={20} color="#fff" />
          </div>
          <div>
            <div className="bebas" style={{ fontSize: '22px', color: 'var(--charcoal)', letterSpacing: '0.06em', lineHeight: 1 }}>
              TÜV<span style={{ color: 'var(--blue)' }}>STATION</span>
            </div>
            <div style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Oberhausen • seit 1998</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="nav-desktop" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['#leistungen:Leistungen', '#preise:Preise', '#ablauf:Ablauf', '#bewertungen:Bewertungen', '#faq:FAQ', '#standort:Standort'].map(item => {
            const [href, label] = item.split(':');
            return <a key={href} href={href} className="nav-link">{label}</a>;
          })}
        </nav>

        {/* Right side */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="tel:+491234567890" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--blue)' }}>
            <Icon.Phone /> <span>+49 123 456789</span>
          </a>
          <button className="btn btn-blue" style={{ padding: '10px 20px', fontSize: '12px' }} onClick={onBooking}>
            Termin buchen
          </button>
        </div>

        {/* Mobile */}
        <button className="nav-mobile-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} onClick={() => setMenuOpen(!menuOpen)}>
          <div style={{ width: '24px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0, 1, 2].map(i => <div key={i} style={{ height: '2px', background: 'var(--charcoal)', borderRadius: '1px' }} />)}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['#leistungen:Leistungen', '#preise:Preise', '#ablauf:Ablauf', '#bewertungen:Bewertungen', '#faq:FAQ', '#standort:Standort'].map(item => {
              const [href, label] = item.split(':');
              return <a key={href} href={href} style={{ fontWeight: 600, fontSize: '16px' }} onClick={() => setMenuOpen(false)}>{label}</a>;
            })}
            <button className="btn btn-blue" onClick={() => { onBooking(); setMenuOpen(false); }}>Termin buchen</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onBooking }) => {
  return (
    <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--blue-deep)' }}>
      {/* BG layers */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("tuvv.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(6,45,99,0.97) 0%, rgba(6,45,99,0.85) 45%, rgba(10,79,160,0.5) 100%)' }} />
        {/* Geometric accents */}
        <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,163,223,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '10%', bottom: '5%', width: '200px', height: '200px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '15%', bottom: '8%', width: '120px', height: '120px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px', alignItems: 'center' }}>
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div className="tag tag-dark" style={{ marginBottom: '24px' }}>✓ Offizieller DEKRA-Prüfstützpunkt</div>
            <h1 className="bebas" style={{ fontSize: 'clamp(52px, 7vw, 86px)', color: 'white', lineHeight: 1.0, marginBottom: '24px' }}>
              HAUPTUNTERSUCHUNG<br/>
              <span style={{ color: 'var(--sky)' }}>SCHNELL.</span> SICHER.<br/>
              ZUVERLÄSSIG.
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: '36px', maxWidth: '520px' }}>
              Ihr zertifizierter TÜV-Prüfpunkt in Oberhausen. Buchen Sie Ihre HU & AU online — ohne Wartezeiten, transparent und professionell.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <button className="btn btn-white btn-lg" onClick={onBooking} style={{ gap: '10px' }}>
                Online Termin buchen <Icon.ArrowRight size={18} />
              </button>
              <a href="#leistungen" className="btn btn-ghost btn-lg">Alle Leistungen</a>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '32px' }}>
              {[['25+', 'Jahre Erfahrung'], ['18 000+', 'Prüfungen/Jahr'], ['4.9★', 'Google Bewertung'], ['98%', 'Erstzulassung']].map(([n, l]) => (
                <div key={l}>
                  <div className="bebas" style={{ fontSize: '32px', color: 'var(--sky)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — quick book */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <QuickBookCard />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Icon.ChevronDown />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── QUICK BOOK CARD ──────────────────────────────────────────────────────────
const QuickBookCard = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ service: '', date: '', time: '' });

  const services = ['Hauptuntersuchung (HU)', 'Abgasuntersuchung (AU)', 'HU + AU (Kombi)', 'Vorab-Check', 'Eintragung / Abnahme'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
      <div style={{ padding: '28px 28px 0', display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {['Leistung', 'Datum', 'Zeit'].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: i <= step ? 'var(--sky)' : 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>{s}</div>
            <div style={{ height: '3px', borderRadius: '2px', background: i <= step ? 'var(--sky)' : 'rgba(255,255,255,0.15)' }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '0 28px 28px' }}>
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: 500 }}>Was soll geprüft werden?</div>
            {services.map(s => (
              <button key={s} onClick={() => { setData(d => ({ ...d, service: s })); setStep(1); }}
                style={{ background: data.service === s ? 'var(--blue)' : 'rgba(255,255,255,0.08)', border: data.service === s ? 'none' : '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: data.service === s ? 600 : 400 }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: 500 }}>Wunschdatum wählen</div>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              value={data.date} onChange={e => setData(d => ({ ...d, date: e.target.value }))}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '13px 16px', color: 'white', fontSize: '15px', fontFamily: 'DM Sans', colorScheme: 'dark', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-ghost" onClick={() => setStep(0)} style={{ flex: 1 }}>Zurück</button>
              <button className="btn btn-blue" onClick={() => data.date && setStep(2)} style={{ flex: 2, opacity: data.date ? 1 : 0.5 }}>Weiter</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: 500 }}>Uhrzeit wählen</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
              {times.map(t => (
                <button key={t} onClick={() => setData(d => ({ ...d, time: t }))}
                  style={{ background: data.time === t ? 'var(--blue)' : 'rgba(255,255,255,0.08)', border: data.time === t ? 'none' : '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>Zurück</button>
              <button className="btn btn-white" onClick={() => data.time && setStep(3)} style={{ flex: 2, color: 'var(--blue)', opacity: data.time ? 1 : 0.5 }}>Weiter</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Fast fertig!</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{data.service}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>{data.date} um {data.time} Uhr</div>
            <a href="#termin" className="btn btn-white" style={{ color: 'var(--blue)', width: '100%', justifyContent: 'center' }}>
              Jetzt vollständig buchen
            </a>
            <button onClick={() => { setStep(0); setData({ service: '', date: '', time: '' }); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', marginTop: '12px' }}>
              Neu starten
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
const TrustBar = () => (
  <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>
    <div className="wrap" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '22px 60px', flexWrap: 'wrap', gap: '20px' }}>
      {[
        ['🏆', 'DEKRA-zertifiziert'],
        ['⚡', 'Kurze Wartezeiten'],
        ['💶', 'Transparente Preise'],
        ['📱', 'Online-Buchung 24/7'],
        ['🔧', 'Erfahrene Ingenieure'],
        ['🌿', 'Umwelt-zertifiziert'],
      ].map(([e, t]) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{e}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate)' }}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const Services = () => {
  const services = [
    { icon: <Icon.Shield size={32} />, title: 'Hauptuntersuchung (HU)', desc: 'Gesetzlich vorgeschriebene Sicherheitsprüfung nach § 29 StVZO — bei uns schnell und ohne Termin-Stress.', tag: 'Pflicht', price: 'ab 79 €' },
    { icon: <Icon.Leaf size={32} />, title: 'Abgasuntersuchung (AU)', desc: 'Emissionsprüfung Ihres Fahrzeugs. Oft kombiniert mit der HU — so sparen Sie Zeit und Geld.', tag: 'Kombi möglich', price: 'ab 29 €' },
    { icon: <Icon.Wrench size={32} />, title: 'Vorab-Check', desc: 'Wir prüfen Ihr Fahrzeug vorab auf mögliche Mängel, damit Sie beim ersten Versuch bestehen.', tag: 'Empfohlen', price: 'ab 49 €' },
    { icon: <Icon.Clipboard size={32} />, title: 'Eintragungen & Abnahmen', desc: 'Abnahme von Tuning, Felgen, Fahrwerk und anderen Fahrzeugveränderungen (§ 19 StVZO).', tag: 'Flexibel', price: 'ab 89 €' },
    { icon: <Icon.Car size={32} />, title: 'Motorrad-HU', desc: 'Spezielle Hauptuntersuchung für Motorräder und Leichtkrafträder — saisongerecht und effizient.', tag: 'Saisonal', price: 'ab 69 €' },
    { icon: <Icon.Award size={32} />, title: 'Oldtimer-Gutachten', desc: '§ 23 StVZO Prüfung für Oldtimer inklusive Gutachten für das H-Kennzeichen.', tag: 'Speziell', price: 'ab 149 €' },
  ];

  return (
    <section id="leistungen" className="section" style={{ background: 'var(--off-white)' }}>
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '52px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="tag" style={{ marginBottom: '14px' }}>Leistungen</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Alles aus einer Hand</h2>
            <div className="divider" />
            <p style={{ color: 'var(--slate)', fontSize: '15px', maxWidth: '480px' }}>Von der Pflichtprüfung bis zum Spezial-Gutachten — wir haben alles, was Ihr Fahrzeug braucht.</p>
          </div>
          <a href="#termin" className="btn btn-blue">Termin buchen</a>
        </motion.div>

        <div className="grid-3">
          {services.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--sky-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                  {s.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span className="tag" style={{ fontSize: '10px', padding: '4px 10px' }}>{s.tag}</span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '20px', color: 'var(--blue)', letterSpacing: '0.04em' }}>{s.price}</span>
                </div>
              </div>
              <h3 style={{ fontSize: '17px', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.65 }}>{s.desc}</p>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--blue)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                Mehr erfahren <Icon.ChevronRight />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PRICING ──────────────────────────────────────────────────────────────────
const Pricing = () => {
  const plans = [
    {
      name: 'HU Basis', price: '79', unit: '€',
      desc: 'Hauptuntersuchung für PKW bis 3,5 t',
      features: ['Fahrzeugsicherheitsprüfung', 'Prüfprotokoll', 'Mängelbeseitigung nach 30 Tagen', 'Standard-Termin'],
      cta: 'Jetzt buchen', featured: false
    },
    {
      name: 'HU + AU Kombi', price: '99', unit: '€',
      desc: 'Beste Wahl — alles in einem Termin',
      features: ['Hauptuntersuchung', 'Abgasuntersuchung', 'Prüfprotokoll & Plakette', 'Prioritäts-Termin', '10 % Rabatt online'],
      cta: 'Beliebteste Option', featured: true
    },
    {
      name: 'Premium Paket', price: '159', unit: '€',
      desc: 'HU + AU + Vorab-Check + Beratung',
      features: ['HU + AU Kombi', 'Vorab-Check inklusive', 'Technische Beratung', 'Express-Termin', 'Kostenlose Nachprüfung'],
      cta: 'Jetzt buchen', featured: false
    }
  ];

  return (
    <section id="preise" className="section" style={{ background: 'var(--blue-deep)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(74,163,223,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div className="wrap" style={{ position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div className="tag tag-dark" style={{ marginBottom: '14px' }}>Preise</div>
          <h2 style={{ color: 'white', fontSize: 'clamp(28px, 4vw, 40px)' }}>Transparente Preise</h2>
          <div className="divider" style={{ margin: '16px auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px' }}>Keine versteckten Kosten. Alle Preise inklusive MwSt.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {plans.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="price-card" style={p.featured ? { transform: 'scale(1.04)' } : {}}>
              {p.featured && (
                <div style={{ background: 'rgba(255,255,255,0.15)', textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: p.featured ? 'white' : 'var(--blue)' }}>
                  ⭐ Meistgewählt
                </div>
              )}
              <div style={{ padding: '28px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: p.featured ? 'rgba(255,255,255,0.7)' : 'var(--slate)', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '52px', color: p.featured ? 'white' : 'var(--blue)', lineHeight: 1 }}>{p.price}</span>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: p.featured ? 'rgba(255,255,255,0.7)' : 'var(--slate)', paddingBottom: '8px' }}>{p.unit}</span>
                </div>
                <p style={{ fontSize: '13px', color: p.featured ? 'rgba(255,255,255,0.6)' : 'var(--muted)', marginBottom: '20px' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: p.featured ? 'rgba(255,255,255,0.2)' : 'var(--sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon.Check size={10} color={p.featured ? 'white' : 'var(--blue)'} />
                      </div>
                      <span style={{ fontSize: '13px', color: p.featured ? 'rgba(255,255,255,0.8)' : 'var(--charcoal)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#termin" className="btn" style={{ width: '100%', background: p.featured ? 'white' : 'var(--blue)', color: p.featured ? 'var(--blue)' : 'white', justifyContent: 'center', fontSize: '13px' }}>
                  {p.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '28px' }}>
          * Preise gelten für PKW bis 3,5 t. Abweichungen für LKW, Motorrad und Oldtimer möglich.
        </p>
      </div>
    </section>
  );
};

// ─── STEPS ────────────────────────────────────────────────────────────────────
const Steps = () => {
  const steps = [
    { num: '01', icon: '📅', title: 'Online buchen', desc: 'Wählen Sie Leistung, Datum und Uhrzeit direkt über unser Buchungsformular — 24/7 verfügbar.' },
    { num: '02', icon: '📩', title: 'Bestätigung', desc: 'Sie erhalten sofort eine Bestätigungs-E-Mail mit allen Details und einer Erinnerung.' },
    { num: '03', icon: '🚗', title: 'Fahrzeug bringen', desc: 'Kommen Sie pünktlich zu uns. Unsere Experten nehmen Ihr Fahrzeug direkt in Empfang.' },
    { num: '04', icon: '✅', title: 'Plakette mitnehmen', desc: 'Nach bestandener Prüfung erhalten Sie direkt Ihre Plakette und alle Dokumente.' },
  ];

  return (
    <section id="ablauf" className="section" style={{ background: 'var(--white)' }}>
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="tag" style={{ marginBottom: '14px' }}>Ablauf</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>In 4 Schritten zur Plakette</h2>
          <div className="divider" style={{ margin: '16px auto' }} />
        </motion.div>

        <div className="steps">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              style={{ textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '22px', boxShadow: '0 6px 20px rgba(10,79,160,0.3)' }}>
                {s.icon}
              </div>
              <div className="bebas" style={{ fontSize: '11px', color: 'var(--blue)', letterSpacing: '0.15em', marginBottom: '6px' }}>{s.num}</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.65 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── STATS BAND ───────────────────────────────────────────────────────────────
const StatsBand = () => (
  <div style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-mid) 100%)', padding: '60px 0' }}>
    <div className="wrap">
      <div className="grid-4">
        {[['18 000+', 'Prüfungen jährlich'], ['25', 'Jahre im Einsatz'], ['4.9 / 5', 'Kundenbewertung'], ['98 %', 'Erst-Bestehensquote']].map(([n, l], i) => (
          <motion.div key={l} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ textAlign: 'center', padding: '10px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
            <div className="bebas" style={{ fontSize: '52px', color: 'white', lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>{l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
const Reviews = () => {
  const reviews = [
    { name: 'Michael K.', date: 'März 2025', rating: 5, text: 'Absolut reibungsloser Ablauf. Online-Buchung war super einfach, kein Warten vor Ort und alles transparent erklärt. Komme definitiv wieder!', vehicle: 'VW Golf' },
    { name: 'Sandra L.', date: 'Februar 2025', rating: 5, text: 'Der Vorab-Check hat mir viel Geld gespart — kleiner Mangel wurde rechtzeitig gefunden. Team ist sehr freundlich und kompetent. Sehr empfehlenswert.', vehicle: 'Audi A3' },
    { name: 'Thomas B.', date: 'Januar 2025', rating: 5, text: 'Mein Oldtimer hat hier ein H-Gutachten bekommen. Die Prüfer haben wirklich Ahnung und erklären alles verständlich. Top Service!', vehicle: 'BMW 2002' },
    { name: 'Julia M.', date: 'April 2025', rating: 5, text: 'Kurze Wartezeit, nettes Personal und alles in ca. 45 Minuten erledigt. Viel schneller als beim letzten Anbieter. Klare Empfehlung!', vehicle: 'Mercedes A-Klasse' },
    { name: 'Ralf S.', date: 'März 2025', rating: 4, text: 'Sehr professioneller Prüfingenieur. Hat kleine Mängel erklärt und Tipps gegeben. Einen Stern Abzug nur wegen Parkplatzsituation.', vehicle: 'Ford Focus' },
    { name: 'Anna P.', date: 'Mai 2025', rating: 5, text: 'Zum dritten Mal hier und immer top zufrieden. Die Mitarbeiter erkennen mich sogar noch. Bester TÜV-Punkt in der Region!', vehicle: 'Toyota Yaris' },
  ];

  return (
    <section id="bewertungen" className="section" style={{ background: 'var(--off-white)' }}>
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="tag" style={{ marginBottom: '14px' }}>Kundenstimmen</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Was unsere Kunden sagen</h2>
            <div className="divider" />
          </div>
          <div style={{ display: 'flex', align: 'center', gap: '16px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="bebas" style={{ fontSize: '42px', color: 'var(--blue)', lineHeight: 1 }}>4.9</div>
              <div className="stars">★★★★★</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>682 Google-Bewertungen</div>
            </div>
          </div>
        </motion.div>

        <div className="grid-3">
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="card" style={{ padding: '24px' }}>
              <div className="stars" style={{ marginBottom: '12px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--slate)', marginBottom: '18px', fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{r.vehicle}</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{r.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── BOOKING FORM ─────────────────────────────────────────────────────────────
const BookingSection = () => {
  const [form, setForm] = useState({ leistung: '', fahrzeug: 'PKW', datum: '', zeit: '', kennzeichen: '', name: '', email: '', telefon: '', anmerkungen: '', promo: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="termin" className="section" style={{ background: 'var(--white)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: '60px', alignItems: 'start' }}>
          {/* Left info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="tag" style={{ marginBottom: '14px' }}>Online Buchung</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '16px' }}>Termin sichern —<br/>ganz einfach online.</h2>
            <div className="divider" />
            <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.75, marginBottom: '36px' }}>
              Füllen Sie das Formular aus und wir bestätigen Ihren Termin innerhalb von 2 Stunden per E-Mail oder Telefon.
            </p>

            {[
              ['⏱', 'Bestätigung in 2 Stunden', 'Wir melden uns schnell bei Ihnen zurück.'],
              ['💳', 'Vor Ort bezahlen', 'Bar oder EC-Karte — keine Vorauszahlung nötig.'],
              ['🔄', 'Kostenlose Stornierung', 'Bis 24h vor Termin kostenlos stornierbar.'],
              ['📋', 'Alle Dokumente direkt', 'Prüfprotokoll und Plakette erhalten Sie sofort.'],
            ].map(([e, t, d]) => (
              <div key={t} style={{ display: 'flex', gap: '16px', marginBottom: '22px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{e}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>{t}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '13px' }}>{d}</div>
                </div>
              </div>
            ))}

            <div style={{ background: 'var(--sky-light)', borderRadius: '14px', padding: '18px 20px', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
              <div style={{ fontSize: '24px' }}>🎁</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--blue)' }}>Aktionscode: SICHER10</div>
                <div style={{ fontSize: '13px', color: 'var(--slate)' }}>10 % Rabatt auf Ihren nächsten HU/AU-Termin</div>
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ background: 'var(--blue-deep)', padding: '24px 28px' }}>
                <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '4px' }}>Termin vereinbaren</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>Alle Felder mit * sind Pflichtfelder.</p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
                  <div className="form-row form-row-2" style={{ marginBottom: '20px' }}>
                    <div className="field">
                      <label>Leistung *</label>
                      <select value={form.leistung} onChange={e => set('leistung', e.target.value)} required>
                        <option value="">Bitte wählen...</option>
                        <option>Hauptuntersuchung (HU)</option>
                        <option>HU + AU Kombi</option>
                        <option>Abgasuntersuchung (AU)</option>
                        <option>Vorab-Check</option>
                        <option>Eintragung / Abnahme</option>
                        <option>Motorrad-HU</option>
                        <option>Oldtimer-Gutachten</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Fahrzeugart *</label>
                      <select value={form.fahrzeug} onChange={e => set('fahrzeug', e.target.value)} required>
                        <option>PKW</option>
                        <option>Motorrad</option>
                        <option>Transporter</option>
                        <option>LKW</option>
                        <option>Oldtimer</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row form-row-2" style={{ marginBottom: '20px' }}>
                    <div className="field">
                      <label>Wunschdatum *</label>
                      <input type="date" value={form.datum} onChange={e => set('datum', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="field">
                      <label>Uhrzeit *</label>
                      <select value={form.zeit} onChange={e => set('zeit', e.target.value)} required>
                        <option value="">Bitte wählen...</option>
                        <option>Vormittag (08–12 Uhr)</option>
                        <option>Nachmittag (12–17 Uhr)</option>
                        <option>Flexibel</option>
                      </select>
                    </div>
                  </div>

                  <div className="field" style={{ marginBottom: '20px' }}>
                    <label>Kennzeichen *</label>
                    <input type="text" placeholder="z.B. OB-AB 1234" value={form.kennzeichen} onChange={e => set('kennzeichen', e.target.value)} required />
                  </div>

                  <div className="form-row form-row-2" style={{ marginBottom: '20px' }}>
                    <div className="field">
                      <label>Ihr Name *</label>
                      <input type="text" placeholder="Max Mustermann" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="field">
                      <label>Telefon *</label>
                      <input type="tel" placeholder="+49 …" value={form.telefon} onChange={e => set('telefon', e.target.value)} required />
                    </div>
                  </div>

                  <div className="field" style={{ marginBottom: '20px' }}>
                    <label>E-Mail *</label>
                    <input type="email" placeholder="max@beispiel.de" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>

                  <div className="field" style={{ marginBottom: '20px' }}>
                    <label>Aktionscode</label>
                    <input type="text" placeholder="z.B. SICHER10" value={form.promo} onChange={e => set('promo', e.target.value)} />
                  </div>

                  <div className="field" style={{ marginBottom: '24px' }}>
                    <label>Anmerkungen</label>
                    <textarea placeholder="Besonderheiten, Mängel, Fragen…" value={form.anmerkungen} onChange={e => set('anmerkungen', e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-blue" style={{ width: '100%', fontSize: '14px', padding: '16px', justifyContent: 'center', gap: '10px' }}>
                    Termin verbindlich anfragen <Icon.ArrowRight size={18} />
                  </button>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '12px' }}>Durch Absenden stimmen Sie unserer Datenschutzerklärung zu.</p>
                </form>
              ) : (
                <div style={{ padding: '48px 28px', textAlign: 'center' }}>
                  <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎉</div>
                  <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Anfrage erhalten!</h3>
                  <p style={{ color: 'var(--slate)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>Wir melden uns innerhalb von 2 Stunden mit einer Bestätigung.<br/><strong>Ihr Termin: {form.datum} – {form.zeit}</strong></p>
                  <button className="btn btn-blue" onClick={() => setSubmitted(false)} style={{ margin: '0 auto' }}>Neuen Termin anfragen</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    ['Wie lange dauert eine HU?', 'Eine Standard-Hauptuntersuchung (HU) dauert bei uns in der Regel 30–45 Minuten. Mit AU-Kombi ca. 50–60 Minuten. Beim Vorab-Check kommen nochmals 15–20 Minuten dazu.'],
    ['Was muss ich zur HU mitbringen?', 'Fahrzeugschein (Zulassungsbescheinigung Teil I), Fahrzeugbrief (Teil II) ist nicht zwingend nötig, aber empfohlen. Bei Eintragungen bitte alle zugehörigen ABE-Dokumente oder Gutachten mitbringen.'],
    ['Was passiert wenn mein Auto nicht besteht?', 'Sie erhalten ein Mängelprotokoll. Geringe Mängel können innerhalb von einem Monat behoben und kostenlos nachgeprüft werden. Bei erheblichen Mängeln wird eine neue Buchung notwendig.'],
    ['Kann ich den Termin kostenlos stornieren?', 'Ja — bis 24 Stunden vor dem gebuchten Termin ist eine kostenlose Stornierung möglich. Bitte kontaktieren Sie uns per Telefon oder E-Mail.'],
    ['Welche Fahrzeuge prüfen Sie?', 'Wir prüfen PKW, Motorräder, Transporter, leichte LKW bis 7,5 t sowie Oldtimer (§ 23 Prüfung). Für schwere LKW bitte vorher anfragen.'],
    ['Gibt es einen Wartebereich?', 'Ja — bei uns gibt es einen komfortablen Wartebereich mit kostenlosem WLAN, frischem Kaffee und Lesematerial. Sie können Ihr Fahrzeug auch abgeben und später abholen.'],
  ];

  return (
    <section id="faq" className="section" style={{ background: 'var(--off-white)' }}>
      <div className="wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div className="tag" style={{ marginBottom: '14px' }}>Häufige Fragen</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>Alles was Sie wissen müssen</h2>
          <div className="divider" style={{ margin: '16px auto' }} />
        </motion.div>

        <div className="card" style={{ padding: '8px 32px' }}>
          {faqs.map(([q, a], i) => (
            <div key={i} className="faq-item">
              <button className={`faq-q${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
                <span>{q}</span>
                <span className="icon"><Icon.Plus /></span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                    <p className="faq-a">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CONTACT + MAP ────────────────────────────────────────────────────────────
const Contact = () => (
  <section id="standort" className="section" style={{ background: 'var(--white)' }}>
    <div className="wrap">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px' }}>
        <div className="tag" style={{ marginBottom: '14px' }}>Standort & Kontakt</div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>So finden Sie uns</h2>
        <div className="divider" style={{ margin: '16px auto' }} />
      </motion.div>

      <div className="grid-2" style={{ gap: '50px', alignItems: 'start' }}>
        {/* Map */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="map-wrap">
            <iframe src="https://maps.google.com/maps?q=51.472992,6.863788&hl=de&z=15&output=embed" width="100%" height="420" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" title="Karte" />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>TÜV Station Oberhausen</h3>

          {[
            [<Icon.MapPin />, 'Adresse', 'Musterstraße 123\n46045 Oberhausen'],
            [<Icon.Phone />, 'Telefon', '+49 123 456789'],
            [<Icon.Mail />, 'E-Mail', 'info@tuev-oberhausen.de'],
          ].map(([ico, label, val], i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '22px' }}>
              <div style={{ width: '42px', height: '42px', background: 'var(--sky-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0 }}>{ico}</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '3px' }}>{label}</div>
                <div style={{ fontSize: '15px', fontWeight: 500, whiteSpace: 'pre-line' }}>{val}</div>
              </div>
            </div>
          ))}

          <div style={{ background: 'var(--off-white)', borderRadius: '14px', padding: '20px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Icon.Clock size={16} />
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Öffnungszeiten</span>
            </div>
            {[['Mo–Fr', '08:00 – 17:00 Uhr'], ['Samstag', '09:00 – 14:00 Uhr'], ['Sonntag', 'Geschlossen']].map(([d, t]) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                <span style={{ color: 'var(--slate)' }}>{d}</span>
                <span style={{ fontWeight: 600 }}>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <a href="tel:+491234567890" className="btn btn-blue" style={{ flex: 1, justifyContent: 'center', gap: '8px' }}><Icon.Phone /> Anrufen</a>
            <a href="#termin" className="btn btn-white" style={{ flex: 1, justifyContent: 'center', border: '2px solid var(--border)', gap: '8px' }}><Icon.Calendar /> Termin</a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Add missing Calendar icon
Icon.Calendar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ openModal }) => (
  <footer style={{ background: 'var(--charcoal)', color: 'white' }}>
    <div className="wrap" style={{ padding: '60px 60px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--blue)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Shield size={18} color="#fff" />
          </div>
          <div className="bebas" style={{ fontSize: '20px', letterSpacing: '0.06em' }}>TÜV<span style={{ color: 'var(--sky)' }}>STATION</span></div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px', marginBottom: '20px' }}>
          Ihr zertifizierter Partner für HU & AU in Oberhausen. Seit 1998 schnell, sicher und zuverlässig.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['f', 'in', 'g'].map(s => (
            <div key={s} style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {[
        ['Leistungen', ['Hauptuntersuchung', 'Abgasuntersuchung', 'Vorab-Check', 'Eintragungen', 'Motorrad-HU', 'Oldtimer-Gutachten']],
        ['Unternehmen', ['Über uns', 'Team', 'Karriere', 'Presse', 'Kontakt']],
        ['Rechtliches', ['Impressum', 'Datenschutz', 'AGB', 'Cookie-Einstellungen']],
      ].map(([title, items]) => (
        <div key={title}>
          <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>{title}</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map(item => (
              <li key={item}>
                <button onClick={() => ['Impressum','Datenschutz','AGB'].includes(item) && openModal(item)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '14px', cursor: 'pointer', padding: 0, transition: 'color 0.2s', fontFamily: 'DM Sans' }}
                  onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>© {new Date().getFullYear()} TÜV Station Oberhausen GmbH — Alle Rechte vorbehalten.</span>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>DEKRA-zertifiziert | ISO 9001:2015</span>
    </div>
  </footer>
);

// ─── LEGAL MODAL ──────────────────────────────────────────────────────────────
const LegalModal = ({ title, onClose }) => {
  const content = {
    Impressum: <div><h4 style={{ marginBottom: '8px' }}>Angaben gemäß § 5 TMG</h4><p style={{ marginBottom: '16px', color: 'var(--slate)', lineHeight: 1.8 }}>TÜV Station Oberhausen GmbH<br/>Musterstraße 123<br/>46045 Oberhausen</p><h4 style={{ marginBottom: '8px' }}>Vertreten durch</h4><p style={{ color: 'var(--slate)', lineHeight: 1.8 }}>Geschäftsführer: Max Mustermann<br/>Telefon: +49 123 456789<br/>E-Mail: info@tuev-oberhausen.de</p></div>,
    Datenschutz: <p style={{ color: 'var(--slate)', lineHeight: 1.9 }}>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden auf dieser Website nur im technisch notwendigen Umfang erhoben und entsprechend der geltenden Datenschutzgesetze (DSGVO) behandelt.</p>,
    AGB: <p style={{ color: 'var(--slate)', lineHeight: 1.9 }}>Es gelten die allgemeinen Geschäftsbedingungen der TÜV Station Oberhausen GmbH. Terminbuchungen sind verbindlich. Stornierungen bis 24h vor Termin sind kostenfrei. Spätere Absagen können mit einer Bearbeitungsgebühr belegt werden.</p>,
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
          style={{ position: 'relative', background: 'white', width: '100%', maxWidth: '560px', maxHeight: '80vh', borderRadius: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '22px' }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'var(--off-white)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Close size={18} />
            </button>
          </div>
          <div style={{ padding: '28px', overflowY: 'auto' }}>{content[title] || <p>Inhalt folgt.</p>}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ─── SCROLL TO TOP ────────────────────────────────────────────────────────────
const ScrollTop = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const fn = () => setVis(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <AnimatePresence>
      {vis && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 50, width: '48px', height: '48px', borderRadius: '50%', background: 'var(--blue)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(10,79,160,0.4)', color: 'white' }}>
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [modal, setModal] = useState(null);

  const scrollToBooking = () => {
    document.getElementById('termin')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <GlobalStyles />
      <NoticeBar />
      <Navbar onBooking={scrollToBooking} />
      <Hero onBooking={scrollToBooking} />
      <TrustBar />
      <Services />
      <Pricing />
      <Steps />
      <StatsBand />
      <Reviews />
      <BookingSection />
      <FAQ />
      <Contact />
      <Footer openModal={setModal} />
      <ScrollTop />
      {modal && <LegalModal title={modal} onClose={() => setModal(null)} />}
    </>
  );
}