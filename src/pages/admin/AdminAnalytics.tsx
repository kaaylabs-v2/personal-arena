import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Users, TrendingUp, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const programMetrics = [
  { name: "Strategic Leadership", enrolled: 48, active: 41, avgLevel: 2.8, avgCompletion: 62, avgSessionTime: 18 },
  { name: "Algebra Foundations", enrolled: 124, active: 98, avgLevel: 2.3, avgCompletion: 45, avgSessionTime: 14 },
  { name: "Calculus I Mastery", enrolled: 37, active: 29, avgLevel: 1.9, avgCompletion: 38, avgSessionTime: 21 },
  { name: "Insurance Sales", enrolled: 56, active: 44, avgLevel: 2.4, avgCompletion: 51, avgSessionTime: 16 },
];

const weeklyTrend = [
  { week: "Feb 3", sessions: 142, avgScore: 2.1 },
  { week: "Feb 10", sessions: 156, avgScore: 2.2 },
  { week: "Feb 17", sessions: 168, avgScore: 2.3 },
  { week: "Feb 24", sessions: 151, avgScore: 2.2 },
  { week: "Mar 3", sessions: 189, avgScore: 2.5 },
  { week: "Mar 10", sessions: 204, avgScore: 2.6 },
  { week: "Mar 17", sessions: 198, avgScore: 2.4 },
];

const levelDistribution = [
  { name: "Level 1", value: 42 },
  { name: "Level 2", value: 88 },
  { name: "Level 3", value: 56 },
  { name: "Level 4", value: 22 },
  { name: "Level 5", value: 4 },
];

const COLORS = [
  "hsl(174, 42%, 40%)",
  "hsl(174, 42%, 55%)",
  "hsl(210, 70%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(152, 55%, 42%)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-card-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[11px] text-muted-foreground">
          {p.name}: <span className="font-medium text-card-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  return (
    <AdminLayout pageTitle="Analytics">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Active Learners" value={212} change="80% of enrolled" />
            <StatCard icon={TrendingUp} label="Sessions This Week" value={198} change="+5% vs last week" />
            <StatCard icon={Clock} label="Avg. Session Time" value="17 min" />
            <StatCard icon={Target} label="Avg. Level" value="2.4" change="+0.3 this month" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Sessions trend — area chart */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Weekly Sessions</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 42%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(174, 42%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 12%, 90%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sessions" stroke="hsl(174, 42%, 40%)" fill="url(#sessionGrad)" strokeWidth={2} name="Sessions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Level distribution — pie */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Level Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={levelDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {levelDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[10px] text-muted-foreground">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program comparison — bar chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Program Comparison</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={programMetrics} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 12%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-[11px] text-muted-foreground">{v}</span>} />
                <Bar dataKey="enrolled" name="Enrolled" fill="hsl(174, 42%, 40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" name="Active" fill="hsl(210, 70%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Program table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Program Breakdown</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5">Program</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5">Enrolled</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5">Active</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5">Avg. Level</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5">Completion</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5">Avg. Session</th>
                </tr>
              </thead>
              <tbody>
                {programMetrics.map((p) => (
                  <tr key={p.name} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-card-foreground">{p.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.enrolled}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.active}</td>
                    <td className="px-5 py-3 text-card-foreground">{p.avgLevel}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${p.avgCompletion}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.avgCompletion}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.avgSessionTime} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
