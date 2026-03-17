import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TrendingUp, Target, Zap, BarChart3, Clock, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MasteryCompletion } from "@/components/MasteryCompletion";
import { useLearner } from "@/contexts/LearnerContext";
import { humanLevel, humanProgress } from "@/lib/humanize";

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
    strengths: [{ name: "Clarity", level: 3.4 }, { name: "Learn From It", level: 3.1 }, { name: "Active Listening", level: 3.0 }],
    focusAreas: [{ name: "Show Your Work", level: 2.3 }, { name: "Think It Through", level: 2.1 }, { name: "Alternatives", level: 1.8 }],
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
  const { activeProgram, completedSessionCount } = useLearner();
  const data = progressByProgram[activeProgram.id] || progressByProgram["p1"];

  const outcomes = data.outcomes;
  const strengths = data.strengths;
  const focusAreas = data.focusAreas;
  const growthData = data.growthData;

  const overallPct = Math.round(((outcomes.current - 1) / (outcomes.target - 1)) * 100);

  // Empty state
  if (completedSessionCount === 0) {
    return (
      <Layout pageTitle="Progress">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Your progress story starts here</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Complete your first session and you'll start seeing your growth tracked here. 
              It takes about 15 minutes — and there are no wrong answers.
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Progress">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} key={activeProgram.id}>

          {/* Overall progress — friendly */}
          <div className="rounded-xl border border-border bg-card p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  You're {overallPct}% of the way to your goal
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{humanLevel(outcomes.current)} → Target: {humanLevel(outcomes.target)}</p>
              </div>
              <span className="text-xs text-primary font-medium">{humanProgress(outcomes.current, outcomes.target)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 0.8 }} />
            </div>
            <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {outcomes.time} invested</span>
              <span className="flex items-center gap-1.5"><Trophy className="h-3 w-3" /> Est. {outcomes.est} to go</span>
              <span className="flex items-center gap-1.5"><Target className="h-3 w-3" /> {completedSessionCount} sessions completed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Growth Chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Your Growth
              </h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => [humanLevel(value), "Level"]} />
                    <Line type="monotone" dataKey="level" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* What's going well + What to work on */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> How you're doing
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-[10px] text-primary font-medium uppercase tracking-wider">Going well</p>
                {strengths.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28 truncate">{cap.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(cap.level / 5) * 100}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-20 text-right">{humanLevel(cap.level)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Needs more practice</p>
                {focusAreas.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28 truncate">{cap.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary/50" initial={{ width: 0 }} animate={{ width: `${(cap.level / 5) * 100}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-20 text-right">{humanLevel(cap.level)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Comparison */}
            <div className="md:col-span-2 rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Journey Progress
              </h3>
              <div className="space-y-3">
                {data.journeyComparison.map((journey) => {
                  const pct = (journey.current / journey.target) * 100;
                  return (
                    <div key={journey.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-card-foreground font-medium">{journey.name}</span>
                        <span className="text-[10px] text-muted-foreground">{humanLevel(journey.current)} → {humanLevel(journey.target)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: journey.color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Progress;
