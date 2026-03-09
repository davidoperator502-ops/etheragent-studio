import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Activity, Zap } from 'lucide-react';
import { api } from '@/services/api';
import { useTelemetry } from '@/hooks/useTelemetry';
import type { TelemetryData } from '@/types';
import GlassCard from '@/components/GlassCard';

export default function ActiveTelemetry() {
  const [initialData, setInitialData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: liveData, connected } = useTelemetry({ enabled: true, updateInterval: 3000 });

  const data = liveData || initialData;

  useEffect(() => {
    api.getTelemetry().then((result) => {
      setInitialData(result);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-8">
        <div className="h-20 w-1/3 bg-white/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-white/5 animate-pulse rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      icon: <DollarSign size={24} className="text-emerald-400" />,
      label: 'Social Ad Revenue',
      value: `$${data.revenue.toLocaleString()}.00`,
      progress: 75,
      color: 'from-emerald-500 to-emerald-300'
    },
    {
      icon: <TrendingUp size={24} className="text-emerald-400" />,
      label: 'Daily Lead Gen Feed',
      value: data.dailyLeads.toLocaleString(),
      progress: 50,
      color: 'from-emerald-500 to-emerald-300'
    },
    {
      icon: <Users size={24} className="text-emerald-400" />,
      label: 'Active Rentals',
      value: data.activeRentals.toString(),
      progress: 35,
      color: 'from-blue-500 to-blue-300'
    },
    {
      icon: <Activity size={24} className="text-emerald-400" />,
      label: 'ROAS 7-Day',
      value: `${data.roas}x`,
      progress: 80,
      color: 'from-purple-500 to-purple-300'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Activity size={14} /> Live Telemetry
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-sm text-white/40 mt-1">Monitoreo de impacto social y rendimiento de alquileres.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <GlassCard key={i}>
            <div className="flex items-start justify-between mb-4">
              {card.icon}
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Real-time</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full mb-3">
              <div className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-500`} style={{ width: `${card.progress}%` }} />
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-white/30 uppercase tracking-widest mt-1">{card.label}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-emerald-400" />
            <p className="text-sm font-bold text-white">Top Performing Avatar</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div>
            <p className="text-lg font-bold text-white">{data.topAvatar}</p>
            <p className="text-xs text-white/30">Highest rental count this month</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-emerald-400">+127%</p>
            <p className="text-[10px] text-white/30">vs last month</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
