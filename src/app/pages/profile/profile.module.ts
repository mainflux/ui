import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from 'app/@theme/theme.module';

import { ProfileComponent } from './profile.component';

import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    ThemeModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    ProfileComponent,
  ],
})
export class ProfileModule { }
