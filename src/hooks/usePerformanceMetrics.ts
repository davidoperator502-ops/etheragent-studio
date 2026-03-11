import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export interface PerformanceMetrics {
    roas: string;
    cpa: string;
    budget: number;
}

const MOCK_PERFORMANCE_DATA: PerformanceMetrics = {
    roas: '+420%',
    cpa: '-42.5%',
    budget: 150000
};

export function usePerformanceMetrics() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>(MOCK_PERFORMANCE_DATA);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestMetrics() {
            if (USE_MOCK) {
                setMetrics(MOCK_PERFORMANCE_DATA);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);

                // Buscamos la campaña más reciente que esté activa/desplegada
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('budget_allocated, metrics')
                    .eq('status', 'deployed')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw error; // Ignoramos el error PGRST116 que solo significa "no se encontraron filas"
                }

                if (data) {
                    setMetrics({
                        // Extraemos del JSONB, o usamos un fallback si el JSON está vacío
                        roas: data.metrics?.roas || '+420%',
                        cpa: data.metrics?.cpa || '-42.5%',
                        budget: data.budget_allocated || 150000
                    });
                }
            } catch (err: any) {
                console.error('Error sincronizando métricas de Kaelen:', err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLatestMetrics();

        // Set up real-time subscription
        const subscription = supabase
            .channel('public:campaigns')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, payload => {
                fetchLatestMetrics(); // Re-fetch on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return { metrics, isLoading };
}
