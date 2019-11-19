import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';

import {
  NbCardModule,
  NbIconModule,
  NbTabsetModule,
  NbListModule,
  NbSelectModule,
} from '@nebular/theme';

@NgModule({
  imports: [
    SharedModule,
    NbCardModule,
    NbIconModule,
    NbTabsetModule,
    NbListModule,
    NbSelectModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
