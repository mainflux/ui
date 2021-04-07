import { NotificationsService } from './../../common/services/notifications/notifications.service';
import { HttpClient , HttpParams} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const defSearchBarMs: number = 100;

@Component({
  selector: 'ngx-grafana-component',
  templateUrl: './grafana.component.html',
  styleUrls: ['./grafana.component.scss'],
})
export class GrafanaDashComponent implements OnInit {
  body: {}
  dashUrl = `/d/P960iflGk/new-dashboard-copy`;
  constructor(
    private http : HttpClient,
    private sanitizer: DomSanitizer,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    const params = new HttpParams().set('orgId', '1')
    this.http.get(`${environment.grafanaUrl}${this.dashUrl}`, {params: params}).
    map(
      resp => {
        this.body = this.sanitizer.bypassSecurityTrustResourceUrl(``);
        return resp;
      },
    )
    .catch(
      err => {
        this.notificationsService.error('Failed to fetch Thing',
          `Error: ${err.status} - ${err.statusText}`);
        return Observable.throw(err);
      },
    );
  }
}
