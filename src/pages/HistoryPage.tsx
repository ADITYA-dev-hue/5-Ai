import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Eye, 
  X,
  Play,
  Terminal,
  Clock,
  Coins
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ExperimentRun, SimulationStep } from '../types';

interface HistoryPageProps {
  runs: ExperimentRun[];
  onNavigateToSimulation: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  runs,
  onNavigateToSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRun, setSelectedRun] = useState<ExperimentRun | null>(null);

  const filteredRuns = runs.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.architectureName.toLowerCase().includes(q) ||
      r.taskTitle.toLowerCase().includes(q) ||
      r.prompt.toLowerCase().includes(q)
    );
  });

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(runs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-laboratory-runs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="lab-container py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#29313F] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-neutral">Audit Trail</span>
            <span className="text-caption">• Execution Logs & Telemetry</span>
          </div>
          <h1 className="heading-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F6FA]">
            Experiment Run History
          </h1>
          <p className="text-body max-w-2xl text-sm sm:text-base text-[#A7B0C0] mt-1.5">
            Audit immutable historical runs across agent topologies. Inspect exact thoughts, tool invocations, tokens, and verification status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {runs.length > 0 && (
            <button
              onClick={exportToJson}
              className="btn-secondary text-xs flex items-center gap-2"
              title="Export all run data as structured JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry (JSON)</span>
            </button>
          )}

          <button
            onClick={onNavigateToSimulation}
            className="btn-accent text-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>New Simulation</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table or Empty State */}
      {runs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Experiment Logs Recorded"
          description="Your laboratory run log is currently empty. Execute one or more experiments in the Simulation Studio to populate persistent execution records."
          actionText="Run Initial Experiment"
          onAction={onNavigateToSimulation}
          badge="Empty Audit Log"
        />
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#6E798E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search runs by ID, architecture, task, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 text-xs bg-[#171C25] border-[#29313F] text-[#F5F6FA] rounded-lg"
              />
            </div>
            <span className="text-xs font-mono text-[#A7B0C0]">
              Showing {filteredRuns.length} of {runs.length} runs
            </span>
          </div>

          {/* Runs Table */}
          <div className="card-primary rounded-xl border border-[#29313F] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1D2430] border-b border-[#29313F] text-[#A7B0C0] font-mono">
                  <tr>
                    <th className="py-3 px-4 font-medium">Run ID</th>
                    <th className="py-3 px-4 font-medium">Architecture</th>
                    <th className="py-3 px-4 font-medium">Task / Directive</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Accuracy</th>
                    <th className="py-3 px-4 font-medium">Duration</th>
                    <th className="py-3 px-4 font-medium">Tokens</th>
                    <th className="py-3 px-4 font-medium">Cost</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29313F] text-[#F5F6FA]">
                  {filteredRuns.map((run) => (
                    <tr 
                      key={run.id}
                      className="hover:bg-[#1D2430]/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-[#8CB8FF]">
                        {run.id.substring(0, 14)}...
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#F5F6FA]">
                        {run.architectureName}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[#A7B0C0]" title={run.prompt}>
                        {run.taskTitle}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          run.status === 'success' ? 'badge-green' : 'badge-amber'
                        } text-[10px]`}>
                          {run.status === 'success' ? 'Verified' : 'Partial'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#22C997]">
                        {run.metrics.accuracyScore}%
                      </td>
                      <td className="py-3 px-4 font-mono text-[#A7B0C0]">
                        {run.metrics.totalDurationMs}ms
                      </td>
                      <td className="py-3 px-4 font-mono text-[#8CB8FF]">
                        {run.metrics.totalTokens.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#9C86CE]">
                        ${run.metrics.estimatedCostUsd}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedRun(run)}
                          className="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspector Dialog */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="card-elevated w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-[#29313F] shadow-elevated overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#29313F] flex items-center justify-between bg-[#1D2430]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-purple text-[10px]">{selectedRun.architectureName}</span>
                  <span className="text-caption font-mono text-xs">{selectedRun.id}</span>
                </div>
                <h3 className="heading-card text-base text-[#F5F6FA] font-semibold">
                  {selectedRun.taskTitle}
                </h3>
              </div>

              <button
                onClick={() => setSelectedRun(null)}
                className="p-1.5 rounded-lg text-[#A7B0C0] hover:text-[#F5F6FA] hover:bg-[#171C25]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#171C25] border-b border-[#29313F] text-xs">
              <div>
                <span className="text-[#A7B0C0] text-[10px] block">Accuracy</span>
                <span className="font-mono text-sm font-bold text-[#22C997]">
                  {selectedRun.metrics.accuracyScore}%
                </span>
              </div>
              <div>
                <span className="text-[#A7B0C0] text-[10px] block">Duration</span>
                <span className="font-mono text-sm font-bold text-[#8CB8FF]">
                  {selectedRun.metrics.totalDurationMs}ms
                </span>
              </div>
              <div>
                <span className="text-[#A7B0C0] text-[10px] block">Tokens</span>
                <span className="font-mono text-sm font-bold text-[#F5F6FA]">
                  {selectedRun.metrics.totalTokens}
                </span>
              </div>
              <div>
                <span className="text-[#A7B0C0] text-[10px] block">Est. Cost</span>
                <span className="font-mono text-sm font-bold text-[#9C86CE]">
                  ${selectedRun.metrics.estimatedCostUsd}
                </span>
              </div>
            </div>

            {/* Modal Steps Stream */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-[#0A0D12]">
              <h4 className="text-xs font-mono uppercase text-[#A7B0C0] tracking-wider mb-2">
                Execution Trace ({selectedRun.steps.length} Steps)
              </h4>

              {selectedRun.steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3.5 rounded-lg bg-[#171C25] border border-[#29313F] text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1D2430] text-[10px] font-mono flex items-center justify-center text-[#F5F6FA]">
                        {step.stepNumber}
                      </span>
                      <span className="font-semibold text-[#F5F6FA]">{step.nodeName}</span>
                      <span className="badge badge-neutral text-[9px] uppercase font-mono">
                        {step.phase}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A7B0C0]">
                      {step.durationMs}ms
                    </span>
                  </div>

                  <p className="text-[#A7B0C0] leading-relaxed text-xs">
                    {step.content}
                  </p>

                  {step.toolCall && (
                    <div className="p-2.5 rounded bg-[#0A0D12] border border-[#29313F] font-mono text-[11px] text-[#8CB8FF]">
                      <div>Tool: {step.toolCall.name}</div>
                      <div className="text-[#22C997] text-[10px] mt-1">Output: {step.toolCall.output}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#29313F] bg-[#1D2430] flex justify-end">
              <button
                onClick={() => setSelectedRun(null)}
                className="btn-secondary text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
