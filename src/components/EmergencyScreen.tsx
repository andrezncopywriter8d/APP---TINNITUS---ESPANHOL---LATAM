import { useMemo, useState } from "react";
import { AlertTriangle, Check, Moon, Target, Zap } from "lucide-react";
import { audioById, type EmergencyUse } from "../state/ondaTeslaState";
import { emergencyRecommendations, type ProtocolAudio } from "../data/protocolData";

interface EmergencyScreenProps {
  readonly active: boolean;
  readonly emergencyUses: readonly EmergencyUse[];
  readonly openAudio: (audio: ProtocolAudio, source?: { kind: "emergency"; reason: string }) => void;
}

const reasons = [
  { label: "El zumbido subió", Icon: Zap },
  { label: "Estoy ansioso", Icon: AlertTriangle },
  { label: "Estoy intentando dormir", Icon: Moon },
  { label: "Necesito enfocarme", Icon: Target },
  { label: "Ambiente demasiado silencioso", Icon: Check }
] as const;

export function EmergencyScreen({ active, emergencyUses, openAudio }: EmergencyScreenProps) {
  const [selected, setSelected] = useState("El zumbido subió");
  const recommended = useMemo(() => audioById(emergencyRecommendations[selected]), [selected]);

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><AlertTriangle size={14} /> Emergencia</span>
        <h1>Spike de zumbido?</h1>
        <p>Elige tu estado actual. La app recomienda un audio corto, sin alarma.</p>
      </header>

      <section className="emergency-flow">
        <h2>¿Qué está pasando ahora?</h2>
        <div className="state-grid">
          {reasons.map(({ label, Icon }) => (
            <button className={selected === label ? "selected" : ""} key={label} type="button" onClick={() => setSelected(label)}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <article className="emergency-hero">
        <small>Recomendación</small>
        <strong>{recommended.name}</strong>
        <span>{recommended.duration} minutos · {recommended.bestMoment}</span>
        <p>{recommended.description}</p>
        <button className="protocol-primary" type="button" onClick={() => openAudio(recommended, { kind: "emergency", reason: selected })}>
          <Zap size={19} />
          Iniciar {recommended.name}
        </button>
      </article>

      <section className="protocol-routine-card">
        <div className="empty-state compact">
          <strong>{emergencyUses.length ? `${emergencyUses.length} spikes registrados` : "Aún no hay spikes registrados."}</strong>
          <p>Después de la sesión, guarda si el zumbido quedó más controlable.</p>
        </div>
        {["Volumen alto hoy", "Cafeína o estimulante", "Mal sueño", "Estrés o prisa", "Ambiente muy silencioso"].map((item) => (
          <div className="protocol-routine-row" key={item}>
            <span><Check size={16} /></span>
            <div><strong>{item}</strong><p>Observa si apareció antes del spike.</p></div>
          </div>
        ))}
      </section>
    </section>
  );
}
