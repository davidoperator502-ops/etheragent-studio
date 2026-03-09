import React, { useState } from 'react';
import { Play, Pause, Download, Send, Clock, CheckCircle, AlertCircle, Video, MessageSquare, Settings, Smartphone, Monitor, Globe } from 'lucide-react';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸', size: '9:16' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', size: '9:16' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', size: '16:9' },
  { id: 'doh', name: 'DOOH Screen', icon: '📺', size: '16:9' },
  { id: 'metaverse', name: 'Metaverse', icon: '🌐', size: 'VR' },
];

const queueItems = [
  { id: '1', status: 'completed', agent: 'Cyber-Tech', duration: '45s', time: '2 min ago' },
  { id: '2', status: 'processing', agent: 'Lifestyle Pro', duration: '60s', progress: 67 },
  { id: '3', status: 'pending', agent: 'Pionero', duration: '30s', time: 'Queued' },
];

export default function WireframeSocialLab() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Social Lab - Wireframe</h1>
          <p className="text-gray-500">Create content with your selected AI agent</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left - Script Editor */}
          <div className="col-span-2 space-y-6">
            {/* Platform Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Select Platform</h2>
              <div className="grid grid-cols-5 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`p-4 rounded-xl border-2 text-center transition-colors ${
                      selectedPlatform.id === platform.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <div className="text-sm font-medium">{platform.name}</div>
                    <div className="text-xs text-gray-400">{platform.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Script</h2>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 bg-gray-100 rounded">Templates</button>
                  <button className="text-xs px-3 py-1 bg-gray-100 rounded">AI Assist</button>
                </div>
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Write your script here or use AI to generate one..."
                className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-400">{script.length} / 500 characters</span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                    <MessageSquare size={16} /> Add Voiceover
                  </button>
                  <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                    <Settings size={16} /> Advanced
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="aspect-[9/16] max-w-xs mx-auto bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-50">Agent Preview</p>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => setIsGenerating(true)}
              disabled={!script}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>Processing...</>
              ) : (
                <><Send size={20} /> Generate Video</>
              )}
            </button>
          </div>

          {/* Right - Queue & History */}
          <div className="space-y-6">
            {/* Render Queue */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock size={18} /> Render Queue
              </h3>
              <div className="space-y-3">
                {queueItems.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{item.agent}</span>
                      {item.status === 'completed' && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      {item.status === 'processing' && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{item.progress}%</span>
                        </div>
                      )}
                      {item.status === 'pending' && (
                        <Clock size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{item.duration}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Total Renders</span>
                  <span className="font-semibold">147</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Minutes Generated</span>
                  <span className="font-semibold">182 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Tokens Used</span>
                  <span className="font-semibold">24.5K</span>
                </div>
              </div>
            </div>

            {/* Device Preview */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold mb-4">Preview Device</h3>
              <div className="flex gap-2 justify-center">
                <button className="p-2 bg-blue-50 text-blue-600 rounded">
                  <Smartphone size={20} />
                </button>
                <button className="p-2 bg-gray-100 text-gray-400 rounded">
                  <Monitor size={20} />
                </button>
                <button className="p-2 bg-gray-100 text-gray-400 rounded">
                  <Globe size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
