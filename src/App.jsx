import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap');

    *, *::before, *::after { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }

    :root {
      --tuev-blue: #00508F;       
      --tuev-dark: #002B4D;       
      --tuev-light: #EBF4FC;      
      --white: #FFFFFF;
      --bg-gray: transparent; /* Сделали прозрачным, чтобы было видно задний фон */
      --text-main: #1A2634;       
      --text-muted: #5C6D7E;      
      --border: #E2E8F0;
      --accent: #E63946;          
    }

    html, body {
      max-width: 100vw;
      overflow-x: hidden;
      width: 100%;
      background: #F7F9FC;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
      scroll-behavior: smooth;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    h1, h2, h3, h4 { 
      font-family: 'Montserrat', sans-serif; 
      color: var(--tuev-dark); 
      line-height: 1.2;
    }

    /* Кнопки */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: linear-gradient(135deg, var(--tuev-blue), var(--tuev-dark)); 
      color: var(--white); padding: 14px 28px;
      font-size: 14px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
      border-radius: 8px; border: none; cursor: pointer; text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 16px rgba(0, 80, 143, 0.2);
    }
    .btn-primary:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 12px 24px rgba(0, 80, 143, 0.3); 
    }
    
    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
      color: var(--white); padding: 14px 28px;
      font-size: 14px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
      border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer; text-decoration: none; transition: all 0.3s ease;
    }
    .btn-outline:hover { 
      background: var(--white); color: var(--tuev-dark); 
    }

    /* Инпуты */
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--tuev-dark); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .form-control {
      width: 100%; padding: 14px 16px; border: 2px solid var(--border); border-radius: 8px;
      font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-main);
      transition: all 0.3s ease; background: rgba(255, 255, 255, 0.9);
    }
    .form-control:focus { outline: none; border-color: var(--tuev-blue); background: var(--white); box-shadow: 0 0 0 4px rgba(0,80,143,0.1); }
    
    /* Модальное окно (Scrollbar) */
    .modal-content::-webkit-scrollbar { width: 6px; }
    .modal-content::-webkit-scrollbar-track { background: transparent; }
    .modal-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

    .section-label {
      display: flex; align-items: center; gap: 12px;
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--tuev-blue);
      margin-bottom: 16px;
    }
    .section-label::before { content: ''; width: 30px; height: 2px; background: var(--tuev-blue); }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = {
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Shield: () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--tuev-blue)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Car: () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--tuev-blue)" strokeWidth="1.5"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m14 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM8 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>,
  Clock: () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--tuev-blue)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = () => (
  <header style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
      <div style={{ fontFamily: 'Montserrat', fontSize: '24px', fontWeight: 900, color: 'var(--tuev-dark)', letterSpacing: '-0.5px' }}>
        TÜV<span style={{ color: 'var(--tuev-blue)' }}>STATION</span>
      </div>
      <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <a href="#leistungen" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '14px' }}>Leistungen</a>
        <a href="#ablauf" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '14px' }}>Ablauf</a>
        <a href="#kontakt" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '14px' }}>Standort</a>
        <a href="#termin" className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>Termin buchen</a>
      </nav>
    </div>
  </header>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ position: 'relative', minHeight: '75vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
    {/* Фон tuvv.png с затемнением */}
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--tuev-dark)', backgroundImage: 'url("tuvv.png")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,43,77,0.98) 0%, rgba(0,43,77,0.75) 50%, rgba(0,43,77,0.3) 100%)' }} />
    </div>

    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ maxWidth: '600px' }}>
        <div className="section-label" style={{ color: 'var(--white)' }}>Offizieller Prüfstützpunkt</div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--white)', marginBottom: '20px', letterSpacing: '-1px' }}>
          HU & AU ohne <br/><span style={{ color: '#66B2FF' }}>Wartezeiten.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', lineHeight: 1.7 }}>
          Ihre Sicherheit ist unser Antrieb. Buchen Sie Ihren Termin für die Hauptuntersuchung bequem online. Schnelle Abwicklung, transparente Preise und kompetente Prüfingenieure.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="#termin" className="btn-primary">Online Termin sichern</a>
          <a href="#ablauf" className="btn-outline">So funktioniert's</a>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── ABLAUF (HOW IT WORKS) ────────────────────────────────────────────────────
