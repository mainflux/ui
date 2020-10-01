import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Thing, MainfluxMsg } from 'app/common/interfaces/mainflux.interface';


@Component({
  selector: 'ngx-devices-details-component',
  templateUrl: './devices.details.component.html',
  styleUrls: ['./devices.details.component.scss'],
})
export class DevicesDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  thing: Thing = {};

  connections = [];
  channels = [];
  messages: MainfluxMsg[] = [];

  selectedChannels = [];
  editorMetadata = '';

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
      resp => {
        this.thing = <Thing>resp;

        this.findDisconnectedChans();
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
        this.notificationsService.success('Device metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedChannels.length > 0) {
      this.channelsService.connectThings(this.selectedChannels, [this.thing.id]).subscribe(
        resp => {
          this.notificationsService.success('Successfully connected to Channel(s)', '');
          this.selectedChannels = [];
          this.findDisconnectedChans();
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
        this.channels.push(this.connections.find(c => c.id === chanID));
        this.connections = this.connections.filter(c => c.id !== chanID);
      },
    );
  }

  getChannelMessages() {
    this.connections.forEach(chan => {
      this.messagesService.getMessages(chan.id, this.thing.key, this.thing.id).subscribe(
        (respMsg: any) => {
          this.messages = respMsg.messages || this.messages;
        },
      );
    });
  }

  findDisconnectedChans() {
    this.messages = [];

    this.thingsService.connectedChannels(this.thing.id).subscribe(
      (respConns: any) => {
        this.connections = respConns.channels;

        this.getChannelMessages();
      },
    );

    this.thingsService.disconnectedChannels(this.thing.id).subscribe(
      (respDisconn: any) => {
        this.channels = respDisconn.channels;
      },
    );
  }
}
