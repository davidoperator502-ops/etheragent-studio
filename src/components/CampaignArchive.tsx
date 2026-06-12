import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Search, Filter, FolderArchive, Copy, Plus, MoreVertical, Eye, Calendar, Tag, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  nombre: string;
  slug: string;
}

interface Campaign {
  id: string;
  nombre: string;
  plataforma: string;
  estado: string;
  created_at: string;
  client_id: string;
  client?: Client;
}

export default function CampaignArchive() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClient, setFilterClient] = useState('all');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [campRes, cliRes] = await Promise.all([
        supabase.from('campaigns').select('*, client:clients(id, nombre, slug)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('clients').select('*').eq('user_id', user.id).order('nombre')
      ]);

      if (campRes.error) throw campRes.error;
      if (cliRes.error) throw cliRes.error;

      setCampaigns(campRes.data || []);
      setClients(cliRes.data || []);
    } catch (err: any) {
      console.error('Error fetching archive:', err);
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (campaign: Campaign) => {
    toast.info('Duplicando campaña...');
    // Lógica de duplicación
    const { data: original, error: fetchErr } = await supabase.from('campaigns').select('*').eq('id', campaign.id).single();
    if (fetchErr || !original) return toast.error('Error al obtener original');
    
    const { id, created_at, updated_at, ...rest } = original;
    const { error: insertErr } = await supabase.from('campaigns').insert({
      ...rest,
      nombre: `${rest.nombre} (Copia)`,
      estado: 'draft'
    });
    
    if (insertErr) return toast.error('Error al duplicar');
    toast.success('Campaña duplicada');
    fetchData();
  };

  const handleArchive = async (id: string) => {
    const { error } = await supabase.from('campaigns').update({ estado: 'archivada' }).eq('id', id);
    if (error) return toast.error('Error al archivar');
    toast.success('Campaña archivada');
    fetchData();
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || c.client?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.estado === filterStatus;
    const matchesClient = filterClient === 'all' || c.client_id === filterClient;
    return matchesSearch && matchesStatus && matchesClient;
  });

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col min-h-screen bg-[#050505] text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Historial de Campañas</h1>
        <p className="text-zinc-400">Gestiona y organiza todas tus campañas generadas.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por campaña o cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="activa">Activa</option>
            <option value="archivada">Archivada</option>
          </select>
          <select 
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
          >
            <option value="all">Todos los clientes</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-white/5">
              <FolderArchive className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-zinc-300">No hay campañas</h3>
              <p className="text-sm text-zinc-500">No se encontraron resultados para tu búsqueda.</p>
            </div>
          ) : (
            filteredCampaigns.map(camp => (
              <div key={camp.id} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500/30 transition-colors group">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{camp.nombre || 'Sin título'}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      camp.estado === 'activa' ? 'bg-emerald-500/20 text-emerald-400' : 
                      camp.estado === 'archivada' ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {camp.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {camp.client?.nombre || 'Sin cliente'}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(camp.created_at), 'dd MMM yyyy')}</span>
                    <span className="capitalize">{camp.plataforma || 'Varias'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  {camp.client?.slug && (
                    <button onClick={() => window.open(`/c/${camp.client?.slug}`, '_blank')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors tooltip-trigger" title="Portal de Cliente">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDuplicate(camp)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors tooltip-trigger" title="Duplicar">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleArchive(camp.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-zinc-300 transition-colors tooltip-trigger" title="Archivar">
                    <FolderArchive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
