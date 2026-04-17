import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Recycle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout() {
  const { auth } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 gap-3 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center shadow-eco">
                <Recycle className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-sm">EcoTrack <span className="gradient-text">MBMC</span></span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-xs text-muted-foreground hidden sm:block">
                <span className="capitalize font-medium text-foreground">{auth.role === "admin" ? "Admin" : auth.role === "worker" ? "Worker" : "Resident"}</span> · {auth.userName}
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto relative">
            <div className="absolute inset-0 gradient-mesh pointer-events-none opacity-40" />
            <div className="relative">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
