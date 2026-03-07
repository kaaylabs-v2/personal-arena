import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, CheckCircle2, Lightbulb, Target, BookOpen, Shield, Building2, Sparkles, GraduationCap } from "lucide-react";
import { InsightBanner } from "@/components/InsightBanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { programs } from "@/data/programs";

type SessionStatus = "completed" | "current" | "upcoming";

interface JourneySession {
  title: string;
  order: number;
  status: SessionStatus;
}

interface Journey {
  id: string;
  objective: string;
  domain: string;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  focusArea: string;
  nextSession?: string | null;
  assignedBy?: string;
  sessions: JourneySession[];
}

const makeSessions = (titles: string[], currentIndex: number): JourneySession[] =>
  titles.map((title, i) => ({
    title,
    order: i,
    status: i < currentIndex ? "completed" : i === currentIndex ? "current" : "upcoming",
  }));

// ─── Program-specific journey data ───

interface ProgramJourneyData {
  assigned: Journey[];
  personal: Journey[];
  completed: { id: string; objective: string; domain: string; levelAchieved: number; completedDate: string }[];
  insightTitle: string;
  insightText: string;
  recommendations: { icon: typeof Shield; text: string; sub: string; link: string }[];
  readiness: { label: string; value: string; accent: boolean }[];
}

