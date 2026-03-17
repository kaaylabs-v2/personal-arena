import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, BookOpen, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Program {
  id: string;
  name: string;
  domain: string;
  scenarios: number;
  learners: number;
  status: "active" | "draft";
  dimensions: string[];
}

const mockPrograms: Program[] = [
  { id: "p1", name: "Strategic Leadership", domain: "Professional", scenarios: 12, learners: 48, status: "active", dimensions: ["Clarity", "Think It Through", "Show Your Work", "Strategic Framing"] },
  { id: "p2", name: "Algebra Foundations", domain: "Academic", scenarios: 8, learners: 124, status: "active", dimensions: ["Pattern Recognition", "Equation Setup", "Word Problems"] },
  { id: "p3", name: "Calculus I Mastery", domain: "Academic", scenarios: 8, learners: 37, status: "active", dimensions: ["Limit Reasoning", "Chain Rule", "Optimization"] },
  { id: "p4", name: "Insurance Sales Mastery", domain: "Corporate", scenarios: 8, learners: 56, status: "active", dimensions: ["Value Framing", "Objection Handling", "Risk Communication"] },
  { id: "p5", name: "Critical Thinking 101", domain: "Academic", scenarios: 0, learners: 0, status: "draft", dimensions: ["Analysis", "Evaluation", "Inference"] },
];

export default function AdminPrograms() {
  const [programs] = useState<Program[]>(mockPrograms);

  return (
    <AdminLayout pageTitle="Programs & Scenarios">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{programs.length} programs</p>
            <Button size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New Program
            </Button>
          </div>

          <div className="space-y-3">
            {programs.map((program) => (
              <div key={program.id} onClick={() => navigate(`/admin/programs/${program.id}`)} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-card-foreground">{program.name}</h3>
                        <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          program.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {program.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{program.domain}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{program.scenarios} scenarios</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {program.learners} learners</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {program.dimensions.map((d) => (
                          <span key={d} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
