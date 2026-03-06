import { useState, useCallback } from "react";
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
} from "lucide-react";
import { Layout } from "@/components/Layout";

/* ── capability dimensions ── */
const DIMENSIONS = [
  "Clarity",
  "Reasoning",
  "Evidence Use",
  "Alternatives Exploration",
  "Reflection",
] as const;

type Dimension = (typeof DIMENSIONS)[number];

/* ── step definitions ── */
type Step =
  | { kind: "intro" }
  | { kind: "scenario" }
  | { kind: "followup"; index: number }
  | { kind: "evaluating" }
  | { kind: "complete" };

const FOLLOWUP_QUESTIONS = [
  "What evidence or data would you look for to validate your approach?",
  "What alternative approaches did you consider, and why did you set them aside?",
  "Looking back at your answer, what assumptions might you be making?",
];

/* ── mock scenario per topic ── */
function getScenario(topic: string): string {
  const scenarios: Record<string, string> = {
    Leadership:
      "You've just been promoted to lead a cross-functional team of 12. Two senior members openly resist your direction, citing their longer tenure. The team has a critical deliverable in 3 weeks. How do you approach the first week?",
    "Product Management":
      "Your product's core metric has declined 15% over the past quarter despite shipping several new features. The CEO wants answers by Friday. Walk through how you'd diagnose and respond to this situation.",
    "AI Strategy":
      "Your company's board wants an AI strategy within 60 days. Engineering says they need 6 months to build anything meaningful. Competitors are already shipping AI features. How do you navigate this?",
    Communication:
      "You need to present a recommendation to cut a popular but under-performing product line to a room of stakeholders who built it. How do you structure and deliver this message?",
    "Decision Making":
      "You have two equally compelling candidates for a critical hire. One has deep domain expertise but limited leadership experience; the other is a proven leader but from a different industry. How do you decide?",
  };
  return (
    scenarios[topic] ||
    "Your organization faces a complex challenge requiring cross-functional collaboration. Multiple stakeholders have conflicting priorities, and you have limited data to guide the decision. A recommendation is needed within the week. Describe how you would approach this situation from start to finish."
  );
}

/* ── mock evaluation (would be AI-powered in production) ── */
function evaluateResponses(
  _answers: string[]
): Record<Dimension, { score: number; label: string }> {
  const labels = (s: number) =>
    s >= 3.5 ? "Strong" : s >= 2.5 ? "Developing" : "Emerging";
  // Deterministic mock based on answer lengths for demo
  const seed = _answers.reduce((a, b) => a + b.length, 0);
  return {
    Clarity: { score: 2.2 + (seed % 15) / 10, label: "" },
    Reasoning: { score: 1.8 + (seed % 12) / 10, label: "" },
    "Evidence Use": { score: 1.5 + (seed % 10) / 10, label: "" },
    "Alternatives Exploration": { score: 2.0 + (seed % 13) / 10, label: "" },
    Reflection: { score: 1.6 + (seed % 11) / 10, label: "" },
  } as Record<Dimension, { score: number; label: string }>;
}

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { intent, type } = (location.state as { intent?: string; type?: string }) || {};
  const topic = intent || "Leadership";

  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [scenarioAnswer, setScenarioAnswer] = useState("");
  const [followupAnswers, setFollowupAnswers] = useState<string[]>(["", "", ""]);

  const totalSteps = 1 + 1 + FOLLOWUP_QUESTIONS.length + 1; // intro, scenario, followups, eval
  const currentStepNum =
    step.kind === "intro"
      ? 1
      : step.kind === "scenario"
        ? 2
        : step.kind === "followup"
          ? 3 + step.index
          : step.kind === "evaluating"
            ? totalSteps
            : totalSteps;
  const progress = (currentStepNum / totalSteps) * 100;

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
    // Simulate evaluation delay
    setTimeout(() => {
      const allAnswers = [scenarioAnswer, ...followupAnswers];
      const scores = evaluateResponses(allAnswers);
      // Fix labels
      Object.values(scores).forEach((s) => {
        s.score = Math.round(s.score * 10) / 10;
        s.label = s.score >= 3.5 ? "Strong" : s.score >= 2.5 ? "Developing" : "Emerging";
      });
      navigate("/starting-point", {
        state: { scores, topic, intent },
      });
    }, 2500);
  };

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
        {step.kind !== "evaluating" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">
                Step {currentStepNum} of {totalSteps}
              </p>
              <p className="text-xs text-muted-foreground">~10 min</p>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── INTRO ── */}
          {step.kind === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
                <Brain className="h-6 w-6 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-3">
                Understanding Your Starting Point
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-3">
                Before we begin practice, Arena will explore how you currently
                approach situations related to{" "}
                <span className="text-foreground font-medium">{topic}</span>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">
                You'll respond to a realistic scenario, then answer a few
                follow-up questions. There are no right or wrong answers — we're
                mapping your natural thinking patterns.
              </p>
              <div className="rounded-xl border border-border bg-card p-4 max-w-sm mx-auto mb-8">
                <div className="flex items-start gap-3 text-left">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We'll evaluate your responses across five capability
                    dimensions: Clarity, Reasoning, Evidence Use, Alternatives
                    Exploration, and Reflection.
                  </p>
                </div>
              </div>
              <Button onClick={goNext} className="w-full max-w-sm">
                Begin Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* ── SCENARIO ── */}
          {step.kind === "scenario" && (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 px-2.5 py-1 rounded-full bg-accent">
                Scenario
              </span>
              <h2 className="text-lg font-display font-semibold text-foreground mb-2 leading-relaxed">
                {getScenario(topic)}
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Take your time. Describe your full approach — there's no word
                limit.
              </p>
              <Textarea
                value={scenarioAnswer}
                onChange={(e) => setScenarioAnswer(e.target.value)}
                placeholder="Describe how you would approach this situation…"
                className="min-h-[180px] resize-none bg-card border-border"
              />
            </motion.div>
          )}

          {/* ── FOLLOW-UP QUESTIONS ── */}
          {step.kind === "followup" && (
            <motion.div
              key={`followup-${step.index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary mb-2 px-2.5 py-1 rounded-full bg-accent">
                <MessageSquare className="inline h-3 w-3 mr-1 -mt-0.5" />
                Follow-up {step.index + 1} of {FOLLOWUP_QUESTIONS.length}
              </span>
              <h2 className="text-lg font-display font-semibold text-foreground mb-2 leading-relaxed">
                {FOLLOWUP_QUESTIONS[step.index]}
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Dig deeper into your reasoning.
              </p>
              <Textarea
                value={followupAnswers[step.index]}
                onChange={(e) => handleFollowupChange(step.index, e.target.value)}
                placeholder="Share your thinking…"
                className="min-h-[140px] resize-none bg-card border-border"
              />
            </motion.div>
          )}

          {/* ── EVALUATING ── */}
          {step.kind === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-display font-semibold text-foreground mb-2">
                Evaluating Your Responses
              </h2>
              <p className="text-sm text-muted-foreground">
                Analyzing across five capability dimensions…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── NAV ── */}
        {step.kind !== "intro" && step.kind !== "evaluating" && step.kind !== "complete" && (
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={goNext} disabled={!canProceed()}>
              {step.kind === "followup" && step.index === FOLLOWUP_QUESTIONS.length - 1
                ? "Evaluate My Responses"
                : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assessment;
