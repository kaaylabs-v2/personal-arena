import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, BookOpen, Clock, ArrowRight } from "lucide-react";

const recentPrograms = [
  { id: "p1", name: "Strategic Leadership", domain: "Professional", updated: "2 hours ago", sources: 3 },
  { id: "p2", name: "Algebra Foundations", domain: "Academic", updated: "Yesterday", sources: 5 },
  { id: "p3", name: "Calculus I Mastery", domain: "Academic", updated: "3 days ago", sources: 4 },
  { id: "p4", name: "Insurance Sales Mastery", domain: "Corporate", updated: "1 week ago", sources: 2 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout pageTitle="Overview">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          {/* Hero — create new */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              Welcome to Arena Studio
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Upload your materials and let AI create mastery programs. Or pick up where you left off.
            </p>
          </div>

          {/* Create actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => navigate("/admin/upload")}
              className="group rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-card p-6 text-center transition-all hover:shadow-sm"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-card-foreground">Upload & Generate</p>
              <p className="text-[11px] text-muted-foreground mt-1">Drop a PDF, DOCX, or slides</p>
            </button>

            <button
              onClick={() => navigate("/admin/programs")}
              className="group rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-card p-6 text-center transition-all hover:shadow-sm"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-card-foreground">Create from Scratch</p>
              <p className="text-[11px] text-muted-foreground mt-1">Build scenarios manually</p>
            </button>
          </div>

          {/* Recent programs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Programs</h2>
              <button
                onClick={() => navigate("/admin/programs")}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentPrograms.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => navigate(`/admin/programs/${p.id}`)}
                  className="group rounded-xl border border-border bg-card p-4 text-left hover:border-primary/30 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4 text-primary/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">{p.domain}</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> {p.updated}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">{p.sources} sources</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
