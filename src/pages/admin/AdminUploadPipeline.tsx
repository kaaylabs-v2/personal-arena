import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload, FileText, Sparkles, Loader2, X, RefreshCw,
  ArrowRight, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* ── Types ── */
type Stage = "idle" | "processing" | "error" | "review";

interface SourceFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

/* ── Mock previously uploaded sources ── */
const previousSources: SourceFile[] = [
  { id: "ps1", name: "Leadership Frameworks.pdf", size: "2.4 MB", type: "pdf" },
  { id: "ps2", name: "Case Studies Collection.docx", size: "1.8 MB", type: "docx" },
];

/* ── Mock generated course ── */
const mockGenerated = {
  title: "Strategic Leadership Fundamentals",
  description:
    "Build core leadership competencies through scenario-based practice covering crisis communication, stakeholder management, and strategic decision-making.",
  dimensions: [
    "Clarity of Communication",
    "Strategic Framing",
    "Stakeholder Awareness",
    "Decision Rigor",
  ],
  scenarios: [
    { title: "Crisis Communication", desc: "Navigate a PR crisis as VP of Communications" },
    { title: "Board Strategy Pivot", desc: "Present a controversial strategy change to the board" },
    { title: "Team Restructuring", desc: "Lead a sensitive organizational restructure" },
  ],
};

/* ── Processing messages ── */
const processingMessages = [
  "Reading your files…",
  "Analyzing content…",
  "Almost ready…",
];

/* ════════════════════════════════════════
   Main Component
   ════════════════════════════════════════ */
export default function AdminUploadPipeline() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("idle");
  const [sources, setSources] = useState<SourceFile[]>([]);
  const [msgIndex, setMsgIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable review fields
  const [title, setTitle] = useState(mockGenerated.title);
  const [description, setDescription] = useState(mockGenerated.description);

  /* Processing message rotation */
  useEffect(() => {
    if (stage !== "processing") return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((p) => (p < processingMessages.length - 1 ? p + 1 : p));
    }, 2200);
    return () => clearInterval(interval);
  }, [stage]);

  /* Auto-complete processing after delay */
  useEffect(() => {
    if (stage !== "processing") return;
    const t = setTimeout(() => setStage("review"), 6000);
    return () => clearTimeout(t);
  }, [stage]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = useCallback((files: FileList) => {
    const newSources: SourceFile[] = Array.from(files).map((f) => ({
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      size: formatSize(f.size),
      type: f.name.split(".").pop() ?? "file",
    }));
    setSources((prev) => [...prev, ...newSources]);
  }, []);

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleGenerate = () => {
    if (sources.length === 0) return;
    setStage("processing");
  };

  const handlePublish = () => {
    toast.success("Course published!", {
      description: `"${title}" is now live with ${mockGenerated.scenarios.length} scenarios.`,
    });
    navigate("/admin/programs/p1");
  };

  const handleRetry = () => {
    setStage("processing");
  };

  const reset = () => {
    setStage("idle");
    setSources([]);
    setTitle(mockGenerated.title);
    setDescription(mockGenerated.description);
  };

  const isDragging = useRef(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <AdminLayout pageTitle="Upload & Generate">
      <div className="max-w-3xl mx-auto px-6 py-8 min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6 h-full"
        >
          <AnimatePresence mode="wait">
            {/* ═══════ STEP 1 — Drop Zone ═══════ */}
            {stage === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    setDragOver(false);
                    handleDrop(e);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative rounded-2xl border-2 border-dashed transition-all cursor-pointer
                    flex flex-col items-center justify-center text-center
                    min-h-[340px]
                    ${dragOver
                      ? "border-primary bg-accent/60 scale-[1.01]"
                      : "border-border bg-card/40 hover:border-primary/30 hover:bg-card/70"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.pptx,.txt,.doc,.ppt"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  <motion.div
                    animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
                    className="h-16 w-16 rounded-2xl bg-muted/80 flex items-center justify-center mb-5"
                  >
                    <Upload className="h-7 w-7 text-muted-foreground/60" />
                  </motion.div>

                  <h2 className="text-base font-display font-semibold text-foreground mb-1.5">
                    Drop your training materials here
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    PDFs, Word docs, slide decks, or text files — add as many as you need
                  </p>

                  <div className="mt-5">
                    <span className="text-xs text-primary font-medium hover:underline">
                      or browse files
                    </span>
                  </div>
                </div>

                {/* Staged files */}
                {sources.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground">
                        {sources.length} file{sources.length > 1 ? "s" : ""} ready
                      </p>
                      <Button onClick={handleGenerate} size="sm" className="px-6 gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate Course
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid gap-2">
                      {sources.map((s) => (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 group"
                        >
                          <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-primary/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">{s.name}</p>
                            <p className="text-[11px] text-muted-foreground uppercase">{s.type} · {s.size}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSource(s.id);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Previously uploaded sources */}
                {previousSources.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
                      Previous Sources
                    </p>
                    <div className="grid gap-1.5">
                      {previousSources.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground/50 ml-auto shrink-0">{s.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════ STEP 2 — Processing ═══════ */}
            {stage === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="rounded-2xl border border-border bg-card p-12 text-center max-w-md w-full space-y-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Loader2 className="h-7 w-7 text-primary animate-spin" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-display font-semibold text-card-foreground">
                      Creating your course…
                    </h3>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={msgIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-sm text-muted-foreground"
                      >
                        {processingMessages[msgIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <p className="text-[11px] text-muted-foreground/50">
                    You can navigate away — we'll keep working in the background
                  </p>
                </div>
              </motion.div>
            )}

            {/* ═══════ Error State ═══════ */}
            {stage === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div className="rounded-2xl border border-destructive/20 bg-card p-10 text-center max-w-md w-full space-y-5">
                  <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-card-foreground">
                      We had trouble reading one of your files
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try uploading it again, or use a different format.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <Button variant="outline" size="sm" onClick={reset}>
                      Start Over
                    </Button>
                    <Button size="sm" onClick={handleRetry}>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════ STEP 3 — Review & Publish ═══════ */}
            {stage === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Success indicator */}
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-primary">
                    Generated from {sources.length} source{sources.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Editable course card */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground block mb-1.5">
                      Course Title
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-base font-display font-semibold border-transparent bg-transparent px-0 h-auto py-1 focus-visible:ring-0 focus-visible:border-primary/30 hover:border-border transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground block mb-1.5">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="border-transparent bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary/30 hover:border-border transition-colors resize-none text-sm"
                    />
                  </div>

                  {/* Competencies */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground block mb-2">
                      Competencies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {mockGenerated.dimensions.map((d) => (
                        <Badge
                          key={d}
                          variant="secondary"
                          className="text-xs py-1 px-3 rounded-full"
                        >
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Scenarios */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground block mb-2">
                      Practice Scenarios
                    </label>
                    <div className="space-y-2">
                      {mockGenerated.scenarios.map((s, i) => (
                        <div
                          key={i}
                          className="rounded-xl bg-muted/40 px-4 py-3.5 hover:bg-muted/60 transition-colors"
                        >
                          <p className="text-sm font-medium text-card-foreground">
                            {s.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {s.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
                    Start over
                  </Button>
                  <Button onClick={handlePublish} size="lg" className="px-8 gap-2 rounded-xl">
                    <Sparkles className="h-4 w-4" />
                    Publish
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
