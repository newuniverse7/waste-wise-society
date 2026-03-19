import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import UserDashboard from "@/pages/UserDashboard";
import RequestPickup from "@/pages/RequestPickup";
import RequestHistory from "@/pages/RequestHistory";
import Leaderboard from "@/pages/Leaderboard";
import Notifications from "@/pages/Notifications";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminPickups from "@/pages/AdminPickups";
import AdminUsers from "@/pages/AdminUsers";
import AdminWorkers from "@/pages/AdminWorkers";
import AdminAnalytics from "@/pages/AdminAnalytics";
import WorkerDashboard from "@/pages/WorkerDashboard";
import WorkerActive from "@/pages/WorkerActive";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  const homeRedirect = auth.role === "admin" ? "/admin" : auth.role === "worker" ? "/worker" : "/dashboard";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homeRedirect} replace />} />

      {/* User Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/request" element={<RequestPickup />} />
        <Route path="/dashboard/history" element={<RequestHistory />} />
        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pickups" element={<AdminPickups />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/workers" element={<AdminWorkers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        {/* Worker Routes */}
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker/active" element={<WorkerActive />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
