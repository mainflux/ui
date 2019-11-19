import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TracingComponent } from './tracing/tracing.component';
import { GrafanaComponent } from './grafana/grafana.component';
import { LoraServerComponent } from './loraserver/loraserver.component';

const routes: Routes = [
  {
    path: 'grafana',
    component: GrafanaComponent,
  },
  {
    path: 'tracing',
    component: TracingComponent,
  },
  {
    path: 'loraserver',
    component: LoraServerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
