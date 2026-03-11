import React from 'react';
import { Home, PlayCircle, Settings, Grid } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MobileTabBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const TABS = [
        { icon: Home, route: '/hub', label: 'Hub' },

        { icon: Grid, route: '/social', label: 'Labs' },
        { icon: PlayCircle, route: '/replay', label: 'Replay' },
        { icon: Settings, route: '/configuracion', label: 'Ajustes' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-zinc-950/80 backdrop-blur-2xl border-t border-white/10 pb-6 pt-2 px-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {TABS.map((tab) => {
                const isActive = location.pathname === tab.route;
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.route}
                        onClick={() => navigate(tab.route)}
                        className="flex flex-col items-center gap-1 p-2 transition-all active:scale-90"
                    >
                        <div className={`relative p-2 rounded-xl transition-colors ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500'}`}>
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />}
                        </div>
                        {/* Texto micro para mayor claridad nativa */}
                        <span className={`text-[10px] font-medium ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
