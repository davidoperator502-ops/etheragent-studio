import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, MapPin, Mic, Play, Save, Share2, Download, Settings, ChevronRight, Layers, Zap, Globe,
  Search, Sparkles, History, Star, Users, Clock, CheckCircle, BarChart3, TrendingUp, Video,
  ArrowLeft, Layout, Grid, Monitor, Smartphone
} from 'lucide-react';

const wireframes = [
  { id: 'systemspaces', name: 'SystemSpaces', icon: Layers, description: 'Configuración de campaña' },
  { id: 'intelligence', name: 'Intelligence Engine', icon: Sparkles, description: 'Análisis de URL' },
  { id: 'marketplace', name: 'Marketplace', icon: Users, description: 'Catálogo de agentes' },
  { id: 'sociallab', name: 'Social Lab', icon: Video, description: 'Creación de contenido' },
  { id: 'telemetry', name: 'Telemetry', icon: BarChart3, description: 'Analytics y métricas' },
];

const agents = [
  { id: 'cyber', name: 'Cyber-Tech', status: 'active', niche: 'Web3/Crypto', avatar: '🤖' },
  { id: 'lifestyle', name: 'Lifestyle', status: 'ready', niche: 'Fashion/Retail', avatar: '👗' },
  { id: 'pioneer', name: 'Pionero', status: 'ready', niche: 'Space Tech', avatar: '🚀' },
  { id: 'finance', name: 'Finance Pro', status: 'ready', niche: 'FinTech', avatar: '💼' },
];

const spaces = [
  { id: 'interior', name: 'Interior', type: 'DOOH', icon: '🏢' },
  { id: 'exterior', name: 'Exterior', type: 'DOOH', icon: '🌆' },
  { id: 'metaverse', name: 'Metaverso', type: 'Virtual', icon: '🌐' },
  { id: 'space', name: 'Espacio', type: 'Orbital', icon: '🚀' },
];

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸', size: '9:16' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', size: '9:16' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', size: '16:9' },
  { id: 'doh', name: 'DOOH', icon: '📺', size: '16:9' },
];

const queueItems = [
  { id: '1', status: 'completed', agent: 'Cyber-Tech', duration: '45s', time: '2 min ago' },
  { id: '2', status: 'processing', agent: 'Lifestyle Pro', duration: '60s', progress: 67 },
  { id: '3', status: 'pending', agent: 'Pionero', duration: '30s', time: 'Queued' },
];

const stats = [
  { label: 'Total Renders', value: '1,247', change: '+12%' },
  { label: 'Active Agents', value: '8', change: '+2' },
  { label: 'Total Reach', value: '2.4M', change: '+34%' },
  { label: 'Revenue', value: '$18.2K', change: '+8%' },
];

interface PrototypeLayoutProps {
  children: React.ReactNode;
  activeWireframe: string;
  onNavigate: (id: string) => void;
}

