import { audioLibrary, routineTemplates, type AudioCategory, type ProtocolAudio } from "../data/protocolData";

export const STORAGE_KEY = "ondaTeslaAppState";

export interface UserProfile {
  readonly tinnitusType: string;
  readonly intensity: number;
  readonly bothersMost: readonly string[];
  readonly mainImpact: string;
  readonly mainGoal: string;
  readonly profileName: string;
}

export interface SessionRecord {
  readonly id: string;
  readonly date: string;
  readonly audioId: string;
  readonly audioName: string;
  readonly category: AudioCategory;
  readonly duration: number;
  readonly completed: boolean;
  readonly startedAt: string;
  readonly completedAt: string;
}

export interface CheckInRecord {
  readonly id: string;
  readonly date: string;
  readonly audioId: string;
  readonly audioName: string;
  readonly category: AudioCategory;
  readonly duration: number;
  readonly tinnitusScore: number;
  readonly clarityScore: number;
  readonly calmScore: number;
  readonly sleepScore: number | null;
  readonly tags: readonly string[];
  readonly note: string;
}

export interface EmergencyUse {
  readonly id: string;
  readonly date: string;
  readonly reason: string;
  readonly audioId: string;
  readonly audioName: string;
  readonly result: string;
}

export interface RoutineSettings {
  readonly enabled: Record<string, boolean>;
}

export interface ReminderSettings {
  readonly dailySessionEnabled: boolean;
  readonly dailySessionTime: string;
  readonly nightReminderEnabled: boolean;
  readonly nightReminderTime: string;
  readonly checkInReminderEnabled: boolean;
  readonly missedDayReminderEnabled: boolean;
}

export interface AccessibilitySettings {
  readonly largerText: boolean;
  readonly highContrast: boolean;
  readonly reduceMotion: boolean;
}

export interface OndaTeslaState {
  readonly onboardingCompleted: boolean;
  readonly userProfile: UserProfile | null;
  readonly journeyStartDate: string;
  readonly sessions: readonly SessionRecord[];
  readonly checkIns: readonly CheckInRecord[];
  readonly emergencyUses: readonly EmergencyUse[];
  readonly completedGuides: readonly string[];
  readonly routineSettings: RoutineSettings;
  readonly routineCompletions: Record<string, readonly string[]>;
  readonly reminderSettings: ReminderSettings;
  readonly accessibilitySettings: AccessibilitySettings;
  readonly milestonesViewed: readonly number[];
  readonly audioUsage: Record<string, number>;
}

export interface CheckInInput {
  readonly tinnitusScore: number;
  readonly clarityScore: number;
  readonly calmScore: number;
  readonly sleepScore: number | null;
  readonly tags: readonly string[];
  readonly note: string;
}

export const defaultState: OndaTeslaState = {
  onboardingCompleted: false,
  userProfile: null,
  journeyStartDate: todayKey(),
  sessions: [],
  checkIns: [],
  emergencyUses: [],
  completedGuides: [],
  routineSettings: {
    enabled: Object.fromEntries(routineTemplates.map((item) => [item.id, true]))
  },
  routineCompletions: {},
  reminderSettings: {
    dailySessionEnabled: true,
    dailySessionTime: "09:00",
    nightReminderEnabled: false,
    nightReminderTime: "21:30",
    checkInReminderEnabled: true,
    missedDayReminderEnabled: true
  },
  accessibilitySettings: {
    largerText: false,
    highContrast: false,
    reduceMotion: false
  },
  milestonesViewed: [],
  audioUsage: {}
};

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadOndaTeslaState(): OndaTeslaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));

    const oldSessions = Number(localStorage.getItem("onda_tesla_completed_sessions") ?? 0);
    const oldEmergency = Number(localStorage.getItem("onda_tesla_emergency_uses") ?? 0);
    if (oldSessions || oldEmergency) {
      return normalizeState({
        ...defaultState,
        onboardingCompleted: false,
        audioUsage: oldEmergency ? { "silencio-express": oldEmergency } : {}
      });
    }
  } catch {
    return defaultState;
  }
  return defaultState;
}

