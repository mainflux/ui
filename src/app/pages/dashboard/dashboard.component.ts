import { Component, OnInit } from '@angular/core';
import { VersionsService } from 'app/common/services/versions/versions.service';

import { ThingsService } from 'app/common/services/things/things.service';
import { LoraService } from 'app/common/services/lora/lora.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  version: number;
  addons = [];
  thingsNumber = 0;
  gatewaysNumber = 0;
  loraDevNumber = 0;
  totalChanNumber = 0;
  options: any = {};
  gateways = [];
  offset = 0;
  limit = 20;
  messages = [];
  messages2 = [];

  constructor(
    private versionsService: VersionsService,
    private gatewaysService: GatewaysService,
    private thingsService: ThingsService,
    private loraService: LoraService,
    private channelsService: ChannelsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.thingsService.getThings(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.thingsNumber = resp.total;
      },
    );

    this.loraService.getDevices(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.loraDevNumber = resp.total;
      },
    );

    this.gatewaysService.getGateways(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.gatewaysNumber = resp.total;
        this.gateways = resp.things;
      },
    );

    this.channelsService.getChannels(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.totalChanNumber = resp.total;
      },
    );

    this.versionsService.getThingsVersion().subscribe(
      (resp: any) => {
        this.version = resp.version;
      },
    );

    for (let i = 0; i < 61; i++) {
      const vTemp = 25 + 5 * Math.random();
      const vHum = 45 + 20 * Math.random();
      this.messages.push({time: i, value: vTemp, name: 'temmperature'});
      this.messages2.push({time: i, value: vHum, name: 'humidity'});
    }
  }

  toThingsList() {
    this.router.navigate(['/pages/things/devices']);
  }

  toLoraList() {
    this.router.navigate(['/pages/lora/devices']);
  }

  toGWList() {
    this.router.navigate(['/pages/gateways']);
  }

}
