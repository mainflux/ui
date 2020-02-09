import { Component } from '@angular/core';

@Component({
  selector: 'ngx-twins-attributes-component',
  templateUrl: './twins.attributes.component.html',
  styleUrls: ['./twins.attributes.component.scss'],
})
export class TwinsAttributesComponent {
  // Depends on valuePrepareFunction
  value: any;

  constructor(
  ) { }
}
