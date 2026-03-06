import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";

const insight = {
  sessionTitle: "Distributed Team Communication",
  capabilityName: "Strategic Decision-Making",
  focusDimension: "Evidence Use",
  sessionNumber: 3,
  totalSessions: 12,
  strengthObserved: "Clear problem framing with strong stakeholder awareness. You identified the tension between structure and autonomy early.",
  improvementFocus: "Explore alternative approaches before committing to a strategy. Consider second-order effects of your decisions.",
  previousScore: 2.8,
  updatedScore: 3.2,
  maxScore: 5,
  nextScenario: {
    title: "Conflicting Stakeholder Priorities",
    description: "Navigate competing demands from engineering, product, and business stakeholders with limited resources.",
  },
};

const SessionInsight = () => {
  const navigate = useNavigate();
  const scoreDelta = insight.updatedScore - insight.previousScore;
  const scorePercent = (insight.updatedScore / insight.maxScore) * 100;

  return (
    <Layout pageTitle="Session Insight">
      <div className="max-w-xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-1">
              Session {insight.sessionNumber} of {insight.totalSessions} Complete
            </p>
            <h1 className="text-lg font-display font-semibold text-foreground">{insight.sessionTitle}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {insight.capabilityName} · {insight.focusDimension}
            </p>
          </div>

          {/* Strength */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-4 mb-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary" /> Strength Observed
            </p>
            <p className="text-sm text-card-foreground leading-relaxed">{insight.strengthObserved}</p>
          </motion.div>

          {/* Improvement */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-4 mb-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-warning" /> Improvement Focus
            </p>
            <p className="text-sm text-card-foreground leading-relaxed">{insight.improvementFocus}</p>
          </motion.div>

          {/* Score Update */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" /> Capability Score Update
            </p>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl font-display font-bold text-foreground">{insight.updatedScore}</span>
              <span className="text-sm text-muted-foreground mb-1">/ {insight.maxScore}</span>
              {scoreDelta > 0 && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1.5">
                  +{scoreDelta.toFixed(1)}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: `${((insight.previousScore) / insight.maxScore) * 100}%` }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Previous: {insight.previousScore}</span>
              <span>Target: {insight.maxScore}</span>
            </div>
          </motion.div>

          {/* Next Scenario */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-4 mb-8"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
              Next Recommended Scenario
            </p>
            <p className="text-sm font-semibold text-card-foreground font-display">{insight.nextScenario.title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.nextScenario.description}</p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/session-summary")} className="flex-1">
              View Full Summary
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="flex-1">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SessionInsight;