export function saveOndaTeslaState(state: OndaTeslaState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function normalizeState(partial: Partial<OndaTeslaState>): OndaTeslaState {
  return {
    ...defaultState,
    ...partial,
    routineSettings: {
      enabled: {
        ...defaultState.routineSettings.enabled,
        ...(partial.routineSettings?.enabled ?? {})
      }
    },
    reminderSettings: {
      ...defaultState.reminderSettings,
      ...(partial.reminderSettings ?? {})
    },
    accessibilitySettings: {
      ...defaultState.accessibilitySettings,
      ...(partial.accessibilitySettings ?? {})
    },
    audioUsage: {
      ...(partial.audioUsage ?? {})
    }
  };
}

export function audioById(id: string): ProtocolAudio {
  return audioLibrary.find((audio) => audio.id === id) ?? audioLibrary[0];
}

export function generateProfileName(profile: Omit<UserProfile, "profileName">): string {
  if (profile.bothersMost.includes("Antes de dormir") || profile.mainImpact === "Sueño" || profile.mainImpact === "Sono") {
    return "Zumbido Nocturno";
  }
  if (profile.mainGoal === "Controlar spikes" || profile.mainImpact === "Ansiedad" || profile.mainImpact === "Ansiedade") {
    return "Spike y Calma";
  }
  if (profile.mainImpact === "Enfoque" || profile.mainImpact === "Foco" || profile.mainGoal === "Tener más claridad" || profile.mainGoal === "Ter mais clareza") {
    return "Enfoque y Claridad";
  }
  if (profile.bothersMost.includes("Todo el día") || profile.bothersMost.includes("O dia inteiro")) {
    return "Zumbido Constante";
  }
  return "Protocolo Moderado";
}

export function dayNumber(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const now = new Date(`${todayKey()}T00:00:00`);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

export function completedToday(state: OndaTeslaState, audioId = "onda-tesla-principal") {
  const today = todayKey();
  return state.sessions.some((session) => session.completed && session.audioId === audioId && session.date === today);
}

export function getCurrentStreak(state: OndaTeslaState) {
  const dates = new Set(state.sessions.filter((session) => session.completed && session.audioId === "onda-tesla-principal").map((session) => session.date));
  let streak = 0;
  const cursor = new Date(`${todayKey()}T00:00:00`);
  while (dates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function average(values: readonly number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function lastNDays(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return todayKey(date);
  });
}

export function metricsFromState(state: OndaTeslaState) {
  const completed = state.sessions.filter((session) => session.completed);
  const checkIns = state.checkIns;
  const last7 = new Set(lastNDays(7));
  const weeklySessions = completed.filter((session) => last7.has(session.date));
  const usageEntries = Object.entries(state.audioUsage).sort((a, b) => b[1] - a[1]);
  const mostUsed = usageEntries[0] ? audioById(usageEntries[0][0]).name : "Ninguno aún";
  return {
    totalSessions: completed.length,
    totalMinutes: completed.reduce((sum, session) => sum + session.duration, 0),
    currentStreak: getCurrentStreak(state),
    weeklyConsistency: new Set(weeklySessions.map((session) => session.date)).size,
    averageTinnitusScore: average(checkIns.map((item) => item.tinnitusScore)),
    averageClarityScore: average(checkIns.map((item) => item.clarityScore)),
    averageCalmScore: average(checkIns.map((item) => item.calmScore)),
    averageSleepScore: average(checkIns.map((item) => item.sleepScore).filter((value): value is number => value !== null)),
    emergencyUses: state.emergencyUses.length,
    mostUsedAudio: mostUsed
  };
}

export function addCompletedSession(state: OndaTeslaState, audio: ProtocolAudio, checkIn: CheckInInput): OndaTeslaState {
  const now = new Date().toISOString();
  const date = todayKey();
  const sessionId = makeId("session");
  const session: SessionRecord = {
    id: sessionId,
    date,
    audioId: audio.id,
    audioName: audio.name,
    category: audio.category,
    duration: audio.duration,
    completed: true,
    startedAt: now,
    completedAt: now
  };
  const record: CheckInRecord = {
    id: makeId("check"),
    date,
    audioId: audio.id,
    audioName: audio.name,
    category: audio.category,
    duration: audio.duration,
    tinnitusScore: checkIn.tinnitusScore,
    clarityScore: checkIn.clarityScore,
    calmScore: checkIn.calmScore,
    sleepScore: checkIn.sleepScore,
    tags: checkIn.tags,
    note: checkIn.note
  };
  return {
    ...state,
    sessions: [...state.sessions, session],
    checkIns: [...state.checkIns, record],
    audioUsage: {
      ...state.audioUsage,
      [audio.id]: (state.audioUsage[audio.id] ?? 0) + 1
    }
  };
}

export function markRoutineDone(state: OndaTeslaState, routineId: string): OndaTeslaState {
  const today = todayKey();
  const current = state.routineCompletions[today] ?? [];
  if (current.includes(routineId)) return state;
  return {
    ...state,
    routineCompletions: {
      ...state.routineCompletions,
      [today]: [...current, routineId]
    }
  };
}
