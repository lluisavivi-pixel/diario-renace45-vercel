import React, { useState } from 'react';
import { Entrada, Diario, CATEGORIAS_SINTOMAS, SLIDERS_RAPIDOS, CITAS_DIARIAS, RapidoKey } from './data';
import { saveDiario } from './storage';

interface RegistroProps {
  diario: Diario;
  entrada: Entrada;
  onUpdate: (d: Diario, e: Entrada) => void;
  onDashboard: () => void;
}

export default function Registro({ diario, entrada, onUpdate, onDashboard }: RegistroProps) {
  const [activeTab, setActiveTab] = useState<'rapido' | 'categorias' | 'nota'>('rapido');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const cita = CITAS_DIARIAS[entrada.dia_numero % CITAS_DIARIAS.length];

  function updateEntrada(updater: (e: Entrada) => Entrada) {
    const newEntrada = updater(entrada);
    const entradas = diario.entradas.filter(e => e.fecha !== newEntrada.fecha);
    const newDiario: Diario = {
      ...diario,
      meta: { ...diario.meta, dias_registrados: Math.max(diario.meta.dias_registrados, newEntrada.dia_numero) },
      entradas: [...entradas, newEntrada],
    };
    saveDiario(newDiario);
    onUpdate(newDiario, newEntrada);
  }

  function updateRapido(key: RapidoKey, value: number) {
    updateEntrada(e => ({ ...e, rapido: { ...e.rapido, [key]: value } }));
  }

  function updateCategoria(catId: string, field: string, value: unknown) {
    updateEntrada(e => ({
      ...e,
      categorias: {
        ...e.categorias,
        [catId]: { ...e.categorias[catId], [field]: value },
      },
    }));
  }

  function toggleSintoma(catId: string, sintoma: string) {
    const current = entrada.categorias[catId]?.sintomas || [];
    const next = current.includes(sintoma) ? current.filter(s => s !== sintoma) : [...current, sintoma];
    updateCategoria(catId, 'sintomas', next);
  }

  function markComplete(catId: string) {
    updateCategoria(catId, 'completada', true);
    setExpandedCat(null);
  }

  const completadas = CATEGORIAS_SINTOMAS.filter(c => entrada.categorias[c.id]?.completada).length;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted-tf)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Día {entrada.dia_numero} · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--azul-noche)', lineHeight: 1.2 }}>
            ¿Cómo estás <em>hoy</em>?
          </h2>
        </div>
        <button
          onClick={onDashboard}
          style={{ background: 'transparent', border: '1.5px solid var(--borde)', borderRadius: 'var(--radius)', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--muted-tf)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          📊 Ver análisis
        </button>
      </div>

      {/* Daily quote */}
      <div style={{ background: 'rgba(107,95,160,0.07)', borderLeft: '3px solid var(--lavanda)', borderRadius: '0 var(--radius) var(--radius) 0', padding: '0.9rem 1.1rem', marginBottom: '1.75rem' }}>
        <p className="font-display" style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--azul-noche)', lineHeight: 1.5 }}>"{cita.texto}"</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', background: 'var(--borde)', borderRadius: 'calc(var(--radius)*1.2)', padding: '0.3rem' }}>
        {(['rapido', 'categorias', 'nota'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ flex: 1, padding: '0.55rem 0.5rem', border: 'none', borderRadius: 'calc(var(--radius))', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? 'var(--lavanda)' : 'var(--muted-tf)', boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}
          >
            {tab === 'rapido' ? '⚡ Rápido' : tab === 'categorias' ? `🔍 Detalle (${completadas}/14)` : '📝 Nota'}
          </button>
        ))}
      </div>

      {/* ── TAB: Rápido ── */}
      {activeTab === 'rapido' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {SLIDERS_RAPIDOS.map(s => {
            const val = entrada.rapido[s.key] ?? 3;
            return (
              <div key={s.key} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1.1rem 1.25rem', border: '1px solid var(--borde)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--oscuro)' }}>{s.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: s.color }}>{val}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{s.emoji_min}</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={val}
                    onChange={e => updateRapido(s.key, Number(e.target.value))}
                    style={{ flex: 1, accentColor: s.color }}
                  />
                  <span style={{ fontSize: '1.2rem' }}>{s.emoji_max}</span>
                </div>
              </div>
            );
          })}
          <p style={{ fontSize: '0.78rem', color: 'var(--muted-tf)', textAlign: 'center', paddingTop: '0.5rem' }}>
            ✓ Los valores se guardan automáticamente
          </p>
        </div>
      )}

      {/* ── TAB: Categorías ── */}
      {activeTab === 'categorias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {CATEGORIAS_SINTOMAS.map(cat => {
            const datos = entrada.categorias[cat.id] || { slider: null, completada: false, sintomas: [] };
            const isOpen = expandedCat === cat.id;
            return (
              <div key={cat.id} style={{ background: '#fff', borderRadius: 'var(--radius)', border: `1px solid ${datos.completada ? cat.color + '55' : 'var(--borde)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button
                  onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.1rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                >
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{cat.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--oscuro)' }}>{cat.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-tf)', marginTop: '0.1rem' }}>{cat.descripcion}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {datos.completada && <span style={{ fontSize: '0.7rem', background: cat.color + '22', color: cat.color, borderRadius: '2rem', padding: '0.2rem 0.55rem', fontWeight: 600 }}>✓</span>}
                    <span style={{ color: 'var(--muted-tf)', fontSize: '0.85rem' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid var(--borde)' }}>
                    {/* Empathetic note */}
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted-tf)', fontStyle: 'italic', margin: '0.9rem 0', lineHeight: 1.55 }}>{cat.nota_empatica}</p>

                    {/* Intensity slider */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--oscuro)' }}>Intensidad</span>
                        {datos.slider !== null && <span style={{ fontSize: '0.8rem', color: cat.color, fontWeight: 700 }}>{cat.slider_label[datos.slider]}</span>}
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={4}
                        value={datos.slider ?? 0}
                        onChange={e => updateCategoria(cat.id, 'slider', Number(e.target.value))}
                        style={{ accentColor: cat.color }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted-tf)', marginTop: '0.2rem' }}>
                        <span>{cat.slider_label[0]}</span><span>{cat.slider_label[4]}</span>
                      </div>
                    </div>

                    {/* Period counter special widget */}
                    {cat.especial === 'contador_periodo' && (
                      <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '0.9rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--oscuro)', marginBottom: '0.5rem' }}>Días sin período</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button onClick={() => { const v = Math.max(0, diario.meta.dias_sin_periodo - 1); const nd = { ...diario, meta: { ...diario.meta, dias_sin_periodo: v } }; saveDiario(nd); onUpdate(nd, entrada); }} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--borde)', background: '#fff', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>−</button>
                          <span style={{ fontWeight: 700, fontSize: '1.3rem', color: cat.color, minWidth: '3rem', textAlign: 'center' }}>{diario.meta.dias_sin_periodo}</span>
                          <button onClick={() => { const v = diario.meta.dias_sin_periodo + 1; const nd = { ...diario, meta: { ...diario.meta, dias_sin_periodo: v } }; saveDiario(nd); onUpdate(nd, entrada); }} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--borde)', background: '#fff', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>+</button>
                          <span style={{ fontSize: '0.78rem', color: 'var(--muted-tf)' }}>días</span>
                        </div>
                        {diario.meta.dias_sin_periodo >= 300 && <p style={{ fontSize: '0.75rem', color: cat.color, marginTop: '0.5rem', fontWeight: 500 }}>🌙 Estás cerca de los 12 meses — una etapa importante de tu proceso.</p>}
                      </div>
                    )}

                    {/* Symptom chips */}
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--oscuro)', marginBottom: '0.6rem' }}>Síntomas presentes hoy</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {cat.sintomas.map(s => {
                          const sel = datos.sintomas.includes(s);
                          return (
                            <button
                              key={s}
                              onClick={() => toggleSintoma(cat.id, s)}
                              style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', border: `1.5px solid ${sel ? cat.color : 'var(--borde)'}`, background: sel ? cat.color + '18' : '#fff', color: sel ? cat.color : 'var(--muted-tf)', fontSize: '0.78rem', fontWeight: sel ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease' }}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => markComplete(cat.id)}
                      style={{ width: '100%', background: cat.color, color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.65rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      ✓ Guardar categoría
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: Nota ── */}
      {activeTab === 'nota' && (
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--oscuro)', marginBottom: '0.6rem' }}>
            Tu nota de hoy
          </label>
          <textarea
            value={entrada.nota}
            onChange={e => updateEntrada(en => ({ ...en, nota: e.target.value }))}
            placeholder="¿Algo especial que quieras recordar de hoy? ¿Cómo te has sentido? No hay respuestas incorrectas..."
            rows={8}
            style={{ width: '100%', border: '1.5px solid var(--borde)', borderRadius: 'var(--radius)', padding: '1rem', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', lineHeight: 1.6, color: 'var(--oscuro)', background: '#fff' }}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--muted-tf)', marginTop: '0.5rem' }}>
            ✓ Se guarda automáticamente mientras escribes
          </p>
        </div>
      )}
    </div>
  );
}
