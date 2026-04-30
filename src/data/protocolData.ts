import {
  Activity,
  BookOpen,
  Crosshair,
  Home,
  PlayCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ScreenId = "home" | "player" | "emergency" | "progress" | "guide";
export type AudioCategory = "Principal" | "Emergencia" | "Sueño" | "Enfoque";

export interface NavigationItem {
  readonly id: ScreenId;
  readonly label: string;
  readonly icon: LucideIcon;
}

export interface ProtocolAudio {
  readonly id: string;
  readonly name: string;
  readonly category: AudioCategory;
  readonly duration: number;
  readonly bestMoment: string;
  readonly description: string;
}

export interface RoutineTemplate {
  readonly id: string;
  readonly label: string;
  readonly audioId: string;
  readonly goal: string;
}

export interface GuideModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly readingTime: string;
  readonly paragraphs: readonly string[];
}

export interface Milestone {
  readonly day: number;
  readonly title: string;
  readonly description: string;
}

export const navigationItems: readonly NavigationItem[] = [
  { id: "home", label: "Hoy", icon: Home },
  { id: "player", label: "Player", icon: PlayCircle },
  { id: "emergency", label: "Emergencia", icon: Crosshair },
  { id: "progress", label: "Progreso", icon: Activity },
  { id: "guide", label: "Guía", icon: BookOpen }
];

export const audioLibrary: readonly ProtocolAudio[] = [
  {
    id: "onda-tesla-principal",
    name: "Onda Tesla Principal",
    category: "Principal",
    duration: 9,
    bestMoment: "Sesión diaria",
    description: "Protocolo principal para rutina auditiva y claridad."
  },
  {
    id: "silencio-express",
    name: "Silencio Express",
    category: "Emergencia",
    duration: 3,
    bestMoment: "Spike de zumbido",
    description: "Para momentos en que el zumbido sube de repente."
  },
  {
    id: "escudo-anti-spike",
    name: "Escudo Anti-Spike",
    category: "Emergencia",
    duration: 7,
    bestMoment: "Antes de detonantes",
    description: "Para usar antes de situaciones que suelen empeorar el zumbido."
  },
  {
    id: "paz-noturna",
    name: "Paz Nocturna",
    category: "Sueño",
    duration: 8,
    bestMoment: "Antes de dormir",
    description: "Para relajarte y preparar una noche más tranquila."
  },
  {
    id: "sono-quantico",
    name: "Sueño Cuántico",
    category: "Sueño",
    duration: 12,
    bestMoment: "Insomnio o noche difícil",
    description: "Para apoyar una relajación profunda antes de dormir."
  },
  {
    id: "reset-matutino",
    name: "Reset Matutino",
    category: "Enfoque",
    duration: 5,
    bestMoment: "Mañana",
    description: "Para empezar el día con más claridad."
  },
  {
    id: "concentracao-laser",
    name: "Concentración Láser",
    category: "Enfoque",
    duration: 10,
    bestMoment: "Trabajo o lectura",
    description: "Para enfocarte en reuniones, lectura o tareas importantes."
  }
];

export const routineTemplates: readonly RoutineTemplate[] = [
  { id: "manha", label: "Mañana", audioId: "reset-matutino", goal: "Empezar con claridad" },
  { id: "principal", label: "Principal", audioId: "onda-tesla-principal", goal: "Sesión diaria obligatoria" },
  { id: "noite", label: "Noche", audioId: "paz-noturna", goal: "Dormir con más calma" },
  { id: "emergencia", label: "Emergencia", audioId: "silencio-express", goal: "Usar solo en spike" }
];

export const milestones: readonly Milestone[] = [
  { day: 1, title: "Primera sesión", description: "Tu protocolo empezó." },
  { day: 3, title: "Primera racha", description: "Tres días crean tracción." },
  { day: 7, title: "Primera semana", description: "La rutina deja de sentirse nueva." },
  { day: 14, title: "Consistencia inicial", description: "El seguimiento empieza a mostrar señales." },
  { day: 21, title: "Rutina estable", description: "Menos fricción para escuchar cada día." },
  { day: 30, title: "Primer mes", description: "Datos suficientes para comparar patrones." },
  { day: 60, title: "Protocolo avanzado", description: "La jornada ya tiene historial real." },
  { day: 90, title: "Jornada completa", description: "Ciclo completo de seguimiento." }
];

