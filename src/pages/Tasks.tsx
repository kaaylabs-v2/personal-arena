import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, ArrowRight } from "lucide-react";
import { InsightBanner } from "@/components/InsightBanner";
import { useLearner } from "@/contexts/LearnerContext";

interface PracticeTask {
  id: string;
  name: string;
  capability: string;
  journey: string;
  estimatedTime?: string;
  currentLevel: number;
  targetLevel: number;
}

const tasksByProgram: Record<string, { today: PracticeTask[]; upcoming: PracticeTask[]; completed: PracticeTask[]; insights: { plateau: string; imbalance: string } }> = {
  "p1": {
    today: [
      { id: "1", name: "Navigate a stakeholder disagreement", capability: "Conflict Resolution", journey: "Team Leadership", estimatedTime: "15m", currentLevel: 2.8, targetLevel: 4.5 },
      { id: "2", name: "Reframe a negative customer interaction", capability: "Empathetic Communication", journey: "Customer Experience", estimatedTime: "10m", currentLevel: 3.1, targetLevel: 4.5 },
      { id: "3", name: "Prioritize competing sprint goals", capability: "Strategic Prioritization", journey: "Team Leadership", currentLevel: 1.9, targetLevel: 4.0 },
    ],
    upcoming: [
      { id: "4", name: "Design an async standup format", capability: "Distributed Collaboration", journey: "Team Leadership", estimatedTime: "20m", currentLevel: 2.0, targetLevel: 4.0 },
      { id: "5", name: "Run executive escalation simulation", capability: "Risk Framing", journey: "Strategic Leadership", estimatedTime: "12m", currentLevel: 1.8, targetLevel: 4.0 },
    ],
    completed: [
      { id: "6", name: "Give constructive feedback to a peer", capability: "Feedback Delivery", journey: "Team Leadership", currentLevel: 3.8, targetLevel: 4.5 },
      { id: "7", name: "Map stakeholder interests", capability: "Stakeholder Mapping", journey: "Strategic Leadership", currentLevel: 4.0, targetLevel: 4.5 },
    ],
    insights: {
      plateau: "Your Evidence Evaluation has plateaued over the last 4 sessions. Try a challenge-focused scenario to strengthen this skill.",
      imbalance: "Your reasoning clarity is strong, but alternatives generation is lagging. Suggested focus: Explore Alternatives.",
    },
  },
  "p-algebra": {
    today: [
      { id: "alg-1", name: "Translate a word problem into equations", capability: "Word Problem Translation", journey: "Algebra Foundations", estimatedTime: "12m", currentLevel: 1.5, targetLevel: 4.0 },
      { id: "alg-2", name: "Solve and verify multi-step equation", capability: "Multi-Step Equations", journey: "Equation Solving", estimatedTime: "10m", currentLevel: 1.4, targetLevel: 4.0 },
      { id: "alg-3", name: "Break down a complex algebra scenario", capability: "Equation Setup", journey: "Problem Decomposition", currentLevel: 1.6, targetLevel: 4.0 },
    ],
    upcoming: [
      { id: "alg-4", name: "Pattern recognition timed puzzle", capability: "Sequence Patterns", journey: "Pattern Recognition", estimatedTime: "8m", currentLevel: 2.4, targetLevel: 4.0 },
      { id: "alg-5", name: "Function table challenge", capability: "Function Tables", journey: "Algebraic Reasoning", estimatedTime: "10m", currentLevel: 2.2, targetLevel: 3.5 },
    ],
    completed: [
      { id: "alg-6", name: "One-step equation sprint", capability: "Linear Equations", journey: "Equation Solving", currentLevel: 3.4, targetLevel: 4.0 },
      { id: "alg-7", name: "Unknowns identification drill", capability: "Problem Decomposition", journey: "Word Problems", currentLevel: 3.1, targetLevel: 4.0 },
    ],
    insights: {
      plateau: "Your checking-solution habit is inconsistent under time pressure. Add one verification pass before final answers.",
      imbalance: "Your pattern recognition is stronger than equation setup. Suggested focus: Slow down before writing equations.",
    },
  },
  "p-calculus": {
    today: [
      { id: "calc-1", name: "Chain rule mixed-problem challenge", capability: "Chain Rule Application", journey: "Derivative Application", estimatedTime: "15m", currentLevel: 1.5, targetLevel: 4.0 },
      { id: "calc-2", name: "Optimization setup scenario", capability: "Optimization Problems", journey: "Applications", estimatedTime: "12m", currentLevel: 1.2, targetLevel: 4.0 },
      { id: "calc-3", name: "Interpret derivative graph quickly", capability: "Derivative Interpretation", journey: "Graph Analysis", currentLevel: 2.0, targetLevel: 3.5 },
    ],
    upcoming: [
      { id: "calc-4", name: "Related rates modeling simulation", capability: "Related Rates", journey: "Problem Modeling", estimatedTime: "14m", currentLevel: 1.3, targetLevel: 3.5 },
      { id: "calc-5", name: "Implicit differentiation mini-lab", capability: "Implicit Differentiation", journey: "Derivative Techniques", estimatedTime: "10m", currentLevel: 1.8, targetLevel: 3.5 },
    ],
    completed: [
      { id: "calc-6", name: "Power rule speed run", capability: "Derivative Basics", journey: "Derivative Application", currentLevel: 3.5, targetLevel: 4.0 },
      { id: "calc-7", name: "Limit evaluation review", capability: "Understanding Limits", journey: "Limit Reasoning", currentLevel: 3.2, targetLevel: 4.0 },
    ],
    insights: {
      plateau: "Your chain rule accuracy has plateaued. Mix chain and product rule prompts to improve recognition.",
      imbalance: "You solve procedural derivatives well, but optimization setup lags. Suggested focus: Map constraints first.",
    },
  },
  "p-insurance": {
    today: [
      { id: "ins-1", name: "Handle a price objection with value framing", capability: "Handling Price Objections", journey: "Objection Handling", estimatedTime: "10m", currentLevel: 1.4, targetLevel: 4.0 },
      { id: "ins-2", name: "Explain risk using client story", capability: "Risk Communication", journey: "Value Framing", estimatedTime: "8m", currentLevel: 1.6, targetLevel: 3.5 },
      { id: "ins-3", name: "Match policy options to profile", capability: "Policy Structuring", journey: "Customer Needs Analysis", currentLevel: 2.2, targetLevel: 4.0 },
    ],
    upcoming: [
      { id: "ins-4", name: "Compliance disclosure scenario", capability: "Regulatory Compliance", journey: "Compliance Awareness", estimatedTime: "12m", currentLevel: 2.6, targetLevel: 4.0 },
      { id: "ins-5", name: "Trust rebuild conversation", capability: "Trust Objections", journey: "Trust Building", estimatedTime: "9m", currentLevel: 2.0, targetLevel: 3.5 },
    ],
    completed: [
      { id: "ins-6", name: "Client needs discovery drill", capability: "Life Stage Assessment", journey: "Customer Needs Analysis", currentLevel: 3.4, targetLevel: 4.0 },
      { id: "ins-7", name: "Ethical communication checkpoint", capability: "Ethical Sales Communication", journey: "Trust Building", currentLevel: 3.8, targetLevel: 4.0 },
    ],
    insights: {
      plateau: "Your objection handling confidence has stalled. Practice reframing cost concerns with consequence-based language.",
      imbalance: "Your rapport is strong, but risk communication trails. Suggested focus: Use concrete client scenarios.",
    },
  },
};

