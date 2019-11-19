import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';

@Component({
  selector: 'ngx-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges {
  chartColors: Color[] = [
    {
      backgroundColor: 'rgba(93,193,185, 0.1)',
      borderColor: 'rgba(93,193,185, 0.5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
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
  };
  chartDataSets: ChartDataSets[] = [{
    data: [],
    label: '',
    showLine: true,
  }];
  chartType: ChartType = 'scatter';

  @Input() messages: any[];
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  constructor(
  ) { }

  ngOnChanges() {
    this.messages.forEach( msg => {
      this.chartDataSets[0].label = msg.name;

      const point: ChartPoint = {
        x: msg.time,
        y: msg.value,
      };
      (this.chartDataSets[0].data as ChartPoint[]).push(point);
      this.chart && this.chart.update();
    });
  }
}
