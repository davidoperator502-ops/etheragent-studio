import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Video, DollarSign, Download, Calendar, Filter, Globe, Eye, MessageCircle, Share2, Clock, Zap } from 'lucide-react';

const stats = [
  { label: 'Total Renders', value: '1,247', change: '+12%', icon: Video },
  { label: 'Active Agents', value: '8', change: '+2', icon: Users },
  { label: 'Total Reach', value: '2.4M', change: '+34%', icon: Eye },
  { label: 'Revenue', value: '$18.2K', change: '+8%', icon: DollarSign },
];

const campaigns = [
  { id: 1, name: 'Q1 Product Launch', agent: 'Cyber-Tech', renders: 45, reach: 850000, status: 'active' },
  { id: 2, name: 'Holiday Sale', agent: 'Lifestyle Pro', renders: 120, reach: 1200000, status: 'completed' },
  { id: 3, name: 'Web3 Awareness', agent: 'Pionero', renders: 30, reach: 350000, status: 'active' },
];

const agentPerformance = [
  { name: 'Cyber-Tech', renders: 450, reach: 1.2, engagement: 4.2 },
  { name: 'Lifestyle Pro', renders: 380, reach: 0.9, engagement: 3.8 },
  { name: 'Pionero', renders: 180, reach: 0.3, engagement: 5.1 },
];

export default function WireframeTelemetry() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Telemetry</h1>
            <p className="text-gray-500">Campaign performance and analytics</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
              <Calendar size={18} /> {timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={20} className="text-gray-400" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Campaigns Table */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-sm font-medium text-gray-500 pb-3">Campaign</th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-3">Agent</th>
                  <th className="text-right text-gray-500 pb-3"> text-sm font-mediumRenders</th>
                  <th className="text-right text-sm font-medium text-gray-500 pb-3">Reach</th>
                  <th className="text-center text-sm font-medium text-gray-500 pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{campaign.name}</td>
                    <td className="py-3 text-gray-500">{campaign.agent}</td>
                    <td className="py-3 text-right">{campaign.renders}</td>
                    <td className="py-3 text-right">{(campaign.reach / 1000000).toFixed(1)}M</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Agent Performance</h2>
            <div className="space-y-4">
              {agentPerformance.map((agent, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-gray-500">{agent.renders} renders</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(agent.renders / 500) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{agent.engagement}% engagement</span>
                    <span>{agent.reach}M reach</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 border rounded-lg py-2 text-sm font-medium">
              View All Agents
            </button>
          </div>
        </div>

        {/* Memory Stats */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Agent Memory Analytics</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-blue-500" />
                <span className="font-medium">Conversations</span>
              </div>
              <div className="text-2xl font-bold">1,847</div>
              <div className="text-sm text-gray-500">Total interactions</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-green-500" />
                <span className="font-medium">Context Windows</span>
              </div>
              <div className="text-2xl font-bold">342</div>
              <div className="text-sm text-gray-500">Active sessions</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-purple-500" />
                <span className="font-medium">Optimizations</span>
              </div>
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-gray-500">Auto-improvements</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-amber-500" />
                <span className="font-medium">Tokens Stored</span>
              </div>
              <div className="text-2xl font-bold">2.4M</div>
              <div className="text-sm text-gray-500">Memory context</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
