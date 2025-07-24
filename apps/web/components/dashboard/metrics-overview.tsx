'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  Zap, 
  Globe,
  BarChart3,
  Bot
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface DashboardMetrics {
  pipeline: {
    totalRuns: number;
    successRate: number;
    avgDuration: number;
  };
  agents: {
    totalTasks: number;
    totalTokens: number;
    avgDuration: number;
  };
  system?: {
    activeConnections?: number;
  };
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function generateSparkline(trend: 'up' | 'down' | 'stable'): number[] {
  const base = trend === 'up' ? 30 : trend === 'down' ? 70 : 50;
  const points = [];
  for (let i = 0; i < 10; i++) {
    const variance = Math.random() * 20 - 10;
    const trendEffect = trend === 'up' ? i * 6 : trend === 'down' ? -i * 3 : 0;
    points.push(Math.max(0, Math.min(100, base + variance + trendEffect)));
  }
  return points;
}

export function MetricsOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const response = await fetch('/api/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      
      const data = await response.json();
      
      setMetrics({
        pipeline: data.pipeline,
        agents: data.agents,
        system: data.system
      });
      setLoading(false);
    } catch (err) {
      // Expected when backend is not running
      setError('Failed to fetch metrics');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-900/80 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-red-500 text-center py-8">
        {error || 'No metrics available'}
      </div>
    );
  }

  const metricsDisplay = [
    {
      label: 'Pipeline Runs',
      value: metrics.pipeline.totalRuns.toLocaleString(),
      change: '+12.5%', // TODO: Calculate from historical data
      trend: 'up' as const,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      glow: 'blue',
      sparkline: generateSparkline('up')
    },
    {
      label: 'Success Rate',
      value: `${metrics.pipeline.successRate}%`,
      change: '+2.1%',
      trend: 'up' as const,
      icon: BarChart3,
      color: 'from-emerald-500 to-green-500',
      glow: 'emerald',
      sparkline: generateSparkline('up')
    },
    {
      label: 'Avg Duration',
      value: formatDuration(metrics.pipeline.avgDuration),
      change: '-0.8s',
      trend: 'down' as const,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      glow: 'purple',
      sparkline: generateSparkline('down')
    },
    {
      label: 'Active Agents',
      value: (metrics.agents as any).activeAgents?.toString() || '12',
      change: '+3',
      trend: 'up' as const,
      icon: Bot,
      color: 'from-orange-500 to-red-500',
      glow: 'orange',
      sparkline: generateSparkline('up')
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsDisplay.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative group"
        >
          {/* Glow effect */}
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${metric.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
          />
          
          {/* Card */}
          <div className="relative h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
            {/* Background pattern */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <svg className="absolute inset-0 w-full h-full opacity-5">
                <pattern id={`pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-green-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">{metric.label}</h3>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
              </div>

              {/* Sparkline */}
              <div className="h-12 flex items-end gap-1">
                {metric.sparkline.map((value, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 bg-gradient-to-t ${metric.color} rounded-t opacity-60`}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: index * 0.1 + i * 0.02 }}
                  />
                ))}
              </div>
            </div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0"
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}