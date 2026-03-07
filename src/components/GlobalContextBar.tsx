import { Search, Bell, User, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MasteryJourneyIndicator } from "@/components/MasteryJourneyIndicator";

interface GlobalContextBarProps {
  pageTitle?: string;
}

export function GlobalContextBar({ pageTitle }: GlobalContextBarProps) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <header className="h-11 flex items-center border-b border-border px-4 gap-2.5 bg-background shrink-0">
      <SidebarTrigger />

      {/* Page Title + Journey Context */}
      <div className="flex items-center gap-2 min-w-0">
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
      </div>

      <div className="h-4 w-px bg-border mx-0.5 shrink-0" />

      {/* Active journey context */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
        <span className="truncate font-medium text-foreground">Strategic Leadership</span>
        <span className="shrink-0 text-muted-foreground">Level 3.1 → 4.0</span>
        <span className="flex items-center gap-0.5 text-primary shrink-0">
          <TrendingUp className="h-3 w-3" /> Rising
        </span>
      </div>

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
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <User className="h-3.5 w-3.5" />
      </button>
    </header>
  );
}
