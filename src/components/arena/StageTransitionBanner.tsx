import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const stageLabels: Record<string, string> = {
  clarify: "Clarify",
  challenge: "Challenge",
  evidence: "Show Your Work",
  alternative: "Alternatives",
  reflect: "Reflect",
};

interface StageTransitionBannerProps {
  completedStage: string;
  nextStage: string;
}

export const StageTransitionBanner = ({ completedStage, nextStage }: StageTransitionBannerProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mx-auto max-w-[85%] rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-center gap-3"
  >
    <CheckCircle2 className="h-4 w-4 text-primary" />
    <span className="text-xs font-semibold text-primary">
      {stageLabels[completedStage] || completedStage} Complete
    </span>
    <ArrowRight className="h-3 w-3 text-muted-foreground" />
    <span className="text-xs font-medium text-muted-foreground">
      Next: {stageLabels[nextStage] || nextStage}
    </span>
  </motion.div>
);
