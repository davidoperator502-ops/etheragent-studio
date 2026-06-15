import { LabSurface } from '@/lib/prompt-engine/types';

interface Props {
  surfaces: LabSurface[];
  value: string;
  onChange: (id: string) => void;
  /** clase tailwind para el estado activo (default emerald). */
  activeClass?: string;
  label?: string;
}

// Selector de superficie/formato del lab (pills horizontales).
export function SurfaceSelector({ surfaces, value, onChange, activeClass = 'bg-emerald-500 text-black', label }: Props) {
  return (
    <div className="w-full">
      {label && <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{label}</span>}
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1.5 w-max">
          {surfaces.map(s => (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className={`px-3 py-2 min-h-[36px] rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                value === s.id ? activeClass : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
