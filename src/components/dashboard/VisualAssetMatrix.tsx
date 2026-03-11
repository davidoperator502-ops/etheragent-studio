import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Loader2, CheckCircle2, Image as ImageIcon, Target, Globe, Activity, DollarSign, Layout, MonitorPlay, Film, Smartphone } from 'lucide-react';

// ESTRUCTURA DE LOS ASSETS VISUALES POR MISIÓN
const MISSION_ASSETS = {
  ecommerce: [
    { id: 'demo_ecommerce_hub', agent: 'Marcus', title: '1. Brand Core (Hub)', desc: 'Logo, render de producto o imagen abstracta de la marca.', icon: Layout },
    { id: 'demo_ecommerce_social', agent: 'Valeria', title: '2. Viral Asset (Social)', desc: 'Video vertical (9:16) tipo TikTok / Reel.', icon: Smartphone },
    { id: 'demo_ecommerce_ooh', agent: 'Viktor', title: '3. Spatial Ad (OOH)', desc: 'Imagen o video panorámico (21:9) en una valla o ciudad.', icon: MonitorPlay },
    { id: 'demo_ecommerce_commercial', agent: 'Kaelen', title: '4. VSL Spot (Commercial)', desc: 'Video publicitario cinemático y pulido.', icon: Film }
  ],
  saas: [
    { id: 'demo_saas_hub', agent: 'Marcus', title: '1. Brand Core (Hub)', desc: 'Dashboard oscuro, gráficas o logo de software B2B.', icon: Layout },
    { id: 'demo_saas_social', agent: 'Valeria', title: '2. Viral Asset (Social)', desc: 'Video vertical o post cuadrado tipo LinkedIn.', icon: Smartphone },
    { id: 'demo_saas_ooh', agent: 'Viktor', title: '3. Spatial Ad (OOH)', desc: 'Valla publicitaria en un aeropuerto o distrito financiero.', icon: MonitorPlay },
    { id: 'demo_saas_commercial', agent: 'Kaelen', title: '4. VSL Spot (Commercial)', desc: 'Video documental corporativo o demo de software.', icon: Film }
  ],
  fintech: [
    { id: 'demo_fintech_hub', agent: 'Marcus', title: '1. Brand Core (Hub)', desc: 'Tarjeta metálica, bóveda digital o logo bancario.', icon: Layout },
    { id: 'demo_fintech_social', agent: 'Valeria', title: '2. Viral Asset (Social)', desc: 'Video de referral o unboxing de tarjeta.', icon: Smartphone },
    { id: 'demo_fintech_ooh', agent: 'Viktor', title: '3. Spatial Ad (OOH)', desc: 'Holograma o valla en avenida principal de la ciudad.', icon: MonitorPlay },
    { id: 'demo_fintech_commercial', agent: 'Kaelen', title: '4. VSL Spot (Commercial)', desc: 'Spot comercial generando confianza e invitando a descargar.', icon: Film }
  ],
  web3: [
    { id: 'demo_web3_hub', agent: 'Marcus', title: '1. Brand Core (Hub)', desc: 'Logo 3D, token, NFT o gráfica ciberpunk.', icon: Layout },
    { id: 'demo_web3_social', agent: 'Valeria', title: '2. Viral Asset (Social)', desc: 'Video hype, cuenta regresiva o filtración simulada.', icon: Smartphone },
    { id: 'demo_web3_ooh', agent: 'Viktor', title: '3. Spatial Ad (OOH)', desc: 'Proyección sobre un edificio con coordenadas secretas.', icon: MonitorPlay },
    { id: 'demo_web3_commercial', agent: 'Kaelen', title: '4. VSL Spot (Commercial)', desc: 'Tráiler épico de lanzamiento de colección o token.', icon: Film }
  ],
  landing: [
    { id: 'landing_social', agent: 'Valeria', title: 'Social Viral', desc: 'Video vertical (9:16) con audio para landing page.', icon: Smartphone },
    { id: 'landing_ooh', agent: 'Viktor', title: 'Valla OOH', desc: 'Video panorámico (21:9) sin audio para landing.', icon: MonitorPlay },
    { id: 'landing_commercial', agent: 'Kaelen', title: 'Cinematic', desc: 'Video horizontal (16:9) de cierre para landing.', icon: Film }
  ]
};

