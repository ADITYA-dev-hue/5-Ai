import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Shuffle, 
  Bot, 
  Battery, 
  Trophy, 
  Footprints, 
  Sparkles, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle2, 
  Compass, 
  Terminal,
  Layers,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import { 
  initializeGrid, 
  stepSimulation, 
  DEFAULT_ENVIRONMENT 
} from '../lib/grid-simulation';
import { AGENT_REGISTRY } from '../data/agents';
import { 
  AgentRunResult, 
  AgentType, 
  Direction, 
  EnvironmentConfig, 
  GridSimulationState, 
  SimulationStepRecord 
} from '../types';

interface SimulationGridPageProps {
  environmentConfig: EnvironmentConfig;
  selectedAgentId: AgentType;
  onSelectAgent: (id: AgentType) => void;
  onRecordRun: (run: AgentRunResult) => void;
  onNavigateToComparison: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SimulationGridPage: React.FC<SimulationGridPageProps> = ({
  environmentConfig,
  selectedAgentId,
  onSelectAgent,
  onRecordRun,
  onNavigateToComparison,
  onShowToast,
}) => {
  const [simState, setSimState] = useState<GridSimulationState>(() => 
    initializeGrid(environmentConfig)
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(300); // ms per tick: 500ms (1x), 250ms (2x), 100ms (5x)
  const [records, setRecords] = useState<SimulationStepRecord[]>([]);

  const visitedSetRef = useRef<Set<string>>(new Set(['0,0']));
  const timerRef = useRef<any>(null);

  const activeAgent = AGENT_REGISTRY.find((a) => a.id === selectedAgentId) || AGENT_REGISTRY[0];

  // Reset simulation when environment or agent changes
  const resetSimulation = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    const fresh = initializeGrid(environmentConfig);
    setSimState(fresh);
    setRecords([]);
    visitedSetRef.current = new Set(['0,0']);
  };

  const randomizeGrid = () => {
    resetSimulation();
    onShowToast('Environment Randomized', 'Generated new dirt and obstacle distribution.', 'info');
  };

  // Single step forward
  const handleStep = () => {
    if (simState.status === 'completed' || simState.status === 'battery_depleted') {
      return;
    }

    visitedSetRef.current.add(`${simState.robotPos.x},${simState.robotPos.y}`);
    const { nextState, record } = stepSimulation(simState, selectedAgentId, visitedSetRef.current);
    setSimState(nextState);
    setRecords((prev) => [...prev, record]);

    // Check completion
    if (nextState.status === 'completed' || nextState.status === 'battery_depleted') {
      setIsPlaying(false);
      clearInterval(timerRef.current);

      const cleanPct = nextState.totalInitialDirt > 0 
        ? Math.round((nextState.dirtCleaned / nextState.totalInitialDirt) * 100) 
        : 100;

      const runResult: AgentRunResult = {
        id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        agentId: selectedAgentId,
        agentName: activeAgent.name,
        timestamp: new Date().toISOString(),
        environment: environmentConfig,
        stepsTaken: nextState.stepsTaken,
        dirtCleaned: nextState.dirtCleaned,
        totalDirt: nextState.totalInitialDirt,
        cleanPercentage: cleanPct,
        finalBattery: nextState.battery,
        finalScore: nextState.score,
        durationMs: nextState.stepsTaken * 42,
        status: cleanPct === 100 ? 'success' : nextState.battery <= 0 ? 'depleted' : 'partial',
        stepRecords: [],
      };

      onRecordRun(runResult);
      onShowToast(
        cleanPct === 100 ? 'Mission Accomplished!' : 'Battery Depleted',
        `${activeAgent.name} cleaned ${cleanPct}% dirt in ${nextState.stepsTaken} steps (Score: ${nextState.score}).`,
        cleanPct === 100 ? 'success' : 'warning'
      );
    }
  };

  // Play / Pause loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleStep();
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, simState, speed, selectedAgentId]);

  const cleanPercentage = simState.totalInitialDirt > 0
    ? Math.round((simState.dirtCleaned / simState.totalInitialDirt) * 100)
    : 100;

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Simulation Arena
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • 2D Vacuum Gridworld
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Interactive Gridworld Simulator
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Real-time animated vacuum world. Watch autonomous decision loops, sensor perception, dirt suction, and obstacle avoidance.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToComparison}
            className="btn-secondary h-11 px-5 rounded-xl font-medium flex items-center gap-2 text-sm border border-[rgba(255,138,50,0.22)] bg-[#17100B] hover:bg-[#21150E] text-[#F8F3EF]"
          >
            <BarChart3 className="w-4 h-4 text-[#FF8A32]" />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Agent Selector Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
        <span className="text-sm text-[#B6AAA0] font-medium mr-1 whitespace-nowrap">Active Topology:</span>
        {AGENT_REGISTRY.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <button
              key={agent.id}
              onClick={() => {
                onSelectAgent(agent.id);
                resetSimulation();
              }}
              className={`px-3.5 py-2 min-h-[40px] rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
                isSelected
                  ? 'bg-[#21150E] border-[#FF6A1A] text-[#F8F3EF] shadow-[0_0_14px_rgba(255,106,26,0.3)]'
                  : 'bg-[#17100B] border-[rgba(255,138,50,0.16)] text-[#B6AAA0] hover:text-[#F8F3EF] hover:border-[rgba(255,138,50,0.3)]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isSelected ? '#FF6A1A' : agent.color }}
              />
              <span>{agent.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid + Stats HUD Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Vacuum Grid + Control Toolbar */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card-primary p-6 rounded-2xl flex flex-col items-center">
            {/* Top Toolbar / Status */}
            <div className="w-full flex items-center justify-between pb-4 mb-5 border-b border-[rgba(255,138,50,0.16)] text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#F8F3EF]">{activeAgent.name}</span>
                <span className="badge badge-orange text-[10px]">{activeAgent.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  simState.status === 'running' 
                    ? 'bg-[#55D6A2] animate-pulse' 
                    : simState.status === 'completed'
                    ? 'bg-[#FF8A32]'
                    : simState.status === 'battery_depleted'
                    ? 'bg-[#FF6262]'
                    : 'bg-[#B6AAA0]'
                }`} />
                <span className="text-xs font-mono uppercase text-[#B6AAA0]">
                  {simState.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* The 2D Vacuum Grid Arena (Visual Centerpiece) */}
            <div 
              className="p-5 rounded-2xl bg-[#100A05] border-2 border-[rgba(255,138,50,0.24)] shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] select-none"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${environmentConfig.gridWidth}, minmax(0, 1fr))`,
                gap: '10px',
                width: '100%',
                maxWidth: '480px',
                aspectRatio: `${environmentConfig.gridWidth} / ${environmentConfig.gridHeight}`,
              }}
            >
              {simState.grid.map((row, y) =>
                row.map((cell, x) => {
                  const isRobotHere = simState.robotPos.x === x && simState.robotPos.y === y;
                  const isDirty = cell === 'dirty';
                  const isObstacle = cell === 'obstacle';
                  const isVisited = visitedSetRef.current.has(`${x},${y}`);

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`relative rounded-xl flex items-center justify-center border transition-all duration-180 ${
                        isObstacle
                          ? 'bg-[#21150E] border-[rgba(255,138,50,0.22)] shadow-inner'
                          : isRobotHere
                          ? 'bg-[#21150E] border-[#FF6A1A] ring-2 ring-[#FF6A1A]/40 shadow-glow'
                          : isDirty
                          ? 'bg-[#17100B] border-[rgba(255,138,50,0.38)]'
                          : isVisited
                          ? 'bg-[#17100B] border-[rgba(255,138,50,0.18)]'
                          : 'bg-[#17100B]/40 border-[rgba(255,138,50,0.08)]'
                      }`}
                    >
                      {/* Tile coordinates label */}
                      <span className="absolute top-1 left-1.5 text-[8.5px] font-mono text-[#81756C]/80">
                        {x},{y}
                      </span>

                      {/* Obstacle Representation */}
                      {isObstacle && (
                        <div className="flex flex-col items-center justify-center text-[#B6AAA0] text-[9.5px] font-mono select-none">
                          <span className="w-4 h-4 rounded bg-[#2B1D14] border border-[rgba(255,138,50,0.2)] flex items-center justify-center font-bold text-[#FF8A32]">#</span>
                        </div>
                      )}

                      {/* Dirt Indicator */}
                      {isDirty && !isRobotHere && (
                        <div className="flex flex-col items-center justify-center text-[#FF8A32] animate-pulse">
                          <Sparkles className="w-5 h-5 fill-[#FF8A32]/25" />
                          <span className="text-[8px] font-mono font-bold mt-0.5 tracking-wider">DIRT</span>
                        </div>
                      )}

                      {/* Robot Vacuum Representation */}
                      {isRobotHere && (
                        <div className="flex flex-col items-center justify-center z-10 animate-bounce">
                          <div className="w-10 h-10 rounded-full bg-[#FF6A1A]/20 border-2 border-[#FF6A1A] flex items-center justify-center text-[#FF8A32] shadow-glow relative">
                            <Bot className="w-5 h-5" />
                            {/* Heading arrow */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6A1A] text-[#090603] flex items-center justify-center text-[8.5px] font-bold shadow-sm">
                              {simState.robotDir === 'up' && <ArrowUp className="w-2.5 h-2.5 stroke-[3]" />}
                              {simState.robotDir === 'right' && <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />}
                              {simState.robotDir === 'down' && <ArrowDown className="w-2.5 h-2.5 stroke-[3]" />}
                              {simState.robotDir === 'left' && <ArrowLeft className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Compact Controls Toolbar */}
            <div className="w-full mt-6 pt-5 border-t border-[rgba(255,138,50,0.16)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {!isPlaying ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    disabled={simState.status === 'completed' || simState.status === 'battery_depleted'}
                    className="btn-accent text-sm min-h-[42px] flex items-center gap-2 py-2 px-4 disabled:opacity-50 font-semibold"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="btn-primary text-sm min-h-[42px] flex items-center gap-2 py-2 px-4 border-[#FF8A32] text-[#FF8A32]"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleStep}
                  disabled={isPlaying || simState.status === 'completed' || simState.status === 'battery_depleted'}
                  className="btn-secondary text-sm min-h-[42px] flex items-center gap-2 py-2 px-3.5 disabled:opacity-50"
                  title="Step forward one tick"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Step</span>
                </button>

                <button
                  onClick={resetSimulation}
                  className="btn-ghost text-sm min-h-[42px] flex items-center gap-2 py-2 px-3 text-[#B6AAA0] hover:text-[#F8F3EF]"
                  title="Reset positions and clean count"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={randomizeGrid}
                  className="btn-ghost text-sm min-h-[42px] flex items-center gap-2 py-2 px-3 text-[#B6AAA0] hover:text-[#F8F3EF]"
                  title="Randomize dirt and obstacles"
                >
                  <Shuffle className="w-4 h-4 text-[#FF8A32]" />
                  <span>Randomize</span>
                </button>
              </div>

              {/* Speed segmented control */}
              <div className="flex items-center gap-1.5 bg-[#100A05] p-1.5 rounded-xl border border-[rgba(255,138,50,0.18)] text-xs">
                <span className="text-xs text-[#81756C] px-2 font-mono">Speed:</span>
                {[
                  { label: '1x', val: 500 },
                  { label: '2x', val: 250 },
                  { label: '5x', val: 100 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSpeed(s.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      speed === s.val
                        ? 'bg-[#FF6A1A] text-[#090603] font-bold shadow-sm'
                        : 'text-[#B6AAA0] hover:text-[#F8F3EF]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Decision Stream */}
        <div className="lg:col-span-4 space-y-4">
          {/* Visual KPI Mini HUD */}
          <div className="card-primary p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#F8F3EF] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#FF6A1A]" />
              <span>Real-Time Telemetry</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.16)]">
                <div className="flex items-center justify-between text-[#81756C] text-xs mb-1.5 font-medium">
                  <span>Clean Rate</span>
                  <CheckCircle2 className="w-4 h-4 text-[#55D6A2]" />
                </div>
                <div className="font-mono text-2xl font-bold text-[#55D6A2]">
                  {cleanPercentage}%
                </div>
                <div className="w-full bg-[#17100B] h-2 rounded-full overflow-hidden mt-2.5 border border-[rgba(255,138,50,0.16)]">
                  <div
                    className="bg-[#55D6A2] h-full transition-all duration-200"
                    style={{ width: `${cleanPercentage}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.16)]">
                <div className="flex items-center justify-between text-[#81756C] text-xs mb-1.5 font-medium">
                  <span>Battery</span>
                  <Battery className={`w-4 h-4 ${simState.battery > 30 ? 'text-[#FF8A32]' : 'text-[#FF6262]'}`} />
                </div>
                <div className={`font-mono text-2xl font-bold ${simState.battery > 30 ? 'text-[#FF8A32]' : 'text-[#FF6262]'}`}>
                  {simState.battery}%
                </div>
                <div className="w-full bg-[#17100B] h-2 rounded-full overflow-hidden mt-2.5 border border-[rgba(255,138,50,0.16)]">
                  <div
                    className={`h-full transition-all duration-200 ${simState.battery > 30 ? 'bg-[#FF8A32]' : 'bg-[#FF6262]'}`}
                    style={{ width: `${simState.battery}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.16)]">
                <div className="flex items-center justify-between text-[#81756C] text-xs mb-1.5 font-medium">
                  <span>Score</span>
                  <Trophy className="w-4 h-4 text-[#FF6A1A]" />
                </div>
                <div className="font-mono text-2xl font-bold text-[#FF6A1A]">
                  {simState.score} pts
                </div>
                <span className="text-xs text-[#81756C] block mt-1">+10 clean, -1 move</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.16)]">
                <div className="flex items-center justify-between text-[#81756C] text-xs mb-1.5 font-medium">
                  <span>Steps</span>
                  <Footprints className="w-4 h-4 text-[#FF8A32]" />
                </div>
                <div className="font-mono text-2xl font-bold text-[#F8F3EF]">
                  {simState.stepsTaken}
                </div>
                <span className="text-xs text-[#81756C] block mt-1">At ({simState.robotPos.x},{simState.robotPos.y})</span>
              </div>
            </div>
          </div>

          {/* Decision Stream Feed */}
          <div className="card-primary p-6 rounded-2xl flex flex-col h-[300px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(255,138,50,0.16)] text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#FF6A1A]" />
                <span className="font-semibold text-sm text-[#F8F3EF]">Agent Perception Stream</span>
              </div>
              <span className="text-xs font-mono text-[#81756C]">{simState.historyLog.length} events</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs sm:text-[13px] font-mono pr-1 scrollbar-thin">
              {simState.historyLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.12)] text-[#B6AAA0] leading-relaxed"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
