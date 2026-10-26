import React, { useState } from 'react';
import { 
  Sliders, 
  Grid, 
  Sparkles, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Battery, 
  RotateCcw, 
  CheckCircle2, 
  PlayCircle,
  Zap
} from 'lucide-react';
import { ActivePage, EnvironmentConfig } from '../types';

interface EnvironmentPageProps {
  environment: EnvironmentConfig;
  onUpdateEnvironment: (newConfig: EnvironmentConfig) => void;
  onNavigateToSimulation: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const EnvironmentPage: React.FC<EnvironmentPageProps> = ({
  environment,
  onUpdateEnvironment,
  onNavigateToSimulation,
  onShowToast,
}) => {
  const [config, setConfig] = useState<EnvironmentConfig>(environment);

  const updateField = (key: keyof EnvironmentConfig, value: any) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    onUpdateEnvironment(updated);
  };

  const applyPreset = (presetName: string, preset: Partial<EnvironmentConfig>) => {
    const updated = { ...config, ...preset };
    setConfig(updated);
    onUpdateEnvironment(updated);
    onShowToast(`Applied Preset: ${presetName}`, 'Environment configuration updated.', 'success');
  };

  const resetDefaults = () => {
    const def: EnvironmentConfig = {
      gridWidth: 5,
      gridHeight: 5,
      dirtDensity: 0.32,
      obstacleCount: 3,
      isPartiallyObservable: false,
      sensorNoiseRate: 0.0,
      isDynamicObstacles: false,
      batteryCapacity: 100,
    };
    setConfig(def);
    onUpdateEnvironment(def);
    onShowToast('Reset to Defaults', 'Standard 5x5 laboratory environment restored.', 'info');
  };

