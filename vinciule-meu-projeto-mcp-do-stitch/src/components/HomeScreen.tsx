import { Check, Clock, Headphones, Menu, Settings, ShieldCheck, Volume2, Zap } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { audioById, completedToday, dayNumber, getCurrentStreak, metricsFromState, todayKey, type OndaTeslaState } from "../state/ondaTeslaState";
import { audioLibrary, milestones, routineTemplates, type ProtocolAudio, type ScreenId } from "../data/protocolData";

interface HomeScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly openAudio: (audio: ProtocolAudio, source?: { kind: "main" | "routine" | "library" | "emergency"; reason?: string; routineId?: string }) => void;
  readonly openScreen: (screen: ScreenId) => void;
  readonly openSettings: () => void;
}

export function HomeScreen({ active, state, setState, openAudio, openScreen, openSettings }: HomeScreenProps) {
  const metrics = metricsFromState(state);
  const journeyDay = dayNumber(state.journeyStartDate);
  const nextMilestone = milestones.find((item) => item.day > journeyDay) ?? milestones[milestones.length - 1];
  const mainDone = completedToday(state);
  const enabledRoutine = routineTemplates.filter((item) => state.routineSettings.enabled[item.id]);
  const doneToday = state.routineCompletions[todayKey()] ?? [];
  const routineDone = enabledRoutine.filter((item) => doneToday.includes(item.id) || (item.id === "principal" && mainDone)).length;
  const reminderDue = isReminderDue(state.reminderSettings.dailySessionTime) && !mainDone;

  function toggleRoutine(id: string) {
    setState((current) => ({
      ...current,
      routineSettings: {
        enabled: {
          ...current.routineSettings.enabled,
          [id]: !current.routineSettings.enabled[id]
        }
      }
    }));
  }

  return (
    <section className={`screen home-protocol ${active ? "active" : ""}`}>
      <header className="protocol-topbar">
        <button className="protocol-square-btn" type="button" aria-label="Abrir menu" onClick={() => openScreen("guide")}>
          <Menu size={20} />
        </button>
        <div className="protocol-brand">
          <strong>Onda Tesla</strong>
          <span>Gamma Protocol</span>
        </div>
        <button className="protocol-profile" type="button" aria-label="Abrir ajustes" onClick={openSettings}>
          <Settings size={18} />
        </button>
      </header>

      <section className="protocol-hero">
        <div className="protocol-eyebrow"><Headphones size={14} /> Hoje</div>
        <h1>Seu protocolo de hoje</h1>
        <p>Complete a sessao principal de 9 minutos e registre como o zumbido responde.</p>
        {state.userProfile ? <span className="profile-chip">Perfil: {state.userProfile.profileName}</span> : null}
      </section>

      <section className="protocol-session-card">
        <div className="journey-row">
          <span>Dia {journeyDay} da jornada</span>
          <strong>Proximo marco: Dia {nextMilestone.day}</strong>
        </div>
        <div className="protocol-session-top">
          <div>
            <h2>Onda Tesla Principal</h2>
            <p>{mainDone ? "Sessao principal concluida hoje." : "Sessao Gamma diaria para clareza auditiva e silencio mental."}</p>
          </div>
          <div className="protocol-ring">
            <svg viewBox="0 0 120 120">
              <circle className="protocol-ring-bg" cx="60" cy="60" r="48" strokeWidth="10" fill="none" />
              <circle className="protocol-ring-progress" cx="60" cy="60" r="48" strokeWidth="10" fill="none" strokeDasharray="301.59" strokeDashoffset={mainDone ? 0 : 301.59} />
            </svg>
            <div className="protocol-ring-center">
              <strong>{mainDone ? "100%" : "0%"}</strong>
              <small>Hoje</small>
            </div>
          </div>
        </div>
        <button className="protocol-primary wide-action" type="button" onClick={() => openAudio(audioLibrary[0], { kind: "main" })}>
          {mainDone ? "Repetir protocolo de 9 min" : "Iniciar sessao de 9 min"}
        </button>
        <div className="protocol-status-strip">
          <span className="pulse-dot" />
          <span>{routineDone} de {enabledRoutine.length} etapas concluidas. {mainDone ? "Rotina principal em dia." : "Sessao principal pendente."}</span>
        </div>
        {reminderDue ? <div className="protocol-status-strip subtle"><Clock size={16} /> Sua sessao de 9 minutos ainda esta pendente.</div> : null}
      </section>

      <ProtocolSection title="Rotina Auditiva" action="Ver guia" onAction={() => openScreen("guide")}>
        <div className="routine-compact">
          {routineTemplates.map((item) => {
            const audio = audioById(item.audioId);
            const enabled = state.routineSettings.enabled[item.id];
            const done = doneToday.includes(item.id) || (item.id === "principal" && mainDone);
            return (
              <div className={`routine-row-mvp ${done ? "done" : ""}`} key={item.id}>
                <button className="routine-check-btn" type="button" onClick={() => toggleRoutine(item.id)} aria-label={enabled ? "Desativar rotina" : "Ativar rotina"}>
                  {enabled ? <Check size={16} /> : null}
                </button>
                <div>
                  <strong>{item.label}</strong>
                  <p>{audio.name} · {audio.duration} min · {item.goal}</p>
                </div>
                <button type="button" onClick={() => openAudio(audio, { kind: "routine", routineId: item.id })}>{done ? "Refazer" : "Iniciar"}</button>
              </div>
            );
          })}
        </div>
      </ProtocolSection>

      <ProtocolSection title="Acoes rapidas" action="Emergencia" onAction={() => openScreen("emergency")}>
        <div className="protocol-quick-list">
          <QuickRow icon={<Zap size={18} />} title="Spike agora" subtitle="Fluxo calmo para zumbido alto" time="3 min" onClick={() => openScreen("emergency")} />
          <QuickRow icon={<Volume2 size={18} />} title="Sono noturno" subtitle="Preparar noite mais calma" time="8 min" onClick={() => openAudio(audioById("paz-noturna"), { kind: "library" })} />
        </div>
      </ProtocolSection>

      <ProtocolSection title="Sinais reais">
        <div className="signal-strip">
          <Signal label="Sessoes" value={String(metrics.totalSessions)} />
          <Signal label="Minutos" value={String(metrics.totalMinutes)} />
          <Signal label="Streak" value={`${getCurrentStreak(state)}d`} />
        </div>
      </ProtocolSection>

      <section className="trust-card">
        <ShieldCheck size={18} />
        <p>Use volume confortavel. O app nao substitui orientacao medica.</p>
      </section>
    </section>
  );
}

function isReminderDue(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() >= hours * 60 + minutes;
}

interface ProtocolSectionProps {
  readonly action?: string;
  readonly children: ReactNode;
  readonly onAction?: () => void;
  readonly title: string;
}

function ProtocolSection({ action, children, onAction, title }: ProtocolSectionProps) {
  return (
    <section className="protocol-section">
      <div className="protocol-section-head">
        <h3>{title}</h3>
        {action ? <button type="button" onClick={onAction}>{action}</button> : null}
      </div>
      {children}
    </section>
  );
}

function QuickRow({ icon, onClick, subtitle, time, title }: { readonly icon: ReactNode; readonly onClick: () => void; readonly subtitle: string; readonly time: string; readonly title: string }) {
  return (
    <button className="protocol-quick-card" type="button" onClick={onClick}>
      <span className="protocol-quick-left"><span className="protocol-quick-icon">{icon}</span><span><strong>{title}</strong><small>{subtitle}</small></span></span>
      <span>{time}</span>
    </button>
  );
}

function Signal({ label, value }: { readonly label: string; readonly value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
