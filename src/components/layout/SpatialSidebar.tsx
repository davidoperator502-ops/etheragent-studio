import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, MonitorPlay, Cpu, Settings2, Volume2, Palette, Megaphone, Clapperboard, PlayCircle, Home, FolderKanban, Film, Crown, CreditCard } from 'lucide-react';
import { useDemoScript } from '@/hooks/useDemoScript';
import { useCampaignStore } from '@/store/useCampaignStore';
import TokenTelemetry from '@/components/dashboard/TokenTelemetry';

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

    else if (id === 'social') navigate('/dashboard/social');
    else if (id === 'ooh') navigate('/dashboard/ooh');
    else if (id === 'commercial-lab') navigate('/dashboard/commercial-lab');

    else if (id === 'settings') navigate('/settings');
    else if (id === 'audio-matrix') navigate('/dashboard/audio-matrix');
    else if (id === 'visual-matrix') navigate('/dashboard/visual-matrix');
    else if (id === 'replay') navigate('/dashboard/replay');
    else if (id === 'executive-demo') navigate('/dashboard/executive-demo');
    else if (id === 'subscription') navigate('/dashboard/subscription');
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
      {id === 'workspace' && (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
      )}
    </button>
  );
}

export default function SpatialSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { runFullDemo, isDemoRunning, currentStep } = useDemoScript();
  const workspace = useCampaignStore((state) => state.workspace);
  const ceoCommand = useCampaignStore((state) => state.ceoCommand);

  const getActiveItem = () => {
    if (currentPath === '/dashboard') return 'home';
    if (currentPath.includes('/replay')) return 'replay';
    if (currentPath.includes('/ads')) return 'ads';
    if (currentPath.includes('/social')) return 'social';
    if (currentPath.includes('/ooh')) return 'ooh';
    if (currentPath.includes('/commercial-lab')) return 'commercial-lab';
    if (currentPath.includes('/sonic')) return 'sonic';

    if (currentPath.includes('/audio-matrix')) return 'audio-matrix';
    if (currentPath.includes('/visual-matrix')) return 'visual-matrix';
    if (currentPath.includes('/executive-demo')) return 'executive-demo';
    if (currentPath.includes('/subscription')) return 'subscription';
    return 'social';
  };

  const activeItem = getActiveItem();

  // Format the workspace name (from ceo command, truncating if necessary)
  const workspaceName = ceoCommand ? (ceoCommand.length > 15 ? ceoCommand.substring(0, 15) + '...' : ceoCommand) : 'Active Workspace';

  return (
    <nav className="relative z-20 w-20 lg:w-64 h-screen p-4 flex flex-col gap-4">
      <div className="flex-1 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-4 border-b border-white/5 mb-4">
          <div
            onClick={() => !isDemoRunning && runFullDemo({ navigate })}
            className="cursor-pointer group flex items-center gap-2"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all ${isDemoRunning ? 'border-2 border-orange-500 animate-spin' : 'bg-gradient-to-br from-emerald-400 to-cyan-500'}`}>
              <Cpu size={16} className="text-black" />
            </div>
            <span className="hidden lg:block ml-3 font-bold text-white tracking-widest text-sm">
              {isDemoRunning ? currentStep : <><span className="font-light">ETHER</span><span className="opacity-50 group-hover:opacity-100 transition-opacity">OS</span></>}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <NavItem id="home" icon={<Home size={20} />} label="Command Hub" active={activeItem} />


          {/* New Workspace Section injected here when active */}
          {workspace && (
            <div className="mt-4 mb-2 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="px-4 py-3 mx-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/social')}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl -mr-8 -mt-8" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <FolderKanban className="text-emerald-400" size={16} />
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase mb-0.5">Workspace</span>
                    <span className="text-sm font-semibold text-white capitalize truncate max-w-[110px]">{workspaceName}</span>
                  </div>
                  <div className="absolute right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)] lg:hidden" />
                </div>
              </div>
            </div>
          )}

          <div className={`pt-4 pb-2 ${workspace ? 'mt-2' : ''}`}>
            <p className="hidden lg:block text-[10px] uppercase tracking-widest text-zinc-500 px-4 font-mono">The Labs</p>
          </div>

          <NavItem id="social" icon={<Smartphone size={20} />} label="Social Lab" active={activeItem} isLab />
          <NavItem id="ooh" icon={<MonitorPlay size={20} />} label="Virtual OOH" active={activeItem} isLab />
          <NavItem id="commercial-lab" icon={<Film size={20} />} label="Commercial Lab" active={activeItem} isLab />
          <NavItem id="replay" icon={<PlayCircle size={20} />} label="Task Replay" active={activeItem} isLab />
        </div>

        <div className="pt-4 pb-2">
          <p className="hidden lg:block text-[10px] uppercase tracking-widest text-zinc-500 px-4 font-mono">Premium</p>
        </div>

        <NavItem id="executive-demo" icon={<Crown size={20} />} label="Executive Demo" active={activeItem} />
        <NavItem id="subscription" icon={<CreditCard size={20} />} label="Subscription" active={activeItem} />

        <div className="mt-4 px-2">
          <TokenTelemetry />
        </div>

        <div className="mt-auto space-y-2">
          <NavItem id="visual-matrix" icon={<Palette size={20} />} label="Visual Matrix" active={activeItem} />
          <NavItem id="audio-matrix" icon={<Volume2 size={20} />} label="Audio Matrix" active={activeItem} />
          <NavItem id="settings" icon={<Settings2 size={20} />} label="Configuración" active={activeItem} />
        </div>
      </div>
    </nav>
  );
}
