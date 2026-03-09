import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface CampaignRecord {
    id: string;
    title: string;
    target_url: string;
    status: string;
    budget_allocated: number;
    metrics: {
        roas?: string;
        cpa?: string;
    };
    created_at: string;
}

export function useCampaignHistory() {
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
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    setCampaigns(data as CampaignRecord[]);
                }
            } catch (err: any) {
                console.error('Error accediendo al archivo de campañas:', err.message);
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
    }, [user]);

    return { campaigns, isLoading };
}
