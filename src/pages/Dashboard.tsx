import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Zap, ArrowRight, ChevronDown, Clock, Mic, CheckSquare, Square, Shield, BookOpen, Lightbulb } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { InsightBanner } from "@/components/InsightBanner";
import { MasteryCompletion } from "@/components/MasteryCompletion";
import { useLearner } from "@/contexts/LearnerContext";

interface DashboardProgramData {
  targetOutcome: string;
  baseline: number;
  current: number;
  targetLevel: number;
  timeEst: string;
  insightText: React.ReactNode;
  strengths: { name: string; progress: number }[];
  focusAreas: { name: string; progress: number }[];
  milestones: { label: string; done: boolean }[];
  nextSession: { title: string; subtitle: string; link: string };
  recommendations: { icon: typeof Shield; text: string; sub: string; link: string }[];
}

const dashboardData: Record<string, DashboardProgramData> = {
  "p1": {
    targetOutcome: "Lead distributed teams effectively",
    baseline: 2.2, current: 3.1, targetLevel: 4.0, timeEst: "~8 weeks",
    insightText: <>Your thinking clarity is strong, but <span className="text-foreground font-medium">alternatives generation</span> is lagging. Suggested focus: <span className="text-foreground font-medium">Explore Alternatives</span>.</>,
    strengths: [{ name: "Clarity", progress: 55 }, { name: "Learn From It", progress: 48 }],
    focusAreas: [{ name: "Show Your Work", progress: 42 }, { name: "Think It Through", progress: 38 }, { name: "Alternatives", progress: 30 }],
    milestones: [{ label: "Clarifying complex problems", done: true }, { label: "Structuring decisions", done: true }, { label: "Evaluating evidence", done: false }, { label: "Handling stakeholder conflict", done: false }],
    nextSession: { title: "Scenario: Resolving Cross-Team Conflict", subtitle: "Practice Session · ~20 min", link: "/arena-session" },
    recommendations: [
      { icon: Shield, text: "Scenario: Conflicting Stakeholder Priorities", sub: "Challenge Mode", link: "/arena-session" },
      { icon: Target, text: "Challenge Mode: Show Your Work", sub: "Strengthen weak dimension", link: "/arena-session" },
      { icon: BookOpen, text: "Reflect on: Feb 19 decision journal entry", sub: "Revisit flagged", link: "/journal" },
    ],
  },
  "p-algebra": {
    targetOutcome: "Master Algebra Foundations",
    baseline: 1.5, current: 2.1, targetLevel: 4.0, timeEst: "~12 weeks",
    insightText: <>Your <span className="text-foreground font-medium">pattern recognition</span> is strong, but <span className="text-foreground font-medium">word problem translation</span> needs attention. Focus on converting scenarios to equations.</>,
    strengths: [{ name: "Pattern Recognition", progress: 60 }, { name: "Variable Manipulation", progress: 55 }],
    focusAreas: [{ name: "Word Problems", progress: 32 }, { name: "Equation Setup", progress: 35 }, { name: "Multi-Step Equations", progress: 28 }],
    milestones: [{ label: "Solving one-step equations", done: true }, { label: "Recognizing patterns", done: true }, { label: "Translating word problems", done: false }, { label: "Multi-step equations", done: false }],
    nextSession: { title: "Word Problem Reasoning Scenario", subtitle: "Practice Session · ~15 min", link: "/arena/session/word-problem-scenario" },
    recommendations: [
      { icon: Shield, text: "Linear Equation Challenge", sub: "Build confidence", link: "/arena/session/linear-eq-challenge" },
      { icon: Target, text: "Pattern Recognition Puzzle", sub: "Strengthen sequences", link: "/arena/session/pattern-puzzle" },
      { icon: BookOpen, text: "Review: Equation setup notes", sub: "Revisit concepts", link: "/journal" },
    ],
  },
  "p-calculus": {
    targetOutcome: "Master Calculus I Fundamentals",
    baseline: 1.2, current: 1.8, targetLevel: 3.5, timeEst: "~14 weeks",
    insightText: <>Your <span className="text-foreground font-medium">limit reasoning</span> is solid, but <span className="text-foreground font-medium">chain rule</span> and <span className="text-foreground font-medium">optimization</span> are critical gaps. Focus on derivative application.</>,
    strengths: [{ name: "Limit Reasoning", progress: 58 }, { name: "Graph Interpretation", progress: 50 }],
    focusAreas: [{ name: "Chain Rule", progress: 30 }, { name: "Optimization", progress: 25 }, { name: "Related Rates", progress: 28 }],
    milestones: [{ label: "Understanding limits", done: true }, { label: "Basic derivatives", done: true }, { label: "Chain rule application", done: false }, { label: "Optimization problems", done: false }],
    nextSession: { title: "Chain Rule Scenario", subtitle: "Practice Session · ~20 min", link: "/arena/session/chain-rule-scenario" },
    recommendations: [
      { icon: Shield, text: "Optimization Challenge", sub: "Applied max/min", link: "/arena/session/optimization-challenge" },
      { icon: Target, text: "Derivative Interpretation Exercise", sub: "Strengthen graph reading", link: "/arena/session/derivative-interpretation" },
      { icon: BookOpen, text: "Review: Related rates notes", sub: "Revisit setup patterns", link: "/journal" },
    ],
  },
  "p-insurance": {
    targetOutcome: "Master Insurance Sales Skills",
    baseline: 1.6, current: 2.2, targetLevel: 4.0, timeEst: "~10 weeks",
    insightText: <>Your <span className="text-foreground font-medium">ethical communication</span> is strong, but <span className="text-foreground font-medium">price objection handling</span> is a critical gap. Practice reframing cost concerns.</>,
    strengths: [{ name: "Ethical Communication", progress: 65 }, { name: "Documentation", progress: 58 }],
    focusAreas: [{ name: "Price Objections", progress: 28 }, { name: "Risk Communication", progress: 35 }, { name: "Coverage Gaps", progress: 38 }],
    milestones: [{ label: "Building client rapport", done: true }, { label: "Needs assessment", done: true }, { label: "Handling objections", done: false }, { label: "Compliance integration", done: false }],
    nextSession: { title: "Customer Objection Simulation", subtitle: "Practice Session · ~20 min", link: "/arena/session/customer-objection-sim" },
    recommendations: [
      { icon: Shield, text: "Policy Recommendation Scenario", sub: "Match needs to coverage", link: "/arena/session/policy-recommendation" },
      { icon: Target, text: "Compliance Risk Scenario", sub: "Navigate ethical situations", link: "/arena/session/compliance-risk-scenario" },
      { icon: BookOpen, text: "Review: Client conversation notes", sub: "Revisit key interactions", link: "/journal" },
    ],
  },
};

