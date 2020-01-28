import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-twins-payload-component',
  templateUrl: './twins.payload.component.html',
  styleUrls: ['./twins.payload.component.scss'],
})
export class TwinsPayloadComponent implements OnInit {
  // Depends on valuePrepareFunction
  value: any;

  constructor(
  ) { }

  ngOnInit() {

  }
}
