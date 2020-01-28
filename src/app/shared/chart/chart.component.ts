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
        tension: 0.6,
      },
      point: {
        radius: 1,
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
    if (this.messages.length < 1) {
      return;
    }

    const msgPublishers = this.messages.map(msg => msg.publisher);
    const publishers = msgPublishers.filter((item, index) => msgPublishers.indexOf(item) === index);

    publishers.forEach( (pub, i) => {

      const chartDataSets: ChartDataSets[] = [{
        data: [],
        showLine: true,
      }];

      const result = this.messages.filter(obj => obj.publisher === pub);
      result.forEach( msg => {
        const point: ChartPoint = {
          x: msg.time * 1000,
          y: msg.value,
        };
        chartDataSets[0].label = `${pub} - ${msg.name}`,

        (chartDataSets[0].data as ChartPoint[]).push(point);
      });

      this.datasetsList.push(chartDataSets);
      this.chart && this.chart.update();
    });
  }
}
