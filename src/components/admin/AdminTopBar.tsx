import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminTopBarProps {
  pageTitle?: string;
}

export function AdminTopBar({ pageTitle }: AdminTopBarProps) {
  return (
    <header className="h-11 flex items-center border-b border-border px-4 gap-3 bg-background shrink-0">
      <SidebarTrigger />
      {pageTitle && (
        <span className="text-sm font-medium text-foreground">{pageTitle}</span>
      )}
      <div className="flex-1" />
      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <Search className="h-3.5 w-3.5" />
      </button>
      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
        <Bell className="h-3.5 w-3.5" />
      </button>
      <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-display font-bold text-[10px]">
        A
      </div>
    </header>
  );
}
