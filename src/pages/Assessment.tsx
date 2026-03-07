import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  MessageSquare,
  Sparkles,
  Loader2,
  Eye,
  Lightbulb,
  Search,
  GitFork,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { useLearner } from "@/contexts/LearnerContext";

/* ── capability dimensions with icons ── */
const DIMENSIONS = [
  { key: "Clarity", icon: Eye, description: "How clearly you frame problems and articulate your thinking" },
  { key: "Think It Through", icon: Lightbulb, description: "How well you logically connect ideas and think through a problem before reaching a conclusion" },
  { key: "Show Your Work", icon: Search, description: "How you support your answers with steps, examples, facts, or logical justification" },
  { key: "Alternatives Exploration", icon: GitFork, description: "Your ability to consider multiple paths forward" },
  { key: "Learn From It", icon: RotateCcw, description: "How well you reconsider your reasoning, identify weaknesses, and improve after feedback" },
] as const;

type Dimension = (typeof DIMENSIONS)[number]["key"];

/* ── step definitions ── */
type Step =
  | { kind: "intro" }
  | { kind: "scenario" }
  | { kind: "followup"; index: number }
  | { kind: "evaluating" }
  | { kind: "complete" };

const FOLLOWUP_QUESTIONS = [
  {
    question: "What evidence or data would you look for to validate your approach?",
    probe: "Arena is exploring your evidence-gathering instincts",
    dimension: "Show Your Work",
  },
  {
    question: "What alternative approaches did you consider, and why did you set them aside?",
    probe: "Arena is examining how you weigh competing options",
    dimension: "Alternatives Exploration",
  },
  {
    question: "Looking back at your answer, what assumptions might you be making?",
    probe: "Arena is assessing your capacity for self-reflection",
    dimension: "Learn From It",
  },
];

/* ── mock scenario per topic ── */
function getScenarioData(topic: string): { title: string; context: string; task: string } {
  const scenarios: Record<string, { title: string; context: string; task: string }> = {
    Leadership: {
      title: "Cross-Functional Team Resistance",
      context: "You've just been promoted to lead a cross-functional team of 12. Two senior members openly resist your direction, citing their longer tenure. The team has a critical deliverable in 3 weeks.",
      task: "Describe how you would approach the first week — including how you'd address the resistance, align the team, and protect the deliverable timeline.",
    },
    "Strategic Leadership": {
      title: "Cross-Functional Team Resistance",
      context: "You've just been promoted to lead a cross-functional team of 12. Two senior members openly resist your direction, citing their longer tenure. The team has a critical deliverable in 3 weeks.",
      task: "Describe how you would approach the first week — including how you'd address the resistance, align the team, and protect the deliverable timeline.",
    },
    "Algebra Foundations": {
      title: "Word Problem Translation Under Pressure",
      context: "In a timed assessment, you consistently miss points because you translate word problems into incorrect equations even when your algebra steps are accurate.",
      task: "Explain your exact process for identifying variables, building relationships, and checking if your equation truly represents the problem.",
    },
    "Calculus I Mastery": {
      title: "Optimization Setup Breakdown",
      context: "You can differentiate correctly, but lose marks because your optimization setup is incomplete or uses the wrong constraint equation.",
      task: "Walk through how you would structure an optimization problem before calculating derivatives so your model is valid.",
    },
    "Insurance Sales Mastery": {
      title: "Price Objection on a Live Call",
      context: "A client says your premium is too expensive and compares it to a lower-priced competitor. You need to keep trust while reframing the value.",
      task: "Describe how you would respond from opening acknowledgment to final recommendation, including how you'd use evidence and alternatives.",
    },
    "Product Management": {
      title: "Declining Core Metric",
      context: "Your product's core metric has declined 15% over the past quarter despite shipping several new features. The CEO wants answers by Friday. Your team is demoralized and pointing fingers at each other.",
      task: "Walk through how you'd diagnose the root cause, communicate with the CEO, and chart a path forward.",
    },
    "AI Strategy": {
      title: "Board AI Strategy Mandate",
      context: "Your company's board wants an AI strategy within 60 days. Engineering says they need 6 months to build anything meaningful. Competitors are already shipping AI features. Budget is constrained.",
      task: "How do you navigate competing timelines, set realistic expectations, and create an actionable strategy?",
    },
    Communication: {
      title: "Delivering Difficult News",
      context: "You need to present a recommendation to cut a popular but under-performing product line to a room of stakeholders who built it. Some have spent 3+ years on this product.",
      task: "How do you structure and deliver this message while maintaining trust and alignment?",
    },
    "Decision Making": {
      title: "High-Stakes Hiring Decision",
      context: "You have two equally compelling candidates for a critical hire. One has deep domain expertise but limited leadership experience; the other is a proven leader but from a different industry.",
      task: "Walk through your decision-making process. What factors do you weigh, and how do you arrive at a final choice?",
    },
  };
  return scenarios[topic] || {
    title: "Complex Stakeholder Challenge",
    context: "Your organization faces a complex challenge requiring cross-functional collaboration. Multiple stakeholders have conflicting priorities, and you have limited data to guide the decision. A recommendation is needed within the week.",
    task: "Describe how you would approach this situation from start to finish — including how you gather information, align stakeholders, and make your recommendation.",
  };
}

