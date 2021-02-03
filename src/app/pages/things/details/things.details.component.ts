import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing, TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-things-details-component',
  templateUrl: './things.details.component.html',
  styleUrls: ['./things.details.component.scss'],
})
export class ThingsDetailsComponent implements OnInit {
  experimental: Boolean = environment.experimental;

  thing: Thing = {};

  tableConfig: TableConfig = {
    colNames: ['Name', 'Channel ID'],
    keys: ['name', 'id', 'delete'],
  };
  connChansPage: TablePage = {};
  disconnectedChans: Channel[] = [];

  selectedChannels = [];
  editorMetadata = '';

  httpMsg = {
    name: '',
    value: '',
    chanID: '',
    subtopic: '',
    time: '',
    valType: 'float',
  };
  valTypes: string[] = ['float', 'bool', 'string', 'data'];

  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.thingsService.getThing(id).subscribe(
      (th: Thing) => {
        this.thing = th;
        this.updateConnections();
      },
    );
  }

  onEdit() {
    if (this.editorMetadata !== '') {
      try {
        this.thing.metadata = JSON.parse(this.editorMetadata);
      } catch (e) {
        this.notificationsService.error('Wrong metadata format', '');
        return;
      }
    }

    this.thingsService.editThing(this.thing).subscribe(
      resp => {
        this.notificationsService.success('Thing metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedChannels.length > 0) {
      this.channelsService.connectThings(this.selectedChannels, [this.thing.id]).subscribe(
        resp => {
          this.notificationsService.success('Successfully connected to Channel(s)', '');
          this.updateConnections();
        },
      );
    } else {
      this.notificationsService.warn('Channel(s) must be provided', '');
    }
  }

  onDisconnect(row: any) {
    this.channelsService.disconnectThing(row.id, this.thing.id).subscribe(
      resp => {
        this.notificationsService.success('Successfully disconnected from Channel', '');
        this.updateConnections();
      },
    );
  }

  updateConnections() {
    this.selectedChannels = [];
    this.findConnectedChans();
    this.findDisconnectedChans();
  }

  findConnectedChans(offset?: number, limit?: number) {
    this.thingsService.connectedChannels(this.thing.id, offset, limit).subscribe(
      (resp: any) => {
        this.connChansPage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.channels,
        };
      },
    );
  }

  findDisconnectedChans() {
    this.thingsService.disconnectedChannels(this.thing.id).subscribe(
      (respDisconn: any) => {
        this.disconnectedChans = respDisconn.channels;
      },
    );
  }

  onChangeLimit(lim: number) {
    this.findConnectedChans(0, lim);
  }

  onChangePage(dir: any) {
    if (dir === 'prev') {
      const offset = this.connChansPage.offset - this.connChansPage.limit;
      this.findConnectedChans(offset, this.connChansPage.limit);
    }
    if (dir === 'next') {
      const offset = this.connChansPage.offset + this.connChansPage.limit;
      this.findConnectedChans(offset, this.connChansPage.limit);
    }
  }

  onSendMessage() {
    if (this.httpMsg.chanID === '' ||
      this.httpMsg.name === '' || this.httpMsg.value === '') {
      this.notificationsService.warn('Channel, Name and Value must be provided', '');
      return;
    }

    const time = this.httpMsg.time ? `"t": ${this.httpMsg.time},` : '';
    const msg = `[{${time} "n":"${this.httpMsg.name}", "v": ${this.httpMsg.value}}]`;

    this.messagesService.sendMessage(this.httpMsg.chanID, this.thing.key, msg, this.httpMsg.subtopic).subscribe(
      resp => {
        this.notificationsService.success('Message succefully sent', '');
      },
    );
  }
}
