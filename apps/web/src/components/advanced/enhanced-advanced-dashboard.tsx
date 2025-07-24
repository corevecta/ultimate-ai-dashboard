'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PieChart, Pie, Cell, Treemap, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Brain, Cpu, Zap, Activity, GitBranch, Target, 
  TrendingUp, AlertTriangle, Layers, Database,
  Network, Shield, Gauge, FlaskConical, Microscope,
  Sparkles, Bot, BarChart3
} from 'lucide-react';

// Tab navigation
const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'ml-models', label: 'ML Models', icon: Brain },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot },
  { id: 'optimization', label: 'Optimization', icon: Target },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'research', label: 'Research', icon: Microscope },
];

// Sample data for various charts
const modelPerformanceData = [
  { time: '00:00', accuracy: 92, loss: 0.12, f1Score: 0.89, precision: 0.91, recall: 0.87 },
  { time: '04:00', accuracy: 93, loss: 0.11, f1Score: 0.90, precision: 0.92, recall: 0.88 },
  { time: '08:00', accuracy: 94, loss: 0.10, f1Score: 0.91, precision: 0.93, recall: 0.89 },
  { time: '12:00', accuracy: 95, loss: 0.09, f1Score: 0.92, precision: 0.94, recall: 0.90 },
  { time: '16:00', accuracy: 96, loss: 0.08, f1Score: 0.93, precision: 0.95, recall: 0.91 },
  { time: '20:00', accuracy: 97, loss: 0.07, f1Score: 0.94, precision: 0.96, recall: 0.92 },
];

const inferenceStatsData = [
  { name: 'GPT-4', latency: 120, throughput: 850, cost: 0.03 },
  { name: 'Claude', latency: 95, throughput: 920, cost: 0.025 },
  { name: 'Llama', latency: 60, throughput: 1200, cost: 0.01 },
  { name: 'Mistral', latency: 45, throughput: 1500, cost: 0.008 },
  { name: 'Gemini', latency: 110, throughput: 900, cost: 0.028 },
];

const resourceAllocationData = [
  { name: 'Model Training', size: 3500, color: '#8B5CF6' },
  { name: 'Data Processing', size: 2800, color: '#3B82F6' },
  { name: 'Feature Engineering', size: 2200, color: '#10B981' },
  { name: 'Model Serving', size: 1800, color: '#F59E0B' },
  { name: 'Monitoring', size: 1200, color: '#EF4444' },
  { name: 'Research', size: 800, color: '#EC4899' },
];

const modelDriftData = [
  { feature: 'Input Distribution', baseline: 85, current: 78, threshold: 80 },
  { feature: 'Prediction Accuracy', baseline: 92, current: 89, threshold: 85 },
  { feature: 'Feature Importance', baseline: 88, current: 82, threshold: 75 },
  { feature: 'Output Distribution', baseline: 90, current: 85, threshold: 82 },
  { feature: 'Data Quality', baseline: 95, current: 91, threshold: 88 },
];

const hyperparameterData = [
  { param: 'Learning Rate', value: 0.001, optimal: 0.0008 },
  { param: 'Batch Size', value: 32, optimal: 48 },
  { param: 'Epochs', value: 100, optimal: 120 },
  { param: 'Dropout', value: 0.3, optimal: 0.25 },
  { param: 'Hidden Layers', value: 4, optimal: 5 },
];

const agentOrchestrationData = {
  nodes: [
    { id: 'input', x: 100, y: 200, label: 'Input Layer' },
    { id: 'preprocessing', x: 300, y: 150, label: 'Preprocessing' },
    { id: 'feature', x: 300, y: 250, label: 'Feature Extract' },
    { id: 'model1', x: 500, y: 100, label: 'Model A' },
    { id: 'model2', x: 500, y: 200, label: 'Model B' },
    { id: 'model3', x: 500, y: 300, label: 'Model C' },
    { id: 'ensemble', x: 700, y: 200, label: 'Ensemble' },
    { id: 'output', x: 900, y: 200, label: 'Output' },
  ],
  edges: [
    { from: 'input', to: 'preprocessing' },
    { from: 'input', to: 'feature' },
    { from: 'preprocessing', to: 'model1' },
    { from: 'preprocessing', to: 'model2' },
    { from: 'feature', to: 'model2' },
    { from: 'feature', to: 'model3' },
    { from: 'model1', to: 'ensemble' },
    { from: 'model2', to: 'ensemble' },
    { from: 'model3', to: 'ensemble' },
    { from: 'ensemble', to: 'output' },
  ],
};

const experimentResults = [
  { experiment: 'Exp-001', accuracy: 92, runtime: 45, memory: 2.3 },
  { experiment: 'Exp-002', accuracy: 94, runtime: 52, memory: 2.8 },
  { experiment: 'Exp-003', accuracy: 91, runtime: 38, memory: 2.1 },
  { experiment: 'Exp-004', accuracy: 96, runtime: 58, memory: 3.2 },
  { experiment: 'Exp-005', accuracy: 93, runtime: 42, memory: 2.5 },
];

