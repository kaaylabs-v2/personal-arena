import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  BarChart3,
  ArrowLeft,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Programs", icon: BookOpen, path: "/admin/programs" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Tenants", icon: Building2, path: "/admin/tenants" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background font-display font-bold text-xs">A</span>
          </div>
          <div>
            <span className="font-display font-semibold text-foreground text-sm tracking-tight">Arena</span>
            <span className="text-[10px] text-muted-foreground ml-1.5 uppercase tracking-wider font-medium">Studio</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Manage</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={cn(isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium")}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 border-t border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1.5 rounded-md hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Learner View
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
