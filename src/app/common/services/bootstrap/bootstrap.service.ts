import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { Config, ConfigContent, ConfigUpdate, Gateway } from 'app/common/interfaces/models';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ThingsService } from 'app/common/services/things/things.service';

@Injectable()
export class BootstrapService {
  content: ConfigContent = {
    'log_level': 'debug',
    'http_port': '9000',
    'mqtt_url': 'localhost:1883',
    'edgex_url': 'http://localhost:48090/api/v1/',
    'wowza_url': 'http://localhost:8087/v2/',
  };

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
    private thingsService: ThingsService,
  ) { }

  addConfig(gw: Gateway) {
    // Boostrap
    const config: Config = {
      thing_id: gw.id,
      thing_key: gw.key,
      channels: [gw.metadata.ctrlChannelID, gw.metadata.dataChannelID],
      external_id: gw.metadata.mac,
      external_key: gw.metadata.gwPassword,
      content: JSON.stringify(this.content),
      state: 0,
    };

    return this.http.post(environment.configUrl, config, { observe: 'response' })
      .map(
        resp => {
          const cfgID: string = resp.headers.get('location').replace('/things/configs/', '');
          gw.metadata.cfgID = cfgID;
          this.thingsService.editThing(gw).subscribe(
            respEdit => {
              this.notificationsService.success('Gateway successfully bootstrapped', '');
            },
            errEdit => {
              this.notificationsService.error(
                'Failed to add config ID to GW metadata',
                `Error: ${errEdit.status} - ${errEdit.statusText}`);
            },
          );
        },
        err => {
          this.notificationsService.error(
            'Failed to add bootstrap config to gateway',
            `Error: ${err.status} - ${err.statusText}`);
        },
      );
  }

  getConfig(gateway: Gateway) {
    const headers = new HttpHeaders({
      'Authorization': gateway.metadata.gwPassword,
    });

    return this.http.get(`${environment.bootstrapUrl}/${gateway.metadata.mac}`, { headers: headers });
  }

  updateConfig(configUpdate: ConfigUpdate, gateway: Gateway) {
    return this.http.put(`${environment.configUrl}/${gateway.id}`, configUpdate, { observe: 'response' });
  }
}
