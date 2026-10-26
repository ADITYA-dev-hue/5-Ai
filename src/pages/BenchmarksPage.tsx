import React, { useState } from 'react';
import { 
  BarChart2, 
  Play, 
  FlaskConical, 
  TrendingUp, 
  Cpu, 
  Coins, 
  Clock, 
  Layers, 
  HelpCircle,
  Filter
} from 'lucide-react';
import { PlotlyChart } from '../components/PlotlyChart';
import { EmptyState } from '../components/EmptyState';
import { ARCHITECTURES } from '../data/architectures';
import { ExperimentRun } from '../types';
import type { Data } from 'plotly.js-dist-min';

interface BenchmarksPageProps {
  runs: ExperimentRun[];
  onNavigateToSimulation: () => void;
}

export const BenchmarksPage: React.FC<BenchmarksPageProps> = ({
  runs,
  onNavigateToSimulation,
}) => {
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('all');

  const filteredRuns = selectedTaskFilter === 'all' 
    ? runs 
    : runs.filter((r) => r.taskId === selectedTaskFilter);

  // Collect distinct tasks from runs for filtering
  const distinctTasks = Array.from(new Set(runs.map((r) => r.taskTitle)));

  // Group metrics by architecture
  const archStats: Record<string, {
    runsCount: number;
    avgAccuracy: number;
    avgDuration: number;
    avgTokens: number;
    avgCost: number;
    toolCalls: number;
    recoveryCount: number;
  }> = {};

  ARCHITECTURES.forEach((arch) => {
    const archRuns = filteredRuns.filter((r) => r.architectureId === arch.id);
    if (archRuns.length > 0) {
      const totalAcc = archRuns.reduce((sum, r) => sum + r.metrics.accuracyScore, 0);
      const totalDur = archRuns.reduce((sum, r) => sum + r.metrics.totalDurationMs, 0);
      const totalTok = archRuns.reduce((sum, r) => sum + r.metrics.totalTokens, 0);
      const totalCost = archRuns.reduce((sum, r) => sum + r.metrics.estimatedCostUsd, 0);
      const totalTools = archRuns.reduce((sum, r) => sum + r.metrics.toolCallCount, 0);
      const totalRec = archRuns.reduce((sum, r) => sum + r.metrics.errorRecoveryCount, 0);

      archStats[arch.id] = {
        runsCount: archRuns.length,
        avgAccuracy: Math.round((totalAcc / archRuns.length) * 10) / 10,
        avgDuration: Math.round(totalDur / archRuns.length),
        avgTokens: Math.round(totalTok / archRuns.length),
        avgCost: parseFloat((totalCost / archRuns.length).toFixed(5)),
        toolCalls: totalTools,
        recoveryCount: totalRec,
      };
    }
  });

  const activeArchKeys = Object.keys(archStats);
  const hasData = filteredRuns.length > 0;

  // Chart 1: Accuracy & Task Success Rate (Bar Chart)
  const accuracyChartData: Data[] = hasData ? [
    {
      x: activeArchKeys.map((id) => ARCHITECTURES.find((a) => a.id === id)?.name || id),
      y: activeArchKeys.map((id) => archStats[id].avgAccuracy),
      type: 'bar',
      name: 'Task Accuracy (%)',
      marker: {
        color: '#FF7A1A', // Warm Orange
        line: { color: '#222938', width: 1 },
      },
    },
  ] : [];

  // Chart 2: Cost vs Latency Pareto Frontier (Scatter Chart)
  const paretoChartData: Data[] = hasData ? [
    {
      x: activeArchKeys.map((id) => archStats[id].avgDuration),
      y: activeArchKeys.map((id) => archStats[id].avgCost),
      text: activeArchKeys.map((id) => `${ARCHITECTURES.find((a) => a.id === id)?.name} (Acc: ${archStats[id].avgAccuracy}%)`),
      mode: 'markers+text',
      textposition: 'top center',
      type: 'scatter',
      name: 'Architectures',
      marker: {
        size: 14,
        color: ['#FF7A1A', '#FFA057', '#22C997', '#8CB8FF'],
        line: { color: '#F5F6FA', width: 1.5 },
      },
    },
  ] : [];

  // Chart 3: Token Consumption Breakdown (Bar Chart)
  const tokenChartData: Data[] = hasData ? [
    {
      x: activeArchKeys.map((id) => ARCHITECTURES.find((a) => a.id === id)?.name || id),
      y: activeArchKeys.map((id) => archStats[id].avgTokens),
      type: 'bar',
      name: 'Total Tokens / Run',
      marker: {
        color: '#FFA057', // Amber Peach
        line: { color: '#222938', width: 1 },
      },
    },
  ] : [];

  // Chart 4: Multi-Dimensional Capability Radar
  const radarChartData: Data[] = hasData ? activeArchKeys.map((id, idx) => {
    const stats = archStats[id];
    const archName = ARCHITECTURES.find((a) => a.id === id)?.name || id;
    const colors = ['#FF7A1A', '#FFA057', '#22C997', '#8CB8FF'];

    // Normalize metrics to 0-100 scale for radar
    const speedScore = Math.max(10, 100 - (stats.avgDuration / 70));
    const costScore = Math.max(10, 100 - (stats.avgCost * 20000));
    const accuracyScore = stats.avgAccuracy;
    const recoveryScore = Math.min(100, stats.recoveryCount * 35 + 30);
    const toolScore = Math.min(100, stats.toolCalls * 25 + 30);

    return {
      type: 'scatterpolar',
      r: [accuracyScore, speedScore, costScore, recoveryScore, toolScore, accuracyScore],
      theta: ['Accuracy', 'Speed / Latency', 'Cost Efficiency', 'Self-Correction', 'Tool Utility', 'Accuracy'],
      fill: 'toself',
      name: archName,
      line: { color: colors[idx % colors.length] },
      opacity: 0.7,
    };
  }) : [];

  return (
    <div className="lab-container py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#29313F] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-purple">Plotly Analytics</span>
            <span className="text-caption">• Quantitative Empirical Benchmarking</span>
          </div>
          <h1 className="heading-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F6FA]">
            Comparative Performance Analytics
          </h1>
          <p className="text-body max-w-2xl text-sm sm:text-base text-[#A7B0C0] mt-1.5">
            Evaluate accuracy, latency distributions, token cost efficiency, and recovery capability. Consistent dark Plotly styling adhering strictly to the laboratory tokens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasData && (
            <div className="flex items-center gap-2 bg-[#171C25] border border-[#29313F] px-3 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-[#8CB8FF]" />
              <select
                value={selectedTaskFilter}
                onChange={(e) => setSelectedTaskFilter(e.target.value)}
                className="bg-transparent text-[#F5F6FA] border-0 focus:ring-0 cursor-pointer text-xs"
              >
                <option value="all">All Tasks ({runs.length} runs)</option>
                {distinctTasks.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onNavigateToSimulation}
            className="btn-accent text-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute New Run</span>
          </button>
        </div>
      </div>

      {/* Main Benchmarks View or Empty State */}
      {!hasData ? (
        <EmptyState
          icon={BarChart2}
          title="No Empirical Benchmark Data Recorded"
          description="In accordance with laboratory standards, metrics are never populated with fabricated data. Run one or more simulated experiments in the Simulation Studio to generate real empirical comparative charts."
          actionText="Launch Baseline Benchmark"
          onAction={onNavigateToSimulation}
          badge="Awaiting Experiments"
        />
      ) : (
        <div className="space-y-6">
          {/* Summary KPIs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-primary p-4 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between text-xs text-[#A7B0C0] mb-2">
                <span>Total Experiments</span>
                <FlaskConical className="w-4 h-4 text-[#9C86CE]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#F5F6FA]">{filteredRuns.length}</div>
              <p className="text-[11px] text-[#A7B0C0] mt-1">Across {activeArchKeys.length} active architectures</p>
            </div>

            <div className="card-primary p-4 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between text-xs text-[#A7B0C0] mb-2">
                <span>Average Accuracy</span>
                <TrendingUp className="w-4 h-4 text-[#22C997]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#22C997]">
                {(
                  filteredRuns.reduce((sum, r) => sum + r.metrics.accuracyScore, 0) /
                  filteredRuns.length
                ).toFixed(1)}%
              </div>
              <p className="text-[11px] text-[#A7B0C0] mt-1">Objective rubric verification</p>
            </div>

            <div className="card-primary p-4 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between text-xs text-[#A7B0C0] mb-2">
                <span>Average Latency</span>
                <Clock className="w-4 h-4 text-[#8CB8FF]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#8CB8FF]">
                {Math.round(
                  filteredRuns.reduce((sum, r) => sum + r.metrics.totalDurationMs, 0) /
                  filteredRuns.length
                )}ms
              </div>
              <p className="text-[11px] text-[#A7B0C0] mt-1">Handoff & execution time</p>
            </div>

            <div className="card-primary p-4 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between text-xs text-[#A7B0C0] mb-2">
                <span>Cumulative Tokens</span>
                <Coins className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#F5F6FA]">
                {filteredRuns.reduce((sum, r) => sum + r.metrics.totalTokens, 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#A7B0C0] mt-1">Total model tokens processed</p>
            </div>
          </div>

          {/* Plotly Charts 2x2 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Task Accuracy */}
            <div className="card-primary p-6 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="heading-card text-sm font-semibold text-[#F5F6FA]">
                    Task Accuracy Score by Architecture
                  </h3>
                  <p className="text-caption text-xs text-[#A7B0C0]">
                    Scored out of 100% against benchmark unit tests and security constraints
                  </p>
                </div>
                <span className="badge badge-purple text-[10px]">Bar Chart</span>
              </div>
              <PlotlyChart
                data={accuracyChartData}
                layout={{
                  title: undefined,
                  yaxis: { title: { text: 'Accuracy (%)' }, range: [50, 105] },
                  xaxis: { title: { text: 'Architecture Pattern' } },
                }}
              />
            </div>

            {/* Chart 2: Pareto Frontier */}
            <div className="card-primary p-6 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="heading-card text-sm font-semibold text-[#F5F6FA]">
                    Pareto Frontier: Latency vs. Estimated Cost
                  </h3>
                  <p className="text-caption text-xs text-[#A7B0C0]">
                    Optimal trade-off points (lower left represents fastest and cheapest)
                  </p>
                </div>
                <span className="badge badge-blue text-[10px]">Scatter Plot</span>
              </div>
              <PlotlyChart
                data={paretoChartData}
                layout={{
                  title: undefined,
                  xaxis: { title: { text: 'Execution Duration (ms)' } },
                  yaxis: { title: { text: 'Cost ($ USD)' } },
                }}
              />
            </div>

            {/* Chart 3: Token Consumption */}
            <div className="card-primary p-6 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="heading-card text-sm font-semibold text-[#F5F6FA]">
                    Token Consumption Efficiency
                  </h3>
                  <p className="text-caption text-xs text-[#A7B0C0]">
                    Total context volume (input prompt tokens + output generation tokens)
                  </p>
                </div>
                <span className="badge badge-neutral text-[10px]">Context Volume</span>
              </div>
              <PlotlyChart
                data={tokenChartData}
                layout={{
                  title: undefined,
                  yaxis: { title: { text: 'Total Tokens' } },
                  xaxis: { title: { text: 'Architecture Pattern' } },
                }}
              />
            </div>

            {/* Chart 4: Radar Capability */}
            <div className="card-primary p-6 rounded-xl border border-[#29313F]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="heading-card text-sm font-semibold text-[#F5F6FA]">
                    Multi-Dimensional Architecture Capability Radar
                  </h3>
                  <p className="text-caption text-xs text-[#A7B0C0]">
                    Comparative radar across Accuracy, Speed, Cost, Recovery, and Tools
                  </p>
                </div>
                <span className="badge badge-green text-[10px]">Radar Polar</span>
              </div>
              <PlotlyChart
                data={radarChartData}
                layout={{
                  title: undefined,
                  polar: {
                    bgcolor: '#171C25',
                    radialaxis: {
                      visible: true,
                      range: [0, 100],
                      gridcolor: '#29313F',
                      linecolor: '#29313F',
                      tickfont: { color: '#A7B0C0', size: 9 },
                    },
                    angularaxis: {
                      gridcolor: '#29313F',
                      linecolor: '#29313F',
                      tickfont: { color: '#F5F6FA', size: 10 },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
