import { AdminLayout } from "@/components/admin/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Users,
  FileText,
  Layers,
  Target,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical,
  Upload,
} from "lucide-react";

/* ── mock data keyed by program id ── */
const programData: Record<string, {
  id: string; name: string; domain: string; status: "active" | "draft";
  description: string; targetLevel: number; estimatedHours: number;
  learners: number; scenarios: Scenario[]; dimensions: Dimension[]; materials: Material[];
}> = {
  p1: {
    id: "p1", name: "Strategic Leadership", domain: "Professional", status: "active",
    description: "Develop executive-level strategic thinking through scenario-based practice. Learners engage with realistic leadership challenges that build clarity, structured reasoning, and strategic framing skills.",
    targetLevel: 4.0, estimatedHours: 24, learners: 48,
    dimensions: [
      { id: "d1", name: "Clarity", weight: 25, description: "Ability to articulate ideas precisely and concisely" },
      { id: "d2", name: "Think It Through", weight: 25, description: "Depth and rigor of reasoning process" },
      { id: "d3", name: "Show Your Work", weight: 25, description: "Transparency in reasoning steps" },
      { id: "d4", name: "Strategic Framing", weight: 25, description: "Ability to frame problems within broader context" },
    ],
    scenarios: [
      { id: "s1", title: "Crisis Communication", difficulty: 3, turns: 6, status: "active", description: "Navigate a PR crisis as VP of Communications" },
      { id: "s2", title: "Board Presentation", difficulty: 4, turns: 8, status: "active", description: "Present a controversial strategy pivot to the board" },
      { id: "s3", title: "Team Restructuring", difficulty: 3, turns: 5, status: "active", description: "Lead a sensitive org restructuring conversation" },
      { id: "s4", title: "M&A Due Diligence", difficulty: 5, turns: 10, status: "draft", description: "Evaluate a potential acquisition target" },
    ],
    materials: [
      { id: "m1", name: "Leadership Frameworks.pdf", type: "pdf", size: "2.4 MB", chunks: 34, uploadedAt: "2025-02-12" },
      { id: "m2", name: "Case Studies Collection.docx", type: "docx", size: "1.8 MB", chunks: 28, uploadedAt: "2025-02-14" },
      { id: "m3", name: "Strategic Models Reference.pdf", type: "pdf", size: "890 KB", chunks: 12, uploadedAt: "2025-03-01" },
    ],
  },
  p2: {
    id: "p2", name: "Algebra Foundations", domain: "Academic", status: "active",
    description: "Build strong algebraic reasoning through progressive problem-solving scenarios that develop pattern recognition, equation setup, and word problem skills.",
    targetLevel: 3.5, estimatedHours: 30, learners: 124,
    dimensions: [
      { id: "d1", name: "Pattern Recognition", weight: 35, description: "Identifying mathematical patterns and relationships" },
      { id: "d2", name: "Equation Setup", weight: 35, description: "Translating problems into algebraic expressions" },
      { id: "d3", name: "Word Problems", weight: 30, description: "Solving real-world scenarios with algebra" },
    ],
    scenarios: [
      { id: "s1", title: "Linear Equations", difficulty: 2, turns: 5, status: "active", description: "Solve multi-step linear equations" },
      { id: "s2", title: "System of Equations", difficulty: 3, turns: 6, status: "active", description: "Work through systems with substitution and elimination" },
      { id: "s3", title: "Quadratic Challenges", difficulty: 4, turns: 8, status: "active", description: "Factor, graph, and solve quadratic equations" },
    ],
    materials: [
      { id: "m1", name: "Algebra Textbook Ch1-5.pdf", type: "pdf", size: "5.2 MB", chunks: 67, uploadedAt: "2025-01-20" },
    ],
  },
};

interface Scenario { id: string; title: string; difficulty: number; turns: number; status: "active" | "draft"; description: string; }
interface Dimension { id: string; name: string; weight: number; description: string; }
interface Material { id: string; name: string; type: string; size: string; chunks: number; uploadedAt: string; }

/* ── fallback for unknown ids ── */
const fallback = { ...Object.values(programData)[0], id: "unknown", name: "Unknown Program" };

