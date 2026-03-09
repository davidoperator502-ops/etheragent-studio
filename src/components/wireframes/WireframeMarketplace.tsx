import React, { useState } from 'react';
import { Search, Filter, Star, Users, Zap, Crown, ChevronRight, Heart, Play, Globe, Monitor } from 'lucide-react';

const agentPersonas = [
  {
    id: 'cyber',
    name: 'Cyber-Tech',
    role: 'Web3 / Crypto Specialist',
    avatar: '🤖',
    color: 'blue',
    rating: 4.9,
    users: 1250,
    price: '$39/mo',
    tier: 'Pro',
    channels: ['Metaverse', 'Social'],
    description: 'Analytical and visionary tone for crypto and Web3 brands.'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Pro',
    role: 'Fashion / Retail Expert',
    avatar: '👗',
    color: 'pink',
    rating: 4.8,
    users: 2100,
    price: '$45/mo',
    tier: 'Pro',
    channels: ['Interior', 'Social'],
    description: 'Casual and aesthetic tone for retail and fashion brands.'
  },
  {
    id: 'pioneer',
    name: 'Pionero',
    role: 'Space / Tech Visionary',
    avatar: '🚀',
    color: 'amber',
    rating: 4.7,
    users: 450,
    price: '$79/mo',
    tier: 'Enterprise',
    channels: ['Space', 'DOOH'],
    description: 'Authoritative and inspiring tone for high-tech and aerospace.'
  },
  {
    id: 'finance',
    name: 'Finance Pro',
    role: 'FinTech Specialist',
    avatar: '💼',
    color: 'green',
    rating: 4.9,
    users: 1800,
    price: '$55/mo',
    tier: 'Pro',
    channels: ['LinkedIn', 'DOOH'],
    description: 'Professional authority for financial services.'
  }
];

const categories = ['All', 'Tech', 'Fashion', 'Finance', 'Gaming', 'Health'];

export default function WireframeMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<typeof agentPersonas[0] | null>(null);

  const filteredAgents = agentPersonas.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || 
      agent.role.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Influencer Marketplace</h1>
          <p className="text-gray-500">Browse and rent AI agent personas for your campaigns</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center bg-white border rounded-lg px-4">
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="flex-1 py-3 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border px-4 py-3 rounded-lg">
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Agent Grid */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`bg-white rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {agent.avatar}
                  </div>
                  {agent.tier === 'Enterprise' && (
                    <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      <Crown size={12} /> Enterprise
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{agent.role}</p>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>
                
                <div className="flex gap-2 mb-4">
                  {agent.channels.map((ch) => (
                    <span key={ch} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {ch}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{agent.rating}</span>
                    <span className="text-xs text-gray-400">({agent.users})</span>
                  </div>
                  <span className="font-bold text-blue-600">{agent.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-8">
            {selectedAgent ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl mx-auto mb-3">
                    {selectedAgent.avatar}
                  </div>
                  <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                  <p className="text-gray-500">{selectedAgent.role}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-medium">{selectedAgent.rating}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Active Users</span>
                    <span className="font-medium">{selectedAgent.users}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly Price</span>
                    <span className="font-medium">{selectedAgent.price}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Supported Channels</div>
                  <div className="flex gap-2">
                    {selectedAgent.channels.map((ch) => (
                      <span key={ch} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {ch === 'Metaverse' || ch === 'Space' ? <Globe size={12} /> : <Monitor size={12} />}
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                    Select Agent <ChevronRight size={18} />
                  </button>
                  <button className="w-full border py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Play size={18} /> Watch Demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Users size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select an agent to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
