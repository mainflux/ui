import { Component, Input, AfterViewInit, OnChanges, ViewChild } from '@angular/core';

import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';
import { BaseChartDirective, Color } from 'ng2-charts';
import { CHART_COLORS } from './chart.colors';
import { CHART_OPTIONS } from './chart.options';
import { Dataset } from 'app/common/interfaces/mainflux.interface';
import { ToMillisecsPipe } from 'app/shared/pipes/time.pipe';
import { MessageValuePipe } from 'app/shared/pipes/message-value.pipe';
import {
  NbSelectComponent,
} from '@nebular/theme';

@Component({
  selector: 'ngx-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnChanges, AfterViewInit {
  chartColors: Color[] = CHART_COLORS;
  chartOptions: ChartOptions = CHART_OPTIONS['line'];

  chartDataSets: ChartDataSets[] = [];
  chartType: ChartType = 'line';
  chartTypes: string[] = ['line', 'scatter'];

  @Input() msgDatasets: Dataset[] = [];
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  @ViewChild(NbSelectComponent, { static: false }) select: NbSelectComponent;

  constructor(
    private toMillisecsPipe: ToMillisecsPipe,
    private messageValuePipe: MessageValuePipe,
  ) {}

  ngAfterViewInit() {
    this.select.selectedChange.subscribe(
      (event: ChartType) => {
        this.chartType = event;
        this.chartOptions = CHART_OPTIONS[event];
      },
    );
  }

  ngOnChanges() {
    this.chartDataSets = [];

    this.msgDatasets.forEach( dataset => {
      const dataSet: ChartDataSets = {
        data: [],
        label: dataset.label,
      };

      // Create charts by name
      dataset.messages.forEach( msg => {
        const point: ChartPoint = {
          x: this.toMillisecsPipe.transform(msg.time),
          y: this.messageValuePipe.transform(msg),
        };
        (dataSet.data as ChartPoint[]).push(point);
      });

      this.chartDataSets.push(dataSet);
      this.chart && this.chart.update();
    });
  }
}
