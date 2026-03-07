import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Send, Pause, Lightbulb, Mic, MicOff } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SessionProgressIndicator } from "@/components/SessionProgressIndicator";
import { SessionPath } from "@/components/SessionPath";
import { ThinkingScaffold } from "@/components/ThinkingScaffold";
import { ScrollHints } from "@/components/ScrollHints";
import { ArenaDebrief } from "@/components/ArenaDebrief";
import { FocusSkillBadge } from "@/components/arena/FocusSkillBadge";
import { ChatMessageItem, type ChatMessageData } from "@/components/arena/ChatMessage";
import type { ScoreDimensions, ReasoningScoreData } from "@/components/ReasoningScore";
import { useLearner } from "@/contexts/LearnerContext";

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
    focusDimension: "Evidence Use",
    context:
      "You lead a product team of 12 people spread across 4 time zones. Your team has been missing sprint commitments for the last 3 cycles. Stakeholders are escalating concerns about predictability. Your team reports feeling both over-managed and under-informed.",
    task: "Determine a communication strategy that improves delivery predictability without reducing team autonomy.",
    openingPrompt: "You've stated that distributed teams need more structured communication. Can you clarify what 'structured' means to you in practice?",
  },
  "p-algebra": {
    title: "Word Problem Translation Breakdown",
    skillFocus: "Algebraic Reasoning",
    focusDimension: "Equation Setup",
    context:
      "You're solving a word problem test and keep making setup errors before calculations even begin. You can solve equations, but translating scenarios into the right equation is causing lost points.",
    task: "Create a repeatable setup strategy for translating word problems into equations accurately under time pressure.",
    openingPrompt: "Before solving anything, what exact steps will you use to identify knowns, unknowns, and relationships in a word problem?",
  },
  "p-calculus": {
    title: "Optimization Constraint Failure",
    skillFocus: "Derivative Application",
    focusDimension: "Optimization Problems",
    context:
      "In your last quiz, you spent most of your time differentiating correctly but lost marks because your optimization model and constraint equation were incomplete.",
    task: "Design a problem setup workflow that ensures constraints, objective function, and variable definitions are correct before differentiation.",
    openingPrompt: "When approaching an optimization problem, how do you decide what variable to optimize and what constraints to write first?",
  },
  "p-insurance": {
    title: "Price Objection Live Call",
    skillFocus: "Value Framing",
    focusDimension: "Handling Price Objections",
    context:
      "A client says your premium is too expensive and is considering a cheaper competitor. You previously lost similar deals by leading with features instead of relevance.",
    task: "Respond with a value-focused structure that reframes price concerns and builds trust without sounding pushy.",
    openingPrompt: "How would you open this objection response so the client feels heard before you present value?",
  },
};

const stageSequence = ["clarify", "challenge", "evidence", "alternative", "reflect"];

