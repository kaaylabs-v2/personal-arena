import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import JoinArena from "./pages/JoinArena";
import IntentConfirmation from "./pages/IntentConfirmation";
import Assessment from "./pages/Assessment";
import MasteryPlan from "./pages/MasteryPlan";
import Dashboard from "./pages/Dashboard";
import ArenaSession from "./pages/ArenaSession";
import SessionSummary from "./pages/SessionSummary";
import Completion from "./pages/Completion";
import Sessions from "./pages/Sessions";
import Tasks from "./pages/Tasks";
import NextMastery from "./pages/NextMastery";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/join" element={<JoinArena />} />
          <Route path="/intent" element={<IntentConfirmation />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/mastery-plan" element={<MasteryPlan />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/arena-session" element={<ArenaSession />} />
          <Route path="/session-summary" element={<SessionSummary />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/progress" element={<Dashboard />} />
          <Route path="/journal" element={<Dashboard />} />
          <Route path="/completion" element={<Completion />} />
          <Route path="/next-mastery" element={<NextMastery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
