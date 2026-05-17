import React, { useState, useEffect, useCallback, useRef } from 'react';

const SUPABASE_URL = "https://cglzccturchfveajhtqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0UWfCaMn2o-BQXTCfww3tg_2BNkOv9m";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="url(#lg)"/>
      <path d="M7 14l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4F46E5"/></linearGradient></defs>
    </svg>
  ),
  Dashboard: ({active}) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.5:2}>
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  Table: ({active}) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.5:2}>
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/>
    </svg>
  ),
  Scheduler: ({active}) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2.5:2}>
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      <circle cx="8" cy="15" r="1.5" fill="currentColor"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Close: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Refresh: ({spin}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      style={{animation: spin ? 'spin 0.8s linear infinite' : 'none'}}>
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9"/>
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
  Copy: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Export: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Send: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Lock: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Grip: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/>
      <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
      <circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  Note: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Stats: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Car: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  ),
};

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const ST = {
  pending:   { label: 'Ausstehend',    color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', dark: '#B45309', dot: '#F59E0B' },
  completed: { label: 'Abgeschlossen', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', dark: '#047857', dot: '#10B981' },
  cancelled: { label: 'Storniert',     color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', dark: '#B91C1C', dot: '#EF4444' },
};
const validStatus = s => (s && ST[s]) ? s : 'pending';

// ─── SUPABASE API ──────────────────────────────────────────────────────────────
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };
async function apiFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: H, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return (opts.method === 'PATCH' || opts.method === 'DELETE') ? null : res.json();
}
const fetchBookings = () => apiFetch('bookings?order=date.desc,time_slot.asc');
const patchStatus   = (id, status) => apiFetch(`bookings?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ status }), headers: { ...H, Prefer: 'return=minimal' } });
const patchBooking  = (id, fields) => apiFetch(`bookings?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(fields), headers: { ...H, Prefer: 'return=minimal' } });

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];
const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDateShort = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—';
const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const WEEKDAYS  = ['Mo','Di','Mi','Do','Fr','Sa','So'];

// Generate time slots 08:00–18:00 in 30-min steps
const TIME_SLOTS = [];
for (let h = 8; h <= 18; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2,'0')}:00`);
  if (h < 18) TIME_SLOTS.push(`${String(h).padStart(2,'0')}:30`);
}

function exportCSV(bookings) {
  const cols = ['Datum','Uhrzeit','Name','Kennzeichen','Fahrzeugtyp','Service','Telefon','E-Mail','Status','Anmerkungen'];
  const rows = bookings.map(b => [b.date,b.time_slot,b.name,b.plate,b.vehicle_type,b.service,b.phone,b.email,b.status,b.notes||''].map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(','));
  const blob = new Blob(['﻿' + [cols.join(','),...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `termine_${today()}.csv` });
  a.click();
}

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:5px;height:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  @keyframes slideIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:none}}
  .adm-btn{cursor:pointer;border:none;font-family:inherit;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
  .adm-btn:active{transform:scale(.97)}
  .adm-card{background:#fff;border-radius:8px;border:1px solid #E2E8F0}
  .adm-nav-btn{width:100%;display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:6px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:13.5px;font-weight:500;color:#94A3B8;transition:all .15s;text-align:left}
  .adm-nav-btn:hover{background:rgba(255,255,255,.07);color:#E2E8F0}
  .adm-nav-btn.active{background:rgba(99,102,241,.22);color:#C7D2FE;font-weight:700}
  .adm-input{width:100%;padding:8px 12px;border:1.5px solid #E2E8F0;border-radius:6px;font-size:13px;font-family:inherit;color:#1E293B;background:#fff;outline:none;transition:border-color .15s;height:36px}
  .adm-input:focus{border-color:#6366F1;background:#fff}
  .adm-select{padding:0 10px;border:1.5px solid #E2E8F0;border-radius:6px;font-size:13px;font-family:inherit;color:#475569;background:#fff;cursor:pointer;outline:none;height:36px;transition:border-color .15s}
  .adm-select:focus{border-color:#6366F1}
  .tbl-th{padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.07em;text-align:left;background:#F8FAFC;border-bottom:1px solid #E2E8F0;white-space:nowrap;cursor:pointer;user-select:none;transition:color .15s}
  .tbl-th:hover{color:#475569}
  .tbl-td{padding:10px 12px;border-bottom:1px solid #F1F5F9;vertical-align:middle;font-size:13px}
  .tbl-tr{transition:background .12s;animation:fadeUp .18s ease-out}
  .tbl-tr:hover{background:#F8FAFC}
  .tbl-tr:last-child .tbl-td{border-bottom:none}
  .copy-btn{background:none;border:none;cursor:pointer;color:#CBD5E1;padding:3px 4px;border-radius:4px;display:inline-flex;align-items:center;transition:color .15s}
  .copy-btn:hover{color:#6366F1;background:#EEF2FF}
  .sched-row{display:flex;min-height:48px;border-bottom:1px solid #F1F5F9;transition:background .12s}
  .sched-row.half{border-bottom:1px dashed #F1F5F9;min-height:38px}
  .sched-row.drag-over{background:#EEF2FF !important}
  .sched-chip{display:flex;align-items:center;gap:7px;padding:5px 10px;border-radius:5px;cursor:grab;animation:fadeUp .2s ease-out;font-size:12px;font-weight:600;transition:box-shadow .15s;user-select:none}
  .sched-chip:hover{box-shadow:0 2px 8px rgba(0,0,0,.12)}
  .sched-chip:active{cursor:grabbing}
  .stat-card{padding:20px 22px;border-radius:8px;border:1px solid transparent}
  .toast-item{display:flex;align-items:center;gap:9px;padding:12px 18px;border-radius:6px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.18);animation:toastIn .25s cubic-bezier(.22,1,.36,1);margin-top:8px;min-width:260px}
  .inline-notes{font-size:12px;color:#94A3B8;cursor:text;padding:3px 6px;border-radius:4px;border:1.5px dashed transparent;transition:all .15s;display:block;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .inline-notes:hover{border-color:#C7D2FE;color:#475569}
  .status-sel{padding:4px 8px;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;outline:none;border-width:1.5px;border-style:solid;transition:all .15s}
  .filter-chip{padding:5px 14px;border-radius:5px;border:1.5px solid #E2E8F0;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;background:#F8FAFC;color:#64748B}
  .filter-chip:hover{border-color:#C7D2FE;color:#6366F1}
  .filter-chip.active{background:#EEF2FF;border-color:#6366F1;color:#4F46E5}
`;

