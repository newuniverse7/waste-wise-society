import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import DashboardLayout from "@/components/DashboardLayout";
import Landing from "@/pages/Landing";
import LoginPage from "@/pages/LoginPage";
import UserDashboard from "@/pages/UserDashboard";
import RequestPickup from "@/pages/RequestPickup";
import SmartWasteSubmission from "@/pages/SmartWasteSubmission";
import RequestHistory from "@/pages/RequestHistory";
import Leaderboard from "@/pages/Leaderboard";
import Notifications from "@/pages/Notifications";
import AIClassifier from "@/pages/AIClassifier";
import Challenges from "@/pages/Challenges";
import Marketplace from "@/pages/Marketplace";
import CarbonImpact from "@/pages/CarbonImpact";
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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const homeRedirect = auth.role === "admin" ? "/admin" : auth.role === "worker" ? "/worker" : "/dashboard";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homeRedirect} replace />} />
      <Route path="/login" element={<Navigate to={homeRedirect} replace />} />

      <Route element={<DashboardLayout />}>
        {/* User */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/request" element={<RequestPickup />} />
        <Route path="/dashboard/smart-submit" element={<SmartWasteSubmission />} />
        <Route path="/dashboard/history" element={<RequestHistory />} />
        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
        <Route path="/dashboard/classify" element={<AIClassifier />} />
        <Route path="/dashboard/challenges" element={<Challenges />} />
        <Route path="/dashboard/marketplace" element={<Marketplace />} />
        <Route path="/dashboard/impact" element={<CarbonImpact />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pickups" element={<AdminPickups />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/workers" element={<AdminWorkers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        {/* Worker */}
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker/active" element={<WorkerActive />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
