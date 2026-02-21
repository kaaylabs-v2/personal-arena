import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, Mic, TrendingUp, ListTodo, BarChart3 } from "lucide-react";
import { Layout } from "@/components/Layout";

const capabilities = [
  { name: "Clarity", progress: 55 },
  { name: "Reasoning", progress: 38 },
  { name: "Evidence Use", progress: 42 },
  { name: "Alternatives", progress: 30 },
  { name: "Reflection", progress: 48 },
];

const tasks = [
  { title: "Scenario: Resolving Cross-Team Conflict", type: "Practice", due: "Today" },
  { title: "Evidence Mapping Exercise", type: "Drill", due: "Tomorrow" },
  { title: "Decision Journal Entry", type: "Reflection", due: "Wed" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-8">Program Dashboard</h1>

          {/* Progress Snapshot */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Progress Snapshot
              </h3>
              <span className="text-xs text-muted-foreground">Baseline → Current</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-muted-foreground">2.2</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Baseline</p>
              </div>
              <div className="flex-1 h-1 rounded-full bg-muted relative">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-primary">3.1</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</p>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Capability Dimensions
            </h3>
            <div className="space-y-3">
              {capabilities.map((cap) => (
                <div key={cap.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-card-foreground font-medium">{cap.name}</span>
                    <span className="text-muted-foreground">{cap.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${cap.progress}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-primary" /> Practice Tasks
            </h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center justify-between rounded-lg bg-surface p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{task.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="rounded-xl border border-border bg-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Outcome Progress</h3>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center">
                <span className="text-lg font-display font-bold text-primary">45%</span>
              </div>
              <p className="text-sm text-muted-foreground">toward mastery target</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => navigate("/arena-session")} className="flex-1">
              <Target className="mr-2 h-4 w-4" /> Start Arena Session
            </Button>
            <Button variant="outline" className="flex-1">
              <Mic className="mr-2 h-4 w-4" /> Record Reflection
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
