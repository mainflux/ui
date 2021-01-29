import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
})
export class ChannelsDetailsComponent implements OnInit {
  experimental: Boolean = environment.experimental;

  channel: Channel = {};
  thingKey = '';

  connectedThings: Thing[] = [];
  disconnectedThings: Thing[] = [];

  selectedThings: string[] = [];
  editorMetadata = '';

  constructor(
    private route: ActivatedRoute,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const chanID = this.route.snapshot.paramMap.get('id');

    this.channelsService.getChannel(chanID).subscribe(
      (ch: Channel) => {
        this.channel = ch;
        this.updateConnections();
      },
    );
  }

  onEdit() {
    if (this.editorMetadata !== '') {
      try {
        this.channel.metadata = JSON.parse(this.editorMetadata);
      } catch (e) {
        this.notificationsService.error('Wrong metadata format', '');
        return;
      }
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
          this.updateConnections();
          this.notificationsService.success('Thing(s) successfully connected', '');
        },
      );
    } else {
      this.notificationsService.warn('Thing(s) must be provided', '');
    }
  }

  onDisconnect(thingID: any) {
    this.channelsService.disconnectThing(this.channel.id, thingID).subscribe(
      resp => {
        this.updateConnections();
        this.notificationsService.success('Thing successfully disconnected', '');
      },
    );
  }

  updateConnections() {
    this.selectedThings = [];
    this.findConnectedThings();
    this.findDisconnectedThings();
  }

  findConnectedThings() {
    this.channelsService.connectedThings(this.channel.id).subscribe(
      (resp: any) => {
        this.connectedThings = resp.things;
        if (this.connectedThings.length > 0) {
          this.thingKey = this.connectedThings[0].key;
        }
      },
    );
  }

  findDisconnectedThings() {
    this.channelsService.disconnectedThings(this.channel.id).subscribe(
      (respDisconns: any) => {
        this.disconnectedThings = respDisconns.things;
      },
    );
  }
}
