import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ScoreUpdateBadge, type ScoreDimensions } from "@/components/ReasoningScore";
import { ArenaGuidanceHint } from "@/components/ArenaGuidanceHint";
import { StageTransitionBanner } from "./StageTransitionBanner";

export type MessageRole = "arena" | "learner" | "insight" | "stage-transition";

export interface ChatMessageData {
  role: MessageRole;
  category: string;
  text: string;
  scoreDelta?: { total: number; dimensions: Partial<ScoreDimensions> };
  completedStage?: string;
  nextStage?: string;
}

interface ChatMessageItemProps {
  msg: ChatMessageData;
}

export const ChatMessageItem = ({ msg }: ChatMessageItemProps) => {
  if (msg.role === "stage-transition") {
    return (
      <StageTransitionBanner
        completedStage={msg.completedStage || ""}
        nextStage={msg.nextStage || ""}
      />
    );
  }

  if (msg.role === "insight") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[85%]"
      >
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 bg-primary/5 border border-primary/15">
          <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-primary font-medium block mb-0.5">
              Real-Time Insight
            </span>
            <p className="text-sm leading-relaxed text-foreground/80">{msg.text}</p>
            {msg.scoreDelta && (
              <ScoreUpdateBadge
                totalDelta={msg.scoreDelta.total}
                dimensionDeltas={msg.scoreDelta.dimensions}
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[85%] ${msg.role === "learner" ? "ml-auto" : ""}`}
    >
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
      {msg.role === "arena" && msg.category && (
        <ArenaGuidanceHint stage={msg.category} />
      )}
    </motion.div>
  );
};
