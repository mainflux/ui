import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel } from 'app/common/interfaces/mainflux.interface';


@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
})
export class ChannelsDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  channel: Channel = {};

  connections = [];
  things = [];

  selectedThings = [];
  editorMetadata = '';

  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.channelsService.getChannel(id).subscribe(
      resp => {
        this.channel = <Channel>resp;

        this.findDisconnectedThings();
      },
    );
  }

  onEdit() {
    try {
      this.channel.metadata = JSON.parse(this.editorMetadata);
    } catch (e) {
      this.notificationsService.error('Wrong metadata format', '');
      return;
    }

    this.channelsService.editChannel(this.channel).subscribe(
      resp => {
        this.notificationsService.success('Channel metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedThings.length > 0) {
      this.channelsService.connectThings([this.channel.id], this.selectedThings).subscribe(
        resp => {
          this.notificationsService.success('Device(s) successfully connected', '');
          this.selectedThings = [];
          this.findDisconnectedThings();
        },
      );
    } else {
      this.notificationsService.warn('Device(s) must be provided', '');
    }
  }

  onDisconnect(thingID: any) {
    this.channelsService.disconnectThing(this.channel.id, thingID).subscribe(
      resp => {
        this.notificationsService.success('Device successfully disconnected', '');
        this.things.push(this.connections.find(c => c.id === thingID));
        this.connections = this.connections.filter(c => c.id !== thingID);
      },
    );
  }

  findDisconnectedThings() {
    this.things = [];

    this.channelsService.connectedThings(this.channel.id).subscribe(
      (respConns: any) => {
        this.connections = respConns.things;
        this.thingsService.getThings(this.offset, this.limit).subscribe(
          (respThings: any) => {
            respThings.things.forEach(thing => {
              if (!(this.connections.filter(c => c.id === thing.id).length > 0)) {
                this.things.push(thing);
              }
            });
          },
        );
      },
    );
  }
}
