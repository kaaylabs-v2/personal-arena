import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useState } from "react";

const rubric = [
  { name: "Clarity", score: 3.2, max: 5 },
  { name: "Reasoning", score: 2.8, max: 5 },
  { name: "Evidence Use", score: 3.5, max: 5 },
  { name: "Alternatives Considered", score: 2.4, max: 5 },
  { name: "Reflection Depth", score: 3.0, max: 5 },
];

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
