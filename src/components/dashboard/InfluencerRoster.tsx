import { useState, useEffect } from 'react';
import { Star, Sparkles, Info } from 'lucide-react';
import { api } from '@/services/api';
import type { Avatar } from '@/types';
import { avatarCategories } from '@/services/mockData';
import GlassCard from '@/components/GlassCard';
import CyberButton from '@/components/CyberButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectAvatar: (avatar: Avatar) => void;
}

export default function InfluencerRoster({ selectedCategory, setSelectedCategory, onSelectAvatar }: Props) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAvatars(null, true).then((data) => {
      setAvatars(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      api.getAvatars(null, true).then((data) => {
        setAvatars(data);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = selectedCategory === 'All' || selectedCategory === 'All Avatars' 
    ? avatars 
    : avatars.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Marketplace</span>
        <h2 className="text-3xl font-bold text-white tracking-tight mt-1">Marketplace de Alquiler</h2>
        <p className="text-sm text-white/40 mt-1">Selecciona un influencer para previsualizarlo en formato móvil.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {avatarCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold ${
              selectedCategory === cat.name
                ? 'bg-white text-black border-white'
                : 'bg-card border-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((avatar) => {
          const isEliasV = avatar.id === 'eth_zero';
          return (
            <div 
              key={avatar.id}
              className="relative h-96 rounded-[24px] overflow-hidden group cursor-pointer border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
            >
              {/* Imagen Dinámica HQ en el fondo */}
              <img 
                src={avatar.media?.avatar_hq || avatar.image} 
                alt={avatar.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradiente Oscuro para que el texto resalte */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

              {/* Etiqueta Founder Edition */}
              {isEliasV && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-emerald-500/90 to-transparent h-16 flex items-start justify-center pt-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    <Sparkles size={10} className="animate-pulse" />
                    Founder Edition
                  </span>
                </div>
              )}

              {/* Video Badge */}
              {avatar.videoUrl && (
                <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-emerald-500/90 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-black">Video disponible</span>
                </div>
              )}

              {/* Contenido de la Tarjeta */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                {/* Tag del Nicho */}
                <span className="w-max px-2 py-1 mb-3 text-[10px] uppercase tracking-wider font-bold bg-white/10 backdrop-blur-md rounded-md border border-white/5 text-emerald-400">
                  {avatar.category || 'B2B Instance'}
                </span>
                
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {avatar.name}
                    </h3>
                    <p className="text-sm text-white/60">
                      {avatar.role}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Licencia</p>
                    <p className="text-xl font-bold text-white">
                      {avatar.price}
                      <span className="text-sm font-normal text-white/50">/mo</span>
                    </p>
                  </div>
                </div>

                {/* Botón de Despliegue que aparece en Hover */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-in-out mt-4">
                  <CyberButton 
                    variant="primary" 
                    onClick={() => onSelectAvatar(avatar)}
                    className="w-full"
                  >
                    Desplegar Instancia
                  </CyberButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
