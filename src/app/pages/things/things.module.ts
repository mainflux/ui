import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
} from '@nebular/theme';

import { ThingsRoutingModule } from './things.routing.module';
import { PagesModule } from 'app/pages/pages.module';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';

import { DevicesComponent } from 'app/pages/things/devices/devices.component';
import { ChannelsComponent } from 'app/pages/things/channels/channels.component';
import { DevicesDetailsComponent } from 'app/pages/things/devices/details/devices.details.component';
import { ChannelsDetailsComponent } from 'app/pages/things/channels/details/channels.details.component';
import { LoraComponent } from 'app/pages/things/lora/lora.component';
import { LoraDetailsComponent } from 'app/pages/things/lora/details/lora.details.component';
import { OpcuaComponent } from 'app/pages/things/opcua/opcua.component';
import { OpcuaDetailsComponent } from 'app/pages/things/opcua/details/opcua.details.component';
import { GatewaysComponent } from 'app/pages/things/gateways/gateways.component';
import { GatewaysDetailsComponent } from 'app/pages/things/gateways/details/gateways.details.component';
import { GatewaysInfoComponent } from 'app/pages/things/gateways/details/info/gateways.info.component';
import { GatewaysConfigComponent } from 'app/pages/things/gateways/details/config/gateways.config.component';
import { GatewaysXtermComponent } from 'app/pages/things/gateways/details/xterm/gateways.xterm.component';


@NgModule({
  imports: [
    ThingsRoutingModule,
    PagesModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    FormsModule,
  ],
  declarations: [
    DevicesComponent,
    ChannelsComponent,
    DevicesDetailsComponent,
    ChannelsDetailsComponent,
    LoraComponent,
    LoraDetailsComponent,
    OpcuaComponent,
    OpcuaDetailsComponent,
    GatewaysComponent,
    GatewaysDetailsComponent,
    GatewaysInfoComponent,
    GatewaysConfigComponent,
    GatewaysXtermComponent,
  ],
  entryComponents: [
    ConfirmationComponent,
  ],
})
export class ThingsModule { }
