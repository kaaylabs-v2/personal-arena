import { useState, useRef, useCallback } from "react";
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
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  ArrowRight,
  Info,
  Clock,
} from "lucide-react";

// --- Data Model ---

type Trend = "improving" | "declining" | "stable";

interface RecommendedSession {
  id: string;
  title: string;
}

interface PastSession {
  title: string;
}

interface Capability {
  capability_id: string;
  domain_id: string;
  capability_name: string;
  description: string;
  current_level: number;
  target_level: number;
  trend: Trend;
  recommended_sessions: RecommendedSession[];
  past_sessions: PastSession[];
}

interface Domain {
  domain_id: string;
  domain_name: string;
  description: string;
  capabilities: Capability[];
}

// --- Mock Data ---

const GAP_THRESHOLD = 50;
const CRITICAL_THRESHOLD = 40;

const domains: Domain[] = [
  {
    domain_id: "d1",
    domain_name: "Decision Making",
    description: "Structured reasoning and evidence-based judgment",
    capabilities: [
      {
        capability_id: "c1", domain_id: "d1", capability_name: "Evidence Evaluation",
        description: "Ability to support decisions with data and distinguish assumptions from evidence.",
        current_level: 1.8, target_level: 4.0, trend: "improving",
        recommended_sessions: [
          { id: "conflicting-stakeholder-scenario", title: "Conflicting Stakeholder Scenario" },
          { id: "executive-escalation-analysis", title: "Executive Escalation Analysis" },
        ],
        past_sessions: [{ title: "Distributed Team Communication" }, { title: "Executive Escalation" }],
      },
      {
        capability_id: "c2", domain_id: "d1", capability_name: "Tradeoff Analysis",
        description: "Evaluating competing priorities and making balanced decisions under constraints.",
        current_level: 2.6, target_level: 4.0, trend: "stable",
        recommended_sessions: [{ id: "resource-allocation-challenge", title: "Resource Allocation Challenge" }],
        past_sessions: [{ title: "Identifying Tradeoffs" }, { title: "Stakeholder Conflict Scenario" }],
      },
      {
        capability_id: "c3", domain_id: "d1", capability_name: "Risk Framing",
        description: "Identifying, assessing, and communicating risk to inform strategic choices.",
        current_level: 2.0, target_level: 4.0, trend: "improving",
        recommended_sessions: [{ id: "probability-estimation-drill", title: "Probability Estimation Drill" }],
        past_sessions: [{ title: "Risk Identification" }],
      },
      {
        capability_id: "c4", domain_id: "d1", capability_name: "Strategic Prioritization",
        description: "Aligning competing demands with strategic objectives to maximize impact.",
        current_level: 3.2, target_level: 4.5, trend: "improving",
        recommended_sessions: [{ id: "portfolio-balancing", title: "Portfolio Balancing" }],
        past_sessions: [{ title: "Urgency vs Importance" }, { title: "MoSCoW Method" }],
      },
      {
        capability_id: "c5", domain_id: "d1", capability_name: "Data-Driven Judgment",
        description: "Using quantitative and qualitative data to ground decisions and reduce bias.",
        current_level: 1.4, target_level: 4.0, trend: "declining",
        recommended_sessions: [{ id: "reading-dashboards", title: "Reading Dashboards" }, { id: "bias-in-data", title: "Bias in Data" }],
        past_sessions: [],
      },
    ],
  },
  {
    domain_id: "d2",
    domain_name: "Stakeholder Leadership",
    description: "Influence, alignment, and managing complex stakeholder dynamics",
    capabilities: [
      { capability_id: "c6", domain_id: "d2", capability_name: "Stakeholder Mapping", description: "Identifying key stakeholders, their interests, and influence on outcomes.", current_level: 3.0, target_level: 4.5, trend: "stable", recommended_sessions: [{ id: "coalition-building", title: "Coalition Building" }], past_sessions: [{ title: "Mapping Stakeholders" }, { title: "Interest Analysis" }] },
      { capability_id: "c7", domain_id: "d2", capability_name: "Conflict Resolution", description: "Navigating disagreements and finding constructive paths forward.", current_level: 2.2, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c8", domain_id: "d2", capability_name: "Executive Communication", description: "Presenting ideas clearly and persuasively to senior leaders.", current_level: 2.8, target_level: 4.5, trend: "improving", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "d3",
    domain_name: "Organizational Thinking",
    description: "Systems perspective and cross-functional awareness",
    capabilities: [
      { capability_id: "c9", domain_id: "d3", capability_name: "Systems Thinking", description: "Understanding interdependencies and second-order effects across the organization.", current_level: 2.1, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c10", domain_id: "d3", capability_name: "Cross-Functional Alignment", description: "Building shared understanding and coordinated action across teams.", current_level: 2.5, target_level: 4.0, trend: "improving", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c11", domain_id: "d3", capability_name: "Change Navigation", description: "Leading through uncertainty and helping teams adapt to shifting contexts.", current_level: 1.9, target_level: 3.5, trend: "declining", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "d4",
    domain_name: "Communication Leadership",
    description: "Clarity, persuasion, and adaptive messaging",
    capabilities: [
      { capability_id: "c12", domain_id: "d4", capability_name: "Adaptive Messaging", description: "Tailoring communication style and content to different audiences and contexts.", current_level: 3.4, target_level: 4.5, trend: "improving", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c13", domain_id: "d4", capability_name: "Narrative Framing", description: "Structuring compelling narratives that drive alignment and action.", current_level: 2.7, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "d5",
    domain_name: "Strategic Framing",
    description: "Vision articulation and strategic context setting",
    capabilities: [
      { capability_id: "c14", domain_id: "d5", capability_name: "Vision Articulation", description: "Crafting and communicating a clear, inspiring vision that guides strategic direction.", current_level: 2.0, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c15", domain_id: "d5", capability_name: "Context Setting", description: "Establishing the strategic landscape so teams can make informed decisions independently.", current_level: 2.3, target_level: 4.0, trend: "declining", recommended_sessions: [], past_sessions: [] },
    ],
  },
];

// --- Helpers ---

function getDomainProgress(domain: Domain): number {
  const caps = domain.capabilities;
  if (caps.length === 0) return 0;
  return Math.round(caps.reduce((sum, c) => sum + (c.current_level / c.target_level) * 100, 0) / caps.length);
}

function getDomainLevel(domain: Domain): number {
  const caps = domain.capabilities;
  if (caps.length === 0) return 0;
  return +(caps.reduce((s, c) => s + c.current_level, 0) / caps.length).toFixed(1);
}

function getCapabilityProgress(cap: Capability): number {
  return Math.round((cap.current_level / cap.target_level) * 100);
}

type SkillStatus = "critical" | "attention" | "healthy" | "stable";

function getSkillStatus(progress: number, trend: Trend): SkillStatus {
  if (progress < CRITICAL_THRESHOLD) return "critical";
  if (progress < GAP_THRESHOLD) return "attention";
  if (trend === "improving" || progress >= 70) return "healthy";
  return "stable";
}

function getStatusBadge(status: SkillStatus) {
  switch (status) {
    case "critical":
      return { label: "Critical Gap", cls: "bg-destructive/15 text-destructive border-destructive/20" };
    case "attention":
      return { label: "Needs Attention", cls: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20" };
    case "healthy":
      return { label: "Healthy", cls: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" };
    case "stable":
      return { label: "Stable", cls: "bg-muted text-muted-foreground border-border" };
  }
}

function getIndicatorColor(status: SkillStatus): string {
  switch (status) {
    case "critical": return "bg-destructive";
    case "attention": return "bg-[hsl(var(--warning))]";
    case "healthy": return "bg-[hsl(var(--success))]";
    case "stable": return "bg-muted-foreground/30";
  }
}

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

// Left column dimension item
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

// Right column skill row
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
      {/* Left status indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${getIndicatorColor(status)}`} />

      <div className="pl-6 pr-4 py-4 space-y-3">
        {/* Header row */}
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
            {/* Status + Level + Trend row */}
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

        {/* Progress bar */}
        <Progress value={progress} className="h-2" />

        {/* Recommended Practice for weak skills */}
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

        {/* Past sessions */}
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

const allCapabilityNames = domains.flatMap((d) => d.capabilities.map((c) => c.capability_name));

const SkillMap = () => {
  const navigate = useNavigate();
  const [selectedDomainId, setSelectedDomainId] = useState<string>(domains[0].domain_id);

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
  }, [capRefs]);

  const insightCapabilities = ["Evidence Evaluation", "Data-Driven Judgment", "Context Setting"];

  return (
    <Layout pageTitle="Skill Map">
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* AI Insight Banner */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-5">
          <InsightBanner title="AI Insight">
            <p>Your <strong>Evidence Evaluation</strong> and <strong>Data-Driven Judgment</strong> capabilities need attention — both are below the mastery threshold.</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {insightCapabilities.map((r) => (
                <button key={r} onClick={() => scrollToCapability(r)} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors cursor-pointer">
                  {r}
                </button>
              ))}
            </div>
          </InsightBanner>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,35%)_1fr] gap-6">
          {/* Left Column — Capability Dimensions */}
          <div className="space-y-2">
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

          {/* Right Column — Skill Details */}
          <div className="min-w-0">
            {/* Dimension Summary Header */}
            <div className="mb-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between gap-4">
                <div>
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
        </div>
      </div>
    </Layout>
  );
};

export default SkillMap;
