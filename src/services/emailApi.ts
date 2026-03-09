const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface EmailRecipient {
  name: string;
  email: string;
  company?: string;
}

export interface EmailPreviewData {
  influencerId: string;
  influencerName: string;
  influencerImage: string;
  script: {
    spanish: string;
    english: string;
  };
  duration: number;
  niche: string;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  recipient: EmailRecipient;
  previewData: EmailPreviewData;
  status: 'draft' | 'queued' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  error?: string;
}

const mockCampaigns: EmailCampaign[] = [];

const generateEmailHtml = (campaign: EmailCampaign): string => {
  const { recipient, previewData } = campaign;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EtherAgent - Preview de Influencer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      background: #0a0a0a; 
      color: #fff; 
      line-height: 1.6;
    }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { 
      text-align: center; 
      padding: 30px 0; 
      border-bottom: 2px solid #10b981;
      margin-bottom: 30px;
    }
    .logo { 
      font-size: 28px; 
      font-weight: 800; 
      color: #10b981; 
      letter-spacing: -1px;
    }
    .tagline { 
      color: #666; 
      font-size: 12px; 
      margin-top: 8px; 
    }
    .greeting { 
      font-size: 16px; 
      color: #fff; 
      margin-bottom: 24px;
    }
    .card { 
      background: #111; 
      border-radius: 16px; 
      padding: 24px; 
      margin-bottom: 24px;
      border: 1px solid #222;
    }
    .influencer-preview { text-align: center; }
    .influencer-avatar {
      width: 120px;
      height: 120px;
      border-radius: 16px;
      object-fit: cover;
      border: 2px solid #10b981;
      margin-bottom: 16px;
    }
    .influencer-name {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }
    .influencer-niche {
      color: #10b981;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .script-section {
      background: #0a0a0a;
      border-radius: 12px;
      padding: 16px;
      margin-top: 16px;
      text-align: left;
    }
    .script-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .script-text {
      color: #fff;
      font-size: 14px;
      line-height: 1.6;
    }
    .duration-badge {
      display: inline-block;
      background: #10b98120;
      color: #10b981;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 16px;
    }
    .cta {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background: #10b981;
      color: #0a0a0a;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      color: #444;
      font-size: 11px;
      padding-top: 20px;
      border-top: 1px solid #1a1a1a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">EtherAgent</div>
      <p class="tagline">Neural Video Synthesis Platform</p>
    </div>
    
    <p class="greeting">Hola ${recipient.name}${recipient.company ? ` de ${recipient.company}` : ''},</p>
    
    <p style="color: #888; font-size: 14px; margin-bottom: 24px;">
      Te envío este preview de nuestro influencer sintético <strong>${previewData.influencerName}</strong> 
      especializado en <strong>${previewData.niche}</strong>. Este contenido está optimizado para 
      formatos cortos (6 segundos) y funciona tanto en español como en inglés.
    </p>
    
    <div class="card">
      <div class="influencer-preview">
        <img 
          src="${previewData.influencerImage}" 
          alt="${previewData.influencerName}" 
          class="influencer-avatar"
        />
        <h2 class="influencer-name">${previewData.influencerName}</h2>
        <p class="influencer-niche">${previewData.niche}</p>
        
        <div class="script-section">
          <p class="script-label">Script en Español</p>
          <p class="script-text">"${previewData.script.spanish}"</p>
        </div>
        
        <div class="script-section">
          <p class="script-label">Script in English</p>
          <p class="script-text">"${previewData.script.english}"</p>
        </div>
        
        <span class="duration-badge">⏱️ ${previewData.duration} segundos</span>
      </div>
    </div>
    
    <div class="cta">
      <a href="#" class="cta-button">Ver Demo Completo</a>
    </div>
    
    <p style="color: #666; font-size: 12px; margin-bottom: 20px;">
      ¿Interesado en este influencer para tu marca? Responde a este correo o agenda una demo.
    </p>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} EtherAgent Studio</p>
      <p>Generado automáticamente - Preview confidential</p>
    </div>
  </div>
</body>
</html>
  `;
};

class EmailApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'EmailApiError';
  }
}

export const emailApi = {
  async sendPreviewEmail(
    recipient: EmailRecipient,
    previewData: EmailPreviewData,
    subject?: string
  ): Promise<EmailCampaign> {
    if (USE_MOCK) {
      await delay(1500);
      
      const campaign: EmailCampaign = {
        id: `campaign_${Date.now()}`,
        subject: subject || `Preview: ${previewData.influencerName} - EtherAgent`,
        recipient,
        previewData,
        status: 'sent',
        sentAt: new Date().toISOString()
      };
      
      mockCampaigns.push(campaign);
      
      console.log('📧 Email preview sent (mock):', {
        to: recipient.email,
        subject: campaign.subject,
        html: generateEmailHtml(campaign)
      });
      
      return campaign;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/email/send-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          previewData,
          subject
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to send email' }));
        throw new EmailApiError(response.status, error.message);
      }

      return await response.json();
    } catch (error) {
      console.error('Email API error:', error);
      throw error;
    }
  },

  async sendBatchPreviewEmails(
    recipients: EmailRecipient[],
    previewData: EmailPreviewData,
    subject?: string
  ): Promise<EmailCampaign[]> {
    const results: EmailCampaign[] = [];
    
    for (const recipient of recipients) {
      try {
        const campaign = await this.sendPreviewEmail(recipient, previewData, subject);
        results.push(campaign);
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        results.push({
          id: `failed_${Date.now()}`,
          subject: subject || `Preview: ${previewData.influencerName}`,
          recipient,
          previewData,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  },

  async scheduleCampaign(
    recipient: EmailRecipient,
    previewData: EmailPreviewData,
    scheduledAt: Date,
    subject?: string
  ): Promise<EmailCampaign> {
    if (USE_MOCK) {
      await delay(500);
      
      const campaign: EmailCampaign = {
        id: `scheduled_${Date.now()}`,
        subject: subject || `Preview: ${previewData.influencerName} - EtherAgent`,
        recipient,
        previewData,
        status: 'queued',
        scheduledAt: scheduledAt.toISOString()
      };
      
      mockCampaigns.push(campaign);
      return campaign;
    }

    const response = await fetch(`${API_BASE_URL}/email/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient,
        previewData,
        scheduledAt: scheduledAt.toISOString(),
        subject
      })
    });

    if (!response.ok) {
      throw new EmailApiError(response.status, 'Failed to schedule campaign');
    }

    return response.json();
  },

  getCampaignHistory(): EmailCampaign[] {
    return [...mockCampaigns];
  },

  generatePreviewHtml(campaign: EmailCampaign): string {
    return generateEmailHtml(campaign);
  }
};

export default emailApi;