const TaskRow = ({ task, index }: { task: PracticeTask; index: number }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
      onClick={() => navigate("/arena-session")}
      className="w-full text-left rounded-lg border border-border bg-card px-3.5 py-2.5 hover:border-primary/30 transition-all group flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">{task.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground truncate">{task.journey}</span>
          <span className="text-[11px] text-primary/70 font-medium truncate">{task.capability}</span>
          {task.estimatedTime && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-0.5 shrink-0">
              <Clock className="h-2.5 w-2.5" />{task.estimatedTime}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] text-muted-foreground shrink-0">{task.currentLevel}</span>
          <div className="relative h-1 flex-1 max-w-[80px] rounded-full bg-secondary overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary/60 transition-all" style={{ width: `${(task.currentLevel / task.targetLevel) * 100}%` }} />
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">{task.targetLevel}</span>
        </div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </motion.button>
  );
};

const Tasks = () => {
  const { activeProgram } = useLearner();
  const [tab, setTab] = useState<"today" | "upcoming">("today");
  const data = tasksByProgram[activeProgram.id] || tasksByProgram["p1"];
  const tasks = tab === "today" ? data.today : data.upcoming;

  return (
    <Layout pageTitle="Practice">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-end mb-4">
          <div className="flex rounded-lg bg-muted p-0.5">
            {(["today", "upcoming"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >{t === "today" ? "Today" : "Upcoming"}</button>
            ))}
          </div>
        </div>

        {/* Plateau Detection */}
        <InsightBanner title="Plateau Detected" className="mb-4">
          {data.insights.plateau}
        </InsightBanner>

        {/* Capability Imbalance */}
        <InsightBanner title="Capability Imbalance" className="mb-6">
          {data.insights.imbalance}
        </InsightBanner>

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
              {data.completed.map((task, i) => (
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
