import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SessionEntry {
  number: number;
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface SessionPathProps {
  sessions?: SessionEntry[];
  currentSession?: number;
}

const defaultSessions: SessionEntry[] = [
  { number: 1, title: "Communication Cadence", status: "completed" },
  { number: 2, title: "Async Decision Protocols", status: "completed" },
  { number: 3, title: "Distributed Team Comm.", status: "current" },
  { number: 4, title: "Stakeholder Escalation", status: "upcoming" },
  { number: 5, title: "Evidence Mapping", status: "upcoming" },
  { number: 6, title: "Conflicting Priorities", status: "upcoming" },
  { number: 7, title: "Resource Trade-offs", status: "upcoming" },
  { number: 8, title: "Risk Communication", status: "upcoming" },
  { number: 9, title: "Cross-team Alignment", status: "upcoming" },
  { number: 10, title: "Exec Summary Framing", status: "upcoming" },
  { number: 11, title: "Adaptive Messaging", status: "upcoming" },
  { number: 12, title: "Integrated Scenario", status: "upcoming" },
];

export const SessionPath = ({
  sessions = defaultSessions,
}: SessionPathProps) => {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
        Session Path
      </p>
      <div className="space-y-0.5">
        {sessions.map((session, i) => {
          const isCompleted = session.status === "completed";
          const isCurrent = session.status === "current";
          const isUpcoming = session.status === "upcoming";

          return (
            <div key={session.number} className="flex items-start gap-2.5">
              {/* Vertical timeline */}
              <div className="flex flex-col items-center w-4 shrink-0">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-colors",
                    isCompleted && "h-4 w-4 bg-primary/15",
                    isCurrent && "h-5 w-5 bg-primary shadow-sm shadow-primary/25 ring-2 ring-primary/30",
                    isUpcoming && "h-4 w-4 border border-border"
                  )}
                >
                  {isCompleted && <Check className="h-2.5 w-2.5 text-primary" />}
                  {isCurrent && (
                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                  {isUpcoming && (
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                {i < sessions.length - 1 && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-[12px]",
                      isCompleted ? "bg-primary/30" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Session label */}
              <button
                disabled={isUpcoming}
                className={cn(
                  "text-left pb-2 -mt-0.5 transition-colors",
                  isCompleted && "cursor-pointer hover:text-primary",
                  isCurrent && "cursor-default",
                  isUpcoming && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "text-[11px] leading-tight block",
                    isCompleted && "text-muted-foreground",
                    isCurrent && "text-foreground font-semibold",
                    isUpcoming && "text-muted-foreground/50"
                  )}
                >
                  {session.number}. {session.title}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
