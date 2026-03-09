import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, PlayCircle, ShoppingCart, TrendingUp, Film } from 'lucide-react';
import { api } from '@/services/api';
import type { Template } from '@/types';
import { templateCategories } from '@/services/mockData';
import GlassCard from '@/components/GlassCard';
import CyberButton from '@/components/CyberButton';

export default function TemplateVault() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.getTemplates().then((data) => {
      setTemplates(data);
      setLoading(false);
    });
  }, []);

  const filtered = activeFilter === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeFilter);

  const handlePurchase = async (templateId: string) => {
    setPurchasing(templateId);
    try {
      await api.purchaseTemplate(templateId);
      alert('¡Compra realizada con éxito!');
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-20 w-1/3 bg-white/5 animate-pulse rounded-2xl" />
        <div className="h-10 w-1/4 bg-white/5 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 bg-white/5 animate-pulse rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles size={14} /> Neural Templates Vault
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Campaign Kits</h2>
        <p className="text-sm text-white/40 mt-2 max-w-2xl">
          No empieces desde cero. Adquiere estructuras de campañas probadas en combate, inyéctalas en el motor de EtherAgent y lanza en minutos.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {templateCategories.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.name)}
            className={`px-5 py-2.5 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold ${
              activeFilter === filter.name
                ? 'bg-white text-black border-white'
                : 'bg-card border-white/5 text-white/60 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <span className="mr-2">{filter.icon}</span>
            {filter.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((template) => (
          <GlassCard key={template.id} className="overflow-hidden group" padding="none">
            <div className="relative h-52 overflow-hidden">
              <img src={template.image} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-[10px] font-bold bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">{template.category}</span>
                {template.bestseller && (
                  <span className="text-[10px] font-bold bg-emerald-500/80 backdrop-blur-sm text-black px-3 py-1 rounded-full">Best Seller</span>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <PlayCircle size={32} className="text-white" />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 flex gap-3">
                <span className="text-[10px] font-mono text-emerald-400 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <TrendingUp size={10} /> ROI: {template.metrics.roi}
                </span>
                <span className="text-[10px] font-mono text-white/60 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <Film size={10} /> {template.metrics.time}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">{template.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{template.description}</p>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Incluye en el Kit:</p>
                {template.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-xs text-white/50">{inc}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] text-white/20 block">Precio único</span>
                  <span className="text-2xl font-bold text-white">${template.price}</span>
                </div>
                <CyberButton 
                  onClick={() => handlePurchase(template.id)}
                  loading={purchasing === template.id}
                  icon={<ShoppingCart size={14} />}
                >
                  Comprar
                </CyberButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
