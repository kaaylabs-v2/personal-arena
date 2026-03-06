import { Search, Bell, User, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function GlobalContextBar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <header className="h-11 flex items-center border-b border-border px-4 gap-3 bg-background shrink-0">
      <SidebarTrigger />

      {/* Arena label — only when sidebar is collapsed */}
      {isCollapsed && (
        <>
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-[10px]">A</span>
            </div>
            <span className="font-display font-semibold text-foreground text-sm tracking-tight">Arena</span>
          </div>
          <div className="h-4 w-px bg-border mx-1" />
        </>
      )}

      {/* Current journey context */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
        <span className="truncate text-foreground font-medium">Strategic Leadership</span>
        <span className="shrink-0">Lvl 3.1 → 4.0</span>
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
