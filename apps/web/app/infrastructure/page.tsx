'use client';

import React from 'react';
import Link from 'next/link';

const infrastructureFeatures = [
  {
    title: 'Infrastructure as Code',
    description: 'Generate Terraform, CloudFormation, and Kubernetes manifests',
    href: '/infrastructure/iac',
    templates: { terraform: 45, cloudformation: 32, k8s: 28, ansible: 15 },
  },
  {
    title: 'Cost Estimation',
    description: 'Predict and optimize cloud infrastructure costs',
    href: '/infrastructure/cost',
    monthlyCost: 12456.78,
    savings: 2345.00,
    optimization: 18.2,
  },
  {
    title: 'Auto-scaling Configuration',
    description: 'Dynamic resource scaling based on demand',
    href: '/infrastructure/scaling',
    rules: 23,
    currentScale: { min: 2, current: 8, max: 20 },
    efficiency: 94,
  },
  {
    title: 'Load Balancer Management',
    description: 'Intelligent traffic distribution and failover',
    href: '/infrastructure/loadbalancer',
    balancers: 12,
    healthyTargets: 45,
    requestsPerSec: 12345,
  },
  {
    title: 'Resource Optimization',
    description: 'AI-powered resource allocation and optimization',
    href: '/infrastructure/optimization',
    cpuUtilization: 67,
    memoryUtilization: 72,
    recommendations: 15,
  },
  {
    title: 'Circuit Breaker',
    description: 'Fault tolerance and cascade failure prevention',
    href: '/advanced/circuit-breaker',
    circuits: 34,
    open: 2,
    halfOpen: 1,
    closed: 31,
  },
];

export default function InfrastructurePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Infrastructure Management</h1>
        <p className="text-lg text-gray-600">
          Manage your cloud infrastructure with code, optimize costs, and ensure high availability
        </p>
      </div>

      {/* Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Resources</h3>
          <p className="text-3xl font-bold mt-2">234</p>
          <p className="text-sm text-green-600 mt-1">All healthy</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Monthly Cost</h3>
          <p className="text-3xl font-bold mt-2">$12.5k</p>
          <p className="text-sm text-green-600 mt-1">-15% from last month</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Availability</h3>
          <p className="text-3xl font-bold mt-2">99.99%</p>
          <p className="text-sm text-blue-600 mt-1">Above SLA</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Auto-scaling</h3>
          <p className="text-3xl font-bold mt-2">Active</p>
          <p className="text-sm text-green-600 mt-1">8/20 instances</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">IaC Coverage</h3>
          <p className="text-3xl font-bold mt-2">92%</p>
          <p className="text-sm text-yellow-600 mt-1">15 resources manual</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infrastructureFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {feature.templates && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(feature.templates).map(([type, count]) => (
                  <div key={type}>
                    <span className="text-gray-500 capitalize">{type}:</span>
                    <span className="ml-1 font-medium">{count} templates</span>
                  </div>
                ))}
              </div>
            )}
            
            {feature.monthlyCost && (
              <div className="space-y-2">
                <div className="text-2xl font-bold">${feature.monthlyCost.toLocaleString()}</div>
                <div className="text-sm text-green-600">
                  Saved ${feature.savings.toLocaleString()} ({feature.optimization}%)
                </div>
              </div>
            )}
            
            {feature.currentScale && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Min: {feature.currentScale.min}</span>
                  <span className="font-bold">Current: {feature.currentScale.current}</span>
                  <span>Max: {feature.currentScale.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${(feature.currentScale.current / feature.currentScale.max) * 100}%`}}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {feature.rules} scaling rules • {feature.efficiency}% efficiency
                </div>
              </div>
            )}
            
            {feature.circuits && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-green-600">Closed: {feature.closed}</div>
                <div className="text-red-600">Open: {feature.open}</div>
                <div className="text-yellow-600">Half-open: {feature.halfOpen}</div>
                <div className="text-gray-600">Total: {feature.circuits}</div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Cloud Providers */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Multi-Cloud Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="font-semibold text-orange-900">AWS</h3>
            <p className="text-2xl font-bold text-orange-800 mt-2">45%</p>
            <p className="text-sm text-orange-700">123 resources</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900">Google Cloud</h3>
            <p className="text-2xl font-bold text-blue-800 mt-2">30%</p>
            <p className="text-sm text-blue-700">89 resources</p>
          </div>
          <div className="bg-sky-50 rounded-lg p-6 border border-sky-200">
            <h3 className="font-semibold text-sky-900">Azure</h3>
            <p className="text-2xl font-bold text-sky-800 mt-2">20%</p>
            <p className="text-sm text-sky-700">56 resources</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-semibold text-purple-900">On-Premise</h3>
            <p className="text-2xl font-bold text-purple-800 mt-2">5%</p>
            <p className="text-sm text-purple-700">12 resources</p>
          </div>
        </div>
      </div>
    </div>
  );
}