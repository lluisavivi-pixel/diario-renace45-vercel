import React, { useState, useEffect } from 'react';
import { Diario, SLIDERS_RAPIDOS } from './data';
import { loadDiario, saveDiario, emptyDiario, todayISO, newEntradaForToday, resetToday, wipeDiario } from './storage';
import type { Entrada } from './data';
import Hero from './Hero';
import Registro from './Registro';
import Dashboard from './Dashboard';
import EmailGate from './EmailGate';

type View = 'hero' | 'registro' | 'dashboard';

// ── HitoMenopausia modal ──────────────────────────────────────────────────────
function HitoMenopausia({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,34,53,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', zIndex: 1100 }}>
      <div className="anim-scale" style={{ background: 'var(--azul-noche)', borderRadius: 'calc(var(--radius)*1.5)', padding: '2.5rem 2rem', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌙</div>
        <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 300, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
          Un año sin período. <em>Una etapa nueva.</em>
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: '2rem' }}>
          Has completado oficialmente un año sin menstruar. La menopausia es un momento de cambio, no de pérdida. Tu cuerpo ha llegado a un nuevo equilibrio.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '2rem', borderLeft: '3px solid var(--dorado)' }}>
          <p className="font-display" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--dorado)', lineHeight: 1.5 }}>
            "Esta etapa no es el final de nada. Es el inicio de ti."
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ width: '100%', background: 'var(--lavanda)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.9rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Continuar mi diario →
        </button>
      </div>
    </div>
  );
}

