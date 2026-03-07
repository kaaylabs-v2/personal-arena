import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, TrendingUp, ArrowRight, RotateCcw } from "lucide-react";

const debrief = {
  strengths: [
    "Clear problem framing with stakeholder awareness",
    "Good use of structured reasoning to build your case",
    "Willingness to revise initial position based on challenges",
  ],
  improvements: [
    "Explore more alternative approaches before committing",
    "Strengthen evidence with concrete data references",
    "Consider second-order effects of proposed changes",
  ],
  scores: [
    { dimension: "Clarity", previous: 2.8, current: 3.2, max: 5 },
    { dimension: "Evidence Use", previous: 2.5, current: 3.0, max: 5 },
    { dimension: "Alternatives", previous: 2.2, current: 2.6, max: 5 },
    { dimension: "Reflection", previous: 2.9, current: 3.1, max: 5 },
  ],
  nextSession: {
    title: "Conflicting Stakeholder Priorities",
    description: "Navigate competing demands from engineering, product, and business stakeholders with limited resources.",
    focusSkill: "Evidence-Based Prioritization",
  },
};

interface ArenaDebriefProps {
  onClose: () => void;
}

export const ArenaDebrief = ({ onClose }: ArenaDebriefProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-auto px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto space-y-4"
      >
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-1">Session Complete</p>
          <h2 className="text-lg font-display font-semibold text-foreground">Reflection Debrief</h2>
          <p className="text-xs text-muted-foreground mt-1">Here's how your reasoning performed across this session.</p>
        </div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-primary" /> Strengths Observed
          </p>
          <ul className="space-y-1.5">
            {debrief.strengths.map((s, i) => (
              <li key={i} className="text-sm text-card-foreground flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3 text-warning" /> Areas to Improve
          </p>
          <ul className="space-y-1.5">
            {debrief.improvements.map((s, i) => (
              <li key={i} className="text-sm text-card-foreground flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Score Updates */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-5"
        >
          <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" /> Skill Score Updates
          </p>
          <div className="space-y-3">
            {debrief.scores.map((s) => {
              const delta = s.current - s.previous;
              return (
                <div key={s.dimension}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{s.dimension}</span>
                    <span className="text-muted-foreground">
                      {s.current}/{s.max}
                      {delta > 0 && (
                        <span className="text-primary ml-1.5">+{delta.toFixed(1)}</span>
                      )}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: `${(s.previous / s.max) * 100}%` }}
                      animate={{ width: `${(s.current / s.max) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Next Recommended Session */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
            Next Recommended Session
          </p>
          <p className="text-sm font-semibold text-card-foreground font-display">{debrief.nextSession.title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{debrief.nextSession.description}</p>
          <p className="text-[10px] text-primary font-medium mt-2">Focus: {debrief.nextSession.focusSkill}</p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate("/session-summary")} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" /> Full Summary
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="flex-1">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
