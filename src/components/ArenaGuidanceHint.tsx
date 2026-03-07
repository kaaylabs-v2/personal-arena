import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const stageGuidance: Record<string, string> = {
  clarify: "Focus on defining the problem precisely. What assumptions are you making? What's unclear?",
  challenge: "Stress-test your reasoning. What would a critic say? What could go wrong?",
  evidence: "Ground your claims in data or observable patterns. What supports your position?",
  alternative: "Explore different approaches. What else could work? What are you not seeing?",
  reflect: "Step back and evaluate your overall thinking. How has your perspective evolved?",
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
