import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Zap, ArrowRight, ChevronDown, Clock, Mic, CheckSquare, Square, Shield, BookOpen, Lightbulb } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { InsightBanner } from "@/components/InsightBanner";
import { MasteryCompletion } from "@/components/MasteryCompletion";
import { useLearner } from "@/contexts/LearnerContext";

interface JourneyData {
  id: string;
  objective: string;
  domain: string;
  currentLevel: number;
  targetLevel: number;
  baselineLevel: number;
  progress: number;
  focusArea: string;
  nextSession: string | null;
  estimatedWeeks: number;
  capabilities: { name: string; progress: number; type: "strength" | "focus" }[];
  milestones: { label: string; done: boolean }[];
  insight: { title: string; message: string; highlight: string };
  recommendations: { icon: typeof Shield; text: string; sub: string; action: string }[];
}

const journeyDatabase: Record<string, JourneyData> = {
  a1: {
    id: "a1", objective: "Strategic Decision Making for Senior Leaders", domain: "Leadership",
    currentLevel: 2.4, targetLevel: 4.0, baselineLevel: 1.6, progress: 18,
    focusArea: "Evidence-based reasoning", nextSession: "Evidence Mapping", estimatedWeeks: 10,
    capabilities: [
      { name: "Decision Clarity", progress: 52, type: "strength" },
      { name: "Risk Assessment", progress: 45, type: "strength" },
      { name: "Evidence Use", progress: 28, type: "focus" },
      { name: "Scenario Analysis", progress: 22, type: "focus" },
      { name: "Bias Awareness", progress: 18, type: "focus" },
    ],
    milestones: [
      { label: "Understand decision frameworks", done: true },
      { label: "Recognize cognitive biases", done: true },
      { label: "Evaluate evidence under pressure", done: false },
      { label: "Conduct scenario analysis", done: false },
    ],
    insight: { title: "Capability Imbalance", message: "Your decision clarity is strong, but", highlight: "evidence evaluation is lagging behind other skills." },
    recommendations: [
      { icon: Shield, text: "Scenario: Evidence Under Pressure", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Challenge: Cognitive Bias Detection", sub: "Strengthen awareness", action: "/arena-session" },
      { icon: BookOpen, text: "Reflect on: Decision framework journal", sub: "Revisit flagged", action: "/journal" },
    ],
  },
  a2: {
    id: "a2", objective: "Cross-Functional Stakeholder Alignment", domain: "Communication",
    currentLevel: 2.6, targetLevel: 3.5, baselineLevel: 2.0, progress: 35,
    focusArea: "Influence without authority", nextSession: "Negotiation Tactics", estimatedWeeks: 6,
    capabilities: [
      { name: "Stakeholder Mapping", progress: 62, type: "strength" },
      { name: "Influence Tactics", progress: 48, type: "strength" },
      { name: "Negotiation", progress: 35, type: "focus" },
      { name: "Conflict Resolution", progress: 28, type: "focus" },
      { name: "Alignment Framing", progress: 20, type: "focus" },
    ],
    milestones: [
      { label: "Map stakeholder landscape", done: true },
      { label: "Apply influence strategies", done: true },
      { label: "Navigate multi-party negotiation", done: false },
      { label: "Resolve cross-functional conflict", done: false },
    ],
    insight: { title: "Growth Opportunity", message: "Your stakeholder mapping is solid, but", highlight: "conflict resolution needs targeted practice." },
    recommendations: [
      { icon: Shield, text: "Scenario: Conflicting Departmental Goals", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Practice: Influence Without Authority", sub: "Core skill drill", action: "/arena-session" },
      { icon: BookOpen, text: "Review: Stakeholder alignment entry", sub: "Reflection", action: "/journal" },
    ],
  },
  "1": {
    id: "1", objective: "Lead Distributed Teams Effectively", domain: "Leadership",
    currentLevel: 3.1, targetLevel: 4.0, baselineLevel: 2.2, progress: 45,
    focusArea: "Cross-team alignment", nextSession: "Distributed Team Communication", estimatedWeeks: 8,
    capabilities: [
      { name: "Clarity", progress: 55, type: "strength" },
      { name: "Reflection", progress: 48, type: "strength" },
      { name: "Evidence Use", progress: 42, type: "focus" },
      { name: "Reasoning", progress: 38, type: "focus" },
      { name: "Alternatives", progress: 30, type: "focus" },
    ],
    milestones: [
      { label: "Clarifying complex problems", done: true },
      { label: "Structuring decisions", done: true },
      { label: "Evaluating evidence", done: false },
      { label: "Handling stakeholder conflict", done: false },
    ],
    insight: { title: "Capability Imbalance", message: "Your reasoning clarity is strong, but", highlight: "alternatives generation is lagging." },
    recommendations: [
      { icon: Shield, text: "Scenario: Conflicting Stakeholder Priorities", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Challenge Mode: Evidence Evaluation", sub: "Strengthen weak dimension", action: "/arena-session" },
      { icon: BookOpen, text: "Reflect on: Feb 19 decision journal entry", sub: "Revisit flagged", action: "/journal" },
    ],
  },
  "2": {
    id: "2", objective: "Make Data-Driven Decisions Under Uncertainty", domain: "Decision Making",
    currentLevel: 2.1, targetLevel: 3.5, baselineLevel: 1.8, progress: 22,
    focusArea: "Evidence evaluation", nextSession: "Uncertainty Quantification", estimatedWeeks: 12,
    capabilities: [
      { name: "Data Literacy", progress: 40, type: "strength" },
      { name: "Statistical Reasoning", progress: 35, type: "strength" },
      { name: "Uncertainty Framing", progress: 22, type: "focus" },
      { name: "Bayesian Thinking", progress: 15, type: "focus" },
      { name: "Evidence Synthesis", progress: 12, type: "focus" },
    ],
    milestones: [
      { label: "Build data literacy foundation", done: true },
      { label: "Apply statistical reasoning", done: false },
      { label: "Quantify uncertainty", done: false },
      { label: "Synthesize conflicting evidence", done: false },
    ],
    insight: { title: "Early Stage", message: "You're building foundations. Focus on", highlight: "statistical reasoning before moving to uncertainty." },
    recommendations: [
      { icon: Shield, text: "Scenario: Ambiguous Data Interpretation", sub: "Foundation drill", action: "/arena-session" },
      { icon: Target, text: "Practice: Probability Estimation", sub: "Core skill", action: "/arena-session" },
      { icon: BookOpen, text: "Review: Data decision journal", sub: "Reflection", action: "/journal" },
    ],
  },
  "3": {
    id: "3", objective: "Present Strategy to Senior Stakeholders", domain: "Communication",
    currentLevel: 3.2, targetLevel: 4.0, baselineLevel: 2.5, progress: 60,
    focusArea: "Narrative structure", nextSession: "Board Presentation Drill", estimatedWeeks: 5,
    capabilities: [
      { name: "Narrative Flow", progress: 68, type: "strength" },
      { name: "Data Storytelling", progress: 58, type: "strength" },
      { name: "Audience Calibration", progress: 52, type: "strength" },
      { name: "Objection Handling", progress: 38, type: "focus" },
      { name: "Executive Presence", progress: 32, type: "focus" },
    ],
    milestones: [
      { label: "Build narrative foundations", done: true },
      { label: "Master data storytelling", done: true },
      { label: "Calibrate to audience", done: true },
      { label: "Handle board-level objections", done: false },
    ],
    insight: { title: "Strong Progress", message: "Your narrative skills are developing well.", highlight: "Focus on objection handling to reach mastery." },
    recommendations: [
      { icon: Shield, text: "Scenario: Hostile Board Q&A", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Practice: Executive Presence Drill", sub: "Polish delivery", action: "/arena-session" },
      { icon: BookOpen, text: "Review: Presentation feedback notes", sub: "Reflection", action: "/journal" },
    ],
  },
  "alg-a1": {
    id: "alg-a1", objective: "Build Equation Solving Foundations", domain: "Algebra",
    currentLevel: 2.1, targetLevel: 4.0, baselineLevel: 2.0, progress: 30,
    focusArea: "Linear equations", nextSession: "Multi-Step Equations", estimatedWeeks: 6,
    capabilities: [
      { name: "Variable Fluency", progress: 58, type: "strength" },
      { name: "Equation Balance", progress: 51, type: "strength" },
      { name: "Multi-Step Solving", progress: 34, type: "focus" },
      { name: "Solution Checking", progress: 29, type: "focus" },
      { name: "Error Detection", progress: 24, type: "focus" },
    ],
    milestones: [
      { label: "Master one-step equations", done: true },
      { label: "Master two-step equations", done: true },
      { label: "Solve multi-step equations", done: false },
      { label: "Verify under time pressure", done: false },
    ],
    insight: { title: "Capability Imbalance", message: "Your equation fluency is improving, but", highlight: "verification discipline is still inconsistent." },
    recommendations: [
      { icon: Shield, text: "Scenario: Multi-Step Equation Sprint", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Practice: Solution Check Drill", sub: "Reduce sign errors", action: "/arena-session" },
      { icon: BookOpen, text: "Reflect on: skipped checking errors", sub: "Revisit flagged", action: "/journal" },
    ],
  },
  "alg-1": {
    id: "alg-1", objective: "Master Word Problem Translation", domain: "Mathematical Communication",
    currentLevel: 1.9, targetLevel: 4.0, baselineLevel: 1.5, progress: 25,
    focusArea: "Translating scenarios to algebra", nextSession: "Word Problem Reasoning Scenario", estimatedWeeks: 7,
    capabilities: [
      { name: "Unknown Identification", progress: 46, type: "strength" },
      { name: "Relationship Mapping", progress: 41, type: "strength" },
      { name: "Equation Setup", progress: 28, type: "focus" },
      { name: "Constraint Framing", progress: 23, type: "focus" },
      { name: "Units Checking", progress: 20, type: "focus" },
    ],
    milestones: [
      { label: "Identify unknowns reliably", done: true },
      { label: "Translate short prompts", done: true },
      { label: "Handle multi-step word problems", done: false },
      { label: "Set up equations under time limit", done: false },
    ],
    insight: { title: "Translation Gap", message: "You can solve equations, but", highlight: "scenario-to-equation translation remains the bottleneck." },
    recommendations: [
      { icon: Shield, text: "Scenario: Word Problem Reasoning", sub: "Core practice", action: "/arena-session" },
      { icon: Target, text: "Challenge: Equation Setup Lab", sub: "Structure first", action: "/arena-session" },
      { icon: BookOpen, text: "Review: word problem journal notes", sub: "Reflection", action: "/journal" },
    ],
  },
  "calc-a1": {
    id: "calc-a1", objective: "Master Derivative Techniques", domain: "Calculus",
    currentLevel: 1.9, targetLevel: 4.0, baselineLevel: 1.5, progress: 20,
    focusArea: "Chain rule and implicit differentiation", nextSession: "Chain Rule Scenario", estimatedWeeks: 8,
    capabilities: [
      { name: "Power Rule", progress: 60, type: "strength" },
      { name: "Product/Quotient", progress: 44, type: "strength" },
      { name: "Chain Rule", progress: 30, type: "focus" },
      { name: "Implicit Differentiation", progress: 25, type: "focus" },
      { name: "Mixed Rule Selection", progress: 19, type: "focus" },
    ],
    milestones: [
      { label: "Review core derivative rules", done: true },
      { label: "Apply product & quotient rules", done: true },
      { label: "Apply chain rule in mixed sets", done: false },
      { label: "Use implicit differentiation confidently", done: false },
    ],
    insight: { title: "Rule Selection Gap", message: "Procedural differentiation is improving, but", highlight: "chain-rule recognition in mixed problems is lagging." },
    recommendations: [
      { icon: Shield, text: "Scenario: Chain Rule Mixer", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Practice: Implicit Diff Drill", sub: "Technique fluency", action: "/arena-session" },
      { icon: BookOpen, text: "Review: derivative error log", sub: "Reflection", action: "/journal" },
    ],
  },
  "ins-a1": {
    id: "ins-a1", objective: "Handle Customer Objections Effectively", domain: "Sales",
    currentLevel: 1.8, targetLevel: 4.0, baselineLevel: 1.4, progress: 18,
    focusArea: "Price objection reframing", nextSession: "Customer Objection Simulation", estimatedWeeks: 7,
    capabilities: [
      { name: "Empathy Opening", progress: 49, type: "strength" },
      { name: "Need Discovery", progress: 43, type: "strength" },
      { name: "Price Reframing", progress: 26, type: "focus" },
      { name: "Value Contrast", progress: 22, type: "focus" },
      { name: "Closing Confidence", progress: 18, type: "focus" },
    ],
    milestones: [
      { label: "Understand common objections", done: true },
      { label: "Use empathetic acknowledgment", done: true },
      { label: "Reframe price with value", done: false },
      { label: "Close with confidence", done: false },
    ],
    insight: { title: "Objection Handling Gap", message: "Your rapport is strong, but", highlight: "price objection reframing needs structured repetition." },
    recommendations: [
      { icon: Shield, text: "Scenario: Customer Objection Simulation", sub: "Challenge Mode", action: "/arena-session" },
      { icon: Target, text: "Practice: Price Reframe Script", sub: "Value articulation", action: "/arena-session" },
      { icon: BookOpen, text: "Reflect on: lost sale opening", sub: "Revisit flagged", action: "/journal" },
    ],
  },
};

const defaultJourneyByProgram: Record<string, string> = {
  "p1": "1",
  "p-algebra": "alg-a1",
  "p-calculus": "calc-a1",
  "p-insurance": "ins-a1",
};

const JourneyDashboard = () => {
  const navigate = useNavigate();
  const { journeyId } = useParams<{ journeyId: string }>();
  const { activeProgram } = useLearner();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fallbackJourneyId = defaultJourneyByProgram[activeProgram.id] || "1";
  const journey = journeyDatabase[journeyId || ""] || journeyDatabase[fallbackJourneyId] || journeyDatabase["1"];

  const strengths = journey.capabilities.filter((c) => c.type === "strength");
  const focusAreas = journey.capabilities.filter((c) => c.type === "focus");

  const showMasteryCompletion = journey.progress >= 100;

  return (
    <Layout pageTitle="Journey Dashboard">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Back link */}
          <button
            onClick={() => navigate("/sessions")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors mb-4 flex items-center gap-1"
          >
            ← Back to Mastery Journeys
          </button>

          {/* Journey Header */}
          <div className="mb-5">
            <h1 className="text-base font-display font-semibold text-foreground">{journey.objective}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{journey.domain} · Focus: {journey.focusArea}</p>
          </div>

          {showMasteryCompletion && (
            <div className="mb-5">
              <MasteryCompletion journeyName={journey.objective} level={journey.targetLevel} sessions={12} />
            </div>
          )}

          {/* Row 0 — Capability Imbalance (full width) */}
          <InsightBanner title={journey.insight.title} className="mb-4">
            {journey.insight.message}{" "}
            <span className="text-foreground font-medium">{journey.insight.highlight}</span>
          </InsightBanner>

          {/* Row 1 — Target Outcome + Progress Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-primary" /> Target Outcome
              </h3>
              <p className="text-sm font-medium text-card-foreground mb-2">{journey.objective}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Target: <strong className="text-card-foreground">Level {journey.targetLevel}</strong></span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{journey.estimatedWeeks} weeks</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Progress Snapshot
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-muted-foreground">{journey.baselineLevel}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Baseline</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-muted relative">
                  <motion.div className="absolute left-0 top-0 h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${journey.progress}%` }} transition={{ duration: 1 }} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-primary">{journey.currentLevel}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 — Capability Focus + Next Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Capability Focus */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> Capability Focus
              </h3>
              <div className="space-y-2 mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strengths</p>
                {strengths.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28">{cap.name}</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider pt-1">Focus Areas</p>
                {focusAreas.slice(0, 2).map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28">{cap.name}</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary/60" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                  </div>
                ))}
              </div>
              {focusAreas.length > 2 && (
                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <CollapsibleTrigger className="text-xs text-primary flex items-center gap-1 hover:underline">
                    <ChevronDown className={`h-3 w-3 transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
                    {detailsOpen ? "Hide" : "View"} Details
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {focusAreas.slice(2).map((cap) => (
                      <div key={cap.name} className="flex items-center gap-2">
                        <span className="text-xs text-card-foreground w-28">{cap.name}</span>
                        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                          <motion.div className="h-full rounded-full bg-primary/60" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>

            {/* Next Step — visually emphasized */}
            <div className="rounded-xl border-2 border-primary/30 bg-card p-5 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/[0.03] pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5" /> Next Step
                </h3>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Next Session</p>
                    <p className="text-sm font-semibold text-card-foreground">{journey.nextSession || "No upcoming session"}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> {journey.focusArea}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~20 min</span>
                  </div>
                </div>
                <Button onClick={() => navigate(`/arena/session/${journey.nextSession ? journey.nextSession.toLowerCase().replace(/\s+/g, '-') : 'next'}-01`)} className="w-full mt-4">
                  <Target className="mr-1.5 h-4 w-4" /> Continue Journey
                </Button>
              </div>
            </div>
          </div>

          {/* Row 3 — Journey Milestones (full width) */}
          <div className="rounded-xl border border-border bg-card p-5 mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Journey Milestones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {journey.milestones.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2.5">
                  {m.done ? <CheckSquare className="h-4 w-4 text-primary shrink-0" /> : <Square className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                  <span className={`text-sm ${m.done ? "text-card-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Row 4 — Recommended Next (full width) */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3 text-primary" /> Recommended Next
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {journey.recommendations.map((rec, i) => (
                <button
                  key={i}
                  onClick={() => navigate(rec.action)}
                  className="text-left rounded-lg bg-muted/50 px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 group"
                >
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

export default JourneyDashboard;
