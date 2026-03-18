import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, PanelRight } from "lucide-react";
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
  lessonContent: string[];
  scenarioPrompt: string;
  openingPrompt: string;
}> = {
  "p1": {
    title: "Distributed Team Communication",
    skillFocus: "Strategic Decision-Making",
    focusDimension: "Show Your Work",
    context: "You lead a product team of 12 people spread across 4 time zones.",
    task: "Determine a communication strategy that improves delivery predictability without reducing team autonomy.",
    lessonContent: [
      "When managing distributed teams, communication structure directly impacts delivery predictability. There are three core principles to keep in mind:\n\n1. **Async-first communication** — Default to written, structured updates rather than synchronous meetings. This respects time zones and creates a searchable record.\n\n2. **Cadence over frequency** — It's not about more meetings, but predictable rhythms. Weekly syncs, daily async standups, and quarterly planning create stability.\n\n3. **Decision documentation** — Every decision should have a clear owner, context, and rationale recorded. This prevents the 're-litigation' problem in distributed teams.",
      "Let's go deeper on async-first communication. The key mistake teams make is treating async as 'slower sync.' Instead, async communication should be:\n\n• **Structured**: Use templates for updates so people know what to expect\n• **Complete**: Include all context — don't assume the reader knows background\n• **Time-bounded**: Set clear response expectations (e.g., 'respond within 24h')\n\nThis approach actually *increases* team autonomy because people can process and respond on their own schedule.",
    ],
    scenarioPrompt: "Your team just missed their third consecutive sprint commitment. The engineering lead in Singapore says the daily standup at 9am EST is the problem — they attend at 10pm local time and feel disconnected from decisions made during US hours. The US-based PM insists real-time standups are essential for coordination. You need to propose a solution in tomorrow's leadership meeting.\n\nWhat's your approach?",
    openingPrompt: "Welcome! Today we're exploring how to structure communication for distributed teams. Let me walk you through the key principles first.",
  },
  "p-algebra": {
    title: "Word Problem Translation",
    skillFocus: "Algebraic Reasoning",
    focusDimension: "Equation Setup",
    context: "You're working on translating word problems into algebraic equations.",
    task: "Create a repeatable setup strategy for word problems.",
    lessonContent: [
      "Translating word problems into equations is one of the most important algebraic skills. Here's a systematic approach:\n\n1. **Read twice** — First for the story, second for the math structure\n2. **Identify the unknown** — What are you solving for? Assign it a variable\n3. **Find relationships** — Look for words like 'more than,' 'times,' 'total' that indicate operations\n\nThe most common mistake? Jumping to numbers before understanding the relationship between quantities.",
      "Let's practice identifying relationships. Watch for these keyword patterns:\n\n• 'is/was/will be' → equals (=)\n• 'more than / increased by' → addition (+)\n• 'less than / decreased by' → subtraction (−)\n• 'of / times / product' → multiplication (×)\n• 'per / divided by / ratio' → division (÷)\n\nThe order matters! 'Five less than a number' is x − 5, not 5 − x.",
    ],
    scenarioPrompt: "A store sells notebooks for $4 each and pens for $2 each. Maria spent $26 and bought 3 more pens than notebooks. How many of each did she buy?\n\nSet up the equations step by step before solving.",
    openingPrompt: "Let's work on translating word problems into equations today. I'll teach you a systematic approach first.",
  },
  "p-calculus": {
    title: "Optimization Problems",
    skillFocus: "Derivative Application",
    focusDimension: "Optimization Problems",
    context: "You're learning to set up and solve optimization problems using calculus.",
    task: "Design a workflow for optimization problem setup.",
    lessonContent: [
      "Optimization in calculus follows a clear workflow:\n\n1. **Draw and label** — Sketch the situation and assign variables to all quantities\n2. **Write the objective function** — What are you maximizing or minimizing?\n3. **Identify constraints** — What equations relate your variables?\n4. **Reduce to one variable** — Use constraints to eliminate extra variables\n5. **Differentiate and solve** — Find critical points, then verify max/min\n\nMost errors happen in steps 2-3, not in the calculus itself.",
      "The constraint equation is where most students get stuck. Here's the key insight:\n\n• The **objective function** is what you want to optimize (area, cost, distance)\n• The **constraint** is a fixed quantity that limits your choices (perimeter, budget, material)\n\nAlways ask: 'What's fixed, and what's free to change?' The fixed quantity gives you the constraint. The 'free' quantity is what you're optimizing.",
    ],
    scenarioPrompt: "You have 200 meters of fencing to enclose a rectangular garden against a barn wall (so you only need fencing on 3 sides). What dimensions maximize the garden area?\n\nWalk through each step of the optimization workflow.",
    openingPrompt: "Today we'll work on optimization problems. Let me teach you the systematic workflow first.",
  },
  "p-insurance": {
    title: "Price Objection Handling",
    skillFocus: "Value Framing",
    focusDimension: "Handling Price Objections",
    context: "A client says your premium is too expensive.",
    task: "Respond with a value-focused structure that reframes price concerns.",
    lessonContent: [
      "When a client objects to price, they're rarely objecting to the number — they're saying they don't yet see enough value. Here's the framework:\n\n1. **Acknowledge** — Validate their concern without being defensive. 'I completely understand — that's a fair question.'\n2. **Reframe** — Shift from cost to value. 'Let me show you what's actually included and why it matters for your situation.'\n3. **Personalize** — Connect specific coverage features to their specific risks\n\nThe biggest mistake? Immediately dropping the price. That signals even *you* don't believe in the value.",
      "Let's talk about the 'cost of not' technique. Instead of defending your price, help the client understand what they'd lose:\n\n• 'Without this coverage, a single incident could cost you $X out of pocket'\n• 'The competitor's lower premium excludes Y — if that happens, you'd pay the difference plus more'\n\nFrame it as: **the premium isn't the cost — the uncovered risk is the cost.** Make the alternative more expensive in their mind than your premium.",
    ],
    scenarioPrompt: "You're on a call with a small business owner who says: 'I got a quote from another company that's $200/month cheaper. Why should I pay more for yours?' They seem ready to switch.\n\nHow do you respond?",
    openingPrompt: "Today we'll work on handling price objections. Let me teach you the value framing approach first.",
  },
};

