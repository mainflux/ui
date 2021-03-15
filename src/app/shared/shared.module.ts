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
import { ToMillisecsPipe } from './pipes/time.pipe';
import { TableComponent } from './components/table/table.component';
import { PaginationComponent } from './components/pagination/pagination.component';

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
    ToMillisecsPipe,
    TableComponent,
    PaginationComponent,
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
    PaginationComponent,
  ],
  providers: [
    MessageValuePipe,
  ],
})

export class SharedModule { }
