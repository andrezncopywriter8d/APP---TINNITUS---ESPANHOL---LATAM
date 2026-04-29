import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { EmergencyScreen } from "./components/EmergencyScreen";
import { GuideScreen } from "./components/GuideScreen";
import { HomeScreen } from "./components/HomeScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { PlayerScreen } from "./components/PlayerScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { SettingsSheet } from "./components/SettingsSheet";
import { audioLibrary, type ProtocolAudio, type ScreenId } from "./data/protocolData";
import {
  addCompletedSession,
  defaultState,
  loadOndaTeslaState,
  markRoutineDone,
  saveOndaTeslaState,
  todayKey,
  type CheckInInput,
  type EmergencyUse,
  type OndaTeslaState,
  type UserProfile
} from "./state/ondaTeslaState";

export interface PlayerSource {
  readonly kind: "main" | "routine" | "library" | "emergency";
  readonly reason?: string;
  readonly routineId?: string;
}

export function App() {
  const [appState, setAppState] = useState<OndaTeslaState>(() => loadOndaTeslaState());
  const [activeScreen, setActiveScreen] = useState<ScreenId>("home");
  const [selectedAudio, setSelectedAudio] = useState<ProtocolAudio>(audioLibrary[0]);
  const [playerSource, setPlayerSource] = useState<PlayerSource>({ kind: "main" });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    saveOndaTeslaState(appState);
    document.documentElement.classList.toggle("large-text", appState.accessibilitySettings.largerText);
    document.documentElement.classList.toggle("high-contrast", appState.accessibilitySettings.highContrast);
    document.documentElement.classList.toggle("reduce-motion", appState.accessibilitySettings.reduceMotion);
  }, [appState]);

  const hasOnboarding = appState.onboardingCompleted;

  const context = useMemo(() => ({
    state: appState,
    setState: setAppState,
    openAudio,
    openScreen,
    openSettings: () => setSettingsOpen(true)
  }), [appState]);

  function openScreen(screen: ScreenId) {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAudio(audio: ProtocolAudio, source: PlayerSource = { kind: "library" }) {
    setSelectedAudio(audio);
    setPlayerSource(source);
    openScreen("player");
  }

  function completeOnboarding(profile: UserProfile) {
    setAppState((current) => ({
      ...current,
      onboardingCompleted: true,
      userProfile: profile,
      journeyStartDate: current.journeyStartDate || todayKey()
    }));
  }

  function skipOnboarding() {
    setAppState((current) => ({ ...current, onboardingCompleted: true }));
  }

  function completeAudio(checkIn: CheckInInput, emergencyResult?: string) {
    setAppState((current) => {
      let next = addCompletedSession(current, selectedAudio, checkIn);
      if (playerSource.routineId) {
        next = markRoutineDone(next, playerSource.routineId);
      }
      if (selectedAudio.id === "onda-tesla-principal") {
        next = markRoutineDone(next, "principal");
      }
      if (playerSource.kind === "emergency" && playerSource.reason && emergencyResult) {
        const emergency: EmergencyUse = {
          id: `emergency-${Date.now()}`,
          date: new Date().toISOString(),
          reason: playerSource.reason,
          audioId: selectedAudio.id,
          audioName: selectedAudio.name,
          result: emergencyResult
        };
        next = { ...next, emergencyUses: [...next.emergencyUses, emergency] };
      }
      return next;
    });
  }

  function resetAllData() {
    setAppState({ ...defaultState, journeyStartDate: todayKey() });
    localStorage.removeItem("ondaTeslaAppState");
  }

  return (
    <main className="app-shell">
      <div className="status-glow" />
      {!hasOnboarding ? <OnboardingFlow onComplete={completeOnboarding} onSkip={skipOnboarding} /> : null}
      <HomeScreen {...context} active={activeScreen === "home"} />
      <PlayerScreen
        active={activeScreen === "player"}
        audio={selectedAudio}
        source={playerSource}
        onComplete={completeAudio}
      />
      <EmergencyScreen
        active={activeScreen === "emergency"}
        emergencyUses={appState.emergencyUses}
        openAudio={openAudio}
      />
      <ProgressScreen active={activeScreen === "progress"} state={appState} />
      <GuideScreen
        active={activeScreen === "guide"}
        state={appState}
        setState={setAppState}
        openAudio={openAudio}
        openSettings={() => setSettingsOpen(true)}
      />
      <SettingsSheet
        open={settingsOpen}
        state={appState}
        setState={setAppState}
        onClose={() => setSettingsOpen(false)}
        onResetAll={resetAllData}
      />
      <BottomNav activeScreen={activeScreen} openScreen={openScreen} />
    </main>
  );
}
