import { Recycle, LayoutDashboard, Truck, ClipboardList, Trophy, Bell, BarChart3, Users, LogOut, Brain, Target, Gift, Leaf } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const userLinks = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Request Pickup", url: "/dashboard/request", icon: Truck },
  { title: "My Requests", url: "/dashboard/history", icon: ClipboardList },
  { title: "AI Classifier", url: "/dashboard/classify", icon: Brain },
  { title: "Challenges", url: "/dashboard/challenges", icon: Target },
  { title: "Marketplace", url: "/dashboard/marketplace", icon: Gift },
  { title: "Carbon Impact", url: "/dashboard/impact", icon: Leaf },
  { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
];

const adminLinks = [
  { title: "Overview", url: "/admin", icon: BarChart3 },
  { title: "Pickup Requests", url: "/admin/pickups", icon: ClipboardList },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Workers", url: "/admin/workers", icon: Truck },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const workerLinks = [
  { title: "My Pickups", url: "/worker", icon: ClipboardList },
  { title: "Active", url: "/worker/active", icon: Truck },
];

export function AppSidebar() {
  const { auth, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const links = auth.role === "admin" ? adminLinks : auth.role === "worker" ? workerLinks : userLinks;
  const label = auth.role === "admin" ? "Admin Panel" : auth.role === "worker" ? "Worker Panel" : "EcoTrack";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-3 py-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-eco shrink-0">
            <Recycle className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-bold text-sidebar-foreground text-sm">EcoTrack</div>
              <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">{label}</div>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="transition-snappy hover:bg-sidebar-accent rounded-lg"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {!collapsed && (
          <div className="px-2 py-1 text-xs text-sidebar-foreground/60 truncate">
            {auth.userName}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