/* ── mock evaluation ── */
function evaluateResponses(
  _answers: string[]
): Record<Dimension, { score: number; label: string }> {
  const seed = _answers.reduce((a, b) => a + b.length, 0);
  const raw: Record<string, number> = {
    Clarity: 2.2 + (seed % 15) / 10,
    "Think It Through": 1.8 + (seed % 12) / 10,
    "Show Your Work": 1.5 + (seed % 10) / 10,
    "Alternatives Exploration": 2.0 + (seed % 13) / 10,
    "Learn From It": 1.6 + (seed % 11) / 10,
  };
  const result: Record<string, { score: number; label: string }> = {};
  for (const [k, v] of Object.entries(raw)) {
    const score = Math.round(v * 10) / 10;
    result[k] = { score, label: score >= 3.5 ? "Strong" : score >= 2.5 ? "Developing" : "Emerging" };
  }
  return result as Record<Dimension, { score: number; label: string }>;
}

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProgram } = useLearner();
  const { intent, type } = (location.state as { intent?: string; type?: string }) || {};
  const topic = activeProgram.name || intent || "Leadership";

  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [scenarioAnswer, setScenarioAnswer] = useState("");
  const [followupAnswers, setFollowupAnswers] = useState<string[]>(["", "", ""]);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalDimIndex, setEvalDimIndex] = useState(-1);

  const totalSteps = 1 + 1 + FOLLOWUP_QUESTIONS.length + 1;
  const currentStepNum =
    step.kind === "intro" ? 1
      : step.kind === "scenario" ? 2
        : step.kind === "followup" ? 3 + step.index
          : totalSteps;
  const progress = (currentStepNum / totalSteps) * 100;

  const scenario = getScenarioData(topic);

  const handleFollowupChange = useCallback(
    (index: number, value: string) => {
      setFollowupAnswers((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    []
  );

  const handleEvaluate = () => {
    setStep({ kind: "evaluating" });
    setEvalProgress(0);
    setEvalDimIndex(-1);
  };

  // Animate evaluation progress
  useEffect(() => {
    if (step.kind !== "evaluating") return;
    const interval = setInterval(() => {
      setEvalProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [step.kind]);

  // Reveal dimensions one by one during eval
  useEffect(() => {
    if (step.kind !== "evaluating") return;
    const dimTimers = DIMENSIONS.map((_, i) =>
      setTimeout(() => setEvalDimIndex(i), 800 + i * 500)
    );
    const navTimer = setTimeout(() => {
      const allAnswers = [scenarioAnswer, ...followupAnswers];
      const scores = evaluateResponses(allAnswers);
      navigate("/starting-point", { state: { scores, topic, intent } });
    }, 800 + DIMENSIONS.length * 500 + 800);
    return () => {
      dimTimers.forEach(clearTimeout);
      clearTimeout(navTimer);
    };
  }, [step.kind, scenarioAnswer, followupAnswers, navigate, topic, intent]);

  const canProceed = () => {
    if (step.kind === "scenario") return scenarioAnswer.trim().length > 20;
    if (step.kind === "followup") return followupAnswers[step.index]?.trim().length > 10;
    return true;
  };

  const goNext = () => {
    if (step.kind === "intro") setStep({ kind: "scenario" });
    else if (step.kind === "scenario") setStep({ kind: "followup", index: 0 });
    else if (step.kind === "followup" && step.index < FOLLOWUP_QUESTIONS.length - 1)
      setStep({ kind: "followup", index: step.index + 1 });
    else handleEvaluate();
  };

  const goBack = () => {
    if (step.kind === "scenario") setStep({ kind: "intro" });
    else if (step.kind === "followup" && step.index === 0) setStep({ kind: "scenario" });
    else if (step.kind === "followup") setStep({ kind: "followup", index: step.index - 1 });
  };

  return (
    <Layout pageTitle="Baseline Assessment">
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* Progress bar — hidden during eval */}
        {step.kind !== "evaluating" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {step.kind === "intro" ? "Introduction" : step.kind === "scenario" ? "Scenario Response" : `Follow-up ${(step as any).index + 1} of ${FOLLOWUP_QUESTIONS.length}`}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {topic} · Step {currentStepNum} of {totalSteps}
              </p>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── INTRO ── */}
          {step.kind === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="py-6"
            >
              {/* Hero */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
                >
                  <Brain className="h-7 w-7 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  Understanding Your Starting Point
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Before practice begins, Arena will explore how you currently approach situations related to{" "}
                  <span className="text-foreground font-semibold">{topic}</span>.
                  There are no right or wrong answers.
                </p>
              </div>

              {/* What to expect */}
              <div className="rounded-xl border border-border bg-card p-5 mb-6">
                <h3 className="text-xs font-semibold text-card-foreground uppercase tracking-wider mb-4">What to expect</h3>
                <div className="space-y-3">
                  {[
                    { num: "1", text: "You'll respond to a realistic scenario" },
                    { num: "2", text: "Arena will ask Socratic follow-up questions" },
                    { num: "3", text: "Your responses will be evaluated across five dimensions" },
                  ].map((item) => (
                    <div key={item.num} className="flex items-start gap-3">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                        {item.num}
                      </span>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimension preview */}
              <div className="rounded-xl border border-dashed border-border bg-surface/50 p-5 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs font-semibold text-card-foreground uppercase tracking-wider">Capability Dimensions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DIMENSIONS.map((dim, i) => (
                    <motion.div
                      key={dim.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card/80"
                    >
                      <dim.icon className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-card-foreground">{dim.key}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug">{dim.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button onClick={goNext} className="w-full">
                Begin Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* ── SCENARIO ── */}
          {step.kind === "scenario" && (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {/* Scenario card — styled like Arena session context panel */}
              <div className="rounded-xl border border-border bg-card p-5 mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Scenario</p>
                <h2 className="text-base font-display font-bold text-card-foreground mb-3">
                  {scenario.title}
                </h2>
                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Context</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {scenario.context}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Your Task</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {scenario.task}
                  </p>
                </div>
              </div>

              {/* Response area */}
              <div className="relative">
                <Textarea
                  value={scenarioAnswer}
                  onChange={(e) => setScenarioAnswer(e.target.value)}
                  placeholder="Describe your full approach — take your time, there's no word limit…"
                  className="min-h-[200px] resize-none bg-card border-border text-sm"
                />
                {scenarioAnswer.length > 0 && (
                  <p className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">
                    {scenarioAnswer.split(/\s+/).filter(Boolean).length} words
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── FOLLOW-UP QUESTIONS ── */}
          {step.kind === "followup" && (
            <motion.div
              key={`followup-${step.index}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {/* Conversational probe header */}
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-1">
                      Arena is probing deeper
                    </p>
                    <p className="text-[10px] text-muted-foreground italic">
                      {FOLLOWUP_QUESTIONS[step.index].probe}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-lg font-display font-semibold text-foreground mb-2 leading-relaxed">
                {FOLLOWUP_QUESTIONS[step.index].question}
              </h2>
              <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50" />
                Evaluating: <span className="text-foreground font-medium">{FOLLOWUP_QUESTIONS[step.index].dimension}</span>
              </p>

              <div className="relative">
                <Textarea
                  value={followupAnswers[step.index]}
                  onChange={(e) => handleFollowupChange(step.index, e.target.value)}
                  placeholder="Share your thinking…"
                  className="min-h-[160px] resize-none bg-card border-border text-sm"
                />
                {followupAnswers[step.index]?.length > 0 && (
                  <p className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">
                    {followupAnswers[step.index].split(/\s+/).filter(Boolean).length} words
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── EVALUATING ── */}
          {step.kind === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="py-12"
            >
              <div className="text-center mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary flex items-center justify-center mx-auto mb-5"
                >
                  <Brain className="h-5 w-5 text-primary" />
                </motion.div>
                <h2 className="text-xl font-display font-bold text-foreground mb-1">
                  Analyzing Your Thinking
                </h2>
                <p className="text-sm text-muted-foreground">
                  Evaluating {topic} responses across capability dimensions
                </p>
              </div>

              {/* Dimension-by-dimension reveal */}
              <div className="max-w-sm mx-auto space-y-3">
                {DIMENSIONS.map((dim, i) => (
                  <motion.div
                    key={dim.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={evalDimIndex >= i ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card"
                  >
                    <dim.icon className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${evalDimIndex >= i ? "text-primary" : "text-muted-foreground/40"}`} />
                    <span className={`text-sm font-medium flex-1 transition-colors duration-300 ${evalDimIndex >= i ? "text-card-foreground" : "text-muted-foreground/40"}`}>
                      {dim.key}
                    </span>
                    {evalDimIndex >= i && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="max-w-sm mx-auto mt-8">
                <Progress value={evalProgress} className="h-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── NAV ── */}
        {step.kind !== "intro" && step.kind !== "evaluating" && step.kind !== "complete" && (
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={goBack} size="sm">
              <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back
            </Button>
            <Button onClick={goNext} disabled={!canProceed()} size="sm">
              {step.kind === "followup" && step.index === FOLLOWUP_QUESTIONS.length - 1
                ? "Evaluate My Responses"
                : "Continue"}
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assessment;
