import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  AlertTriangle,
  Shield,
  Building2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { InsightBanner } from "@/components/InsightBanner";

const subjects = [
  "Leadership", "Product Management", "AI Strategy", "Data Analysis",
  "Communication", "Negotiation", "Decision Making",
];

const exampleObjectives = [
  "Lead distributed teams", "Make data-driven decisions",
  "Resolve stakeholder conflicts", "Present strategy effectively",
];

const assignedJourneys = [
  { id: "a1", name: "Strategic Decision Making for Senior Leaders", domain: "Leadership", currentLevel: 1.6, targetLevel: 4.0, progress: 18, focusArea: "Evidence-based reasoning", assignedBy: "Nexus Studio" },
  { id: "a2", name: "Cross-Functional Stakeholder Alignment", domain: "Communication", currentLevel: 2.0, targetLevel: 3.5, progress: 35, focusArea: "Influence without authority", assignedBy: "Nexus Studio" },
];

const personalJourneys = [
  { id: "1", name: "Strategic Leadership", domain: "Leadership", currentLevel: 3.1, targetLevel: 4.0, progress: 62 },
  { id: "2", name: "Evidence-Based Decision Making", domain: "Decision Making", currentLevel: 2.4, targetLevel: 3.5, progress: 38 },
  { id: "3", name: "Stakeholder Communication", domain: "Communication", currentLevel: 1.8, targetLevel: 3.0, progress: 22 },
];

const hasAssigned = assignedJourneys.length > 0;

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

const JourneyCard = ({ journey, onClick, showFocus }: { journey: any; onClick: () => void; showFocus?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    className="rounded-xl border border-border bg-card p-5 cursor-pointer transition-colors hover:border-primary/40 hover:shadow-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="min-w-0 mr-3">
        <h3 className="text-sm font-semibold text-card-foreground font-display leading-snug truncate">{journey.name}</h3>
        <span className="text-xs text-muted-foreground">{journey.domain}</span>
      </div>
      <CircularBadge progress={journey.progress} />
    </div>
    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
      <span>Lvl <strong className="text-card-foreground">{journey.currentLevel}</strong></span>
      <span>→</span>
      <span>Target <strong className="text-primary">{journey.targetLevel}</strong></span>
    </div>
    {showFocus && journey.focusArea && (
      <p className="text-xs text-muted-foreground">Focus: <span className="text-card-foreground">{journey.focusArea}</span></p>
    )}
  </motion.div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [objective, setObjective] = useState("");
  const [subject, setSubject] = useState("");
  const [specificChoice, setSpecificChoice] = useState<"general" | "specific" | null>(null);
  const [specificText, setSpecificText] = useState("");

  const handleObjectiveContinue = () => {
    if (objective.trim()) {
      navigate("/intent", { state: { intent: objective, type: "objective" } });
    }
  };

  const handleSubjectContinue = () => {
    const intent = specificChoice === "specific" && specificText.trim()
      ? `${subject}: ${specificText}`
      : `General mastery in ${subject}`;
    navigate("/intent", { state: { intent, type: "subject" } });
  };

  return (
    <Layout pageTitle="Dashboard">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* AI Insight Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InsightBanner title="Plateau Detected" className="h-full">
              <div className="flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                <span>
                  Your <span className="text-foreground font-medium">Evidence Use</span> capability
                  hasn't improved in 3 sessions. Consider a challenge-mode scenario to break through.
                </span>
              </div>
            </InsightBanner>
            <InsightBanner title="Improvement Trend" className="h-full">
              <div className="flex items-start gap-1">
                <TrendingUp className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                <span>
                  <span className="text-foreground font-medium">Clarity</span> improved 12% over the
                  last 2 weeks. You're approaching Level 3 mastery in Strategic Leadership.
                </span>
              </div>
            </InsightBanner>
          </div>

          {/* Recommended Next Action */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" /> Recommended Next Action
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground mb-0.5">
                  Scenario: Conflicting Stakeholder Priorities
                </p>
                <p className="text-xs text-muted-foreground">
                  Challenge Mode · ~20 min · Targets Evidence Use
                </p>
              </div>
              <Button size="sm" onClick={() => navigate("/arena-session")}>
                <Shield className="mr-1.5 h-3.5 w-3.5" /> Start
              </Button>
            </div>
          </div>

          {/* Assigned Mastery — primary section */}
          {hasAssigned && (
            <div className="mb-6">
              <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                <Building2 className="h-3 w-3" /> Assigned Mastery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedJourneys.map((j) => (
                  <JourneyCard key={j.id} journey={j} onClick={() => navigate("/dashboard")} showFocus />
                ))}
              </div>
            </div>
          )}

          {/* Your Personal Mastery */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                Your Personal Mastery
              </h2>
              <button
                onClick={() => navigate("/sessions")}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalJourneys.map((j) => (
                <JourneyCard key={j.id} journey={j} onClick={() => navigate("/dashboard")} />
              ))}
            </div>
          </div>

          {/* Start New Mastery — only if no assigned journeys */}
          {!hasAssigned && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6">
              <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" /> What Would You Like to Master?
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Set an objective or explore a subject area.
              </p>

              <Tabs defaultValue="objective" className="w-full">
                <TabsList className="mb-6 bg-surface">
                  <TabsTrigger value="objective" className="data-[state=active]:bg-card">Objective</TabsTrigger>
                  <TabsTrigger value="subject" className="data-[state=active]:bg-card">Subject</TabsTrigger>
                </TabsList>

                <TabsContent value="objective">
                  <div className="space-y-4">
                    <Textarea
                      value={objective} onChange={(e) => setObjective(e.target.value)}
                      placeholder="e.g., Lead distributed teams effectively..."
                      className="min-h-[80px] resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex flex-wrap gap-2">
                      {exampleObjectives.map((ex) => (
                        <button key={ex} onClick={() => setObjective(ex)}
                          className="text-xs px-3 py-1.5 rounded-full bg-surface text-surface-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                        >{ex}</button>
                      ))}
                    </div>
                    <Button onClick={handleObjectiveContinue} disabled={!objective.trim()} className="w-full">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="subject">
                  <div className="space-y-4">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="bg-card"><SelectValue placeholder="Choose a subject area" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    {subject && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <p className="text-sm text-muted-foreground">Would you like to master something specific?</p>
                        <div className="flex gap-3">
                          <button onClick={() => setSpecificChoice("general")}
                            className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${specificChoice === "general" ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card text-card-foreground hover:bg-surface"}`}
                          >General mastery</button>
                          <button onClick={() => setSpecificChoice("specific")}
                            className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${specificChoice === "specific" ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card text-card-foreground hover:bg-surface"}`}
                          >Something specific</button>
                        </div>
                        {specificChoice === "specific" && (
                          <Textarea value={specificText} onChange={(e) => setSpecificText(e.target.value)}
                            placeholder="Describe what you'd like to focus on..." className="min-h-[80px] resize-none bg-card" />
                        )}
                        <Button onClick={handleSubjectContinue}
                          disabled={!specificChoice || (specificChoice === "specific" && !specificText.trim())} className="w-full">
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Compact "Start New" link when assigned journeys exist */}
          {hasAssigned && (
            <div
              onClick={() => navigate("/sessions")}
              className="rounded-xl border border-dashed border-border bg-card/50 p-4 cursor-pointer transition-colors hover:border-primary/40 hover:bg-card flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Start New Mastery Journey</span>
            </div>
          )}

        </motion.div>
      </div>
    </Layout>
  );
};

export default HomePage;
