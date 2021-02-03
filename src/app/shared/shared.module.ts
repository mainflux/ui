import { NgModule } from '@angular/core';

import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbSelectModule,
  NbDatepickerModule,
  NbInputModule,
 } from '@nebular/theme';
 import { FormsModule } from '@angular/forms';

import { MapModule } from './components/map/map.module';
import { DetailsModule } from './components/details/details.module';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ChartModule } from './components/chart/chart.module';
import { MessageMonitorComponent } from './components/message-monitor/message-monitor.component';
import { MessageValuePipe } from './pipes/message-value.pipe';
import { TableComponent } from './components/table/table.component';

@NgModule({
  imports: [
    ThemeModule,
    NbButtonModule,
    NbCardModule,
    MapModule,
    DetailsModule,
    ChartModule,
    NbSelectModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    NbIconModule,
  ],
  declarations: [
    ConfirmationComponent,
    MessageMonitorComponent,
    MessageValuePipe,
    TableComponent,
  ],
  exports: [
    ThemeModule,
    NbCardModule,
    NbIconModule,
    MapModule,
    DetailsModule,
    ChartModule,
    ConfirmationComponent,
    MessageMonitorComponent,
    TableComponent,
  ],
  providers: [
    MessageValuePipe,
  ],
})

export class SharedModule { }
