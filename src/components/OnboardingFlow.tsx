import { useMemo, useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { generateProfileName, type UserProfile } from "../state/ondaTeslaState";

interface OnboardingFlowProps {
  readonly onComplete: (profile: UserProfile) => void;
  readonly onSkip: () => void;
}

const questions = [
  {
    key: "tinnitusType",
    title: "Como seu zumbido aparece?",
    options: ["Apito agudo", "Chiado constante", "Ruido eletrico", "Pulsacao", "Pressao no ouvido", "Outro"]
  },
  {
    key: "bothersMost",
    title: "Quando incomoda mais?",
    options: ["Ao acordar", "Durante o dia", "Em conversas", "No silencio", "Antes de dormir", "O dia inteiro"],
    multi: true
  },
  {
    key: "mainImpact",
    title: "Qual impacto pesa mais?",
    options: ["Sono", "Foco", "Conversas", "Clareza mental", "Ansiedade", "Vida social"]
  },
  {
    key: "mainGoal",
    title: "Qual meta principal?",
    options: ["Reduzir volume do zumbido", "Dormir melhor", "Ter mais clareza", "Ouvir conversas melhor", "Criar rotina diaria", "Controlar spikes"]
  }
] as const;

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [intensity, setIntensity] = useState(5);
  const [answers, setAnswers] = useState<Record<string, string | readonly string[]>>({
    tinnitusType: "Apito agudo",
    bothersMost: ["Antes de dormir"],
    mainImpact: "Sono",
    mainGoal: "Dormir melhor"
  });

  const isIntensity = step === 1;
  const totalSteps = questions.length + 2;
  const profileDraft = useMemo(() => {
    const draft = {
      tinnitusType: String(answers.tinnitusType ?? "Outro"),
      intensity,
      bothersMost: Array.isArray(answers.bothersMost) ? answers.bothersMost : [String(answers.bothersMost ?? "Durante o dia")],
      mainImpact: String(answers.mainImpact ?? "Clareza mental"),
      mainGoal: String(answers.mainGoal ?? "Criar rotina diaria")
    };
    return { ...draft, profileName: generateProfileName(draft) };
  }, [answers, intensity]);

  function choose(key: string, option: string, multi?: boolean) {
    if (!multi) {
      setAnswers((current) => ({ ...current, [key]: option }));
      return;
    }
    setAnswers((current) => {
      const currentList = Array.isArray(current[key]) ? current[key] as readonly string[] : [];
      const next = currentList.includes(option) ? currentList.filter((item) => item !== option) : [...currentList, option];
      return { ...current, [key]: next.length ? next : [option] };
    });
  }

  function next() {
    if (step < totalSteps - 1) setStep((value) => value + 1);
    else onComplete(profileDraft);
  }

  const questionIndex = step > 1 ? step - 2 : step;
  const question = questions[questionIndex];

  return (
    <div className="onboarding-shell">
      <div className="onboarding-panel">
        <div className="onboarding-top">
          <span>{step + 1}/{totalSteps}</span>
          <button type="button" onClick={onSkip}>Pular</button>
        </div>
        <div className="onboarding-progress"><span style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>

        {step === 0 ? (
          <section className="onboarding-question">
            <span className="protocol-eyebrow">Diagnostico inicial</span>
            <h1>{questions[0].title}</h1>
            <AnswerList question={questions[0]} answers={answers} choose={choose} />
          </section>
        ) : isIntensity ? (
          <section className="onboarding-question">
            <span className="protocol-eyebrow">Intensidade</span>
            <h1>De 0 a 10, quanto incomoda hoje?</h1>
            <div className="scale-card">
              <strong>{intensity}</strong>
              <input min="0" max="10" value={intensity} type="range" onChange={(event) => setIntensity(Number(event.target.value))} />
              <div><span>silencioso</span><span>intenso</span></div>
            </div>
          </section>
        ) : step < totalSteps - 1 ? (
          <section className="onboarding-question">
            <span className="protocol-eyebrow">Perfil auditivo</span>
            <h1>{question.title}</h1>
            <AnswerList question={question} answers={answers} choose={choose} />
          </section>
        ) : (
          <section className="onboarding-question">
            <span className="protocol-eyebrow"><ShieldCheck size={14} /> Perfil gerado</span>
            <h1>{profileDraft.profileName}</h1>
            <div className="profile-result">
              <p>Zumbido: {profileDraft.tinnitusType}</p>
              <p>Impacto principal: {profileDraft.mainImpact}</p>
              <p>Meta: {profileDraft.mainGoal}</p>
            </div>
            <div className="trust-note">
              Use volume confortavel. O app nao substitui orientacao medica. Procure ajuda em perda auditiva subita, dor forte, tontura intensa ou zumbido pulsatil novo.
            </div>
          </section>
        )}

        <button className="protocol-primary onboarding-cta" type="button" onClick={next}>
          {step === totalSteps - 1 ? "Entrar no meu protocolo" : "Continuar"}
          {step === totalSteps - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}

interface AnswerListProps {
  readonly question: typeof questions[number];
  readonly answers: Record<string, string | readonly string[]>;
  readonly choose: (key: string, option: string, multi?: boolean) => void;
}

function AnswerList({ question, answers, choose }: AnswerListProps) {
  return (
    <div className="answer-list">
      {question.options.map((option) => {
        const current = answers[question.key];
        const selected = Array.isArray(current) ? current.includes(option) : current === option;
        return (
          <button className={selected ? "selected" : ""} key={option} type="button" onClick={() => choose(question.key, option, "multi" in question ? question.multi : false)}>
            {option}
            {selected ? <Check size={17} /> : null}
          </button>
        );
      })}
    </div>
  );
}
