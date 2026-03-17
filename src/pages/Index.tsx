import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  Zap,
  Building2,
  Plus,
  Sparkles,
  ChevronDown,
  TrendingUp,
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
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { Onboarding } from "@/components/Onboarding";
import { useLearner } from "@/contexts/LearnerContext";
import { humanLevel, humanProgress, humanStatus } from "@/lib/humanize";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const subjects = [
  "Leadership", "Product Management", "AI Strategy", "Data Analysis",
  "Communication", "Negotiation", "Decision Making",
];

const exampleObjectives = [
  "Lead distributed teams", "Make data-driven decisions",
  "Resolve stakeholder conflicts", "Present strategy effectively",
];

interface DashboardData {
  insight: { label: string; text: string };
  secondaryInsight: string;
  recommended: { title: string; subtitle: string; link: string; description: string };
  mandated: { id: string; name: string; domain: string; currentLevel: number; targetLevel: number; progress: number; focusArea: string; program: string }[];
  selfInitiated: { id: string; name: string; domain: string; currentLevel: number; targetLevel: number; progress: number }[];
  focusAreas: { name: string; tip: string; link: string }[];
}

const dashboardByProgram: Record<string, DashboardData> = {
  "p1": {
    insight: { label: "Show Your Work", text: "Your Show Your Work capability has plateaued for the last three sessions. Try a challenge scenario to break through." },
    secondaryInsight: "Your clarity has been improving steadily. Keep it up!",
    recommended: { title: "Resolving Conflicting Stakeholder Priorities", subtitle: "~20 min practice session", description: "Practice navigating competing demands and making a clear recommendation.", link: "/arena-session" },
    mandated: [
      { id: "a1", name: "Strategic Decision Making for Senior Leaders", domain: "Leadership", currentLevel: 1.6, targetLevel: 4.0, progress: 18, focusArea: "Evidence-based reasoning", program: "Leadership Development" },
      { id: "a2", name: "Cross-Functional Stakeholder Alignment", domain: "Communication", currentLevel: 2.0, targetLevel: 3.5, progress: 35, focusArea: "Influence without authority", program: "Leadership Development" },
    ],
    selfInitiated: [
      { id: "1", name: "Strategic Leadership", domain: "Leadership", currentLevel: 3.1, targetLevel: 4.0, progress: 62 },
      { id: "2", name: "Evidence-Based Decision Making", domain: "Decision Making", currentLevel: 2.4, targetLevel: 3.5, progress: 38 },
      { id: "3", name: "Stakeholder Communication", domain: "Communication", currentLevel: 1.8, targetLevel: 3.0, progress: 22 },
    ],
    focusAreas: [
      { name: "Show Your Work", tip: "Needs practice — try a scenario focused on this", link: "/arena-session" },
      { name: "Think It Through", tip: "Building up — a few more rounds will help", link: "/arena-session" },
      { name: "Alternatives", tip: "Needs work — try exploring different approaches", link: "/arena-session" },
    ],
  },
  "p-algebra": {
    insight: { label: "Word Problem Translation", text: "Your Word Problem Translation is declining. Practice converting real-world scenarios into algebraic equations." },
    secondaryInsight: "Pattern Recognition is going well — nice work building that foundation.",
    recommended: { title: "Word Problem Reasoning Scenario", subtitle: "~15 min practice", description: "Practice translating real-world scenarios into the right equations.", link: "/arena/session/word-problem-scenario" },
    mandated: [
      { id: "alg-m1", name: "Build Equation Solving Foundations", domain: "Algebra", currentLevel: 2.0, targetLevel: 4.0, progress: 30, focusArea: "Linear equations", program: "Math Department" },
    ],
    selfInitiated: [
      { id: "alg-1", name: "Master Word Problem Translation", domain: "Communication", currentLevel: 1.5, targetLevel: 4.0, progress: 25 },
      { id: "alg-2", name: "Recognize and Extend Patterns", domain: "Pattern Recognition", currentLevel: 2.5, targetLevel: 4.0, progress: 50 },
    ],
    focusAreas: [
      { name: "Word Problems", tip: "Needs work — try breaking down the scenario first", link: "/arena/session/word-problem-scenario" },
      { name: "Equation Setup", tip: "Needs practice — focus on identifying unknowns", link: "/arena/session/setup-lab" },
      { name: "Multi-Step Equations", tip: "Just starting — take it one step at a time", link: "/arena/session/multi-step-practice" },
    ],
  },
  "p-calculus": {
    insight: { label: "Chain Rule", text: "Your Chain Rule Application is a critical gap. Focus on composite function differentiation this week." },
    secondaryInsight: "Limit Reasoning is going well. Build on that foundation.",
    recommended: { title: "Chain Rule Scenario", subtitle: "~20 min practice", description: "Work through composite function problems with coaching support.", link: "/arena/session/chain-rule-scenario" },
    mandated: [
      { id: "calc-m1", name: "Master Derivative Techniques", domain: "Calculus", currentLevel: 1.5, targetLevel: 4.0, progress: 20, focusArea: "Chain rule and implicit differentiation", program: "Professor Chen" },
    ],
    selfInitiated: [
      { id: "calc-1", name: "Solve Optimization Problems", domain: "Applications", currentLevel: 1.2, targetLevel: 4.0, progress: 15 },
      { id: "calc-2", name: "Interpret Graphs Using Calculus", domain: "Analysis", currentLevel: 2.0, targetLevel: 3.5, progress: 45 },
    ],
    focusAreas: [
      { name: "Chain Rule", tip: "Needs work — practice with nested functions", link: "/arena/session/chain-rule-scenario" },
      { name: "Optimization", tip: "Just starting — focus on setting up constraints first", link: "/arena/session/optimization-challenge" },
      { name: "Related Rates", tip: "Needs practice — try the simulation", link: "/arena/session/related-rates-sim" },
    ],
  },
  "p-insurance": {
    insight: { label: "Price Objection Handling", text: "Your Handling Price Objections is a critical gap. Practice reframing cost concerns with empathy and evidence." },
    secondaryInsight: "Ethical communication is your strongest area. Use that trust-building strength in objection scenarios.",
    recommended: { title: "Customer Objection Simulation", subtitle: "~20 min practice", description: "Practice responding to price objections with empathy-first framing.", link: "/arena/session/customer-objection-sim" },
    mandated: [
      { id: "ins-m1", name: "Handle Customer Objections Effectively", domain: "Sales", currentLevel: 1.4, targetLevel: 4.0, progress: 18, focusArea: "Price objection reframing", program: "Sales Director" },
      { id: "ins-m2", name: "Regulatory Compliance in Sales", domain: "Compliance", currentLevel: 2.6, targetLevel: 4.0, progress: 42, focusArea: "Disclosure requirements", program: "Compliance Team" },
    ],
    selfInitiated: [
      { id: "ins-1", name: "Communicate Risk Effectively", domain: "Communication", currentLevel: 1.6, targetLevel: 3.5, progress: 30 },
      { id: "ins-2", name: "Structure Policies for Client Needs", domain: "Product Knowledge", currentLevel: 2.2, targetLevel: 4.0, progress: 38 },
    ],
    focusAreas: [
      { name: "Price Objections", tip: "Needs work — practice reframing cost as value", link: "/arena/session/customer-objection-sim" },
      { name: "Risk Communication", tip: "Building up — try a client scenario", link: "/arena/session/compliance-risk-scenario" },
      { name: "Coverage Gaps", tip: "Needs practice — spot the gaps before the client does", link: "/arena/session/gap-analysis-scenario" },
    ],
  },
};

