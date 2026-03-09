import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Radio, Volume2, Send } from 'lucide-react';
import { useSonicMetrics } from '@/hooks/useSonicMetrics';

// We need a Waveform icon – lucide-react doesn't export "Waveform" directly,
// so we use AudioWaveform (available since lucide-react v0.300+) or fallback to Radio.
// If AudioWaveform is not available in your version, swap it for another icon.
import { AudioWaveform as Waveform } from 'lucide-react';

interface SonicLabProps {
    isDemoMode?: boolean;
}

export default function SonicLab({ isDemoMode = false }: SonicLabProps) {
    const [prompt, setPrompt] = useState('');

    // EXTRAEMOS LA DATA DE AUDIO DESDE SUPABASE
    const { sonicData, isLoading } = useSonicMetrics();

    // Lógica del Fantasma (isDemoMode)
    useEffect(() => {
        if (isDemoMode) {
            setPrompt('');
            const ghostCommand = `Sintetizar cuña radial para ${sonicData.platform}. Inyectar frecuencias a ${sonicData.frequency} con el nodo vocal de ${sonicData.voiceModel}.`;
            let i = 0;
            const typing = setInterval(() => {
                setPrompt(ghostCommand.slice(0, i));
                i++;
                if (i > ghostCommand.length) clearInterval(typing);
            }, 30);
            return () => clearInterval(typing);
        }
    }, [isDemoMode, sonicData]);

    return (
        // CONTENEDOR RAÍZ RESPONSIVO
        <div className="w-full h-full bg-black flex flex-col md:flex-row overflow-y-auto md:overflow-hidden pb-32 md:pb-0">

            {/* 1. PANEL DE CONTROL (Izquierda) */}
            <div className="w-full md:w-5/12 lg:w-4/12 p-4 md:p-8 flex flex-col gap-6 md:gap-8 order-2 md:order-1 border-t md:border-t-0 md:border-r border-white/5 bg-zinc-950/30">

                <div className="flex items-center gap-3">
                    <Mic2 className="text-amber-500 w-6 h-6 md:w-8 md:h-8" />
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase">Sonic Lab</h2>
                </div>

                {/* PARÁMETROS DE AUDIO DINÁMICOS */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        <Radio size={14} className="text-amber-500" /> Matriz de Frecuencia
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        {/* PLATAFORMA */}
                        <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl col-span-2">
                            <p className="text-zinc-500 text-[10px] md:text-xs font-mono mb-1">CANAL DE DISTRIBUCIÓN</p>
                            {isLoading ? <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" /> : <p className="text-white font-bold">{sonicData.platform}</p>}
                        </div>

                        {/* FRECUENCIA */}
                        <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
                            <p className="text-zinc-500 text-[10px] md:text-xs font-mono mb-1">FRECUENCIA</p>
                            {isLoading ? <div className="h-5 w-12 bg-zinc-800 rounded animate-pulse" /> : <p className="text-amber-400 font-bold">{sonicData.frequency}</p>}
                        </div>

                        {/* DECIBELIOS */}
                        <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
                            <p className="text-zinc-500 text-[10px] md:text-xs font-mono mb-1">LIMITADOR</p>
                            {isLoading ? <div className="h-5 w-12 bg-zinc-800 rounded animate-pulse" /> : <p className="text-white font-bold">{sonicData.decibels}</p>}
                        </div>
                    </div>
                </div>

                {/* INPUT DE DIRECTIVA */}
                <div className="mt-auto">
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <textarea
                            value={prompt}
                            readOnly={isDemoMode}
                            onChange={(e) => !isDemoMode && setPrompt(e.target.value)}
                            placeholder="Directiva de síntesis vocal..."
                            className="w-full h-24 md:h-32 bg-transparent text-white p-4 outline-none resize-none text-sm placeholder:text-zinc-600"
                        />
                        <div className="flex justify-between items-center p-2 bg-black/40 border-t border-white/5">
                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 pl-2">
                                <Volume2 size={12} /> ElevenLabs Sync
                            </span>
                            <button
                                disabled={!prompt}
                                className={`px-4 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${!prompt ? 'bg-zinc-800 text-zinc-600' : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'
                                    }`}
                            >
                                <Send size={16} /> SINTETIZAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. EL VIEWPORT DEL REPRODUCTOR (Derecha) */}
            <div className="w-full md:w-7/12 lg:w-8/12 p-4 md:p-8 bg-black flex flex-col items-center justify-center order-1 md:order-2 min-h-[50vh] md:min-h-0 relative">

                {/* REPRODUCTOR HOLOGRÁFICO */}
                <div className="w-full max-w-lg bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(245,158,11,0.1)] relative overflow-hidden">

                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">Instancia Vocal Activa</p>
                            {isLoading ? (
                                <div className="h-8 w-48 bg-zinc-900 rounded animate-pulse" />
                            ) : (
                                <h3 className="text-2xl md:text-3xl text-white font-black tracking-tight">{sonicData.voiceModel}</h3>
                            )}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                            <Waveform className="text-amber-500 w-5 h-5" />
                        </div>
                    </div>

                    {/* ONDAS REACTIVAS (Estéticas) */}
                    <div className="flex items-center justify-center gap-1 h-24 mb-8 opacity-80">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [`20%`, `${Math.random() * 100}%`, `20%`] }}
                                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-2 rounded-full bg-amber-500"
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-6">
                        <span className="text-zinc-500 font-mono text-xs">00:00:00</span>
                        <span className="text-amber-500 font-mono text-xs font-bold animate-pulse">LIVE RENDER</span>
                        <span className="text-zinc-500 font-mono text-xs">00:00:30</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
