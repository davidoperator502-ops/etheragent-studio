import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, Smartphone, MonitorPlay, Cpu, Settings2, Target, Volume2, Palette, Headphones, Megaphone, Clapperboard, PlayCircle, Home } from 'lucide-react';

type NavItemProps = {
  id: string;
  icon: React.ReactNode;
  label: string;
  active: string;
  isLab?: boolean;
};

function NavItem({ id, icon, label, active, isLab = false }: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = active === id;

  const handleClick = () => {
    if (id === 'home') navigate('/');
    else if (id === 'nexus') navigate('/nexus');
    else if (id === 'social') navigate('/social');
    else if (id === 'ooh') navigate('/ooh');
    else if (id === 'ads') navigate('/ads');
    else if (id === 'sonic') navigate('/sonic');
    else if (id === 'settings') navigate('/settings');
    else if (id === 'audio-matrix') navigate('/audio-matrix');
    else if (id === 'visual-matrix') navigate('/visual-matrix');
    else if (id === 'commercial') navigate('/commercial');
    else if (id === 'replay') navigate('/replay');
    else if (id === 'commercial-matrix') navigate('/commercial-matrix');
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative
        ${isActive ? 'bg-white/10 text-white' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
    >
      {isLab && <div className={`absolute left-0 w-1 h-6 rounded-r-full transition-all ${isActive ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-zinc-700'}`} />}
      <div className={`flex items-center justify-center ${isActive ? 'text-emerald-400' : ''}`}>
        {icon}
      </div>
      <span className="hidden lg:block font-medium text-sm text-left flex-1">{label}</span>
    </button>
  );
}

export default function SpatialSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveItem = () => {
    if (currentPath === '/') return 'home';
    if (currentPath.includes('/commercial-matrix')) return 'commercial-matrix';
    if (currentPath.includes('/replay')) return 'replay';
    if (currentPath.includes('/commercial')) return 'commercial';
    if (currentPath.includes('/ads')) return 'ads';
    if (currentPath.includes('/social')) return 'social';
    if (currentPath.includes('/ooh')) return 'ooh';
    if (currentPath.includes('/sonic')) return 'sonic';
    if (currentPath.includes('/nexus')) return 'nexus';
    if (currentPath.includes('/audio-matrix')) return 'audio-matrix';
    if (currentPath.includes('/visual-matrix')) return 'visual-matrix';
    return 'social';
  };

  const activeItem = getActiveItem();

  return (
    <nav className="relative z-20 w-20 lg:w-64 h-screen p-4 flex flex-col gap-4">
      <div className="flex-1 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-4 border-b border-white/5 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Cpu size={16} className="text-black" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-white tracking-widest text-sm">ETHER<span className="font-light">OS</span></span>
        </div>

        <div className="space-y-2">
          <NavItem id="home" icon={<Home size={20} />} label="Command Hub" active={activeItem} />
          <NavItem id="nexus" icon={<BrainCircuit size={20} />} label="Nexus" active={activeItem} />

          <div className="pt-4 pb-2">
            <p className="hidden lg:block text-[10px] uppercase tracking-widest text-zinc-500 px-4 font-mono">The Labs</p>
          </div>

          <NavItem id="social" icon={<Smartphone size={20} />} label="Social Lab" active={activeItem} isLab />
          <NavItem id="ooh" icon={<MonitorPlay size={20} />} label="Virtual OOH" active={activeItem} isLab />
          <NavItem id="sonic" icon={<Headphones size={20} />} label="Sonic Lab" active={activeItem} isLab />
          <NavItem id="ads" icon={<Target size={20} />} label="Performance Ads" active={activeItem} isLab />
          <NavItem id="commercial" icon={<Megaphone size={20} />} label="Commercial Lab" active={activeItem} isLab />
          <NavItem id="replay" icon={<PlayCircle size={20} />} label="Task Replay" active={activeItem} isLab />
        </div>

        <div className="mt-auto space-y-2">
          <NavItem id="visual-matrix" icon={<Palette size={20} />} label="Visual Matrix" active={activeItem} />
          <NavItem id="audio-matrix" icon={<Volume2 size={20} />} label="Audio Matrix" active={activeItem} />
          <NavItem id="commercial-matrix" icon={<Clapperboard size={20} />} label="Commercial Matrix" active={activeItem} />
          <NavItem id="settings" icon={<Settings2 size={20} />} label="Configuración" active={activeItem} />
        </div>
      </div>
    </nav>
  );
}