const SimpleBar = ({ progress }: { progress: number }) => (
  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden flex-shrink-0">
    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { activeProgram, activeLearner, hasCompletedSession } = useLearner();
  const [showDetails, setShowDetails] = useState(false);
  const [objective, setObjective] = useState("");
  const [subject, setSubject] = useState("");
  const [specificChoice, setSpecificChoice] = useState<"general" | "specific" | null>(null);
  const [specificText, setSpecificText] = useState("");

  // Show onboarding for first-time users
  if (!hasCompletedSession) {
    return <Onboarding />;
  }

  const data = dashboardByProgram[activeProgram.id] || dashboardByProgram["p1"];
  const hasMandated = data.mandated.length > 0;

  const handleObjectiveContinue = () => {
    if (objective.trim()) navigate("/intent", { state: { intent: objective, type: "objective" } });
  };

  const handleSubjectContinue = () => {
    const intent = specificChoice === "specific" && specificText.trim()
      ? `${subject}: ${specificText}`
      : `General mastery in ${subject}`;
    navigate("/intent", { state: { intent, type: "subject" } });
  };

  // Calculate overall progress
  const allJourneys = [...data.mandated, ...data.selfInitiated];
  const avgProgress = allJourneys.length > 0
    ? Math.round(allJourneys.reduce((s, j) => s + j.progress, 0) / allJourneys.length)
    : 0;

  return (
    <Layout pageTitle="Dashboard">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} key={activeProgram.id} className="space-y-5">

          {/* Hero CTA — Continue Your Journey */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Continue Your Journey</p>
            <h2 className="text-lg font-display font-bold text-card-foreground mb-1">{data.recommended.title}</h2>
            <p className="text-sm text-muted-foreground mb-1">{data.recommended.description}</p>
            <p className="text-xs text-muted-foreground mb-4">{data.recommended.subtitle}</p>
            <Button onClick={() => navigate(data.recommended.link)} size="lg">
              <Zap className="mr-2 h-4 w-4" /> Start Session
            </Button>
          </motion.div>

          {/* Simple Progress */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-card-foreground">Your overall progress</p>
              <span className="text-xs text-primary font-medium">{humanLevel(avgProgress / 100 * 4 + 1)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${avgProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Coaching Insight */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground leading-relaxed">{data.insight.text}</p>
                <p className="text-xs text-muted-foreground mt-2">{data.secondaryInsight}</p>
              </div>
            </div>
          </motion.div>

          {/* What to Work On — 3 small cards */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
              What to work on
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.focusAreas.map((area) => (
                <button
                  key={area.name}
                  onClick={() => navigate(area.link)}
                  className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <p className="text-sm font-medium text-card-foreground mb-1">{area.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{area.tip}</p>
                </button>
              ))}
            </div>
          </div>

          {/* See More Details — collapsible */}
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              {showDetails ? "Hide details" : "See more details"}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-5 pt-2">
                {/* Mandated Mastery */}
                {hasMandated && (
                  <div>
                    <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Required by your organization
                    </h3>
                    <div className="space-y-2">
                      {data.mandated.map((j) => (
                        <div
                          key={j.id}
                          onClick={() => navigate("/dashboard")}
                          className="rounded-lg border border-border border-l-4 border-l-primary bg-card px-4 py-3 cursor-pointer hover:shadow-sm transition-all flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-card-foreground truncate">{j.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{j.focusArea ? `Focus: ${j.focusArea}` : j.domain}</p>
                          </div>
                          <SimpleBar progress={j.progress} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Self-Initiated */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3" /> Your personal journeys
                  </h3>
                  <div className="space-y-3">
                    {data.selfInitiated.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => navigate("/dashboard")}
                        className="rounded-xl border border-border/60 bg-card/60 p-4 cursor-pointer hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-card-foreground">{j.name}</h4>
                            <p className="text-xs text-muted-foreground">{j.domain} · {humanLevel(j.currentLevel)}</p>
                          </div>
                          <CircularBadge progress={j.progress} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Start New Mastery */}
          {!hasMandated ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6">
              <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" /> What Would You Like to Master?
              </h2>
              <p className="text-xs text-muted-foreground mb-5">Set an objective or explore a subject area.</p>
              <Tabs defaultValue="objective" className="w-full">
                <TabsList className="mb-6 bg-surface">
                  <TabsTrigger value="objective" className="data-[state=active]:bg-card">Objective</TabsTrigger>
                  <TabsTrigger value="subject" className="data-[state=active]:bg-card">Subject</TabsTrigger>
                </TabsList>
                <TabsContent value="objective">
                  <div className="space-y-4">
                    <Textarea value={objective} onChange={(e) => setObjective(e.target.value)}
                      placeholder="e.g., Lead distributed teams effectively..."
                      className="min-h-[80px] resize-none bg-card border-border text-foreground placeholder:text-muted-foreground" />
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
          ) : (
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
