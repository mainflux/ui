import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { CertsService } from 'app/common/services/certs/certs.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Thing, Channel, TableConfig, TablePage, SenMLRec } from 'app/common/interfaces/mainflux.interface';
import { ThingsCertComponent } from '../cert/things.cert.component';
import { CertReq } from 'app/common/interfaces/certs.interface';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-things-details-component',
  templateUrl: './things.details.component.html',
  styleUrls: ['./things.details.component.scss'],
})
export class ThingsDetailsComponent implements OnInit {
  thing: Thing = {};
  chanID = '';
  format = 'senml';
  formats = ['senml', 'json'];

  tableConfig: TableConfig = {
    colNames: ['Name', 'Channel ID', 'checkbox'],
    keys: ['name', 'id', 'checkbox'],
  };
  serialsTableConfig: TableConfig = {
    colNames: ['', 'Serial ID'],
    keys: ['details', 'cert_serial', 'checkbox'],
  };

  connChansPage: TablePage = {};
  disconnChansPage: TablePage = {};
  certsPage: TablePage = {};

  chansToConnect: string[] = [];
  chansToDisconnect: string[] = [];

  httpMsg = {
    name: '',
    value: '',
    chanID: '',
    subtopic: '',
    time: '',
    valType: 'float',
  };
  valTypes: string[] = ['float', 'bool', 'string', 'data'];

  hoursValid = '';

  messages = [];

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private dialogService: NbDialogService,
    private certsService: CertsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.thingsService.getThing(id).subscribe(
      (th: Thing) => {
        this.thing = th;
        this.updateConnections();
        this.getCertsSerials();
      },
    );
  }

  getCertsSerials() {
    this.certsService.listCertsSerials(this.thing.id).subscribe(
      (resp: any) => {
        this.certsPage.offset = resp.offset;
        this.certsPage.limit = resp.limit;
        this.certsPage.total = resp.total;
        this.certsPage.rows = resp.certs;
      },
    );
  }

  onEdit() {
    try {
      this.thing.metadata = this.editor.get();
    } catch (e) {
      this.notificationsService.error('Wrong metadata format', '');
      return;
    }

    this.thingsService.editThing(this.thing).subscribe(
      resp => {
        this.notificationsService.success('Thing metadata successfully edited', '');
      },
    );
  }

  onIssueCert() {
    const cert: CertReq = {
      thing_id: this.thing.id,
      key_bits: 2048,
      key_type: 'rsa',
      ttl:    '100h',
    };

    this.certsService.issueCert(cert).subscribe(
      (resp: any) => {
        const ctx = {
          context: {
            certRes: resp,
          },
        };
        this.dialogService.open(ThingsCertComponent, ctx)
          .onClose.subscribe(
            confirm => {
            },
        );

        this.getCertsSerials();
      },
    );
  }

  onViewCert(row: any) {
    this.certsService.viewCert(row.cert_serial).subscribe(
      (resp: any) => {
        const ctx = {
          context: {
            certRes: resp,
          },
        };
        this.dialogService.open(ThingsCertComponent, ctx)
          .onClose.subscribe(
            confirm => {
            },
        );
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

  findConnectedChans() {
    this.thingsService.connectedChannels(this.thing.id, this.connChansPage.offset,
      this.connChansPage.limit).subscribe(
      (resp: any) => {
        this.connChansPage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.channels,
        };

        this.getChannelMessages();
      },
    );
  }

  getChannelMessages() {
    if (this.chanID === '' && this.connChansPage.rows.length > 0) {
      const chan: Channel = this.connChansPage.rows[0];
      this.chanID = chan.id;
    }
    if (this.chanID !== '') {
      const filters = {
        publisher: this.thing.id,
        format: this.format === 'senml' ? 'messages' : this.format,
      };
      this.messagesService.getMessages(this.chanID, filters).subscribe(
        (resp: any) => {
          this.messages = resp.messages;
        },
      );
    }
  }

  findDisconnectedChans() {
    this.thingsService.disconnectedChannels(this.thing.id, this.disconnChansPage.offset,
      this.disconnChansPage.limit).subscribe(
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

    const msg: SenMLRec = {
      t: this.httpMsg.time ? Number(this.httpMsg.time) : null,
      n: this.httpMsg.name,
    };
    switch (this.httpMsg.valType) {
      case 'string':
        msg.vs = this.httpMsg.value;
        break;
      case 'data':
        msg.vd = this.httpMsg.value;
        break;
      case 'bool':
        msg.vb = Boolean(this.httpMsg.value);
        break;
      case 'float':
      default:
        msg.v = Number(this.httpMsg.value);
        break;
    }

    const senml = [msg];

    this.messagesService.sendSenML(this.httpMsg.chanID, this.thing.key, senml, this.httpMsg.subtopic).subscribe(
      resp => {
        this.notificationsService.success('Message succefully sent', '');
      },
    );
  }
}
