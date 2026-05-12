import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const PHONE = "+49 1575 5476991";
const PHONE_HREF = "tel:+4915755476991";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:    #0F1923;
      --navy:   #0A2540;
      --blue:   #1A56DB;
      --mid:    #2563EB;
      --sky:    #60A5FA;
      --ice:    #EFF6FF;
      --white:  #FFFFFF;
      --stone:  #F8FAFC;
      --smoke:  #64748B;
      --border: #E2E8F0;
      --serif:  'DM Serif Display', Georgia, serif;
      --sans:   'DM Sans', system-ui, sans-serif;
    }

    html, body { width: 100%; margin: 0; padding: 0; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
    body { font-family: var(--sans); background: var(--stone); color: var(--ink); overflow-x: hidden; line-height: 1.6; }
    #root { width: 100%; min-width: 100%; }

    .section-full { width: 100%; display: block; }
    .inner { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 72px; box-sizing: border-box; }
    @media (max-width: 1100px) { .inner { padding: 0 36px; } }
    @media (max-width: 700px)  { .inner { padding: 0 20px; } }
    .sec { padding: 88px 0; }

    /* Typography */
    .serif { font-family: var(--serif); }
    .sans  { font-family: var(--sans); }

    /* Tag */
    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
      color: var(--blue); background: var(--ice);
      padding: 5px 14px; border-radius: 6px; border: 1px solid rgba(26,86,219,.15);
    }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      font-family: var(--sans); font-weight: 600; font-size: 14px; letter-spacing: .02em;
      padding: 14px 30px; border-radius: 10px; border: none; cursor: pointer;
      transition: all .22s ease; text-decoration: none; white-space: nowrap;
    }
    .btn-primary { background: var(--blue); color: #fff; box-shadow: 0 4px 20px rgba(26,86,219,.25); }
    .btn-primary:hover { background: var(--mid); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(26,86,219,.32); }
    .btn-outline-white { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.35); }
    .btn-outline-white:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.65); }
    .btn-white { background: #fff; color: var(--blue); }
    .btn-white:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(0,0,0,.12); }
    .btn-ghost { background: transparent; color: var(--blue); border: 1.5px solid var(--border); }
    .btn-ghost:hover { background: var(--ice); border-color: var(--blue); }

    /* Card */
    .card {
      background: #fff; border-radius: 16px; border: 1px solid var(--border);
      box-shadow: 0 1px 8px rgba(0,0,0,.03);
      transition: transform .26s ease, box-shadow .26s ease;
    }
    .card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,.08); }

    /* Divider accent */
    .accent { width: 36px; height: 2px; background: var(--blue); border-radius: 2px; margin: 12px 0 20px; }
    .accent-c { margin: 12px auto 20px; }

    /* Form fields */
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--smoke); }
    .field input, .field select, .field textarea {
      font-family: var(--sans); font-size: 15px; color: var(--ink);
      background: var(--stone); border: 1.5px solid var(--border); border-radius: 9px;
      padding: 12px 15px; transition: border-color .18s, box-shadow .18s; -webkit-appearance: none;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline: none; border-color: var(--blue); background: #fff; box-shadow: 0 0 0 3px rgba(26,86,219,.1);
    }
    .field select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 13px center; padding-right: 38px; cursor: pointer;
    }
    .field textarea { resize: vertical; min-height: 88px; }

    /* Nav */
    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--smoke);
      padding: 5px 1px; position: relative; transition: color .18s; text-decoration: none; letter-spacing: .01em;
    }
    .nav-link:hover { color: var(--ink); }

    /* Steps line */
    .steps-row { display: grid; grid-template-columns: repeat(4, 1fr); position: relative; gap: 8px; }
    .steps-row::before {
      content: ''; position: absolute; top: 24px;
      left: calc(12.5% + 10px); right: calc(12.5% + 10px);
      height: 1px; background: var(--border);
    }
    @media (max-width: 768px) { .steps-row { grid-template-columns: 1fr 1fr; gap: 28px; } .steps-row::before { display: none; } }

    /* FAQ */
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-q {
      width: 100%; background: none; border: none; text-align: left; cursor: pointer;
      padding: 20px 0; display: flex; justify-content: space-between; align-items: center;
      font-family: var(--sans); font-size: 15px; font-weight: 500; color: var(--ink); gap: 16px;
    }
    .faq-icon {
      width: 28px; height: 28px; border-radius: 50%; background: var(--stone);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: all .22s; border: 1px solid var(--border); color: var(--smoke);
    }
    .faq-q.open .faq-icon { background: var(--blue); border-color: var(--blue); color: #fff; transform: rotate(45deg); }
    .faq-a { font-size: 14px; line-height: 1.8; color: var(--smoke); padding-bottom: 20px; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }

    .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
    .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media (max-width: 1100px) { .g3 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px)  { .g3, .g2 { grid-template-columns: 1fr; } }
  `}</style>
);

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Ic = {
  Shield:  ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:   ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevR:   ({s=15,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus:    ({s=13,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X:       ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone:   ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  Pin:     ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:   ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Wrench:  ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Clip:    ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Leaf:    ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M17 8C8 10 5.9 16.17 3.82 19.72A2 2 0 0 0 5 22c2.24-.47 4.43-1.82 7-4 2.64-2.24 4.53-5.52 5-10z"/><path d="M22 2s-4 0-7 3"/></svg>,
  Award:   ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Cert:    ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  Moto:    ({s=24,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-4l-3 7h10l-3-7z"/><path d="M10 6V4h4"/></svg>,
  Arrow:   ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Menu:    ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
const Navbar = ({ onBook }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200, width: '100%',
      background: scrolled ? 'rgba(255,255,255,.98)' : 'rgba(255,255,255,.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition: 'all .28s'
    }}>
      <div className="inner" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:68}}>
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:11}}>
          <div style={{width:36,height:36,background:'var(--blue)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Ic.Shield s={18} c="#fff"/>
          </div>
          <div>
            <div style={{fontFamily:'var(--serif)',fontSize:20,color:'var(--ink)',lineHeight:1.1,letterSpacing:'-.01em'}}>
              TÜV<span style={{color:'var(--blue)'}}>Station</span>
            </div>
            <div style={{fontSize:10,letterSpacing:'.1em',color:'var(--smoke)',textTransform:'uppercase',fontWeight:500}}>Oberhausen</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{display:'flex',gap:28,alignItems:'center'}}>
          {[['#leistungen','Leistungen'],['#ablauf','Ablauf'],['#faq','FAQ'],['#standort','Standort']].map(([h,l]) => (
            <a key={h} href={h} className="nav-link">{l}</a>
          ))}
        </nav>

        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <a href={PHONE_HREF} style={{display:'flex',alignItems:'center',gap:7,fontSize:14,fontWeight:600,color:'var(--blue)',textDecoration:'none'}}>
            <Ic.Phone s={14}/> {PHONE}
          </a>
          <button className="btn btn-primary" style={{padding:'10px 20px',fontSize:13}} onClick={onBook}>
            Termin buchen
          </button>
        </div>
      </div>
    </header>
  );
};

/* ─── QUICK BOOK WIDGET ─────────────────────────────────────────────────── */
const QuickBook = () => {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({service:'',date:'',time:''});
  const services = ['Hauptuntersuchung (HU)','Abgasuntersuchung (AU)','HU + AU Kombi','Vorab-Check','Eintragung / Abnahme'];
  const times = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

  const stepLabel = ['Leistung','Datum','Zeit'];

  return (
    <div style={{background:'rgba(255,255,255,.07)',backdropFilter:'blur(24px)',borderRadius:18,border:'1px solid rgba(255,255,255,.16)',overflow:'hidden',width:320,flexShrink:0}}>
      {/* Progress */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',background:'rgba(0,0,0,.12)'}}>
        {stepLabel.map((s,i) => (
          <div key={s} style={{padding:'12px 8px',textAlign:'center',borderBottom:`2px solid ${i===step?'rgba(255,255,255,.8)':'rgba(255,255,255,.15)'}`}}>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:i<=step?'rgba(255,255,255,.9)':'rgba(255,255,255,.3)'}}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{padding:22}}>
        {step===0 && (
          <div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:12,fontWeight:600}}>Was soll geprüft werden?</div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {services.map(s => (
                <button key={s} onClick={() => {setD(x=>({...x,service:s}));setStep(1);}}
                  style={{background:d.service===s?'rgba(255,255,255,.18)':'rgba(255,255,255,.06)',border:'1px solid',borderColor:d.service===s?'rgba(255,255,255,.5)':'rgba(255,255,255,.1)',borderRadius:9,padding:'11px 14px',color:'#fff',fontSize:13.5,cursor:'pointer',textAlign:'left',transition:'all .16s',fontFamily:'var(--sans)',fontWeight:d.service===s?600:400}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {step===1 && (
          <div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:12,fontWeight:600}}>Wunschdatum wählen</div>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={d.date} onChange={e=>setD(x=>({...x,date:e.target.value}))}
              style={{width:'100%',background:'rgba(255,255,255,.09)',border:'1px solid rgba(255,255,255,.18)',borderRadius:9,padding:'12px 14px',color:'#fff',fontSize:14,fontFamily:'var(--sans)',colorScheme:'dark',marginBottom:14}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:9}}>
              <button className="btn btn-outline-white" style={{padding:'11px 14px',fontSize:13}} onClick={()=>setStep(0)}>Zurück</button>
              <button className="btn btn-primary" style={{opacity:d.date?1:.4}} onClick={()=>d.date&&setStep(2)}>Weiter</button>
            </div>
          </div>
        )}
        {step===2 && (
          <div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:12,fontWeight:600}}>Uhrzeit wählen</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:14}}>
              {times.map(t => (
                <button key={t} onClick={()=>setD(x=>({...x,time:t}))}
                  style={{background:d.time===t?'rgba(255,255,255,.2)':'rgba(255,255,255,.07)',border:'1px solid',borderColor:d.time===t?'rgba(255,255,255,.5)':'rgba(255,255,255,.1)',borderRadius:7,padding:'8px 2px',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',transition:'all .16s',fontFamily:'var(--sans)'}}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:9}}>
              <button className="btn btn-outline-white" style={{padding:'11px 14px',fontSize:13}} onClick={()=>setStep(1)}>Zurück</button>
              <button className="btn btn-white" style={{opacity:d.time?1:.4}} onClick={()=>d.time&&setStep(3)}>Weiter</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div style={{textAlign:'center',padding:'6px 0'}}>
            <div style={{width:46,height:46,borderRadius:'50%',background:'rgba(255,255,255,.12)',border:'1.5px solid rgba(255,255,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <Ic.Check s={20} c="#fff"/>
            </div>
            <div style={{fontFamily:'var(--serif)',fontSize:22,color:'#fff',marginBottom:5}}>Fast fertig!</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginBottom:3}}>{d.service}</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginBottom:18}}>{d.date} · {d.time} Uhr</div>
            <a href="#termin" className="btn btn-white" style={{width:'100%',justifyContent:'center',fontSize:13}}>Vollständig buchen</a>
            <button onClick={()=>{setStep(0);setD({service:'',date:'',time:''}); }}
              style={{background:'none',border:'none',color:'rgba(255,255,255,.28)',fontSize:12,cursor:'pointer',marginTop:10,fontFamily:'var(--sans)'}}>
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
  <div className="section-full" style={{background:'var(--navy)',minHeight:'88vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden'}}>
    {/* Background texture */}
    <div style={{position:'absolute',inset:0,background:'linear-gradient(118deg,rgba(10,37,64,.98) 0%,rgba(10,37,64,.82) 50%,rgba(26,86,219,.25) 100%)'}}/>
    <svg style={{position:'absolute',right:'-4%',top:'50%',transform:'translateY(-50%)',opacity:.04,pointerEvents:'none'}} width="560" height="560" viewBox="0 0 560 560" fill="none">
      <circle cx="280" cy="280" r="279" stroke="white" strokeWidth="1"/>
      <circle cx="280" cy="280" r="210" stroke="white" strokeWidth="1"/>
      <circle cx="280" cy="280" r="140" stroke="white" strokeWidth="1"/>
      <circle cx="280" cy="280" r="70"  stroke="white" strokeWidth="1"/>
    </svg>

    <div className="inner" style={{position:'relative',zIndex:1,paddingTop:56,paddingBottom:56}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:72,alignItems:'center'}}>
        <motion.div initial={{opacity:0,y:36}} animate={{opacity:1,y:0}} transition={{duration:.85,ease:[.22,1,.36,1]}}>
          <div className="tag" style={{background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.75)',borderColor:'rgba(255,255,255,.15)',marginBottom:26}}>
            <Ic.Shield s={10} c="rgba(255,255,255,.75)"/> Amtlich anerkannte Kfz-Prüfstelle
          </div>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(48px,6.5vw,88px)',color:'#fff',lineHeight:1.03,letterSpacing:'-.02em',marginBottom:26}}>
            Ihre Haupt&shy;unter&shy;suchung<br/>
            <em style={{fontStyle:'italic',color:'var(--sky)'}}>einfach</em> online buchen.
          </h1>
          <p style={{fontSize:16.5,color:'rgba(255,255,255,.62)',lineHeight:1.8,marginBottom:36,maxWidth:520}}>
            Zertifizierter Kfz-Prüfpunkt in Oberhausen. Buchen Sie Ihre HU&nbsp;&amp;&nbsp;AU bequem online — transparent, professionell und ohne Wartezeiten.
          </p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn btn-white" style={{fontSize:14,gap:9}} onClick={onBook}>
              Online buchen <Ic.Arrow s={16}/>
            </button>
            <a href="#leistungen" className="btn btn-outline-white" style={{fontSize:14}}>Leistungen ansehen</a>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} transition={{duration:.85,delay:.18,ease:[.22,1,.36,1]}}>
          <QuickBook/>
        </motion.div>
      </div>
    </div>
  </div>
);

/* ─── TRUST BAR ─────────────────────────────────────────────────────────── */
const TrustBar = () => (
  <div className="section-full" style={{background:'#fff',borderBottom:'1px solid var(--border)'}}>
    <div className="inner" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 72px',flexWrap:'wrap',gap:14}}>
      {[
        [<Ic.Award  s={14} c="var(--blue)"/>,'Amtlich anerkannte Prüfstelle'],
        [<Ic.Clock  s={14} c="var(--blue)"/>,'Kurze Wartezeiten'],
        [<Ic.Cert   s={14} c="var(--blue)"/>,'Transparente Preise'],
        [<Ic.Shield s={14} c="var(--blue)"/>,'Online-Buchung 24/7'],
        [<Ic.Wrench s={14} c="var(--blue)"/>,'Qualifizierte Prüfingenieure'],
        [<Ic.Leaf   s={14} c="var(--blue)"/>,'Umwelt-zertifiziert'],
      ].map(([ico,t]) => (
        <div key={t} style={{display:'flex',alignItems:'center',gap:7}}>
          {ico}
          <span style={{fontSize:12,fontWeight:600,color:'var(--smoke)',letterSpacing:'.06em',textTransform:'uppercase'}}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── SERVICES ───────────────────────────────────────────────────────────── */
const Services = () => {
  const items = [
    {ico:<Ic.Shield s={26} c="var(--blue)"/>, title:'Hauptuntersuchung', sub:'HU · §29 StVZO', desc:'Gesetzlich vorgeschriebene Sicherheitsprüfung auf Verkehrstauglichkeit — schnell und zuverlässig durchgeführt.', tag:'Pflicht'},
    {ico:<Ic.Leaf   s={26} c="var(--blue)"/>, title:'Abgasuntersuchung', sub:'AU · Emissionsprüfung', desc:'Prüfung der Abgaswerte Ihres Fahrzeugs gemäß gesetzlicher Vorgaben — auch kombiniert mit der HU möglich.', tag:'Kombi möglich'},
    {ico:<Ic.Wrench s={26} c="var(--blue)"/>, title:'Vorab-Check', sub:'Sicherheitscheck', desc:'Wir prüfen Ihr Fahrzeug vorab auf potenzielle Mängel — damit Sie optimal auf die HU vorbereitet sind.', tag:'Empfohlen'},
    {ico:<Ic.Clip   s={26} c="var(--blue)"/>, title:'Eintragungen', sub:'§19 StVZO · Abnahmen', desc:'Abnahme von Fahrzeugveränderungen wie Tuning, Fahrwerk und Felgen gemäß gesetzlicher Vorschrift.', tag:'Flexibel'},
    {ico:<Ic.Moto   s={26} c="var(--blue)"/>, title:'Motorrad-HU', sub:'Zweiräder · Saisonal', desc:'Spezialisierte Hauptuntersuchung für Motorräder und Leichtkrafträder — saisongerecht und professionell.', tag:'Saisonal'},
    {ico:<Ic.Award  s={26} c="var(--blue)"/>, title:'Oldtimer-Gutachten', sub:'§23 StVZO · H-Kennzeichen', desc:'Vollständige Begutachtung für das H-Kennzeichen Ihres Oldtimers mit offiziellem Gutachten gemäß §23 StVZO.', tag:'Speziell'},
  ];
  return (
    <div id="leistungen" className="section-full sec" style={{background:'var(--stone)'}}>
      <div className="inner">
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48,flexWrap:'wrap',gap:18}}>
          <div>
            <div className="tag" style={{marginBottom:12}}>Leistungen</div>
            <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(30px,3.8vw,46px)',color:'var(--ink)',letterSpacing:'-.02em'}}>Alles aus einer Hand</h2>
            <div className="accent"/>
            <p style={{color:'var(--smoke)',fontSize:15,maxWidth:460,lineHeight:1.7}}>Von der Pflichtprüfung bis zum Sondergutachten — alles für Ihr Fahrzeug.</p>
          </div>
          <a href="#termin" className="btn btn-primary">Termin buchen</a>
        </motion.div>
        <div className="g3">
          {items.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
              className="card" style={{padding:28}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
                <div style={{width:52,height:52,background:'var(--ice)',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center'}}>{s.ico}</div>
                <div className="tag" style={{fontSize:9,padding:'3px 9px'}}>{s.tag}</div>
              </div>
              <div style={{fontSize:10,color:'var(--smoke)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:4,fontWeight:600}}>{s.sub}</div>
              <h3 style={{fontSize:18,marginBottom:9,fontWeight:600,color:'var(--ink)'}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:13.5,lineHeight:1.68,marginBottom:16}}>{s.desc}</p>
              <div style={{display:'flex',alignItems:'center',gap:4,color:'var(--blue)',fontSize:12,fontWeight:600,cursor:'pointer',letterSpacing:'.06em',textTransform:'uppercase'}}>
                Mehr erfahren <Ic.ChevR s={12} c="var(--blue)"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── STEPS ──────────────────────────────────────────────────────────────── */
const Steps = () => {
  const steps = [
    {n:'01', title:'Online buchen',    desc:'Leistung, Datum und Uhrzeit bequem über unser Buchungsformular wählen — rund um die Uhr verfügbar.'},
    {n:'02', title:'Bestätigung',      desc:'Sie erhalten eine Bestätigungs-E-Mail mit allen Termindaten sowie einer Erinnerung.'},
    {n:'03', title:'Fahrzeug bringen', desc:'Kommen Sie pünktlich. Unser Team empfängt Ihr Fahrzeug und führt die Prüfung durch.'},
    {n:'04', title:'Plakette erhalten',desc:'Nach bestandener Prüfung erhalten Sie Ihre Plakette und alle Prüfdokumente direkt vor Ort.'},
  ];
  return (
    <div id="ablauf" className="section-full sec" style={{background:'#fff'}}>
      <div className="inner">
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:56}}>
          <div className="tag" style={{marginBottom:12}}>Ablauf</div>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(30px,3.8vw,46px)',color:'var(--ink)',letterSpacing:'-.02em'}}>
            In 4 Schritten zur Plakette
          </h2>
          <div className="accent accent-c"/>
        </motion.div>
        <div className="steps-row">
          {steps.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
              style={{textAlign:'center',padding:'0 24px',position:'relative',zIndex:1}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:'var(--blue)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',boxShadow:'0 4px 18px rgba(26,86,219,.25)'}}>
                <Ic.Check s={20} c="#fff"/>
              </div>
              <div style={{fontSize:10,color:'var(--blue)',letterSpacing:'.16em',marginBottom:5,fontWeight:700}}>{s.n}</div>
              <h3 style={{fontSize:17,marginBottom:8,fontWeight:600,color:'var(--ink)'}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:13.5,lineHeight:1.68}}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── BOOKING FORM ───────────────────────────────────────────────────────── */
const BookingSection = () => {
  const [form,setForm] = useState({leistung:'',fahrzeug:'PKW',datum:'',zeit:'',kennzeichen:'',name:'',email:'',telefon:'',anmerkungen:''});
  const [sent,setSent] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div id="termin" className="section-full sec" style={{background:'var(--stone)'}}>
      <div className="inner">
        <div style={{display:'grid',gridTemplateColumns:'1fr 500px',gap:68,alignItems:'start'}}>
          <motion.div initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="tag" style={{marginBottom:12}}>Online Buchung</div>
            <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,3.2vw,44px)',letterSpacing:'-.02em',marginBottom:14,color:'var(--ink)'}}>
              Termin sichern —<br/>ganz einfach online.
            </h2>
            <div className="accent"/>
            <p style={{color:'var(--smoke)',fontSize:15,lineHeight:1.78,marginBottom:36}}>
              Füllen Sie das Formular aus — wir bestätigen Ihren Wunschtermin schnellstmöglich per E-Mail oder Telefon.
            </p>
            {[
              [<Ic.Clock  s={16} c="var(--blue)"/>,'Schnelle Rückmeldung','Wir melden uns zeitnah bei Ihnen zurück.'],
              [<Ic.Cert   s={16} c="var(--blue)"/>,'Vor Ort bezahlen','Bar oder EC-Karte — keine Vorauszahlung nötig.'],
              [<Ic.Shield s={16} c="var(--blue)"/>,'Kostenlose Stornierung','Bis 24 Stunden vor Termin kostenfrei stornierbar.'],
              [<Ic.Clip   s={16} c="var(--blue)"/>,'Dokumente direkt','Prüfprotokoll und Plakette erhalten Sie sofort.'],
            ].map(([ico,t,d]) => (
              <div key={t} style={{display:'flex',gap:14,marginBottom:20}}>
                <div style={{width:40,height:40,borderRadius:10,background:'var(--ice)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{ico}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14.5,marginBottom:2,color:'var(--ink)'}}>{t}</div>
                  <div style={{color:'var(--smoke)',fontSize:13}}>{d}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="card" style={{overflow:'hidden'}}>
              <div style={{background:'var(--navy)',padding:'24px 28px'}}>
                <h3 style={{fontFamily:'var(--serif)',color:'#fff',fontSize:22,marginBottom:4,letterSpacing:'-.01em'}}>Termin vereinbaren</h3>
                <p style={{color:'rgba(255,255,255,.45)',fontSize:12.5}}>Pflichtfelder sind mit * markiert.</p>
              </div>
              {!sent ? (
                <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{padding:28,display:'flex',flexDirection:'column',gap:16}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    <div className="field">
                      <label>Leistung *</label>
                      <select value={form.leistung} onChange={e=>set('leistung',e.target.value)} required>
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
                      <select value={form.fahrzeug} onChange={e=>set('fahrzeug',e.target.value)} required>
                        <option>PKW</option>
                        <option>Motorrad</option>
                        <option>Transporter</option>
                        <option>Oldtimer</option>
                      </select>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    <div className="field">
                      <label>Wunschdatum *</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} value={form.datum} onChange={e=>set('datum',e.target.value)} required/>
                    </div>
                    <div className="field">
                      <label>Bevorzugte Zeit *</label>
                      <select value={form.zeit} onChange={e=>set('zeit',e.target.value)} required>
                        <option value="">Bitte wählen …</option>
                        <option>Vormittag (09–12 Uhr)</option>
                        <option>Nachmittag (12–18 Uhr)</option>
                        <option>Flexibel</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Kfz-Kennzeichen *</label>
                    <input type="text" placeholder="z. B. OB-AB 1234" value={form.kennzeichen} onChange={e=>set('kennzeichen',e.target.value)} required/>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    <div className="field">
                      <label>Ihr Name *</label>
                      <input type="text" placeholder="Max Mustermann" value={form.name} onChange={e=>set('name',e.target.value)} required/>
                    </div>
                    <div className="field">
                      <label>Telefon *</label>
                      <input type="tel" placeholder="+49 …" value={form.telefon} onChange={e=>set('telefon',e.target.value)} required/>
                    </div>
                  </div>
                  <div className="field">
                    <label>E-Mail *</label>
                    <input type="email" placeholder="max@beispiel.de" value={form.email} onChange={e=>set('email',e.target.value)} required/>
                  </div>
                  <div className="field">
                    <label>Anmerkungen</label>
                    <textarea placeholder="Besonderheiten, Fragen …" value={form.anmerkungen} onChange={e=>set('anmerkungen',e.target.value)}/>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{justifyContent:'center',padding:15,fontSize:14,gap:9}}>
                    Termin verbindlich anfragen <Ic.Arrow s={16}/>
                  </button>
                  <p style={{fontSize:11,color:'var(--smoke)',textAlign:'center',lineHeight:1.6}}>
                    Mit dem Absenden stimmen Sie unserer <a href="#" style={{color:'var(--blue)'}}>Datenschutzerklärung</a> zu. Ihre Daten werden ausschließlich zur Terminbearbeitung verwendet und nicht an Dritte weitergegeben.
                  </p>
                </form>
              ) : (
                <div style={{padding:'52px 28px',textAlign:'center'}}>
                  <div style={{width:56,height:56,borderRadius:'50%',background:'var(--ice)',border:'1.5px solid var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
                    <Ic.Check s={24} c="var(--blue)"/>
                  </div>
                  <h3 style={{fontFamily:'var(--serif)',fontSize:22,marginBottom:9,color:'var(--ink)'}}>Anfrage erhalten!</h3>
                  <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.7,marginBottom:22}}>Wir melden uns zeitnah bei Ihnen.<br/><strong style={{color:'var(--ink)'}}>{form.datum} · {form.zeit}</strong></p>
                  <button className="btn btn-primary" onClick={()=>setSent(false)} style={{margin:'0 auto'}}>Neuen Termin anfragen</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ = () => {
  const [open,setOpen] = useState(null);
  const faqs = [
    ['Wie lange dauert eine Hauptuntersuchung?','Eine Standard-HU dauert bei uns ca. 30 Minuten. Mit AU-Kombi ca. 45–60 Minuten. Bitte planen Sie zwischen den Terminen mindestens 30 Minuten ein.'],
    ['Was muss ich zur HU mitbringen?','Den Fahrzeugschein (Zulassungsbescheinigung Teil I). Bei Eintragungen bitte alle ABE-Dokumente oder Gutachten mitbringen.'],
    ['Was passiert, wenn mein Fahrzeug nicht besteht?','Sie erhalten ein detailliertes Mängelprotokoll. Geringe Mängel können innerhalb eines Monats behoben und kostenlos nachgeprüft werden.'],
    ['Kann ich einen Termin kostenlos stornieren?','Ja — bis 24 Stunden vor dem gebuchten Termin ist eine kostenlose Stornierung per Telefon oder E-Mail möglich.'],
    ['Welche Fahrzeuge prüfen Sie?','PKW, Motorräder, Transporter sowie Oldtimer (§23 StVZO). Bei Unsicherheiten kontaktieren Sie uns bitte vorab.'],
    ['Gibt es einen Wartebereich?','Ja — unser Wartebereich steht Ihnen zur Verfügung. Das Fahrzeug abgeben und später abholen ist ebenfalls möglich.'],
  ];
  return (
    <div id="faq" className="section-full sec" style={{background:'#fff'}}>
      <div className="inner" style={{maxWidth:820,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:48}}>
          <div className="tag" style={{marginBottom:12}}>Häufige Fragen</div>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(30px,3.8vw,46px)',color:'var(--ink)',letterSpacing:'-.02em'}}>Alles was Sie wissen müssen</h2>
          <div className="accent accent-c"/>
        </motion.div>
        <div className="card" style={{padding:'2px 32px'}}>
          {faqs.map(([q,a],i) => (
            <div key={i} className="faq-item">
              <button className={`faq-q${open===i?' open':''}`} onClick={()=>setOpen(open===i?null:i)}>
                <span>{q}</span>
                <span className="faq-icon"><Ic.Plus s={12} c={open===i?'#fff':'var(--blue)'}/></span>
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.22}} style={{overflow:'hidden'}}>
                    <p className="faq-a">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
const Contact = () => (
  <div id="standort" className="section-full" style={{background:'var(--stone)'}}>
    <div style={{width:'100%',lineHeight:0}}>
      <iframe
        src="https://maps.google.com/maps?q=51.472992,6.863788&hl=de&z=15&output=embed"
        width="100%" height="460"
        style={{border:'none',display:'block',filter:'grayscale(.1)'}}
        allowFullScreen loading="lazy" title="Standort Karte"
      />
    </div>
    <div className="inner" style={{padding:'68px 72px'}}>
      <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:44}}>
        <div className="tag" style={{marginBottom:12}}>Standort & Kontakt</div>
        <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,3.5vw,44px)',color:'var(--ink)',letterSpacing:'-.02em'}}>So finden Sie uns</h2>
        <div className="accent"/>
      </motion.div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:36}}>
        {/* Adresse */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
            <div style={{width:34,height:34,background:'var(--ice)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Pin s={15} c="var(--blue)"/>
            </div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--smoke)'}}>Adresse</div>
          </div>
          <div style={{fontSize:14.5,fontWeight:500,lineHeight:1.7,color:'var(--ink)'}}>
            Musterstraße 123<br/>46045 Oberhausen<br/>Deutschland
          </div>
          <a href="#" style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:12,fontSize:12,fontWeight:600,color:'var(--blue)',textDecoration:'none',letterSpacing:'.06em',textTransform:'uppercase'}}>
            Route planen <Ic.ChevR s={11} c="var(--blue)"/>
          </a>
        </div>

        {/* Kontakt */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
            <div style={{width:34,height:34,background:'var(--ice)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Phone s={15} c="var(--blue)"/>
            </div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--smoke)'}}>Kontakt</div>
          </div>
          <div style={{fontSize:14.5,fontWeight:500,lineHeight:1.9,color:'var(--ink)'}}>
            {PHONE}<br/>info@tuev-oberhausen.de
          </div>
          <a href={PHONE_HREF} className="btn btn-primary" style={{padding:'9px 18px',fontSize:12,gap:6,marginTop:14,display:'inline-flex'}}>
            <Ic.Phone s={13}/> Jetzt anrufen
          </a>
        </div>

        {/* Öffnungszeiten */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
            <div style={{width:34,height:34,background:'var(--ice)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Clock s={15} c="var(--blue)"/>
            </div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--smoke)'}}>Öffnungszeiten</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {[
              ['Mo – Mi','09:00 – 18:00 Uhr'],
              ['Donnerstag','15:00 – 18:00 Uhr'],
              ['Freitag','15:00 – 18:00 Uhr'],
              ['Sa & So','Geschlossen'],
            ].map(([day,time]) => (
              <div key={day} style={{display:'flex',justifyContent:'space-between',fontSize:13.5,borderBottom:'1px solid var(--border)',paddingBottom:5}}>
                <span style={{color:'var(--smoke)'}}>{day}</span>
                <span style={{fontWeight:600,color:'var(--ink)'}}>{time}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:12,color:'var(--smoke)',marginTop:10,lineHeight:1.5}}>Terminabstand: mind. 30 Minuten</p>
        </div>

        {/* CTA */}
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:12}}>
          <h3 style={{fontFamily:'var(--serif)',fontSize:24,color:'var(--navy)',letterSpacing:'-.01em',lineHeight:1.2}}>
            Bereit für Ihre<br/>Hauptuntersuchung?
          </h3>
          <p style={{fontSize:13,color:'var(--smoke)',lineHeight:1.65}}>
            Jetzt Termin buchen — schnell, einfach und ohne lange Wartezeiten.
          </p>
          <a href="#termin" className="btn btn-primary" style={{gap:9,alignSelf:'flex-start'}}>
            Online buchen <Ic.Arrow s={15}/>
          </a>
        </div>
      </div>
    </div>
  </div>
);

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
const Footer = ({ openModal }) => (
  <footer className="section-full" style={{background:'var(--ink)',color:'#fff'}}>
    <div className="inner" style={{padding:'56px 72px 0'}}>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:44,paddingBottom:48,borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <div style={{width:34,height:34,background:'var(--blue)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Shield s={17} c="#fff"/>
            </div>
            <div style={{fontFamily:'var(--serif)',fontSize:20,letterSpacing:'-.01em',color:'#fff'}}>
              TÜV<span style={{color:'var(--sky)'}}>Station</span>
            </div>
          </div>
          <p style={{color:'rgba(255,255,255,.38)',fontSize:13.5,lineHeight:1.75,maxWidth:260,marginBottom:22}}>
            Amtlich anerkannte Kfz-Prüfstelle in Oberhausen. Hauptuntersuchung und Abgasuntersuchung — professionell und zuverlässig.
          </p>
          <div style={{display:'flex',gap:8}}>
            {[['f','Facebook'],['in','LinkedIn'],['x','X']].map(([s,label]) => (
              <div key={s} title={label} style={{width:32,height:32,borderRadius:7,background:'rgba(255,255,255,.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)'}}>
                {s}
              </div>
            ))}
          </div>
        </div>
        {[
          ['Leistungen',['Hauptuntersuchung','Abgasuntersuchung','Vorab-Check','Eintragungen','Motorrad-HU','Oldtimer-Gutachten']],
          ['Unternehmen',['Über uns','Team','Karriere','Kontakt']],
          ['Rechtliches',['Impressum','Datenschutz','AGB','Cookie-Einstellungen']],
        ].map(([title,items]) => (
          <div key={title}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',marginBottom:16}}>{title}</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
              {items.map(item => (
                <li key={item}>
                  <button onClick={()=>['Impressum','Datenschutz','AGB'].includes(item)&&openModal(item)}
                    style={{background:'none',border:'none',color:'rgba(255,255,255,.48)',fontSize:13.5,cursor:'pointer',padding:0,fontFamily:'var(--sans)',transition:'color .18s'}}
                    onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,.48)'}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10,padding:'20px 0'}}>
        <span style={{color:'rgba(255,255,255,.2)',fontSize:12.5}}>© {new Date().getFullYear()} TÜV Station Oberhausen — Alle Rechte vorbehalten.</span>
        <span style={{color:'rgba(255,255,255,.2)',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase'}}>Amtlich anerkannte Prüfstelle</span>
      </div>
    </div>
  </footer>
);

/* ─── LEGAL MODAL ────────────────────────────────────────────────────────── */
const Modal = ({ title, onClose }) => {
  const content = {
    Impressum: (
      <div>
        <h4 style={{marginBottom:8,fontSize:15,fontWeight:600,color:'var(--ink)'}}>Angaben gemäß § 5 TMG</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.85,fontSize:14}}>
          TÜV Station Oberhausen<br/>
          Musterstraße 123<br/>
          46045 Oberhausen<br/><br/>
          Telefon: {PHONE}<br/>
          E-Mail: info@tuev-oberhausen.de<br/><br/>
          <strong style={{color:'var(--ink)'}}>Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV):</strong><br/>
          [Name Verantwortlicher], oben genannte Anschrift
        </p>
      </div>
    ),
    Datenschutz: (
      <div>
        <h4 style={{marginBottom:8,fontSize:15,fontWeight:600,color:'var(--ink)'}}>Datenschutzerklärung</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.85,fontSize:14}}>
          Wir nehmen den Schutz Ihrer persönlichen Daten ernst. Personenbezogene Daten werden nur im technisch notwendigen Umfang erhoben und gemäß der Datenschutz-Grundverordnung (DSGVO) sowie dem Bundesdatenschutzgesetz (BDSG) verarbeitet.<br/><br/>
          <strong style={{color:'var(--ink)'}}>Verantwortlicher:</strong> TÜV Station Oberhausen, Musterstraße 123, 46045 Oberhausen<br/><br/>
          <strong style={{color:'var(--ink)'}}>Erhobene Daten:</strong> Bei der Terminanfrage erheben wir Name, E-Mail, Telefonnummer und Fahrzeugdaten ausschließlich zur Terminverarbeitung.<br/><br/>
          <strong style={{color:'var(--ink)'}}>Weitergabe an Dritte:</strong> Ihre Daten werden nicht an Dritte weitergegeben.<br/><br/>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten (Art. 15–18 DSGVO). Wenden Sie sich dazu an: info@tuev-oberhausen.de
        </p>
      </div>
    ),
    AGB: (
      <div>
        <h4 style={{marginBottom:8,fontSize:15,fontWeight:600,color:'var(--ink)'}}>Allgemeine Geschäftsbedingungen</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.85,fontSize:14}}>
          <strong style={{color:'var(--ink)'}}>§ 1 Geltungsbereich</strong><br/>
          Diese AGB gelten für alle Terminbuchungen über unsere Website.<br/><br/>
          <strong style={{color:'var(--ink)'}}>§ 2 Stornierung</strong><br/>
          Stornierungen sind bis 24 Stunden vor dem Termin kostenlos per Telefon oder E-Mail möglich. Bei späterer Absage behalten wir uns vor, eine Bearbeitungsgebühr zu erheben.<br/><br/>
          <strong style={{color:'var(--ink)"}}>§ 3 Leistungen</strong><br/>
          Unsere Prüfleistungen richten sich nach den gesetzlichen Vorgaben der StVZO. Es gelten die jeweils aktuellen Prüfvorschriften.<br/><br/>
          <strong style={{color:'var(--ink)'}}>§ 4 Gerichtsstand</strong><br/>
          Gerichtsstand ist Oberhausen. Es gilt deutsches Recht.
        </p>
      </div>
    ),
  };
  return (
    <AnimatePresence>
      <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
          style={{position:'absolute',inset:0,background:'rgba(10,37,64,.78)',backdropFilter:'blur(8px)'}}/>
        <motion.div initial={{opacity:0,y:32,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:16,scale:.97}}
          style={{position:'relative',background:'#fff',width:'100%',maxWidth:540,maxHeight:'80vh',borderRadius:18,display:'flex',flexDirection:'column',boxShadow:'0 28px 56px rgba(0,0,0,.22)',overflow:'hidden'}}>
          <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontFamily:'var(--serif)',fontSize:21,color:'var(--ink)'}}>{title}</h3>
            <button onClick={onClose} style={{background:'var(--stone)',border:'none',width:34,height:34,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.X s={16}/>
            </button>
          </div>
          <div style={{padding:28,overflowY:'auto'}}>{content[title]||<p>Inhalt folgt.</p>}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─── SCROLL TOP ─────────────────────────────────────────────────────────── */
const ScrollTop = () => {
  const [vis,setVis] = useState(false);
  useEffect(()=>{
    const fn = ()=>setVis(window.scrollY>500);
    window.addEventListener('scroll',fn);
    return ()=>window.removeEventListener('scroll',fn);
  },[]);
  return (
    <AnimatePresence>
      {vis && (
        <motion.button initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}}
          onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{position:'fixed',bottom:26,right:26,zIndex:80,width:44,height:44,borderRadius:'50%',background:'var(--blue)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 22px rgba(26,86,219,.36)',color:'#fff',fontSize:17,fontWeight:700}}>
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [modal,setModal] = useState(null);
  const scrollBook = () => document.getElementById('termin')?.scrollIntoView({behavior:'smooth'});
  return (
    <>
      <G/>
      <Navbar onBook={scrollBook}/>
      <Hero onBook={scrollBook}/>
      <TrustBar/>
      <Services/>
      <Steps/>
      <BookingSection/>
      <FAQ/>
      <Contact/>
      <Footer openModal={setModal}/>
      <ScrollTop/>
      {modal && <Modal title={modal} onClose={()=>setModal(null)}/>}
    </>
  );
}