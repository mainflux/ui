import { NgModule } from '@angular/core';

import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbSelectModule,
 } from '@nebular/theme';

import { MapModule } from './map/map.module';
import { DetailsModule } from './details/details.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ChartModule } from './chart/chart.module';
import { MessageTableComponent } from './message-table/message-table.component';
import { ValuePipe } from './message-table/value.pipe';

@NgModule({
  imports: [
    ThemeModule,
    NbButtonModule,
    NbCardModule,
    MapModule,
    DetailsModule,
    ChartModule,
    NbSelectModule,
  ],
  declarations: [
    ConfirmationComponent,
    MessageTableComponent,
    ValuePipe,
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
    ValuePipe,
  ],
})

export class SharedModule { }
