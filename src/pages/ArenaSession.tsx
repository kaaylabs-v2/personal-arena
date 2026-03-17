import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, PanelRight, X, Sparkles, HelpCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ArenaDebrief } from "@/components/ArenaDebrief";
import { ChatMessageItem, type ChatMessageData } from "@/components/arena/ChatMessage";
import type { ScoreDimensions, ReasoningScoreData } from "@/components/ReasoningScore";
import { useLearner } from "@/contexts/LearnerContext";
import { humanStagePill, humanStage } from "@/lib/humanize";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThinkingScaffold } from "@/components/ThinkingScaffold";

const scenariosByProgram: Record<string, {
  title: string;
  skillFocus: string;
  focusDimension: string;
  context: string;
  task: string;
  openingPrompt: string;
}> = {
  "p1": {
    title: "Distributed Team Communication",
    skillFocus: "Strategic Decision-Making",
    focusDimension: "Show Your Work",
    context: "You lead a product team of 12 people spread across 4 time zones. Your team has been missing sprint commitments for the last 3 cycles.",
    task: "Determine a communication strategy that improves delivery predictability without reducing team autonomy.",
    openingPrompt: "You've stated that distributed teams need more structured communication. Can you clarify what 'structured' means to you in practice?",
  },
  "p-algebra": {
    title: "Word Problem Translation Breakdown",
    skillFocus: "Algebraic Reasoning",
    focusDimension: "Equation Setup",
    context: "You're solving a word problem test and keep making setup errors before calculations even begin.",
    task: "Create a repeatable setup strategy for translating word problems into equations accurately.",
    openingPrompt: "Before solving anything, what exact steps will you use to identify knowns, unknowns, and relationships in a word problem?",
  },
  "p-calculus": {
    title: "Optimization Constraint Failure",
    skillFocus: "Derivative Application",
    focusDimension: "Optimization Problems",
    context: "In your last quiz, you lost marks because your optimization model and constraint equation were incomplete.",
    task: "Design a problem setup workflow that ensures constraints, objective function, and variable definitions are correct before differentiation.",
    openingPrompt: "When approaching an optimization problem, how do you decide what variable to optimize and what constraints to write first?",
  },
  "p-insurance": {
    title: "Price Objection Live Call",
    skillFocus: "Value Framing",
    focusDimension: "Handling Price Objections",
    context: "A client says your premium is too expensive and is considering a cheaper competitor.",
    task: "Respond with a value-focused structure that reframes price concerns and builds trust.",
    openingPrompt: "How would you open this objection response so the client feels heard before you present value?",
  },
};

const stageSequence = ["clarify", "challenge", "evidence", "alternative", "reflect"];

const arenaResponses: Record<string, {
  text: string;
  contextAwarePrefix?: string;
  insight?: string;
  coachingPrompts?: string[];
  scoreDelta?: { total: number; dimensions: Partial<ScoreDimensions> };
}> = {
  clarify: {
    text: "But couldn't too much structure stifle creative problem-solving in your team? How would you balance this?",
    contextAwarePrefix: "You've outlined your view on structured communication.",
    insight: "Good — you defined the problem with precision. That's a strong start.",
    coachingPrompts: ["What assumptions might you be making?", "What information could be missing?"],
    scoreDelta: { total: 5, dimensions: { clarity: 4, strategicFraming: 1 } },
  },
  challenge: {
    text: "You've defended your position well. Now, what concrete evidence from past sprints supports your communication approach?",
    contextAwarePrefix: "Earlier you suggested a specific communication cadence.",
    insight: "Nice — your reasoning is getting more nuanced. You're starting to see the trade-offs.",
    coachingPrompts: ["What would a critic say?", "What trade-offs haven't you considered?"],
    scoreDelta: { total: 6, dimensions: { tradeoffThinking: 3, clarity: 2, strategicFraming: 1 } },
  },
  evidence: {
    text: "Good data points. But is there an entirely different approach you haven't considered? What if the problem isn't communication at all?",
    contextAwarePrefix: "You referenced concrete sprint data to back your claim.",
    insight: "Strong evidence. Now consider whether the data supports alternative explanations too.",
    coachingPrompts: ["What data supports this?", "Are you relying on intuition or evidence?"],
    scoreDelta: { total: 4, dimensions: { evidenceUse: 3, clarity: 1 } },
  },
  alternative: {
    text: "You've explored multiple angles. Now step back — how has your thinking evolved since the start of this session?",
    contextAwarePrefix: "You identified a structural root cause that most people overlook.",
    insight: "Great alternative thinking. You're seeing the problem from new angles.",
    coachingPrompts: ["What completely different approach could work?", "What would someone with the opposite view suggest?"],
    scoreDelta: { total: 7, dimensions: { tradeoffThinking: 3, strategicFraming: 3, evidenceUse: 1 } },
  },
  reflect: {
    text: "Excellent reflection. You've demonstrated meaningful growth in your reasoning across this session.",
    contextAwarePrefix: "Looking back at how your thinking has evolved,",
    insight: "You connected your reflection back to the original problem — that's mature strategic thinking.",
    coachingPrompts: ["What's the strongest part of your argument?", "What would you change if starting over?"],
    scoreDelta: { total: 6, dimensions: { strategicFraming: 3, clarity: 1, tradeoffThinking: 2 } },
  },
};

const initialScore: ReasoningScoreData = {
  total: 44,
  max: 100,
  dimensions: { clarity: 10, evidenceUse: 8, tradeoffThinking: 12, strategicFraming: 14 },
  dimensionMax: 25,
};

const ArenaSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const { activeProgram, setHasCompletedSession, completedSessionCount, setCompletedSessionCount } = useLearner();
  const scenario = scenariosByProgram[activeProgram.id] || scenariosByProgram["p1"];
  const focusSkill = searchParams.get("focus") || scenario.focusDimension;
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState("clarify");
  const [stageIndex, setStageIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reasoningScore, setReasoningScore] = useState<ReasoningScoreData>(initialScore);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageData[]>([
    { role: "arena", category: "clarify", text: scenario.openingPrompt },
  ]);

  useEffect(() => {
    setResponse("");
    setIsRecording(false);
    setActiveCategory("clarify");
    setStageIndex(0);
    setSessionComplete(false);
    setReasoningScore(initialScore);
    setMessages([{ role: "arena", category: "clarify", text: scenario.openingPrompt }]);
  }, [activeProgram.id, scenario.openingPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const applyScoreDelta = (delta: { total: number; dimensions: Partial<ScoreDimensions> }) => {
    setReasoningScore((prev) => ({
      ...prev,
      total: Math.min(prev.total + delta.total, prev.max),
      dimensions: {
        clarity: Math.min(prev.dimensions.clarity + (delta.dimensions.clarity || 0), prev.dimensionMax),
        evidenceUse: Math.min(prev.dimensions.evidenceUse + (delta.dimensions.evidenceUse || 0), prev.dimensionMax),
        tradeoffThinking: Math.min(prev.dimensions.tradeoffThinking + (delta.dimensions.tradeoffThinking || 0), prev.dimensionMax),
        strategicFraming: Math.min(prev.dimensions.strategicFraming + (delta.dimensions.strategicFraming || 0), prev.dimensionMax),
      },
    }));
  };

  const handleSubmit = () => {
    if (!response.trim()) return;

    const arenaReply = arenaResponses[activeCategory] || arenaResponses.clarify;
    const nextStageIndex = Math.min(stageIndex + 1, stageSequence.length - 1);
    const nextStage = stageSequence[nextStageIndex];

    const newMessages: ChatMessageData[] = [
      { role: "learner", category: "", text: response },
    ];

    // Inline coaching insight card
    if (arenaReply.insight && arenaReply.scoreDelta) {
      applyScoreDelta(arenaReply.scoreDelta);
      newMessages.push({
        role: "insight",
        category: activeCategory,
        text: arenaReply.insight,
        scoreDelta: arenaReply.scoreDelta,
      });
    }

    if (activeCategory === "reflect") {
      const prefix = arenaReply.contextAwarePrefix ? `${arenaReply.contextAwarePrefix} ` : "";
      newMessages.push({ role: "arena", category: "reflect", text: `${prefix}${arenaReply.text}` });
      setMessages((prev) => [...prev, ...newMessages]);
      setResponse("");
      setHasCompletedSession(true);
      setCompletedSessionCount(completedSessionCount + 1);
      setTimeout(() => setSessionComplete(true), 1500);
      return;
    }

    // Stage transition (subtle — just the coaching card inline)
    newMessages.push({
      role: "stage-transition",
      category: "",
      text: "",
      completedStage: activeCategory,
      nextStage,
    });

    const prefix = arenaReply.contextAwarePrefix ? `${arenaReply.contextAwarePrefix} ${arenaReply.text}` : arenaReply.text;
    newMessages.push({ role: "arena", category: nextStage, text: prefix });

    setMessages((prev) => [...prev, ...newMessages]);
    setResponse("");
    setStageIndex(nextStageIndex);
    setActiveCategory(nextStage);
  };

  return (
    <Layout pageTitle="Practice Session">
      <div className="flex flex-1 h-[calc(100vh-2.75rem)] overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Minimal top bar with stage pill */}
          <div className="border-b border-border bg-surface/50 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">{scenario.title}</h2>
              <span className="text-[10px] font-medium uppercase tracking-wider text-primary-foreground bg-primary px-2.5 py-1 rounded-full">
                {humanStagePill(activeCategory)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                Step {stageIndex + 1} of {stageSequence.length}
              </span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PanelRight className="h-4 w-4 mr-1.5" /> Notes
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[380px] p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Your Notes</SheetTitle>
                  </SheetHeader>
                  <ThinkingScaffold activeStage={activeCategory} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Progress bar — thin and subtle */}
          <div className="h-0.5 bg-border">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${((stageIndex + 1) / stageSequence.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {sessionComplete ? (
            <ArenaDebrief onClose={() => navigate("/dashboard")} reasoningScore={reasoningScore} focusSkill={focusSkill} />
          ) : (
            <>
              {/* Chat area — full screen */}
              <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                {/* Scenario context as a subtle card at the top */}
                <div className="rounded-lg bg-muted/40 px-4 py-3 border border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">{scenario.context}</p>
                  <p className="text-xs text-foreground font-medium mt-1.5">{scenario.task}</p>
                </div>

                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatMessageItem key={i} msg={msg} />
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-2">
                  {humanStage(activeCategory)}. Share your thinking below.
                </p>
                <div className="flex gap-2">
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response..."
                    className="min-h-[60px] resize-none bg-card flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleSubmit} disabled={!response.trim()} className="flex-1">
                    <Send className="mr-2 h-4 w-4" /> Send
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                    className={isRecording ? "text-destructive border-destructive" : ""}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ArenaSession;
