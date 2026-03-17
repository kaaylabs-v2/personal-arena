import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "learner" | "coach" | "admin";
  program: string;
  level: number;
  lastActive: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Maria Chen", email: "maria@acmecorp.com", role: "learner", program: "Strategic Leadership", level: 3.1, lastActive: "2 hrs ago" },
  { id: "2", name: "Emma Watson", email: "emma@school.edu", role: "learner", program: "Algebra Foundations", level: 2.1, lastActive: "1 hr ago" },
  { id: "3", name: "Ravi Patel", email: "ravi@university.edu", role: "learner", program: "Calculus I Mastery", level: 1.8, lastActive: "4 hrs ago" },
  { id: "4", name: "David Kim", email: "david@insurance.com", role: "learner", program: "Insurance Sales Mastery", level: 2.2, lastActive: "30 min ago" },
  { id: "5", name: "Sarah Johnson", email: "sarah@acmecorp.com", role: "coach", program: "Strategic Leadership", level: 0, lastActive: "1 hr ago" },
  { id: "6", name: "James Park", email: "james@acmecorp.com", role: "admin", program: "—", level: 0, lastActive: "Just now" },
];

const mockCsvPreview = [
  { name: "Alice Rivera", email: "alice@acmecorp.com", role: "learner", program: "Strategic Leadership", valid: true },
  { name: "Bob Zhang", email: "bob@acmecorp.com", role: "learner", program: "Strategic Leadership", valid: true },
  { name: "Carol White", email: "carol@", role: "learner", program: "Unknown Program", valid: false, error: "Invalid email" },
  { name: "Dan Lee", email: "dan@acmecorp.com", role: "learner", program: "Algebra Foundations", valid: true },
  { name: "Eve Green", email: "eve@acmecorp.com", role: "coach", program: "Calculus I Mastery", valid: true },
];

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    learner: "bg-primary/10 text-primary",
    coach: "bg-accent text-accent-foreground",
    admin: "bg-foreground/10 text-foreground",
  };
  return styles[role] || styles.learner;
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [csvStage, setCsvStage] = useState<"upload" | "preview" | "importing" | "done">("upload");

  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const simulateCsvImport = () => {
    setCsvStage("preview");
  };

  const runImport = () => {
    setCsvStage("importing");
    setTimeout(() => setCsvStage("done"), 1500);
  };

  const closeCsv = () => {
    setShowCsvImport(false);
    setCsvStage("upload");
  };

  return (
    <AdminLayout pageTitle="Users">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-5">

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowCsvImport(true)}>
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Import CSV
            </Button>
            <Button size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Invite User
            </Button>
          </div>

          {/* CSV Import Panel */}
          <AnimatePresence>
            {showCsvImport && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Bulk CSV Import</h3>
                    <button onClick={closeCsv} className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {csvStage === "upload" && (
                    <div
                      onClick={simulateCsvImport}
                      className="rounded-lg border-2 border-dashed border-border hover:border-primary/40 transition-colors p-8 text-center cursor-pointer"
                    >
                      <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-card-foreground">Drop CSV here or click to upload</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Columns: name, email, role, program</p>
                    </div>
                  )}

                  {csvStage === "preview" && (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {mockCsvPreview.filter((r) => r.valid).length} valid, {mockCsvPreview.filter((r) => !r.valid).length} errors — review below
                      </p>
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/30 border-b border-border">
                              <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Status</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Name</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Email</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Role</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Program</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockCsvPreview.map((row, i) => (
                              <tr key={i} className={`border-b border-border last:border-0 ${!row.valid ? "bg-destructive/5" : ""}`}>
                                <td className="px-3 py-2">
                                  {row.valid ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                                      <span className="text-[9px] text-destructive">{row.error}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-xs text-card-foreground">{row.name}</td>
                                <td className="px-3 py-2 text-xs text-muted-foreground">{row.email}</td>
                                <td className="px-3 py-2">
                                  <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full ${roleBadge(row.role)}`}>{row.role}</span>
                                </td>
                                <td className="px-3 py-2 text-xs text-muted-foreground">{row.program}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={closeCsv}>Cancel</Button>
                        <Button size="sm" onClick={runImport}>
                          Import {mockCsvPreview.filter((r) => r.valid).length} Users
                        </Button>
                      </div>
                    </div>
                  )}

                  {csvStage === "importing" && (
                    <div className="py-6 text-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-sm text-card-foreground">Importing users…</p>
                    </div>
                  )}

                  {csvStage === "done" && (
                    <div className="py-6 text-center">
                      <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-card-foreground">4 users imported successfully</p>
                      <p className="text-xs text-muted-foreground mt-1">1 row skipped due to errors</p>
                      <Button size="sm" variant="outline" onClick={closeCsv} className="mt-3">Done</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Users table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Name</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Role</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Program</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Level</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Last Active</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <p className="font-medium text-card-foreground">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full ${roleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-card-foreground">{user.program}</td>
                    <td className="px-4 py-3 text-xs text-card-foreground">{user.level > 0 ? user.level : "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastActive}</td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
