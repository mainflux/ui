import { NotificationsService } from './../../../common/services/notifications/notifications.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {  Observable } from 'rxjs';
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
  dashboard = `d/NniREnXMk/new-dashboard-copy`;
  iframeGrafana: any;
  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private notificationsService: NotificationsService,
    private http : HttpClient,
  ) { }

  ngOnInit() {
    this.loadGrafana().subscribe(
      (resp: any) => {
        this.iframeGrafana = this.domSanitizer.bypassSecurityTrustHtml(resp)
      },
    );
  }

  loadGrafana() {
    const id = this.route.snapshot.paramMap.get('id');
    let params = new HttpParams()
    .set('orgId', '1')
    .set('var-thing', `${id}`);
    const url = `${environment.grafanaUrl}/${this.dashboard}`;
    const headers = new HttpHeaders({
      Accept:'text/html',
    });
    return this.http.get(`${environment.grafanaUrl}/${this.dashboard}`, { headers:headers, params:params, responseType: 'text'})
      .map(
        resp => { 
          return resp
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to get grafana',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }
}
