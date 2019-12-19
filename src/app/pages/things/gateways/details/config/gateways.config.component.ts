import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Gateway } from 'app/common/interfaces/gateway.interface';
import { Config, ConfigContent, ConfigUpdate } from 'app/common/interfaces/bootstrap.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

import { BootstrapService } from 'app/common/services/bootstrap/bootstrap.service';

@Component({
  selector: 'ngx-gateways-config',
  templateUrl: './gateways.config.component.html',
  styleUrls: ['./gateways.config.component.scss'],
})
export class GatewaysConfigComponent implements OnInit, OnChanges {
  @Input() gateway: Gateway;

  content: ConfigContent = {
    log_level: '',
    http_port: '',
    mqtt_url: '',
    edgex_url: '',
  };

  constructor(
    private bootstrapService: BootstrapService,
    private notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.gateway.metadata.gwPassword) {
      return;
    }

    this.bootstrapService.getConfig(this.gateway).subscribe(
      resp => {
        const cfg = <Config>resp;
        const content = JSON.parse(cfg.content);

        this.content = {
          log_level: content.log_level,
          http_port: content.http_port,
          mqtt_url: content.mqtt_url,
          edgex_url: content.edgex_url,
        };
      },
      err => {
        this.notificationsService.error(
          'Failed to get bootstrap configuration',
          `Error: ${err.status} - ${err.statusText}`);
      },
    );
  }

  submit() {
    const configUpdate: ConfigUpdate = {
      content: JSON.stringify(this.content),
      name: this.gateway.name,
    };

    this.bootstrapService.updateConfig(configUpdate, this.gateway).subscribe(
      resp => {
        this.notificationsService.success('Bootstrap configuration updated', '');
      },
      err => {
        this.notificationsService.error(
          'Failed to update bootstrap configuration',
          `Error: ${err.status} - ${err.statusText}`);
      },
    );
  }
}
