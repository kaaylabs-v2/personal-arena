import { motion } from "framer-motion";
import { Sparkles, BookOpen, Lightbulb, MessageCircle, Briefcase, RotateCcw } from "lucide-react";
import { ScoreUpdateBadge, type ScoreDimensions } from "@/components/ReasoningScore";
import { ArenaGuidanceHint } from "@/components/ArenaGuidanceHint";
import { StageTransitionBanner } from "./StageTransitionBanner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";

/** Render simple markdown: **bold**, *italic*, and newlines */
const RichText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

export type MessageRole = "arena" | "learner" | "insight" | "stage-transition" | "lesson" | "correction" | "scenario" | "summary";

export interface ChatMessageData {
  role: MessageRole;
  category: string;
  text: string;
  scoreDelta?: { total: number; dimensions: Partial<ScoreDimensions> };
  completedStage?: string;
  nextStage?: string;
  summaryPoints?: string[];
  followUpPrompt?: string;
}

interface ChatMessageItemProps {
  msg: ChatMessageData;
}

/** Learn phase — lesson-style card with book icon */
const LessonMessage = ({ msg }: ChatMessageItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="max-w-[88%]"
  >
    <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Nexi is teaching</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line"><RichText text={msg.text} /></p>
      {msg.followUpPrompt && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-primary/10 italic">
          {msg.followUpPrompt}
        </p>
      )}
    </div>
  </motion.div>
);

/** Understand phase — correction/coaching sticky-note card */
const CorrectionMessage = ({ msg }: ChatMessageItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 6, rotate: -0.5 }}
    animate={{ opacity: 1, y: 0, rotate: 0 }}
    transition={{ duration: 0.35 }}
    className="max-w-[85%]"
  >
    <div className="rounded-xl border-l-4 border-l-amber-400 border border-amber-200/50 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-800/40 px-4 py-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <span className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
          Coaching Note
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/85"><RichText text={msg.text} /></p>
    </div>
  </motion.div>
);

/** Apply phase — scenario card with briefcase icon */
const ScenarioMessage = ({ msg }: ChatMessageItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="max-w-[88%]"
  >
    <div className="rounded-xl border-2 border-dashed border-accent-foreground/15 bg-accent/30 px-5 py-4">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-6 w-6 rounded-lg bg-accent flex items-center justify-center">
          <Briefcase className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-accent-foreground/70 font-semibold">
          Your Scenario
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{msg.text}</p>
    </div>
  </motion.div>
);

/** Reflect phase — session summary card */
const SummaryMessage = ({ msg }: ChatMessageItemProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[88%]"
    >
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">What you covered today</span>
        </div>
        {msg.summaryPoints && msg.summaryPoints.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {msg.summaryPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-foreground/80 mb-4">{msg.text}</p>
        {msg.scoreDelta && (
          <div className="mb-3">
            <ScoreUpdateBadge totalDelta={msg.scoreDelta.total} dimensionDeltas={msg.scoreDelta.dimensions} />
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Start another session
        </Button>
      </div>
    </motion.div>
  );
};

/** Phase transition prompt card */
const PhaseTransitionPrompt = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-[70%] mx-auto text-center"
  >
    <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 border border-border/50 px-4 py-2">
      <MessageCircle className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs text-muted-foreground italic">{text}</span>
    </div>
  </motion.div>
);

export const ChatMessageItem = ({ msg }: ChatMessageItemProps) => {
  if (msg.role === "stage-transition") {
    return (
      <StageTransitionBanner
        completedStage={msg.completedStage || ""}
        nextStage={msg.nextStage || ""}
      />
    );
  }

  if (msg.role === "lesson") return <LessonMessage msg={msg} />;
  if (msg.role === "correction") return <CorrectionMessage msg={msg} />;
  if (msg.role === "scenario") return <ScenarioMessage msg={msg} />;
  if (msg.role === "summary") return <SummaryMessage msg={msg} />;

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
