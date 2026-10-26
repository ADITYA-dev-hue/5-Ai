import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Clock, 
  Cpu, 
  Coins, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Terminal, 
  Wrench,
  Bot,
  Zap,
  BarChart3
} from 'lucide-react';
import { ARCHITECTURES } from '../data/architectures';
import { BENCHMARK_TASKS } from '../data/benchmarkTasks';
import { executeArchitectureSimulation } from '../lib/simulation-engine';
import { 
  Architecture, 
  ArchitectureId, 
  BenchmarkTask, 
  ExperimentRun, 
  SimulationStep 
} from '../types';

interface SimulationPageProps {
  initialArchId?: ArchitectureId;
  initialPrompt?: string;
  onExperimentComplete: (run: ExperimentRun) => void;
  onNavigateToBenchmarks: () => void;
}

export const SimulationPage: React.FC<SimulationPageProps> = ({
  initialArchId = 'hierarchical_router',
  initialPrompt,
  onExperimentComplete,
  onNavigateToBenchmarks,
}) => {
  const [selectedArchId, setSelectedArchId] = useState<ArchitectureId>(initialArchId);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(BENCHMARK_TASKS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>(
    initialPrompt || BENCHMARK_TASKS[0].prompt
  );
  const [isCustomMode, setIsCustomMode] = useState<boolean>(Boolean(initialPrompt));

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeSteps, setActiveSteps] = useState<SimulationStep[]>([]);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [completedRun, setCompletedRun] = useState<ExperimentRun | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedArch = ARCHITECTURES.find((a) => a.id === selectedArchId) || ARCHITECTURES[0];
  const selectedTask = BENCHMARK_TASKS.find((t) => t.id === selectedTaskId) || BENCHMARK_TASKS[0];

  const handleTaskChange = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsCustomMode(false);
    const task = BENCHMARK_TASKS.find((t) => t.id === taskId);
    if (task) {
      setCustomPrompt(task.prompt);
    }
  };

  const handleStartSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setActiveSteps([]);
    setCompletedRun(null);
    setProgress({ current: 0, total: 6 });

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const activePrompt = customPrompt.trim() || selectedTask.prompt;
      const run = await executeArchitectureSimulation(
        selectedArch,
        activePrompt,
        isCustomMode ? 'custom-task' : selectedTask.id,
        isCustomMode ? 'Custom Laboratory Task' : selectedTask.title,
        selectedArch.defaultConfig,
        (step, index, total) => {
          setActiveSteps((prev) => [...prev, step]);
          setProgress({ current: index, total });
        },
        abortController.signal
      );

      setCompletedRun(run);
      onExperimentComplete(run);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopSimulation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    setActiveSteps([]);
    setProgress({ current: 0, total: 0 });
    setCompletedRun(null);
  };

  // Run all 4 architectures sequentially for head-to-head benchmarking
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const handleRunAllArchitectures = async () => {
    if (isRunning || isBatchRunning) return;
    setIsBatchRunning(true);

    for (const arch of ARCHITECTURES) {
      setSelectedArchId(arch.id);
      setActiveSteps([]);
      const activePrompt = customPrompt.trim() || selectedTask.prompt;
      const run = await executeArchitectureSimulation(
        arch,
        activePrompt,
        isCustomMode ? 'custom-task' : selectedTask.id,
        isCustomMode ? 'Custom Laboratory Task' : selectedTask.title,
        arch.defaultConfig,
        (step, index, total) => {
          setActiveSteps((prev) => [...prev, step]);
          setProgress({ current: index, total });
        }
      );
      onExperimentComplete(run);
      setCompletedRun(run);
    }

    setIsBatchRunning(false);
  };

  return (
    <div className="lab-container py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#29313F] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-blue">Simulation Studio</span>
            <span className="text-caption">• Step-by-Step Multi-Agent Execution</span>
          </div>
          <h1 className="heading-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F6FA]">
            Multi-Agent Execution Runner
          </h1>
          <p className="text-body max-w-2xl text-sm sm:text-base text-[#A7B0C0] mt-1.5">
            Execute real-time agent workloads across selected architectures. Observe thought generation, tool dispatch, verification barriers, token consumption, and latency metrics live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunAllArchitectures}
            disabled={isRunning || isBatchRunning}
            className="btn-secondary text-xs flex items-center gap-2 disabled:opacity-50"
            title="Execute all 4 architectures on this task to populate comparative benchmark charts"
          >
            <Layers className="w-4 h-4 text-[#9C86CE]" />
            <span>{isBatchRunning ? 'Running Benchmark Suite...' : 'Benchmark All 4 Topologies'}</span>
          </button>

          {!isRunning ? (
            <button
              onClick={handleStartSimulation}
              disabled={isBatchRunning}
              className="btn-accent text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Simulation</span>
            </button>
          ) : (
            <button
              onClick={handleStopSimulation}
              className="btn-primary text-sm flex items-center gap-2 border-[#EF4444] text-[#EF4444]"
            >
              <Pause className="w-4 h-4" />
              <span>Stop Execution</span>
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isRunning || isBatchRunning}
            className="btn-ghost p-2 text-[#A7B0C0] hover:text-[#F5F6FA] disabled:opacity-50"
            title="Reset simulation trace"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Task & Architecture Pickers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-primary p-6 rounded-xl border border-[#29313F] space-y-5">
            <h3 className="heading-card text-sm font-semibold text-[#F5F6FA] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8CB8FF]" />
              <span>Experiment Parameters</span>
            </h3>

            {/* Architecture Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F5F6FA]">Agent Architecture</label>
              <select
                value={selectedArchId}
                onChange={(e) => setSelectedArchId(e.target.value as ArchitectureId)}
                disabled={isRunning || isBatchRunning}
                className="select-field text-xs bg-[#171C25] border-[#29313F] text-[#F5F6FA] rounded-lg"
              >
                {ARCHITECTURES.map((arch) => (
                  <option key={arch.id} value={arch.id}>
                    {arch.name} ({arch.badge})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#A7B0C0]">{selectedArch.tagline}</p>
            </div>

            {/* Task Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-[#F5F6FA]">Benchmark Task</label>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="text-[11px] text-[#8CB8FF] hover:underline"
                >
                  {isCustomMode ? 'Use Preset Task' : 'Custom Prompt'}
                </button>
              </div>

              {!isCustomMode ? (
                <select
                  value={selectedTaskId}
                  onChange={(e) => handleTaskChange(e.target.value)}
                  disabled={isRunning || isBatchRunning}
                  className="select-field text-xs bg-[#171C25] border-[#29313F] text-[#F5F6FA] rounded-lg"
                >
                  {BENCHMARK_TASKS.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title} [{task.category}]
                    </option>
                  ))}
                </select>
              ) : (
                <span className="badge badge-purple text-[10px]">Custom Task Input</span>
              )}
            </div>

            {/* Prompt Preview / Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F5F6FA]">Task Prompt & Directives</label>
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  setIsCustomMode(true);
                }}
                disabled={isRunning || isBatchRunning}
                rows={4}
                className="textarea-field text-xs bg-[#0A0D12] border-[#29313F] text-[#F5F6FA] rounded-lg resize-none font-mono"
                placeholder="Enter prompt or description..."
              />
            </div>

            {/* Quick Metrics Live HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#29313F]">
              <div className="p-2.5 rounded-lg bg-[#0A0D12] border border-[#29313F]">
                <span className="text-[10px] text-[#A7B0C0] block">Steps</span>
                <span className="font-mono text-sm font-semibold text-[#F5F6FA]">
                  {progress.current}/{progress.total || selectedArch.nodes.length + 3}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0D12] border border-[#29313F]">
                <span className="text-[10px] text-[#A7B0C0] block">Tokens</span>
                <span className="font-mono text-sm font-semibold text-[#8CB8FF]">
                  {activeSteps.reduce((acc, s) => acc + s.tokens.total, 0)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0D12] border border-[#29313F]">
                <span className="text-[10px] text-[#A7B0C0] block">Latency</span>
                <span className="font-mono text-sm font-semibold text-[#22C997]">
                  {activeSteps.reduce((acc, s) => acc + s.durationMs, 0)}ms
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0D12] border border-[#29313F]">
                <span className="text-[10px] text-[#A7B0C0] block">Est. Cost</span>
                <span className="font-mono text-sm font-semibold text-[#9C86CE]">
                  ${((activeSteps.reduce((acc, s) => acc + s.tokens.total, 0) / 1_000_000) * 0.35).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Execution Trace Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card-primary p-6 rounded-xl border border-[#29313F] min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#29313F]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#22C997]" />
                <h3 className="heading-card text-sm font-semibold text-[#F5F6FA]">
                  Execution Stream & Agent Thoughts
                </h3>
              </div>
              {isRunning && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#8CB8FF]">
                  <span className="w-2 h-2 rounded-full bg-[#8CB8FF] animate-ping" />
                  <span>Synthesizing...</span>
                </div>
              )}
            </div>

            {/* Trace List or Empty State */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[550px] pr-1">
              {activeSteps.length === 0 && !isRunning && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#A7B0C0]">
                  <Bot className="w-10 h-10 text-[#6E798E] mb-3 stroke-1" />
                  <p className="text-sm font-medium text-[#F5F6FA]">Ready to Execute</p>
                  <p className="text-xs text-[#A7B0C0] max-w-sm mt-1">
                    Select an architecture and click "Start Simulation" to stream live thoughts, actions, tool invocations, and handoffs.
                  </p>
                </div>
              )}

              {activeSteps.map((step) => {
                const isCritique = step.phase === 'critique';
                const isSynthesis = step.phase === 'synthesis';
                const hasTool = Boolean(step.toolCall);

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all text-xs ${
                      isCritique
                        ? 'bg-[#1D2430] border-[#F59E0B]/50'
                        : isSynthesis
                        ? 'bg-[#1D2430] border-[#22C997]/50'
                        : 'bg-[#171C25] border-[#29313F]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1D2430] border border-[#29313F] text-[10px] font-mono flex items-center justify-center text-[#F5F6FA]">
                          {step.stepNumber}
                        </span>
                        <span className="font-semibold text-[#F5F6FA]">{step.nodeName}</span>
                        <span className={`badge ${
                          isCritique ? 'badge-amber' : isSynthesis ? 'badge-green' : 'badge-neutral'
                        } text-[9px] uppercase font-mono`}>
                          {step.phase}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#A7B0C0]">
                        <span>{step.durationMs}ms</span>
                        <span>•</span>
                        <span>{step.tokens.total} tok</span>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-[#A7B0C0] leading-relaxed text-xs">
                      {step.content}
                    </p>

                    {/* Tool Call Sub-Card */}
                    {hasTool && step.toolCall && (
                      <div className="mt-3 p-3 rounded-lg bg-[#0A0D12] border border-[#29313F] space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#8CB8FF]">
                          <Wrench className="w-3.5 h-3.5" />
                          <span className="font-semibold">{step.toolCall.name}</span>
                        </div>
                        <div className="text-[#A7B0C0] text-[10px] break-all">
                          <span className="text-[#6E798E]">Args: </span>
                          {typeof step.toolCall.args === 'string'
                            ? step.toolCall.args
                            : JSON.stringify(step.toolCall.args)}
                        </div>
                        <div className="text-[#22C997] text-[10px] pt-1 border-t border-[#29313F]/60">
                          <span className="text-[#6E798E]">Output: </span>
                          {step.toolCall.output}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Run Completion Banner */}
            {completedRun && (
              <div className="mt-4 p-4 rounded-xl bg-[#1D2430] border border-[#22C997]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#22C997]" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#F5F6FA]">
                      Simulation Completed Successfully
                    </h4>
                    <p className="text-[11px] text-[#A7B0C0]">
                      Accuracy: <span className="font-mono text-[#22C997] font-semibold">{completedRun.metrics.accuracyScore}%</span> • 
                      Duration: <span className="font-mono text-[#F5F6FA]">{completedRun.metrics.totalDurationMs}ms</span> • 
                      Tokens: <span className="font-mono text-[#8CB8FF]">{completedRun.metrics.totalTokens}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={onNavigateToBenchmarks}
                  className="btn-accent text-xs flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Benchmarks Dashboard</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
