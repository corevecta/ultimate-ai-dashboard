'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from '../../../hooks/use-toast';
import {
  Cloud,
  Rocket,
  Server,
  Container,
  GitBranch,
  Shield,
  Activity,
  Globe,
  Package,
  Settings,
  PlayCircle,
  StopCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  DollarSign,
  Clock,
  Users,
  Lock,
  Unlock,
  Copy,
  Download,
  Upload,
  FileCode,
  Terminal,
  Cpu,
  HardDrive,
  Network,
  Database,
  Layers,
  BarChart,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';

// Deployment platforms
const platforms = [
  { id: 'aws', name: 'AWS', icon: Cloud, color: 'text-orange-600' },
  { id: 'gcp', name: 'Google Cloud', icon: Cloud, color: 'text-blue-600' },
  { id: 'azure', name: 'Azure', icon: Cloud, color: 'text-blue-500' },
  { id: 'vercel', name: 'Vercel', icon: Globe, color: 'text-black' },
  { id: 'netlify', name: 'Netlify', icon: Globe, color: 'text-teal-600' },
  { id: 'kubernetes', name: 'Kubernetes', icon: Container, color: 'text-blue-700' },
  { id: 'docker', name: 'Docker', icon: Container, color: 'text-blue-600' },
  { id: 'heroku', name: 'Heroku', icon: Server, color: 'text-purple-600' },
];

// Deployment strategies
const strategies = [
  {
    id: 'rolling',
    name: 'Rolling Update',
    description: 'Gradually replace instances',
    icon: RefreshCw,
  },
  {
    id: 'bluegreen',
    name: 'Blue-Green',
    description: 'Zero-downtime deployment',
    icon: Layers,
  },
  {
    id: 'canary',
    name: 'Canary Release',
    description: 'Gradual rollout to users',
    icon: TrendingUp,
  },
  {
    id: 'recreate',
    name: 'Recreate',
    description: 'Stop all, then start new',
    icon: Rocket,
  },
];

// Mock deployments data
const mockDeployments = [
  {
    id: 'dep_1',
    name: 'Production API',
    environment: 'production',
    platform: 'aws',
    strategy: 'bluegreen',
    status: 'deployed',
    version: 'v2.1.0',
    instances: 8,
    lastDeployed: '2024-01-20T10:30:00Z',
    deployedBy: 'CI/CD Pipeline',
    health: 'healthy',
    metrics: {
      cpu: 45,
      memory: 62,
      requests: 1250,
      errors: 2,
      latency: 120,
    },
  },
  {
    id: 'dep_2',
    name: 'Staging App',
    environment: 'staging',
    platform: 'kubernetes',
    strategy: 'canary',
    status: 'deploying',
    version: 'v2.2.0-beta',
    instances: 4,
    progress: 65,
    startedAt: '2024-01-20T14:00:00Z',
    deployedBy: 'John Doe',
    health: 'degraded',
    metrics: {
      cpu: 78,
      memory: 85,
      requests: 450,
      errors: 12,
      latency: 250,
    },
  },
  {
    id: 'dep_3',
    name: 'Development Frontend',
    environment: 'development',
    platform: 'vercel',
    strategy: 'rolling',
    status: 'failed',
    version: 'v2.2.0-dev',
    instances: 2,
    lastDeployed: '2024-01-20T12:00:00Z',
    deployedBy: 'Jane Smith',
    error: 'Build failed: TypeScript errors',
    health: 'unhealthy',
  },
];

export const DeploymentCenter: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('aws');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('bluegreen');
  const [deployments, setDeployments] = useState(mockDeployments);
  const [deploymentConfig, setDeploymentConfig] = useState({
    name: '',
    environment: 'development',
    platform: 'aws',
    strategy: 'rolling',
    instances: 2,
    autoScale: true,
    minInstances: 2,
    maxInstances: 10,
    healthCheck: true,
    rollbackOnFailure: true,
  });
  const [iacCode, setIacCode] = useState('');
  const [costEstimate, setCostEstimate] = useState<any>(null);

  const handleDeploy = async () => {
    const newDeployment = {
      id: `dep_${Date.now()}`,
      name: deploymentConfig.name,
      environment: deploymentConfig.environment,
      platform: deploymentConfig.platform,
      strategy: deploymentConfig.strategy,
      status: 'deploying' as const,
      version: 'v2.3.0',
      instances: deploymentConfig.instances,
      progress: 0,
      startedAt: new Date().toISOString(),
      deployedBy: 'Current User',
      health: 'unknown' as const,
    };

    setDeployments([newDeployment, ...deployments]);
    
    toast({
      title: 'Deployment Started',
      description: `Deploying ${deploymentConfig.name} to ${deploymentConfig.environment}`,
    });

    // Simulate deployment progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        setDeployments(prev => 
          prev.map(d => d.id === newDeployment.id 
            ? { ...d, status: 'deployed', progress: 100, health: 'healthy' }
            : d
          )
        );
        toast({
          title: 'Deployment Complete',
          description: `${deploymentConfig.name} successfully deployed`,
        });
      } else {
        setDeployments(prev => 
          prev.map(d => d.id === newDeployment.id 
            ? { ...d, progress }
            : d
          )
        );
      }
    }, 1000);
  };

  const generateIaC = () => {
    const iac = deploymentConfig.platform === 'kubernetes' ? `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${deploymentConfig.name}
  labels:
    app: ${deploymentConfig.name}
    environment: ${deploymentConfig.environment}
spec:
  replicas: ${deploymentConfig.instances}
  selector:
    matchLabels:
      app: ${deploymentConfig.name}
  template:
    metadata:
      labels:
        app: ${deploymentConfig.name}
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
${deploymentConfig.healthCheck ? `
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
` : ''}
---
apiVersion: v1
kind: Service
metadata:
  name: ${deploymentConfig.name}-service
spec:
  selector:
    app: ${deploymentConfig.name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
${deploymentConfig.autoScale ? `
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${deploymentConfig.name}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${deploymentConfig.name}
  minReplicas: ${deploymentConfig.minInstances}
  maxReplicas: ${deploymentConfig.maxInstances}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
` : ''}
    ` : deploymentConfig.platform === 'aws' ? `
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "${deploymentConfig.name} - ${deploymentConfig.environment} deployment",
  "Resources": {
    "AutoScalingGroup": {
      "Type": "AWS::AutoScaling::AutoScalingGroup",
      "Properties": {
        "LaunchConfigurationName": { "Ref": "LaunchConfig" },
        "MinSize": "${deploymentConfig.minInstances}",
        "MaxSize": "${deploymentConfig.maxInstances}",
        "DesiredCapacity": "${deploymentConfig.instances}",
        "HealthCheckType": "ELB",
        "HealthCheckGracePeriod": 300,
        "TargetGroupARNs": [{ "Ref": "TargetGroup" }]
      }
    },
    "LaunchConfig": {
      "Type": "AWS::AutoScaling::LaunchConfiguration",
      "Properties": {
        "ImageId": "ami-0abcdef1234567890",
        "InstanceType": "t3.medium",
        "SecurityGroups": [{ "Ref": "InstanceSecurityGroup" }],
        "UserData": {
          "Fn::Base64": {
            "Fn::Join": ["", [
              "#!/bin/bash\n",
              "echo 'Deploying ${deploymentConfig.name}'\n"
            ]]
          }
        }
      }
    },
    "ApplicationLoadBalancer": {
      "Type": "AWS::ElasticLoadBalancingV2::LoadBalancer",
      "Properties": {
        "Type": "application",
        "Scheme": "internet-facing",
        "SecurityGroups": [{ "Ref": "LoadBalancerSecurityGroup" }]
      }
    }
  }
}
    ` : `
# Terraform configuration for ${deploymentConfig.platform}
# ${deploymentConfig.name} - ${deploymentConfig.environment}

terraform {
  required_providers {
    ${deploymentConfig.platform} = {
      source  = "hashicorp/${deploymentConfig.platform}"
      version = "~> 4.0"
    }
  }
}

resource "${deploymentConfig.platform}_instance" "${deploymentConfig.name}" {
  count = ${deploymentConfig.instances}
  
  # Platform-specific configuration
  # Add your configuration here
}
    `;

    setIacCode(iac);
    toast({
      title: 'Infrastructure Code Generated',
      description: 'IaC template has been generated for your deployment',
    });
  };

  const estimateCost = () => {
    const baseCost = {
      aws: 0.0464,
      gcp: 0.0475,
      azure: 0.0496,
      kubernetes: 0.0350,
      docker: 0.0200,
      vercel: 0,
      netlify: 0,
      heroku: 0.0250,
    };

    const instanceCost = (baseCost[deploymentConfig.platform as keyof typeof baseCost] || 0.05) * deploymentConfig.instances;
    const monthlyCost = instanceCost * 24 * 30;
    const storageCost = deploymentConfig.instances * 5; // $5 per instance for storage
    const bandwidthCost = deploymentConfig.instances * 10; // $10 per instance for bandwidth
    const totalCost = monthlyCost + storageCost + bandwidthCost;

    setCostEstimate({
      hourly: instanceCost.toFixed(2),
      daily: (instanceCost * 24).toFixed(2),
      monthly: monthlyCost.toFixed(2),
      storage: storageCost.toFixed(2),
      bandwidth: bandwidthCost.toFixed(2),
      total: totalCost.toFixed(2),
    });

    toast({
      title: 'Cost Estimate Generated',
      description: `Estimated monthly cost: $${totalCost.toFixed(2)}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deploying':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'stopped':
        return <StopCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Deployment Center</h2>
        <p className="text-muted-foreground">
          Deploy, manage, and monitor applications across multiple platforms
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Deployments</p>
              <p className="text-2xl font-bold">
                {deployments.filter(d => d.status === 'deployed').length}
              </p>
            </div>
            <Rocket className="h-8 w-8 text-primary opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Platforms</p>
              <p className="text-2xl font-bold">{platforms.length}</p>
            </div>
            <Cloud className="h-8 w-8 text-primary opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Instances</p>
              <p className="text-2xl font-bold">
                {deployments.reduce((sum, d) => sum + (d.instances || 0), 0)}
              </p>
            </div>
            <Server className="h-8 w-8 text-primary opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
            <Activity className="h-8 w-8 text-primary opacity-50" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="new">New Deployment</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="iac">Infrastructure as Code</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-4">
          {/* Deployment List */}
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{deployment.name}</h3>
                        <Badge variant="outline">{deployment.version}</Badge>
                        <Badge>{deployment.environment}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(deployment.status)}
                          {deployment.status}
                        </span>
                        <span className="flex items-center gap-1">
                          {platforms.find(p => p.id === deployment.platform)?.icon && 
                            React.createElement(platforms.find(p => p.id === deployment.platform)!.icon, {
                              className: "h-4 w-4"
                            })
                          }
                          {platforms.find(p => p.id === deployment.platform)?.name}
                        </span>
                        <span>
                          {deployment.instances} instance{deployment.instances !== 1 ? 's' : ''}
                        </span>
                        <span>
                          Deployed by {deployment.deployedBy}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Terminal className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="h-4 w-4 mr-1" />
                        Metrics
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>

                  {deployment.status === 'deploying' && deployment.progress && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Deployment Progress</span>
                        <span>{Math.round(deployment.progress)}%</span>
                      </div>
                      <Progress value={deployment.progress} />
                    </div>
                  )}

                  {deployment.status === 'failed' && deployment.error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{deployment.error}</AlertDescription>
                    </Alert>
                  )}

                  {deployment.metrics && (
                    <div className="mt-4 grid grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">CPU</div>
                        <div className="text-lg font-semibold">{deployment.metrics.cpu}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Memory</div>
                        <div className="text-lg font-semibold">{deployment.metrics.memory}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Requests/min</div>
                        <div className="text-lg font-semibold">{deployment.metrics.requests}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Errors</div>
                        <div className="text-lg font-semibold text-red-600">{deployment.metrics.errors}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Latency</div>
                        <div className="text-lg font-semibold">{deployment.metrics.latency}ms</div>
                      </div>
                    </div>
                  )}

                  {deployment.health && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Health:</span>
                      <Badge variant="outline" className={getHealthColor(deployment.health)}>
                        {deployment.health}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy New Application</CardTitle>
              <CardDescription>
                Configure and deploy your application to any supported platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Application Name</Label>
                  <Input
                    id="name"
                    value={deploymentConfig.name}
                    onChange={(e) => setDeploymentConfig({...deploymentConfig, name: e.target.value})}
                    placeholder="my-awesome-app"
                  />
                </div>
                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={deploymentConfig.environment}
                    onValueChange={(value) => setDeploymentConfig({...deploymentConfig, environment: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <Label>Platform</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setDeploymentConfig({...deploymentConfig, platform: platform.id})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          deploymentConfig.platform === platform.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${platform.color}`} />
                        <p className="text-sm font-medium">{platform.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strategy Selection */}
              <div>
                <Label>Deployment Strategy</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {strategies.map((strategy) => {
                    const Icon = strategy.icon;
                    return (
                      <button
                        key={strategy.id}
                        onClick={() => setDeploymentConfig({...deploymentConfig, strategy: strategy.id})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          deploymentConfig.strategy === strategy.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{strategy.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{strategy.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scaling Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Scaling Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="instances">Initial Instances</Label>
                    <Input
                      id="instances"
                      type="number"
                      value={deploymentConfig.instances}
                      onChange={(e) => setDeploymentConfig({...deploymentConfig, instances: parseInt(e.target.value) || 1})}
                      min={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minInstances">Min Instances</Label>
                    <Input
                      id="minInstances"
                      type="number"
                      value={deploymentConfig.minInstances}
                      onChange={(e) => setDeploymentConfig({...deploymentConfig, minInstances: parseInt(e.target.value) || 1})}
                      min={1}
                      disabled={!deploymentConfig.autoScale}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxInstances">Max Instances</Label>
                    <Input
                      id="maxInstances"
                      type="number"
                      value={deploymentConfig.maxInstances}
                      onChange={(e) => setDeploymentConfig({...deploymentConfig, maxInstances: parseInt(e.target.value) || 1})}
                      min={1}
                      disabled={!deploymentConfig.autoScale}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoScale"
                    checked={deploymentConfig.autoScale}
                    onCheckedChange={(checked) => setDeploymentConfig({...deploymentConfig, autoScale: checked})}
                  />
                  <Label htmlFor="autoScale">Enable Auto-scaling</Label>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="healthCheck"
                      checked={deploymentConfig.healthCheck}
                      onCheckedChange={(checked) => setDeploymentConfig({...deploymentConfig, healthCheck: checked})}
                    />
                    <Label htmlFor="healthCheck">Enable Health Checks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="rollback"
                      checked={deploymentConfig.rollbackOnFailure}
                      onCheckedChange={(checked) => setDeploymentConfig({...deploymentConfig, rollbackOnFailure: checked})}
                    />
                    <Label htmlFor="rollback">Automatic Rollback on Failure</Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleDeploy} disabled={!deploymentConfig.name}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy Application
                </Button>
                <Button variant="outline" onClick={generateIaC}>
                  <FileCode className="h-4 w-4 mr-2" />
                  Generate IaC
                </Button>
                <Button variant="outline" onClick={estimateCost}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Estimate Cost
                </Button>
              </div>

              {/* Cost Estimate */}
              {costEstimate && (
                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Cost Estimate</p>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Hourly:</span>
                          <span className="ml-2">${costEstimate.hourly}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Daily:</span>
                          <span className="ml-2">${costEstimate.daily}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Monthly:</span>
                          <span className="ml-2 font-semibold">${costEstimate.total}</span>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Card key={platform.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-primary/10`}>
                        <Icon className={`h-6 w-6 ${platform.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription>
                          {deployments.filter(d => d.platform === platform.id).length} deployments
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Regions</span>
                        <span>Multiple</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Features</span>
                        <span>Auto-scale, Load Balancing</span>
                      </div>
                      <Button className="w-full" variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <Card key={strategy.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <CardDescription>{strategy.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {strategy.id === 'rolling' && (
                        <>
                          <p className="text-sm">Gradually replace old instances with new ones. Suitable for stateless applications.</p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                            <li>No downtime</li>
                            <li>Gradual rollout</li>
                            <li>Easy rollback</li>
                          </ul>
                        </>
                      )}
                      {strategy.id === 'bluegreen' && (
                        <>
                          <p className="text-sm">Run two identical production environments. Switch traffic instantly.</p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                            <li>Zero downtime</li>
                            <li>Instant rollback</li>
                            <li>Full testing before switch</li>
                          </ul>
                        </>
                      )}
                      {strategy.id === 'canary' && (
                        <>
                          <p className="text-sm">Deploy to a small subset of users first, then gradually increase.</p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                            <li>Risk mitigation</li>
                            <li>Real user testing</li>
                            <li>Gradual rollout control</li>
                          </ul>
                        </>
                      )}
                      {strategy.id === 'recreate' && (
                        <>
                          <p className="text-sm">Stop all old instances before starting new ones. Simple but has downtime.</p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                            <li>Simple to implement</li>
                            <li>Good for dev/staging</li>
                            <li>Requires downtime</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="iac" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure as Code</CardTitle>
              <CardDescription>
                Generate and manage infrastructure code for your deployments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {iacCode ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge>
                        {deploymentConfig.platform === 'kubernetes' ? 'YAML' : 
                         deploymentConfig.platform === 'aws' ? 'CloudFormation' : 'Terraform'}
                      </Badge>
                      <Badge variant="outline">{deploymentConfig.name}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(iacCode)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <pre className="p-4">
                      <code className="text-sm">{iacCode}</code>
                    </pre>
                  </ScrollArea>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Configure a deployment and click "Generate IaC" to create infrastructure code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};