import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScoreDimensions {
  clarity: number;
  evidenceUse: number;
  tradeoffThinking: number;
  strategicFraming: number;
}

export interface ReasoningScoreData {
  total: number;
  max: number;
  dimensions: ScoreDimensions;
  dimensionMax: number;
}

const dimensionLabels: Record<keyof ScoreDimensions, string> = {
  clarity: "Clarity",
  evidenceUse: "Show Your Work",
  tradeoffThinking: "Tradeoff Thinking",
  strategicFraming: "Strategic Framing",
};

interface ReasoningScoreIndicatorProps {
  score: ReasoningScoreData;
  compact?: boolean;
}

export const ReasoningScoreIndicator = ({ score, compact = true }: ReasoningScoreIndicatorProps) => {
  const pct = (score.total / score.max) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Brain className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Think It Through Score
        </span>
      </div>
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <motion.span
          key={score.total}
          initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
          animate={{ scale: 1, color: "hsl(var(--foreground))" }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold font-display tabular-nums"
        >
          {score.total}
          <span className="text-muted-foreground font-normal"> / {score.max}</span>
        </motion.span>
      </div>
    </div>
  );
};

interface ScoreUpdateToastProps {
  totalDelta: number;
  dimensionDeltas: Partial<ScoreDimensions>;
}

export const ScoreUpdateBadge = ({ totalDelta, dimensionDeltas }: ScoreUpdateToastProps) => {
  const entries = Object.entries(dimensionDeltas).filter(([, v]) => v && v > 0) as [keyof ScoreDimensions, number][];
  if (totalDelta <= 0 && entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="mt-2 flex flex-wrap items-center gap-1.5"
    >
      {totalDelta > 0 && (
        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          Think It Through Score +{totalDelta}
        </span>
      )}
      {entries.map(([key, val]) => (
        <span key={key} className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {dimensionLabels[key]} +{val}
        </span>
      ))}
    </motion.div>
  );
};

interface ReasoningBreakdownProps {
  score: ReasoningScoreData;
}

export const ReasoningBreakdown = ({ score }: ReasoningBreakdownProps) => {
  const entries = Object.entries(score.dimensions) as [keyof ScoreDimensions, number][];

  return (
    <div className="space-y-3">
      {entries.map(([key, val]) => {
        const pct = (val / score.dimensionMax) * 100;
        return (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{dimensionLabels[key]}</span>
              <span className="text-muted-foreground tabular-nums">
                {val} / {score.dimensionMax}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={cn(
                  "h-full rounded-full",
                  pct >= 75 ? "bg-primary" : pct >= 50 ? "bg-accent" : "bg-warning"
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
