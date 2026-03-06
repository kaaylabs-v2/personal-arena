import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { BookOpen, Flag, ChevronRight, X, RotateCcw, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  journey: string;
  summary: string;
  assumptions: string[];
  evidence: string[];
  alternatives: string[];
  outcome?: string;
  notes?: string;
  revisitFlag: boolean;
  revisitDate?: string;
  reflection?: string;
  patternInsight?: string;
}

const entries: JournalEntry[] = [
  {
    id: "1",
    date: "2026-02-21",
    title: "Chose async updates over daily standups",
    journey: "Team Leadership",
    summary: "Decided to replace daily standups with async check-ins for the distributed team to reduce meeting fatigue.",
    assumptions: [
      "Team members prefer written communication",
      "Async updates reduce context-switching cost",
      "Accountability doesn't require synchronous presence",
    ],
    evidence: [
      "3 of 5 team members in different time zones",
      "Meeting attendance dropped 40% over last month",
      "Written updates already happen informally in Slack",
    ],
    alternatives: [
      "Keep daily standups but shorten to 10 min",
      "Move to twice-weekly syncs with async on other days",
      "Rotate standup times across time zones",
    ],
    outcome: "Team engagement with updates increased. Two members shared more context in writing than they ever did verbally.",
    notes: "Worth monitoring for signs of isolation. Plan a weekly video check-in for social connection.",
    revisitFlag: false,
    revisitDate: "2026-02-28",
    reflection: "Still confident in this choice. The written format surfaces more thoughtful input.",
    patternInsight: "You tend to commit to solutions before evaluating multiple alternatives.",
  },
  {
    id: "2",
    date: "2026-02-19",
    title: "Prioritized retention over new feature launch",
    journey: "Strategic Thinking",
    summary: "Advocated to delay the Q2 feature launch by 2 weeks to address churn signals in the onboarding funnel.",
    assumptions: [
      "Churn is driven by poor onboarding, not missing features",
      "Delaying launch won't impact competitive position",
      "Retention improvements compound faster than new acquisition",
    ],
    evidence: [
      "30-day retention dropped from 68% to 54%",
      "Support tickets about onboarding up 3x",
      "Competitor launched similar feature with mixed reception",
    ],
    alternatives: [
      "Launch on time and fix onboarding in parallel",
      "Soft-launch to existing users only",
      "Ship a simplified version of the feature",
    ],
    revisitFlag: true,
    revisitDate: "2026-02-26",
    patternInsight: "You frequently anchor on retention metrics — consider whether growth signals were underweighted.",
  },
  {
    id: "3",
    date: "2026-02-17",
    title: "Chose empathy-first approach in escalation",
    journey: "Customer Experience",
    summary: "In a heated customer call, chose to fully acknowledge frustration before problem-solving rather than jumping to solutions.",
    assumptions: [
      "The customer needed to feel heard before accepting help",
      "Rushing to a fix would increase defensiveness",
      "Emotional acknowledgment builds long-term trust",
    ],
    evidence: [
      "Customer interrupted solution attempts twice",
      "Tone shifted noticeably after acknowledgment",
      "Similar approach worked in previous escalation",
    ],
    alternatives: [
      "Lead with the fix to show competence",
      "Escalate to manager immediately",
      "Offer compensation upfront to de-escalate",
    ],
    outcome: "Customer calmed significantly. Accepted the solution and later left positive feedback.",
    revisitFlag: false,
  },
];

const scaffoldTabs = ["Assumptions", "Evidence", "Alternatives", "Outcome", "Notes"] as const;
type ScaffoldTab = typeof scaffoldTabs[number];

const tabKey: Record<ScaffoldTab, keyof JournalEntry> = {
  Assumptions: "assumptions",
  Evidence: "evidence",
  Alternatives: "alternatives",
  Outcome: "outcome",
  Notes: "notes",
};

const Journal = () => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<ScaffoldTab>("Assumptions");

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PageHeader title="Decision Journal" subtitle="Reflect on your reasoning over time" />

          <AnimatePresence mode="wait">
            {selectedEntry ? (
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <button onClick={() => setSelectedEntry(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
                  <X className="h-3 w-3" /> Back to timeline
                </button>

                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        {new Date(selectedEntry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                      <h2 className="text-lg font-display font-semibold text-foreground">{selectedEntry.title}</h2>
                      <Badge variant="secondary" className="mt-1.5 text-[10px]">{selectedEntry.journey}</Badge>
                    </div>
                    {selectedEntry.revisitFlag && (
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0 flex items-center gap-1">
                        <Flag className="h-2.5 w-2.5" /> Revisit
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{selectedEntry.summary}</p>

                  {/* Pattern Insight Tag */}
                  {selectedEntry.patternInsight && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-dashed border-warning/30 bg-warning/5 px-4 py-3 mb-5 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-warning font-medium mb-0.5">Pattern Detected</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{selectedEntry.patternInsight}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Scaffold Tabs */}
                  <div className="flex rounded-lg bg-muted p-0.5 mb-4">
                    {scaffoldTabs.map((t) => (
                      <button key={t} onClick={() => setActiveTab(t)}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >{t}</button>
                    ))}
                  </div>

                  <div className="min-h-[120px]">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        {activeTab === "Assumptions" || activeTab === "Evidence" || activeTab === "Alternatives" ? (
                          <ul className="space-y-2">
                            {(selectedEntry[tabKey[activeTab]] as string[])?.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-card-foreground leading-relaxed">
                            {(selectedEntry[tabKey[activeTab]] as string) || (
                              <span className="text-muted-foreground italic">Not recorded yet</span>
                            )}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Reflection section */}
                  {selectedEntry.reflection && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <RotateCcw className="h-3 w-3 text-primary" /> Later Reflection
                      </h4>
                      <p className="text-sm text-card-foreground leading-relaxed">{selectedEntry.reflection}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-3">
                    {entries.map((entry, i) => (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        onClick={() => { setSelectedEntry(entry); setActiveTab("Assumptions"); }}
                        className="w-full text-left pl-8 relative group"
                      >
                        <div className="absolute left-[7px] top-3 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />
                        <div className="rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 transition-all">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{entry.journey}</Badge>
                                {entry.revisitFlag && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary flex items-center gap-0.5">
                                    <Flag className="h-2 w-2" /> Revisit
                                  </Badge>
                                )}
                                {entry.revisitDate && !entry.revisitFlag && entry.reflection && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-muted-foreground/30 text-muted-foreground flex items-center gap-0.5">
                                    <RotateCcw className="h-2 w-2" /> Reflected
                                  </Badge>
                                )}
                                {entry.patternInsight && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-warning/30 text-warning flex items-center gap-0.5">
                                    <AlertTriangle className="h-2 w-2" /> Pattern
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">{entry.title}</p>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.summary}</p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Journal;
