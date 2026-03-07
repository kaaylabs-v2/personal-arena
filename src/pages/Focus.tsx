import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { InsightBanner } from "@/components/InsightBanner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Zap,
  CheckCircle2,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { programs, type Trend, type FocusSkill, type FocusSession } from "@/data/programs";

// --- Helpers ---

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "improving") return <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />;
  if (trend === "declining") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function TrendLabel({ trend }: { trend: Trend }) {
  const labels: Record<Trend, string> = { improving: "Improving", declining: "Declining", stable: "Stable" };
  const colors: Record<Trend, string> = { improving: "text-[hsl(var(--success))]", declining: "text-destructive", stable: "text-muted-foreground" };
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium ${colors[trend]}`}>
      <TrendIcon trend={trend} /> {labels[trend]}
    </span>
  );
}

function TrendMicroViz({ trend }: { trend: Trend }) {
  const bars: Record<Trend, number[]> = { improving: [2, 3, 4, 5, 6], stable: [4, 4, 4, 4, 4], declining: [6, 5, 4, 3, 2] };
  const color: Record<Trend, string> = { improving: "bg-[hsl(var(--success))]", stable: "bg-muted-foreground/40", declining: "bg-destructive" };
  return (
    <div className="flex items-end gap-[2px] h-3">
      {bars[trend].map((h, i) => (
        <div key={i} className={`w-[3px] rounded-sm ${color[trend]}`} style={{ height: `${(h / 6) * 100}%` }} />
      ))}
    </div>
  );
}

function getStatusBadge(status: "critical" | "attention") {
  if (status === "critical") return { label: "Critical Gap", cls: "bg-destructive/15 text-destructive border-destructive/20" };
  return { label: "Needs Attention", cls: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20" };
}

function getIndicatorColor(status: "critical" | "attention"): string {
  return status === "critical" ? "bg-destructive" : "bg-[hsl(var(--warning))]";
}

// --- Components ---

function FocusSkillCard({ skill }: { skill: FocusSkill }) {
  const badge = getStatusBadge(skill.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl border overflow-hidden ${
        skill.status === "critical"
          ? "border-destructive/50 bg-destructive/[0.06]"
          : "border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/[0.05]"
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${getIndicatorColor(skill.status)}`} />
      <div className="pl-6 pr-5 py-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-foreground">{skill.name}</p>
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 font-medium ${badge.cls}`}>{badge.label}</Badge>
              <span className="text-[10px] font-medium text-destructive flex items-center gap-1">🎯 Focus Skill</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] text-muted-foreground">{skill.domain}</span>
              <span className="text-[11px] text-muted-foreground">Level {skill.current_level} → {skill.target_level}</span>
              <TrendLabel trend={skill.trend} />
              <TrendMicroViz trend={skill.trend} />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground tabular-nums shrink-0">{skill.progress}%</span>
        </div>
        <Progress value={skill.progress} className="h-2" />
      </div>
    </motion.div>
  );
}

function SessionCard({ session, navigate }: { session: FocusSession; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground">{session.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{session.description}</p>
        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Zap className="h-3 w-3 text-primary" /> Improves: {session.relatedSkill}
        </p>
      </div>
      <Button size="sm" onClick={() => navigate(`/arena/session/${session.id}`)}>
        Start Session <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
      </Button>
    </motion.div>
  );
}

// --- Page ---

import { useLearner } from "@/contexts/LearnerContext";

const Focus = () => {
  const navigate = useNavigate();
  const { activeProgram, setActiveProgramId } = useLearner();
  const selectedProgramId = activeProgram.id;
  const selectedProgram = activeProgram;

  return (
    <Layout pageTitle="Focus">
      <div className="max-w-4xl mx-auto px-6 py-4 space-y-6">
        {/* Program Selector */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium shrink-0">Program</span>
          <Select value={selectedProgramId} onValueChange={setActiveProgramId}>
            <SelectTrigger className="w-[220px] h-8 text-sm font-semibold border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-2">{selectedProgram.targetLearner}</span>
        </div>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <InsightBanner title="Weekly Coaching Insight">
            <p dangerouslySetInnerHTML={{ __html: selectedProgram.insightText }} />
          </InsightBanner>
        </motion.div>

        {/* Weekly Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4"
        >
          <div className="h-10 w-10 rounded-full bg-[hsl(var(--success))]/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">Weekly Progress</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You completed <strong className="text-foreground">3 Arena sessions</strong> this week · Next review in 4 days
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            <span>Week of Mar 3</span>
          </div>
        </motion.div>

        {/* Focus Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <h2 className="text-base font-bold text-foreground">Focus This Week</h2>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium bg-destructive/15 text-destructive border-destructive/20">
              {selectedProgram.focusSkills.length} skills
            </Badge>
          </div>
          <div className="space-y-3">
            {selectedProgram.focusSkills.map((skill, i) => (
              <motion.div key={skill.id} transition={{ delay: i * 0.05 }}>
                <FocusSkillCard skill={skill} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Sessions */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3 px-1">Recommended Arena Sessions</h2>
          <div className="space-y-3">
            {selectedProgram.focusSessions.map((session, i) => (
              <motion.div key={session.id} transition={{ delay: i * 0.05 }}>
                <SessionCard session={session} navigate={navigate} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;
