import { Activity, Brain, CalendarCheck, Clock, Moon, RadioTower, Sparkles, Volume2 } from "lucide-react";
import { lastNDays, metricsFromState, dayNumber, type OndaTeslaState } from "../state/ondaTeslaState";
import { milestones } from "../data/protocolData";

interface ProgressScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
}

export function ProgressScreen({ active, state }: ProgressScreenProps) {
  const metrics = metricsFromState(state);
  const hasData = state.checkIns.length > 0 || state.sessions.length > 0;
  const journeyDay = dayNumber(state.journeyStartDate);
  const next = milestones.find((item) => item.day > journeyDay);
  const trend = buildTrends(state);

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><Activity size={14} /> Progreso</span>
        <h1>Progreso de 90 días</h1>
        <p>Números reales de tu protocolo local. Sin datos falsos.</p>
      </header>

      {!hasData ? (
        <div className="empty-state">
          <strong>Completa tu primera sesión para iniciar tu historial.</strong>
          <p>Después del check-in, zumbido, claridad, calma y sueño aparecen aquí.</p>
        </div>
      ) : null}

      <div className="progress-hero neuro-progress-main">
        <div>
          <span className="kicker">Día {journeyDay}</span>
          <h2>{metrics.weeklyConsistency}/7 días</h2>
          <p>{next ? `Próximo hito: Día ${next.day} - ${next.title}` : "Jornada completa registrada."}</p>
        </div>
        <div className="progress-ring">
          <strong>{Math.round((metrics.weeklyConsistency / 7) * 100)}%</strong>
        </div>
      </div>

      <div className="metric-grid compact-metrics">
        {[
          { label: "zumbido medio", value: fmt(metrics.averageTinnitusScore), detail: "escala 0-10", Icon: Volume2 },
          { label: "claridad", value: fmt(metrics.averageClarityScore), detail: "promedio de check-ins", Icon: Brain },
          { label: "sueño", value: fmt(metrics.averageSleepScore), detail: "cuando se registra", Icon: Moon },
          { label: "calma", value: fmt(metrics.averageCalmScore), detail: "pos-sesión", Icon: Activity },
          { label: "sesiones", value: String(metrics.totalSessions), detail: "completadas", Icon: RadioTower },
          { label: "minutos", value: String(metrics.totalMinutes), detail: "total", Icon: Clock },
          { label: "días seguidos", value: String(metrics.currentStreak), detail: "racha actual", Icon: CalendarCheck },
          { label: "spikes", value: String(metrics.emergencyUses), detail: "emergencias", Icon: Sparkles }
        ].map(({ label, value, detail, Icon }) => (
          <article className="metric-card large" key={label}>
            <span className="metric-icon"><Icon size={22} /></span>
            <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
          </article>
        ))}
      </div>

      <section className="timeline-90">
        <h2>Jornada de 90 días</h2>
        <p>{next ? `Próximo hito: Día ${next.day} - ${next.title}` : "Todos los hitos principales están desbloqueados."}</p>
        <div>
          {milestones.map((item) => (
            <span className={journeyDay >= item.day ? "done" : item.day === next?.day ? "active" : "locked"} key={item.day}>
              Día {item.day}
            </span>
          ))}
        </div>
      </section>

      <Trend title="Zumbido 7 días" data={trend.tinnitus} />
      <Trend title="Claridad 7 días" data={trend.clarity} />
      <Trend title="Minutos 7 días" data={trend.minutes} />
      <section className="protocol-routine-card">
        <div className="protocol-routine-row">
          <span><CheckIcon /></span>
          <div><strong>Audio más usado</strong><p>{metrics.mostUsedAudio}</p></div>
        </div>
      </section>
    </section>
  );
}

function fmt(value: number | null) {
  return value === null ? "--" : value.toFixed(1);
}

function buildTrends(state: OndaTeslaState) {
  const days = lastNDays(7);
  return {
    tinnitus: days.map((day) => avg(state.checkIns.filter((item) => item.date === day).map((item) => item.tinnitusScore))),
    clarity: days.map((day) => avg(state.checkIns.filter((item) => item.date === day).map((item) => item.clarityScore))),
    minutes: days.map((day) => state.sessions.filter((item) => item.date === day).reduce((sum, item) => sum + item.duration, 0))
  };
}

function avg(values: readonly number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function Trend({ data, title }: { readonly data: readonly number[]; readonly title: string }) {
  const max = Math.max(...data, 10);
  return (
    <div className="activity-chart trend-chart" aria-label={title}>
      <strong>{title}</strong>
      <div>
        {data.map((value, index) => <span key={index} style={{ height: `${Math.max(10, (value / max) * 100)}%` }} />)}
      </div>
    </div>
  );
}

function CheckIcon() {
  return <RadioTower size={16} />;
}
