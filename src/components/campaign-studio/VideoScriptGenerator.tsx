import { motion } from 'framer-motion';
import { Wand2, Upload, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { HighlightedPrompt } from './HighlightedPrompt';
import { DurationId } from '@/lib/prompt-engine/types';

const DURATIONS: { id: DurationId; scenes: string }[] = [
  { id: '10s', scenes: '~5 escenas' },
  { id: '30s', scenes: '~10 escenas' },
  { id: '60s', scenes: '~15 escenas' },
];

interface Props {
  generatedPrompts: Record<string, string>;
  generatingDuration: string | null;
  onGenerate: (dur: DurationId) => void;
  onExport: () => void;
  onCopy: (text: string, label: string) => void;
}

// Generador de Guiones de Video 10/30/60s. Extraído de SocialLab.tsx:641-708.
export function VideoScriptGenerator({ generatedPrompts, generatingDuration, onGenerate, onExport, onCopy }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-emerald-500/20 p-5 rounded-xl w-full mb-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Wand2 size={16} className="text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-zinc-100 text-sm font-bold leading-tight">Generador de Guiones de Video</p>
            <p className="text-zinc-500 text-xs mt-0.5">Guiones listos para producción en 3 duraciones</p>
          </div>
        </div>
        {Object.keys(generatedPrompts).length > 0 && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-all duration-200 border border-emerald-500/30 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          >
            <Upload size={12} /> Exportar
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {DURATIONS.map(({ id: dur, scenes }) => {
          const done = !!generatedPrompts[dur];
          const busy = generatingDuration === dur;
          return (
            <button
              key={dur}
              onClick={() => onGenerate(dur)}
              disabled={generatingDuration !== null}
              className={`relative flex flex-col items-center justify-center gap-1 py-4 rounded-lg border transition-all duration-200 active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
                done ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-zinc-800/60 border-white/5 hover:bg-zinc-800 hover:border-emerald-500/30'
              }`}
            >
              {done && !busy && <CheckCircle2 size={14} className="absolute top-2 right-2 text-emerald-400" />}
              {busy ? (
                <Loader2 size={20} className="animate-spin text-emerald-400" />
              ) : (
                <span className={`text-xl font-black tracking-tight ${done ? 'text-emerald-300' : 'text-zinc-200'}`}>{dur}</span>
              )}
              <span className="text-[10px] text-zinc-500 tracking-wide">{busy ? 'Generando…' : scenes}</span>
            </button>
          );
        })}
      </div>

      {Object.entries(generatedPrompts).map(([dur, prompt]) => (
        <div key={dur} className="mb-3 last:mb-0 rounded-lg overflow-hidden border border-white/10">
          <div className="sticky top-0 flex items-center justify-between bg-zinc-900 px-3 py-2 border-b border-white/10">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Prompt {dur}</span>
            <button
              onClick={() => onCopy(prompt, `Prompt ${dur}`)}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-emerald-400 transition-colors duration-200 text-[10px] font-mono uppercase tracking-wider"
            >
              <Copy size={12} /> Copiar
            </button>
          </div>
          <div className="p-3 bg-black/60 font-mono text-[10px] leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto custom-scrollbar">
            <HighlightedPrompt text={prompt} />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