function PrototypeLayout({ children, activeWireframe, onNavigate }: PrototypeLayoutProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-lg font-bold text-emerald-400">EtherAgent Prototypes</h1>
          </div>
          <div className="flex items-center gap-2">
            <Monitor size={18} className="text-white/40" />
            <span className="text-xs text-white/40">Desktop Preview</span>
          </div>
        </div>
      </header>

      {/* Wireframe Navigation */}
      <nav className="border-b border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {wireframes.map((wf) => (
            <button
              key={wf.id}
              onClick={() => onNavigate(wf.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeWireframe === wf.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <wf.icon size={16} />
              {wf.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function SystemSpacesWireframe() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState('cyber');
  const [selectedSpace, setSelectedSpace] = useState('interior');

  const steps = [
    { id: 1, title: 'Select Agent', icon: Bot },
    { id: 2, title: 'Choose Space', icon: MapPin },
    { id: 3, title: 'Configure Audio', icon: Mic },
    { id: 4, title: 'Render', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 space-y-4">
          <div className="bg-zinc-900 rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-semibold text-white/70 mb-4">Workflow</h3>
            <div className="space-y-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    currentStep === step.id
                      ? 'bg-emerald-500 text-black font-medium'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <step.icon size={16} />
                  <span className="text-sm">{step.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-zinc-900 rounded-xl p-6 border border-white/10">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Select Agent Persona</h2>
              <div className="grid grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAgent === agent.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-3xl mb-2">{agent.avatar}</div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-xs text-white/50">{agent.niche}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Choose Deployment Space</h2>
              <div className="grid grid-cols-2 gap-4">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    onClick={() => setSelectedSpace(space.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSpace === space.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-4xl">{space.icon}</span>
                    <h3 className="font-medium mt-2">{space.name}</h3>
                    <p className="text-xs text-white/50">{space.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Configure Audio</h2>
              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                  <label className="text-sm text-white/70">Voice Preset</label>
                  <select className="w-full mt-2 p-2 bg-zinc-800 border border-white/10 rounded text-white">
                    <option>Deep Baritone (EN)</option>
                    <option>Warm & Friendly (EN)</option>
                    <option>Autoritario (ES)</option>
                  </select>
                </div>
                <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                  <label className="text-sm text-white/70">Script</label>
                  <textarea 
                    className="w-full mt-2 p-3 bg-zinc-800 border border-white/10 rounded text-white h-32" 
                    placeholder="Enter your script here..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Render Preview</h2>
              <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-white/10">
                <span className="text-white/40">Preview Area</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-emerald-500 text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-400">
                  <Play size={18} /> Render Video
                </button>
                <button className="px-4 border border-white/20 rounded-lg flex items-center gap-2 hover:bg-white/5">
                  <Save size={18} /> Save Config
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-white/20 rounded-lg disabled:opacity-30 hover:bg-white/5"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          disabled={currentStep === 4}
          className="px-6 py-2 bg-emerald-500 text-black rounded-lg font-medium disabled:opacity-30 hover:bg-emerald-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function IntelligenceWireframe() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    niche: string;
    competitors: string[];
    recommendedAgent: string;
    confidence: number;
    keywords: string[];
  }>(null);

  const handleAnalyze = () => {
    if (!url) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        niche: 'FinTech / SaaS',
        competitors: ['Stripe', 'Paddle', 'Chargebee'],
        recommendedAgent: 'Marcus V.',
        confidence: 94,
        keywords: ['payments', 'subscription', 'B2B', 'enterprise']
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Analyze Website</h2>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center bg-black border border-white/10 rounded-lg px-4">
              <Globe size={18} className="text-white/40 mr-3" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://client-website.com"
                className="flex-1 py-3 bg-transparent outline-none text-white placeholder:text-white/30"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !url}
              className="bg-emerald-500 text-black px-6 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 hover:bg-emerald-400"
            >
              {analyzing ? 'Analyzing...' : <><Sparkles size={18} /> Analyze</>}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <button className="text-emerald-400 text-sm flex items-center gap-1 hover:underline">
                <Download size={14} /> Export PDF
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400">{result.confidence}%</div>
              <div>
                <div className="font-medium">Confidence Score</div>
                <div className="text-sm text-white/50">AI-powered analysis accuracy</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                <div className="text-sm text-white/50 mb-1">Detected Niche</div>
                <div className="font-semibold text-lg">{result.niche}</div>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-white/10">
                <div className="text-sm text-white/50 mb-1">Recommended Agent</div>
                <div className="font-semibold text-lg text-emerald-400">{result.recommendedAgent}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-white/50 mb-2">Keywords Detected</div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw) => (
                  <span key={kw} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button className="flex-1 bg-emerald-500 text-black py-3 rounded-lg font-medium hover:bg-emerald-400">
                Select Agent
              </button>
              <button className="px-4 border border-white/20 rounded-lg hover:bg-white/5">
                Save to History
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl p-4 border border-white/10">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <History size={18} /> Recent Analyses
        </h3>
        <div className="space-y-3">
          {[
            { url: 'stripe.com', niche: 'FinTech', date: '2h ago' },
            { url: 'shopify.com', niche: 'E-commerce', date: '1d ago' },
            { url: 'hubspot.com', niche: 'SaaS', date: '3d ago' },
          ].map((item, i) => (
            <div key={i} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer">
              <div className="text-sm font-medium truncate">{item.url}</div>
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>{item.niche}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketplaceWireframe() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 flex items-center bg-zinc-900 border border-white/10 rounded-lg px-4">
          <Search size={18} className="text-white/40 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents..."
            className="flex-1 py-3 bg-transparent outline-none text-white placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`bg-zinc-900 rounded-xl p-5 cursor-pointer transition-all border-2 ${
                selectedAgent?.id === agent.id 
                  ? 'border-emerald-500' 
                  : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl">
                  {agent.avatar}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
                }`}>
                  {agent.status}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <p className="text-sm text-white/50 mb-3">{agent.niche}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">4.9</span>
                </div>
                <span className="font-bold text-emerald-400">$39/mo</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-white/10 h-fit sticky top-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center text-4xl mx-auto mb-3">
              {selectedAgent?.avatar}
            </div>
            <h2 className="text-xl font-bold">{selectedAgent?.name}</h2>
            <p className="text-white/50">{selectedAgent?.niche}</p>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Rating</span>
              <span className="font-medium">4.9/5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Active Users</span>
              <span className="font-medium">1,250</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Monthly Price</span>
              <span className="font-medium">$39/mo</span>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <button className="w-full bg-emerald-500 text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-400">
              Select Agent <ChevronRight size={18} />
            </button>
            <button className="w-full border border-white/20 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/5">
              <Play size={18} /> Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLabWireframe() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Select Platform</h2>
          <div className="grid grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className={`p-4 rounded-xl border-2 text-center transition-colors ${
                  selectedPlatform.id === platform.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-1">{platform.icon}</div>
                <div className="text-sm font-medium">{platform.name}</div>
                <div className="text-xs text-white/40">{platform.size}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Script</h2>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your script here or use AI to generate one..."
            className="w-full h-48 p-4 bg-black border border-white/10 rounded-lg resize-none focus:outline-none focus:border-emerald-500 text-white placeholder:text-white/30"
          />
          <div className="flex justify-between mt-4">
            <span className="text-sm text-white/40">{script.length} / 500 characters</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2 hover:bg-white/5 text-sm">
                Templates
              </button>
              <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2 text-sm hover:bg-emerald-500/30">
                <Sparkles size={16} /> AI Assist
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsGenerating(true)}
          disabled={!script}
          className="w-full bg-emerald-500 text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-emerald-400"
        >
          {isGenerating ? 'Processing...' : <><Play size={20} /> Generate Video</>}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock size={18} /> Render Queue
          </h3>
          <div className="space-y-3">
            {queueItems.map((item) => (
              <div key={item.id} className="p-3 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{item.agent}</span>
                  {item.status === 'completed' && (
                    <CheckCircle size={16} className="text-emerald-400" />
                  )}
                  {item.status === 'processing' && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-xs text-white/50">{item.progress}%</span>
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <Clock size={16} className="text-white/40" />
                  )}
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>{item.duration}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Total Renders</span>
              <span className="font-semibold">147</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Minutes Generated</span>
              <span className="font-semibold">182 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Tokens Used</span>
              <span className="font-semibold">24.5K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryWireframe() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/50 text-sm">{stat.label}</span>
              <span className="text-sm text-emerald-400 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-zinc-900 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-sm font-medium text-white/50 pb-3">Campaign</th>
                <th className="text-left text-sm font-medium text-white/50 pb-3">Agent</th>
                <th className="text-right text-sm font-medium text-white/50 pb-3">Renders</th>
                <th className="text-right text-sm font-medium text-white/50 pb-3">Reach</th>
                <th className="text-center text-sm font-medium text-white/50 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Q1 Product Launch', agent: 'Cyber-Tech', renders: 45, reach: '850K', status: 'active' },
                { name: 'Holiday Sale', agent: 'Lifestyle Pro', renders: 120, reach: '1.2M', status: 'completed' },
                { name: 'Web3 Awareness', agent: 'Pionero', renders: 30, reach: '350K', status: 'active' },
              ].map((campaign, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 font-medium">{campaign.name}</td>
                  <td className="py-3 text-white/50">{campaign.agent}</td>
                  <td className="py-3 text-right">{campaign.renders}</td>
                  <td className="py-3 text-right">{campaign.reach}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-white/10 text-white/50'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Agent Memory</h2>
          <div className="space-y-4">
            {[
              { name: 'Cyber-Tech', conversations: 847, context: 142 },
              { name: 'Lifestyle Pro', conversations: 623, context: 98 },
              { name: 'Pionero', conversations: 377, context: 102 },
            ].map((agent, i) => (
              <div key={i} className="p-3 bg-black/40 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-white/50">{agent.conversations} conv.</span>
                </div>
                <div className="text-xs text-white/40">{agent.context} context windows</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Prototypes() {
  const [activeWireframe, setActiveWireframe] = useState('systemspaces');

  const renderWireframe = () => {
    switch (activeWireframe) {
      case 'systemspaces':
        return <SystemSpacesWireframe />;
      case 'intelligence':
        return <IntelligenceWireframe />;
      case 'marketplace':
        return <MarketplaceWireframe />;
      case 'sociallab':
        return <SocialLabWireframe />;
      case 'telemetry':
        return <TelemetryWireframe />;
      default:
        return <SystemSpacesWireframe />;
    }
  };

  return (
    <PrototypeLayout activeWireframe={activeWireframe} onNavigate={setActiveWireframe}>
      {renderWireframe()}
    </PrototypeLayout>
  );
}
