import { motion } from "framer-motion";
import { useState } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }

    :root {
      --tuev-blue: #005B9F;       /* Фирменный синий */
      --tuev-dark: #003B6A;       /* Темно-синий для ховеров */
      --tuev-light: #E6F0F9;      /* Светло-голубой для фонов */
      --white: #FFFFFF;
      --bg-gray: #F4F7F9;         /* Светло-серый фон разделов */
      --text-main: #2C3E50;       /* Основной текст (не чисто черный) */
      --text-muted: #5C6D7E;      /* Второстепенный текст */
      --border: #D1D9E0;
      --error: #E74C3C;
    }

    body {
      background: var(--white);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
      scroll-behavior: smooth;
    }

    .container {
      width: 100%;
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 24px;
    }

    h1, h2, h3, h4 { color: var(--tuev-blue); font-weight: 700; }

    /* Кнопки */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--tuev-blue); color: var(--white); padding: 14px 28px;
      font-size: 16px; font-weight: 600; border-radius: 4px; border: none;
      cursor: pointer; transition: all 0.2s ease; text-decoration: none;
    }
    .btn-primary:hover { background: var(--tuev-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,91,159,0.2); }
    
    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: transparent; color: var(--tuev-blue); padding: 12px 26px;
      font-size: 16px; font-weight: 600; border-radius: 4px; border: 2px solid var(--tuev-blue);
      cursor: pointer; transition: all 0.2s ease; text-decoration: none;
    }
    .btn-outline:hover { background: var(--tuev-light); }

    /* Инпуты */
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--text-main); font-size: 14px; }
    .form-control {
      width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: 4px;
      font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-main);
      transition: border-color 0.2s; background: var(--white);
    }
    .form-control:focus { outline: none; border-color: var(--tuev-blue); box-shadow: 0 0 0 3px rgba(0,91,159,0.1); }
    
    /* Карточки */
    .card {
      background: var(--white); border-radius: 8px; padding: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid var(--border);
    }
  `}</style>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = {
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  MapPin: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Phone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Shield: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--tuev-blue)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Car: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--tuev-blue)" strokeWidth="1.5"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m14 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM8 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = () => (
  <header style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--tuev-blue)', letterSpacing: '-0.5px' }}>
        AUTO<span style={{ color: 'var(--text-main)' }}>PRÜFSTELLE</span>
      </div>
      <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a href="#leistungen" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Leistungen</a>
        <a href="#termin" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Termin buchen</a>
        <a href="#kontakt" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Standort</a>
        <a href="#termin" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Online buchen</a>
      </nav>
    </div>
  </header>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ background: 'var(--bg-gray)', padding: '80px 0 100px', borderBottom: '1px solid var(--border)' }}>
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <h1 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
          Hauptuntersuchung (HU/AU) <br/>ohne Stress.
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '480px' }}>
          Buchen Sie Ihren Termin online. Schnelle Abwicklung, transparente Preise und kompetenter Service direkt in Oberhausen.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#termin" className="btn-primary">Jetzt Termin wählen</a>
          <a href="#leistungen" className="btn-outline">Unsere Leistungen</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <span style={{ color: 'var(--tuev-blue)' }}><I.Check /></span> Anerkannter Prüfstützpunkt
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div style={{ background: 'var(--tuev-light)', borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Здесь можно разместить картинку, пока заглушка */}
          <I.Shield />
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const Services = () => (
  <section id="leistungen" style={{ padding: '100px 0' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Unsere Dienstleistungen</h2>
        <p style={{ color: 'var(--text-muted)' }}>Alles rund um die Sicherheit Ihres Fahrzeugs aus einer Hand.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {[
          { title: "HU / AU", desc: "Die gesetzlich vorgeschriebene Haupt- und Abgasuntersuchung für Ihr Fahrzeug.", icon: <I.Shield /> },
          { title: "Vorabcheck", desc: "Wir prüfen Ihr Auto auf TÜV-Relevanz, bevor Mängel teuer werden.", icon: <I.Car /> },
          { title: "Eintragungen", desc: "Änderungsabnahmen (z.B. Felgen, Fahrwerk) nach §19(3) StVZO.", icon: <I.Check /> }
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{s.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── BOOKING WIDGET ───────────────────────────────────────────────────────────
const BookingForm = () => {
  const [formData, setFormData] = useState({
    fahrzeug: 'PKW', leistung: 'HU_AU', datum: '', zeit: '', kennzeichen: '', name: '', email: '', telefon: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Terminanfrage gesendet für: ${formData.datum} um ${formData.zeit} Uhr.\nKennzeichen: ${formData.kennzeichen}`);
    // Здесь в будущем будет логика отправки на сервер или email
  };

  return (
    <section id="termin" style={{ background: 'var(--bg-gray)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Online Termin vereinbaren</h2>
              <p style={{ color: 'var(--text-muted)' }}>Füllen Sie das Formular aus, um Ihren Wunschtermin anzufragen.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Блок 1: Автомобиль и услуга */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Fahrzeugart *</label>
                  <select name="fahrzeug" value={formData.fahrzeug} onChange={handleChange} className="form-control" required>
                    <option value="PKW">PKW</option>
                    <option value="Motorrad">Motorrad</option>
                    <option value="LKW">LKW bis 3,5t</option>
                    <option value="Wohnmobil">Wohnmobil</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Dienstleistung *</label>
                  <select name="leistung" value={formData.leistung} onChange={handleChange} className="form-control" required>
                    <option value="HU_AU">Hauptuntersuchung (HU/AU)</option>
                    <option value="Vorabcheck">Vorabcheck (TÜV Vorbereitung)</option>
                    <option value="Eintragung">Änderungsabnahme / Eintragung</option>
                  </select>
                </div>
              </div>

              {/* Блок 2: Дата и Время */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Wunschdatum *</label>
                  <input type="date" name="datum" value={formData.datum} onChange={handleChange} className="form-control" required min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="form-group">
                  <label className="form-label">Uhrzeit *</label>
                  <select name="zeit" value={formData.zeit} onChange={handleChange} className="form-control" required>
                    <option value="">Bitte wählen...</option>
                    <option value="08:00">08:00 - 09:00</option>
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="11:00">11:00 - 12:00</option>
                    <option value="13:00">13:00 - 14:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:00">15:00 - 16:00</option>
                    <option value="16:00">16:00 - 17:00</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', margin: '32px 0' }}></div>

              {/* Блок 3: Контакты */}
              <div className="form-group">
                <label className="form-label">Kfz-Kennzeichen (z.B. OB-AB 123) *</label>
                <input type="text" name="kennzeichen" value={formData.kennzeichen} onChange={handleChange} className="form-control" placeholder="OB-..." required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Vor- & Nachname *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefonnummer</label>
                  <input type="tel" name="telefon" value={formData.telefon} onChange={handleChange} className="form-control" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">E-Mail Adresse *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
              </div>

              <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
                  <I.Calendar /> Termin verbindlich anfragen
                </button>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>
                  Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. Wir nutzen Ihre Daten nur zur Terminbestätigung.
                </p>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MAP & FOOTER ─────────────────────────────────────────────────────────────
const MapAndFooter = () => (
  <footer id="kontakt" style={{ borderTop: '1px solid var(--border)' }}>
    {/* Карты Google с твоими координатами */}
    <div style={{ width: '100%', height: '450px', background: '#eee' }}>
      <iframe 
        title="Google Maps Standort"
        src="https://maps.google.com/maps?q=51.472992,6.863788&hl=de&z=15&output=embed" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

    <div style={{ background: 'var(--text-main)', color: 'var(--white)', padding: '60px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--white)', marginBottom: '16px' }}>
            AUTO<span style={{ color: 'var(--tuev-blue)' }}>PRÜFSTELLE</span>
          </div>
          <p style={{ color: '#A0AAB5', fontSize: '14px', lineHeight: 1.8 }}>
            Ihr zuverlässiger Partner für Haupt- und Abgasuntersuchungen in Oberhausen.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: 'var(--white)', marginBottom: '16px' }}>Kontakt</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#A0AAB5', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><I.MapPin /> Musterstraße 123, 46045 Oberhausen</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><I.Phone /> +49 123 456789</span>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--white)', marginBottom: '16px' }}>Öffnungszeiten</h4>
          <div style={{ color: '#A0AAB5', fontSize: '14px', lineHeight: 1.8 }}>
            Mo - Fr: 08:00 - 17:00 Uhr<br />
            Sa: 09:00 - 13:00 Uhr<br />
            So: Geschlossen
          </div>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', color: '#A0AAB5', fontSize: '13px' }}>
        © {new Date().getFullYear()} Autoprüfstelle Oberhausen. Alle Rechte vorbehalten. | Impressum | Datenschutz
      </div>
    </div>
  </footer>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Services />
      <BookingForm />
      <MapAndFooter />
    </>
  );
}