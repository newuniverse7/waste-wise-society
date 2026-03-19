import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Recycle } from "lucide-react";

export default function DashboardLayout() {
  const { auth } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-background/80 backdrop-blur-sm px-4 gap-3 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">EcoTrack MBMC</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {auth.role === "admin" ? "Admin" : auth.role === "worker" ? "Worker" : "Resident"} · {auth.userName}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
