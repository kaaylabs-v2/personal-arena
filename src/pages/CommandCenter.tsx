import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { InsightBanner } from "@/components/InsightBanner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Play,
  Target,
  Brain,
  Zap,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Minus,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

// --- Mock Data ---

const radarData = [
  { dimension: "Clarity", score: 3.4, fullMark: 5 },
  { dimension: "Evidence", score: 2.8, fullMark: 5 },
  { dimension: "Tradeoffs", score: 3.0, fullMark: 5 },
  { dimension: "Stakeholders", score: 2.6, fullMark: 5 },
  { dimension: "Strategy", score: 3.2, fullMark: 5 },
  { dimension: "Communication", score: 3.1, fullMark: 5 },
];

const aiInsights = [
  {
    id: "1",
    type: "plateau" as const,
    title: "Plateau detected",
    description:
      "Your Evidence Evaluation skill has plateaued over the last 4 sessions.",
    action: "Run Evidence Evaluation challenge",
    actionRoute: "/arena-session",
  },
  {
    id: "2",
    type: "improvement" as const,
    title: "Improvement trend",
    description:
      "Your clarity score improved by 12% over the last two weeks.",
    action: "Continue Clarity training",
    actionRoute: "/arena-session",
  },
  {
    id: "3",
    type: "recommendation" as const,
    title: "Recommendation",
    description:
      "Try a Challenge Mode scenario focused on stakeholder conflict.",
    action: "Start Stakeholder Scenario",
    actionRoute: "/arena-session",
  },
];

const activeJourneys = [
  {
    id: "j1",
    title: "Strategic Decision Making for Senior Leaders",
    currentLevel: 1.6,
    targetLevel: 4.0,
    progress: 18,
    nextSession: "Evidence Mapping",
    category: "Decision Making",
  },
  {
    id: "j2",
    title: "Stakeholder Communication Mastery",
    currentLevel: 2.2,
    targetLevel: 4.0,
    progress: 42,
    nextSession: "Conflict Resolution Briefing",
    category: "Communication",
  },
  {
    id: "j3",
    title: "Risk Assessment & Mitigation",
    currentLevel: 1.0,
    targetLevel: 3.5,
    progress: 8,
    nextSession: "Risk Identification Basics",
    category: "Strategic Framing",
  },
];

const thinkingPatterns = [
  {
    id: "1",
    type: "caution",
    label: "Assumption Bias",
    description:
      "You tend to jump to solutions before clarifying assumptions.",
    suggestion: "Practice structured assumption mapping before each decision.",
  },
  {
    id: "2",
    type: "caution",
    label: "Stakeholder Challenge",
    description: "You rarely challenge stakeholder narratives.",
    suggestion:
      "Use the 'Devil's Advocate' framework in your next stakeholder scenario.",
  },
  {
    id: "3",
    type: "strength",
    label: "Evidence Discipline",
    description:
      "You consistently evaluate evidence before making decisions.",
    suggestion: "Build on this strength by tackling ambiguous evidence scenarios.",
  },
];

const recommendedScenarios = [
  {
    id: "s1",
    title: "Conflicting Stakeholder Priorities",
    strengthens: "Stakeholder awareness",
    difficulty: "Advanced",
  },
  {
    id: "s2",
    title: "Evidence Mapping Scenario",
    strengthens: "Evidence evaluation",
    difficulty: "Intermediate",
  },
  {
    id: "s3",
    title: "Resource Tradeoff Simulation",
    strengthens: "Strategic prioritization",
    difficulty: "Advanced",
  },
];

const timeline = [
  { week: "Week 1", label: "Decision Clarity Training", scoreGain: 0.3, completed: true },
  { week: "Week 2", label: "Stakeholder Conflict Simulation", scoreGain: 0.2, completed: true },
  { week: "Week 3", label: "Evidence Evaluation Challenge", scoreGain: 0.4, completed: true },
  { week: "Week 4", label: "Integrated Scenario", scoreGain: null, completed: false },
];

const metrics = {
  sessionsCompleted: 24,
  averageScore: 3.2,
  strongestSkill: "Clarity",
  weakestSkill: "Evidence Evaluation",
  currentLevel: 3.1,
};

// --- Helpers ---

function CircularProgress({ value, size = 40, stroke = 3 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="stroke-primary transition-all duration-500"
      />
    </svg>
  );
}

