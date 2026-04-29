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
  { label: "Zumbido aumentou", Icon: Zap },
  { label: "Estou ansioso", Icon: AlertTriangle },
  { label: "Estou tentando dormir", Icon: Moon },
  { label: "Preciso focar", Icon: Target },
  { label: "Ambiente silencioso demais", Icon: Check }
] as const;

export function EmergencyScreen({ active, emergencyUses, openAudio }: EmergencyScreenProps) {
  const [selected, setSelected] = useState("Zumbido aumentou");
  const recommended = useMemo(() => audioById(emergencyRecommendations[selected]), [selected]);

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><AlertTriangle size={14} /> Emergencia</span>
        <h1>Spike de zumbido?</h1>
        <p>Escolha o estado atual. O app recomenda um audio curto, sem alarme.</p>
      </header>

      <section className="emergency-flow">
        <h2>O que esta acontecendo agora?</h2>
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
        <small>Recomendacao</small>
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
          <strong>{emergencyUses.length ? `${emergencyUses.length} spikes registrados` : "Nenhum spike registrado ainda."}</strong>
          <p>Depois da sessao, salve se o zumbido ficou mais controlavel.</p>
        </div>
        {["Volume alto hoje", "Cafeina ou estimulante", "Sono ruim", "Estresse ou pressa", "Ambiente muito silencioso"].map((item) => (
          <div className="protocol-routine-row" key={item}>
            <span><Check size={16} /></span>
            <div><strong>{item}</strong><p>Observe se apareceu antes do spike.</p></div>
          </div>
        ))}
      </section>
    </section>
  );
}
