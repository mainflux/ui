import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TwinsComponent } from './twins/twins.component';
import { TwinsDetailsComponent } from './twins/details/twins.details.component';
import { TwinsStatesComponent } from './twins/states/twins.states.component';
import { TwinsDefinitionsComponent } from './twins/definitions/twins.definitions.component';

const routes: Routes = [
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
    path: 'twins/definitions/:id',
    component: TwinsDefinitionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
