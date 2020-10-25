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
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';
// Mainflux - User
import { UsersComponent } from 'app/pages/users/users.component';
import { UsersDetailsComponent } from 'app/pages/users/details/users.details.component';
// Mainflux - Things
import { ThingsComponent } from 'app/pages/things/things.component';
import { ThingsDetailsComponent } from 'app/pages/things/details/things.details.component';
// Mainflux - Channels
import { ChannelsComponent } from 'app/pages/channels/channels.component';
import { ChannelsDetailsComponent } from 'app/pages/channels/details/channels.details.component';
// Mainflux - Twins
import { TwinsComponent } from './twins/twins.component';
import { TwinsDetailsComponent } from './twins/details/twins.details.component';
import { TwinsStatesComponent } from './twins/states/twins.states.component';
import { TwinsPayloadComponent } from './twins/states/payload/twins.payload.component';
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
    // Users
    UsersComponent,
    UsersDetailsComponent,
    // Things
    ThingsComponent,
    ThingsDetailsComponent,
    // Channels
    ChannelsComponent,
    ChannelsDetailsComponent,
    // Twins
    TwinsComponent,
    TwinsDetailsComponent,
    TwinsStatesComponent,
    TwinsPayloadComponent,
    TwinsDefinitionsComponent,
  ],
  providers: [
    NbDialogService,
    NbWindowService,
  ],
  entryComponents: [
    ConfirmationComponent,
    DetailsComponent,
    TwinsPayloadComponent,
  ],
})
export class PagesModule {
}
