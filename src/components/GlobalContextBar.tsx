import { Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useLearner } from "@/contexts/LearnerContext";
import { learners } from "@/data/programs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GlobalContextBarProps {
  pageTitle?: string;
}

export function GlobalContextBar({ pageTitle }: GlobalContextBarProps) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { activeLearner, setActiveLearner, activeProgram } = useLearner();

  return (
    <header className="h-11 flex items-center border-b border-border px-4 gap-2.5 bg-background shrink-0">
      <SidebarTrigger />

      {isCollapsed && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-[10px]">A</span>
          </div>
          <span className="font-display font-semibold text-foreground text-sm tracking-tight">Arena</span>
          <span className="text-border shrink-0 mx-0.5">|</span>
        </div>
      )}

      {pageTitle && (
        <span className="text-sm font-medium text-foreground shrink-0">{pageTitle}</span>
      )}

      <div className="h-4 w-px bg-border mx-0.5 shrink-0" />

      {/* Learner Switcher */}
      <Select
        value={activeLearner.id}
        onValueChange={(id) => setActiveLearner(learners.find((l) => l.id === id) || learners[0])}
      >
        <SelectTrigger className="h-6 w-auto min-w-0 border-none shadow-none bg-transparent px-1 py-0 text-xs font-medium text-foreground gap-1 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {learners.map((l) => (
            <SelectItem key={l.id} value={l.id}>
              {l.name} — {l.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-4 w-px bg-border mx-0.5 shrink-0" />

      {/* Active program — simplified */}
      <span className="text-xs font-medium text-foreground truncate">{activeProgram.name}</span>
      <span className="text-[10px] text-muted-foreground shrink-0">Lvl {activeProgram.current_level}</span>

      <div className="flex-1" />

      {/* Right actions */}
      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <Search className="h-3.5 w-3.5" />
      </button>
      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
        <Bell className="h-3.5 w-3.5" />
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
      </button>
      <button
        onClick={() => navigate("/profile")}
        className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-primary font-display font-bold text-[10px] hover:bg-primary/25 transition-colors"
      >
        {activeLearner.avatar}
      </button>
    </header>
  );
}
