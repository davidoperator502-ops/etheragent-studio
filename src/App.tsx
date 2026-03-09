import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { VoiceProvider } from '@/context/GlobalVoiceContext';
import OmniAgentOrb from '@/components/layout/OmniAgentOrb';

const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Prototypes = lazy(() => import('./pages/Prototypes'));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="animate-spin text-emerald-400" size={40} />
  </div>
);

const App = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <VoiceProvider>
              <Suspense fallback={<PageLoader />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/prototypes" element={<Prototypes />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
              <OmniAgentOrb />
            </VoiceProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </BrowserRouter>
);

export default App;
