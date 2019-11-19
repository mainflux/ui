import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'ngx-grafana',
  templateUrl: './grafana.component.html',
  styleUrls: ['./grafana.component.scss'],
})
export class GrafanaComponent implements OnInit {
  iframeGrafana: any;

  constructor(
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.iframeGrafana = this.domSanitizer.bypassSecurityTrustResourceUrl(environment.grafanaHome);
  }
}
