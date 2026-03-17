import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";

export default function AdminSettings() {
  return (
    <AdminLayout pageTitle="Settings">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Organization</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Organization Name</label>
                <input className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground" defaultValue="Arena Learning Inc." />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Support Email</label>
                <input className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground" defaultValue="support@arena.io" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Defaults</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Default Session Duration</label>
                <input className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground" defaultValue="20 min" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Default Target Level</label>
                <input className="w-full h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground" defaultValue="4.0" />
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
