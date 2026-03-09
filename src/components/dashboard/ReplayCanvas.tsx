import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Smartphone, MonitorPlay, Activity, Cpu, ShieldCheck } from 'lucide-react';

interface ReplayCanvasProps {
    activeAgent: 'marcus' | 'valeria' | 'viktor' | 'kaelen' | 'idle';
}

const techVariants: any = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(20px) brightness(0.5)' },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        transition: { duration: 0.5, type: 'spring', bounce: 0.2 }
    },
    exit: {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(15px) brightness(2)',
        transition: { duration: 0.3 }
    }
};

export default function ReplayCanvas({ activeAgent }: ReplayCanvasProps) {
    return (
        <div className="relative w-full h-full min-h-[600px] bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center p-8 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">

            {/* Grid de Hardware (Fondo persistente más visible) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />

            <AnimatePresence mode="wait">

                {/* 1. ESTADO IDLE / MARCUS (Telemetría Global) */}
                {(activeAgent === 'marcus' || activeAgent === 'idle') && (
                    <motion.div
                        key="marcus"
                        variants={techVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="w-full h-full max-h-[500px] bg-black/80 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.15)] group"
                    >
                        {/* Efectos de luz trasera */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative flex items-center justify-center w-32 h-32 mb-8">
                                {/* Anillos de radar giratorios */}
                                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full border-t-cyan-500 animate-spin" style={{ animationDuration: '3s' }} />
                                <div className="absolute inset-4 border border-cyan-500/20 rounded-full border-b-cyan-400 animate-spin-reverse" style={{ animationDuration: '5s' }} />
                                <Globe size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                            </div>

                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-[0.2em] mb-4 text-center">
                                PROTOCOL: GENESIS
                            </h2>

                            {/* Terminal simulada */}
                            <div className="bg-black/50 border border-white/5 rounded-lg p-4 w-full max-w-md font-mono text-xs text-cyan-500/70 text-left">
                                <p className="flex items-center gap-2"><Cpu size={12} /> Booting EtherAgent OS Kernel...</p>
                                <p className="flex items-center gap-2 mt-1"><ShieldCheck size={12} /> Securing connection to Neural Matrix...</p>
                                <p className="text-white mt-2 animate-pulse">&gt; Escaneando vectores de retención globales_</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. ESTADO VALERIA (Unified Mobile UI - iPhone Mockup) */}
                {activeAgent === 'valeria' && (
                    <motion.div
                        key="valeria"
                        variants={techVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="w-full max-w-[320px] aspect-[9/19] bg-black border-[14px] border-zinc-900 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.25)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
                            <div className="w-28 h-full bg-zinc-900 rounded-b-2xl" /> {/* Dynamic Island más realista */}
                        </div>
                        {/* UI de la App inyectada */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-emerald-900/40 to-black" />
                            <div className="absolute bottom-10 left-6 right-6 backdrop-blur-md bg-black/40 border border-white/10 p-4 rounded-2xl shadow-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Activity size={16} className="text-black" />
                                    </div>
                                    <p className="text-white font-semibold text-sm">EtherAgent Sync</p>
                                </div>
                                <p className="text-emerald-400 font-mono text-xs">Hook Neural: 6s Bumper Deployed</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. ESTADO VIKTOR (Valla 21:9 Metaverso) */}
                {activeAgent === 'viktor' && (
                    <motion.div
                        key="viktor"
                        variants={techVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="w-full aspect-[21/9] bg-black border border-amber-500/40 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.15)] group"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                        <MonitorPlay size={56} className="text-amber-500 mb-4 relative z-10" />
                        <h2 className="text-4xl font-black text-amber-500 tracking-[0.2em] relative z-10 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)] text-center">
                            NEO-SHIBUYA OOH
                        </h2>
                        <p className="text-amber-400/80 font-mono mt-2 tracking-widest relative z-10 bg-black/50 px-4 py-1 rounded-full border border-amber-500/30 backdrop-blur-md">DESPLIEGUE EN CURSO</p>
                    </motion.div>
                )}

                {/* 4. ESTADO KAELEN (Dashboard Performance B2B) */}
                {activeAgent === 'kaelen' && (
                    <motion.div
                        key="kaelen"
                        variants={techVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="w-full max-w-3xl aspect-video bg-zinc-900/90 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.2)]"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <Activity className="text-violet-500" />
                                <span className="text-white font-mono">META ADS INJECTION</span>
                            </div>
                            <span className="text-emerald-400 font-mono bg-emerald-400/10 px-3 py-1 rounded-full animate-pulse border border-emerald-500/20">ACTIVE</span>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-black/60 p-6 rounded-xl border border-white/5 shadow-inner">
                                <p className="text-zinc-500 text-sm font-mono mb-2">ROAS</p>
                                <p className="text-4xl text-emerald-400 font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">+420%</p>
                            </div>
                            <div className="bg-black/60 p-6 rounded-xl border border-white/5 shadow-inner">
                                <p className="text-zinc-500 text-sm font-mono mb-2">CPA REDUCTION</p>
                                <p className="text-4xl text-emerald-400 font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">-42.5%</p>
                            </div>
                            <div className="bg-black/60 p-6 rounded-xl border border-violet-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                                <div className="absolute inset-0 bg-violet-500/10 animate-pulse" />
                                <p className="text-violet-400 text-sm font-mono mb-2 relative z-10">BUDGET ALLOCATED</p>
                                <p className="text-3xl text-white font-bold tracking-tighter relative z-10">$150,000</p>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
