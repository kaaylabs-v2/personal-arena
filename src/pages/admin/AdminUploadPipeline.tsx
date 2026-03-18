import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload, FileText, Sparkles, CheckCircle2, Loader2,
  ArrowRight, BookOpen, X, PartyPopper, ExternalLink, Plus,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type PipelineStage = "idle" | "processing" | "complete";

const mockGeneratedCourse = {
  title: "Strategic Leadership Fundamentals",
  description: "Build core leadership competencies through scenario-based practice covering crisis communication, stakeholder management, and strategic decision-making.",
  dimensions: ["Clarity of Communication", "Strategic Framing", "Stakeholder Awareness", "Decision Rigor"],
  scenarios: [
    { title: "Crisis Communication", description: "Navigate a PR crisis as VP of Communications" },
    { title: "Board Strategy Pivot", description: "Present a controversial strategy change to the board" },
    { title: "Team Restructuring", description: "Lead a sensitive organizational restructure" },
  ],
  sources: 1,
};

function SourceChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm group">
      <FileText className="h-4 w-4 text-primary/60 shrink-0" />
      <span className="text-card-foreground truncate">{name}</span>
      <button
        onClick={onRemove}
        className="ml-auto p-0.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function ProcessingOverlay() {
  const steps = ["Reading your document…", "Understanding the structure…", "Generating scenarios…"];
  const [stepIndex, setStepIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-border bg-card p-10 text-center space-y-5"
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
      <div className="space-y-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-medium text-card-foreground"
          >
            {steps[stepIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-muted-foreground">This usually takes a few seconds</p>
      </div>
    </motion.div>
  );
}

export default function AdminUploadPipeline() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [sources, setSources] = useState<string[]>([]);
  const [created, setCreated] = useState(false);

  const addSource = useCallback((name: string) => {
    setSources((prev) => [...prev, name]);
  }, []);

  const removeSource = (index: number) => {
    setSources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) addSource(file.name);
  };

  const handleFileClick = () => {
    addSource(`Document_${sources.length + 1}.pdf`);
  };

  const handleGenerate = () => {
    if (sources.length === 0) return;
    setStage("processing");
    setTimeout(() => setStage("complete"), 5400);
  };

  const reset = () => {
    setStage("idle");
    setSources([]);
    setCreated(false);
  };

  const handleCreateProgram = () => {
    setCreated(true);
    toast.success("Program created!", { description: `"${mockGeneratedCourse.title}" is now live.` });
  };

  return (
    <AdminLayout pageTitle="Upload & Generate">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-display font-semibold text-foreground">Add your sources</h2>
            <p className="text-xs text-muted-foreground">
              Upload materials and AI will create a complete mastery program from them.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* IDLE — upload sources */}
            {stage === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Source list */}
                {sources.length > 0 && (
                  <div className="space-y-2">
                    {sources.map((name, i) => (
                      <motion.div
                        key={`${name}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <SourceChip name={name} onRemove={() => removeSource(i)} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                  className="rounded-xl border-2 border-dashed border-border bg-card/50 hover:border-primary/40 hover:bg-card transition-all p-8 text-center cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {sources.length === 0 ? "Drop files here or click to upload" : "Add another source"}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, DOCX, PPTX, or TXT</p>
                </div>

                {/* Generate button */}
                {sources.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center pt-2"
                  >
                    <Button onClick={handleGenerate} size="sm" className="px-6">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Generate Program
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* PROCESSING */}
            {stage === "processing" && (
              <ProcessingOverlay key="processing" />
            )}

            {/* COMPLETE */}
            {stage === "complete" && !created && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="rounded-xl border border-primary/20 bg-card p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Generated from {sources.length} source{sources.length > 1 ? "s" : ""}</span>
                  </div>

                  {/* Editable fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-card-foreground block mb-1.5">Title</label>
                      <input
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                        defaultValue={mockGeneratedCourse.title}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-card-foreground block mb-1.5">Description</label>
                      <textarea
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground min-h-[72px] resize-y"
                        defaultValue={mockGeneratedCourse.description}
                      />
                    </div>
                  </div>

                  {/* Dimensions as simple tags */}
                  <div>
                    <p className="text-xs font-medium text-card-foreground mb-2">Skill Dimensions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mockGeneratedCourse.dimensions.map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Scenarios */}
                  <div>
                    <p className="text-xs font-medium text-card-foreground mb-2">Scenarios</p>
                    <div className="space-y-2">
                      {mockGeneratedCourse.scenarios.map((s, i) => (
                        <div key={i} className="rounded-lg bg-muted/40 px-4 py-3">
                          <p className="text-sm font-medium text-card-foreground">{s.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <Button variant="outline" size="sm" onClick={reset}>Start Over</Button>
                  <Button size="sm" onClick={handleCreateProgram}>
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Create Program
                  </Button>
                </div>
              </motion.div>
            )}

            {/* CREATED */}
            {created && (
              <motion.div
                key="created"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <PartyPopper className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">Program Created!</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    "{mockGeneratedCourse.title}" is ready with {mockGeneratedCourse.scenarios.length} scenarios.
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Button variant="outline" size="sm" onClick={reset}>Upload More</Button>
                  <Button size="sm" onClick={() => navigate("/admin/programs/p1")}>
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open Program
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
