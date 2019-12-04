import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Gateway } from 'app/common/interfaces/gateway.interface';

import { MqttManagerService } from 'app/common/services/mqtt/mqtt.manager.service';

@Component({
  selector: 'ngx-details-component',
  templateUrl: './gateways.details.component.html',
  styleUrls: ['./gateways.details.component.scss'],
})
export class GatewaysDetailsComponent implements OnInit, OnDestroy {
  gateway: Gateway = {
    name: '',
    metadata: {},
  };

  constructor(
    private route: ActivatedRoute,
    private gatewaysService: GatewaysService,
    private notificationsService: NotificationsService,
    private mqttManagerService: MqttManagerService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.gatewaysService.getGateway(id).subscribe(
      gw => {
        this.gateway = <Gateway>gw;
        this.mqttManagerService.init(
          this.gateway.id,
          this.gateway.key,
          this.gateway.metadata.ctrlChannelID,
        );
      },
      err => {
        this.notificationsService.error('Failed to fetch gateway',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  ngOnDestroy() {
    this.mqttManagerService.disconnect();
  }
}
