import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Thing, TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-things-details-component',
  templateUrl: './things.details.component.html',
  styleUrls: ['./things.details.component.scss'],
})
export class ThingsDetailsComponent implements OnInit {
  thing: Thing = {};

  tableConfig: TableConfig = {
    colNames: ['Name', 'Channel ID'],
    keys: ['name', 'id', 'checkbox'],
  };

  connChansPage: TablePage = {};
  disconnChansPage: TablePage = {};

  chansToConnect: string[] = [];
  chansToDisconnect: string[] = [];

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
    if (this.chansToConnect.length > 0) {
      this.channelsService.connectThings(this.chansToConnect, [this.thing.id]).subscribe(
        resp => {
          this.notificationsService.success('Channel(s) successfully connected to Thing', '');
          this.updateConnections();
        },
      );
    } else {
      this.notificationsService.warn('Channel(s) must be provided', '');
    }
  }

  onDisconnect() {
    this.channelsService.disconnectThings(this.chansToDisconnect, [this.thing.id]).subscribe(
      resp => {
        this.notificationsService.success('Channel(s) successfully disconnected from Thing', '');
        this.updateConnections();
      },
    );
  }

  updateConnections() {
    this.chansToConnect = [];
    this.chansToDisconnect = [];
    this.findConnectedChans();
    this.findDisconnectedChans();
  }

  findConnectedChans(offset?: number, limit?: number) {
    this.connChansPage = {};

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

  findDisconnectedChans(offset?: number, limit?: number) {
    this.disconnChansPage = {};

    this.thingsService.disconnectedChannels(this.thing.id, offset, limit).subscribe(
      (resp: any) => {
        this.disconnChansPage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.channels,
        };
      },
    );
  }

  onChangeLimit(limit: number) {
    this.connChansPage.offset = 0;
    this.connChansPage.limit = limit;
    this.findConnectedChans();
  }

  onChangePage(offset: number) {
    this.connChansPage.offset = offset;
    this.findConnectedChans();
  }

  onChangeLimitDisconn(limit: number) {
    this.disconnChansPage.offset = 0;
    this.disconnChansPage.limit = limit;
    this.findDisconnectedChans();
  }

  onChangePageDisconn(offset: any) {
    this.disconnChansPage.offset = offset;
    this.findDisconnectedChans();
  }

  onCheckboxConns(rows: string[]) {
    this.chansToConnect = rows;
  }

  onCheckboxDisconns(rows: string[]) {
    this.chansToDisconnect = rows;
  }

  onSendMessage() {
    if (this.httpMsg.chanID === '' ||
      this.httpMsg.name === '' || this.httpMsg.value === '') {
      this.notificationsService.warn('Channel, Name and Value must be provided', '');
      return;
    }

    const time = this.httpMsg.time ? `"t": ${this.httpMsg.time},` : '';
    let msg: string = '';
    switch (this.httpMsg.valType) {
      case 'string':
        msg = `[{${time} "n":"${this.httpMsg.name}", "vs": "${this.httpMsg.value}"}]`;
        break;
      case 'data':
        msg = `[{${time} "n":"${this.httpMsg.name}", "vd": "${this.httpMsg.value}"}]`;
        break;
      case 'bool':
        msg = `[{${time} "n":"${this.httpMsg.name}", "vb": ${this.httpMsg.value}}]`;
        break;
      case 'float':
      default:
        msg = `[{${time} "n":"${this.httpMsg.name}", "v": ${this.httpMsg.value}}]`;
        break;
    }


    this.messagesService.sendMessage(this.httpMsg.chanID, this.thing.key, msg, this.httpMsg.subtopic).subscribe(
      resp => {
        this.notificationsService.success('Message succefully sent', '');
      },
    );
  }
}
