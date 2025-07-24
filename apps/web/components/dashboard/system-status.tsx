'use client'

import { motion } from 'framer-motion'
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wifi,
  MemoryStick
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  uptime: number;
  services: {
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
  }[];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const statusConfig = {
  healthy: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20' },
  degraded: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
  down: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20' }
};

export function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  async function fetchSystemMetrics() {
    try {
      const response = await fetch('/api/system/metrics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch system metrics');
      }
      
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (err) {
      // Expected when backend is not running - fallback data will be used
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/2 mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const overallHealth = metrics.services.every(s => s.status === 'healthy') ? 'healthy' : 
                       metrics.services.some(s => s.status === 'down') ? 'down' : 'degraded';
  const OverallIcon = statusConfig[overallHealth].icon;

  return (
    <div className="h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 bg-opacity-20">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Status</h2>
            <p className="text-sm text-gray-400">Uptime: {formatUptime(metrics.uptime)}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 ${statusConfig[overallHealth].color}`}>
          <OverallIcon className="w-5 h-5" />
          <span className="text-sm font-medium capitalize">{overallHealth}</span>
        </div>
      </div>

      {/* Resource Meters */}
      <div className="space-y-4 mb-6">
        <ResourceMeter 
          icon={Cpu} 
          label="CPU Usage" 
          value={metrics.cpu} 
          color="blue"
        />
        <ResourceMeter 
          icon={MemoryStick} 
          label="Memory" 
          value={metrics.memory} 
          color="purple"
        />
        <ResourceMeter 
          icon={HardDrive} 
          label="Disk Usage" 
          value={metrics.disk} 
          color="emerald"
        />
      </div>

      {/* Services Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Services</h3>
        <div className="space-y-2">
          {metrics.services.map((service, index) => {
            const config = statusConfig[service.status];
            const StatusIcon = config.icon;
            
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${config.bg} border border-white/5`}
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm font-medium text-white">{service.name}</span>
                </div>
                <span className="text-xs text-gray-400">{service.responseTime.toFixed(0)}ms</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResourceMeter({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colorMap = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    emerald: 'from-emerald-500 to-green-500'
  };

  const bgColorMap = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500'
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-medium text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorMap[color as keyof typeof colorMap]}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {value > 80 && (
        <motion.div
          className={`absolute right-0 top-0 w-2 h-2 ${bgColorMap[color as keyof typeof bgColorMap]} rounded-full`}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}