import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { Gateway } from 'app/common/interfaces/gateway.interface';
import { Config, ConfigContent, ConfigUpdate } from 'app/common/interfaces/bootstrap.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ThingsService } from 'app/common/services/things/things.service';

@Injectable()
export class BootstrapService {
  content: ConfigContent = {
    'log_level': 'debug',
    'http_port': '9000',
    'mqtt_url': 'localhost:1883',
    'edgex_url': 'http://localhost:48090/api/v1/',
    'nats_url': 'localhost:4222',
    'export_config': {
      'exp': {
        'log_level': 'debug',
        'nats': 'nats://localhost:4222',
        'port': '8170',
      },
      'mqtt': {
        'ca_path': 'ca.crt',
        'cert_path': 'thing.crt',
        'channel': '35860baf-6660-4f47-a5c5-8eb1bd176175',
        'host': 'tcp://localhost:1883',
        'mtls': false,
        'password': 'e9c03586-7422-4772-8631-9e0d3f152ca1',
        'priv_key_path': 'thing.key',
        'qos': 0,
        'retain': false,
        'skip_tls_ver': false,
        'username': 'b9688074-9bc1-4736-8132-7fd45a0736ef',
      },
      'routes': [
        {
          'mqtt_topic': 'channels/35860baf-6660-4f47-a5c5-8eb1bd176175/messages',
          'nats_topic': 'adc.samples',
          'subtopic': '',
          'type': 'plain',
        },
        {
          'mqtt_topic': 'channels/35860baf-6660-4f47-a5c5-8eb1bd176175/messages',
          'nats_topic': 'telegraf',
          'subtopic': '',
          'type': 'plain',
        },
      ],
    },
  };

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
    private thingsService: ThingsService,
  ) { }

  addConfig(gw: Gateway) {
    // Boostrap
    this.content.export_config.mqtt.channel = gw.metadata.exportChannelID;
    this.content.export_config.mqtt.username = gw.id;
    this.content.export_config.routes[0].mqtt_topic = 'channels/' + gw.metadata.exportChannelID + '/messages';
    this.content.export_config.routes[1].mqtt_topic = 'channels/' + gw.metadata.exportChannelID + '/messages';
    this.content.export_config.mqtt.password = gw.key;

    const config: Config = {
      thing_id: gw.id,
      thing_key: gw.key,
      channels: [gw.metadata.ctrlChannelID, gw.metadata.dataChannelID],
      external_id: gw.metadata.mac,
      external_key: gw.metadata.gwPassword,
      content: JSON.stringify(this.content),
      state: 0,
    };

    return this.http.post(environment.bootstrapConfigsUrl, config, { observe: 'response' })
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
    return this.http.put(`${environment.bootstrapConfigsUrl}/${gateway.id}`, configUpdate, { observe: 'response' });
  }
}
