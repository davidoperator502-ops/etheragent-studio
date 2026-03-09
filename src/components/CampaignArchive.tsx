import React from 'react';
import { useCampaignHistory } from '@/hooks/useCampaignHistory';
import { Database, Loader2, ExternalLink, Activity, CheckCircle2 } from 'lucide-react';

export default function CampaignArchive() {
    const { campaigns, isLoading } = useCampaignHistory();

    if (isLoading) {
        return (
            <div className="w-full p-8 flex flex-col items-center justify-center bg-zinc-950/50 rounded-2xl border border-white/5">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase animate-pulse">
                    Desencriptando Archivo Neural...
                </p>
            </div>
        );
    }

    if (campaigns.length === 0) {
        return (
            <div className="w-full p-8 flex flex-col items-center justify-center bg-zinc-950/50 rounded-2xl border border-white/5 text-center">
                <Database className="w-12 h-12 text-zinc-700 mb-4" />
                <h3 className="text-white font-bold mb-2">No hay campañas registradas</h3>
                <p className="text-zinc-500 font-mono text-xs">El historial de tu instancia está limpio. Inicia un escaneo en el Nexus.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Database className="text-emerald-500 w-5 h-5" />
                    <h3 className="text-white font-bold tracking-widest uppercase text-sm">Registro de Despliegues</h3>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/20">
                    {campaigns.length} REGISTROS
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-950/80 border-b border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Identificador de Campaña</th>
                            <th className="p-4 font-medium">Target URL</th>
                            <th className="p-4 font-medium">Estado</th>
                            <th className="p-4 font-medium">Capital / ROAS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {campaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <p className="text-white font-bold text-sm mb-1">{camp.title}</p>
                                    <p className="text-zinc-600 font-mono text-[9px] truncate max-w-[150px]">{camp.id}</p>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-400 text-xs truncate max-w-[150px]">{camp.target_url}</span>
                                        <ExternalLink size={12} className="text-zinc-600 group-hover:text-emerald-500 transition-colors cursor-pointer" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${camp.status === 'deployed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            camp.status === 'compiling' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-zinc-800 text-zinc-400 border-zinc-700'
                                        }`}>
                                        {camp.status === 'deployed' ? <CheckCircle2 size={10} /> : <Activity size={10} />}
                                        {camp.status.toUpperCase()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="text-white text-sm font-bold">
                                        ${camp.budget_allocated?.toLocaleString() || 0}
                                    </p>
                                    <p className="text-emerald-500 font-mono text-[10px]">
                                        ROAS: {camp.metrics?.roas || 'N/A'}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
