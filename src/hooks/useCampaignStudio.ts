import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCampaignStore, SelectedVideoMeta } from '@/store/useCampaignStore';
import { generateVideoPrompt } from '@/lib/groqService';
import { buildMasterPrompt } from '@/lib/prompt-engine/buildMasterPrompt';
import { getLabConfig } from '@/lib/prompt-engine/labConfigs';
import {
  CampaignAsset,
  CampaignDataPayload,
  CampaignRecord,
  DurationId,
  LabType,
} from '@/lib/prompt-engine/types';
import { toast } from 'sonner';

interface SaveArgs {
  campaignName: string;
  selectedClientId: string; // id de cliente o 'new'
  newClientName: string;
  surface: string; // se persiste en `plataforma`
}

/**
 * Motor compartido de los Labs (social / ooh / commercial).
 * Replica la lógica de SocialLab parametrizada por labType (RUTA A: una campaña base,
 * tres interpretaciones). NO genera la campaña base — la lee de nexus_youtube_ads.
 */
export function useCampaignStudio(labType: LabType) {
  const config = getLabConfig(labType);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const selectedVideo = useCampaignStore(state => state.selectedVideo);
  const setWorkspace = useCampaignStore(state => state.setWorkspace);
  const setSelectedVideo = useCampaignStore(state => state.setSelectedVideo);

  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [uploading, setUploading] = useState(false);

  // Generador de guiones
  const [generatingDuration, setGeneratingDuration] = useState<string | null>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<string, string>>({});

  // Guardado de campaña
  const [clients, setClients] = useState<{ id: string; nombre: string }[]>([]);
  const [savingCampaign, setSavingCampaign] = useState(false);

  // ── 1. Cargar campaña base desde nexus_youtube_ads (RUTA A) ──
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!user) { setLoading(false); return; }
      const campaignId = searchParams.get('campaign');
      try {
        let data, error;
        if (campaignId) {
          const res = await supabase.from('nexus_youtube_ads').select('*').eq('id', campaignId).single();
          data = res.data; error = res.error;
        } else {
          const res = await supabase.from('nexus_youtube_ads').select('*')
            .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
          data = res.data; error = res.error;
        }
        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          setCampaign(data as CampaignRecord);
          setWorkspace(data.campaign_data);
        }
      } catch (err) {
        console.error('Error fetching campaign:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [searchParams, user, setWorkspace]);

  useEffect(() => { setVideoStarted(false); }, [activeAssetIndex]);

  // ── 2. Normalización a currentAsset ──
  const campaignData = campaign?.campaign_data as CampaignDataPayload | undefined;
  const isNewFormat = !!campaignData?.hook;

  const baseAsset: CampaignAsset | undefined = useMemo(() => (
    isNewFormat && campaignData ? {
      type: config.assetDefaults.assetTypeLabel,
      duration: config.assetDefaults.durationLabel,
      on_screen_text: campaignData.on_screen_text || [],
      visual_description: campaignData.visual_description,
      call_to_action: campaignData.call_to_action,
      hook: campaignData.hook,
      narrative_body: campaignData.narrative_body,
      voiceover_script: campaignData.narrative_body,
      music_background: config.assetDefaults.music_background,
      sound_effects: config.assetDefaults.sound_effects,
      emotional_tone: config.assetDefaults.emotional_tone,
      pacing_notes: config.assetDefaults.pacing_notes,
      video_url: undefined,
      thumbnail_url: undefined,
    } : campaignData?.assets?.[activeAssetIndex]
  ), [isNewFormat, campaignData, config.assetDefaults, activeAssetIndex]);

  const currentAsset: CampaignAsset | null = useMemo(() => (
    baseAsset ? {
      ...baseAsset,
      video_url: selectedVideo?.url || baseAsset.video_url,
      thumbnail_url: selectedVideo?.thumbnail || baseAsset.thumbnail_url,
    } : null
  ), [baseAsset, selectedVideo]);

  // ── 3. Clipboard ──
  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  }, []);

  const copyMaster = useCallback(() => {
    if (!currentAsset) return;
    copy(buildMasterPrompt(currentAsset), 'Prompt Maestro');
  }, [currentAsset, copy]);

  const copyVisual = useCallback(() => {
    if (!currentAsset) return;
    copy(currentAsset.visual_description, 'Prompt Visual');
  }, [currentAsset, copy]);

  // ── 4. Generador de guiones 10/30/60 ──
  const generatePrompt = useCallback(async (duration: DurationId, surface: string) => {
    if (!currentAsset) return;
    setGeneratingDuration(duration);
    try {
      const prompt = await generateVideoPrompt(duration, surface, {
        hook: currentAsset.hook,
        narrative_body: currentAsset.narrative_body,
        call_to_action: currentAsset.call_to_action,
      }, config.promptContext);
      setGeneratedPrompts(prev => ({ ...prev, [duration]: prompt }));

      if (campaign?.id) {
        await supabase.from('campaign_assets').insert({
          campaign_id: campaign.id,
          tipo: 'video_prompt',
          duracion: duration,
          contenido: prompt,
        });
      }
      toast.success(`Prompt de ${duration} generado con éxito`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error('Error generando prompt: ' + msg);
    } finally {
      setGeneratingDuration(null);
    }
  }, [currentAsset, campaign?.id, config.promptContext]);

  const exportPrompts = useCallback((surface: string) => {
    const text = Object.entries(generatedPrompts)
      .map(([dur, prompt]) => `--- PROMPT ${dur} ---\n${prompt}`).join('\n\n');
    if (!text) { toast.info('No hay prompts generados para exportar'); return; }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prompts_${surface}_${campaign?.id || 'export'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedPrompts, campaign?.id]);

  // ── 5. Upload de video/imagen propio ──
  const uploadFile = useCallback(async (file: File) => {
    if (!campaign || !currentAsset || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const timestamp = Date.now();
      const safeType = (currentAsset.type || 'video').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${config.storagePrefix}/${campaign.id}/${safeType}_${timestamp}_${safeName}`;

      const { error: uploadError } = await supabase.storage.from('campaign_assets').upload(filePath, file);

      let publicUrl: string;
      if (uploadError) {
        if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
          const legacyPath = `${config.storagePrefix}_${campaign.id}_${timestamp}.${ext}`;
          const { error: legacyError } = await supabase.storage.from('visual-assets').upload(legacyPath, file);
          if (legacyError) {
            if (legacyError.message?.includes('policy') || legacyError.message?.includes('row-level')) {
              throw new Error('Permiso denegado. Asegúrate de estar autenticado.');
            }
            throw legacyError;
          }
          publicUrl = supabase.storage.from('visual-assets').getPublicUrl(legacyPath).data.publicUrl;
        } else {
          throw uploadError;
        }
      } else {
        publicUrl = supabase.storage.from('campaign_assets').getPublicUrl(filePath).data.publicUrl;
      }

      const assetId = `${config.storagePrefix}_${campaign.id}_${safeType}_${timestamp}`;
      const meta: SelectedVideoMeta = {
        url: publicUrl,
        thumbnail: publicUrl,
        assetId,
        assetType: 'uploaded',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };

      await supabase.from('visual_assets').upsert({
        id: assetId,
        url: publicUrl,
        user_id: user.id,
        campaign_id: campaign.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        asset_type: 'uploaded',
        thumbnail_url: publicUrl,
        bucket_path: filePath,
        updated_at: new Date(),
      });

      setSelectedVideo(meta);

      let updatedCampaignData;
      if (isNewFormat) {
        updatedCampaignData = { ...campaign.campaign_data, video_url: publicUrl };
      } else {
        const updatedAssets = (campaign.campaign_data.assets || []).map((a, i) =>
          i === activeAssetIndex ? { ...a, video_url: publicUrl } : a);
        updatedCampaignData = { ...campaign.campaign_data, assets: updatedAssets };
      }

      const { error: updateError } = await supabase
        .from('nexus_youtube_ads').update({ campaign_data: updatedCampaignData }).eq('id', campaign.id);

      if (updateError) {
        console.warn('nexus_youtube_ads update skipped (RLS or network):', updateError.message);
      } else {
        setCampaign({ ...campaign, campaign_data: updatedCampaignData });
      }

      toast.success(`${file.type.startsWith('video/') ? 'Video' : 'Activo'} subido y listo en tu campaña`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir activo';
      console.error('Upload error:', message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }, [campaign, currentAsset, activeAssetIndex, user, isNewFormat, setSelectedVideo, config.storagePrefix]);

  // ── 6. Clientes + Guardar campaña (con lab_type) ──
  const fetchClients = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('clients').select('id, nombre').eq('user_id', user.id).order('nombre');
    if (data) setClients(data);
  }, [user]);

  const saveCampaign = useCallback(async ({ campaignName, selectedClientId, newClientName, surface }: SaveArgs): Promise<boolean> => {
    if (!user || !campaign) return false;
    if (!campaignName.trim()) { toast.error('El nombre de la campaña es requerido'); return false; }

    setSavingCampaign(true);
    try {
      let finalClientId = selectedClientId;
      if (selectedClientId === 'new') {
        if (!newClientName.trim()) throw new Error('El nombre del cliente es requerido');
        const slug = newClientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const { data: newCli, error: cliErr } = await supabase
          .from('clients')
          .insert({ user_id: user.id, nombre: newClientName, slug: `${slug}-${Date.now().toString().slice(-4)}` })
          .select().single();
        if (cliErr) throw new Error('Error al crear el cliente: ' + cliErr.message);
        finalClientId = newCli.id;
      }

      const { error: campErr } = await supabase.from('campaigns').insert({
        user_id: user.id,
        client_id: finalClientId,
        nombre: campaignName,
        plataforma: surface,
        lab_type: labType,
        estado: 'draft',
        contenido: { ...campaign.campaign_data, assets: currentAsset ? [currentAsset] : [] },
      });
      if (campErr) throw new Error('Error al guardar la campaña: ' + campErr.message);

      toast.success('Campaña guardada en el archivo exitosamente');
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      toast.error(msg);
      return false;
    } finally {
      setSavingCampaign(false);
    }
  }, [user, campaign, currentAsset, labType]);

  // ── 7. Deploy (registra la campaña como 'activa' = desplegada) ──
  const deployCampaign = useCallback(async (surface: string): Promise<boolean> => {
    if (!user || !campaign || !currentAsset) {
      toast.error('Sube tu activo y genera la campaña antes de desplegar');
      return false;
    }
    try {
      const sector = campaignData?.detected_sector || 'Campaign';
      const { error } = await supabase.from('campaigns').insert({
        user_id: user.id,
        nombre: `${sector} · ${labType.toUpperCase()} Deploy`,
        plataforma: surface,
        lab_type: labType,
        estado: 'activa',
        contenido: { ...campaign.campaign_data, assets: [currentAsset] },
      });
      if (error) throw error;
      toast.success('Campaña desplegada y registrada como activa');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al desplegar');
      return false;
    }
  }, [user, campaign, currentAsset, campaignData, labType]);

  return {
    config,
    user,
    // datos
    loading, campaign, campaignData, isNewFormat, currentAsset,
    activeAssetIndex, setActiveAssetIndex,
    videoStarted, setVideoStarted,
    mediaType, setMediaType,
    // guiones
    generatingDuration, generatedPrompts, generatePrompt, exportPrompts,
    // upload
    uploading, uploadFile,
    // clipboard
    copy, copyMaster, copyVisual,
    // guardado
    clients, fetchClients, savingCampaign, saveCampaign,
    // deploy
    deployCampaign,
  };
}
