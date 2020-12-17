import { NgModule } from '@angular/core';

import { PagesModule } from 'app/pages/pages.module';
import { ServicesRoutingModule } from './services.routing.module';

import { LoraComponent } from 'app/pages/services/lora/lora.component';
import { LoraDetailsComponent } from 'app/pages/services/lora/details/lora.details.component';
import { OpcuaComponent } from 'app/pages/services/opcua/opcua.component';
import { OpcuaDetailsComponent } from 'app/pages/services/opcua/details/opcua.details.component';
import { GatewaysComponent } from 'app/pages/services/gateways/gateways.component';
import { GatewaysDetailsComponent } from 'app/pages/services/gateways/details/gateways.details.component';
import { GatewaysInfoComponent } from 'app/pages/services/gateways/details/info/gateways.info.component';
import { GatewaysConfigComponent } from 'app/pages/services/gateways/details/config/gateways.config.component';
import { GatewaysXtermComponent } from 'app/pages/services/gateways/details/xterm/gateways.xterm.component';

import { ConfirmationComponent } from 'app/shared/components/confirmation/confirmation.component';

@NgModule({
  imports: [
    ServicesRoutingModule,
    PagesModule,
  ],
  declarations: [
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
export class ServicesModule { }
