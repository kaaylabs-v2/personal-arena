import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, TrendingUp, Clock, Target } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/Layout";

const Completion = () => {
  const navigate = useNavigate();
  const [notifyOrg, setNotifyOrg] = useState<string | null>(null);

  return (
    <Layout pageTitle="Completion">
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Mastery Achieved</h1>
          <p className="text-sm text-muted-foreground mb-10">Congratulations on completing your mastery journey.</p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { icon: Target, label: "Objective", value: "Leading Distributed Teams" },
              { icon: TrendingUp, label: "Level Achieved", value: "Advanced" },
              { icon: Clock, label: "Time Taken", value: "10 weeks" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <item.icon className="h-4 w-4 text-primary mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-xs font-semibold text-card-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 mb-8 text-left">
            <p className="text-sm text-card-foreground font-medium mb-3">
              Would you like Arena to inform your organization?
            </p>
            <div className="flex gap-2">
              {["No", "Yes (Summary)", "Yes (Detailed)"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNotifyOrg(opt)}
                  className={`flex-1 text-xs p-2.5 rounded-lg border transition-colors ${
                    notifyOrg === opt
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-surface text-surface-foreground hover:bg-muted"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => navigate("/next-mastery")} className="w-full">
            Finish <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Completion;