// ─── TOAST STACK ───────────────────────────────────────────────────────────────
function ToastStack({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999999, display: 'flex', flexDirection: 'column-reverse' }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-item" style={{ background: t.ok ? '#1E293B' : '#7F1D1D', color: '#fff' }}>
          {t.ok ? <Icon.Check/> : <Icon.Close/>}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = validStatus(status); const c = ST[s];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:4, fontSize:11, fontWeight:700, background:c.bg, color:c.dark, border:`1px solid ${c.border}`, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:c.color, flexShrink:0 }}/>
      {c.label}
    </span>
  );
}

// ─── INLINE STATUS SELECT ──────────────────────────────────────────────────────
function StatusSelect({ value, onChange }) {
  const s = validStatus(value); const c = ST[s];
  return (
    <select className="status-sel" value={s} onChange={e => onChange(e.target.value)}
      style={{ color: c.dark, background: c.bg, borderColor: c.border }}>
      <option value="pending">⏳ Ausstehend</option>
      <option value="completed">✅ Abgeschlossen</option>
      <option value="cancelled">❌ Storniert</option>
    </select>
  );
}

// ─── COPY BUTTON ───────────────────────────────────────────────────────────────
function CopyBtn({ value, showToast }) {
  const [copied, setCopied] = useState(false);
  const copy = async e => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast(`Kopiert: ${value}`);
      setTimeout(() => setCopied(false), 1500);
    } catch { showToast('Kopieren fehlgeschlagen', false); }
  };
  return (
    <button className="copy-btn" onClick={copy} title="Kopieren" style={{ color: copied ? '#10B981' : undefined }}>
      {copied ? <Icon.Check/> : <Icon.Copy/>}
    </button>
  );
}

