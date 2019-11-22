import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';
import { COLORS } from './chart.colors';

@Component({
  selector: 'ngx-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges {
  chartColors: Color[] = COLORS;
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.6, // disables bezier curves
      },
    },
    animation: {
      easing: 'linear',
    },
    scales: {
        xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
            },
        }],
    },
  };

  datasetsList: any[] = [];
  chartType: ChartType = 'scatter';

  @Input() messages: any[];
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  constructor(
  ) { }

  ngOnChanges() {
    let firstName = '';
    let count = 0;
    for (let i = 0; i < this.messages.length; i++) {
      if (firstName === '') {
        firstName = this.messages[i].name;
        continue;
      }
      if (firstName === this.messages[i].name) {
        count = i;
        break;
      }
    }

    for (let i = 0; i < count; i++) {
      const chartDataSets: ChartDataSets[] = [{
        data: [],
        label: this.messages[i].name,
        showLine: true,
      }];

      const result = this.messages.filter(obj => obj.name === this.messages[i].name);
      result.forEach( msg => {
        const point: ChartPoint = {
          x: msg.time * 1000,
          y: msg.value,
        };
        (chartDataSets[0].data as ChartPoint[]).push(point);
      });

      this.datasetsList.push(chartDataSets);
      this.chart && this.chart.update();
    }
  }
}
