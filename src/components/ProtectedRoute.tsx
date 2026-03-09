import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full h-[100dvh] bg-[#030303] flex flex-col items-center justify-center selection:bg-emerald-500/30">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="text-emerald-500 w-12 h-12 animate-spin relative z-10" />
        </div>
        <h2 className="text-white font-black tracking-[0.2em] mb-2 uppercase">EtherAgent OS</h2>
        <p className="text-emerald-500 font-mono text-xs tracking-widest animate-pulse flex items-center gap-2">
          <ShieldAlert size={14} /> VERIFICANDO ENLACE SEGURO...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
