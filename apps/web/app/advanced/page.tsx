'use client';

import React from 'react';
import Link from 'next/link';

const advancedFeatures = [
  {
    title: 'Smart Cache System',
    description: 'AI-powered intelligent caching with predictive preloading',
    href: '/advanced/cache',
    metrics: {
      hitRate: 94.5,
      missRate: 5.5,
      evictionRate: 12.3,
      avgTTL: '45 min',
    },
    savings: {
      latency: '-78%',
      bandwidth: '-65%',
      cost: '$3,456/month',
    },
  },
  {
    title: 'Context-Aware Retry',
    description: 'Intelligent retry mechanisms with exponential backoff',
    href: '/advanced/retry',
    strategies: ['exponential', 'linear', 'fibonacci', 'custom'],
    stats: {
      totalRetries: 12345,
      successfulRecovery: 11234,
      avgAttempts: 2.3,
    },
  },
  {
    title: 'Circuit Breaker',
    description: 'Prevent cascade failures with intelligent circuit breaking',
    href: '/advanced/circuit-breaker',
    circuits: {
      total: 45,
      open: 2,
      halfOpen: 3,
      closed: 40,
    },
    prevented: 234,
  },
  {
    title: 'Rate Limiting',
    description: 'Adaptive rate limiting with token bucket algorithm',
    href: '/advanced/rate-limit',
    limits: {
      api: '1000/hour',
      user: '100/hour',
      ip: '500/hour',
    },
    violations: 234,
  },
  {
    title: 'Request Deduplication',
    description: 'Eliminate duplicate requests with smart fingerprinting',
    href: '/advanced/dedup',
    stats: {
      duplicatesDetected: 23456,
      bandwidthSaved: '1.2 TB',
      costSaved: '$456',
    },
  },
  {
    title: 'Error Recovery',
    description: 'Multi-strategy error recovery with fallback mechanisms',
    href: '/advanced/recovery',
    strategies: 12,
    recoveryRate: 89.5,
    avgRecoveryTime: '230ms',
  },
  {
    title: 'Checkpoint Manager',
    description: 'State persistence and recovery for long-running processes',
    href: '/advanced/checkpoint',
    checkpoints: 1234,
    restored: 89,
    storageUsed: '2.3 GB',
  },
  {
    title: 'Resource Optimization',
    description: 'AI-driven resource allocation and optimization',
    href: '/advanced/optimization',
    optimization: {
      cpu: '-23%',
      memory: '-34%',
      cost: '-$2,345/month',
    },
  },
];

export default function AdvancedPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Advanced Features</h1>
        <p className="text-lg text-gray-600">
          Cutting-edge capabilities for performance, reliability, and efficiency
        </p>
      </div>

      {/* Performance Impact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Latency Reduction</h3>
          <p className="text-3xl font-bold mt-2 text-green-900">-67%</p>
          <p className="text-sm text-green-700 mt-1">Average improvement</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Error Rate</h3>
          <p className="text-3xl font-bold mt-2 text-blue-900">-89%</p>
          <p className="text-sm text-blue-700 mt-1">Reduction in failures</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Cost Savings</h3>
          <p className="text-3xl font-bold mt-2 text-purple-900">$12.5k</p>
          <p className="text-sm text-purple-700 mt-1">Monthly savings</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <h3 className="text-sm font-medium text-orange-800">Efficiency Gain</h3>
          <p className="text-3xl font-bold mt-2 text-orange-900">+234%</p>
          <p className="text-sm text-orange-700 mt-1">Processing efficiency</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advancedFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {feature.metrics && (
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                {Object.entries(feature.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {feature.savings && (
              <div className="bg-green-50 rounded p-3">
                <div className="text-sm font-medium text-green-800 mb-1">Impact:</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(feature.savings).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-600 capitalize">{key}</div>
                      <div className="font-bold text-green-700">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {feature.circuits && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-bold">{feature.circuits.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{feature.circuits.closed}</div>
                    <div className="text-xs text-gray-500">Closed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-600">{feature.circuits.halfOpen}</div>
                    <div className="text-xs text-gray-500">Half-open</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-red-600">{feature.circuits.open}</div>
                    <div className="text-xs text-gray-500">Open</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Prevented {feature.prevented} cascade failures
                </div>
              </div>
            )}
            
            {feature.strategies && Array.isArray(feature.strategies) && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Available Strategies:</div>
                <div className="flex flex-wrap gap-2">
                  {feature.strategies.map((strategy: string) => (
                    <span key={strategy} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {strategy}
                    </span>
                  ))}
                </div>
                {feature.stats && (
                  <div className="text-sm text-gray-600 mt-2">
                    Recovery rate: {(feature.stats.successfulRecovery / feature.stats.totalRetries * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Technology Stack */}
      <div className="mt-12 bg-gray-900 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Powered By Advanced Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🧠</div>
            <h3 className="font-semibold">Machine Learning</h3>
            <p className="text-sm text-gray-400 mt-1">Predictive optimization</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold">Edge Computing</h3>
            <p className="text-sm text-gray-400 mt-1">Ultra-low latency</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔄</div>
            <h3 className="font-semibold">Event Sourcing</h3>
            <p className="text-sm text-gray-400 mt-1">Complete audit trail</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🌐</div>
            <h3 className="font-semibold">Distributed Systems</h3>
            <p className="text-sm text-gray-400 mt-1">Global scalability</p>
          </div>
        </div>
      </div>
    </div>
  );
}