const FloatingBlob = ({ delay = 0 }) => (
  <motion.div
    className="absolute rounded-full filter blur-3xl opacity-30"
    animate={{
      x: [0, 100, -100, 0],
      y: [0, -100, 100, 0],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration: 20,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      width: `${200 + Math.random() * 200}px`,
      height: `${200 + Math.random() * 200}px`,
      background: `radial-gradient(circle, ${
        ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)]
      } 0%, transparent 70%)`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

const MetricCard = ({ icon: Icon, title, value, change, color }: { icon: React.ElementType; title: string; value: string; change: number; color: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}
        >
          {change >= 0 ? '+' : ''}{change}%
        </motion.div>
      </div>
      <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

const GaugeChart = ({ value, max, title }: { value: number; max: number; title: string }) => {
  const percentage = (value / max) * 100;
  const rotation = (percentage * 180) / 100 - 90;

  return (
    <div className="relative w-full h-40">
      <svg className="w-full h-full" viewBox="0 0 200 120">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth="20"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="white"
          strokeWidth="3"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          style={{ transformOrigin: '100px 100px' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center mt-8">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );
};

interface AgentFlowNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface AgentFlowEdge {
  from: string;
  to: string;
}

interface AgentFlowData {
  nodes: AgentFlowNode[];
  edges: AgentFlowEdge[];
}

const AgentFlowVisualization = ({ data }: { data: AgentFlowData }) => (
  <div className="relative w-full h-96 bg-black/20 rounded-xl overflow-hidden">
    <svg className="w-full h-full">
      {/* Draw edges */}
      {data.edges.map((edge: AgentFlowEdge, idx: number) => {
        const fromNode = data.nodes.find((n: AgentFlowNode) => n.id === edge.from);
        const toNode = data.nodes.find((n: AgentFlowNode) => n.id === edge.to);
        
        if (!fromNode || !toNode) return null;
        
        return (
          <motion.line
            key={idx}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: idx * 0.1 }}
          />
        );
      })}
      {/* Draw nodes */}
      {data.nodes.map((node: AgentFlowNode, idx: number) => (
        <motion.g
          key={node.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="30"
            fill="rgba(139, 92, 246, 0.2)"
            stroke="rgba(139, 92, 246, 0.8)"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
            className="font-medium"
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  </div>
);

export const EnhancedAdvancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState(modelPerformanceData);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const lastItem = prev[prev.length - 1];
        const newItem = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          accuracy: Math.min(100, lastItem.accuracy + (Math.random() - 0.3)),
          loss: Math.max(0, lastItem.loss - (Math.random() * 0.01)),
          f1Score: Math.min(1, lastItem.f1Score + (Math.random() - 0.45) * 0.01),
          precision: Math.min(1, lastItem.precision + (Math.random() - 0.45) * 0.01),
          recall: Math.min(1, lastItem.recall + (Math.random() - 0.45) * 0.01),
        };
        return [...prev.slice(1), newItem];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab realTimeData={realTimeData} />;
      case 'ml-models':
        return <MLModelsTab />;
      case 'ai-agents':
        return <AIAgentsTab />;
      case 'optimization':
        return <OptimizationTab />;
      case 'experiments':
        return <ExperimentsTab />;
      case 'research':
        return <ResearchTab />;
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        {[...Array(5)].map((_, i) => (
          <FloatingBlob key={i} delay={i * 2} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-4">
            <Sparkles className="w-12 h-12 text-yellow-400" />
            Advanced AI Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Real-time ML performance monitoring and AI system orchestration
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Type for model performance data
interface ModelPerformanceData {
  time: string;
  accuracy: number;
  loss: number;
  f1Score: number;
  precision: number;
  recall: number;
}

// Overview Tab Component
const OverviewTab = ({ realTimeData }: { realTimeData: ModelPerformanceData[] }) => (
  <div className="space-y-8">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        icon={Brain}
        title="Model Accuracy"
        value="97.3%"
        change={2.4}
        color="purple"
      />
      <MetricCard
        icon={Zap}
        title="Inference Speed"
        value="12ms"
        change={-15.2}
        color="blue"
      />
      <MetricCard
        icon={Activity}
        title="System Load"
        value="68%"
        change={5.1}
        color="green"
      />
      <MetricCard
        icon={Database}
        title="Data Processed"
        value="2.4TB"
        change={18.7}
        color="orange"
      />
    </div>

    {/* Real-time Performance Chart */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Real-time Model Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={realTimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={false}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="f1Score"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>

    {/* Resource Allocation Treemap */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Resource Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={resourceAllocationData}
          dataKey="size"
          stroke="#fff"
        >
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </motion.div>
  </div>
);

// ML Models Tab Component
const MLModelsTab = () => (
  <div className="space-y-8">
    {/* Model Performance Comparison */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Model Performance Metrics</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={modelDriftData}>
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis dataKey="feature" stroke="rgba(255,255,255,0.5)" />
          <PolarRadiusAxis stroke="rgba(255,255,255,0.5)" />
          <Radar
            name="Baseline"
            dataKey="baseline"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.3}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
          />
          <Radar
            name="Threshold"
            dataKey="threshold"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.1}
            strokeDasharray="5 5"
          />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>

    {/* Inference Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Inference Latency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inferenceStatsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="latency" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Model Drift Detection</h3>
        <div className="space-y-4">
          {modelDriftData.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{item.feature}</span>
                <span className={`font-medium ${
                  item.current < item.threshold ? 'text-red-400' : 'text-green-400'
                }`}>
                  {item.current}%
                </span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.current}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`absolute h-full ${
                    item.current < item.threshold
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : 'bg-gradient-to-r from-green-500 to-green-400'
                  }`}
                />
                <div
                  className="absolute h-full w-0.5 bg-yellow-400"
                  style={{ left: `${item.threshold}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

// AI Agents Tab Component
const AIAgentsTab = () => (
  <div className="space-y-8">
    {/* Agent Orchestration Flow */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Agent Orchestration Flow</h3>
      <AgentFlowVisualization data={agentOrchestrationData} />
    </motion.div>

    {/* Agent Performance Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Agent Alpha', 'Agent Beta', 'Agent Gamma'].map((agent, idx) => (
        <motion.div
          key={agent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">{agent}</h4>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Tasks/min</span>
              <span className="text-white font-medium">{45 + idx * 12}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-white font-medium">{95 + idx}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Latency</span>
              <span className="text-white font-medium">{120 - idx * 20}ms</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Optimization Tab Component
const OptimizationTab = () => (
  <div className="space-y-8">
    {/* System Optimization Gauges */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <GaugeChart value={78} max={100} title="CPU Optimization" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <GaugeChart value={92} max={100} title="Memory Efficiency" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <GaugeChart value={65} max={100} title="Network Utilization" />
      </motion.div>
    </div>

    {/* Hyperparameter Tuning */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Hyperparameter Optimization</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="value" stroke="rgba(255,255,255,0.5)" name="Current" />
          <YAxis dataKey="optimal" stroke="rgba(255,255,255,0.5)" name="Optimal" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            name="Parameters"
            data={hyperparameterData}
            fill="#8B5CF6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  </div>
);

// Experiments Tab Component
const ExperimentsTab = () => (
  <div className="space-y-8">
    {/* Experiment Results */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Experiment Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={experimentResults}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="experiment" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="accuracy"
            stackId="1"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="runtime"
            stackId="2"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>

    {/* Feature Engineering Pipeline */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Feature Engineering Pipeline</h3>
      <div className="space-y-4">
        {['Data Collection', 'Preprocessing', 'Feature Extraction', 'Feature Selection', 'Model Training'].map((stage, idx) => (
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              idx === 2 ? 'bg-purple-500' : 'bg-white/20'
            }`}>
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">{stage}</h4>
              <div className="mt-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - idx * 15}%` }}
                  transition={{ duration: 1, delay: idx * 0.2 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </div>
            <span className="text-gray-400 text-sm">{100 - idx * 15}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

// Research Tab Component
const ResearchTab = () => (
  <div className="space-y-8">
    {/* Research Insights */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-4">AI-Powered System Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Model Recommendations
          </h4>
          <div className="space-y-3">
            {[
              'Consider ensemble methods for 3.2% accuracy boost',
              'Implement gradient clipping to prevent exploding gradients',
              'Add dropout layers to reduce overfitting by 15%',
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5" />
                <p className="text-gray-300 text-sm">{insight}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Optimization Opportunities
          </h4>
          <div className="space-y-3">
            {[
              'Batch processing can reduce latency by 45%',
              'Model quantization feasible with <1% accuracy loss',
              'Cache hit rate can be improved to 95% with predictive loading',
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5" />
                <p className="text-gray-300 text-sm">{insight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>

    {/* Research Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
      >
        <FlaskConical className="w-8 h-8 text-purple-400 mb-3" />
        <p className="text-3xl font-bold text-white">23</p>
        <p className="text-sm text-gray-300 mt-1">Active Experiments</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30"
      >
        <Microscope className="w-8 h-8 text-blue-400 mb-3" />
        <p className="text-3xl font-bold text-white">156</p>
        <p className="text-sm text-gray-300 mt-1">Papers Analyzed</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30"
      >
        <GitBranch className="w-8 h-8 text-green-400 mb-3" />
        <p className="text-3xl font-bold text-white">8</p>
        <p className="text-sm text-gray-300 mt-1">Model Variants</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30"
      >
        <TrendingUp className="w-8 h-8 text-orange-400 mb-3" />
        <p className="text-3xl font-bold text-white">+34%</p>
        <p className="text-sm text-gray-300 mt-1">Performance Gain</p>
      </motion.div>
    </div>
  </div>
);

export default EnhancedAdvancedDashboard;