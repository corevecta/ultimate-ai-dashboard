'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  TrendingUp,
  Sparkles,
  LineChart,
  GitBranch,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
  RefreshCw,
  Download,
  Upload,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Activity,
  Layers,
  Network,
  Timer,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  Sankey,
  Rectangle,
} from 'recharts';

// Mock data for learning metrics
const learningMetrics = [
  { date: '2024-01-01', accuracy: 82, improvement: 0, patterns: 124, templates: 8 },
  { date: '2024-01-07', accuracy: 84, improvement: 2.4, patterns: 145, templates: 9 },
  { date: '2024-01-14', accuracy: 86, improvement: 2.3, patterns: 167, templates: 11 },
  { date: '2024-01-21', accuracy: 89, improvement: 3.5, patterns: 189, templates: 12 },
  { date: '2024-01-28', accuracy: 91, improvement: 2.2, patterns: 203, templates: 14 },
  { date: '2024-02-04', accuracy: 93, improvement: 2.2, patterns: 234, templates: 16 },
  { date: '2024-02-11', accuracy: 94, improvement: 1.1, patterns: 256, templates: 18 },
];

// Mock pattern evolution data
const patternEvolution = [
  { name: 'Code Structure', baseline: 65, current: 89, optimal: 95 },
  { name: 'Error Handling', baseline: 70, current: 92, optimal: 98 },
  { name: 'Performance', baseline: 75, current: 88, optimal: 92 },
  { name: 'Security', baseline: 80, current: 95, optimal: 99 },
  { name: 'Documentation', baseline: 60, current: 85, optimal: 90 },
  { name: 'Testing', baseline: 55, current: 78, optimal: 85 },
];

// Mock prompt improvements
const promptImprovements = [
  {
    id: 1,
    original: 'Generate a REST API endpoint',
    improved: 'Generate a REST API endpoint with proper error handling, input validation, and OpenAPI documentation',
    improvement: 34,
    usage: 234,
    successRate: 96,
  },
  {
    id: 2,
    original: 'Create a React component',
    improved: 'Create a React component with TypeScript, proper prop types, memo optimization, and accessibility features',
    improvement: 28,
    usage: 189,
    successRate: 94,
  },
  {
    id: 3,
    original: 'Write unit tests',
    improved: 'Write comprehensive unit tests with edge cases, mocking, and coverage targets above 90%',
    improvement: 41,
    usage: 156,
    successRate: 98,
  },
];

// Mock template evolution
const templateEvolution = [
  {
    id: 1,
    name: 'Express API Template',
    version: '2.3.0',
    improvements: ['Added rate limiting', 'Enhanced security middleware', 'Better error handling'],
    performance: 92,
    adoption: 78,
  },
  {
    id: 2,
    name: 'React Dashboard Template',
    version: '3.1.0',
    improvements: ['Improved performance', 'Added dark mode', 'Better accessibility'],
    performance: 89,
    adoption: 85,
  },
  {
    id: 3,
    name: 'Microservice Template',
    version: '1.8.0',
    improvements: ['Added health checks', 'Better logging', 'Kubernetes ready'],
    performance: 95,
    adoption: 72,
  },
];

