import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const stages = [
  { id: "clarify", label: "Clarify" },
  { id: "challenge", label: "Challenge" },
  { id: "evidence", label: "Evidence" },
  { id: "alternative", label: "Alternatives" },
  { id: "reflect", label: "Reflect" },
];

interface SessionProgressIndicatorProps {
  activeStage: string;
  capabilityName?: string;
  focusDimension?: string;
  sessionNumber?: number;
  totalSessions?: number;
}

export const SessionProgressIndicator = ({
  activeStage,
  capabilityName,
  focusDimension,
  sessionNumber,
  totalSessions,
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
        {sessionNumber && totalSessions && (
          <span className="text-[11px] text-muted-foreground font-medium">
            Session {sessionNumber} of {totalSessions}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage pills */}
      <div className="flex items-center gap-1.5 px-5 py-2">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors flex items-center gap-1",
                i < activeIndex && "text-primary bg-primary/10",
                i === activeIndex && "text-primary-foreground bg-primary shadow-sm",
                i > activeIndex && "text-muted-foreground bg-muted/50"
              )}
            >
              {i < activeIndex && <Check className="h-2.5 w-2.5" />}
              {stage.label}
            </span>
            {i < stages.length - 1 && (
              <span className={cn("text-[10px]", i < activeIndex ? "text-primary" : "text-muted-foreground/30")}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