// ─── MINI BAR CHART ────────────────────────────────────────────────────────────
function MiniBar({ bookings }) {
  const BAR_H = 72;
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const str = d.toISOString().split('T')[0];
    return { label: d.toLocaleDateString('de-DE', { weekday: 'short' }), count: bookings.filter(b => b.date === str).length, isToday: str === today() };
  });
  const max = Math.max(...last7.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: BAR_H + 36, padding: '0 2px' }}>
      {last7.map((d, i) => {
        const barH = d.count === 0 ? 3 : Math.max((d.count / max) * BAR_H, 12);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: d.isToday ? '#6366F1' : d.count ? '#64748B' : 'transparent', marginBottom: 3 }}>{d.count || '·'}</span>
            <div style={{ width: '100%', borderRadius: '4px 4px 3px 3px', height: barH,
              background: d.isToday ? 'linear-gradient(180deg,#818CF8,#6366F1)' : d.count ? '#C7D2FE' : '#F1F5F9',
              boxShadow: d.isToday ? '0 2px 8px rgba(99,102,241,.3)' : 'none', transition: 'height .4s' }}/>
            <span style={{ fontSize: 10, color: d.isToday ? '#6366F1' : '#94A3B8', fontWeight: d.isToday ? 700 : 500, marginTop: 4 }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await fetch('/api/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw.trim() }) });
      const d = await r.json();
      if (d.success) onLogin(); else setError(d.error || 'Falsches Passwort');
    } catch { setError('Verbindungsfehler.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'linear-gradient(135deg,#1E1B4B,#312E81,#1E1B4B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter",sans-serif' }}>
      {[['-10%','20%',320,0.06],['60%','-10%',280,0.05],['75%','70%',220,0.04]].map(([x,y,s,o],i) => (
        <div key={i} style={{ position:'absolute', left:x, top:y, width:s, height:s, borderRadius:'50%', background:'rgba(99,102,241,1)', opacity:o, filter:'blur(60px)', pointerEvents:'none' }}/>
      ))}
      <form onSubmit={submit} style={{ position:'relative', background:'rgba(255,255,255,.97)', backdropFilter:'blur(20px)', padding:'48px 40px', borderRadius:12, boxShadow:'0 32px 80px rgba(0,0,0,.4)', width:'100%', maxWidth:380, animation:'fadeUp .4s ease-out' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#6366F1,#4F46E5)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 6px 20px rgba(99,102,241,.4)', color:'#fff' }}><Icon.Lock/></div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#1E293B', marginBottom:4 }}>Admin Zugang</h2>
          <p style={{ color:'#64748B', fontSize:13 }}>AutoService Oberhausen · Verwaltung</p>
        </div>
        <div style={{ marginBottom:18, position:'relative' }}>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#374151', marginBottom:7, textTransform:'uppercase', letterSpacing:'.06em' }}>Passwort</label>
          <div style={{ position:'relative' }}>
            <input type={show?'text':'password'} className="adm-input" placeholder="Passwort eingeben…" value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }} required autoFocus style={{ paddingRight:40, height:42, borderColor: error ? '#EF4444' : undefined }}/>
            <button type="button" onClick={() => setShow(s => !s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex' }}>
              <Icon.Eye show={show}/>
            </button>
          </div>
          {error && <div style={{ marginTop:7, fontSize:12, color:'#EF4444', fontWeight:600 }}>{error}</div>}
        </div>
        <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background: loading?'#818CF8':'linear-gradient(135deg,#6366F1,#4F46E5)', color:'#fff', border:'none', borderRadius:6, fontSize:14, fontWeight:700, cursor: loading?'not-allowed':'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(99,102,241,.4)', transition:'all .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {loading ? <><Icon.Refresh spin/> Wird geprüft…</> : 'Anmelden'}
        </button>
      </form>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardView({ bookings, onStatus, showToast }) {
  const todayStr  = today();
  const todayList = bookings.filter(b => b.date === todayStr).sort((a, b) => (a.time_slot||'').localeCompare(b.time_slot||''));
  const pending   = bookings.filter(b => validStatus(b.status) === 'pending');
  const completed = bookings.filter(b => validStatus(b.status) === 'completed');
  const cancelled = bookings.filter(b => validStatus(b.status) === 'cancelled');
  const upcoming  = bookings.filter(b => validStatus(b.status) === 'pending' && b.date >= todayStr).sort((a, b) => (a.date+a.time_slot) > (b.date+b.time_slot) ? 1 : -1).slice(0, 6);

  const stats = [
    { label: 'Heute', value: todayList.length, sub: new Date().toLocaleDateString('de-DE',{weekday:'long'}), color:'#4F46E5', bg:'#EEF2FF', border:'#C7D2FE' },
    { label: 'Ausstehend', value: pending.length, sub: 'Offen', color:'#B45309', bg:'#FFFBEB', border:'#FDE68A' },
    { label: 'Abgeschlossen', value: completed.length, sub: 'Gesamt', color:'#047857', bg:'#ECFDF5', border:'#A7F3D0' },
    { label: 'Storniert', value: cancelled.length, sub: 'Gesamt', color:'#B91C1C', bg:'#FEF2F2', border:'#FECACA' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ background:s.bg, borderColor:s.border }}>
            <div style={{ fontSize:10, fontWeight:800, color:s.color, textTransform:'uppercase', letterSpacing:'.1em', opacity:.75 }}>{s.label}</div>
            <div style={{ fontSize:38, fontWeight:800, color:s.color, lineHeight:1.1, letterSpacing:'-.02em' }}>{s.value}</div>
            <div style={{ fontSize:11, color:s.color, opacity:.65, fontWeight:500 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Upcoming */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="adm-card" style={{ padding:'20px 22px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
            <Icon.Stats/> Letzte 7 Tage
          </div>
          <MiniBar bookings={bookings}/>
        </div>

        <div className="adm-card" style={{ padding:'20px 22px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
            <Icon.Clock/> Nächste ausstehende
          </div>
          {upcoming.length === 0 ? (
            <div style={{ color:'#CBD5E1', fontSize:13, fontStyle:'italic' }}>Keine ausstehenden Termine.</div>
          ) : upcoming.map(b => (
            <div key={b.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
              <div style={{ width:44, textAlign:'center', flexShrink:0 }}>
                <div style={{ fontSize:10, color:'#94A3B8', fontWeight:600 }}>{b.date ? new Date(b.date+'T00:00').toLocaleDateString('de-DE',{weekday:'short'}) : ''} {fmtDateShort(b.date)}</div>
                <div style={{ fontSize:15, fontWeight:800, color:'#1E293B', letterSpacing:'-.01em' }}>{(b.time_slot||'').slice(0,5)}</div>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1E293B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.name}</div>
                <div style={{ fontSize:11, color:'#94A3B8' }}>{b.plate} · {(b.service||'').split('(')[0].trim()}</div>
              </div>
              <button className="adm-btn" onClick={() => onStatus(b.id, 'completed')}
                style={{ background:'#ECFDF5', color:'#047857', border:'1px solid #A7F3D0', padding:'4px 10px', borderRadius:5, fontSize:11, fontWeight:700, flexShrink:0, gap:4 }}>
                <Icon.Check/> Fertig
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today timeline */}
      <div className="adm-card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#1E293B', display:'flex', alignItems:'center', gap:8 }}>
            <Icon.Clock/> Heute · {new Date().toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'})}
          </div>
          <span style={{ background:'#EEF2FF', color:'#4F46E5', padding:'3px 12px', borderRadius:4, fontSize:12, fontWeight:700 }}>
            {todayList.length} Termin{todayList.length !== 1 ? 'e' : ''}
          </span>
        </div>
        {todayList.length === 0 ? (
          <div style={{ padding:'48px 24px', textAlign:'center', color:'#94A3B8', fontSize:14 }}>☀️ &nbsp;Heute keine Termine geplant.</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  {['Zeit','Kunde','Fahrzeug','Service','Status','Aktion'].map(h => (
                    <th key={h} className="tbl-th" style={{ cursor:'default' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayList.map(b => {
                  const st = validStatus(b.status);
                  return (
                    <tr key={b.id} className="tbl-tr" style={{ borderLeft:`3px solid ${ST[st].color}` }}>
                      <td className="tbl-td"><span style={{ fontWeight:700, fontSize:15, color:'#1E293B', letterSpacing:'-.01em' }}>{(b.time_slot||'').slice(0,5)}</span></td>
                      <td className="tbl-td">
                        <div style={{ fontWeight:600, color:'#1E293B' }}>{b.name}</div>
                        <div style={{ fontSize:11, color:'#94A3B8' }}>{b.phone}</div>
                      </td>
                      <td className="tbl-td">
                        <span style={{ background:'#EEF2FF', color:'#4F46E5', padding:'2px 8px', borderRadius:4, fontSize:12, fontWeight:700 }}>{b.plate||'—'}</span>
                      </td>
                      <td className="tbl-td" style={{ color:'#475569', maxWidth:130 }}>
                        <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.service||'—'}</div>
                      </td>
                      <td className="tbl-td"><StatusBadge status={b.status}/></td>
                      <td className="tbl-td">
                        <StatusSelect value={b.status} onChange={v => onStatus(b.id, v)}/>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DATA TABLE VIEW ───────────────────────────────────────────────────────────
function TableView({ bookings, onStatus, onPatch, showToast }) {
  const [search, setSearch]       = useState('');
  const [statusF, setStatusF]     = useState('all');
  const [dateF, setDateF]         = useState('all');
  const [serviceF, setServiceF]   = useState('all');
  const [sortCol, setSortCol]     = useState('date');
  const [sortDir, setSortDir]     = useState('desc');
  const [editId, setEditId]       = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [sending, setSending]     = useState(null);

  const todayStr = today(); const tomStr = tomorrow();
  const weekEnd  = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const services = [...new Set(bookings.map(b => b.service).filter(Boolean))];

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const ms = !q || [b.name, b.phone, b.plate, b.email, b.service].some(v => (v||'').toLowerCase().includes(q));
    const mst = statusF === 'all' || validStatus(b.status) === statusF;
    const msv = serviceF === 'all' || b.service === serviceF;
    const md = dateF === 'all' ? true : dateF === 'today' ? b.date === todayStr : dateF === 'tomorrow' ? b.date === tomStr : dateF === 'week' ? b.date >= todayStr && b.date <= weekEnd : true;
    return ms && mst && msv && md;
  }).sort((a, b) => {
    const vals = { date: v => (v.date||'') + (v.time_slot||''), name: v => v.name||'', service: v => v.service||'', status: v => v.status||'' };
    const fn = vals[sortCol] || (v => v[sortCol]||'');
    const cmp = fn(a) > fn(b) ? 1 : fn(a) < fn(b) ? -1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const toggleSort = col => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('asc'); } };

  const saveNotes = async id => {
    try { await onPatch(id, { notes: editNotes || null }); setEditId(null); showToast('Notiz gespeichert'); }
    catch { showToast('Fehler beim Speichern', false); }
  };

  const handleEmail = async (b) => {
    setSending(b.id);
    try {
      await fetch('/api/send-confirmation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ bookingId: b.id }) });
      showToast(`E-Mail an ${b.email} gesendet`);
    } catch { showToast('E-Mail Fehler', false); }
    finally { setSending(null); }
  };

  const SortIcon = ({ col }) => sortCol !== col ? null : (
    <span style={{ marginLeft:3, opacity:.6, display:'inline-flex', verticalAlign:'middle' }}>
      {sortDir === 'asc' ? <Icon.ChevronUp/> : <Icon.ChevronDown/>}
    </span>
  );

  const statusCounts = { all: bookings.length, pending: bookings.filter(b => validStatus(b.status)==='pending').length, completed: bookings.filter(b => validStatus(b.status)==='completed').length, cancelled: bookings.filter(b => validStatus(b.status)==='cancelled').length };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Toolbar */}
      <div className="adm-card" style={{ padding:'12px 14px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:200, position:'relative', display:'flex', alignItems:'center' }}>
          <span style={{ position:'absolute', left:10, color:'#94A3B8', pointerEvents:'none' }}><Icon.Search/></span>
          <input className="adm-input" placeholder="Name, Kennzeichen, Telefon suchen…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:32 }}/>
          {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:8, background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex' }}><Icon.Close/></button>}
        </div>
        <select className="adm-select" value={dateF} onChange={e => setDateF(e.target.value)}>
          <option value="all">Alle Daten</option>
          <option value="today">Heute</option>
          <option value="tomorrow">Morgen</option>
          <option value="week">Diese Woche</option>
        </select>
        <select className="adm-select" value={serviceF} onChange={e => setServiceF(e.target.value)}>
          <option value="all">Alle Leistungen</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="adm-btn" onClick={() => exportCSV(filtered)} style={{ background:'#F8FAFC', color:'#475569', border:'1.5px solid #E2E8F0', padding:'0 14px', height:36, borderRadius:6, fontSize:13, fontWeight:600 }}>
          <Icon.Export/> CSV
        </button>
      </div>

      {/* Status filter chips */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
        {[['all','Alle'],['pending','Ausstehend'],['completed','Abgeschlossen'],['cancelled','Storniert']].map(([k,l]) => (
          <button key={k} className={`filter-chip${statusF===k?' active':''}`} onClick={() => setStatusF(k)}>
            {l} <span style={{ opacity:.65, fontSize:11 }}>({statusCounts[k]})</span>
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'#94A3B8', fontWeight:500 }}>{filtered.length} von {bookings.length} Einträgen</span>
      </div>

      {/* Table */}
      <div className="adm-card" style={{ overflow:'hidden', padding:0 }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:800 }}>
            <thead>
              <tr>
                {[['date','Zeit / Datum'],['name','Kunde'],['plate','Fahrzeug'],['service','Leistung'],['status','Status'],['','Notizen'],['','Aktionen']].map(([col,label]) => (
                  <th key={label} className="tbl-th" onClick={() => col && toggleSort(col)} style={{ cursor: col ? 'pointer' : 'default' }}>
                    {label}{col && <SortIcon col={col}/>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:'52px', textAlign:'center', color:'#94A3B8', fontSize:14 }}>🔍 Keine Ergebnisse gefunden.</td></tr>
              ) : filtered.map(b => {
                const st = validStatus(b.status);
                return (
                  <tr key={b.id} className="tbl-tr" style={{ borderLeft:`3px solid ${ST[st].color}` }}>
                    {/* Zeit */}
                    <td className="tbl-td" style={{ whiteSpace:'nowrap' }}>
                      <div style={{ fontWeight:700, fontSize:14, color:'#1E293B', letterSpacing:'-.01em' }}>{(b.time_slot||'--:--').slice(0,5)}</div>
                      <div style={{ fontSize:11, color:'#94A3B8', marginTop:1 }}>{fmtDate(b.date)}</div>
                    </td>
                    {/* Kunde */}
                    <td className="tbl-td">
                      <div style={{ fontWeight:600, color:'#1E293B', marginBottom:2 }}>{b.name||'—'}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:2, fontSize:12, color:'#64748B' }}>
                        {b.phone}
                        {b.phone && <CopyBtn value={b.phone} showToast={showToast}/>}
                      </div>
                      {b.email && (
                        <div style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, color:'#94A3B8' }}>
                          {b.email}
                          <CopyBtn value={b.email} showToast={showToast}/>
                        </div>
                      )}
                    </td>
                    {/* Fahrzeug */}
                    <td className="tbl-td">
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                        <span style={{ background:'#EEF2FF', color:'#4F46E5', padding:'2px 8px', borderRadius:4, fontSize:12, fontWeight:700 }}>{b.plate||'—'}</span>
                        {b.plate && <CopyBtn value={b.plate} showToast={showToast}/>}
                      </div>
                      <div style={{ fontSize:11, color:'#94A3B8' }}>{b.vehicle_type||'—'}</div>
                    </td>
                    {/* Leistung */}
                    <td className="tbl-td" style={{ maxWidth:140 }}>
                      <div style={{ fontSize:12, color:'#475569', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={b.service}>{b.service||'—'}</div>
                    </td>
                    {/* Status inline */}
                    <td className="tbl-td">
                      <StatusSelect value={b.status} onChange={v => onStatus(b.id, v)}/>
                    </td>
                    {/* Notizen inline edit */}
                    <td className="tbl-td">
                      {editId === b.id ? (
                        <div style={{ display:'flex', gap:4, minWidth:150 }}>
                          <input value={editNotes} onChange={e => setEditNotes(e.target.value)} autoFocus
                            style={{ flex:1, padding:'4px 8px', border:'1.5px solid #6366F1', borderRadius:4, fontSize:12, fontFamily:'inherit', outline:'none', minWidth:0 }}
                            onKeyDown={e => { if (e.key==='Enter') saveNotes(b.id); if (e.key==='Escape') setEditId(null); }}/>
                          <button onClick={() => saveNotes(b.id)} style={{ background:'#ECFDF5', border:'none', borderRadius:4, cursor:'pointer', padding:'0 7px', color:'#047857', display:'flex', alignItems:'center' }}><Icon.Check/></button>
                          <button onClick={() => setEditId(null)} style={{ background:'#F1F5F9', border:'none', borderRadius:4, cursor:'pointer', padding:'0 7px', color:'#94A3B8', display:'flex', alignItems:'center' }}><Icon.Close/></button>
                        </div>
                      ) : (
                        <span className="inline-notes" onClick={() => { setEditId(b.id); setEditNotes(b.notes||''); }} title={b.notes||'Notiz hinzufügen'}>
                          {b.notes || <span style={{ fontStyle:'italic', fontSize:11 }}>+ Notiz</span>}
                        </span>
                      )}
                    </td>
                    {/* Aktionen */}
                    <td className="tbl-td">
                      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                        {b.email && (
                          <button className="adm-btn" onClick={() => handleEmail(b)} disabled={sending === b.id}
                            style={{ background:'#F1F5F9', color:'#475569', border:'1px solid #E2E8F0', padding:'4px 8px', borderRadius:5, fontSize:11, fontWeight:600, opacity: sending===b.id?.6:1 }}>
                            {sending === b.id ? <Icon.Refresh spin/> : <Icon.Send/>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SCHEDULER VIEW ────────────────────────────────────────────────────────────
function SchedulerView({ bookings, onStatus, onPatch, showToast }) {
  const [selDate, setSelDate]   = useState(today());
  const [dragId, setDragId]     = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [calOpen, setCalOpen]   = useState(false);
  const [calDate, setCalDate]   = useState(new Date());

  const dayBookings = bookings.filter(b => b.date === selDate);
  const bySlot = {};
  dayBookings.forEach(b => { const s = (b.time_slot||'').slice(0,5); if (!bySlot[s]) bySlot[s] = []; bySlot[s].push(b); });

  const changeDate = days => {
    const d = new Date(selDate + 'T00:00:00'); d.setDate(d.getDate() + days);
    setSelDate(d.toISOString().split('T')[0]);
  };

  const handleDrop = async slot => {
    if (!dragId) return;
    try {
      await onPatch(dragId, { time_slot: slot + ':00', date: selDate });
      showToast(`Termin auf ${slot} verschoben`);
    } catch { showToast('Fehler beim Verschieben', false); }
    setDragOver(null); setDragId(null);
  };

  // Mini calendar
  const y = calDate.getFullYear(), m = calDate.getMonth();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const startDay = (() => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1; })();
  const bDates = new Set(bookings.map(b => b.date));

  const selDateObj = new Date(selDate + 'T00:00:00');
  const isWeekend = selDateObj.getDay() === 0 || selDateObj.getDay() === 6;

  return (
    <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
      {/* Left: mini calendar picker */}
      <div className="adm-card" style={{ width:240, flexShrink:0, padding:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <button className="adm-btn" onClick={() => setCalDate(new Date(y,m-1,1))} style={{ background:'#F1F5F9', color:'#475569', padding:'5px 8px', borderRadius:5 }}><Icon.ChevronLeft/></button>
          <span style={{ fontSize:13, fontWeight:700, color:'#1E293B' }}>{MONTHS_DE[m].slice(0,3)} {y}</span>
          <button className="adm-btn" onClick={() => setCalDate(new Date(y,m+1,1))} style={{ background:'#F1F5F9', color:'#475569', padding:'5px 8px', borderRadius:5 }}><Icon.ChevronRight/></button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
          {WEEKDAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:700, color:'#CBD5E1', padding:'2px 0' }}>{d}</div>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
          {Array.from({length:startDay},(_,i) => <div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth},(_,i) => {
            const day = i+1;
            const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const isSel = ds === selDate; const isT = ds === today(); const hasB = bDates.has(ds);
            return (
              <button key={day} onClick={() => setSelDate(ds)}
                style={{ aspect:'1/1', border:'none', borderRadius:5, cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight: isSel?700:isT?700:400, transition:'all .12s',
                  background: isSel?'#6366F1':isT?'#EEF2FF':'transparent',
                  color: isSel?'#fff':isT?'#4F46E5':'#374151',
                  boxShadow: isSel?'0 2px 8px rgba(99,102,241,.3)':'none', position:'relative' }}>
                {day}
                {hasB && !isSel && <div style={{ position:'absolute', bottom:3, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:'#6366F1' }}/>}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop:12, paddingTop:10, borderTop:'1px solid #F1F5F9' }}>
          <button className="adm-btn" onClick={() => setSelDate(today())} style={{ width:'100%', justifyContent:'center', background:'#EEF2FF', color:'#4F46E5', border:'1px solid #C7D2FE', padding:'7px', borderRadius:5, fontSize:12, fontWeight:700 }}>
            Heute
          </button>
        </div>
        {/* Legend */}
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:5 }}>
          {Object.entries(ST).map(([k,v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#64748B' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:v.color, flexShrink:0 }}/>{v.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right: timeline */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
        {/* Day header */}
        <div className="adm-card" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
          <button className="adm-btn" onClick={() => changeDate(-1)} style={{ background:'#F1F5F9', color:'#475569', padding:'6px 10px', borderRadius:5 }}><Icon.ChevronLeft/></button>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#1E293B' }}>
              {selDateObj.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
            </div>
            <div style={{ fontSize:11, color:'#94A3B8', marginTop:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <span>{dayBookings.length} Termin{dayBookings.length!==1?'e':''}</span>
              {isWeekend && <span style={{ background:'#FEF2F2', color:'#B91C1C', padding:'1px 7px', borderRadius:3, fontSize:10, fontWeight:700 }}>Wochenende</span>}
            </div>
          </div>
          <button className="adm-btn" onClick={() => changeDate(1)} style={{ background:'#F1F5F9', color:'#475569', padding:'6px 10px', borderRadius:5 }}><Icon.ChevronRight/></button>
        </div>

        {/* Drag hint */}
        {dayBookings.length > 0 && (
          <div style={{ fontSize:12, color:'#94A3B8', display:'flex', alignItems:'center', gap:5 }}>
            <Icon.Grip/> Termine per Drag & Drop auf andere Uhrzeiten verschieben
          </div>
        )}

        {/* Timeline */}
        <div className="adm-card" style={{ overflow:'hidden', padding:0 }}>
          {TIME_SLOTS.map(slot => {
            const slotB = bySlot[slot] || [];
            const isHalf = slot.endsWith(':30');
            const isOver = dragOver === slot;
            const hasB = slotB.length > 0;
            return (
              <div key={slot}
                className={`sched-row${isHalf?' half':''}${isOver?' drag-over':''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(slot); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(slot)}
                style={{ background: isOver ? '#EEF2FF' : hasB ? '#FAFBFF' : 'transparent' }}>
                {/* Time */}
                <div style={{ width:68, flexShrink:0, padding:'0 12px', fontSize:12, fontWeight:isHalf?400:700, color:isHalf?'#CBD5E1':'#64748B', borderRight:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'flex-end', minHeight:'inherit' }}>
                  {slot}
                </div>
                {/* Content */}
                <div style={{ flex:1, padding: hasB||isOver ? '6px 12px' : '0 12px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', minHeight:'inherit' }}>
                  {isOver && !hasB && <span style={{ fontSize:11, color:'#6366F1', fontStyle:'italic', fontWeight:600 }}>↓ Hier ablegen</span>}
                  {slotB.map(b => {
                    const st = validStatus(b.status); const c = ST[st];
                    return (
                      <div key={b.id} className="sched-chip"
                        draggable onDragStart={() => setDragId(b.id)} onDragEnd={() => setDragId(null)}
                        style={{ background:c.bg, border:`1.5px solid ${c.border}`, opacity: dragId===b.id ? .5 : 1 }}>
                        <Icon.Grip/>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:c.color, flexShrink:0 }}/>
                        <span style={{ fontWeight:800, color:'#1E293B', fontSize:12 }}>{b.plate||'—'}</span>
                        <span style={{ color:'#475569' }}>{b.name}</span>
                        <span style={{ color:'#94A3B8', fontSize:11 }}>·</span>
                        <span style={{ color:'#64748B', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(b.service||'').replace('(','').replace(')','').split(' ').slice(0,2).join(' ')}</span>
                        <select value={st} onChange={e => onStatus(b.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{ padding:'2px 4px', border:'none', background:'transparent', fontSize:12, color:c.dark, fontWeight:700, cursor:'pointer', fontFamily:'inherit', outline:'none', marginLeft:2 }}>
                          <option value="pending">⏳</option>
                          <option value="completed">✅</option>
                          <option value="cancelled">❌</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
  const [toasts, setToasts]     = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toastId = useRef(0);

  const showToast = useCallback((msg, ok = true) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, msg, ok }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try { setBookings(await fetchBookings()); }
    catch { showToast('Fehler beim Laden.', false); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { if (auth) loadData(); }, [auth, loadData]);

  const handleStatus = useCallback(async (id, status) => {
    try {
      await patchStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      showToast(`Status: ${ST[status]?.label || status}`);
    } catch { showToast('Aktualisierung fehlgeschlagen.', false); }
  }, [showToast]);

  const handlePatch = useCallback(async (id, fields) => {
    await patchBooking(id, fields);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...fields } : b));
  }, []);

  if (!auth) return <><style>{STYLE}</style><LoginScreen onLogin={() => setAuth(true)}/></>;

  const navItems = [
    { id: 'dashboard', label: 'Übersicht',  Ico: Icon.Dashboard },
    { id: 'table',     label: 'Buchungen',   Ico: Icon.Table     },
    { id: 'scheduler', label: 'Tagesplan',   Ico: Icon.Scheduler },
  ];

  const titles = { dashboard: 'Dashboard', table: 'Buchungsverwaltung', scheduler: 'Tagesplan / Scheduler' };

  const pending = bookings.filter(b => validStatus(b.status) === 'pending').length;

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', fontFamily:'"Inter",sans-serif', background:'#F1F5F9' }}>

        {/* SIDEBAR */}
        <aside style={{ width: sidebarOpen ? 220 : 60, background:'linear-gradient(180deg,#1E1B4B 0%,#2D2A72 100%)', display:'flex', flexDirection:'column', flexShrink:0, transition:'width .2s ease', overflow:'hidden' }}>
          <div style={{ padding:'18px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,.07)', cursor:'pointer', flexShrink:0 }} onClick={() => setSidebarOpen(o => !o)}>
            <Icon.Logo/>
            {sidebarOpen && <div style={{ fontWeight:800, fontSize:15, color:'#fff', whiteSpace:'nowrap', letterSpacing:'-.01em' }}>AutoService</div>}
          </div>
          <nav style={{ padding:'12px 8px', flex:1, display:'flex', flexDirection:'column', gap:2 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setView(item.id)} className={`adm-nav-btn${view===item.id?' active':''}`}
                title={!sidebarOpen ? item.label : undefined} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '9px 12px' : '9px', position:'relative' }}>
                <item.Ico active={view===item.id}/>
                {sidebarOpen && <span>{item.label}</span>}
                {item.id === 'table' && pending > 0 && (
                  <span style={{ marginLeft:'auto', background:'#F59E0B', color:'#fff', fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:10, minWidth:20, textAlign:'center' }}>{pending}</span>
                )}
              </button>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin:'0 8px 10px', background:'rgba(99,102,241,.18)', borderRadius:8, padding:'12px 14px', border:'1px solid rgba(165,180,252,.12)', flexShrink:0 }}>
              <div style={{ fontSize:10, color:'#A5B4FC', fontWeight:700, marginBottom:4, textTransform:'uppercase', letterSpacing:'.08em' }}>Buchungen gesamt</div>
              <div style={{ fontSize:30, fontWeight:800, color:'#fff', letterSpacing:'-.02em' }}>{bookings.length}</div>
            </div>
          )}
          <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,.07)', flexShrink:0 }}>
            <button className="adm-nav-btn" onClick={() => setAuth(false)} style={{ color:'#F87171', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <Icon.Logout/>{sidebarOpen && 'Abmelden'}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Header */}
          <header style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <h1 style={{ fontSize:16, fontWeight:700, color:'#1E293B', margin:0 }}>{titles[view]}</h1>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:12, color:'#94A3B8' }}>
                {new Date().toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'})}
              </span>
              <button className="adm-btn" onClick={loadData} disabled={loading}
                style={{ background:'#EEF2FF', color:'#4F46E5', border:'1.5px solid #C7D2FE', padding:'7px 14px', borderRadius:6, fontSize:12, fontWeight:700 }}>
                <Icon.Refresh spin={loading}/>{loading ? 'Lädt…' : 'Aktualisieren'}
              </button>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex:1, overflowY:'auto', padding:'22px 26px' }}>
            {loading && bookings.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center', paddingTop:80, color:'#94A3B8' }}>
                <Icon.Refresh spin/><span style={{ fontSize:14 }}>Daten werden geladen…</span>
              </div>
            ) : (
              <>
                {view === 'dashboard' && <DashboardView bookings={bookings} onStatus={handleStatus} showToast={showToast}/>}
                {view === 'table'     && <TableView     bookings={bookings} onStatus={handleStatus} onPatch={handlePatch} showToast={showToast}/>}
                {view === 'scheduler' && <SchedulerView bookings={bookings} onStatus={handleStatus} onPatch={handlePatch} showToast={showToast}/>}
              </>
            )}
          </main>
        </div>
      </div>

      <ToastStack toasts={toasts}/>
    </>
  );
}
