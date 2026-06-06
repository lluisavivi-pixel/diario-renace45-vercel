// ─── Types ───────────────────────────────────────────────────────────────────

export type Categoria = {
  id: string;
  emoji: string;
  nombre: string;
  color: string;
  descripcion: string;
  slider_label: string[];
  nota_empatica: string;
  sintomas: string[];
  especial?: string;
};

export type CategoriaDatos = {
  slider: number | null;
  completada: boolean;
  sintomas: string[];
};

export type RapidoKey =
  | 'energia' | 'sueno' | 'sofocos' | 'animo' | 'digestion' | 'bienestar_intimo';

export type Entrada = {
  fecha: string;
  dia_numero: number;
  hora_registro: string;
  rapido: Record<RapidoKey, number>;
  categorias: Record<string, CategoriaDatos>;
  nota: string;
};

export type Diario = {
  meta: {
    fecha_inicio: string;
    dias_registrados: number;
    email_registrado: boolean;
    email: string;
    nombre: string;
    dias_sin_periodo: number;
    hito_mostrado?: boolean;
  };
  entradas: Entrada[];
};

// ─── 14 Categorías de síntomas ───────────────────────────────────────────────

export const CATEGORIAS_SINTOMAS: Categoria[] = [
  {
    id: 'ciclo',
    emoji: '🌙',
    nombre: 'Ciclo menstrual',
    color: '#9B59B6',
    descripcion: 'Cambios en tu ciclo, duración y flujo',
    slider_label: ['Sin cambios', 'Leve variación', 'Moderado', 'Notable', 'Muy alterado'],
    nota_empatica: 'Tu ciclo está cambiando. Es parte del proceso, no algo que debas "arreglar".',
    sintomas: ['Retraso', 'Adelanto', 'Flujo abundante', 'Flujo escaso', 'Manchado entre períodos', 'Duración irregular', 'Ausencia de período', 'Coágulos'],
    especial: 'contador_periodo',
  },
  {
    id: 'vasomotores',
    emoji: '🔥',
    nombre: 'Sofocos y sudoración',
    color: '#E74C3C',
    descripcion: 'Sofocos, sudoración nocturna, calores repentinos',
    slider_label: ['Ninguno', 'Leve', 'Moderado', 'Intenso', 'Muy intenso'],
    nota_empatica: 'Los sofocos son una señal de que tu sistema termorregulador se está adaptando. Son molestos, pero son temporales.',
    sintomas: ['Sofocos diurnos', 'Sofocos nocturnos', 'Sudoración nocturna', 'Rubor facial', 'Palpitaciones durante sofoco', 'Escalofríos tras sofoco', 'Sofocos frecuentes (+10/día)', 'Sofocos leves ocasionales'],
  },
  {
    id: 'sueno_detalle',
    emoji: '😴',
    nombre: 'Sueño',
    color: '#2980B9',
    descripcion: 'Calidad del sueño, insomnio, despertares',
    slider_label: ['Muy bien', 'Bien', 'Regular', 'Mal', 'Muy mal'],
    nota_empatica: 'El sueño fragmentado es uno de los síntomas más agotadores. Tu cuerpo no te está fallando; está en transición.',
    sintomas: ['Dificultad para dormir', 'Despertar frecuente', 'Despertar muy temprano', 'Sueño no reparador', 'Sofocos nocturnos que despiertan', 'Ansiedad al acostarse', 'Sueño excesivo', 'Pesadillas o sueños vívidos'],
  },
  {
    id: 'cognicion',
    emoji: '🧠',
    nombre: 'Cognición y memoria',
    color: '#16A085',
    descripcion: 'Niebla mental, concentración, memoria',
    slider_label: ['Sin cambios', 'Leve', 'Moderado', 'Notable', 'Muy afectada'],
    nota_empatica: 'La "niebla mental" es real y tiene base hormonal. No es que estés fallando; es que tu cerebro está en plena transición.',
    sintomas: ['Olvidos frecuentes', 'Dificultad de concentración', 'Niebla mental', 'Palabras que no llegan', 'Dificultad multitarea', 'Confusión temporal', 'Menor agilidad mental', 'Mejor que de costumbre'],
  },
  {
    id: 'emocional',
    emoji: '💜',
    nombre: 'Estado emocional',
    color: '#8E44AD',
    descripcion: 'Ánimo, irritabilidad, ansiedad, llanto',
    slider_label: ['Muy estable', 'Estable', 'Variable', 'Inestable', 'Muy inestable'],
    nota_empatica: 'Tus emociones son información, no debilidad. Los cambios hormonales afectan directamente al sistema límbico.',
    sintomas: ['Irritabilidad', 'Tristeza sin causa', 'Ansiedad', 'Llanto fácil', 'Cambios bruscos de humor', 'Sensación de pérdida', 'Mayor sensibilidad', 'Momentos de bienestar y gratitud'],
  },
  {
    id: 'energia_detalle',
    emoji: '⚡',
    nombre: 'Energía y fatiga',
    color: '#F39C12',
    descripcion: 'Nivel de energía, fatiga, vitalidad',
    slider_label: ['Llena de energía', 'Bien', 'Regular', 'Cansada', 'Agotada'],
    nota_empatica: 'El agotamiento en la perimenopausia no es falta de voluntad. Tu cuerpo está haciendo un trabajo enorme.',
    sintomas: ['Fatiga matutina', 'Bajón de tarde', 'Agotamiento tras actividad leve', 'Fatiga persistente', 'Energía fluctuante', 'Sin energía para socializar', 'Mejor energía que otros días', 'Cansancio inexplicable'],
  },
  {
    id: 'peso_metabolismo',
    emoji: '⚖️',
    nombre: 'Peso y metabolismo',
    color: '#27AE60',
    descripcion: 'Cambios en peso, distribución corporal, metabolismo',
    slider_label: ['Sin cambios', 'Leve', 'Moderado', 'Notable', 'Muy notable'],
    nota_empatica: 'Los cambios en la distribución de peso son respuesta hormonal, no falta de disciplina.',
    sintomas: ['Aumento de peso sin cambios en dieta', 'Acumulación abdominal', 'Dificultad para perder peso', 'Retención de líquidos', 'Hinchazón abdominal', 'Cambio en forma corporal', 'Apetito aumentado', 'Apetito disminuido'],
  },
  {
    id: 'musculos_articulaciones',
    emoji: '💪',
    nombre: 'Músculos y articulaciones',
    color: '#E67E22',
    descripcion: 'Dolor articular, rigidez, calambres musculares',
    slider_label: ['Sin molestias', 'Leve', 'Moderado', 'Notable', 'Intenso'],
    nota_empatica: 'El dolor articular en la menopausia tiene base inflamatoria y hormonal. El movimiento suave es aliado, no enemigo.',
    sintomas: ['Rigidez matutina', 'Dolor articular', 'Calambres musculares', 'Dolor de espalda', 'Dolor de rodillas', 'Dolor de manos/muñecas', 'Sensación de tensión muscular', 'Menor flexibilidad'],
  },
  {
    id: 'cardiovascular',
    emoji: '❤️',
    nombre: 'Cardiovascular',
    color: '#C0392B',
    descripcion: 'Palpitaciones, presión, mareos',
    slider_label: ['Sin síntomas', 'Leve', 'Moderado', 'Notable', 'Intenso'],
    nota_empatica: 'El corazón también responde a los cambios hormonales. La mayoría de palpitaciones en esta etapa son benignas.',
    sintomas: ['Palpitaciones', 'Presión arterial elevada', 'Mareos', 'Sensación de opresión', 'Ritmo cardíaco irregular', 'Zumbidos', 'Dolor de cabeza tensional', 'Hormigueo en extremidades'],
  },
  {
    id: 'digestion_detalle',
    emoji: '🌿',
    nombre: 'Digestión',
    color: '#1ABC9C',
    descripcion: 'Digestión, hinchazón, tránsito intestinal',
    slider_label: ['Sin problemas', 'Leve', 'Moderado', 'Notable', 'Muy afectada'],
    nota_empatica: 'El sistema digestivo es muy sensible a los estrógenos. Los cambios que notas tienen una explicación hormonal.',
    sintomas: ['Hinchazón abdominal', 'Gases', 'Estreñimiento', 'Diarrea', 'Náuseas', 'Acidez', 'Digestión lenta', 'Sensibilidad a alimentos'],
  },
  {
    id: 'salud_intima',
    emoji: '🌸',
    nombre: 'Salud íntima',
    color: '#EC407A',
    descripcion: 'Sequedad vaginal, molestias, libido',
    slider_label: ['Sin cambios', 'Leve', 'Moderado', 'Notable', 'Muy notable'],
    nota_empatica: 'La atrofia vulvovaginal afecta a 4 de cada 10 mujeres en la menopausia. No es tabú; es fisiología.',
    sintomas: ['Sequedad vaginal', 'Picor o escozor', 'Molestias en relaciones', 'Disminución de libido', 'Cambios en lubricación', 'Infecciones urinarias frecuentes', 'Urgencia urinaria', 'Cambios en olor o flujo'],
  },
  {
    id: 'suelo_pelvico',
    emoji: '🔵',
    nombre: 'Suelo pélvico',
    color: '#3498DB',
    descripcion: 'Control urinario, presión pélvica, prolapso',
    slider_label: ['Sin cambios', 'Leve', 'Moderado', 'Notable', 'Muy notable'],
    nota_empatica: 'El suelo pélvico merece atención y cuidado, no silencio. Hablar de esto es el primer paso.',
    sintomas: ['Pérdidas al toser/estornudar', 'Urgencia urinaria', 'Sensación de peso pélvico', 'Dificultad para retener orina', 'Frecuencia urinaria aumentada', 'Molestias al estar de pie mucho tiempo', 'Despertares nocturnos para orinar', 'Mejora tras ejercicios de suelo pélvico'],
  },
  {
    id: 'piel_cabello',
    emoji: '✨',
    nombre: 'Piel y cabello',
    color: '#F1C40F',
    descripcion: 'Cambios en piel, cabello, uñas',
    slider_label: ['Sin cambios', 'Leve', 'Moderado', 'Notable', 'Muy notable'],
    nota_empatica: 'La piel y el cabello reflejan los cambios hormonales. Merecen cuidado, no juicio.',
    sintomas: ['Piel más seca', 'Pérdida de firmeza', 'Cabello más fino o frágil', 'Caída de cabello', 'Cambios en textura de piel', 'Aparición de vello facial', 'Uñas más frágiles', 'Mayor sensibilidad de piel'],
  },
  {
    id: 'otros',
    emoji: '📝',
    nombre: 'Otros síntomas',
    color: '#95A5A6',
    descripcion: 'Síntomas que no encajan en otras categorías',
    slider_label: ['Sin síntomas', 'Leve', 'Moderado', 'Notable', 'Intenso'],
    nota_empatica: 'Cada mujer vive la menopausia de manera única. Todos tus síntomas merecen ser registrados.',
    sintomas: ['Tinnitus (pitidos)', 'Sequedad ocular', 'Sequedad bucal', 'Cambios en gusto/olfato', 'Mayor sensibilidad al ruido', 'Alergias o intolerancias nuevas', 'Sensación de irrealidad', 'Otros'],
  },
];

