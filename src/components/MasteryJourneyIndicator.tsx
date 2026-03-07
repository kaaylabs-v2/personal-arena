import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Crosshair, Target, BookOpen, TrendingUp } from "lucide-react";

const stages = [
  { key: "focus", label: "Focus", icon: Crosshair, paths: ["/focus"] },
  { key: "practice", label: "Practice", icon: Target, paths: ["/sessions", "/arena-session", "/arena/session"] },
  { key: "reflect", label: "Reflect", icon: BookOpen, paths: ["/journal"] },
  { key: "improve", label: "Improve", icon: TrendingUp, paths: ["/skill-map", "/progress"] },
] as const;

export function MasteryJourneyIndicator() {
  const { pathname } = useLocation();

  const activeIndex = stages.findIndex((s) =>
    s.paths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  );

  return (
    <div className="flex items-center gap-0.5">
      {stages.map((stage, i) => {
        const isActive = i === activeIndex;
        const Icon = stage.icon;
        return (
          <div key={stage.key} className="flex items-center gap-0.5">
            {i > 0 && (
              <div
                className={cn(
                  "w-3 h-px",
                  i <= activeIndex ? "bg-primary/50" : "bg-border"
                )}
              />
            )}
            <div
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors text-[10px] font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/60"
              )}
            >
              <Icon className="h-2.5 w-2.5" />
              <span className="hidden sm:inline">{stage.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
