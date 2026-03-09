import React, { useState } from 'react';
import { Search, Globe, TrendingUp, Users, DollarSign, BarChart3, Download, History, ExternalLink, Sparkles } from 'lucide-react';

export default function WireframeIntelligence() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    niche: string;
    competitors: string[];
    recommendedAgent: string;
    confidence: number;
    keywords: string[];
  }>(null);

  const handleAnalyze = () => {
    if (!url) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        niche: 'FinTech / SaaS',
        competitors: ['Stripe', 'Paddle', 'Chargebee'],
        recommendedAgent: 'Marcus V.',
        confidence: 94,
        keywords: ['payments', 'subscription', 'B2B', 'enterprise']
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Intelligence Engine - Wireframe</h1>
          <p className="text-gray-500">URL Analysis for Agent Recommendation</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="col-span-2 space-y-6">
            {/* URL Input */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Analyze Website</h2>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center border-2 border-gray-200 rounded-lg px-4">
                  <Globe size={18} className="text-gray-400 mr-3" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://client-website.com"
                    className="flex-1 py-3 outline-none"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !url}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing ? (
                    <>Analyzing...</>
                  ) : (
                    <><Sparkles size={18} /> Analyze</>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Analysis Results</h2>
                  <button className="text-blue-500 text-sm flex items-center gap-1">
                    <Download size={14} /> Export PDF
                  </button>
                </div>

                {/* Confidence Score */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{result.confidence}%</div>
                  <div>
                    <div className="font-medium">Confidence Score</div>
                    <div className="text-sm text-gray-500">AI-powered analysis accuracy</div>
                  </div>
                </div>

                {/* Niche & Keywords */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Detected Niche</div>
                    <div className="font-semibold text-lg">{result.niche}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Recommended Agent</div>
                    <div className="font-semibold text-lg text-blue-600">{result.recommendedAgent}</div>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Keywords Detected</div>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw) => (
                      <span key={kw} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Competitors */}
                <div>
                  <div className="text-sm text-gray-500 mb-2">Competitors Identified</div>
                  <div className="flex flex-wrap gap-2">
                    {result.competitors.map((comp) => (
                      <span key={comp} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm flex items-center gap-1">
                        {comp} <ExternalLink size={12} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium">
                    Select Agent
                  </button>
                  <button className="px-4 border rounded-lg">
                    Save to History
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <History size={18} /> Recent Analyses
            </h3>
            <div className="space-y-3">
              {[
                { url: 'stripe.com', niche: 'FinTech', date: '2h ago' },
                { url: 'shopify.com', niche: 'E-commerce', date: '1d ago' },
                { url: 'hubspot.com', niche: 'SaaS', date: '3d ago' },
              ].map((item, i) => (
                <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="text-sm font-medium truncate">{item.url}</div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{item.niche}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
