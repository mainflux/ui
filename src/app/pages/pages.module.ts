import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from 'app/common/common.module';

import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbMenuModule,
  NbDialogService,
  NbWindowService,
} from '@nebular/theme';

import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
    NbMenuModule,
    ProfileModule,
    Ng2SmartTableModule,
    SharedModule,
    CommonModule,
  ],
  exports: [
    Ng2SmartTableModule,
    SharedModule,
  ],
  declarations: [
    PagesComponent,
    DashboardComponent,
  ],
  providers: [
    NbDialogService,
    NbWindowService,
  ],
})
export class PagesModule {
}
