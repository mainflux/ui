import { NgModule } from '@angular/core';

import { MapComponent } from './leaflet/map.leaflet.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    LeafletModule.forRoot(),
  ],
  declarations: [
    MapComponent,
  ],
  exports: [
    MapComponent,
  ],
})
export class MapModule { }
