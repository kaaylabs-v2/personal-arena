import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp,
  Shield,
  Eye,
  Lightbulb,
  Search,
  GitFork,
  RotateCcw,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { useLearner } from "@/contexts/LearnerContext";

type DimScore = { score: number; label: string };
type Scores = Record<string, DimScore>;

const DIMENSION_ICONS: Record<string, React.ElementType> = {
  Clarity: Eye,
  Reasoning: Lightbulb,
  "Show Your Work": Search,
  "Alternatives Exploration": GitFork,
  Reflection: RotateCcw,
};

const StartingPoint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProgram } = useLearner();
  const { scores, topic, intent } = (location.state as {
    scores?: Scores;
    topic?: string;
    intent?: string;
  }) || {};
  const activeTopic = activeProgram.name || topic || intent || "Leadership";

  if (!scores) {
    return (
      <Layout pageTitle="Starting Point">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground">No assessment data found.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  const entries = Object.entries(scores) as [string, DimScore][];
  const avgScore = Math.round((entries.reduce((s, [, v]) => s + v.score, 0) / entries.length) * 10) / 10;
  const currentLabel = avgScore >= 3.5 ? "Advanced" : avgScore >= 2.5 ? "Developing" : "Emerging";
  const targetLevel = 4.0;

  const sorted = [...entries].sort((a, b) => b[1].score - a[1].score);
  const strengths = sorted.slice(0, 2);
  const focusAreas = sorted.slice(-2).reverse();
  const weakest = sorted[sorted.length - 1];

  // Circular score indicator
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const scorePercent = avgScore / 5; // out of 5.0

  return (
    <Layout pageTitle="Your Starting Point">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero with score ring */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative inline-flex items-center justify-center mb-5"
            >
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <motion.circle
                  cx="50" cy="50" r={r} fill="none"
                  stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - scorePercent) }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-2xl font-display font-bold text-foreground"
                >
                  {avgScore}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-[10px] text-primary font-semibold uppercase tracking-wider"
                >
                  {currentLabel}
                </motion.span>
              </div>
            </motion.div>

            <h1 className="text-xl font-display font-bold text-foreground mb-1">
              Your Starting Point in {activeTopic}
            </h1>
            <p className="text-sm text-muted-foreground">
              Target: <span className="text-foreground font-semibold">{targetLevel}</span> (Advanced)
            </p>
          </div>

          {/* Dimension breakdown — with icons and bars */}
          <div className="rounded-xl border border-border bg-card p-5 mb-5">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Capability Profile
            </h3>
            <div className="space-y-4">
              {entries.map(([name, dim], i) => {
                const Icon = DIMENSION_ICONS[name] || Eye;
                const isStrength = strengths.some(([n]) => n === name);
                const isFocus = focusAreas.some(([n]) => n === name);
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="text-xs font-medium text-card-foreground flex-1">{name}</span>
                      <span className="text-xs text-muted-foreground">
                        {dim.score}
                        {isStrength && <span className="ml-1.5 text-primary text-[10px]">▲ Strength</span>}
                        {isFocus && <span className="ml-1.5 text-warning text-[10px]">● Focus</span>}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden ml-6">
                      <motion.div
                        className={`h-full rounded-full ${isFocus ? "bg-warning/70" : "bg-primary"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(dim.score / 5) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Focus Areas cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-primary" /> Strengths
              </h4>
              <ul className="space-y-2.5">
                {strengths.map(([name, dim]) => {
                  const Icon = DIMENSION_ICONS[name] || Eye;
                  return (
                    <li key={name} className="flex items-center gap-2">
                      <Icon className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="text-xs text-card-foreground font-medium flex-1">{name}</span>
                      <span className="text-xs text-primary font-semibold">{dim.score}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-warning" /> Focus Areas
              </h4>
              <ul className="space-y-2.5">
                {focusAreas.map(([name, dim]) => {
                  const Icon = DIMENSION_ICONS[name] || Eye;
                  return (
                    <li key={name} className="flex items-center gap-2">
                      <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-card-foreground font-medium flex-1">{name}</span>
                      <span className="text-xs text-muted-foreground font-semibold">{dim.score}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>

          {/* First practice callout */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-5"
          >
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Your first practice targets{" "}
                  <span className="text-primary font-semibold">{weakest[0]}</span>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Arena will present a scenario designed to strengthen your weakest dimension.
                  You'll work through structured reasoning stages with coaching support.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Button
              onClick={() =>
                navigate("/arena-session", {
                  state: { focusDimension: weakest[0], topic: activeTopic, intent },
                })
              }
              className="w-full"
            >
              Begin First Practice <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StartingPoint;
