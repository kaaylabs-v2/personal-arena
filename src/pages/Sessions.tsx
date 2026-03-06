import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, CheckCircle2, Lightbulb, Target, BookOpen, Shield, Building2, Sparkles } from "lucide-react";
import { InsightBanner } from "@/components/InsightBanner";

const assignedJourneys = [
  { id: "a1", objective: "Strategic Decision Making for Senior Leaders", domain: "Leadership", currentLevel: 1.6, targetLevel: 4.0, progress: 18, focusArea: "Evidence-based reasoning", assignedBy: "Nexus Studio", nextSession: "Evidence Mapping" },
  { id: "a2", objective: "Cross-Functional Stakeholder Alignment", domain: "Communication", currentLevel: 2.0, targetLevel: 3.5, progress: 35, focusArea: "Influence without authority", assignedBy: "Nexus Studio", nextSession: null },
];

const personalJourneys = [
  { id: "1", objective: "Lead Distributed Teams Effectively", domain: "Leadership", currentLevel: 2.2, targetLevel: 4.0, progress: 45, focusArea: "Cross-team alignment", nextSession: "Async Decision Protocol" },
  { id: "2", objective: "Make Data-Driven Decisions Under Uncertainty", domain: "Decision Making", currentLevel: 1.8, targetLevel: 3.5, progress: 22, focusArea: "Evidence evaluation", nextSession: null },
  { id: "3", objective: "Present Strategy to Senior Stakeholders", domain: "Communication", currentLevel: 2.5, targetLevel: 4.0, progress: 60, focusArea: "Narrative structure", nextSession: "Board Presentation Drill" },
];

const completedJourneys = [
  { id: "c1", objective: "Active Listening in 1:1 Meetings", domain: "Communication", levelAchieved: 3.8, completedDate: "Jan 15, 2026" },
];

const CircularBadge = ({ progress }: { progress: number }) => {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <motion.circle cx="22" cy="22" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference * (1 - progress / 100) }} transition={{ duration: 0.8 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-bold text-primary">{progress}%</span>
    </div>
  );
};

interface JourneyCardProps {
  journey: { id: string; objective: string; domain: string; currentLevel: number; targetLevel: number; progress: number; focusArea: string; nextSession?: string | null };
  index: number;
  navigate: (path: string) => void;
}

const JourneyCard = ({ journey, index, navigate }: JourneyCardProps) => (
  <motion.div
    key={journey.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.06 }}
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
    <p className="text-xs text-muted-foreground">Focus: <span className="text-card-foreground">{journey.focusArea}</span></p>
    {journey.nextSession && (
      <p className="text-[10px] text-primary mt-2 flex items-center gap-1">
        <Target className="h-3 w-3" /> Next Session: <span className="font-medium">{journey.nextSession}</span>
      </p>
    )}
  </motion.div>
);

const Sessions = () => {
  const navigate = useNavigate();
  const showMasteryReadiness = true;

  return (
    <Layout pageTitle="Mastery Journeys">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex gap-6">

            {/* LEFT: AI Coaching Panel */}
            <aside className="w-[360px] flex-shrink-0 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">AI Coach</h2>
              </div>

              {/* Mastery Readiness */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Mastery Readiness</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Current Level", value: "2.8", accent: false },
                    { label: "Target Level", value: "4.0", accent: true },
                    { label: "Trend", value: "↑ Rising", accent: false },
                    { label: "Confidence", value: "Moderate", accent: false },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-muted/50 px-3 py-2.5 text-center">
                      <p className={`text-lg font-display font-bold ${item.accent ? "text-primary" : "text-foreground"}`}>{item.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight Panels */}
              <InsightBanner title="Plateau Detected">
                Your <span className="text-foreground font-medium">Evidence Evaluation</span> has plateaued over the last 4 sessions.
                Try a <span className="text-foreground font-medium">Challenge-focused</span> scenario to strengthen this skill.
              </InsightBanner>

              {showMasteryReadiness && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3"
                >
                  <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-primary font-medium text-[10px] uppercase tracking-wider block mb-0.5">Approaching Mastery</span>
                    You are approaching your mastery target in <span className="text-foreground font-medium">Stakeholder Communication</span>.
                    Try an integrated scenario to validate your capability.
                  </div>
                </motion.div>
              )}

              {/* Recommended Next */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                  <Lightbulb className="h-3 w-3 text-primary" /> Recommended Next
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: Shield, text: "Scenario: Conflicting Stakeholder Priorities", sub: "Challenge Mode" },
                    { icon: Target, text: "Challenge Mode: Evidence Evaluation", sub: "Strengthen weak dimension" },
                    { icon: BookOpen, text: "Reflect on: Feb 19 decision journal entry", sub: "Revisit flagged" },
                  ].map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(i === 2 ? "/journal" : "/arena-session")}
                      className="w-full text-left rounded-lg bg-muted/50 px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 group"
                    >
                      <rec.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors">{rec.text}</p>
                        <p className="text-[10px] text-muted-foreground">{rec.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* RIGHT: Mastery Journey Workspace */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Mandated Mastery */}
              {assignedJourneys.length > 0 && (
                <div>
                  <div className="mb-3">
                    <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Mandated Mastery
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">Capabilities required by your organization</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {assignedJourneys.map((journey, i) => (
                      <JourneyCard key={journey.id} journey={journey} index={i} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Self-Initiated Mastery */}
              <div>
                <div className="mb-3">
                  <h2 className="text-sm font-semibold text-card-foreground">Self-Initiated Mastery</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Capabilities you choose to develop on your own</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {personalJourneys.map((journey, i) => (
                    <JourneyCard key={journey.id} journey={journey} index={i} navigate={navigate} />
                  ))}

                  {/* Start New Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: personalJourneys.length * 0.06 }}
                    onClick={() => navigate("/")}
                    className="rounded-xl border border-dashed border-border bg-card/50 p-5 cursor-pointer transition-colors hover:border-primary/40 hover:bg-card flex flex-col items-center justify-center min-h-[140px]"
                  >
                    <Plus className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">Start New Mastery Journey</span>
                  </motion.div>
                </div>
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
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Sessions;
