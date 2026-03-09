// src/hooks/useOOHMetrics.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface OOHMetrics {
    location: string;
    resolution: string;
    format: string;
    traffic: string;
}

export function useOOHMetrics() {
    const [oohData, setOohData] = useState<OOHMetrics>({
        location: 'Neo-Shibuya',
        resolution: 'Render 8K',
        format: 'Holograma 3D',
        traffic: 'Alto Volumen'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestOOHData() {
            try {
                setIsLoading(true);

                const { data, error } = await supabase
                    .from('campaigns')
                    .select('metrics')
                    .eq('status', 'deployed')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data && data.metrics) {
                    setOohData({
                        location: data.metrics.ooh_location || 'Neo-Shibuya',
                        resolution: data.metrics.ooh_resolution || 'Render 8K',
                        format: data.metrics.ooh_format || 'Holograma 3D',
                        traffic: data.metrics.ooh_traffic || 'Alto Volumen'
                    });
                }
            } catch (err: any) {
                console.error('Error sincronizando métricas de Viktor:', err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLatestOOHData();
    }, []);

    return { oohData, isLoading };
}
