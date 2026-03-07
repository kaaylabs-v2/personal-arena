import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { learners, programs, defaultLearner, type LearnerProfile, type MasteryProgram } from "@/data/programs";

interface LearnerContextValue {
  activeLearner: LearnerProfile;
  setActiveLearner: (learner: LearnerProfile) => void;
  activeProgram: MasteryProgram;
  setActiveProgramId: (id: string) => void;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [activeLearner, setActiveLearnerState] = useState<LearnerProfile>(defaultLearner);
  const [activeProgramId, setActiveProgramIdState] = useState<string>(
    defaultLearner.enrolledProgramIds[0] || programs[0].id
  );

  const activeProgram = programs.find((p) => p.id === activeProgramId) || programs[0];

  const setActiveLearner = useCallback((learner: LearnerProfile) => {
    setActiveLearnerState(learner);
    setActiveProgramIdState(learner.enrolledProgramIds[0] || programs[0].id);
  }, []);

  const setActiveProgramId = useCallback((id: string) => {
    setActiveProgramIdState(id);
  }, []);

  return (
    <LearnerContext.Provider value={{ activeLearner, setActiveLearner, activeProgram, setActiveProgramId }}>
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error("useLearner must be used within LearnerProvider");
  return ctx;
}
