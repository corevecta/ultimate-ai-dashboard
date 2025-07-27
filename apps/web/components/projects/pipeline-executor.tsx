'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Loader2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  PlayCircle,
  SkipForward,
  FileText,
  Code,
  Cog,
  GitBranch,
  Terminal,
  Package,
  Rocket,
  Shield,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PipelineExecutorProps {
  projectId: string
  projectName: string
  projectType: string
  onClose?: () => void
}

interface PipelineStep {
  id: string
  name: string
  description: string
  icon: any
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  output?: string
  error?: string
  startTime?: Date
  endTime?: Date
  canRerun: boolean
  canSkip: boolean
  jobId?: string
}

const PIPELINE_STEPS: Omit<PipelineStep, 'status' | 'output' | 'error' | 'startTime' | 'endTime' | 'jobId'>[] = [
  {
    id: 'step0',
    name: 'Requirements',
    description: 'Generate comprehensive project requirements',
    icon: FileText,
    canRerun: true,
    canSkip: false
  },
  {
    id: 'step1',
    name: 'Specification',
    description: 'Create detailed technical specifications',
    icon: Code,
    canRerun: true,
    canSkip: false
  },
  {
    id: 'step2',
    name: 'Architecture',
    description: 'Design system architecture and tech stack',
    icon: GitBranch,
    canRerun: true,
    canSkip: false
  },
  {
    id: 'step3',
    name: 'Setup',
    description: 'Initialize project structure and dependencies',
    icon: Cog,
    canRerun: true,
    canSkip: false
  },
  {
    id: 'step4',
    name: 'Development',
    description: 'Generate core application code',
    icon: Terminal,
    canRerun: true,
    canSkip: false
  },
  {
    id: 'step5',
    name: 'Testing',
    description: 'Create comprehensive test suites',
    icon: Shield,
    canRerun: true,
    canSkip: true
  },
  {
    id: 'step6',
    name: 'Documentation',
    description: 'Generate project documentation',
    icon: FileText,
    canRerun: true,
    canSkip: true
  },
  {
    id: 'step7',
    name: 'Deployment',
    description: 'Setup deployment configurations',
    icon: Rocket,
    canRerun: true,
    canSkip: true
  },
  {
    id: 'step8',
    name: 'Optimization',
    description: 'Performance and security optimizations',
    icon: TrendingUp,
    canRerun: true,
    canSkip: true
  }
]

