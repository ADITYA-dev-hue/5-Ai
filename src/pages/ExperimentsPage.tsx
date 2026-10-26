import React, { useState } from 'react';
import { 
  FlaskConical, 
  Bot, 
  Sliders, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { AGENT_REGISTRY } from '../data/agents';
import { runCompleteEpisode } from '../lib/grid-simulation';
import { AgentRunResult, AgentType, EnvironmentConfig } from '../types';

interface ExperimentsPageProps {
  environment: EnvironmentConfig;
  onRecordRun: (run: AgentRunResult) => void;
  onNavigateToAnalytics: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ExperimentsPage: React.FC<ExperimentsPageProps> = ({
  environment,
  onRecordRun,
  onNavigateToAnalytics,
  onShowToast,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([
    'simple_reflex',
    'model_based',
    'goal_based',
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [batchResults, setBatchResults] = useState<AgentRunResult[]>([]);

  const toggleAgent = (id: AgentType) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleRunExperimentBatch = async () => {
    if (selectedAgents.length === 0 || isExecuting) return;

    setIsExecuting(true);
    setProgressPct(5);
    setBatchResults([]);
    onShowToast('Experiment Started', `Running batch across ${selectedAgents.length} agents...`, 'info');

    const results: AgentRunResult[] = [];
    for (let i = 0; i < selectedAgents.length; i++) {
      const agentId = selectedAgents[i];
      await new Promise((r) => setTimeout(r, 350));
      const res = runCompleteEpisode(agentId, environment, 80);
      results.push(res);
      onRecordRun(res);
      setProgressPct(Math.round(((i + 1) / selectedAgents.length) * 100));
    }

    setBatchResults(results);
    setIsExecuting(false);
    setStep(3);
    onShowToast('Batch Completed', `Successfully executed ${results.length} experimental episodes.`, 'success');
  };

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Experiment Suite
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • Controlled Batch Protocols
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Step-Based Experiment Wizard
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Configure test cohorts, apply spatial environment constraints, and execute batch benchmarks.
          </p>
        </div>

        {step === 3 && batchResults.length > 0 && (
          <button
            onClick={onNavigateToAnalytics}
            className="btn-accent h-11 px-5 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-[0_4px_18px_rgba(255,106,26,0.35)]"
          >
            <BarChart3 className="w-4 h-4 fill-current" />
            <span>View in Analytics</span>
          </button>
        )}
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { num: 1, label: 'Select Cohort', desc: 'Choose agents to test' },
          { num: 2, label: 'Review Protocol', desc: 'Check environment bounds' },
          { num: 3, label: 'Run & Results', desc: 'Execution telemetry' },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;

          return (
            <button
              key={s.num}
              onClick={() => !isExecuting && setStep(s.num)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-[#21150E] border-[#FF6A1A] shadow-[0_0_15px_rgba(255,106,26,0.15)]'
                  : isDone
                  ? 'bg-[#17100B] border-[#55D6A2]/40 text-[#F8F3EF]'
                  : 'bg-[#100A05] border-[rgba(255,138,50,0.14)] text-[#81756C]'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                  isActive ? 'bg-[#FF6A1A] text-[#090603]' : isDone ? 'bg-[#55D6A2] text-[#090603]' : 'bg-[rgba(255,138,50,0.16)] text-[#81756C]'
                }`}>
                  {isDone ? '✓' : s.num}
                </span>
                <span className="font-semibold text-sm sm:text-base text-[#F8F3EF]">{s.label}</span>
              </div>
              <span className="text-xs text-[#B6AAA0] block">{s.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Cohort Selection */}
      {step === 1 && (
        <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] space-y-5 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(255,138,50,0.16)]">
            <div>
              <h3 className="font-semibold text-base text-[#F8F3EF]">Select Agent Cohort</h3>
              <p className="text-xs sm:text-sm text-[#B6AAA0] mt-0.5">Choose which architectures to include in the comparative trial.</p>
            </div>
            <span className="badge badge-neutral text-xs font-mono">
              {selectedAgents.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENT_REGISTRY.map((agent) => {
              const isChecked = selectedAgents.includes(agent.id);
              return (
                <div
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-[#21150E] border-[#FF6A1A] shadow-sm'
                      : 'bg-[#100A05] border-[rgba(255,138,50,0.14)] opacity-75 hover:opacity-100 hover:border-[rgba(255,138,50,0.25)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by parent div
                    className="mt-1 accent-[#FF6A1A] cursor-pointer w-4 h-4"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-[#F8F3EF]">{agent.name}</h4>
                    <span className="text-xs font-mono text-[#81756C] block mb-1">{agent.category}</span>
                    <p className="text-xs sm:text-[13px] text-[#B6AAA0] leading-relaxed">{agent.oneLineDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-[rgba(255,138,50,0.16)]">
            <button
              onClick={() => setStep(2)}
              disabled={selectedAgents.length === 0}
              className="btn-accent h-11 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <span>Next: Review Protocol</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Protocol Review */}
      {step === 2 && (
        <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] space-y-5 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(255,138,50,0.16)]">
            <div>
              <h3 className="font-semibold text-base text-[#F8F3EF]">Review Experimental Protocol</h3>
              <p className="text-xs sm:text-sm text-[#B6AAA0] mt-0.5">Verify spatial parameters before initiating batch execution.</p>
            </div>
            <span className="badge badge-green text-xs font-mono">Ready</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
              <span className="text-xs text-[#81756C] block font-medium">Grid Space</span>
              <span className="font-mono font-bold text-sm sm:text-base text-[#F8F3EF] mt-1 block">
                {environment.gridWidth} × {environment.gridHeight} ({environment.gridWidth * environment.gridHeight} tiles)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
              <span className="text-xs text-[#81756C] block font-medium">Dirt Coverage</span>
              <span className="font-mono font-bold text-sm sm:text-base text-[#FF8A32] mt-1 block">
                {Math.round(environment.dirtDensity * 100)}% density
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
              <span className="text-xs text-[#81756C] block font-medium">Static Obstacles</span>
              <span className="font-mono font-bold text-sm sm:text-base text-[#FF6262] mt-1 block">
                {environment.obstacleCount} Blocks
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)]">
              <span className="text-xs text-[#81756C] block font-medium">Battery Limit</span>
              <span className="font-mono font-bold text-sm sm:text-base text-[#FF6A1A] mt-1 block">
                {environment.batteryCapacity} mAh
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[rgba(255,138,50,0.16)]">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary h-11 px-5 rounded-xl font-medium text-sm"
            >
              Back: Edit Cohort
            </button>

            <button
              onClick={handleRunExperimentBatch}
              disabled={isExecuting}
              className="btn-accent h-11 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-50 shadow-[0_4px_18px_rgba(255,106,26,0.35)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Initiate Batch Execution</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Run Execution & Results */}
      {step === 3 && (
        <div className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] space-y-5 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(255,138,50,0.16)]">
            <div>
              <h3 className="font-semibold text-base text-[#F8F3EF]">Execution Telemetry</h3>
              <p className="text-xs sm:text-sm text-[#B6AAA0] mt-0.5">Batch benchmark outcomes recorded across tested architectures.</p>
            </div>
            <span className="badge badge-orange text-xs font-mono">
              {progressPct}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#100A05] h-2.5 rounded-full overflow-hidden border border-[rgba(255,138,50,0.16)]">
            <div
              className="bg-[#FF6A1A] h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,106,26,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {batchResults.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm sm:text-base text-[#F8F3EF]">{res.agentName}</h4>
                  <span className={`badge ${
                    res.cleanPercentage === 100 ? 'badge-green' : 'badge-amber'
                  } text-xs font-mono`}>
                    {res.cleanPercentage}% Clean
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1.5 text-xs font-mono text-[#B6AAA0]">
                  <div>Score: <b className="text-[#55D6A2]">{res.finalScore}</b></div>
                  <div>Steps: {res.stepsTaken}</div>
                  <div>Battery: <b className="text-[#FF8A32]">{res.finalBattery}%</b></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[rgba(255,138,50,0.16)]">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary h-11 px-5 rounded-xl font-medium text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Setup Another Trial</span>
            </button>

            <button
              onClick={onNavigateToAnalytics}
              className="btn-accent h-11 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-[0_4px_18px_rgba(255,106,26,0.35)]"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Inspect Plotly Charts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
