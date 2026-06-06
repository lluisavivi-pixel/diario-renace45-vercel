import React from 'react';

interface HeroProps {
  onEmpezar: () => void;
}

export default function Hero({ onEmpezar }: HeroProps) {
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 1.25rem', textAlign: 'center' }}>
      {/* Badge */}
      <div className="anim-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(107,95,160,0.1)', border: '1px solid rgba(107,95,160,0.25)', borderRadius: '2rem', padding: '0.4rem 1rem', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--lavanda)', fontWeight: 500, letterSpacing: '0.04em' }}>
        <span>🌙</span> TrampoFlow® · Diario íntimo
      </div>

      {/* Headline */}
      <h1 className="font-display anim-slide anim-delay-1" style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 300, lineHeight: 1.2, color: 'var(--azul-noche)', maxWidth: '640px', marginBottom: '1.25rem' }}>
        Entiende lo que le pasa<br />
        <em>a tu cuerpo cada día</em>
      </h1>

      <p className="anim-slide anim-delay-2" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: 'var(--muted-tf)', maxWidth: '520px', lineHeight: 1.65, marginBottom: '2.5rem' }}>
        Registra sofocos, sueño, ánimo y energía. Descubre tus patrones en la perimenopausia y menopausia. Completamente gratis.
      </p>

      {/* CTA */}
      <button
        onClick={onEmpezar}
        className="anim-scale anim-delay-3"
        style={{ background: 'var(--lavanda)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '1rem 2.25rem', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', boxShadow: '0 4px 20px rgba(107,95,160,0.35)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
        onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(107,95,160,0.45)'; }}
        onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(107,95,160,0.35)'; }}
      >
        Empezar mi diario hoy →
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted-tf)' }}>
        Sin registro. Sin tarjeta. Todo queda en tu dispositivo.
      </p>

      {/* Feature pills */}
      <div className="anim-fade anim-delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem', maxWidth: '560px' }}>
        {['6 indicadores diarios', '14 categorías de síntomas', 'Gráficas semanales', 'Exportar PDF', 'Sin datos a servidor', '100% privado'].map(f => (
          <span key={f} style={{ background: '#fff', border: '1px solid var(--borde)', borderRadius: '2rem', padding: '0.35rem 0.9rem', fontSize: '0.8rem', color: 'var(--oscuro)', fontWeight: 500 }}>
            ✓ {f}
          </span>
        ))}
      </div>

      {/* Decorative quote */}
      <div style={{ marginTop: '4rem', padding: '1.5rem', background: 'rgba(107,95,160,0.06)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--lavanda)', maxWidth: '440px', textAlign: 'left' }}>
        <p className="font-display" style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--azul-noche)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
          "El cuerpo no miente. Escucharlo es el acto más valiente."
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted-tf)', fontWeight: 500 }}>— TrampoFlow®</p>
      </div>
    </div>
  );
}
