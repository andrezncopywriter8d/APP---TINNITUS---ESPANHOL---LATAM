import type { Dispatch, SetStateAction } from "react";
import { Download, ShieldCheck, Trash2, X } from "lucide-react";
import { defaultState, generateProfileName, todayKey, type OndaTeslaState } from "../state/ondaTeslaState";

interface SettingsSheetProps {
  readonly open: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly onClose: () => void;
  readonly onResetAll: () => void;
}

export function SettingsSheet({ onClose, onResetAll, open, setState, state }: SettingsSheetProps) {
  function updateReminder(key: keyof OndaTeslaState["reminderSettings"], value: boolean | string) {
    setState((current) => ({ ...current, reminderSettings: { ...current.reminderSettings, [key]: value } }));
  }

  function updateAccessibility(key: keyof OndaTeslaState["accessibilitySettings"], value: boolean) {
    setState((current) => ({ ...current, accessibilitySettings: { ...current.accessibilitySettings, [key]: value } }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `onda-tesla-progresso-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetOnboarding() {
    setState((current) => ({ ...current, onboardingCompleted: false, userProfile: null }));
    onClose();
  }

  function resetProgress() {
    if (window.confirm("Resetar progresso local? Isso apaga sessoes, check-ins e emergencias deste navegador.")) {
      setState((current) => ({
        ...current,
        sessions: [],
        checkIns: [],
        emergencyUses: [],
        routineCompletions: {},
        audioUsage: {},
        journeyStartDate: todayKey()
      }));
    }
  }

  function clearAll() {
    if (window.confirm("Limpar todos os dados locais da Onda Tesla neste navegador?")) onResetAll();
  }

  return (
    <div className={`protocol-modal settings-modal ${open ? "show" : ""}`}>
      <div className="protocol-modal-panel settings-panel">
        <div className="protocol-modal-head">
          <div>
            <h3>Ajustes</h3>
            <p>Perfil auditivo, lembretes, acessibilidade e dados locais.</p>
          </div>
          <button className="protocol-close-btn" type="button" onClick={onClose}><X size={18} /></button>
        </div>

        <section className="settings-section">
          <h4>Perfil auditivo</h4>
          <p>{state.userProfile?.profileName ?? "Perfil ainda nao definido"}</p>
          {state.userProfile ? <small>{generateProfileName(state.userProfile)} · intensidade {state.userProfile.intensity}/10</small> : null}
          <button className="protocol-secondary full" type="button" onClick={resetOnboarding}>Editar diagnostico</button>
        </section>

        <section className="settings-section">
          <h4>Protocolo</h4>
          <label>Inicio da jornada<input type="date" value={state.journeyStartDate} onChange={(event) => setState((current) => ({ ...current, journeyStartDate: event.target.value || todayKey() }))} /></label>
          <label>Horario preferido<input type="time" value={state.reminderSettings.dailySessionTime} onChange={(event) => updateReminder("dailySessionTime", event.target.value)} /></label>
        </section>

        <section className="settings-section">
          <h4>Lembretes</h4>
          <Toggle label="Lembrete da sessao principal" checked={state.reminderSettings.dailySessionEnabled} onChange={(value) => updateReminder("dailySessionEnabled", value)} />
          <label>Horario da sessao<input type="time" value={state.reminderSettings.dailySessionTime} onChange={(event) => updateReminder("dailySessionTime", event.target.value)} /></label>
          <Toggle label="Lembrete noturno" checked={state.reminderSettings.nightReminderEnabled} onChange={(value) => updateReminder("nightReminderEnabled", value)} />
          <label>Horario noturno<input type="time" value={state.reminderSettings.nightReminderTime} onChange={(event) => updateReminder("nightReminderTime", event.target.value)} /></label>
          <Toggle label="Lembrete se eu perder um dia" checked={state.reminderSettings.missedDayReminderEnabled} onChange={(value) => updateReminder("missedDayReminderEnabled", value)} />
          <small>Lembretes reais dependem das permissoes do navegador.</small>
        </section>

        <section className="settings-section">
          <h4>Acessibilidade</h4>
          <Toggle label="Texto maior" checked={state.accessibilitySettings.largerText} onChange={(value) => updateAccessibility("largerText", value)} />
          <Toggle label="Alto contraste" checked={state.accessibilitySettings.highContrast} onChange={(value) => updateAccessibility("highContrast", value)} />
          <Toggle label="Reduzir movimento" checked={state.accessibilitySettings.reduceMotion} onChange={(value) => updateAccessibility("reduceMotion", value)} />
        </section>

        <section className="settings-section">
          <h4>Dados</h4>
          <button className="protocol-secondary full" type="button" onClick={exportData}><Download size={17} /> Exportar JSON</button>
          <button className="protocol-secondary full danger" type="button" onClick={resetProgress}><Trash2 size={17} /> Resetar progresso</button>
          <button className="protocol-secondary full danger" type="button" onClick={clearAll}>Limpar tudo</button>
        </section>

        <section className="settings-section trust-card">
          <ShieldCheck size={18} />
          <div>
            <strong>Uso responsavel</strong>
            <p>Este app nao substitui orientacao medica. Use volume confortavel e pare se houver desconforto. Procure ajuda para perda auditiva subita, dor forte, tontura intensa, zumbido pulsatil ou sintomas neurologicos novos.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Toggle({ checked, label, onChange }: { readonly checked: boolean; readonly label: string; readonly onChange: (checked: boolean) => void }) {
  return (
    <label className="settings-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
