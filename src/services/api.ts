import type { Avatar, Template, SystemFlow, TelemetryData, PricingTier, CheckoutResponse, User } from '@/types';
import { mockAvatars, getAvatars, updateAvatarAsset, mockTemplates, mockSystemFlows, mockTelemetry } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_STATUS = {
  isMock: USE_MOCK,
  baseUrl: API_BASE_URL,
  mode: USE_MOCK ? 'mock' : 'production'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface AnalysisData {
  targetAudience: {
    description: string;
    tags: string[];
  };
  financialProjection: {
    description: string;
    tags: string[];
  };
  executiveDirective: {
    description: string;
    tags: string[];
  };
  strategicHook: string;
}

const mockAnalysisData: AnalysisData = {
  targetAudience: {
    description: "SaaS founders and product managers aged 28-45 seeking workflow automation solutions. High intent for productivity tools with budget authority.",
    tags: ["B2B", "Decision Makers", "Tech-Savvy", "Startup Ecosystem"]
  },
  financialProjection: {
    description: "Projected LTV of $12,400 per customer with 34-month average retention. CAC of $890 yields 13.9x ROI in first year.",
    tags: ["High Margin", "Recurring Revenue", "Scalable", "B2B Focus"]
  },
  executiveDirective: {
    description: "Position as the 'missing link' between scattered productivity tools and unified workflow orchestration. Emphasize time savings over feature parity.",
    tags: ["Thought Leadership", "Pain Point Centric", "Differentiation", "Value-First"]
  },
  strategicHook: "What if your team could recover 15 hours per week without learning a single new tool? That's not productivity—it's liberation."
};

const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, error.message || `HTTP error ${response.status}`);
  }
  return response.json();
};

