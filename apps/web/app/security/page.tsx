'use client';

import React from 'react';
import Link from 'next/link';

const securityFeatures = [
  {
    title: 'Vulnerability Scanner',
    description: 'Automated security vulnerability detection and remediation',
    href: '/security/scanner',
    severity: { critical: 2, high: 5, medium: 12, low: 23 },
    lastScan: '2 hours ago',
  },
  {
    title: 'Compliance Manager',
    description: 'SOC2, HIPAA, GDPR compliance monitoring and reporting',
    href: '/security/compliance',
    compliance: { soc2: 98, hipaa: 95, gdpr: 99, pci: 97 },
    status: 'compliant',
  },
  {
    title: 'Secrets Management',
    description: 'Secure storage and rotation of API keys, tokens, and credentials',
    href: '/security/secrets',
    stats: { total: 234, rotated: 189, expiring: 12 },
    health: 'secure',
  },
  {
    title: 'Audit Logging',
    description: 'Comprehensive security audit trail and activity monitoring',
    href: '/security/audit',
    stats: { events: 123456, alerts: 23, investigations: 5 },
    retention: '90 days',
  },
  {
    title: 'RBAC System',
    description: 'Role-based access control with fine-grained permissions',
    href: '/security/rbac',
    stats: { roles: 45, users: 1234, permissions: 567 },
    lastUpdate: '1 day ago',
  },
  {
    title: 'Threat Detection',
    description: 'Real-time threat monitoring with ML-based anomaly detection',
    href: '/security/threats',
    threats: { blocked: 1234, monitoring: 45, resolved: 1189 },
    status: 'protected',
  },
  {
    title: 'Data Encryption',
    description: 'At-rest and in-transit encryption management',
    href: '/security/encryption',
    coverage: { atRest: 100, inTransit: 100, keys: 89 },
    algorithm: 'AES-256',
  },
  {
    title: 'API Security',
    description: 'API protection with rate limiting and authentication',
    href: '/security/api',
    stats: { endpoints: 234, protected: 234, rateLimit: '1000/hour' },
    violations: 12,
  },
];

export default function SecurityPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Security & Compliance Center</h1>
        <p className="text-lg text-gray-600">
          Enterprise-grade security features to protect your infrastructure and ensure compliance
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Security Score</h3>
          <p className="text-3xl font-bold mt-2 text-green-900">98/100</p>
          <p className="text-sm text-green-700 mt-1">Excellent protection</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Threats Blocked</h3>
          <p className="text-3xl font-bold mt-2 text-blue-900">1,234</p>
          <p className="text-sm text-blue-700 mt-1">Last 30 days</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">Compliance Status</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-900">4/4</p>
          <p className="text-sm text-yellow-700 mt-1">All standards met</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Active Alerts</h3>
          <p className="text-3xl font-bold mt-2 text-purple-900">3</p>
          <p className="text-sm text-purple-700 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {/* Feature-specific stats */}
            {feature.severity && (
              <div className="flex gap-4 text-sm">
                <span className="text-red-600">Critical: {feature.severity.critical}</span>
                <span className="text-orange-600">High: {feature.severity.high}</span>
                <span className="text-yellow-600">Medium: {feature.severity.medium}</span>
                <span className="text-gray-600">Low: {feature.severity.low}</span>
              </div>
            )}
            
            {feature.compliance && (
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(feature.compliance).map(([std, score]) => (
                  <div key={std} className="text-center">
                    <div className="text-xs text-gray-500 uppercase">{std}</div>
                    <div className="text-lg font-semibold text-green-600">{score}%</div>
                  </div>
                ))}
              </div>
            )}
            
            {feature.threats && (
              <div className="flex gap-4 text-sm">
                <span className="text-red-600">Blocked: {feature.threats.blocked}</span>
                <span className="text-yellow-600">Monitoring: {feature.threats.monitoring}</span>
                <span className="text-green-600">Resolved: {feature.threats.resolved}</span>
              </div>
            )}
            
            {feature.stats && (
              <div className="flex gap-4 text-sm">
                {Object.entries(feature.stats).map(([key, value]) => (
                  <span key={key} className="text-gray-600">
                    <span className="capitalize">{key}:</span> 
                    <span className="font-medium ml-1">{value.toLocaleString()}</span>
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Zero Trust Architecture */}
      <div className="mt-12 bg-gray-900 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Zero Trust Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-blue-400">Never Trust</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Verify every request</li>
              <li>• Continuous authentication</li>
              <li>• Least privilege access</li>
              <li>• Micro-segmentation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-green-400">Always Verify</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Multi-factor authentication</li>
              <li>• Device trust validation</li>
              <li>• Contextual access control</li>
              <li>• Real-time risk assessment</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-purple-400">Assume Breach</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Limit blast radius</li>
              <li>• Encrypt everything</li>
              <li>• Monitor all activity</li>
              <li>• Rapid incident response</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}