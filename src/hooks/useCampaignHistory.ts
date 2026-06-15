import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

// Alineado con el esquema real de la tabla `campaigns`
// (20260613000000_clients_and_campaigns.sql + 20260615000001_add_lab_type_to_campaigns.sql)
export interface CampaignRecord {
    id: string;
    user_id: string;
    client_id: string | null;
    nombre: string;
    plataforma: string | null;
    lab_type: 'social' | 'ooh' | 'commercial';
    estado: 'draft' | 'activa' | 'archivada';
    contenido: Record<string, unknown> | null;
    created_at: string;
    updated_at?: string;
}

export type LabFilter = 'social' | 'ooh' | 'commercial';

export function useCampaignHistory(labType?: LabFilter) {
    const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth(); // Verificamos si hay sesión

    useEffect(() => {
        async function fetchHistory() {
            if (!user) {
                setCampaigns([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);

                // Magia RLS: Pedimos todo, pero Supabase solo devolverá lo del usuario logueado.
                let query = supabase
                    .from('campaigns')
                    .select('*')
                    .order('created_at', { ascending: false });

                // Filtro opcional por lab (social / ooh / commercial)
                if (labType) query = query.eq('lab_type', labType);

                const { data, error } = await query;

                if (error) throw error;

                if (data) {
                    setCampaigns(data as CampaignRecord[]);
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error('Error accediendo al archivo de campañas:', msg);
            } finally {
                setIsLoading(false);
            }
        }

        fetchHistory();

        // Opcional: Escuchar cambios en tiempo real si el Nexus inyecta una nueva
        const subscription = supabase.channel('public:campaigns')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
                fetchHistory(); // Refresca si hay cambios
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, labType]);

    return { campaigns, isLoading };
}
