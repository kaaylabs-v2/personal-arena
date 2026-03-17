import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Users, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const mockTenants = [
  { id: "t1", name: "Acme Corp", type: "Enterprise", users: 104, programs: 2, plan: "Business" },
  { id: "t2", name: "Lincoln High School", type: "Education", users: 124, programs: 1, plan: "Education" },
  { id: "t3", name: "State University", type: "Higher Ed", users: 37, programs: 1, plan: "Education" },
];

export default function AdminTenants() {
  return (
    <AdminLayout pageTitle="Tenants">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{mockTenants.length} tenants</p>
            <Button size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Tenant
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTenants.map((tenant) => (
              <div key={tenant.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-card-foreground">{tenant.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{tenant.type} · {tenant.plan} Plan</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {tenant.users}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {tenant.programs} programs</span>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
