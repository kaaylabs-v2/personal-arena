import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { BookOpen, Flag, ChevronRight, X, RotateCcw, AlertTriangle, Plus, Sparkles, PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLearner } from "@/contexts/LearnerContext";
import { toast } from "sonner";

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

const entriesByProgram: Record<string, JournalEntry[]> = {
  "p1": [
    { id: "1", date: "2026-02-21", title: "Chose async updates over daily standups", journey: "Team Leadership", summary: "Decided to replace daily standups with async check-ins for the distributed team.", assumptions: ["Team members prefer written communication", "Async updates reduce context-switching"], evidence: ["3 of 5 team members in different time zones", "Meeting attendance dropped 40%"], alternatives: ["Keep standups but shorten to 10 min", "Twice-weekly syncs with async on other days"], outcome: "Team engagement with updates increased.", revisitFlag: false, reflection: "Still confident in this choice.", patternInsight: "You tend to commit to solutions before evaluating multiple alternatives." },
    { id: "2", date: "2026-02-19", title: "Prioritized retention over new feature launch", journey: "Strategic Thinking", summary: "Advocated to delay the Q2 feature launch by 2 weeks to address churn signals.", assumptions: ["Churn is driven by poor onboarding", "Delaying won't impact competitive position"], evidence: ["30-day retention dropped from 68% to 54%", "Support tickets up 3x"], alternatives: ["Launch on time and fix onboarding in parallel", "Soft-launch to existing users"], revisitFlag: true, patternInsight: "You frequently anchor on retention metrics." },
  ],
  "p-algebra": [
    { id: "alg-1", date: "2026-02-20", title: "Tried visual method for word problems", journey: "Word Problems", summary: "Drew diagrams to represent the relationships before writing equations.", assumptions: ["Visual representation helps identify unknowns", "Diagrams reduce translation errors"], evidence: ["Got 4 of 5 problems correct with diagrams", "Only 2 of 5 without"], alternatives: ["Use tables instead of diagrams", "Underline key words first"], outcome: "Diagrams helped but took extra time.", revisitFlag: false, patternInsight: "You rush to write equations before fully understanding the problem." },
    { id: "alg-2", date: "2026-02-18", title: "Skipped checking solutions on test", journey: "Equation Solving", summary: "Ran out of time because I didn't budget for solution checking.", assumptions: ["I could solve fast enough to check later", "My first answers are usually right"], evidence: ["Missed 2 problems due to sign errors", "Checking would have caught both"], alternatives: ["Check as I go", "Budget last 5 minutes for checking"], revisitFlag: true, patternInsight: "You consistently skip verification steps under time pressure." },
  ],
  "p-calculus": [
    { id: "calc-1", date: "2026-02-21", title: "Confused chain rule with product rule", journey: "Derivatives", summary: "Mixed up when to apply chain vs product rule on a composite function.", assumptions: ["I understood the difference between the rules", "Practice problems would be enough"], evidence: ["Got 3 of 6 chain rule problems wrong", "All product rule problems correct"], alternatives: ["Create a decision flowchart", "Practice mixed problems"], outcome: "Made a flowchart that helped on the next quiz.", revisitFlag: false, patternInsight: "You apply rules mechanically without checking if the function structure matches." },
    { id: "calc-2", date: "2026-02-19", title: "Struggled to set up optimization problem", journey: "Applications", summary: "Couldn't identify the constraint equation for a fence optimization problem.", assumptions: ["I could identify constraints from the problem statement", "One reading would be enough"], evidence: ["Spent 20 minutes without progress", "Re-reading the problem twice revealed the constraint"], alternatives: ["List all given quantities first", "Draw the physical setup before equations"], revisitFlag: true, patternInsight: "You jump to equations before fully mapping the problem structure." },
  ],
  "p-insurance": [
    { id: "ins-1", date: "2026-02-21", title: "Lost sale by leading with features", journey: "Value Framing", summary: "Client disengaged when I listed policy features instead of addressing their concern about cost.", assumptions: ["Clients want to know what they're getting", "Features demonstrate value"], evidence: ["Client interrupted to ask about price twice", "Competitor won by leading with risk scenarios"], alternatives: ["Lead with risk stories", "Ask about their biggest worry first"], outcome: "Lost the sale. Need to restructure my opening.", revisitFlag: false, patternInsight: "You default to feature-listing instead of needs-based framing." },
    { id: "ins-2", date: "2026-02-19", title: "Handled compliance question well", journey: "Compliance", summary: "Client asked about policy exclusions — I was transparent and it built trust.", assumptions: ["Transparency might scare the client", "Hiding exclusions is risky"], evidence: ["Client thanked me for honesty", "They signed without further objections"], alternatives: ["Minimize exclusion discussion", "Redirect to benefits"], outcome: "Client signed and referred a colleague.", revisitFlag: false },
  ],
};