const stageSequence = ["learn", "understand", "think-deeper", "apply", "reflect"];

const phaseResponses: Record<string, {
  texts: string[];
  insight?: string;
  scoreDelta?: { total: number; dimensions: Partial<ScoreDimensions> };
}> = {
  learn: {
    texts: [],
    insight: "Great question — you're engaging with the material actively.",
    scoreDelta: { total: 3, dimensions: { clarity: 2, strategicFraming: 1 } },
  },
  understand: {
    texts: [
      "Good start! Can you be more specific about how that works in practice?",
      "You've captured the main idea. Let me add some nuance to what you said.",
    ],
    insight: "You're building understanding — connecting concepts to your own words is powerful.",
    scoreDelta: { total: 5, dimensions: { clarity: 3, evidenceUse: 2 } },
  },
  "think-deeper": {
    texts: [
      "Interesting angle. But what happens when that approach breaks down?",
      "You're thinking well. Now consider: what's the strongest argument *against* your position?",
    ],
    insight: "Strong critical thinking — you're examining the idea from multiple angles.",
    scoreDelta: { total: 6, dimensions: { tradeoffThinking: 3, strategicFraming: 2, clarity: 1 } },
  },
  apply: {
    texts: [
      "Walk me through your reasoning step by step.",
      "Good direction. What would you do if that first approach didn't work?",
    ],
    insight: "You're applying concepts to a real situation — this is where deep learning happens.",
    scoreDelta: { total: 7, dimensions: { strategicFraming: 3, evidenceUse: 2, tradeoffThinking: 2 } },
  },
  reflect: {
    texts: [
      "Excellent reflection. You've shown real growth in this session.",
    ],
    insight: "Strong metacognition — you're aware of how your thinking has evolved.",
    scoreDelta: { total: 5, dimensions: { tradeoffThinking: 2, clarity: 2, strategicFraming: 1 } },
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
  const [activeCategory, setActiveCategory] = useState("learn");
  const [stageIndex, setStageIndex] = useState(0);
  const [learnExchangeCount, setLearnExchangeCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reasoningScore, setReasoningScore] = useState<ReasoningScoreData>(initialScore);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      role: "lesson",
      category: "learn",
      text: scenario.lessonContent[0],
      followUpPrompt: "Got it? Let me know if you'd like me to explain any part differently.",
    },
  ]);

  useEffect(() => {
    setResponse("");
    setIsRecording(false);
    setActiveCategory("learn");
    setStageIndex(0);
    setLearnExchangeCount(0);
    setSessionComplete(false);
    setReasoningScore(initialScore);
    setMessages([{
      role: "lesson",
      category: "learn",
      text: scenario.lessonContent[0],
      followUpPrompt: "Got it? Let me know if you'd like me to explain any part differently.",
    }]);
  }, [activeProgram.id, scenario.lessonContent]);

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

  const advanceToPhase = (nextPhaseIndex: number, newMessages: ChatMessageData[]) => {
    const nextPhase = stageSequence[nextPhaseIndex];

    newMessages.push({
      role: "stage-transition",
      category: "",
      text: "",
      completedStage: activeCategory,
      nextStage: nextPhase,
    });

    setStageIndex(nextPhaseIndex);
    setActiveCategory(nextPhase);
    return nextPhase;
  };

  const handleSubmit = () => {
    if (!response.trim()) return;

    const newMessages: ChatMessageData[] = [
      { role: "learner", category: "", text: response },
    ];

    const phase = phaseResponses[activeCategory];

    // Add insight if available
    if (phase?.insight && phase?.scoreDelta) {
      applyScoreDelta(phase.scoreDelta);
      newMessages.push({
        role: "insight",
        category: activeCategory,
        text: phase.insight,
        scoreDelta: phase.scoreDelta,
      });
    }

    if (activeCategory === "learn") {
      const nextCount = learnExchangeCount + 1;
      setLearnExchangeCount(nextCount);

      if (nextCount < scenario.lessonContent.length) {
        // More lesson content to show
        newMessages.push({
          role: "lesson",
          category: "learn",
          text: scenario.lessonContent[nextCount],
          followUpPrompt: nextCount < scenario.lessonContent.length - 1
            ? "Got it? Let me know if you'd like me to explain any part differently."
            : "Ready to check your understanding? Let me know when you'd like to move on.",
        });
      } else {
        // Advance to Understand
        const nextPhase = advanceToPhase(1, newMessages);
        newMessages.push({
          role: "arena",
          category: nextPhase,
          text: "Now I'd like to check your understanding. Can you explain what you've just learned in your own words? What are the key principles and why do they matter?",
        });
      }
    } else if (activeCategory === "understand") {
      // Simulate correction/elaboration then advance
      newMessages.push({
        role: "correction",
        category: "understand",
        text: "You've got the right idea! One small refinement — remember that the order of operations matters here. The key isn't just knowing the principles, but understanding *why* they work in sequence. Let me restate: " +
          (phase.texts[0] || "Can you try explaining that connection more specifically?"),
      });
      // After one exchange, advance to Think Deeper
      const nextPhase = advanceToPhase(2, newMessages);
      newMessages.push({
        role: "arena",
        category: nextPhase,
        text: "Let's push your thinking a bit further. " + (phaseResponses["think-deeper"].texts[0] || "What happens when this approach breaks down?"),
      });
    } else if (activeCategory === "think-deeper") {
      const nextPhase = advanceToPhase(3, newMessages);
      newMessages.push({
        role: "scenario",
        category: nextPhase,
        text: scenario.scenarioPrompt,
      });
    } else if (activeCategory === "apply") {
      newMessages.push({
        role: "arena",
        category: "apply",
        text: phase.texts[1] || phase.texts[0] || "Good approach. Can you elaborate on your reasoning?",
      });
      // After apply response, advance to Reflect
      const nextPhase = advanceToPhase(4, newMessages);
      newMessages.push({
        role: "arena",
        category: nextPhase,
        text: "Nice work on that scenario. Now let's reflect — what's the most important thing you learned today? How has your thinking changed from the start of this session?",
      });
    } else if (activeCategory === "reflect") {
      newMessages.push({
        role: "summary",
        category: "reflect",
        text: "Nice work! You engaged deeply with the material and showed real growth in your reasoning.",
        summaryPoints: [
          `Learned core principles of ${scenario.skillFocus.toLowerCase()}`,
          "Demonstrated understanding by explaining concepts back",
          `Applied your knowledge to a realistic ${scenario.focusDimension.toLowerCase()} scenario`,
        ],
        scoreDelta: phase?.scoreDelta,
      });
      setMessages((prev) => [...prev, ...newMessages]);
      setResponse("");
      setHasCompletedSession(true);
      setCompletedSessionCount(completedSessionCount + 1);
      setTimeout(() => setSessionComplete(true), 2000);
      return;
    }

    setMessages((prev) => [...prev, ...newMessages]);
    setResponse("");
  };

  return (
    <Layout pageTitle="Practice Session">
      <div className="flex flex-1 h-[calc(100vh-2.75rem)] overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="border-b border-border bg-surface/50 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">{scenario.title}</h2>
              <motion.span
                key={activeCategory}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="text-[10px] font-medium uppercase tracking-wider text-primary-foreground bg-primary px-2.5 py-1 rounded-full"
              >
                {humanStagePill(activeCategory)}
              </motion.span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                Phase {stageIndex + 1} of {stageSequence.length}
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

          {/* Progress bar */}
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
              {/* Chat area */}
              <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
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
                  {humanStage(activeCategory)}
                </p>
                <div className="flex gap-2">
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder={activeCategory === "learn"
                      ? "Ask a question or say 'ready' to continue..."
                      : "Type your response..."}
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
