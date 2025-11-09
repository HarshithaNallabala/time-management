import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Settings_e from "./pages/Settings_e";
import CalendarPage1 from "./pages/Calender_e";
import Statistics1 from "./pages/Statistics_e";
import Meetings1 from "./pages/Meetings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
          <Route path="/secretary-dashboard" element={<SecretaryDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/Calendar" element={<CalendarPage />} />
          <Route path="/Statistics" element={<Statistics />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Settings_e" element={<Settings_e />} />
          <Route path="/Calendar1" element={<CalendarPage1 />} />
          <Route path="/Statistics1" element={<Statistics1 />} />
          <Route path="/Meetings1" element={<Meetings1 />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
