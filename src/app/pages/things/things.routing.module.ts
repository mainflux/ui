import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelsComponent } from './channels/channels.component';
import { DevicesComponent } from './devices/devices.component';
import { DevicesDetailsComponent } from './devices/details/devices.details.component';
import { ChannelsDetailsComponent } from './channels/details/channels.details.component';
import { LoraComponent } from 'app/pages/things/lora/lora.component';
import { LoraDetailsComponent } from 'app/pages/things/lora/details/lora.details.component';
import { OpcuaComponent } from 'app/pages/things/opcua/opcua.component';
import { OpcuaDetailsComponent } from 'app/pages/things/opcua/details/opcua.details.component';
import { GatewaysComponent } from 'app/pages/things/gateways/gateways.component';
import { GatewaysDetailsComponent } from 'app/pages/things/gateways/details/gateways.details.component';
import { DbReaderComponent } from './dbreader/dbreader.component';
import { DbReaderDetailsComponent } from './dbreader/details/dbreader.details.component';

const routes: Routes = [
  {
    path: 'devices',
    component: DevicesComponent,
  },
  {
    path: 'devices/details/:id',
    component: DevicesDetailsComponent,
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
    path: 'lora',
    component: LoraComponent,
  },
  {
    path: 'lora/details/:id',
    component: LoraDetailsComponent,
  },
  {
    path: 'dbreader',
    component: DbReaderComponent,
  },
  {
    path: 'dbreader/details/:id',
    component: DbReaderDetailsComponent,
  },
  {
    path: 'opcua',
    component: OpcuaComponent,
  },
  {
    path: 'opcua/details/:id',
    component: OpcuaDetailsComponent,
  },
  {
    path: 'gateways',
    component: GatewaysComponent,
  },
  {
    path: 'gateways/details/:id',
    component: GatewaysDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThingsRoutingModule { }
