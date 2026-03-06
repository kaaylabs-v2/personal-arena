import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InsightBanner } from "@/components/InsightBanner";
import { Lightbulb, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stageData: Record<
  string,
  { insight: string; prompts: string[] }
> = {
  clarify: {
    insight:
      "Your response focuses on communication structure, but does not yet address stakeholder expectations. Consider whether predictability expectations are driving the escalation.",
    prompts: [
      "What assumptions are you making about the problem?",
      "What information might be missing?",
      'What does "structured communication" mean in this context?',
    ],
  },
  challenge: {
    insight:
      "You've proposed a solution—but have you stress-tested it? Consider what could go wrong if you implement this in a low-trust environment.",
    prompts: [
      "What would a critic say about your approach?",
      "Are there trade-offs you haven't acknowledged?",
      "Could this backfire? Under what conditions?",
    ],
  },
  evidence: {
    insight:
      "Your reasoning relies heavily on intuition. Try grounding your claims in observable patterns or data from past sprints.",
    prompts: [
      "What evidence supports your claim?",
      "Are you relying on intuition or observable behavior?",
      "What data from past sprints could validate this?",
    ],
  },
  alternative: {
    insight:
      "You've identified one path forward. Exploring alternatives can reveal blind spots and strengthen your final recommendation.",
    prompts: [
      "What's a completely different approach to this problem?",
      "If resources were unlimited, what would you do?",
      "What would someone with the opposite viewpoint suggest?",
    ],
  },
  reflect: {
    insight:
      "Take a step back and evaluate your overall reasoning. How has your thinking evolved through this session?",
    prompts: [
      "What's the strongest part of your argument?",
      "What would you change if you started over?",
      "How confident are you in your conclusion, and why?",
    ],
  },
};

interface ThinkingScaffoldProps {
  activeStage: string;
}

export const ThinkingScaffold = ({ activeStage }: ThinkingScaffoldProps) => {
  const [notes, setNotes] = useState<Record<string, string>>({
    assumptions: "",
    evidence: "",
    alternatives: "",
    notes: "",
  });

  const current = stageData[activeStage] ?? stageData.clarify;

  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-surface">
      <div className="px-4 py-4 border-b border-border">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Thinking Scaffold
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        {/* AI Insight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage + "-insight"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="px-4 pt-4 pb-2"
          >
            <InsightBanner title="AI Observation">
              {current.insight}
            </InsightBanner>
          </motion.div>
        </AnimatePresence>

        {/* Helpful Prompts */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage + "-prompts"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="px-4 py-3"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] uppercase tracking-wider text-primary font-medium">
                Consider
              </p>
            </div>
            <ul className="space-y-2">
              {current.prompts.map((prompt, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/20"
                >
                  {prompt}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Divider */}
        <div className="mx-4 border-t border-border" />

        {/* Notes Tabs */}
        <Tabs defaultValue="assumptions" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-3 bg-muted">
            <TabsTrigger value="assumptions" className="text-xs">
              Assumptions
            </TabsTrigger>
            <TabsTrigger value="evidence" className="text-xs">
              Evidence
            </TabsTrigger>
            <TabsTrigger value="alternatives" className="text-xs">
              Alternatives
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              Notes
            </TabsTrigger>
          </TabsList>
          {(["assumptions", "evidence", "alternatives", "notes"] as const).map(
            (tab) => (
              <TabsContent key={tab} value={tab} className="flex-1 px-4 py-3">
                <Textarea
                  value={notes[tab]}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [tab]: e.target.value }))
                  }
                  placeholder={`Jot down your ${tab}...`}
                  className="min-h-[120px] resize-none bg-card border-border text-sm"
                />
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  );
};
