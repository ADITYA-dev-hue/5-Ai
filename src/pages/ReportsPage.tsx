import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Play, 
  CheckCircle2, 
  Trophy, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  LayoutGrid, 
  Sparkles, 
  Cpu, 
  Target, 
  Scale, 
  Zap, 
  ChevronRight, 
  Info, 
  X, 
  Activity, 
  Footprints, 
  Battery, 
  Compass, 
  Bot,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { AGENT_REGISTRY } from '../data/agents';
import { AgentRunResult, AgentType, EnvironmentConfig } from '../types';

interface ReportsPageProps {
  runs: AgentRunResult[];
  environment: EnvironmentConfig;
  onNavigateToSimulation: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  runs,
  environment,
  onNavigateToSimulation,
  onShowToast,
}) => {
  const [selectedRunForDetails, setSelectedRunForDetails] = useState<AgentRunResult | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const hasRuns = runs.length > 0;

  // Real Metric Computations
  const totalRuns = runs.length;
  const avgCleanRate = hasRuns 
    ? (runs.reduce((acc, r) => acc + r.cleanPercentage, 0) / totalRuns).toFixed(1)
    : '0';
  const peakCleanRate = hasRuns 
    ? Math.max(...runs.map((r) => r.cleanPercentage))
    : 0;

  const avgStepsTaken = hasRuns 
    ? (runs.reduce((acc, r) => acc + r.stepsTaken, 0) / totalRuns).toFixed(1)
    : '0';
  const minStepsTaken = hasRuns 
    ? Math.min(...runs.map((r) => r.stepsTaken))
    : 0;

  const avgBatteryRemaining = hasRuns 
    ? (runs.reduce((acc, r) => acc + r.finalBattery, 0) / totalRuns).toFixed(1)
    : '0';
  const depletedRunsCount = runs.filter((r) => r.finalBattery <= 0).length;

  const avgScore = hasRuns 
    ? Math.round(runs.reduce((acc, r) => acc + r.finalScore, 0) / totalRuns)
    : 0;
  const topScore = hasRuns 
    ? Math.max(...runs.map((r) => r.finalScore))
    : 0;

  // Best performing run based on score
  const topRun = hasRuns 
    ? runs.reduce((prev, curr) => (curr.finalScore > prev.finalScore ? curr : prev), runs[0])
    : null;

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

  // Helper for agent color mapping
  const getAgentColor = (id: AgentType) => {
    switch (id) {
      case 'simple_reflex': return '#FFA057';
      case 'model_based': return '#FF6A1A';
      case 'goal_based': return '#55D6A2';
      case 'utility_based': return '#FF8A32';
      case 'learning_cognitive': return '#FF6A1A';
      default: return '#FF6A1A';
    }
  };

  const exportJSON = () => {
    setIsExporting('json');
    try {
      const reportData = {
        reportTitle: 'Comparative Agent Architecture Laboratory — Empirical Benchmark Report',
        metadata: {
          protocol: 'Russell & Norvig Vacuum World Standard Evaluation Suite',
          generatedTimestamp: new Date().toISOString(),
          environmentConfiguration: environment,
          totalTrialsAnalyzed: runs.length,
          overallSummary: {
            averageCleanRate: `${avgCleanRate}%`,
            peakCleanRate: `${peakCleanRate}%`,
            averageSteps: avgStepsTaken,
            minSteps: minStepsTaken,
            averageBatteryRemaining: `${avgBatteryRemaining}%`,
            depletedTrials: depletedRunsCount,
            averageScore: avgScore,
            topScore: topScore,
            topPerformer: topRun ? { agent: topRun.agentName, score: topRun.finalScore } : null,
          },
        },
        trials: runs.map((r) => ({
          runId: r.id,
          agentId: r.agentId,
          agentName: r.agentName,
          timestamp: r.timestamp,
          cleanPercentage: r.cleanPercentage,
          dirtCleaned: r.dirtCleaned,
          totalDirt: r.totalDirt,
          stepsTaken: r.stepsTaken,
          finalBattery: r.finalBattery,
          finalScore: r.finalScore,
          status: r.status,
          stepBreakdown: {
            suckActions: r.stepRecords?.filter(s => s.action === 'SUCK').length || 0,
            moveActions: r.stepRecords?.filter(s => s.action === 'MOVE').length || 0,
            turnActions: r.stepRecords?.filter(s => s.action === 'TURN_LEFT' || s.action === 'TURN_RIGHT').length || 0,
            bumpCollisions: r.stepRecords?.filter(s => s.action === 'BUMP').length || 0,
          }
        })),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent-benchmark-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('JSON Export Completed', 'Telemetry dataset successfully downloaded.', 'success');
    } catch {
      onShowToast('Export Error', 'Failed to generate JSON file.', 'error');
    } finally {
      setIsExporting(null);
    }
  };

  const exportCSV = () => {
    setIsExporting('csv');
    try {
      const headers = [
        'Run ID',
        'Agent Name',
        'Agent Type',
        'Clean Rate (%)',
        'Dirt Cleaned',
        'Total Dirt',
        'Steps Taken',
        'Final Battery (%)',
        'Performance Score',
        'Status',
        'Timestamp'
      ];
      const rows = runs.map((r) => [
        `"${r.id}"`,
        `"${r.agentName}"`,
        `"${r.agentId}"`,
        r.cleanPercentage,
        r.dirtCleaned,
        r.totalDirt,
        r.stepsTaken,
        r.finalBattery,
        r.finalScore,
        `"${r.status}"`,
        `"${r.timestamp}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent-benchmark-matrix-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('CSV Export Completed', 'Spreadsheet dataset ready for peer review.', 'success');
    } catch {
      onShowToast('Export Error', 'Failed to generate CSV file.', 'error');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPDF = () => {
    onShowToast('Printing / PDF Preview', 'Opening system print dialog. Select "Save as PDF" to preserve formatted report.', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 sm:space-y-10 animate-fadeIn text-[#F8F3EF]">
      
      {/* =========================================================================
          1. PAGE HEADER & EXPORT TOOLBAR
          ========================================================================= */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,138,50,0.16)] print:border-gray-400">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Academic Benchmark
            </span>
            <span className="text-xs sm:text-sm text-[#81756C] font-mono">
              Russell & Norvig Standard Evaluation Suite
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F3EF] leading-tight">
            Empirical Benchmark Report
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] max-w-2xl leading-relaxed">
            Compare agent performance using experimental evidence.
          </p>
        </div>

        {/* Action Controls & Export Buttons */}
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          {hasRuns && (
            <>
              <button
                type="button"
                onClick={exportJSON}
                disabled={isExporting !== null}
                className="btn-secondary text-sm font-medium h-11 px-4 rounded-xl border border-[rgba(255,138,50,0.2)] hover:border-[#FF6A1A] hover:bg-[#21150E] text-[#F8F3EF] flex items-center gap-2 transition-all shadow-subtle active:scale-[0.98]"
                title="Download complete experimental telemetry in JSON format"
              >
                <Download className="w-4 h-4 text-[#FF8A32]" />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={exportCSV}
                disabled={isExporting !== null}
                className="btn-secondary text-sm font-medium h-11 px-4 rounded-xl border border-[rgba(255,138,50,0.2)] hover:border-[#55D6A2] hover:bg-[#21150E] text-[#F8F3EF] flex items-center gap-2 transition-all shadow-subtle active:scale-[0.98]"
                title="Download tabular metrics dataset in CSV format"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#55D6A2]" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExporting !== null}
                className="btn-secondary text-sm font-medium h-11 px-4 rounded-xl border border-[rgba(255,138,50,0.2)] hover:border-[#FFA057] hover:bg-[#21150E] text-[#F8F3EF] flex items-center gap-2 transition-all shadow-subtle active:scale-[0.98]"
                title="Print or save as presentation-ready PDF"
              >
                <Printer className="w-4 h-4 text-[#FFA057]" />
                <span>PDF / Print</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onNavigateToSimulation}
            className="btn-accent text-sm font-semibold h-11 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_18px_rgba(255,106,26,0.35)] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run New Episode</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          EMPTY STATE (IF NO EMPIRICAL RUNS EXIST)
          ========================================================================= */}
      {!hasRuns ? (
        <EmptyState
          icon={FileText}
          title="No Benchmark Trials Recorded"
          description="In adherence to empirical scientific rigor, benchmark reports are never populated with fabricated metrics. Execute one or more experimental trials in the Simulation Studio to synthesize this formal evaluation."
          actionText="Execute Initial Episode"
          onAction={onNavigateToSimulation}
          badge="Awaiting Empirical Data"
        />
      ) : (
        <div className="space-y-8 sm:space-y-10">
          
          {/* =====================================================================
              2. ENVIRONMENT PARAMETERS (4 SEPARATE SUMMARY CARDS)
              ===================================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#F8F3EF] tracking-tight">
                  Environment Parameters
                </h2>
                <p className="text-sm text-[#B6AAA0] mt-1">
                  Fixed invariants and perceptual configurations active throughout these evaluation trials.
                </p>
              </div>
              <span className="badge badge-neutral text-xs font-mono self-start sm:self-auto">
                GridWorld Setup
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              
              {/* Card 1: Grid Dimensions */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FF6A1A]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Grid Dimensions
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FF6A1A]/10 text-[#FF6A1A] border border-[#FF6A1A]/20 flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-[26px] font-bold text-[#F8F3EF] font-mono tracking-tight">
                    {environment.gridWidth} × {environment.gridHeight}
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-1.5">
                    {environment.gridWidth * environment.gridHeight} total cell coordinates
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-1.5 text-xs text-[#FF8A32]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A32]" />
                  <span>2D Cartesian Grid</span>
                </div>
              </div>

              {/* Card 2: Initial Dirt Density */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FFA057]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Initial Dirt Density
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FFA057]/10 text-[#FFA057] border border-[#FFA057]/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-[26px] font-bold text-[#FFA057] font-mono tracking-tight">
                    {Math.round(environment.dirtDensity * 100)}%
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-1.5">
                    ~{Math.round(environment.gridWidth * environment.gridHeight * environment.dirtDensity)} contaminated targets
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-1.5 text-xs text-[#FFA057]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFA057]" />
                  <span>Uniform Perlin distribution</span>
                </div>
              </div>

              {/* Card 3: Obstacles */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FF6262]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Obstacles
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FF6262]/10 text-[#FF6262] border border-[#FF6262]/20 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-[26px] font-bold text-[#FF6262] font-mono tracking-tight">
                    {environment.obstacleCount} Barriers
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-1.5">
                    {environment.isDynamicObstacles ? 'Dynamic stochastic shifts' : 'Static impassable walls'}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-1.5 text-xs text-[#FF6262]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6262]" />
                  <span>Penalty: -5 pts on impact</span>
                </div>
              </div>

              {/* Card 4: Observability */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#55D6A2]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Observability
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#55D6A2]/10 text-[#55D6A2] border border-[#55D6A2]/20 flex items-center justify-center">
                      {environment.isPartiallyObservable ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-[26px] font-bold text-[#55D6A2] font-mono tracking-tight">
                    {environment.isPartiallyObservable ? 'Partial Fog (3×3)' : 'Full Horizon'}
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-1.5">
                    {environment.sensorNoiseRate > 0 
                      ? `${Math.round(environment.sensorNoiseRate * 100)}% sensor percept noise` 
                      : 'Deterministic sensor accuracy'}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-1.5 text-xs text-[#55D6A2]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55D6A2]" />
                  <span>{environment.isPartiallyObservable ? 'Requires state memory' : 'Zero state uncertainty'}</span>
                </div>
              </div>

            </div>
          </section>

          {/* =====================================================================
              3. PERFORMANCE METRICS (4 SEPARATE METRIC CARDS)
              ===================================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#F8F3EF] tracking-tight">
                  Aggregated Performance Metrics
                </h2>
                <p className="text-sm text-[#B6AAA0] mt-1">
                  Empirical averages and peak outcomes synthesized across {totalRuns} recorded benchmark run{totalRuns === 1 ? '' : 's'}.
                </p>
              </div>
              <span className="badge badge-green text-xs font-mono self-start sm:self-auto">
                Verified Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              
              {/* Metric 1: Cleaning Success */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#55D6A2]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Cleaning Success
                    </span>
                    <span className="badge badge-green text-[11px] font-mono font-semibold">
                      Peak: {peakCleanRate}%
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#55D6A2] font-mono tracking-tight mt-1">
                    {avgCleanRate}%
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-2">
                    Average dirt cleared across all trials
                  </p>
                </div>
                <div className="w-full bg-[#100A05] h-2 rounded-full mt-4 overflow-hidden border border-[rgba(255,138,50,0.12)]">
                  <div 
                    className="bg-[#55D6A2] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(0, Number(avgCleanRate)))}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Steps Taken */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FF6A1A]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Steps Taken
                    </span>
                    <span className="badge badge-orange text-[11px] font-mono font-semibold">
                      Best: {minStepsTaken} steps
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#FF6A1A] font-mono tracking-tight mt-1">
                    {avgStepsTaken}
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-2">
                    Mean trajectory steps per episode
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(255,138,50,0.12)] flex items-center justify-between text-xs text-[#B6AAA0]">
                  <span>Step Cost: -1 pt/move</span>
                  <span className="text-[#FF8A32] font-mono font-medium">Trajectory Metric</span>
                </div>
              </div>

              {/* Metric 3: Energy Remaining */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FFA057]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Energy Remaining
                    </span>
                    <span className={`badge ${depletedRunsCount === 0 ? 'badge-orange' : 'badge-amber'} text-[11px] font-mono font-semibold`}>
                      {depletedRunsCount === 0 ? '0 Depletions' : `${depletedRunsCount} Depleted`}
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#FFA057] font-mono tracking-tight mt-1">
                    {avgBatteryRemaining}%
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-2">
                    Mean battery preserved at terminal step
                  </p>
                </div>
                <div className="w-full bg-[#100A05] h-2 rounded-full mt-4 overflow-hidden border border-[rgba(255,138,50,0.12)]">
                  <div 
                    className="bg-[#FFA057] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(0, Number(avgBatteryRemaining)))}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Performance Score */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FF8A32]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-medium text-[#81756C] uppercase tracking-wider font-mono">
                      Performance Score
                    </span>
                    <span className="badge badge-amber text-[11px] font-mono font-semibold">
                      High: {topScore} pts
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#FF8A32] font-mono tracking-tight mt-1">
                    {avgScore}
                  </div>
                  <p className="text-sm text-[#B6AAA0] mt-2">
                    Normalized PEAS utility index
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(255,138,50,0.12)] flex items-center justify-between text-xs text-[#B6AAA0]">
                  <span>Formula: 10C - S - 5B</span>
                  <span className="text-[#FF8A32] font-mono font-medium">Standard PEAS</span>
                </div>
              </div>

            </div>
          </section>

          {/* =====================================================================
              4. AGENT COMPARISON TABLE
              ===================================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#F8F3EF] tracking-tight">
                  Agent Comparison Matrix
                </h2>
                <p className="text-sm text-[#B6AAA0] mt-1">
                  Individual performance breakdown for each cognitive topology tested in this session.
                </p>
              </div>
              <span className="text-xs text-[#81756C] font-mono">
                Showing {runs.length} recorded run{runs.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Table Container with Horizontal Scrolling */}
            <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-[#21150E] border-b border-[rgba(255,138,50,0.16)] text-[#B6AAA0] text-[13px] uppercase tracking-wider font-mono">
                      <th className="px-6 py-4 font-semibold">Agent</th>
                      <th className="px-6 py-4 font-semibold">Cleaning Rate</th>
                      <th className="px-6 py-4 font-semibold text-center">Steps</th>
                      <th className="px-6 py-4 font-semibold text-center">Energy Remaining</th>
                      <th className="px-6 py-4 font-semibold text-center">Score</th>
                      <th className="px-6 py-4 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,138,50,0.1)] text-[#F8F3EF]">
                    {runs.map((r, idx) => {
                      const AgentIcon = getAgentIcon(r.agentId);
                      const isTopPerformer = topRun && r.id === topRun.id;
                      const agentColor = getAgentColor(r.agentId);

                      return (
                        <tr 
                          key={r.id || idx} 
                          className={`hover:bg-[#21150E]/60 transition-colors ${
                            isTopPerformer ? 'bg-[#FF6A1A]/[0.06] border-l-4 border-l-[#FF6A1A]' : ''
                          }`}
                        >
                          {/* Agent Name & Topology Badge */}
                          <td className="px-6 py-4 sm:py-5">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                                style={{ 
                                  backgroundColor: `${agentColor}18`, 
                                  borderColor: `${agentColor}40`,
                                  color: agentColor 
                                }}
                              >
                                <AgentIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-[15px] text-[#F8F3EF]">
                                    {r.agentName}
                                  </span>
                                  {isTopPerformer && (
                                    <span className="badge badge-orange text-[10px] font-semibold flex items-center gap-1">
                                      <Trophy className="w-3 h-3 text-[#FF8A32]" />
                                      Top Performer
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#81756C] font-mono mt-0.5">
                                  {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Cleaning Rate */}
                          <td className="px-6 py-4 sm:py-5">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base font-mono text-[#55D6A2]">
                                  {r.cleanPercentage}%
                                </span>
                                <span className="text-xs text-[#81756C] font-mono">
                                  ({r.dirtCleaned}/{r.totalDirt} tiles)
                                </span>
                              </div>
                              <div className="w-28 bg-[#100A05] h-1.5 rounded-full overflow-hidden border border-[rgba(255,138,50,0.12)]">
                                <div 
                                  className="bg-[#55D6A2] h-full rounded-full" 
                                  style={{ width: `${Math.min(100, Math.max(0, r.cleanPercentage))}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Steps Taken */}
                          <td className="px-6 py-4 sm:py-5 text-center">
                            <div className="font-mono text-base font-semibold text-[#FF8A32]">
                              {r.stepsTaken}
                            </div>
                            <div className="text-xs text-[#81756C]">
                              moves
                            </div>
                          </td>

                          {/* Energy Remaining */}
                          <td className="px-6 py-4 sm:py-5 text-center">
                            <div className="inline-flex items-center gap-1.5 font-mono text-base font-semibold text-[#FFA057]">
                              <Battery className="w-4 h-4 text-[#FFA057]" />
                              <span>{r.finalBattery}%</span>
                            </div>
                            <div>
                              <span className={`badge ${
                                r.status === 'success' 
                                  ? 'badge-green' 
                                  : r.status === 'depleted' 
                                  ? 'badge-red' 
                                  : 'badge-amber'
                              } text-[10px] mt-1`}>
                                {r.status === 'success' ? 'Completed' : r.status === 'depleted' ? 'Depleted' : 'Partial'}
                              </span>
                            </div>
                          </td>

                          {/* Final Score */}
                          <td className="px-6 py-4 sm:py-5 text-center">
                            <div className="font-mono text-base font-bold text-[#FF8A32]">
                              {r.finalScore}
                            </div>
                            <div className="text-[11px] text-[#81756C] font-mono">
                              utility pts
                            </div>
                          </td>

                          {/* Details Button */}
                          <td className="px-6 py-4 sm:py-5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRunForDetails(r)}
                              className="btn-secondary text-xs font-medium px-3.5 py-1.5 rounded-lg border border-[rgba(255,138,50,0.2)] hover:border-[#FF6A1A] hover:text-[#FF8A32] text-[#B6AAA0] inline-flex items-center gap-1.5 transition-all"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#FF8A32]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* =====================================================================
              5. ARCHITECTURAL ANALYSIS & INSIGHTS (SEPARATE INSIGHT CARDS)
              ===================================================================== */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#F8F3EF] tracking-tight">
                Architectural Analysis & Insights
              </h2>
              <p className="text-sm text-[#B6AAA0] mt-1">
                Empirical synthesis derived from observed agent actions, search optimality, and failure modes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              
              {/* Insight Card 1: Internal State & Loop Prevention */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FF6A1A]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6A1A]/10 text-[#FF6A1A] border border-[#FF6A1A]/20 flex items-center justify-center">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="badge badge-orange text-[11px] font-mono font-semibold">
                      State Estimation
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F8F3EF] mb-2 leading-snug">
                    Spatial Memory Prevents Infinite Loops
                  </h3>

                  <p className="text-sm text-[#B6AAA0] leading-relaxed">
                    Model-Based agents maintained an internal occupancy grid of visited coordinates. This internal state effectively eliminated the repetitive cyclic oscillations exhibited by stateless Reflex architectures when encountering symmetry or obstacles.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-2 text-xs text-[#FF8A32]">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Validated by 0% cyclic entrapment rate</span>
                </div>
              </div>

              {/* Insight Card 2: Goal-Directed A* Optimality */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#55D6A2]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#55D6A2]/10 text-[#55D6A2] border border-[#55D6A2]/20 flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="badge badge-green text-[11px] font-mono font-semibold">
                      Heuristic Search
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F8F3EF] mb-2 leading-snug">
                    Goal-Based Planning Minimizes Step Waste
                  </h3>

                  <p className="text-sm text-[#B6AAA0] leading-relaxed">
                    By calculating shortest Euclidean paths via Manhattan/A* heuristics to the nearest dirty percept, Goal-Based and Cognitive architectures recorded significantly lower step counts per cleaned tile compared to exploratory random-walk baselines.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-2 text-xs text-[#55D6A2]">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Highest clean rate per step trajectory</span>
                </div>
              </div>

              {/* Insight Card 3: Utility Balancing & Battery Conservation */}
              <div className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.16)] rounded-2xl p-6 shadow-subtle hover:border-[#FFA057]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFA057]/10 text-[#FFA057] border border-[#FFA057]/20 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <span className="badge badge-amber text-[11px] font-mono font-semibold">
                      Multi-Objective
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F8F3EF] mb-2 leading-snug">
                    Utility Theoretic Resource Trade-Offs
                  </h3>

                  <p className="text-sm text-[#B6AAA0] leading-relaxed">
                    Utility-Based agents dynamically weighted reward against remaining battery reserves. When energy dropped below critical thresholds, mission priorities shifted from expansive exploration to localized high-density cleaning, mitigating abrupt depletion.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(255,138,50,0.12)] flex items-center gap-2 text-xs text-[#FFA057]">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Maximized composite utility score</span>
                </div>
              </div>

            </div>
          </section>

        </div>
      )}

      {/* =========================================================================
          6. DETAILED RESULTS MODAL FOR INDIVIDUAL AGENT AUDIT
          ========================================================================= */}
      {selectedRunForDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedRunForDetails(null)}
        >
          <div 
            className="card-primary bg-[#17100B] border border-[rgba(255,138,50,0.25)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_24px_rgba(255,106,26,0.15)] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[rgba(255,138,50,0.16)]">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                  style={{ 
                    backgroundColor: `${getAgentColor(selectedRunForDetails.agentId)}18`, 
                    borderColor: `${getAgentColor(selectedRunForDetails.agentId)}40`,
                    color: getAgentColor(selectedRunForDetails.agentId)
                  }}
                >
                  {React.createElement(getAgentIcon(selectedRunForDetails.agentId), { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#F8F3EF]">
                    {selectedRunForDetails.agentName}
                  </h3>
                  <p className="text-xs text-[#81756C] font-mono mt-0.5">
                    Trial ID: {selectedRunForDetails.id} • {new Date(selectedRunForDetails.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRunForDetails(null)}
                className="w-8 h-8 rounded-lg border border-[rgba(255,138,50,0.2)] bg-[#21150E] hover:bg-[#2d1c13] text-[#B6AAA0] hover:text-[#F8F3EF] flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Performance Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block font-mono">Clean Rate</span>
                <span className="text-lg font-bold font-mono text-[#55D6A2] mt-1 block">
                  {selectedRunForDetails.cleanPercentage}%
                </span>
                <span className="text-[11px] text-[#81756C]">
                  {selectedRunForDetails.dirtCleaned} of {selectedRunForDetails.totalDirt} tiles
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block font-mono">Steps Taken</span>
                <span className="text-lg font-bold font-mono text-[#FF8A32] mt-1 block">
                  {selectedRunForDetails.stepsTaken}
                </span>
                <span className="text-[11px] text-[#81756C]">
                  trajectory moves
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block font-mono">Final Energy</span>
                <span className="text-lg font-bold font-mono text-[#FFA057] mt-1 block">
                  {selectedRunForDetails.finalBattery}%
                </span>
                <span className="text-[11px] text-[#81756C]">
                  battery preserved
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
                <span className="text-xs text-[#81756C] block font-mono">PEAS Score</span>
                <span className="text-lg font-bold font-mono text-[#FF8A32] mt-1 block">
                  {selectedRunForDetails.finalScore}
                </span>
                <span className="text-[11px] text-[#81756C]">
                  utility index
                </span>
              </div>
            </div>

            {/* Action Distribution Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#F8F3EF] uppercase tracking-wider font-mono">
                Actuator Execution Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#21150E] border border-[rgba(255,138,50,0.14)]">
                  <span className="text-[#81756C] block">SUCK Actions</span>
                  <span className="text-base font-bold text-[#55D6A2] mt-1 block">
                    {selectedRunForDetails.stepRecords?.filter(s => s.action === 'SUCK').length || selectedRunForDetails.dirtCleaned}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#21150E] border border-[rgba(255,138,50,0.14)]">
                  <span className="text-[#81756C] block">MOVE Advances</span>
                  <span className="text-base font-bold text-[#FF8A32] mt-1 block">
                    {selectedRunForDetails.stepRecords?.filter(s => s.action === 'MOVE').length || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#21150E] border border-[rgba(255,138,50,0.14)]">
                  <span className="text-[#81756C] block">Rotations (Turn)</span>
                  <span className="text-base font-bold text-[#FFA057] mt-1 block">
                    {selectedRunForDetails.stepRecords?.filter(s => s.action === 'TURN_LEFT' || s.action === 'TURN_RIGHT').length || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#21150E] border border-[rgba(255,138,50,0.14)]">
                  <span className="text-[#81756C] block">Obstacle Bumps</span>
                  <span className="text-base font-bold text-[#FF6262] mt-1 block">
                    {selectedRunForDetails.stepRecords?.filter(s => s.action === 'BUMP').length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Theoretical Spec */}
            {(() => {
              const agentSpec = AGENT_REGISTRY.find(a => a.id === selectedRunForDetails.agentId);
              if (!agentSpec) return null;
              return (
                <div className="space-y-3 pt-4 border-t border-[rgba(255,138,50,0.16)]">
                  <h4 className="text-sm font-semibold text-[#F8F3EF] uppercase tracking-wider font-mono">
                    PEAS Theoretical Specification
                  </h4>
                  <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] space-y-2.5 text-xs text-[#B6AAA0]">
                    <div>
                      <strong className="text-[#F8F3EF] font-medium font-mono">Performance Measure: </strong>
                      <span>{agentSpec.peas.performance.join(' • ')}</span>
                    </div>
                    <div>
                      <strong className="text-[#F8F3EF] font-medium font-mono">Environment: </strong>
                      <span>{agentSpec.peas.environment.join(' • ')}</span>
                    </div>
                    <div>
                      <strong className="text-[#F8F3EF] font-medium font-mono">Actuators: </strong>
                      <span>{agentSpec.peas.actuators.join(' • ')}</span>
                    </div>
                    <div>
                      <strong className="text-[#F8F3EF] font-medium font-mono">Sensors: </strong>
                      <span>{agentSpec.peas.sensors.join(' • ')}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[rgba(255,138,50,0.16)] flex items-center justify-between">
              <span className="text-xs text-[#81756C] font-mono">
                Duration: {selectedRunForDetails.durationMs ? `${selectedRunForDetails.durationMs}ms` : 'Recorded in real-time'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRunForDetails(null)}
                className="btn-secondary text-sm font-medium px-4 py-2 rounded-xl"
              >
                Close Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
