import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TracingComponent } from './tracing/tracing.component';
import { TwinsComponent } from './twins/twins.component';
import { TwinsDetailsComponent } from './twins/details/twins.details.component';
import { TwinsStatesComponent } from './twins/states/twins.states.component';
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
    path: 'twins',
    component: TwinsComponent,
  },
  {
    path: 'twins/details/:id',
    component: TwinsDetailsComponent,
  },
  {
    path: 'twins/states/:id',
    component: TwinsStatesComponent,
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
