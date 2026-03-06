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
} from "lucide-react";
import { Layout } from "@/components/Layout";

type DimScore = { score: number; label: string };
type Scores = Record<string, DimScore>;

const StartingPoint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scores, topic, intent } = (location.state as {
    scores?: Scores;
    topic?: string;
    intent?: string;
  }) || {};

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

  // Find the weakest capability for first practice
  const weakest = sorted[sorted.length - 1];

  return (
    <Layout pageTitle="Your Starting Point">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Your Starting Point
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Based on your responses, here's where you stand in{" "}
              <span className="text-foreground font-medium">{topic}</span>.
            </p>
          </div>

          {/* Level summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Current Level
              </p>
              <p className="text-2xl font-display font-bold text-foreground">{avgScore}</p>
              <p className="text-xs text-primary font-medium">{currentLabel}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Target Level
              </p>
              <p className="text-2xl font-display font-bold text-foreground">{targetLevel}</p>
              <p className="text-xs text-muted-foreground font-medium">Advanced</p>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Capability Dimensions
            </h3>
            <div className="space-y-4">
              {entries.map(([name, dim], i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-card-foreground font-medium">{name}</span>
                    <span className="text-muted-foreground">
                      {dim.score} · <span className={
                        dim.label === "Strong"
                          ? "text-primary"
                          : dim.label === "Developing"
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }>{dim.label}</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(dim.score / targetLevel) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strengths & Focus Areas */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-xs font-semibold text-card-foreground mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Strengths
              </h4>
              <ul className="space-y-2">
                {strengths.map(([name, dim]) => (
                  <li key={name} className="text-xs text-muted-foreground">
                    <span className="text-card-foreground font-medium">{name}</span>
                    <span className="ml-1.5 text-primary">{dim.score}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-xs font-semibold text-card-foreground mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" /> Focus Areas
              </h4>
              <ul className="space-y-2">
                {focusAreas.map(([name, dim]) => (
                  <li key={name} className="text-xs text-muted-foreground">
                    <span className="text-card-foreground font-medium">{name}</span>
                    <span className="ml-1.5">{dim.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* First practice CTA */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Your first practice will target{" "}
                  <span className="text-primary font-semibold">{weakest[0]}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Arena will start with a scenario designed to strengthen your
                  weakest capability dimension.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() =>
              navigate("/arena-session", {
                state: { focusDimension: weakest[0], topic, intent },
              })
            }
            className="w-full"
          >
            Begin First Practice <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StartingPoint;
