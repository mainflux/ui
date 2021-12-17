import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing, TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
})
export class ChannelsDetailsComponent implements OnInit {
  channel: Channel = {};
  thingKey = '';

  tableConfig: TableConfig = {
    colNames: ['Name', 'Thing ID', 'checkbox'],
    keys: ['name', 'id', 'checkbox'],
  };

  connThingsPage: TablePage = {};
  disconnThingsPage: TablePage = {};

  thingsToConnect: string[] = [];
  thingsToDisconnect: string[] = [];

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  constructor(
    private route: ActivatedRoute,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
  }

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
    try {
      this.channel.metadata = this.editor.get();
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
    if (this.thingsToConnect.length > 0) {
      this.channelsService.connectThings([this.channel.id], this.thingsToConnect).subscribe(
        resp => {
          this.updateConnections();
          this.notificationsService.success('Thing(s) successfully connected to Channel', '');
        },
      );
    } else {
      this.notificationsService.warn('Thing(s) must be provided', '');
    }
  }

  onDisconnect() {
    this.channelsService.disconnectThings([this.channel.id], this.thingsToDisconnect).subscribe(
      resp => {
        this.updateConnections();
        this.notificationsService.success('Thing(s) successfully disconnected from Channel', '');
      },
    );
  }

  updateConnections() {
    this.thingsToConnect = [];
    this.thingsToDisconnect = [];
    this.findConnectedThings();
    this.findDisconnectedThings();
  }

  findConnectedThings(offset?: number, limit?: number) {
    this.connThingsPage = {};

    this.channelsService.connectedThings(this.channel.id, offset, limit).subscribe(
      (resp: any) => {
        this.connThingsPage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.things,
        };
        if (this.connThingsPage.rows.length > 0) {
          const thing: Thing = this.connThingsPage.rows[0];
          this.thingKey = thing.key;
        }
      },
    );
  }

  findDisconnectedThings(offset?: number, limit?: number) {
    this.disconnThingsPage = {};

    this.channelsService.disconnectedThings(this.channel.id, offset, limit).subscribe(
      (resp: any) => {
        this.disconnThingsPage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.things,
        };
      },
    );
  }

  onChangeLimit(limit: number) {
    this.findConnectedThings(0, limit);
  }

  onChangeLimitDisconn(limit: number) {
    this.findDisconnectedThings(0, limit);
  }

  onChangePage(offset: number) {
    this.findConnectedThings(offset, this.connThingsPage.limit);
  }

  onChangePageDisconn(offset: number) {
    this.findDisconnectedThings(offset, this.disconnThingsPage.limit);
  }

  onCheckboxConns(rows: any) {
    this.thingsToConnect = rows;
  }

  onCheckboxDisconns(rows: any) {
    this.thingsToDisconnect = rows;
  }
}
