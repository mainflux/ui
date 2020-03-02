import { Component, OnInit } from '@angular/core';
import { VersionsService } from 'app/common/services/versions/versions.service';

import { UsersService } from 'app/common/services/users/users.service';
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

  thingsNum = 0;
  gatewaysNumber = 0;
  loraDevNumber = 0;
  chansNum = 0;
  gateways = [];
  messages = [];
  messages2 = [];

  constructor(
    private versionsService: VersionsService,
    private gatewaysService: GatewaysService,
    private thingsService: ThingsService,
    private loraService: LoraService,
    private channelsService: ChannelsService,
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    // If Token is valid
    this.usersService.getUser().subscribe(
      respUser => {
        this.thingsService.getThings().subscribe(
          (resp: any) => {
            this.thingsNum = resp.total;
          },
        );

        this.loraService.getDevices().subscribe(
          (resp: any) => {
            this.loraDevNumber = resp.total;
          },
        );

        this.gatewaysService.getGateways().subscribe(
          (resp: any) => {
            this.gatewaysNumber = resp.total;
            this.gateways = resp.things;
          },
        );

        this.channelsService.getChannels().subscribe(
          (resp: any) => {
            this.chansNum = resp.total;
          },
        );

        this.versionsService.getUsersVersion().subscribe(
          (resp: any) => {
            this.version = resp.version;
          },
        );

        for (let i = 0; i < 61; i++) {
          const vGas = 125 + 5 * Math.random();
          const vPress = 1 + 0.1 * Math.random();
          const vTemp = 25 + 1 * Math.random();
          const vHum = 45 + 20 * Math.random();
          this.messages.push({time: i, value: vTemp, publisher: 'mock', name: 'temperature'});
          this.messages.push({time: i, value: vHum, publisher: 'mock2', name: 'humidity'});
          this.messages.push({time: i, value: vPress, publisher: 'mock3', name: 'pressure'});
          this.messages.push({time: i, value: vGas, publisher: 'mock4', name: 'gas'});
        }
      },
    );
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
