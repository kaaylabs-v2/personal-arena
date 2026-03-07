import { createContext, useContext, useState, type ReactNode } from "react";
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
  const defaultProgramId = activeLearner.enrolledProgramIds[0] || programs[0].id;
  const [activeProgramId, setActiveProgramId] = useState<string>(defaultProgramId);

  const activeProgram = programs.find((p) => p.id === activeProgramId) || programs[0];

  const setActiveLearner = (learner: LearnerProfile) => {
    setActiveLearnerState(learner);
    // Auto-switch to learner's first enrolled program
    setActiveProgramId(learner.enrolledProgramIds[0] || programs[0].id);
  };

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
