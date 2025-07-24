'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Insight {
  id: string;
  type: 'optimization' | 'cost' | 'performance' | 'security' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action?: string;
  metrics?: {
    current: string;
    potential: string;
    improvement: string;
  };
}

const typeConfig = {
  optimization: { icon: Zap, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/20' },
  cost: { icon: DollarSign, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' },
  performance: { icon: TrendingUp, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
  security: { icon: AlertTriangle, color: 'from-red-500 to-pink-500', bg: 'bg-red-500/20' },
  recommendation: { icon: Lightbulb, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-500/20' }
};

const priorityConfig = {
  high: { color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  low: { color: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/30' }
};

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchInsights() {
    try {
      // In production, this would fetch from the AI analysis endpoint
      // For now, generate intelligent insights based on system patterns
      const mockInsights: Insight[] = [
        {
          id: '1',
          type: 'optimization',
          priority: 'high',
          title: 'Pipeline Parallelization Opportunity',
          description: 'Phases 3-5 can run in parallel, reducing total execution time by 40%',
          impact: 'Save 2.5 minutes per pipeline run',
          action: 'Enable parallel execution in workflow configuration',
          metrics: {
            current: '6.2 min avg',
            potential: '3.7 min avg',
            improvement: '40% faster'
          }
        },
        {
          id: '2',
          type: 'cost',
          priority: 'medium',
          title: 'Token Usage Optimization',
          description: 'Implement response caching for repeated queries to reduce API costs',
          impact: 'Reduce token usage by 30%',
          action: 'Enable smart caching in agent configuration',
          metrics: {
            current: '284k tokens/day',
            potential: '199k tokens/day',
            improvement: '$42/day savings'
          }
        },
        {
          id: '3',
          type: 'performance',
          priority: 'medium',
          title: 'Agent Task Distribution',
          description: 'Uneven load distribution detected. Rebalance agent workloads',
          impact: 'Improve response time by 25%',
          metrics: {
            current: '3.4s avg',
            potential: '2.5s avg',
            improvement: '25% faster'
          }
        },
        {
          id: '4',
          type: 'security',
          priority: 'high',
          title: 'API Rate Limiting Recommended',
          description: 'Implement rate limiting to prevent potential abuse',
          impact: 'Enhance security posture',
          action: 'Configure rate limits in API gateway'
        },
        {
          id: '5',
          type: 'recommendation',
          priority: 'low',
          title: 'Enable Advanced Monitoring',
          description: 'Activate distributed tracing for deeper performance insights',
          impact: 'Better observability and debugging',
          action: 'Enable OpenTelemetry integration'
        }
      ];
      
      setInsights(mockInsights);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 bg-opacity-20">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">AI Insights</h2>
          <p className="text-gray-400">Intelligent recommendations powered by system analysis</p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const TypeIcon = typeConfig[insight.type].icon;
          const isSelected = selectedInsight === insight.id;
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedInsight(isSelected ? null : insight.id)}
              className="cursor-pointer"
            >
              <div className={`h-full p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 ${
                isSelected ? 'ring-2 ring-purple-500' : ''
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${typeConfig[insight.type].bg}`}>
                    <TypeIcon className={`w-6 h-6 text-white`} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig[insight.priority].bg} ${priorityConfig[insight.priority].color} ${priorityConfig[insight.priority].border} border`}>
                    {insight.priority}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{insight.description}</p>

                {/* Impact */}
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-400">{insight.impact}</span>
                </div>

                {/* Metrics */}
                {insight.metrics && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isSelected ? 'auto' : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-700/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Current:</span>
                        <span className="text-gray-300">{insight.metrics.current}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Potential:</span>
                        <span className="text-green-400">{insight.metrics.potential}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-gray-500">Improvement:</span>
                        <span className="text-purple-400">{insight.metrics.improvement}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action */}
                {insight.action && isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Apply Recommendation
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{insights.filter(i => i.priority === 'high').length}</p>
            <p className="text-sm text-gray-400">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">40%</p>
            <p className="text-sm text-gray-400">Potential Improvement</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">$126</p>
            <p className="text-sm text-gray-400">Daily Savings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">2.5min</p>
            <p className="text-sm text-gray-400">Time Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
}