export default function PipelineExecutor({ projectId, projectName, projectType, onClose }: PipelineExecutorProps) {
  const [steps, setSteps] = useState<PipelineStep[]>(() =>
    PIPELINE_STEPS.map(step => ({ ...step, status: 'pending' as const }))
  )
  const [activeStep, setActiveStep] = useState(0)
  const [isPolling, setIsPolling] = useState(false)
  const [pollInterval, setPollInterval] = useState<NodeJS.Timer | null>(null)

  // Load pipeline status on mount
  useEffect(() => {
    loadPipelineStatus()
  }, [projectId])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [pollInterval])

  const loadPipelineStatus = async () => {
    try {
      const response = await fetch(`/api/pipeline/status/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        updateStepsFromStatus(data)
      }
    } catch (error) {
      console.error('Failed to load pipeline status:', error)
    }
  }

  const updateStepsFromStatus = (statusData: any) => {
    setSteps(prevSteps => {
      return prevSteps.map(step => {
        const stepStatus = statusData[step.id]
        if (stepStatus) {
          return {
            ...step,
            status: stepStatus.status,
            output: stepStatus.output,
            error: stepStatus.error,
            startTime: stepStatus.startTime ? new Date(stepStatus.startTime) : undefined,
            endTime: stepStatus.endTime ? new Date(stepStatus.endTime) : undefined,
            jobId: stepStatus.jobId
          }
        }
        return step
      })
    })

    // Find the current active step
    const currentStepIndex = prevSteps.findIndex(s => 
      s.status === 'running' || (s.status === 'pending' && prevSteps.findIndex(ps => ps.status === 'pending') === prevSteps.indexOf(s))
    )
    if (currentStepIndex >= 0) {
      setActiveStep(currentStepIndex)
    }
  }

  const runStep = async (stepIndex: number, forceRerun: boolean = false) => {
    const step = steps[stepIndex]
    
    // Update step status to running
    setSteps(prev => {
      const newSteps = [...prev]
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status: 'running',
        startTime: new Date(),
        error: undefined
      }
      return newSteps
    })

    try {
      // Prepare context from all previous steps
      const context = {
        projectId,
        projectName,
        projectType,
        previousSteps: steps.slice(0, stepIndex).reduce((acc, s) => ({
          ...acc,
          [s.id]: {
            output: s.output,
            completedAt: s.endTime
          }
        }), {}),
        forceRegenerate: forceRerun
      }

      // Call the orchestrator for this step
      const response = await fetch(`/api/orchestrator/${step.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      })

      if (!response.ok) {
        throw new Error(`Failed to execute ${step.name}`)
      }

      const data = await response.json()

      // If we got a job ID, start polling
      if (data.jobId && !data.output) {
        setSteps(prev => {
          const newSteps = [...prev]
          newSteps[stepIndex] = {
            ...newSteps[stepIndex],
            jobId: data.jobId
          }
          return newSteps
        })
        startPollingForStep(stepIndex, data.jobId)
      } else {
        // Direct response
        handleStepCompletion(stepIndex, data.output)
      }
    } catch (error: any) {
      setSteps(prev => {
        const newSteps = [...prev]
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          status: 'failed',
          error: error.message,
          endTime: new Date()
        }
        return newSteps
      })
    }
  }

  const startPollingForStep = (stepIndex: number, jobId: string) => {
    setIsPolling(true)
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orchestrator/${steps[stepIndex].id}?jobId=${jobId}`)
        if (!response.ok) {
          throw new Error('Failed to check job status')
        }

        const data = await response.json()

        if (data.status === 'completed') {
          clearInterval(interval)
          setPollInterval(null)
          setIsPolling(false)
          handleStepCompletion(stepIndex, data.output || data.requirements || data.specification)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setPollInterval(null)
          setIsPolling(false)
          handleStepFailure(stepIndex, data.error)
        }
      } catch (error: any) {
        clearInterval(interval)
        setPollInterval(null)
        setIsPolling(false)
        handleStepFailure(stepIndex, error.message)
      }
    }, 2000)

    setPollInterval(interval)
  }

  const handleStepCompletion = (stepIndex: number, output: string) => {
    setSteps(prev => {
      const newSteps = [...prev]
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status: 'completed',
        output,
        endTime: new Date()
      }
      return newSteps
    })

    // Automatically move to next step if available
    if (stepIndex < steps.length - 1) {
      setActiveStep(stepIndex + 1)
    }
  }

  const handleStepFailure = (stepIndex: number, error: string) => {
    setSteps(prev => {
      const newSteps = [...prev]
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status: 'failed',
        error,
        endTime: new Date()
      }
      return newSteps
    })
  }

  const skipStep = (stepIndex: number) => {
    setSteps(prev => {
      const newSteps = [...prev]
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status: 'skipped'
      }
      return newSteps
    })

    // Move to next step
    if (stepIndex < steps.length - 1) {
      setActiveStep(stepIndex + 1)
    }
  }

  const getStepIcon = (step: PipelineStep) => {
    const Icon = step.icon
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'skipped':
        return <SkipForward className="w-5 h-5 text-gray-400" />
      default:
        return <Icon className="w-5 h-5 text-gray-400" />
    }
  }

  const canRunStep = (stepIndex: number) => {
    if (stepIndex === 0) return true
    
    // Check if all previous required steps are completed
    const previousSteps = steps.slice(0, stepIndex)
    return previousSteps.every(s => s.status === 'completed' || s.status === 'skipped')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Pipeline Execution
          </h2>
          <p className="text-gray-400 mt-1">
            {projectName} • {projectType}
          </p>
        </div>
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            Close
          </Button>
        )}
      </div>

      {/* Pipeline Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps List */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Pipeline Steps</CardTitle>
              <CardDescription>
                Click on a step to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                      activeStep === index
                        ? "bg-gray-800 border border-gray-700"
                        : "hover:bg-gray-800/50"
                    )}
                  >
                    {getStepIcon(step)}
                    <div className="flex-1">
                      <div className="font-medium">{step.name}</div>
                      <div className="text-xs text-gray-400">
                        {step.description}
                      </div>
                    </div>
                    {step.status === 'running' && (
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        Running
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Details */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStepIcon(steps[activeStep])}
                    {steps[activeStep].name}
                  </CardTitle>
                  <CardDescription>
                    {steps[activeStep].description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {steps[activeStep].status === 'completed' && steps[activeStep].canRerun && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runStep(activeStep, true)}
                      disabled={isPolling}
                      className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-run
                    </Button>
                  )}
                  {steps[activeStep].status === 'pending' && canRunStep(activeStep) && (
                    <Button
                      size="sm"
                      onClick={() => runStep(activeStep)}
                      disabled={isPolling}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Run Step
                    </Button>
                  )}
                  {steps[activeStep].status === 'pending' && steps[activeStep].canSkip && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => skipStep(activeStep)}
                      className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                  )}
                  {steps[activeStep].status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runStep(activeStep, true)}
                      disabled={isPolling}
                      className="bg-red-900/20 border-red-800 hover:bg-red-900/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="context">Context</TabsTrigger>
                </TabsList>
                
                <TabsContent value="output" className="mt-4">
                  {steps[activeStep].status === 'pending' && !canRunStep(activeStep) && (
                    <Alert className="bg-yellow-900/20 border-yellow-800">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-400">
                        Previous steps must be completed before running this step
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {steps[activeStep].status === 'running' && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                      <p className="text-gray-400">Processing step...</p>
                      {steps[activeStep].jobId && (
                        <p className="text-xs text-gray-500">
                          Job ID: {steps[activeStep].jobId}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {steps[activeStep].status === 'completed' && steps[activeStep].output && (
                    <ScrollArea className="h-[400px] rounded-lg border border-gray-700 bg-gray-800 p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                        {steps[activeStep].output}
                      </pre>
                    </ScrollArea>
                  )}
                  
                  {steps[activeStep].status === 'failed' && (
                    <Alert className="bg-red-900/20 border-red-800">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-400">
                        {steps[activeStep].error || 'Step execution failed'}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {steps[activeStep].status === 'skipped' && (
                    <Alert className="bg-gray-800 border-gray-700">
                      <SkipForward className="h-4 w-4 text-gray-400" />
                      <AlertDescription className="text-gray-400">
                        This step was skipped
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                
                <TabsContent value="logs" className="mt-4">
                  <ScrollArea className="h-[400px] rounded-lg border border-gray-700 bg-gray-800 p-4">
                    {steps[activeStep].startTime && (
                      <div className="space-y-2 text-sm font-mono">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          Started: {steps[activeStep].startTime.toLocaleString()}
                        </div>
                        {steps[activeStep].endTime && (
                          <>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="w-4 h-4" />
                              Ended: {steps[activeStep].endTime.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="w-4 h-4" />
                              Duration: {Math.round((steps[activeStep].endTime!.getTime() - steps[activeStep].startTime!.getTime()) / 1000)}s
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="context" className="mt-4">
                  <ScrollArea className="h-[400px] rounded-lg border border-gray-700 bg-gray-800 p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2">Project Context</h4>
                        <div className="space-y-1 text-sm text-gray-400">
                          <div>ID: {projectId}</div>
                          <div>Name: {projectName}</div>
                          <div>Type: {projectType}</div>
                        </div>
                      </div>
                      
                      {activeStep > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-2">Previous Steps</h4>
                          <div className="space-y-2">
                            {steps.slice(0, activeStep).map((step, idx) => (
                              <div key={step.id} className="text-sm">
                                <div className="flex items-center gap-2">
                                  {getStepIcon(step)}
                                  <span className="text-gray-400">{step.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}