// ─── 6 Sliders rápidos ───────────────────────────────────────────────────────

export const SLIDERS_RAPIDOS = [
  { key: 'energia' as RapidoKey, label: 'Energía', emoji_min: '😴', emoji_max: '⚡', color: '#F39C12' },
  { key: 'sueno' as RapidoKey, label: 'Sueño', emoji_min: '😰', emoji_max: '😴', color: '#2980B9' },
  { key: 'sofocos' as RapidoKey, label: 'Sofocos', emoji_min: '❄️', emoji_max: '🔥', color: '#E74C3C', invert: true },
  { key: 'animo' as RapidoKey, label: 'Ánimo', emoji_min: '😔', emoji_max: '😊', color: '#8E44AD' },
  { key: 'digestion' as RapidoKey, label: 'Digestión', emoji_min: '😣', emoji_max: '🌿', color: '#1ABC9C' },
  { key: 'bienestar_intimo' as RapidoKey, label: 'Bienestar íntimo', emoji_min: '😶', emoji_max: '🌸', color: '#EC407A' },
];

// ─── Citas diarias (7 rotativas) ─────────────────────────────────────────────

export const CITAS_DIARIAS = [
  { texto: 'El cuerpo no miente. Escucharlo es el acto más valiente.', autora: 'TrampoFlow®' },
  { texto: 'Registrar es conocer. Conocer es poder elegir.', autora: 'TrampoFlow®' },
  { texto: 'Esta etapa no es el final de nada. Es el inicio de ti.', autora: 'TrampoFlow®' },
  { texto: 'No tienes que sentirte bien para seguir adelante. Solo tienes que seguir.', autora: 'TrampoFlow®' },
  { texto: 'Cada día que registras es un día que te tomas en serio.', autora: 'TrampoFlow®' },
  { texto: 'La información que recopilas hoy es el mapa de tu bienestar mañana.', autora: 'TrampoFlow®' },
  { texto: 'Tu cuerpo está cambiando. Tú estás creciendo.', autora: 'TrampoFlow®' },
];
