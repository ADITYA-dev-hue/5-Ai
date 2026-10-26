import React, { useState } from 'react';
import { 
  Network, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Clock, 
  Coins, 
  Share2, 
  Play, 
  Sparkles,
  Bot,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { ARCHITECTURES } from '../data/architectures';
import { Architecture, ArchitectureConfig, ArchitectureId } from '../types';

interface ArchitecturesPageProps {
  onSelectForSimulation: (archId: ArchitectureId) => void;
}

export const ArchitecturesPage: React.FC<ArchitecturesPageProps> = ({
  onSelectForSimulation,
}) => {
  const [selectedArchId, setSelectedArchId] = useState<ArchitectureId>('hierarchical_router');
  const [config, setConfig] = useState<Record<ArchitectureId, ArchitectureConfig>>(() => {
    const initial: Record<string, ArchitectureConfig> = {};
    ARCHITECTURES.forEach((a) => {
      initial[a.id] = { ...a.defaultConfig };
    });
    return initial as Record<ArchitectureId, ArchitectureConfig>;
  });

  const currentArch = ARCHITECTURES.find((a) => a.id === selectedArchId) || ARCHITECTURES[0];
  const currentConfig = config[selectedArchId];

  const handleConfigChange = (key: keyof ArchitectureConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [selectedArchId]: {
        ...prev[selectedArchId],
        [key]: value,
      },
    }));
  };

  const toggleTool = (tool: string) => {
    const existing = currentConfig.enabledTools;
    const updated = existing.includes(tool)
      ? existing.filter((t) => t !== tool)
      : [...existing, tool];
    handleConfigChange('enabledTools', updated);
  };

  return (
    <div className="lab-container py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#29313F] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-purple">Topology Studio</span>
            <span className="text-caption">• Multi-Agent Comparative Topologies</span>
          </div>
          <h1 className="heading-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F6FA]">
            Architecture Topologies & Specialization
          </h1>
          <p className="text-body max-w-2xl text-sm sm:text-base text-[#A7B0C0] mt-1.5">
            Inspect, configure, and benchmark four foundational multi-agent patterns. Contrast single-agent ReAct with phased pipelines, hierarchical orchestrators, and adversarial reflection loops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectForSimulation(selectedArchId)}
            className="btn-accent text-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Simulate Architecture</span>
          </button>
        </div>
      </div>

      {/* Architecture Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ARCHITECTURES.map((arch) => {
          const isSelected = arch.id === selectedArchId;
          return (
            <button
              key={arch.id}
              onClick={() => setSelectedArchId(arch.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#1D2430] border-[#8CB8FF] shadow-card ring-1 ring-[#8CB8FF]/40'
                  : 'bg-[#171C25] border-[#29313F] hover:border-[#3A4558] hover:bg-[#1D2430]/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#8CB8FF]/20 text-[#8CB8FF]' : 'bg-[#29313F] text-[#A7B0C0]'
                }`}>
                  {arch.badge}
                </span>
                <span className="text-xs text-[#A7B0C0]">{arch.nodes.length} {arch.nodes.length === 1 ? 'Node' : 'Nodes'}</span>
              </div>
              <h3 className="font-semibold text-sm text-[#F5F6FA] mb-1">{arch.name}</h3>
              <p className="text-xs text-[#A7B0C0] line-clamp-2 leading-relaxed">{arch.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Topology Diagram + Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Topology Diagram */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-primary p-6 rounded-xl border border-[#29313F]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-[#9C86CE]" />
                <h2 className="heading-card text-base font-semibold text-[#F5F6FA]">
                  Active Topology: {currentArch.name}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-[#A7B0C0]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8CB8FF]" /> Latency: {currentArch.latencyProfile}
                </span>
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#22C997]" /> Cost: {currentArch.costProfile}
                </span>
              </div>
            </div>

            {/* Interactive Topology Graph Canvas */}
            <div className="p-8 rounded-xl bg-[#0A0D12]/80 border border-[#29313F] min-h-[320px] flex flex-col justify-center items-center relative overflow-hidden">
              {/* Subtle background laboratory grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#29313F_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* Node Rendering based on topology */}
              {selectedArchId === 'single_react' && (
                <div className="relative z-10 w-full max-w-md p-6 rounded-xl bg-[#171C25] border-2 border-[#9C86CE] shadow-lg text-center">
                  <div className="w-12 h-12 rounded-full bg-[#9C86CE]/15 border border-[#9C86CE] mx-auto flex items-center justify-center text-[#9C86CE] mb-3">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-base text-[#F5F6FA]">ReAct Core Agent</h4>
                  <p className="text-xs text-[#8CB8FF] font-mono mt-0.5">{currentConfig.selectedModel}</p>
                  <p className="text-xs text-[#A7B0C0] mt-2 max-w-sm mx-auto">
                    Monolithic Reasoning Loop • Direct Thought ↔ Action ↔ Observation Interleaving
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {currentConfig.enabledTools.map((tool) => (
                      <span key={tool} className="badge badge-neutral text-[10px]">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedArchId === 'sequential_pipeline' && (
                <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-4">
                  {currentArch.nodes.map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <div className="p-4 rounded-xl bg-[#171C25] border border-[#29313F] w-full md:w-56 text-center hover:border-[#8CB8FF] transition-colors shadow-subtle">
                        <div className="w-8 h-8 rounded-lg bg-[#8CB8FF]/15 border border-[#8CB8FF]/30 mx-auto flex items-center justify-center text-[#8CB8FF] mb-2 font-mono text-xs font-bold">
                          0{idx + 1}
                        </div>
                        <h4 className="font-semibold text-xs text-[#F5F6FA]">{node.name}</h4>
                        <p className="text-[10px] text-[#A7B0C0] mt-1 line-clamp-2">{node.role}</p>
                        <span className="badge badge-neutral text-[9px] mt-3 font-mono">
                          {node.model}
                        </span>
                      </div>
                      {idx < currentArch.nodes.length - 1 && (
                        <div className="flex items-center text-[#9C86CE] rotate-90 md:rotate-0 my-1 md:my-0">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {selectedArchId === 'hierarchical_router' && (
                <div className="relative z-10 w-full space-y-6">
                  {/* Central Router */}
                  <div className="max-w-xs mx-auto p-4 rounded-xl bg-[#1D2430] border-2 border-[#8CB8FF] text-center shadow-md">
                    <span className="badge badge-blue text-[10px] mb-1">Executive Router</span>
                    <h4 className="font-semibold text-sm text-[#F5F6FA]">Executive Orchestrator</h4>
                    <p className="text-[11px] text-[#A7B0C0] mt-1">Dispatches subtasks & synthesizes final response</p>
                  </div>

                  {/* Fan-out Worker Tier */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentArch.nodes.filter(n => n.id !== 'router-orchestrator').map((worker) => (
                      <div key={worker.id} className="p-3.5 rounded-xl bg-[#171C25] border border-[#29313F] text-center hover:border-[#9C86CE] transition-colors">
                        <span className="badge badge-purple text-[9px] mb-1.5">{worker.role}</span>
                        <h5 className="font-medium text-xs text-[#F5F6FA]">{worker.name}</h5>
                        <p className="text-[10px] text-[#A7B0C0] mt-1 line-clamp-2">{worker.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedArchId === 'reflection_critic' && (
                <div className="relative z-10 w-full max-w-lg flex flex-col md:flex-row items-center justify-between gap-6 p-4">
                  {/* Generator Node */}
                  <div className="w-full md:w-56 p-5 rounded-xl bg-[#171C25] border-2 border-[#8CB8FF] text-center shadow-card">
                    <span className="badge badge-blue text-[10px] mb-2">Proposer Node</span>
                    <h4 className="font-semibold text-sm text-[#F5F6FA]">Primary Synthesizer</h4>
                    <p className="text-xs text-[#A7B0C0] mt-1">Generates and refines code artifact</p>
                  </div>

                  {/* Circular Refinement Arrows */}
                  <div className="flex flex-col items-center gap-1 text-[#9C86CE]">
                    <div className="flex items-center gap-1 text-[11px] font-mono">
                      <span>Propose</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="w-16 h-0.5 bg-[#29313F]" />
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#F59E0B]">
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      <span>Critique</span>
                    </div>
                  </div>

                  {/* Adversarial Critic Node */}
                  <div className="w-full md:w-56 p-5 rounded-xl bg-[#171C25] border-2 border-[#F59E0B] text-center shadow-card">
                    <span className="badge badge-amber text-[10px] mb-2">Adversarial Critic</span>
                    <h4 className="font-semibold text-sm text-[#F5F6FA]">Rubric Inspector</h4>
                    <p className="text-xs text-[#A7B0C0] mt-1">Stress-tests invariants & scores defects</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Grid: Strengths, Tradeoffs & Best For */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#29313F]">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22C997]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </div>
                <ul className="space-y-1.5">
                  {currentArch.strengths.map((str, i) => (
                    <li key={i} className="text-xs text-[#A7B0C0] leading-relaxed flex items-start gap-1.5">
                      <span className="text-[#22C997] font-bold mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tradeoffs & Constraints</span>
                </div>
                <ul className="space-y-1.5">
                  {currentArch.tradeoffs.map((tra, i) => (
                    <li key={i} className="text-xs text-[#A7B0C0] leading-relaxed flex items-start gap-1.5">
                      <span className="text-[#F59E0B] font-bold mt-0.5">•</span>
                      <span>{tra}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8CB8FF]">
                  <Layers className="w-4 h-4" />
                  <span>Optimal Workloads</span>
                </div>
                <ul className="space-y-1.5">
                  {currentArch.bestUseCases.map((use, i) => (
                    <li key={i} className="text-xs text-[#A7B0C0] leading-relaxed flex items-start gap-1.5">
                      <span className="text-[#8CB8FF] font-bold mt-0.5">•</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Tooling Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-elevated p-6 rounded-xl border border-[#29313F] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#29313F]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#8CB8FF]" />
                <h3 className="heading-card text-sm font-semibold text-[#F5F6FA]">
                  Hyperparameters & Tools
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A7B0C0]">Active Tuner</span>
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#F5F6FA] flex justify-between">
                <span>Foundation Model</span>
                <span className="text-[11px] font-mono text-[#8CB8FF]">API Ready</span>
              </label>
              <select
                value={currentConfig.selectedModel}
                onChange={(e) => handleConfigChange('selectedModel', e.target.value)}
                className="select-field text-xs bg-[#171C25] border-[#29313F] text-[#F5F6FA] rounded-lg"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-low latency)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep reasoning)</option>
                <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Hybrid thinking)</option>
                <option value="gpt-4o">GPT-4o (Multimodal generalist)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#F5F6FA]">Temperature</span>
                <span className="font-mono text-[#9C86CE]">{currentConfig.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentConfig.temperature}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full accent-[#9C86CE] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A7B0C0]">
                <span>Deterministic (0.0)</span>
                <span>Exploratory (1.0)</span>
              </div>
            </div>

            {/* Max Reasoning Turns */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#F5F6FA]">Max Step Budget</span>
                <span className="font-mono text-[#8CB8FF]">{currentConfig.maxTurns} turns</span>
              </div>
              <input
                type="range"
                min="3"
                max="16"
                step="1"
                value={currentConfig.maxTurns}
                onChange={(e) => handleConfigChange('maxTurns', parseInt(e.target.value, 10))}
                className="w-full accent-[#8CB8FF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A7B0C0]">
                <span>3 Turns</span>
                <span>16 Turns</span>
              </div>
            </div>

            {/* Enabled Tools Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-[#29313F]">
              <label className="text-xs font-medium text-[#F5F6FA] flex items-center justify-between">
                <span>Bound Tools & Capabilities</span>
                <span className="text-[10px] font-mono text-[#A7B0C0]">{currentConfig.enabledTools.length} Active</span>
              </label>

              <div className="space-y-2">
                {[
                  'Code Sandbox',
                  'Schema Inspector',
                  'Web Retrieval',
                  'Database Query',
                  'Test Suite Runner',
                  'Security Linter',
                ].map((tool) => {
                  const isChecked = currentConfig.enabledTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs border transition-colors ${
                        isChecked
                          ? 'bg-[#171C25] border-[#8CB8FF]/40 text-[#F5F6FA]'
                          : 'bg-[#171C25]/40 border-[#29313F] text-[#A7B0C0] hover:text-[#F5F6FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className={`w-3.5 h-3.5 ${isChecked ? 'text-[#8CB8FF]' : 'text-[#6E798E]'}`} />
                        <span>{tool}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${isChecked ? 'bg-[#22C997]' : 'bg-[#29313F]'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onSelectForSimulation(selectedArchId)}
              className="w-full btn-accent text-xs py-2.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Launch in Simulation Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
