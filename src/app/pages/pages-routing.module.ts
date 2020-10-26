import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

// Mainflux - Organisations
import { OrganisationsComponent } from './organisations/organisations.component';
import { OrganisationsDetailsComponent } from './organisations/details/organisations.details.component';
// Mainflux - User
import { UsersComponent } from './users/users.component';
import { UsersDetailsComponent } from './users/details/users.details.component';
// Mainflux - Things
import { ThingsComponent } from './things/things.component';
import { ThingsDetailsComponent } from './things/details/things.details.component';
// Mainflux - Channels
import { ChannelsComponent } from './channels/channels.component';
import { ChannelsDetailsComponent } from './channels/details/channels.details.component';
// Mainflux - Twins
import { TwinsComponent } from './twins/twins.component';
import { TwinsDetailsComponent } from './twins/details/twins.details.component';
import { TwinsStatesComponent } from './twins/states/twins.states.component';
import { TwinsDefinitionsComponent } from './twins/definitions/twins.definitions.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'organisations',
      component: OrganisationsComponent,
    },
    {
      path: 'organisations/details/:id',
      component: OrganisationsDetailsComponent,
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
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'services',
      loadChildren: () => import('./services/services.module')
        .then(m => m.ServicesModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
