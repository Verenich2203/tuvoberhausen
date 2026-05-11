import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');

    *, *::before, *::after { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }

    :root {
      --primary: #0056A4; /* Синий цвет, ассоциирующийся с TÜV/Dekra */
      --primary-light: #337bc4;
      --black: #14161A;
      --dark: #1B1E24;
      --text: #C2C9D6;
      --white: #F0F2F5;
      --accent: #FFCC00; /* Желтый акцент для кнопок */
    }

    html, body {
      max-width: 100vw;
      overflow-x: hidden;
      width: 100%;
      background: var(--black);
      color: var(--text);
      font-family: 'Montserrat', sans-serif;
      scroll-behavior: smooth;
    }

    .container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 32px;
    }

    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--primary); color: var(--white); padding: 16px 36px;
      font-weight: 800; text-transform: uppercase; text-decoration: none;
      border-radius: 6px; transition: all 0.3s ease;
    }
    .btn-primary:hover { background: var(--primary-light); transform: translateY(-2px); }
  `}</style>
);

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <section style={{ padding: '120px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)', color: 'var(--white)', textTransform: 'uppercase', lineHeight: 1 }}>
            Vorbereitung <br/>für den <span style={{ color: 'var(--primary)' }}>TÜV</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 18, maxWidth: 600, lineHeight: 1.6 }}>
            Bestehen Sie die Hauptuntersuchung (HU/AU) im ersten Anlauf. Wir prüfen Ihr Fahrzeug vorab und beheben alle Mängel.
          </p>
          <a href="#kontakt" className="btn-primary" style={{ marginTop: 40 }}>
            Termin anfragen
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ─── APP COMPONENT ────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Hero />
      {/* Сюда будем добавлять About, Services, HowItWorks и т.д. */}
    </>
  );
}