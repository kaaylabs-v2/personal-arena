import { cn } from "@/lib/utils";

const stages = [
  { id: "clarify", label: "Clarify" },
  { id: "challenge", label: "Challenge" },
  { id: "evidence", label: "Evidence" },
  { id: "alternative", label: "Alternatives" },
  { id: "reflect", label: "Reflect" },
];

interface SessionProgressIndicatorProps {
  activeStage: string;
}

export const SessionProgressIndicator = ({ activeStage }: SessionProgressIndicatorProps) => {
  const activeIndex = stages.findIndex((s) => s.id === activeStage);

  return (
    <div className="flex items-center gap-1 px-5 py-2 border-b border-border bg-surface/50">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center gap-1">
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
              i < activeIndex && "text-primary bg-primary/10",
              i === activeIndex && "text-primary-foreground bg-primary",
              i > activeIndex && "text-muted-foreground"
            )}
          >
            {stage.label}
          </span>
          {i < stages.length - 1 && (
            <span className={cn("text-[10px]", i < activeIndex ? "text-primary" : "text-muted-foreground/40")}>→</span>
          )}
        </div>
      ))}
    </div>
  );
};
