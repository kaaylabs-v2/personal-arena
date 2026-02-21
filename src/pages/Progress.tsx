import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const growthData = [
  { week: "W1", level: 2.2 },
  { week: "W2", level: 2.4 },
  { week: "W3", level: 2.5 },
  { week: "W4", level: 2.8 },
  { week: "W5", level: 2.9 },
  { week: "W6", level: 3.1 },
];

const journeyComparison = [
  { name: "Team Leadership", current: 3.1, target: 4.0, color: "hsl(174, 42%, 40%)" },
  { name: "Customer Experience", current: 2.6, target: 3.5, color: "hsl(210, 70%, 55%)" },
  { name: "Strategic Thinking", current: 1.8, target: 3.0, color: "hsl(38, 92%, 50%)" },
];

const strengths = [
  { name: "Clarity", level: 3.4 },
  { name: "Reflection", level: 3.1 },
  { name: "Active Listening", level: 3.0 },
];

const focusAreas = [
  { name: "Evidence Use", level: 2.3 },
  { name: "Reasoning", level: 2.1 },
  { name: "Alternatives", level: 1.8 },
];

const Progress = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Your Progress
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Capability growth across your mastery journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Left — Capability Growth */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Capability Growth
              </h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`Level ${value}`, "Capability"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="level"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>
                  Baseline: <strong className="text-card-foreground">2.2</strong>
                </span>
                <span>
                  Current: <strong className="text-primary">3.1</strong>
                </span>
              </div>
            </div>

            {/* Top Right — Outcome Achievement */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-primary" /> Outcome Achievement
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-primary">3.1</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                    Current Level
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">4.0</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                    Target Level
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">6.5h</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                    Time Invested
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">~8w</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                    Est. to Mastery
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Left — Capability Breakdown */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> Capability Breakdown
              </h3>
              <div className="space-y-2 mb-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Strengths
                </p>
                {strengths.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28 truncate">
                      {cap.name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(cap.level / 5) * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-6 text-right">
                      {cap.level}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Focus Areas
                </p>
                {focusAreas.map((cap) => (
                  <div key={cap.name} className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground w-28 truncate">
                      {cap.name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${(cap.level / 5) * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-6 text-right">
                      {cap.level}
                    </span>
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
                        <span className="text-xs text-card-foreground font-medium">
                          {journey.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {journey.current} / {journey.target}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: journey.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Levels shown as current / target across active journeys
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Progress;
