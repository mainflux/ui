/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbAlertModule,
  NbInputModule,
  NbIconModule,
  NbCheckboxModule,
  NbButtonModule,
} from '@nebular/theme';

import { LogoutComponent } from './pages/logout/logout.component';
import { ResetPasswordComponent } from './pages/reset/reset.password.component';
import { RegisterComponent } from './pages/register/register.component';
import {
  MqttModule,
  IMqttServiceOptions,
  MqttService,
} from 'ngx-mqtt';


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
  hostname: 'localhost',
  port: 80,
  protocol: 'ws',
  path: '/mqtt',
};

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    ResetPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbAlertModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbCheckboxModule,
    FormsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
  ],
  providers: [MqttService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
