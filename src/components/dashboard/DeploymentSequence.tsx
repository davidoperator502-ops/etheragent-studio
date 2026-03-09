import React, { useState } from 'react';
import { Lock, Unlock, Terminal, Cpu, Download, Globe, Activity, PlayCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const DeploymentSequence = () => {
  const [isCompiled, setIsCompiled] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedVector, setSelectedVector] = useState('15s');

  const vectorData = {
    '6s': { 
      id: '06s_MICRO', 
      label: 'Impacto ClickUp', 
      time: '14ms', 
      roas: '5.2x',
      bgImage: 'https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=800&auto=format&fit=crop'
    },
    '15s': { 
      id: '15s_STANDARD', 
      label: 'Pitch Autoridad', 
      time: '28ms', 
      roas: '4.8x',
      bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop'
    },
    '30s': { 
      id: '30s_EXTENDED', 
      label: 'Cierre B2B', 
      time: '45ms', 
      roas: '4.1x',
      bgImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop'
    }
  };

  const currentVector = vectorData[selectedVector];

  const handleInjectAPI = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
    }, 2000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFillColor(6, 6, 6);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(24);
    doc.text('AETHERIUM DOSSIER', 105, 30, { align: 'center' });
    
    doc.setDrawColor(16, 185, 129);
    doc.line(20, 35, 190, 35);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('DEPLOYMENT SEQUENCE REPORT', 105, 45, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}`, 105, 52, { align: 'center' });
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(14);
    doc.text('// CORE INSTANCE', 20, 70);
    doc.setDrawColor(40, 40, 40);
    doc.line(20, 73, 190, 73);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('Instancia_00: David G.', 20, 82);
    doc.text('Arquetipo: Tech Sovereign', 20, 90);
    doc.setTextColor(150, 150, 150);
    doc.text('Idiomas: ENG / ESP / CNH', 20, 98);
    doc.text('Latencia Cognitiva: 12ms', 20, 105);
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(14);
    doc.text('// TARGET NICHO', 20, 125);
    doc.line(20, 128, 190, 128);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('Nodo: Times Square', 20, 137);
    doc.text('Formato: Mass-OOH', 20, 145);
    doc.setTextColor(150, 150, 150);
    doc.text('Impacto Visual: Top of Funnel', 20, 153);
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(14);
    doc.text('// COMPILED PAYLOAD', 20, 175);
    doc.line(20, 178, 190, 178);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('Status: Active Deployment', 20, 187);
    
    doc.setTextColor(16, 185, 129);
    doc.text(`Vector Inyectado: [ ${currentVector.id} ] - ${currentVector.label}`, 20, 195);
    
    doc.setTextColor(150, 150, 150);
    doc.text(`Tiempo de Compilación: ${currentVector.time}`, 20, 203);
    doc.text(`ROAS Proyectado: ${currentVector.roas}`, 20, 211);
    doc.text('Optimización AI: Máxima (EtherClaw)', 20, 219);
    
    doc.setDrawColor(16, 185, 129);
    doc.line(20, 260, 190, 260);
    
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('ETHERAGENT STUDIO // INTELLIGENCE MODULE', 105, 270, { align: 'center' });
    doc.text(`VerseAds Deployment Sequence v3.0 | Vector: ${currentVector.id}`, 105, 275, { align: 'center' });
    
    doc.save(`Aetherium_Dossier_${currentVector.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black p-8 font-sans text-zinc-300">
      <div className="mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
          <Terminal className="text-emerald-500" size={28} />
          Intelligence <span className="text-zinc-600 font-light">/ VerseAds Deployment</span>
        </h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">
          {'>_'} SELECCIONE CORE Y NICHO PARA INYECTAR INFRAESTRUCTURA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 -z-10 transform -translate-y-1/2"></div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col hover:border-emerald-500/30 transition-colors">
          <div className="h-48 bg-zinc-900 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded text-xs font-mono text-emerald-400">
              [ CORE_ACTIVE ]
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Instancia_00: David G.</h2>
            <p className="text-emerald-500 text-sm font-mono mb-4 border-b border-zinc-800 pb-4">Arquetipo: Tech Sovereign</p>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 flex items-center gap-2"><Globe size={14}/> Idiomas</span>
                <span className="text-white font-mono">ENG / ESP</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 flex items-center gap-2"><Cpu size={14}/> Latencia</span>
                <span className="text-emerald-400 font-mono">12ms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col hover:border-emerald-500/30 transition-colors">
          <div className="h-48 bg-zinc-900 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale blur-[1px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded text-xs font-mono text-zinc-400">
              [ TARGET_LOCKED ]
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Nodo: Times Square</h2>
            <p className="text-emerald-500 text-sm font-mono mb-4 border-b border-zinc-800 pb-4">Formato: Mass-OOH</p>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Tráfico Diario</span>
                <span className="text-white font-mono">330k+</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Costo Tradicional</span>
                <span className="text-red-500 font-mono line-through">$50k/día</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`relative rounded-lg overflow-hidden transition-all duration-700 flex flex-col ${isCompiled ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-zinc-950' : 'border border-zinc-800 bg-zinc-900/50'}`}>
          
          {!isCompiled && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-6 bg-zinc-950">
                {isCompiling ? <Activity className="text-emerald-500 animate-pulse" size={28} /> : <Lock className="text-zinc-600" size={28} />}
              </div>
              <div className="font-mono text-center mb-8">
                {isCompiling ? (
                  <div className="text-emerald-500 flex flex-col gap-2">
                    <span>{'>_'} COMPILANDO CORE...</span>
                    <span>{'>_'} INYECTANDO NICHO...</span>
                    <span className="animate-pulse">{'>_'} RENDERIZANDO API...</span>
                  </div>
                ) : (
                  <span className="text-zinc-500">{'>_'} AWAITING PAYLOAD...</span>
                )}
              </div>
              {!isCompiling && (
                <button 
                  onClick={handleInjectAPI}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-mono uppercase tracking-widest border border-emerald-900 hover:border-emerald-500 transition-all duration-300"
                >
                  {'>_'} Inject API
                </button>
              )}
            </div>
          )}

          <div className={`h-48 relative overflow-hidden transition-opacity duration-1000 group cursor-pointer ${isCompiled ? 'opacity-100' : 'opacity-0'}`}>
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-screen transition-all duration-500"
                style={{ backgroundImage: `url(${currentVector.bgImage})` }}
             ></div>
             <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
             
             <div className="absolute inset-0 flex items-center justify-center">
               <PlayCircle className="text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" size={48} />
             </div>

             <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/50 px-3 py-1 rounded flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Unlock size={12} /> [ {currentVector.id} ]
            </div>
          </div>

          <div className={`p-6 flex-1 flex flex-col transition-opacity duration-1000 ${isCompiled ? 'opacity-100' : 'opacity-0'}`}>
            
            <div className="flex gap-2 mb-6">
              {Object.keys(vectorData).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedVector(key)}
                  className={`flex-1 py-2 text-xs font-mono rounded border transition-colors ${
                    selectedVector === key 
                      ? 'bg-emerald-500 border-emerald-500 text-black font-bold' 
                      : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-emerald-400 hover:border-emerald-900'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="space-y-3 flex-1 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Tiempo de Render</span>
                <span className="text-white font-mono transition-all">{currentVector.time}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Enfoque Táctico</span>
                <span className="text-emerald-400 font-mono transition-all">{currentVector.label}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">ROAS Proyectado</span>
                <span className="text-white font-mono transition-all">{currentVector.roas}</span>
              </div>
            </div>

            <button 
              onClick={generatePDF}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3"
            >
              <Download size={18} />
              Deploy Aetherium Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeploymentSequence;
