import { NgModule } from '@angular/core';
import { ThemeModule } from 'app/@theme/theme.module';
import {
  NbIconModule,
  NbButtonModule,
 } from '@nebular/theme';

import { DetailsComponent } from 'app/shared/details/details.component';

@NgModule({
  imports: [
    ThemeModule,
    NbIconModule,
    NbButtonModule,
  ],
  declarations: [
    DetailsComponent,
  ],
  entryComponents: [
    DetailsComponent,
  ],
})

export class DetailsModule { }
