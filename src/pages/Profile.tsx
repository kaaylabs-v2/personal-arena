import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { learners, programs } from "@/data/programs";
import { useLearner } from "@/contexts/LearnerContext";
import { GraduationCap } from "lucide-react";

const Profile = () => {
  const { activeLearner, setActiveLearner } = useLearner();
  const enrolledPrograms = programs.filter((p) => activeLearner.enrolledProgramIds.includes(p.id));

  return (
    <Layout pageTitle="Profile">
      <div className="max-w-xl mx-auto px-6 py-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Learner Selector (demo) */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-4">Active Learner</h2>
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-display font-bold text-sm">{activeLearner.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{activeLearner.name}</p>
                  <p className="text-xs text-muted-foreground">{activeLearner.role}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Switch Learner (Demo)</Label>
                <Select value={activeLearner.id} onValueChange={(id) => setActiveLearner(learners.find((l) => l.id === id) || learners[0])}>
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {learners.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.name} — {l.role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Enrolled Programs</p>
                <div className="space-y-2">
                  {enrolledPrograms.map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                      <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-card-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.targetLearner} · {p.dimension_count} dimensions</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium">
                        Level {p.current_level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Separator className="mb-8" />

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-4">Privacy Defaults</h2>
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Share session summaries with coach</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Share full responses with coach</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Allow org to view progress</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </section>

          <Separator className="mb-8" />

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-4">Voice Settings</h2>
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Input Method</Label>
                <Select defaultValue="text">
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text only</SelectItem>
                    <SelectItem value="voice">Voice only</SelectItem>
                    <SelectItem value="both">Text & Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator className="mb-8" />

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-4">Notification Preferences</h2>
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Session reminders</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Weekly progress digest</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-card-foreground">Coach messages</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </section>

          <Separator className="mb-8" />

          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4">Coach Preview</h2>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-3">What your coach will see</p>
              <div className="space-y-2 text-sm text-card-foreground">
                <p>• Progress summary and mastery level</p>
                <p>• Session count and completion rate</p>
                <p className="text-muted-foreground">• Session details (hidden by default)</p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
