import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { InsightBanner } from "@/components/InsightBanner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Play,
  ArrowRight,
  Info,
  Clock,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import {
  programs,
  getDomainProgress,
  getDomainLevel,
  getCapabilityProgress,
  getSkillStatus,
  getStatusBadge,
  getIndicatorColor,
  GAP_THRESHOLD,
  type Domain,
  type Capability,
  type Trend,
} from "@/data/programs";

// --- Sub-Components ---

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

function CircularProgress({ value, size = 44, strokeWidth = 3.5 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--progress-track))" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} className="transition-all duration-700" />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">{value}%</text>
    </svg>
  );
}

function DimensionItem({ domain, isSelected, onClick }: { domain: Domain; isSelected: boolean; onClick: () => void }) {
  const progress = getDomainProgress(domain);
  const avgLevel = getDomainLevel(domain);
  const gapCount = domain.capabilities.filter((c) => getCapabilityProgress(c) < GAP_THRESHOLD).length;

  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 p-4 rounded-xl text-left transition-all ${
        isSelected
          ? "bg-accent border border-primary/20 shadow-sm"
          : "bg-card border border-border hover:bg-muted/40"
      }`}
      whileHover={{ x: isSelected ? 0 : 2 }}
      transition={{ duration: 0.15 }}
    >
      <CircularProgress value={progress} size={48} strokeWidth={4} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold truncate ${isSelected ? "text-accent-foreground" : "text-card-foreground"}`}>
            {domain.domain_name}
          </p>
          {gapCount > 0 && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium bg-destructive/15 text-destructive border-destructive/20 shrink-0">
              {gapCount} gap{gapCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">Level {avgLevel} · {domain.capabilities.length} skills</p>
      </div>
    </motion.button>
  );
}

function TrendMicroViz({ trend }: { trend: Trend }) {
  const bars: Record<Trend, number[]> = {
    improving: [2, 3, 4, 5, 6],
    stable: [4, 4, 4, 4, 4],
    declining: [6, 5, 4, 3, 2],
  };
  const color: Record<Trend, string> = {
    improving: "bg-[hsl(var(--success))]",
    stable: "bg-muted-foreground/40",
    declining: "bg-destructive",
  };
  return (
    <div className="flex items-end gap-[2px] h-3">
      {bars[trend].map((h, i) => (
        <div key={i} className={`w-[3px] rounded-sm ${color[trend]}`} style={{ height: `${(h / 6) * 100}%` }} />
      ))}
    </div>
  );
}