const scaffoldTabs = ["Assumptions", "Evidence", "Alternatives", "Outcome", "Notes"] as const;
type ScaffoldTab = typeof scaffoldTabs[number];

const tabKey: Record<ScaffoldTab, keyof JournalEntry> = {
  Assumptions: "assumptions",
  Evidence: "evidence",
  Alternatives: "alternatives",
  Outcome: "outcome",
  Notes: "notes",
};

const reflectionPrompts = [
  "What decision did you make today that you want to remember?",
  "What assumption are you holding that you haven't tested yet?",
  "What would you do differently if you could replay today?",
  "What surprised you in your last session?",
  "What's one thing you're avoiding thinking about?",
];

const Journal = () => {
  const { activeProgram, hasCompletedSession } = useLearner();
  const [allEntries, setAllEntries] = useState<JournalEntry[]>(
    entriesByProgram[activeProgram.id] || entriesByProgram["p1"]
  );
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<ScaffoldTab>("Assumptions");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [dailyPrompt] = useState(() => reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]);

  const handleAddEntry = () => {
    if (!newTitle.trim()) return;
    const entry: JournalEntry = {
      id: `new-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: newTitle.trim(),
      journey: activeProgram.name,
      summary: newSummary.trim(),
      assumptions: [],
      evidence: [],
      alternatives: [],
      revisitFlag: false,
    };
    setAllEntries((prev) => [entry, ...prev]);
    setNewTitle("");
    setNewSummary("");
    setShowNewEntry(false);
    toast.success("Entry added to your journal");
  };

  return (
    <Layout pageTitle="Decision Journal">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} key={activeProgram.id}>

          {/* Reflection prompt card */}
          {!selectedEntry && !showNewEntry && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-primary mb-1">Today's reflection</p>
                  <p className="text-sm text-foreground leading-relaxed">{dailyPrompt}</p>
                  <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => setShowNewEntry(true)}>
                    <PenLine className="h-3 w-3 mr-1.5" /> Write about it
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* New entry form */}
          <AnimatePresence>
            {showNewEntry && !selectedEntry && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                      <PenLine className="h-3.5 w-3.5 text-primary" /> New journal entry
                    </h3>
                    <button onClick={() => setShowNewEntry(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Input placeholder="What decision or realization do you want to capture?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="text-sm" />
                  <Textarea placeholder="Add more detail — what happened, what you were thinking, what you'd do differently…" value={newSummary} onChange={(e) => setNewSummary(e.target.value)} rows={3} className="text-sm resize-none" />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setShowNewEntry(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleAddEntry} disabled={!newTitle.trim()}>Save Entry</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header with add button */}
          {!selectedEntry && !showNewEntry && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground">{allEntries.length} entries</p>
              <Button size="sm" variant="outline" onClick={() => setShowNewEntry(true)}>
                <Plus className="h-3 w-3 mr-1.5" /> New Entry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!selectedEntry && allEntries.length === 0 && !showNewEntry && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Your journal is empty</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                {hasCompletedSession
                  ? "Capture a decision, a realization, or something you'd do differently. It only takes a minute."
                  : "After your first session, this is where you'll reflect on your decisions and track how your thinking evolves."}
              </p>
              {hasCompletedSession && (
                <Button size="sm" onClick={() => setShowNewEntry(true)}>
                  <PenLine className="h-3 w-3 mr-1.5" /> Write your first entry
                </Button>
              )}
            </motion.div>
          )}

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

                  {selectedEntry.patternInsight && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-dashed border-warning/30 bg-warning/5 px-4 py-3 mb-5 flex items-start gap-2.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-warning font-medium mb-0.5">Pattern Detected</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{selectedEntry.patternInsight}</p>
                      </div>
                    </motion.div>
                  )}

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
