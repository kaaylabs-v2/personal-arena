import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, CheckSquare, Square, Target } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useLearner } from "@/contexts/LearnerContext";
import { humanLevel } from "@/lib/humanize";

interface DashboardProgramData {
  targetOutcome: string;
  current: number;
  targetLevel: number;
  insightText: string;
  focusAreas: { name: string; progress: number }[];
  milestones: { label: string; done: boolean }[];
  nextSession: { title: string; subtitle: string; link: string };
  recommendations: { text: string; link: string }[];
}

const dashboardData: Record<string, DashboardProgramData> = {
  "p1": {
    targetOutcome: "Lead distributed teams effectively",
    current: 3.1, targetLevel: 4.0,
    insightText: "Your thinking clarity is strong, but exploring alternatives could use more practice. Try a challenge scenario to break through.",
    focusAreas: [{ name: "Show Your Work", progress: 42 }, { name: "Think It Through", progress: 38 }, { name: "Alternatives", progress: 30 }],
    milestones: [{ label: "Clarifying complex problems", done: true }, { label: "Structuring decisions", done: true }, { label: "Evaluating evidence", done: false }, { label: "Handling stakeholder conflict", done: false }],
    nextSession: { title: "Resolving Cross-Team Conflict", subtitle: "Practice · ~20 min", link: "/arena-session" },
    recommendations: [
      { text: "Conflicting Stakeholder Priorities — Challenge Mode", link: "/arena-session" },
      { text: "Show Your Work — Strengthen this skill", link: "/arena-session" },
      { text: "Reflect on your last session", link: "/journal" },
    ],
  },
  "p-algebra": {
    targetOutcome: "Master Algebra Foundations",
    current: 2.1, targetLevel: 4.0,
    insightText: "Your pattern recognition is going well, but word problem translation needs more practice. Focus on converting scenarios to equations.",
    focusAreas: [{ name: "Word Problems", progress: 32 }, { name: "Equation Setup", progress: 35 }, { name: "Multi-Step Equations", progress: 28 }],
    milestones: [{ label: "Solving one-step equations", done: true }, { label: "Recognizing patterns", done: true }, { label: "Translating word problems", done: false }, { label: "Multi-step equations", done: false }],
    nextSession: { title: "Word Problem Reasoning Scenario", subtitle: "Practice · ~15 min", link: "/arena/session/word-problem-scenario" },
    recommendations: [
      { text: "Linear Equation Challenge", link: "/arena/session/linear-eq-challenge" },
      { text: "Pattern Recognition Puzzle", link: "/arena/session/pattern-puzzle" },
      { text: "Review equation setup notes", link: "/journal" },
    ],
  },
  "p-calculus": {
    targetOutcome: "Master Calculus I Fundamentals",
    current: 1.8, targetLevel: 3.5,
    insightText: "Your limit reasoning is solid, but chain rule and optimization need more practice. Focus on derivative application.",
    focusAreas: [{ name: "Chain Rule", progress: 30 }, { name: "Optimization", progress: 25 }, { name: "Related Rates", progress: 28 }],
    milestones: [{ label: "Understanding limits", done: true }, { label: "Basic derivatives", done: true }, { label: "Chain rule application", done: false }, { label: "Optimization problems", done: false }],
    nextSession: { title: "Chain Rule Scenario", subtitle: "Practice · ~20 min", link: "/arena/session/chain-rule-scenario" },
    recommendations: [
      { text: "Optimization Challenge — Applied max/min", link: "/arena/session/optimization-challenge" },
      { text: "Derivative Interpretation Exercise", link: "/arena/session/derivative-interpretation" },
      { text: "Review related rates notes", link: "/journal" },
    ],
  },
  "p-insurance": {
    targetOutcome: "Master Insurance Sales Skills",
    current: 2.2, targetLevel: 4.0,
    insightText: "Your ethical communication is going well, but handling price objections needs work. Practice reframing cost concerns.",
    focusAreas: [{ name: "Price Objections", progress: 28 }, { name: "Risk Communication", progress: 35 }, { name: "Coverage Gaps", progress: 38 }],
    milestones: [{ label: "Building client rapport", done: true }, { label: "Needs assessment", done: true }, { label: "Handling objections", done: false }, { label: "Compliance integration", done: false }],
    nextSession: { title: "Customer Objection Simulation", subtitle: "Practice · ~20 min", link: "/arena/session/customer-objection-sim" },
    recommendations: [
      { text: "Policy Recommendation Scenario", link: "/arena/session/policy-recommendation" },
      { text: "Compliance Risk Scenario", link: "/arena/session/compliance-risk-scenario" },
      { text: "Review client conversation notes", link: "/journal" },
    ],
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeProgram } = useLearner();
  const data = dashboardData[activeProgram.id] || dashboardData["p1"];
  const completedCount = data.milestones.filter((m) => m.done).length;
  const progressPct = ((data.current - 1) / (data.targetLevel - 1)) * 100;

  return (
    <Layout pageTitle="Dashboard">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} key={activeProgram.id} className="space-y-5">

          {/* Goal + Progress */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-card-foreground">{data.targetOutcome}</p>
              <span className="text-xs text-muted-foreground">{humanLevel(data.current)} → {humanLevel(data.targetLevel)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>

          {/* Insight */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-start gap-3">
            <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{data.insightText}</p>
          </div>

          {/* Next Step */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Continue where you left off</p>
            <p className="text-sm font-medium text-card-foreground">{data.nextSession.title}</p>
            <p className="text-xs text-muted-foreground mb-3">{data.nextSession.subtitle}</p>
            <Button onClick={() => navigate(data.nextSession.link)} size="sm">
              <ArrowRight className="mr-1.5 h-3.5 w-3.5" /> Start Session
            </Button>
          </div>

          {/* What to Work On */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
              <Target className="h-3 w-3 text-primary" /> What to work on
            </h3>
            <div className="space-y-2.5">
              {data.focusAreas.map((area) => (
                <div key={area.name} className="flex items-center gap-3">
                  <span className="text-xs text-card-foreground w-32 truncate">{area.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full bg-primary/70" initial={{ width: 0 }} animate={{ width: `${area.progress}%` }} transition={{ duration: 0.6 }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{area.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Milestones</h3>
              <span className="text-[10px] text-muted-foreground">{completedCount}/{data.milestones.length}</span>
            </div>
            <div className="space-y-1.5">
              {data.milestones.map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  {m.done ? <CheckSquare className="h-3.5 w-3.5 text-primary shrink-0" /> : <Square className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />}
                  <span className={`text-xs ${m.done ? "text-card-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Next */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Recommended practice</h3>
            <div className="space-y-1.5">
              {data.recommendations.map((rec, i) => (
                <button key={i} onClick={() => navigate(rec.link)} className="w-full text-left rounded-lg bg-muted/40 px-3 py-2 hover:bg-muted transition-colors">
                  <p className="text-xs text-card-foreground">{rec.text}</p>
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
