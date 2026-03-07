import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, TrendingUp, ArrowRight, RotateCcw, Brain, Target, Map } from "lucide-react";
import { ReasoningBreakdown, type ReasoningScoreData } from "@/components/ReasoningScore";

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
  skillImprovements: [
    { skill: "Show Your Work", delta: 3 },
    { skill: "Strategic Framing", delta: 2 },
    { skill: "Stakeholder Analysis", delta: 1 },
  ],
  nextSession: {
    title: "Conflicting Stakeholder Priorities",
    description: "Navigate competing demands from engineering, product, and business stakeholders with limited resources.",
    focusSkill: "Evidence-Based Prioritization",
  },
};

interface ArenaDebriefProps {
  onClose: () => void;
  reasoningScore?: ReasoningScoreData;
  focusSkill?: string;
}

export const ArenaDebrief = ({ onClose, reasoningScore, focusSkill }: ArenaDebriefProps) => {
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

        {/* Focus Skill Progress */}
        {focusSkill && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className="rounded-xl border border-accent bg-accent/30 p-4 flex items-center gap-3"
          >
            <Target className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5">Focus Skill Progress</p>
              <p className="text-sm font-semibold text-foreground">{focusSkill}</p>
              <p className="text-xs text-muted-foreground mt-0.5">+3% improvement this session — on track for mastery</p>
            </div>
          </motion.div>
        )}

        {/* Reasoning Score Breakdown */}
        {reasoningScore && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-wider text-primary font-medium flex items-center gap-1.5">
                <Brain className="h-3 w-3" /> Reasoning Score
              </p>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-display font-bold text-foreground tabular-nums"
              >
                {reasoningScore.total}
                <span className="text-sm text-muted-foreground font-normal"> / {reasoningScore.max}</span>
              </motion.span>
            </div>
            <ReasoningBreakdown score={reasoningScore} />
          </motion.div>
        )}

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

        {/* Skill Impact */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-primary" /> Skill Impact
          </p>
          <div className="flex flex-wrap gap-2">
            {debrief.skillImprovements.map((s) => (
              <span
                key={s.skill}
                className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full"
              >
                {s.skill} +{s.delta}%
              </span>
            ))}
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
          <p className="text-[10px] text-primary font-medium mt-2">Improves: {debrief.nextSession.focusSkill}</p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate("/session-summary")} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" /> Full Summary
          </Button>
          <Button variant="outline" onClick={() => navigate("/skill-map")} className="flex-1">
            <Map className="mr-2 h-4 w-4" /> Skill Map
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="flex-1">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
