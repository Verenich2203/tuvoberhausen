// Файл: src/AdminPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';

// --- НАСТРОЙКИ SUPABASE ---
const SUPABASE_URL = "https://cglzccturchfveajhtqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0UWfCaMn2o-BQXTCfww3tg_2BNkOv9m";

// --- ИКОНКИ ДЛЯ АДМИНКИ ---
const Ic = {
  Shield:  ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Wrench:  ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
};

// --- ФУНКЦИИ ДЛЯ РАБОТЫ С БАЗОЙ ---
async function fetchAllBookings() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?order=date.desc,time_slot.desc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Buchungen");
  return res.json();
}

async function updateBookingStatus(id, newStatus) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error("Fehler beim Aktualisieren");
}

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Безопасный логин через API
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Используем .trim(), чтобы убрать случайные пробелы до и после пароля
        body: JSON.stringify({ password: password.trim() })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAuth(true); // Успех!
      } else {
        setAuthError(data.error || 'Login fehlgeschlagen');
      }
    } catch (err) {
      setAuthError('Serverfehler. Bitte später versuchen.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      alert('Fehler beim Laden der Daten.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth) loadData();
  }, [auth, loadData]);

  const changeStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Fehler beim Speichern des Status.');
    }
  };

  // ЭКРАН ВХОДА (С исправленным независимым дизайном)
  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:'sans-serif'}}>
        <form onSubmit={handleLogin} style={{background:'#ffffff', padding:'48px 32px', borderRadius:24, boxShadow:'0 20px 50px rgba(0,0,0,0.08)', width:'100%', maxWidth:400, textAlign:'center'}}>
          <div style={{width:56, height:56, background:'#1A56DB', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px'}}>
            <Ic.Shield s={28} c="#fff"/>
          </div>
          <h2 style={{fontWeight:800, fontSize:24, color:'#0F1923', marginBottom:8}}>Admin Login</h2>
          <p style={{color:'#64748B', fontSize:14, marginBottom:32}}>Bitte geben Sie das Passwort ein.</p>
          
          <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:24}}>
            <input 
              type="password" 
              placeholder="Passwort..." 
              value={password} 
              onChange={e=>{setPassword(e.target.value); setAuthError('');}} 
              required 
              style={{
                textAlign:'center', fontSize:18, padding:'14px', borderRadius:12, 
                border:`2px solid ${authError ? '#EF4444' : '#E2E8F0'}`, 
                background:'#F8FAFC', color:'#0F1923', transition:'all 0.2s', outline:'none'
              }}
              onFocus={e => e.target.style.borderColor = '#1A56DB'}
              onBlur={e => e.target.style.borderColor = authError ? '#EF4444' : '#E2E8F0'}
            />
            {authError && <span style={{color:'#EF4444', fontSize:13, fontWeight:600}}>{authError}</span>}
          </div>
          
          <button type="submit" disabled={isLoggingIn} style={{width:'100%', padding:'15px', borderRadius:12, background:'#1A56DB', color:'#fff', border:'none', fontSize:15, fontWeight:700, cursor:isLoggingIn?'not-allowed':'pointer', opacity:isLoggingIn?0.7:1, transition:'all 0.2s'}}>
            {isLoggingIn ? 'Prüfung...' : 'Einloggen'}
          </button>
        </form>
      </div>
    );
  }

  // ПАНЕЛЬ УПРАВЛЕНИЯ
  const filtered = bookings.filter(b => {
    const s = search.toLowerCase();
    const matchSearch = b.name.toLowerCase().includes(s) || b.plate.toLowerCase().includes(s) || b.phone.includes(s);
    const bStatus = b.status || 'pending';
    const matchFilter = filter === 'all' || bStatus === filter;
    return matchSearch && matchFilter;
  });

  const statusConfig = {
    pending:   { label: 'Ausstehend', color: '#F59E0B', bg: '#FFFBEB' },
    completed: { label: 'Abgeschlossen', color: '#10B981', bg: '#ECFDF5' },
    cancelled: { label: 'Storniert', color: '#EF4444', bg: '#FEF2F2' }
  };

  return (
    <div style={{minHeight:'100vh', background:'#F8FAFC', fontFamily:'sans-serif'}}>
      <header style={{background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:36, height:36, background:'#0A2540', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Ic.Wrench s={16} c="#fff"/>
          </div>
          <h1 style={{fontWeight:800, fontSize:18, color:'#0F1923'}}>AutoService <span style={{color:'#1A56DB'}}>Admin</span></h1>
        </div>
        <div style={{display:'flex', gap:12}}>
          <button onClick={loadData} style={{padding:'8px 16px', fontSize:12, background:'transparent', border:'1px solid #E2E8F0', color:'#1A56DB', borderRadius:8, cursor:'pointer', fontWeight:600}}>{loading ? 'Lädt...' : 'Aktualisieren'}</button>
          <button onClick={()=>window.location.hash=''} style={{padding:'8px 16px', fontSize:12, background:'transparent', border:'1px solid #E2E8F0', color:'#64748B', borderRadius:8, cursor:'pointer', fontWeight:600}}>Abmelden</button>
        </div>
      </header>

      <div style={{maxWidth:1200, margin:'0 auto', padding:'32px'}}>
        <div style={{display:'flex', gap:16, marginBottom:24, flexWrap:'wrap'}}>
          <input type="text" placeholder="Suche nach Name, Kennzeichen oder Telefon..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1, minWidth:280, padding:'12px 16px', borderRadius:10, border:'1px solid #E2E8F0', fontSize:14, outline:'none'}}/>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'12px 16px', borderRadius:10, border:'1px solid #E2E8F0', fontSize:14, background:'#fff', cursor:'pointer', outline:'none'}}>
            <option value="all">Alle Status</option>
            <option value="pending">🟠 Ausstehend</option>
            <option value="completed">🟢 Abgeschlossen</option>
            <option value="cancelled">🔴 Storniert</option>
          </select>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {filtered.length === 0 && <div style={{textAlign:'center', padding:40, color:'#64748B'}}>Keine Buchungen gefunden.</div>}
          
          {filtered.map(b => {
            const st = b.status || 'pending';
            const conf = statusConfig[st];
            return (
              <div key={b.id} style={{background:'#fff', borderRadius:16, padding:24, border:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20, boxShadow:'0 2px 8px rgba(0,0,0,.02)'}}>
                <div style={{display:'flex', gap:24, flexWrap:'wrap'}}>
                  <div style={{background:'#F8FAFC', padding:'12px 16px', borderRadius:10, textAlign:'center', minWidth:100}}>
                    <div style={{fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4}}>{b.date}</div>
                    <div style={{fontSize:20, fontWeight:800, color:'#1A56DB'}}>{b.time_slot}</div>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <div style={{fontSize:16, fontWeight:800, color:'#0F1923', marginBottom:4}}>{b.name} <span style={{color:'#64748B', fontWeight:500, fontSize:14}}>— {b.plate}</span></div>
                    <div style={{fontSize:13, color:'#64748B', display:'flex', gap:12, marginBottom:6}}>
                      <span>{b.service}</span> • <span>{b.vehicle_type}</span>
                    </div>
                    <div style={{fontSize:12, color:'#64748B', display:'flex', gap:12}}>
                      <a href={`tel:${b.phone}`} style={{color:'#1A56DB', textDecoration:'none', fontWeight:600}}>{b.phone}</a> • 
                      <a href={`mailto:${b.email}`} style={{color:'#1A56DB', textDecoration:'none', fontWeight:600}}>{b.email}</a>
                    </div>
                    {b.notes && <div style={{marginTop:8, fontSize:12, color:'#92400E', background:'#FFFBEB', padding:'6px 10px', borderRadius:6}}>📝 {b.notes}</div>}
                  </div>
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12}}>
                  <div style={{background:conf.bg, color:conf.color, padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase'}}>{conf.label}</div>
                  <div style={{display:'flex', gap:8}}>
                    {st !== 'completed' && <button onClick={()=>changeStatus(b.id, 'completed')} style={{background:'#10B981', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer'}}>✓ Abschließen</button>}
                    {st !== 'cancelled' && <button onClick={()=>changeStatus(b.id, 'cancelled')} style={{background:'#EF4444', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer'}}>✕ Stornieren</button>}
                    {st !== 'pending' && <button onClick={()=>changeStatus(b.id, 'pending')} style={{background:'#F8FAFC', color:'#64748B', border:'1px solid #E2E8F0', padding:'8px 12px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer'}}>Zurücksetzen</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}