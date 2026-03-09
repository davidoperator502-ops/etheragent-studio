import React, { useState } from 'react';
import { Terminal, Map, Plane, Hexagon, Crosshair, Zap, Shield, Database, Lock, Globe } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  category: string;
  traffic: string;
  type: string;
  status: 'AVAILABLE' | 'SECURED';
  image: string;
}

const GlobalExchange: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [selectedPackage, setSelectedPackage] = useState('full_injection');
  const [isProcessing, setIsProcessing] = useState(false);

  const nodesDB: NodeData[] = [
    {
      id: 'NODO_01',
      name: 'Times Square Central',
      category: 'MASS_OOH',
      traffic: '330,000 / día',
      type: 'Physical Real Estate',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'NODO_VIP_JFK',
      name: 'JFK First Class Lounge',
      category: 'ORIGIN_VIP',
      traffic: '1,200 CEOs / día',
      type: 'Captive High-Ticket',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1512413914488-82500d8d73b5?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'NODO_QUANTUM',
      name: 'L.E.O. Station (Órbita Baja)',
      category: 'EXOTIC_VR',
      traffic: 'Global Broadcast',
      type: 'Tauris Quantum Projection',
      status: 'SECURED',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'NODO_VR_SHIBUYA',
      name: 'Cyber-Shibuya Node',
      category: 'EXOTIC_VR',
      traffic: '2.5M / mes',
      type: 'Metaverse Deep-Link',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1542051812871-758502109a58?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'NODO_CORP_WS',
      name: 'Wall Street Tower Lobby',
      category: 'ORIGIN_VIP',
      traffic: '8,500 Execs / día',
      type: 'Captive High-Ticket',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const filteredNodes = activeCategory === 'ALL' ? nodesDB : nodesDB.filter(n => n.category === activeCategory);

  const handleAcquire = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`SMART CONTRACT EJECUTADO:\nPayload inyectado en ${selectedNode?.name} bajo el protocolo ${selectedPackage}.`);
      setSelectedNode(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-black p-8 font-sans text-zinc-300 flex flex-col">
      <div className="mb-8 border-b border-zinc-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
            <Globe className="text-emerald-500" size={28} />
            Global Exchange <span className="text-zinc-600 font-light">/ Node Topography</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm">
            {'>_'} ADQUIERA Y DESPLIEGUE INFRAESTRUCTURA EN MÚLTIPLES DIMENSIONES
          </p>
        </div>
        <div className="text-right font-mono text-xs text-zinc-500">
          <span className="text-emerald-500 animate-pulse">●</span> SYSTEM ONLINE | LATENCY: 8ms
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-64 flex flex-col gap-2">
          <p className="font-mono text-xs text-zinc-500 mb-2">{'>_'} SELECT DIMENSION</p>
          
          <button onClick={() => setActiveCategory('ALL')} className={`flex items-center gap-3 p-4 rounded text-sm font-mono transition-all border ${activeCategory === 'ALL' ? 'bg-zinc-900 border-emerald-500 text-emerald-400' : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white'}`}>
            <Database size={16} /> [ RED GLOBAL ]
          </button>
          
          <button onClick={() => setActiveCategory('MASS_OOH')} className={`flex items-center gap-3 p-4 rounded text-sm font-mono transition-all border ${activeCategory === 'MASS_OOH' ? 'bg-zinc-900 border-emerald-500 text-emerald-400' : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white'}`}>
            <Map size={16} /> [ VERSEADS OOH ]
          </button>
          
          <button onClick={() => setActiveCategory('ORIGIN_VIP')} className={`flex items-center gap-3 p-4 rounded text-sm font-mono transition-all border ${activeCategory === 'ORIGIN_VIP' ? 'bg-zinc-900 border-emerald-500 text-emerald-400' : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white'}`}>
            <Plane size={16} /> [ ORIGIN VIP ]
          </button>

          <button onClick={() => setActiveCategory('EXOTIC_VR')} className={`flex items-center gap-3 p-4 rounded text-sm font-mono transition-all border ${activeCategory === 'EXOTIC_VR' ? 'bg-zinc-900 border-emerald-500 text-emerald-400' : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white'}`}>
            <Hexagon size={16} /> [ TAURIS QUANTUM ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredNodes.map((node) => (
              <div 
                key={node.id} 
                onClick={() => node.status === 'AVAILABLE' && setSelectedNode(node)}
                className={`relative bg-zinc-950 border rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-64 
                  ${node.status === 'SECURED' ? 'border-red-900/50 opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500/50'} 
                  ${selectedNode?.id === node.id ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500' : 'border-zinc-800'}`}
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-zinc-950/40 z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10"></div>
                  <img src={node.image} alt={node.name} className={`w-full h-full object-cover mix-blend-luminosity transition-all duration-500 ${selectedNode?.id === node.id ? 'grayscale-0 opacity-60' : 'grayscale opacity-30'}`} />
                </div>

                <div className="absolute top-4 right-4 z-20 font-mono text-xs px-2 py-1 rounded bg-black/80 backdrop-blur border border-zinc-800">
                  {node.status === 'AVAILABLE' ? (
                    <span className="text-emerald-400 flex items-center gap-2"><Crosshair size={10}/> AVAILABLE</span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-2"><Lock size={10}/> SECURED</span>
                  )}
                </div>

                <div className="relative z-20 mt-auto p-6">
                  <p className="text-xs font-mono text-emerald-500 mb-1">{node.id}</p>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{node.name}</h3>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-zinc-400 text-sm">{node.type}</p>
                      <p className="text-zinc-500 text-xs font-mono mt-1">Tráfico: {node.traffic}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedNode && (
          <div className="w-96 bg-zinc-950 border border-emerald-500/30 rounded-lg flex flex-col shadow-[0_0_40px_rgba(16,185,129,0.05)] animate-in slide-in-from-right-8 duration-300">
            
            <div className="p-6 border-b border-zinc-800 bg-emerald-900/10">
              <h2 className="text-emerald-500 font-mono text-xs mb-2 flex items-center gap-2"><Terminal size={12}/> ACQUISITION TERMINAL</h2>
              <h3 className="text-2xl font-bold text-white uppercase leading-tight">{selectedNode.name}</h3>
              <p className="text-zinc-400 font-mono text-sm mt-2">ID: {selectedNode.id}</p>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              <div>
                <p className="font-mono text-xs text-zinc-500 mb-3">{'>_'} SELECT INJECTION PAYLOAD</p>
                
                <div className="space-y-3">
                  <label className={`flex flex-col p-4 border rounded cursor-pointer transition-all ${selectedPackage === 'raw_access' ? 'border-emerald-500 bg-emerald-900/10' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="package" value="raw_access" checked={selectedPackage === 'raw_access'} onChange={() => setSelectedPackage('raw_access')} className="accent-emerald-500" />
                      <span className="text-white font-bold text-sm">Arrendamiento Simple</span>
                    </div>
                    <span className="text-zinc-500 text-xs font-mono mt-2 ml-6">Acceso crudo al nodo. Sin IA.</span>
                  </label>

                  <label className={`flex flex-col p-4 border rounded cursor-pointer transition-all ${selectedPackage === 'full_injection' ? 'border-emerald-500 bg-emerald-900/10' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="package" value="full_injection" checked={selectedPackage === 'full_injection'} onChange={() => setSelectedPackage('full_injection')} className="accent-emerald-500" />
                      <span className="text-emerald-400 font-bold text-sm">Inyección Completa (Core + Niche)</span>
                    </div>
                    <span className="text-zinc-500 text-xs font-mono mt-2 ml-6">Despliegue de activo sintético en nodo.</span>
                  </label>

                  <label className={`flex flex-col p-4 border rounded cursor-pointer transition-all ${selectedPackage === 'omnichannel' ? 'border-emerald-500 bg-emerald-900/10' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="package" value="omnichannel" checked={selectedPackage === 'omnichannel'} onChange={() => setSelectedPackage('omnichannel')} className="accent-emerald-500" />
                      <span className="text-white font-bold text-sm flex items-center gap-2"><Zap size={12} className="text-yellow-500"/> Dominio Omnicanal</span>
                    </div>
                    <span className="text-zinc-500 text-xs font-mono mt-2 ml-6">Toma simultánea de Nodos Físicos + VR.</span>
                  </label>
                </div>
              </div>

              <div className="mt-auto bg-black p-4 rounded border border-zinc-800 font-mono text-[10px] text-zinc-600">
                <p>{'>_'} INITIATING SMART CONTRACT...</p>
                <p className="text-emerald-900">{'>_'} ENCRYPTING PAYLOAD HASH...</p>
                <p>{'>_'} AWAITING EXECUTION COMMAND</p>
              </div>

              <button 
                onClick={handleAcquire}
                disabled={isProcessing}
                className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 
                  ${isProcessing ? 'bg-zinc-800 text-emerald-500 border border-emerald-900' : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
              >
                {isProcessing ? (
                  <><Shield size={16} className="animate-pulse" /> EXECUTING...</>
                ) : (
                  <>{'>_'} EXECUTE SMART CONTRACT</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalExchange;
