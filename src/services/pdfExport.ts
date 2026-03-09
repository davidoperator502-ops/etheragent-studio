import html2pdf from 'html2pdf.js';

export interface InfluencerData {
  id: string;
  name: string;
  role: string;
  niche: string;
  region: string;
  industry: string;
  demand: number;
  trust: number;
  price: string;
  renderTime: string;
  voiceType: string;
}

export interface FlowStepData {
  id: string;
  title: string;
  titleEn: string;
  status: string;
  details?: string[];
}

export interface DemandMetric {
  label: string;
  value: number;
  trend: string;
  color: string;
}

const generatePDFHtml = (
  influencer: InfluencerData,
  steps: FlowStepData[],
  demandMetrics: DemandMetric[]
): string => {
  const statusColors: Record<string, string> = {
    completed: '#10b981',
    active: '#f59e0b',
    pending: '#6b7280'
  };

  const stepsHtml = steps.map(step => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #222;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColors[step.status] || '#666'}; margin-right: 10px;"></span>
        <span style="color: #fff; font-size: 12px;">${step.title}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #222; text-align: right;">
        <span style="color: ${statusColors[step.status] || '#666'}; font-size: 11px; text-transform: uppercase;">${step.status}</span>
      </td>
    </tr>
  `).join('');

  const demandHtml = demandMetrics.map(m => `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
        <span style="color: #888;">${m.label}</span>
        <span style="color: #10b981;">${m.value}% ${m.trend}</span>
      </div>
      <div style="height: 6px; background: #1a1a1a; border-radius: 3px; overflow: hidden;">
        <div style="height: 100%; width: ${m.value}%; background: linear-gradient(90deg, #059669, #10b981); border-radius: 3px;"></div>
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EtherAgent - ${influencer.name} Profile</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      background: #0a0a0a; 
      color: #fff; 
      padding: 40px; 
      min-height: 100vh;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 30px; 
      padding-bottom: 20px; 
      border-bottom: 2px solid #10b981;
    }
    .logo { 
      font-size: 28px; 
      font-weight: 800; 
      color: #10b981; 
      letter-spacing: -1px;
    }
    .badge { 
      background: #10b98120; 
      color: #10b981; 
      padding: 6px 14px; 
      border-radius: 20px; 
      font-size: 11px; 
      font-weight: 600; 
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .profile { 
      display: flex; 
      gap: 30px; 
      margin-bottom: 30px; 
      align-items: center;
    }
    .avatar { 
      width: 100px; 
      height: 100px; 
      border-radius: 16px; 
      object-fit: cover; 
      border: 2px solid #10b981;
    }
    .info h1 { 
      font-size: 26px; 
      margin-bottom: 6px; 
      color: #fff;
    }
    .info .role { 
      color: #10b981; 
      font-size: 14px; 
      font-weight: 500;
    }
    .info .meta { 
      color: #666; 
      font-size: 12px; 
      margin-top: 8px;
    }
    .metrics { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 16px; 
      margin-bottom: 30px;
    }
    .metric { 
      background: #111; 
      padding: 20px; 
      border-radius: 12px; 
      text-align: center; 
      border: 1px solid #222;
    }
    .metric-value { 
      font-size: 24px; 
      font-weight: 700; 
      color: #10b981; 
    }
    .metric-label { 
      font-size: 10px; 
      color: #666; 
      margin-top: 4px; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section { 
      background: #111; 
      padding: 24px; 
      border-radius: 12px; 
      margin-bottom: 24px; 
      border: 1px solid #222;
    }
    .section-title { 
      font-size: 12px; 
      color: #666; 
      margin-bottom: 16px; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      font-weight: 600;
    }
    .steps-table { 
      width: 100%; 
      border-collapse: collapse;
    }
    .footer { 
      text-align: center; 
      color: #444; 
      font-size: 11px; 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 1px solid #1a1a1a;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">EtherAgent</div>
    <span class="badge">Neural Instance Profile</span>
  </div>
  
  <div class="profile">
    <div style="width: 100px; height: 100px; border-radius: 16px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; color: #0a0a0a;">
      ${influencer.name.split(' ').map(n => n[0]).join('')}
    </div>
    <div class="info">
      <h1>${influencer.name}</h1>
      <p class="role">${influencer.role}</p>
      <p class="meta">${influencer.niche} • ${influencer.region} • ${influencer.industry}</p>
    </div>
  </div>
  
  <div class="metrics">
    <div class="metric">
      <div class="metric-value">${influencer.trust}%</div>
      <div class="metric-label">Trust Score</div>
    </div>
    <div class="metric">
      <div class="metric-value">${influencer.price}</div>
      <div class="metric-label">Per Month</div>
    </div>
    <div class="metric">
      <div class="metric-value">${influencer.renderTime}</div>
      <div class="metric-label">Render Time</div>
    </div>
    <div class="metric">
      <div class="metric-value">${influencer.demand}%</div>
      <div class="metric-label">Market Demand</div>
    </div>
  </div>
  
  <div class="section">
    <h3 class="section-title">Pipeline Phases</h3>
    <table class="steps-table">
      ${stepsHtml}
    </table>
  </div>
  
  <div class="section">
    <h3 class="section-title">Demand Indicators</h3>
    ${demandHtml}
  </div>
  
  <div class="footer">
    Generated by EtherAgent Studio | ${new Date().toLocaleDateString()} | Confidential Report
  </div>
</body>
</html>
  `;
};

export const exportToPDF = async (
  influencer: InfluencerData,
  steps: FlowStepData[],
  demandMetrics: DemandMetric[]
): Promise<void> => {
  const html = generatePDFHtml(influencer, steps, demandMetrics);
  
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);

  const opt = {
    margin: 10,
    filename: `etheragent_${influencer.id}_${Date.now()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0a0a'
    },
    jsPDF: { 
      unit: 'mm' as const, 
      format: 'a4' as const, 
      orientation: 'portrait' as const
    }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
};

export const exportStepsToPDF = async (
  flowId: string,
  flowTitle: string,
  steps: FlowStepData[]
): Promise<void> => {
  const stepsHtml = steps.map((step, index) => {
    const detailsHtml = step.details?.map(d => 
      `<div style="color: #888; font-size: 10px; margin-bottom: 4px; padding-left: 12px; border-left: 2px solid #333;">${d}</div>`
    ).join('') || '';

    return `
      <div style="background: #111; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #222;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="color: #10b981; font-size: 11px; font-weight: 600;">PHASE ${index + 1}</span>
          <span style="color: #666; font-size: 10px; text-transform: uppercase;">${step.status}</span>
        </div>
        <h4 style="color: #fff; font-size: 13px; margin-bottom: 8px;">${step.title}</h4>
        ${detailsHtml}
      </div>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EtherAgent - ${flowTitle}</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #fff; padding: 40px; }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 800; color: #10b981; }
    .title { font-size: 22px; color: #fff; margin-top: 16px; }
    .footer { text-align: center; color: #444; font-size: 11px; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">EtherAgent</div>
    <h1 class="title">${flowTitle}</h1>
  </div>
  ${stepsHtml}
  <div class="footer">
    Generated by EtherAgent Studio | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
  `;

  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const opt = {
    margin: 10,
    filename: `etheragent_steps_${flowId}_${Date.now()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#0a0a0a' },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
};
