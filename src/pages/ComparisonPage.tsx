import React, { useState } from 'react';
import { 
  BarChart3, 
  Trophy, 
  Play, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Clock,
  Battery,
  Footprints,
  Medal
} from 'lucide-react';
import { AGENT_REGISTRY } from '../data/agents';
import { runCompleteEpisode } from '../lib/grid-simulation';
import { EmptyState } from '../components/EmptyState';
import { AgentRunResult, EnvironmentConfig } from '../types';

interface ComparisonPageProps {
  runs: AgentRunResult[];
  environment: EnvironmentConfig;
  onRecordRun: (run: AgentRunResult) => void;
  onNavigateToSimulation: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  runs,
  environment,
  onRecordRun,
  onNavigateToSimulation,
  onShowToast,
}) => {
  const [isRunningAll, setIsRunningAll] = useState(false);

  // Group latest run per agent
  const latestRunsByAgent: Record<string, AgentRunResult> = {};
  runs.forEach((r) => {
    if (!latestRunsByAgent[r.agentId] || new Date(r.timestamp) > new Date(latestRunsByAgent[r.agentId].timestamp)) {
      latestRunsByAgent[r.agentId] = r;
    }
  });

  const rankedRuns = Object.values(latestRunsByAgent).sort(
    (a, b) => b.finalScore - a.finalScore
  );

  const handleRunAllShowdown = async () => {
    if (isRunningAll) return;
    setIsRunningAll(true);
    onShowToast('Showdown Started', 'Executing benchmark episodes across all 5 agent architectures...', 'info');

    // Run sequentially with small delay for UI effect
    for (const agent of AGENT_REGISTRY) {
      await new Promise((r) => setTimeout(r, 220));
      const result = runCompleteEpisode(agent.id, environment, 80);
      onRecordRun(result);
    }

    setIsRunningAll(false);
    onShowToast('Showdown Completed', 'Empirical comparison leaderboard populated with real episode metrics.', 'success');
  };

  const hasRuns = runs.length > 0;

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Leaderboard
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • Head-to-Head Performance
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Comparative Agent Ranking
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Empirical benchmark leaderboard. Ranks agents by cleaning efficiency, energy conservation, and path optimality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAllShowdown}
            disabled={isRunningAll}
            className="btn-accent h-11 px-5 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-[0_4px_18px_rgba(255,106,26,0.35)] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{isRunningAll ? 'Running Showdown...' : 'Run 5-Agent Showdown'}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Leaderboard or Empty State */}
      {!hasRuns ? (
        <EmptyState
          icon={Trophy}
          title="No Comparison Episodes Recorded"
          description="In strict adherence to laboratory standards, the leaderboard is never populated with fabricated data. Run the automated 5-agent showdown to benchmark all architectures under identical environment conditions."
          actionText="Execute 5-Agent Showdown"
          onAction={handleRunAllShowdown}
          secondaryText="Open Simulation Grid"
          onSecondaryAction={onNavigateToSimulation}
          badge="Awaiting Showdown"
        />
      ) : (
        <div className="space-y-7">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rankedRuns.slice(0, 3).map((run, idx) => {
              const medals = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
              const podiumStyles = [
                'border-[#FF8A32]/80 bg-[#21150E] shadow-[0_0_24px_rgba(255,106,26,0.18)]',
                'border-[#FF6A1A]/40 bg-[#17100B]',
                'border-[rgba(255,138,50,0.22)] bg-[#17100B]'
              ];
              return (
                <div
                  key={run.id}
                  className={`card-primary p-6 rounded-2xl border ${podiumStyles[idx] || 'border-[rgba(255,138,50,0.16)] bg-[#17100B]'} space-y-4 relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-[#F8F3EF]">
                      {medals[idx]}
                    </span>
                    <span className="badge badge-green text-xs font-mono">
                      {run.cleanPercentage}% Clean
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-[#F8F3EF]">{run.agentName}</h3>
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-[#B6AAA0] mt-1.5">
                      <span>Score: <b className="text-[#FF8A32]">{run.finalScore} pts</b></span>
                      <span>•</span>
                      <span>{run.stepsTaken} steps</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#100A05] h-2 rounded-full overflow-hidden border border-[rgba(255,138,50,0.12)]">
                    <div
                      className="bg-[#FF6A1A] h-full"
                      style={{ width: `${run.cleanPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ranking Table */}
          <div className="card-primary rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] overflow-hidden shadow-card">
            <div className="p-5 border-b border-[rgba(255,138,50,0.16)] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F8F3EF] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FF8A32]" />
                <span>Empirical Ranking Standings</span>
              </h3>
              <span className="text-xs font-mono text-[#81756C]">
                {rankedRuns.length} of 5 agents evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-[#21150E] border-b border-[rgba(255,138,50,0.16)] text-[#B6AAA0] font-mono text-xs sm:text-[13px] uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Rank</th>
                    <th className="py-4 px-6 font-semibold">Agent Architecture</th>
                    <th className="py-4 px-6 font-semibold">Clean Rate</th>
                    <th className="py-4 px-6 font-semibold">Steps</th>
                    <th className="py-4 px-6 font-semibold">Remaining Battery</th>
                    <th className="py-4 px-6 font-semibold">Score</th>
                    <th className="py-4 px-6 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,138,50,0.1)] text-[#F8F3EF]">
                  {rankedRuns.map((run, i) => (
                    <tr key={run.id} className="hover:bg-[#21150E]/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-sm sm:text-base text-[#FF8A32]">
                        #{i + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-sm sm:text-base text-[#F8F3EF]">
                        {run.agentName}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[#55D6A2] font-semibold text-sm sm:text-base">{run.cleanPercentage}%</span>
                          <div className="w-20 bg-[#100A05] h-2 rounded-full overflow-hidden border border-[rgba(255,138,50,0.12)]">
                            <div className="bg-[#55D6A2] h-full" style={{ width: `${run.cleanPercentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-[#B6AAA0]">
                        {run.stepsTaken} steps
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-[#FF8A32]">
                        {run.finalBattery}%
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-sm sm:text-base text-[#FF8A32]">
                        {run.finalScore} pts
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`badge ${
                          run.status === 'success' ? 'badge-green' : 'badge-amber'
                        } text-xs`}>
                          {run.status === 'success' ? '100% Clean' : 'Partial'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
