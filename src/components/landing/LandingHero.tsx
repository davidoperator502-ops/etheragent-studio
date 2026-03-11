import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Activity, Target, Heart, MessageCircle, Share2, UserCircle2, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function LandingHero() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const { data } = await supabase
          .from('visual_assets')
          .select('url')
          .eq('id', 'demo_ecommerce_social')
          .single();
        
        if (data?.url) setVideoUrl(data.url);
      } catch (error) {
        console.log("Cargando video de respaldo...");
      }
    };
    fetchAsset();
  }, []);

  const displayVideo = videoUrl || "https://cdn.pixabay.com/video/2023/10/22/186115-877636454_large.mp4";

  return (
    <div className="relative w-full bg-[#050505] text-white overflow-visible flex flex-col items-center pt-32 pb-16">
      
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-20 max-w-4xl mx-auto text-center px-4 mt-8 mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111] border border-white/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">Motor E-Commerce Activo</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter leading-[1.05] mb-6">
          Tu Agencia de Marketing.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            Comandada por Voz.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto font-medium">
          El sistema compila el video, despliega el anuncio y optimiza el presupuesto. Latencia cero.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/dashboard/executive-demo')} className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <Play size={16} className="fill-black" /> Iniciar Task Replay
          </button>
          <button onClick={() => navigate('/dashboard/subscription')} className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-colors hover:bg-white/5">
            Ver Planes <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-20">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden md:flex flex-col w-72 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
               <span className="font-black text-emerald-500">V</span>
             </div>
             <div>
               <h3 className="text-sm font-bold text-white">Valeria M.</h3>
               <p className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Social Lab</p>
             </div>
          </div>
          <div className="bg-[#111] p-4 rounded-xl border border-white/5 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-sm" />
             <p className="text-sm text-zinc-300 leading-relaxed">
               "150 hooks sintetizados. El formato 'unboxing caótico' proyecta 87% de retención. Costo por clic aplastado a $0.12. Compilando..."
             </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, type: "spring" }}
          className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] bg-black border-[8px] border-[#1c1c1e] rounded-[3.5rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden shrink-0 group cursor-pointer"
          onClick={() => navigate('/dashboard/executive-demo')}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50" />

          <video 
            src={displayVideo} 
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
          />

          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 bg-gradient-to-b from-black/40 via-transparent to-black/80 pt-10">
            <div className="flex justify-between items-start mt-2">
              <span className="text-white font-bold text-lg drop-shadow-md">Para ti</span>
              <Sparkles size={16} className="text-emerald-400" />
            </div>
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col gap-2 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <UserCircle2 size={24} className="text-white" />
                  <span className="text-white font-bold drop-shadow-md">@NeuroBoost</span>
                </div>
                <p className="text-white text-sm drop-shadow-md leading-tight">La energía del futuro. Dominando el ROAS. 🚀 #AI</p>
              </div>
              <div className="flex flex-col items-center gap-5 pb-2">
                <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><Heart size={20} className="text-white" fill="white" /></div><span className="text-white text-xs">245K</span></div>
                <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><MessageCircle size={20} className="text-white" fill="white" /></div><span className="text-white text-xs">12K</span></div>
                <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"><Share2 size={20} className="text-white" fill="white" /></div><span className="text-white text-xs">8.4K</span></div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
            className="absolute left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_20px_#10b981] z-30 opacity-70"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-40 backdrop-blur-[2px]">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              <Play size={32} className="fill-black ml-2" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
          className="hidden xl:flex flex-col gap-4 w-64"
        >
          <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-3 mb-2">
              <Target size={18} className="text-emerald-500" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Target MRR</span>
            </div>
            <span className="text-4xl font-black text-white">$1.2M</span>
            <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-emerald-500" /></div>
          </div>

          <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={18} className="text-blue-500" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Est. ROAS</span>
            </div>
            <span className="text-4xl font-black text-white">4.8x</span>
            <p className="text-xs text-blue-400 mt-2 font-bold">+12% vs Campaña Anterior</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
