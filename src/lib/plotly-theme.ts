import type { Layout, Config } from 'plotly.js-dist-min';

export const PLOTLY_SERIES_COLORS = [
  '#FF6A1A', // Primary Accent Orange
  '#FF8A32', // Bright Orange
  '#55D6A2', // Success Green
  '#E28D58', // Warm Peach
  '#FF6262', // Error Red
  '#F3C099', // Cream Orange
  '#D97706', // Deep Amber
];

/**
 * Global Plotly Layout adhering strictly to the Cinematic Black-and-Orange Theme
 */
export function getLaboratoryPlotlyLayout(custom: Partial<Layout> = {}): Partial<Layout> {
  const baseLayout: Partial<Layout> = {
    paper_bgcolor: '#17100B',
    plot_bgcolor: '#17100B',
    colorway: PLOTLY_SERIES_COLORS,
    font: {
      family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#F8F3EF',
      size: 12,
    },
    margin: {
      t: 40,
      r: 28,
      b: 48,
      l: 54,
      pad: 4,
    },
    autosize: true,
    showlegend: true,
    legend: {
      bgcolor: '#21150E',
      bordercolor: 'rgba(255, 138, 50, 0.22)',
      borderwidth: 1,
      font: {
        color: '#B6AAA0',
        size: 11,
      },
      orientation: 'h',
      x: 0,
      y: 1.14,
    },
    xaxis: {
      gridcolor: 'rgba(255, 138, 50, 0.12)',
      zerolinecolor: 'rgba(255, 138, 50, 0.18)',
      linecolor: 'rgba(255, 138, 50, 0.18)',
      tickcolor: 'rgba(255, 138, 50, 0.18)',
      tickfont: {
        color: '#B6AAA0',
        size: 11,
      },
      title: {
        font: {
          color: '#F8F3EF',
          size: 12,
        },
      },
    },
    yaxis: {
      gridcolor: 'rgba(255, 138, 50, 0.12)',
      zerolinecolor: 'rgba(255, 138, 50, 0.18)',
      linecolor: 'rgba(255, 138, 50, 0.18)',
      tickcolor: 'rgba(255, 138, 50, 0.18)',
      tickfont: {
        color: '#B6AAA0',
        size: 11,
      },
      title: {
        font: {
          color: '#F8F3EF',
          size: 12,
        },
      },
    },
    hoverlabel: {
      bgcolor: '#21150E',
      bordercolor: 'rgba(255, 138, 50, 0.35)',
      font: {
        family: 'Inter, sans-serif',
        color: '#F8F3EF',
        size: 12,
      },
    },
  };

  // Merge custom layout
  return {
    ...baseLayout,
    ...custom,
    xaxis: {
      ...baseLayout.xaxis,
      ...(custom.xaxis || {}),
    },
    yaxis: {
      ...baseLayout.yaxis,
      ...(custom.yaxis || {}),
    },
    legend: {
      ...baseLayout.legend,
      ...(custom.legend || {}),
    },
  };
}

export const LABORATORY_PLOTLY_CONFIG: Partial<Config> = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
};
