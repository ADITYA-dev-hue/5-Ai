import React, { useState } from 'react';
import { 
  Bot, 
  Zap, 
  Cpu, 
  Target, 
  Scale, 
  Sparkles, 
  PlayCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { AGENT_REGISTRY } from '../data/agents';
import { ActivePage, AgentInfo, AgentType } from '../types';

interface AgentsPageProps {
  onSelectAgentForSim: (id: AgentType) => void;
  onNavigate: (page: ActivePage) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  onSelectAgentForSim,
  onNavigate,
}) => {
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  const getAgentIcon = (id: AgentType) => {
    switch (id) {
      case 'simple_reflex': return Zap;
      case 'model_based': return Cpu;
      case 'goal_based': return Target;
      case 'utility_based': return Scale;
      case 'learning_cognitive': return Sparkles;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAgentId(expandedAgentId === id ? null : id);
  };

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Cognitive Taxonomy
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • Russell & Norvig Standard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Autonomous Agent Architectures
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Five core agent architectures spanning simple condition-action reflex loops to goal-driven search and utility-theoretic cognition.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('comparison')}
            className="btn-accent h-11 px-5 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-[0_4px_18px_rgba(255,106,26,0.35)]"
          >
            <BarChart3 className="w-4 h-4 fill-current" />
            <span>Head-to-Head Compare</span>
          </button>
        </div>
      </div>

      {/* Five Visual Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENT_REGISTRY.map((agent) => {
          const Icon = getAgentIcon(agent.id);
          const isExpanded = expandedAgentId === agent.id;

          return (
            <div
              key={agent.id}
              className="card-primary p-6 rounded-2xl flex flex-col justify-between hover:border-[#FF6A1A] transition-all space-y-5 group"
            >
              <div>
                {/* Header: Icon, Badge, Name */}
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm"
                      style={{ 
                        backgroundColor: 'rgba(255, 106, 26, 0.12)', 
                        borderColor: 'rgba(255, 138, 50, 0.28)', 
                        color: '#FF8A32' 
                      }}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#F8F3EF] group-hover:text-[#FF8A32] transition-colors">
                        {agent.name}
                      </h3>
                      <span className="text-xs font-mono text-[#81756C] block">{agent.category}</span>
                    </div>
                  </div>
                  <span className="badge badge-neutral text-[10px] font-mono">{agent.badge}</span>
                </div>

                {/* One-Line Description */}
                <p className="text-sm sm:text-[14.5px] text-[#B6AAA0] leading-relaxed mb-4">
                  {agent.oneLineDesc}
                </p>

                {/* Visual Metric Indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-3.5">
                  <div className="p-3 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.16)]">
                    <span className="text-xs text-[#81756C] block font-medium">Efficiency Score</span>
                    <span className="font-mono font-bold text-[#55D6A2] text-base mt-0.5 block">{agent.avgEfficiencyScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.16)]">
                    <span className="text-xs text-[#81756C] block font-medium">Avg Steps</span>
                    <span className="font-mono font-bold text-[#FF8A32] text-base mt-0.5 block">~{agent.avgStepsToClean}</span>
                  </div>
                </div>

                {/* Expandable Decision Logic Panel */}
                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.22)] space-y-3 text-xs animate-fadeIn">
                    <div>
                      <span className="text-xs font-mono uppercase text-[#FF6A1A] block font-semibold">
                        Decision Strategy
                      </span>
                      <code className="text-xs sm:text-[13px] font-mono text-[#F8F3EF] block mt-1 leading-relaxed">
                        {agent.decisionRule}
                      </code>
                    </div>

                    <div className="pt-2.5 border-t border-[rgba(255,138,50,0.14)]">
                      <span className="text-xs font-mono uppercase text-[#FF8A32] block font-semibold">
                        Internal State Representation
                      </span>
                      <span className="text-xs sm:text-[13px] text-[#B6AAA0] block mt-1 leading-relaxed">
                        {agent.internalState}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-[rgba(255,138,50,0.14)] space-y-2">
                      <div className="text-xs sm:text-[13px] text-[#55D6A2] font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Strength: {agent.strengths[0]}</span>
                      </div>
                      <div className="text-xs sm:text-[13px] text-[#FF8A32] font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>Trade-off: {agent.limitations[0]}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons & Expand Toggle */}
              <div className="space-y-3 pt-3 border-t border-[rgba(255,138,50,0.16)]">
                <button
                  onClick={() => toggleExpand(agent.id)}
                  className="w-full text-xs sm:text-[13px] text-[#B6AAA0] hover:text-[#F8F3EF] flex items-center justify-center gap-1.5 py-1.5 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Details' : 'View Decision Rule & Logic'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      onSelectAgentForSim(agent.id);
                      onNavigate('simulation');
                    }}
                    className="flex-1 btn-accent text-sm min-h-[42px] flex items-center justify-center gap-2 py-2 px-4 font-semibold"
                  >
                    <PlayCircle className="w-4 h-4 fill-current" />
                    <span>Run in Simulation</span>
                  </button>

                  <button
                    onClick={() => onNavigate('peas')}
                    className="btn-secondary text-xs p-2"
                    title="Inspect PEAS Matrix"
                  >
                    <Layers className="w-4 h-4 text-[#FF8A32]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
