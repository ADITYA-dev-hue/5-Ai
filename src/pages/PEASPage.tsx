import React, { useState } from 'react';
import { 
  Layers, 
  Trophy, 
  Globe, 
  Cpu, 
  Eye, 
  CheckCircle2, 
  Table, 
  LayoutGrid, 
  Bot 
} from 'lucide-react';
import { AGENT_REGISTRY } from '../data/agents';

export const PEASPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              Russell & Norvig Model
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • Formal Agent Specification
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            PEAS Matrix & Formal Breakdown
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Structured analysis of Performance, Environment, Actuators, and Sensors across all five agent architectures.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1.5 bg-[#100A05] p-1.5 rounded-xl border border-[rgba(255,138,50,0.16)]">
          <button
            onClick={() => setViewMode('cards')}
            className={`py-2 px-3.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm transition-all min-h-[38px] ${
              viewMode === 'cards'
                ? 'bg-[#21150E] text-[#FF8A32] font-semibold border border-[rgba(255,138,50,0.25)] shadow-sm'
                : 'text-[#B6AAA0] hover:text-[#F8F3EF]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`py-2 px-3.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm transition-all min-h-[38px] ${
              viewMode === 'table'
                ? 'bg-[#21150E] text-[#FF8A32] font-semibold border border-[rgba(255,138,50,0.25)] shadow-sm'
                : 'text-[#B6AAA0] hover:text-[#F8F3EF]'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Matrix Table</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="space-y-6">
          {AGENT_REGISTRY.map((agent) => (
            <div
              key={agent.id}
              className="card-primary p-6 rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] space-y-5 hover:border-[#FF6A1A]/40 transition-colors shadow-card"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(255,138,50,0.16)]">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border"
                    style={{ backgroundColor: `${agent.color}20`, borderColor: `${agent.color}50`, color: agent.color }}
                  >
                    {agent.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#F8F3EF]">{agent.name}</h3>
                    <p className="text-xs sm:text-sm text-[#B6AAA0]">{agent.oneLineDesc}</p>
                  </div>
                </div>
                <span className="badge badge-neutral text-xs font-mono">{agent.category}</span>
              </div>

              {/* 4 PEAS Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Performance */}
                <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] space-y-2.5">
                  <div className="flex items-center gap-2 text-[#55D6A2] font-semibold text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>Performance (P)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#B6AAA0]">
                    {agent.peas.performance.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#55D6A2] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Environment */}
                <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FF8A32] font-semibold text-sm">
                    <Globe className="w-4 h-4" />
                    <span>Environment (E)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#B6AAA0]">
                    {agent.peas.environment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#FF8A32] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actuators */}
                <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FF6A1A] font-semibold text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>Actuators (A)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#B6AAA0]">
                    {agent.peas.actuators.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#FF6A1A] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sensors */}
                <div className="p-4 rounded-xl bg-[#100A05] border border-[rgba(255,138,50,0.14)] space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FFA057] font-semibold text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Sensors (S)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#B6AAA0]">
                    {agent.peas.sensors.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#FFA057] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Matrix Table View */
        <div className="card-primary rounded-2xl border border-[rgba(255,138,50,0.16)] bg-[#17100B] overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="bg-[#21150E] border-b border-[rgba(255,138,50,0.16)] text-[#B6AAA0] font-mono text-xs sm:text-[13px] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold text-[#F8F3EF]">Agent Architecture</th>
                  <th className="py-4 px-6 font-semibold text-[#55D6A2]">Performance (P)</th>
                  <th className="py-4 px-6 font-semibold text-[#FF8A32]">Environment (E)</th>
                  <th className="py-4 px-6 font-semibold text-[#FF6A1A]">Actuators (A)</th>
                  <th className="py-4 px-6 font-semibold text-[#FFA057]">Sensors (S)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,138,50,0.1)] text-[#B6AAA0]">
                {AGENT_REGISTRY.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[#21150E]/40 transition-colors align-top">
                    <td className="py-4 px-6 font-semibold text-sm sm:text-base text-[#F8F3EF] whitespace-nowrap">
                      {agent.name}
                      <span className="block text-xs text-[#81756C] font-normal font-mono mt-0.5">{agent.category}</span>
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-[13px] leading-relaxed">
                      {agent.peas.performance.join('; ')}
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-[13px] leading-relaxed">
                      {agent.peas.environment.join('; ')}
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-[13px] leading-relaxed">
                      {agent.peas.actuators.join('; ')}
                    </td>
                    <td className="py-4 px-6 text-xs sm:text-[13px] leading-relaxed">
                      {agent.peas.sensors.join('; ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
