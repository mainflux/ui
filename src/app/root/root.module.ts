/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../@core/core.module';
import { ThemeModule } from '../@theme/theme.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbInputModule,
  NbCardModule,
  NbIconModule,
  NbButtonModule,
} from '@nebular/theme';

// MFx- Foorm dependency
import { FormsModule } from '@angular/forms';
// Mfx - MQTT dependencies for Gateways page
import { MqttModule, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { environment } from '../../environments/environment';
export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
  url: environment.mqttWsUrl,
};
// Mfx - Auth and Profile pages
import { LogoutComponent } from '../pages/logout/logout.component';
import { RegisterComponent } from '../pages/register/register.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RootComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RootRoutingModule,
    RouterModule,

    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
 
    // Mfx dependencies
    FormsModule,
    NbInputModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
  ],
  // Mfx dependencies
})
export class RootModule {
}
