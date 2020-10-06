import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';
import { COLORS } from './chart.colors';
import { MainfluxMsg } from 'app/common/interfaces/mainflux.interface';

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
        distribution: 'series',
      }],
    },
  };

  datasetsList: any[] = [];
  chartType: ChartType = 'scatter';

  @Input() messages: MainfluxMsg[];
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  constructor(
  ) { }

  ngOnChanges() {
    if (this.messages.length < 1) {
      return;
    }

    // Create list of all messages names
    const msgsNames = this.messages.map(msg => msg.name);
    // Remove duplicated names
    const msgsNamesUnique = msgsNames.filter((item, index) => msgsNames.indexOf(item) === index);

    // Create charts by name
    msgsNamesUnique.forEach( (name, i) => {
      const chartDataSets: ChartDataSets[] = [{
        data: [],
        showLine: true,
      }];

      const result = this.messages.filter(msg => msg.name === name);
      result.forEach( msg => {
        const point: ChartPoint = {
          x: msg.time * 1000,
          y: this.parseValue(msg),
        };
        chartDataSets[0].label = `${msg.name}`,

        (chartDataSets[0].data as ChartPoint[]).push(point);
      });

      this.datasetsList.push(chartDataSets);
      this.chart && this.chart.update();
    });
  }

  parseValue(message: MainfluxMsg): any {
    return message.value || message.bool_value ||
      message.string_value || message.data_value || message.sum;
  }
}
