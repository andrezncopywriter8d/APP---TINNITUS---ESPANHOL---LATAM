import {
  Activity,
  BookOpen,
  Crosshair,
  Home,
  PlayCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ScreenId = "home" | "player" | "emergency" | "progress" | "guide";
export type AudioCategory = "Principal" | "Emergencia" | "Sono" | "Foco";

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
  { id: "home", label: "Hoje", icon: Home },
  { id: "player", label: "Player", icon: PlayCircle },
  { id: "emergency", label: "Emergencia", icon: Crosshair },
  { id: "progress", label: "Progresso", icon: Activity },
  { id: "guide", label: "Guia", icon: BookOpen }
];

export const audioLibrary: readonly ProtocolAudio[] = [
  {
    id: "onda-tesla-principal",
    name: "Onda Tesla Principal",
    category: "Principal",
    duration: 9,
    bestMoment: "Sessao diaria",
    description: "Protocolo principal para rotina auditiva e clareza."
  },
  {
    id: "silencio-express",
    name: "Silencio Express",
    category: "Emergencia",
    duration: 3,
    bestMoment: "Spike de zumbido",
    description: "Para momentos em que o zumbido aumenta de repente."
  },
  {
    id: "escudo-anti-spike",
    name: "Escudo Anti-Spike",
    category: "Emergencia",
    duration: 7,
    bestMoment: "Antes de gatilhos",
    description: "Para usar antes de situacoes que costumam piorar o zumbido."
  },
  {
    id: "paz-noturna",
    name: "Paz Noturna",
    category: "Sono",
    duration: 8,
    bestMoment: "Antes de dormir",
    description: "Para relaxar e preparar uma noite mais calma."
  },
  {
    id: "sono-quantico",
    name: "Sono Quantico",
    category: "Sono",
    duration: 12,
    bestMoment: "Insonia ou noite dificil",
    description: "Para apoiar relaxamento profundo antes do sono."
  },
  {
    id: "reset-matutino",
    name: "Reset Matutino",
    category: "Foco",
    duration: 5,
    bestMoment: "Manha",
    description: "Para comecar o dia com mais clareza."
  },
  {
    id: "concentracao-laser",
    name: "Concentracao Laser",
    category: "Foco",
    duration: 10,
    bestMoment: "Trabalho ou leitura",
    description: "Para foco em reunioes, leitura ou tarefas importantes."
  }
];

export const routineTemplates: readonly RoutineTemplate[] = [
  { id: "manha", label: "Manha", audioId: "reset-matutino", goal: "Comecar com clareza" },
  { id: "principal", label: "Principal", audioId: "onda-tesla-principal", goal: "Sessao diaria obrigatoria" },
  { id: "noite", label: "Noite", audioId: "paz-noturna", goal: "Dormir com mais calma" },
  { id: "emergencia", label: "Emergencia", audioId: "silencio-express", goal: "Usar apenas em spike" }
];

export const milestones: readonly Milestone[] = [
  { day: 1, title: "Primeira sessao", description: "Seu protocolo comecou." },
  { day: 3, title: "Primeira sequencia", description: "Tres dias criam tracao." },
  { day: 7, title: "Primeira semana", description: "A rotina deixa de ser novidade." },
  { day: 14, title: "Consistencia inicial", description: "O acompanhamento ganha sinal." },
  { day: 21, title: "Rotina estabilizada", description: "Menos friccao para ouvir diariamente." },
  { day: 30, title: "Primeiro mes", description: "Dados suficientes para comparar padroes." },
  { day: 60, title: "Protocolo avancado", description: "A jornada ja tem historico real." },
  { day: 90, title: "Jornada completa", description: "Ciclo completo de acompanhamento." }
];

