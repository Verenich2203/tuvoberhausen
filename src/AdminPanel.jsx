import React, { useState, useEffect, useCallback, useRef } from 'react';

const SUPABASE_URL = "https://cglzccturchfveajhtqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0UWfCaMn2o-BQXTCfww3tg_2BNkOv9m";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="url(#lg)"/>
      <path d="M7 14l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4F46E5"/></linearGradient></defs>
    </svg>
  ),
  Dashboard: ({active}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.5:2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  List: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>
      <line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/>
      <circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Logout: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Refresh: ({spin}) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      style={{animation: spin ? 'spin 0.8s linear infinite' : 'none'}}>
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.13 6.13l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Car: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  ),
  Note: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Export: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Send: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Lock: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Eye: ({show}) => show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Today: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Stats: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
};

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const ST = {
  pending:   { label: 'Ausstehend',    color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', dark: '#D97706' },
  completed: { label: 'Abgeschlossen', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', dark: '#059669' },
  cancelled: { label: 'Storniert',     color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', dark: '#DC2626' },
};
const validStatus = s => (s && ST[s]) ? s : 'pending';

// ─── SUPABASE API ──────────────────────────────────────────────────────────────
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return opts.method === 'PATCH' || opts.method === 'DELETE' ? null : res.json();
}

const fetchBookings = () => apiFetch('bookings?order=date.desc,time_slot.asc');
const patchStatus   = (id, status) => apiFetch(`bookings?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ status }), headers: { ...headers, Prefer: 'return=minimal' } });

// ─── UTILS ────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function exportCSV(bookings) {
  const cols = ['Datum','Uhrzeit','Name','Kennzeichen','Fahrzeugtyp','Service','Telefon','E-Mail','Status','Anmerkungen'];
  const rows = bookings.map(b => [b.date,b.time_slot,b.name,b.plate,b.vehicle_type,b.service,b.phone,b.email,b.status,b.notes||''].map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(','));
  const csv  = [cols.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿'+csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: `termine_${today()}.csv` });
  a.click(); URL.revokeObjectURL(url);
}

// ─── GLOBAL STYLES (keyframes) ─────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:6px;height:6px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}
  ::-webkit-scrollbar-thumb:hover{background:#94A3B8}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  .adm-btn{cursor:pointer;border:none;font-family:inherit;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
  .adm-btn:active{transform:scale(.97)}
  .adm-card{background:#fff;border-radius:14px;border:1px solid #E2E8F0;transition:box-shadow .2s}
  .adm-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.07)}
  .adm-nav-btn{width:100%;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;color:#94A3B8;transition:all .15s;text-align:left;-webkit-background-clip:unset!important;background-clip:unset!important;-webkit-text-fill-color:unset!important}
  .adm-nav-btn:hover{background:rgba(255,255,255,.06);color:#CBD5E1}
  .adm-nav-btn.active{background:rgba(99,102,241,.18);color:#A5B4FC!important;font-weight:600}
  .adm-nav-btn span{color:inherit!important;-webkit-text-fill-color:currentColor!important;background:none!important;-webkit-background-clip:unset!important;background-clip:unset!important}
  .adm-input{width:100%;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;font-family:inherit;color:#1E293B;background:#F8FAFC;outline:none;transition:border-color .15s}
  .adm-input:focus{border-color:#6366F1;background:#fff}
  .adm-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600}
  .booking-row{animation:fadeIn .2s ease-out}
  .cal-day{aspect-ratio:1;border-radius:10px;padding:8px;cursor:pointer;display:flex;flex-direction:column;border:1.5px solid transparent;transition:all .15s;background:#F8FAFC}
  .cal-day:hover{background:#EEF2FF;border-color:#C7D2FE}
  .cal-day.selected{background:#EEF2FF;border-color:#6366F1}
  .cal-day.today-day{border-color:#C7D2FE}
  .stat-card{padding:24px;border-radius:16px;border:1px solid transparent;display:flex;flex-direction:column;gap:8px}
  .filter-tab{padding:8px 16px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
  .filter-tab.active{background:#6366F1;color:#fff}
  .filter-tab:not(.active){background:#F1F5F9;color:#64748B}
  .filter-tab:not(.active):hover{background:#E2E8F0}
`;

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = validStatus(status);
  const c = ST[s];
  return (
    <span className="adm-tag" style={{ background: c.bg, color: c.dark, border: `1px solid ${c.border}` }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, display: 'inline-block' }}/>
      {c.label}
    </span>
  );
}

// ─── BOOKING CARD ──────────────────────────────────────────────────────────────
function BookingCard({ b, onStatus, onSendEmail }) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent]       = useState(false);
  const st = validStatus(b.status);

  const handleEmail = async () => {
    setSendingEmail(true);
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: b.id })
      });
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch { alert('E-Mail Fehler.'); }
    finally { setSendingEmail(false); }
  };

  return (
    <div className="adm-card booking-row" style={{ padding: '18px 22px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Date/Time Block */}
      <div style={{ minWidth: 80, textAlign: 'center', background: '#F8FAFC', borderRadius: 10, padding: '10px 14px', border: '1px solid #E2E8F0', flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
          {b.date ? new Date(b.date+'T00:00').toLocaleDateString('de-DE', { weekday: 'short' }) : '—'}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
          {b.time_slot ? b.time_slot.slice(0,5) : '--:--'}
        </div>
        <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>
          {b.date ? fmtDate(b.date) : ''}
        </div>
      </div>

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{b.name || 'Unbekannt'}</span>
          <span style={{ background: '#EEF2FF', color: '#6366F1', padding: '2px 9px', borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: '.03em' }}>
            {b.plate || '—'}
          </span>
          <StatusBadge status={b.status}/>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
            <Icon.Car/> {b.service || '—'} · {b.vehicle_type || '—'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {b.phone && (
            <a href={`tel:${b.phone}`} style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon.Phone/> {b.phone}
            </a>
          )}
          {b.email && (
            <a href={`mailto:${b.email}`} style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon.Mail/> {b.email}
            </a>
          )}
        </div>

        {b.notes && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#78350F', background: '#FFFBEB', padding: '7px 12px', borderRadius: 8, border: '1px solid #FDE68A', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <Icon.Note/><span><strong>Notiz:</strong> {b.notes}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {st !== 'completed' && (
            <button className="adm-btn" onClick={() => onStatus(b.id, 'completed')}
              style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
              <Icon.Check/> Fertig
            </button>
          )}
          {st !== 'cancelled' && (
            <button className="adm-btn" onClick={() => onStatus(b.id, 'cancelled')}
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
              <Icon.Close/> Storno
            </button>
          )}
          {st !== 'pending' && (
            <button className="adm-btn" onClick={() => onStatus(b.id, 'pending')}
              style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
              <Icon.Refresh/> Reset
            </button>
          )}
        </div>
        {b.email && (
          <button className="adm-btn" onClick={handleEmail} disabled={sendingEmail}
            style={{ background: emailSent ? '#ECFDF5' : '#EEF2FF', color: emailSent ? '#059669' : '#6366F1', border: `1px solid ${emailSent ? '#A7F3D0' : '#C7D2FE'}`, padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, opacity: sendingEmail ? .6 : 1 }}>
            {sendingEmail ? <><Icon.Refresh spin/> Sende...</> : emailSent ? <><Icon.Check/> Gesendet</> : <><Icon.Send/> E-Mail</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MINI BAR CHART ────────────────────────────────────────────────────────────
function MiniBar({ bookings }) {
  const BAR_H = 80;
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const str = d.toISOString().split('T')[0];
    return { label: d.toLocaleDateString('de-DE', { weekday: 'short' }), count: bookings.filter(b => b.date === str).length, today: str === today() };
  });
  const max = Math.max(...last7.map(d => d.count), 1);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: BAR_H + 32, padding: '0 4px' }}>
      {last7.map((d, i) => {
        const pct  = d.count / max;
        const barH = d.count === 0 ? 4 : Math.max(pct * BAR_H, 14);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: '100%', justifyContent: 'flex-end' }}>
            {/* Count label */}
            <span style={{ fontSize: 11, fontWeight: 700, color: d.today ? '#6366F1' : d.count ? '#475569' : 'transparent', marginBottom: 4, lineHeight: 1 }}>
              {d.count || '·'}
            </span>
            {/* Bar */}
            <div style={{
              width: '100%', borderRadius: '6px 6px 4px 4px',
              background: d.today ? 'linear-gradient(180deg,#818CF8,#6366F1)' : d.count ? '#C7D2FE' : '#F1F5F9',
              height: barH, transition: 'height .4s ease',
              boxShadow: d.today ? '0 2px 8px rgba(99,102,241,.35)' : 'none',
            }}/>
            {/* Day label */}
            <span style={{ fontSize: 10, color: d.today ? '#6366F1' : '#94A3B8', fontWeight: d.today ? 700 : 500, marginTop: 5 }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, bg, borderColor }) {
  return (
    <div className="stat-card" style={{ background: bg, borderColor }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.06em', opacity: .8 }}>{label}</div>
      <div style={{ fontSize: 42, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color, opacity: .7, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

// ─── TOAST NOTIFICATION ────────────────────────────────────────────────────────
function Toast({ msg, ok }) {
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999999, background: ok ? '#1E293B' : '#7F1D1D', color: '#fff', padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 10px 40px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn .25s ease-out' }}>
      {ok ? <Icon.Check/> : <Icon.Close/>} {msg}
    </div>
  );
}

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw]         = useState('');
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await fetch('/api/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw.trim() }) });
      const d = await r.json();
      if (d.success) onLogin();
      else setError(d.error || 'Falsches Passwort');
    } catch { setError('Verbindungsfehler.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[['-10%','20%',300,0.06],['-5%','65%',200,0.04],['60%','-10%',350,0.05],['80%','70%',250,0.04]].map(([x,y,s,o],i) => (
          <div key={i} style={{ position:'absolute', left:x, top:y, width:s, height:s, borderRadius:'50%', background:'rgba(99,102,241,1)', opacity:o, filter:'blur(60px)' }}/>
        ))}
      </div>

      <form onSubmit={submit} style={{ position: 'relative', background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(20px)', padding: '52px 44px', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,.4)', width: '100%', maxWidth: 400, animation: 'fadeIn .4s ease-out' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(99,102,241,.4)', color: '#fff' }}>
            <Icon.Lock/>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>Admin Zugang</h2>
          <p style={{ color: '#64748B', fontSize: 14 }}>AutoService Oberhausen · Verwaltung</p>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Passwort</label>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              className="adm-input"
              placeholder="Passwort eingeben…"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              required
              autoFocus
              style={{ paddingRight: 44, borderColor: error ? '#EF4444' : undefined }}
            />
            <button type="button" onClick={() => setShow(s => !s)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
              <Icon.Eye show={show}/>
            </button>
          </div>
          {error && <div style={{ marginTop: 8, fontSize: 13, color: '#EF4444', fontWeight: 600 }}>{error}</div>}
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#818CF8' : 'linear-gradient(135deg,#6366F1,#4F46E5)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(99,102,241,.4)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? <><Icon.Refresh spin/> Wird geprüft…</> : 'Anmelden'}
        </button>
      </form>
    </div>
  );
}

// ─── CALENDAR VIEW ─────────────────────────────────────────────────────────────
function CalendarView({ bookings, onStatus }) {
  const [cur, setCur]           = useState(new Date());
  const [selected, setSelected] = useState('');

  const y = cur.getFullYear(), m = cur.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const startDay    = (() => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; })();
  const todayStr    = today();
  const selectedBookings = bookings.filter(b => b.date === selected);

  const bookingsByDate = {};
  bookings.forEach(b => { if (!bookingsByDate[b.date]) bookingsByDate[b.date] = []; bookingsByDate[b.date].push(b); });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Calendar Card */}
      <div className="adm-card" style={{ padding: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button className="adm-btn" onClick={() => setCur(new Date(y, m - 1, 1))}
            style={{ background: '#F1F5F9', color: '#475569', padding: '8px 12px', borderRadius: 9 }}>
            <Icon.ChevronLeft/>
          </button>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
            {MONTHS_DE[m]} {y}
          </h3>
          <button className="adm-btn" onClick={() => setCur(new Date(y, m + 1, 1))}
            style={{ background: '#F1F5F9', color: '#475569', padding: '8px 12px', borderRadius: 9 }}>
            <Icon.ChevronRight/>
          </button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em', padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {Array.from({ length: startDay }, (_, i) => <div key={`e-${i}`}/>)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const dayBookings = bookingsByDate[dateStr] || [];
            const isToday    = dateStr === todayStr;
            const isSel      = dateStr === selected;

            return (
              <div key={day} className={`cal-day${isSel?' selected':''}${isToday?' today-day':''}`}
                onClick={() => setSelected(isSel ? '' : dateStr)}>
                <span style={{ fontSize: 13, fontWeight: isToday ? 800 : 600, color: isSel ? '#4F46E5' : isToday ? '#6366F1' : '#1E293B' }}>{day}</span>
                {dayBookings.length > 0 && (
                  <div style={{ marginTop: 'auto', paddingTop: 4 }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: dayBookings.length > 3 ? 2 : 0 }}>
                      {dayBookings.slice(0, 3).map((b, j) => (
                        <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: ST[validStatus(b.status)].color, flexShrink: 0, boxShadow: `0 1px 3px ${ST[validStatus(b.status)].color}66` }}/>
                      ))}
                    </div>
                    {dayBookings.length > 3 && (
                      <span style={{ fontSize: 9, color: '#6366F1', fontWeight: 800, letterSpacing: '-.01em' }}>+{dayBookings.length - 3} mehr</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(ST).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 500 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: v.color }}/>
            {v.label}
          </div>
        ))}
      </div>

      {/* Selected day bookings */}
      {selected && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1E293B' }}>
              Termine am {fmtDate(selected)}
            </h3>
            <span style={{ fontSize: 13, color: '#6366F1', fontWeight: 700 }}>{selectedBookings.length} Termin{selectedBookings.length !== 1 ? 'e' : ''}</span>
          </div>
          {selectedBookings.length === 0 ? (
            <div className="adm-card" style={{ padding: '40px 24px', textAlign: 'center', color: '#94A3B8' }}>
              Keine Termine an diesem Tag.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedBookings.sort((a,b) => (a.time_slot||'').localeCompare(b.time_slot||'')).map(b => <BookingCard key={b.id} b={b} onStatus={onStatus}/>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LIST VIEW ─────────────────────────────────────────────────────────────────
function ListView({ bookings, onStatus }) {
  const [search, setSearch]   = useState('');
  const [tab, setTab]         = useState('all');
  const [sort, setSort]       = useState('date_desc');

  const filtered = bookings.filter(b => {
    const q  = search.toLowerCase();
    const ok = !q || [b.name, b.plate, b.phone, b.email, b.service].some(v => (v||'').toLowerCase().includes(q));
    const st = validStatus(b.status);
    return ok && (tab === 'all' || st === tab);
  }).sort((a, b) => {
    if (sort === 'date_desc') return (b.date+b.time_slot) > (a.date+a.time_slot) ? 1 : -1;
    if (sort === 'date_asc')  return (a.date+a.time_slot) > (b.date+b.time_slot) ? 1 : -1;
    if (sort === 'name')      return (a.name||'').localeCompare(b.name||'');
    return 0;
  });

  const tabs = [
    { id: 'all',       label: `Alle (${bookings.length})` },
    { id: 'pending',   label: `Ausstehend (${bookings.filter(b => validStatus(b.status)==='pending').length})` },
    { id: 'completed', label: `Abgeschlossen (${bookings.filter(b => validStatus(b.status)==='completed').length})` },
    { id: 'cancelled', label: `Storniert (${bookings.filter(b => validStatus(b.status)==='cancelled').length})` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div className="adm-card" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 240, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 12, color: '#94A3B8' }}><Icon.Search/></span>
          <input className="adm-input" placeholder="Name, Kennzeichen, Telefon, E-Mail…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }}/>
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}><Icon.Close/></button>
          )}
        </div>

        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: '#475569', background: '#F8FAFC', cursor: 'pointer', outline: 'none' }}>
          <option value="date_desc">Neueste zuerst</option>
          <option value="date_asc">Älteste zuerst</option>
          <option value="name">Name A–Z</option>
        </select>

        {/* Export */}
        <button className="adm-btn" onClick={() => exportCSV(filtered)}
          style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
          <Icon.Export/> CSV Export
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} className={`filter-tab${tab===t.id?' active':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="adm-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ color: '#94A3B8', fontSize: 15, fontWeight: 500 }}>Keine passenden Buchungen gefunden.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(b => <BookingCard key={b.id} b={b} onStatus={onStatus}/>)}
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD VIEW ────────────────────────────────────────────────────────────
function DashboardView({ bookings, onStatus }) {
  const todayStr   = today();
  const todayList  = bookings.filter(b => b.date === todayStr).sort((a, b) => (a.time_slot||'').localeCompare(b.time_slot||''));
  const pending    = bookings.filter(b => validStatus(b.status) === 'pending');
  const completed  = bookings.filter(b => validStatus(b.status) === 'completed');
  const cancelled  = bookings.filter(b => validStatus(b.status) === 'cancelled');

  // Next upcoming pending
  const upcoming = bookings
    .filter(b => validStatus(b.status) === 'pending' && b.date >= todayStr)
    .sort((a, b) => (a.date + a.time_slot) > (b.date + b.time_slot) ? 1 : -1)
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Heute" value={todayList.length} sub={`${todayStr}`} color="#6366F1" bg="#EEF2FF" borderColor="#C7D2FE"/>
        <StatCard label="Ausstehend" value={pending.length} sub="Warten auf Bearbeitung" color="#D97706" bg="#FFFBEB" borderColor="#FDE68A"/>
        <StatCard label="Abgeschlossen" value={completed.length} sub="Erfolgreich" color="#059669" bg="#ECFDF5" borderColor="#A7F3D0"/>
        <StatCard label="Storniert" value={cancelled.length} sub="Gesamt" color="#DC2626" bg="#FEF2F2" borderColor="#FECACA"/>
      </div>

      {/* Weekly Chart + Upcoming */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flexWrap: 'wrap' }}>
        <div className="adm-card" style={{ padding: '22px 24px' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>Buchungen — letzte 7 Tage</h4>
          <MiniBar bookings={bookings}/>
        </div>
        <div className="adm-card" style={{ padding: '22px 24px' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Nächste ausstehende</h4>
          {upcoming.length === 0 ? (
            <div style={{ color: '#94A3B8', fontSize: 13, fontStyle: 'italic' }}>Keine ausstehenden Termine.</div>
          ) : upcoming.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: 46, textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{b.date ? new Date(b.date+'T00:00').toLocaleDateString('de-DE',{weekday:'short'}) : ''}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{(b.time_slot||'').slice(0,5)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{b.service} · {b.plate}</div>
              </div>
              <button className="adm-btn" onClick={() => onStatus(b.id, 'completed')}
                style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                <Icon.Check/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's appointments */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.Today/> Heute · {todayStr}
          </h3>
          <span style={{ fontSize: 13, color: '#6366F1', fontWeight: 700 }}>{todayList.length} Termin{todayList.length !== 1 ? 'e' : ''}</span>
        </div>
        {todayList.length === 0 ? (
          <div className="adm-card" style={{ padding: '50px 24px', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>☀️</div>
            Heute keine Termine geplant.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayList.map(b => <BookingCard key={b.id} b={b} onStatus={onStatus}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PANEL ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [auth, setAuth]         = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [view, setView]         = useState('dashboard');
  const [toast, setToast]       = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await fetchBookings());
    } catch (e) {
      showToast('Fehler beim Laden der Daten.', false);
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { if (auth) loadData(); }, [auth, loadData]);

  const handleStatus = useCallback(async (id, status) => {
    try {
      await patchStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      const label = ST[status]?.label || status;
      showToast(`Status geändert: ${label}`);
    } catch { showToast('Fehler beim Aktualisieren.', false); }
  }, [showToast]);

  if (!auth) return (
    <>
      <style>{STYLE}</style>
      <LoginScreen onLogin={() => setAuth(true)}/>
    </>
  );

  const navItems = [
    { id: 'dashboard', label: 'Übersicht',      Icon: Icon.Dashboard },
    { id: 'calendar',  label: 'Kalender',        Icon: Icon.Calendar  },
    { id: 'list',      label: 'Alle Buchungen',  Icon: Icon.List      },
  ];

  const titles = { dashboard: 'Dashboard', calendar: 'Kalender', list: 'Buchungsverwaltung' };

  return (
    <>
      <style>{STYLE}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', fontFamily: '"Inter", sans-serif', background: '#F1F5F9' }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <aside style={{ width: sidebarOpen ? 240 : 72, background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width .2s ease', overflow: 'hidden' }}>
          {/* Logo */}
          <div style={{ padding: '22px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,.08)', cursor: 'pointer' }} onClick={() => setSidebarOpen(o => !o)}>
            <Icon.Logo/>
            {sidebarOpen && <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-.01em' }}>AutoService</div>}
          </div>

          {/* Nav */}
          <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setView(item.id)}
                className={`adm-nav-btn${view === item.id ? ' active' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
                style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                <item.Icon active={view === item.id}/>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Total bookings badge */}
          {sidebarOpen && (
            <div style={{ margin: '0 12px 12px', background: 'rgba(99,102,241,.2)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(165,180,252,.15)' }}>
              <div style={{ fontSize: 11, color: '#A5B4FC', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Buchungen gesamt</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{bookings.length}</div>
            </div>
          )}

          {/* Logout */}
          <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
            <button className="adm-nav-btn" onClick={() => { window.location.hash = ''; }}
              style={{ color: '#F87171', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <Icon.Logout/>
              {sidebarOpen && 'Abmelden'}
            </button>
          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <header style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', margin: 0 }}>{titles[view]}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>
                {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <button className="adm-btn" onClick={loadData} disabled={loading}
                style={{ background: '#EEF2FF', color: '#6366F1', border: '1.5px solid #C7D2FE', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
                <Icon.Refresh spin={loading}/> {loading ? 'Lädt…' : 'Aktualisieren'}
              </button>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
            {loading && bookings.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', paddingTop: 60, color: '#94A3B8' }}>
                <Icon.Refresh spin/>
                <span style={{ fontSize: 14 }}>Daten werden geladen…</span>
              </div>
            ) : (
              <>
                {view === 'dashboard' && <DashboardView bookings={bookings} onStatus={handleStatus}/>}
                {view === 'calendar'  && <CalendarView  bookings={bookings} onStatus={handleStatus}/>}
                {view === 'list'      && <ListView      bookings={bookings} onStatus={handleStatus}/>}
              </>
            )}
          </main>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok}/>}
    </>
  );
}