function SkillRow({ capability, navigate, capRef }: { capability: Capability; navigate: ReturnType<typeof useNavigate>; capRef?: React.RefObject<HTMLDivElement> }) {
  const progress = getCapabilityProgress(capability);
  const status = getSkillStatus(progress, capability.trend);
  const badge = getStatusBadge(status);
  const isWeak = status === "critical" || status === "attention";

  return (
    <motion.div
      ref={capRef}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-lg border overflow-hidden transition-all ${
        status === "critical"
          ? "border-destructive/50 bg-destructive/[0.06]"
          : status === "attention"
          ? "border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/[0.05]"
          : "border-border bg-card"
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${getIndicatorColor(status)}`} />

      <div className="pl-6 pr-4 py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-semibold ${isWeak ? "text-foreground" : "text-card-foreground"}`}>
                {capability.capability_name}
              </p>
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 font-medium ${badge.cls}`}>
                {badge.label}
              </Badge>
              {isWeak && (
                <span className="text-[10px] font-medium text-destructive flex items-center gap-1">
                  🎯 Focus Skill
                </span>
              )}
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[240px] text-xs">
                    {capability.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] text-muted-foreground">
                Level {capability.current_level} → {capability.target_level}
              </span>
              <TrendLabel trend={capability.trend} />
              <TrendMicroViz trend={capability.trend} />
            </div>
          </div>
          <span className="text-lg font-bold text-foreground tabular-nums shrink-0">{progress}%</span>
        </div>

        <Progress value={progress} className="h-2" />

        {isWeak && capability.recommended_sessions.length > 0 && (
          <div className="pt-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
              <Play className="h-2.5 w-2.5" /> Recommended Practice
            </p>
            <div className="space-y-1">
              {capability.recommended_sessions.map((rs) => (
                <button
                  key={rs.id}
                  onClick={() => navigate(`/arena/session/${rs.id}`)}
                  className="w-full text-left text-[11px] text-primary hover:text-primary/80 hover:underline flex items-center gap-1.5 py-0.5"
                >
                  <ArrowRight className="h-2.5 w-2.5 shrink-0" />{rs.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {capability.past_sessions.length > 0 && (
          <div className="pt-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" /> Recent Sessions
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {capability.past_sessions.map((ps, i) => (
                <p key={i} className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />{ps.title}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Page ---

import { useLearner } from "@/contexts/LearnerContext";

const SkillMap = () => {
  const navigate = useNavigate();
  const { activeProgram, setActiveProgramId } = useLearner();
  const selectedProgramId = activeProgram.id;
  const selectedProgram = activeProgram;
  const domains = selectedProgram.domains;

  const [selectedDomainId, setSelectedDomainId] = useState<string>(domains[0]?.domain_id || "");

  useEffect(() => {
    setSelectedDomainId(domains[0]?.domain_id || "");
  }, [activeProgram.id]);

  const allCapabilityNames = domains.flatMap((d) => d.capabilities.map((c) => c.capability_name));
  const capRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>(
    Object.fromEntries(allCapabilityNames.map((name) => [name, { current: null } as React.RefObject<HTMLDivElement>]))
  ).current;

  const selectedDomain = domains.find((d) => d.domain_id === selectedDomainId) || domains[0];

  const scrollToCapability = useCallback((capName: string) => {
    const domain = domains.find((d) => d.capabilities.some((c) => c.capability_name === capName));
    if (!domain) return;
    setSelectedDomainId(domain.domain_id);
    setTimeout(() => {
      const ref = capRefs[capName];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.classList.add("ring-2", "ring-primary/50");
        setTimeout(() => ref.current?.classList.remove("ring-2", "ring-primary/50"), 2000);
      }
    }, 350);
  }, [capRefs, domains]);

  const handleProgramChange = (programId: string) => {
    setActiveProgramId(programId);
  };

  // Dynamic insight capabilities: pick top 3 weakest skills
  const weakSkills = domains
    .flatMap((d) => d.capabilities)
    .filter((c) => getCapabilityProgress(c) < GAP_THRESHOLD)
    .sort((a, b) => getCapabilityProgress(a) - getCapabilityProgress(b))
    .slice(0, 3)
    .map((c) => c.capability_name);

  return (
    <Layout pageTitle="Skill Map">
      <div className="max-w-6xl mx-auto px-6 py-4 space-y-4">
        {/* Program Selector + Context */}
        <div className="flex items-center gap-4 flex-wrap rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Program</span>
          </div>
          <Select value={selectedProgramId} onValueChange={handleProgramChange}>
            <SelectTrigger className="w-[220px] h-9 text-sm font-semibold border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                  <span className="text-muted-foreground text-[10px] ml-2">· {p.targetLearner}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-4 w-px bg-border mx-1" />
          <p className="text-xs text-muted-foreground">
            {selectedProgram.description}
            <span className="mx-2 text-border">·</span>
            <span className="font-medium text-foreground">Level {selectedProgram.current_level}</span>
            <span className="text-muted-foreground"> → {selectedProgram.target_level}</span>
          </p>
        </div>

        {/* AI Insight Banner */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <InsightBanner title="AI Insight">
            <p dangerouslySetInnerHTML={{ __html: selectedProgram.insightText }} />
            {weakSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {weakSkills.map((r) => (
                  <button key={r} onClick={() => scrollToCapability(r)} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors cursor-pointer">
                    {r}
                  </button>
                ))}
              </div>
            )}
          </InsightBanner>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,35%)_1fr] gap-6">
          {/* Left Column */}
          <div className="flex flex-col">
            <div className="space-y-2 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">
                Capability Dimensions
              </p>
              {domains.map((domain, i) => (
                <motion.div
                  key={domain.domain_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <DimensionItem
                    domain={domain}
                    isSelected={selectedDomainId === domain.domain_id}
                    onClick={() => setSelectedDomainId(domain.domain_id)}
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2.5 px-1">
                Your Active Programs
              </p>
              <div className="space-y-1">
                {programs.map((program) => (
                  <button
                    key={program.id}
                    onClick={() => handleProgramChange(program.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      selectedProgramId === program.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 truncate">{program.name}</span>
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          {selectedDomain && (
            <div className="min-w-0">
              <div className="mb-4 p-4 rounded-xl bg-card border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      {selectedProgram.name} Progress
                    </p>
                    <h2 className="text-base font-bold text-card-foreground">{selectedDomain.domain_name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedDomain.description}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground tabular-nums">{getDomainProgress(selectedDomain)}%</p>
                      <p className="text-[10px] text-muted-foreground">Capability Strength</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground tabular-nums">{selectedDomain.capabilities.length}</p>
                      <p className="text-[10px] text-muted-foreground">Skills</p>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDomain.domain_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5"
                >
                  {selectedDomain.capabilities.map((cap) => (
                    <SkillRow
                      key={cap.capability_id}
                      capability={cap}
                      navigate={navigate}
                      capRef={capRefs[cap.capability_name] as React.RefObject<HTMLDivElement>}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {!selectedDomain && (
            <div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
              No dimensions available for this program yet.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SkillMap;