export const guideModules: readonly GuideModule[] = [
  {
    id: "why-9",
    title: "¿Por qué 9 minutos?",
    description: "Una ventana corta reduce fricción y facilita la constancia diaria.",
    readingTime: "1 min",
    paragraphs: [
      "La VSL presenta 9 minutos como una rutina corta para mantener adherencia diaria.",
      "El protocolo usa esa duración para reducir fricción, no para prometer un efecto inmediato.",
      "Úsalo como guía de rutina, no como diagnóstico."
    ]
  },
  {
    id: "gamma",
    title: "¿Qué es la Onda Gamma?",
    description: "Un patrón auditivo usado en la narrativa del protocolo.",
    readingTime: "1 min",
    paragraphs: [
      "La VSL usa la idea de Onda Gamma para explicar enfoque y respuesta auditiva.",
      "En la app, eso se convierte en una sesión guiada con fases y check-in.",
      "Mantén un volumen cómodo y observa tu respuesta percibida."
    ]
  },
  {
    id: "zombie-cells",
    title: "¿Qué son las células zombi?",
    description: "Una metáfora educativa para explicar desgaste e inflamación.",
    readingTime: "1 min",
    paragraphs: [
      "El protocolo usa esta narrativa para explicar procesos de desgaste del cuerpo.",
      "Aquí tratamos el término como lenguaje educativo de la VSL, sin reemplazar una evaluación médica.",
      "Tu seguimiento principal es constancia, zumbido percibido, sueño y claridad."
    ]
  },
  {
    id: "auditory-nerve",
    title: "Zumbido y nervio auditivo",
    description: "El enfoque de la app es respuesta, rutina y observación.",
    readingTime: "1 min",
    paragraphs: [
      "El zumbido puede tener causas distintas y merece atención profesional cuando cambia de forma brusca.",
      "Onda Tesla organiza una rutina de escucha y registro para seguir patrones.",
      "Busca ayuda si hay dolor fuerte, pérdida auditiva súbita o mareo intenso."
    ]
  },
  {
    id: "masking",
    title: "¿Por qué algunos dispositivos enmascaran?",
    description: "El enmascaramiento puede aliviar, pero no sustituye rutina y registro.",
    readingTime: "1 min",
    paragraphs: [
      "Enmascarar sonido puede traer alivio en algunos momentos.",
      "La propuesta de la app es crear un protocolo diario con check-ins y progreso.",
      "Usa recursos de alivio sin subir el volumen de forma agresiva."
    ]
  },
  {
    id: "how-to-use",
    title: "¿Cómo usarlo correctamente?",
    description: "Audífonos, volumen cómodo, 9 minutos y check-in.",
    readingTime: "1 min",
    paragraphs: [
      "Usa audífonos con volumen cómodo.",
      "Completa la sesión principal una vez al día.",
      "Registra zumbido, claridad, calma y sueño para crear historial."
    ]
  },
  {
    id: "hard-days",
    title: "Días difíciles",
    description: "Usa el flujo de spike sin alarma.",
    readingTime: "1 min",
    paragraphs: [
      "Cuando el zumbido suba, usa Emergencia para elegir tu estado actual.",
      "La app recomienda un audio corto y registra el resultado.",
      "Si aparece un síntoma nuevo fuerte, busca orientación profesional."
    ]
  },
  {
    id: "journey",
    title: "Progreso de 90 días",
    description: "Sigue constancia, sueño, calma y zumbido percibido.",
    readingTime: "1 min",
    paragraphs: [
      "La jornada de 90 días ayuda a observar patrones con menos ansiedad.",
      "Los gráficos muestran datos reales guardados localmente.",
      "La constancia vale más que perseguir un número perfecto."
    ]
  }
];

export const emergencyRecommendations: Record<string, string> = {
  "El zumbido subió": "silencio-express",
  "Estoy ansioso": "silencio-express",
  "Estoy intentando dormir": "paz-noturna",
  "Necesito enfocarme": "concentracao-laser",
  "Ambiente demasiado silencioso": "escudo-anti-spike"
};

export const waveBars = [16, 28, 42, 30, 60, 38, 72, 48, 24, 46, 68, 80, 52, 34, 66, 76, 44, 28, 58, 72, 82, 54, 38, 62, 78, 46, 26, 40, 64, 78, 58, 36, 24, 18];
