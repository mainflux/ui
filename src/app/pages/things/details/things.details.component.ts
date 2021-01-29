import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-things-details-component',
  templateUrl: './things.details.component.html',
  styleUrls: ['./things.details.component.scss'],
})
export class ThingsDetailsComponent implements OnInit {
  experimental: Boolean = environment.experimental;

  thing: Thing = {};

  connectedChans: Channel[] = [];
  disconnectedChans: Channel[] = [];

  selectedChannels = [];
  editorMetadata = '';

  httpMsg = {
    name: '',
    value: '',
    chanID: '',
    subtopic: '',
    time: '',
  };

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

  onDisconnect(chanID: any) {
    this.channelsService.disconnectThing(chanID, this.thing.id).subscribe(
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

  findConnectedChans() {
    this.thingsService.connectedChannels(this.thing.id).subscribe(
      (respConns: any) => {
        this.connectedChans = respConns.channels;
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