export const api = {
  async getAvatars(user?: User | null, includeAll?: boolean): Promise<Avatar[]> {
    if (USE_MOCK) {
      await delay(300);
      const avatars = await getAvatars();
      
      if (includeAll) {
        return avatars;
      }
      
      if (!user || user.role !== 'admin') {
        const purchasedIds = user?.purchases || [];
        if (purchasedIds.length === 0) {
          return [];
        }
        return avatars.filter(a => purchasedIds.includes(a.id));
      }
      
      return avatars;
    }
    const res = await fetch(`${API_BASE_URL}/avatars`);
    return handleResponse<Avatar[]>(res);
  },

  async getTemplates(): Promise<Template[]> {
    if (USE_MOCK) {
      await delay(300);
      return mockTemplates;
    }
    const res = await fetch(`${API_BASE_URL}/templates`);
    return handleResponse<Template[]>(res);
  },

  async getSystemFlows(user?: User | null): Promise<SystemFlow[]> {
    if (USE_MOCK) {
      await delay(300);
      
      if (user && user.role === 'admin') {
        return mockSystemFlows;
      }
      
      if (user?.purchases && user.purchases.length > 0) {
        return mockSystemFlows.filter(f => user.purchases.includes(f.id));
      }
      
      return mockSystemFlows;
    }
    const res = await fetch(`${API_BASE_URL}/flows`);
    return handleResponse<SystemFlow[]>(res);
  },

  async getTelemetry(): Promise<TelemetryData> {
    if (USE_MOCK) {
      await delay(200);
      return mockTelemetry;
    }
    const res = await fetch(`${API_BASE_URL}/telemetry`);
    return handleResponse<TelemetryData>(res);
  },

  async renderVideo(avatarId: string, script: string, platform: string): Promise<{ progress: number; url?: string }> {
    if (USE_MOCK) {
      for (let i = 0; i <= 100; i += 10) {
        await delay(200);
      }
      return { progress: 100, url: '/renders/demo.mp4' };
    }
    const res = await fetch(`${API_BASE_URL}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarId, script, platform })
    });
    return handleResponse<{ progress: number; url?: string }>(res);
  },

  async purchaseTemplate(templateId: string): Promise<{ success: boolean; orderId: string }> {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, orderId: `ORD-${Date.now()}` };
    }
    const res = await fetch(`${API_BASE_URL}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId })
    });
    return handleResponse<{ success: boolean; orderId: string }>(res);
  },

  async analyzeUrl(url: string): Promise<AnalysisData> {
    if (!validateUrl(url)) {
      throw new ApiError(400, 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.');
    }

    if (USE_MOCK) {
      await delay(2500);
      return mockAnalysisData;
    }

    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return handleResponse<AnalysisData>(res);
  },

  async getPricingTiers(): Promise<PricingTier[]> {
    if (USE_MOCK) {
      await delay(600);
      return [
        {
          id: 'tier_starter',
          name: 'Growth',
          description: 'Para solopreneurs y agencias emergentes.',
          price: { monthly: 97, annual: 970 },
          features: ['100 Videos / mes', '2 Avatares Premium', 'Telemetría Básica', 'Soporte Email'],
        },
        {
          id: 'tier_pro',
          name: 'C-Suite OS',
          description: 'Escalabilidad B2B autónoma total.',
          price: { monthly: 297, annual: 2970 },
          features: ['Videos Ilimitados', 'Roster Completo de Influencers', 'API de Telemetría Real', 'Ejecutivo de Cuenta Dedicado'],
          isPopular: true,
        },
        {
          id: 'tier_enterprise',
          name: 'Enterprise',
          description: 'Para corporaciones con nichos múltiples.',
          price: { monthly: 997, annual: 9970 },
          features: ['Instancia Dedicada EtherClaw', 'Avatares Clonados a Medida', 'SLA 99.9%', 'Onboarding Presencial'],
        }
      ];
    }
    const res = await fetch(`${API_BASE_URL}/pricing/tiers`);
    return handleResponse<PricingTier[]>(res);
  },

  async createCheckoutSession(tierId: string, isAnnual: boolean): Promise<CheckoutResponse> {
    if (USE_MOCK) {
      await delay(2500);
      return {
        status: 'success',
        transactionId: `txn_eth_${Math.random().toString(36).substr(2, 9)}`,
        invoiceUrl: `/invoices/inv_${Date.now()}.pdf`,
        message: 'Suscripción activada con éxito. EtherAgent OS desplegado.'
      };
    }
    const res = await fetch(`${API_BASE_URL}/checkout/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tierId, cycle: isAnnual ? 'annual' : 'monthly' })
    });
    return handleResponse<CheckoutResponse>(res);
  },

  async uploadAvatarAsset(id: string, type: 'image' | 'video' | 'avatar_hq' | 'video_preview_es' | 'video_preview_en', file: File): Promise<string> {
    if (USE_MOCK) {
      await delay(1500);
      const localUrl = URL.createObjectURL(file);
      const fieldMap: Record<string, 'image' | 'videoUrl' | 'avatar_hq' | 'video_preview_es' | 'video_preview_en'> = {
        'image': 'image',
        'video': 'videoUrl',
        'avatar_hq': 'avatar_hq',
        'video_preview_es': 'video_preview_es',
        'video_preview_en': 'video_preview_en'
      };
      await updateAvatarAsset(id, fieldMap[type] || 'image', localUrl, file);
      return localUrl;
    }
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/avatars/${id}/assets?type=${type}`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<{ url: string }>(res).then(r => r.url);
  },

  async generateAvatarImage(prompt: string): Promise<{ imageUrl: string; seed: number }> {
    if (USE_MOCK) {
      await delay(3000);
      const seeds: Record<string, string> = {
        'clínica': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
        'doctor': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
        'miami': 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800&q=80',
        'estética': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        'default': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
      };
      const lowerPrompt = prompt.toLowerCase();
      let imageUrl = seeds.default;
      for (const key of Object.keys(seeds)) {
        if (lowerPrompt.includes(key)) {
          imageUrl = seeds[key];
          break;
        }
      }
      return { imageUrl, seed: Math.floor(Math.random() * 1000000) };
    }
    const res = await fetch(`${API_BASE_URL}/generate/avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return handleResponse<{ imageUrl: string; seed: number }>(res);
  },

  async renderAvatarVideo(avatarId: string, script: string): Promise<{ renderId: string; etaMinutes: number }> {
    if (USE_MOCK) {
      await delay(2000);
      return { renderId: `render_${Date.now()}`, etaMinutes: 20 };
    }
    const res = await fetch(`${API_BASE_URL}/render/avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarId, script })
    });
    return handleResponse<{ renderId: string; etaMinutes: number }>(res);
  },

  async createVideoCheckoutSession(prompt: string, script: string, seed: number, imageUrl: string): Promise<{ url: string }> {
    if (USE_MOCK) {
      await delay(1500);
      return { url: '/broadcaster?success=true' };
    }
    const res = await fetch(`${API_BASE_URL}/checkout/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, script, seed, imageUrl })
    });
    return handleResponse<{ url: string }>(res);
  }
};

export { ApiError };
export default api;
