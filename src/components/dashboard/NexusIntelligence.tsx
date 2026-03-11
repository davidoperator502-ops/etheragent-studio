import React, { useState } from 'react';
import { Globe, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NexusIntelligence() {
  const [url, setUrl] = useState('https://etheragent.studio');

  return (
    <div className="w-full h-full bg-black text-white p-4 md:p-10 overflow-y-auto pb-32">
      {/* HEADER MINIMALISTA */}
      <header className="mb-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-[0.3em]">
          <Zap size={12} /> Neural Network Active
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">NEXUS <span className="text-zinc-500">INTEL</span></h1>
      </header>

      {/* INPUT UNIT: Limpio y centrado para móvil */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-zinc-900 border border-white/5 rounded-2xl p-2 flex items-center">
            <div className="pl-4 text-zinc-500"><Globe size={18} /></div>
            <input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent p-4 outline-none font-mono text-sm md:text-base"
              placeholder="Ingrese dominio para análisis..."
            />
            <button className="bg-emerald-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all active:scale-95 text-xs md:text-sm">
              ESCANEAR
            </button>
          </div>
        </div>
      </div>

      {/* GRID DE RESULTADOS: Mobile-first (1 col) -> Desktop (2 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {[
          { label: 'Brand Safety', value: '98%', icon: <ShieldCheck className="text-emerald-500" /> },
          { label: 'Market Reach', value: 'Global', icon: <BarChart3 className="text-blue-500" /> },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-zinc-500 text-[10px] uppercase font-mono mb-1">{item.label}</p>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
            <div className="bg-black/50 p-3 rounded-full">{item.icon}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
