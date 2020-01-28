import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule,
  NbCheckboxModule,
} from '@nebular/theme';


import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AdminRoutingModule } from './admin.routing.module';
import { TracingComponent } from './tracing/tracing.component';
import { TwinsComponent } from './twins/twins.component';
import { TwinsDetailsComponent } from './twins/details/twins.details.component';
import { TwinsStatesComponent } from './twins/states/twins.states.component';
import { TwinsPayloadComponent } from './twins/states/payload/twins.payload.component';
import { DetailsComponent } from 'app/shared/details/details.component';
import { GrafanaComponent } from './grafana/grafana.component';
import { LoraServerComponent } from './loraserver/loraserver.component';

import { PagesModule } from 'app/pages/pages.module';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    Ng2SmartTableModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    PagesModule,
  ],
  declarations: [
    TracingComponent,
    TwinsComponent,
    TwinsDetailsComponent,
    TwinsStatesComponent,
    TwinsPayloadComponent,
    GrafanaComponent,
    LoraServerComponent,
  ],
  entryComponents: [
    ConfirmationComponent,
    DetailsComponent,
    TwinsPayloadComponent,
  ],
})
export class AdminModule { }
