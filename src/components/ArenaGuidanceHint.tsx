import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const stageGuidance: Record<string, string> = {
  learn: "Take in the key concepts — ask questions if anything is unclear.",
  understand: "Try to explain what you've learned. It's okay to get it wrong — that's how you learn.",
  "think-deeper": "These questions are meant to stretch you. Take your time and think carefully.",
  apply: "Put your knowledge to work in a realistic scenario. There's no single right answer.",
  reflect: "Look back at what you've learned and how your thinking has grown.",
};

interface ArenaGuidanceHintProps {
  stage: string;
}

export const ArenaGuidanceHint = ({ stage }: ArenaGuidanceHintProps) => {
  const hint = stageGuidance[stage] || stageGuidance.clarify;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="flex items-start gap-2 px-3 py-2 rounded-lg bg-accent/50 border border-accent mt-1.5"
    >
      <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
      <p className="text-[11px] text-accent-foreground leading-relaxed">{hint}</p>
    </motion.div>
  );
};
