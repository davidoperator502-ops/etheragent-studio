import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SocialMetrics {
    platform: string;
    duration: string;
    retention: string;
    hookType: string;
}

export function useSocialMetrics() {
    const [socialData, setSocialData] = useState<SocialMetrics>({
        platform: 'TikTok',
        duration: '6s',
        retention: '87%',
        hookType: 'Onda de Choque'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestSocialData() {
            try {
                setIsLoading(true);

                // Buscamos la campaña más reciente desplegada
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('metrics')
                    .eq('status', 'deployed')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data && data.metrics) {
                    setSocialData({
                        // Extraemos los datos sociales del JSONB, con fallbacks de alta conversión
                        platform: data.metrics.platform || 'TikTok',
                        duration: data.metrics.video_duration || '6s',
                        retention: data.metrics.expected_retention || '87%',
                        hookType: data.metrics.hook_type || 'Onda de Choque'
                    });
                }
            } catch (err: any) {
                console.error('Error sincronizando métricas de Valeria:', err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLatestSocialData();

        // Set up real-time subscription
        const subscription = supabase
            .channel('public:campaigns:social')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, payload => {
                fetchLatestSocialData(); // Re-fetch on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };

    }, []);

    return { socialData, isLoading };
}
