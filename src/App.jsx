import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const PHONE = "+49 1575 5476991";
const PHONE_HREF = "tel:+4915755476991";
const WHATSAPP_HREF = "https://wa.me/4915755476991";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

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
      --green:  #16a34a;
    }

    html, body { width:100%; margin:0; padding:0; scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
    body { font-family:var(--sans); background:var(--stone); color:var(--ink); overflow-x:hidden; line-height:1.6; }
    #root { width:100%; min-width:100%; }

    .section-full { width:100%; display:block; }
    .inner { width:100%; max-width:1280px; margin:0 auto; padding:0 64px; box-sizing:border-box; }
    .sec { padding:80px 0; }

    .tag {
      display:inline-flex; align-items:center; gap:6px;
      font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
      color:var(--blue); background:var(--ice);
      padding:5px 13px; border-radius:6px; border:1px solid rgba(26,86,219,.15);
    }
    
    .btn {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      font-family:var(--sans); font-weight:700; font-size:13px; letter-spacing:.04em; text-transform:uppercase;
      padding:12px 24px; border-radius:10px; border:none; cursor:pointer;
      transition:all .2s ease; text-decoration:none; white-space:nowrap;
    }
    .btn-primary { background:var(--blue); color:#fff; box-shadow:0 4px 18px rgba(26,86,219,.28); }
    .btn-primary:hover { background:var(--mid); transform:translateY(-1px); box-shadow:0 8px 26px rgba(26,86,219,.36); }
    .btn-ghost { background:transparent; color:var(--blue); border:1.5px solid var(--border); }
    .btn-ghost:hover { background:var(--ice); border-color:var(--blue); }
    .btn-wa { background:#25D366; color:#fff; box-shadow:0 4px 18px rgba(37,211,102,.3); }
    .btn-wa:hover { background:#1ebe5d; transform:translateY(-1px); }
    .btn-call { background:var(--blue); color:#fff; box-shadow:0 4px 18px rgba(26,86,219,.28); }
    .btn-call:hover { background:var(--mid); transform:translateY(-1px); }

    .card { background:#fff; border-radius:16px; border:1px solid var(--border); box-shadow:0 1px 8px rgba(0,0,0,.03); transition:transform .26s,box-shadow .26s; }
    .card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(0,0,0,.08); }

    .accent { width:32px; height:2px; background:var(--blue); border-radius:2px; margin:10px 0 18px; }
    .accent-c { margin:10px auto 18px; }

    /* Form fields */
    .field { display:flex; flex-direction:column; gap:5px; }
    .field label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--smoke); }
    .field input, .field select, .field textarea {
      font-family:var(--sans); font-size:13px; color:var(--ink);
      background:var(--stone); border:1.5px solid var(--border); border-radius:8px;
      padding:10px 13px; transition:border-color .18s,box-shadow .18s; -webkit-appearance:none;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline:none; border-color:var(--blue); background:#fff; box-shadow:0 0 0 3px rgba(26,86,219,.1);
    }
    .field select {
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 12px center; padding-right:34px; cursor:pointer;
    }
    .field textarea { resize:vertical; min-height:72px; }

    /* Nav link */
    .nav-link {
      font-size:12px; font-weight:600; color:var(--smoke); letter-spacing:.08em; text-transform:uppercase;
      padding:5px 2px; position:relative; transition:color .18s; text-decoration:none;
    }
    .nav-link::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:2px; background:var(--blue); border-radius:1px; transform:scaleX(0); transition:transform .2s; }
    .nav-link:hover { color:var(--ink); }
    .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
    .nav-link.active { color:var(--blue); font-weight:700; }

    /* Steps */
    .steps-row { display:grid; grid-template-columns:repeat(4,1fr); position:relative; gap:8px; }
    .steps-row::before { content:''; position:absolute; top:24px; left:12%; right:12%; height:2px; background:var(--blue); opacity:0.15; z-index:0; }

    /* FAQ */
    .faq-item { border-bottom:1px solid var(--border); }
    .faq-q { width:100%; background:none; border:none; text-align:left; cursor:pointer; padding:18px 0; display:flex; justify-content:space-between; align-items:center; font-family:var(--sans); font-size:14px; font-weight:600; color:var(--ink); gap:14px; }
    .faq-icon { width:26px; height:26px; border-radius:50%; background:var(--stone); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; border:1px solid var(--border); }
    .faq-q.open .faq-icon { background:var(--blue); border-color:var(--blue); transform:rotate(45deg); }
    .faq-a { font-size:13px; line-height:1.8; color:var(--smoke); padding-bottom:18px; }

    /* Service card */
    .svc-card { background:#fff; border-radius:18px; border:1px solid var(--border); box-shadow:0 2px 12px rgba(0,0,0,.03); transition:transform .28s,box-shadow .28s,border-color .28s; cursor:pointer; }
    .svc-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.08); border-color:rgba(26,86,219,.25); }

    /* Grid helpers */
    .g2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }

    /* Marquee Animation (Left to Right) */
    @keyframes scrollRight {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
    .marquee-wrap { overflow:hidden; white-space:nowrap; width:100%; position:relative; background:#fff; border-bottom:1px solid var(--border); border-top:1px solid var(--border); padding:14px 0; }
    .marquee-inner { display:flex; width:200%; animation:scrollRight 35s linear infinite; }
    .marquee-inner:hover { animation-play-state:paused; }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--border); border-radius:8px; }

    /* ─── MOBILE ─────────────────────────────────── */
    @media (max-width:900px) {
      .inner { padding:0 24px; }
      .sec { padding:56px 0; }
      .g3 { grid-template-columns:1fr 1fr; }
      .g4 { grid-template-columns:1fr 1fr; }
      .steps-row { grid-template-columns:1fr 1fr; gap:36px; }
      .steps-row::before { display:none; }
      .hide-mob { display:none !important; }
      .mob-col { flex-direction:column !important; }
      .mob-full { width:100% !important; }
    }
    @media (max-width:600px) {
      .inner { padding:0 16px; }
      .g3 { grid-template-columns:1fr; }
      .g4 { grid-template-columns:1fr 1fr; }
      .g2 { grid-template-columns:1fr; }
      .mob-stack { grid-template-columns:1fr !important; }
    }
  `}</style>
);

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Ic = {
  Shield:  ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:   ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevR:   ({s=14,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus:    ({s=12,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X:       ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone:   ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  Pin:     ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:   ({s=17,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Wrench:  ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Clip:    ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Leaf:    ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M17 8C8 10 5.9 16.17 3.82 19.72A2 2 0 0 0 5 22c2.24-.47 4.43-1.82 7-4 2.64-2.24 4.53-5.52 5-10z"/><path d="M22 2s-4 0-7 3"/></svg>,
  Award:   ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Cert:    ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  Moto:    ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-4l-3 7h10l-3-7z"/><path d="M10 6V4h4"/></svg>,
  Arrow:   ({s=15,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Gear:    ({s=200,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Wa:      ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  Menu:    ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Info:    ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

/* ─── ANIMATED BG DECO ──────────────────────────────────────────────────── */
const HeroBg = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress,[0,0.3],[0,100]);
  const rot1 = useTransform(scrollYProgress,[0,0.3],[0,45]);
  const y2 = useTransform(scrollYProgress,[0,0.3],[0,60]);
  const rot2 = useTransform(scrollYProgress,[0,0.3],[0,-30]);
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      <motion.div style={{position:'absolute',right:'-5%',bottom:'-8%',y:y1,rotate:rot1,opacity:.07}}>
        <Ic.Gear s={420} c="white"/>
      </motion.div>
      <motion.div style={{position:'absolute',left:'-3%',top:'10%',y:y2,rotate:rot2,opacity:.05}}>
        <Ic.Gear s={200} c="white"/>
      </motion.div>
    </div>
  );
};

const SectionDeco = ({ side='right', color='var(--blue)', opacity=0.03 }) => {
  const { scrollYProgress } = useScroll();
  const rot = useTransform(scrollYProgress,[0,1],[0,40]);
  return (
    <div style={{position:'absolute',[side]:'-4%',top:'50%',transform:'translateY(-50%)',pointerEvents:'none',overflow:'hidden',zIndex:0}}>
      <motion.div style={{rotate:rot,opacity}}><Ic.Gear s={240} c={color}/></motion.div>
    </div>
  );
};

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
const Navbar = ({ onBook }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [mOpen, setMOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      for (const id of ['standort','faq','ablauf','leistungen'].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) { setActive(id); return; }
      }
      setActive('');
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{position:'sticky',top:0,zIndex:200,width:'100%',background:scrolled?'rgba(255,255,255,.98)':'rgba(255,255,255,.94)',backdropFilter:'blur(18px)',borderBottom:`1px solid ${scrolled?'var(--border)':'transparent'}`,transition:'all .28s'}}>
      <div className="inner" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:62}}>
        <div onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
          <div style={{width:32,height:32,background:'var(--blue)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Ic.Wrench s={15} c="#fff"/>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:'var(--ink)',lineHeight:1.1,letterSpacing:'-.02em'}}>Auto<span style={{color:'var(--blue)'}}>Service</span></div>
            <div style={{fontSize:9,letterSpacing:'.12em',color:'var(--smoke)',textTransform:'uppercase',fontWeight:600}}>Oberhausen</div>
          </div>
        </div>

        <nav className="hide-mob" style={{display:'flex',gap:28,alignItems:'center'}}>
          {[['leistungen','Leistungen'],['ablauf','Ablauf'],['faq','FAQ'],['standort','Standort']].map(([id,label]) => (
            <a key={id} href={`#${id}`} className={`nav-link${active===id?' active':''}`}>{label}</a>
          ))}
        </nav>

        <div className="hide-mob" style={{display:'flex',alignItems:'center',gap:12}}>
          <a href={PHONE_HREF} className="btn btn-ghost" style={{padding:'9px 18px',fontSize:11, textDecoration:'none'}}>
             <Ic.Phone s={13}/> Jetzt anrufen
          </a>
          <button className="btn btn-primary" style={{padding:'9px 18px',fontSize:11}} onClick={onBook}>Termin buchen</button>
        </div>

        <button onClick={()=>setMOpen(o=>!o)} style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:4}} className="mob-menu-btn"
          aria-label="Menü öffnen">
          <Ic.Menu s={22} c="var(--ink)"/>
        </button>
      </div>

      <AnimatePresence>
        {mOpen && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            style={{overflow:'hidden',background:'#fff',borderTop:'1px solid var(--border)'}}>
            <div style={{padding:'16px 24px',display:'flex',flexDirection:'column',gap:14}}>
              {[['leistungen','Leistungen'],['ablauf','Ablauf'],['faq','FAQ'],['standort','Standort']].map(([id,label]) => (
                <a key={id} href={`#${id}`} onClick={()=>setMOpen(false)}
                  style={{fontSize:14,fontWeight:700,color:active===id?'var(--blue)':'var(--ink)',textDecoration:'none',letterSpacing:'.06em',textTransform:'uppercase'}}>
                  {label}
                </a>
              ))}
              <div style={{borderTop:'1px solid var(--border)',paddingTop:14,display:'flex',flexDirection:'column',gap:10}}>
                <a href={PHONE_HREF} className="btn btn-call" style={{justifyContent:'center',gap:8}}>
                  <Ic.Phone s={15}/> {PHONE}
                </a>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{justifyContent:'center',gap:8}}>
                  <Ic.Wa s={16} c="#fff"/> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.mob-menu-btn { display:none; } @media(max-width:900px){.mob-menu-btn{display:flex !important;} }`}</style>
    </header>
  );
};

/* ─── HERO ───────────────────────────────────────────────────────────────── */
const Hero = ({ onBook }) => (
  <div className="section-full" style={{background:'linear-gradient(160deg,#f0f6ff 0%,#f8fafc 55%,#eef4fe 100%)', padding:'60px 0 80px', display:'flex', alignItems:'center', position:'relative', overflow:'hidden'}}>
    {/* ИЗОБРАЖЕНИЕ second.png НА ПЕРВОМ ЭКРАНЕ */}
    <div style={{position:'absolute', inset:0, backgroundImage:"url('second.jpg')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.06, pointerEvents:'none', zIndex:0}} />
    
    <HeroBg/>

    {/* Dekorative Elemente */}
    <div style={{position:'absolute',top:0,right:0,width:'45%',height:'100%',background:'linear-gradient(135deg,rgba(26,86,219,.06) 0%,rgba(96,165,250,.04) 100%)',clipPath:'polygon(18% 0,100% 0,100% 100%,0% 100%)',pointerEvents:'none'}}/>
    <div style={{position:'absolute',bottom:-60,left:-60,width:300,height:300,borderRadius:'50%',background:'rgba(26,86,219,.04)',pointerEvents:'none'}}/>

    <div className="inner" style={{position:'relative',zIndex:1, width:'100%', textAlign:'center'}}>
      <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.22,1,.36,1]}} style={{maxWidth: 700, margin: '0 auto'}}>
        <div className="tag" style={{marginBottom:24, padding:'8px 18px', fontSize: 11, background: '#fff', boxShadow: '0 4px 12px rgba(26,86,219,0.08)'}}>
          <Ic.Shield s={12} c="var(--blue)"/> Offiziell zertifizierte Kfz-Prüfstelle
        </div>
        
        <h1 style={{fontWeight:800,fontSize:'clamp(36px,6vw,72px)',color:'var(--ink)',lineHeight:1.06,letterSpacing:'-.025em',marginBottom:24}}>
          Ihre HU / AU in<br/><span style={{color:'var(--blue)'}}>Oberhausen</span>
        </h1>
        
        <p style={{fontSize:16,color:'var(--smoke)',lineHeight:1.8,marginBottom:40, maxWidth:500, margin:'0 auto 40px'}}>
          Buchen Sie Ihre Hauptuntersuchung und Abgasuntersuchung schnell und bequem online. Kein Warten, transparente Preise, professionelle Prüfingenieure.
        </p>

        <div style={{display:'flex',gap:16,flexWrap:'wrap', justifyContent:'center'}}>
          <button className="btn btn-primary" style={{fontSize:14,gap:9,padding:'14px 32px'}} onClick={onBook}>
            Termin buchen <Ic.Arrow s={16}/>
          </button>
          <a href={PHONE_HREF} className="btn btn-ghost" style={{fontSize:14,gap:9,padding:'14px 32px', background:'#fff'}}>
            <Ic.Phone s={16}/> {PHONE}
          </a>
        </div>
      </motion.div>
    </div>
  </div>
);

/* ─── TRUST BAR ─────────────────────────────────────────────────────────── */
const TrustBar = () => {
  const items = [
    [<Ic.Award  s={15} c="var(--blue)"/>,'Amtlich anerkannt'],
    [<Ic.Clock  s={15} c="var(--blue)"/>,'Kurze Wartezeiten'],
    [<Ic.Cert   s={15} c="var(--blue)"/>,'Transparente Preise'],
    [<Ic.Shield s={15} c="var(--blue)"/>,'Online-Buchung 24/7'],
    [<Ic.Wrench s={15} c="var(--blue)"/>,'Qualifizierte Prüfer'],
    [<Ic.Leaf   s={15} c="var(--blue)"/>,'Umwelt-zertifiziert']
  ];
  
  const scrollingItems = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-wrap">
      <div className="marquee-inner">
        {scrollingItems.map(([ico,t],i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'0 40px', borderRight: '1px solid var(--border)'}}>
            {ico}
            <span style={{fontSize:12,fontWeight:700,color:'var(--smoke)',letterSpacing:'.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── SERVICES ───────────────────────────────────────────────────────────── */
const Services = () => {
  const [modal, setModal] = useState(null);
  const items = [
    {
      ico:<Ic.Shield s={26} c="var(--blue)"/>, title:'Hauptuntersuchung (HU)', sub:'§29 StVZO · Pflichtprüfung', tag:'Pflicht',
      desc:'Gesetzlich vorgeschriebene Sicherheitsprüfung für alle Kfz — überprüft Bremsen, Lenkung, Beleuchtung und Karosserie.',
      duration:'ca. 30 Min.',
      details:['Überprüfung der Bremsanlage (Betriebs- und Feststellbremse)','Sicht- und Funktionsprüfung aller Beleuchtungseinrichtungen','Prüfung von Lenkung, Achsen und Radaufhängung','Kontrolle der Karosserie auf sicherheitsrelevante Schäden','Überprüfung von Sichtscheiben, Spiegeln und Scheibenwischern','Prüfung der Abgasanlage auf Dichtheit','Sicherheitsgurtprüfung','Auslesen der Fahrzeugelektronik / OBD'],
      note:'Gesetzlich vorgeschrieben gemäß §29 StVZO. Nach 3 Jahren bei Neuwagen, danach alle 2 Jahre.'
    },
    {
      ico:<Ic.Leaf s={26} c="var(--blue)"/>, title:'Abgasuntersuchung (AU)', sub:'AU · Emissionsprüfung', tag:'Kombi möglich',
      desc:'Prüfung der Schadstoffemissionen Ihres Fahrzeugs — schützt Umwelt und vermeidet Bußgelder.',
      duration:'ca. 15 Min.',
      details:['Sichtprüfung der gesamten Abgasanlage auf Undichtigkeiten','Messung von CO, HC und Lambda-Werten (Benziner)','Trübungsmessung beim Dieselfahrzeug','Auslesen des OBD-Systems auf Fehler im Abgasstrang','Prüfung des Katalysators und Partikelfilters','Dokumentation und Bescheinigung der Messwerte'],
      note:'Pflichtbestandteil der Hauptuntersuchung. Separater Termin möglich, Kombi empfohlen.'
    },
    {
      ico:<Ic.Wrench s={26} c="var(--blue)"/>, title:'Vorab-Check', sub:'Sicherheits-Vorprüfung', tag:'Empfohlen',
      desc:'Identifizieren Sie Mängel vor der HU, um Nachprüfungen und Zusatzkosten zu vermeiden.',
      duration:'ca. 20 Min.',
      details:['Überprüfung aller HU-relevanten Sicherheitspunkte','Identifikation erheblicher und geringfügiger Mängel','Kosten- und Zeiteinschätzung für eventuelle Reparaturen','Persönliche Beratung durch unseren Prüfingenieur','Dokumentation mit Mängelliste zur Weitergabe an Werkstatt'],
      note:'Kostenlos bei anschließender HU. Separat buchbar ab 29 €.'
    },
    {
      ico:<Ic.Clip s={26} c="var(--blue)"/>, title:'Eintragungen / Abnahmen', sub:'§19 StVZO', tag:'Flexibel',
      desc:'Offizielle Abnahme von Fahrzeugveränderungen — Tuning, Fahrwerk, Felgen und mehr.',
      duration:'30–60 Min.',
      details:['Abnahme von Fahrwerksveränderungen (Tieferlegung, Gewindefahrwerk)','Prüfung von Felgen und Bereifung inkl. Spurweitenerweiterung','Abnahme von Karosserieveränderungen und Anbauteilen','Prüfung auf Übereinstimmung mit ABE oder Einzelgutachten','Überprüfung der Freigängigkeit und Funktionstüchtigkeit','Eintrag in die Zulassungsbescheinigung Teil I'],
      note:'Bitte alle ABE-Dokumente oder Teilegutachten mitbringen.'
    },
    {
      ico:<Ic.Moto s={26} c="var(--blue)"/>, title:'Motorrad-HU', sub:'Zweiräder · §29 StVZO', tag:'Saisonal',
      desc:'Spezialisierte Hauptuntersuchung für Motorräder, Roller und Leichtkrafträder.',
      duration:'ca. 25 Min.',
      details:['Kontrolle von Vorder- und Hinterradbremse','Überprüfung von Reifen (Profil, Alter, Reifendruck)','Prüfung von Rahmen, Lenkkopflager und Gabeln','Sichtprüfung Licht, Blinker, Hupe und Instrumente','Überprüfung des Kettensatzes oder Kardan','Saisonale Buchung für frühe Saisonvorbereitung empfohlen'],
      note:'Bitte Fahrzeugschein und ggf. Zubehördokumentation mitbringen.'
    },
    {
      ico:<Ic.Award s={26} c="var(--blue)"/>, title:'Oldtimer-Gutachten', sub:'§23 StVZO · H-Kennzeichen', tag:'Speziell',
      desc:'Offizielles Gutachten für das H-Kennzeichen Ihres Klassikers — fachkundig und rechtssicher.',
      duration:'ca. 60 Min.',
      details:['Prüfung auf weitgehend originalen Fahrzeugzustand','Bewertung von Karosserie, Innenraum und Technik','Vollständige Sicherheitsüberprüfung nach §29 StVZO','Prüfung der Fahrzeughistorie und Dokumentenlage','Erstellung des Gutachtens gemäß §23 StVZO','Weiterleitung an Zulassungsstelle für H-Kennzeichen'],
      note:'Mindestens 30 Jahre altes Fahrzeug erforderlich. Originale Dokumente mitbringen.'
    },
  ];

  return (
    <div id="leistungen" className="section-full sec" style={{background:'var(--stone)',position:'relative',overflow:'hidden'}}>
      {/* ИЗОБРАЖЕНИЕ first.png НА ФОНЕ */}
      <div style={{position:'absolute', inset:0, backgroundImage:"url('first.png')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.04, pointerEvents:'none', zIndex:0}} />
      
      <SectionDeco side="right"/>
      <div className="inner" style={{position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:40}}>
          <div className="tag" style={{marginBottom:10}}>Leistungen</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,42px)',color:'var(--ink)',letterSpacing:'-.02em'}}>Unsere Prüfleistungen</h2>
          <div className="accent"/>
          <p style={{color:'var(--smoke)',fontSize:14,maxWidth:480,lineHeight:1.7}}>Klicken Sie auf eine Leistung für Details zu Ablauf, Dauer und Prüfpunkten.</p>
        </motion.div>
        <div className="g3">
          {items.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}
              className="svc-card" style={{padding:26}} onClick={()=>setModal(s)}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                <div style={{width:50,height:50,background:'linear-gradient(135deg,var(--ice),#fff)',borderRadius:13,border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {s.ico}
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
                  <div className="tag" style={{fontSize:9,padding:'3px 8px'}}>{s.tag}</div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--smoke)',fontWeight:500}}>
                    <Ic.Clock s={12}/>{s.duration}
                  </div>
                </div>
              </div>
              <div style={{fontSize:9,color:'var(--smoke)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:4,fontWeight:700}}>{s.sub}</div>
              <h3 style={{fontSize:16,marginBottom:8,fontWeight:700,color:'var(--ink)'}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:13,lineHeight:1.65,marginBottom:14}}>{s.desc}</p>
              <div style={{display:'flex',alignItems:'center',gap:4,color:'var(--blue)',fontSize:11,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase'}}>
                Details & Prüfpunkte <Ic.ChevR s={11} c="var(--blue)"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <div style={{position:'fixed',inset:0,zIndex:900,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setModal(null)}
              style={{position:'absolute',inset:0,background:'rgba(10,37,64,.72)',backdropFilter:'blur(6px)'}}/>
            <motion.div initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.97}}
              style={{position:'relative',background:'#fff',width:'100%',maxWidth:520,maxHeight:'88vh',borderRadius:18,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.18)',overflow:'hidden'}}>
              <div style={{padding:'20px 24px',background:'var(--stone)',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:9,color:'var(--smoke)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:3,fontWeight:700}}>{modal.sub}</div>
                  <h3 style={{fontWeight:800,fontSize:20,color:'var(--ink)'}}>{modal.title}</h3>
                </div>
                <button onClick={()=>setModal(null)} style={{background:'#fff',border:'1px solid var(--border)',width:34,height:34,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Ic.X s={15}/>
                </button>
              </div>
              <div style={{padding:24,overflowY:'auto'}}>
                <div className="g2" style={{marginBottom:20}}>
                  <div style={{background:'var(--ice)',padding:'12px 16px',borderRadius:10}}>
                    <div style={{fontSize:10,fontWeight:700,color:'var(--smoke)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Dauer</div>
                    <div style={{fontWeight:700,fontSize:14,color:'var(--navy)'}}>{modal.duration}</div>
                  </div>
                  <div style={{background:'var(--ice)',padding:'12px 16px',borderRadius:10}}>
                    <div style={{fontSize:10,fontWeight:700,color:'var(--smoke)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Kategorie</div>
                    <div style={{fontWeight:700,fontSize:14,color:'var(--navy)'}}>{modal.tag}</div>
                  </div>
                </div>
                <div style={{fontWeight:700,fontSize:12,color:'var(--ink)',marginBottom:12,textTransform:'uppercase',letterSpacing:'.06em'}}>Prüfpunkte</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
                  {modal.details.map((pt,j) => (
                    <li key={j} style={{display:'flex',alignItems:'flex-start',gap:9,fontSize:13,color:'var(--smoke)',lineHeight:1.5}}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:'rgba(26,86,219,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                        <Ic.Check s={10} c="var(--blue)"/>
                      </div>{pt}
                    </li>
                  ))}
                </ul>
                {modal.note && (
                  <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'12px 14px',display:'flex',gap:9,alignItems:'flex-start'}}>
                    <Ic.Info s={14} c="#92400e"/>
                    <p style={{fontSize:12,color:'#92400e',lineHeight:1.6}}>{modal.note}</p>
                  </div>
                )}
              </div>
              <div style={{padding:'16px 24px',borderTop:'1px solid var(--border)',background:'var(--stone)'}}>
                <a href="#termin" onClick={()=>setModal(null)} className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:13}}>
                  Jetzt Termin buchen
                </a>
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
    {n:'01',title:'Online buchen',desc:'Leistung, Datum und Zeit wählen — rund um die Uhr verfügbar.'},
    {n:'02',title:'Bestätigung',desc:'Sie erhalten eine Bestätigungsmail mit allen Termindaten.'},
    {n:'03',title:'Fahrzeug bringen',desc:'Unser Team empfängt Ihr Fahrzeug und führt die Prüfung durch.'},
    {n:'04',title:'Plakette erhalten',desc:'Plakette und Prüfdokumente direkt vor Ort.'},
  ];
  return (
    <div id="ablauf" className="section-full sec" style={{background:'#fff',position:'relative',overflow:'hidden'}}>
      {/* ИЗОБРАЖЕНИЕ first.png НА ФОНЕ */}
      <div style={{position:'absolute', inset:0, backgroundImage:"url('first.png')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.02, pointerEvents:'none', zIndex:0}} />
      
      <SectionDeco side="left"/>
      <div className="inner" style={{position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:48}}>
          <div className="tag" style={{marginBottom:10}}>Ablauf</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,42px)',color:'var(--ink)',letterSpacing:'-.02em'}}>In 4 Schritten zur Plakette</h2>
          <div className="accent accent-c"/>
        </motion.div>
        
        <div className="steps-row">
          {steps.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
              style={{textAlign:'center',padding:'0 16px',position:'relative',zIndex:1}}>
              
              <div style={{width:48,height:48,borderRadius:'50%',background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 4px 16px rgba(26,86,219,.24)', color:'#fff', fontWeight:800, fontSize:18, position:'relative', zIndex:2}}>
                {i + 1}
              </div>
              
              <div style={{fontSize:11,color:'var(--blue)',letterSpacing:'.18em',marginBottom:6,fontWeight:700}}>{s.n}</div>
              <h3 style={{fontSize:16,marginBottom:8,fontWeight:700,color:'var(--ink)'}}>{s.title}</h3>
              <p style={{color:'var(--smoke)',fontSize:13,lineHeight:1.68}}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── BOOKING FORM ───────────────────────────────────────────────────────── */
const BookingSection = () => {
  const [form,setForm] = useState({leistung:'',fahrzeug:'PKW',datum:'',zeit:'',kennzeichen:'',name:'',telefon:'',email:'',anmerkungen:''});
  const [sent,setSent] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div id="termin" className="section-full sec" style={{background:'var(--stone)', position:'relative', overflow:'hidden'}}>
      {/* ИЗОБРАЖЕНИЕ first.png НА ФОНЕ */}
      <div style={{position:'absolute', inset:0, backgroundImage:"url('first.png')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.04, pointerEvents:'none', zIndex:0}} />

      <div className="inner" style={{maxWidth:820, position:'relative', zIndex:1}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:40}}>
          <div className="tag" style={{marginBottom:10}}>Online Buchung</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(24px,3.2vw,38px)',color:'var(--ink)',letterSpacing:'-.02em',marginBottom:10}}>
            Termin sichern — einfach online.
          </h2>
          <p style={{color:'var(--smoke)',fontSize:14,maxWidth:480,margin:'0 auto'}}>
            Wir bestätigen Ihren Wunschtermin zeitnah per E-Mail oder Telefon.
          </p>
        </motion.div>

        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <div style={{background:'#fff',borderRadius:18,border:'1px solid var(--border)',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.04)'}}>
            <div style={{background:'var(--navy)',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,color:'#fff',marginBottom:2}}>Termin vereinbaren</div>
                <div style={{fontSize:11.5,color:'rgba(255,255,255,.45)'}}>Pflichtfelder sind mit * markiert</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <a href={PHONE_HREF} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,.7)',textDecoration:'none',fontWeight:600}}>
                  <Ic.Phone s={13}/>{PHONE}
                </a>
              </div>
            </div>
            {!sent ? (
              <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{padding:22,display:'flex',flexDirection:'column',gap:12}}>
                <div className="g2">
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
                      <option>PKW</option><option>Motorrad</option><option>Transporter</option><option>Oldtimer</option>
                    </select>
                  </div>
                </div>
                <div className="g2">
                  <div className="field">
                    <label>Wunschdatum *</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={form.datum} onChange={e=>set('datum',e.target.value)} required/>
                  </div>
                  <div className="field">
                    <label>Uhrzeit *</label>
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
                <div className="g2">
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
                  <textarea placeholder="Besonderheiten или Fragen …" value={form.anmerkungen} onChange={e=>set('anmerkungen',e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-primary" style={{justifyContent:'center',padding:'13px',fontSize:13,marginTop:4}}>
                  Termin verbindlich anfragen <Ic.Arrow s={15}/>
                </button>
                <p style={{fontSize:11,color:'var(--smoke)',textAlign:'center',lineHeight:1.55}}>
                  Mit dem Absenden stimmen Sie unserer <a href="#" onClick={e=>{e.preventDefault();}} style={{color:'var(--blue)'}}>Datenschutzerklärung</a> zu. Die erhobenen Daten werden ausschließlich zur Terminbearbeitung verwendet und nicht an Dritte weitergegeben (Art. 6 Abs. 1 lit. b DSGVO).
                </p>
              </form>
            ) : (
              <div style={{padding:'44px 24px',textAlign:'center'}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:'var(--ice)',border:'1.5px solid var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                  <Ic.Check s={22} c="var(--blue)"/>
                </div>
                <h3 style={{fontWeight:800,fontSize:20,marginBottom:8,color:'var(--ink)'}}>Anfrage erhalten!</h3>
                <p style={{color:'var(--smoke)',fontSize:13,lineHeight:1.7,marginBottom:20}}>
                  Wir melden uns zeitnah zur Bestätigung.<br/>
                  <strong style={{color:'var(--ink)'}}>{form.datum} · {form.zeit}</strong>
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
    ['Wie lange dauert eine Hauptuntersuchung?','Eine Standard-HU dauert ca. 30 Minuten, mit AU-Kombi ca. 45–60 Minuten. Bitte planen Sie mindestens 30 Minuten Abstand zwischen Terminen ein.'],
    ['Was muss ich zur HU mitbringen?','Den Fahrzeugschein (Zulassungsbescheinigung Teil I). Bei Eintragungen bitte alle ABE-Dokumente oder Gutachten mitbringen.'],
    ['Was passiert, wenn mein Fahrzeug nicht besteht?','Sie erhalten ein detailliertes Mängelprotokoll. Geringe Mängel können innerhalb eines Monats behoben und kostenlos nachgeprüft werden.'],
    ['Kann ich einen Termin kostenlos stornieren?','Ja — bis 24 Stunden vor dem Termin ist eine kostenlose Stornierung per Telefon oder E-Mail möglich.'],
    ['Welche Fahrzeuge prüfen Sie?','PKW, Motorräder, Transporter sowie Oldtimer (§23 StVZO). Bei Unsicherheiten kontaktieren Sie uns bitte vorab.'],
    ['Gibt es einen Wartebereich?','Ja — unser Wartebereich steht Ihnen zur Verfügung. Fahrzeug abgeben und später abholen ist ebenfalls möglich.'],
    ['Kann ich einen Termin per WhatsApp buchen?','Ja — schreiben Sie uns einfach über WhatsApp. Wir antworten schnellstmöglich und bestätigen Ihren Termin.'],
  ];
  return (
    <div id="faq" className="section-full sec" style={{background:'#fff',position:'relative',overflow:'hidden'}}>
      {/* ИЗОБРАЖЕНИЕ first.png НА ФОНЕ */}
      <div style={{position:'absolute', inset:0, backgroundImage:"url('first.png')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.02, pointerEvents:'none', zIndex:0}} />

      <SectionDeco side="right" opacity={0.025}/>
      <div className="inner" style={{maxWidth:780,margin:'0 auto',position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:40}}>
          <div className="tag" style={{marginBottom:10}}>FAQ</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,42px)',color:'var(--ink)',letterSpacing:'-.02em'}}>Häufige Fragen</h2>
          <div className="accent accent-c"/>
        </motion.div>
        <div style={{background:'#fff',borderRadius:16,border:'1px solid var(--border)',padding:'2px 28px'}}>
          {faqs.map(([q,a],i) => (
            <div key={i} className="faq-item" style={{borderBottom:i===faqs.length-1?'none':'1px solid var(--border)'}}>
              <button className={`faq-q${open===i?' open':''}`} onClick={()=>setOpen(open===i?null:i)}>
                <span>{q}</span>
                <span className="faq-icon"><Ic.Plus s={11} c={open===i?'#fff':'var(--blue)'}/></span>
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.2}} style={{overflow:'hidden'}}>
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

/* ─── MAP ────────────────────────────────────────────────────────────────── */
const MapEmbed = () => {
  const [accepted, setAccepted] = useState(false);
  useEffect(() => { if (localStorage.getItem('cookie_consent')==='all') setAccepted(true); },[]);
  if (!accepted) return (
    <div style={{width:'100%',height:'100%',minHeight:360,background:'var(--stone)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}>
      <div style={{width:44,height:44,background:'var(--ice)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Pin s={20} c="var(--blue)"/></div>
      <div style={{textAlign:'center',maxWidth:340, padding:'0 16px'}}>
        <div style={{fontWeight:700,fontSize:14,color:'var(--ink)',marginBottom:6}}>Google Maps ist deaktiviert</div>
        <p style={{fontSize:12.5,color:'var(--smoke)',lineHeight:1.65}}>Um die Karte anzuzeigen, stimmen Sie Google Maps zu.</p>
      </div>
      <button className="btn btn-primary" style={{fontSize:12,padding:'10px 18px'}} onClick={()=>{localStorage.setItem('cookie_consent','all');setAccepted(true);}}>
        Google Maps aktivieren
      </button>
    </div>
  );
  return <iframe src="https://maps.google.com/maps?q=Oberhausen&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:'none',display:'block',filter:'grayscale(.1)',minHeight:360}} allowFullScreen loading="lazy" title="Standort"/>;
};

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
const Contact = () => (
  <div id="standort" className="section-full sec" style={{background:'var(--stone)', position:'relative', overflow:'hidden'}}>
    {/* ИЗОБРАЖЕНИЕ first.png НА ФОНЕ */}
    <div style={{position:'absolute', inset:0, backgroundImage:"url('first.png')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.04, pointerEvents:'none', zIndex:0}} />

    <div className="inner" style={{position:'relative', zIndex:1}}>
      <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:40, textAlign:'center'}}>
        <div className="tag" style={{marginBottom:10}}>Standort & Kontakt</div>
        <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,42px)',color:'var(--ink)',letterSpacing:'-.02em'}}>So finden Sie uns</h2>
        <div className="accent accent-c"/>
      </motion.div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40}} className="mob-stack">
        
        {/* Linke Seite: Karte */}
        <div style={{borderRadius:20,overflow:'hidden',border:'1px solid var(--border)',boxShadow:'0 12px 40px rgba(0,0,0,.06)', height:'100%', minHeight:400}}>
          <MapEmbed />
        </div>

        {/* Rechte Seite: Info Cards */}
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          
          <div style={{background:'#fff',padding:28,borderRadius:20,border:'1px solid var(--border)',boxShadow:'0 4px 16px rgba(0,0,0,.03)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <div style={{width:36,height:36,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Pin s={16} c="var(--blue)"/></div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--smoke)'}}>Adresse</span>
            </div>
            <div style={{fontSize:14,fontWeight:500,lineHeight:1.75,color:'var(--ink)'}}>
              Musterstraße 123<br/>46045 Oberhausen, Deutschland
            </div>
          </div>

          <div style={{background:'#fff',padding:28,borderRadius:20,border:'1px solid var(--border)',boxShadow:'0 4px 16px rgba(0,0,0,.03)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <div style={{width:36,height:36,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Phone s={16} c="var(--blue)"/></div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--smoke)'}}>Kontakt</span>
            </div>
            <div style={{fontSize:14,fontWeight:500,lineHeight:1.8,color:'var(--ink)',marginBottom:16}}>
              Telefon: {PHONE}<br/>E-Mail: info@autoservice-ob.de
            </div>
            <div style={{display:'flex',gap:10, flexWrap:'wrap'}}>
              <a href={PHONE_HREF} className="btn btn-call" style={{padding:'10px 18px',fontSize:12,gap:6}}><Ic.Phone s={14}/> Anrufen</a>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{padding:'10px 18px',fontSize:12,gap:6}}><Ic.Wa s={14} c="#fff"/> WhatsApp</a>
            </div>
          </div>

          <div style={{background:'#fff',padding:28,borderRadius:20,border:'1px solid var(--border)',boxShadow:'0 4px 16px rgba(0,0,0,.03)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <div style={{width:36,height:36,background:'var(--ice)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Clock s={16} c="var(--blue)"/></div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--smoke)'}}>Öffnungszeiten</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[['Mo – Mi','09:00 – 18:00 Uhr'],['Do & Fr','15:00 – 18:00 Uhr'],['Sa & So','Geschlossen']].map(([d,t]) => (
                <div key={d} style={{display:'flex',justifyContent:'space-between',fontSize:13.5,borderBottom:'1px solid var(--stone)',paddingBottom:6}}>
                  <span style={{color:'var(--smoke)'}}>{d}</span>
                  <span style={{fontWeight:600,color:'var(--ink)'}}>{t}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
const Footer = ({ openModal }) => (
  <footer style={{background:'var(--ink)',color:'#fff'}}>
    <div className="inner" style={{padding:'44px 64px 0'}}>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:40,paddingBottom:36,borderBottom:'1px solid rgba(255,255,255,.07)'}} className="mob-stack">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
            <div style={{width:30,height:30,background:'var(--blue)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Wrench s={14} c="#fff"/></div>
            <span style={{fontWeight:800,fontSize:16,color:'#fff'}}>Auto<span style={{color:'var(--sky)'}}>Service</span> <span style={{fontWeight:400,fontSize:12,color:'rgba(255,255,255,.35)'}}>Oberhausen</span></span>
          </div>
          <p style={{color:'rgba(255,255,255,.36)',fontSize:12.5,lineHeight:1.75,maxWidth:260,marginBottom:0}}>
            Amtlich anerkannte Kfz-Prüfstelle in Oberhausen. HU und AU — professionell und transparent.
          </p>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',marginBottom:14}}>Unternehmen</div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
            {['Über uns','Team','Karriere','Kontakt'].map(item => (
              <li key={item}><button style={{background:'none',border:'none',color:'rgba(255,255,255,.46)',fontSize:12.5,cursor:'pointer',padding:0,fontFamily:'var(--sans)',transition:'color .16s'}} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,.46)'}>{item}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',marginBottom:14}}>Rechtliches</div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
            {['Impressum','Datenschutz','AGB','Cookie-Einstellungen'].map(item => (
              <li key={item}><button onClick={()=>['Impressum','Datenschutz','AGB','Cookie-Einstellungen'].includes(item)&&openModal(item)} style={{background:'none',border:'none',color:'rgba(255,255,255,.46)',fontSize:12.5,cursor:'pointer',padding:0,fontFamily:'var(--sans)',transition:'color .16s'}} onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,.46)'}>{item}</button></li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,padding:'16px 0'}}>
        <span style={{color:'rgba(255,255,255,.18)',fontSize:11.5}}>© {new Date().getFullYear()} AutoService Oberhausen — Alle Rechte vorbehalten.</span>
        <span style={{color:'rgba(255,255,255,.18)',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase'}}>Amtlich anerkannte Prüfstelle · §29 StVZO</span>
      </div>
    </div>
  </footer>
);

/* ─── LEGAL MODALS ────────────────────────────────────────────────────────*/
const LegalContent = {
  Impressum: (
    <div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>Angaben gemäß § 5 TMG</h4>
      <p style={{marginBottom:16}}>
        AutoService Oberhausen<br/>
        Musterstraße 123<br/>
        46045 Oberhausen<br/><br/>
        Telefon: {PHONE}<br/>
        E-Mail: info@autoservice-ob.de
      </p>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:6}}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h4>
      <p style={{marginBottom:16}}>[Vollständiger Name des Verantwortlichen]<br/>Musterstraße 123, 46045 Oberhausen</p>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:6}}>Umsatzsteuer-Identifikationsnummer</h4>
      <p style={{marginBottom:16}}>gemäß § 27a UStG: DE[Ihre USt-IdNr.]</p>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:6}}>Berufsbezeichnung und berufsrechtliche Regelungen</h4>
      <p style={{marginBottom:16}}>Amtlich anerkannte Kraftfahrzeug-Überwachungsorganisation gemäß §29 StVZO i.V.m. Anlage VIIIb.</p>
    </div>
  ),
  Datenschutz: (
    <div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>Datenschutzerklärung</h4>
      <p style={{marginBottom:12}}>Wir verarbeiten personenbezogene Daten исключительно gemäß der Datenschutz-Grundverordnung (DSGVO), dem Bundesdatenschutzgesetz (BDSG) und dem Telekommunikations-Telemedien-Datenschutzgesetz (TTDSG).</p>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:6}}>Verantwortlicher (Art. 4 Nr. 7 DSGVO)</h4>
      <p style={{marginBottom:12}}>AutoService Oberhausen<br/>Musterstraße 123, 46045 Oberhausen<br/>E-Mail: info@autoservice-ob.de</p>
    </div>
  ),
  AGB: (
    <div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}>
      <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>Allgemeine Geschäftsbedingungen</h4>
      <p style={{marginBottom:12}}><strong style={{color:'var(--ink)'}}>§ 1 Geltungsbereich</strong><br/>Diese AGB gelten für alle Terminbuchungen über die Website autoservice-ob.de. Abweichende Bedingungen des Kunden gelten nur bei ausdrücklicher schriftlicher Zustimmung.</p>
    </div>
  ),
  'Cookie-Einstellungen': null,
};

const Modal = ({ title, onClose, onCookieReset }) => {
  const isCookie = title === 'Cookie-Einstellungen';
  return (
    <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        style={{position:'absolute',inset:0,background:'rgba(10,37,64,.72)',backdropFilter:'blur(6px)'}}/>
      <motion.div initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.97}}
        style={{position:'relative',background:'#fff',width:'100%',maxWidth:540,maxHeight:'86vh',borderRadius:16,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.2)',overflow:'hidden'}}>
        <div style={{padding:'18px 24px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{fontWeight:700,fontSize:18,color:'var(--ink)'}}>{title}</h3>
          <button onClick={onClose} style={{background:'var(--stone)',border:'none',width:32,height:32,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.X s={15}/></button>
        </div>
        <div style={{padding:24,overflowY:'auto'}}>
          {isCookie ? (
            <div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}>
              <h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>Cookie-Einstellungen</h4>
              <p style={{marginBottom:16}}>Sie können Ihre Einwilligung jederzeit widerrufen oder anpassen. Technisch notwendige Cookies können nicht deaktiviert werden.</p>
              <div style={{marginBottom:12,padding:'12px 14px',background:'var(--stone)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{fontWeight:700,fontSize:13,color:'var(--ink)',marginBottom:4}}>✓ Technisch notwendige Cookies — immer aktiv</div>
                <p style={{fontSize:12}}>Session-Verwaltung, Sicherheitsfunktionen. Grundlage: § 25 Abs. 2 TTDSG.</p>
              </div>
              <div style={{marginBottom:20,padding:'12px 14px',background:'var(--stone)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{fontWeight:700,fontSize:13,color:'var(--ink)',marginBottom:4}}>○ Analyse-Cookies — nur mit Einwilligung</div>
                <p style={{fontSize:12}}>Anonymisierte Nutzungsauswertung. Grundlage: § 25 Abs. 1 TTDSG, Art. 6 Abs. 1 lit. a DSGVO.</p>
              </div>
              <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
                <button className="btn btn-ghost" style={{fontSize:12,padding:'9px 16px'}} onClick={()=>{localStorage.setItem('cookie_consent','essential');onClose();}}>Nur notwendige</button>
                <button className="btn btn-primary" style={{fontSize:12,padding:'9px 16px'}} onClick={()=>{localStorage.setItem('cookie_consent','all');onClose();}}>Alle akzeptieren</button>
                <button style={{background:'none',border:'none',color:'var(--smoke)',fontSize:12,cursor:'pointer',textDecoration:'underline',fontFamily:'var(--sans)'}} onClick={()=>{localStorage.removeItem('cookie_consent');onClose();}}>Einwilligung zurückziehen</button>
              </div>
            </div>
          ) : LegalContent[title] || <p style={{fontSize:13,color:'var(--smoke)'}}>Inhalt folgt.</p>}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── COOKIE BANNER (§25 TTDSG + DSGVO) ────────────────────────────────── */
const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  useEffect(() => { if (!localStorage.getItem('cookie_consent')) setVisible(true); }, []);
  const accept = all => { localStorage.setItem('cookie_consent', all ? 'all' : 'essential'); setVisible(false); };
  if (!visible) return null;
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:600,background:'#fff',borderTop:'2px solid var(--blue)',boxShadow:'0 -8px 40px rgba(0,0,0,.1)'}}>
      <div className="inner" style={{padding:'16px 64px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:14}}>
          <div style={{flex:1,minWidth:260}}>
            <div style={{fontWeight:700,fontSize:14,color:'var(--ink)',marginBottom:4}}>🍪 Diese Website verwendet Cookies</div>
            <p style={{fontSize:12,color:'var(--smoke)',lineHeight:1.65,maxWidth:620}}>
              Technisch notwendige Cookies sind immer aktiv (§ 25 Abs. 2 TTDSG). Weitere Cookies (Analyse, Google Maps) setzen wir nur mit Ihrer Einwilligung (§ 25 Abs. 1 TTDSG, Art. 6 Abs. 1 lit. a DSGVO).{' '}
              <button onClick={()=>setDetails(d=>!d)} style={{background:'none',border:'none',color:'var(--blue)',cursor:'pointer',fontSize:12,padding:0,fontFamily:'var(--sans)',textDecoration:'underline'}}>{details?'Weniger':'Mehr Infos'}</button>
            </p>
            {details && (
              <div style={{marginTop:10,padding:12,background:'var(--stone)',borderRadius:8,fontSize:11.5,color:'var(--smoke)',lineHeight:1.7,border:'1px solid var(--border)'}}>
                <strong style={{color:'var(--ink)'}}>Notwendig:</strong> Session, Sicherheit — immer aktiv, keine Einwilligung nötig.<br/>
                <strong style={{color:'var(--ink)'}}>Analyse:</strong> Anonyme Nutzungsauswertung — nur mit Einwilligung.<br/>
                <strong style={{color:'var(--ink)'}}>Google Maps:</strong> Externe Karte — Datenübertragung an Google LLC (USA) nur nach Zustimmung (Art. 49 Abs. 1 lit. a DSGVO).<br/>
                Einwilligung jederzeit widerrufbar über die Cookie-Einstellungen im Footer.
              </div>
            )}
          </div>
          <div style={{display:'flex',gap:9,alignItems:'center',flexShrink:0,flexWrap:'wrap'}}>
            <button className="btn btn-ghost" style={{padding:'9px 16px',fontSize:12}} onClick={()=>accept(false)}>Nur notwendige</button>
            <button className="btn btn-primary" style={{padding:'9px 16px',fontSize:12}} onClick={()=>accept(true)}>Alle akzeptieren</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SCROLL TOP ─────────────────────────────────────────────────────────── */
const ScrollTop = () => {
  const [vis,setVis] = useState(false);
  useEffect(()=>{const fn=()=>setVis(window.scrollY>500);window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn);},[]);
  return <AnimatePresence>{vis&&<motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{position:'fixed',bottom:76,right:20,zIndex:80,width:40,height:40,borderRadius:'50%',background:'var(--blue)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 18px rgba(26,86,219,.32)',color:'#fff',fontSize:15,fontWeight:700}}>↑</motion.button>}</AnimatePresence>;
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
      <Steps/>
      <BookingSection/>
      <FAQ/>
      <Contact/>
      <Footer openModal={setModal}/>
      <ScrollTop/>
      <AnimatePresence>
        {modal && <Modal title={modal} onClose={()=>setModal(null)}/>}
      </AnimatePresence>
      <CookieBanner/>
    </>
  );
}