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
        <span className="protocol-eyebrow"><Activity size={14} /> Progresso</span>
        <h1>Progresso de 90 dias</h1>
        <p>Numeros reais do seu protocolo local. Sem dados falsos.</p>
      </header>

      {!hasData ? (
        <div className="empty-state">
          <strong>Complete sua primeira sessao para iniciar seu historico.</strong>
          <p>Depois do check-in, zumbido, clareza, calma e sono aparecem aqui.</p>
        </div>
      ) : null}

      <div className="progress-hero neuro-progress-main">
        <div>
          <span className="kicker">Dia {journeyDay}</span>
          <h2>{metrics.weeklyConsistency}/7 dias</h2>
          <p>{next ? `Proximo marco: Dia ${next.day} - ${next.title}` : "Jornada completa registrada."}</p>
        </div>
        <div className="progress-ring">
          <strong>{Math.round((metrics.weeklyConsistency / 7) * 100)}%</strong>
        </div>
      </div>

      <div className="metric-grid compact-metrics">
        {[
          { label: "zumbido medio", value: fmt(metrics.averageTinnitusScore), detail: "escala 0-10", Icon: Volume2 },
          { label: "clareza", value: fmt(metrics.averageClarityScore), detail: "media dos check-ins", Icon: Brain },
          { label: "sono", value: fmt(metrics.averageSleepScore), detail: "quando registrado", Icon: Moon },
          { label: "calma", value: fmt(metrics.averageCalmScore), detail: "pos-sessao", Icon: Activity },
          { label: "sessoes", value: String(metrics.totalSessions), detail: "concluidas", Icon: RadioTower },
          { label: "minutos", value: String(metrics.totalMinutes), detail: "total", Icon: Clock },
          { label: "dias seguidos", value: String(metrics.currentStreak), detail: "streak atual", Icon: CalendarCheck },
          { label: "spikes", value: String(metrics.emergencyUses), detail: "emergencias", Icon: Sparkles }
        ].map(({ label, value, detail, Icon }) => (
          <article className="metric-card large" key={label}>
            <span className="metric-icon"><Icon size={22} /></span>
            <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
          </article>
        ))}
      </div>

      <section className="timeline-90">
        <h2>Jornada 90 dias</h2>
        <p>{next ? `Proximo marco: Dia ${next.day} - ${next.title}` : "Todos os marcos principais desbloqueados."}</p>
        <div>
          {milestones.map((item) => (
            <span className={journeyDay >= item.day ? "done" : item.day === next?.day ? "active" : "locked"} key={item.day}>
              Dia {item.day}
            </span>
          ))}
        </div>
      </section>

      <Trend title="Zumbido 7 dias" data={trend.tinnitus} />
      <Trend title="Clareza 7 dias" data={trend.clarity} />
      <Trend title="Minutos 7 dias" data={trend.minutes} />
      <section className="protocol-routine-card">
        <div className="protocol-routine-row">
          <span><CheckIcon /></span>
          <div><strong>Audio mais usado</strong><p>{metrics.mostUsedAudio}</p></div>
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
