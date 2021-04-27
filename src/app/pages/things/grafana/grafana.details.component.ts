import { UrlHelperService } from './../../services/url/url.helper.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from './../../../common/services/notifications/notifications.service';
import { ThingsService } from 'app/common/services/things/things.service';
import { Thing, Grafana} from 'app/common/interfaces/mainflux.interface';
import { Component, OnInit,AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-grafana-details',
  //templateUrl: './grafana.details.component.html',
  template:'<iframe #iframe></iframe>',
  styleUrls: ['./grafana.details.component.scss'],
})
export class GrafanaDetailsComponent implements  AfterViewInit {
  @ViewChild('iframe', { static: true }) iframe: ElementRef;
  grafana: Grafana;
  orgId = '1'
  iframeGrafana: any;
  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private thingsService: ThingsService,
    private http: HttpClient,
    private urlHelperService: UrlHelperService,
    private notificationsService: NotificationsService,
  ) { 
    
  }

  ngAfterViewInit() {
    let scripts = this.iframe.nativeElement.getElementsByTagName('script');
    for (let script of scripts) {
      eval(script.text)
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.thingsService.getThing(id)
    this.thingsService.getThing(id).subscribe(
      (th: Thing) => {
        this.grafana = <Grafana> th.metadata.grafana;
        if (this.grafana !== undefined ){
          this.urlHelperService.get(`${environment.grafanaUrl}/${this.grafana.orgId}?orgId=${this.grafana.orgId}&var-thing=${id}&kiosk`)
          .subscribe(blob => this.iframe.nativeElement.src = blob);
        } else {
          this.notificationsService.warn('No grafana dashboard configured','');
        }
      },
    );

    
  }

}
