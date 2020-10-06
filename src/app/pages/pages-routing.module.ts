import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
    }, {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }, {
      path: 'things',
      loadChildren: 'app/pages/things/things.module#ThingsModule',
    }, {
      path: 'admin',
      loadChildren: 'app/pages/admin/admin.module#AdminModule',
    }, {
      path: 'profile',
      component: ProfileComponent,
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
