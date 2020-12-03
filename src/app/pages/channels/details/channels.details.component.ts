import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, MainfluxMsg } from 'app/common/interfaces/mainflux.interface';


@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
})
export class ChannelsDetailsComponent implements OnInit {
  experimental: Boolean = environment.experimental;

  offset = 0;
  limit = 20;

  channel: Channel = {};

  connections = [];
  things = [];
  messages: MainfluxMsg[] = [];

  selectedThings = [];
  editorMetadata = '';

  constructor(
    private route: ActivatedRoute,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const chanID = this.route.snapshot.paramMap.get('id');

    this.channelsService.getChannel(chanID).subscribe(
      resp => {
        this.channel = <Channel>resp;

        this.findDisconnectedThings();
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
          this.notificationsService.success('Thing(s) successfully connected', '');
          this.selectedThings = [];
          this.findDisconnectedThings();
        },
      );
    } else {
      this.notificationsService.warn('Thing(s) must be provided', '');
    }
  }

  onDisconnect(thingID: any) {
    this.channelsService.disconnectThing(this.channel.id, thingID).subscribe(
      resp => {
        this.notificationsService.success('Thing successfully disconnected', '');
        this.things.push(this.connections.find(c => c.id === thingID));
        this.connections = this.connections.filter(c => c.id !== thingID);
      },
    );
  }

  findDisconnectedThings() {
    this.channelsService.connectedThings(this.channel.id).subscribe(
      (respConns: any) => {
        this.connections = respConns.things;

        this.getChannelMessages();
      },
    );

    this.channelsService.disconnectedThings(this.channel.id).subscribe(
      (respDisconns: any) => {
        this.things = respDisconns.things;
      },
    );
  }

  getChannelMessages() {
    if (this.connections.length) {
      this.messagesService.getMessages(this.channel.id, this.connections[0].key).subscribe(
        (respMsg: any) => {
          if (respMsg.messages) {
            this.messages = respMsg.messages;
          }
        },
      );
    }
  }
}
