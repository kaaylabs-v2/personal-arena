import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, ArrowRight } from "lucide-react";

interface PracticeTask {
  id: string;
  name: string;
  capability: string;
  journey: string;
  estimatedTime?: string;
  currentLevel: number;
  targetLevel: number;
}

const todayTasks: PracticeTask[] = [
  { id: "1", name: "Navigate a stakeholder disagreement", capability: "Conflict Resolution", journey: "Team Leadership", estimatedTime: "15m", currentLevel: 2.8, targetLevel: 4.5 },
  { id: "2", name: "Reframe a negative customer interaction", capability: "Empathetic Communication", journey: "Customer Experience", estimatedTime: "10m", currentLevel: 3.1, targetLevel: 4.5 },
  { id: "3", name: "Prioritize competing sprint goals", capability: "Strategic Prioritization", journey: "Team Leadership", currentLevel: 1.9, targetLevel: 4.0 },
];

const upcomingTasks: PracticeTask[] = [
  { id: "4", name: "Design an async standup format", capability: "Distributed Collaboration", journey: "Team Leadership", estimatedTime: "20m", currentLevel: 2.0, targetLevel: 4.0 },
  { id: "5", name: "Identify upsell signals in conversation", capability: "Consultative Selling", journey: "Customer Experience", estimatedTime: "12m", currentLevel: 1.5, targetLevel: 4.5 },
];

const completedTasks: PracticeTask[] = [
  { id: "6", name: "Give constructive feedback to a peer", capability: "Feedback Delivery", journey: "Team Leadership", currentLevel: 3.8, targetLevel: 4.5 },
  { id: "7", name: "De-escalate an upset customer", capability: "Empathetic Communication", journey: "Customer Experience", currentLevel: 4.0, targetLevel: 4.5 },
];

const TaskRow = ({ task, index }: { task: PracticeTask; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => navigate("/arena-session")}
      className="w-full text-left rounded-lg border border-border bg-card px-3.5 py-2.5 hover:border-primary/30 transition-all group flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
          {task.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground truncate">{task.journey}</span>
          <span className="text-[11px] text-primary/70 font-medium truncate">{task.capability}</span>
          {task.estimatedTime && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-0.5 shrink-0">
              <Clock className="h-2.5 w-2.5" />
              {task.estimatedTime}
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </motion.button>
  );
};

const Tasks = () => {
  const [tab, setTab] = useState<"today" | "upcoming">("today");
  const tasks = tab === "today" ? todayTasks : upcomingTasks;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Your Practice
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Scenarios drawn from your active mastery journeys
            </p>
          </div>
          <div className="flex rounded-lg bg-muted p-0.5">
            {(["today", "upcoming"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "today" ? "Today" : "Upcoming"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          {tasks.map((task, i) => (
            <TaskRow key={task.id} task={task} index={i} />
          ))}
        </div>

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3 hover:text-foreground transition-colors group">
            Completed Practice
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {completedTasks.map((task, i) => (
                <TaskRow key={task.id} task={task} index={i} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Layout>
  );
};

export default Tasks;
