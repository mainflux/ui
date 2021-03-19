import { NgModule } from '@angular/core';
import { ThemeModule } from 'app/@theme/theme.module';
import { ChartsModule } from 'ng2-charts';

import { NbSelectModule } from '@nebular/theme';

import { ChartComponent } from './chart.component';

@NgModule({
  imports: [
    ThemeModule,
    ChartsModule,
    NbSelectModule,
  ],
  declarations: [
    ChartComponent,
  ],
  exports: [
    ChartComponent,
  ],
})
export class ChartModule { }