export const guideModules: readonly GuideModule[] = [
  {
    id: "why-9",
    title: "Por que 9 minutos?",
    description: "Uma janela curta reduz friccao e facilita consistencia diaria.",
    readingTime: "1 min",
    paragraphs: [
      "A VSL apresenta 9 minutos como uma rotina curta para manter adesao diaria.",
      "O protocolo usa essa duracao para reduzir atrito, nao para prometer efeito imediato.",
      "Use como guia de rotina, nao como diagnostico."
    ]
  },
  {
    id: "gamma",
    title: "O que e Onda Gamma?",
    description: "Um padrao auditivo usado na narrativa do protocolo.",
    readingTime: "1 min",
    paragraphs: [
      "A VSL usa a ideia de Onda Gamma para explicar foco e resposta auditiva.",
      "No app, isso vira uma sessao guiada com fases e check-in.",
      "Mantenha volume confortavel e observe sua resposta percebida."
    ]
  },
  {
    id: "zombie-cells",
    title: "O que sao celulas zumbi?",
    description: "Uma metafora educacional para explicar desgaste e inflamacao.",
    readingTime: "1 min",
    paragraphs: [
      "O protocolo usa essa narrativa para explicar processos de desgaste do corpo.",
      "Aqui tratamos o termo como linguagem educativa da VSL, sem substituir avaliacao medica.",
      "Seu acompanhamento principal e consistencia, zumbido percebido, sono e clareza."
    ]
  },
  {
    id: "auditory-nerve",
    title: "Zumbido e nervo auditivo",
    description: "O foco do app e resposta, rotina e observacao.",
    readingTime: "1 min",
    paragraphs: [
      "O zumbido pode ter causas diferentes e merece atencao profissional quando muda de forma brusca.",
      "A Onda Tesla organiza uma rotina de escuta e registro para acompanhar padroes.",
      "Procure ajuda se houver dor forte, perda auditiva subita ou tontura intensa."
    ]
  },
  {
    id: "masking",
    title: "Por que aparelhos mascaram?",
    description: "Mascaramento pode aliviar, mas nao substitui rotina e registro.",
    readingTime: "1 min",
    paragraphs: [
      "Mascarar som pode trazer alivio em alguns momentos.",
      "A proposta do app e criar um protocolo diario com check-ins e progresso.",
      "Use recursos de alivio sem aumentar volume de forma agressiva."
    ]
  },
  {
    id: "how-to-use",
    title: "Como usar corretamente?",
    description: "Fones, volume confortavel, 9 minutos e check-in.",
    readingTime: "1 min",
    paragraphs: [
      "Use fones em volume confortavel.",
      "Complete a sessao principal uma vez ao dia.",
      "Registre zumbido, clareza, calma e sono para criar historico."
    ]
  },
  {
    id: "hard-days",
    title: "Dias dificeis",
    description: "Use o fluxo de spike sem alarme.",
    readingTime: "1 min",
    paragraphs: [
      "Quando o zumbido subir, use Emergencia para escolher o estado atual.",
      "O app recomenda um audio curto e registra o resultado.",
      "Se houver sintoma novo forte, procure orientacao profissional."
    ]
  },
  {
    id: "journey",
    title: "Progresso de 90 dias",
    description: "Acompanhe consistencia, sono, calma e zumbido percebido.",
    readingTime: "1 min",
    paragraphs: [
      "A jornada de 90 dias ajuda a observar padroes com menos ansiedade.",
      "Os graficos mostram dados reais salvos localmente.",
      "Consistencia vale mais que perseguir um numero perfeito."
    ]
  }
];

export const emergencyRecommendations: Record<string, string> = {
  "Zumbido aumentou": "silencio-express",
  "Estou ansioso": "silencio-express",
  "Estou tentando dormir": "paz-noturna",
  "Preciso focar": "concentracao-laser",
  "Ambiente silencioso demais": "escudo-anti-spike"
};

export const waveBars = [16, 28, 42, 30, 60, 38, 72, 48, 24, 46, 68, 80, 52, 34, 66, 76, 44, 28, 58, 72, 82, 54, 38, 62, 78, 46, 26, 40, 64, 78, 58, 36, 24, 18];
