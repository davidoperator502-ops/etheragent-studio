import React, { useState, useEffect } from 'react';
import { Volume2, Upload, Loader2, CheckCircle2, Terminal, PlaySquare, Target, Globe, Activity, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// 1. VOCES DEL SISTEMA (Command Hub)
const COMMAND_HUB_SCRIPTS = [
  { id: 'ch_welcome', title: '1. Bienvenida Inicial (Marcus)', text: "Sistemas en línea, CEO. Soy Marcus. Tenemos tres protocolos. Uno: Dame una marca y crearemos tu campaña. Dos: Inyección visual. O tres: La Demostración Ejecutiva. ¿Qué eliges?" },
  { id: 'ch_opt1_neural', title: '2. Opción 1: Escaneo Neural (Marcus)', text: "Recibido. Extrayendo el ADN corporativo de la marca. Valeria, toma el control. Extrae los datos con Gemini y crea los vectores visuales para el Social Lab." },
  { id: 'ch_opt2_visual', title: '3. Opción 2: Inyección Visual (Marcus)', text: "Abriendo matriz de inyección visual. Prepara tus assets." },
  { id: 'ch_opt3_demo', title: '4. Opción 3: Demo Ejecutiva (Marcus)', text: "Iniciando Demostración Ejecutiva. Cargando matriz de misiones. Transfiriendo el control." }
];

// 2. GUIONES MULTI-MISIÓN PARA TASK REPLAYS
const MISSION_SCRIPTS = {
  ecommerce: [
    { id: 'tr_ecommerce_hub', agent: 'Marcus', title: '1. Hub', text: "Conexión a Shopify confirmada. Arquetipo 'NeuroBoost' extraído. Vector principal: Rendimiento Z. Estrategia de lanzamiento omnicanal iniciada." },
    { id: 'tr_ecommerce_social', agent: 'Valeria', title: '2. Social', text: "150 hooks sintetizados. El formato 'unboxing caótico' proyecta 87% de retención. Costo por clic aplastado a 0.12 centavos. Compilando Kinesia para Reels." },
    { id: 'tr_ecommerce_ooh', agent: 'Viktor', title: '3. OOH', text: "Inventario físico asegurado en 40 paradas universitarias. Códigos QR dinámicos en caché. Desplegando holograma táctico para tráfico peatonal." },
    { id: 'tr_ecommerce_commercial', agent: 'Kaelen', title: '4. Commercial', text: "Tráfico orgánico colapsando. Video Sales Letter de retargeting desplegado para carritos abandonados. Retorno de inversión en 4.8x. Misión cumplida." }
  ],
  saas: [
    { id: 'tr_saas_hub', agent: 'Marcus', title: '1. Hub', text: "Protocolo B2B Enterprise activado. Target: Directores Financieros. Extrayendo puntos de dolor sobre costos operativos de la nube." },
    { id: 'tr_saas_social', agent: 'Valeria', title: '2. Social', text: "Píldoras de autoridad compiladas para LinkedIn. Guiones generados para avatares ejecutivos. Mensaje central: Reducción de costos en un 40%." },
    { id: 'tr_saas_ooh', agent: 'Viktor', title: '3. OOH', text: "Hackeando circuito visual del distrito financiero. Pantallas de aeropuertos VIP sincronizadas con mensaje de ROI. Impacto B2B asegurado." },
    { id: 'tr_saas_commercial', agent: 'Kaelen', title: '4. Commercial', text: "Spot documental generado. Embudo de conversión directa a agenda de Calendly activo. Flujo de leads High-Ticket estable." }
  ],
  fintech: [
    { id: 'tr_fintech_hub', agent: 'Marcus', title: '1. Hub', text: "Vector de adquisición Fintech en línea. Presupuesto agresivo confirmado. Optimizando Costo de Adquisición de Usuario." },
    { id: 'tr_fintech_social', agent: 'Valeria', title: '2. Social', text: "Programa de referidos inyectado en Meta Ads. Gráficas de confianza y tarjetas metálicas renderizadas. Fricción de registro eliminada." },
    { id: 'tr_fintech_ooh', agent: 'Viktor', title: '3. OOH', text: "Vallas panorámicas reservadas en avenidas principales. La omnipresencia física genera confianza bancaria. Despliegue masivo." },
    { id: 'tr_fintech_commercial', agent: 'Kaelen', title: '4. Commercial', text: "Spot de prueba social compilado con testimonios sintéticos. Tasa de apertura de cuentas un 300% superior al benchmark. Dominio financiero." }
  ],
  web3: [
    { id: 'tr_web3_hub', agent: 'Marcus', title: '1. Hub', text: "Protocolo de ingeniería social activado. Analizando sentimiento en Discord y X. Vector de campaña: Caos controlado y exclusividad FOMO." },
    { id: 'tr_web3_social', agent: 'Valeria', title: '2. Social', text: "Ejército orgánico desplegado. Filtrando 'accidentalmente' el whitepaper del airdrop. Viralidad y especulación en aumento crítico." },
    { id: 'tr_web3_ooh', agent: 'Viktor', title: '3. OOH', text: "Pantallas en estaciones de metro parpadeando con coordenadas secretas. Cuenta regresiva holográfica sincronizada globalmente." },
    { id: 'tr_web3_commercial', agent: 'Kaelen', title: '4. Commercial', text: "Tráiler cinemático renderizado. Caída de servidores por exceso de tráfico calculada. Sold out de la colección proyectado en 4 minutos." }
  ],
  landing: [
    { id: 'landing_social_audio', agent: 'Valeria', title: 'Pavos Virales', text: "Hermano, ¿viste lo que cuesta el Costo por Clic hoy en día? Nos van a cocinar. Tranquilo, yo instalé EtherAgent OS. La inteligencia artificial está bajando el CAC mientras nosotros comemos maíz." },
    { id: 'landing_commercial_audio', agent: 'Kaelen', title: 'VSL Cierre', text: "El cierre maestro. Creación de Video Sales Letters cinemáticos para retargeting de alto impacto. Transformamos el tráfico en ingresos predecibles." }
  ]
};

export default function NeuralAudioMatrix() {
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [uploadedIds, setUploadedIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'saas' | 'fintech' | 'web3' | 'landing'>('ecommerce');

  useEffect(() => {
    const checkExistingAudios = async () => {
      const { data } = await supabase.from('system_scripts').select('id, audio_url');
      if (data) {
        const uploaded: Record<string, boolean> = {};
        data.forEach(item => { if (item.audio_url) uploaded[item.id] = true; });
        setUploadedIds(uploaded);
      }
    };
    checkExistingAudios();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, scriptId: string) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      setLoadingIds(prev => ({ ...prev, [scriptId]: true }));
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${scriptId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('system-audio').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('system-audio').getPublicUrl(fileName);
      await supabase.from('system_scripts').upsert({ id: scriptId, audio_url: publicUrl, updated_at: new Date() });

      setUploadedIds(prev => ({ ...prev, [scriptId]: true }));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir el audio.');
    } finally {
      setLoadingIds(prev => ({ ...prev, [scriptId]: false }));
    }
  };

  const handleCopyPrompt = (text: string) => navigator.clipboard.writeText(text);

  const ScriptCard = ({ script }: { script: any }) => (
    <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-6 flex flex-col relative group hover:border-emerald-500/20 transition-all">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-sm font-bold text-white"><span className="text-zinc-500">{script.title} </span>{script.agent}</h3>
        {uploadedIds[script.id] ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-mono uppercase"><CheckCircle2 size={10} /> LISTO</div>
        ) : (
          <div className="px-2 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-500 text-[9px] font-mono uppercase">SIN MP3</div>
        )}
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-zinc-600 font-mono text-[9px] uppercase">Guion / Prompt</span>
          <button onClick={() => handleCopyPrompt(script.text)} className="text-zinc-400 hover:text-white font-mono text-[9px] bg-white/5 px-2 py-1 rounded border border-white/10 transition-colors">Copiar</button>
        </div>
        <p className="text-zinc-300 text-xs italic bg-black/50 p-4 rounded-xl border border-white/5">"{script.text}"</p>
      </div>
      <div className="mt-auto">
        <label className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${uploadedIds[script.id] ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-[#111] hover:bg-zinc-900 border-white/10 text-zinc-400'}`}>
          <input type="file" accept="audio/mpeg,audio/mp3,audio/wav" onChange={(e) => handleFileUpload(e, script.id)} disabled={loadingIds[script.id]} className="hidden" />
          {loadingIds[script.id] ? <><Loader2 size={14} className="animate-spin" /> Procesando...</> : <><Upload size={14} /> {uploadedIds[script.id] ? 'REEMPLAZAR MP3' : 'SUBIR MP3'}</>}
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 pb-32 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-3xl font-black tracking-widest uppercase text-white mb-4">NEURAL AUDIO <span className="text-zinc-500">MATRIX</span></h1>
          <p className="text-zinc-400 text-sm">Gestiona los audios y prompts de todas las simulaciones de la Executive Demo.</p>
        </header>

        {/* SECCIÓN 1: COMMAND HUB */}
        <div className="mb-12">
          <h2 className="text-blue-500 font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><Terminal size={14} /> 1. SISTEMA OPERATIVO (Command Hub)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{COMMAND_HUB_SCRIPTS.map(script => <ScriptCard key={script.id} script={script} />)}</div>
        </div>

        {/* SECCIÓN 2: MULTI-MISIÓN TABS */}
        <div>
          <h2 className="text-red-500 font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><PlaySquare size={14} /> 2. MISIONES DE DEMOSTRACIÓN (Task Replay)</h2>
          
          {/* TABS DE SELECCIÓN */}
          <div className="flex flex-wrap gap-2 mb-8 bg-[#111] p-1 rounded-xl w-fit border border-white/5">
            <button onClick={() => setActiveTab('ecommerce')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'ecommerce' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-500 hover:text-white'}`}><Target size={14}/> E-Commerce</button>
            <button onClick={() => setActiveTab('saas')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'saas' ? 'bg-blue-500/20 text-blue-500' : 'text-zinc-500 hover:text-white'}`}><Globe size={14}/> B2B SaaS</button>
            <button onClick={() => setActiveTab('fintech')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'fintech' ? 'bg-purple-500/20 text-purple-500' : 'text-zinc-500 hover:text-white'}`}><Activity size={14}/> Fintech</button>
            <button onClick={() => setActiveTab('web3')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'web3' ? 'bg-orange-500/20 text-orange-500' : 'text-zinc-500 hover:text-white'}`}><DollarSign size={14}/> Web3</button>
            <button onClick={() => setActiveTab('landing')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'landing' ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'}`}><Volume2 size={14}/> Landing</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MISSION_SCRIPTS[activeTab].map(script => <ScriptCard key={script.id} script={script} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