export const LearningEvolutionLab: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [learningRate, setLearningRate] = useState([0.7]);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [experimentMode, setExperimentMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Learning Evolution Lab
            <Brain className="h-8 w-8 text-primary" />
          </h2>
          <p className="text-muted-foreground">
            AI system learning analytics and continuous improvement tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant={experimentMode ? 'default' : 'outline'}
            onClick={() => setExperimentMode(!experimentMode)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Experiment Mode
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-muted-foreground">per week improvement</p>
            <Progress value={94} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Learned</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
            <Progress value={85} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+5.3% from baseline</p>
            <Progress value={94} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">3 pending review</p>
            <Progress value={72} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress Over Time</CardTitle>
                <CardDescription>System improvement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                      <SelectItem value="improvement">Improvement Rate</SelectItem>
                      <SelectItem value="patterns">Patterns Learned</SelectItem>
                      <SelectItem value="templates">Templates Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={learningMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pattern Evolution Radar</CardTitle>
                <CardDescription>Multi-dimensional improvement tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={patternEvolution}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Baseline" dataKey="baseline" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                    <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Radar name="Optimal" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Learning Rate Configuration</CardTitle>
              <CardDescription>Adjust the system's learning parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Learning Rate: {learningRate[0]}</Label>
                    <Badge variant="outline">{learningRate[0] > 0.8 ? 'Aggressive' : learningRate[0] > 0.5 ? 'Moderate' : 'Conservative'}</Badge>
                  </div>
                  <Slider
                    value={learningRate}
                    onValueChange={setLearningRate}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher values lead to faster learning but may introduce instability
                  </p>
                </div>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    Current configuration is optimized for balanced learning with minimal regression risk.
                    The system has achieved 94% accuracy with only 2.8% weekly improvement rate.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discovered Patterns</CardTitle>
              <CardDescription>AI-identified success patterns in code generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    pattern: 'Error Boundary Implementation',
                    confidence: 96,
                    usage: 234,
                    improvement: '+12% stability',
                    description: 'Automatically wraps components with error boundaries when complexity exceeds threshold',
                  },
                  {
                    pattern: 'Async/Await Optimization',
                    confidence: 92,
                    usage: 189,
                    improvement: '+23% performance',
                    description: 'Converts promise chains to async/await with proper error handling',
                  },
                  {
                    pattern: 'Security Header Injection',
                    confidence: 98,
                    usage: 345,
                    improvement: '+45% security score',
                    description: 'Automatically adds security headers to API responses',
                  },
                  {
                    pattern: 'Component Memoization',
                    confidence: 88,
                    usage: 156,
                    improvement: '+18% render efficiency',
                    description: 'Identifies and memoizes expensive React components',
                  },
                ].map((pattern, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedPattern(pattern.pattern)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {pattern.pattern}
                          <Badge variant="secondary">{pattern.confidence}% confidence</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{pattern.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {pattern.usage} uses
                          </span>
                          <span className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            {pattern.improvement}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Evolution</CardTitle>
              <CardDescription>How prompts have improved through learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promptImprovements.map((prompt) => (
                  <div key={prompt.id} className="border rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Original Prompt</Label>
                        <p className="text-sm text-muted-foreground">{prompt.original}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Improved Prompt</Label>
                        <p className="text-sm font-medium">{prompt.improved}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="default">+{prompt.improvement}% better</Badge>
                          <span className="text-muted-foreground">{prompt.usage} uses</span>
                          <span className="text-muted-foreground">{prompt.successRate}% success</span>
                        </div>
                        <Button size="sm" variant="outline">Apply to All</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Analyze More Prompts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateEvolution.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>Version {template.version}</CardDescription>
                    </div>
                    <Badge>{template.adoption}% adoption</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Recent Improvements</Label>
                      <ul className="text-sm space-y-1 mt-1">
                        {template.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Performance Score</span>
                        <span className="font-medium">{template.performance}%</span>
                      </div>
                      <Progress value={template.performance} className="h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Changes
                      </Button>
                      <Button size="sm" className="flex-1">
                        Test Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-4">
          {experimentMode ? (
            <>
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Experiment mode is active. Changes here will not affect production until validated.
                </AlertDescription>
              </Alert>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Experiments</CardTitle>
                  <CardDescription>Test new learning strategies and parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label>Experiment Name</Label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., Aggressive Pattern Learning"
                      />
                    </div>
                    <div>
                      <Label>Hypothesis</Label>
                      <Textarea
                        placeholder="What do you expect this experiment to achieve?"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Parameters to Test</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label className="text-xs">Learning Rate</Label>
                          <Slider defaultValue={[0.7]} max={1} step={0.1} />
                        </div>
                        <div>
                          <Label className="text-xs">Pattern Threshold</Label>
                          <Slider defaultValue={[0.8]} max={1} step={0.1} />
                        </div>
                        <div>
                          <Label className="text-xs">Feedback Weight</Label>
                          <Slider defaultValue={[0.5]} max={1} step={0.1} />
                        </div>
                        <div>
                          <Label className="text-xs">Exploration Rate</Label>
                          <Slider defaultValue={[0.3]} max={1} step={0.1} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Zap className="h-4 w-4 mr-2" />
                        Start Experiment
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Timer className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Experiment Mode Disabled</h3>
                  <p className="text-muted-foreground mb-4">
                    Enable experiment mode to test new learning strategies safely
                  </p>
                  <Button onClick={() => setExperimentMode(true)}>
                    Enable Experiments
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};