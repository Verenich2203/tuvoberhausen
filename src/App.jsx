import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import AdminPanel from "./AdminPanel";

const PHONE = "+49 1575 5476991";
const PHONE_HREF = "tel:+4915755476991";
const WHATSAPP_HREF = "https://wa.me/4915755476991";

/* ─── SUPABASE CONFIG ────────────────────────────────────────────────────── */
const SUPABASE_URL = "https://cglzccturchfveajhtqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0UWfCaMn2o-BQXTCfww3tg_2BNkOv9m";

async function fetchBookedSlots(date) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/bookings?select=time_slot&date=eq.${date}`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) throw new Error("Fehler beim Laden");
  const data = await res.json();
  return data.map(r => r.time_slot);
}

async function insertBooking(booking) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(booking),
  });
  if (!res.ok) {
    const err = await res.json();
    if (err?.code === "23505") throw new Error("SLOT_TAKEN");
    throw new Error("Buchung fehlgeschlagen");
  }
  return res.json();
}

/* ─── TIME SLOT HELPERS ──────────────────────────────────────────────────── */
function generateSlots(dateStr) {
  if (!dateStr) return [];
  const dow = new Date(dateStr).getDay();
  if (dow === 0 || dow === 6) return [];
  const startH = (dow === 4 || dow === 5) ? 15 : 9;
  const slots = [];
  let h = startH, m = 0;
  while (h < 18) {
    slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    m += 30;
    if (m >= 60) { h++; m -= 60; }
  }
  return slots;
}

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const dow = new Date(dateStr).getDay();
  return dow === 0 || dow === 6;
}

function isPast(dateStr, timeSlot) {
  const now = new Date();
  const [h, m] = timeSlot.split(":").map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d <= now;
}

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --accent:   #5B91F4;
      --accent-l: #7AABF8;
      --accent-d: #3A72E0;
      --black:  #14161A;
      --dark:   #1B1E24;
      --dark2:  #23272F;
      --dark3:  #2B303B;
      --mid:    #414A59;
      --text:   #C2C9D6;
      --white:  #F0F2F5;
      --smoke:  #8B949E;
      --border: rgba(255,255,255,.07);
      --sans:   'Montserrat', sans-serif;
    }
    html, body { width:100%; margin:0; padding:0; scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
    body { font-family:var(--sans); background:var(--black); color:var(--text); overflow-x:hidden; line-height:1.6; }
    #root { width:100%; min-width:100%; }
    .section-full { width:100%; display:block; }
    .inner { width:100%; max-width:1280px; margin:0 auto; padding:0 64px; box-sizing:border-box; }
    .sec { padding:80px 0; }
    .tag {
      display:inline-flex; align-items:center; gap:12px;
      font-size:11px; font-weight:700; letter-spacing:.22em; text-transform:uppercase;
      color:var(--accent);
    }
    .tag::before { content:''; display:inline-block; width:28px; height:2px; background:var(--accent); border-radius:1px; flex-shrink:0; }
    .tag-badge {
      display:inline-flex; align-items:center; gap:5px;
      font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
      color:var(--accent); background:rgba(91,145,244,.1);
      padding:4px 9px; border-radius:6px; border:1px solid rgba(91,145,244,.2);
    }
    .btn {
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      font-family:var(--sans); font-weight:700; font-size:13px; letter-spacing:.04em; text-transform:uppercase;
      padding:12px 24px; border-radius:10px; border:none; cursor:pointer;
      transition:all .2s ease; text-decoration:none; white-space:nowrap;
    }
    .btn-primary { background:var(--accent); color:#fff; box-shadow:0 4px 18px rgba(91,145,244,.28); }
    .btn-primary:hover { background:var(--accent-l); transform:translateY(-1px); box-shadow:0 8px 26px rgba(91,145,244,.38); }
    .btn-ghost { background:transparent; color:var(--text); border:1.5px solid rgba(255,255,255,.14); }
    .btn-ghost:hover { background:rgba(255,255,255,.05); border-color:var(--accent); color:var(--accent); }
    .btn-wa { background:#25D366; color:#fff; box-shadow:0 4px 18px rgba(37,211,102,.3); }
    .btn-wa:hover { background:#1ebe5d; transform:translateY(-1px); }
    .btn-call { background:var(--accent); color:#fff; box-shadow:0 4px 18px rgba(91,145,244,.28); }
    .btn-call:hover { background:var(--accent-l); transform:translateY(-1px); }
    .card { background:rgba(35,39,47,.7); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-radius:16px; border:1px solid var(--border); box-shadow:0 1px 8px rgba(0,0,0,.2); transition:transform .26s,box-shadow .26s; }
    .card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(0,0,0,.3); }
    .accent { width:32px; height:2px; background:var(--accent); border-radius:2px; margin:10px 0 18px; }
    .accent-c { margin:10px auto 18px; }
    .field { display:flex; flex-direction:column; gap:5px; }
    .field label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--smoke); }
    .field input, .field select, .field textarea {
      font-family:var(--sans); font-size:13px; color:var(--white);
      background:var(--dark3); border:1.5px solid rgba(255,255,255,.1); border-radius:8px;
      padding:10px 13px; transition:border-color .18s,box-shadow .18s; -webkit-appearance:none;
    }
    .field input:focus, .field select:focus, .field textarea:focus {
      outline:none; border-color:var(--accent); background:var(--dark3); box-shadow:0 0 0 3px rgba(91,145,244,.12);
    }
    .field input::placeholder, .field textarea::placeholder { color:var(--smoke); }
    .field select {
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%238B949E' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 12px center; padding-right:34px; cursor:pointer; background-color:var(--dark3);
    }
    .field select option { background:var(--dark2); color:var(--white); }
    .field textarea { resize:vertical; min-height:72px; }
    .nav-link {
      font-size:12px; font-weight:600; color:rgba(255,255,255,.5); letter-spacing:.08em; text-transform:uppercase;
      padding:5px 2px; position:relative; transition:color .18s; text-decoration:none;
    }
    .nav-link::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:2px; background:var(--accent); border-radius:1px; transform:scaleX(0); transition:transform .2s; }
    .nav-link:hover { color:var(--white); }
    .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
    .nav-link.active { color:var(--accent); font-weight:700; }
    .steps-row { display:grid; grid-template-columns:repeat(4,1fr); position:relative; gap:8px; }
    .steps-row::before { content:''; position:absolute; top:24px; left:12%; right:12%; height:2px; background:var(--accent); opacity:0.12; z-index:0; }
    .faq-item { border-bottom:1px solid rgba(255,255,255,.06); }
    .faq-q { width:100%; background:none; border:none; text-align:left; cursor:pointer; padding:18px 0; display:flex; justify-content:space-between; align-items:center; font-family:var(--sans); font-size:14px; font-weight:600; color:var(--white); gap:14px; }
    .faq-icon { width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,.05); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; border:1px solid rgba(255,255,255,.1); }
    .faq-q.open .faq-icon { background:var(--accent); border-color:var(--accent); transform:rotate(45deg); }
    .faq-a { font-size:13px; line-height:1.8; color:var(--smoke); padding-bottom:18px; }
    .svc-card { background:rgba(35,39,47,.7); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-radius:18px; border:1px solid rgba(255,255,255,.06); box-shadow:0 2px 12px rgba(0,0,0,.2); transition:transform .28s,box-shadow .28s,border-color .28s; cursor:pointer; }
    .svc-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.35); border-color:rgba(91,145,244,.22); }
    .g2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
    @keyframes scrollRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
    .marquee-wrap { overflow:hidden; white-space:nowrap; width:100%; position:relative; background:var(--dark); border-bottom:1px solid rgba(255,255,255,.05); border-top:1px solid rgba(255,255,255,.05); padding:14px 0; }
    .marquee-inner { display:flex; width:200%; animation:scrollRight 35s linear infinite; }
    .marquee-inner:hover { animation-play-state:paused; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .spin { animation:spin .7s linear infinite; display:inline-block; }
    .slot-btn {
      padding:9px 6px; border-radius:8px; cursor:pointer; transition:all .15s;
      font-family:var(--sans); font-weight:700; font-size:13px;
      border:1.5px solid rgba(255,255,255,.1); background:var(--dark3); color:var(--white); text-align:center;
    }
    .slot-btn:hover:not(:disabled) { border-color:var(--accent); color:var(--accent); background:rgba(91,145,244,.06); }
    .slot-btn.selected { background:var(--accent); color:#fff; border-color:var(--accent); box-shadow:0 4px 14px rgba(91,145,244,.3); }
    .slot-btn:disabled { background:rgba(255,255,255,.03); color:var(--mid); cursor:not-allowed; opacity:.5; text-decoration:line-through; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:8px; }
    @media (max-width:900px) {
      .inner { padding:0 24px; } .sec { padding:56px 0; }
      .g3 { grid-template-columns:1fr 1fr; } .g4 { grid-template-columns:1fr 1fr; }
      .steps-row { grid-template-columns:1fr 1fr; gap:36px; } .steps-row::before { display:none; }
      .hide-mob { display:none !important; } .mob-col { flex-direction:column !important; } .mob-full { width:100% !important; }
    }
    @media (max-width:600px) {
      .inner { padding:0 16px; } .g3 { grid-template-columns:1fr; }
      .g4 { grid-template-columns:1fr 1fr; } .g2 { grid-template-columns:1fr; }
      .mob-stack { grid-template-columns:1fr !important; }
      .svc-list { grid-template-columns:1fr !important; }
      .svc-wide { grid-column:span 1 !important; }
      .svc-row { flex-direction:column !important; align-items:flex-start !important; gap:0 !important; }
      .svc-row .svc-icon { margin-bottom:20px !important; }
    }
    @media (max-width:900px) {
      .svc-list { grid-template-columns:1fr !important; }
      .svc-wide { grid-column:span 1 !important; }
      .svc-row { flex-direction:column !important; align-items:flex-start !important; gap:0 !important; }
      .svc-row .svc-icon { margin-bottom:20px !important; }
      .steps-grid { grid-template-columns:1fr !important; gap:40px !important; }
    }
    .svc-list { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
    .svc-wide { grid-column:span 2; }
    .svc-row { display:flex; flex-direction:row; gap:28px; align-items:center; }
    .svc-col { display:flex; flex-direction:column; }
    .svc-icon { flex-shrink:0; margin-bottom:20px; }
    .svc-row .svc-icon { margin-bottom:0; }
    .contact-map-wrap { position:relative; height:560px; overflow:hidden; }
    .contact-map-wrap iframe { width:100%; height:100%; border:none; display:block; }
    .contact-map-gradient { position:absolute; inset:0; background:linear-gradient(90deg,rgba(20,22,26,.92) 0%,rgba(20,22,26,.6) 38%,transparent 62%); pointer-events:none; z-index:1; }
    .contact-card {
      position:absolute; z-index:2; top:36px; bottom:36px;
      left:max(24px, calc((100vw - 1280px) / 2 + 56px));
      width:316px; background:rgba(20,22,26,.88);
      backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
      border-radius:18px; padding:28px 28px 24px;
      border:1px solid rgba(255,255,255,.08);
      box-shadow:0 28px 64px rgba(0,0,0,.55);
      display:flex; flex-direction:column;
    }
    .contact-hours-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05); }
    .contact-hours-row:last-child { border-bottom:none; }
    @media (max-width:900px) {
      .contact-map-wrap { height:340px; }
      .contact-map-gradient { background:linear-gradient(180deg,transparent 30%,rgba(20,22,26,.9) 100%); }
      .contact-card { position:static; width:100%; border-radius:0 0 0 0; top:auto; bottom:auto; left:auto; backdrop-filter:none; background:#14161A; border:none; border-radius:0; box-shadow:none; }
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
  Warn:    ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Spin:    ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" className="spin"><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>,
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
      <motion.div style={{position:'absolute',right:'-5%',bottom:'-8%',y:y1,rotate:rot1,opacity:.07}}><Ic.Gear s={420} c="white"/></motion.div>
      <motion.div style={{position:'absolute',left:'-3%',top:'10%',y:y2,rotate:rot2,opacity:.05}}><Ic.Gear s={200} c="white"/></motion.div>
    </div>
  );
};

const SectionDeco = ({ side='right', color='var(--accent)', opacity=0.04 }) => {
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
    <header style={{position:'sticky',top:0,zIndex:200,width:'100%',background:scrolled?'rgba(27,30,36,.98)':'rgba(27,30,36,.82)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',borderBottom:`1px solid ${scrolled?'rgba(255,255,255,.06)':'transparent'}`,transition:'all .28s'}}>
      <div className="inner" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:62}}>
        <div onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
          <div style={{width:32,height:32,background:'var(--accent)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic.Wrench s={15} c="#fff"/></div>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:'var(--white)',lineHeight:1.1,letterSpacing:'-.02em'}}>Auto<span style={{color:'var(--accent)'}}>Service</span></div>
            <div style={{fontSize:9,letterSpacing:'.12em',color:'var(--smoke)',textTransform:'uppercase',fontWeight:600}}>Oberhausen</div>
          </div>
        </div>
        <nav className="hide-mob" style={{display:'flex',gap:28,alignItems:'center'}}>
          {[['leistungen','Leistungen'],['ablauf','Ablauf'],['faq','FAQ'],['standort','Standort']].map(([id,label]) => (
            <a key={id} href={`#${id}`} className={`nav-link${active===id?' active':''}`}>{label}</a>
          ))}
        </nav>
        <div className="hide-mob" style={{display:'flex',alignItems:'center',gap:12}}>
          <a href={PHONE_HREF} className="btn btn-ghost" style={{padding:'9px 18px',fontSize:11,textDecoration:'none'}}><Ic.Phone s={13}/> Jetzt anrufen</a>
          <button className="btn btn-primary" style={{padding:'9px 18px',fontSize:11}} onClick={onBook}>Termin buchen</button>
        </div>
        <button onClick={()=>setMOpen(o=>!o)} style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:4}} className="mob-menu-btn"><Ic.Menu s={22} c="var(--white)"/></button>
      </div>
      <AnimatePresence>
        {mOpen && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden',background:'var(--dark)',borderTop:'1px solid rgba(255,255,255,.06)'}}>
            <div style={{padding:'16px 24px',display:'flex',flexDirection:'column',gap:14}}>
              {[['leistungen','Leistungen'],['ablauf','Ablauf'],['faq','FAQ'],['standort','Standort']].map(([id,label]) => (
                <a key={id} href={`#${id}`} onClick={()=>setMOpen(false)} style={{fontSize:14,fontWeight:700,color:active===id?'var(--accent)':'var(--white)',textDecoration:'none',letterSpacing:'.06em',textTransform:'uppercase'}}>{label}</a>
              ))}
              <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:14,display:'flex',flexDirection:'column',gap:10}}>
                <a href={PHONE_HREF} className="btn btn-call" style={{justifyContent:'center',gap:8}}><Ic.Phone s={15}/> {PHONE}</a>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{justifyContent:'center',gap:8}}><Ic.Wa s={16} c="#fff"/> WhatsApp</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`.mob-menu-btn{display:none}@media(max-width:900px){.mob-menu-btn{display:flex!important}}`}</style>
    </header>
  );
};

