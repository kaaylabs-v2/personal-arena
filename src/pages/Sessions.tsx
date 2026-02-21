import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Target, ChevronDown, Plus, CheckCircle2 } from "lucide-react";

const activeJourneys = [
  {
    id: "1",
    objective: "Lead Distributed Teams Effectively",
    domain: "Leadership",
    currentLevel: 2.2,
    targetLevel: 4.0,
    progress: 45,
    lastActivity: "Scenario: Cross-Team Conflict Resolution",
    lastDate: "2 hours ago",
  },
  {
    id: "2",
    objective: "Make Data-Driven Decisions Under Uncertainty",
    domain: "Decision Making",
    currentLevel: 1.8,
    targetLevel: 3.5,
    progress: 22,
    lastActivity: "Evidence Mapping Exercise",
    lastDate: "Yesterday",
  },
  {
    id: "3",
    objective: "Present Strategy to Senior Stakeholders",
    domain: "Communication",
    currentLevel: 2.5,
    targetLevel: 4.0,
    progress: 60,
    lastActivity: "Reflection Journal Entry",
    lastDate: "3 days ago",
  },
];

const completedJourneys = [
  {
    id: "c1",
    objective: "Active Listening in 1:1 Meetings",
    domain: "Communication",
    levelAchieved: 3.8,
    completedDate: "Jan 15, 2026",
  },
];

const Sessions = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Continue Your Mastery</h1>
          <p className="text-sm text-muted-foreground mb-8">Pick up where you left off or start something new.</p>

          {/* Active Journeys */}
          <div className="space-y-4 mb-8">
            {activeJourneys.map((journey, i) => (
              <motion.div
                key={journey.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground font-display leading-snug">
                      {journey.objective}
                    </h3>
                    <span className="text-xs text-muted-foreground">{journey.domain}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{journey.lastDate}</span>
                </div>

                {/* Levels */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-display font-bold text-muted-foreground">{journey.currentLevel}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</span>
                  </div>
                  <div className="flex-1 h-1 rounded-full bg-muted relative">
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${journey.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-display font-bold text-primary">{journey.targetLevel}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</span>
                  </div>
                </div>

                {/* Last Activity + CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate mr-4">
                    Last: {journey.lastActivity}
                  </p>
                  <Button size="sm" onClick={() => navigate("/dashboard")} className="shrink-0">
                    <Target className="mr-1.5 h-3.5 w-3.5" /> Continue Session
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Start New */}
          <Button variant="outline" className="w-full mb-8" onClick={() => navigate("/")}>
            <Plus className="mr-2 h-4 w-4" /> Start New Mastery Journey
          </Button>

          {/* Completed Journeys */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold text-muted-foreground hover:text-card-foreground transition-colors group">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Completed Journeys
              </span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {completedJourneys.map((j) => (
                <div key={j.id} className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-card-foreground">{j.objective}</h4>
                    <p className="text-xs text-muted-foreground">{j.domain} · Level {j.levelAchieved} achieved</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{j.completedDate}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Sessions;
