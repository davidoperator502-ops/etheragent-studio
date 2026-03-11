import React from 'react';
import { Lock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName?: string;
  requiredPlan?: string;
  featureDesc?: string;
}

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  agentName = "Viktor S. (Spatial OOH)", 
  requiredPlan = "AGENCY SWARM",
  featureDesc = "Despliegue de campañas físicas y hologramas a escala urbana."
}: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0a0a0c] border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Lock size={28} className="text-blue-500" />
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldAlert size={14} className="text-zinc-500" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">Acceso Restringido</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Nodo Bloqueado</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              El agente <span className="text-white font-bold">{agentName}</span> está restringido en tu nivel actual. 
              {featureDesc && <span className="block mt-2">{featureDesc}</span>}
            </p>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center justify-between mb-8">
            <span className="text-xs font-mono uppercase text-zinc-500">Plan Requerido:</span>
            <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{requiredPlan}</span>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                onClose();
                navigate('/dashboard/subscription');
              }}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <Zap size={16} /> Hacer Upgrade Ahora
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white rounded-xl font-bold text-xs transition-colors"
            >
              Mantener Plan Actual
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
