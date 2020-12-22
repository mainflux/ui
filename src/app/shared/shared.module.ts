import { NgModule } from '@angular/core';

import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbSelectModule,
  NbDatepickerModule,
 } from '@nebular/theme';

import { MapModule } from './components/map/map.module';
import { DetailsModule } from './components/details/details.module';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ChartModule } from './components/chart/chart.module';
import { MessageTableComponent } from './components/message-table/message-table.component';
import { MessageValuePipe } from './pipes/message-value.pipe';

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
  ],
  declarations: [
    ConfirmationComponent,
    MessageTableComponent,
    MessageValuePipe,
  ],
  exports: [
    ThemeModule,
    NbCardModule,
    NbIconModule,
    MapModule,
    DetailsModule,
    ChartModule,
    ConfirmationComponent,
    MessageTableComponent,
  ],
  providers: [
    MessageValuePipe,
  ],
})

export class SharedModule { }