// Context-aware follow-ups that reference prior responses
const arenaResponses: Record<string, {
  text: string;
  contextAwarePrefix?: string;
  insight?: string;
  scoreDelta?: { total: number; dimensions: Partial<ScoreDimensions> };
}> = {
  clarify: {
    text: "But couldn't too much structure stifle creative problem-solving in your team? How would you balance this?",
    contextAwarePrefix: "You've outlined your view on structured communication.",
    insight: "You defined the problem with precision. Good use of scope narrowing.",
    scoreDelta: { total: 5, dimensions: { clarity: 4, strategicFraming: 1 } },
  },
  challenge: {
    text: "You've defended your position well. Now, what concrete evidence from past sprints supports your communication approach?",
    contextAwarePrefix: "Earlier you suggested a specific communication cadence.",
    insight: "Your reasoning is becoming more nuanced. You're starting to acknowledge trade-offs, which strengthens your argument.",
    scoreDelta: { total: 6, dimensions: { tradeoffThinking: 3, clarity: 2, strategicFraming: 1 } },
  },
  evidence: {
    text: "Good data points. But is there an entirely different approach you haven't considered? What if the problem isn't communication at all?",
    contextAwarePrefix: "You referenced concrete sprint data to back your claim.",
    insight: "Strong evidence cited. Now strengthen your reasoning by considering whether the data supports alternative explanations.",
    scoreDelta: { total: 4, dimensions: { evidenceUse: 3, clarity: 1 } },
  },
  alternative: {
    text: "You've explored multiple angles. Now step back — how has your thinking evolved since the start of this session? What would you change?",
    contextAwarePrefix: "You identified a structural root cause that most people overlook.",
    insight: "Strong alternative thinking. Consider how this reframes the original problem and what second-order effects might emerge.",
    scoreDelta: { total: 7, dimensions: { tradeoffThinking: 3, strategicFraming: 3, evidenceUse: 1 } },
  },
  reflect: {
    text: "Excellent reflection. You've demonstrated meaningful growth in your reasoning across this session.",
    contextAwarePrefix: "Looking back at how your thinking has evolved through this dialogue,",
    insight: "You connected your final reflection back to the original problem framing — a sign of mature strategic thinking.",
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
  const { activeProgram } = useLearner();
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
    {
      role: "arena",
      category: "clarify",
      text: scenario.openingPrompt,
    },
  ]);

  useEffect(() => {
    setResponse("");
    setIsRecording(false);
    setActiveCategory("clarify");
    setStageIndex(0);
    setSessionComplete(false);
    setReasoningScore(initialScore);
    setMessages([
      {
        role: "arena",
        category: "clarify",
        text: scenario.openingPrompt,
      },
    ]);
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

    // Inline insight with score
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
      // Final arena message
      const prefix = arenaReply.contextAwarePrefix ? `${arenaReply.contextAwarePrefix} ` : "";
      newMessages.push({
        role: "arena",
        category: "reflect",
        text: `${prefix}${arenaReply.text}`,
      });
      setMessages((prev) => [...prev, ...newMessages]);
      setResponse("");
      setTimeout(() => setSessionComplete(true), 1500);
      return;
    }

    // Stage transition banner
    newMessages.push({
      role: "stage-transition",
      category: "",
      text: "",
      completedStage: activeCategory,
      nextStage,
    });

    // Context-aware arena follow-up
    const prefix = arenaReply.contextAwarePrefix ? `${arenaReply.contextAwarePrefix} ${arenaReply.text}` : arenaReply.text;
    newMessages.push({
      role: "arena",
      category: nextStage,
      text: prefix,
    });

    setMessages((prev) => [...prev, ...newMessages]);
    setResponse("");
    setStageIndex(nextStageIndex);
    setActiveCategory(nextStage);
  };

  return (
    <Layout pageTitle="Arena Session">
      <div className="flex flex-1 h-[calc(100vh-2.75rem)] overflow-hidden">
        {/* LEFT PANEL — Scenario */}
        <div className="w-72 flex-shrink-0 border-r border-border bg-surface flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Scenario</h3>
          </div>
          <ScrollHints className="px-5 py-4 space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-surface-foreground font-display">{scenario.title}</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {scenario.skillFocus}
                </span>
                <FocusSkillBadge skill={focusSkill} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Context</p>
              <p className="text-sm leading-relaxed text-surface-foreground/80">{scenario.context}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Your Task</p>
              <p className="text-sm leading-relaxed text-surface-foreground/80">{scenario.task}</p>
            </div>
            <div className="pt-2 border-t border-border">
              <SessionPath currentSession={3} />
            </div>
          </ScrollHints>
        </div>

        {/* Resizable center + right panels */}
        <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="flex flex-col h-full min-w-0">
              <SessionProgressIndicator
                activeStage={activeCategory}
                onStageClick={(stageId) => {
                  const idx = stageSequence.indexOf(stageId);
                  if (idx <= stageIndex) setActiveCategory(stageId);
                }}
                capabilityName={scenario.skillFocus}
                focusDimension={focusSkill}
                sessionNumber={3}
                totalSessions={12}
                reasoningScore={reasoningScore}
              />

              {sessionComplete ? (
                <ArenaDebrief onClose={() => navigate("/dashboard")} reasoningScore={reasoningScore} focusSkill={focusSkill} />
              ) : (
                <>
                  <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Arena Dialogue</h2>
                  </div>

                  <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <ChatMessageItem key={i} msg={msg} />
                      ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 border-t border-border">
                    <p className="text-[11px] text-muted-foreground mb-2 italic">
                      Explain your reasoning. Arena will challenge and refine your thinking.
                    </p>
                    <div className="flex gap-2">
                      <Textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Share your response..."
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
                        <Send className="mr-2 h-4 w-4" /> Submit Response
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className={isRecording ? "text-destructive border-destructive" : ""}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate("/session-insight")}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <ThinkingScaffold activeStage={activeCategory} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
};

export default ArenaSession;
