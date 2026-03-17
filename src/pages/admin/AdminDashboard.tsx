import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Users, BookOpen, TrendingUp, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const recentActivity = [
  { text: "Emma Watson completed 'Algebra Foundations' Session 5", time: "12 min ago" },
  { text: "New user Ravi Patel joined 'Calculus I Mastery'", time: "1 hr ago" },
  { text: "Coach Sarah left feedback on Maria's Session 3", time: "2 hrs ago" },
  { text: "Insurance Sales Mastery program updated by Admin", time: "5 hrs ago" },
  { text: "3 new learners enrolled in Strategic Leadership", time: "1 day ago" },
];

const topPrograms = [
  { name: "Strategic Leadership", learners: 48, completion: 62 },
  { name: "Algebra Foundations", learners: 124, completion: 45 },
  { name: "Calculus I Mastery", learners: 37, completion: 38 },
  { name: "Insurance Sales Mastery", learners: 56, completion: 51 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout pageTitle="Overview">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Learners" value={265} change="+12 this week" />
            <StatCard icon={BookOpen} label="Active Programs" value={4} />
            <StatCard icon={Building2} label="Tenants" value={3} />
            <StatCard icon={TrendingUp} label="Avg. Completion" value="49%" change="+4% vs last month" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Programs */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Programs</h3>
                <button onClick={() => navigate("/admin/programs")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                {topPrograms.map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.learners} learners</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${p.completion}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{p.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-card-foreground leading-relaxed">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
