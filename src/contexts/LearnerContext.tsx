import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { learners, programs, defaultLearner, type LearnerProfile, type MasteryProgram } from "@/data/programs";

interface LearnerContextValue {
  activeLearner: LearnerProfile;
  setActiveLearner: (learner: LearnerProfile) => void;
  activeProgram: MasteryProgram;
  setActiveProgramId: (id: string) => void;
  hasCompletedSession: boolean;
  setHasCompletedSession: (v: boolean) => void;
  completedSessionCount: number;
  setCompletedSessionCount: (n: number) => void;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [activeLearner, setActiveLearnerState] = useState<LearnerProfile>(defaultLearner);
  const [activeProgramId, setActiveProgramIdState] = useState<string>(
    defaultLearner.enrolledProgramIds[0] || programs[0].id
  );
  const [hasCompletedSession, setHasCompletedSession] = useState<boolean>(() => {
    try { return localStorage.getItem("arena-has-completed-session") === "true"; } catch { return false; }
  });
  const [completedSessionCount, setCompletedSessionCountState] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("arena-session-count") || "0", 10); } catch { return 0; }
  });

  const activeProgram = programs.find((p) => p.id === activeProgramId) || programs[0];

  const setActiveLearner = useCallback((learner: LearnerProfile) => {
    setActiveLearnerState(learner);
    setActiveProgramIdState(learner.enrolledProgramIds[0] || programs[0].id);
  }, []);

  const setActiveProgramId = useCallback((id: string) => {
    setActiveProgramIdState(id);
  }, []);

  const handleSetHasCompleted = useCallback((v: boolean) => {
    setHasCompletedSession(v);
    localStorage.setItem("arena-has-completed-session", String(v));
  }, []);

  const handleSetCount = useCallback((n: number) => {
    setCompletedSessionCountState(n);
    localStorage.setItem("arena-session-count", String(n));
  }, []);

  return (
    <LearnerContext.Provider value={{
      activeLearner, setActiveLearner, activeProgram, setActiveProgramId,
      hasCompletedSession, setHasCompletedSession: handleSetHasCompleted,
      completedSessionCount, setCompletedSessionCount: handleSetCount,
    }}>
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error("useLearner must be used within LearnerProvider");
  return ctx;
}
