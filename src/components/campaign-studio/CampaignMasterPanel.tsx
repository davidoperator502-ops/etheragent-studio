import { motion } from 'framer-motion';
import { Video, Copy, Clapperboard, Eye } from 'lucide-react';
import { VideoScriptGenerator } from './VideoScriptGenerator';
import { CampaignAsset, DurationId } from '@/lib/prompt-engine/types';

interface Props {
  currentAsset: CampaignAsset;
  generatedPrompts: Record<string, string>;
  generatingDuration: string | null;
  onGenerate: (dur: DurationId) => void;
  onExport: () => void;
  onCopy: (text: string, label: string) => void;
  onCopyMaster: () => void;
  onCopyVisual: () => void;
}

// Bloque-motor reutilizable (estrategia + guiones + detalles + copiar).
// Equivalente funcional a las secciones de SocialLab.tsx:622-854, para OOH y Commercial.
export function CampaignMasterPanel({
  currentAsset, generatedPrompts, generatingDuration, onGenerate, onExport, onCopy, onCopyMaster, onCopyVisual,
}: Props) {
  return (
    <>
      {/* Estrategia Creativa Procesada (prompt visual / maestro) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl w-full mb-5 group relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-zinc-300 text-sm font-medium flex items-center gap-2">
            <Video size={14} className="text-emerald-500" /> Estrategia Creativa Procesada
          </p>
          <button
            onClick={() => onCopy(currentAsset.visual_description, 'Visual Description')}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white"
            title="Copiar Prompt"
          >
            <Copy size={14} />
          </button>
        </div>
        <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-zinc-400 leading-relaxed max-h-[250px] overflow-y-auto custom-scrollbar">
          {currentAsset.visual_description || 'Procesando prompt visual...'}
        </div>
      </motion.div>

      {/* Generador de Guiones 10/30/60 */}
      <VideoScriptGenerator
        generatedPrompts={generatedPrompts}
        generatingDuration={generatingDuration}
        onGenerate={onGenerate}
        onExport={onExport}
        onCopy={onCopy}
      />

      {/* Detalles del asset */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-zinc-900/30 border border-white/5 p-5 rounded-2xl w-full mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Tono Emocional</h5>
              <p className="text-xs text-zinc-300 capitalize">{currentAsset.emotional_tone}</p>
            </div>
            <div>
              <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Pacing / Ritmo</h5>
              <p className="text-xs text-zinc-300">{currentAsset.pacing_notes}</p>
            </div>
            <div>
              <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Call to Action</h5>
              <p className="text-xs text-emerald-400 font-bold">{currentAsset.call_to_action}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Background Audio</h5>
              <p className="text-xs text-zinc-300">{currentAsset.music_background}</p>
            </div>
            {currentAsset.on_screen_text?.length > 0 && (
              <div>
                <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Textos Destacados</h5>
                <div className="flex flex-wrap gap-1.5">
                  {currentAsset.on_screen_text.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-300 font-mono">"{t}"</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Botones de copiar */}
      <div className="flex gap-3">
        <button onClick={onCopyMaster} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95">
          <Clapperboard size={14} /> Copiar Prompt Maestro
        </button>
        <button onClick={onCopyVisual} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all active:scale-95">
          <Eye size={14} className="text-emerald-400" /> Copiar Visual
        </button>
      </div>
    </>
  );
}
