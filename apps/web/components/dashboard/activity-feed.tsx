'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  PlayCircle,
  GitBranch,
  Zap,
  Bot,
  Package,
  Shield,
  Database,
  Code,
  Activity
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface ActivityItem {
  id: string;
  type: 'pipeline' | 'agent' | 'system' | 'error' | 'deployment';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'error' | 'warning' | 'info';
  metadata?: {
    duration?: number;
    tokens?: number;
    phase?: string;
  };
}

const typeConfig = {
  pipeline: { icon: GitBranch, color: 'text-blue-500', bg: 'bg-blue-500/20' },
  agent: { icon: Bot, color: 'text-purple-500', bg: 'bg-purple-500/20' },
  system: { icon: Shield, color: 'text-cyan-500', bg: 'bg-cyan-500/20' },
  error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
  deployment: { icon: Package, color: 'text-green-500', bg: 'bg-green-500/20' }
};

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-green-500' },
  error: { icon: XCircle, color: 'text-red-500' },
  warning: { icon: AlertCircle, color: 'text-yellow-500' },
  info: { icon: Zap, color: 'text-blue-500' }
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

// Simulate real-time activity
function generateMockActivity(): ActivityItem {
  const types: ActivityItem['type'][] = ['pipeline', 'agent', 'system', 'error', 'deployment'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const activities = {
    pipeline: [
      { title: 'Pipeline started', description: 'Web application generation initiated', status: 'info' as const },
      { title: 'Phase completed', description: 'UI/UX Design phase finished successfully', status: 'success' as const },
      { title: 'Pipeline completed', description: 'All phases executed successfully', status: 'success' as const }
    ],
    agent: [
      { title: 'Agent task started', description: 'Code Review Agent analyzing implementation', status: 'info' as const },
      { title: 'Agent completed', description: 'Security Agent found no vulnerabilities', status: 'success' as const },
      { title: 'Agent warning', description: 'QA Agent suggests additional test coverage', status: 'warning' as const }
    ],
    system: [
      { title: 'System update', description: 'Orchestrator configuration updated', status: 'info' as const },
      { title: 'Resource optimization', description: 'Memory usage reduced by 15%', status: 'success' as const },
      { title: 'Service restarted', description: 'Task Queue service restarted successfully', status: 'info' as const }
    ],
    error: [
      { title: 'Pipeline error', description: 'Failed to execute deployment phase', status: 'error' as const },
      { title: 'Agent error', description: 'Code Review Agent encountered an exception', status: 'error' as const },
      { title: 'System error', description: 'Memory limit exceeded in task queue', status: 'error' as const }
    ],
    deployment: [
      { title: 'Deployment started', description: 'Deploying to production environment', status: 'info' as const },
      { title: 'Deployment successful', description: 'Application deployed to Vercel', status: 'success' as const },
      { title: 'Rollback initiated', description: 'Rolling back to previous version', status: 'warning' as const }
    ]
  };
  
  const activitySet = activities[type] || activities.pipeline;
  const activity = activitySet[Math.floor(Math.random() * activitySet.length)];
  
  return {
    id: `activity-${Date.now()}-${Math.random()}`,
    type,
    ...activity,
    timestamp: new Date(),
    metadata: {
      duration: Math.floor(Math.random() * 10000),
      tokens: type === 'agent' ? Math.floor(Math.random() * 5000) : undefined,
      phase: type === 'pipeline' ? `Phase ${Math.floor(Math.random() * 8) + 1}` : undefined
    }
  };
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initialize with some activities
    const initial = Array.from({ length: 5 }, () => generateMockActivity());
    setActivities(initial);

    // Simulate real-time updates
    if (isLive) {
      const interval = setInterval(() => {
        const newActivity = generateMockActivity();
        setActivities(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20
      }, 5000 + Math.random() * 10000); // Random interval 5-15s

      return () => clearInterval(interval);
    }
  }, [isLive]);

  return (
    <div className="h-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 bg-opacity-20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Activity Feed</h2>
            <p className="text-sm text-gray-400">Real-time system events</p>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
            isLive 
              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => {
            const TypeIcon = typeConfig[activity.type].icon;
            const StatusIcon = activity.status ? statusConfig[activity.status].icon : null;
            
            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="flex gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${typeConfig[activity.type].bg} shrink-0`}>
                    <TypeIcon className={`w-4 h-4 ${typeConfig[activity.type].color}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white flex items-center gap-2">
                          {activity.title}
                          {StatusIcon && (
                            <StatusIcon className={`w-4 h-4 ${statusConfig[activity.status!].color}`} />
                          )}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                        
                        {/* Metadata */}
                        {activity.metadata && (
                          <div className="flex items-center gap-3 mt-2">
                            {activity.metadata.duration && (
                              <span className="text-xs text-gray-500">
                                <Zap className="w-3 h-3 inline mr-1" />
                                {(activity.metadata.duration / 1000).toFixed(1)}s
                              </span>
                            )}
                            {activity.metadata.tokens && (
                              <span className="text-xs text-gray-500">
                                <Code className="w-3 h-3 inline mr-1" />
                                {activity.metadata.tokens.toLocaleString()} tokens
                              </span>
                            )}
                            {activity.metadata.phase && (
                              <span className="text-xs text-gray-500">
                                <Database className="w-3 h-3 inline mr-1" />
                                {activity.metadata.phase}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Timeline connector */}
                {index < activities.length - 1 && (
                  <div className="absolute left-7 top-12 bottom-0 w-px bg-gray-700/50" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}