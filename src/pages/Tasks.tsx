import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, Sparkles, ArrowRight } from "lucide-react";

interface PracticeTask {
  id: string;
  name: string;
  capability: string;
  journey: string;
  estimatedTime?: string;
}

const needsAttention: PracticeTask[] = [
  { id: "1", name: "Navigate a stakeholder disagreement", capability: "Conflict Resolution", journey: "Team Leadership Mastery", estimatedTime: "15 min" },
  { id: "2", name: "Reframe a negative customer interaction", capability: "Empathetic Communication", journey: "Customer Experience Mastery", estimatedTime: "10 min" },
  { id: "3", name: "Prioritize competing sprint goals", capability: "Strategic Prioritization", journey: "Team Leadership Mastery" },
];

const upcoming: PracticeTask[] = [
  { id: "4", name: "Design an async standup format", capability: "Distributed Collaboration", journey: "Team Leadership Mastery", estimatedTime: "20 min" },
  { id: "5", name: "Identify upsell signals in conversation", capability: "Consultative Selling", journey: "Customer Experience Mastery", estimatedTime: "12 min" },
];

const completed: PracticeTask[] = [
  { id: "6", name: "Give constructive feedback to a peer", capability: "Feedback Delivery", journey: "Team Leadership Mastery" },
  { id: "7", name: "De-escalate an upset customer", capability: "Empathetic Communication", journey: "Customer Experience Mastery" },
];

const TaskCard = ({ task, index }: { task: PracticeTask; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate("/arena-session")}
      className="w-full text-left rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
          {task.name}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-muted-foreground">{task.journey}</span>
          <span className="text-xs text-primary/70 font-medium">{task.capability}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {task.estimatedTime && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.estimatedTime}
          </span>
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </motion.button>
  );
};

const Tasks = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Your Practice Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scenarios drawn from your active mastery journeys
          </p>
        </div>

        {/* Needs Attention Today */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Needs Attention Today
            </h2>
          </div>
          <div className="space-y-2">
            {needsAttention.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </section>

        {/* Upcoming Practice */}
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
            Upcoming Practice
          </h2>
          <div className="space-y-2">
            {upcoming.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        </section>

        {/* Completed Practice */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3 hover:text-foreground transition-colors group">
            Completed Practice
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2">
              {completed.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Layout>
  );
};

export default Tasks;
