import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  Send,
  Pause,
  Lightbulb,
  Eye,
  Shield,
  Shuffle,
  RotateCcw,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SessionProgressIndicator } from "@/components/SessionProgressIndicator";
import { SessionPath } from "@/components/SessionPath";
import { ThinkingScaffold } from "@/components/ThinkingScaffold";
import { ScrollHints } from "@/components/ScrollHints";
import { ArenaGuidanceHint } from "@/components/ArenaGuidanceHint";
import { ArenaDebrief } from "@/components/ArenaDebrief";

type MessageRole = "arena" | "learner" | "insight";

interface ChatMessage {
  role: MessageRole;
  category: string;
  text: string;
}

const scenario = {
  title: "Distributed Team Communication",
  skillFocus: "Strategic Decision-Making",
  focusDimension: "Evidence Use",
  context:
    "You lead a product team of 12 people spread across 4 time zones. Your team has been missing sprint commitments for the last 3 cycles. Stakeholders are escalating concerns about predictability. Your team reports feeling both over-managed and under-informed.",
  task: "Determine a communication strategy that improves delivery predictability without reducing team autonomy.",
};

const stageSequence = ["clarify", "challenge", "evidence", "alternative", "reflect"];

const arenaResponses: Record<string, { text: string; insight?: string }> = {
  clarify: {
    text: "Interesting. But couldn't too much structure stifle creative problem-solving in your team? How would you balance this?",
  },
  challenge: {
    text: "You've defended your position well. Now, what concrete evidence from past sprints supports your communication approach?",
    insight: "Your reasoning is becoming more nuanced. You're starting to acknowledge trade-offs, which strengthens your argument.",
  },
  evidence: {
    text: "Good data points. But is there an entirely different approach you haven't considered? What if the problem isn't communication at all?",
  },
  alternative: {
    text: "You've explored multiple angles. Now step back — how has your thinking evolved since the start of this session? What would you change?",
    insight: "Strong alternative thinking. You identified a structural root cause that most people overlook. Consider how this reframes the original problem.",
  },
  reflect: {
    text: "Excellent reflection. You've demonstrated growth in your reasoning. Let's wrap up this session.",
  },
};

const ArenaSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState("clarify");
  const [stageIndex, setStageIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "arena",
      category: "clarify",
      text: "You've stated that distributed teams need more structured communication. Can you clarify what 'structured' means to you in practice?",
    },
  ]);

  const handleSubmit = () => {
    if (!response.trim()) return;

    const nextStageIndex = Math.min(stageIndex + 1, stageSequence.length - 1);
    const nextStage = stageSequence[nextStageIndex];
    const arenaReply = arenaResponses[activeCategory] || arenaResponses.clarify;

    const newMessages: ChatMessage[] = [
      { role: "learner", category: "", text: response },
    ];

    // Add real-time insight if available for this stage
    if (arenaReply.insight) {
      newMessages.push({
        role: "insight",
        category: activeCategory,
        text: arenaReply.insight,
      });
    }

    // Check if session is ending
    if (activeCategory === "reflect") {
      newMessages.push({
        role: "arena",
        category: "reflect",
        text: arenaReply.text,
      });
      setMessages((prev) => [...prev, ...newMessages]);
      setResponse("");
      setTimeout(() => setSessionComplete(true), 1500);
      return;
    }

    newMessages.push({
      role: "arena",
      category: nextStage,
      text: arenaReply.text,
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
                <span className="text-[10px] font-medium uppercase tracking-wider text-accent-foreground bg-accent px-2 py-0.5 rounded-full">
                  {scenario.focusDimension}
                </span>
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
                  if (idx <= stageIndex) {
                    setActiveCategory(stageId);
                  }
                }}
                capabilityName={scenario.skillFocus}
                focusDimension={scenario.focusDimension}
                sessionNumber={3}
                totalSessions={12}
              />

              {sessionComplete ? (
                <ArenaDebrief onClose={() => navigate("/dashboard")} />
              ) : (
                <>
                  <div className="px-5 py-3 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">Arena Dialogue</h2>
                  </div>

                  <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`max-w-[85%] ${msg.role === "learner" ? "ml-auto" : ""}`}
                        >
                          {/* Insight message type */}
                          {msg.role === "insight" ? (
                            <div className="flex items-start gap-2 rounded-xl px-4 py-3 bg-primary/5 border border-primary/15">
                              <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-primary font-medium block mb-0.5">
                                  Real-Time Insight
                                </span>
                                <p className="text-sm leading-relaxed text-foreground/80">{msg.text}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.category && msg.role === "arena" && (
                                <span className="text-[10px] uppercase tracking-wider text-primary font-medium mb-1 block">
                                  {msg.category}
                                </span>
                              )}
                              <div
                                className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                                  msg.role === "learner"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-surface text-surface-foreground"
                                }`}
                              >
                                {msg.text}
                              </div>
                              {/* Guidance hint below arena messages */}
                              {msg.role === "arena" && msg.category && (
                                <ArenaGuidanceHint stage={msg.category} />
                              )}
                            </>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
