import React, { useState } from 'react';
import { 
  LineChart, 
  BarChart2, 
  Filter, 
  Play, 
  TrendingUp, 
  Battery, 
  Footprints, 
  Trophy 
} from 'lucide-react';
import { PlotlyChart } from '../components/PlotlyChart';
import { EmptyState } from '../components/EmptyState';
import { AGENT_REGISTRY } from '../data/agents';
import { AgentRunResult, AgentType } from '../types';
import type { Data } from 'plotly.js-dist-min';

interface AnalyticsPageProps {
  runs: AgentRunResult[];
  onNavigateToSimulation: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  runs,
  onNavigateToSimulation,
}) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  const filteredRuns = selectedAgentFilter === 'all'
    ? runs
    : runs.filter((r) => r.agentId === selectedAgentFilter);

  const hasData = filteredRuns.length > 0;

  // Aggregate stats per agent from runs
  const agentStats: Record<string, {
    count: number;
    avgScore: number;
    avgCleanPct: number;
    avgSteps: number;
    avgBattery: number;
  }> = {};

  AGENT_REGISTRY.forEach((agent) => {
    const matching = filteredRuns.filter((r) => r.agentId === agent.id);
    if (matching.length > 0) {
      const totalScore = matching.reduce((sum, r) => sum + r.finalScore, 0);
      const totalClean = matching.reduce((sum, r) => sum + r.cleanPercentage, 0);
      const totalSteps = matching.reduce((sum, r) => sum + r.stepsTaken, 0);
      const totalBatt = matching.reduce((sum, r) => sum + r.finalBattery, 0);

      agentStats[agent.id] = {
        count: matching.length,
        avgScore: Math.round(totalScore / matching.length),
        avgCleanPct: Math.round(totalClean / matching.length),
        avgSteps: Math.round(totalSteps / matching.length),
        avgBattery: Math.round(totalBatt / matching.length),
      };
    }
  });

  const activeAgents = Object.keys(agentStats);

  // Chart 1: Clean Efficiency (Bar)
  const cleanChartData: Data[] = hasData ? [
    {
      x: activeAgents.map((id) => AGENT_REGISTRY.find((a) => a.id === id)?.name || id),
      y: activeAgents.map((id) => agentStats[id].avgCleanPct),
      type: 'bar',
      name: 'Clean Rate (%)',
      marker: {
        color: '#55D6A2', // Success Green
        line: { color: 'rgba(255, 138, 50, 0.16)', width: 1 },
      },
    },
  ] : [];

  // Chart 2: Energy vs Score (Scatter)
  const paretoChartData: Data[] = hasData ? [
    {
      x: activeAgents.map((id) => agentStats[id].avgBattery),
      y: activeAgents.map((id) => agentStats[id].avgScore),
      text: activeAgents.map((id) => AGENT_REGISTRY.find((a) => a.id === id)?.name || id),
      mode: 'markers+text',
      textposition: 'top center',
      type: 'scatter',
      name: 'Agents',
      marker: {
        size: 14,
        color: ['#FF6A1A', '#FF8A32', '#55D6A2', '#FFA057', '#FF6262'],
        line: { color: '#F8F3EF', width: 1.5 },
      },
    },
  ] : [];

  // Chart 3: Steps Taken (Bar)
  const stepsChartData: Data[] = hasData ? [
    {
      x: activeAgents.map((id) => AGENT_REGISTRY.find((a) => a.id === id)?.name || id),
      y: activeAgents.map((id) => agentStats[id].avgSteps),
      type: 'bar',
      name: 'Average Steps',
      marker: {
        color: '#FF6A1A', // Primary Orange
        line: { color: 'rgba(255, 138, 50, 0.16)', width: 1 },
      },
    },
  ] : [];

  // Chart 4: Multi-Dimensional Radar
  const radarChartData: Data[] = hasData ? activeAgents.map((id, idx) => {
    const s = agentStats[id];
    const name = AGENT_REGISTRY.find((a) => a.id === id)?.name || id;
    const colors = ['#FF6A1A', '#FF8A32', '#55D6A2', '#FFA057', '#FF6262'];

    const pathScore = Math.max(10, 100 - s.avgSteps * 1.5);
    const energyScore = s.avgBattery;
    const cleanScore = s.avgCleanPct;
    const overallScore = Math.max(10, Math.min(100, s.avgScore + 20));

    return {
      type: 'scatterpolar',
      r: [cleanScore, energyScore, pathScore, overallScore, cleanScore],
      theta: ['Clean Rate', 'Energy Efficiency', 'Path Optimality', 'Composite Score', 'Clean Rate'],
      fill: 'toself',
      name,
      line: { color: colors[idx % colors.length] },
      opacity: 0.7,
    };
  }) : [];

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Empirical Visuals
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • Dark Themed Plotly
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Comparative Analytics Studio
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Statistical comparisons across cleaning efficacy, battery preservation, and pathfinding optimality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasData && (
            <div className="flex items-center gap-2 bg-[#17100B] border border-[rgba(255,138,50,0.22)] px-3.5 py-2 rounded-xl text-sm min-h-[44px]">
              <Filter className="w-4 h-4 text-[#FF8A32]" />
              <select
                value={selectedAgentFilter}
                onChange={(e) => setSelectedAgentFilter(e.target.value)}
                className="bg-transparent text-[#F8F3EF] border-0 focus:ring-0 cursor-pointer text-sm"
              >
                <option value="all" className="bg-[#17100B] text-[#F8F3EF]">All Agents ({runs.length} runs)</option>
                {AGENT_REGISTRY.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-[#17100B] text-[#F8F3EF]">
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onNavigateToSimulation}
            className="btn-accent h-11 px-5 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-[0_4px_18px_rgba(255,106,26,0.35)]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>New Episode</span>
          </button>
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon={LineChart}
          title="No Empirical Analytics Recorded"
          description="In accordance with laboratory standards, analytics charts are generated exclusively from real experimental episodes. Run a simulation episode to populate charts."
          actionText="Run Simulation Arena"
          onAction={onNavigateToSimulation}
          badge="Awaiting Experiments"
        />
      ) : (
        <div className="space-y-7">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-primary p-5 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <span className="text-xs sm:text-[13px] text-[#81756C] block font-medium">Average Clean Rate</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#55D6A2] mt-1 block">
                {(
                  filteredRuns.reduce((sum, r) => sum + r.cleanPercentage, 0) /
                  filteredRuns.length
                ).toFixed(0)}%
              </span>
            </div>

            <div className="card-primary p-5 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <span className="text-xs sm:text-[13px] text-[#81756C] block font-medium">Average Score</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#FF8A32] mt-1 block">
                {Math.round(
                  filteredRuns.reduce((sum, r) => sum + r.finalScore, 0) /
                  filteredRuns.length
                )} pts
              </span>
            </div>

            <div className="card-primary p-5 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <span className="text-xs sm:text-[13px] text-[#81756C] block font-medium">Average Path Length</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#FF6A1A] mt-1 block">
                {Math.round(
                  filteredRuns.reduce((sum, r) => sum + r.stepsTaken, 0) /
                  filteredRuns.length
                )} steps
              </span>
            </div>

            <div className="card-primary p-5 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <span className="text-xs sm:text-[13px] text-[#81756C] block font-medium">Battery Preserved</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#FFA057] mt-1 block">
                {Math.round(
                  filteredRuns.reduce((sum, r) => sum + r.finalBattery, 0) /
                  filteredRuns.length
                )}%
              </span>
            </div>
          </div>

          {/* Plotly 2x2 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Clean Efficiency */}
            <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8F3EF]">
                  Tile Cleaning Efficiency (%)
                </h3>
                <span className="badge badge-green text-xs font-mono">Clean Rate</span>
              </div>
              <PlotlyChart
                data={cleanChartData}
                layout={{
                  title: undefined,
                  yaxis: { title: { text: 'Clean Rate (%)' }, range: [0, 105] },
                  xaxis: { title: { text: 'Agent Architecture' } },
                }}
              />
            </div>

            {/* Chart 2: Pareto Energy vs Score */}
            <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8F3EF]">
                  Pareto Frontier: Score vs. Battery Preserved
                </h3>
                <span className="badge badge-orange text-xs font-mono">Trade-Off</span>
              </div>
              <PlotlyChart
                data={paretoChartData}
                layout={{
                  title: undefined,
                  xaxis: { title: { text: 'Battery Preserved (%)' } },
                  yaxis: { title: { text: 'Final Score (pts)' } },
                }}
              />
            </div>

            {/* Chart 3: Step Count */}
            <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8F3EF]">
                  Path Length to Clean Mission (Fewer is Better)
                </h3>
                <span className="badge badge-neutral text-xs font-mono">Step Count</span>
              </div>
              <PlotlyChart
                data={stepsChartData}
                layout={{
                  title: undefined,
                  yaxis: { title: { text: 'Steps Taken' } },
                  xaxis: { title: { text: 'Agent Architecture' } },
                }}
              />
            </div>

            {/* Chart 4: Radar Polar */}
            <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8F3EF]">
                  Multi-Dimensional Capability Radar
                </h3>
                <span className="badge badge-orange text-xs font-mono">Radar Polar</span>
              </div>
              <PlotlyChart
                data={radarChartData}
                layout={{
                  title: undefined,
                  polar: {
                    bgcolor: '#17100B',
                    radialaxis: {
                      visible: true,
                      range: [0, 100],
                      gridcolor: 'rgba(255, 138, 50, 0.12)',
                      linecolor: 'rgba(255, 138, 50, 0.18)',
                      tickfont: { color: '#B6AAA0', size: 10 },
                    },
                    angularaxis: {
                      gridcolor: 'rgba(255, 138, 50, 0.12)',
                      linecolor: 'rgba(255, 138, 50, 0.18)',
                      tickfont: { color: '#F8F3EF', size: 11 },
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
