'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Brain, 
  Filter, 
  GitMerge, 
  Sparkles, 
  FileText, 
  Send,
  Settings,
  Plus,
  Move,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'
import { Button } from '../ui/button'

// Define node types
const nodeTypes = [
  { 
    type: 'input', 
    label: 'Data Input', 
    icon: Database, 
    color: 'from-blue-500 to-indigo-600',
    description: 'Load data from various sources'
  },
  { 
    type: 'ai-model', 
    label: 'AI Model', 
    icon: Brain, 
    color: 'from-purple-500 to-pink-600',
    description: 'Apply AI models for processing'
  },
  { 
    type: 'filter', 
    label: 'Filter', 
    icon: Filter, 
    color: 'from-emerald-500 to-teal-600',
    description: 'Filter and transform data'
  },
  { 
    type: 'merge', 
    label: 'Merge', 
    icon: GitMerge, 
    color: 'from-orange-500 to-red-600',
    description: 'Combine multiple data streams'
  },
  { 
    type: 'transform', 
    label: 'Transform', 
    icon: Sparkles, 
    color: 'from-yellow-500 to-amber-600',
    description: 'Transform and enrich data'
  },
  { 
    type: 'output', 
    label: 'Output', 
    icon: Send, 
    color: 'from-indigo-500 to-blue-600',
    description: 'Send results to destination'
  },
]

// Sample nodes for demonstration
const initialNodes = [
  { 
    id: '1', 
    type: 'input', 
    position: { x: 100, y: 200 }, 
    data: { label: 'Customer Data', source: 'PostgreSQL' },
    selected: false
  },
  { 
    id: '2', 
    type: 'ai-model', 
    position: { x: 400, y: 200 }, 
    data: { label: 'Sentiment Analysis', model: 'GPT-4' },
    selected: false
  },
  { 
    id: '3', 
    type: 'filter', 
    position: { x: 700, y: 200 }, 
    data: { label: 'Score Filter', condition: 'score > 0.8' },
    selected: false
  },
  { 
    id: '4', 
    type: 'output', 
    position: { x: 1000, y: 200 }, 
    data: { label: 'Results Dashboard', destination: 'Webhook' },
    selected: false
  },
]

// Sample connections
const initialConnections = [
  { id: 'c1', source: '1', target: '2' },
  { id: 'c2', source: '2', target: '3' },
  { id: 'c3', source: '3', target: '4' },
]

export function PipelineBuilder() {
  const [nodes, setNodes] = useState(initialNodes)
  const [connections, setConnections] = useState(initialConnections)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Handle node drag
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setSelectedNode(nodeId)
    setIsDragging(true)
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - node.position.x,
      y: (e.clientY - rect.top) / zoom - node.position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedNode) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const newX = (e.clientX - rect.left) / zoom - dragOffset.x
    const newY = (e.clientY - rect.top) / zoom - dragOffset.y

    setNodes(prev => prev.map(node => 
      node.id === selectedNode 
        ? { ...node, position: { x: newX, y: newY } }
        : node
    ))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add new node
  const addNode = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type)
    if (!nodeType) return

    let data: any = { label: nodeType.label }
    
    // Set appropriate data based on node type
    switch (type) {
      case 'input':
        data.source = 'New Source'
        break
      case 'ai-model':
        data.model = 'GPT-4'
        break
      case 'filter':
        data.condition = 'condition > 0'
        break
      case 'output':
        data.destination = 'New Destination'
        break
      default:
        data.value = ''
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 500, y: 300 },
      data,
      selected: false
    }
    setNodes([...nodes, newNode])
  }

  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return
    setNodes(nodes.filter(n => n.id !== selectedNode))
    setConnections(connections.filter(c => c.source !== selectedNode && c.target !== selectedNode))
    setSelectedNode(null)
  }

  // Render connection line
  const renderConnection = (connection: typeof initialConnections[0]) => {
    const sourceNode = nodes.find(n => n.id === connection.source)
    const targetNode = nodes.find(n => n.id === connection.target)
    if (!sourceNode || !targetNode) return null

    const x1 = sourceNode.position.x + 150
    const y1 = sourceNode.position.y + 40
    const x2 = targetNode.position.x
    const y2 = targetNode.position.y + 40

    return (
      <svg
        key={connection.id}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
        </defs>
        <path
          d={`M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          className="transition-all duration-200"
        />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Add Node:</span>
          {nodeTypes.map((nodeType) => {
            const Icon = nodeType.icon
            return (
              <motion.button
                key={nodeType.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addNode(nodeType.type)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                title={nodeType.description}
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </motion.button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          {selectedNode && (
            <>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={deleteSelectedNode}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative h-[600px] rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-5"
          style={{
            backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`
          }}
        />

        {/* Canvas content */}
        <div 
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left'
          }}
        >
          {/* Render connections */}
          {connections.map(renderConnection)}

          {/* Render nodes */}
          {nodes.map((node) => {
            const nodeType = nodeTypes.find(nt => nt.type === node.type)
            if (!nodeType) return null
            const Icon = nodeType.icon

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                  cursor: isDragging && selectedNode === node.id ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className={`
                  w-[150px] p-4 rounded-xl bg-white/5 border-2 transition-all
                  ${selectedNode === node.id 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                    : 'border-white/10 hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${nodeType.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white truncate">{node.data.label}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {node.data.source || node.data.model || node.data.condition || node.data.destination || 'Configure'}
                    </p>
                  </div>
                </div>

                {/* Node connectors */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-700 border-2 border-white/20 rounded-full" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-700 border-2 border-white/20 rounded-full" />
              </motion.div>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          <p>Drag nodes to move • Click to select • Delete key to remove</p>
        </div>
      </motion.div>
    </div>
  )
}