export default function VisualAssetMatrix() {
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'saas' | 'fintech' | 'web3' | 'landing'>('ecommerce');

  useEffect(() => {
    const checkExistingAssets = async () => {
      const { data } = await supabase.from('visual_assets').select('id, url').like('id', 'demo_%');
      if (data) {
        const uploaded: Record<string, string> = {};
        data.forEach(item => { if (item.url) uploaded[item.id] = item.url; });
        setUploadedAssets(uploaded);
      }
    };
    checkExistingAssets();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, assetId: string) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      setLoadingIds(prev => ({ ...prev, [assetId]: true }));
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${assetId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('visual-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('visual-assets').getPublicUrl(fileName);
      await supabase.from('visual_assets').upsert({ id: assetId, url: publicUrl, updated_at: new Date() });

      setUploadedAssets(prev => ({ ...prev, [assetId]: publicUrl }));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir el asset visual.');
    } finally {
      setLoadingIds(prev => ({ ...prev, [assetId]: false }));
    }
  };

  const AssetCard = ({ asset }: { asset: any }) => {
    const isUploaded = !!uploadedAssets[asset.id];
    const assetUrl = uploadedAssets[asset.id];
    const isVideo = assetUrl && (assetUrl.includes('.mp4') || assetUrl.includes('.mov') || assetUrl.includes('.webm'));

    return (
      <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl flex flex-col relative group hover:border-emerald-500/20 transition-all overflow-hidden">
        
        <div className="h-40 bg-black relative border-b border-white/5 flex items-center justify-center overflow-hidden">
          {isUploaded ? (
            isVideo ? (
              <video src={assetUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <img src={assetUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            )
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-600">
              <asset.icon size={32} className="opacity-50" />
              <span className="font-mono text-[10px] uppercase">Esperando Archivo</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3 z-10">
            {isUploaded ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-emerald-500/30 text-emerald-500 text-[9px] font-mono uppercase"><CheckCircle2 size={10} /> LISTO</div>
            ) : (
              <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-zinc-400 text-[9px] font-mono uppercase">SIN MEDIA</div>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-sm font-bold text-white mb-1">
            <span className="text-zinc-500">{asset.title}</span>
          </h3>
          <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{asset.desc}</p>
          
          <div className="mt-auto">
            <label className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${isUploaded ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-[#111] hover:bg-zinc-900 border-white/10 text-white'}`}>
              <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, asset.id)} disabled={loadingIds[asset.id]} className="hidden" />
              {loadingIds[asset.id] ? <><Loader2 size={14} className="animate-spin" /> Procesando...</> : <><Upload size={14} /> {isUploaded ? 'REEMPLAZAR ARCHIVO' : 'SUBIR ASSET'}</>}
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 pb-32 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="text-emerald-500" size={16} />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">ASSET DEPLOYMENT CONTROL</span>
          </div>
          <h1 className="text-3xl font-black tracking-widest uppercase text-white mb-4">VISUAL <span className="text-zinc-500">MATRIX</span></h1>
          <p className="text-zinc-400 text-sm">Sube los videos e imágenes (Assets) que se proyectarán en los celulares de la Executive Demo.</p>
        </header>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-[#111] p-1 rounded-xl w-fit border border-white/5">
            <button onClick={() => setActiveTab('ecommerce')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'ecommerce' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-500 hover:text-white'}`}><Target size={14}/> E-Commerce</button>
            <button onClick={() => setActiveTab('saas')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'saas' ? 'bg-blue-500/20 text-blue-500' : 'text-zinc-500 hover:text-white'}`}><Globe size={14}/> B2B SaaS</button>
            <button onClick={() => setActiveTab('fintech')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'fintech' ? 'bg-purple-500/20 text-purple-500' : 'text-zinc-500 hover:text-white'}`}><Activity size={14}/> Fintech</button>
            <button onClick={() => setActiveTab('web3')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'web3' ? 'bg-orange-500/20 text-orange-500' : 'text-zinc-500 hover:text-white'}`}><DollarSign size={14}/> Web3</button>
            <button onClick={() => setActiveTab('landing')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'landing' ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'}`}><Layout size={14}/> Landing</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MISSION_ASSETS[activeTab].map(asset => <AssetCard key={asset.id} asset={asset} />)}
        </div>
      </div>
    </div>
  );
}
