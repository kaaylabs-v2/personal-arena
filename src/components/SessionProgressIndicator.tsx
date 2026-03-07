import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";
import { ReasoningScoreIndicator, type ReasoningScoreData } from "@/components/ReasoningScore";

const stages = [
  { id: "clarify", label: "Clarify", step: 1 },
  { id: "challenge", label: "Challenge", step: 2 },
  { id: "evidence", label: "Show Your Work", step: 3 },
  { id: "alternative", label: "Alternatives", step: 4 },
  { id: "reflect", label: "Reflect", step: 5 },
];

interface SessionProgressIndicatorProps {
  activeStage: string;
  onStageClick?: (stageId: string) => void;
  capabilityName?: string;
  focusDimension?: string;
  sessionNumber?: number;
  totalSessions?: number;
  reasoningScore?: ReasoningScoreData;
}

export const SessionProgressIndicator = ({
  activeStage,
  onStageClick,
  capabilityName,
  focusDimension,
  sessionNumber,
  totalSessions,
  reasoningScore,
}: SessionProgressIndicatorProps) => {
  const activeIndex = stages.findIndex((s) => s.id === activeStage);
  const progress = ((activeIndex + 1) / stages.length) * 100;

  return (
    <div className="border-b border-border bg-surface/50">
      {/* Capability & Session Info */}
      <div className="flex items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-3">
          {capabilityName && (
            <span className="text-xs font-semibold text-foreground font-display">
              {capabilityName}
            </span>
          )}
          {focusDimension && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-accent-foreground bg-accent px-2 py-0.5 rounded-full">
              Focus: {focusDimension}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {reasoningScore && <ReasoningScoreIndicator score={reasoningScore} />}
          {sessionNumber && totalSessions && (
            <span className="text-[11px] text-muted-foreground font-medium">
              Session {sessionNumber} of {totalSessions}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage pills — enhanced with step numbers and clear state indicators */}
      <div className="flex items-center gap-0.5 px-5 py-2.5">
        {stages.map((stage, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const isUpcoming = i > activeIndex;
          const isClickable = isCompleted && !!onStageClick;

          return (
            <div key={stage.id} className="flex items-center gap-0.5">
              <button
                disabled={!isClickable}
                onClick={() => isClickable && onStageClick(stage.id)}
                className={cn(
                  "text-[10px] font-medium px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5",
                  isCompleted && "text-primary bg-primary/10 ring-1 ring-primary/20",
                  isCompleted && isClickable && "hover:bg-primary/20 cursor-pointer",
                  isActive && "text-primary-foreground bg-primary shadow-sm shadow-primary/25 ring-1 ring-primary",
                  isUpcoming && "text-muted-foreground bg-muted/40 cursor-default"
                )}
              >
                {isCompleted && <Check className="h-3 w-3" />}
                {isActive && <Circle className="h-2.5 w-2.5 fill-current" />}
                {isUpcoming && <span className="text-[9px] opacity-50">{stage.step}</span>}
                {stage.label}
              </button>
              {i < stages.length - 1 && (
                <div className={cn(
                  "w-4 h-px mx-0.5 transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