const journeyDataByProgram: Record<string, ProgramJourneyData> = {
  "p1": {
    assigned: [
      { id: "a1", objective: "Strategic Decision Making for Senior Leaders", domain: "Leadership", currentLevel: 1.6, targetLevel: 4.0, progress: 18, focusArea: "Evidence-based reasoning", assignedBy: "Nexus Studio", nextSession: "Evidence Mapping", sessions: makeSessions(["Decision Frameworks", "Cognitive Bias Awareness", "Evidence Mapping", "Scenario Analysis", "Stakeholder Impact", "Risk Assessment", "Strategic Trade-offs", "Integrated Decision Scenario"], 2) },
      { id: "a2", objective: "Cross-Functional Stakeholder Alignment", domain: "Communication", currentLevel: 2.0, targetLevel: 3.5, progress: 35, focusArea: "Influence without authority", assignedBy: "Nexus Studio", nextSession: null, sessions: makeSessions(["Stakeholder Mapping", "Influence Strategies", "Negotiation Tactics", "Conflict Resolution", "Alignment Facilitation", "Cross-team Synthesis"], 2) },
    ],
    personal: [
      { id: "1", objective: "Lead Distributed Teams Effectively", domain: "Leadership", currentLevel: 2.2, targetLevel: 4.0, progress: 45, focusArea: "Cross-team alignment", nextSession: "Distributed Team Communication", sessions: makeSessions(["Communication Cadence", "Async Decision Protocols", "Distributed Team Communication", "Stakeholder Escalation", "Evidence Mapping", "Conflicting Priorities", "Resource Trade-offs", "Risk Communication", "Cross-team Alignment", "Executive Summary Framing", "Adaptive Messaging", "Integrated Scenario"], 2) },
      { id: "2", objective: "Make Data-Driven Decisions Under Uncertainty", domain: "Decision Making", currentLevel: 1.8, targetLevel: 3.5, progress: 22, focusArea: "Evidence evaluation", nextSession: null, sessions: makeSessions(["Data Literacy Foundations", "Statistical Reasoning", "Uncertainty Quantification", "Bayesian Thinking", "Decision Under Ambiguity", "Evidence Synthesis", "Integrated Analysis"], 1) },
      { id: "3", objective: "Present Strategy to Senior Stakeholders", domain: "Communication", currentLevel: 2.5, targetLevel: 4.0, progress: 60, focusArea: "Narrative structure", nextSession: "Board Presentation Drill", sessions: makeSessions(["Narrative Foundations", "Data Storytelling", "Audience Calibration", "Board Presentation Drill", "Objection Handling", "Executive Presence", "High-Stakes Pitch"], 3) },
    ],
    completed: [{ id: "c1", objective: "Active Listening in 1:1 Meetings", domain: "Communication", levelAchieved: 3.8, completedDate: "Jan 15, 2026" }],
    insightTitle: "Plateau Detected",
    insightText: 'Your <span class="text-foreground font-medium">Evidence Evaluation</span> has plateaued over the last 4 sessions. Try a <span class="text-foreground font-medium">Challenge-focused</span> scenario.',
    recommendations: [
      { icon: Shield, text: "Scenario: Conflicting Stakeholder Priorities", sub: "Challenge Mode", link: "/arena-session" },
      { icon: Target, text: "Challenge Mode: Evidence Evaluation", sub: "Strengthen weak dimension", link: "/arena-session" },
      { icon: BookOpen, text: "Reflect on: Feb 19 decision journal entry", sub: "Revisit flagged", link: "/journal" },
    ],
    readiness: [
      { label: "Current Level", value: "2.8", accent: false },
      { label: "Target Level", value: "4.0", accent: true },
      { label: "Trend", value: "↑ Rising", accent: false },
      { label: "Confidence", value: "Moderate", accent: false },
    ],
  },
  "p-algebra": {
    assigned: [
      { id: "alg-a1", objective: "Build Equation Solving Foundations", domain: "Algebra", currentLevel: 2.0, targetLevel: 4.0, progress: 30, focusArea: "Linear equations", assignedBy: "Math Department", nextSession: "Multi-Step Equations", sessions: makeSessions(["One-Step Equations", "Two-Step Equations", "Multi-Step Equations", "Equations with Variables on Both Sides", "Equation Review Challenge"], 2) },
    ],
    personal: [
      { id: "alg-1", objective: "Master Word Problem Translation", domain: "Communication", currentLevel: 1.5, targetLevel: 4.0, progress: 25, focusArea: "Translating scenarios to algebra", nextSession: "Word Problem Reasoning Scenario", sessions: makeSessions(["Identifying Unknowns", "Setting Up Equations", "Word Problem Reasoning Scenario", "Multi-Step Word Problems", "Real-World Applications"], 2) },
      { id: "alg-2", objective: "Recognize and Extend Patterns", domain: "Pattern Recognition", currentLevel: 2.5, targetLevel: 4.0, progress: 50, focusArea: "Sequence rules", nextSession: "Pattern Recognition Puzzle", sessions: makeSessions(["Arithmetic Sequences", "Geometric Sequences", "Pattern Recognition Puzzle", "Function Tables", "Generalizing Patterns"], 2) },
    ],
    completed: [{ id: "alg-c1", objective: "Basic Variable Concepts", domain: "Algebra", levelAchieved: 3.5, completedDate: "Feb 20, 2026" }],
    insightTitle: "Skill Gap Alert",
    insightText: 'Your <span class="text-foreground font-medium">Word Problem Translation</span> is declining. Practice converting real-world scenarios into equations before tackling multi-step problems.',
    recommendations: [
      { icon: Target, text: "Word Problem Reasoning Scenario", sub: "Practice translation skills", link: "/arena-session" },
      { icon: Shield, text: "Linear Equation Challenge", sub: "Strengthen solving confidence", link: "/arena-session" },
      { icon: BookOpen, text: "Review: Equation setup notes", sub: "Revisit key concepts", link: "/journal" },
    ],
    readiness: [
      { label: "Current Level", value: "2.1", accent: false },
      { label: "Target Level", value: "4.0", accent: true },
      { label: "Trend", value: "→ Steady", accent: false },
      { label: "Confidence", value: "Building", accent: false },
    ],
  },
  "p-calculus": {
    assigned: [
      { id: "calc-a1", objective: "Master Derivative Techniques", domain: "Calculus", currentLevel: 1.5, targetLevel: 4.0, progress: 20, focusArea: "Chain rule and implicit differentiation", assignedBy: "Professor Chen", nextSession: "Chain Rule Scenario", sessions: makeSessions(["Power Rule Review", "Product & Quotient Rules", "Chain Rule Scenario", "Implicit Differentiation", "Higher-Order Derivatives", "Derivative Applications"], 2) },
    ],
    personal: [
      { id: "calc-1", objective: "Solve Optimization Problems Confidently", domain: "Applications", currentLevel: 1.2, targetLevel: 4.0, progress: 15, focusArea: "Setting up optimization", nextSession: "Optimization Challenge", sessions: makeSessions(["Critical Points", "First Derivative Test", "Optimization Challenge", "Applied Max/Min", "Constrained Optimization"], 2) },
      { id: "calc-2", objective: "Interpret Graphs Using Calculus", domain: "Analysis", currentLevel: 2.0, targetLevel: 3.5, progress: 45, focusArea: "Connecting f and f'", nextSession: "Derivative Interpretation Exercise", sessions: makeSessions(["Slope & Tangent Lines", "Increasing/Decreasing Analysis", "Derivative Interpretation Exercise", "Concavity & Inflection", "Graph Sketching"], 2) },
    ],
    completed: [{ id: "calc-c1", objective: "Limit Fundamentals", domain: "Calculus", levelAchieved: 3.2, completedDate: "Feb 10, 2026" }],
    insightTitle: "Critical Gaps Detected",
    insightText: 'Your <span class="text-foreground font-medium">Chain Rule</span> and <span class="text-foreground font-medium">Optimization</span> are critical gaps. Focus on derivative application scenarios this week.',
    recommendations: [
      { icon: Target, text: "Chain Rule Scenario", sub: "Composite function practice", link: "/arena-session" },
      { icon: Shield, text: "Optimization Challenge", sub: "Applied max/min problems", link: "/arena-session" },
      { icon: BookOpen, text: "Review: Related rates notes", sub: "Revisit setup patterns", link: "/journal" },
    ],
    readiness: [
      { label: "Current Level", value: "1.8", accent: false },
      { label: "Target Level", value: "3.5", accent: true },
      { label: "Trend", value: "↑ Rising", accent: false },
      { label: "Confidence", value: "Low", accent: false },
    ],
  },
  "p-insurance": {
    assigned: [
      { id: "ins-a1", objective: "Handle Customer Objections Effectively", domain: "Sales", currentLevel: 1.4, targetLevel: 4.0, progress: 18, focusArea: "Price objection reframing", assignedBy: "Sales Director", nextSession: "Customer Objection Simulation", sessions: makeSessions(["Understanding Objections", "Empathy Techniques", "Customer Objection Simulation", "Price Reframing", "Trust Recovery", "Complex Objection Scenarios"], 2) },
      { id: "ins-a2", objective: "Regulatory Compliance in Sales Conversations", domain: "Compliance", currentLevel: 2.6, targetLevel: 4.0, progress: 42, focusArea: "Disclosure requirements", assignedBy: "Compliance Team", nextSession: "Compliance Risk Scenario", sessions: makeSessions(["Regulation Fundamentals", "Disclosure Requirements", "Compliance Risk Scenario", "Ethical Grey Areas", "Audit Preparation"], 2) },
    ],
    personal: [
      { id: "ins-1", objective: "Communicate Risk Effectively to Clients", domain: "Communication", currentLevel: 1.6, targetLevel: 3.5, progress: 30, focusArea: "Making risk tangible", nextSession: "Risk Storytelling", sessions: makeSessions(["Risk Concepts", "Client Risk Profiles", "Risk Storytelling", "Coverage Gap Scenarios", "Integrated Client Presentation"], 2) },
      { id: "ins-2", objective: "Structure Policies for Client Needs", domain: "Product Knowledge", currentLevel: 2.2, targetLevel: 4.0, progress: 38, focusArea: "Coverage matching", nextSession: "Policy Recommendation Scenario", sessions: makeSessions(["Product Knowledge", "Needs Assessment", "Policy Recommendation Scenario", "Bundle Strategy", "Complex Client Scenarios"], 2) },
    ],
    completed: [{ id: "ins-c1", objective: "Building Rapport with New Clients", domain: "Sales", levelAchieved: 3.6, completedDate: "Jan 28, 2026" }],
    insightTitle: "Objection Handling Gap",
    insightText: 'Your <span class="text-foreground font-medium">Price Objection Handling</span> is a critical gap. Practice reframing cost concerns with empathy and evidence-based value articulation.',
    recommendations: [
      { icon: Target, text: "Customer Objection Simulation", sub: "Practice price reframing", link: "/arena-session" },
      { icon: Shield, text: "Policy Recommendation Scenario", sub: "Match needs to coverage", link: "/arena-session" },
      { icon: BookOpen, text: "Review: Client conversation notes", sub: "Revisit key interactions", link: "/journal" },
    ],
    readiness: [
      { label: "Current Level", value: "2.2", accent: false },
      { label: "Target Level", value: "4.0", accent: true },
      { label: "Trend", value: "↑ Rising", accent: false },
      { label: "Confidence", value: "Moderate", accent: false },
    ],
  },
};

