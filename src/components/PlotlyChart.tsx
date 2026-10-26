import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { Data, Layout, Config } from 'plotly.js-dist-min';
import { getLaboratoryPlotlyLayout, LABORATORY_PLOTLY_CONFIG } from '../lib/plotly-theme';

interface PlotlyChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  style?: React.CSSProperties;
  className?: string;
  chartId?: string;
}

export const PlotlyChart: React.FC<PlotlyChartProps> = ({
  data,
  layout = {},
  config = {},
  style = { width: '100%', height: '360px' },
  className = '',
  chartId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mergedLayout = getLaboratoryPlotlyLayout(layout);
    const mergedConfig = { ...LABORATORY_PLOTLY_CONFIG, ...config };

    Plotly.react(containerRef.current, data, mergedLayout, mergedConfig);

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        Plotly.Plots.resize(containerRef.current);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, [data, layout, config]);

  return (
    <div
      id={chartId}
      ref={containerRef}
      style={style}
      className={`plotly-chart-container ${className}`}
    />
  );
};
