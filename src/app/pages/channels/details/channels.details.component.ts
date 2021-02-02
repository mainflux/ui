import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing, TablePage } from 'app/common/interfaces/mainflux.interface';


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

  tablePage: TablePage = {};

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

  onDisconnect(row: any) {
    this.channelsService.disconnectThing(this.channel.id, row.id).subscribe(
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

  findConnectedThings(offset?: number, limit?: number) {
    this.channelsService.connectedThings(this.channel.id, offset, limit).subscribe(
      (resp: any) => {
        this.connectedThings = resp.things;
        this.tablePage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.things,
        };
        if (this.connectedThings.length > 0) {
          this.thingKey = this.connectedThings[0].key;
        }
      },
    );
  }

  onChangePage(dir: any) {
    if (dir === 'prev') {
      const offset = this.tablePage.offset - this.tablePage.limit;
      this.findConnectedThings(offset, this.tablePage.limit);
    }
    if (dir === 'next') {
      const offset = this.tablePage.offset + this.tablePage.limit;
      this.findConnectedThings(offset, this.tablePage.limit);
    }
  }

  findDisconnectedThings() {
    this.channelsService.disconnectedThings(this.channel.id).subscribe(
      (respDisconns: any) => {
        this.disconnectedThings = respDisconns.things;
      },
    );
  }
}