// ─── Components ───

const CircularBadge = ({ progress }: { progress: number }) => {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <motion.circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference * (1 - progress / 100) }} transition={{ duration: 0.8 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-bold text-primary">{progress}%</span>
    </div>
  );
};

const SessionTimeline = ({ sessions, navigate }: { sessions: JourneySession[]; navigate: (path: string) => void }) => (
  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
    <div className="pt-3 mt-3 border-t border-border">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Session Path</p>
      <div className="space-y-0">
        {sessions.map((s, i) => {
          const isClickable = s.status === "completed" || s.status === "current";
          return (
            <div key={i} onClick={(e) => { e.stopPropagation(); if (isClickable) navigate(s.status === "current" ? "/arena-session" : "/session-summary"); }} className={`flex items-start gap-2.5 py-1 ${isClickable ? "cursor-pointer group" : "cursor-default"}`}>
              <div className="flex flex-col items-center w-4 flex-shrink-0">
                {s.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : s.status === "current" ? <div className="h-3.5 w-3.5 rounded-full border-2 border-primary bg-primary/20" /> : <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30" />}
                {i < sessions.length - 1 && <div className={`w-px flex-1 min-h-[8px] ${s.status === "completed" ? "bg-primary/40" : "bg-border"}`} />}
              </div>
              <span className={`text-xs leading-tight -mt-0.5 ${s.status === "completed" ? "text-muted-foreground group-hover:text-primary transition-colors" : s.status === "current" ? "text-foreground font-medium group-hover:text-primary transition-colors" : "text-muted-foreground/50"}`}>
                {s.title}
                {s.status === "current" && <span className="text-primary text-[10px] ml-1.5">(Current)</span>}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
        {[{ icon: "✓", label: "Completed", cls: "text-primary" }, { icon: "●", label: "Current", cls: "text-primary" }, { icon: "○", label: "Upcoming", cls: "text-muted-foreground/50" }].map((l) => (
          <span key={l.label} className="text-[9px] text-muted-foreground flex items-center gap-1"><span className={l.cls}>{l.icon}</span> {l.label}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

const JourneyCard = ({ journey, index, navigate }: { journey: Journey; index: number; navigate: (path: string) => void }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div key={journey.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.06 }} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:shadow-sm">
      <div className="cursor-pointer" onClick={() => navigate(`/journey/${journey.id}`)}>
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 mr-3">
            <h3 className="text-sm font-semibold text-card-foreground font-display leading-snug truncate">{journey.objective}</h3>
            <span className="text-xs text-muted-foreground">{journey.domain}</span>
          </div>
          <CircularBadge progress={journey.progress} />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <span>Current <strong className="text-card-foreground">{journey.currentLevel}</strong></span>
          <span>→</span>
          <span>Target <strong className="text-primary">{journey.targetLevel}</strong></span>
        </div>
        <p className="text-xs text-muted-foreground">Focus: <span className="text-card-foreground">{journey.focusArea}</span></p>
        {journey.nextSession && (
          <p className="text-[10px] text-primary mt-2 flex items-center gap-1 hover:underline" onClick={(e) => { e.stopPropagation(); navigate(`/arena/session/${journey.nextSession!.toLowerCase().replace(/\s+/g, '-')}-01`); }}>
            <Target className="h-3 w-3" /> Next Session: <span className="font-medium">{journey.nextSession}</span>
          </p>
        )}
      </div>
      <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
        Session Path <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>{expanded && <SessionTimeline sessions={journey.sessions} navigate={navigate} />}</AnimatePresence>
    </motion.div>
  );
};

// ─── Page ───

import { useLearner } from "@/contexts/LearnerContext";

const Sessions = () => {
  const navigate = useNavigate();
  const { activeProgram, setActiveProgramId } = useLearner();
  const selectedProgramId = activeProgram.id;
  const selectedProgram = activeProgram;
  const data = journeyDataByProgram[selectedProgramId] || journeyDataByProgram["p1"];

  return (
    <Layout pageTitle="Mastery Journeys">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        {/* Program Selector */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 mb-4">
          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium shrink-0">Program</span>
          <Select value={selectedProgramId} onValueChange={setActiveProgramId}>
            <SelectTrigger className="w-[220px] h-8 text-sm font-semibold border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-2">{selectedProgram.targetLearner}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex gap-6">
            {/* LEFT: AI Coaching Panel */}
            <aside className="w-[360px] flex-shrink-0 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">AI Coach</h2>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Mastery Readiness</h3>
                <div className="grid grid-cols-2 gap-3">
                  {data.readiness.map((item) => (
                    <div key={item.label} className="rounded-lg bg-muted/50 px-3 py-2.5 text-center">
                      <p className={`text-lg font-display font-bold ${item.accent ? "text-primary" : "text-foreground"}`}>{item.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <InsightBanner title={data.insightTitle}>
                <span dangerouslySetInnerHTML={{ __html: data.insightText }} />
              </InsightBanner>

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
            </aside>

            {/* RIGHT: Mastery Journey Workspace */}
            <div className="flex-1 min-w-0 space-y-6">
              {data.assigned.length > 0 && (
                <div>
                  <div className="mb-3">
                    <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Mandated Mastery
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">Capabilities required by your organization</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.assigned.map((journey, i) => (
                      <JourneyCard key={journey.id} journey={journey} index={i} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-card-foreground">Self-Initiated Mastery</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Capabilities you choose to develop on your own</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.personal.map((journey, i) => (
                    <JourneyCard key={journey.id} journey={journey} index={i} navigate={navigate} />
                  ))}
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: data.personal.length * 0.06 }} onClick={() => navigate("/")} className="rounded-xl border border-dashed border-border bg-card/50 p-5 cursor-pointer transition-colors hover:border-primary/40 hover:bg-card flex flex-col items-center justify-center min-h-[140px]">
                    <Plus className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">Start New Mastery Journey</span>
                  </motion.div>
                </div>
              </div>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold text-muted-foreground hover:text-card-foreground transition-colors group">
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Completed Journeys</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3">
                  {data.completed.map((j) => (
                    <div key={j.id} className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-card-foreground">{j.objective}</h4>
                        <p className="text-xs text-muted-foreground">{j.domain} · Level {j.levelAchieved} achieved</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{j.completedDate}</span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Sessions;