/* ─── HERO ───────────────────────────────────────────────────────────────── */
const Hero = ({ onBook }) => (
  <div className="section-full" style={{minHeight:'92vh',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',background:'var(--black)'}}>
    <div style={{position:'absolute',inset:0,backgroundImage:"url('second.jpg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed',zIndex:0}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(20,22,26,.92) 0%,rgba(20,22,26,.78) 60%,rgba(20,22,26,.65) 100%)',zIndex:1,pointerEvents:'none'}}/>
    <HeroBg/>
    <div className="inner" style={{position:'relative',zIndex:2,width:'100%',textAlign:'center',padding:'80px 64px'}}>
      <motion.div initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[.22,1,.36,1]}} style={{maxWidth:760,margin:'0 auto'}}>
        <div className="tag" style={{marginBottom:28,justifyContent:'center'}}>
          Offiziell zertifizierte Kfz-Prüfstelle
        </div>
        <h1 style={{fontWeight:800,fontSize:'clamp(38px,6vw,76px)',color:'var(--white)',lineHeight:1.06,letterSpacing:'-.025em',marginBottom:24}}>
          Ihre HU / AU in<br/><span style={{color:'var(--accent)'}}>Oberhausen</span>
        </h1>
        <p style={{fontSize:17,color:'var(--text)',lineHeight:1.8,maxWidth:520,margin:'0 auto 44px'}}>
          Hauptuntersuchung und Abgasuntersuchung schnell online buchen. Kein Warten, transparente Preise, professionelle Prüfingenieure.
        </p>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
          <button className="btn btn-primary" style={{fontSize:14,gap:9,padding:'15px 36px'}} onClick={onBook}>Termin buchen <Ic.Arrow s={16}/></button>
          <a href={PHONE_HREF} className="btn btn-ghost" style={{fontSize:14,gap:9,padding:'15px 36px'}}><Ic.Phone s={16}/> {PHONE}</a>
        </div>
      </motion.div>
    </div>
  </div>
);

/* ─── TRUST BAR ─────────────────────────────────────────────────────────── */
const TrustBar = () => {
  const items = [[<Ic.Award s={15} c="var(--accent)"/>,'Amtlich anerkannt'],[<Ic.Clock s={15} c="var(--accent)"/>,'Kurze Wartezeiten'],[<Ic.Cert s={15} c="var(--accent)"/>,'Transparente Preise'],[<Ic.Shield s={15} c="var(--accent)"/>,'Online-Buchung 24/7'],[<Ic.Wrench s={15} c="var(--accent)"/>,'Qualifizierte Prüfer'],[<Ic.Leaf s={15} c="var(--accent)"/>,'Umwelt-zertifiziert']];
  const all = [...items,...items,...items,...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee-inner">
        {all.map(([ico,t],i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'0 40px',borderRight:'1px solid rgba(255,255,255,.05)'}}>
            {ico}<span style={{fontSize:12,fontWeight:700,color:'var(--smoke)',letterSpacing:'.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── SERVICES ───────────────────────────────────────────────────────────── */
const Services = () => {
  const [modal, setModal] = useState(null);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const items = [
    {ico:<Ic.Shield s={26} c="var(--accent)"/>,title:'Hauptuntersuchung (HU)',sub:'§29 StVZO · Pflichtprüfung',tag:'Pflicht',desc:'Gesetzlich vorgeschriebene Sicherheitsprüfung für alle Kfz.',duration:'ca. 30 Min.',details:['Überprüfung der Bremsanlage','Sicht- und Funktionsprüfung der Beleuchtung','Prüfung von Lenkung, Achsen und Radaufhängung','Kontrolle der Karosserie','Überprüfung von Sichtscheiben und Spiegeln','Prüfung der Abgasanlage','Sicherheitsgurtprüfung','Auslesen der Fahrzeugelektronik / OBD'],img:'Hauptuntersuchung.png',note:'Gesetzlich vorgeschrieben §29 StVZO. Nach 3 Jahren bei Neuwagen, danach alle 2 Jahre.'},
    {ico:<Ic.Leaf s={26} c="var(--accent)"/>,title:'Abgasuntersuchung (AU)',sub:'AU · Emissionsprüfung',tag:'Kombi möglich',desc:'Prüfung der Schadstoffemissionen — schützt Umwelt und vermeidet Bußgelder.',duration:'ca. 15 Min.',details:['Sichtprüfung der Abgasanlage','Messung von CO, HC und Lambda-Werten','Trübungsmessung beim Diesel','Auslesen des OBD-Systems','Prüfung von Katalysator und Partikelfilter','Dokumentation und Bescheinigung'],img:'Abgasuntersuchung.png',note:'Pflichtbestandteil der HU. Kombi empfohlen.'},
    {ico:<Ic.Wrench s={26} c="var(--accent)"/>,title:'Vorab-Check',sub:'Sicherheits-Vorprüfung',tag:'Empfohlen',desc:'Mängel vor der HU erkennen, Nachprüfungen vermeiden.',duration:'ca. 20 Min.',details:['Überprüfung aller HU-relevanten Punkte','Identifikation von Mängeln','Kosten- und Zeiteinschätzung','Beratung durch Prüfingenieur','Dokumentation mit Mängelliste'],img:'VorabCheck.png',note:'Kostenlos bei anschließender HU. Separat ab 29 €.'},
    {ico:<Ic.Clip s={26} c="var(--accent)"/>,title:'Eintragungen / Abnahmen',sub:'§19 StVZO',tag:'Flexibel',desc:'Offizielle Abnahme von Fahrzeugveränderungen.',duration:'30–60 Min.',details:['Abnahme von Fahrwerksveränderungen','Prüfung von Felgen und Bereifung','Abnahme von Karosserieveränderungen','Prüfung auf Übereinstimmung mit ABE','Eintrag in Zulassungsbescheinigung'],img:'Eintragungen.png',note:'Alle ABE-Dokumente oder Gutachten mitbringen.'},
    {ico:<Ic.Moto s={26} c="var(--accent)"/>,title:'Motorrad-HU',sub:'Zweiräder · §29 StVZO',tag:'Saisonal',desc:'Spezialisierte HU für Motorräder und Roller.',duration:'ca. 25 Min.',details:['Kontrolle der Bremsen','Überprüfung von Reifen','Prüfung von Rahmen und Gabeln','Sichtprüfung Licht und Blinker','Überprüfung Kettensatz oder Kardan'],img:'motorrad.png',note:'Fahrzeugschein mitbringen.'},
    {ico:<Ic.Award s={26} c="var(--accent)"/>,title:'Oldtimer-Gutachten',sub:'§23 StVZO · H-Kennzeichen',tag:'Speziell',desc:'Offizielles Gutachten für das H-Kennzeichen.',duration:'ca. 60 Min.',details:['Prüfung auf originalen Fahrzeugzustand','Bewertung von Karosserie und Technik','Sicherheitsüberprüfung §29 StVZO','Prüfung der Fahrzeughistorie','Erstellung des Gutachtens §23 StVZO'],img:'oldtiemer.png',note:'Mindestens 30 Jahre altes Fahrzeug erforderlich.'},
    {ico:<Ic.Cert s={26} c="var(--accent)"/>,title:'HU + AU Kombi',sub:'§29 StVZO · Kombiangebot',tag:'Kombi',desc:'HU und AU in einem Termin — spart Zeit und ist oft günstiger.',duration:'ca. 40 Min.',details:['Vollständige Hauptuntersuchung §29 StVZO','Abgasuntersuchung inklusive','OBD-Diagnose beider Prüfungen','Einmalige Wartezeit für beide Tests','Kombiniertes Prüfprotokoll','Sofortige Bescheinigung vor Ort'],img:'AUKombi.png',note:'Empfehlung: HU und AU immer zusammen buchen — keine Extrakosten für die Kombination.'},
  ];

  /* mosaic layout: big left card cycles through featuredSlides every 3s */
  const featuredSlides = [
    { img:'tuvv.jpg',      title:'TÜV Oberhausen',      sub:'Ihr Prüfpartner vor Ort',    item: items[0] },
    { img: items[0].img,   title: items[0].title,        sub: items[0].sub,                item: items[0] },
    { img: items[1].img,   title: items[1].title,        sub: items[1].sub,                item: items[1] },
    { img: items[4].img,   title: items[4].title,        sub: items[4].sub,                item: items[4] },
    { img: items[5].img,   title: items[5].title,        sub: items[5].sub,                item: items[5] },
  ];
  const smallCards = [
    { img: items[0].img, title: items[0].title, sub: items[0].sub, item: items[0], slideIdx:1, gridColumn:'2', gridRow:'1' },
    { img: items[1].img, title: items[1].title, sub: items[1].sub, item: items[1], slideIdx:2, gridColumn:'3', gridRow:'1' },
    { img: items[4].img, title: items[4].title, sub: items[4].sub, item: items[4], slideIdx:3, gridColumn:'2', gridRow:'2' },
    { img: items[5].img, title: items[5].title, sub: items[5].sub, item: items[5], slideIdx:4, gridColumn:'3', gridRow:'2' },
  ];
  useEffect(() => {
    const t = setInterval(() => setFeaturedIdx(p => (p + 1) % featuredSlides.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div id="leistungen" className="section-full" style={{position:'relative',paddingTop:72,paddingBottom:72,overflow:'hidden',background:'var(--dark)'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:"url('mainn.png')",backgroundSize:'cover',backgroundPosition:'center',opacity:0.1,pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, transparent 30%, rgba(10,12,18,.45) 100%)',pointerEvents:'none',zIndex:1}}/>
      <style>{`
        .mosaic-grid { display:grid; grid-template-columns:2fr 1fr 1fr; grid-template-rows:340px 240px; gap:10px; }
        .mosaic-cell { position:relative; overflow:hidden; cursor:pointer; border-radius:12px; }
        .mosaic-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform .45s cubic-bezier(.22,1,.36,1); }
        .mosaic-cell:hover .mosaic-bg { transform:scale(1.06); }
        .mosaic-gradient { position:absolute; inset:0; background:linear-gradient(180deg,rgba(10,12,18,.20) 0%,rgba(10,12,18,.20) 40%,rgba(10,12,18,.88) 100%); pointer-events:none; }
        .mosaic-label { position:absolute; bottom:0; left:0; right:0; padding:18px 20px; z-index:3; }
        .mosaic-sub { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-bottom:4px; }
        .mosaic-title { font-size:15px; font-weight:800; color:#fff; line-height:1.2; letter-spacing:-.01em; }
        @media(max-width:900px){
          .mosaic-grid { grid-template-columns:1fr !important; grid-template-rows:auto !important; }
          .mosaic-cell { grid-column:1 !important; grid-row:auto !important; height:220px !important; }
        }
      `}</style>

      <div className="inner" style={{position:'relative',zIndex:2}}>
        {/* Section header */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:40,flexWrap:'wrap',gap:16}}>
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:10,fontSize:11,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--accent)',marginBottom:12}}>
              <span style={{display:'inline-block',width:24,height:2,background:'var(--accent)',borderRadius:1,flexShrink:0}}/>LEISTUNGEN
            </div>
            <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,44px)',color:'var(--white)',letterSpacing:'-.02em',lineHeight:1.1}}>Unsere Prüfleistungen</h2>
          </div>
          <a href="#termin" style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,color:'var(--accent)',textDecoration:'none',letterSpacing:'.04em',textTransform:'uppercase',border:'1.5px solid rgba(91,145,244,.35)',padding:'10px 22px',borderRadius:8,transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--accent)';e.currentTarget.style.color='#fff';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--accent)';}}>
            Alle Leistungen <Ic.Arrow s={13}/>
          </a>
        </motion.div>

        {/* Mosaic grid */}
        <motion.div className="mosaic-grid" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}}>

          {/* BIG LEFT CARD — auto-cycles every 3s */}
          <div className="mosaic-cell" style={{gridColumn:'1',gridRow:'1/3'}} onClick={()=>setModal(featuredSlides[featuredIdx].item)}>
            <AnimatePresence mode="sync">
              <motion.div
                key={featuredIdx}
                initial={{opacity:0,scale:1.07}}
                animate={{opacity:1,scale:1}}
                exit={{opacity:0}}
                transition={{duration:0.85,ease:[0.22,1,0.36,1]}}
                style={{position:'absolute',inset:0,backgroundImage:`url('${featuredSlides[featuredIdx].img}')`,backgroundSize:'cover',backgroundPosition:'center'}}
              />
            </AnimatePresence>
            <div className="mosaic-gradient"/>
            <div className="mosaic-label">
              <AnimatePresence mode="wait">
                <motion.div key={featuredIdx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.35}}>
                  <div className="mosaic-sub">{featuredSlides[featuredIdx].sub}</div>
                  <div className="mosaic-title" style={{fontSize:20}}>{featuredSlides[featuredIdx].title}</div>
                </motion.div>
              </AnimatePresence>
              {/* Dot nav */}
              <div style={{display:'flex',gap:6,marginTop:14}} onClick={e=>e.stopPropagation()}>
                {featuredSlides.map((_,i)=>(
                  <button key={i} onClick={()=>setFeaturedIdx(i)}
                    style={{width:i===featuredIdx?22:7,height:7,borderRadius:4,border:'none',cursor:'pointer',padding:0,
                      background:i===featuredIdx?'var(--accent)':'rgba(255,255,255,.32)',transition:'all .35s cubic-bezier(.22,1,.36,1)'}}/>
                ))}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'rgba(255,255,255,.08)',zIndex:3}}>
              <motion.div key={featuredIdx} initial={{width:'0%'}} animate={{width:'100%'}} transition={{duration:3,ease:'linear'}}
                style={{height:'100%',background:'var(--accent)'}}/>
            </div>
          </div>

          {/* SMALL RIGHT CARDS */}
          {smallCards.map((card,i)=>{
            const isActive = featuredIdx === card.slideIdx;
            return (
              <div key={i} className="mosaic-cell"
                style={{gridColumn:card.gridColumn,gridRow:card.gridRow,outline:isActive?'2px solid var(--accent)':'2px solid transparent',transition:'outline .3s'}}
                onClick={()=>{setFeaturedIdx(card.slideIdx);setModal(card.item);}}>
                <div className="mosaic-bg" style={{backgroundImage:`url('${card.img}')`}}/>
                <div className="mosaic-gradient"/>
                {isActive && <div style={{position:'absolute',inset:0,background:'rgba(91,145,244,.13)',pointerEvents:'none',zIndex:2}}/>}
                <div className="mosaic-label" style={{zIndex:3}}>
                  <div className="mosaic-sub">{card.sub}</div>
                  <div className="mosaic-title">{card.title}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {modal && (
          <div style={{position:'fixed',inset:0,zIndex:900,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setModal(null)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)'}}/>
            <motion.div initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.97}} style={{position:'relative',background:'var(--dark)',width:'100%',maxWidth:520,maxHeight:'88vh',borderRadius:18,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.5)',overflow:'hidden',border:'1px solid rgba(255,255,255,.07)'}}>
              <div style={{padding:'20px 24px',background:'var(--dark2)',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:9,color:'var(--smoke)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:3,fontWeight:700}}>{modal.sub}</div>
                  <h3 style={{fontWeight:800,fontSize:20,color:'var(--white)'}}>{modal.title}</h3>
                </div>
                <button onClick={()=>setModal(null)} style={{background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',width:34,height:34,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic.X s={15} c="var(--text)"/></button>
              </div>
              <div style={{padding:24,overflowY:'auto'}}>
                <div className="g2" style={{marginBottom:20}}>
                  {[['Dauer',modal.duration],['Kategorie',modal.tag]].map(([k,v]) => (
                    <div key={k} style={{background:'rgba(91,145,244,.07)',padding:'12px 16px',borderRadius:10,border:'1px solid rgba(91,145,244,.15)'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'var(--smoke)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>{k}</div>
                      <div style={{fontWeight:700,fontSize:14,color:'var(--accent)'}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontWeight:700,fontSize:12,color:'var(--white)',marginBottom:12,textTransform:'uppercase',letterSpacing:'.06em'}}>Prüfpunkte</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
                  {modal.details.map((pt,j) => (
                    <li key={j} style={{display:'flex',alignItems:'flex-start',gap:9,fontSize:13,color:'var(--text)',lineHeight:1.5}}>
                      <div style={{width:18,height:18,borderRadius:'50%',background:'rgba(91,145,244,.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}><Ic.Check s={10} c="var(--accent)"/></div>{pt}
                    </li>
                  ))}
                </ul>
                {modal.note && (
                  <div style={{background:'rgba(91,145,244,.07)',border:'1px solid rgba(91,145,244,.18)',borderRadius:10,padding:'12px 14px',display:'flex',gap:9,alignItems:'flex-start'}}>
                    <Ic.Info s={14} c="var(--accent)"/><p style={{fontSize:12,color:'var(--text)',lineHeight:1.6}}>{modal.note}</p>
                  </div>
                )}
              </div>
              <div style={{padding:'16px 24px',borderTop:'1px solid rgba(255,255,255,.07)',background:'var(--dark2)'}}>
                <a href="#termin" onClick={()=>setModal(null)} className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:13}}>Jetzt Termin buchen</a>
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
  const steps = [{n:'01',title:'Online buchen',desc:'Leistung, Datum und Zeit wählen — rund um die Uhr.'},{n:'02',title:'Bestätigung',desc:'Bestätigungsmail mit allen Termindaten.'},{n:'03',title:'Fahrzeug bringen',desc:'Unser Team führt die Prüfung durch.'},{n:'04',title:'Plakette erhalten',desc:'Plakette und Prüfdokumente direkt vor Ort.'}];
  return (
    <div id="ablauf" className="section-full sec" style={{background:'var(--black)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:"url('first.png')",backgroundSize:'cover',backgroundPosition:'center',opacity:0.04,pointerEvents:'none',zIndex:0}}/>
      <SectionDeco side="left"/>
      <div className="inner" style={{position:'relative',zIndex:1}}>
        <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 80px',alignItems:'start'}}>
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{paddingTop:8}}>
            <div className="tag" style={{marginBottom:14}}>Ablauf</div>
            <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,42px)',color:'var(--white)',letterSpacing:'-.02em',lineHeight:1.1,marginBottom:16}}>In 4 Schritten zur Plakette</h2>
            <div className="accent"/>
            <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.75,marginBottom:32}}>Buchen Sie bequem online — wir erledigen den Rest schnell und transparent.</p>
            <a href="#termin" className="btn btn-primary" style={{fontSize:13,padding:'13px 28px',gap:9,textDecoration:'none'}}>Jetzt Termin buchen <Ic.Arrow s={14}/></a>
          </motion.div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:18,top:0,bottom:0,width:1,background:'linear-gradient(180deg,var(--accent) 0%,rgba(91,145,244,.1) 100%)',zIndex:0}}/>
            {steps.map((s,i) => (
              <motion.div key={i} initial={{opacity:0,x:16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
                style={{display:'flex',gap:20,paddingLeft:8,paddingBottom:i<steps.length-1?32:0,position:'relative',zIndex:1}}>
                <div style={{flexShrink:0,width:36,height:36,borderRadius:'50%',background:'var(--dark2)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,color:'var(--accent)'}}>
                  {i+1}
                </div>
                <div style={{paddingTop:6}}>
                  <h3 style={{fontSize:15,fontWeight:700,color:'var(--white)',marginBottom:5}}>{s.title}</h3>
                  <p style={{color:'var(--smoke)',fontSize:13,lineHeight:1.65}}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── BOOKING SECTION ────────────────────────────────────────────────────── */
const BookingSection = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: '', datum: '', zeit: '',
    vorname: '', nachname: '', telefon: '', email: '',
    marke: '', modell: '', anmerkungen: '', kennzeichen: ''
  });
  const [touched, setTouched] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState(false);

  /* calendar state */
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const serviceItems = [
    {ico:<Ic.Shield s={22} c="var(--accent)"/>,title:'Hauptuntersuchung (HU)',sub:'§29 StVZO · Pflichtprüfung',tag:'Pflicht'},
    {ico:<Ic.Leaf s={22} c="var(--accent)"/>,title:'Abgasuntersuchung (AU)',sub:'AU · Emissionsprüfung',tag:'Kombi möglich'},
    {ico:<Ic.Wrench s={22} c="var(--accent)"/>,title:'Vorab-Check',sub:'Sicherheits-Vorprüfung',tag:'Empfohlen'},
    {ico:<Ic.Clip s={22} c="var(--accent)"/>,title:'Eintragungen / Abnahmen',sub:'§19 StVZO',tag:'Flexibel'},
    {ico:<Ic.Moto s={22} c="var(--accent)"/>,title:'Motorrad-HU',sub:'Zweiräder · §29 StVZO',tag:'Saisonal'},
    {ico:<Ic.Award s={22} c="var(--accent)"/>,title:'Oldtimer-Gutachten',sub:'§23 StVZO · H-Kennzeichen',tag:'Speziell'},
    {ico:<Ic.Cert s={22} c="var(--accent)"/>,title:'HU + AU Kombi',sub:'§29 StVZO · Kombiangebot',tag:'Kombi'},
  ];

  const setField = (field, value) => setForm(prev => ({...prev, [field]: value}));
  const handleBlur = (field) => setTouched(prev => ({...prev, [field]: true}));

  const step3Errors = () => {
    const e = {};
    if (!form.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!form.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (form.telefon.replace(/[^\d]/g,'').length < 6) e.telefon = 'Ungültige Telefonnummer';
    if (!form.marke.trim()) e.marke = 'Pflichtfeld';
    if (!form.modell.trim()) e.modell = 'Pflichtfeld';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ungültige E-Mail';
    return e;
  };

  const loadSlots = useCallback(async (date) => {
    if (!date) return;
    setSlotsLoading(true); setSlotsError('');
    try { setBookedSlots(await fetchBookedSlots(date)); }
    catch { setSlotsError('Termine konnten nicht geladen werden.'); }
    finally { setSlotsLoading(false); }
  }, []);

  useEffect(() => {
    if (form.datum) { setField('zeit', ''); loadSlots(form.datum); }
  }, [form.datum, loadSlots]);

  const handleSubmit = async () => {
    const errs = step3Errors();
    if (Object.keys(errs).length > 0) {
      setTouched({vorname:true,nachname:true,telefon:true,marke:true,modell:true,email:true});
      return;
    }
    setSubmitting(true); setSubmitError('');
    try {
      const result = await insertBooking({
        date: form.datum,
        time_slot: form.zeit,
        service: form.service,
        vehicle_type: `${form.marke} ${form.modell}`.trim(),
        plate: form.kennzeichen || '—',
        name: `${form.vorname} ${form.nachname}`.trim(),
        phone: form.telefon,
        email: form.email,
        notes: form.anmerkungen || null,
      });
      const bookingId = result[0]?.id;
      if (bookingId) {
        try {
          await fetch('/api/send-confirmation', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({bookingId}) });
        } catch(err) { console.error('Fehler beim Senden:', err); }
      }
      setSent(true);
    } catch(err) {
      if (err.message === 'SLOT_TAKEN') {
        setSubmitError('Dieser Termin wurde gerade gebucht. Bitte wählen Sie einen anderen Slot.');
        await loadSlots(form.datum); setField('zeit',''); setStep(2);
      } else {
        setSubmitError('Buchung fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
      }
    } finally { setSubmitting(false); }
  };

  /* calendar helpers */
  const calDays = () => {
    const first = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
    const startDow = first === 0 ? 6 : first - 1; // shift to Mon=0
    const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
    return { startDow, daysInMonth };
  };
  const fmtDate = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const isDayPast = (y, m, d) => {
    const t = new Date(); t.setHours(0,0,0,0);
    return new Date(y, m, d) < t;
  };
  const isDayWeekend = (y, m, d) => { const dow = new Date(y, m, d).getDay(); return dow === 0 || dow === 6; };

  const DE_MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const DE_DAYS = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  const DE_WEEKDAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

  const fmtGermanDate = (dateStr) => {
    if (!dateStr) return '';
    const [y,m,d] = dateStr.split('-').map(Number);
    const dow = new Date(y, m-1, d).getDay();
    return `${DE_WEEKDAYS[dow]}, ${d}. ${DE_MONTHS[m-1]}`;
  };

  const allSlots = generateSlots(form.datum);
  const morningSlots = allSlots.filter(s => parseInt(s.split(':')[0]) < 12);
  const afternoonSlots = allSlots.filter(s => parseInt(s.split(':')[0]) >= 12);

  /* input style helpers */
  const inp = (field) => {
    const errs = step3Errors();
    const err = touched[field] && errs[field];
    return {
      fontFamily:'var(--sans)', fontSize:14, color:'var(--white)',
      background:'var(--dark3)', border:`1.5px solid ${err ? '#ef4444' : 'rgba(255,255,255,.08)'}`,
      borderRadius:8, padding:'10px 13px', width:'100%', outline:'none',
      transition:'border-color .18s', boxSizing:'border-box',
    };
  };

  const labelStyle = { fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--smoke)', marginBottom:5, display:'block' };
  const fieldWrap = { display:'flex', flexDirection:'column', gap:4 };

  /* step indicator */
  const StepDots = () => (
    <div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center',marginBottom:40}}>
      {[1,2,3].map(n => (
        <div key={n} style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background: n < step ? 'var(--accent)' : n === step ? 'var(--accent)' : 'rgba(255,255,255,.2)',
            color: n <= step ? '#fff' : 'var(--smoke)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:12, transition:'all .25s',
            boxShadow: n === step ? '0 4px 14px rgba(91,145,244,.35)' : 'none',
          }}>{n < step ? <Ic.Check s={13} c="#fff"/> : n}</div>
          {n < 3 && <div style={{width:40,height:2,background:n < step ? 'var(--accent)' : 'rgba(255,255,255,.2)',borderRadius:1,transition:'background .25s'}}/>}
        </div>
      ))}
    </div>
  );

  return (
    <div id="termin" className="section-full" style={{position:'relative',background:'var(--dark)',paddingTop:72,paddingBottom:72,overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:"url('mainn.png')",backgroundSize:'cover',backgroundPosition:'center',opacity:0.1,pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, transparent 30%, rgba(10,12,18,.45) 100%)',pointerEvents:'none',zIndex:1}}/>
      <style>{`
        .bk-card { background: var(--dark2); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; padding: 32px; box-shadow: 0 2px 32px rgba(0,0,0,.3); }
        .svc-sel { display:flex; flex-direction:column; gap:8px; }
        .svc-sel-card { background: var(--dark3); border: 1.5px solid rgba(255,255,255,.07); border-left: 3px solid transparent; border-radius: 12px; padding: 15px 18px; cursor: pointer; transition: all .22s cubic-bezier(.22,1,.36,1); position: relative; display:flex; align-items:center; gap:16px; }
        .svc-sel-card:hover { border-color: rgba(91,145,244,.3); background: rgba(91,145,244,.05); }
        .svc-sel-card.active { border-color: rgba(91,145,244,.35); border-left-color: var(--accent); background: rgba(91,145,244,.08); box-shadow: 0 4px 20px rgba(91,145,244,.12); }
        .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
        .cal-day { width:100%; aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; border:none; background:transparent; font-family:var(--sans); }
        .cal-day:hover:not(:disabled):not(.cal-selected):not(.cal-today) { background: rgba(91,145,244,.12); color: var(--accent); }
        .cal-day.cal-selected { background: var(--accent); color: #fff; box-shadow: 0 3px 10px rgba(91,145,244,.35); }
        .cal-day.cal-today { border: 2px solid var(--accent); color: var(--accent); }
        .cal-day:disabled { color: rgba(255,255,255,.2); cursor: not-allowed; }
        .bk-nav-btn { background: none; border: 1.5px solid rgba(255,255,255,.1); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; color: var(--text); }
        .bk-nav-btn:hover { border-color: var(--accent); color: var(--accent); }
        @media(max-width:900px){
          .bk-two-col { grid-template-columns:1fr !important; }
          .svc-sel-tag { display:none !important; }
        }
        @media(max-width:600px){
          .bk-card { padding:20px 16px !important; }
          .svc-sel-card { padding:12px 14px !important; gap:12px !important; }
        }
      `}</style>

      <div className="inner" style={{maxWidth:860,position:'relative',zIndex:2}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:40}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,fontSize:11,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--accent)',marginBottom:12}}>
            <span style={{display:'inline-block',width:24,height:2,background:'var(--accent)',borderRadius:1}}/>ONLINE BUCHUNG
          </div>
          <h2 style={{fontWeight:800,fontSize:'clamp(24px,3.2vw,38px)',color:'var(--white)',letterSpacing:'-.02em',marginBottom:10}}>Termin sichern — einfach online.</h2>
          <p style={{color:'var(--smoke)',fontSize:14,maxWidth:480,margin:'0 auto'}}>In drei Schritten zum bestätigten Termin.</p>
        </motion.div>

        {sent ? (
          <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} className="bk-card" style={{textAlign:'center',padding:'56px 32px'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(16,185,129,.1)',border:'2.5px solid #10B981',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 4px 20px rgba(16,185,129,.2)'}}>
              <Ic.Check s={28} c="#10B981"/>
            </div>
            <h3 style={{fontWeight:800,fontSize:26,marginBottom:10,color:'var(--white)'}}>Termin bestätigt!</h3>
            <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.7,marginBottom:6}}>Ihr Termin wurde erfolgreich gebucht.</p>
            <p style={{fontWeight:800,fontSize:18,color:'var(--accent)',marginBottom:4}}>{fmtGermanDate(form.datum)} · {form.zeit} Uhr</p>
            <p style={{fontSize:14,color:'var(--smoke)',marginBottom:4}}>{form.service}</p>
            <p style={{fontSize:13,color:'var(--smoke)',marginBottom:28}}>Bestätigungsmail wurde gesendet.</p>
            <button className="btn btn-primary" style={{fontSize:13,padding:'12px 28px'}} onClick={()=>{setSent(false);setStep(1);setForm({service:'',datum:'',zeit:'',vorname:'',nachname:'',telefon:'',email:'',marke:'',modell:'',anmerkungen:'',kennzeichen:''});setTouched({});}}>
              Neuen Termin buchen
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <StepDots/>

            {/* ── STEP 1: Service selection ── */}
            <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:.25}}>
                <div className="bk-card">
                  <div style={{marginBottom:24}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--accent)',marginBottom:8}}>SCHRITT 01</div>
                    <h3 style={{fontWeight:800,fontSize:22,color:'var(--white)',letterSpacing:'-.01em'}}>Was braucht Ihr Auto?</h3>
                  </div>
                  <div className="svc-sel">
                    {serviceItems.map((s,i) => {
                      const active = form.service === s.title;
                      return (
                        <div key={i} className={`svc-sel-card${active?' active':''}`} onClick={()=>setField('service', s.title)}>
                          {/* Icon */}
                          <div style={{width:44,height:44,borderRadius:11,background:active?'rgba(91,145,244,.18)':'rgba(255,255,255,.05)',border:`1.5px solid ${active?'rgba(91,145,244,.4)':'rgba(255,255,255,.07)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .22s'}}>
                            {s.ico}
                          </div>
                          {/* Text */}
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:14,color:'var(--white)',lineHeight:1.25,marginBottom:3}}>{s.title}</div>
                            <div style={{fontSize:11,color:'var(--smoke)',fontWeight:500,letterSpacing:'.02em'}}>{s.sub}</div>
                          </div>
                          {/* Tag + Check */}
                          <div style={{flexShrink:0,display:'flex',alignItems:'center',gap:10}}>
                            <span className="svc-sel-tag" style={{fontSize:10,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',padding:'4px 10px',borderRadius:20,transition:'all .22s',
                              color:active?'var(--accent)':'var(--smoke)',
                              background:active?'rgba(91,145,244,.15)':'rgba(255,255,255,.05)',
                              border:`1px solid ${active?'rgba(91,145,244,.35)':'rgba(255,255,255,.08)'}`}}>{s.tag}</span>
                            <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .22s',
                              border:`2px solid ${active?'var(--accent)':'rgba(255,255,255,.2)'}`,
                              background:active?'var(--accent)':'transparent'}}>
                              {active && <Ic.Check s={10} c="#fff"/>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:'flex',justifyContent:'flex-end',marginTop:28}}>
                    <button className="btn btn-primary" style={{fontSize:13,padding:'12px 28px',gap:8,opacity:form.service?1:.45,cursor:form.service?'pointer':'not-allowed'}}
                      disabled={!form.service} onClick={()=>setStep(2)}>
                      Weiter <Ic.Arrow s={14}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Date + Time ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:.25}}>
                <div className="bk-card">
                  <div style={{marginBottom:24}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--accent)',marginBottom:8}}>SCHRITT 02</div>
                    <h3 style={{fontWeight:800,fontSize:22,color:'var(--white)',letterSpacing:'-.01em'}}>Wann soll es sein?</h3>
                  </div>
                  <div className="bk-two-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,alignItems:'start'}}>
                    {/* Calendar */}
                    <div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                        <button className="bk-nav-btn" onClick={()=>{ if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <span style={{fontWeight:700,fontSize:14,color:'var(--white)'}}>{DE_MONTHS[calMonth]} {calYear}</span>
                        <button className="bk-nav-btn" onClick={()=>{ if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}>
                          <Ic.ChevR s={14} c="currentColor"/>
                        </button>
                      </div>
                      <div className="cal-grid" style={{marginBottom:8}}>
                        {DE_DAYS.map(d => <div key={d} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--smoke)',letterSpacing:'.06em',padding:'4px 0'}}>{d}</div>)}
                      </div>
                      <div className="cal-grid">
                        {(() => {
                          const { startDow, daysInMonth } = calDays();
                          const cells = [];
                          for (let i = 0; i < startDow; i++) cells.push(<div key={`e${i}`}/>);
                          for (let d = 1; d <= daysInMonth; d++) {
                            const dateStr = fmtDate(calYear, calMonth, d);
                            const past = isDayPast(calYear, calMonth, d);
                            const weekend = isDayWeekend(calYear, calMonth, d);
                            const disabled = past || weekend;
                            const selected = form.datum === dateStr;
                            const isToday = dateStr === today.toISOString().split('T')[0];
                            cells.push(
                              <button key={d} disabled={disabled}
                                className={`cal-day${selected?' cal-selected':isToday&&!selected?' cal-today':''}`}
                                onClick={()=>{ setField('datum', dateStr); setField('zeit',''); }}
                                style={{color: disabled ? 'rgba(255,255,255,.2)' : selected ? '#fff' : 'var(--text)'}}>
                                {d}
                              </button>
                            );
                          }
                          return cells;
                        })()}
                      </div>
                    </div>
                    {/* Time slots */}
                    <div>
                      {!form.datum ? (
                        <div style={{padding:'32px 16px',textAlign:'center',color:'var(--smoke)',fontSize:13,border:'1.5px dashed rgba(255,255,255,.1)',borderRadius:10}}>
                          Bitte wählen Sie zuerst einen Tag aus.
                        </div>
                      ) : (
                        <>
                          <div style={{fontWeight:700,fontSize:14,color:'var(--white)',marginBottom:16}}>{fmtGermanDate(form.datum)}</div>
                          {slotsLoading && (
                            <div style={{display:'flex',alignItems:'center',gap:8,color:'var(--smoke)',fontSize:13}}>
                              <Ic.Spin s={14} c="var(--accent)"/> Lade freie Termine …
                            </div>
                          )}
                          {slotsError && (
                            <div style={{padding:'10px 12px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,fontSize:12,color:'#DC2626',display:'flex',gap:6,alignItems:'center',marginBottom:12}}>
                              <Ic.Warn s={13} c="#DC2626"/> {slotsError}
                              <button type="button" onClick={()=>loadSlots(form.datum)} style={{marginLeft:'auto',background:'none',border:'none',color:'var(--accent)',cursor:'pointer',fontSize:12,fontWeight:700}}>Erneut</button>
                            </div>
                          )}
                          {!slotsLoading && !slotsError && allSlots.length === 0 && (
                            <div style={{padding:'12px',background:'var(--dark3)',border:'1px solid rgba(255,255,255,.07)',borderRadius:8,fontSize:13,color:'var(--smoke)',textAlign:'center'}}>
                              Keine Termine an diesem Tag verfügbar.
                            </div>
                          )}
                          {!slotsLoading && !slotsError && allSlots.length > 0 && (
                            <>
                              {morningSlots.length > 0 && (
                                <div style={{marginBottom:16}}>
                                  <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--smoke)',marginBottom:8}}>VORMITTAG</div>
                                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))',gap:6}}>
                                    {morningSlots.map(slot => {
                                      const booked = bookedSlots.includes(slot);
                                      const past = isPast(form.datum, slot);
                                      const disabled = booked || past;
                                      const selected = form.zeit === slot;
                                      return (
                                        <button key={slot} type="button" disabled={disabled}
                                          onClick={()=>!disabled && setField('zeit', slot)}
                                          style={{padding:'8px 4px',borderRadius:7,fontFamily:'var(--sans)',fontWeight:700,fontSize:12,textAlign:'center',cursor:disabled?'not-allowed':'pointer',transition:'all .15s',border:`1.5px solid ${selected ? 'var(--accent)' : disabled ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.1)'}`,background:selected ? 'var(--accent)' : disabled ? 'rgba(255,255,255,.04)' : 'var(--dark3)',color:selected ? '#fff' : disabled ? 'rgba(255,255,255,.2)' : 'var(--text)',textDecoration:disabled?'line-through':'none',opacity:disabled&&!booked?.75:1}}>
                                          {slot}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              {afternoonSlots.length > 0 && (
                                <div>
                                  <div style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--smoke)',marginBottom:8}}>NACHMITTAG</div>
                                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))',gap:6}}>
                                    {afternoonSlots.map(slot => {
                                      const booked = bookedSlots.includes(slot);
                                      const past = isPast(form.datum, slot);
                                      const disabled = booked || past;
                                      const selected = form.zeit === slot;
                                      return (
                                        <button key={slot} type="button" disabled={disabled}
                                          onClick={()=>!disabled && setField('zeit', slot)}
                                          style={{padding:'8px 4px',borderRadius:7,fontFamily:'var(--sans)',fontWeight:700,fontSize:12,textAlign:'center',cursor:disabled?'not-allowed':'pointer',transition:'all .15s',border:`1.5px solid ${selected ? 'var(--accent)' : disabled ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.1)'}`,background:selected ? 'var(--accent)' : disabled ? 'rgba(255,255,255,.04)' : 'var(--dark3)',color:selected ? '#fff' : disabled ? 'rgba(255,255,255,.2)' : 'var(--text)',textDecoration:disabled?'line-through':'none'}}>
                                          {slot}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:32,gap:12}}>
                    <button className="btn btn-ghost" style={{fontSize:13,padding:'12px 24px',color:'var(--text)',border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)'}} onClick={()=>setStep(1)}>
                      ← Zurück
                    </button>
                    <button className="btn btn-primary" style={{fontSize:13,padding:'12px 28px',gap:8,opacity:(form.datum&&form.zeit)?1:.45,cursor:(form.datum&&form.zeit)?'pointer':'not-allowed'}}
                      disabled={!form.datum||!form.zeit} onClick={()=>setStep(3)}>
                      Weiter <Ic.Arrow s={14}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Contact details ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:.25}}>
                <div className="bk-card">
                  <div style={{marginBottom:24}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--accent)',marginBottom:8}}>SCHRITT 03</div>
                    <h3 style={{fontWeight:800,fontSize:22,color:'var(--white)',letterSpacing:'-.01em'}}>Ihre Kontaktdaten</h3>
                  </div>

                  {/* Summary pill */}
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:24,padding:'12px 16px',background:'rgba(91,145,244,.06)',borderRadius:10,border:'1px solid rgba(91,145,244,.15)'}}>
                    <span style={{fontSize:12,fontWeight:700,color:'var(--accent)'}}>{form.service}</span>
                    <span style={{fontSize:12,color:'var(--smoke)'}}>·</span>
                    <span style={{fontSize:12,color:'var(--smoke)'}}>{fmtGermanDate(form.datum)}</span>
                    <span style={{fontSize:12,color:'var(--smoke)'}}>·</span>
                    <span style={{fontSize:12,fontWeight:700,color:'var(--white)'}}>{form.zeit} Uhr</span>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}} className="bk-two-col">
                    {[
                      {field:'vorname',label:'Vorname *',placeholder:'Max',type:'text'},
                      {field:'nachname',label:'Nachname *',placeholder:'Mustermann',type:'text'},
                      {field:'telefon',label:'Telefon *',placeholder:'+49 157...',type:'tel'},
                      {field:'email',label:'E-Mail',placeholder:'max@beispiel.de',type:'email'},
                      {field:'marke',label:'Fahrzeugmarke *',placeholder:'z.B. VW',type:'text'},
                      {field:'modell',label:'Modell *',placeholder:'z.B. Golf',type:'text'},
                    ].map(({field,label,placeholder,type}) => {
                      const errs = step3Errors();
                      const err = touched[field] && errs[field];
                      return (
                        <div key={field} style={fieldWrap}>
                          <label style={labelStyle}>{label}</label>
                          <input type={type} placeholder={placeholder} value={form[field]} maxLength={60}
                            onChange={e=>{
                              let v = e.target.value;
                              if(field==='telefon') v = v.replace(/[^\d\+\s\-\(\)]/g,'');
                              setField(field, v);
                            }}
                            onFocus={e=>{ e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(91,145,244,.12)'; }}
                            onBlur={e=>{ handleBlur(field); e.target.style.borderColor=step3Errors()[field]?'#ef4444':'rgba(255,255,255,.08)'; e.target.style.boxShadow='none'; }}
                            style={inp(field)}/>
                          {err && <span style={{fontSize:11,color:'#ef4444',fontWeight:600,display:'flex',alignItems:'center',gap:3}}><Ic.Warn s={10}/> {err}</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{marginTop:16,...fieldWrap}}>
                    <label style={labelStyle}>Kennzeichen</label>
                    <input type="text" placeholder="OB-AB 1234" maxLength={15} value={form.kennzeichen}
                      onChange={e=>setField('kennzeichen', e.target.value.toUpperCase().replace(/[^A-Z0-9\-\sÄÖÜ]/g,''))}
                      onFocus={e=>{ e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(91,145,244,.12)'; }}
                      onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,.08)'; e.target.style.boxShadow='none'; }}
                      style={{...inp('kennzeichen'), border:'1.5px solid rgba(255,255,255,.08)'}}/>
                  </div>

                  <div style={{marginTop:16,...fieldWrap}}>
                    <label style={labelStyle}>Anmerkungen</label>
                    <textarea placeholder="Besonderheiten oder Fragen …" maxLength={500} value={form.anmerkungen}
                      onChange={e=>setField('anmerkungen', e.target.value)}
                      onFocus={e=>{ e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(91,145,244,.12)'; }}
                      onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,.08)'; e.target.style.boxShadow='none'; }}
                      style={{...inp('anmerkungen'), border:'1.5px solid rgba(255,255,255,.08)', resize:'vertical', minHeight:80}}/>
                  </div>

                  <AnimatePresence>
                    {submitError && (
                      <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                        style={{marginTop:14,padding:'12px 14px',background:'#FEF2F2',border:'1px solid #FECACA',borderLeft:'3px solid #ef4444',borderRadius:8,fontSize:13,color:'#DC2626',display:'flex',gap:8,alignItems:'flex-start'}}>
                        <Ic.Warn s={14} c="#ef4444"/> {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{display:'flex',justifyContent:'space-between',marginTop:28,gap:12}}>
                    <button className="btn btn-ghost" style={{fontSize:13,padding:'12px 24px',color:'var(--text)',border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)'}} onClick={()=>setStep(2)}>
                      ← Zurück
                    </button>
                    <button className="btn btn-primary" style={{fontSize:13,padding:'12px 28px',gap:8}} disabled={submitting} onClick={handleSubmit}>
                      {submitting ? <><Ic.Spin s={14} c="#fff"/> Wird gespeichert …</> : <>Termin buchen <Ic.Arrow s={14}/></>}
                    </button>
                  </div>
                  <p style={{fontSize:11,color:'var(--smoke)',textAlign:'center',marginTop:14,lineHeight:1.55}}>
                    Mit dem Absenden stimmen Sie unserer <a href="#" onClick={e=>e.preventDefault()} style={{color:'var(--accent)'}}>Datenschutzerklärung</a> zu.
                  </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── FAQ ────────────────────────────────────────────────────────────────── */
const FAQ = () => {
  const [open,setOpen] = useState(null);
  const faqs = [
    ['Wie lange dauert eine Hauptuntersuchung?','Eine Standard-HU dauert ca. 30 Minuten, mit AU-Kombi ca. 45–60 Minuten.'],
    ['Was muss ich zur HU mitbringen?','Den Fahrzeugschein (Zulassungsbescheinigung Teil I). Bei Eintragungen alle ABE-Dokumente.'],
    ['Was passiert, wenn mein Fahrzeug nicht besteht?','Sie erhalten ein Mängelprotokoll. Geringe Mängel können innerhalb eines Monats kostenlos nachgeprüft werden.'],
    ['Kann ich einen Termin kostenlos stornieren?','Ja — bis 24 Stunden vor dem Termin per Telefon oder E-Mail.'],
    ['Welche Fahrzeuge prüfen Sie?','PKW, Motorräder, Transporter sowie Oldtimer (§23 StVZO).'],
    ['Gibt es einen Wartebereich?','Ja — oder Fahrzeug abgeben und später abholen.'],
    ['Kann ich per WhatsApp buchen?','Ja — schreiben Sie uns, wir bestätigen schnellstmöglich.'],
  ];
  return (
    <div id="faq" className="section-full sec" style={{background:'var(--dark)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:"url('first.png')",backgroundSize:'cover',backgroundPosition:'center',opacity:0.04,pointerEvents:'none',zIndex:0}}/>
      <SectionDeco side="right" opacity={0.04}/>
      <div className="inner" style={{maxWidth:780,margin:'0 auto',position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:40}}>
          <div className="tag" style={{marginBottom:14,justifyContent:'center'}}>FAQ</div>
          <h2 style={{fontWeight:800,fontSize:'clamp(26px,3.6vw,42px)',color:'var(--white)',letterSpacing:'-.02em'}}>Häufige Fragen</h2>
          <div className="accent accent-c"/>
        </motion.div>
        <div style={{background:'rgba(35,39,47,.5)',borderRadius:16,border:'1px solid rgba(255,255,255,.07)',padding:'2px 28px'}}>
          {faqs.map(([q,a],i) => (
            <div key={i} className="faq-item" style={{borderBottom:i===faqs.length-1?'none':'1px solid rgba(255,255,255,.06)'}}>
              <button className={`faq-q${open===i?' open':''}`} onClick={()=>setOpen(open===i?null:i)}>
                <span>{q}</span><span className="faq-icon"><Ic.Plus s={11} c={open===i?'var(--black)':'var(--accent)'}/></span>
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
  useEffect(()=>{ if(localStorage.getItem('cookie_consent')==='all') setAccepted(true); },[]);
  if (!accepted) return (
    <div style={{width:'100%',height:'100%',minHeight:360,background:'var(--dark)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}>
      <div style={{width:44,height:44,background:'rgba(91,145,244,.12)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Pin s={20} c="var(--accent)"/></div>
      <div style={{textAlign:'center',maxWidth:340,padding:'0 16px'}}>
        <div style={{fontWeight:700,fontSize:14,color:'var(--white)',marginBottom:6}}>Google Maps ist deaktiviert</div>
        <p style={{fontSize:12.5,color:'var(--smoke)',lineHeight:1.65}}>Stimmen Sie zu, um die Karte anzuzeigen.</p>
      </div>
      <button className="btn btn-primary" style={{fontSize:12,padding:'10px 18px'}} onClick={()=>{localStorage.setItem('cookie_consent','all');setAccepted(true);}}>Google Maps aktivieren</button>
    </div>
  );
  return <iframe src="https://maps.google.com/maps?q=Oberhausen&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:'none',display:'block',filter:'grayscale(.1)',minHeight:360}} allowFullScreen loading="lazy" title="Standort"/>;
};

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
const Contact = () => (
  <div id="standort" className="section-full" style={{background:'#0A0F1C',overflow:'hidden'}}>
    <div className="contact-map-wrap">
      <MapEmbed/>
      <div className="contact-map-gradient"/>

      {/* ── INFO CARD ── */}
      <div className="contact-card">
        {/* Brand */}
        <div style={{display:'flex',alignItems:'center',gap:11,paddingBottom:20,borderBottom:'1px solid rgba(255,255,255,.07)',marginBottom:20,flexShrink:0}}>
          <div style={{width:38,height:38,background:'rgba(91,145,244,.15)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Ic.Wrench s={17} c="var(--accent)"/>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:14,color:'var(--white)',letterSpacing:'-.01em',lineHeight:1.25}}>AutoService Oberhausen</div>
            <div style={{fontSize:11,color:'var(--smoke)',marginTop:2}}>Amtl. anerk. Kfz-Prüfstelle §29 StVZO</div>
          </div>
        </div>

        {/* Address */}
        <div style={{marginBottom:18,flexShrink:0}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--accent)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:7}}>Adresse</div>
          <div style={{fontSize:14,color:'var(--text)',lineHeight:1.65}}>Musterstraße 123<br/>46045 Oberhausen, Deutschland</div>
        </div>

        {/* Contact */}
        <div style={{marginBottom:18,flexShrink:0}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--accent)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:7}}>Kontakt</div>
          <a href={PHONE_HREF} style={{display:'block',fontSize:14,color:'var(--white)',textDecoration:'none',fontWeight:600,marginBottom:3}}>{PHONE}</a>
          <a href="mailto:info@autoservice-ob.de" style={{fontSize:13,color:'var(--smoke)',textDecoration:'none'}}>info@autoservice-ob.de</a>
        </div>

        {/* Hours */}
        <div style={{flexShrink:0}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--accent)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:10}}>Öffnungszeiten</div>
          {[['Mo – Mi','09:00 – 18:00'],['Do & Fr','15:00 – 18:00'],['Sa & So','Geschlossen']].map(([d,t])=>(
            <div key={d} className="contact-hours-row">
              <span style={{fontSize:13,color:'var(--smoke)'}}>{d}</span>
              <span style={{fontSize:13,fontWeight:600,color:t==='Geschlossen'?'var(--mid)':'var(--white)'}}>{t}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{display:'flex',gap:9,marginTop:'auto',paddingTop:22,flexShrink:0}}>
          <a href={PHONE_HREF} className="btn btn-call" style={{flex:1,padding:'10px 0',fontSize:12,justifyContent:'center',gap:6}}>
            <Ic.Phone s={13}/> Anrufen
          </a>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{flex:1,padding:'10px 0',fontSize:12,justifyContent:'center',gap:6}}>
            <Ic.Wa s={13} c="#fff"/> WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
);

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
const Footer = ({ openModal }) => (
  <footer style={{background:'var(--dark2)',color:'var(--text)',borderTop:'1px solid rgba(255,255,255,.06)'}}>
    <div className="inner" style={{padding:'44px 64px 0'}}>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:40,paddingBottom:36,borderBottom:'1px solid rgba(255,255,255,.06)'}} className="mob-stack">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
            <div style={{width:30,height:30,background:'var(--accent)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.Wrench s={14} c="#fff"/></div>
            <span style={{fontWeight:800,fontSize:16,color:'var(--white)'}}>Auto<span style={{color:'var(--accent)'}}>Service</span> <span style={{fontWeight:400,fontSize:12,color:'rgba(255,255,255,.35)'}}>Oberhausen</span></span>
          </div>
          <p style={{color:'var(--smoke)',fontSize:12.5,lineHeight:1.75,maxWidth:260}}>Amtlich anerkannte Kfz-Prüfstelle. HU und AU — professionell und transparent.</p>
        </div>
        {[{title:'Unternehmen',items:['Über uns','Team','Karriere','Kontakt']},{title:'Rechtliches',items:['Impressum','Datenschutz','AGB','Cookie-Einstellungen']}].map(({title,items})=>(
          <div key={title}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.28)',marginBottom:14}}>{title}</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
              {items.map(item=><li key={item}><button onClick={()=>['Impressum','Datenschutz','AGB','Cookie-Einstellungen'].includes(item)&&openModal(item)} style={{background:'none',border:'none',color:'var(--smoke)',fontSize:12.5,cursor:'pointer',padding:0,fontFamily:'var(--sans)',transition:'color .16s'}} onMouseOver={e=>e.target.style.color='var(--white)'} onMouseOut={e=>e.target.style.color='var(--smoke)'}>{item}</button></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,padding:'16px 0'}}>
        <span style={{color:'rgba(255,255,255,.2)',fontSize:11.5}}>© {new Date().getFullYear()} AutoService Oberhausen — Alle Rechte vorbehalten.</span>
        <span style={{color:'rgba(255,255,255,.2)',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase'}}>Amtlich anerkannte Prüfstelle · §29 StVZO</span>
      </div>
    </div>
  </footer>
);

/* ─── LEGAL MODALS ───────────────────────────────────────────────────────── */
const LegalContent = {
  Impressum: (<div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}><h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>Angaben gemäß § 5 TMG</h4><p style={{marginBottom:16}}>AutoService Oberhausen<br/>Musterstraße 123<br/>46045 Oberhausen<br/><br/>Telefon: {PHONE}<br/>E-Mail: info@autoservice-ob.de</p><h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:6}}>Verantwortlich §55 Abs. 2 RStV</h4><p>[Vollständiger Name], Musterstraße 123, 46045 Oberhausen</p></div>),
  Datenschutz: (<div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}><h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>Datenschutzerklärung</h4><p>Wir verarbeiten personenbezogene Daten ausschließlich gemäß DSGVO, BDSG und TTDSG.</p></div>),
  AGB: (<div style={{fontSize:13,color:'var(--smoke)',lineHeight:1.85}}><h4 style={{color:'var(--ink)',fontWeight:700,marginBottom:8}}>AGB</h4><p><strong style={{color:'var(--ink)'}}>§ 1 Geltungsbereich</strong><br/>Diese AGB gelten für alle Terminbuchungen über autoservice-ob.de.</p></div>),
  'Cookie-Einstellungen': null,
};

const Modal = ({ title, onClose }) => {
  const isCookie = title === 'Cookie-Einstellungen';
  return (
    <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)'}}/>
      <motion.div initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.97}} style={{position:'relative',background:'var(--dark)',width:'100%',maxWidth:540,maxHeight:'86vh',borderRadius:16,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.5)',overflow:'hidden',border:'1px solid rgba(255,255,255,.07)'}}>
        <div style={{padding:'18px 24px',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{fontWeight:700,fontSize:18,color:'var(--white)'}}>{title}</h3>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.07)',border:'none',width:32,height:32,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Ic.X s={15} c="var(--text)"/></button>
        </div>
        <div style={{padding:24,overflowY:'auto'}}>
          {isCookie ? (
            <div style={{fontSize:13,color:'var(--text)',lineHeight:1.85}}>
              <p style={{marginBottom:16}}>Sie können Ihre Einwilligung jederzeit widerrufen oder anpassen.</p>
              {[['✓ Technisch notwendige Cookies — immer aktiv','Session, Sicherheit. §25 Abs. 2 TTDSG.'],['○ Analyse-Cookies — nur mit Einwilligung','Anonymisierte Nutzungsauswertung. Art. 6 Abs. 1 lit. a DSGVO.']].map(([t,d])=>(
                <div key={t} style={{marginBottom:12,padding:'12px 14px',background:'var(--dark2)',borderRadius:10,border:'1px solid rgba(255,255,255,.07)'}}>
                  <div style={{fontWeight:700,fontSize:13,color:'var(--white)',marginBottom:4}}>{t}</div><p style={{fontSize:12,color:'var(--smoke)'}}>{d}</p>
                </div>
              ))}
              <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:16}}>
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

/* ─── COOKIE BANNER ──────────────────────────────────────────────────────── */
const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  useEffect(()=>{ if(!localStorage.getItem('cookie_consent')) setVisible(true); },[]);
  const accept = all => { localStorage.setItem('cookie_consent',all?'all':'essential'); setVisible(false); };
  if (!visible) return null;
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:600,background:'var(--dark)',borderTop:'1px solid rgba(255,255,255,.08)',boxShadow:'0 -8px 40px rgba(0,0,0,.4)'}}>
      <div className="inner" style={{padding:'16px 64px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:14}}>
          <div style={{flex:1,minWidth:260}}>
            <div style={{fontWeight:700,fontSize:14,color:'var(--white)',marginBottom:4}}>Diese Website verwendet Cookies</div>
            <p style={{fontSize:12,color:'var(--smoke)',lineHeight:1.65,maxWidth:620}}>
              Technisch notwendige Cookies sind immer aktiv.{' '}
              <button onClick={()=>setDetails(d=>!d)} style={{background:'none',border:'none',color:'var(--accent)',cursor:'pointer',fontSize:12,padding:0,fontFamily:'var(--sans)',textDecoration:'underline'}}>{details?'Weniger':'Mehr Infos'}</button>
            </p>
            {details && (
              <div style={{marginTop:10,padding:12,background:'var(--dark2)',borderRadius:8,fontSize:11.5,color:'var(--smoke)',lineHeight:1.7,border:'1px solid rgba(255,255,255,.07)'}}>
                <strong style={{color:'var(--white)'}}>Notwendig:</strong> Session, Sicherheit.<br/>
                <strong style={{color:'var(--white)'}}>Analyse:</strong> Anonyme Auswertung.<br/>
                <strong style={{color:'var(--white)'}}>Google Maps:</strong> Nur nach Zustimmung.
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
  return (
    <AnimatePresence>
      {vis && (
        <motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
          onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{position:'fixed',bottom:76,right:20,zIndex:80,width:40,height:40,borderRadius:'50%',background:'var(--accent)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 18px rgba(91,145,244,.3)',color:'#fff',fontSize:15,fontWeight:700}}>
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};


/* ─── CANCEL STATUS MODAL ────────────────────────────────────────────────── */
const CancelModal = ({ data, onClose }) => {
  if (!data) return null;

  const contentMap = {
    success: { 
      icon: '✅', color: '#10B981', 
      title: 'Stornierung erfolgreich', 
      text: `Ihr Termin am ${data.date} um ${data.time} Uhr wurde erfolgreich storniert.` 
    },
    already: { 
      icon: 'ℹ️', color: '#3B82F6', 
      title: 'Bereits storniert', 
      text: 'Dieser Termin wurde bereits storniert.' 
    },
    toolate: { 
      icon: '⚠️', color: '#F59E0B', 
      title: 'Stornierung nicht möglich', 
      text: 'Eine Online-Stornierung ist nur bis 24 Stunden vor dem Termin möglich. Bitte rufen Sie uns an.' 
    },
    notfound: { 
      icon: '❓', color: '#EF4444', 
      title: 'Nicht gefunden', 
      text: 'Der Termin konnte nicht gefunden werden oder der Link ist ungültig.' 
    },
    error: { 
      icon: '❌', color: '#EF4444', 
      title: 'Fehler', 
      text: 'Es gab ein Problem bei der Stornierung. Bitte kontaktieren Sie uns telefonisch.' 
    },
    invalid: { 
      icon: '❌', color: '#EF4444', 
      title: 'Ungültiger Link', 
      text: 'Der Stornierungslink ist ungültig oder abgelaufen.' 
    }
  };

  const c = contentMap[data.status] || contentMap.error;

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)'}}/>
      <motion.div initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.97}} style={{position:'relative',background:'var(--dark)',width:'100%',maxWidth:420,borderRadius:20,display:'flex',flexDirection:'column',boxShadow:'0 24px 52px rgba(0,0,0,.5)',overflow:'hidden',textAlign:'center',padding:'40px 24px',border:'1px solid rgba(255,255,255,.07)'}}>

        <div style={{fontSize:48,marginBottom:16,lineHeight:1}}>{c.icon}</div>
        <h3 style={{fontWeight:800,fontSize:22,color:'var(--white)',marginBottom:10}}>{c.title}</h3>
        <p style={{color:'var(--smoke)',fontSize:14,lineHeight:1.6,marginBottom:24}}>{c.text}</p>
        
        <button className="btn btn-primary" onClick={onClose} style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:14}}>
          Schließen
        </button>

      </motion.div>
    </div>
  );
};


/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [modal, setModal] = useState(null);
  const [cancelData, setCancelData] = useState(null);

  // --- ПУЛЕНЕПРОБИВАЕМАЯ ПРОВЕРКА АДМИНКИ ---
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    // Слушаем изменения хэша (если перешли по ссылке)
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Читаем параметры из адресной строки при загрузке (для отмены терминов)
    const params = new URLSearchParams(window.location.search);
    const cancelStatus = params.get('cancel');
    
    if (cancelStatus) {
      setCancelData({
        status: cancelStatus,
        date: params.get('date'),
        time: params.get('time')
      });

      // Очищаем адресную строку
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const scrollBook = () => document.getElementById('termin')?.scrollIntoView({behavior:'smooth'});

  // Если в ссылке есть #admin — показываем только панель
  if (isAdmin) {
    return <AdminPanel />;
  }

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

      <AnimatePresence>
        {cancelData && <CancelModal data={cancelData} onClose={()=>setCancelData(null)}/>}
      </AnimatePresence>

      <CookieBanner/>
    </>
  );
}