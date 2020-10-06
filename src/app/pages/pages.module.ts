import { NgModule } from '@angular/core';
import {
  NbMenuModule,
  NbDialogService,
  NbWindowService,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';

// Mainflux
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from 'app/common/common.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';

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
  ],
  exports: [
    Ng2SmartTableModule,
    SharedModule,
    CommonModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
    NbDialogService,
    NbWindowService,
  ],
})
export class PagesModule {
}
