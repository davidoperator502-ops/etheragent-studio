import React, { useState } from 'react';
import { Search, Zap, Terminal, Shield, Crosshair, PlayCircle, Image as ImageIcon, Download, ArrowLeft, Activity, Users, ShoppingBag, Briefcase, HeartPulse } from 'lucide-react';
import { jsPDF } from 'jspdf';

const preCompiledInstances = [
  {
    id: 'f_eth_zero',
    name: 'David G.',
    role: 'Tech Founder & Core Instance',
    niche: 'B2B Tech / SaaS',
    color: 'emerald',
    icon: <Terminal size={18} />,
    roi: '+314%',
    pitch: 'El activo sintético "David G." fue compilado para fundadores tech que necesitan escalar su prospección B2B. No exige un salario, no sufre fatiga frente a la cámara, y ejecuta guiones con sincronización labial perfecta.',
    phase2: '<subject_lock> Male, 32-35 years old, tech founder archetype, intense analytical gaze. Wearing a premium black turtleneck. </subject_lock>'
  },
  {
    id: 'f_valeria_sdr',
    name: 'Valeria M.',
    role: 'Growth Strategist & B2B Closer',
    niche: 'LATAM Agencies / SDR',
    color: 'orange',
    icon: <Users size={18} />,
    roi: '+280%',
    pitch: 'Valeria M. es la cerradora B2B definitiva para Agencias. Pasa del español neutro al inglés nativo sin fricción. Diseñada para proyectar empatía corporativa y resolver fugas de leads en embudos de ventas lentos.',
    phase2: '<subject_lock> Female, 24-27 years old, Latina descent, bright engaging eyes. Wearing a premium soft terracotta blazer over a crisp dark tee. </subject_lock>'
  },
  {
    id: 'f_viktor',
    name: 'Viktor S.',
    role: 'E-commerce Growth Architect',
    niche: 'D2C & Retention',
    color: 'amber',
    icon: <ShoppingBag size={18} />,
    roi: '+450%',
    pitch: 'Viktor S. está parametrizado para recuperar carritos abandonados y destruir el Costo de Adquisición (CAC) en tiendas online. Postura agresiva, retención visual absoluta para frenAr el scroll en TikTok y Meta Ads.',
    phase2: '<subject_lock> Male, 28-32 years old, Eastern European descent, intense analytical gaze. Modern luxury streetwear, heavyweight oversized hoodie. </subject_lock>'
  },
  {
    id: 'f_marcus',
    name: 'Marcus V.',
    role: 'Enterprise FinTech Executive',
    niche: 'High-Ticket B2B',
    color: 'blue',
    icon: <Briefcase size={18} />,
    roi: '+195%',
    pitch: 'Marcus V. proyecta autoridad absoluta para el sector institucional y FinTech de Nueva York y Londres. Cero parpadeos, tono implacable. Diseñado para vender software corporativo de más de $100k en LinkedIn.',
    phase2: '<subject_lock> Male, 40-45 years old, Asian descent, sharp jawline. Bespoke charcoal grey pinstripe suit, crisp white shirt, no tie. </subject_lock>'
  },
  {
    id: 'f_elena',
    name: 'Elena R.',
    role: 'AI Tech Founder',
    niche: 'SaaS & Digital Products',
    color: 'purple',
    icon: <Zap size={18} />,
    roi: '+220%',
    pitch: 'Elena R. es el rostro ágil de Silicon Valley. Ideal para startups que necesitan iterar rápidamente videos de YouTube y lanzamientos de producto sin depender de la agenda de actores físicos.',
    phase2: '<subject_lock> Female, 28-30 years old, Caucasian/European descent, confident tech innovator. Modern minimalist smart-casual attire. </subject_lock>'
  },
  {
    id: 'f_aris',
    name: 'Dr. Aris',
    role: 'Medical Specialist',
    niche: 'Health & Wellness',
    color: 'teal',
    icon: <HeartPulse size={18} />,
    roi: '+180%',
    pitch: 'El Dr. Aris aporta credibilidad científica inmediata al sector MedTech y de suplementación. Proyecta confianza clínica, ideal para presentaciones B2B a redes de hospitales o clínicas privadas.',
    phase2: '<subject_lock> Male, 45-50 years old, Mediterranean descent, distinguished silver hair. High-end tailored medical coat over a crisp blue shirt. </subject_lock>'
  }
];