export default function AdminProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const program = programData[programId ?? ""] ?? fallback;
  const [dimensions, setDimensions] = useState(program.dimensions);
  const [showAddDimension, setShowAddDimension] = useState(false);
  const [newDim, setNewDim] = useState({ name: "", description: "", weight: 10 });
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [scenarios, setScenarios] = useState(program.scenarios);
  const [newScenario, setNewScenario] = useState({ title: "", description: "", difficulty: 3, turns: 5 });

  const handleAddDimension = () => {
    if (!newDim.name.trim()) return;
    setDimensions([...dimensions, { id: `d${Date.now()}`, ...newDim }]);
    setNewDim({ name: "", description: "", weight: 10 });
    setShowAddDimension(false);
    toast.success("Dimension added");
  };

  const handleAddScenario = () => {
    if (!newScenario.title.trim()) return;
    setScenarios([...scenarios, { id: `s${Date.now()}`, ...newScenario, status: "draft" as const }]);
    setNewScenario({ title: "", description: "", difficulty: 3, turns: 5 });
    setShowAddScenario(false);
    toast.success("Scenario added");
  };
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">

          {/* Back + header */}
          <div className="space-y-4">
            <button onClick={() => navigate("/admin/programs")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> All Programs
            </button>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-display font-semibold text-foreground">{program.name}</h1>
                  <Badge variant={program.status === "active" ? "default" : "secondary"} className="text-[9px] uppercase tracking-wider">
                    {program.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">{program.description}</p>
              </div>
              <Button size="sm" variant="outline"><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> <span className="font-medium text-foreground">{program.learners}</span> learners
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Target className="h-3.5 w-3.5" /> Target <span className="font-medium text-foreground">{program.targetLevel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" /> <span className="font-medium text-foreground">{program.estimatedHours}h</span> estimated
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="scenarios" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="scenarios" className="text-xs gap-1.5"><Layers className="h-3.5 w-3.5" /> Scenarios</TabsTrigger>
              <TabsTrigger value="dimensions" className="text-xs gap-1.5"><Target className="h-3.5 w-3.5" /> Dimensions</TabsTrigger>
              <TabsTrigger value="materials" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" /> Materials</TabsTrigger>
            </TabsList>

            {/* ── Scenarios ── */}
            <TabsContent value="scenarios" className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{program.scenarios.length} scenarios</p>
                <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New Scenario</Button>
              </div>
              {program.scenarios.map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-muted-foreground/40"><GripVertical className="h-4 w-4" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-card-foreground">{s.title}</h4>
                          <Badge variant={s.status === "active" ? "default" : "secondary"} className="text-[9px] uppercase tracking-wider">{s.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span>Difficulty {s.difficulty}/5</span>
                          <span>{s.turns} turns</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* ── Dimensions ── */}
            <TabsContent value="dimensions" className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{program.dimensions.length} skill dimensions</p>
                <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Dimension</Button>
              </div>
              {program.dimensions.map((d) => (
                <div key={d.id} className="rounded-xl border border-border bg-card p-4 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-muted-foreground/40"><GripVertical className="h-4 w-4" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-card-foreground">{d.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{d.weight}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Weight summary */}
              <div className="rounded-lg bg-muted/50 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total weight</span>
                <span className={`text-sm font-medium ${program.dimensions.reduce((a, d) => a + d.weight, 0) === 100 ? "text-primary" : "text-destructive"}`}>
                  {program.dimensions.reduce((a, d) => a + d.weight, 0)}%
                </span>
              </div>
            </TabsContent>

            {/* ── Materials ── */}
            <TabsContent value="materials" className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{program.materials.length} files · {program.materials.reduce((a, m) => a + m.chunks, 0)} chunks</p>
                <Button size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Material</Button>
              </div>

              {program.materials.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-border bg-card p-10 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No materials uploaded yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Upload PDFs, docs, or slides to auto-generate scenarios</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-2.5">File</th>
                        <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-2.5">Size</th>
                        <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-2.5">Chunks</th>
                        <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-2.5">Uploaded</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {program.materials.map((m) => (
                        <tr key={m.id} className="border-b border-border last:border-0 group">
                          <td className="px-4 py-3 font-medium text-card-foreground flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            {m.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{m.size}</td>
                          <td className="px-4 py-3 text-muted-foreground">{m.chunks}</td>
                          <td className="px-4 py-3 text-muted-foreground">{m.uploadedAt}</td>
                          <td className="px-4 py-3">
                            <button className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
