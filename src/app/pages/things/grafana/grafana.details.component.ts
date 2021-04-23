import { HttpClient } from '@angular/common/http';
import { NotificationsService } from './../../../common/services/notifications/notifications.service';
import { ThingsService } from 'app/common/services/things/things.service';
import { Thing, Grafana} from 'app/common/interfaces/mainflux.interface';
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
  grafana: Grafana;
  orgId = '1'
  iframeGrafana: any;
  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private thingsService: ThingsService,
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    
    const id = this.route.snapshot.paramMap.get('id');
    this.thingsService.getThing(id)
    this.thingsService.getThing(id).subscribe(
      (th: Thing) => {
        this.grafana = <Grafana> th.metadata.grafana;
        if (this.grafana !== undefined ){
          this.loadGrafana(this.grafana.orgId, this.grafana.dashboard, id)
        } else {
          this.notificationsService.warn('No grafana dashboard configured','');
        }
      },
    );
  
  }

  loadGrafana(orgId: number, dashboard: string, thingId:string) {
    // I have to make one duplicated request which actually authenticates the session
    // since there is a problem with loading of content of request int iframe srcdoc
    // as scripts are not being properly loaded ( not respecting base ref)
    this.http.get(`${environment.grafanaUrl}/${dashboard}?orgId=${orgId}&var-thing=${thingId}&kiosk`, {responseType: 'text'} )
    .subscribe(data => {
      const url = `${environment.grafanaUrl}/${dashboard}?orgId=${orgId}&var-thing=${thingId}&kiosk`;
      this.iframeGrafana = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
   });
  }
}
