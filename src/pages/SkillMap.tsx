import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { InsightBanner } from "@/components/InsightBanner";
import { Progress } from "@/components/ui/progress";
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
  ChevronRight,
  ChevronDown,
  Play,
  BookOpen,
  ArrowRight,
  Info,
  AlertTriangle,
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

interface Session {
  session_id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface Journey {
  journey_id: string;
  capability_id: string;
  journey_title: string;
  progress: number;
  next_session: string;
  focus_area: string;
  active: boolean;
  sessions: Session[];
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
  journeys: Journey[];
}

interface Domain {
  domain_id: string;
  domain_name: string;
  description: string;
  capabilities: Capability[];
}

// --- Mock Data ---

const GAP_THRESHOLD = 50; // percentage below which a skill is "gap highlighted"

const domains: Domain[] = [
  {
    domain_id: "d1",
    domain_name: "Decision Making",
    description: "Structured reasoning and evidence-based judgment",
    capabilities: [
      {
        capability_id: "c1",
        domain_id: "d1",
        capability_name: "Evidence Evaluation",
        description: "Ability to support decisions with data and distinguish assumptions from evidence.",
        current_level: 1.8,
        target_level: 4.0,
        trend: "improving",
        recommended_sessions: [
          { id: "conflicting-stakeholder-scenario", title: "Conflicting Stakeholder Scenario" },
          { id: "executive-escalation-analysis", title: "Executive Escalation Analysis" },
        ],
        past_sessions: [
          { title: "Distributed Team Communication" },
          { title: "Executive Escalation" },
        ],
        journeys: [
          {
            journey_id: "j1", capability_id: "c1", journey_title: "Evidence Evaluation Foundations",
            progress: 25, next_session: "Core Evidence Principles", focus_area: "Fundamentals", active: true,
            sessions: [
              { session_id: "s1", title: "Introduction to Evidence", status: "completed" },
              { session_id: "s2", title: "Core Evidence Principles", status: "current" },
              { session_id: "s3", title: "Evaluating Sources", status: "upcoming" },
              { session_id: "s4", title: "Evidence Synthesis", status: "upcoming" },
            ],
          },
          {
            journey_id: "j2", capability_id: "c1", journey_title: "Evidence Mapping in Complex Decisions",
            progress: 0, next_session: "Evidence Mapping Scenario", focus_area: "Applied Practice", active: false,
            sessions: [
              { session_id: "s5", title: "Evidence Mapping Scenario", status: "upcoming" },
              { session_id: "s6", title: "Multi-Source Analysis", status: "upcoming" },
              { session_id: "s7", title: "Conflicting Data Points", status: "upcoming" },
            ],
          },
          {
            journey_id: "j3", capability_id: "c1", journey_title: "Conflicting Evidence Scenarios",
            progress: 0, next_session: "Conflicting Narratives", focus_area: "Advanced", active: false,
            sessions: [
              { session_id: "s8", title: "Conflicting Narratives", status: "upcoming" },
              { session_id: "s9", title: "Stakeholder Evidence Gaps", status: "upcoming" },
            ],
          },
        ],
      },
      {
        capability_id: "c2",
        domain_id: "d1",
        capability_name: "Tradeoff Analysis",
        description: "Evaluating competing priorities and making balanced decisions under constraints.",
        current_level: 2.6,
        target_level: 4.0,
        trend: "stable",
        recommended_sessions: [
          { id: "resource-allocation-challenge", title: "Resource Allocation Challenge" },
        ],
        past_sessions: [
          { title: "Identifying Tradeoffs" },
          { title: "Stakeholder Conflict Scenario" },
        ],
        journeys: [
          {
            journey_id: "j4", capability_id: "c2", journey_title: "Tradeoff Fundamentals",
            progress: 50, next_session: "Cost-Benefit Framing", focus_area: "Core Skills", active: true,
            sessions: [
              { session_id: "s10", title: "Identifying Tradeoffs", status: "completed" },
              { session_id: "s11", title: "Cost-Benefit Framing", status: "current" },
              { session_id: "s12", title: "Stakeholder Impact", status: "upcoming" },
              { session_id: "s13", title: "Decision Matrix", status: "upcoming" },
            ],
          },
        ],
      },
      {
        capability_id: "c3",
        domain_id: "d1",
        capability_name: "Risk Framing",
        description: "Identifying, assessing, and communicating risk to inform strategic choices.",
        current_level: 2.0,
        target_level: 4.0,
        trend: "improving",
        recommended_sessions: [
          { id: "probability-estimation-drill", title: "Probability Estimation Drill" },
        ],
        past_sessions: [
          { title: "Risk Identification" },
        ],
        journeys: [
          {
            journey_id: "j5", capability_id: "c3", journey_title: "Risk Assessment Basics",
            progress: 33, next_session: "Probability Estimation", focus_area: "Foundations", active: true,
            sessions: [
              { session_id: "s14", title: "Risk Identification", status: "completed" },
              { session_id: "s15", title: "Probability Estimation", status: "current" },
              { session_id: "s16", title: "Impact Analysis", status: "upcoming" },
            ],
          },
        ],
      },
      {
        capability_id: "c4",
        domain_id: "d1",
        capability_name: "Strategic Prioritization",
        description: "Aligning competing demands with strategic objectives to maximize impact.",
        current_level: 3.2,
        target_level: 4.5,
        trend: "improving",
        recommended_sessions: [
          { id: "portfolio-balancing", title: "Portfolio Balancing" },
        ],
        past_sessions: [
          { title: "Urgency vs Importance" },
          { title: "MoSCoW Method" },
        ],
        journeys: [
          {
            journey_id: "j6", capability_id: "c4", journey_title: "Priority Frameworks",
            progress: 60, next_session: "Weighted Scoring", focus_area: "Frameworks", active: true,
            sessions: [
              { session_id: "s17", title: "Urgency vs Importance", status: "completed" },
              { session_id: "s18", title: "MoSCoW Method", status: "completed" },
              { session_id: "s19", title: "Weighted Scoring", status: "current" },
              { session_id: "s20", title: "Strategic Alignment", status: "upcoming" },
              { session_id: "s21", title: "Portfolio Balancing", status: "upcoming" },
            ],
          },
        ],
      },
      {
        capability_id: "c5",
        domain_id: "d1",
        capability_name: "Data-Driven Judgment",
        description: "Using quantitative and qualitative data to ground decisions and reduce bias.",
        current_level: 1.4,
        target_level: 4.0,
        trend: "declining",
        recommended_sessions: [
          { id: "reading-dashboards", title: "Reading Dashboards" },
          { id: "bias-in-data", title: "Bias in Data" },
        ],
        past_sessions: [],
        journeys: [
          {
            journey_id: "j7", capability_id: "c5", journey_title: "Data Literacy for Leaders",
            progress: 10, next_session: "Reading Dashboards", focus_area: "Literacy", active: true,
            sessions: [
              { session_id: "s22", title: "Reading Dashboards", status: "current" },
              { session_id: "s23", title: "Statistical Thinking", status: "upcoming" },
              { session_id: "s24", title: "Bias in Data", status: "upcoming" },
            ],
          },
        ],
      },
    ],
  },
  {
    domain_id: "d2",
    domain_name: "Stakeholder Leadership",
    description: "Influence, alignment, and managing complex stakeholder dynamics",
    capabilities: [
      {
        capability_id: "c6",
        domain_id: "d2",
        capability_name: "Stakeholder Mapping",
        description: "Identifying key stakeholders, their interests, and influence on outcomes.",
        current_level: 3.0,
        target_level: 4.5,
        trend: "stable",
        recommended_sessions: [
          { id: "coalition-building", title: "Coalition Building" },
        ],
        past_sessions: [
          { title: "Mapping Stakeholders" },
          { title: "Interest Analysis" },
        ],
        journeys: [
          {
            journey_id: "j8", capability_id: "c6", journey_title: "Stakeholder Influence Strategies",
            progress: 45, next_session: "Power Dynamics", focus_area: "Influence", active: true,
            sessions: [
              { session_id: "s25", title: "Mapping Stakeholders", status: "completed" },
              { session_id: "s26", title: "Interest Analysis", status: "completed" },
              { session_id: "s27", title: "Power Dynamics", status: "current" },
              { session_id: "s28", title: "Coalition Building", status: "upcoming" },
            ],
          },
        ],
      },
      {
        capability_id: "c7",
        domain_id: "d2",
        capability_name: "Conflict Resolution",
        description: "Navigating disagreements and finding constructive paths forward.",
        current_level: 2.2,
        target_level: 4.0,
        trend: "stable",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
      {
        capability_id: "c8",
        domain_id: "d2",
        capability_name: "Executive Communication",
        description: "Presenting ideas clearly and persuasively to senior leaders.",
        current_level: 2.8,
        target_level: 4.5,
        trend: "improving",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
    ],
  },
  {
    domain_id: "d3",
    domain_name: "Organizational Thinking",
    description: "Systems perspective and cross-functional awareness",
    capabilities: [
      {
        capability_id: "c9",
        domain_id: "d3",
        capability_name: "Systems Thinking",
        description: "Understanding interdependencies and second-order effects across the organization.",
        current_level: 2.1,
        target_level: 4.0,
        trend: "stable",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
      {
        capability_id: "c10",
        domain_id: "d3",
        capability_name: "Cross-Functional Alignment",
        description: "Building shared understanding and coordinated action across teams.",
        current_level: 2.5,
        target_level: 4.0,
        trend: "improving",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
      {
        capability_id: "c11",
        domain_id: "d3",
        capability_name: "Change Navigation",
        description: "Leading through uncertainty and helping teams adapt to shifting contexts.",
        current_level: 1.9,
        target_level: 3.5,
        trend: "declining",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
    ],
  },
  {
    domain_id: "d4",
    domain_name: "Communication Leadership",
    description: "Clarity, persuasion, and adaptive messaging",
    capabilities: [
      {
        capability_id: "c12",
        domain_id: "d4",
        capability_name: "Adaptive Messaging",
        description: "Tailoring communication style and content to different audiences and contexts.",
        current_level: 3.4,
        target_level: 4.5,
        trend: "improving",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
      {
        capability_id: "c13",
        domain_id: "d4",
        capability_name: "Narrative Framing",
        description: "Structuring compelling narratives that drive alignment and action.",
        current_level: 2.7,
        target_level: 4.0,
        trend: "stable",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
    ],
  },
  {
    domain_id: "d5",
    domain_name: "Strategic Framing",
    description: "Vision articulation and strategic context setting",
    capabilities: [
      {
        capability_id: "c14",
        domain_id: "d5",
        capability_name: "Vision Articulation",
        description: "Crafting and communicating a clear, inspiring vision that guides strategic direction.",
        current_level: 2.0,
        target_level: 4.0,
        trend: "stable",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
      {
        capability_id: "c15",
        domain_id: "d5",
        capability_name: "Context Setting",
        description: "Establishing the strategic landscape so teams can make informed decisions independently.",
        current_level: 2.3,
        target_level: 4.0,
        trend: "declining",
        recommended_sessions: [],
        past_sessions: [],
        journeys: [],
      },
    ],
  },
];

// --- Helpers ---

function getDomainProgress(domain: Domain): number {
  const caps = domain.capabilities;
  if (caps.length === 0) return 0;
  const total = caps.reduce((sum, c) => sum + (c.current_level / c.target_level) * 100, 0);
  return Math.round(total / caps.length);
}

function getDomainLevel(domain: Domain): number {
  const caps = domain.capabilities;
  if (caps.length === 0) return 0;
  return +(caps.reduce((s, c) => s + c.current_level, 0) / caps.length).toFixed(1);
}

function getCapabilityProgress(cap: Capability): number {
  return Math.round((cap.current_level / cap.target_level) * 100);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// --- Sub-Components ---

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "improving") return <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />;
  if (trend === "declining") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function TrendLabel({ trend }: { trend: Trend }) {
  const labels: Record<Trend, string> = { improving: "Improving", declining: "Declining", stable: "Stable" };
  const colors: Record<Trend, string> = {
    improving: "text-[hsl(var(--success))]",
    declining: "text-destructive",
    stable: "text-muted-foreground",
  };
  return (
    <span className={`flex items-center gap-1 text-[10px] font-medium ${colors[trend]}`}>
      <TrendIcon trend={trend} />
      {labels[trend]}
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
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-700"
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
        {value}%
      </text>
    </svg>
  );
}

function CapabilityRow({ capability, navigate }: { capability: Capability; navigate: ReturnType<typeof useNavigate> }) {
  const [expanded, setExpanded] = useState(false);
  const progress = getCapabilityProgress(capability);
  const isGap = progress < GAP_THRESHOLD;

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${isGap ? "border-destructive/30 bg-destructive/[0.03]" : "border-border"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
      >
        <CircularProgress value={progress} size={36} strokeWidth={3} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-card-foreground">{capability.capability_name}</p>
            {isGap && <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground shrink-0 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-xs">
                  {capability.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-muted-foreground">
              Level {capability.current_level} → {capability.target_level}
            </span>
            <TrendLabel trend={capability.trend} />
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Recommended Practice */}
              {capability.recommended_sessions.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <Play className="h-2.5 w-2.5" /> Recommended Practice
                  </p>
                  <div className="space-y-1">
                    {capability.recommended_sessions.map((rs) => (
                      <button
                        key={rs.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/arena/session/${rs.id}`);
                        }}
                        className="w-full text-left text-[11px] text-primary hover:text-primary/80 hover:underline flex items-center gap-1.5 py-0.5"
                      >
                        <ArrowRight className="h-2.5 w-2.5 shrink-0" />
                        {rs.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Sessions */}
              {capability.past_sessions.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> Recent Sessions
                  </p>
                  <div className="space-y-0.5">
                    {capability.past_sessions.map((ps, i) => (
                      <p key={i} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                        {ps.title}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Journeys */}
              {capability.journeys.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 flex items-center gap-1">
                    <BookOpen className="h-2.5 w-2.5" /> Available Journeys
                  </p>
                  <div className="grid gap-2">
                    {capability.journeys.map((j) => (
                      <JourneyCard key={j.journey_id} journey={j} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {capability.journeys.length === 0 && capability.recommended_sessions.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No journeys or practice available yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function JourneyCard({ journey, navigate }: { journey: Journey; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <motion.button
      onClick={() => navigate("/arena-session")}
      className="w-full text-left rounded-lg border border-border bg-card p-3.5 hover:border-primary/30 hover:shadow-sm transition-all group"
      whileHover={{ y: -1 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-card-foreground truncate">{journey.journey_title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{journey.focus_area}</p>
        </div>
        <CircularProgress value={journey.progress} size={36} strokeWidth={3} />
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-[10px]">
        {journey.active ? (
          <span className="flex items-center gap-1 text-primary font-medium">
            <Play className="h-2.5 w-2.5" /> Next: {journey.next_session}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-2.5 w-2.5" /> Start journey
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-2.5 w-2.5" />
        {journey.active ? "Resume session" : "Begin first session"}
      </div>
    </motion.button>
  );
}

function DomainCard({ domain, navigate }: { domain: Domain; navigate: ReturnType<typeof useNavigate> }) {
  const [expanded, setExpanded] = useState(false);
  const progress = getDomainProgress(domain);
  const avgLevel = getDomainLevel(domain);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors text-left"
      >
        <CircularProgress value={progress} size={52} strokeWidth={4} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-foreground">{domain.domain_name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{domain.description}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-muted-foreground">
              Level {avgLevel} · {domain.capabilities.length} capabilities
            </span>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2 border-t border-border pt-4">
              {domain.capabilities.map((cap) => (
                <CapabilityRow key={cap.capability_id} capability={cap} navigate={navigate} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Page ---

const SkillMap = () => {
  const navigate = useNavigate();

  return (
    <Layout pageTitle="Skill Map">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <PageHeader title="Skill Map" subtitle="Strategic Leadership Track">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">
                Level <span className="font-semibold text-foreground">3.1</span> → 4.0
              </span>
              <span className="flex items-center gap-1 text-primary font-medium">
                <TrendingUp className="h-3 w-3" /> Rising
              </span>
            </div>
          </PageHeader>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }} className="mb-6">
          <InsightBanner title="AI Insight">
            <p>
              Your <strong>Evidence Evaluation</strong> and <strong>Data-Driven Judgment</strong> capabilities need attention — both are below the mastery threshold.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Evidence Evaluation", "Data-Driven Judgment", "Context Setting"].map((r) => (
                <span key={r} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {r}
                </span>
              ))}
            </div>
          </InsightBanner>
        </motion.div>

        <div className="space-y-3">
          {domains.map((domain, i) => (
            <motion.div key={domain.domain_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}>
              <DomainCard domain={domain} navigate={navigate} />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SkillMap;
