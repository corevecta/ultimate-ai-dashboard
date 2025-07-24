'use client';

import React from 'react';
import Link from 'next/link';

const dataFeatures = [
  {
    title: 'Database Migrations',
    description: 'Schema versioning and automated migration management',
    href: '/data/migrations',
    stats: { pending: 3, applied: 127, rollbacks: 2 },
    lastRun: '2 days ago',
  },
  {
    title: 'Backup Management',
    description: 'Automated backups with point-in-time recovery',
    href: '/data/backups',
    stats: { daily: 30, weekly: 12, monthly: 6 },
    nextBackup: 'in 4 hours',
    storage: '2.3 TB',
  },
  {
    title: 'Data Replication',
    description: 'Multi-region data replication and synchronization',
    href: '/data/replication',
    regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    lag: '< 100ms',
    status: 'healthy',
  },
  {
    title: 'ETL Pipelines',
    description: 'Extract, transform, and load data workflows',
    href: '/data/etl',
    pipelines: { active: 23, scheduled: 45, failed: 2 },
    processedToday: '1.2 TB',
  },
  {
    title: 'Cache Management',
    description: 'Redis cache optimization and monitoring',
    href: '/data/cache',
    hitRate: 94.5,
    memory: { used: 8.2, total: 16 },
    keys: 234567,
  },
  {
    title: 'Data Privacy',
    description: 'PII detection, encryption, and compliance',
    href: '/data/privacy',
    piiDetected: 1234,
    encrypted: 100,
    anonymized: 5678,
  },
  {
    title: 'Query Optimization',
    description: 'Performance tuning and query analysis',
    href: '/data/optimization',
    slowQueries: 12,
    optimized: 234,
    avgImprovement: '78%',
  },
  {
    title: 'Data Archival',
    description: 'Long-term storage and lifecycle management',
    href: '/data/archival',
    archived: '45 TB',
    policies: 12,
    costSaving: '$2,345/month',
  },
];

export default function DataPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Data Management Platform</h1>
        <p className="text-lg text-gray-600">
          Comprehensive data lifecycle management, from storage to analytics
        </p>
      </div>

      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Storage</h3>
          <p className="text-3xl font-bold mt-2">127 TB</p>
          <p className="text-sm text-blue-600 mt-1">82% utilized</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Databases</h3>
          <p className="text-3xl font-bold mt-2">24</p>
          <p className="text-sm text-green-600 mt-1">All healthy</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Cache Hit Rate</h3>
          <p className="text-3xl font-bold mt-2">94.5%</p>
          <p className="text-sm text-green-600 mt-1">Above target</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Backup Status</h3>
          <p className="text-3xl font-bold mt-2">100%</p>
          <p className="text-sm text-green-600 mt-1">All successful</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Compliance</h3>
          <p className="text-3xl font-bold mt-2">GDPR</p>
          <p className="text-sm text-green-600 mt-1">Compliant</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {feature.stats && (
              <div className="space-y-1 text-sm">
                {Object.entries(feature.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {feature.regions && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Replication Regions:</div>
                <div className="flex flex-wrap gap-2">
                  {feature.regions.map(region => (
                    <span key={region} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {region}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Lag: {feature.lag}</div>
              </div>
            )}
            
            {feature.hitRate && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Hit Rate:</span>
                  <span className="font-bold text-green-600">{feature.hitRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: `${feature.hitRate}%`}} />
                </div>
                <div className="text-sm text-gray-600">
                  {feature.keys.toLocaleString()} keys • {feature.memory.used}GB/{feature.memory.total}GB
                </div>
              </div>
            )}
            
            {feature.pipelines && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-bold">{feature.pipelines.active}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-bold">{feature.pipelines.scheduled}</div>
                  <div className="text-xs text-gray-500">Scheduled</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold">{feature.pipelines.failed}</div>
                  <div className="text-xs text-gray-500">Failed</div>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Data Analytics */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Real-time Analytics Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Queries/sec</h3>
            <p className="text-3xl font-bold">12,456</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Avg Response</h3>
            <p className="text-3xl font-bold">23ms</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Data Processed</h3>
            <p className="text-3xl font-bold">45TB</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Active Streams</h3>
            <p className="text-3xl font-bold">234</p>
          </div>
        </div>
      </div>
    </div>
  );
}