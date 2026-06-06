import { Diario, Entrada, RapidoKey, CATEGORIAS_SINTOMAS } from './data';

const KEY = 'diario_renace_45';

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function emptyDiario(): Diario {
  return {
    meta: {
      fecha_inicio: todayISO(),
      dias_registrados: 0,
      email_registrado: false,
      email: '',
      nombre: '',
      dias_sin_periodo: 0,
      hito_mostrado: false,
    },
    entradas: [],
  };
}

export function newEntradaForToday(dia_numero: number): Entrada {
  const categorias: Record<string, { slider: null; completada: false; sintomas: [] }> = {};
  CATEGORIAS_SINTOMAS.forEach(c => {
    categorias[c.id] = { slider: null, completada: false, sintomas: [] };
  });

  const rapido: Record<RapidoKey, number> = {
    energia: 3,
    sueno: 3,
    sofocos: 1,
    animo: 3,
    digestion: 3,
    bienestar_intimo: 3,
  };

  return {
    fecha: todayISO(),
    dia_numero,
    hora_registro: new Date().toISOString(),
    rapido,
    categorias,
    nota: '',
  };
}

export function loadDiario(): Diario {
  if (typeof window === 'undefined') return emptyDiario();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDiario();
    return JSON.parse(raw) as Diario;
  } catch {
    return emptyDiario();
  }
}

export function saveDiario(d: Diario): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // Storage full or unavailable
  }
}

export function resetToday(d: Diario): Diario {
  const today = todayISO();
  return { ...d, entradas: d.entradas.filter(e => e.fecha !== today) };
}

export function wipeDiario(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
