import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { PageFilters, TablePage, Thing } from '../../../common/interfaces/mainflux.interface';
import { ThingsService } from '../../../common/services/things/things.service';

@Component({
  selector: 'ngx-grafana-details',
  templateUrl: './grafana.details.component.html',
  styleUrls: ['./grafana.details.component.scss'],
})
export class GrafanaDetailsComponent implements OnInit {
  iframeGrafana: any;
  page: TablePage = {};
  pageFilters: PageFilters = {};
  thing: Thing;


  constructor(
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private notificationsService: NotificationsService,
    private thingsService: ThingsService,
  ) { }


  loginGrafana(){
    const headers = new HttpHeaders({
      'Content-type': 'application/json; charset=UTF-8',
      'X-Auth-Request-User' : 'moko2@example.com',
    });
    // const creds = {
    //   user: "moko2@example.com",
    //   email: "",
    // };
    return this.http.get('/grafana/profile' , { observe: 'response', headers: headers })
    .map(
      resp => {
        console.log(resp)
        return resp
      },
      err => {
        this.notificationsService.error(
          'Failed to login to grafana',
          `Error: ${err.status} - ${err.statusText}`);
      },
    );
  }


  getThings(name?: string): void {
    this.page = {};

    this.pageFilters.name = name;
    
    this.pageFilters.metadata = {
                    "dashboard":"grafana"
                  };
                  
    this.thingsService.getThings(this.pageFilters).subscribe(
      (resp: any) => {
        this.page = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.things,
        };

        // Check if there is a type defined in the metadata
        this.page.rows.forEach( (thing: Thing) => {
          thing.type = thing.metadata ? thing.metadata.type : '';
        });
      },
    );

    if (this.thing.metadata&& this.thing.metadata.dashboard == 'grafana'){
      this.iframeGrafana = this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.thing.metadata.dashboardURL}&kiosk&var-publisher=${this.thing.id}`);
    }
    

  }

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    //   const headers = new HttpHeaders({
    //     'Content-type': 'application/json; charset=UTF-8',
    //     ''
    //   });
    this.getThings()
    this.thing = this.page.rows[0] as Thing
    this.loginGrafana().subscribe(
      (resp:any) =>{
        console.log(resp)
      }
    );
    if (this.thing.metadata&& this.thing.metadata.dashboard == 'grafana'){
      this.iframeGrafana = this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.thing.metadata.dashboardURL}&kiosk&var-publisher=${this.thing.id}`);
    }
  }
}
