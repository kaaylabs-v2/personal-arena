import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SessionProgressIndicator } from "@/components/SessionProgressIndicator";

const promptCategories = [
  { id: "clarify", label: "Clarify", icon: Eye },
  { id: "challenge", label: "Challenge", icon: Shield },
  { id: "evidence", label: "Evidence", icon: Lightbulb },
  { id: "alternative", label: "Alternative", icon: Shuffle },
  { id: "reflect", label: "Reflect", icon: RotateCcw },
];

const scenario = {
  title: "Distributed Team Communication",
  context:
    "You lead a product team of 12 people spread across 4 time zones. Your team has been missing sprint commitments for the last 3 cycles. Stakeholders are escalating concerns about predictability. Your team reports feeling both over-managed and under-informed.",
  task: "Determine a communication strategy that improves delivery predictability without reducing team autonomy.",
};

const ArenaSession = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState("clarify");
  const [messages, setMessages] = useState<{ role: "arena" | "learner"; category: string; text: string }[]>([
    {
      role: "arena",
      category: "clarify",
      text: "You've stated that distributed teams need more structured communication. Can you clarify what 'structured' means to you in practice?",
    },
  ]);

  const handleSubmit = () => {
    if (!response.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "learner" as const, category: "", text: response },
      {
        role: "arena" as const,
        category: "challenge",
        text: "Interesting. But couldn't too much structure stifle creative problem-solving in your team? How would you balance this?",
      },
    ]);
    setResponse("");
    setActiveCategory("challenge");
  };

  return (
    <Layout>
      <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* LEFT PANEL — Scenario */}
        <div className="w-72 flex-shrink-0 border-r border-border bg-surface flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Scenario</h3>
          </div>
          <div className="flex-1 overflow-auto px-5 py-4 space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-surface-foreground font-display">{scenario.title}</h4>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Context</p>
              <p className="text-sm leading-relaxed text-surface-foreground/80">{scenario.context}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Your Task</p>
              <p className="text-sm leading-relaxed text-surface-foreground/80">{scenario.task}</p>
            </div>
          </div>
        </div>

        {/* CENTER PANEL — Conversation */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Session Progress Indicator */}
          <SessionProgressIndicator activeStage={activeCategory} />

          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Arena Dialogue</h2>
            <div className="flex gap-1.5">
              {promptCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-surface-foreground hover:bg-accent"
                  }`}
                >
                  <cat.icon className="h-3 w-3" />
                  {cat.label}
                </button>
              ))}
            </div>
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
                  {msg.category && (
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom Bar */}
          <div className="p-4 border-t border-border">
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
              <Button variant="outline" size="sm" onClick={() => navigate("/session-summary")}>
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Thinking Scaffold */}
        <div className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-surface">
          <div className="px-4 py-4 border-b border-border">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Thinking Scaffold</h3>
          </div>
          <Tabs defaultValue="assumptions" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-3 bg-muted">
              <TabsTrigger value="assumptions" className="text-xs">Assumptions</TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs">Evidence</TabsTrigger>
              <TabsTrigger value="alternatives" className="text-xs">Alternatives</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
            </TabsList>
            {["assumptions", "evidence", "alternatives", "notes"].map((tab) => (
              <TabsContent key={tab} value={tab} className="flex-1 px-4 py-3">
                <Textarea
                  placeholder={`Jot down your ${tab}...`}
                  className="h-full resize-none bg-card border-border text-sm"
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ArenaSession;
