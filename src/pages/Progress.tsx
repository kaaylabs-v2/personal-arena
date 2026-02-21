import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TrendingUp, Target, Zap, BarChart3, ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const journeys = [
  { id: "all", name: "All Journeys" },
  { id: "team-leadership", name: "Team Leadership" },
  { id: "customer-experience", name: "Customer Experience" },
  { id: "strategic-thinking", name: "Strategic Thinking" },
];

const allGrowthData = [
  { week: "W1", level: 2.2 },
  { week: "W2", level: 2.4 },
  { week: "W3", level: 2.5 },
  { week: "W4", level: 2.8 },
  { week: "W5", level: 2.9 },
  { week: "W6", level: 3.1 },
];

const multiJourneyGrowthData = [
  { week: "W1", "Team Leadership": 2.4, "Customer Experience": 2.0, "Strategic Thinking": 1.4 },
  { week: "W2", "Team Leadership": 2.6, "Customer Experience": 2.1, "Strategic Thinking": 1.5 },
  { week: "W3", "Team Leadership": 2.7, "Customer Experience": 2.3, "Strategic Thinking": 1.5 },
  { week: "W4", "Team Leadership": 2.9, "Customer Experience": 2.4, "Strategic Thinking": 1.6 },
  { week: "W5", "Team Leadership": 3.0, "Customer Experience": 2.5, "Strategic Thinking": 1.7 },
  { week: "W6", "Team Leadership": 3.1, "Customer Experience": 2.6, "Strategic Thinking": 1.8 },
];

const journeyLineColors: Record<string, string> = {
  "Team Leadership": "hsl(174, 42%, 40%)",
  "Customer Experience": "hsl(210, 70%, 55%)",
  "Strategic Thinking": "hsl(38, 92%, 50%)",
};

const journeyGrowthData: Record<string, { week: string; level: number }[]> = {
  "team-leadership": [
    { week: "W1", level: 2.4 }, { week: "W2", level: 2.6 }, { week: "W3", level: 2.7 },
    { week: "W4", level: 2.9 }, { week: "W5", level: 3.0 }, { week: "W6", level: 3.1 },
  ],
  "customer-experience": [
    { week: "W1", level: 2.0 }, { week: "W2", level: 2.1 }, { week: "W3", level: 2.3 },
    { week: "W4", level: 2.4 }, { week: "W5", level: 2.5 }, { week: "W6", level: 2.6 },
  ],
  "strategic-thinking": [
    { week: "W1", level: 1.4 }, { week: "W2", level: 1.5 }, { week: "W3", level: 1.5 },
    { week: "W4", level: 1.6 }, { week: "W5", level: 1.7 }, { week: "W6", level: 1.8 },
  ],
};

const journeyOutcomes: Record<string, { current: number; target: number; time: string; est: string }> = {
  all: { current: 3.1, target: 4.0, time: "6.5h", est: "~8w" },
  "team-leadership": { current: 3.1, target: 4.0, time: "3.2h", est: "~6w" },
  "customer-experience": { current: 2.6, target: 3.5, time: "2.1h", est: "~7w" },
  "strategic-thinking": { current: 1.8, target: 3.0, time: "1.2h", est: "~12w" },
};

const allStrengths = [
  { name: "Clarity", level: 3.4 },
  { name: "Reflection", level: 3.1 },
  { name: "Active Listening", level: 3.0 },
];

const allFocusAreas = [
  { name: "Evidence Use", level: 2.3 },
  { name: "Reasoning", level: 2.1 },
  { name: "Alternatives", level: 1.8 },
];

const journeyStrengths: Record<string, { name: string; level: number }[]> = {
  "team-leadership": [{ name: "Clarity", level: 3.4 }, { name: "Delegation", level: 3.2 }],
  "customer-experience": [{ name: "Active Listening", level: 3.0 }, { name: "Empathy", level: 2.9 }],
  "strategic-thinking": [{ name: "Pattern Recognition", level: 2.1 }],
};

const journeyFocusAreas: Record<string, { name: string; level: number }[]> = {
  "team-leadership": [{ name: "Feedback Timing", level: 2.4 }, { name: "Conflict Nav.", level: 2.1 }],
  "customer-experience": [{ name: "De-escalation", level: 2.2 }, { name: "Reframing", level: 1.9 }],
  "strategic-thinking": [{ name: "Alternatives", level: 1.8 }, { name: "Evidence Use", level: 1.5 }],
};

const journeyComparison = [
  { name: "Team Leadership", current: 3.1, target: 4.0, color: "hsl(174, 42%, 40%)" },
  { name: "Customer Experience", current: 2.6, target: 3.5, color: "hsl(210, 70%, 55%)" },
  { name: "Strategic Thinking", current: 1.8, target: 3.0, color: "hsl(38, 92%, 50%)" },
];

const Progress = () => {
  const [selectedJourney, setSelectedJourney] = useState("all");
  const [growthView, setGrowthView] = useState<"overall" | "byJourney">("overall");
  const [showReadiness, setShowReadiness] = useState(false);

  const growthData = selectedJourney === "all" ? allGrowthData : (journeyGrowthData[selectedJourney] || allGrowthData);
  const outcomes = journeyOutcomes[selectedJourney] || journeyOutcomes.all;
  const strengths = selectedJourney === "all" ? allStrengths : (journeyStrengths[selectedJourney] || allStrengths);
  const focusAreas = selectedJourney === "all" ? allFocusAreas : (journeyFocusAreas[selectedJourney] || allFocusAreas);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground">
                Capability Growth
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Across your mastery journeys
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Viewing</p>
              <Select value={selectedJourney} onValueChange={setSelectedJourney}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {journeys.map((j) => (
                    <SelectItem key={j.id} value={j.id} className="text-xs">
                      {j.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Left — Capability Growth */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Capability Growth
                </h3>
                {selectedJourney === "all" && (
                  <div className="flex rounded-md bg-muted p-0.5">
                    {(["overall", "byJourney"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setGrowthView(v)}
                        className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                          growthView === v
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {v === "overall" ? "Overall" : "By Journey"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedJourney === "all" && growthView === "byJourney" ? (
                    <LineChart data={multiJourneyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(value: number, name: string) => [`Level ${value}`, name]}
                      />
                      {Object.entries(journeyLineColors).map(([name, color]) => (
                        <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={2} dot={{ r: 2, fill: color }} activeDot={{ r: 4 }} />
                      ))}
                    </LineChart>
                  ) : (
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(value: number) => [`Level ${value}`, "Capability"]}
                      />
                      <Line type="monotone" dataKey="level" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              {selectedJourney === "all" && growthView === "byJourney" ? (
                <div className="flex items-center gap-4 mt-2">
                  {Object.entries(journeyLineColors).map(([name, color]) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-muted-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <span>Baseline: <strong className="text-card-foreground">{growthData[0]?.level}</strong></span>
                  <span>Current: <strong className="text-primary">{growthData[growthData.length - 1]?.level}</strong></span>
                </div>
              )}
            </div>

            {/* Top Right — Outcome Achievement */}
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
            </div>

              {/* Readiness Prompt — hidden by default, toggle-able */}
              {showReadiness && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 mt-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Readiness Prompt</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Based on your trajectory, you may be ready to attempt a higher-complexity scenario in <span className="text-foreground font-medium">Team Leadership</span>. Consider testing your edge.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Left — Capability Breakdown */}
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

            {/* Bottom Right — Journey Comparison */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Journey Comparison
              </h3>
              <div className="space-y-3">
                {journeyComparison.map((journey) => {
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
