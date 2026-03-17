import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload, FileText, Sparkles, CheckCircle2, Loader2, AlertCircle,
  ArrowRight, BookOpen, Target, Layers, X,
} from "lucide-react";
import { useState } from "react";

type PipelineStage = "idle" | "uploading" | "extracting" | "analyzing" | "chunking" | "generating" | "complete" | "error";

const stageLabels: Record<PipelineStage, string> = {
  idle: "Ready to upload",
  uploading: "Uploading file…",
  extracting: "Extracting text content…",
  analyzing: "AI analyzing structure…",
  chunking: "Chunking & embedding…",
  generating: "Generating course outline…",
  complete: "Course generated!",
  error: "Processing failed",
};

const stageProgress: Record<PipelineStage, number> = {
  idle: 0, uploading: 12, extracting: 28, analyzing: 48, chunking: 68, generating: 85, complete: 100, error: 0,
};

const mockGeneratedCourse = {
  title: "Strategic Leadership Fundamentals",
  description: "Build core leadership competencies through scenario-based practice covering crisis communication, stakeholder management, and strategic decision-making.",
  dimensions: ["Clarity of Communication", "Strategic Framing", "Stakeholder Awareness", "Decision Rigor"],
  scenarios: [
    { title: "Crisis Communication", difficulty: 3, description: "Navigate a PR crisis as VP of Communications" },
    { title: "Board Strategy Pivot", difficulty: 4, description: "Present a controversial strategy change to the board" },
    { title: "Team Restructuring", difficulty: 3, description: "Lead a sensitive organizational restructure" },
  ],
  materialChunks: 34,
  estimatedHours: 18,
};

export default function AdminUploadPipeline() {
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [fileName, setFileName] = useState("");

  const simulatePipeline = (name: string) => {
    setFileName(name);
    const stages: PipelineStage[] = ["uploading", "extracting", "analyzing", "chunking", "generating", "complete"];
    stages.forEach((s, i) => {
      setTimeout(() => setStage(s), (i + 1) * 1200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) simulatePipeline(file.name);
  };

  const handleFileSelect = () => {
    // Simulate a file selection
    simulatePipeline("Leadership_Frameworks_2025.pdf");
  };

  const reset = () => {
    setStage("idle");
    setFileName("");
  };

  return (
    <AdminLayout pageTitle="Upload & Generate">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">

          <div>
            <h2 className="text-sm font-display font-semibold text-foreground">AI Course Generator</h2>
            <p className="text-xs text-muted-foreground mt-1">Upload course materials and let AI auto-generate programs, scenarios, and skill dimensions.</p>
          </div>

          {/* Upload zone */}
          {stage === "idle" && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/40 transition-colors p-12 text-center cursor-pointer"
              onClick={handleFileSelect}
            >
              <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-card-foreground">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, or TXT — max 50 MB</p>
            </div>
          )}

          {/* Processing pipeline */}
          {stage !== "idle" && stage !== "complete" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground">{stageLabels[stage]}</p>
                  </div>
                </div>
                <button onClick={reset} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Progress value={stageProgress[stage]} className="h-2" />

              <div className="grid grid-cols-5 gap-2">
                {(["uploading", "extracting", "analyzing", "chunking", "generating"] as PipelineStage[]).map((s) => {
                  const isDone = stageProgress[stage] > stageProgress[s];
                  const isCurrent = stage === s;
                  return (
                    <div key={s} className="flex flex-col items-center gap-1.5">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                        isDone ? "bg-primary/10 text-primary" : isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-2 w-2 rounded-full bg-current opacity-30" />}
                      </div>
                      <span className={`text-[9px] text-center leading-tight ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        {s === "uploading" ? "Upload" : s === "extracting" ? "Extract" : s === "analyzing" ? "Analyze" : s === "chunking" ? "Chunk" : "Generate"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated course preview */}
          <AnimatePresence>
            {stage === "complete" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="rounded-xl border border-primary/30 bg-card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">AI-Generated Course</h3>
                  </div>

                  <div>
                    <h2 className="text-lg font-display font-semibold text-card-foreground">{mockGeneratedCourse.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{mockGeneratedCourse.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-center">
                      <p className="text-lg font-semibold text-card-foreground">{mockGeneratedCourse.materialChunks}</p>
                      <p className="text-[10px] text-muted-foreground">Content Chunks</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-center">
                      <p className="text-lg font-semibold text-card-foreground">{mockGeneratedCourse.scenarios.length}</p>
                      <p className="text-[10px] text-muted-foreground">Scenarios</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-center">
                      <p className="text-lg font-semibold text-card-foreground">{mockGeneratedCourse.estimatedHours}h</p>
                      <p className="text-[10px] text-muted-foreground">Estimated</p>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" /> Suggested Dimensions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockGeneratedCourse.dimensions.map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                </div>

                {/* Scenarios */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Suggested Scenarios
                  </h3>
                  <div className="space-y-2">
                    {mockGeneratedCourse.scenarios.map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Lvl {s.difficulty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <Button variant="outline" size="sm" onClick={reset}>Upload Another</Button>
                  <Button size="sm">
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Create Program <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