function InsightIcon({ type }: { type: string }) {
  switch (type) {
    case "plateau":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "improvement":
      return <TrendingUp className="h-4 w-4 text-success" />;
    case "recommendation":
      return <Sparkles className="h-4 w-4 text-primary" />;
    default:
      return <Sparkles className="h-4 w-4 text-primary" />;
  }
}

// --- Page ---

export default function CommandCenter() {
  const navigate = useNavigate();

  const overallProgress = ((metrics.currentLevel / 4.0) * 100);

  return (
    <Layout pageTitle="Command Center">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-display font-semibold text-foreground">Command Center</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Strategic Leadership Track</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <p className="text-muted-foreground">Current Level</p>
                <p className="font-semibold text-foreground">{metrics.currentLevel} <span className="text-muted-foreground font-normal">→ 4.0</span></p>
              </div>
              <CircularProgress value={overallProgress} size={44} stroke={3.5} />
              <div className="flex items-center gap-1 text-success text-xs font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Rising
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Row: Radar + AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1 — Decision Intelligence Radar */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Decision Intelligence Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                        tickCount={6}
                      />
                      <Radar
                        name="Current"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {radarData.map((d) => (
                    <div key={d.dimension} className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{d.dimension}</p>
                      <p className="text-sm font-semibold text-foreground">{d.score}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2 — AI Coaching Insights */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Coaching Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="rounded-lg border border-border bg-card p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <InsightIcon type={insight.type} />
                      <span className="text-xs font-semibold text-foreground">{insight.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary px-2"
                      onClick={() => navigate(insight.actionRoute)}
                    >
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section 3 — Active Mastery Journeys */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Active Mastery Journeys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeJourneys.map((journey) => (
                  <div
                    key={journey.id}
                    className="rounded-lg border border-border bg-card p-4 cursor-pointer hover:border-primary/40 transition-colors group"
                    onClick={() => navigate("/arena-session")}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-snug">{journey.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{journey.category}</p>
                      </div>
                      <CircularProgress value={journey.progress} size={36} stroke={3} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                      <span>Level {journey.currentLevel} → {journey.targetLevel}</span>
                      <span className="font-medium text-foreground">{journey.progress}%</span>
                    </div>
                    <Progress value={journey.progress} className="h-1 mb-2" />
                    <div className="flex items-center gap-1.5 text-[10px] text-primary font-medium">
                      <Play className="h-3 w-3" />
                      Next: {journey.nextSession}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Row: Thinking Patterns + Recommended Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 4 — Thinking Pattern Analysis */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Thinking Pattern Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {thinkingPatterns.map((pattern) => (
                  <div key={pattern.id} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      {pattern.type === "strength" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                      )}
                      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                        {pattern.label}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed mb-1.5">{pattern.description}</p>
                    <p className="text-[10px] text-primary leading-relaxed italic">{pattern.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 5 — Recommended Scenarios */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Recommended Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedScenarios.map((scenario) => (
                  <div key={scenario.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{scenario.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Strengthens: {scenario.strengthens} · {scenario.difficulty}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => navigate("/arena-session")}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row: Timeline + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 6 — Mastery Progress Timeline */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Mastery Progress Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-4">
                  {/* Vertical connector */}
                  <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border" />

                  {timeline.map((entry, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div className={`absolute left-[-13px] mt-1 h-5 w-5 rounded-full flex items-center justify-center border-2 ${
                        entry.completed
                          ? "bg-primary border-primary"
                          : "bg-card border-border"
                      }`}>
                        {entry.completed ? (
                          <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                        ) : (
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{entry.week}</p>
                        <p className="text-xs font-medium text-foreground">{entry.label}</p>
                        {entry.scoreGain !== null && (
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-success font-medium">
                            <TrendingUp className="h-3 w-3" />
                            +{entry.scoreGain} capability gain
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 7 — Performance Metrics */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Sessions Completed", value: metrics.sessionsCompleted },
                  { label: "Average Decision Score", value: metrics.averageScore },
                  { label: "Strongest Skill", value: metrics.strongestSkill },
                  { label: "Weakest Skill", value: metrics.weakestSkill },
                  { label: "Current Mastery Level", value: metrics.currentLevel },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-sm font-semibold text-foreground">{m.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
