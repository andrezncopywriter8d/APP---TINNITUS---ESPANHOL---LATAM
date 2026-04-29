import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Check, Pause, Play, TimerReset, Waves, X } from "lucide-react";
import { waveBars, type ProtocolAudio } from "../data/protocolData";
import type { PlayerSource } from "../App";
import type { CheckInInput } from "../state/ondaTeslaState";

interface PlayerScreenProps {
  readonly active: boolean;
  readonly audio: ProtocolAudio;
  readonly source: PlayerSource;
  readonly onComplete: (checkIn: CheckInInput, emergencyResult?: string) => void;
}

const quickTags = ["Zumbido mais baixo", "Igual", "Mais intenso", "Mais calmo", "Mais claro", "Dificil focar"];

export function PlayerScreen({ active, audio, source, onComplete }: PlayerScreenProps) {
  const [remaining, setRemaining] = useState(audio.duration * 60);
  const [running, setRunning] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [emergencyStep, setEmergencyStep] = useState(false);
  const [form, setForm] = useState<CheckInInput>({
    tinnitusScore: 5,
    clarityScore: 5,
    calmScore: 5,
    sleepScore: audio.category === "Sono" ? 5 : null,
    tags: [],
    note: ""
  });
  const intervalRef = useRef<number | null>(null);
  const total = audio.duration * 60;
  const progress = 1 - remaining / total;
  const phase = progress < 0.33 ? "Preparacao" : progress < 0.66 ? "Sincronizacao" : "Silencio e Clareza";

  useEffect(() => {
    setRemaining(audio.duration * 60);
    setRunning(false);
    setCheckOpen(false);
    setEmergencyStep(false);
    setForm({
      tinnitusScore: 5,
      clarityScore: 5,
      calmScore: 5,
      sleepScore: audio.category === "Sono" ? 5 : isMorning() ? 5 : null,
      tags: [],
      note: ""
    });
  }, [audio]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(intervalRef.current ?? undefined);
          setRunning(false);
          setCheckOpen(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalRef.current ?? undefined);
  }, [running]);

  function finishSession() {
    if (total - remaining < 25) {
      setCheckOpen(true);
      return;
    }
    setRunning(false);
    setCheckOpen(true);
  }

  function saveCheckIn() {
    if (source.kind === "emergency") {
      setEmergencyStep(true);
      return;
    }
    onComplete(form);
    setCheckOpen(false);
    setRemaining(total);
  }

  function saveEmergency(result: string) {
    onComplete(form, result);
    setEmergencyStep(false);
    setCheckOpen(false);
    setRemaining(total);
  }

  function toggleTag(tag: string) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag]
    }));
  }

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  return (
    <section className={`screen neuro-screen player-protocol ${active ? "active" : ""}`}>
      <div className="neuro-orbit" />
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><Waves size={14} /> Protocolo Auditivo</span>
        <h1>{audio.category === "Principal" ? "Sessao Gamma" : audio.name}</h1>
        <p>{audio.name}, {audio.duration} minutos. {audio.description}</p>
      </header>

      <article className="ritual-player">
        <div className="timer-dial" style={{ "--timerProgress": `${progress * 360}deg` } as CSSProperties}>
          <div>
            <strong>{String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}</strong>
            <span>{phase}</span>
          </div>
        </div>

        <div className="phase-copy">
          <strong>{phase}</strong>
          <p>{phaseCopy(phase)}</p>
        </div>

        <div className="waveform gamma-wave" aria-label="Waveform da Sessao Gamma">
          {waveBars.map((height, index) => <span className={index / waveBars.length < progress ? "active" : ""} key={`${height}-${index}`} style={{ height: `${height}%` }} />)}
        </div>

        <div className="player-main-actions">
          <button className="protocol-primary" type="button" onClick={() => setRunning(!running)}>
            {running ? <Pause size={19} /> : <Play size={19} />}
            {running ? "Pausar" : "Iniciar protocolo"}
          </button>
          <button className="protocol-secondary" type="button" onClick={() => setRemaining(total)}>
            <TimerReset size={18} />
            Reset
          </button>
        </div>

        <button className="finish-link" type="button" onClick={finishSession}>
          <Check size={18} />
          Finalizar e registrar check-in
        </button>
      </article>

      <div className={`protocol-modal ${checkOpen ? "show" : ""}`}>
        <div className="protocol-modal-panel checkin-panel">
          <div className="protocol-modal-head">
            <div>
              <h3>{emergencyStep ? "Resultado do spike" : "Check-in pos-sessao"}</h3>
              <p>{emergencyStep ? "O zumbido ficou mais controlavel?" : "Registre sinais reais para alimentar seu progresso."}</p>
            </div>
            <button className="protocol-close-btn" type="button" onClick={() => setCheckOpen(false)}><X size={18} /></button>
          </div>
          {emergencyStep ? (
            <div className="protocol-check-grid">
              {["Sim", "Um pouco", "Igual", "Piorou"].map((item) => <button key={item} type="button" onClick={() => saveEmergency(item)}>{item}</button>)}
            </div>
          ) : (
            <>
              <SliderRow label="Zumbido agora" left="silencioso" right="intenso" value={form.tinnitusScore} onChange={(value) => setForm((current) => ({ ...current, tinnitusScore: value }))} />
              <SliderRow label="Clareza mental" left="confuso" right="muito claro" value={form.clarityScore} onChange={(value) => setForm((current) => ({ ...current, clarityScore: value }))} />
              <SliderRow label="Calma" left="tenso" right="calmo" value={form.calmScore} onChange={(value) => setForm((current) => ({ ...current, calmScore: value }))} />
              {form.sleepScore !== null ? <SliderRow label="Sono" left="ruim" right="otimo" value={form.sleepScore} onChange={(value) => setForm((current) => ({ ...current, sleepScore: value }))} /> : null}
              <div className="tag-grid">
                {quickTags.map((tag) => <button className={form.tags.includes(tag) ? "selected" : ""} key={tag} type="button" onClick={() => toggleTag(tag)}>{tag}</button>)}
              </div>
              <textarea value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} placeholder="Alguma observacao rapida?" />
              <button className="protocol-primary full" type="button" onClick={saveCheckIn}>Salvar check-in</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function phaseCopy(phase: string) {
  if (phase === "Preparacao") return "Ajuste o volume, respire e deixe o zumbido sair do centro da atencao.";
  if (phase === "Sincronizacao") return "Mantenha a escuta constante. A meta e regular resposta, nao mascarar tudo.";
  return "Observe silencio, clareza auditiva e estado corporal antes do check-in.";
}

function isMorning() {
  return new Date().getHours() < 11;
}

function SliderRow({ label, left, onChange, right, value }: { readonly label: string; readonly left: string; readonly onChange: (value: number) => void; readonly right: string; readonly value: number }) {
  return (
    <label className="check-slider">
      <span><strong>{label}</strong><b>{value}</b></span>
      <input min="0" max="10" type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <small><em>{left}</em><em>{right}</em></small>
    </label>
  );
}
