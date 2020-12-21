import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, MainfluxMsg, Thing } from 'app/common/interfaces/mainflux.interface';
import { IntervalService } from 'app/common/services/interval/interval.service';

@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
  providers: [IntervalService],
})
export class ChannelsDetailsComponent implements OnInit, OnDestroy {
  experimental: Boolean = environment.experimental;

  offset = 0;
  limit = 20;

  channel: Channel = {};

  connectedThings: Thing[] = [];
  disconnectedThings: Thing[] = [];
  messages: MainfluxMsg[] = [];

  selectedThings: string[] = [];
  editorMetadata = '';

  constructor(
    private route: ActivatedRoute,
    private intervalService: IntervalService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
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

    this.intervalService.set(this, this.getChannelMessages);
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
        this.getChannelMessages();
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

  getChannelMessages() {
    if (this.connectedThings.length) {
      this.messagesService.getMessages(this.channel.id, this.connectedThings[0].key).subscribe(
        (respMsg: any) => {
          if (respMsg.messages) {
            this.messages = respMsg.messages;
          }
        },
      );
    }
  }

  ngOnDestroy(): void {
    this.intervalService.remove();
  }
}
