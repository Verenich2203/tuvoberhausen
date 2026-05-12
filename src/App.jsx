import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const PHONE = "+49 1575 5476991";
const PHONE_HREF = "tel:+4915755476991";
const SITE_NAME = "AutoService Oberhausen";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:    #0F1923;
      --navy:   #0A2540;
      --blue:   #1A56DB;
      --mid:    #2563EB;
      --sky:    #60A5FA;
      --ice:    #EFF6FF;
      --stone:  #F8FAFC;
      --smoke:  #64748B;
      --border: #E2E8F0;
      --sans:   'Montserrat', sans-serif;
    }

    html, body { width:100%; margin:0; padding:0; scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
    body { font-family:var(--sans); background:var(--stone); color:var(--ink); overflow-x:hidden; line-height:1.6; }
    #root { width:100%; min-width:100%; }

    .section-full { width:100%; display:block; }
    .inner { width:100%; max-width:1400px; margin:0 auto; padding:0 72px; box-sizing:border-box; }
    @media (max-width:1100px) { .inner { padding:0 36px; } }
    @media (max-width:700px)  { .inner { padding:0 20px; } }
    .sec { padding:88px 0; }

    /* Tag */
    .tag {
      display:inline-flex; align-items:center; gap:6px;
      font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
      color:var(--blue); background:var(--ice);
      padding:5px 14px; border-radius:6px; border:1px solid rgba(26,86,219,.15);
    }
    .tag-dark {
      color:rgba(255,255,255,.8); background:rgba(255,255,255,.08);
      border-color:rgba(255,255,255,.18);
    }

    /* Buttons */
    .btn {
      display:inline-flex; align-items:center; justify-content:center; gap:9px;
      font-family:var(--sans); font-weight:700; font-size:13px; letter-spacing:.04em; text-transform:uppercase;
      padding:13px 28px; border-radius:10px; border:none; cursor:pointer;
      transition:all .22s ease; text-decoration:none; white-space:nowrap;
    }
    .btn-primary { background:var(--blue); color:#fff; box-shadow:0 4px 20px rgba(26,86,219,.28); }
    .btn-primary:hover { background:var(--mid); transform:translateY(-1px); box-shadow:0 8px 28px rgba(26,86,219,.36); }
    .btn-outline-white { background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,.32); }
    .btn-outline-white:hover { background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.6); }
    .btn-white { background:#fff; color:var(--blue); font-weight:700; }
    .btn-white:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(0,0,0,.14); }
    .btn-ghost { background:transparent; color:var(--blue); border:1.5px solid var(--border); }
    .btn-ghost:hover { background:var(--ice); border-color:var(--blue); }

    /* Service Card */
    .service-card {
      background:#fff; border-radius:20px; border:1px solid var(--border);
      box-shadow:0 4px 14px rgba(0,0,0,.03);
      transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;
      cursor: pointer;
    }
    .service-card:hover { 
      transform:translateY(-4px); 
      box-shadow:0 16px 40px rgba(0,0,0,.08); 
      border-color: rgba(26,86,219,.3);
    }

    /* Form Modern Design */
    .modern-form-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.04);
    }
    .modern-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .modern-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--navy);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-left: 2px;
    }
    .modern-input, .modern-select, .modern-textarea {
      width: 100%;
      background: var(--stone);
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 14px;
      font-family: var(--sans);
      color: var(--ink);
      transition: all 0.2s ease;
      -webkit-appearance: none;
    }
    .modern-select {
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%230A2540' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; cursor:pointer;
    }
    .modern-textarea { resize: vertical; min-height: 90px; }
    .modern-input:focus, .modern-select:focus, .modern-textarea:focus {
      background: #fff;
      border-color: var(--blue);
      outline: none;
      box-shadow: 0 4px 12px rgba(26,86,219,0.08);
    }

    /* Accent line */
    .accent { width:36px; height:2px; background:var(--blue); border-radius:2px; margin:12px 0 20px; }
    .accent-c { margin:12px auto 20px; }

    /* Nav link */
    .nav-link {
      font-size:13px; font-weight:600; color:var(--smoke); letter-spacing:.06em; text-transform:uppercase;
      padding:6px 2px; position:relative; transition:color .18s; text-decoration:none;
    }
    .nav-link::after {
      content:''; position:absolute; bottom:-3px; left:0; right:0;
      height:2px; background:var(--blue); border-radius:1px;
      transform:scaleX(0); transition:transform .2s;
    }
    .nav-link:hover { color:var(--ink); }
    .nav-link:hover::after { transform:scaleX(1); }

    /* Steps row */
    .steps-row { display:grid; grid-template-columns:repeat(4,1fr); position:relative; gap:8px; }
    .steps-row::before {
      content:''; position:absolute; top:24px;
      left:calc(12.5% + 10px); right:calc(12.5% + 10px);
      height:1px; background:var(--border);
    }
    @media (max-width:768px) { .steps-row { grid-template-columns:1fr 1fr; gap:28px; } .steps-row::before { display:none; } }

    /* FAQ */
    .faq-item { border-bottom:1px solid var(--border); }
    .faq-q {
      width:100%; background:none; border:none; text-align:left; cursor:pointer;
      padding:20px 0; display:flex; justify-content:space-between; align-items:center;
      font-family:var(--sans); font-size:14px; font-weight:600; color:var(--ink); gap:16px;
    }
    .faq-icon {
      width:28px; height:28px; border-radius:50%; background:var(--stone);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      transition:all .22s; border:1px solid var(--border);
    }
    .faq-q.open .faq-icon { background:var(--blue); border-color:var(--blue); transform:rotate(45deg); }
    .faq-a { font-size:13.5px; line-height:1.8; color:var(--smoke); padding-bottom:20px; }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--border); border-radius:8px; }

    .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
    @media (max-width:1100px) { .g3 { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:640px)  { .g3 { grid-template-columns:1fr; } }
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
  Gear:    ({s=60,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Bolt:    ({s=40,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Tire:    ({s=70,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>,
};

/* ─── ANIMATED BG SHAPES ───────────────────────────────────────────────── */
const HeroBg = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const y1 = useTransform(scrollYProgress, [0,1], [0, 80]);
  const y2 = useTransform(scrollYProgress, [0,1], [0, 140]);
  const y3 = useTransform(scrollYProgress, [0,1], [0, 50]);
  const rot1 = useTransform(scrollYProgress, [0,1], [0, 60]);
  const rot2 = useTransform(scrollYProgress, [0,1], [0, -40]);

  return (
    <div ref={ref} style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      <motion.div style={{position:'absolute', right:'8%', bottom:'10%', y:y1, rotate:rot1, opacity:.06}}>
        <Ic.Gear s={280} c="white"/>
      </motion.div>
      <motion.div style={{position:'absolute', left:'4%', top:'18%', y:y2, rotate:rot2, opacity:.05}}>
        <Ic.Gear s={140} c="white"/>
      </motion.div>
      <motion.div style={{position:'absolute', right:'28%', top:'8%', y:y3, opacity:.05}}>
        <Ic.Tire s={160} c="white"/>
      </motion.div>
      <motion.div style={{position:'absolute', left:'1%', bottom:'30%', y:y2, opacity:.04}}>
        <Ic.Wrench s={120} c="white"/>
      </motion.div>
      <motion.div style={{position:'absolute', right:'3%', top:'14%', y:y1, rotate:rot1, opacity:.05}}>
        <Ic.Bolt s={90} c="white"/>
      </motion.div>
    </div>
  );
};

const SectionDeco = ({ side = 'right', opacity = 0.035 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0,1], [0, -60]);
  const rot = useTransform(scrollYProgress, [0,1], [0, 30]);
  return (
    <div style={{position:'absolute', [side]:'-3%', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', overflow:'hidden'}}>
      <motion.div style={{y, rotate:rot, opacity}}>
        <Ic.Gear s={220} c="var(--blue)"/>
      </motion.div>
    </div>
  );
};

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
const Navbar = ({ onBook }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = ['leistungen','ablauf','faq','standort'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position:'sticky', top:0, zIndex:200, width:'100%',
      background: scrolled ? 'rgba(255,255,255,.98)' : 'rgba(255,255,255,.93)',
      backdropFilter:'blur(18px)',
      borderBottom:`1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition:'all .3s'
    }}>
      <div className="inner" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:66}}>
        {/* Кликабельное Лого -> скролл наверх */}
        <div 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
          style={{display:'flex',alignItems:'center',gap:10, cursor:'pointer'}}
        >
          <div style={{width:34,height:34,background:'var(--blue)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Ic.Wrench s={16} c="#fff"/>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:17,color:'var(--ink)',lineHeight:1.1,letterSpacing:'-.02em'}}>
              Auto<span style={{color:'var(--blue)'}}>Service</span>
            </div>
            <div style={{fontSize:9,letterSpacing:'.12em',color:'var(--smoke)',textTransform:'uppercase',fontWeight:600}}>Oberhausen</div>
          </div>
        </div>

        <nav style={{display:'flex',gap:32,alignItems:'center'}}>
          {[['leistungen','Leistungen'],['ablauf','Ablauf'],['faq','FAQ'],['standort','Standort']].map(([id,label]) => (
            <a key={id} href={`#${id}`} className="nav-link"
              style={{color: active===id ? 'var(--blue)' : undefined, fontWeight: active===id ? 700 : 600}}>
              {label}
              {active===id && <span style={{position:'absolute',bottom:-3,left:0,right:0,height:2,background:'var(--blue)',borderRadius:1,transform:'scaleX(1)'}}/>}
            </a>
          ))}
        </nav>

        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <a href={PHONE_HREF} style={{display:'flex',alignItems:'center',gap:7,fontSize:13,fontWeight:700,color:'var(--blue)',textDecoration:'none',letterSpacing:'.02em'}}>
            <Ic.Phone s={14}/> {PHONE}
          </a>
          <button className="btn btn-primary" style={{padding:'10px 20px',fontSize:12}} onClick={onBook}>
            Termin buchen
          </button>
        </div>
      </div>
    </header>
  );
};

/* ─── QUICK BOOK ─────────────────────────────────────────────────────────── */
const QuickBook = () => {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({service:'',date:'',time:''});
  const services = ['Hauptuntersuchung (HU)','Abgasuntersuchung (AU)','HU + AU Kombi','Vorab-Check','Eintragung / Abnahme','Motorrad-HU','Oldtimer-Gutachten'];
  const times = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

  return (
    <div style={{background:'rgba(255,255,255,.07)',backdropFilter:'blur(28px)',borderRadius:20,border:'1px solid rgba(255,255,255,.16)',overflow:'hidden',width:380,flexShrink:0}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',background:'rgba(0,0,0,.14)'}}>
        {['Leistung','Datum','Zeit'].map((s,i) => (
          <div key={s} style={{padding:'13px 8px',textAlign:'center',borderBottom:`2px solid ${i===step?'rgba(255,255,255,.75)':'rgba(255,255,255,.12)'}`}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:i<=step?'rgba(255,255,255,.9)':'rgba(255,255,255,.28)'}}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{padding:26}}>
        {step===0 && (
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14,fontWeight:700}}>Was soll geprüft werden?</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {services.map(s => (
                <button key={s} onClick={()=>{setD(x=>({...x,service:s}));setStep(1);}}
                  style={{background:d.service===s?'rgba(255,255,255,.2)':'rgba(255,255,255,.07)',border:'1px solid',borderColor:d.service===s?'rgba(255,255,255,.55)':'rgba(255,255,255,.12)',borderRadius:10,padding:'13px 16px',color:'#fff',fontSize:14,cursor:'pointer',textAlign:'left',transition:'all .16s',fontFamily:'var(--sans)',fontWeight:d.service===s?700:400}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {step===1 && (
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14,fontWeight:700}}>Wunschdatum wählen</div>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={d.date} onChange={e=>setD(x=>({...x,date:e.target.value}))}
              style={{width:'100%',background:'rgba(255,255,255,.09)',border:'1px solid rgba(255,255,255,.18)',borderRadius:10,padding:'13px 14px',color:'#fff',fontSize:14,fontFamily:'var(--sans)',colorScheme:'dark',marginBottom:16}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:9}}>
              <button className="btn btn-outline-white" style={{padding:'12px',fontSize:12}} onClick={()=>setStep(0)}>Zurück</button>
              <button className="btn btn-primary" style={{opacity:d.date?1:.4}} onClick={()=>d.date&&setStep(2)}>Weiter</button>
            </div>
          </div>
        )}
        {step===2 && (
          <div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.45)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14,fontWeight:700}}>Uhrzeit wählen</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:16}}>
              {times.map(t => (
                <button key={t} onClick={()=>setD(x=>({...x,time:t}))}
                  style={{background:d.time===t?'rgba(255,255,255,.22)':'rgba(255,255,255,.07)',border:'1px solid',borderColor:d.time===t?'rgba(255,255,255,.55)':'rgba(255,255,255,.1)',borderRadius:8,padding:'9px 2px',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .16s',fontFamily:'var(--sans)'}}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:9}}>
              <button className="btn btn-outline-white" style={{padding:'12px',fontSize:12}} onClick={()=>setStep(1)}>Zurück</button>
              <button className="btn btn-white" style={{opacity:d.time?1:.4}} onClick={()=>d.time&&setStep(3)}>Weiter</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div style={{textAlign:'center',padding:'8px 0'}}>
            <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(255,255,255,.14)',border:'1.5px solid rgba(255,255,255,.45)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <Ic.Check s={22} c="#fff"/>
            </div>
            <div style={{fontWeight:800,fontSize:22,color:'#fff',marginBottom:6}}>Fast fertig!</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginBottom:3}}>{d.service}</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.55)',marginBottom:20}}>{d.date} · {d.time} Uhr</div>
            <a href="#termin" className="btn btn-white" style={{width:'100%',justifyContent:'center',fontSize:13}}>Vollständig buchen</a>
            <button onClick={()=>{setStep(0);setD({service:'',date:'',time:''});}}
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
  <div className="section-full" style={{background:'var(--navy)',minHeight:'90vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(118deg,rgba(10,37,64,.98) 0%,rgba(10,37,64,.82) 50%,rgba(26,86,219,.22) 100%)'}}/>
    <HeroBg/>
    <div className="inner" style={{position:'relative',zIndex:1,paddingTop:56,paddingBottom:56}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:72,alignItems:'center'}}>
        <motion.div initial={{opacity:0,y:36}} animate={{opacity:1,y:0}} transition={{duration:.85,ease:[.22,1,.36,1]}}>
          <div className="tag tag-dark" style={{marginBottom:26}}>
            <Ic.Shield s={10} c="rgba(255,255,255,.7)"/> Amtlich anerkannte Kfz-Prüfstelle
          </div>
          <h1 style={{fontFamily:'var(--sans)',fontWeight:800,fontSize:'clamp(40px,5.8vw,80px)',color:'#fff',lineHeight:1.05,letterSpacing:'-.02em',marginBottom:24}}>
            Ihre Hauptuntersuchung<br/>
            <span style={{color:'var(--sky)'}}>einfach</span> online buchen.
          </h1>
          <p style={{fontSize:15.5,color:'rgba(255,255,255,.6)',lineHeight:1.82,marginBottom:36,maxWidth:500}}>
            Zertifizierter Kfz-Prüfpunkt in Oberhausen. Buchen Sie Ihre HU & AU bequem online — transparent, professionell und ohne Wartezeiten.
          </p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn btn-white" style={{fontSize:13,gap:9}} onClick={onBook}>
              Online buchen <Ic.Arrow s={15}/>
            </button>
            <a href="#leistungen" className="btn btn-outline-white" style={{fontSize:13}}>Leistungen ansehen</a>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} transition={{duration:.85,delay:.18,ease:[.22,1,.36,1]}}>
          <QuickBook/>
        </motion.div>
      </div>
    </div>
  </div>
);

/* ─── TRUST BAR (БЕЗ СКРОЛЛА, 1 СТРОКА) ─────────────────────────────────── */
const TrustBar = () => (
  <div className="section-full" style={{background:'#fff',borderBottom:'1px solid var(--border)'}}>
    <div className="inner" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'4%',flexWrap:'wrap',padding:'20px 0'}}>
      {[
        [<Ic.Award  s={18} c="var(--blue)"/>,'Amtlich anerkannt'],
        [<Ic.Clock  s={18} c="var(--blue)"/>,'Kurze Wartezeiten'],
        [<Ic.Cert   s={18} c="var(--blue)"/>,'Transparente Preise'],
        [<Ic.Wrench s={18} c="var(--blue)"/>,'Experten-Team'],
      ].map(([ico,t], i) => (
        <div key={t} style={{display:'flex',alignItems:'center',gap:10, padding:'8px 0'}}>
          {ico}
          <span style={{fontSize:11.5,fontWeight:700,color:'var(--smoke)',letterSpacing:'.08em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── SERVICES WITH MODAL ───────────────────────────────────────────────── */
const Services = () => {
  const [activeModal, setActiveModal] = useState(null);

  const items = [
    {
      ico:<Ic.Shield s={28} c="var(--blue)"/>, title:'Hauptuntersuchung', sub:'HU · §29 StVZO', desc:'Gesetzlich vorgeschriebene Sicherheitsprüfung auf Verkehrstauglichkeit.', tag:'Pflicht',
      modal: {
        duration: 'ca. 30 Minuten', price: 'ab 142,00 €',
        points: ['Überprüfung von Bremsanlage und Lenkung', 'Sichtprüfung von Fahrgestell und Karosserie', 'Kontrolle der lichttechnischen Einrichtungen', 'Prüfung von Achsen, Rädern und Reifen']
      }
    },
    {
      ico:<Ic.Leaf s={28} c="var(--blue)"/>, title:'Abgasuntersuchung', sub:'AU · Emissionsprüfung', desc:'Prüfung der Abgaswerte gemäß gesetzlicher Vorgaben — auch als Kombi.', tag:'Kombi',
      modal: {
        duration: 'ca. 15 Minuten', price: 'ab 45,00 €',
        points: ['Sichtprüfung der Abgasanlage', 'Messung der Abgaswerte (CO, HC, Lambda)', 'Überprüfung der Motorelektronik (OBD)', 'Bescheinigung der Messwerte zur Vorlage']
      }
    },
    {
      ico:<Ic.Wrench s={28} c="var(--blue)"/>, title:'Vorab-Check', sub:'Sicherheitscheck', desc:'Wir prüfen Ihr Fahrzeug vorab auf Mängel — für eine garantierte Plakette.', tag:'Empfohlen',
      modal: {
        duration: 'ca. 20 Minuten', price: 'Kostenlos bei anschließender HU',
        points: ['Identifikation von HU-relevanten Mängeln', 'Vermeidung von Nachprüfungsgebühren', 'Kostenschätzung für eventuelle Reparaturen', 'Kurze Beratung durch Prüfingenieur']
      }
    },
    {
      ico:<Ic.Clip s={28} c="var(--blue)"/>, title:'Eintragungen', sub:'§19 StVZO · Abnahmen', desc:'Abnahme von Fahrzeugveränderungen wie Tuning, Fahrwerk und Felgen.', tag:'Flexibel',
      modal: {
        duration: 'ca. 30–60 Minuten', price: 'ab 65,00 € (je nach Aufwand)',
        points: ['Prüfung der Anbauteile (Felgen, Fahrwerk, Spoiler)', 'Abgleich mit ABE oder Teilegutachten', 'Sicherstellung der Freigängigkeit und Funktion', 'Ausstellung der Änderungsabnahme']
      }
    },
    {
      ico:<Ic.Moto s={28} c="var(--blue)"/>, title:'Motorrad-HU', sub:'Zweiräder · Saisonal', desc:'Spezialisierte Hauptuntersuchung für Motorräder und Leichtkrafträder.', tag:'Saisonal',
      modal: {
        duration: 'ca. 20 Minuten', price: 'ab 75,00 €',
        points: ['Prüfung von Bremsanlage und Kettensatz', 'Kontrolle der Reifen (Profil und Alter)', 'Sichtprüfung von Rahmen und Lenkkopf', 'Funktionstest Beleuchtung und Hupe']
      }
    },
    {
      ico:<Ic.Award s={28} c="var(--blue)"/>, title:'Oldtimer-Gutachten', sub:'§23 StVZO · H-Kennz.', desc:'Vollständige Begutachtung für das H-Kennzeichen mit offiziellem Gutachten.', tag:'Speziell',
      modal: {
        duration: 'ca. 60 Minuten', price: 'ab 185,00 €',
        points: ['Überprüfung auf zeitgenössischen Originalzustand', 'Umfassender Technik- und Sicherheits-Check', 'Prüfung der Fahrzeughistorie', 'Erstellung des Gutachtens für Zulassungsstelle']
      }
    },
  ];

  return (
    <div id="leistungen" className="section-full sec" style={{background:'var(--stone)',position:'relative',overflow:'hidden'}}>
      <SectionDeco side="right" opacity={0.03}/>
      <div className="inner" style={{position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:44,flexWrap:'wrap',gap:16}}>
          <div>
            <div className="tag" style={{marginBottom:11}}>Leistungen</div>
            <h2 style={{fontWeight:800,fontSize:'clamp(28px,3.8vw,44px)',color:'var(--ink)',letterSpacing:'-.02em'}}>Alles aus einer Hand</h2>
            <div className="accent"/>
            <p style={{color:'var(--smoke)',fontSize:14.5,maxWidth:440,lineHeight:1.72}}>Von der Pflichtprüfung bis zum Sondergutachten.</p>
          </div>
        </motion.div>

        <div className="g3">
          {items.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
              className="service-card" style={{padding:30, display:'flex', flexDirection:'column'}}
              onClick={() => setActiveModal(s)}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
                <div style={{width:56,height:56,background:'linear-gradient(135deg, var(--ice), #fff)',borderRadius:14,border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px rgba(0,0,0,.02)'}}>{s.ico}</div>
                <div className="tag" style={{fontSize:9,padding:'4px 10px'}}>{s.tag}</div>
              </div>
              <div style={{fontSize:10,color:'var(--smoke)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:6,fontWeight:700}}>{s.sub}</div>
              <h3 style={{fontSize:18,marginBottom:10,fontWeight:700,color:'var(--ink)'}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:13.5,lineHeight:1.68,marginBottom:20, flex:1}}>{s.desc}</p>
              
              <div style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--blue)',fontSize:12,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase', transition:'gap .2s', marginTop:'auto'}}>
                Mehr erfahren <Ic.ChevR s={12} c="var(--blue)"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL FÜR LEISTUNGEN */}
      <AnimatePresence>
        {activeModal && (
          <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setActiveModal(null)}
              style={{position:'absolute',inset:0,background:'rgba(10,37,64,.75)',backdropFilter:'blur(6px)'}}/>
            <motion.div initial={{opacity:0,y:28,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:14,scale:.97}}
              style={{position:'relative',background:'#fff',width:'100%',maxWidth:540,borderRadius:20,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.2)',overflow:'hidden'}}>
              
              <div style={{padding:'24px 30px',background:'var(--stone)',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:10,color:'var(--smoke)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:4,fontWeight:700}}>{activeModal.sub}</div>
                  <h3 style={{fontWeight:800,fontSize:22,color:'var(--ink)'}}>{activeModal.title}</h3>
                </div>
                <button onClick={() => setActiveModal(null)} style={{background:'#fff',border:'1px solid var(--border)',width:36,height:36,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 6px rgba(0,0,0,.04)'}}>
                  <Ic.X s={16}/>
                </button>
              </div>
              
              <div style={{padding:'30px'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:28}}>
                  <div style={{background:'var(--ice)',padding:'14px 18px',borderRadius:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'var(--smoke)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>
                      <Ic.Clock s={14}/> Dauer
                    </div>
                    <div style={{fontWeight:700,fontSize:15,color:'var(--navy)'}}>{activeModal.modal.duration}</div>
                  </div>
                  <div style={{background:'var(--ice)',padding:'14px 18px',borderRadius:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,color:'var(--smoke)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>
                      <Ic.Cert s={14}/> Preis
                    </div>
                    <div style={{fontWeight:700,fontSize:15,color:'var(--navy)'}}>{activeModal.modal.price}</div>
                  </div>
                </div>

                <div style={{fontWeight:700,fontSize:14,color:'var(--ink)',marginBottom:14,textTransform:'uppercase',letterSpacing:'.04em'}}>Ablauf & Prüfpunkte</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:12}}>
                  {activeModal.modal.points.map((pt, idx) => (
                    <li key={idx} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,color:'var(--smoke)',lineHeight:1.5}}>
                      <div style={{width:20,height:20,borderRadius:'50%',background:'rgba(26,86,219,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                        <Ic.Check s={12} c="var(--blue)"/>
                      </div>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{padding:'20px 30px',borderTop:'1px solid var(--border)',background:'var(--stone)',textAlign:'right'}}>
                 <a href="#termin" onClick={() => setActiveModal(null)} className="btn btn-primary" style={{padding:'12px 24px'}}>Jetzt Termin buchen</a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── STEPS ──────────────────────────────────────────────────────────────── */
const Steps = () => {
  const steps = [
    {n:'01',title:'Online buchen',desc:'Leistung, Datum und Uhrzeit bequem wählen — rund um die Uhr verfügbar.'},
    {n:'02',title:'Bestätigung',desc:'Sie erhalten eine Bestätigungs-E-Mail mit allen Termindaten.'},
    {n:'03',title:'Fahrzeug bringen',desc:'Unser Team empfängt Ihr Fahrzeug und führt die Prüfung durch.'},
    {n:'04',title:'Plakette erhalten',desc:'Nach bestandener Prüfung erhalten Sie Plakette und Prüfdokumente.'},
  ];
  return (
    <div id="ablauf" className="section-full sec" style={{background:'#fff',position:'relative',overflow:'hidden'}}>
      <SectionDeco side="left" opacity={0.03}/>
      <div className="inner" style={{position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:52}}>
          <div className="tag" style={{marginBottom:11}}>Ablauf</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(28px,3.8vw,44px)',color:'var(--ink)',letterSpacing:'-.02em'}}>In 4 Schritten zur Plakette</h2>
          <div className="accent accent-c"/>
        </motion.div>
        <div className="steps-row">
          {steps.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
              style={{textAlign:'center',padding:'0 20px',position:'relative',zIndex:1}}>
              <div style={{width:46,height:46,borderRadius:'50%',background:'var(--blue)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 4px 18px rgba(26,86,219,.25)'}}>
                <Ic.Check s={19} c="#fff"/>
              </div>
              <div style={{fontSize:10,color:'var(--blue)',letterSpacing:'.18em',marginBottom:5,fontWeight:700}}>{s.n}</div>
              <h3 style={{fontSize:16,marginBottom:7,fontWeight:700,color:'var(--ink)'}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:13,lineHeight:1.68}}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── MODERN BOOKING FORM & SECTION ──────────────────────────────────────── */
const BookingSection = () => {
  const [form,setForm] = useState({leistung:'',fahrzeug:'PKW',datum:'',zeit:'',kennzeichen:'',name:'',email:'',telefon:'',anmerkungen:''});
  const [sent,setSent] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div id="termin" className="section-full" style={{background:'var(--stone)',padding:'88px 0'}}>
      <div className="inner" style={{maxWidth:1100}}>
        
        {/* CENTERED INFO TEXT */}
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center', marginBottom:48}}>
          <div className="tag" style={{marginBottom:11}}>Online Buchung</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(28px,3.8vw,44px)',color:'var(--ink)',letterSpacing:'-.02em',marginBottom:16}}>
            Termin sichern — ganz einfach online.
          </h2>
          <p style={{color:'var(--smoke)',fontSize:15,maxWidth:600,margin:'0 auto 36px',lineHeight:1.7}}>
            Wählen Sie Leistung, Datum und Uhrzeit. Wir bestätigen Ihren Wunschtermin zeitnah per E-Mail oder Telefon.
          </p>
          
          {/* FEATURES GRID ABOVE FORM */}
          <div style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap'}}>
            {[
              [<Ic.Clock s={18} c="var(--blue)"/>, 'Schnelle Rückmeldung', 'Wir melden uns zeitnah.'],
              [<Ic.Cert s={18} c="var(--blue)"/>, 'Vor Ort bezahlen', 'Bar oder EC-Karte.'],
              [<Ic.Shield s={18} c="var(--blue)"/>, 'Kostenlos stornieren', 'Bis 24h vorher frei.'],
              [<Ic.Clip s={18} c="var(--blue)"/>, 'Dokumente sofort', 'Alles direkt vor Ort.']
            ].map(([ico, title, desc], i) => (
              <div key={i} style={{background:'#fff',padding:'16px 20px',borderRadius:16,display:'flex',alignItems:'center',gap:14,boxShadow:'0 2px 10px rgba(0,0,0,.03)',minWidth:240,textAlign:'left',border:'1px solid var(--border)'}}>
                <div style={{width:40,height:40,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{ico}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:'var(--ink)'}}>{title}</div>
                  <div style={{fontSize:12,color:'var(--smoke)'}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MODERN FORM CARD */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <div className="modern-form-card" style={{maxWidth:860, margin:'0 auto'}}>
            {!sent ? (
              <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{display:'flex',flexDirection:'column',gap:20}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:24}}>
                  <div className="modern-field">
                    <label className="modern-label">Leistung *</label>
                    <select className="modern-select" value={form.leistung} onChange={e=>set('leistung',e.target.value)} required>
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
                  <div className="modern-field">
                    <label className="modern-label">Fahrzeugart *</label>
                    <select className="modern-select" value={form.fahrzeug} onChange={e=>set('fahrzeug',e.target.value)} required>
                      <option>PKW</option><option>Motorrad</option><option>Transporter</option><option>Oldtimer</option>
                    </select>
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:24}}>
                  <div className="modern-field">
                    <label className="modern-label">Wunschdatum *</label>
                    <input className="modern-input" type="date" min={new Date().toISOString().split('T')[0]} value={form.datum} onChange={e=>set('datum',e.target.value)} required/>
                  </div>
                  <div className="modern-field">
                    <label className="modern-label">Bevorzugte Zeit *</label>
                    <select className="modern-select" value={form.zeit} onChange={e=>set('zeit',e.target.value)} required>
                      <option value="">Bitte wählen …</option>
                      <option>Vormittag (09–12 Uhr)</option>
                      <option>Nachmittag (12–18 Uhr)</option>
                      <option>Flexibel</option>
                    </select>
                  </div>
                </div>

                <div className="modern-field">
                  <label className="modern-label">Kfz-Kennzeichen *</label>
                  <input className="modern-input" type="text" placeholder="z. B. OB-AB 1234" value={form.kennzeichen} onChange={e=>set('kennzeichen',e.target.value)} required/>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:24}}>
                  <div className="modern-field">
                    <label className="modern-label">Ihr Name *</label>
                    <input className="modern-input" type="text" placeholder="Max Mustermann" value={form.name} onChange={e=>set('name',e.target.value)} required/>
                  </div>
                  <div className="modern-field">
                    <label className="modern-label">Telefon *</label>
                    <input className="modern-input" type="tel" placeholder="+49 …" value={form.telefon} onChange={e=>set('telefon',e.target.value)} required/>
                  </div>
                </div>

                <div className="modern-field">
                  <label className="modern-label">E-Mail *</label>
                  <input className="modern-input" type="email" placeholder="max@beispiel.de" value={form.email} onChange={e=>set('email',e.target.value)} required/>
                </div>

                <div className="modern-field">
                  <label className="modern-label">Anmerkungen</label>
                  <textarea className="modern-textarea" placeholder="Haben Sie besondere Wünsche oder Fragen?" value={form.anmerkungen} onChange={e=>set('anmerkungen',e.target.value)}/>
                </div>

                <div style={{marginTop:16, display:'flex', flexDirection:'column', alignItems:'center', gap:16}}>
                  <button type="submit" className="btn btn-primary" style={{padding:'16px 36px',fontSize:14,borderRadius:12}}>
                    Termin verbindlich anfragen <Ic.Arrow s={16}/>
                  </button>
                  <p style={{fontSize:12,color:'var(--smoke)',textAlign:'center'}}>
                    Ihre Daten werden sicher übertragen und gemäß <a href="#" onClick={e=>e.preventDefault()} style={{color:'var(--blue)'}}>Datenschutz</a> verarbeitet.
                  </p>
                </div>
              </form>
            ) : (
              <div style={{padding:'60px 20px',textAlign:'center'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'var(--ice)',border:'2px solid var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                  <Ic.Check s={28} c="var(--blue)"/>
                </div>
                <h3 style={{fontWeight:800,fontSize:26,marginBottom:12,color:'var(--ink)'}}>Anfrage erfolgreich!</h3>
                <p style={{color:'var(--smoke)',fontSize:15,lineHeight:1.7,marginBottom:30,maxWidth:400,margin:'0 auto 30px'}}>
                  Vielen Dank, {form.name}. Wir haben Ihre Terminanfrage erhalten und melden uns in Kürze zur finalen Bestätigung.<br/><br/>
                  <strong style={{color:'var(--ink)',background:'var(--stone)',padding:'10px 16px',borderRadius:8,display:'inline-block'}}>Gewählt: {form.datum} · {form.zeit}</strong>
                </p>
                <button className="btn btn-primary" onClick={()=>setSent(false)}>Neuen Termin anfragen</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ─── FAQ ────────────────────────────────────────────────────────────────── */
const FAQ = () => {
  const [open,setOpen] = useState(null);
  const faqs = [
    ['Wie lange dauert eine Hauptuntersuchung?','Eine Standard-HU dauert ca. 30 Minuten. Mit AU-Kombi ca. 45–60 Minuten. Bitte planen Sie mind. 30 Minuten zwischen den Terminen ein.'],
    ['Was muss ich zur HU mitbringen?','Den Fahrzeugschein (Zulassungsbescheinigung Teil I). Bei Eintragungen bitte alle ABE-Dokumente oder Gutachten mitbringen.'],
    ['Was passiert, wenn mein Fahrzeug nicht besteht?','Sie erhalten ein detailliertes Mängelprotokoll. Geringe Mängel können innerhalb eines Monats behoben und kostenlos nachgeprüft werden.'],
    ['Kann ich einen Termin kostenlos stornieren?','Ja — bis 24 Stunden vor dem Termin ist eine kostenlose Stornierung per Telefon oder E-Mail möglich.'],
    ['Welche Fahrzeuge prüfen Sie?','PKW, Motorräder, Transporter sowie Oldtimer (§23 StVZO). Bei Unsicherheiten kontaktieren Sie uns bitte vorab.'],
    ['Gibt es einen Wartebereich?','Ja — unser Wartebereich steht Ihnen zur Verfügung. Das Fahrzeug abgeben und später abholen ist ebenfalls möglich.'],
  ];
  return (
    <div id="faq" className="section-full sec" style={{background:'#fff',position:'relative',overflow:'hidden'}}>
      <SectionDeco side="right" opacity={0.025}/>
      <div className="inner" style={{maxWidth:820,margin:'0 auto',position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:44}}>
          <div className="tag" style={{marginBottom:11}}>FAQ</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(28px,3.8vw,44px)',color:'var(--ink)',letterSpacing:'-.02em'}}>Häufige Fragen</h2>
          <div className="accent accent-c"/>
        </motion.div>
        <div className="service-card" style={{padding:'4px 32px'}}>
          {faqs.map(([q,a],i) => (
            <div key={i} className="faq-item" style={{borderBottom: i === faqs.length-1 ? 'none' : '1px solid var(--border)'}}>
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

/* ─── MAP EMBED WITH CONSENT ─────────────────────────────────────────────── */
const MapEmbed = () => {
  const consent = typeof localStorage !== 'undefined' && localStorage.getItem('cookie_consent');
  const [accepted, setAccepted] = useState(consent === 'all');
  if (!accepted) return (
    <div style={{width:'100%',height:400,background:'var(--stone)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,borderBottom:'1px solid var(--border)'}}>
      <div style={{width:48,height:48,background:'var(--ice)',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Ic.Pin s={22} c="var(--blue)"/>
      </div>
      <div style={{textAlign:'center',maxWidth:360}}>
        <div style={{fontWeight:700,fontSize:15,color:'var(--ink)',marginBottom:7}}>Google Maps ist deaktiviert</div>
        <p style={{fontSize:13,color:'var(--smoke)',lineHeight:1.65}}>Um die Karte anzuzeigen, müssen Sie Google Maps zustimmen (Art. 49 Abs. 1 lit. a DSGVO).</p>
      </div>
      <button className="btn btn-primary" style={{fontSize:12,padding:'10px 20px'}} onClick={()=>{localStorage.setItem('cookie_consent','all');setAccepted(true);}}>
        Google Maps aktivieren
      </button>
      <a href="https://maps.google.com/?q=51.472992,6.863788" target="_blank" rel="noopener noreferrer"
        style={{fontSize:12,color:'var(--smoke)',textDecoration:'underline'}}>In Google Maps öffnen</a>
    </div>
  );
  return (
    <iframe src="https://maps.google.com/maps?q=51.472992,6.863788&hl=de&z=15&output=embed"
      width="100%" height="400" style={{border:'none',display:'block',filter:'grayscale(.1)'}}
      allowFullScreen loading="lazy" title="Standort Karte"/>
  );
};

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
const Contact = () => (
  <div id="standort" className="section-full" style={{background:'var(--stone)'}}>
    <div style={{width:'100%',lineHeight:0}}><MapEmbed/></div>

    <div className="inner" style={{padding:'60px 72px'}}>
      <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:36}}>
        <div className="tag" style={{marginBottom:11}}>Standort & Kontakt</div>
        <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.5vw,42px)',color:'var(--ink)',letterSpacing:'-.02em'}}>So finden Sie uns</h2>
        <div className="accent"/>
      </motion.div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:0,borderRadius:16,overflow:'hidden',border:'1px solid var(--border)'}}>
        <div style={{background:'#fff',padding:28,borderRight:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
            <div style={{width:36,height:36,background:'var(--ice)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Ic.Pin s={15} c="var(--blue)"/>
            </div>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--smoke)'}}>Adresse</span>
          </div>
          <div style={{fontSize:14,fontWeight:500,lineHeight:1.75,color:'var(--ink)',marginBottom:14}}>
            Musterstraße 123<br/>46045 Oberhausen<br/>Deutschland
          </div>
          <a href="#" style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,fontWeight:700,color:'var(--blue)',textDecoration:'none',letterSpacing:'.08em',textTransform:'uppercase'}}>
            Route planen <Ic.ChevR s={11} c="var(--blue)"/>
          </a>
        </div>

        <div style={{background:'#fff',padding:28,borderRight:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
            <div style={{width:36,height:36,background:'var(--ice)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Ic.Phone s={15} c="var(--blue)"/>
            </div>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--smoke)'}}>Kontakt</span>
          </div>
          <div style={{fontSize:14,fontWeight:500,lineHeight:1.9,color:'var(--ink)',marginBottom:16}}>
            {PHONE}<br/>info@autoservice-ob.de
          </div>
          <a href={PHONE_HREF} className="btn btn-primary" style={{padding:'9px 16px',fontSize:11,gap:6,display:'inline-flex'}}>
            <Ic.Phone s={13}/> Jetzt anrufen
          </a>
        </div>

        <div style={{background:'#fff',padding:28,borderRight:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
            <div style={{width:36,height:36,background:'var(--ice)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Ic.Clock s={15} c="var(--blue)"/>
            </div>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--smoke)'}}>Öffnungszeiten</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[['Mo – Mi','09:00 – 18:00 Uhr'],['Donnerstag','15:00 – 18:00 Uhr'],['Freitag','15:00 – 18:00 Uhr'],['Sa & So','Geschlossen']].map(([day,time]) => (
              <div key={day} style={{display:'flex',justifyContent:'space-between',fontSize:13,borderBottom:'1px solid var(--border)',paddingBottom:5,gap:8}}>
                <span style={{color:'var(--smoke)'}}>{day}</span>
                <span style={{fontWeight:600,color:'var(--ink)',whiteSpace:'nowrap'}}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'var(--navy)',padding:28,display:'flex',flexDirection:'column',justifyContent:'center',gap:12}}>
          <h3 style={{fontWeight:800,fontSize:20,color:'#fff',letterSpacing:'-.01em',lineHeight:1.3}}>
            Bereit für Ihre<br/>Hauptuntersuchung?
          </h3>
          <p style={{fontSize:13,color:'rgba(255,255,255,.52)',lineHeight:1.6}}>
            Jetzt online buchen — schnell und unkompliziert.
          </p>
          <a href="#termin" className="btn btn-white" style={{gap:8,alignSelf:'flex-start',fontSize:12}}>
            Online buchen <Ic.Arrow s={14}/>
          </a>
        </div>
      </div>
    </div>
  </div>
);

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
const Footer = ({ openModal }) => (
  <footer className="section-full" style={{background:'var(--ink)',color:'#fff'}}>
    <div className="inner" style={{padding:'48px 72px 0'}}>
      <div style={{display:'grid',gridTemplateColumns:'2.2fr 1fr 1fr',gap:48,paddingBottom:40,borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:32,height:32,background:'var(--blue)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.Wrench s={15} c="#fff"/>
            </div>
            <div style={{fontWeight:800,fontSize:18,color:'#fff',letterSpacing:'-.01em'}}>
              Auto<span style={{color:'var(--sky)'}}>Service</span>
              <span style={{fontWeight:400,fontSize:13,color:'rgba(255,255,255,.35)',marginLeft:8}}>Oberhausen</span>
            </div>
          </div>
          <p style={{color:'rgba(255,255,255,.36)',fontSize:13,lineHeight:1.75,maxWidth:280}}>
            Amtlich anerkannte Kfz-Prüfstelle in Oberhausen. Hauptuntersuchung und Abgasuntersuchung — professionell und zuverlässig.
          </p>
        </div>

        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',marginBottom:16}}>Unternehmen</div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
            {['Über uns','Team','Karriere','Kontakt'].map(item => (
              <li key={item}>
                <button style={{background:'none',border:'none',color:'rgba(255,255,255,.48)',fontSize:13,cursor:'pointer',padding:0,fontFamily:'var(--sans)',transition:'color .18s'}}
                  onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,.48)'}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',marginBottom:16}}>Rechtliches</div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
            {['Impressum','Datenschutz','AGB','Cookie-Einstellungen'].map(item => (
              <li key={item}>
                <button onClick={()=>['Impressum','Datenschutz','AGB'].includes(item)&&openModal(item)}
                  style={{background:'none',border:'none',color:'rgba(255,255,255,.48)',fontSize:13,cursor:'pointer',padding:0,fontFamily:'var(--sans)',transition:'color .18s'}}
                  onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,.48)'}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10,padding:'18px 0'}}>
        <span style={{color:'rgba(255,255,255,.2)',fontSize:12}}>© {new Date().getFullYear()} AutoService Oberhausen — Alle Rechte vorbehalten.</span>
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
        <h4 style={{marginBottom:8,fontSize:14,fontWeight:700,color:'var(--ink)'}}>Angaben gemäß § 5 TMG</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.85,fontSize:13.5}}>
          AutoService Oberhausen<br/>Musterstraße 123<br/>46045 Oberhausen<br/><br/>
          Telefon: {PHONE}<br/>E-Mail: info@autoservice-ob.de<br/><br/>
          <strong style={{color:'var(--ink)'}}>Verantwortlich (§ 55 Abs. 2 RStV):</strong><br/>
          [Name Verantwortlicher], oben genannte Anschrift
        </p>
      </div>
    ),
    Datenschutz: (
      <div>
        <h4 style={{marginBottom:8,fontSize:14,fontWeight:700,color:'var(--ink)'}}>Datenschutzerklärung</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.85,fontSize:13.5}}>
          Wir verarbeiten personenbezogene Daten gemäß DSGVO und BDSG.<br/><br/>
          <strong style={{color:'var(--ink)'}}>Verantwortlicher:</strong> AutoService Oberhausen, Musterstraße 123, 46045 Oberhausen<br/><br/>
          <strong style={{color:'var(--ink)'}}>Erhobene Daten:</strong> Name, E-Mail, Telefon, Fahrzeugdaten — ausschließlich zur Terminverarbeitung.<br/><br/>
          Rechte gemäß Art. 15–18 DSGVO: Auskunft, Berichtigung, Löschung. Kontakt: info@autoservice-ob.de
        </p>
      </div>
    ),
    AGB: (
      <div>
        <h4 style={{marginBottom:8,fontSize:14,fontWeight:700,color:'var(--ink)'}}>Allgemeine Geschäftsbedingungen</h4>
        <p style={{color:'var(--smoke)',lineHeight:1.85,fontSize:13.5}}>
          <strong style={{color:'var(--ink)'}}>§ 1 Geltungsbereich</strong><br/>
          Gilt für alle Terminbuchungen über unsere Website.<br/><br/>
          <strong style={{color:'var(--ink)'}}>§ 2 Stornierung</strong><br/>
          Bis 24 Stunden vor Termin kostenlos per Telefon oder E-Mail stornierbar.<br/><br/>
          <strong style={{color:'var(--ink)'}}>§ 3 Leistungen</strong><br/>
          Prüfleistungen nach gesetzlichen Vorgaben der StVZO.
        </p>
      </div>
    ),
  };
  return (
    <AnimatePresence>
      <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
          style={{position:'absolute',inset:0,background:'rgba(10,37,64,.75)',backdropFilter:'blur(8px)'}}/>
        <motion.div initial={{opacity:0,y:28,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:14,scale:.97}}
          style={{position:'relative',background:'#fff',width:'100%',maxWidth:520,maxHeight:'80vh',borderRadius:16,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.2)',overflow:'hidden'}}>
          <div style={{padding:'20px 26px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontWeight:700,fontSize:18,color:'var(--ink)'}}>{title}</h3>
            <button onClick={onClose} style={{background:'var(--stone)',border:'none',width:32,height:32,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic.X s={15}/>
            </button>
          </div>
          <div style={{padding:26,overflowY:'auto'}}>{content[title]||<p>Inhalt folgt.</p>}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─── COOKIE BANNER ──────────────────────────────────────────────────────── */
const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  useEffect(() => { if (!localStorage.getItem('cookie_consent')) setVisible(true); }, []);
  const accept = (all) => { localStorage.setItem('cookie_consent', all ? 'all' : 'essential'); setVisible(false); };
  if (!visible) return null;
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:500,background:'#fff',borderTop:'1px solid var(--border)',boxShadow:'0 -6px 32px rgba(0,0,0,.09)'}}>
      <div className="inner" style={{padding:'18px 72px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div style={{flex:1,minWidth:280}}>
            <div style={{fontWeight:700,fontSize:14,color:'var(--ink)',marginBottom:5}}>Diese Website verwendet Cookies</div>
            <p style={{fontSize:12.5,color:'var(--smoke)',lineHeight:1.65,maxWidth:660}}>
              Technisch notwendige Cookies sind stets aktiv. Mit Ihrer Einwilligung setzen wir auch Analyse-Cookies ein (§ 25 TTDSG, Art. 6 Abs. 1 lit. a DSGVO).
              <button onClick={()=>setDetails(d=>!d)} style={{background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontSize:12.5,padding:'0 4px',fontFamily:'var(--sans)',textDecoration:'underline'}}>{details?'Weniger':'Mehr erfahren'}</button>
            </p>
            {details && (
              <div style={{marginTop:10,padding:12,background:'var(--stone)',borderRadius:8,fontSize:12,color:'var(--smoke)',lineHeight:1.7}}>
                <strong style={{color:'var(--ink)'}}>Notwendig:</strong> Session-Verwaltung — immer aktiv.<br/>
                <strong style={{color:'var(--ink)'}}>Google Maps:</strong> Nur nach Zustimmung.
              </div>
            )}
          </div>
          <div style={{display:'flex',gap:9,alignItems:'center',flexShrink:0,flexWrap:'wrap'}}>
            <button className="btn btn-ghost" style={{padding:'9px 18px',fontSize:12}} onClick={()=>accept(false)}>Nur notwendige</button>
            <button className="btn btn-primary" style={{padding:'9px 18px',fontSize:12}} onClick={()=>accept(true)}>Alle akzeptieren</button>
          </div>
        </div>
      </div>
    </div>
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
          style={{position:'fixed',bottom:80,right:24,zIndex:80,width:42,height:42,borderRadius:'50%',background:'var(--blue)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 20px rgba(26,86,219,.34)',color:'#fff',fontSize:16,fontWeight:700}}>
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
      <CookieBanner/>
    </>
  );
}