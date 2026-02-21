import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, CheckCircle2 } from "lucide-react";

const activeJourneys = [
  {
    id: "1",
    objective: "Lead Distributed Teams Effectively",
    domain: "Leadership",
    currentLevel: 2.2,
    targetLevel: 4.0,
    progress: 45,
    focusArea: "Cross-team alignment",
  },
  {
    id: "2",
    objective: "Make Data-Driven Decisions Under Uncertainty",
    domain: "Decision Making",
    currentLevel: 1.8,
    targetLevel: 3.5,
    progress: 22,
    focusArea: "Evidence evaluation",
  },
  {
    id: "3",
    objective: "Present Strategy to Senior Stakeholders",
    domain: "Communication",
    currentLevel: 2.5,
    targetLevel: 4.0,
    progress: 60,
    focusArea: "Narrative structure",
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

const CircularBadge = ({ progress }: { progress: number }) => {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <motion.circle
          cx="22" cy="22" r={r} fill="none"
          stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-bold text-primary">{progress}%</span>
    </div>
  );
};

const Sessions = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Continue Your Mastery</h1>
          <p className="text-sm text-muted-foreground mb-6">Pick up where you left off or start something new.</p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {activeJourneys.map((journey, i) => (
              <motion.div
                key={journey.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border border-border bg-card p-5 cursor-pointer transition-colors hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 mr-3">
                    <h3 className="text-sm font-semibold text-card-foreground font-display leading-snug truncate">{journey.objective}</h3>
                    <span className="text-xs text-muted-foreground">{journey.domain}</span>
                  </div>
                  <CircularBadge progress={journey.progress} />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span>Current <strong className="text-card-foreground">{journey.currentLevel}</strong></span>
                  <span>→</span>
                  <span>Target <strong className="text-primary">{journey.targetLevel}</strong></span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Focus: <span className="text-card-foreground">{journey.focusArea}</span>
                </p>
              </motion.div>
            ))}

            {/* Start New Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: activeJourneys.length * 0.06 }}
              onClick={() => navigate("/")}
              className="rounded-xl border border-dashed border-border bg-card/50 p-5 cursor-pointer transition-colors hover:border-primary/40 hover:bg-card flex flex-col items-center justify-center min-h-[140px]"
            >
              <Plus className="h-6 w-6 text-muted-foreground mb-2" />
              <span className="text-sm font-medium text-muted-foreground">Start New Mastery Journey</span>
            </motion.div>
          </div>

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
