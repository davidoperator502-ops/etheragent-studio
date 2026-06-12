import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Video, Calendar, Tag, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  InstagramReelPreview,
  TikTokPreview,
  YouTubeShortPreview
} from '@/components/dashboard/previews/PlatformPreviews';

export default function ClientPortal() {
  const { slug } = useParams();
  const [client, setClient] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortalData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data: cliData, error: cliErr } = await supabase
          .from('clients')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (cliErr || !cliData) throw new Error('Cliente no encontrado');
        setClient(cliData);

        const { data: campData, error: campErr } = await supabase
          .from('campaigns')
          .select('*')
          .eq('client_id', cliData.id)
          .eq('estado', 'activa')
          .order('created_at', { ascending: false });
        
        if (campErr) throw campErr;
        setCampaigns(campData || []);
      } catch (err: any) {
        console.error('Portal error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400 w-12 h-12" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Portal no disponible</h1>
        <p className="text-zinc-500">{error || 'El cliente no existe.'}</p>
      </div>
    );
  }

  // Si el cliente tiene brand_colors, podríamos usarlos aquí, pero por ahora un fallback elegante
  const primaryColor = client.brand_colors?.primary || '#10b981'; 

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {client.logo_url ? (
            <img src={client.logo_url} alt={client.nombre} className="w-10 h-10 rounded-lg object-contain bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-lg" style={{ color: primaryColor }}>
              {client.nombre.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold">{client.nombre}</h1>
            <p className="text-xs text-zinc-500">Portal de Campañas Activas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
          Live
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Tus Campañas <br/>Generadas con AI.</h2>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Explora las narrativas, creatividades y activos generados estratégicamente para tu marca por EtherAgent OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length === 0 ? (
             <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
               <p className="text-zinc-500">Aún no hay campañas activas publicadas en este portal.</p>
             </div>
          ) : (
            campaigns.map((camp, i) => {
              const data = camp.contenido;
              const hasVideo = !!data?.video_url;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={camp.id} 
                  className="group relative bg-[#0a0a0c] border border-white/10 hover:border-emerald-500/50 transition-colors rounded-3xl overflow-hidden flex flex-col h-full"
                >
                  {/* Vista previa (mockup móvil) */}
                  <div className="w-full h-[400px] bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                     {/* Simulación del player */}
                     {hasVideo ? (
                        <video src={data.video_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                     ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-zinc-900 flex flex-col items-center justify-center p-8 text-center">
                          <Video className="w-12 h-12 text-zinc-700 mb-4" />
                          <h4 className="text-lg font-bold text-white uppercase italic tracking-tighter mb-2 transform -skew-x-6">{data?.hook || 'Concepto Creativo'}</h4>
                          <p className="text-xs text-zinc-500 line-clamp-3">{data?.visual_description}</p>
                        </div>
                     )}

                     {/* Overlay según plataforma si aplicara, sino genérico */}
                     <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                        <div className="absolute bottom-4 left-4 right-4">
                           <span className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur rounded text-[10px] uppercase tracking-widest font-mono text-white mb-2">
                             {camp.plataforma || 'Multi-Platform'}
                           </span>
                           <h3 className="font-bold text-lg text-white drop-shadow-md leading-tight">{camp.nombre}</h3>
                        </div>
                     </div>
                  </div>

                  {/* Metadatos */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(camp.created_at), 'dd MMM yyyy')}</span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-3 mb-6 flex-1">
                       {data?.narrative_body || 'Sin descripción detallada.'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
                         Estatus: Activa
                      </div>
                      {hasVideo && (
                         <a href={data.video_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-lg transition-colors">
                           <ExternalLink className="w-4 h-4" />
                         </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
