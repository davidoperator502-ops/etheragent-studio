import React from 'react';
import { Bot, MapPin, Mic, Play, Save, Share2, Download, Settings, ChevronRight, Layers, Zap, Globe } from 'lucide-react';

interface WireframeSystemSpacesProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function WireframeSystemSpaces({ currentStep, onStepChange }: WireframeSystemSpacesProps) {
  const steps = [
    { id: 1, title: 'Select Agent', icon: Bot },
    { id: 2, title: 'Choose Space', icon: MapPin },
    { id: 3, title: 'Configure Audio', icon: Mic },
    { id: 4, title: 'Render', icon: Zap },
  ];

  const agents = [
    { id: 'cyber', name: 'Cyber-Tech', status: 'active', niche: 'Web3/Crypto' },
    { id: 'lifestyle', name: 'Lifestyle', status: 'ready', niche: 'Fashion/Retail' },
    { id: 'pioneer', name: 'Pionero', status: 'ready', niche: 'Space Tech' },
  ];

  const spaces = [
    { id: 'interior', name: 'Interior', type: 'DOOH', icon: '🏢' },
    { id: 'exterior', name: 'Exterior', type: 'DOOH', icon: '🌆' },
    { id: 'metaverse', name: 'Metaverso', type: 'Virtual', icon: '🌐' },
    { id: 'space', name: 'Espacio', type: 'Orbital', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">SystemSpaces - Wireframe</h1>
          <p className="text-gray-500">Campaign Environment Configuration</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Steps */}
          <div className="w-64 bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Workflow</h3>
            <div className="space-y-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => onStepChange(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <step.icon size={18} />
                  <span className="text-sm font-medium">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Select Agent Persona</h2>
                <div className="grid grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-colors">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3" />
                      <h3 className="font-medium text-center">{agent.name}</h3>
                      <p className="text-xs text-gray-500 text-center">{agent.niche}</p>
                      <div className={`mt-2 text-xs text-center px-2 py-1 rounded ${
                        agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {agent.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Choose Deployment Space</h2>
                <div className="grid grid-cols-2 gap-4">
                  {spaces.map((space) => (
                    <div key={space.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 cursor-pointer transition-colors">
                      <span className="text-4xl">{space.icon}</span>
                      <h3 className="font-medium mt-2">{space.name}</h3>
                      <p className="text-xs text-gray-500">{space.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Configure Audio</h2>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="text-sm font-medium">Voice Preset</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>Deep Baritone (EN)</option>
                      <option>Warm & Friendly (EN)</option>
                      <option>Autoritario (ES)</option>
                    </select>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="text-sm font-medium">Script</label>
                    <textarea className="w-full mt-1 p-2 border rounded h-32" placeholder="Enter your script here..." />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Render Preview</h2>
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Preview Area</span>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                    <Play size={18} /> Render Video
                  </button>
                  <button className="px-4 border border-gray-300 rounded-lg flex items-center gap-2">
                    <Save size={18} /> Save Config
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => onStepChange(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
