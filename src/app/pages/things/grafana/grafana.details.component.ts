import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-grafana-details',
  templateUrl: './grafana.details.component.html',
  styleUrls: ['./grafana.details.component.scss'],
})
export class GrafanaDetailsComponent implements OnInit {
  dashboard = `d/P960iflGk/new-dashboard-copy?orgId=1`;
  iframeGrafana: any;

  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.iframeGrafana = this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.grafanaUrl}${id}`);
  }
}
