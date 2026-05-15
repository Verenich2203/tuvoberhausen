import React, { useState, useEffect, useCallback } from 'react';

// --- НАСТРОЙКИ SUPABASE ---
const SUPABASE_URL = "https://cglzccturchfveajhtqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_0UWfCaMn2o-BQXTCfww3tg_2BNkOv9m";

// --- ИКОНКИ ---
const Ic = {
  Shield: ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Wrench: ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Layout: ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  Calendar: ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  List: ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Search: ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  LogOut: ({s=22,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  X: ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Refresh: ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>,
};

const STATUS_CONF = {
  pending:   { label: 'Ausstehend', bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', dot: '#F59E0B' },
  completed: { label: 'Abgeschlossen', bg: '#D1FAE5', text: '#059669', border: '#A7F3D0', dot: '#10B981' },
  cancelled: { label: 'Storniert', bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', dot: '#EF4444' }
};

// Железобетонная защита от кривых статусов в базе данных
const getValidStatus = (status) => {
  return (status && STATUS_CONF[status]) ? status : 'pending';
};

// --- АПИ ФУНКЦИИ ---
async function fetchAllBookings() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?order=date.desc,time_slot.desc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error("Fehler beim Laden");
  return res.json();
}

async function updateBookingStatus(id, newStatus) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json", Prefer: "return=minimal"
    },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error("Fehler beim Update");
}

export default function AdminPanel() {
  // Авторизация
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Данные
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Навигация
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, calendar, list
  const [activeTab, setActiveTab] = useState('all'); // all, pending, completed, cancelled
  const [search, setSearch] = useState('');
  
  // Календарь
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });
      const data = await res.json();
      if (data.success) setAuth(true);
      else setAuthError(data.error || 'Falsches Passwort');
    } catch {
      setAuthError('Serverfehler.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try { setBookings(await fetchAllBookings()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (auth) loadData(); }, [auth, loadData]);

  const changeStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {
      alert('Ein Fehler ist aufgetreten.');
    }
  };

  // --- ВЫЧИСЛЕНИЯ ДЛЯ ДАШБОРДА ---
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const pendingCount = bookings.filter(b => getValidStatus(b.status) === 'pending').length;
  const completedCount = bookings.filter(b => getValidStatus(b.status) === 'completed').length;

  // --- ЭКРАН ВХОДА ---
  if (!auth) {
    return (
      <div style={{position:'fixed', inset:0, zIndex:99999, background:'#0F172A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif'}}>
        <form onSubmit={handleLogin} style={{background:'#ffffff', padding:'48px 36px', borderRadius:24, boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)', width:'100%', maxWidth:420, textAlign:'center'}}>
          <div style={{width:64, height:64, background:'#EFF6FF', color:'#1A56DB', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px'}}>
            <Ic.Shield s={32}/>
          </div>
          <h2 style={{fontWeight:800, fontSize:26, color:'#0F1923', marginBottom:8}}>CRM Zugang</h2>
          <p style={{color:'#64748B', fontSize:14, marginBottom:32}}>AutoService Oberhausen Admin-Bereich.</p>
          
          <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:28}}>
            <input 
              type="password" placeholder="Passwort eingeben..." value={password} 
              onChange={e=>{setPassword(e.target.value); setAuthError('');}} required 
              style={{
                textAlign:'center', fontSize:18, padding:'16px', borderRadius:12, 
                border:`2px solid ${authError ? '#EF4444' : '#E2E8F0'}`, 
                background:'#F8FAFC', color:'#0F1923', transition:'all 0.2s', outline:'none'
              }}
              onFocus={e => e.target.style.borderColor = '#1A56DB'}
              onBlur={e => e.target.style.borderColor = authError ? '#EF4444' : '#E2E8F0'}
            />
            {authError && <span style={{color:'#EF4444', fontSize:13, fontWeight:600}}>{authError}</span>}
          </div>
          
          <button type="submit" disabled={isLoggingIn} style={{width:'100%', padding:'16px', borderRadius:12, background:'#1A56DB', color:'#fff', border:'none', fontSize:16, fontWeight:700, cursor:isLoggingIn?'not-allowed':'pointer', opacity:isLoggingIn?0.7:1, transition:'all 0.2s'}}>
            {isLoggingIn ? 'Wird geprüft...' : 'Sicher Einloggen'}
          </button>
        </form>
      </div>
    );
  }

  // --- КОМПОНЕНТ КАРТОЧКИ ТЕРМИНА ---
  const BookingCard = ({ b }) => {
    // Надежно получаем статус
    const st = getValidStatus(b.status);
    const conf = STATUS_CONF[st];
    
    return (
      <div style={{background:'#fff', borderRadius:16, padding:20, border:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20, boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)', transition:'transform 0.2s'}}>
        <div style={{display:'flex', gap:20, flexWrap:'wrap', alignItems:'center'}}>
          <div style={{background:'#F8FAFC', padding:'12px', borderRadius:12, textAlign:'center', minWidth:90, border:'1px solid #E2E8F0'}}>
            <div style={{fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4}}>{b.date || 'Kein Datum'}</div>
            <div style={{fontSize:18, fontWeight:800, color:'#0F1923'}}>{b.time_slot || '--:--'}</div>
          </div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <div style={{fontSize:16, fontWeight:800, color:'#0F1923', marginBottom:4, display:'flex', alignItems:'center', gap:8}}>
              {b.name || 'Unbekannt'} 
              <span style={{background:'#EFF6FF', color:'#1A56DB', padding:'2px 8px', borderRadius:6, fontSize:12, fontWeight:700}}>{b.plate || 'Kein Kennzeichen'}</span>
            </div>
            <div style={{fontSize:13, color:'#64748B', display:'flex', gap:12, marginBottom:6, fontWeight:500}}>
              <span>{b.service || '-'}</span> • <span>{b.vehicle_type || '-'}</span>
            </div>
            <div style={{fontSize:13, color:'#475569', display:'flex', gap:16}}>
              {b.phone ? <a href={`tel:${b.phone}`} style={{color:'#0F1923', textDecoration:'none', fontWeight:600}}>📞 {b.phone}</a> : ''} 
              {b.email ? <a href={`mailto:${b.email}`} style={{color:'#0F1923', textDecoration:'none', fontWeight:600}}>✉️ {b.email}</a> : ''}
            </div>
            {b.notes && <div style={{marginTop:10, fontSize:12, color:'#92400E', background:'#FFFBEB', padding:'8px 12px', borderRadius:8, border:'1px solid #FEF3C7'}}>📝 <b>Anmerkung:</b> {b.notes}</div>}
          </div>
        </div>
        
        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12}}>
          <div style={{background:conf.bg, color:conf.text, border:`1px solid ${conf.border}`, padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6}}>
            <div style={{width:8, height:8, borderRadius:'50%', background:conf.dot}}/> {conf.label}
          </div>
          <div style={{display:'flex', gap:8}}>
            {st !== 'completed' && <button onClick={()=>changeStatus(b.id, 'completed')} style={{background:'#10B981', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}><Ic.Check s={14}/> Fertig</button>}
            {st !== 'cancelled' && <button onClick={()=>changeStatus(b.id, 'cancelled')} style={{background:'#fff', color:'#EF4444', border:'1px solid #FECACA', padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}><Ic.X s={14}/> Storno</button>}
            {st !== 'pending' && <button onClick={()=>changeStatus(b.id, 'pending')} style={{background:'#F1F5F9', color:'#475569', border:'none', padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}><Ic.Refresh s={14}/> Reset</button>}
          </div>
        </div>
      </div>
    );
  };

  // --- КАЛЕНДАРЬ ЛОГИКА ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Делаем понедельник первым днем
  };

  const currentYear = calDate.getFullYear();
  const currentMonth = calDate.getMonth();
  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDay(currentYear, currentMonth);
  const blanks = Array.from({ length: startOffset }, (_, i) => i);
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const prevMonth = () => setCalDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCalDate(new Date(currentYear, currentMonth + 1, 1));

  // --- РЕНДЕР ГЛАВНОЙ ПАНЕЛИ ---
  return (
    // ГЛАВНЫЙ КОНТЕЙНЕР (Полноэкранный, скрывает весь остальной сайт)
    <div style={{position:'fixed', inset:0, zIndex:99999, background:'#F3F4F6', display:'flex', fontFamily:'"Inter", "Montserrat", sans-serif', overflow:'hidden'}}>
      
      {/* SIDEBAR (Левое меню) */}
      <div style={{width:260, background:'#0F172A', color:'#fff', display:'flex', flexDirection:'column', flexShrink:0}}>
        <div style={{padding:'24px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid #1E293B'}}>
          <div style={{width:36, height:36, background:'#38BDF8', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#0F172A'}}><Ic.Wrench s={20}/></div>
          <div style={{fontWeight:800, fontSize:18, letterSpacing:'-0.02em'}}>AutoService</div>
        </div>
        
        <nav style={{padding:'20px 12px', display:'flex', flexDirection:'column', gap:8, flex:1}}>
          {[
            { id: 'dashboard', label: 'Übersicht', icon: <Ic.Layout s={18}/> },
            { id: 'calendar', label: 'Kalender', icon: <Ic.Calendar s={18}/> },
            { id: 'list', label: 'Alle Buchungen', icon: <Ic.List s={18}/> }
          ].map(item => (
            <button key={item.id} onClick={()=>{setActiveView(item.id); setSelectedDateStr('');}} 
              style={{
                display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, border:'none', cursor:'pointer',
                background: activeView === item.id ? '#1E293B' : 'transparent',
                color: activeView === item.id ? '#38BDF8' : '#94A3B8',
                fontWeight: 600, fontSize:14, textAlign:'left', transition:'all 0.2s'
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div style={{padding:'20px', borderTop:'1px solid #1E293B'}}>
          <button onClick={()=>window.location.hash=''} style={{display:'flex', alignItems:'center', gap:10, width:'100%', padding:'12px', background:'transparent', border:'none', color:'#EF4444', cursor:'pointer', fontWeight:600, fontSize:14}}>
            <Ic.LogOut s={18}/> Logout / Zur Website
          </button>
        </div>
      </div>

      {/* MAIN CONTENT (Правая часть) */}
      <div style={{flex:1, display:'flex', flexDirection:'column', overflowY:'auto'}}>
        
        {/* Хэдер */}
        <header style={{background:'#fff', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #E2E8F0', position:'sticky', top:0, zIndex:10}}>
          <h2 style={{fontSize:20, fontWeight:800, color:'#0F1923', margin:0}}>
            {activeView === 'dashboard' && 'Dashboard Übersicht'}
            {activeView === 'calendar' && 'Termin Kalender'}
            {activeView === 'list' && 'Buchungsverwaltung'}
          </h2>
          <button onClick={loadData} disabled={loading} style={{background:'#EFF6FF', color:'#1A56DB', border:'none', padding:'8px 16px', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6}}>
            {loading ? 'Lädt...' : <>Aktualisieren</>}
          </button>
        </header>

        {/* Рабочая область */}
        <div style={{padding:'32px', maxWidth:1200, margin:'0 auto', width:'100%'}}>
          
          {/* VIEW: ДАШБОРД */}
          {activeView === 'dashboard' && (
            <div style={{display:'flex', flexDirection:'column', gap:32}}>
              {/* Статистика */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20}}>
                <div style={{background:'#fff', padding:24, borderRadius:16, border:'1px solid #E2E8F0', boxShadow:'0 2px 4px rgba(0,0,0,0.02)'}}>
                  <div style={{color:'#64748B', fontSize:13, fontWeight:700, textTransform:'uppercase', marginBottom:8}}>Termine Heute</div>
                  <div style={{fontSize:36, fontWeight:800, color:'#0F1923'}}>{todayBookings.length}</div>
                </div>
                <div style={{background:'#fff', padding:24, borderRadius:16, border:'1px solid #E2E8F0', boxShadow:'0 2px 4px rgba(0,0,0,0.02)'}}>
                  <div style={{color:'#D97706', fontSize:13, fontWeight:700, textTransform:'uppercase', marginBottom:8}}>Ausstehende Anfragen</div>
                  <div style={{fontSize:36, fontWeight:800, color:'#D97706'}}>{pendingCount}</div>
                </div>
                <div style={{background:'#fff', padding:24, borderRadius:16, border:'1px solid #E2E8F0', boxShadow:'0 2px 4px rgba(0,0,0,0.02)'}}>
                  <div style={{color:'#059669', fontSize:13, fontWeight:700, textTransform:'uppercase', marginBottom:8}}>Erfolgreich Abgeschlossen</div>
                  <div style={{fontSize:36, fontWeight:800, color:'#059669'}}>{completedCount}</div>
                </div>
              </div>

              {/* Сегодняшние термины */}
              <div>
                <h3 style={{fontSize:18, fontWeight:800, color:'#0F1923', marginBottom:16}}>Heute anstehend ({todayStr})</h3>
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  {todayBookings.length === 0 ? <p style={{color:'#64748B'}}>Keine Termine für heute.</p> : todayBookings.map(b => <BookingCard key={b.id} b={b} />)}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: КАЛЕНДАРЬ */}
          {activeView === 'calendar' && (
            <div style={{display:'flex', flexDirection:'column', gap:32}}>
              <div style={{background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', padding:24, boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
                  <button onClick={prevMonth} style={{background:'#F1F5F9', border:'none', padding:'8px 16px', borderRadius:8, cursor:'pointer', fontWeight:700}}>Zurück</button>
                  <h3 style={{fontSize:20, fontWeight:800, margin:0}}>{calDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}</h3>
                  <button onClick={nextMonth} style={{background:'#F1F5F9', border:'none', padding:'8px 16px', borderRadius:8, cursor:'pointer', fontWeight:700}}>Weiter</button>
                </div>
                
                <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:8}}>
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                    <div key={d} style={{textAlign:'center', fontWeight:700, color:'#94A3B8', fontSize:13, paddingBottom:8}}>{d}</div>
                  ))}
                  
                  {blanks.map(b => <div key={`b-${b}`} />)}
                  
                  {days.map(d => {
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                    const dayBookings = bookings.filter(b => b.date === dateStr);
                    const isSelected = selectedDateStr === dateStr;
                    
                    return (
                      <div key={d} onClick={() => setSelectedDateStr(dateStr)}
                        style={{
                          aspectRatio:'1', background: isSelected ? '#EFF6FF' : '#F8FAFC', 
                          border:`2px solid ${isSelected ? '#1A56DB' : 'transparent'}`,
                          borderRadius:12, padding:8, cursor:'pointer', display:'flex', flexDirection:'column', transition:'all 0.2s'
                        }}>
                        <span style={{fontWeight:700, color: isSelected ? '#1A56DB' : '#0F1923'}}>{d}</span>
                        <div style={{marginTop:'auto', display:'flex', gap:4, flexWrap:'wrap'}}>
                          {dayBookings.map((b, i) => {
                            if(i>2) return null; // Максимум 3 точки
                            
                            // Железобетонно получаем статус для цвета точки
                            const st = getValidStatus(b.status);
                            
                            return <div key={i} style={{width:8, height:8, borderRadius:'50%', background:STATUS_CONF[st].dot}}/>
                          })}
                          {dayBookings.length > 3 && <span style={{fontSize:10, color:'#64748B'}}>+{dayBookings.length-3}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Список для выбранной даты */}
              {selectedDateStr && (
                <div>
                  <h3 style={{fontSize:18, fontWeight:800, color:'#0F1923', marginBottom:16}}>Termine am {selectedDateStr}</h3>
                  <div style={{display:'flex', flexDirection:'column', gap:12}}>
                    {bookings.filter(b => b.date === selectedDateStr).length === 0 ? 
                      <p style={{color:'#64748B'}}>Keine Termine an diesem Datum.</p> : 
                      bookings.filter(b => b.date === selectedDateStr).map(b => <BookingCard key={b.id} b={b} />)
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: СПИСОК (ВСЕ ТЕРМИНЫ) */}
          {activeView === 'list' && (
            <div style={{display:'flex', flexDirection:'column', gap:24}}>
              
              {/* Поиск и Фильтры (Табы) */}
              <div style={{display:'flex', gap:16, flexWrap:'wrap', alignItems:'center', background:'#fff', padding:16, borderRadius:16, border:'1px solid #E2E8F0'}}>
                <div style={{display:'flex', alignItems:'center', flex:1, minWidth:260, background:'#F8FAFC', borderRadius:10, padding:'0 16px', border:'1px solid #E2E8F0'}}>
                  <Ic.Search s={18} c="#94A3B8"/>
                  <input type="text" placeholder="Suchen nach Name, KFZ, Telefon..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%', padding:'12px', background:'transparent', border:'none', outline:'none', fontSize:14}}/>
                </div>
                
                <div style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:4}}>
                  {[
                    {id:'all', label:'Alle Termine'},
                    {id:'pending', label:'🟠 Ausstehend'},
                    {id:'completed', label:'🟢 Abgeschlossen'},
                    {id:'cancelled', label:'🔴 Storniert'}
                  ].map(t => (
                    <button key={t.id} onClick={()=>setActiveTab(t.id)}
                      style={{
                        padding:'10px 16px', borderRadius:20, fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', border:'none',
                        background: activeTab === t.id ? '#0F1923' : '#F1F5F9',
                        color: activeTab === t.id ? '#fff' : '#475569', transition:'all 0.2s'
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Список отфильтрованных */}
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                {(() => {
                  const filtered = bookings.filter(b => {
                    const s = search.toLowerCase();
                    const n = b.name||''; const p = b.plate||''; const t = b.phone||'';
                    const matchSearch = n.toLowerCase().includes(s) || p.toLowerCase().includes(s) || t.includes(s);
                    
                    const bStatus = getValidStatus(b.status);
                    const matchFilter = activeTab === 'all' || bStatus === activeTab;
                    
                    return matchSearch && matchFilter;
                  });

                  if(filtered.length === 0) return <div style={{textAlign:'center', padding:60, color:'#94A3B8', fontSize:15}}>Keine passenden Buchungen gefunden.</div>;
                  return filtered.map(b => <BookingCard key={b.id} b={b} />);
                })()}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}