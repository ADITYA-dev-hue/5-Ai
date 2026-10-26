import React from 'react';
import { 
  PlayCircle, 
  Bot, 
  BarChart3, 
  Sliders, 
  Zap, 
  Target, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Battery, 
  ChevronRight,
  FlaskConical,
  LineChart,
  FileText,
  Compass,
  Layers,
  Footprints,
  Activity,
  Trophy,
  Scale,
  Cpu,
  ShieldAlert,
  Play
} from 'lucide-react';
import { AGENT_REGISTRY } from '../data/agents';
import { ActivePage, AgentRunResult, AgentType, EnvironmentConfig } from '../types';

interface DashboardPageProps {
  runs: AgentRunResult[];
  environment: EnvironmentConfig;
  onNavigate: (page: ActivePage) => void;
  onSelectAgentForSim: (agentId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  runs,
  environment,
  onNavigate,
  onSelectAgentForSim,
}) => {
  const totalRuns = runs.length;
  const avgCleanRate = totalRuns > 0
    ? Math.round(runs.reduce((sum, r) => sum + r.cleanPercentage, 0) / totalRuns)
    : 0;
  const avgSteps = totalRuns > 0
    ? Math.round(runs.reduce((sum, r) => sum + r.stepsTaken, 0) / totalRuns)
    : 0;
  const avgBatteryRemaining = totalRuns > 0
    ? Math.round(runs.reduce((sum, r) => sum + r.finalBattery, 0) / totalRuns)
    : 0;

  // Best performing agent based on empirical score
  const topRun = runs.length > 0
    ? [...runs].sort((a, b) => b.finalScore - a.finalScore)[0]
    : null;

  // Group latest run per agent for empirical rankings
  const latestRunsByAgent: Record<string, AgentRunResult> = {};
  runs.forEach((r) => {
    if (!latestRunsByAgent[r.agentId] || new Date(r.timestamp) > new Date(latestRunsByAgent[r.agentId].timestamp)) {
      latestRunsByAgent[r.agentId] = r;
    }
  });

  const rankedRuns = Object.values(latestRunsByAgent).sort(
    (a, b) => b.finalScore - a.finalScore
  );

  // Helper for agent icon mapping
  const getAgentIcon = (id: AgentType) => {
    switch (id) {
      case 'simple_reflex': return Zap;
      case 'model_based': return Cpu;
      case 'goal_based': return Target;
      case 'utility_based': return Scale;
      case 'learning_cognitive': return Sparkles;
      default: return Bot;
    }
  };

  // 8 Dedicated Laboratory Modules
  const LABORATORY_MODULES = [
    {
      id: 'simulation',
      title: 'Live Simulation',
      description: 'Interactive 2D vacuum world grid with real-time actuation and sensor telemetry.',
      icon: PlayCircle,
      page: 'simulation' as ActivePage,
    },
    {
      id: 'agents',
      title: 'Agent Architectures',
      description: 'In-depth structural breakdown of state representation, logic, and decision rules.',
      icon: Cpu,
      page: 'agents' as ActivePage,
    },
    {
      id: 'comparison',
      title: 'Agent Comparison',
      description: 'Head-to-head leaderboard ranking agents by efficiency, speed, and energy conservation.',
      icon: BarChart3,
      page: 'comparison' as ActivePage,
    },
    {
      id: 'environment',
      title: 'Environment Configuration',
      description: 'Fine-tune grid dimensions, dirt contamination, obstacles, and observability.',
      icon: Sliders,
      page: 'environment' as ActivePage,
    },
    {
      id: 'peas',
      title: 'PEAS Specifications',
      description: 'Formal Russell & Norvig breakdown of Performance, Environment, Actuators, and Sensors.',
      icon: Layers,
      page: 'peas' as ActivePage,
    },
    {
      id: 'experiments',
      title: 'Experiment Runner',
      description: 'Step-based batch protocol wizard for multi-agent cohorts and reproducible trials.',
      icon: FlaskConical,
      page: 'experiments' as ActivePage,
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      description: 'Statistical visualization studio for Pareto frontiers, cleaning efficacy, and radar topologies.',
      icon: LineChart,
      page: 'analytics' as ActivePage,
    },
    {
      id: 'reports',
      title: 'Research Reports',
      description: 'Export comprehensive empirical benchmark reports in JSON, CSV, or presentation PDF.',
      icon: FileText,
      page: 'reports' as ActivePage,
    },
  ];

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 sm:space-y-9 animate-fadeIn text-[#F8F3EF]">
      
      {/* =========================================================================
          1. PAGE HEADER
          ========================================================================= */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Overview
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              Project 34 Laboratory
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Agent Architecture Laboratory
          </h1>

          <p className="text-sm sm:text-base text-[#B6AAA0] max-w-2xl leading-relaxed">
            Empirical comparative benchmark studio for autonomous agent architectures.
          </p>
        </div>

        {/* Action Buttons: Stack on small screens, side-by-side on desktop */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={() => onNavigate('simulation')}
            className="btn-accent h-11 sm:h-12 px-5 sm:px-6 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-[0_4px_18px_rgba(255,106,26,0.35)] w-full sm:w-auto justify-center"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Launch Simulation</span>
          </button>

          <button
            onClick={() => onNavigate('comparison')}
            className="btn-secondary h-11 sm:h-12 px-5 sm:px-6 rounded-xl font-medium flex items-center gap-2 text-sm border border-[rgba(255,138,50,0.22)] bg-[#17100B] hover:bg-[#21150E] text-[#F8F3EF] w-full sm:w-auto justify-center"
          >
            <BarChart3 className="w-4 h-4 text-[#FF8A32]" />
            <span>Compare Agents</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. PERFORMANCE OVERVIEW (4 SUMMARY CARDS)
          ========================================================================= */}
      <section className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Agent Architectures */}
          <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-5 sm:p-6 min-h-[125px] flex flex-col justify-between hover:border-[#FF6A1A]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-medium text-[#B6AAA0]">Agent Architectures</span>
              <div className="w-8 h-8 rounded-lg bg-[rgba(255,106,26,0.12)] border border-[rgba(255,138,50,0.25)] flex items-center justify-center text-[#FF8A32]">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F8F3EF] tracking-tight">
                5 Active
              </div>
              <p className="text-xs text-[#81756C] mt-1">
                Russell & Norvig cognitive topologies
              </p>
            </div>
          </div>

          {/* Card 2: Episodes Executed */}
          <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-5 sm:p-6 min-h-[125px] flex flex-col justify-between hover:border-[#FF6A1A]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-medium text-[#B6AAA0]">Episodes Executed</span>
              <div className="w-8 h-8 rounded-lg bg-[rgba(255,106,26,0.12)] border border-[rgba(255,138,50,0.25)] flex items-center justify-center text-[#FF8A32]">
                <FlaskConical className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F8F3EF] tracking-tight">
                {totalRuns > 0 ? `${totalRuns} Trials` : '0 Trials'}
              </div>
              <p className="text-xs text-[#81756C] mt-1">
                {totalRuns > 0 ? 'Empirical trials recorded' : 'Awaiting initial simulation run'}
              </p>
            </div>
          </div>

          {/* Card 3: Average Cleaning Efficiency */}
          <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-5 sm:p-6 min-h-[125px] flex flex-col justify-between hover:border-[#55D6A2]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-medium text-[#B6AAA0]">Average Cleaning Efficiency</span>
              <div className="w-8 h-8 rounded-lg bg-[rgba(85,214,162,0.12)] border border-[rgba(85,214,162,0.28)] flex items-center justify-center text-[#55D6A2]">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#55D6A2] tracking-tight">
                {totalRuns > 0 ? `${avgCleanRate}%` : '—'}
              </div>
              <p className="text-xs text-[#81756C] mt-1">
                {totalRuns > 0 ? 'Measured task dirt collection' : 'Awaiting benchmark run'}
              </p>
            </div>
          </div>

          {/* Card 4: Top Performer */}
          <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-5 sm:p-6 min-h-[125px] flex flex-col justify-between hover:border-[#FF8A32]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-medium text-[#B6AAA0]">Top Performer</span>
              <div className="w-8 h-8 rounded-lg bg-[rgba(255,106,26,0.12)] border border-[rgba(255,138,50,0.25)] flex items-center justify-center text-[#FF8A32]">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#FF8A32] truncate tracking-tight">
                {topRun ? topRun.agentName : 'None Recorded'}
              </div>
              <p className="text-xs text-[#81756C] mt-1 truncate">
                {topRun ? `Rank #1 (${topRun.finalScore} utility pts)` : 'Run showdown to benchmark'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FIVE AGENT ARCHITECTURES
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8F3EF] tracking-tight">
              Five Agent Architectures
            </h2>
            <p className="text-xs sm:text-sm text-[#B6AAA0] mt-0.5">
              Russell & Norvig cognitive topologies with autonomous decision strategies.
            </p>
          </div>

          <button
            onClick={() => onNavigate('agents')}
            className="text-xs sm:text-sm text-[#FF8A32] hover:text-[#FFA057] flex items-center gap-1 font-medium transition-colors self-start sm:self-auto"
          >
            <span>View Full Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Equal-Width Cards Grid (Desktop: 5 cols, Tablet: 2-3 cols, Mobile: 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {AGENT_REGISTRY.map((agent) => {
            const AgentIcon = getAgentIcon(agent.id);
            const latestRun = latestRunsByAgent[agent.id];

            return (
              <div
                key={agent.id}
                onClick={() => {
                  onSelectAgentForSim(agent.id);
                  onNavigate('simulation');
                }}
                className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-5 min-h-[175px] flex flex-col justify-between hover:border-[#FF6A1A]/50 hover:bg-[#21150E]/60 transition-all cursor-pointer group"
                title={`Launch simulation with ${agent.name}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                      style={{ 
                        backgroundColor: `${agent.color}18`, 
                        borderColor: `${agent.color}45`,
                        color: agent.color 
                      }}
                    >
                      <AgentIcon className="w-4 h-4" />
                    </div>
                    <span className="badge badge-neutral text-[10px] font-mono">
                      {agent.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base sm:text-[17px] text-[#F8F3EF] mb-2 group-hover:text-[#FF8A32] transition-colors leading-snug">
                    {agent.name}
                  </h3>

                  <p className="text-[13.5px] text-[#B6AAA0] leading-relaxed line-clamp-3">
                    {agent.oneLineDesc}
                  </p>
                </div>

                {/* Performance Indicator: Actual result if present, else baseline indicator */}
                <div className="pt-3.5 mt-3 border-t border-[rgba(255,138,50,0.12)] flex items-center justify-between text-xs">
                  {latestRun ? (
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[#55D6A2] font-semibold">{latestRun.cleanPercentage}% Clean</span>
                      <span className="text-[#81756C]">•</span>
                      <span className="text-[#FF8A32] font-semibold">{latestRun.finalScore} pts</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-[#81756C]">
                      Awaiting Benchmark
                    </span>
                  )}

                  <span className="text-xs text-[#FF8A32] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Test</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. LABORATORY MODULES (8 DEDICATED MODULES)
          ========================================================================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8F3EF] tracking-tight">
            Laboratory Modules
          </h2>
          <p className="text-xs sm:text-sm text-[#B6AAA0] mt-0.5">
            Comprehensive suite of empirical agent analysis, simulation, and evaluation tools.
          </p>
        </div>

        {/* 8 Modules Grid (Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
          {LABORATORY_MODULES.map((module) => {
            const ModuleIcon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => onNavigate(module.page)}
                className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-5 sm:p-6 min-h-[150px] flex flex-col justify-between hover:border-[#FF6A1A]/40 hover:bg-[#21150E]/60 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#21150E] border border-[rgba(255,138,50,0.22)] text-[#FF8A32] flex items-center justify-center group-hover:border-[#FF6A1A]/50 transition-colors">
                      <ModuleIcon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#81756C] group-hover:text-[#FF8A32] group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-base font-semibold text-[#F8F3EF] mb-1.5 group-hover:text-[#FF8A32] transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-[13px] text-[#B6AAA0] leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. ENVIRONMENT PRESET AND RECENT ACTIVITY (BELOW MODULES)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Active Environment Preset (~40% on Desktop) */}
          <div className="lg:col-span-5 card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 min-h-[180px] space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(255,138,50,0.16)]">
              <div>
                <h3 className="text-base font-semibold text-[#F8F3EF]">
                  Active Environment Preset
                </h3>
                <p className="text-xs text-[#81756C] mt-0.5">
                  Spatial boundaries & percept noise
                </p>
              </div>

              <button
                onClick={() => onNavigate('environment')}
                className="btn-secondary text-sm px-3.5 py-1.5 rounded-lg border border-[rgba(255,138,50,0.2)] text-[#FF8A32] hover:bg-[#21150E] transition-all font-medium min-h-[38px]"
              >
                Tune Environment
              </button>
            </div>

            {/* Clear 2-Column Grid Inside Card */}
            <div className="grid grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block uppercase tracking-wider font-mono">
                  Grid Size
                </span>
                <span className="text-sm sm:text-base font-semibold font-mono text-[#F8F3EF] mt-1 block">
                  {environment.gridWidth} × {environment.gridHeight}
                </span>
                <span className="text-xs text-[#B6AAA0]">
                  {environment.gridWidth * environment.gridHeight} total tiles
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block uppercase tracking-wider font-mono">
                  Dirt Density
                </span>
                <span className="text-sm sm:text-base font-semibold font-mono text-[#FF8A32] mt-1 block">
                  {Math.round(environment.dirtDensity * 100)}%
                </span>
                <span className="text-xs text-[#B6AAA0]">
                  Uniform distribution
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block uppercase tracking-wider font-mono">
                  Obstacles
                </span>
                <span className="text-sm sm:text-base font-semibold font-mono text-[#FF6262] mt-1 block">
                  {environment.obstacleCount} Barriers
                </span>
                <span className="text-xs text-[#B6AAA0]">
                  {environment.isDynamicObstacles ? 'Dynamic shifting' : 'Static walls'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block uppercase tracking-wider font-mono">
                  Observability
                </span>
                <span className="text-sm sm:text-base font-semibold font-mono text-[#55D6A2] mt-1 block">
                  {environment.isPartiallyObservable ? 'Partial Fog (3×3)' : 'Full Horizon'}
                </span>
                <span className="text-xs text-[#B6AAA0]">
                  {environment.sensorNoiseRate > 0 ? `${Math.round(environment.sensorNoiseRate * 100)}% noise` : 'Deterministic'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Recent Simulation Log (~60% on Desktop) */}
          <div className="lg:col-span-7 card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 min-h-[180px] space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(255,138,50,0.16)]">
              <div>
                <h3 className="text-base font-semibold text-[#F8F3EF]">
                  Recent Simulation Log
                </h3>
                <p className="text-xs text-[#81756C] mt-0.5">
                  Real-time telemetry from latest recorded episodes
                </p>
              </div>

              <button
                onClick={() => onNavigate('simulation')}
                className="btn-accent text-sm px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 min-h-[38px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Simulation</span>
              </button>
            </div>

            {runs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#B6AAA0] space-y-3">
                <p>No benchmark trials recorded in this session.</p>
                <button
                  onClick={() => onNavigate('simulation')}
                  className="btn-secondary text-sm inline-flex items-center gap-1.5 py-2 px-3.5 font-medium border border-[rgba(255,138,50,0.22)] min-h-[40px]"
                >
                  <span>Launch Initial Simulation Episode</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF8A32]" />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {runs.slice(0, 4).map((run) => (
                  <div
                    key={run.id}
                    className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] flex items-center justify-between text-xs hover:border-[rgba(255,138,50,0.3)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                      <span className="font-semibold text-sm text-[#F8F3EF]">{run.agentName}</span>
                      <span className={`badge ${run.cleanPercentage === 100 ? 'badge-green' : 'badge-amber'} text-xs`}>
                        {run.cleanPercentage}% Clean
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-[13px] font-mono text-[#B6AAA0]">
                      <span>{run.stepsTaken} steps</span>
                      <span>•</span>
                      <span>{run.finalBattery}% battery</span>
                      <span>•</span>
                      <span className="text-[#FF8A32] font-semibold">{run.finalScore} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. LEADERBOARD (DEDICATED SECTION BELOW ACTIVITY)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8F3EF] tracking-tight">
              Empirical Agent Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-[#B6AAA0] mt-0.5">
              Standings derived strictly from executed benchmark episodes across agent architectures.
            </p>
          </div>

          <button
            onClick={() => onNavigate('comparison')}
            className="text-xs sm:text-sm text-[#FF8A32] hover:text-[#FFA057] flex items-center gap-1 font-medium transition-colors self-start sm:self-auto"
          >
            <span>Open Full Leaderboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Display rankings derived strictly from actual experiment results */}
        {rankedRuns.length === 0 ? (
          <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(255,106,26,0.12)] border border-[rgba(255,138,50,0.25)] text-[#FF8A32] flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base sm:text-lg font-semibold text-[#F8F3EF]">
                No Benchmark Standings Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#B6AAA0] leading-relaxed">
                Leaderboard standings are populated strictly from real simulation runs. Execute an episode in the simulation arena or run an automated showdown to record empirical benchmark data.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('simulation')}
                className="btn-accent text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
              >
                <PlayCircle className="w-4 h-4 fill-current" />
                <span>Launch Simulation Arena</span>
              </button>

              <button
                onClick={() => onNavigate('comparison')}
                className="btn-secondary text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-[rgba(255,138,50,0.22)]"
              >
                <BarChart3 className="w-4 h-4 text-[#FF8A32]" />
                <span>Run 5-Agent Showdown</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#21150E] border-b border-[rgba(255,138,50,0.16)] text-[#B6AAA0] text-xs sm:text-[13px] uppercase tracking-wider font-mono">
                    <th className="px-6 py-4 font-semibold">Rank</th>
                    <th className="px-6 py-4 font-semibold">Agent Architecture</th>
                    <th className="px-6 py-4 font-semibold">Cleaning Efficiency</th>
                    <th className="px-6 py-4 font-semibold text-center">Steps Taken</th>
                    <th className="px-6 py-4 font-semibold text-center">Energy Preserved</th>
                    <th className="px-6 py-4 font-semibold text-right">Performance Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,138,50,0.1)] text-[#F8F3EF] text-sm">
                  {rankedRuns.map((run, idx) => {
                    const AgentIcon = getAgentIcon(run.agentId);
                    return (
                      <tr 
                        key={run.id}
                        className={`hover:bg-[#21150E]/60 transition-colors ${
                          idx === 0 ? 'bg-[#FF6A1A]/[0.05]' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-mono font-bold text-sm sm:text-base text-[#FF8A32]">
                          #{idx + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[rgba(255,106,26,0.12)] border border-[rgba(255,138,50,0.25)] text-[#FF8A32] flex items-center justify-center flex-shrink-0">
                              <AgentIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm sm:text-base text-[#F8F3EF]">
                                {run.agentName}
                              </div>
                              <div className="text-xs font-mono text-[#81756C]">
                                {new Date(run.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-semibold text-sm sm:text-base text-[#55D6A2]">
                              {run.cleanPercentage}%
                            </span>
                            <div className="w-24 bg-[#100A05] h-2 rounded-full overflow-hidden border border-[rgba(255,138,50,0.12)]">
                              <div
                                className="bg-[#55D6A2] h-full rounded-full"
                                style={{ width: `${run.cleanPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center font-mono text-sm text-[#B6AAA0]">
                          {run.stepsTaken} moves
                        </td>

                        <td className="px-6 py-4 text-center font-mono text-sm text-[#FFA057]">
                          {run.finalBattery}%
                        </td>

                        <td className="px-6 py-4 text-right font-mono font-bold text-sm sm:text-base text-[#FF8A32]">
                          {run.finalScore} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};
