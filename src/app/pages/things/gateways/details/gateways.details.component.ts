import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Gateway } from 'app/common/interfaces/gateway.interface';


@Component({
  selector: 'ngx-details-component',
  templateUrl: './gateways.details.component.html',
  styleUrls: ['./gateways.details.component.scss'],
})
export class GatewaysDetailsComponent implements OnInit {
  gateway: Gateway = {
    name: '',
    metadata: {},
  };

  mfxAgent = false;

  constructor(
    private route: ActivatedRoute,
    private gatewaysService: GatewaysService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.gatewaysService.getGateway(id).subscribe(
      gw => {
        this.gateway = <Gateway>gw;
        
      },
      err => {
        this.notificationsService.error('Failed to fetch gateway',
          `Error: ${err.status} - ${err.statusText}`);
      },
    );
  }

  
}
