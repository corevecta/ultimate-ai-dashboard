'use client';

import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { toast } from '../../../hooks/use-toast';
import {
  PlayCircle,
  PauseCircle,
  StopCircle,
  Save,
  Download,
  Upload,
  Plus,
  Settings,
  GitBranch,
  Zap,
  Code,
  Database,
  Shield,
  TestTube,
  FileText,
  Palette,
  Rocket,
} from 'lucide-react';

// Custom node types for different workflow tasks
const taskIcons = {
  'code-review': Code,
  'security-audit': Shield,
  'test-generation': TestTube,
  'documentation': FileText,
  'ui-design': Palette,
  'deployment': Rocket,
  'data-processing': Database,
  'conditional': GitBranch,
  'parallel': Zap,
};

interface CustomNodeData {
  label: string;
  type: keyof typeof taskIcons;
  status?: 'idle' | 'running' | 'completed' | 'error';
  config?: Record<string, any>;
}

const CustomNode: React.FC<{ data: CustomNodeData; selected: boolean }> = ({ data, selected }) => {
  const Icon = taskIcons[data.type] || Code;
  const statusColors = {
    idle: 'bg-gray-100',
    running: 'bg-blue-100 animate-pulse',
    completed: 'bg-green-100',
    error: 'bg-red-100',
  };

  return (
    <div
      className={`px-4 py-2 shadow-lg rounded-lg border-2 ${
        selected ? 'border-blue-500' : 'border-gray-200'
      } ${statusColors[data.status || 'idle']} min-w-[150px]`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <div className="font-medium">{data.label}</div>
      </div>
      {data.status && data.status !== 'idle' && (
        <Badge variant={data.status === 'completed' ? 'default' : data.status === 'error' ? 'destructive' : 'secondary'} className="mt-1">
          {data.status}
        </Badge>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const VisualWorkflowDesigner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = (type: keyof typeof taskIcons) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}`,
        type,
        status: 'idle',
        config: {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    toast({
      title: 'Workflow Started',
      description: `Running ${workflowName}...`,
    });

    // Simulate workflow execution
    for (const node of nodes) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'running' } }
            : n
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'completed' } }
            : n
        )
      );
    }

    setIsRunning(false);
    toast({
      title: 'Workflow Completed',
      description: 'All tasks executed successfully',
    });
  };

  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Workflow Saved',
      description: 'Workflow exported successfully',
    });
  };

  const loadWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        setWorkflowName(workflow.name);
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        toast({
          title: 'Workflow Loaded',
          description: `Loaded ${workflow.name}`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workflow file',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="font-semibold text-lg w-64"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Load Workflow"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={loadWorkflow}
              />
              <Button variant="outline" size="icon" onClick={saveWorkflow} title="Save Workflow">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Export">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={runWorkflow} className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Run Workflow
              </Button>
            ) : (
              <>
                <Button variant="outline" className="gap-2">
                  <PauseCircle className="h-4 w-4" />
                  Pause
                </Button>
                <Button variant="destructive" className="gap-2">
                  <StopCircle className="h-4 w-4" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r p-4">
          <h3 className="font-semibold mb-4">Workflow Nodes</h3>
          <div className="space-y-2">
            {Object.entries(taskIcons).map(([type, Icon]) => (
              <Button
                key={type}
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => addNode(type as keyof typeof taskIcons)}
              >
                <Icon className="h-4 w-4" />
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {selectedNode && (
          <div className="w-80 border-l p-4">
            <h3 className="font-semibold mb-4">Node Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label>Node Name</Label>
                <Input
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, data: { ...n.data, label: e.target.value } }
                          : n
                      )
                    );
                  }}
                />
              </div>
              <div>
                <Label>Node Type</Label>
                <Select value={selectedNode.data.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(taskIcons).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={
                  selectedNode.data.status === 'completed' ? 'default' :
                  selectedNode.data.status === 'error' ? 'destructive' :
                  selectedNode.data.status === 'running' ? 'secondary' : 'outline'
                }>
                  {selectedNode.data.status || 'idle'}
                </Badge>
              </div>
              <Tabs defaultValue="config">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="config" className="space-y-4">
                  <div>
                    <Label>Timeout (seconds)</Label>
                    <Input type="number" defaultValue="300" />
                  </div>
                  <div>
                    <Label>Retry Count</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <Label>Environment Variables</Label>
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="KEY=value"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};