import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Zap, ArrowRight, ChevronDown, Clock, Mic, CheckSquare, Square, Shield, BookOpen, Lightbulb } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { InsightBanner } from "@/components/InsightBanner";
import { MasteryCompletion } from "@/components/MasteryCompletion";


const capabilities = [
  { name: "Clarity", progress: 55, type: "strength" },
  { name: "Reflection", progress: 48, type: "strength" },
  { name: "Evidence Use", progress: 42, type: "focus" },
  { name: "Reasoning", progress: 38, type: "focus" },
  { name: "Alternatives", progress: 30, type: "focus" },
];

const milestones = [
  { label: "Clarifying complex problems", done: true },
  { label: "Structuring decisions", done: true },
  { label: "Evaluating evidence", done: false },
  { label: "Handling stakeholder conflict", done: false },
];

// Mock: set to true to preview mastery completion
const showMasteryCompletion = false;

const Dashboard = () => {
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const strengths = capabilities.filter((c) => c.type === "strength");
  const focusAreas = capabilities.filter((c) => c.type === "focus");

  return (
    <Layout pageTitle="Journey Dashboard">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Mastery Completion (conditional) */}
          {showMasteryCompletion && (
            <div className="mb-5">
              <MasteryCompletion journeyName="Strategic Leadership" level={4} sessions={8} />
            </div>
          )}

          {/* Capability Imbalance Insight */}
          <InsightBanner title="Capability Imbalance" className="mb-5">
            Your reasoning clarity is strong, but <span className="text-foreground font-medium">alternatives generation</span> is lagging.
            Suggested focus: <span className="text-foreground font-medium">Explore Alternatives</span>.
          </InsightBanner>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Top Left — Target Outcome */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-primary" /> Target Outcome
              </h3>
              <p className="text-sm font-medium text-card-foreground mb-2">Lead distributed teams effectively</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Target: <strong className="text-card-foreground">Level 4.0</strong></span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~8 weeks</span>
              </div>
            </div>

            {/* Top Right — Progress Snapshot */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Progress Snapshot
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-muted-foreground">2.2</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Baseline</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-muted relative">
                  <motion.div className="absolute left-0 top-0 h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 1 }} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-display font-bold text-primary">3.1</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</p>
                </div>
              </div>
            </div>

            {/* Bottom Left — Capability Focus */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> Capability Focus
              </h3>
              <div className="space-y-2 mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strengths</p>
                {strengths.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-24">{cap.name}</span>
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${cap.progress}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{cap.progress}%</span>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider pt-1">Focus Areas</p>
                {focusAreas.slice(0, 2).map((cap) => (
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
                  {focusAreas.slice(2).map((cap) => (
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

            {/* Bottom Right — Next Step */}
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-primary" /> Next Step
              </h3>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Today's Focus</p>
                <p className="text-sm font-medium text-card-foreground mb-1">Scenario: Resolving Cross-Team Conflict</p>
                <p className="text-xs text-muted-foreground mb-4">Practice Session · ~20 min</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/arena-session")} size="sm" className="flex-1">
                  <Target className="mr-1.5 h-3.5 w-3.5" /> Continue Journey
                </Button>
                <Button variant="outline" size="sm">
                  <Mic className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Journey Milestones */}
          <div className="rounded-xl border border-border bg-card p-5 mb-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Journey Milestones</h3>
            <div className="space-y-2">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2.5"
                >
                  {m.done ? (
                    <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  )}
                  <span className={`text-sm ${m.done ? "text-card-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Adaptive Practice Recommendations */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3 text-primary" /> Recommended Next
            </h3>
            <div className="space-y-2">
              {[
                { icon: Shield, text: "Scenario: Conflicting Stakeholder Priorities", sub: "Challenge Mode" },
                { icon: Target, text: "Challenge Mode: Evidence Evaluation", sub: "Strengthen weak dimension" },
                { icon: BookOpen, text: "Reflect on: Feb 19 decision journal entry", sub: "Revisit flagged" },
              ].map((rec, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i === 2 ? "/journal" : "/arena-session")}
                  className="w-full text-left rounded-lg bg-muted/50 px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 group"
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

export default Dashboard;