const Ablauf = () => {
  const steps = [
    { num: "01", title: "Termin buchen", desc: "Wählen Sie bequem online Ihr Wunschdatum und die passende Uhrzeit aus.", img: "https://images.unsplash.com/photo-1512758117926-5711a3d922db?q=80&w=1000&auto=format&fit=crop" },
    { num: "02", title: "Fahrzeug bringen", desc: "Kommen Sie pünktlich zu uns. Unser Meisterteam nimmt Ihr Fahrzeug in Empfang.", img: "https://images.unsplash.com/photo-1632823465306-cd3e51241162?q=80&w=1000&auto=format&fit=crop" },
    { num: "03", title: "Geprüft & Sicher", desc: "Nach erfolgreicher Prüfung erhalten Sie Ihre Plakette und Dokumente direkt.", img: "https://images.unsplash.com/photo-1503375894056-11f22146f906?q=80&w=1000&auto=format&fit=crop" }
  ];

  return (
    <section id="ablauf" style={{ padding: '90px 0', background: 'transparent' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Der Prozess</div>
          <h2 style={{ fontSize: '36px' }}>In 3 Schritten zur Plakette</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.8)', padding: '16px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
              <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
                <img src={step.img} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--white)', color: 'var(--tuev-dark)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: '16px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                  {step.num}
                </div>
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const Services = () => {
  const services = [
    { title: "Hauptuntersuchung", desc: "Gesetzlich vorgeschriebene Prüfung auf Verkehrssicherheit gem. § 29 StVZO.", icon: <I.Shield /> },
    { title: "Abgasuntersuchung", desc: "Umweltprüfung der Abgaswerte Ihres Fahrzeugs – direkt integriert.", icon: <I.Car /> },
    { title: "Vorab-Check", desc: "Wir prüfen Ihr Auto vorab, damit es beim ersten Mal sicher durch den TÜV kommt.", icon: <I.Check /> },
    { title: "Eintragungen", desc: "Abnahme von Tuning-Teilen, Felgen und Fahrwerken (Änderungsabnahme).", icon: <I.Clock /> }
  ];

  return (
    <section id="leistungen" style={{ padding: '90px 0', background: 'rgba(255,255,255,0.5)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="section-label">Kompetenz</div>
            <h2 style={{ fontSize: '36px' }}>Unsere Leistungen</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <a href="#termin" className="btn-primary">Jetzt Termin buchen</a>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {services.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} 
              style={{ background: 'var(--white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.03)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,80,143,0.06)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ marginBottom: '16px', background: 'var(--tuev-light)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── BOOKING WIDGET ───────────────────────────────────────────────────────────
const BookingForm = () => {
  const [formData, setFormData] = useState({
    fahrzeug: 'PKW', leistung: 'HU_AU', datum: '', zeit: '', kennzeichen: '', name: '', telefon: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Заявка отправлена!\n\nАвто: ${formData.kennzeichen}\nДата: ${formData.datum} / ${formData.zeit}\nИмя: ${formData.name}`);
  };

  return (
    <section id="termin" style={{ padding: '90px 0', background: 'transparent' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--white)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,43,77,0.06)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          
          <div style={{ background: 'var(--tuev-dark)', color: 'var(--white)', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--white)', fontSize: '28px', marginBottom: '8px' }}>Termin vereinbaren</h2>
            <p style={{ opacity: 0.8, fontSize: '15px' }}>Wählen Sie Ihren Wunschtermin. Wir bestätigen die Buchung in Kürze.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Dienstleistung</label>
                <select name="leistung" value={formData.leistung} onChange={handleChange} className="form-control" required>
                  <option value="HU_AU">Hauptuntersuchung (HU/AU)</option>
                  <option value="Vorabcheck">Vorabcheck</option>
                  <option value="Eintragung">Eintragung / Abnahme</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fahrzeugart</label>
                <select name="fahrzeug" value={formData.fahrzeug} onChange={handleChange} className="form-control" required>
                  <option value="PKW">PKW</option>
                  <option value="Motorrad">Motorrad</option>
                  <option value="LKW">Transporter / LKW</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Wunschdatum</label>
                <input type="date" name="datum" value={formData.datum} onChange={handleChange} className="form-control" required min={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="form-group">
                <label className="form-label">Bevorzugte Uhrzeit</label>
                <select name="zeit" value={formData.zeit} onChange={handleChange} className="form-control" required>
                  <option value="">Bitte wählen...</option>
                  <option value="Vormittag">Vormittag (08:00 - 12:00)</option>
                  <option value="Nachmittag">Nachmittag (12:00 - 17:00)</option>
                </select>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0 24px' }} />

            <div className="form-group">
              <label className="form-label">Kfz-Kennzeichen</label>
              <input type="text" name="kennzeichen" value={formData.kennzeichen} onChange={handleChange} className="form-control" placeholder="z.B. OB-AB 123" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Ihr Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Max Mustermann" required />
              </div>
              <div className="form-group">
                <label className="form-label">Telefonnummer</label>
                <input type="tel" name="telefon" value={formData.telefon} onChange={handleChange} className="form-control" placeholder="Für Rückfragen" required />
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                Jetzt verbindlich anfragen
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
};

// ─── LEGAL MODAL ──────────────────────────────────────────────────────────────
const LegalModal = ({ title, content, onClose }) => (
  <AnimatePresence>
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,43,77,0.8)', backdropFilter: 'blur(8px)' }} />
      <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ position: 'relative', background: 'var(--white)', width: '100%', maxWidth: '600px', maxHeight: '80vh', borderRadius: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '24px' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'var(--bg-gray)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--border)'} onMouseOut={e => e.currentTarget.style.background = 'var(--bg-gray)'}>
            <I.Close />
          </button>
        </div>
        <div className="modal-content" style={{ padding: '32px', overflowY: 'auto', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8 }}>
          {content}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ openModal }) => (
  <footer id="kontakt" style={{ background: 'var(--tuev-dark)', color: 'var(--white)' }}>
    <div style={{ width: '100%', height: '300px', filter: 'grayscale(0.5)' }}>
      <iframe src="https://maps.google.com/maps?q=51.472992,6.863788&hl=de&z=15&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" />
    </div>

    <div className="container" style={{ padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
      <div>
        <div style={{ fontFamily: 'Montserrat', fontSize: '22px', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '16px' }}>
          TÜV<span style={{ color: '#66B2FF' }}>STATION</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          Ihr zertifizierter Partner für Haupt- und Abgasuntersuchungen. Sicher, schnell und zuverlässig in Oberhausen.
        </p>
      </div>
      
      <div>
        <h4 style={{ color: 'var(--white)', marginBottom: '16px', fontSize: '16px' }}>Rechtliches</h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['Impressum', 'Datenschutz', 'AGB'].map((label, j) => (
            <li key={j}>
              <button onClick={() => openModal(label)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px', padding: 0, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--white)'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 style={{ color: 'var(--white)', marginBottom: '16px', fontSize: '16px' }}>Kontakt</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          <span>Musterstraße 123, 46045 Oberhausen</span>
          <span>+49 123 456789</span>
          <span>info@tuev-oberhausen.de</span>
        </div>
      </div>
    </div>
    
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
      © {new Date().getFullYear()} TÜV Station Oberhausen. Alle Rechte vorbehalten.
    </div>
  </footer>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeModal, setActiveModal] = useState(null);

  const getModalContent = (type) => {
    switch (type) {
      case 'Impressum': return (
        <div>
          <h4 style={{ color: 'var(--tuev-dark)', marginBottom: '8px', fontSize: '16px' }}>Angaben gemäß § 5 TMG</h4>
          <p style={{ marginBottom: '20px' }}>TÜV Station Oberhausen GmbH<br/>Musterstraße 123<br/>46045 Oberhausen</p>
          <h4 style={{ color: 'var(--tuev-dark)', marginBottom: '8px', fontSize: '16px' }}>Vertreten durch</h4>
          <p style={{ marginBottom: '20px' }}>Geschäftsführer: Max Mustermann</p>
          <h4 style={{ color: 'var(--tuev-dark)', marginBottom: '8px', fontSize: '16px' }}>Kontakt</h4>
          <p>Telefon: +49 123 456789<br/>E-Mail: info@tuev-oberhausen.de</p>
        </div>
      );
      case 'Datenschutz': return (
        <div>
          <h4 style={{ color: 'var(--tuev-dark)', marginBottom: '8px', fontSize: '16px' }}>1. Datenschutz auf einen Blick</h4>
          <p style={{ marginBottom: '20px' }}>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.</p>
          <h4 style={{ color: 'var(--tuev-dark)', marginBottom: '8px', fontSize: '16px' }}>2. Datenerfassung auf dieser Website</h4>
          <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. Formular).</p>
        </div>
      );
      default: return <p>Inhalt folgt...</p>;
    }
  };

  return (
    <>
      <GlobalStyles />
      
      {/* Глобальный ненавязчивый фон tuvv.png (watermark эффект) */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundImage: 'url("tuvv.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: 0.05, /* Очень низкая прозрачность, чтобы не било по глазам */
        pointerEvents: 'none'
      }} />

      <Navbar />
      <Hero />
      <Ablauf />
      <Services />
      <BookingForm />
      <Footer openModal={setActiveModal} />

      {activeModal && (
        <LegalModal title={activeModal} content={getModalContent(activeModal)} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}