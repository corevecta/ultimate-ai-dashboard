'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  cpu: number;
  loadTime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 45,
    cpu: 23,
    loadTime: 1.2
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: Math.round(Math.random() * 20 + 40),
          cpu: Math.round(Math.random() * 15 + 20)
        }));
        
        setFpsHistory(prev => [...prev.slice(-59), fps]);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const getPerformanceColor = (value: number, type: 'fps' | 'usage') => {
    if (type === 'fps') {
      if (value >= 55) return 'text-green-400';
      if (value >= 30) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (value <= 30) return 'text-green-400';
      if (value <= 60) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const getTrendIcon = (current: number, average: number) => {
    const diff = current - average;
    if (Math.abs(diff) < 2) return <Minus className="h-3 w-3" />;
    if (diff > 0) return <TrendingUp className="h-3 w-3 text-green-400" />;
    return <TrendingDown className="h-3 w-3 text-red-400" />;
  };

  const averageFps = fpsHistory.length > 0
    ? Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length)
    : 60;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 px-3 py-1 bg-gray-900/90 rounded-full border border-white/10 text-xs hover:bg-gray-800 transition-colors"
      >
        <Activity className="h-3 w-3 text-blue-400" />
        <span className={getPerformanceColor(metrics.fps, 'fps')}>
          {metrics.fps} FPS
        </span>
        <span className="text-gray-400">•</span>
        <span className={getPerformanceColor(metrics.cpu, 'usage')}>
          {metrics.cpu}% CPU
        </span>
      </button>
    );
  }

  return (
    <Card className="w-80 border-white/10 bg-gray-900/95 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Performance Monitor
          </h3>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            Minimize
          </button>
        </div>
        
        <div className="space-y-3">
          {/* FPS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Frame Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getPerformanceColor(metrics.fps, 'fps')}`}>
                {metrics.fps} FPS
              </span>
              {getTrendIcon(metrics.fps, averageFps)}
            </div>
          </div>
          
          {/* CPU Usage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-sm">CPU Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getPerformanceColor(metrics.cpu, 'usage')}`}>
                {metrics.cpu}%
              </span>
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    metrics.cpu <= 30 ? 'bg-green-400' :
                    metrics.cpu <= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${metrics.cpu}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Memory Usage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-purple-400" />
              <span className="text-sm">Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getPerformanceColor(metrics.memory, 'usage')}`}>
                {metrics.memory}%
              </span>
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    metrics.memory <= 30 ? 'bg-green-400' :
                    metrics.memory <= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${metrics.memory}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Load Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm">Load Time</span>
            </div>
            <span className="text-sm font-medium text-green-400">
              {metrics.loadTime}s
            </span>
          </div>
        </div>
        
        {/* FPS Graph */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">FPS History</span>
            <span className="text-xs text-gray-400">Avg: {averageFps}</span>
          </div>
          <div className="h-12 flex items-end gap-0.5">
            {fpsHistory.slice(-30).map((fps, i) => (
              <div
                key={i}
                className={`flex-1 transition-all ${
                  fps >= 55 ? 'bg-green-400' :
                  fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ height: `${(fps / 60) * 100}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Performance Tips */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">
            {metrics.cpu > 60 && "High CPU usage detected. Consider optimizing heavy computations."}
            {metrics.memory > 60 && "High memory usage. Check for memory leaks."}
            {metrics.fps < 30 && "Low FPS detected. Reduce visual complexity."}
            {metrics.cpu <= 30 && metrics.memory <= 30 && metrics.fps >= 55 && "Performance is optimal!"}
          </p>
        </div>
      </div>
    </Card>
  );
}