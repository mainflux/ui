import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'ngx-loraserver.component',
  templateUrl: './loraserver.component.html',
  styleUrls: ['./loraserver.component.scss'],
})
export class LoraServerComponent implements OnInit {
  iframeLoraServer: any;

  constructor(
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.iframeLoraServer = this.domSanitizer.bypassSecurityTrustResourceUrl(environment.loraServer);
  }
}
