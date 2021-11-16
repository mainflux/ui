import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

import { environment } from 'environments/environment';

// Mainflux - User Groups
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { UserGroupsDetailsComponent } from './user-groups/details/user-groups.details.component';
// Mainflux - User
import { UsersComponent } from './users/users.component';
import { UsersDetailsComponent } from './users/details/users.details.component';
// Mainflux - Things
import { ThingsComponent } from './things/things.component';
import { ThingsDetailsComponent } from './things/details/things.details.component';
// Mainflux - Channels
import { ChannelsComponent } from './channels/channels.component';
import { ChannelsDetailsComponent } from './channels/details/channels.details.component';

const children = environment.production ?
[
    {
      path: 'home',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: 'things',
      component: ThingsComponent,
    },
    {
      path: 'things/details/:id',
      component: ThingsDetailsComponent,
    },
    {
      path: 'channels',
      component: ChannelsComponent,
    },
    {
      path: 'channels/details/:id',
      component: ChannelsDetailsComponent,
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
  ] : [
    {
      path: 'home',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: 'users/groups',
      component: UserGroupsComponent,
    },
    {
      path: 'users/groups/details/:id',
      component: UserGroupsDetailsComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'users/details/:id',
      component: UsersDetailsComponent,
    },
    {
      path: 'things',
      component: ThingsComponent,
    },
    {
      path: 'things/details/:id',
      component: ThingsDetailsComponent,
    },
    {
      path: 'channels',
      component: ChannelsComponent,
    },
    {
      path: 'channels/details/:id',
      component: ChannelsDetailsComponent,
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'services',
      loadChildren: () => import('./services/services.module')
        .then(m => m.ServicesModule),
    },
];

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: children,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