// ── DEV Panel ─────────────────────────────────────────────────────────────────
function DevPanel({ diario, onUpdate }: { diario: Diario; onUpdate: (d: Diario) => void }) {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: '#2D2A35', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.4rem 0.8rem', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit', zIndex: 900, opacity: 0.7 }}>DEV</button>
  );
  return (
    <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: '#2D2A35', color: '#fff', borderRadius: 'var(--radius)', padding: '1rem', fontSize: '0.8rem', zIndex: 900, minWidth: '220px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700 }}>DEV Panel</span>
        <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
      </div>
      {[
        { label: 'Reset hoy', action: () => { const nd = resetToday(diario); saveDiario(nd); onUpdate(nd); } },
        { label: 'Simular día anterior', action: () => { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const fecha = yesterday.toISOString().slice(0, 10); const ne = newEntradaForToday(diario.entradas.length + 1); const e = { ...ne, fecha }; const nd = { ...diario, entradas: [...diario.entradas.filter(x => x.fecha !== fecha), e] }; saveDiario(nd); onUpdate(nd); } },
        { label: 'Reset email gate', action: () => { const nd = { ...diario, meta: { ...diario.meta, email_registrado: false, email: '', nombre: '' } }; saveDiario(nd); onUpdate(nd); } },
        { label: '⚠️ Borrar todo', action: () => { if (confirm('¿Borrar todos los datos?')) { wipeDiario(); window.location.reload(); } } },
      ].map(btn => (
        <button key={btn.label} onClick={btn.action} style={{ display: 'block', width: '100%', marginBottom: '0.4rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.45rem 0.75rem', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          {btn.label}
        </button>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '0.5rem', paddingTop: '0.5rem', fontSize: '0.72rem', opacity: 0.6 }}>
        {diario.entradas.length} entradas · Día {diario.meta.dias_registrados}
      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ view, onRegistro, onDashboard }: { view: View; onRegistro: () => void; onDashboard: () => void }) {
  return (
    <header style={{ position: 'sticky', top: 0, height: '56px', background: 'rgba(250,247,242,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--borde)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', zIndex: 800 }}>
      <a href="https://trampoflow.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 400, color: 'var(--azul-noche)', letterSpacing: '0.01em' }}>TrampoFlow<sup style={{ fontSize: '0.6em' }}>®</sup></span>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted-tf)', marginLeft: '0.4rem' }}>Diario Renace 45+</span>
      </a>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {view !== 'registro' && (
          <button onClick={onRegistro} style={{ background: 'transparent', border: '1.5px solid var(--borde)', borderRadius: 'var(--radius)', padding: '0.4rem 0.85rem', fontSize: '0.8rem', color: 'var(--muted-tf)', cursor: 'pointer', fontFamily: 'inherit' }}>
            📝 Mi diario
          </button>
        )}
        {view !== 'dashboard' && (
          <button onClick={onDashboard} style={{ background: 'var(--lavanda)', border: 'none', borderRadius: 'var(--radius)', padding: '0.4rem 0.85rem', fontSize: '0.8rem', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            📊 Análisis
          </button>
        )}
      </div>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: 'var(--azul-noche)', color: 'rgba(255,255,255,0.55)', padding: '2rem 1.25rem', textAlign: 'center', fontSize: '0.78rem', lineHeight: 1.8 }}>
      <p className="font-display" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Diario Renace 45+ · TrampoFlow®</p>
      <p>Herramienta de autoconocimiento. No sustituye asesoramiento médico.</p>
      <p style={{ marginTop: '0.5rem' }}>
        <a href="https://trampoflow.com/politica-privacidad" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Privacidad</a>
        {' · '}
        <a href="https://trampoflow.com/aviso-medico" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Aviso médico</a>
        {' · '}
        <a href="https://trampoflow.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>trampoflow.com</a>
      </p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', opacity: 0.5 }}>© {new Date().getFullYear()} TrampoFlow® · Todos los datos se guardan solo en tu dispositivo.</p>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [diario, setDiario] = useState<Diario>(emptyDiario());
  const [entrada, setEntrada] = useState<Entrada | null>(null);
  const [view, setView] = useState<View>('hero');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showHito, setShowHito] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isDev = typeof window !== 'undefined' && (
    (import.meta as any).env?.DEV ||
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('lovable.dev') ||
    window.location.hostname.includes('vercel.app')
  );

  // postMessage height notifier for Webflow iframe
  useEffect(() => {
    const send = () => window.parent?.postMessage({ type: 'diario-height', h: document.body.scrollHeight }, '*');
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    send();
    return () => ro.disconnect();
  }, []);

  // Load from localStorage
  useEffect(() => {
    const d = loadDiario();
    setDiario(d);

    const today = todayISO();
    const existing = d.entradas.find(e => e.fecha === today);

    if (d.entradas.length > 0) {
      // Returning user
      const diaNum = d.entradas.length + (existing ? 0 : 1);
      const e = existing || newEntradaForToday(diaNum);
      if (!existing) {
        const nd: Diario = { ...d, entradas: [...d.entradas, e] };
        saveDiario(nd);
        setDiario(nd);
      }
      setEntrada(e);
      setView('registro');

      // Check hito menopausia
      if (d.meta.dias_sin_periodo >= 365 && !d.meta.hito_mostrado) {
        setShowHito(true);
      }
    }

    setMounted(true);
  }, []);

  function handleEmpezar() {
    const today = todayISO();
    const existing = diario.entradas.find(e => e.fecha === today);
    const diaNum = diario.entradas.length + (existing ? 0 : 1);
    const e = existing || newEntradaForToday(diaNum);
    if (!existing) {
      const nd: Diario = { ...diario, entradas: [...diario.entradas, e] };
      saveDiario(nd);
      setDiario(nd);
    }
    setEntrada(e);
    setView('registro');
  }

  function handleUpdate(nd: Diario, ne: Entrada) {
    setDiario(nd);
    setEntrada(ne);

    // Check email gate (day 3+, not yet registered)
    if (nd.entradas.length >= 3 && !nd.meta.email_registrado && !showEmailGate) {
      setShowEmailGate(true);
    }
  }

  function handleEmailGateClose(data?: { nombre: string; email: string }) {
    if (data) {
      const nd: Diario = {
        ...diario,
        meta: { ...diario.meta, email_registrado: true, email: data.email, nombre: data.nombre },
      };
      saveDiario(nd);
      setDiario(nd);
    }
    setShowEmailGate(false);
  }

  function handleHitoClose() {
    const nd: Diario = { ...diario, meta: { ...diario.meta, hito_mostrado: true } };
    saveDiario(nd);
    setDiario(nd);
    setShowHito(false);
  }

  function handleDevUpdate(nd: Diario) {
    setDiario(nd);
    const today = todayISO();
    const e = nd.entradas.find(x => x.fecha === today) || null;
    setEntrada(e);
  }

  const emailGatePromedios = diario.entradas.length > 0
    ? SLIDERS_RAPIDOS.map(s => ({
        label: s.label,
        valor: diario.entradas.reduce((sum, e) => sum + e.rapido[s.key], 0) / diario.entradas.length,
      }))
    : [];

  if (!mounted) return null;

  return (
    <>
      <Header
        view={view}
        onRegistro={() => { if (entrada) setView('registro'); else handleEmpezar(); }}
        onDashboard={() => setView('dashboard')}
      />

      <main>
        {view === 'hero' && <Hero onEmpezar={handleEmpezar} />}
        {view === 'registro' && entrada && (
          <Registro
            diario={diario}
            entrada={entrada}
            onUpdate={handleUpdate}
            onDashboard={() => setView('dashboard')}
          />
        )}
        {view === 'dashboard' && (
          <Dashboard
            diario={diario}
            onBack={() => setView(entrada ? 'registro' : 'hero')}
          />
        )}
      </main>

      <Footer />

      {showEmailGate && (
        <EmailGate onClose={handleEmailGateClose} promedios={emailGatePromedios} />
      )}

      {showHito && <HitoMenopausia onClose={handleHitoClose} />}

      {isDev && <DevPanel diario={diario} onUpdate={handleDevUpdate} />}
    </>
  );
}
