import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MasteryCompletion } from "@/components/MasteryCompletion";
import { useLearner } from "@/contexts/LearnerContext";

interface ProgressProgramData {
  journeys: { id: string; name: string }[];
  growthData: { week: string; level: number }[];
  outcomes: { current: number; target: number; time: string; est: string };
  strengths: { name: string; level: number }[];
  focusAreas: { name: string; level: number }[];
  journeyComparison: { name: string; current: number; target: number; color: string }[];
}

const progressByProgram: Record<string, ProgressProgramData> = {
  "p1": {
    journeys: [{ id: "all", name: "All Journeys" }, { id: "team-leadership", name: "Team Leadership" }, { id: "strategic-thinking", name: "Strategic Thinking" }],
    growthData: [{ week: "W1", level: 2.2 }, { week: "W2", level: 2.4 }, { week: "W3", level: 2.5 }, { week: "W4", level: 2.8 }, { week: "W5", level: 2.9 }, { week: "W6", level: 3.1 }],
    outcomes: { current: 3.1, target: 4.0, time: "6.5h", est: "~8w" },
    strengths: [{ name: "Clarity", level: 3.4 }, { name: "Reflection", level: 3.1 }, { name: "Active Listening", level: 3.0 }],
    focusAreas: [{ name: "Evidence Use", level: 2.3 }, { name: "Reasoning", level: 2.1 }, { name: "Alternatives", level: 1.8 }],
    journeyComparison: [{ name: "Team Leadership", current: 3.1, target: 4.0, color: "hsl(var(--primary))" }, { name: "Strategic Thinking", current: 1.8, target: 3.0, color: "hsl(38, 92%, 50%)" }],
  },
  "p-algebra": {
    journeys: [{ id: "all", name: "All Topics" }, { id: "equations", name: "Equations" }, { id: "patterns", name: "Patterns" }],
    growthData: [{ week: "W1", level: 1.5 }, { week: "W2", level: 1.6 }, { week: "W3", level: 1.8 }, { week: "W4", level: 1.9 }, { week: "W5", level: 2.0 }, { week: "W6", level: 2.1 }],
    outcomes: { current: 2.1, target: 4.0, time: "3.2h", est: "~12w" },
    strengths: [{ name: "Pattern Recognition", level: 3.0 }, { name: "Variable Manipulation", level: 2.8 }],
    focusAreas: [{ name: "Word Problems", level: 1.5 }, { name: "Equation Setup", level: 1.6 }, { name: "Multi-Step Equations", level: 1.4 }],
    journeyComparison: [{ name: "Equation Solving", current: 2.1, target: 4.0, color: "hsl(var(--primary))" }, { name: "Word Problems", current: 1.5, target: 4.0, color: "hsl(38, 92%, 50%)" }],
  },
  "p-calculus": {
    journeys: [{ id: "all", name: "All Topics" }, { id: "derivatives", name: "Derivatives" }, { id: "limits", name: "Limits" }],
    growthData: [{ week: "W1", level: 1.2 }, { week: "W2", level: 1.3 }, { week: "W3", level: 1.4 }, { week: "W4", level: 1.5 }, { week: "W5", level: 1.7 }, { week: "W6", level: 1.8 }],
    outcomes: { current: 1.8, target: 3.5, time: "4.1h", est: "~14w" },
    strengths: [{ name: "Limit Reasoning", level: 2.8 }, { name: "Graph Interpretation", level: 2.0 }],
    focusAreas: [{ name: "Chain Rule", level: 1.5 }, { name: "Optimization", level: 1.2 }, { name: "Related Rates", level: 1.3 }],
    journeyComparison: [{ name: "Derivative Application", current: 1.6, target: 4.0, color: "hsl(var(--primary))" }, { name: "Integration", current: 2.2, target: 4.0, color: "hsl(210, 70%, 55%)" }],
  },
  "p-insurance": {
    journeys: [{ id: "all", name: "All Areas" }, { id: "objections", name: "Objection Handling" }, { id: "compliance", name: "Compliance" }],
    growthData: [{ week: "W1", level: 1.6 }, { week: "W2", level: 1.7 }, { week: "W3", level: 1.9 }, { week: "W4", level: 2.0 }, { week: "W5", level: 2.1 }, { week: "W6", level: 2.2 }],
    outcomes: { current: 2.2, target: 4.0, time: "5.0h", est: "~10w" },
    strengths: [{ name: "Ethical Communication", level: 3.2 }, { name: "Documentation", level: 3.0 }],
    focusAreas: [{ name: "Price Objections", level: 1.4 }, { name: "Risk Communication", level: 1.6 }, { name: "Coverage Gaps", level: 1.8 }],
    journeyComparison: [{ name: "Objection Handling", current: 1.7, target: 4.0, color: "hsl(var(--primary))" }, { name: "Compliance", current: 2.8, target: 4.0, color: "hsl(210, 70%, 55%)" }],
  },
};

const Progress = () => {
  const { activeProgram } = useLearner();
  const data = progressByProgram[activeProgram.id] || progressByProgram["p1"];
  const [selectedJourney, setSelectedJourney] = useState("all");

  const outcomes = data.outcomes;
  const strengths = data.strengths;
  const focusAreas = data.focusAreas;
  const growthData = data.growthData;

  const readinessRatio = outcomes.current / outcomes.target;
  const showMasteryReadiness = readinessRatio >= 0.75;
  const showMasteryCompletion = false;

  return (
    <Layout pageTitle="Progress">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} key={activeProgram.id}>

          {showMasteryCompletion && (
            <div className="mb-5">
              <MasteryCompletion journeyName={activeProgram.name} level={4} sessions={8} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Capability Growth */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Capability Growth
              </h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => [`Level ${value}`, "Capability"]} />
                    <Line type="monotone" dataKey="level" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Baseline: <strong className="text-card-foreground">{growthData[0]?.level}</strong></span>
                <span>Current: <strong className="text-primary">{growthData[growthData.length - 1]?.level}</strong></span>
              </div>
            </div>

            {/* Outcome Achievement */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-primary" /> Outcome Achievement
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-primary">{outcomes.current}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Current Level</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">{outcomes.target}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Target Level</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">{outcomes.time}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Time Invested</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">{outcomes.est}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Est. to Mastery</p>
                </div>
              </div>
              {showMasteryReadiness && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 mt-4 flex items-start gap-2.5">
                  <Target className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5">Approaching Mastery</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">You are approaching your mastery target. Try an <span className="text-foreground font-medium">integrated scenario</span> to validate.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Capability Breakdown */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> Capability Breakdown
              </h3>
              <div className="space-y-2 mb-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strengths</p>
                {strengths.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28 truncate">{cap.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(cap.level / 5) * 100}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-6 text-right">{cap.level}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus Areas</p>
                {focusAreas.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28 truncate">{cap.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary/50" initial={{ width: 0 }} animate={{ width: `${(cap.level / 5) * 100}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-6 text-right">{cap.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Comparison */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Journey Comparison
              </h3>
              <div className="space-y-3">
                {data.journeyComparison.map((journey) => {
                  const pct = (journey.current / journey.target) * 100;
                  return (
                    <div key={journey.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-card-foreground font-medium">{journey.name}</span>
                        <span className="text-[10px] text-muted-foreground">{journey.current} / {journey.target}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: journey.color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">Levels shown as current / target across active journeys</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Progress;
