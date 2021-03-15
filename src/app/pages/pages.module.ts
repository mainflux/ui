import { NgModule } from '@angular/core';
import {
  NbMenuModule,
  NbDialogService,
  NbWindowService,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbCheckboxModule,
  NbListModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';

// Mainflux - Dependencies
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';
// Mainflux - Common and Shared
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from 'app/common/common.module';
import { ConfirmationComponent } from 'app/shared/components/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/components/details/details.component';
// Mainflux - User Groups
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { UserGroupsDetailsComponent } from './user-groups/details/user-groups.details.component';
// Mainflux - User
import { UsersComponent } from 'app/pages/users/users.component';
import { UsersDetailsComponent } from 'app/pages/users/details/users.details.component';
// Mainflux - Things
import { ThingsComponent } from 'app/pages/things/things.component';
import { ThingsAddComponent } from 'app/pages/things/add/things.add.component';
import { ThingsDetailsComponent } from 'app/pages/things/details/things.details.component';
// Mainflux - Channels
import { ChannelsComponent } from 'app/pages/channels/channels.component';
import { ChannelsAddComponent } from 'app/pages/channels/add/channels.add.component';
import { ChannelsDetailsComponent } from 'app/pages/channels/details/channels.details.component';
// Mainflux - Twins
import { TwinsComponent } from './twins/twins.component';
import { TwinsAddComponent } from './twins/add/twins.add.component';
import { TwinsDetailsComponent } from './twins/details/twins.details.component';
import { TwinsStatesComponent } from './twins/states/twins.states.component';
import { TwinsDefinitionsComponent } from './twins/definitions/twins.definitions.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    SharedModule,
    CommonModule,
    Ng2SmartTableModule,
    FormsModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NbListModule,
  ],
  exports: [
    Ng2SmartTableModule,
    SharedModule,
    CommonModule,
    FormsModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NbListModule,
  ],
  declarations: [
    PagesComponent,
    // User Groups
    UserGroupsComponent,
    UserGroupsDetailsComponent,
    // Users
    UsersComponent,
    UsersDetailsComponent,
    // Things
    ThingsComponent,
    ThingsAddComponent,
    ThingsDetailsComponent,
    // Channels
    ChannelsComponent,
    ChannelsAddComponent,
    ChannelsDetailsComponent,
    // Twins
    TwinsComponent,
    TwinsAddComponent,
    TwinsDetailsComponent,
    TwinsStatesComponent,
    TwinsDefinitionsComponent,
  ],
  providers: [
    NbDialogService,
    NbWindowService,
  ],
  entryComponents: [
    ThingsAddComponent,
    ConfirmationComponent,
    DetailsComponent,
  ],
})
export class PagesModule {
}
