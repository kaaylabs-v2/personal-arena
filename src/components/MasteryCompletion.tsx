import { motion } from "framer-motion";
import { Trophy, ArrowRight, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MasteryCompletionProps {
  journeyName: string;
  level: number;
  sessions: number;
}

export const MasteryCompletion = ({ journeyName, level, sessions }: MasteryCompletionProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-primary/30 bg-primary/5 p-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5">Outcome Achieved</p>
          <h3 className="text-sm font-display font-semibold text-foreground">
            You have reached Level {level} in {journeyName}.
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Validated across {sessions} practice sessions.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate("/")}>
          <Target className="mr-1.5 h-3 w-3" /> New Mastery Journey
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate("/journal")}>
          <BookOpen className="mr-1.5 h-3 w-3" /> Review Journal Insights
        </Button>
      </div>
    </motion.div>
  );
};
