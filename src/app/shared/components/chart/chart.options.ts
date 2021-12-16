import { ChartOptions } from 'chart.js';

export const CHART_OPTIONS: { [key: string]: ChartOptions; } = {
  'line': {
    responsive: true,
    maintainAspectRatio: false,
    showLines: true,
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 3,
      },
    },
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
        ticks: {
          fontSize: 12,
          minRotation: 30,
        },
      }],
    },
  },
  'scatter': {
    responsive: true,
    maintainAspectRatio: false,
    showLines: false,
    elements: {
      point: {
        radius: 5,
      },
    },
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
        ticks: {
          fontSize: 12,
          minRotation: 30,
        },
      }],
    },
  },
};