const showMasteryCompletion = false;

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeProgram } = useLearner();
  const data = dashboardData[activeProgram.id] || dashboardData["p1"];
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Layout pageTitle="Journey Dashboard">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} key={activeProgram.id}>

          {showMasteryCompletion && (
            <div className="mb-5">
              <MasteryCompletion journeyName={activeProgram.name} level={4} sessions={8} />
            </div>
          )}

          <InsightBanner title="Capability Imbalance" className="mb-5">
            {data.insightText}
          </InsightBanner>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-primary" /> Target Outcome
              </h3>
              <p className="text-sm font-medium text-card-foreground mb-2">{data.targetOutcome}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Target: <strong className="text-card-foreground">Level {data.targetLevel}</strong></span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {data.timeEst}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Progress Snapshot
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-muted-foreground">{data.baseline}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Baseline</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-muted relative">
                  <motion.div className="absolute left-0 top-0 h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${((data.current - data.baseline) / (data.targetLevel - data.baseline)) * 100}%` }} transition={{ duration: 1 }} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-primary">{data.current}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> Capability Focus
              </h3>
              <div className="space-y-2 mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strengths</p>
                {data.strengths.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-24">{cap.name}</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider pt-1">Focus Areas</p>
                {data.focusAreas.slice(0, 2).map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-24">{cap.name}</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary/60" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                  </div>
                ))}
              </div>
              <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                <CollapsibleTrigger className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <ChevronDown className={`h-3 w-3 transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
                  {detailsOpen ? "Hide" : "View"} Details
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {data.focusAreas.slice(2).map((cap) => (
                    <div key={cap.name} className="flex items-center gap-2">
                      <span className="text-xs text-card-foreground w-24">{cap.name}</span>
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full bg-primary/60" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-primary" /> Next Step
              </h3>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Today's Focus</p>
                <p className="text-sm font-medium text-card-foreground mb-1">{data.nextSession.title}</p>
                <p className="text-xs text-muted-foreground mb-4">{data.nextSession.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate(data.nextSession.link)} size="sm" className="flex-1">
                  <Target className="mr-1.5 h-3.5 w-3.5" /> Continue Journey
                </Button>
                <Button variant="outline" size="sm">
                  <Mic className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 mb-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Journey Milestones</h3>
            <div className="space-y-2">
              {data.milestones.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2.5">
                  {m.done ? <CheckSquare className="h-4 w-4 text-primary shrink-0" /> : <Square className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                  <span className={`text-sm ${m.done ? "text-card-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3 text-primary" /> Recommended Next
            </h3>
            <div className="space-y-2">
              {data.recommendations.map((rec, i) => (
                <button key={i} onClick={() => navigate(rec.link)} className="w-full text-left rounded-lg bg-muted/50 px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 group">
                  <rec.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors">{rec.text}</p>
                    <p className="text-[10px] text-muted-foreground">{rec.sub}</p>
                  </div>
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
