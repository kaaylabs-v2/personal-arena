import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, CheckCircle2, AlertCircle, Target } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useState } from "react";

const rubric = [
  { name: "Clarity", score: 3.2, max: 5 },
  { name: "Reasoning", score: 2.8, max: 5 },
  { name: "Evidence Use", score: 3.5, max: 5 },
  { name: "Alternatives Considered", score: 2.4, max: 5 },
  { name: "Reflection Depth", score: 3.0, max: 5 },
];

const sessionInsight = {
  strengths: ["Clear problem framing", "Stakeholder awareness"],
  improve: ["Explore alternatives before committing"],
  suggestedPractice: "Scenario: Conflicting Stakeholder Priorities",
};

const SessionSummary = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState("private");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Session Summary</h1>
          <p className="text-sm text-muted-foreground mb-8">Review your session performance and key takeaways.</p>

          <div className="space-y-4 mb-8">
            {[
              { label: "Original Stance", text: "Distributed teams need rigid communication frameworks to perform well." },
              { label: "Key Insights", text: "Over-structuring can reduce creative autonomy. Balance between async updates and free-form brainstorming is key." },
              { label: "Final Decision", text: "Implement structured check-ins with protected brainstorming time — blend both approaches." },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm text-card-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Session Insight Panel */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-8"
          >
            <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-3">Session Insight</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Strengths
                </p>
                <ul className="space-y-1">
                  {sessionInsight.strengths.map((s) => (
                    <li key={s} className="text-xs text-card-foreground flex items-start gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-warning" /> Improve Next
                </p>
                <ul className="space-y-1">
                  {sessionInsight.improve.map((s) => (
                    <li key={s} className="text-xs text-card-foreground flex items-start gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-warning mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                  <Target className="h-3 w-3 text-info" /> Suggested Practice
                </p>
                <p className="text-xs text-card-foreground">{sessionInsight.suggestedPractice}</p>
              </div>
            </div>
          </motion.div>

          <div className="rounded-xl border border-border bg-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Rubric Score Breakdown</h3>
            <div className="space-y-3">
              {rubric.map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-card-foreground font-medium">{r.name}</span>
                    <span className="text-muted-foreground">{r.score}/{r.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(r.score / r.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 mb-8">
            <p className="text-xs text-muted-foreground mb-1">Next Recommended Drill</p>
            <p className="text-sm font-medium text-card-foreground">Evidence Mapping: Building a case with data</p>
          </div>

          <div className="mb-8">
            <p className="text-xs text-muted-foreground mb-2">Privacy Setting</p>
            <Select value={privacy} onValueChange={setPrivacy}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="summary">Share summary with coach</SelectItem>
                <SelectItem value="full">Share full response</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => navigate("/dashboard")} className="w-full">
            <Save className="mr-2 h-4 w-4" /> Save Session
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SessionSummary;