interface PreCompiledInstance {
  id: string;
  name: string;
  role: string;
  niche: string;
  color: string;
  icon: React.ReactNode;
  roi: string;
  pitch: string;
  phase2: string;
}

export default function Intelligence() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<PreCompiledInstance | null>(null);

  const filteredInstances = preCompiledInstances.filter(inst => 
    inst.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    inst.niche.toLowerCase().includes(searchInput.toLowerCase()) ||
    inst.role.toLowerCase().includes(searchInput.toLowerCase())
  );

  const generatePDF = (instance: PreCompiledInstance) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AETHERIUM DOSSIER', pageWidth / 2, 25, { align: 'center' });
    
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(20, 32, pageWidth - 20, 32);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instance.name, 20, 48);
    
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(instance.role, 20, 56);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text(`INSTANCE ID: ${instance.id.toUpperCase()}`, 20, 66);
    doc.text(`NICHE: ${instance.niche}`, 20, 73);
    
    doc.setDrawColor(40, 40, 40);
    doc.line(20, 80, pageWidth - 20, 80);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('THE PITCH', 20, 92);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const pitchLines = doc.splitTextToSize(instance.pitch, pageWidth - 40);
    doc.text(pitchLines, 20, 100);
    
    const pitchEndY = 100 + (pitchLines.length * 5) + 10;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ETHERCLAW MASTER PROMPTS', 20, pitchEndY);
    
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text('// PHASE 1: ETHERCLAW BASE CORE (LOCKED)', 20, pitchEndY + 10);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    const phase1Text = '<background> Absolute minimalism. Solid dark charcoal/pure black studio backdrop. </background>\n\n<lighting> Dramatic studio chiaroscuro. Sharp Emerald Green (#10B981) edge light.';
    const phase1Lines = doc.splitTextToSize(phase1Text, pageWidth - 40);
    doc.text(phase1Lines, 20, pitchEndY + 18);
    
    const phase1EndY = pitchEndY + 18 + (phase1Lines.length * 4) + 8;
    
    doc.setTextColor(168, 85, 247);
    doc.setFontSize(9);
    doc.text(`// PHASE 2: NICHE INJECTION (${instance.niche.toUpperCase()})`, 20, phase1EndY);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    const phase2Clean = instance.phase2.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const phase2Lines = doc.splitTextToSize(phase2Clean, pageWidth - 40);
    doc.text(phase2Lines, 20, phase1EndY + 8);
    
    const phase2EndY = phase1EndY + 8 + (phase2Lines.length * 4) + 15;
    
    doc.setDrawColor(40, 40, 40);
    doc.line(20, phase2EndY, pageWidth - 20, phase2EndY);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PERFORMANCE METRICS', 20, phase2EndY + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ROI Proyectado: ${instance.roi} vs Humano`, 20, phase2EndY + 20);
    doc.text('Costo Setup: $0 / Listo en API', 20, phase2EndY + 27);
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text('Generated by EtherAgent Studio | Confidential', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    
    doc.save(`Aetherium_Dossier_${instance.name.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      
      <div className="max-w-4xl mx-auto w-full mb-8 mt-4">
        {!selectedInstance && (
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
              Catálogo de Activos Sintéticos
            </h2>
            <p className="text-white/50 text-sm mb-8">
              Selecciona una instancia pre-compilada para tu nicho o busca por industria.
            </p>

            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-[#0A0A0A] border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-2xl"
                placeholder='Buscar nicho... (Ej: "FinTech", "E-commerce", "SaaS")'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {!selectedInstance && (
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 pb-12">
          {filteredInstances.map((inst) => (
            <div 
              key={inst.id}
              onClick={() => setSelectedInstance(inst)}
              className="group relative bg-[#0A0A0A] border border-white/10 hover:border-emerald-500/50 rounded-3xl p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1"
            >
              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-${inst.color}-500/10 rounded-full blur-3xl group-hover:bg-${inst.color}-500/20 transition-all duration-700`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-${inst.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                    {inst.icon}
                  </div>
                  <span className={`px-3 py-1 bg-${inst.color}-500/10 border border-${inst.color}-500/20 text-${inst.color}-400 text-[10px] font-bold uppercase tracking-widest rounded-full`}>
                    {inst.niche}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{inst.name}</h3>
                <p className="text-white/50 text-sm mb-6 flex-1">{inst.role}</p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs text-white/40 flex items-center gap-2">
                    <Activity size={14} className="text-emerald-500" /> ROI Proyectado:
                  </span>
                  <span className="text-sm font-bold text-emerald-400">{inst.roi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInstance && (
        <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
          
          <button 
            onClick={() => setSelectedInstance(null)}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Volver al Catálogo
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className={`w-2 h-2 rounded-full bg-${selectedInstance.color}-500 animate-pulse`}></div>
            <span className={`text-xs font-mono text-${selectedInstance.color}-400 tracking-widest uppercase`}>
              INSTANCIA COMPILADA: {selectedInstance.id}
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <div className="xl:col-span-5 flex flex-col gap-4">
              <div className={`relative aspect-[4/5] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.1)] group`}>
                <img 
                  src="/api/placeholder/800/1000" 
                  alt={selectedInstance.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-tr from-black via-transparent to-${selectedInstance.color}-500/20 mix-blend-overlay`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white/70 flex items-center gap-1">
                    <ImageIcon size={12} /> HQ Render
                  </span>
                  <span className={`px-3 py-1 bg-${selectedInstance.color}-500/20 backdrop-blur-md border border-${selectedInstance.color}-500/30 text-${selectedInstance.color}-400 rounded-full text-[10px] flex items-center gap-1 font-bold`}>
                    <PlayCircle size={12} /> 8s Demo
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${selectedInstance.color}-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-md mb-2`}>
                    <Shield size={12} /> {selectedInstance.niche}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{selectedInstance.name}</h3>
                  <p className={`text-${selectedInstance.color}-400 font-medium text-sm`}>{selectedInstance.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4">
                  <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Costo Setup</div>
                  <div className="text-xl font-bold text-white">$0 <span className="text-sm text-white/30 font-normal">/ Listo en API</span></div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4">
                  <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Performance</div>
                  <div className={`text-xl font-bold text-${selectedInstance.color}-400`}>{selectedInstance.roi} <span className={`text-sm text-${selectedInstance.color}-400/50 font-normal`}>vs Humano</span></div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7 flex flex-col gap-6">
              
              <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
                <h4 className="text-2xl font-bold text-white mb-4">La Infraestructura de Conversión.</h4>
                <p className="text-white/70 leading-relaxed mb-6">
                  {selectedInstance.pitch}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 flex items-center gap-2">
                    <Crosshair size={14} className={`text-${selectedInstance.color}-400`} /> Market Ready
                  </span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 flex items-center gap-2">
                    <Shield size={14} className="text-emerald-400" /> Zero Hallucinations
                  </span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 flex items-center gap-2">
                    <Terminal size={14} className="text-purple-400" /> API Compiled
                  </span>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-3xl overflow-hidden flex-1 flex flex-col">
                <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Motor EtherClaw: Master Prompts</span>
                  <span className={`w-2 h-2 rounded-full bg-${selectedInstance.color}-500`}></span>
                </div>
                
                <div className="p-6 font-mono text-xs overflow-y-auto space-y-6 flex-1">
                  <div>
                    <div className="text-emerald-400 mb-2">// PHASE 1: ETHERCLAW BASE CORE (LOCKED)</div>
                    <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 text-white/70 leading-relaxed">
                      <span className="text-blue-400">&lt;background&gt;</span> Absolute minimalism. Solid dark charcoal/pure black studio backdrop. <span className="text-blue-400">&lt;/background&gt;</span>
                      <br/><br/>
                      <span className="text-blue-400">&lt;lighting&gt;</span> Dramatic studio chiaroscuro. Sharp Emerald Green (#10B981) edge light. <span className="text-blue-400">&lt;/lighting&gt;</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-purple-400 mb-2">// PHASE 2: NICHE INJECTION ({selectedInstance.niche.toUpperCase()})</div>
                    <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 text-white/70 leading-relaxed">
                      {selectedInstance.phase2.split('<').map((part: string, i: number) => {
                        if (i === 0) return part;
                        const tag = part.split('>')[0];
                        const content = part.split('>')[1];
                        return (
                          <React.Fragment key={i}>
                            <span className="text-blue-400">&lt;{tag}&gt;</span>
                            {content}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className={`flex-1 py-4 bg-${selectedInstance.color}-500 hover:bg-${selectedInstance.color}-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2`}>
                  <Zap size={18} /> Desplegar en Spaces
                </button>
                <button 
                  onClick={() => generatePDF(selectedInstance)}
                  className="px-6 py-4 bg-[#0A0A0A] hover:bg-white/5 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  <Download size={18} className="text-white/50 group-hover:text-emerald-400 transition-colors" /> 
                  <span className="hidden sm:inline">Aetherium Dossier</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
