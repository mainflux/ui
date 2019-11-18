import { NgModule } from '@angular/core';

import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbCardModule,
  NbIconModule,
  NbButtonModule,
 } from '@nebular/theme';

import { MapModule } from './map/map.module';
import { DetailsModule } from './details/details.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ChartModule } from './chart/chart.module';


@NgModule({
  imports: [
    ThemeModule,
    NbButtonModule,
    NbCardModule,
    MapModule,
    DetailsModule,
    ChartModule,
  ],
  declarations: [
    ConfirmationComponent,
  ],
  exports: [
    ThemeModule,
    NbCardModule,
    NbIconModule,
    MapModule,
    DetailsModule,
    ChartModule,
    ConfirmationComponent,
  ],
})

export class SharedModule { }
