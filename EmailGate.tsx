import React, { useState } from 'react';

interface EmailGateProps {
  onClose: (data?: { nombre: string; email: string }) => void;
  promedios?: { label: string; valor: number }[];
}

export default function EmailGate({ onClose, promedios }: EmailGateProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!nombre.trim() || !email.trim()) { setError('Por favor, completa tu nombre y email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Introduce un email válido.'); return; }
    if (!consent) { setError('Necesitas aceptar para continuar.'); return; }
    setSending(true);
    // Wishpond: no-op en esta versión
    await new Promise(r => setTimeout(r, 600));
    setSending(false);
    onClose({ nombre: nombre.trim(), email: email.trim() });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,34,53,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', zIndex: 1000 }}>
      <div className="anim-scale" style={{ background: '#fff', borderRadius: 'calc(var(--radius)*1.5)', padding: '2rem 1.75rem', maxWidth: '440px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
        {/* Badge día 3 */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(107,95,160,0.1)', borderRadius: '2rem', padding: '0.35rem 0.9rem', fontSize: '0.78rem', color: 'var(--lavanda)', fontWeight: 600, marginBottom: '1.25rem' }}>
          🎉 ¡Llevas 3 días registrando!
        </div>

        <h2 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 400, color: 'var(--azul-noche)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
          Tu cuerpo ya está <em>hablando</em>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted-tf)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Guarda tu progreso y recibe consejos personalizados para tu etapa. Solo necesitamos tu nombre y email.
        </p>

        {promedios && promedios.length > 0 && (
          <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-tf)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tus medias estos 3 días</p>
            {promedios.slice(0, 3).map(p => (
              <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--oscuro)' }}>{p.label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lavanda)' }}>{p.valor.toFixed(1)} / 5</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ border: '1.5px solid var(--borde)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }}
          />
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ border: '1.5px solid var(--borde)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }}
          />
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '3px', accentColor: 'var(--lavanda)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-tf)', lineHeight: 1.5 }}>
              Acepto recibir consejos de TrampoFlow® y el tratamiento de mis datos según la <a href="https://trampoflow.com/politica-privacidad" target="_blank" rel="noreferrer" style={{ color: 'var(--lavanda)' }}>política de privacidad</a>.
            </span>
          </label>
        </div>

        {error && <p style={{ fontSize: '0.82rem', color: 'var(--rojo-suave)', marginBottom: '0.75rem' }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={sending}
          style={{ width: '100%', background: 'var(--lavanda)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.9rem', fontSize: '1rem', fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, marginBottom: '0.75rem', fontFamily: 'inherit' }}
        >
          {sending ? 'Guardando…' : 'Guardar mi progreso →'}
        </button>

        <button
          onClick={() => onClose()}
          style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--muted-tf)', fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem', fontFamily: 'inherit' }}
        >
          Ahora no, continuar sin guardar
        </button>
      </div>
    </div>
  );
}
