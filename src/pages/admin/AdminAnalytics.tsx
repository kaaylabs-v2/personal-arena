import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Users, TrendingUp, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";

const programMetrics = [
  { name: "Strategic Leadership", enrolled: 48, active: 41, avgLevel: 2.8, avgCompletion: 62, avgSessionTime: "18 min" },
  { name: "Algebra Foundations", enrolled: 124, active: 98, avgLevel: 2.3, avgCompletion: 45, avgSessionTime: "14 min" },
  { name: "Calculus I Mastery", enrolled: 37, active: 29, avgLevel: 1.9, avgCompletion: 38, avgSessionTime: "21 min" },
  { name: "Insurance Sales Mastery", enrolled: 56, active: 44, avgLevel: 2.4, avgCompletion: 51, avgSessionTime: "16 min" },
];

const weeklyTrend = [
  { week: "Feb 3", sessions: 142 },
  { week: "Feb 10", sessions: 156 },
  { week: "Feb 17", sessions: 168 },
  { week: "Feb 24", sessions: 151 },
  { week: "Mar 3", sessions: 189 },
  { week: "Mar 10", sessions: 204 },
  { week: "Mar 17", sessions: 198 },
];

export default function AdminAnalytics() {
  const maxSessions = Math.max(...weeklyTrend.map((w) => w.sessions));

  return (
    <AdminLayout pageTitle="Analytics">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Active Learners" value={212} change="80% of enrolled" />
            <StatCard icon={TrendingUp} label="Sessions This Week" value={198} change="+5% vs last week" />
            <StatCard icon={Clock} label="Avg. Session Time" value="17 min" />
            <StatCard icon={Target} label="Avg. Level" value="2.4" change="+0.3 this month" />
          </div>

          {/* Weekly Sessions Chart (simple bar) */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Weekly Sessions</h3>
            <div className="flex items-end gap-3 h-32">
              {weeklyTrend.map((w) => (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground">{w.sessions}</span>
                  <div className="w-full rounded-t-md bg-primary/70 transition-all" style={{ height: `${(w.sessions / maxSessions) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground">{w.week}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Program Breakdown */}
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
                        <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${p.avgCompletion}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.avgCompletion}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.avgSessionTime}</td>
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
