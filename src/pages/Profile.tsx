import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";

const Profile = () => {
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-8">Profile</h1>

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
