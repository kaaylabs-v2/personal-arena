import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";

const dimensions = [
  { name: "Clarity of Thinking", current: 2.4, target: 4.0 },
  { name: "Evidence-Based Reasoning", current: 1.8, target: 4.0 },
  { name: "Stakeholder Awareness", current: 3.1, target: 4.5 },
  { name: "Decision Quality", current: 2.0, target: 4.0 },
  { name: "Reflective Practice", current: 1.5, target: 3.5 },
];

const MasteryPlan = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PageHeader title="Mastery Plan" subtitle="Based on your baseline assessment, here's your tailored path." />

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: BarChart3, label: "Current Level", value: "Developing" },
              { icon: Target, label: "Target Level", value: "Advanced" },
              { icon: Calendar, label: "Weekly Cadence", value: "3 sessions" },
              { icon: Clock, label: "Est. Time to Mastery", value: "8–12 weeks" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                <item.icon className="h-4 w-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-card-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Key Capability Dimensions
            </h3>
            <div className="space-y-4">
              {dimensions.map((dim) => (
                <div key={dim.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-card-foreground font-medium">{dim.name}</span>
                    <span className="text-muted-foreground">{dim.current} → {dim.target}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(dim.current / dim.target) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Recommended Practice Types</h3>
            <div className="flex flex-wrap gap-2">
              {["Scenario Analysis", "Decision Journals", "Structured Debates", "Reflection Prompts", "Evidence Mapping"].map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Start My Program <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MasteryPlan;
