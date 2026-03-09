import React, { useState, useEffect } from 'react';
import {
  Command, BrainCircuit, Users, Video, BarChart3, DollarSign, LayoutTemplate, Zap
} from 'lucide-react';
import type { ViewId } from '@/types';
import GlassCard from '@/components/GlassCard';

interface SidebarProps {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

const navItems: { id: ViewId; icon: React.ReactNode; label: string; sub: string }[] = [
  { id: 'spaces', icon: <Command size={18} />, label: 'Spaces', sub: 'Arquitectura' },
  { id: 'engine', icon: <BrainCircuit size={18} />, label: 'Intelligence', sub: 'Estrategia' },
  { id: 'influencers', icon: <Users size={18} />, label: 'Marketplace', sub: 'Alquiler' },
  { id: 'broadcaster', icon: <Video size={18} />, label: 'Social Lab', sub: 'Formatos Móvil' },
  { id: 'templates', icon: <LayoutTemplate size={18} />, label: 'Templates', sub: 'Kits Premium' },
  { id: 'telemetry', icon: <BarChart3 size={18} />, label: 'Telemetry', sub: 'Rendimiento' },
  { id: 'pricing', icon: <DollarSign size={18} />, label: 'Planes', sub: 'Suscripciones' },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 px-2 py-2 safe-area-bottom">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
              activeView === item.id ? 'text-emerald-400' : 'text-white/40'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-[280px] min-h-screen glass-panel border-r border-white/5 p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <Zap size={20} className="text-black" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">EtherAgent</h1>
          <p className="text-[10px] text-white/30 tracking-widest uppercase">OS • Social Authority</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
              activeView === item.id
                ? 'glass-card-active text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <span className={activeView === item.id ? 'text-emerald-400' : 'text-white/30 group-hover:text-white/50'}>
              {item.icon}
            </span>
            <div className="text-left">
              <span className="block text-xs font-semibold">{item.label}</span>
              <span className="block text-[10px] text-white/20">{item.sub}</span>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <p className="text-[10px] text-white/20 font-medium">Network Status</p>
        <div className="flex justify-between text-[10px] mt-2">
          <span className="text-white/30">Ads Deployed:</span>
          <span className="text-emerald-400 font-bold">1.4k</span>
        </div>
      </div>
    </aside>
  );
}
