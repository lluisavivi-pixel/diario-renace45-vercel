import React, { useState } from 'react';
import {
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Diario, SLIDERS_RAPIDOS, RapidoKey } from './data';

interface DashboardProps {
  diario: Diario;
  onBack: () => void;
}

type Tab = 'hoy' | 'semana' | 'historial' | 'analisis';

const TAB_LABELS: { id: Tab; label: string }[] = [
  { id: 'hoy', label: '⚡ Hoy' },
  { id: 'semana', label: '📈 Semana' },
  { id: 'historial', label: '🗓️ Historial' },
  { id: 'analisis', label: '🔬 Análisis' },
];

function metricColor(key: RapidoKey) {
  return SLIDERS_RAPIDOS.find(s => s.key === key)?.color || '#6B5FA0';
}

export default function Dashboard({ diario, onBack }: DashboardProps) {
  const [tab, setTab] = useState<Tab>('hoy');

  const entradas = [...diario.entradas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const ultima = entradas[entradas.length - 1];
  const semana = entradas.slice(-7);

  // ── Tab Hoy ──────────────────────────────────────────────────────────────
  function TabHoy() {
    if (!ultima) return <EmptyState />;
    const r = ultima.rapido;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(107,95,160,0.06)', borderRadius: 'var(--radius)', padding: '1rem 1.1rem', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-tf)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Último registro</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--azul-noche)', fontWeight: 500 }}>{new Date(ultima.fecha + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · Día {ultima.dia_numero}</p>
        </div>
        {SLIDERS_RAPIDOS.map(s => {
          const val = r[s.key];
          const pct = ((val - 1) / 4) * 100;
          return (
            <div key={s.key} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem 1.1rem', border: '1px solid var(--borde)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--oscuro)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{val} / 5</span>
              </div>
              <div style={{ height: '6px', background: 'var(--borde)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.72rem', color: 'var(--muted-tf)' }}>
                <span>{s.emoji_min}</span><span>{s.emoji_max}</span>
              </div>
            </div>
          );
        })}
        {ultima.nota && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem 1.1rem', border: '1px solid var(--borde)', borderLeft: '3px solid var(--lavanda)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-tf)', marginBottom: '0.4rem' }}>NOTA DEL DÍA</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--oscuro)', lineHeight: 1.6 }}>{ultima.nota}</p>
          </div>
        )}
      </div>
    );
  }

  // ── Tab Semana ────────────────────────────────────────────────────────────
  function TabSemana() {
    if (entradas.length < 2) return <EmptyState msg="Necesitas al menos 2 días registrados para ver la gráfica semanal." />;
    const data = semana.map(e => ({
      name: new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      ...e.rapido,
    }));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {SLIDERS_RAPIDOS.map(s => (
          <div key={s.key} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--borde)' }}>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--oscuro)', marginBottom: '0.75rem' }}>{s.label}</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} width={20} />
                <Tooltip formatter={(v: number) => [v.toFixed(1), s.label]} />
                <Line type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2.5} dot={{ r: 4, fill: s.color }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    );
  }

  // ── Tab Historial ─────────────────────────────────────────────────────────
  function TabHistorial() {
    if (!entradas.length) return <EmptyState />;
    const reversed = [...entradas].reverse();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {reversed.map(e => (
          <div key={e.fecha} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem 1.1rem', border: '1px solid var(--borde)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--azul-noche)' }}>
                {new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-tf)', background: 'var(--cream)', borderRadius: '2rem', padding: '0.2rem 0.6rem' }}>Día {e.dia_numero}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SLIDERS_RAPIDOS.map(s => (
                <span key={s.key} style={{ fontSize: '0.75rem', background: 'var(--cream)', borderRadius: '2rem', padding: '0.2rem 0.6rem', color: 'var(--oscuro)' }}>
                  {s.label}: <strong style={{ color: s.color }}>{e.rapido[s.key]}</strong>
                </span>
              ))}
            </div>
            {e.nota && <p style={{ fontSize: '0.82rem', color: 'var(--muted-tf)', marginTop: '0.6rem', fontStyle: 'italic', lineHeight: 1.5 }}>"{e.nota.slice(0, 120)}{e.nota.length > 120 ? '…' : ''}"</p>}
          </div>
        ))}
      </div>
    );
  }

  // ── Tab Análisis ──────────────────────────────────────────────────────────
  function TabAnalisis() {
    if (entradas.length < 3) return <EmptyState msg="Necesitas al menos 3 días para ver el análisis." />;

    const promedios = SLIDERS_RAPIDOS.map(s => ({
      label: s.label,
      key: s.key,
      color: s.color,
      valor: entradas.reduce((sum, e) => sum + e.rapido[s.key], 0) / entradas.length,
    }));

    const radarData = promedios.map(p => ({ subject: p.label, A: p.valor, fullMark: 5 }));
    const barData = promedios.map(p => ({ name: p.label.slice(0, 8), valor: parseFloat(p.valor.toFixed(2)), color: p.color }));

    async function exportPDF() {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(26, 34, 53);
      doc.text('Diario Renace 45+ · TrampoFlow®', 20, 24);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(107, 101, 119);
      doc.text(`Exportado el ${new Date().toLocaleDateString('es-ES')} · ${entradas.length} días registrados`, 20, 32);

      doc.setDrawColor(237, 230, 216);
      doc.line(20, 36, 190, 36);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(26, 34, 53);
      doc.text('Promedios generales', 20, 46);

      let y = 54;
      promedios.forEach(p => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(45, 42, 53);
        doc.text(p.label, 20, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`${p.valor.toFixed(2)} / 5`, 120, y);
        y += 8;
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(26, 34, 53);
      doc.text('Últimos 7 días', 20, y);
      y += 8;

      semana.forEach(e => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(26, 34, 53);
        doc.text(new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), 20, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(107, 101, 119);
        const row = SLIDERS_RAPIDOS.map(s => `${s.label}: ${e.rapido[s.key]}`).join('  ·  ');
        doc.text(row, 20, y);
        y += 8;
      });

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(107, 101, 119);
      doc.text('trampoflow.com · Diario Renace 45+ — uso personal', 20, 285);

      doc.save(`diario-renace45-${new Date().toISOString().slice(0, 10)}.pdf`);
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Días registrados', value: entradas.length },
            { label: 'Días sin período', value: diario.meta.dias_sin_periodo },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--borde)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--lavanda)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-tf)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Radar */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--borde)' }}>
          <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--oscuro)', marginBottom: '0.75rem' }}>Perfil de bienestar (promedio)</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#EDE6D8" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <Radar name="Promedio" dataKey="A" stroke="#6B5FA0" fill="#6B5FA0" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--borde)' }}>
          <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--oscuro)', marginBottom: '0.75rem' }}>Promedios por indicador</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} width={20} />
              <Tooltip formatter={(v: number) => [v.toFixed(2)]} />
              <Bar dataKey="valor" fill="#6B5FA0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PDF export */}
        <button
          onClick={exportPDF}
          style={{ background: 'var(--azul-noche)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.9rem 1.5rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          📄 Exportar resumen en PDF
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-tf)', textAlign: 'center' }}>
          El PDF se descarga en tu dispositivo. No se envía a ningún servidor.
        </p>
      </div>
    );
  }

  function EmptyState({ msg }: { msg?: string }) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted-tf)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌙</div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{msg || 'Aún no tienes registros. ¡Empieza hoy!'}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: '1.5px solid var(--borde)', borderRadius: 'var(--radius)', padding: '0.5rem 0.9rem', fontSize: '0.85rem', color: 'var(--muted-tf)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ← Volver
        </button>
        <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 300, color: 'var(--azul-noche)' }}>
          Tu <em>análisis</em>
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
        {TAB_LABELS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ flexShrink: 0, padding: '0.5rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: tab === t.id ? 'var(--lavanda)' : '#fff', color: tab === t.id ? '#fff' : 'var(--muted-tf)', border: tab === t.id ? 'none' : '1.5px solid var(--borde)', transition: 'all 0.2s ease' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hoy' && <TabHoy />}
      {tab === 'semana' && <TabSemana />}
      {tab === 'historial' && <TabHistorial />}
      {tab === 'analisis' && <TabAnalisis />}
    </div>
  );
}
