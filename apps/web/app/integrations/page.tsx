'use client';

import React from 'react';
import Link from 'next/link';

const integrationFeatures = [
  {
    title: 'API Gateway',
    description: 'Unified API management with rate limiting and authentication',
    href: '/integrations/gateway',
    stats: { endpoints: 234, requests: '12M/day', latency: '23ms' },
    uptime: 99.99,
  },
  {
    title: 'Webhook Management',
    description: 'Configure and monitor webhook endpoints',
    href: '/integrations/webhooks',
    webhooks: { active: 45, pending: 3, failed: 2 },
    deliveryRate: 98.7,
  },
  {
    title: 'GraphQL API',
    description: 'Modern GraphQL API with subscriptions and federation',
    href: '/integrations/graphql',
    schemas: 12,
    queries: 234,
    mutations: 89,
    subscriptions: 34,
  },
  {
    title: 'Event Bus',
    description: 'Event-driven architecture with pub/sub messaging',
    href: '/integrations/events',
    topics: 67,
    subscribers: 234,
    messagesPerSec: 12345,
  },
  {
    title: 'Message Queue',
    description: 'Async message processing with dead letter queues',
    href: '/integrations/queue',
    queues: 23,
    pending: 1234,
    processing: 89,
    dlq: 12,
  },
  {
    title: 'OAuth & SAML',
    description: 'Enterprise authentication and SSO integration',
    href: '/integrations/auth',
    providers: ['Google', 'GitHub', 'Okta', 'Auth0', 'Azure AD'],
    activeUsers: 1234,
  },
  {
    title: 'WebSocket Support',
    description: 'Real-time bidirectional communication',
    href: '/integrations/websocket',
    connections: 456,
    channels: 23,
    bandwidth: '1.2 GB/s',
  },
  {
    title: 'External API Connectors',
    description: 'Pre-built integrations with popular services',
    href: '/integrations/connectors',
    connectors: 89,
    categories: ['CRM', 'Analytics', 'Payment', 'Communication'],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Integration Platform</h1>
        <p className="text-lg text-gray-600">
          Connect your applications with powerful APIs and event-driven architecture
        </p>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total APIs</h3>
          <p className="text-3xl font-bold mt-2">456</p>
          <p className="text-sm text-green-600 mt-1">+23 this week</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Requests/Day</h3>
          <p className="text-3xl font-bold mt-2">12M</p>
          <p className="text-sm text-blue-600 mt-1">99.99% success</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Webhooks</h3>
          <p className="text-3xl font-bold mt-2">45</p>
          <p className="text-sm text-green-600 mt-1">98.7% delivery</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">WebSocket Connections</h3>
          <p className="text-3xl font-bold mt-2">456</p>
          <p className="text-sm text-purple-600 mt-1">Real-time active</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {feature.stats && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Endpoints:</span>
                  <span className="font-medium">{feature.stats.endpoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requests:</span>
                  <span className="font-medium">{feature.stats.requests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Latency:</span>
                  <span className="font-medium text-green-600">{feature.stats.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Uptime:</span>
                  <span className="font-medium text-green-600">{feature.uptime}%</span>
                </div>
              </div>
            )}
            
            {feature.webhooks && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-bold">{feature.webhooks.active}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-bold">{feature.webhooks.pending}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-bold">{feature.webhooks.failed}</div>
                  <div className="text-xs text-gray-500">Failed</div>
                </div>
              </div>
            )}
            
            {feature.schemas && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Schemas:</span>
                  <span className="ml-1 font-medium">{feature.schemas}</span>
                </div>
                <div>
                  <span className="text-gray-500">Queries:</span>
                  <span className="ml-1 font-medium">{feature.queries}</span>
                </div>
                <div>
                  <span className="text-gray-500">Mutations:</span>
                  <span className="ml-1 font-medium">{feature.mutations}</span>
                </div>
                <div>
                  <span className="text-gray-500">Subscriptions:</span>
                  <span className="ml-1 font-medium">{feature.subscriptions}</span>
                </div>
              </div>
            )}
            
            {feature.providers && (
              <div className="space-y-2">
                <div className="text-sm font-medium">SSO Providers:</div>
                <div className="flex flex-wrap gap-2">
                  {feature.providers.map(provider => (
                    <span key={provider} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {provider}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">{feature.activeUsers} active users</div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* API Versioning */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">API Versioning Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-green-600">v3 (Current)</h3>
            <p className="text-sm text-gray-600 mb-3">Latest stable version</p>
            <ul className="space-y-1 text-sm">
              <li>• 89% adoption</li>
              <li>• Full feature set</li>
              <li>• Active development</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-yellow-600">v2 (Deprecated)</h3>
            <p className="text-sm text-gray-600 mb-3">Maintenance mode</p>
            <ul className="space-y-1 text-sm">
              <li>• 10% usage</li>
              <li>• Security updates only</li>
              <li>• EOL: Dec 2024</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-600">v4 (Beta)</h3>
            <p className="text-sm text-gray-600 mb-3">Next generation</p>
            <ul className="space-y-1 text-sm">
              <li>• 1% early adopters</li>
              <li>• GraphQL-first</li>
              <li>• Release: Q2 2024</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}