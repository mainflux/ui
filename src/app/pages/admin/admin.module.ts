import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin.routing.module';
import { TracingComponent } from './tracing/tracing.component';
import { GrafanaComponent } from './grafana/grafana.component';
import { LoraServerComponent } from './loraserver/loraserver.component';


@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    TracingComponent,
    GrafanaComponent,
    LoraServerComponent,
  ],
})
export class AdminModule {}
