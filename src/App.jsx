import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:    #07121C;
      --navy:   #092847;
      --blue:   #0C4E9E;
      --mid:    #1869C4;
      --sky:    #4AAEE0;
      --ice:    #E6F3FB;
      --white:  #FFFFFF;
      --stone:  #F1F5F9;
      --smoke:  #64788F;
      --border: #DDE6EE;
      --gold:   #C8922A;
      --r:      12px;
    }

    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--stone);
      color: var(--ink);
      overflow-x: hidden;
      line-height: 1.6;
    }

    .bc { font-family: 'Barlow Condensed', sans-serif; }

    /* Full bleed */
    .full { width: 100%; }

    /* Inner container — true full width with generous padding */
    .wrap {
      width: 100%;
      max-width: 1680px;
      margin: 0 auto;
      padding: 0 80px;
    }
    @media (max-width: 900px) { .wrap { padding: 0 28px; } }

    /* Sections */
    .sec  { padding: 100px 0; }
    .sec-sm { padding: 60px 0; }

    /* Label pill */
    .pill {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
      color: var(--blue); background: var(--ice);
      padding: 6px 16px; border-radius: 100px; border: 1px solid rgba(12,78,158,.14);
    }
    .pill-dark {
      color: rgba(255,255,255,.85); background: rgba(255,255,255,.1);
      border-color: rgba(255,255,255,.2);
    }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px;
      letter-spacing: .1em; text-transform: uppercase;
      padding: 15px 34px; border-radius: var(--r); border: none; cursor: pointer;
      transition: all .26s cubic-bezier(.4,0,.2,1); text-decoration: none; white-space: nowrap;
    }
    .btn-solid {
      background: var(--blue); color: #fff;
      box-shadow: 0 6px 24px rgba(12,78,158,.28);
    }
    .btn-solid:hover { background: var(--mid); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(12,78,158,.38); }
    .btn-outline {
      background: transparent; color: #fff;
      border: 1.5px solid rgba(255,255,255,.38);
    }
    .btn-outline:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.7); }
    .btn-light {
      background: #fff; color: var(--blue);
      box-shadow: 0 4px 16px rgba(0,0,0,.1);
    }
    .btn-light:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.14); }
    .btn-ghost {
      background: transparent; color: var(--blue);
      border: 1.5px solid var(--border);
    }
    .btn-ghost:hover { background: var(--ice); border-color: var(--blue); }

    /* Cards */
    .card {
      background: #fff; border-radius: 18px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 14px rgba(0,0,0,.04);
      transition: transform .28s ease, box-shadow .28s ease;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 14px 44px rgba(0,0,0,.09); }

    /* Accent line */
    .al { width: 44px; height: 3px; background: var(--blue); border-radius: 2px; margin: 14px 0 22px; }
    .al-c { margin: 14px auto 22px; }

    /* Form fields */
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--smoke);
    }
    .field input, .field select, .field textarea {
      font-family: 'Barlow', sans-serif; font-size: 15px; color: var(--ink);
      background: var(--stone); border: 2px solid var(--border); border-radius: 10px;
      padding: 13px 16px; transition: border-color .2s, box-shadow .2s; -webkit-appearance: none;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none; border-color: var(--blue); background: #fff;
      box-shadow: 0 0 0 4px rgba(12,78,158,.1);
    }
    .field select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364788F' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; cursor: pointer;
    }
    .field textarea { resize: vertical; min-height: 90px; }

    /* Nav links */
    .nav-link {
      font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 600;
      letter-spacing: .08em; text-transform: uppercase; color: var(--ink);
      padding: 6px 2px; position: relative; transition: color .2s; text-decoration: none;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -3px; left: 0; right: 0;
      height: 2px; background: var(--blue); border-radius: 1px;
      transform: scaleX(0); transition: transform .22s;
    }
    .nav-link:hover { color: var(--blue); }
    .nav-link:hover::after { transform: scaleX(1); }

    /* Steps */
    .steps-row {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative;
    }
    .steps-row::before {
      content: ''; position: absolute; top: 27px;
      left: calc(12.5% + 12px); right: calc(12.5% + 12px);
      height: 1px; background: linear-gradient(90deg, var(--blue), var(--sky));
    }
    @media (max-width: 768px) { .steps-row { grid-template-columns: 1fr 1fr; } .steps-row::before { display: none; } }

    /* Price cards */
    .pc { border-radius: 18px; overflow: hidden; border: 1.5px solid var(--border); background: #fff; transition: all .28s; }
    .pc:hover { border-color: var(--blue); box-shadow: 0 18px 52px rgba(12,78,158,.12); transform: translateY(-6px); }
    .pc.feat { background: linear-gradient(155deg, var(--navy) 0%, var(--blue) 100%); border-color: var(--blue); }

    /* FAQ */
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-q {
      width: 100%; background: none; border: none; text-align: left; cursor: pointer;
      padding: 22px 0; display: flex; justify-content: space-between; align-items: center;
      font-family: 'Barlow', sans-serif; font-size: 16px; font-weight: 600; color: var(--ink); gap: 16px;
    }
    .faq-icon {
      width: 30px; height: 30px; border-radius: 50%; background: var(--ice);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: all .24s; border: 1.5px solid var(--border);
    }
    .faq-q.open .faq-icon { background: var(--blue); border-color: var(--blue); transform: rotate(45deg); }
    .faq-a { font-size: 14px; line-height: 1.8; color: var(--smoke); padding-bottom: 22px; }

    /* Stars */
    .stars { color: var(--gold); font-size: 14px; letter-spacing: 2px; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

    /* Grids */
    .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    @media (max-width: 1100px) { .g4 { grid-template-columns: repeat(2, 1fr); } .g3 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px)  { .g4, .g3, .g2 { grid-template-columns: 1fr; } }
  `}</style>
);

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Ic = {
  Shield:  ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevR:   ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevD:   ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Plus:    ({s=14,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X:       ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  Mail:    ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Pin:     ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Car:     ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h10l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>,
  Wrench:  ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Clip:    ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Leaf:    ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M17 8C8 10 5.9 16.17 3.82 19.72A2 2 0 0 0 5 22c2.24-.47 4.43-1.82 7-4 2.64-2.24 4.53-5.52 5-10z"/><path d="M22 2s-4 0-7 3"/></svg>,
  Award:   ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Cert:    ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  Moto:    ({s=26,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-4l-3 7h10l-3-7z"/><path d="M10 6V4h4"/></svg>,
  Arrow:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
const Navbar = ({ onBook }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    ['#leistungen','Leistungen'],['#preise','Preise'],
    ['#ablauf','Ablauf'],['#bewertungen','Bewertungen'],
    ['#faq','FAQ'],['#standort','Standort']
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: scrolled ? 'rgba(255,255,255,.97)' : 'rgba(255,255,255,.88)',
      backdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition: 'all .3s'
    }}>
      <div className="wrap" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:72}}>
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:38,height:38,background:'var(--blue)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Ic.Shield s={20} c="#fff"/>
          </div>
          <div>
            <div className="bc" style={{fontSize:21,fontWeight:900,letterSpacing:'.07em',color:'var(--ink)',lineHeight:1}}>
              TÜV<span style={{color:'var(--blue)'}}>STATION</span>
            </div>
            <div style={{fontSize:9,letterSpacing:'.16em',color:'var(--smoke)',textTransform:'uppercase',fontWeight:600}}>Oberhausen · seit 1998</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{display:'flex',gap:30,alignItems:'center'}}>
          {links.map(([h,l]) => <a key={h} href={h} className="nav-link">{l}</a>)}
        </nav>

        {/* Right */}
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <a href="tel:+491234567890" style={{display:'flex',alignItems:'center',gap:7,fontSize:14,fontWeight:600,color:'var(--blue)',textDecoration:'none',fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:'.05em'}}>
            <Ic.Phone s={15}/> +49 123 456789
          </a>
          <button className="btn btn-solid" style={{padding:'11px 22px',fontSize:13}} onClick={onBook}>
            Termin buchen
          </button>
        </div>
      </div>
    </header>
  );
};

/* ─── QUICK-BOOK WIDGET ──────────────────────────────────────────────────── */
const QuickBook = () => {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ service:'', date:'', time:'' });
  const services = ['Hauptuntersuchung (HU)','Abgasuntersuchung (AU)','HU + AU Kombi','Vorab-Check','Eintragung / Abnahme'];
  const times = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

  return (
    <div style={{background:'rgba(255,255,255,.06)',backdropFilter:'blur(20px)',borderRadius:20,border:'1px solid rgba(255,255,255,.14)',overflow:'hidden',width:340,flexShrink:0}}>
      {/* Tabs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
        {['Leistung','Datum','Zeit'].map((s,i) => (
          <div key={s} style={{padding:'14px 8px',textAlign:'center',background:i===step?'rgba(255,255,255,.1)':'transparent'}}>
            <div className="bc" style={{fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:i<=step?'var(--sky)':'rgba(255,255,255,.28)'}}>{s}</div>
            <div style={{height:2,borderRadius:1,background:i<=step?'var(--sky)':'rgba(255,255,255,.1)',marginTop:6}}/>
          </div>
        ))}
      </div>

      <div style={{padding:24}}>
        {step === 0 && (
          <div>
            <div className="bc" style={{fontSize:11,color:'rgba(255,255,255,.55)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:14}}>Was soll geprüft werden?</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {services.map(s => (
                <button key={s} onClick={() => { setD(x => ({...x, service:s})); setStep(1); }}
                  style={{background:d.service===s?'var(--blue)':'rgba(255,255,255,.07)',border:d.service===s?'none':'1px solid rgba(255,255,255,.12)',borderRadius:10,padding:'12px 16px',color:'#fff',fontSize:14,cursor:'pointer',textAlign:'left',transition:'all .18s',fontFamily:"'Barlow',sans-serif",fontWeight:d.service===s?600:400}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="bc" style={{fontSize:11,color:'rgba(255,255,255,.55)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:14}}>Wunschdatum wählen</div>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={d.date} onChange={e => setD(x => ({...x, date:e.target.value}))}
              style={{width:'100%',background:'rgba(255,255,255,.09)',border:'1px solid rgba(255,255,255,.18)',borderRadius:10,padding:'13px 16px',color:'#fff',fontSize:15,fontFamily:"'Barlow',sans-serif",colorScheme:'dark',marginBottom:16}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:10}}>
              <button className="btn btn-outline" style={{padding:'12px 16px',fontSize:13}} onClick={() => setStep(0)}>Zurück</button>
              <button className="btn btn-solid" style={{opacity:d.date?1:.4}} onClick={() => d.date && setStep(2)}>Weiter</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="bc" style={{fontSize:11,color:'rgba(255,255,255,.55)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:14}}>Uhrzeit wählen</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:7,marginBottom:16}}>
              {times.map(t => (
                <button key={t} onClick={() => setD(x => ({...x, time:t}))}
                  style={{background:d.time===t?'var(--blue)':'rgba(255,255,255,.08)',border:d.time===t?'none':'1px solid rgba(255,255,255,.12)',borderRadius:8,padding:'9px 2px',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .18s',fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:'.04em'}}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:10}}>
              <button className="btn btn-outline" style={{padding:'12px 16px',fontSize:13}} onClick={() => setStep(1)}>Zurück</button>
              <button className="btn btn-light" style={{color:'var(--blue)',opacity:d.time?1:.4}} onClick={() => d.time && setStep(3)}>Weiter</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{textAlign:'center',padding:'8px 0'}}>
            <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(74,174,224,.18)',border:'2px solid var(--sky)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <Ic.Check s={22} c="var(--sky)"/>
            </div>
            <div className="bc" style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:6,letterSpacing:'.04em'}}>Fast fertig!</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:3}}>{d.service}</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:20}}>{d.date} · {d.time} Uhr</div>
            <a href="#termin" className="btn btn-light" style={{width:'100%',justifyContent:'center',color:'var(--blue)'}}>Vollständig buchen</a>
            <button onClick={() => { setStep(0); setD({service:'',date:'',time:''}); }}
              style={{background:'none',border:'none',color:'rgba(255,255,255,.3)',fontSize:12,cursor:'pointer',marginTop:12,fontFamily:"'Barlow',sans-serif"}}>
              Neu starten
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── HERO ───────────────────────────────────────────────────────────────── */
const Hero = ({ onBook }) => (
  <section style={{position:'relative',minHeight:'90vh',display:'flex',alignItems:'center',overflow:'hidden',background:'var(--navy)'}}>
    {/* BG */}
    <div style={{position:'absolute',inset:0}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'url("tuvv.jpg")',backgroundSize:'cover',backgroundPosition:'center',opacity:.11}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(112deg, rgba(7,18,28,.98) 0%, rgba(9,40,71,.88) 45%, rgba(12,78,158,.42) 100%)'}}/>
      {/* Decorative rings */}
      <svg style={{position:'absolute',right:'4%',top:'50%',transform:'translateY(-50%)',opacity:.05,pointerEvents:'none'}} width="620" height="620" viewBox="0 0 620 620" fill="none">
        <circle cx="310" cy="310" r="309" stroke="white" strokeWidth="1"/>
        <circle cx="310" cy="310" r="240" stroke="white" strokeWidth="1"/>
        <circle cx="310" cy="310" r="170" stroke="white" strokeWidth="1"/>
        <circle cx="310" cy="310" r="100" stroke="white" strokeWidth="1"/>
      </svg>
      <div style={{position:'absolute',inset:0,backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle fill=\'%23ffffff\' cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',backgroundSize:'40px',opacity:.015,pointerEvents:'none'}}/>
    </div>

    <div className="wrap" style={{position:'relative',zIndex:1,paddingTop:60,paddingBottom:60}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:80,alignItems:'center'}}>
        {/* Left */}
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[.22,1,.36,1]}}>
          <div className="pill pill-dark" style={{marginBottom:28}}>
            <Ic.Cert s={11} c="var(--sky)"/> Offizieller DEKRA-Prüfstützpunkt
          </div>
          <h1 className="bc" style={{fontSize:'clamp(58px,7.5vw,96px)',color:'#fff',lineHeight:.95,letterSpacing:'.02em',marginBottom:28}}>
            HAUPTUNTERSUCHUNG<br/>
            <span style={{color:'var(--sky)'}}>SCHNELL.</span> SICHER.<br/>
            ZUVERLÄSSIG.
          </h1>
          <p style={{fontSize:17,color:'rgba(255,255,255,.68)',lineHeight:1.75,marginBottom:38,maxWidth:540}}>
            Ihr zertifizierter TÜV-Prüfpunkt in Oberhausen. Buchen Sie Ihre HU&nbsp;&amp;&nbsp;AU online — ohne Wartezeiten, transparent und professionell.
          </p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:56}}>
            <button className="btn btn-light" style={{color:'var(--blue)',fontSize:14,gap:10}} onClick={onBook}>
              Online Termin buchen <Ic.Arrow s={17}/>
            </button>
            <a href="#leistungen" className="btn btn-outline" style={{fontSize:14}}>Alle Leistungen</a>
          </div>
          {/* Stats */}
          <div style={{display:'flex',gap:48,flexWrap:'wrap',borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:36}}>
            {[['25+','Jahre Erfahrung'],['18 000+','Prüfungen/Jahr'],['4.9 ★','Google Bewertung'],['98%','Erst-Bestehensquote']].map(([n,l]) => (
              <div key={l}>
                <div className="bc" style={{fontSize:32,color:'var(--sky)',lineHeight:1,letterSpacing:'.03em'}}>{n}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.46)',marginTop:4,fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Widget */}
        <motion.div initial={{opacity:0,x:32}} animate={{opacity:1,x:0}} transition={{duration:.9,delay:.2,ease:[.22,1,.36,1]}}>
          <QuickBook/>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── TRUST BAR ──────────────────────────────────────────────────────────── */
const TrustBar = () => (
  <div style={{background:'#fff',borderBottom:'1px solid var(--border)',borderTop:'1px solid var(--border)'}}>
    <div className="wrap" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 80px',flexWrap:'wrap',gap:16}}>
      {[
        [<Ic.Award s={15} c="var(--blue)"/>,'DEKRA-zertifiziert'],
        [<Ic.Clock s={15} c="var(--blue)"/>,'Kurze Wartezeiten'],
        [<Ic.Cert  s={15} c="var(--blue)"/>,'Transparente Preise'],
        [<Ic.Shield s={15} c="var(--blue)"/>,'Online-Buchung 24/7'],
        [<Ic.Wrench s={15} c="var(--blue)"/>,'Erfahrene Ingenieure'],
        [<Ic.Leaf  s={15} c="var(--blue)"/>,'Umwelt-zertifiziert'],
      ].map(([ico, t]) => (
        <div key={t} style={{display:'flex',alignItems:'center',gap:8}}>
          {ico}
          <span className="bc" style={{fontSize:13,fontWeight:600,color:'var(--smoke)',letterSpacing:'.08em',textTransform:'uppercase'}}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── SERVICES ───────────────────────────────────────────────────────────── */
const Services = () => {
  const items = [
    {ico:<Ic.Shield s={28} c="var(--blue)"/>, title:'Hauptuntersuchung', sub:'HU · §29 StVZO', desc:'Gesetzlich vorgeschriebene Sicherheitsprüfung auf Verkehrstauglichkeit — schnell und ohne Kompromisse.', price:'ab 79 €', tag:'Pflicht'},
    {ico:<Ic.Leaf   s={28} c="var(--blue)"/>, title:'Abgasuntersuchung', sub:'AU · Emissionsprüfung', desc:'Umweltprüfung der Abgaswerte Ihres Fahrzeugs — oft direkt kombiniert mit der HU.', price:'ab 29 €', tag:'Kombi möglich'},
    {ico:<Ic.Wrench s={28} c="var(--blue)"/>, title:'Vorab-Check', sub:'Sicherheitscheck', desc:'Wir prüfen Ihr Fahrzeug auf potenzielle Mängel — damit Sie beim ersten Versuch bestehen.', price:'ab 49 €', tag:'Empfohlen'},
    {ico:<Ic.Clip   s={28} c="var(--blue)"/>, title:'Eintragungen', sub:'§19 StVZO · Abnahmen', desc:'Abnahme von Tuning, Felgen, Fahrwerk und anderen Fahrzeugveränderungen gemäß Vorschrift.', price:'ab 89 €', tag:'Flexibel'},
    {ico:<Ic.Moto   s={28} c="var(--blue)"/>, title:'Motorrad-HU', sub:'Zweiräder · Saisonal', desc:'Spezialisierte Hauptuntersuchung für Motorräder und Leichtkrafträder — saisongerecht.', price:'ab 69 €', tag:'Saisonal'},
    {ico:<Ic.Award  s={28} c="var(--blue)"/>, title:'Oldtimer-Gutachten', sub:'§23 StVZO · H-Kennzeichen', desc:'Vollständige Begutachtung für das H-Kennzeichen Ihres Klassikers mit offiziellem Gutachten.', price:'ab 149 €', tag:'Speziell'},
  ];

  return (
    <section id="leistungen" className="sec" style={{background:'var(--stone)'}}>
      <div className="wrap">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:52,flexWrap:'wrap',gap:20}}>
          <div>
            <div className="pill" style={{marginBottom:14}}>Leistungen</div>
            <h2 className="bc" style={{fontSize:'clamp(32px,4vw,50px)',letterSpacing:'.03em'}}>Alles aus einer Hand</h2>
            <div className="al"/>
            <p style={{color:'var(--smoke)',fontSize:15,maxWidth:480,lineHeight:1.7}}>Von der Pflichtprüfung bis zum Spezial-Gutachten — wir haben alles, was Ihr Fahrzeug braucht.</p>
          </div>
          <a href="#termin" className="btn btn-solid">Termin buchen</a>
        </motion.div>

        <div className="g3">
          {items.map((s, i) => (
            <motion.div key={i} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
              className="card" style={{padding:30}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
                <div style={{width:58,height:58,background:'var(--ice)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {s.ico}
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="pill" style={{fontSize:9,padding:'4px 10px',marginBottom:7}}>{s.tag}</div>
                  <div className="bc" style={{fontSize:20,color:'var(--blue)',fontWeight:700,letterSpacing:'.04em'}}>{s.price}</div>
                </div>
              </div>
              <div className="bc" style={{fontSize:10,color:'var(--smoke)',letterSpacing:'.16em',textTransform:'uppercase',marginBottom:4}}>{s.sub}</div>
              <h3 style={{fontSize:19,marginBottom:10,fontWeight:700}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.65,marginBottom:18}}>{s.desc}</p>
              <div style={{display:'flex',alignItems:'center',gap:4,color:'var(--blue)',fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,cursor:'pointer',letterSpacing:'.1em',textTransform:'uppercase'}}>
                Mehr erfahren <Ic.ChevR s={13} c="var(--blue)"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── STATS BAND ─────────────────────────────────────────────────────────── */
const StatsBand = () => (
  <div style={{background:'linear-gradient(105deg, var(--navy) 0%, var(--blue) 100%)',padding:'64px 0'}}>
    <div className="wrap">
      <div className="g4">
        {[['18 000+','Prüfungen jährlich'],['25','Jahre im Einsatz'],['4.9 / 5','Google Bewertung'],['98 %','Erst-Bestehensquote']].map(([n,l], i) => (
          <motion.div key={l} initial={{opacity:0,scale:.92}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.09}}
            style={{textAlign:'center',padding:'0 12px',borderRight:i<3?'1px solid rgba(255,255,255,.12)':'none'}}>
            <div className="bc" style={{fontSize:54,color:'#fff',lineHeight:1,letterSpacing:'.02em'}}>{n}</div>
            <div className="bc" style={{fontSize:12,color:'rgba(255,255,255,.5)',marginTop:8,letterSpacing:'.12em',textTransform:'uppercase'}}>{l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── PRICING ─────────────────────────────────────────────────────────────── */
const Pricing = () => {
  const plans = [
    { name:'HU Basis', price:'79', desc:'Hauptuntersuchung für PKW bis 3,5 t', features:['Fahrzeugsicherheitsprüfung','Prüfprotokoll','Mängelprotokoll','Standard-Termin'], feat:false },
    { name:'HU + AU Kombi', price:'99', desc:'Beste Wahl — alles in einem Termin', features:['Hauptuntersuchung (HU)','Abgasuntersuchung (AU)','Prüfprotokoll & Plakette','Prioritäts-Termin','Online-Vorzugspreis'], feat:true, badge:'Meistgewählt' },
    { name:'Premium Paket', price:'159', desc:'HU + AU + Vorab-Check + Beratung', features:['HU + AU Kombi','Vorab-Check inklusive','Technische Beratung','Express-Termin','Kostenlose Nachprüfung'], feat:false },
  ];

  return (
    <section id="preise" className="sec" style={{background:'var(--navy)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(ellipse at 78% 18%, rgba(74,174,224,.1) 0%, transparent 58%)',pointerEvents:'none'}}/>
      <div className="wrap" style={{position:'relative'}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:52}}>
          <div className="pill pill-dark" style={{marginBottom:14}}>Preise</div>
          <h2 className="bc" style={{fontSize:'clamp(32px,4vw,50px)',color:'#fff',letterSpacing:'.03em'}}>Transparente Preise</h2>
          <div className="al al-c"/>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:15}}>Keine versteckten Kosten. Alle Preise inkl. MwSt.</p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,maxWidth:980,margin:'0 auto'}}>
          {plans.map((p, i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
              className="pc" style={p.feat ? {transform:'scale(1.04)',zIndex:1} : {}}>
              {p.badge && (
                <div style={{background:'rgba(255,255,255,.14)',textAlign:'center',padding:'9px',fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.9)',fontFamily:"'Barlow Condensed',sans-serif"}}>
                  — {p.badge} —
                </div>
              )}
              <div style={{padding:30}}>
                <div className="bc" style={{fontSize:11,fontWeight:700,color:p.feat?'rgba(255,255,255,.55)':'var(--smoke)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:4}}>{p.name}</div>
                <div style={{display:'flex',alignItems:'flex-end',gap:4,marginBottom:8}}>
                  <span className="bc" style={{fontSize:58,color:p.feat?'#fff':'var(--blue)',lineHeight:1,letterSpacing:'.02em'}}>{p.price}</span>
                  <span style={{fontSize:16,fontWeight:600,color:p.feat?'rgba(255,255,255,.46)':'var(--smoke)',paddingBottom:9}}>€</span>
                </div>
                <p style={{fontSize:13,color:p.feat?'rgba(255,255,255,.52)':'var(--smoke)',marginBottom:22,lineHeight:1.55}}>{p.desc}</p>
                <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:26}}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:p.feat?'rgba(255,255,255,.18)':'var(--ice)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <Ic.Check s={10} c={p.feat?'#fff':'var(--blue)'}/>
                      </div>
                      <span style={{fontSize:13,color:p.feat?'rgba(255,255,255,.78)':'var(--ink)'}}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#termin" className="btn" style={{width:'100%',justifyContent:'center',background:p.feat?'#fff':'var(--blue)',color:p.feat?'var(--blue)':'#fff',fontSize:13,padding:'14px 20px'}}>
                  Jetzt buchen
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        <p style={{textAlign:'center',color:'rgba(255,255,255,.28)',fontSize:12,marginTop:28}}>
          * Preise für PKW bis 3,5 t. Abweichungen für LKW, Motorrad und Oldtimer möglich.
        </p>
      </div>
    </section>
  );
};

/* ─── STEPS ──────────────────────────────────────────────────────────────── */
const Steps = () => {
  const steps = [
    {n:'01', title:'Online buchen',    desc:'Leistung, Datum und Uhrzeit bequem über unser Buchungssystem wählen — rund um die Uhr verfügbar.'},
    {n:'02', title:'Bestätigung',      desc:'Sie erhalten sofort eine Bestätigungs-E-Mail mit allen Termindaten und einer Erinnerung.'},
    {n:'03', title:'Fahrzeug bringen', desc:'Kommen Sie pünktlich. Unser Expertenteam nimmt Ihr Fahrzeug professionell in Empfang.'},
    {n:'04', title:'Plakette erhalten',desc:'Nach bestandener Prüfung erhalten Sie direkt Ihre Plakette und alle Prüfdokumente.'},
  ];

  return (
    <section id="ablauf" className="sec" style={{background:'#fff'}}>
      <div className="wrap">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:60}}>
          <div className="pill" style={{marginBottom:14}}>Ablauf</div>
          <h2 className="bc" style={{fontSize:'clamp(32px,4vw,50px)',letterSpacing:'.03em'}}>In 4 Schritten zur Plakette</h2>
          <div className="al al-c"/>
        </motion.div>
        <div className="steps-row">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.12}}
              style={{textAlign:'center',padding:'0 28px',position:'relative',zIndex:1}}>
              <div style={{width:54,height:54,borderRadius:'50%',background:'var(--blue)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 6px 24px rgba(12,78,158,.28)'}}>
                <Ic.Check s={22} c="#fff"/>
              </div>
              <div className="bc" style={{fontSize:10,color:'var(--blue)',letterSpacing:'.2em',marginBottom:6}}>{s.n}</div>
              <h3 style={{fontSize:19,marginBottom:10,fontWeight:700}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.65}}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── REVIEWS ─────────────────────────────────────────────────────────────── */
const Reviews = () => {
  const reviews = [
    {name:'Michael K.', date:'März 2025',     rating:5, text:'Absolut reibungsloser Ablauf. Online-Buchung war intuitiv, kein Warten vor Ort und alles transparent erklärt. Definitiv wieder.',   vehicle:'VW Golf'},
    {name:'Sandra L.',  date:'Februar 2025',  rating:5, text:'Der Vorab-Check hat mir viel Geld gespart — kleiner Mangel rechtzeitig gefunden. Team ist sehr freundlich und kompetent.',             vehicle:'Audi A3'},
    {name:'Thomas B.',  date:'Januar 2025',   rating:5, text:'Mein Oldtimer hat hier sein H-Gutachten bekommen. Die Prüfer haben wirklich Ahnung von klassischen Fahrzeugen. Absolute Empfehlung.', vehicle:'BMW 2002'},
    {name:'Julia M.',   date:'April 2025',    rating:5, text:'Kurze Wartezeit, professionelles Personal und alles in 45 Minuten erledigt. Deutlich schneller als beim letzten Anbieter.',           vehicle:'Mercedes A-Klasse'},
    {name:'Ralf S.',    date:'März 2025',     rating:4, text:'Sehr kompetenter Prüfingenieur. Hat Mängel verständlich erklärt und hilfreiche Tipps gegeben. Sehr empfehlenswert.',                    vehicle:'Ford Focus'},
    {name:'Anna P.',    date:'Mai 2025',      rating:5, text:'Zum dritten Mal hier — immer top zufrieden. Die Mitarbeiter erkennen mich sogar noch. Bester TÜV-Punkt in der gesamten Region.',     vehicle:'Toyota Yaris'},
  ];

  return (
    <section id="bewertungen" className="sec" style={{background:'var(--stone)'}}>
      <div className="wrap">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48,flexWrap:'wrap',gap:20}}>
          <div>
            <div className="pill" style={{marginBottom:14}}>Kundenstimmen</div>
            <h2 className="bc" style={{fontSize:'clamp(32px,4vw,50px)',letterSpacing:'.03em'}}>Was unsere Kunden sagen</h2>
            <div className="al"/>
          </div>
          <div style={{textAlign:'center'}}>
            <div className="bc" style={{fontSize:48,color:'var(--blue)',lineHeight:1,letterSpacing:'.02em'}}>4.9</div>
            <div className="stars">★★★★★</div>
            <div style={{fontSize:12,color:'var(--smoke)',marginTop:4}}>682 Google-Bewertungen</div>
          </div>
        </motion.div>
        <div className="g3">
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
              className="card" style={{padding:26}}>
              <div className="stars" style={{marginBottom:14}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p style={{fontSize:14,lineHeight:1.72,color:'var(--smoke)',marginBottom:18,fontStyle:'italic'}}>"{r.text}"</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid var(--border)',paddingTop:14}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{r.name}</div>
                  <div className="bc" style={{fontSize:11,color:'var(--smoke)',letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>{r.vehicle}</div>
                </div>
                <div style={{fontSize:12,color:'var(--smoke)'}}>{r.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── BOOKING FORM ────────────────────────────────────────────────────────── */
const BookingSection = () => {
  const [form, setForm] = useState({leistung:'',fahrzeug:'PKW',datum:'',zeit:'',kennzeichen:'',name:'',email:'',telefon:'',anmerkungen:''});
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  return (
    <section id="termin" className="sec" style={{background:'#fff'}}>
      <div className="wrap">
        <div style={{display:'grid',gridTemplateColumns:'1fr 520px',gap:72,alignItems:'start'}}>
          {/* Left */}
          <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="pill" style={{marginBottom:14}}>Online Buchung</div>
            <h2 className="bc" style={{fontSize:'clamp(30px,3.5vw,46px)',letterSpacing:'.03em',marginBottom:16}}>
              Termin sichern —<br/>ganz einfach online.
            </h2>
            <div className="al"/>
            <p style={{color:'var(--smoke)',fontSize:15,lineHeight:1.75,marginBottom:38}}>
              Füllen Sie das Formular aus und wir bestätigen Ihren Termin innerhalb von 2 Stunden per E-Mail oder Telefon.
            </p>
            {[
              [<Ic.Clock  s={17} c="var(--blue)"/>,'Bestätigung in 2 Stunden','Wir melden uns schnell bei Ihnen zurück.'],
              [<Ic.Cert   s={17} c="var(--blue)"/>,'Vor Ort bezahlen','Bar oder EC-Karte — keine Vorauszahlung nötig.'],
              [<Ic.Shield s={17} c="var(--blue)"/>,'Kostenlose Stornierung','Bis 24 Stunden vor Termin kostenlos stornierbar.'],
              [<Ic.Clip   s={17} c="var(--blue)"/>,'Alle Dokumente sofort','Prüfprotokoll und Plakette erhalten Sie direkt.'],
            ].map(([ico, t, d]) => (
              <div key={t} style={{display:'flex',gap:16,marginBottom:22}}>
                <div style={{width:44,height:44,borderRadius:12,background:'var(--ice)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{ico}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>{t}</div>
                  <div style={{color:'var(--smoke)',fontSize:13}}>{d}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="card" style={{overflow:'hidden'}}>
              <div style={{background:'var(--navy)',padding:'26px 30px'}}>
                <h3 className="bc" style={{color:'#fff',fontSize:22,letterSpacing:'.04em',marginBottom:4}}>Termin vereinbaren</h3>
                <p style={{color:'rgba(255,255,255,.5)',fontSize:13}}>Pflichtfelder sind mit * markiert.</p>
              </div>
              {!sent ? (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{padding:30,display:'flex',flexDirection:'column',gap:18}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div className="field">
                      <label>Leistung *</label>
                      <select value={form.leistung} onChange={e => set('leistung', e.target.value)} required>
                        <option value="">Bitte wählen …</option>
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
                        <option>PKW</option><option>Motorrad</option><option>Transporter</option><option>LKW</option><option>Oldtimer</option>
                      </select>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div className="field">
                      <label>Wunschdatum *</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} value={form.datum} onChange={e => set('datum', e.target.value)} required/>
                    </div>
                    <div className="field">
                      <label>Uhrzeit *</label>
                      <select value={form.zeit} onChange={e => set('zeit', e.target.value)} required>
                        <option value="">Bitte wählen …</option>
                        <option>Vormittag (08–12 Uhr)</option>
                        <option>Nachmittag (12–17 Uhr)</option>
                        <option>Flexibel</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Kfz-Kennzeichen *</label>
                    <input type="text" placeholder="z. B. OB-AB 1234" value={form.kennzeichen} onChange={e => set('kennzeichen', e.target.value)} required/>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div className="field">
                      <label>Ihr Name *</label>
                      <input type="text" placeholder="Max Mustermann" value={form.name} onChange={e => set('name', e.target.value)} required/>
                    </div>
                    <div className="field">
                      <label>Telefon *</label>
                      <input type="tel" placeholder="+49 …" value={form.telefon} onChange={e => set('telefon', e.target.value)} required/>
                    </div>
                  </div>
                  <div className="field">
                    <label>E-Mail *</label>
                    <input type="email" placeholder="max@beispiel.de" value={form.email} onChange={e => set('email', e.target.value)} required/>
                  </div>
                  <div className="field">
                    <label>Anmerkungen</label>
                    <textarea placeholder="Besonderheiten, Mängel, Fragen …" value={form.anmerkungen} onChange={e => set('anmerkungen', e.target.value)}/>
                  </div>
                  <button type="submit" className="btn btn-solid" style={{justifyContent:'center',padding:16,fontSize:14,gap:10}}>
                    Termin verbindlich anfragen <Ic.Arrow s={17}/>
                  </button>
                  <p style={{fontSize:11,color:'var(--smoke)',textAlign:'center'}}>Durch Absenden stimmen Sie unserer Datenschutzerklärung zu.</p>
                </form>
              ) : (
                <div style={{padding:'56px 30px',textAlign:'center'}}>
                  <div style={{width:60,height:60,borderRadius:'50%',background:'var(--ice)',border:'2px solid var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                    <Ic.Check s={26} c="var(--blue)"/>
                  </div>
                  <h3 className="bc" style={{fontSize:24,letterSpacing:'.04em',marginBottom:10}}>Anfrage erhalten!</h3>
                  <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.7,marginBottom:24}}>Wir melden uns innerhalb von 2 Stunden.<br/><strong>{form.datum} · {form.zeit}</strong></p>
                  <button className="btn btn-solid" onClick={() => setSent(false)} style={{margin:'0 auto'}}>Neuen Termin anfragen</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    ['Wie lange dauert eine Hauptuntersuchung?','Eine Standard-HU dauert bei uns 30–45 Minuten. Mit AU-Kombi ca. 50–60 Minuten. Beim Vorab-Check kommen 15–20 Minuten dazu.'],
    ['Was muss ich zur HU mitbringen?','Den Fahrzeugschein (Zulassungsbescheinigung Teil I). Bei Eintragungen bitte alle ABE-Dokumente oder Gutachten mitbringen.'],
    ['Was passiert, wenn mein Fahrzeug nicht besteht?','Sie erhalten ein Mängelprotokoll. Geringe Mängel können innerhalb eines Monats behoben und kostenlos nachgeprüft werden.'],
    ['Kann ich einen Termin kostenlos stornieren?','Ja — bis 24 Stunden vor dem gebuchten Termin ist eine kostenlose Stornierung per Telefon oder E-Mail möglich.'],
    ['Welche Fahrzeuge prüfen Sie?','PKW, Motorräder, Transporter, LKW bis 7,5 t sowie Oldtimer (§23). Für schwere Nutzfahrzeuge bitte vorab anfragen.'],
    ['Gibt es einen Wartebereich?','Ja — komfortabler Wartebereich mit kostenlosem WLAN. Fahrzeug abgeben und später abholen ist ebenfalls möglich.'],
  ];

  return (
    <section id="faq" className="sec" style={{background:'var(--stone)'}}>
      <div className="wrap" style={{maxWidth:860,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:52}}>
          <div className="pill" style={{marginBottom:14}}>Häufige Fragen</div>
          <h2 className="bc" style={{fontSize:'clamp(32px,4vw,50px)',letterSpacing:'.03em'}}>Alles was Sie wissen müssen</h2>
          <div className="al al-c"/>
        </motion.div>
        <div className="card" style={{padding:'4px 36px'}}>
          {faqs.map(([q, a], i) => (
            <div key={i} className="faq-item">
              <button className={`faq-q${open===i?' open':''}`} onClick={() => setOpen(open===i ? null : i)}>
                <span>{q}</span>
                <span className="faq-icon"><Ic.Plus s={13} c={open===i?'#fff':'var(--blue)'}/></span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.24}} style={{overflow:'hidden'}}>
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

/* ─── CONTACT + FULL-BLEED MAP ───────────────────────────────────────────── */
const Contact = () => (
  <section id="standort" style={{background:'#fff'}}>
    {/* Full-width map — no border-radius, true edge-to-edge */}
    <div style={{width:'100vw',marginLeft:'calc(50% - 50vw)',height:500,overflow:'hidden'}}>
      <iframe
        src="https://maps.google.com/maps?q=51.472992,6.863788&hl=de&z=15&output=embed"
        width="100%" height="500" style={{border:0,display:'block',filter:'grayscale(.2)'}}
        allowFullScreen loading="lazy" title="Standort Karte"
      />
    </div>

    {/* Info below map */}
    <div className="wrap" style={{padding:'72px 80px'}}>
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:48}}>
        <div className="pill" style={{marginBottom:14}}>Standort & Kontakt</div>
        <h2 className="bc" style={{fontSize:'clamp(30px,4vw,48px)',letterSpacing:'.03em'}}>So finden Sie uns</h2>
        <div className="al"/>
      </motion.div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:40,flexWrap:'wrap'}}>
        {/* Adresse */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <div style={{width:36,height:36,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Pin s={16} c="var(--blue)"/>
            </div>
            <div className="bc" style={{fontSize:11,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--smoke)'}}>Adresse</div>
          </div>
          <div style={{fontSize:15,fontWeight:500,lineHeight:1.7}}>
            Musterstraße 123<br/>46045 Oberhausen<br/>Deutschland
          </div>
          <a href="#" className="bc" style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:14,fontSize:12,fontWeight:700,color:'var(--blue)',textDecoration:'none',letterSpacing:'.1em',textTransform:'uppercase'}}>
            Route planen <Ic.ChevR s={12} c="var(--blue)"/>
          </a>
        </div>

        {/* Kontakt */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <div style={{width:36,height:36,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Phone s={16} c="var(--blue)"/>
            </div>
            <div className="bc" style={{fontSize:11,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--smoke)'}}>Kontakt</div>
          </div>
          <div style={{fontSize:15,fontWeight:500,lineHeight:1.9}}>
            +49 123 456789<br/>info@tuev-oberhausen.de
          </div>
          <a href="tel:+491234567890" className="btn btn-solid" style={{padding:'10px 20px',fontSize:12,gap:7,marginTop:16,display:'inline-flex'}}>
            <Ic.Phone s={14}/> Jetzt anrufen
          </a>
        </div>

        {/* Öffnungszeiten */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <div style={{width:36,height:36,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Clock s={16} c="var(--blue)"/>
            </div>
            <div className="bc" style={{fontSize:11,fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--smoke)'}}>Öffnungszeiten</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[['Mo – Fr','08:00 – 17:00 Uhr'],['Samstag','09:00 – 14:00 Uhr'],['Sonntag','Geschlossen']].map(([d,t]) => (
              <div key={d} style={{display:'flex',justifyContent:'space-between',fontSize:14,borderBottom:'1px solid var(--border)',paddingBottom:6}}>
                <span style={{color:'var(--smoke)'}}>{d}</span>
                <span style={{fontWeight:600}}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:14}}>
          <div className="bc" style={{fontSize:26,color:'var(--navy)',letterSpacing:'.04em',lineHeight:1.2}}>
            Bereit für Ihre<br/>Hauptuntersuchung?
          </div>
          <p style={{fontSize:13,color:'var(--smoke)',lineHeight:1.65}}>
            Buchen Sie jetzt Ihren Termin — schnell, einfach und ohne Wartezeiten.
          </p>
          <a href="#termin" className="btn btn-solid" style={{gap:10,alignSelf:'flex-start'}}>
            Online buchen <Ic.Arrow s={16}/>
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
const Footer = ({ openModal }) => (
  <footer style={{background:'var(--ink)',color:'#fff'}}>
    <div className="wrap" style={{padding:'64px 80px 0'}}>
      <div style={{display:'grid',gridTemplateColumns:'2.2fr 1fr 1fr 1fr',gap:48,paddingBottom:52,borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        {/* Brand */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
            <div style={{width:38,height:38,background:'var(--blue)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Shield s={20} c="#fff"/>
            </div>
            <div className="bc" style={{fontSize:22,fontWeight:900,letterSpacing:'.07em'}}>
              TÜV<span style={{color:'var(--sky)'}}>STATION</span>
            </div>
          </div>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:14,lineHeight:1.72,maxWidth:290,marginBottom:24}}>
            Ihr zertifizierter Partner für HU & AU in Oberhausen. Seit 1998 schnell, sicher und zuverlässig.
          </p>
          <div style={{display:'flex',gap:9}}>
            {[['f','Facebook'],['in','LinkedIn'],['x','X / Twitter']].map(([s,label]) => (
              <div key={s} title={label} style={{width:34,height:34,borderRadius:8,background:'rgba(255,255,255,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'.04em',color:'rgba(255,255,255,.45)',transition:'background .2s'}}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {[
          ['Leistungen',['Hauptuntersuchung','Abgasuntersuchung','Vorab-Check','Eintragungen','Motorrad-HU','Oldtimer-Gutachten']],
          ['Unternehmen',['Über uns','Team','Karriere','Presse','Kontakt']],
          ['Rechtliches',['Impressum','Datenschutz','AGB','Cookie-Einstellungen']],
        ].map(([title, items]) => (
          <div key={title}>
            <div className="bc" style={{fontSize:11,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:18}}>{title}</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:11}}>
              {items.map(item => (
                <li key={item}>
                  <button
                    onClick={() => ['Impressum','Datenschutz','AGB'].includes(item) && openModal(item)}
                    style={{background:'none',border:'none',color:'rgba(255,255,255,.52)',fontSize:14,cursor:'pointer',padding:0,fontFamily:"'Barlow',sans-serif",transition:'color .2s'}}
                    onMouseOver={e => e.target.style.color='#fff'}
                    onMouseOut={e => e.target.style.color='rgba(255,255,255,.52)'}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,padding:'22px 0'}}>
        <span style={{color:'rgba(255,255,255,.22)',fontSize:13}}>
          © {new Date().getFullYear()} TÜV Station Oberhausen GmbH — Alle Rechte vorbehalten.
        </span>
        <span className="bc" style={{color:'rgba(255,255,255,.22)',fontSize:12,letterSpacing:'.1em',textTransform:'uppercase'}}>
          DEKRA-zertifiziert · ISO 9001:2015
        </span>
      </div>
    </div>
  </footer>
);

/* ─── LEGAL MODAL ────────────────────────────────────────────────────────── */
const Modal = ({ title, onClose }) => {
  const content = {
    Impressum: (
      <div>
        <h4 style={{marginBottom:8,fontSize:15,fontWeight:700}}>Angaben gemäß § 5 TMG</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.8}}>
          TÜV Station Oberhausen GmbH<br/>Musterstraße 123<br/>46045 Oberhausen<br/><br/>
          Geschäftsführer: Max Mustermann<br/>Telefon: +49 123 456789<br/>E-Mail: info@tuev-oberhausen.de
        </p>
      </div>
    ),
    Datenschutz: <p style={{color:'var(--smoke)',lineHeight:1.9}}>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden nur im technisch notwendigen Umfang erhoben und gemäß DSGVO verarbeitet.</p>,
    AGB: <p style={{color:'var(--smoke)',lineHeight:1.9}}>Terminbuchungen sind verbindlich. Stornierungen bis 24 Stunden vor Termin sind kostenfrei. Spätere Absagen können mit einer Bearbeitungsgebühr belegt werden.</p>,
  };
  return (
    <AnimatePresence>
      <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
          style={{position:'absolute',inset:0,background:'rgba(7,18,28,.82)',backdropFilter:'blur(10px)'}}/>
        <motion.div initial={{opacity:0,y:36,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:.96}}
          style={{position:'relative',background:'#fff',width:'100%',maxWidth:560,maxHeight:'80vh',borderRadius:20,display:'flex',flexDirection:'column',boxShadow:'0 32px 64px rgba(0,0,0,.28)',overflow:'hidden'}}>
          <div style={{padding:'24px 30px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 className="bc" style={{fontSize:22,letterSpacing:'.04em'}}>{title}</h3>
            <button onClick={onClose} style={{background:'var(--stone)',border:'none',width:36,height:36,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.X s={18}/>
            </button>
          </div>
          <div style={{padding:30,overflowY:'auto'}}>{content[title] || <p>Inhalt folgt.</p>}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─── SCROLL TO TOP ──────────────────────────────────────────────────────── */
const ScrollTop = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const fn = () => setVis(window.scrollY > 500);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <AnimatePresence>
      {vis && (
        <motion.button initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}
          onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
          style={{position:'fixed',bottom:28,right:28,zIndex:80,width:46,height:46,borderRadius:'50%',background:'var(--blue)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 28px rgba(12,78,158,.4)',color:'#fff',fontSize:18,fontWeight:700}}>
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [modal, setModal] = useState(null);
  const scrollBook = () => document.getElementById('termin')?.scrollIntoView({behavior:'smooth'});

  return (
    <>
      <G/>
      <Navbar onBook={scrollBook}/>
      <Hero onBook={scrollBook}/>
      <TrustBar/>
      <Services/>
      <StatsBand/>
      <Pricing/>
      <Steps/>
      <Reviews/>
      <BookingSection/>
      <FAQ/>
      <Contact/>
      <Footer openModal={setModal}/>
      <ScrollTop/>
      {modal && <Modal title={modal} onClose={() => setModal(null)}/>}
    </>
  );
}