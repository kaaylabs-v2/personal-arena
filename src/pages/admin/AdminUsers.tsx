import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "learner" | "coach" | "admin";
  tenant: string;
  program: string;
  level: number;
  lastActive: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Maria Chen", email: "maria@acmecorp.com", role: "learner", tenant: "Acme Corp", program: "Strategic Leadership", level: 3.1, lastActive: "2 hrs ago" },
  { id: "2", name: "Emma Watson", email: "emma@school.edu", role: "learner", tenant: "Lincoln High", program: "Algebra Foundations", level: 2.1, lastActive: "1 hr ago" },
  { id: "3", name: "Ravi Patel", email: "ravi@university.edu", role: "learner", tenant: "State University", program: "Calculus I Mastery", level: 1.8, lastActive: "4 hrs ago" },
  { id: "4", name: "David Kim", email: "david@insurance.com", role: "learner", tenant: "Acme Corp", program: "Insurance Sales Mastery", level: 2.2, lastActive: "30 min ago" },
  { id: "5", name: "Sarah Johnson", email: "sarah@acmecorp.com", role: "coach", tenant: "Acme Corp", program: "Strategic Leadership", level: 0, lastActive: "1 hr ago" },
  { id: "6", name: "James Park", email: "james@acmecorp.com", role: "admin", tenant: "Acme Corp", program: "—", level: 0, lastActive: "Just now" },
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
  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

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
            <Button size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Invite User
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Name</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Role</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Tenant</th>
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
                    <td className="px-4 py-3 text-xs text-muted-foreground">{user.tenant}</td>
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
