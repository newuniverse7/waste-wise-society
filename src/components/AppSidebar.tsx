import { Recycle, LayoutDashboard, Truck, ClipboardList, Trophy, Bell, BarChart3, Users, Settings, LogOut } from "lucide-react";
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
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            <Recycle className="mr-2 h-4 w-4" />
            {!collapsed && label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="transition-snappy hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