  return (
    <div className="lab-container py-8 px-6 sm:px-8 lg:px-9 space-y-8 animate-fadeIn text-[#F8F3EF]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,138,50,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-orange text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1">
              World Configuration
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#81756C]">
              • Physics & Percepts
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F3EF] tracking-tight leading-tight">
            Environment Tuning & Physics
          </h1>
          <p className="text-sm sm:text-base text-[#B6AAA0] mt-1.5 max-w-2xl leading-relaxed">
            Configure spatial grid dimensions, obstacle barriers, dirt contamination density, sensor observability, and energy parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDefaults}
            className="btn-ghost h-11 px-4 text-sm flex items-center gap-2 text-[#B6AAA0] hover:text-[#F8F3EF]"
            title="Reset to standard defaults"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onNavigateToSimulation}
            className="btn-accent h-11 px-5 text-sm font-semibold flex items-center gap-2 shadow-[0_4px_18px_rgba(255,106,26,0.35)]"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Deploy in Simulation</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2.5 pb-1">
        <span className="text-xs sm:text-sm text-[#81756C] font-medium mr-1.5">Benchmark Presets:</span>
        <button
          onClick={() => applyPreset('Standard Lab (5x5)', { gridWidth: 5, gridHeight: 5, dirtDensity: 0.3, obstacleCount: 3, isPartiallyObservable: false })}
          className="btn-secondary text-xs sm:text-sm min-h-[38px] py-1.5 px-3.5 rounded-xl hover:border-[#FF6A1A]"
        >
          Standard 5×5
        </button>
        <button
          onClick={() => applyPreset('Dense Labyrinth (7x7)', { gridWidth: 7, gridHeight: 7, dirtDensity: 0.45, obstacleCount: 6, isPartiallyObservable: false })}
          className="btn-secondary text-xs sm:text-sm min-h-[38px] py-1.5 px-3.5 rounded-xl hover:border-[#FF6A1A]"
        >
          Dense Labyrinth (7×7)
        </button>
        <button
          onClick={() => applyPreset('Partial Observability Fog', { gridWidth: 6, gridHeight: 6, isPartiallyObservable: true, sensorNoiseRate: 0.1 })}
          className="btn-secondary text-xs sm:text-sm min-h-[38px] py-1.5 px-3.5 rounded-xl hover:border-[#FF6A1A]"
        >
          Fog of War (Partial)
        </button>
        <button
          onClick={() => applyPreset('Battery Challenge', { batteryCapacity: 50, dirtDensity: 0.4 })}
          className="btn-secondary text-xs sm:text-sm min-h-[38px] py-1.5 px-3.5 rounded-xl hover:border-[#FF6A1A]"
        >
          Battery Stress (50%)
        </button>
      </div>

      {/* Main Grid: Controls + Visual Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Segmented Controls & Sliders */}
        <div className="xl:col-span-7 space-y-4 min-w-0">
          <div className="card-primary p-6 rounded-2xl space-y-5">
            {/* Grid Dimensions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-sm sm:text-base text-[#F8F3EF] flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#FF6A1A]" />
                  <span>Grid Dimensions</span>
                </span>
                <span className="font-mono text-[#FF8A32] font-bold text-sm sm:text-base">
                  {config.gridWidth} × {config.gridHeight} ({config.gridWidth * config.gridHeight} cells)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { w: 3, h: 3, label: '3 × 3' },
                  { w: 5, h: 5, label: '5 × 5' },
                  { w: 6, h: 6, label: '6 × 6' },
                  { w: 8, h: 8, label: '8 × 8' },
                ].map((dim) => (
                  <button
                    key={dim.label}
                    onClick={() => {
                      updateField('gridWidth', dim.w);
                      updateField('gridHeight', dim.h);
                    }}
                    className={`py-2.5 text-xs sm:text-sm font-mono font-medium rounded-xl border transition-all ${
                      config.gridWidth === dim.w
                        ? 'bg-[#21150E] border-[#FF6A1A] text-[#F8F3EF] shadow-[0_0_12px_rgba(255,106,26,0.25)]'
                        : 'bg-[#100A05] border-[rgba(255,138,50,0.16)] text-[#B6AAA0] hover:text-[#F8F3EF] hover:border-[rgba(255,138,50,0.3)]'
                    }`}
                  >
                    {dim.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dirt Density Slider */}
            <div className="space-y-2.5 pt-4 border-t border-[rgba(255,138,50,0.16)]">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-sm sm:text-base text-[#F8F3EF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF8A32]" />
                  <span>Dirt Density</span>
                </span>
                <span className="font-mono text-[#FF8A32] font-bold text-sm sm:text-base">
                  {Math.round(config.dirtDensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={config.dirtDensity}
                onChange={(e) => updateField('dirtDensity', parseFloat(e.target.value))}
                className="w-full accent-[#FF6A1A] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#81756C]">
                <span>Sparse (10%)</span>
                <span>Moderate (30%)</span>
                <span>Heavy (50%)</span>
              </div>
            </div>

            {/* Obstacle Count */}
            <div className="space-y-2.5 pt-4 border-t border-[rgba(255,138,50,0.16)]">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-sm sm:text-base text-[#F8F3EF] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#FF6262]" />
                  <span>Obstacle Barrier Density</span>
                </span>
                <span className="font-mono text-[#FF8A32] font-bold text-sm sm:text-base">
                  {config.obstacleCount} Barriers
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={config.obstacleCount}
                onChange={(e) => updateField('obstacleCount', parseInt(e.target.value, 10))}
                className="w-full accent-[#FF6A1A] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#81756C]">
                <span>0 Barriers (Open)</span>
                <span>4 Barriers</span>
                <span>8 Barriers (Labyrinth)</span>
              </div>
            </div>

            {/* Observability Toggle */}
            <div className="space-y-3 pt-4 border-t border-[rgba(255,138,50,0.16)]">
              <span className="font-semibold text-sm sm:text-base text-[#F8F3EF] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#55D6A2]" />
                <span>Sensor Observability Mode</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => updateField('isPartiallyObservable', false)}
                  className={`py-3 px-4 text-sm rounded-xl border flex items-center justify-center gap-2.5 transition-all min-h-[44px] ${
                    !config.isPartiallyObservable
                      ? 'bg-[#21150E] border-[#55D6A2] text-[#F8F3EF] shadow-sm'
                      : 'bg-[#100A05] border-[rgba(255,138,50,0.16)] text-[#B6AAA0] hover:text-[#F8F3EF]'
                  }`}
                >
                  <Eye className="w-4 h-4 text-[#55D6A2]" />
                  <span className="font-medium">Fully Observable</span>
                </button>

                <button
                  onClick={() => updateField('isPartiallyObservable', true)}
                  className={`py-3 px-4 text-sm rounded-xl border flex items-center justify-center gap-2.5 transition-all min-h-[44px] ${
                    config.isPartiallyObservable
                      ? 'bg-[#21150E] border-[#FF6A1A] text-[#F8F3EF] shadow-sm'
                      : 'bg-[#100A05] border-[rgba(255,138,50,0.16)] text-[#B6AAA0] hover:text-[#F8F3EF]'
                  }`}
                >
                  <EyeOff className="w-4 h-4 text-[#FF8A32]" />
                  <span className="font-medium">Partially Observable (Fog)</span>
                </button>
              </div>
            </div>

            {/* Battery Capacity */}
            <div className="space-y-2.5 pt-4 border-t border-[rgba(255,138,50,0.16)]">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-sm sm:text-base text-[#F8F3EF] flex items-center gap-2">
                  <Battery className="w-4 h-4 text-[#FF8A32]" />
                  <span>Battery Energy Capacity</span>
                </span>
                <span className="font-mono text-[#FF8A32] font-bold text-sm sm:text-base">
                  {config.batteryCapacity} mAh (ticks)
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                step="10"
                value={config.batteryCapacity}
                onChange={(e) => updateField('batteryCapacity', parseInt(e.target.value, 10))}
                className="w-full accent-[#FF6A1A] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Visual Environment Preview Card */}
        <div className="xl:col-span-5 space-y-4 min-w-0">
          <div className="card-primary p-6 rounded-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3.5 mb-5 border-b border-[rgba(255,138,50,0.16)]">
              <h3 className="font-semibold text-base text-[#F8F3EF]">Spatial Topological Preview</h3>
              <span className="badge badge-neutral text-xs font-mono">
                {config.gridWidth * config.gridHeight} Tiles Total
              </span>
            </div>

            {/* Mini Grid Map Representation */}
            <div
              className="p-4 rounded-2xl bg-[#100A05] border border-[rgba(255,138,50,0.24)] w-full max-w-[280px] shadow-inner"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${config.gridWidth}, minmax(0, 1fr))`,
                gap: '6px',
                aspectRatio: `${config.gridWidth} / ${config.gridHeight}`,
              }}
            >
              {Array.from({ length: config.gridWidth * config.gridHeight }).map((_, i) => {
                const isOrigin = i === 0;
                const isObstacle = i > 0 && i <= config.obstacleCount;
                const isDirt = !isObstacle && i % 3 === 0;

                return (
                  <div
                    key={i}
                    className={`rounded-lg flex items-center justify-center text-[10px] font-mono border transition-all ${
                      isOrigin
                        ? 'bg-[#FF6A1A]/20 border-[#FF6A1A] text-[#FF8A32] font-bold'
                        : isObstacle
                        ? 'bg-[#21150E] border-[rgba(255,138,50,0.22)] text-[#81756C]'
                        : isDirt
                        ? 'bg-[#17100B] border-[rgba(255,138,50,0.38)] text-[#FF8A32]'
                        : 'bg-[#17100B]/50 border-[rgba(255,138,50,0.08)]'
                    }`}
                  >
                    {isOrigin && 'R'}
                    {isObstacle && '#'}
                    {isDirt && '•'}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="w-full mt-6 pt-4 border-t border-[rgba(255,138,50,0.16)] grid grid-cols-3 gap-2 text-center text-xs sm:text-[13px] text-[#B6AAA0] font-mono">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FF6A1A]/30 border border-[#FF6A1A]" />
                <span>R: Robot</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FF8A32]/30 border border-[#FF8A32]" />
                <span>•: Dirt</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#21150E] border border-[rgba(255,138,50,0.25)]" />
                <span>#: Barrier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
