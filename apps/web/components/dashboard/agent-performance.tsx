'use client'

import { motion } from 'framer-motion'
import { 
  Bot, 
  Zap, 
  Code,
  Brain,
  Shield,
  FileSearch,
  GitBranch,
  Package,
  TestTube,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

interface AgentMetrics {
  name: string;
  icon: any;
  tasks: number;
  tokens: number;
  avgDuration: number;
  successRate: number;
  lastActive: string;
  status: 'active' | 'idle' | 'busy';
}

const agentIcons = {
  'Code Review': Code,
  'Security': Shield,
  'Testing': TestTube,
  'Documentation': FileText,
  'UI/UX': FileSearch,
  'Deployment': Package,
  'Analysis': Brain,
  'Optimization': Zap
};

export function AgentPerformance() {
  const [agents, setAgents] = useState<AgentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentMetrics();
    const interval = setInterval(fetchAgentMetrics, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  async function fetchAgentMetrics() {
    try {
      const response = await fetch('/api/agents/metrics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent metrics');
      }
      
      const data = await response.json();
      
      // Map the response to include icon components
      const agentsWithIcons = data.map((agent: any) => ({
        ...agent,
        icon: agentIcons[agent.name as keyof typeof agentIcons] || Bot
      }));
      
      setAgents(agentsWithIcons);
      setLoading(false);
    } catch (err) {
      // Expected when backend is not running - using mock data
      setLoading(false);
    }
  }

  const radarData = agents.map(agent => ({
    agent: agent.name,
    performance: agent.successRate,
    efficiency: 100 - (agent.avgDuration / 50), // Normalize duration
    usage: (agent.tokens / 1000) // Normalize tokens
  }));

  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-gray-500',
    busy: 'bg-yellow-500'
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 bg-opacity-20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Agent Performance</h2>
            <p className="text-sm text-gray-400">AI agents activity and metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-400">{agents.filter(a => a.status === 'active').length} active</span>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.name;
          
          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAgent(isSelected ? null : agent.name)}
              className={`p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{agent.name}</h4>
                    <p className="text-xs text-gray-400">{agent.lastActive}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]} ${
                  agent.status === 'active' ? 'animate-pulse' : ''
                }`} />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Tasks</p>
                  <p className="text-lg font-semibold text-white">{agent.tasks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="text-lg font-semibold text-green-400">{agent.successRate}%</p>
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-700/50"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tokens Used:</span>
                      <span className="text-gray-300">{agent.tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Avg Duration:</span>
                      <span className="text-gray-300">{(agent.avgDuration / 1000).toFixed(1)}s</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Performance Radar Chart */}
      <div className="h-64 bg-gray-800/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Overall Performance</h3>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
              dataKey="agent" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Radar
              name="Performance"
              dataKey="performance"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
            <Radar
              name="Efficiency"
              dataKey="efficiency"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}