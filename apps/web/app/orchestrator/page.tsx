'use client';

import React from 'react';
import Link from 'next/link';

// All Orchestrator features with their current status
const orchestratorFeatures = [
  {
    title: 'DAG Workflow Engine',
    description: 'Enhanced Orchestrator V2 with directed acyclic graph execution',
    href: '/orchestrator/dag',
    status: 'active',
    metrics: { workflows: 1234, executions: 45678, successRate: 98.5 },
  },
  {
    title: 'Distributed Task Queue',
    description: 'Redis-based distributed task execution system',
    href: '/orchestrator/tasks',
    status: 'active',
    metrics: { pending: 234, processing: 12, completed: 98765 },
  },
  {
    title: 'Brand Guidelines Engine',
    description: 'Automated brand compliance checking and enforcement',
    href: '/orchestrator/brand',
    status: 'beta',
    metrics: { rules: 156, violations: 23, compliance: 94.2 },
  },
  {
    title: 'Dynamic Prompt Engine',
    description: 'Intelligent prompt generation and optimization',
    href: '/orchestrator/prompts',
    status: 'active',
    metrics: { templates: 789, optimizations: 2345, improvement: 23.4 },
  },
  {
    title: 'Plugin Architecture',
    description: 'Dynamic plugin loading and management system',
    href: '/plugins',
    status: 'active',
    metrics: { installed: 45, active: 38, community: 234 },
  },
  {
    title: 'n8n Integration',
    description: 'External workflow automation integration',
    href: '/orchestrator/n8n',
    status: 'experimental',
    metrics: { workflows: 67, nodes: 1234, automations: 89 },
  },
  {
    title: 'GitHub Integration',
    description: 'Full repository and PR management',
    href: '/orchestrator/github',
    status: 'active',
    metrics: { repos: 34, prs: 567, actions: 890 },
  },
  {
    title: 'CI/CD Pipeline Engine',
    description: 'Automated deployment pipeline orchestration',
    href: '/deployments/cicd',
    status: 'active',
    metrics: { pipelines: 123, deployments: 4567, success: 96.8 },
  },
];

export default function OrchestratorPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Enhanced Orchestrator V2</h1>
        <p className="text-lg text-gray-600">
          The powerful backbone of our AI platform - orchestrating complex workflows, managing distributed tasks, and ensuring seamless integration
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Workflows</h3>
          <p className="text-3xl font-bold mt-2">12,456</p>
          <p className="text-sm text-green-600 mt-1">+23% from last month</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Tasks</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
          <p className="text-sm text-blue-600 mt-1">Processing now</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-3xl font-bold mt-2">98.7%</p>
          <p className="text-sm text-green-600 mt-1">Above target</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Avg Execution Time</h3>
          <p className="text-3xl font-bold mt-2">2.3s</p>
          <p className="text-sm text-yellow-600 mt-1">-15% improvement</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orchestratorFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                feature.status === 'active' ? 'bg-green-100 text-green-800' :
                feature.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {feature.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(feature.metrics).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-500 capitalize">{key}:</span>
                  <span className="ml-1 font-medium">
                    {typeof value === 'number' && value > 100 
                      ? value.toLocaleString() 
                      : value}
                    {key.includes('Rate') || key.includes('compliance') || key.includes('improvement') || key.includes('success') ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Architecture Overview */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Core Engine</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• TypeScript-based orchestration</li>
              <li>• Event-driven architecture</li>
              <li>• Horizontal scaling support</li>
              <li>• Real-time monitoring</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Integrations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 50+ platform connectors</li>
              <li>• REST & GraphQL APIs</li>
              <li>• Webhook support</li>
              <li>• Custom plugin SDK</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Intelligence</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI-powered optimization</li>
              <li>• Pattern learning</li>
              <li>• Predictive scaling</li>
              <li>• Smart error recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}