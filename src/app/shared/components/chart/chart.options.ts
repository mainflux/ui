import { ChartOptions } from 'chart.js';

export const CHART_OPTIONS: { [key: string]: ChartOptions; } = {
  'line': {
    animation: {
      duration: 0,
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    showLines: true,
    elements: {
      line: {
        tension: 0.2,
      },
      point: {
        radius: 2,
      },
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'second',
          displayFormats: {
            second: 'HH:mm:ss',
            minute: 'HH:mm:ss',
            hour: 'HH:mm:ss',
          },
        },
        distribution: 'series',
        ticks: {
          fontSize: 12,
          autoSkip: true,
          minRotation: 0,
          maxRotation: 30,
        },
      }],
    },
  },
  'scatter': {
    legend: {
      display: false,
    },
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
