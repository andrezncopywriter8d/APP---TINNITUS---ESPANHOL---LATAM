import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { BookOpen, Check, Headphones, HelpCircle, Library, Settings } from "lucide-react";
import { audioLibrary, guideModules, type AudioCategory, type ProtocolAudio } from "../data/protocolData";
import type { OndaTeslaState } from "../state/ondaTeslaState";

interface GuideScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly openAudio: (audio: ProtocolAudio, source?: { kind: "library" }) => void;
  readonly openSettings: () => void;
}

type GuideTab = "guide" | "library" | "support";
const categories: readonly ("Todos" | AudioCategory)[] = ["Todos", "Principal", "Emergencia", "Sueño", "Enfoque"];

export function GuideScreen({ active, state, setState, openAudio, openSettings }: GuideScreenProps) {
  const [tab, setTab] = useState<GuideTab>("guide");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const module = guideModules.find((item) => item.id === selectedModule);
  const filtered = useMemo(() => category === "Todos" ? audioLibrary : audioLibrary.filter((audio) => audio.category === category), [category]);

  function markRead(id: string) {
    setState((current) => ({
      ...current,
      completedGuides: current.completedGuides.includes(id) ? current.completedGuides : [...current.completedGuides, id]
    }));
    setSelectedModule(null);
  }

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><BookOpen size={14} /> Guía Auditiva</span>
        <h1>Entiende tu protocolo</h1>
        <p>Educación corta, biblioteca de audios y soporte en un área simple.</p>
      </header>

      <div className="segmented">
        <button className={tab === "guide" ? "active" : ""} type="button" onClick={() => setTab("guide")}><BookOpen size={16} /> Guía</button>
        <button className={tab === "library" ? "active" : ""} type="button" onClick={() => setTab("library")}><Library size={16} /> Audios</button>
        <button className={tab === "support" ? "active" : ""} type="button" onClick={() => setTab("support")}><HelpCircle size={16} /> Soporte</button>
      </div>

      {tab === "guide" ? (
        <>
          <div className="guide-progress">
            <strong>{state.completedGuides.length}/{guideModules.length}</strong>
            <span>módulos leídos</span>
          </div>
          {!state.completedGuides.length ? <div className="empty-state compact">Empieza por el módulo "¿Por qué 9 minutos?"</div> : null}
          <div className="guide-list">
            {guideModules.map((item, index) => (
              <button className={state.completedGuides.includes(item.id) ? "read" : ""} key={item.id} type="button" onClick={() => setSelectedModule(item.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>Lectura: {item.readingTime}</small>
                </div>
                {state.completedGuides.includes(item.id) ? <Check size={18} /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {tab === "library" ? (
        <>
          <div className="chip-row mvp-chips">
            {categories.map((item) => <button className={category === item ? "selected" : ""} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="audio-library">
            {filtered.map((audio) => (
              <article className="audio-row" key={audio.id}>
                <span><Headphones size={18} /></span>
                <div>
                  <strong>{audio.name}</strong>
                  <p>{audio.category} · {audio.duration} min · {audio.bestMoment}</p>
                  <small>{audio.description}</small>
                  <small>Usos: {state.audioUsage[audio.id] ?? 0}</small>
                </div>
                <button type="button" onClick={() => openAudio(audio, { kind: "library" })}>Iniciar</button>
              </article>
            ))}
          </div>
        </>
      ) : null}

      {tab === "support" ? (
        <div className="support-list">
          <button type="button" onClick={openSettings}><Settings size={18} /> Abrir ajustes y recordatorios</button>
          {[
            "¿Cómo usar Onda Tesla?",
            "¿Necesito escuchar todos los días?",
            "¿Puedo escuchar antes de dormir?",
            "¿Qué hago si pierdo un día?",
            "¿Cuándo puedo notar cambios?",
            "¿Qué hago en un spike?",
            "¿Cómo funciona la garantía de 90 días?",
            "Hablar con soporte"
          ].map((item) => <div key={item}>{item}<p>Respuesta corta dentro del soporte del protocolo.</p></div>)}
          <section className="trust-card">
            <strong>Garantía de 90 días</strong>
            <p>Prueba el protocolo con tranquilidad. Si necesitas ayuda, habla con soporte.</p>
          </section>
        </div>
      ) : null}

      <div className={`protocol-modal ${module ? "show" : ""}`}>
        <div className="protocol-modal-panel">
          {module ? (
            <>
              <div className="protocol-modal-head">
                <div><h3>{module.title}</h3><p>{module.description}</p></div>
              </div>
              <div className="guide-detail">
                {module.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <button className="protocol-primary full" type="button" onClick={() => markRead(module.id)}>Marcar como leído</button>
              <button className="protocol-secondary full" type="button" onClick={() => setSelectedModule(null)}>Volver</button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
