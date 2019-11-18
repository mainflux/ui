import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from 'app/shared/shared.module';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { VersionsService } from 'app/common/services/versions/versions.service';
import { ThingsService } from 'app/common/services/things/things.service';
import { LoraService } from 'app/common/services/lora/lora.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { BootstrapService } from 'app/common/services/bootstrap/bootstrap.service';
import { MqttManagerService } from 'app/common/services/mqtt/mqtt.manager.service';
import { UsersService } from 'app/common/services/users/users.service';
import { TokenInterceptor } from 'app/auth/auth.token.interceptor.service';

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
    DashboardModule,
    MiscellaneousModule,
    NbMenuModule,
    ProfileModule,
    Ng2SmartTableModule,
    SharedModule,
  ],
  exports: [
    Ng2SmartTableModule,
    SharedModule,
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
    UsersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    NbDialogService,
    NbWindowService,
    NotificationsService,
    GatewaysService,
    MessagesService,
    VersionsService,
    ThingsService,
    LoraService,
    ChannelsService,
    BootstrapService,
    MqttManagerService,
    HttpClientModule,
  ],
})
export class PagesModule {
}
